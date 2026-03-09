from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error, pooling
import re
import time
from collections import defaultdict
from functools import lru_cache

# Load environment variables
load_dotenv()

# Rate limiting
rate_limit_storage = defaultdict(list)

app = FastAPI(title="XenorAI Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'xenorai_db')
}

# Validate database password is set
if not DB_CONFIG['password']:
    raise ValueError("DB_PASSWORD environment variable must be set! Create a .env file with DB_PASSWORD=your_password")

# Create connection pool
try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="xenorai_pool",
        pool_size=5,
        pool_reset_session=True,
        **DB_CONFIG
    )
except Error as e:
    print(f"Error creating connection pool: {e}")
    connection_pool = None

# Pydantic models with validation
class Message(BaseModel):
    role: str
    content: str
    
    @validator('role')
    def validate_role(cls, v):
        if v not in ['user', 'assistant']:
            raise ValueError('role must be either user or assistant')
        return v
    
    @validator('content')
    def validate_content(cls, v):
        if len(v) > 5000:
            raise ValueError('content must be less than 5000 characters')
        return v

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Message] = []
    
    @validator('message')
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
    
    @validator('conversation_history')
    def validate_history(cls, v):
        if len(v) > 50:
            raise ValueError('Conversation history too long')
        return v

class ChatResponse(BaseModel):
    response: str
    success: bool
    error: str = None

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

# Database connection function using pool
def get_db_connection():
    """Get a connection from the pool"""
    try:
        if connection_pool:
            return connection_pool.get_connection()
        else:
            # Fallback to direct connection if pool failed
            connection = mysql.connector.connect(**DB_CONFIG)
            if connection.is_connected():
                return connection
    except Error as e:
        print(f"Error getting database connection: {e}")
        return None

# Cached function to get all responses
@lru_cache(maxsize=1)
def get_cached_responses():
    """Get all responses from database with caching"""
    connection = get_db_connection()
    if not connection:
        return None
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT question_pattern, answer FROM responses ORDER BY id")
        responses = cursor.fetchall()
        return responses
    except Error as e:
        print(f"Database error: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# Function to find matching response
def find_response(user_message: str) -> str:
    """Find a matching response from the database"""
    responses = get_cached_responses()
    
    if responses is None:
        return "I'm having trouble connecting to my knowledge base right now. Please try again later."
    
    try:
        # Normalize user message
        user_message_lower = user_message.lower().strip()
        
        # Try to find a matching pattern
        for response in responses:
            pattern = response['question_pattern']
            try:
                # Validate pattern is safe before using in regex
                if len(pattern) > 500:  # Prevent ReDoS attacks
                    continue
                # Use regex to match patterns with timeout protection
                if re.search(pattern, user_message_lower, re.IGNORECASE):
                    return response['answer']
            except re.error:
                # Skip invalid regex patterns
                continue
        
        # If no match found, return default response
        return "That's interesting! I'm still learning, so I might not have a specific answer for that. Feel free to ask me something else!"
        
    except Exception as e:
        print(f"Error processing message: {e}")
        return "I encountered an error while processing your message. Please try again."

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "message": "XenorAI Backend is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, req: Request):
    """
    Chat endpoint that processes user messages and returns predefined responses
    """
    try:
        # Rate limiting
        client_ip = req.client.host
        if not check_rate_limit(client_ip):
            raise HTTPException(
                status_code=429, 
                detail="Too many requests. Please wait a moment before trying again."
            )
        
        user_message = request.message  # Already validated by Pydantic
        
        # Find matching response from database
        bot_response = find_response(user_message)
        
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
    """Check if database connection is working"""
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        if not connection:
            return {
                "status": "unhealthy",
                "database": "disconnected",
                "error": "Could not establish database connection"
            }
        
        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM responses")
        count = cursor.fetchone()[0]
        
        return {
            "status": "healthy",
            "database": "connected",
            "responses_count": count,
            "pool_active": connection_pool is not None
        }
    except Error as e:
        return {
            "status": "unhealthy",
            "database": "error",
            "error": str(e)
        }
    finally:
        # Always close resources
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
    else:
        return {
            "status": "unhealthy",
            "database": "disconnected"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
