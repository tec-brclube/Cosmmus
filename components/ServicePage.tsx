import React, { useEffect } from 'react';
import { ArrowLeft, Box, Briefcase, Calculator, GraduationCap, Leaf, Shield, Star, TrendingUp, Users } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface ServicePageProps {
  serviceId: string;
  onBack: () => void;
}

const IconMap: Record<string, React.ElementType> = {
  'Briefcase': Briefcase,
  'Users': Users,
  'TrendingUp': TrendingUp,
  'Leaf': Leaf,
  'Calculator': Calculator,
  'GraduationCap': GraduationCap,
  'Box': Box,
  'Star': Star,
  'Shield': Shield
};

const ServicePage: React.FC<ServicePageProps> = ({ serviceId, onBack }) => {
  const { content } = useContent();
  const service = content.services.find(s => s.id === serviceId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Serviço não encontrado</h2>
          <button onClick={onBack} className="text-brand-cyan hover:underline">Voltar para serviços</button>
        </div>
      </div>
    );
  }

  const IconComponent = IconMap[service.iconName] || Box;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-white transition-colors mb-12 self-start"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para Áreas de Atuação
      </button>

      <div className="bg-brand-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl text-center flex flex-col items-center w-full">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="w-16 h-16 rounded-xl bg-brand-surface flex items-center justify-center mb-8 text-brand-cyan">
            <IconComponent strokeWidth={1.5} size={32} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {service.title}
          </h1>

          <p className="text-xl text-white/85 leading-relaxed mb-12 font-light max-w-2xl">
            {service.description}
          </p>

          {service.subServices && service.subServices.length > 0 ? (
            <div className="space-y-12 mb-12 w-full">
              {service.subServices.map((sub, idx) => (
                <div key={idx} className="bg-brand-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl text-center flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-white mb-4">{sub.title}</h3>
                  <p className="text-white/85 mb-6 max-w-xl">{sub.description}</p>
                  
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full">
                    {sub.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center justify-center text-white/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mr-3 flex-shrink-0"></span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="px-6 py-3 rounded-full border border-brand-cyan/30 text-brand-cyan font-bold text-sm hover:bg-brand-cyan hover:text-brand-surface transition-all duration-300">
                    {sub.ctaText}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-12 w-full">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                O que está incluído
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center justify-center text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mr-3 flex-shrink-0"></span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!service.subServices && (
            <div className="pt-8 border-t border-white/10 w-full">
              <button className="px-8 py-4 rounded-full bg-brand-cyan text-brand-dark font-bold hover:bg-white transition-colors text-lg">
                {service.ctaText || 'Fale com um especialista'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
