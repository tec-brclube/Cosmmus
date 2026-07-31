import React from 'react';
import { Target, Heart, Zap, Shield } from 'lucide-react';
import marcosPhoto from '../IMAGENS/FOTO MARCOS.webp';

const About: React.FC = () => {
  return (
    <div className="bg-transparent text-white">
      
      {/* Manifesto Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
                <span className="text-brand-cyan font-bold tracking-widest uppercase text-xs mb-4 block">Nosso Manifesto</span>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 tracking-tighter">
                    Não somos consultores.<br/>
                    Somos arquitetos de <span className="text-brand-purple">legado</span>.
                </h1>
                <div className="space-y-6 text-lg text-white/85 leading-relaxed">
                    <p>
                        O mundo dos negócios está cheio de fórmulas prontas e relatórios que acumulam poeira. 
                        A COSMMUS nasceu para desafiar essa inércia.
                    </p>
                    <p>
                        Acreditamos que empresas não são apenas CNPJs; são organismos vivos com potencial infinito. 
                        Nosso propósito é desbloquear esse potencial, unindo a precisão dos números com a força 
                        das relações humanas.
                    </p>
                    <p className="text-white font-medium border-l-2 border-brand-pink pl-6 py-2 max-w-2xl">
                        "Crie o futuro com a gente" não é um slogan. É um convite para sair da zona de conforto e liderar o seu mercado.
                    </p>
                </div>
            </div>
            <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden relative hover:scale-[1.02] transition-all duration-700 ease-out shadow-2xl shadow-brand-purple/20">
                    <img 
                        src={marcosPhoto} 
                        alt="Marcos Antônio - CEO Cosmmus" 
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-8 left-8 text-left">
                        <p className="text-white font-bold text-xl">Marcos Antônio</p>
                        <p className="text-brand-cyan text-sm tracking-widest uppercase">Fundador & CEO</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Values - Clean Grid */}
      <div className="border-y border-white/5 bg-brand-navy/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                    { icon: Target, title: 'Obsessão por Resultado', desc: 'Não entregamos papel, entregamos performance mensurável.' },
                    { icon: Heart, title: 'Humanização Radical', desc: 'CPF vem antes do CNPJ. Pessoas são o motor da inovação.' },
                    { icon: Zap, title: 'Disrupção Contínua', desc: 'O que funcionou ontem é obsoleto hoje. Reinventamos sempre.' },
                    { icon: Shield, title: 'Verdade Brutal', desc: 'Transparência total. Falamos o que precisa ser dito, não o que quer ouvir.' },
                ].map((val, idx) => (
                    <div key={idx} className="group">
                        <val.icon className="text-brand-pink w-10 h-10 mb-6 opacity-80 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{val.title}</h3>
                        <p className="text-white/85 text-sm leading-relaxed">{val.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
};

export default About;