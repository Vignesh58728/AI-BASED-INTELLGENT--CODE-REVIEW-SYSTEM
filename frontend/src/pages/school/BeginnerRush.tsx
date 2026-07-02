import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function BeginnerRush() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse" />
        <Rocket size={120} className="text-black relative z-10 animate-bounce" />
      </div>
      
      <h1 className="text-6xl font-black text-black mb-4 tracking-tighter uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Game Coming Soon
      </h1>
      
      <p className="text-zinc-500 text-xl font-medium max-w-md mx-auto mb-12 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
        We are crafting an immersive, game-based learning experience specifically for beginners. Stay tuned for the ultimate rush!
      </p>

      <Button 
        onClick={() => navigate(-1)} 
        className="group px-8 py-6 rounded-full bg-black text-white hover:bg-zinc-800 transition-all duration-300 shadow-2xl hover:shadow-black/20 flex items-center gap-3"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-lg font-bold">Go Back</span>
      </Button>
    </div>
  );
}
