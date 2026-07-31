import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  onCtaClick: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ onCtaClick }) => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm z-0"></div>
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-8 text-white">
          Pronto para <span className="gradient-text">provocar<br />o futuro?</span>
        </h2>
        
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Não apenas desenhamos processos; forjamos legados.<br className="hidden md:block" />
          Saia da zona de sobrevivência e projete sua marca para o topo da cadeia competitiva agora.
        </p>
        
        <a 
          href="https://wa.link/d5f580"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-wider text-brand-dark bg-brand-cyan hover:bg-white transition-all duration-300 rounded-full shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] hover:-translate-y-1"
        >
          Agende uma reunião estratégica
          <ArrowRight className="ml-2 w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default CtaSection;
