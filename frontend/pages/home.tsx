import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { sendMessage } from '@/utils/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isFeatureVisible, setIsFeatureVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const hasChecked = useRef(false);

  // Check if user came from welcome page
  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    
    const fromWelcome = sessionStorage.getItem('fromWelcome');
    
    if (!fromWelcome) {
      // Not from welcome page, redirect
      setShouldRedirect(true);
      router.replace('/');
    } else {
      // From welcome page, clear the flag for next time
      sessionStorage.removeItem('fromWelcome');
    }
  }, [router]);

  // Don't render if redirecting
  if (shouldRedirect) {
    return null;
  }

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === heroRef.current) {
          setIsHeroVisible(entry.isIntersecting);
        }
        if (entry.target === featureRef.current) {
          setIsFeatureVisible(entry.isIntersecting);
        }
        if (entry.target === footerRef.current) {
          setIsFooterVisible(entry.isIntersecting);
        }
      });
    }, observerOptions);

    if (heroRef.current) observer.observe(heroRef.current);
    if (featureRef.current) observer.observe(featureRef.current);
    if (footerRef.current) observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

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
    <div className="h-screen bg-gradient-to-br from-[#2A2A5B] to-[#121235] relative">
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
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4">
        <div className="container mx-auto px-6">
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
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 h-full overflow-y-scroll snap-y snap-mandatory pt-20 hide-scrollbar">
      {/* Hero Section with Chat */}
      <section ref={heroRef} className="h-screen snap-start flex flex-col">
        <div className="flex-1 container mx-auto px-6 py-8 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl mx-auto">
            {/* Left Side - Hero Content */}
            <div className="flex flex-col justify-center">
              <h1 className={`text-6xl font-bold mb-6 text-white leading-tight ${isHeroVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
                Your Intelligent AI Assistant
              </h1>
              <p className={`text-xl text-white mb-8 ${isHeroVisible ? 'animate-slideInLeft animate-delay-200' : 'opacity-0'}`}>
                Experience the power of conversational AI. XenorAI helps you with answers, 
                creative content, problem-solving, and much more.
              </p>
              <p className={`text-lg text-white/80 ${isHeroVisible ? 'animate-slideInLeft animate-delay-300' : 'opacity-0'}`}>
                Start chatting with our AI assistant right now →
              </p>
            </div>

            {/* Right Side - Chat Interface */}
            <div className="flex flex-col justify-center">
              <div className={`bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden h-[600px] ${isHeroVisible ? 'animate-slideInRight animate-delay-200' : 'opacity-0'}`}>
                <div className="h-full flex flex-col">
                  <ChatWindow messages={messages} isLoading={isLoading} />
                  <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is XenorAI Section */}
      <section ref={featureRef} className="min-h-screen snap-start flex items-center py-20 bg-gradient-to-br from-[#2A2A5B]/95 to-[#121235]/95 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className={`text-5xl font-bold text-center mb-4 text-white ${isFeatureVisible ? 'animate-slideUp' : 'opacity-0'}`}>What is XenorAI?</h2>
            <p className={`text-xl text-center text-white/80 mb-16 max-w-3xl mx-auto ${isFeatureVisible ? 'animate-slideUp animate-delay-200' : 'opacity-0'}`}>
              Your intelligent companion for everyday conversations and assistance
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 - Smart Conversations */}
              <div className={`bg-[#2A2A5B] rounded-2xl p-8 hover:bg-[#3A3A6B] hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isFeatureVisible ? 'animate-scaleFadeIn animate-delay-300' : 'opacity-0'}`}>
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Smart Conversations</h3>
                <p className="text-white/90 leading-relaxed">
                  Engage in natural, friendly conversations with our AI assistant. Get instant responses to your greetings, questions, and casual chats.
                </p>
              </div>

              {/* Card 2 - Always Available */}
              <div className={`bg-[#2A2A5B] rounded-2xl p-8 hover:bg-[#3A3A6B] hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isFeatureVisible ? 'animate-scaleFadeIn animate-delay-400' : 'opacity-0'}`}>
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Always Available</h3>
                <p className="text-white/90 leading-relaxed">
                  Your AI companion is here 24/7, ready to chat whenever you need. No waiting, no delays - just instant, helpful responses.
                </p>
              </div>

              {/* Card 3 - Easy to Use */}
              <div className={`bg-[#2A2A5B] rounded-2xl p-8 hover:bg-[#3A3A6B] hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isFeatureVisible ? 'animate-scaleFadeIn animate-delay-500' : 'opacity-0'}`}>
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Easy to Use</h3>
                <p className="text-white/90 leading-relaxed">
                  Simple and intuitive interface makes chatting effortless. Just type your message and get friendly, helpful responses instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="min-h-screen snap-start bg-[#1A1A45] py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Footer Title */}
            <div className="text-center mb-16">
              <h2 className={`text-5xl font-bold text-white mb-4 ${isFooterVisible ? 'animate-slideUp' : 'opacity-0'}`}>Get In Touch</h2>
              <p className={`text-xl text-white/80 ${isFooterVisible ? 'animate-slideUp animate-delay-200' : 'opacity-0'}`}>Let's connect and collaborate</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Connect with Me */}
              <div className={`bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 ${isFooterVisible ? 'animate-slideInLeft animate-delay-300' : 'opacity-0'}`}>
                <h3 className="text-2xl font-bold text-white mb-6">Connect with Me</h3>
                <div className="space-y-4">
                  {/* GitHub */}
                  <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-white hover:text-blue-400 transition-colors group">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">GitHub</p>
                      <p className="font-medium">github.com/yourusername</p>
                    </div>
                  </a>

                  {/* LinkedIn */}
                  <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-white hover:text-blue-400 transition-colors group">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">LinkedIn</p>
                      <p className="font-medium">linkedin.com/in/yourprofile</p>
                    </div>
                  </a>

                  {/* Instagram */}
                  <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 text-white hover:text-pink-400 transition-colors group">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Instagram</p>
                      <p className="font-medium">@yourusername</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Contact Me */}
              <div className={`bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 ${isFooterVisible ? 'animate-slideInRight animate-delay-300' : 'opacity-0'}`}>
                <h3 className="text-2xl font-bold text-white mb-6">Contact Me</h3>
                <div className="space-y-4">
                  {/* Email */}
                  <a href="mailto:your.email@example.com" className="flex items-center space-x-4 text-white hover:text-blue-400 transition-colors group">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Email</p>
                      <p className="font-medium">your.email@example.com</p>
                    </div>
                  </a>

                  {/* Mobile Number */}
                  <a href="tel:+1234567890" className="flex items-center space-x-4 text-white hover:text-blue-400 transition-colors group">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-white/60">Mobile</p>
                      <p className="font-medium">+1 (234) 567-890</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/20 pt-8 text-center">
              <p className={`text-white/60 ${isFooterVisible ? 'animate-fadeIn animate-delay-500' : 'opacity-0'}`}>© 2026 XenorAI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
