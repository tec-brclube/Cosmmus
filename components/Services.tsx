import React from 'react';
import { Briefcase, Users, TrendingUp, Leaf, Calculator, GraduationCap, ArrowRight, ArrowUpRight, Box, Star, Shield, Zap, Cpu } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface ServicesProps {
  limit?: number;
  onViewAll?: () => void;
  onViewService?: (serviceId: string) => void;
}

// Icon mapper to convert string names to components
const IconMap: Record<string, React.ElementType> = {
  'Briefcase': Briefcase,
  'Users': Users,
  'TrendingUp': TrendingUp,
  'Leaf': Leaf,
  'Calculator': Calculator,
  'GraduationCap': GraduationCap,
  'Box': Box,
  'Star': Star,
  'Shield': Shield,
  'Zap': Zap,
  'Cpu': Cpu
};

const Services: React.FC<ServicesProps> = ({ limit, onViewAll, onViewService }) => {
  const { content } = useContent();
  const displayServices = limit ? content.services.slice(0, limit) : content.services;

  // Como resumo na página inicial o título é um H2; como página própria, o H1 dela
  const Title = limit ? 'h2' : 'h1';

  return (
    <section id="services-preview" className="py-32 bg-transparent relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center mb-20 gap-8">
          <div className="max-w-3xl">
            <p className="text-brand-pink font-bold tracking-widest uppercase text-xs mb-4">Nosso Arsenal</p>
            <Title className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Soluções para quem não aceita<br/> o <span className="text-brand-pink">médio</span>.
            </Title>
          </div>
          {limit && onViewAll && (
            <button 
              onClick={onViewAll}
              className="group flex items-center text-sm font-bold text-white hover:text-brand-cyan transition-colors"
            >
              Ver todo o ecossistema
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {displayServices.map((service) => {
            const IconComponent = IconMap[service.iconName] || Box;
            return (
              <div 
                key={service.id} 
                className="group relative px-6 py-6 rounded-2xl bg-brand-surface/40 backdrop-blur-xl hover:bg-brand-surface/60 transition-all duration-500 border border-white/5 hover:border-brand-purple/30 flex flex-col items-center text-center h-full shadow-2xl"
              >
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowUpRight className="text-brand-cyan w-5 h-5" />
                </div>

                <div className="w-10 h-10 rounded-lg bg-brand-surface flex items-center justify-center mb-4 text-brand-cyan group-hover:text-brand-pink group-hover:scale-110 transition-all duration-500">
                  <IconComponent size={20} strokeWidth={1.5} />
                </div>
                
                <h4 className="text-xl font-bold text-white mb-2 tracking-tight">
                  {service.title}
                </h4>
                
                <p className="text-white/85 text-sm leading-snug mb-4">
                  {service.description}
                </p>
                
                <div className="border-t border-white/5 pt-4 w-full flex-grow">
                  <ul className="space-y-2 flex flex-col items-center">
                      {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs text-white/70 group-hover:text-white/90 transition-colors text-center">
                          <span className="w-1 h-1 rounded-full bg-brand-pink mr-2 flex-shrink-0"></span>
                          {feature}
                      </li>
                      ))}
                  </ul>
                </div>
                
                {service.ctaText && (
                  <div className="mt-6 w-full pt-4 border-t border-white/5">
                    <button 
                      onClick={() => onViewService && onViewService(service.id)}
                      className="w-full py-2.5 px-6 rounded-full border border-brand-cyan/30 text-brand-cyan font-bold text-xs hover:bg-brand-cyan hover:text-brand-surface transition-all duration-300"
                    >
                      {service.ctaText}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>



      </div>
    </section>
  );
};

export default Services;