import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  response: string;
  success: boolean;
  error?: string;
}

export const sendMessage = async (
  message: string, 
  conversationHistory: Message[]
): Promise<ChatResponse> => {
  try {
    // Validate message length
    if (message.length > 2000) {
      return {
        response: '',
        success: false,
        error: 'Message is too long. Please keep it under 2000 characters.',
      };
    }

    const response = await axios.post<ChatResponse>(
      `${API_BASE_URL}/api/chat`, 
      {
        message,
        conversation_history: conversationHistory,
      },
      {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Network error
      if (!error.response) {
        return {
          response: '',
          success: false,
          error: 'Unable to connect to the server. Please check your internet connection and ensure the backend is running.',
        };
      }

      // Rate limit error
      if (error.response.status === 429) {
        return {
          response: '',
          success: false,
          error: 'Too many requests. Please wait a moment before trying again.',
        };
      }

      // Validation error
      if (error.response.status === 400) {
        return {
          response: '',
          success: false,
          error: error.response.data?.detail || 'Invalid request. Please check your message.',
        };
      }

      // Server error
      if (error.response.status >= 500) {
        return {
          response: '',
          success: false,
          error: 'Server error. Please try again later.',
        };
      }

      // Other API errors
      return {
        response: '',
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to send message',
      };
    }

    // Non-Axios errors
    return {
      response: '',
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
};
