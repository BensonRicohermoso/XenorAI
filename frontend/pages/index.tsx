import { useState } from 'react';
import Image from 'next/image';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { sendMessage } from '@/utils/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(message, messages);
      
      if (response.success) {
        const aiMessage: Message = { role: 'assistant', content: response.response };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = { 
          role: 'assistant', 
          content: `Error: ${response.error || 'Failed to get response from AI'}` 
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
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

  const scrollToChat = () => {
    document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#2A2A5B] to-[#121235] relative overflow-y-scroll snap-y snap-mandatory">
      {/* Grid Background Overlay */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url(/grid-background.jpg)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-6 py-[10px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
            <Image 
              src="/finchatbot.jpg" 
              alt="XenorAI Logo" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold text-white">
              XenorAI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleClearChat}
              className="px-6 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              Clear Chat
            </button>
          </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Chat */}
      <section className="h-screen snap-start flex flex-col">
        <div className="flex-1 container mx-auto px-6 py-8 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl mx-auto">
            {/* Left Side - Hero Content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-6xl font-bold mb-6 text-white leading-tight">
                Your Intelligent AI Assistant
              </h1>
              <p className="text-xl text-white mb-8">
                Experience the power of conversational AI. XenorAI helps you with answers, 
                creative content, problem-solving, and much more.
              </p>
              <p className="text-lg text-white/80">
                Start chatting with our AI assistant right now →
              </p>
            </div>

            {/* Right Side - Chat Interface */}
            <div className="flex flex-col justify-center">
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden h-[600px]">
                <div className="h-full flex flex-col">
                  <ChatWindow messages={messages} isLoading={isLoading} />
                  <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="h-16 flex items-center justify-center text-center text-white snap-start">
        <p>© 2026 XenorAI. Powered by OpenAI GPT.</p>
      </footer>
      </div>
    </div>
  );
}
