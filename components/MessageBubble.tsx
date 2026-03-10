import React from 'react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 animate-fadeIn px-2 sm:px-0`}>
      <div className={`flex items-start max-w-[85%] sm:max-w-[80%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'}`}>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-to-br from-[#3A3A6B] to-[#2A2A5B]' 
              : 'bg-gradient-to-br from-[#2A2A5B] to-[#121235]'
          }`}>
            <span className="text-white font-semibold text-xs sm:text-sm">
              {isUser ? 'U' : 'AI'}
            </span>
          </div>
        </div>

        {/* Message Bubble */}
        <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-br from-[#3A3A6B] to-[#2A2A5B] text-white rounded-tr-none' 
            : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-tl-none'
        } shadow-md`}>
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
