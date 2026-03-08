import { useState } from 'react';
import Link from 'next/link';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { sendMessage } from '@/utils/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await sendMessage(message, messages);
      
      if (response.success) {
        // Add AI response to chat
        const aiMessage: Message = { role: 'assistant', content: response.response };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle error
        const errorMessage: Message = { 
          role: 'assistant', 
          content: `Error: ${response.error || 'Failed to get response from AI'}` 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      // Handle network error
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Error: Unable to connect to the server. Please make sure the backend is running.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">X</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                XenorAI
              </span>
            </Link>
            <button
              onClick={handleClearChat}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="container mx-auto px-6 py-6 h-[calc(100vh-80px)] flex flex-col">
        <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
          <ChatWindow messages={messages} isLoading={isLoading} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
