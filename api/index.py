from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import List, Optional
import os
import re
import time
from collections import defaultdict
from google import genai
from google.genai import types

# Rate limiting
rate_limit_storage = defaultdict(list)

app = FastAPI(title="XenorAI Backend")

# CORS middleware - Updated for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:300[01]",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    gemini_model = 'gemini-2.0-flash-exp'
else:
    gemini_client = None
    gemini_model = None

# Pydantic models with validation
class Message(BaseModel):
    role: str
    content: str
    
    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v not in ['user', 'assistant']:
            raise ValueError('role must be either user or assistant')
        return v
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v):
        if len(v) > 5000:
            raise ValueError('content must be less than 5000 characters')
        return v

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Message] = []
    
    @field_validator('message')
    @classmethod
    def validate_message(cls, v):
        if not v or not v.strip():
            raise ValueError('Message cannot be empty')
        if len(v) > 2000:
            raise ValueError('Message must be less than 2000 characters')
        # Prevent potential injection attempts
        dangerous_patterns = ['<script', 'javascript:', 'onerror=', 'onclick=']
        v_lower = v.lower()
        for pattern in dangerous_patterns:
            if pattern in v_lower:
                raise ValueError('Message contains potentially dangerous content')
        return v.strip()
    
    @field_validator('conversation_history')
    @classmethod
    def validate_history(cls, v):
        if len(v) > 50:
            raise ValueError('Conversation history too long')
        return v

class ChatResponse(BaseModel):
    response: str
    success: bool
    error: Optional[str] = None

# Rate limiting middleware
def check_rate_limit(client_ip: str, limit: int = 30, window: int = 60) -> bool:
    """Check if client has exceeded rate limit"""
    current_time = time.time()
    # Clean old entries
    rate_limit_storage[client_ip] = [
        timestamp for timestamp in rate_limit_storage[client_ip]
        if current_time - timestamp < window
    ]
    
    # Check limit
    if len(rate_limit_storage[client_ip]) >= limit:
        return False
    
    rate_limit_storage[client_ip].append(current_time)
    return True

# Function to get response from Gemini API
def get_gemini_response(user_message: str, conversation_history: List[Message] = None) -> str:
    """Get a response from Gemini API"""
    try:
        if not gemini_client or not gemini_model:
            return "AI service is currently unavailable. Please check configuration."
        
        # Build conversation context if history exists
        full_prompt = user_message
        if conversation_history and len(conversation_history) > 0:
            context = "\n".join([
                f"{'User' if msg.role == 'user' else 'Assistant'}: {msg.content}"
                for msg in conversation_history[-10:]  # Last 10 messages
            ])
            full_prompt = f"Previous conversation:\n{context}\n\nCurrent message: {user_message}"
        
        # Generate response using new Gemini SDK
        response = gemini_client.models.generate_content(
            model=gemini_model,
            contents=full_prompt
        )
        return response.text
        
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return f"I'm having trouble processing your request right now. Please try again."

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "XenorAI API is running",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, req: Request):
    """
    Chat endpoint that processes user messages and returns AI responses
    """
    try:
        # Rate limiting
        client_ip = req.client.host if req.client else "unknown"
        if not check_rate_limit(client_ip):
            raise HTTPException(
                status_code=429, 
                detail="Too many requests. Please wait a moment before trying again."
            )
        
        user_message = request.message  # Already validated by Pydantic
        
        # Get response from Gemini API
        bot_response = get_gemini_response(user_message, request.conversation_history)
        
        return ChatResponse(
            response=bot_response,
            success=True
        )
        
    except HTTPException as he:
        raise he
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        error_message = f"An unexpected error occurred: {str(e)}"
        print(error_message)
        return ChatResponse(
            response="I'm sorry, I encountered an error. Please try again.",
            success=False,
            error="Internal server error"
        )

@app.get("/health")
async def health_check():
    """Check API health"""
    return {
        "status": "healthy",
        "gemini_configured": gemini_client is not None
    }
