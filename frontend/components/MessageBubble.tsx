import React from 'react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
      <div className={`flex items-start max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-to-br from-[#3A3A6B] to-[#2A2A5B]' 
              : 'bg-gradient-to-br from-[#2A2A5B] to-[#121235]'
          }`}>
            <span className="text-white font-semibold text-sm">
              {isUser ? 'U' : 'AI'}
            </span>
          </div>
        </div>

        {/* Message Bubble */}
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-br from-[#3A3A6B] to-[#2A2A5B] text-white rounded-tr-none' 
            : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-tl-none'
        } shadow-md`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
