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
  const [showChat, setShowChat] = useState(false);

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
    setShowChat(true);
    setTimeout(() => {
      document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A5B] to-[#121235]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-6 py-6">
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
            {showChat && (
              <button
                onClick={handleClearChat}
                className="px-4 py-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                Clear Chat
              </button>
            )}
            <button 
              onClick={scrollToChat}
              className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-200"
            >
              {showChat ? 'Go to Chat' : 'Get Started'}
            </button>
          </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 text-white leading-tight">
            Your Intelligent AI Assistant
          </h1>
          <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
            Experience the power of conversational AI. XenorAI helps you with answers, 
            creative content, problem-solving, and much more.
          </p>
          
          <button 
            onClick={scrollToChat}
            className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-semibold rounded-xl hover:bg-white/20 hover:border-white/40 hover:scale-105 transition-all duration-200"
          >
            Start Chatting Now →
          </button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-200 border border-white/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Lightning Fast</h3>
            <p className="text-white">
              Get instant responses powered by advanced AI technology with minimal latency.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-200 border border-white/20">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Smart & Reliable</h3>
            <p className="text-white">
              Built with GPT technology to provide accurate and helpful responses every time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-200 border border-white/20">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Natural Conversations</h3>
            <p className="text-white">
              Engage in fluid, natural conversations with context-aware responses.
            </p>
          </div>
        </div>

        {/* Chat Section */}
        {showChat && (
          <div id="chat-section" className="mt-24 max-w-6xl mx-auto animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-4">
                Start Your Conversation
              </h2>
              <p className="text-white">
                Ask me anything - I'm here to help!
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden h-[600px]">
              <div className="h-full flex flex-col">
                <ChatWindow messages={messages} isLoading={isLoading} />
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-20 text-center text-white">
        <p>© 2026 XenorAI. Powered by OpenAI GPT.</p>
      </footer>
    </div>
  );
}
