import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { ViewState, NavItem } from '../types';
import { Logo } from './Logo';
import { pathFromView, isPlainLeftClick } from '../routes';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const navItems: NavItem[] = [
  { label: 'Início', value: 'home' },
  { label: 'Sobre Nós', value: 'about' },
  { label: 'Equipe', value: 'equipe' },
  { label: 'Áreas de Atuação', value: 'services' },
  { label: 'Metodologia', value: 'methodology' },
  { label: 'Cases', value: 'cases' },
  { label: 'Conteúdos', value: 'blog' },
  { label: 'Contato', value: 'contact' },
];

/** Formulários oferecidos no menu "Aplique-se". */
interface FormItem extends NavItem {
  /** Uma linha explicando para quem serve, para a pessoa escolher sem errar. */
  description: string;
}

const formItems: FormItem[] = [
  {
    label: 'Diagnóstico Cosmmus',
    value: 'diagnostico',
    description: 'Para qualquer demanda — de uma ideia a uma reestruturação. 5 a 8 minutos.',
  },
  {
    label: 'NR-01',
    value: 'aplicacao',
    description: 'Caracterização organizacional para riscos psicossociais. 35 a 50 minutos.',
  },
];

const isFormView = (view: ViewState) => formItems.some((item) => item.value === view);

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormsOpen, setIsFormsOpen] = useState(false);
  const formsRef = useRef<HTMLDivElement>(null);

  const handleNav = (view: ViewState) => {
    onChangeView(view);
    setIsOpen(false);
    setIsFormsOpen(false);
  };

  /**
   * Itens do menu são links reais: o buscador consegue seguir o endereço e o
   * visitante consegue abrir em outra aba. No clique comum, a navegação segue
   * pela própria SPA, sem recarregar a página.
   */
  const linkProps = (view: ViewState) => ({
    href: pathFromView(view, null),
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isPlainLeftClick(event)) return;
      event.preventDefault();
      handleNav(view);
    },
  });

  // Clique fora e tecla Esc fecham a lista de formulários
  useEffect(() => {
    if (!isFormsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!formsRef.current?.contains(event.target as Node)) setIsFormsOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFormsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isFormsOpen]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">

          {/* Logo */}
          <a
            {...linkProps('home')}
            aria-label="COSMMUS Business — página inicial"
            className="flex-shrink-0 flex items-center gap-4 cursor-pointer group"
          >
            <div className="relative w-12 h-12 transition-transform duration-500 group-hover:rotate-180">
               <Logo className="w-full h-full" />
            </div>
            <div className="flex flex-col justify-center">
                <span className="font-black text-2xl tracking-tight text-white leading-none">COSMMUS</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/90 leading-none mt-1 ml-0.5">Business</span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden xl:block">
            <div className="ml-10 flex items-center space-x-2">
              {navItems.map((item) => (
                <a
                  key={item.value}
                  {...linkProps(item.value)}
                  aria-current={currentView === item.value ? 'page' : undefined}
                  className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    currentView === item.value
                      ? 'text-brand-dark bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                      : 'text-white/85 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              ))}

              {/* Aplique-se: dois formulários, escolhidos aqui */}
              <div className="relative ml-2" ref={formsRef}>
                <button
                  type="button"
                  onClick={() => setIsFormsOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={isFormsOpen}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border flex items-center gap-1.5 ${
                    isFormView(currentView)
                      ? 'gradient-btn text-white border-transparent shadow-[0_0_24px_rgba(217,0,255,0.4)]'
                      : 'border-brand-pink/60 text-white hover:bg-brand-pink hover:border-brand-pink'
                  }`}
                >
                  Aplique-se
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${isFormsOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isFormsOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-3 w-[22rem] rounded-2xl border border-white/10 bg-brand-navy shadow-2xl shadow-black/50 overflow-hidden"
                  >
                    <p className="px-5 pt-4 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                      Escolha o formulário
                    </p>
                    {formItems.map((item) => (
                      <a
                        key={item.value}
                        {...linkProps(item.value)}
                        role="menuitem"
                        aria-current={currentView === item.value ? 'page' : undefined}
                        className={`block px-5 py-4 border-t border-white/5 transition-colors ${
                          currentView === item.value ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="block text-sm font-bold text-white leading-tight">{item.label}</span>
                        <span className="block text-xs text-white/60 leading-relaxed mt-1">{item.description}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isOpen}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/85 hover:text-white hover:bg-gray-700 focus:outline-none"
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
            {/* No celular as duas opções ficam à vista: menu dentro de menu atrapalha */}
            <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Aplique-se
            </p>
            {formItems.map((item) => (
              <a
                key={item.value}
                {...linkProps(item.value)}
                className={`block w-full text-left px-4 py-4 mb-2 rounded-xl border transition-all duration-300 ${
                  currentView === item.value
                    ? 'gradient-btn text-white border-transparent'
                    : 'border-brand-pink/60 text-white hover:bg-brand-pink'
                }`}
              >
                <span className="block text-base font-bold leading-tight">{item.label}</span>
                <span className="block text-xs text-white/70 leading-relaxed mt-1">{item.description}</span>
              </a>
            ))}

            <div className="pt-2">
              {navItems.map((item) => (
                <a
                  key={item.value}
                  {...linkProps(item.value)}
                  aria-current={currentView === item.value ? 'page' : undefined}
                  className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium border-b border-white/5 last:border-0 ${
                    currentView === item.value
                      ? 'text-white bg-white/10 pl-6'
                      : 'text-white/85 hover:text-white hover:pl-4'
                  } transition-all duration-300`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
