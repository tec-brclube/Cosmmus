import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarDays,
  ChartLine,
  ClipboardList,
  FileSignature,
  GraduationCap,
  Hammer,
  Handshake,
  Landmark,
  Leaf,
  Mail,
  Megaphone,
  Network,
  Phone,
  RefreshCcw,
  Search,
  Sprout,
  Target,
  TrendingUp,
} from 'lucide-react';
import { getMemberBySlug } from '../equipe/teamData';
import { isPlainLeftClick } from '../../routes';
import CoopContactForm, { CoopInterest } from './CoopContactForm';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COSMMUS COOP
 *
 * Página própria da frente de cooperativas (/cosmmus-coop). Usa a identidade
 * da Cosmmus com uma paleta própria, do verde ao roxo: o verde é a cor
 * histórica do cooperativismo, o roxo é a da Cosmmus.
 * ─────────────────────────────────────────────────────────────────────────────
 */

interface CoopPageProps {
  onViewMember: (slug: string) => void;
  onViewTeam: () => void;
}

/** Paleta da frente Coop, na ordem do degradê. */
const GREEN = '#19c46e';
const TEAL = '#10a3a3';
const BLUE = '#2f7ff0';
const VIOLET = '#9a3dff';
const GRADIENT = `linear-gradient(90deg, ${GREEN} 0%, ${TEAL} 35%, ${BLUE} 68%, ${VIOLET} 100%)`;

const CONTACT_ID = 'fale-com-a-coop';
const EDUCATION_ID = 'educacao-cooperativista';

const audiences = [
  {
    stage: 'Constituir',
    icon: Sprout,
    title: 'Grupos que querem se cooperativizar.',
    text: 'Da mobilização à assembleia de constituição, com estatuto, registro e viabilidade bem resolvidos desde o início.',
  },
  {
    stage: 'Crescer',
    icon: TrendingUp,
    title: 'Cooperativas em crescimento.',
    text: 'Quando o volume aumenta, governança, finanças e processos precisam acompanhar. Estruturamos a gestão para crescer com segurança.',
  },
  {
    stage: 'Renovar',
    icon: RefreshCcw,
    title: 'Cooperativas que precisam renovar a participação.',
    text: 'Assembleias esvaziadas, sucessão sem preparo, cooperados distantes. Reconstruímos o vínculo com o quadro social.',
  },
];

const fronts = [
  {
    icon: FileSignature,
    title: 'Constituição e formalização',
    text: 'Estudo de viabilidade, assembleia de constituição, estatuto social, regimento interno e registro na Junta Comercial e no Sistema OCB.',
  },
  {
    icon: Landmark,
    title: 'Governança cooperativa',
    text: 'Assembleia Geral, Conselho de Administração e Conselho Fiscal funcionando de verdade, com editais, atas, processo eleitoral e sucessão.',
  },
  {
    icon: Target,
    title: 'Planejamento estratégico',
    text: 'Planos de curto, médio e longo prazo construídos com o quadro social, com metas, indicadores e acompanhamento.',
  },
  {
    icon: Calculator,
    title: 'Gestão econômica e tributária',
    text: 'Ato cooperativo, sobras e perdas, Fundo de Reserva e FATES tratados com rigor, inclusive diante da reforma tributária.',
  },
  {
    icon: GraduationCap,
    title: 'Educação cooperativista',
    text: 'Formação de cooperados, conselheiros e dirigentes, com programas que podem ser custeados pelo FATES.',
  },
  {
    icon: Megaphone,
    title: 'Comunicação com o quadro social',
    text: 'Transparência, prestação de contas, identidade cooperativa e presença digital.',
  },
  {
    icon: Handshake,
    title: 'Negócios cooperativos',
    text: 'Mercado, novos produtos, canais de venda e negócios em intercooperação.',
  },
  {
    icon: Network,
    title: 'Relações institucionais',
    text: 'Articulação com o Sistema OCB, o Sescoop, federações, centrais e poder público, e projetos para editais e captação de recursos.',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidade e comunidade',
    text: 'Políticas ESG, balanço social e projetos de impacto alinhados ao sétimo princípio, o interesse pela comunidade.',
  },
];

