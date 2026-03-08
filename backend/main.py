from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error
import re

# Load environment variables
load_dotenv()

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
    'password': os.getenv('DB_PASSWORD') or 'Benson7202006.',
    'database': os.getenv('DB_NAME', 'xenorai_db')
}

# Pydantic models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Message] = []

class ChatResponse(BaseModel):
    response: str
    success: bool
    error: str = None

# Database connection function
def get_db_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Function to find matching response
def find_response(user_message: str) -> str:
    """Find a matching response from the database"""
    connection = get_db_connection()
    if not connection:
        return "I'm having trouble connecting to my knowledge base right now. Please try again later."
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get all responses from database
        cursor.execute("SELECT question_pattern, answer FROM responses ORDER BY id")
        responses = cursor.fetchall()
        
        # Normalize user message
        user_message_lower = user_message.lower().strip()
        
        # Try to find a matching pattern
        for response in responses:
            pattern = response['question_pattern']
            # Use regex to match patterns
            if re.search(pattern, user_message_lower, re.IGNORECASE):
                return response['answer']
        
        # If no match found, return default response
        return "That's interesting! I'm still learning, so I might not have a specific answer for that. Feel free to ask me something else!"
        
    except Error as e:
        print(f"Database error: {e}")
        return "I encountered an error while processing your message. Please try again."
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "message": "XenorAI Backend is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint that processes user messages and returns predefined responses
    """
    try:
        user_message = request.message.strip()
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Find matching response from database
        bot_response = find_response(user_message)
        
        return ChatResponse(
            response=bot_response,
            success=True
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        error_message = f"An unexpected error occurred: {str(e)}"
        print(error_message)
        return ChatResponse(
            response="I'm sorry, I encountered an error. Please try again.",
            success=False,
            error=error_message
        )

@app.get("/health")
async def health_check():
    """Check if database connection is working"""
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM responses")
            count = cursor.fetchone()[0]
            cursor.close()
            connection.close()
            return {
                "status": "healthy",
                "database": "connected",
                "responses_count": count
            }
        except Error as e:
            return {
                "status": "unhealthy",
                "database": "error",
                "error": str(e)
            }
    else:
        return {
            "status": "unhealthy",
            "database": "disconnected"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
