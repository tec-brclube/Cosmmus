import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ViewState, NavItem } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const navItems: NavItem[] = [
  { label: 'Início', value: 'home' },
  { label: 'Sobre Nós', value: 'about' },
  { label: 'Áreas de Atuação', value: 'services' },
  { label: 'Metodologia', value: 'methodology' },
  { label: 'Cases', value: 'cases' },
  { label: 'Conteúdos', value: 'blog' },
  { label: 'Contato', value: 'contact' },
];

/** CTA destacado: leva ao formulário de caracterização organizacional (/aplicacaocosmmus). */
const ctaItem: NavItem = { label: 'Aplique-se', value: 'aplicacao' };

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (view: ViewState) => {
    onChangeView(view);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-4 cursor-pointer group" 
            onClick={() => handleNav('home')}
          >
            <div className="relative w-12 h-12 transition-transform duration-500 group-hover:rotate-180">
               <Logo className="w-full h-full" />
            </div>
            <div className="flex flex-col justify-center">
                <span className="font-black text-2xl tracking-tight text-white leading-none">COSMMUS</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/90 leading-none mt-1 ml-0.5">Business</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:block">
            <div className="ml-10 flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleNav(item.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentView === item.value
                      ? 'text-brand-dark bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => handleNav(ctaItem.value)}
                title="Formulário de caracterização organizacional"
                className={`ml-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                  currentView === ctaItem.value
                    ? 'gradient-btn text-white border-transparent shadow-[0_0_24px_rgba(217,0,255,0.4)]'
                    : 'border-brand-pink/60 text-white hover:bg-brand-pink hover:border-brand-pink'
                }`}
              >
                {ctaItem.label}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="xl:hidden bg-brand-navy border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => handleNav(ctaItem.value)}
              className={`block w-full text-left px-3 py-4 mb-2 rounded-xl text-base font-bold border transition-all duration-300 ${
                currentView === ctaItem.value
                  ? 'gradient-btn text-white border-transparent'
                  : 'border-brand-pink/60 text-white hover:bg-brand-pink'
              }`}
            >
              Aplique-se para consultoria
            </button>
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNav(item.value)}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium border-b border-white/5 last:border-0 ${
                  currentView === item.value
                    ? 'text-white bg-white/10 pl-6'
                    : 'text-white/70 hover:text-white hover:pl-4'
                } transition-all duration-300`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;