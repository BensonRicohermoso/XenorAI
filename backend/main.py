from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import openai
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="XenorAI Chatbot API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Request/Response Models
class Message(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Message]] = []

class ChatResponse(BaseModel):
    response: str
    success: bool
    error: Optional[str] = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "XenorAI Chatbot API",
        "version": "1.0.0"
    }

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint that processes user messages and returns AI responses
    
    Args:
        request: ChatRequest containing the user message and conversation history
        
    Returns:
        ChatResponse with the AI-generated response
    """
    try:
        # Validate OpenAI API key
        if not openai.api_key:
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured"
            )
        
        # Build messages array for OpenAI
        messages = [
            {
                "role": "system",
                "content": "You are XenorAI, a helpful and friendly AI assistant. Provide clear, concise, and helpful responses."
            }
        ]
        
        # Add conversation history
        for msg in request.conversation_history:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": request.message
        })
        
        # Call OpenAI API with retry logic
        max_retries = 3
        retry_delay = 1
        
        for attempt in range(max_retries):
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    max_tokens=1000,
                    temperature=0.7
                )
                
                # Extract AI response
                ai_response = response.choices[0].message.content
                break
                
            except openai.error.RateLimitError:
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                else:
                    raise  # Re-raise on last attempt
        
        return ChatResponse(
            response=ai_response,
            success=True
        )
        
    except openai.error.AuthenticationError:
        return ChatResponse(
            response="",
            success=False,
            error="Invalid OpenAI API key. Please check your configuration."
        )
    except openai.error.RateLimitError:
        return ChatResponse(
            response="",
            success=False,
            error="OpenAI rate limit exceeded. Please wait a few minutes and try again. Consider upgrading your OpenAI plan at platform.openai.com/account/billing for higher limits."
        )
    except openai.error.APIError as e:
        return ChatResponse(
            response="",
            success=False,
            error=f"OpenAI API error: {str(e)}"
        )
    except Exception as e:
        return ChatResponse(
            response="",
            success=False,
            error=f"An unexpected error occurred: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
