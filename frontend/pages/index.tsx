import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import DarkVeil from '@/components/DarkVeil';

export default function Welcome() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);
  }, []);

  const handleClick = async () => {
    // Set flag before navigation
    sessionStorage.setItem('fromWelcome', 'true');
    // Navigate to home page
    await router.push('/home');
  };

  return (
    <div 
      onClick={handleClick}
      className="h-screen bg-gradient-to-br from-[#2A2A5B] to-[#121235] relative cursor-pointer overflow-hidden"
    >
      {/* DarkVeil Animated Background */}
      <div className="fixed inset-0 z-0">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0.09}
          scanlineIntensity={0}
          speed={1.1}
          scanlineFrequency={0.5}
          warpAmount={0}
        />
      </div>

      {/* Grid Background Overlay */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/grid-background.jpg)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          mixBlendMode: 'screen'
        }}
      />

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3A3A6B]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2A2A5B]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A2A5B] to-[#121235] rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
            <Image 
              src="/finchatbot.jpg" 
              alt="XenorAI Logo" 
              width={120} 
              height={120}
              className="rounded-2xl relative z-10 shadow-2xl"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className={`text-center mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 animate-pulse">
            Welcome to
          </h1>
          <h2 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-shimmer">
            XenorAI
          </h2>
        </div>

        {/* Subtitle */}
        <p className={`text-xl md:text-2xl text-white/80 mb-12 text-center max-w-2xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Your Intelligent AI Assistant for Everyday Conversations
        </p>

        {/* Tap to Continue */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
            <button className="relative px-12 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white text-lg font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              Tap to Continue
              <span className="ml-2 inline-block animate-bounce">→</span>
            </button>
          </div>
        </div>

        {/* Hint Text */}
        <p className={`mt-8 text-white/40 text-sm animate-pulse transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Click anywhere to enter
        </p>
      </div>

      {/* Corner Accent */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#3A3A6B]/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#3A3A6B]/20 to-transparent pointer-events-none"></div>
    </div>
  );
}
