import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gradient-to-b from-transparent to-white/5">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#2A2A5B] to-[#121235] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Welcome to XenorAI</h2>
          <p className="text-white text-sm sm:text-base max-w-md mb-6 sm:mb-8">
            Start a conversation by typing your message below. I'm here to help with any questions you might have!
          </p>
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl w-full">
            <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-sm border border-white/20">
              <p className="text-xs sm:text-sm text-white">💡 Ask me questions about any topic</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-sm border border-white/20">
              <p className="text-xs sm:text-sm text-white">✍️ Get help with writing and creativity</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-sm border border-white/20">
              <p className="text-xs sm:text-sm text-white">🔍 Research and learn new things</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-sm border border-white/20">
              <p className="text-xs sm:text-sm text-white">💻 Get coding assistance and explanations</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-3 sm:mb-4 px-2 sm:px-0">
              <div className="flex items-start max-w-[85%] sm:max-w-[80%]">
                <div className="mr-2 sm:mr-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#2A2A5B] to-[#121235] flex items-center justify-center">
                    <span className="text-white font-semibold text-xs sm:text-sm">AI</span>
                  </div>
                </div>
                <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-tl-none bg-white/10 backdrop-blur-sm border border-white/20 shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-[#6A6A9B] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#4A4A7B] rounded-full animate-bounce animate-delay-150"></div>
                    <div className="w-2 h-2 bg-[#2A2A5B] rounded-full animate-bounce animate-delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
