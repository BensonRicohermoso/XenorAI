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
    const response = await axios.post<ChatResponse>(`${API_BASE_URL}/chat`, {
      message,
      conversation_history: conversationHistory,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        response: '',
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to send message',
      };
    }
    return {
      response: '',
      success: false,
      error: 'An unexpected error occurred',
    };
  }
};