const steps = [
  {
    icon: Search,
    title: 'Diagnóstico',
    text: 'Ouvimos dirigentes, conselheiros e cooperados e analisamos estatuto, números e processos.',
  },
  {
    icon: ClipboardList,
    title: 'Planejamento',
    text: 'Definimos prioridades, metas e indicadores, validados com os órgãos sociais.',
  },
  {
    icon: Hammer,
    title: 'Implantação',
    text: 'Trabalhamos junto com a equipe da cooperativa, com entregas concretas em cada etapa.',
  },
  {
    icon: ChartLine,
    title: 'Acompanhamento',
    text: 'Relatórios periódicos para conselhos e assembleia, com ajustes de rota quando necessário.',
  },
];

const themes = [
  'Governança, assembleias e formação de conselheiros',
  'Sobras, fundos e tributação do ato cooperativo',
  'Cultura cooperativa, liderança e sucessão',
  'Comunicação com o quadro social e inovação',
  'Sustentabilidade, intercooperação e economia solidária',
];

const principles = [
  'Adesão voluntária e livre',
  'Gestão democrática',
  'Participação econômica dos membros',
  'Autonomia e independência',
  'Educação, formação e informação',
  'Intercooperação',
  'Interesse pela comunidade',
];

const teamSkills = ['Negócios', 'Finanças', 'Comunicação', 'Cultura', 'Desenvolvimento humano'];

/* ── Peças visuais ─────────────────────────────────────────────────────────── */

/** Os três anéis da marca Cosmmus, no degradê da frente Coop. */
const CoopRings: React.FC<{ className?: string; idPrefix: string }> = ({ className, idPrefix }) => (
  <svg viewBox="0 0 672 672" className={className} aria-hidden="true">
    <defs>
      <linearGradient id={`${idPrefix}-a`} x1="0" y1="336" x2="672" y2="336" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={GREEN} />
        <stop offset="0.45" stopColor={TEAL} />
        <stop offset="0.75" stopColor={BLUE} />
        <stop offset="1" stopColor={VIOLET} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-b`} x1="192.64" y1="336" x2="672" y2="336" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={GREEN} />
        <stop offset="0.5" stopColor={BLUE} />
        <stop offset="1" stopColor={VIOLET} />
      </linearGradient>
      <linearGradient id={`${idPrefix}-c`} x1="192.64" y1="336" x2="479.36" y2="336" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={TEAL} />
        <stop offset="0.6" stopColor={BLUE} />
        <stop offset="1" stopColor={VIOLET} />
      </linearGradient>
    </defs>
    <path
      fill={`url(#${idPrefix}-a)`}
      d="M336,672C150.73,672,0,521.27,0,336S150.73,0,336,0s336,150.73,336,336-150.73,336-336,336ZM336,76.16c-143.28,0-259.84,116.56-259.84,259.84s116.56,259.84,259.84,259.84,259.84-116.56,259.84-259.84S479.28,76.16,336,76.16Z"
    />
    <path
      fill={`url(#${idPrefix}-b)`}
      d="M432.32,575.68c-132.16,0-239.68-107.52-239.68-239.68s107.52-239.68,239.68-239.68,239.68,107.52,239.68,239.68-107.52,239.68-239.68,239.68ZM432.32,172.48c-90.16,0-163.52,73.36-163.52,163.52s73.36,163.52,163.52,163.52,163.52-73.36,163.52-163.52-73.36-163.52-163.52-163.52Z"
    />
    <path
      fill={`url(#${idPrefix}-c)`}
      d="M336,479.36c-79.05,0-143.36-64.31-143.36-143.36s64.31-143.36,143.36-143.36,143.36,64.31,143.36,143.36-64.31,143.36-143.36,143.36ZM336,268.8c-37.05,0-67.2,30.15-67.2,67.2s30.15,67.2,67.2,67.2,67.2-30.15,67.2-67.2-30.15-67.2-67.2-67.2Z"
    />
  </svg>
);

/** Texto em degradê verde → roxo. */
const GradientText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span
    className={className}
    style={{ backgroundImage: GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
  >
    {children}
  </span>
);

/** Entrada suave ao rolar a página; desligada para quem pede menos movimento. */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'li' }> = ({
  children,
  delay = 0,
  className,
  as = 'div',
}) => {
  const reduce = useReducedMotion();
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs font-bold tracking-[0.25em] uppercase mb-5" style={{ color: GREEN }}>
    {children}
  </p>
);

const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.08] ${className}`}>
    {children}
  </h2>
);

/** Moldura de 1px em degradê, usada nos destaques. */
const GradientFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-3xl p-px ${className}`} style={{ backgroundImage: GRADIENT }}>
    <div className="rounded-[calc(1.5rem-1px)] bg-[#07051a] h-full">{children}</div>
  </div>
);

