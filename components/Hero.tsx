import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  const { content } = useContent();
  const { hero } = content;

  return (
    <div className="relative overflow-hidden bg-transparent min-h-screen flex items-center justify-center">
      
      {/* Minimal Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[120px] opacity-15"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
        <div className="flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="mb-8 animate-fade-in-up">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-brand-cyan text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/10 transition-colors cursor-default">
              <Zap size={12} className="mr-2 fill-brand-cyan" />
              {hero.badge}
            </span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter mb-8">
            {hero.titleLine1}<br />
            <span className="gradient-text">{hero.titleLine2}</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-2xl text-white/85 max-w-3xl leading-relaxed mb-12 font-light">
            {hero.subtitle}
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
            <button 
              onClick={onCtaClick}
              className="group relative px-8 h-16 rounded-full bg-white text-brand-dark hover:bg-gray-100 transition-all duration-300 min-w-[260px] flex flex-col items-center justify-center"
            >
              <span className="font-bold text-base tracking-tight leading-tight">Desafiar o Status Quo</span>
              <span className="text-xs font-medium text-brand-dark/70 mt-0.5">Agende uma reunião estratégica</span>
              <div className="absolute inset-0 rounded-full ring-2 ring-white/50 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
            </button>
            
            <button 
              onClick={() => {
                  const element = document.getElementById('services-preview');
                  element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 h-16 rounded-full border border-white/10 text-white font-medium text-base hover:border-brand-pink/50 hover:text-brand-pink transition-all flex items-center gap-2 min-w-[260px] justify-center"
            >
              Explorar Soluções
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Social Proof / Footer of Hero */}
          <div className="mt-24 border-t border-white/5 pt-8 flex flex-col md:flex-row gap-8 md:gap-16 text-center md:text-left opacity-60 hover:opacity-100 transition-opacity">
             <div>
                <p className="text-2xl font-bold text-white">{hero.stat1Value}</p>
                <p className="text-xs uppercase tracking-widest text-white/70">{hero.stat1Label}</p>
             </div>
             <div>
                <p className="text-2xl font-bold text-white">{hero.stat2Value}</p>
                <p className="text-xs uppercase tracking-widest text-white/70">{hero.stat2Label}</p>
             </div>
             <div>
                <p className="text-2xl font-bold text-white">{hero.stat3Value}</p>
                <p className="text-xs uppercase tracking-widest text-white/70">{hero.stat3Label}</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;