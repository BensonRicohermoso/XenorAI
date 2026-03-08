import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A5B] to-[#121235]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/finchatbot.jpg" 
                alt="XenorAI Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-white">
                XenorAI
              </span>
            </Link>
            <button
              onClick={handleClearChat}
              className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="container mx-auto px-6 py-6 h-[calc(100vh-80px)] flex flex-col">
        <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
          <ChatWindow messages={messages} isLoading={isLoading} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
