import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build prompt with history
    let fullPrompt = message;
    if (conversation_history && conversation_history.length > 0) {
      const context = conversation_history
        .slice(-10)
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      fullPrompt = `Previous conversation:\n${context}\n\nCurrent message: ${message}`;
    }

    // Call Gemini API
    let botResponse: string;
    try {
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      botResponse = response.text();
    } catch (error: any) {
      console.error('Gemini API error:', error.message || error);
      // Return more specific error for debugging
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
