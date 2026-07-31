import React, { useState } from 'react';
import { Mail, ArrowRight, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const [interest, setInterest] = useState('consultoria');

  return (
    <div className="bg-transparent py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center">
          
          {/* Narrative Side */}
          <div className="text-center max-w-4xl mb-20">
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white leading-none">
              Pronto para o <br/>
              <span className="text-brand-pink">próximo nível?</span>
            </h1>
            <p className="text-white/85 text-xl mb-12 font-light leading-relaxed">
              A transformação começa com uma decisão. Se você está cansado de resultados medianos e quer escalar seu negócio com inteligência, fale conosco.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-24 border-t border-white/10 pt-12">
              <div>
                <h3 className="text-white font-bold text-lg mb-2">Contato Direto</h3>
                <div className="flex flex-col items-center">
                  <a href="mailto:contato@cosmmus.com" className="text-white/85 hover:text-brand-cyan transition-colors flex items-center gap-2">
                     contato@cosmmus.com
                  </a>
                  <a href="tel:+5562999546265" className="text-white/85 hover:text-brand-cyan transition-colors flex items-center gap-2">
                     (62) 99954-6265
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-2">Base de Operações</h3>
                <p className="text-white/85">Goiânia-GO</p>
              </div>
            </div>
          </div>

          {/* Minimal Form */}
          <div className="bg-brand-surface/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl w-full max-w-2xl">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-xs font-bold text-brand-cyan uppercase tracking-widest mb-2">Quem é você</label>
                  <input type="text" className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-pink focus:outline-none transition-colors placeholder-white/20" placeholder="Seu nome" />
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-brand-cyan uppercase tracking-widest mb-2">Sua Empresa</label>
                  <input type="text" className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-pink focus:outline-none transition-colors placeholder-white/20" placeholder="Nome do negócio" />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-brand-cyan uppercase tracking-widest mb-2">Contato</label>
                <input type="email" className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-pink focus:outline-none transition-colors placeholder-white/20" placeholder="E-mail corporativo ou telefone" />
              </div>

              <div className="group">
                <label className="block text-xs font-bold text-brand-cyan uppercase tracking-widest mb-2">O Desafio</label>
                <select 
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-pink focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option className="bg-brand-dark" value="consultoria">Quero escalar meu negócio</option>
                  <option className="bg-brand-dark" value="plano_negocios">Preciso de um Plano de Negócios</option>
                  <option className="bg-brand-dark" value="financas">Preciso organizar minhas Finanças</option>
                  <option className="bg-brand-dark" value="cooperativa">Gestão para Cooperativas</option>
                  <option className="bg-brand-dark" value="palestra">Palestras e Treinamentos</option>
                </select>
              </div>

              <button type="submit" className="w-full py-5 rounded-full bg-white text-brand-dark font-bold text-lg hover:bg-brand-cyan transition-colors flex justify-center items-center gap-3 group">
                Iniciar Conversa <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;