import type { NextApiRequest, NextApiResponse } from 'next';

type ChatRequest = {
  message: string;
  conversation_history: Array<{ role: string; content: string }>;
};

type ChatResponse = {
  response: string;
  success: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({
      response: '',
      success: false,
      error: 'Method not allowed',
    });
    return;
  }

  try {
    const { message, conversation_history }: ChatRequest = req.body;

    if (!message || message.trim() === '') {
      res.status(400).json({
        response: '',
        success: false,
        error: 'Message cannot be empty',
      });
      return;
    }

    // Check if Gemini API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        response: 'AI service is currently unavailable.',
        success: false,
        error: 'GEMINI_API_KEY not configured',
      });
      return;
    }

    // Build prompt with history
    let fullPrompt = message;
    if (conversation_history && conversation_history.length > 0) {
      const context = conversation_history
        .slice(-10)
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      fullPrompt = `Previous conversation:\n${context}\n\nCurrent message: ${message}`;
    }

    // Call Gemini API directly via REST
    // Using gemini-2.5-flash (latest available model as of March 2026)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt
            }
          ]
        }
      ]
    };

    let botResponse: string;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        res.status(500).json({
          response: '',
          success: false,
          error: `Gemini API error: ${errorData.error?.message || response.statusText}`,
        });
        return;
      }

      const data = await response.json();
      botResponse = data.candidates[0]?.content?.parts[0]?.text || "I'm having trouble processing your request.";
    } catch (error: any) {
      console.error('Gemini API error:', error.message || error);
      res.status(500).json({
        response: '',
        success: false,
        error: `Gemini API error: ${error.message || 'Unknown error'}`,
      });
      return;
    }

    res.status(200).json({
      response: botResponse,
      success: true,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      response: '',
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
