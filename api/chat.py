from http.server import BaseHTTPRequestHandler
import json
import os
from google import genai

# Configure Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
    model = 'gemini-2.0-flash-exp'
else:
    client = None
    model = None

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Handle CORS
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            message = data.get('message', '')
            conversation_history = data.get('conversation_history', [])
            
            if not message:
                response = {
                    'response': '',
                    'success': False,
                    'error': 'Message cannot be empty'
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return
            
            # Check if Gemini is configured
            if not client or not model:
                response = {
                    'response': 'AI service is currently unavailable.',
                    'success': False,
                    'error': 'GEMINI_API_KEY not configured'
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return
            
            # Build prompt with history
            full_prompt = message
            if conversation_history:
                context = "\n".join([
                    f"{'User' if msg.get('role') == 'user' else 'Assistant'}: {msg.get('content', '')}"
                    for msg in conversation_history[-10:]
                ])
                full_prompt = f"Previous conversation:\n{context}\n\nCurrent message: {message}"
            
            # Call Gemini API
            try:
                result = client.models.generate_content(
                    model=model,
                    contents=full_prompt
                )
                bot_response = result.text
            except Exception as e:
                print(f"Gemini API error: {e}")
                bot_response = "I'm having trouble processing your request. Please try again."
            
            response = {
                'response': bot_response,
                'success': True,
                'error': None
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            print(f"Error: {e}")
            response = {
                'response': 'An error occurred',
                'success': False,
                'error': str(e)
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def do_OPTIONS(self):
        # Handle preflight CORS
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
