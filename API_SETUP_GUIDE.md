# API Setup Guide

## Current System (Gemini API)

- **API**: Google Gemini
- **Model**: `gemini-2.5-flash`
- **Key Location**: `backend/.env`
- **Key Variable**: `GEMINI_API_KEY=your_key_here`
- **Port**: Backend on 8002, Frontend on 3000

## Switch to OpenAI

### 1. Install OpenAI SDK

```bash
cd backend
pip install openai
```

### 2. Update `backend/.env`

```env
OPENAI_API_KEY=sk-proj-your-key-here
```

### 3. Replace in `main.py`

**Remove:**

```python
import google.generativeai as genai
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.5-flash')
```

**Add:**

```python
from openai import OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
```

**Replace function:**

```python
def get_gemini_response(user_message: str, conversation_history: List[Message] = None) -> str:
    try:
        messages = []
        if conversation_history:
            for msg in conversation_history[-10:]:
                messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error: {e}")
        return "Error generating response."
```

### 4. Restart Backend

```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## Key Points

- **OpenAI Models**: gpt-3.5-turbo, gpt-4, gpt-4-turbo
- **Gemini Models**: gemini-2.5-flash, gemini-2.5-pro
- **Rate Limits**: 30 requests/minute (configured in code)
- **Message Limit**: 2000 characters
- **History**: Last 10 messages sent to API
