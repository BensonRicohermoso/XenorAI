# Backend Setup Instructions

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- OpenAI API key

## Installation Steps

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Create virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

```bash
# Copy the example file
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Edit .env and add your OpenAI API key
```

### 5. Run the server

```bash
python main.py
```

The server will start at `http://localhost:8000`

## API Endpoints

### Health Check

```
GET http://localhost:8000/
```

### Chat Endpoint

```
POST http://localhost:8000/chat
Content-Type: application/json

{
  "message": "Your message here",
  "conversation_history": []
}
```

### API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

## Testing the API

You can test the API using curl:

```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello, how are you?\",\"conversation_history\":[]}"
```

Or using Python:

```python
import requests

response = requests.post(
    "http://localhost:8000/chat",
    json={
        "message": "Hello, how are you?",
        "conversation_history": []
    }
)
print(response.json())
```

## Troubleshooting

### OpenAI API Key Issues

- Ensure your `.env` file exists and contains valid API key
- Get your API key from: https://platform.openai.com/api-keys
- Format: `OPENAI_API_KEY=sk-...`

### Port Already in Use

Change the port in `main.py` or run with:

```bash
uvicorn main:app --host 0.0.0.0 --port 8001
```

### Module Import Errors

Reinstall dependencies:

```bash
pip install --force-reinstall -r requirements.txt
```
