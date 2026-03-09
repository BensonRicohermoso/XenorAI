# Quick Reference

## OpenAI Setup (Keywords)

**Install**: `pip install openai`

**Environment**:

- `OPENAI_API_KEY=sk-proj-...`
- Location: `backend/.env`

**Code**:

```python
from openai import OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Hello"}]
)
```

**Models**: gpt-3.5-turbo | gpt-4 | gpt-4-turbo

**Current Model**: gemini-2.5-flash (Gemini)

**Ports**: Backend 8000/8002 | Frontend 3000

**Files Modified**:

- `main.py` - API logic
- `.env` - API keys
- `requirements.txt` - Dependencies
