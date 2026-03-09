import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
print(f"API Key (first 10 chars): {GEMINI_API_KEY[:10] if GEMINI_API_KEY else 'None'}...")

try:
    genai.configure(api_key=GEMINI_API_KEY)
    
    # List available models
    print("\nListing available models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"  - {m.name}")
    
    print("\nTrying to generate content...")
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say hello!")
    print(f"Success! Response: {response.text}")
    
except Exception as e:
    print(f"Error: {e}")