const primaryButton =
  'inline-flex items-center justify-center gap-2 px-7 h-14 rounded-full font-bold text-[#03140b] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_32px_rgba(25,196,110,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#19c46e]';
const secondaryButton =
  'inline-flex items-center justify-center gap-2 px-7 h-14 rounded-full font-semibold text-white border border-white/15 hover:border-white/40 hover:bg-white/5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

/* ── Página ────────────────────────────────────────────────────────────────── */

const CoopPage: React.FC<CoopPageProps> = ({ onViewMember, onViewTeam }) => {
  const reduce = useReducedMotion();
  const [interest, setInterest] = useState<CoopInterest | ''>('');
  const marcos = getMemberBySlug('marcos-antonio');

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

  /** Leva ao formulário já com o assunto marcado. */
  const goToContact = (topic: CoopInterest) => {
    setInterest(topic);
    scrollTo(CONTACT_ID);
  };

  return (
    <div className="relative overflow-x-clip">
      {/* ── 1. Abertura ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[8%] right-[2%] w-[520px] h-[520px] rounded-full blur-[140px] opacity-25" style={{ background: BLUE }} />
          <div className="absolute bottom-[0%] left-[-8%] w-[460px] h-[460px] rounded-full blur-[140px] opacity-15" style={{ background: GREEN }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24 grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-8 items-center">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.22em] uppercase text-white/80 whitespace-nowrap">
                Cosmmus Coop <span className="text-white/35 mx-1">·</span> Cosmmus Business
              </span>
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.6rem] sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[0.98] text-white mb-8"
            >
              Cooperativismo e estratégia <GradientText>caminham juntos.</GradientText>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl mb-10"
            >
              Apoiamos cooperativas em todas as etapas da sua jornada, da constituição à expansão, com gestão
              profissional que respeita a autogestão e coloca o cooperado no centro das decisões.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button type="button" onClick={() => goToContact('Diagnóstico')} className={primaryButton} style={{ background: GREEN }}>
                Agende um diagnóstico
              </button>
              <button type="button" onClick={() => scrollTo(EDUCATION_ID)} className={`${secondaryButton} group`}>
                Conheça as palestras
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[440px]"
          >
            <div
              className="absolute inset-[12%] rounded-full blur-[80px] opacity-40"
              style={{ backgroundImage: GRADIENT }}
              aria-hidden="true"
            />
            <motion.div
              animate={reduce ? undefined : { y: [0, -14, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CoopRings idPrefix="coop-hero" className="relative w-full h-auto drop-shadow-[0_0_40px_rgba(47,127,240,0.25)]" />
            </motion.div>
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => scrollTo('para-quem-e')}
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-10 items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
          aria-label="Ir para a próxima seção"
        >
          <ArrowDown size={18} className={reduce ? '' : 'animate-bounce'} />
        </button>
      </section>

      {/* ── 2. Para quem é ──────────────────────────────────────────────── */}
      <section id="para-quem-e" className="relative py-24 md:py-32 border-t border-white/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl mb-16">
            <Eyebrow>Para quem é</Eyebrow>
            <SectionTitle>
              Cada cooperativa está em um momento. <span className="text-white/45">Começamos por ele.</span>
            </SectionTitle>
          </Reveal>

          <div className="relative">
            {/* Linha da jornada, ligando as três etapas */}
            <div
              className="hidden md:block absolute top-[27px] left-[28px] right-[28px] h-px opacity-60"
              style={{ backgroundImage: GRADIENT }}
              aria-hidden="true"
            />
            <div className="grid md:grid-cols-3 gap-10 md:gap-8">
              {audiences.map((item, index) => {
                const Icon = item.icon;
                const color = [GREEN, BLUE, VIOLET][index];
                return (
                  <Reveal key={item.stage} delay={index * 0.1}>
                    <div className="relative z-10 w-14 h-14 rounded-full bg-[#07051a] border flex items-center justify-center mb-8" style={{ borderColor: color, color }}>
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color }}>
                      0{index + 1} · {item.stage}
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-3">{item.title}</h3>
                    <p className="text-white/70 leading-relaxed">{item.text}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. O que fazemos ────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 border-t border-white/5">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[160px] opacity-10 pointer-events-none" style={{ background: TEAL }} aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-end mb-16">
            <div>
              <Eyebrow>O que fazemos</Eyebrow>
              <SectionTitle>
                Nove frentes, <GradientText>uma visão integrada.</GradientText>
              </SectionTitle>
            </div>
            <p className="text-lg text-white/70 leading-relaxed lg:pb-2">
              Cada frente pode ser contratada separadamente ou combinada em um programa de desenvolvimento.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-3xl overflow-hidden border border-white/[0.07] bg-white/[0.07]">
            {fronts.map((front, index) => {
              const Icon = front.icon;
              return (
                <div
                  key={front.title}
                  className="group relative bg-[#06041a]/95 p-8 md:p-9 transition-colors duration-500 hover:bg-[#0b0826]"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                    style={{ backgroundImage: GRADIENT }}
                    aria-hidden="true"
                  />
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/[0.06] text-white/80 group-hover:text-white transition-colors">
                      <Icon size={20} strokeWidth={1.6} />
                    </div>
                    <span className="text-sm font-bold tabular-nums text-white/25 group-hover:text-white/60 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-3">{front.title}</h3>
                  <p className="text-[15px] text-white/65 leading-relaxed">{front.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Como trabalhamos ─────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl mb-16">
            <Eyebrow>Como trabalhamos</Eyebrow>
            <SectionTitle>Do diagnóstico ao resultado acompanhado.</SectionTitle>
          </Reveal>

          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal
                  as="li"
                  key={step.title}
                  delay={index * 0.08}
                  className="h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 relative overflow-hidden"
                >
                    <span
                      className="absolute -right-2 -top-6 text-[110px] font-extrabold leading-none text-white/[0.04] select-none"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-[#03140b]" style={{ background: [GREEN, TEAL, BLUE, VIOLET][index] }}>
                        <Icon size={17} strokeWidth={2} />
                      </span>
                      <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/45">Etapa {index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-white/65 leading-relaxed text-[15px]">{step.text}</p>
                </Reveal>
              );
            })}
          </ol>

          {/* Destaque: Oficina de Planejamento 2027 */}
          <Reveal>
            <GradientFrame>
              <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] p-8 md:p-14 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
                <div className="absolute -right-24 -bottom-24 w-[420px] h-[420px] rounded-full blur-[120px] opacity-25 pointer-events-none" style={{ background: VIOLET }} aria-hidden="true" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase text-[#03140b] mb-6" style={{ background: GREEN }}>
                    <CalendarDays size={13} strokeWidth={2.2} />
                    Destaque
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
                    Oficina de Planejamento 2027
                  </h3>
                  <p className="text-lg text-white/75 leading-relaxed max-w-xl mb-8">
                    Um encontro com dirigentes e conselheiros para sair com prioridades, metas e calendário do próximo ano
                    definidos.
                  </p>
                  <button type="button" onClick={() => goToContact('Oficina de Planejamento 2027')} className={`${primaryButton} group`} style={{ background: GREEN }}>
                    Quero levar para minha cooperativa
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                <div className="relative hidden lg:flex flex-col items-end" aria-hidden="true">
                  <GradientText className="text-[150px] xl:text-[180px] font-extrabold tracking-tighter leading-none">2027</GradientText>
                  <div className="flex gap-2 mt-4">
                    {['Prioridades', 'Metas', 'Calendário'].map((label) => (
                      <span key={label} className="px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-white/70">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GradientFrame>
          </Reveal>
        </div>
      </section>

      {/* ── 5. Educação cooperativista ──────────────────────────────────── */}
      <section id={EDUCATION_ID} className="relative py-24 md:py-32 border-t border-white/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <Reveal className="lg:sticky lg:top-32">
            <Eyebrow>Educação cooperativista</Eyebrow>
            <SectionTitle className="mb-6">
              O conhecimento <GradientText>liberta e mobiliza.</GradientText>
            </SectionTitle>
            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg">
              Palestras, cursos e oficinas para assembleias, encontros regionais, programas de formação e eventos do Dia
              Internacional do Cooperativismo.
            </p>
            <button type="button" onClick={() => goToContact('Palestra ou curso')} className={`${primaryButton} group`} style={{ background: GREEN }}>
              Solicite uma palestra
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Reveal>

          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-4">Temas</p>
            <ul className="border-t border-white/10">
              {themes.map((theme, index) => (
                <Reveal as="li" key={theme} delay={index * 0.06} className="group flex items-center gap-5 py-6 border-b border-white/10">
                    <span className="text-sm font-bold tabular-nums w-6 shrink-0" style={{ color: [GREEN, TEAL, BLUE, '#5b63f5', VIOLET][index] }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-lg md:text-xl font-semibold text-white/90">{theme}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 6. Quem conduz ──────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-center">
          <Reveal className="relative max-w-sm mx-auto lg:mx-0 w-full">
            <div className="absolute -inset-6 rounded-[2.5rem] blur-3xl opacity-30" style={{ backgroundImage: GRADIENT }} aria-hidden="true" />
            <GradientFrame className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-[calc(1.5rem-1px)] bg-white/5">
                {marcos?.photo && (
                  <img src={marcos.photo} alt="Marcos Antonio, consultor e palestrante da Cosmmus Coop" className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>
            </GradientFrame>
            <div className="absolute -bottom-5 left-6 right-6 flex items-center gap-3 rounded-2xl bg-[#0b0826]/95 backdrop-blur border border-white/10 px-4 py-3 shadow-2xl">
              <BookOpen size={18} className="shrink-0" style={{ color: GREEN }} />
              <p className="text-xs leading-snug text-white/75">
                Autor de <span className="text-white font-semibold">"O Dia em que a Terra Voltou a Sorrir"</span>
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Eyebrow>Quem conduz</Eyebrow>
            <SectionTitle className="mb-8">Experiência de quem ajudou a construir cooperativas.</SectionTitle>
            <div className="space-y-5 text-lg text-white/75 leading-relaxed mb-10">
              <p>
                A Cosmmus Coop é conduzida por <strong className="text-white font-semibold">Marcos Antonio</strong>,
                consultor e palestrante com trajetória na abertura, gestão e planejamento de cooperativas. Seu trabalho
                recebeu reconhecimentos e prêmios nacionais e internacionais, e ele é autor do livro infantil "O Dia em
                que a Terra Voltou a Sorrir", que trata do cooperativismo, e de diversos outros textos sobre cooperação.
              </p>
              <p>
                Ao seu lado, a equipe multidisciplinar da Cosmmus Business, com especialistas em negócios, finanças,
                comunicação, cultura e desenvolvimento humano.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-10">
              {teamSkills.map((skill) => (
                <span key={skill} className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-sm text-white/80">
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <a
                href="/equipe/marcos-antonio"
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) return;
                  event.preventDefault();
                  onViewMember('marcos-antonio');
                }}
                className="group inline-flex items-center gap-2 font-semibold text-white hover:text-[#19c46e] transition-colors"
              >
                Conheça a trajetória de Marcos
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/equipe"
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) return;
                  event.preventDefault();
                  onViewTeam();
                }}
                className="group inline-flex items-center gap-2 font-semibold text-white/70 hover:text-white transition-colors"
              >
                Ver a equipe completa
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 7. O que acreditamos ────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute -left-40 top-10 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none" style={{ background: GREEN }} aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-5xl mb-16">
            <Eyebrow>O que acreditamos</Eyebrow>
            <p className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              <span className="text-white/35" aria-hidden="true">“</span>Cooperar é acreditar que o sucesso de um só faz
              sentido quando <GradientText>fortalece a todos.</GradientText>
              <span className="text-white/35" aria-hidden="true">”</span>
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
            <Reveal>
              <p className="text-lg text-white/70 leading-relaxed">
                O cooperativismo é mais que um modelo de negócios. É uma forma de gerar riqueza compartilhada, reduzir
                desigualdades e construir comunidades mais justas. Nosso trabalho parte dos sete princípios:
              </p>
            </Reveal>

            {/* Sete princípios e a marca no oitavo espaço, para a grade fechar por igual */}
            <ol className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {principles.map((principle, index) => (
                <Reveal
                  as="li"
                  key={principle}
                  delay={index * 0.05}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 flex flex-col justify-between min-h-[150px] hover:border-white/20 transition-colors"
                >
                  <GradientText className="text-4xl font-extrabold tabular-nums leading-none">{index + 1}º</GradientText>
                  <span className="text-white/90 font-semibold leading-snug mt-6">{principle}</span>
                </Reveal>
              ))}
              <Reveal
                as="li"
                delay={0.35}
                className="hidden sm:flex rounded-2xl border border-dashed border-white/10 items-center justify-center min-h-[150px]"
              >
                <CoopRings idPrefix="coop-principles" className="w-16 h-16 opacity-80" />
              </Reveal>
            </ol>
          </div>
        </div>
      </section>

      {/* ── 8. Contato ──────────────────────────────────────────────────── */}
      <section id={CONTACT_ID} className="relative py-24 md:py-32 border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
          <Reveal className="lg:sticky lg:top-32">
            <Eyebrow>Contato</Eyebrow>
            <SectionTitle className="mb-6">
              Vamos conversar sobre <GradientText>a sua cooperativa.</GradientText>
            </SectionTitle>
            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-md">
              Conte em que momento a cooperativa está. Respondemos com uma proposta de primeiro passo.
            </p>
            <div className="space-y-4">
              <a href="https://wa.me/5562999546265" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
                <span className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                  <Phone size={17} />
                </span>
                (62) 99954-6265
              </a>
              <a href="mailto:contato@cosmmus.com" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
                <span className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                  <Mail size={17} />
                </span>
                contato@cosmmus.com
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <CoopContactForm interest={interest} onInterestChange={setInterest} accent={GREEN} />
          </Reveal>
        </div>
      </section>

      {/* ── Assinatura ──────────────────────────────────────────────────── */}
      <section className="relative py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center flex flex-col items-center">
          <CoopRings idPrefix="coop-signature" className="w-14 h-14 mb-6" />
          <p className="text-sm font-bold tracking-[0.25em] uppercase text-white mb-3">
            Cosmmus Coop <span className="text-white/35 mx-1">·</span> Cosmmus Business
          </p>
          <p className="text-white/60">Inovação, estratégia e transformação para o cooperativismo.</p>
        </div>
      </section>
    </div>
  );
};


export default CoopPage;
