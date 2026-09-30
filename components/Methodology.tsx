import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface MethodologyProps {
  preview?: boolean;
}

interface Item {
  title: string;
  desc: string;
}

interface Track {
  id: string;
  /** Nome da aba. */
  label: string;
  /** Como cada item se chama: aparece no centro do mostrador e no contador. */
  unit: string;
  items: Item[];
}

/**
 * As três partes do método. Só a Linha de Tração vai no mostrador circular,
 * porque é uma sequência de etapas que volta ao começo. Eixos e pilares não
 * têm ordem: ficam em cartões, todos visíveis de uma vez.
 */
const TRACKS: Track[] = [
  {
    id: 'tracao',
    label: 'Linha de Tração',
    unit: 'Etapa',
    items: [
      { title: 'Diagnóstico de Precisão', desc: 'Entramos no núcleo da operação para entender onde a energia está sendo dissipada.' },
      { title: 'Arquitetura do Plano', desc: 'Construímos o Plano de Negócios — o mapa técnico que define o destino e os recursos necessários.' },
      { title: 'Ativação Tática', desc: 'A fase de implementação. Onde o plano ganha massa e as ações saem do papel para o mercado.' },
      { title: 'Monitoramento de Órbita', desc: 'Acompanhamento de 6 meses via indicadores. Se não medimos, não gerenciamos.' },
      { title: 'Evolução e Ciclo', desc: 'Revisão de rota e continuidade. O sucesso não é um ponto de chegada, é um movimento constante.' },
    ],
  },
  {
    id: 'ecossistema',
    label: 'Núcleo do Ecossistema',
    unit: 'Eixo',
    items: [
      { title: 'Mercado', desc: 'Análise de ambiente e posicionamento de vanguarda.' },
      { title: 'Finanças', desc: 'Inteligência de capital, custos e precificação estratégica.' },
      { title: 'Comercial', desc: 'A máquina de vendas: processos escaláveis e conversão.' },
      { title: 'Comunicação', desc: 'Branding e voz: como o mercado percebe o seu valor.' },
      { title: 'Operação', desc: 'Eficiência interna: processos que rodam sem fricção.' },
    ],
  },
  {
    id: 'proposito',
    label: 'Ciência do Propósito',
    unit: 'Pilar',
    items: [
      { title: 'Personalização Cirúrgica', desc: 'Negócios são organismos vivos; não usamos fórmulas prontas.' },
      { title: 'Presença de Cabine', desc: 'Não somos consultores de relatório. Estamos ao seu lado no acompanhamento contínuo.' },
      { title: 'Equipe Multidisciplinar', desc: 'Uma fusão de expertises (Finanças, Marketing, Operação e Gestão).' },
      { title: 'Base em Dados e Propósito', desc: 'Decisões frias em dados, mas guiadas pelo calor do seu propósito.' },
    ],
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

/** Cor de cada eixo, seguindo o degradê da marca do ciano ao rosa. */
const AXIS_COLORS = ['#00e5ff', '#4f7dff', '#8b00ff', '#b000ff', '#d900ff'];

/** Estrelas do mostrador: posição (%) e atraso da piscada (s). */
const DIAL_STARS = [
  { top: 30, left: 38, delay: 0 },
  { top: 36, left: 66, delay: 1.1 },
  { top: 62, left: 34, delay: 2.2 },
  { top: 68, left: 60, delay: 0.6 },
  { top: 8, left: 80, delay: 1.7 },
  { top: 88, left: 16, delay: 2.8 },
  { top: 50, left: 4, delay: 1.3 },
];

const Methodology: React.FC<MethodologyProps> = ({ preview }) => {
  // Como resumo na página inicial o título é um H2; como página própria, o H1 dela
  const Title = preview ? motion.h2 : motion.h1;
  const reduce = useReducedMotion();

  const [active, setActive] = useState(0);
  /** Item sob o mouse (ou com o foco do teclado), para a prévia no mostrador. */
  const [hovered, setHovered] = useState<number | null>(null);

  const [track, axes, pillars] = TRACKS;
  const total = track.items.length;
  const item = track.items[active];
  const next = track.items[(active + 1) % total];

  const go = (delta: number) => setActive((current) => (current + delta + total) % total);

  const fade = reduce
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

  return (
    <section className="py-24 md:py-32 bg-transparent relative overflow-hidden">
      {/* Brilhos de fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] left-[10%] w-[500px] h-[500px] bg-brand-purple/20 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[5%] right-[15%] w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-6 font-mono"
          >
            Metodologia: O Blueprint do Crescimento
          </motion.p>
          <Title
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter leading-[1.02] mb-6 max-w-4xl mx-auto"
          >
            Transformamos complexidade em{' '}
            <span className="bg-gradient-to-r from-[#a445f5] to-[#d24bf2] bg-clip-text text-transparent">método</span>.
          </Title>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 max-w-md mx-auto text-base md:text-lg"
          >
            Não entregamos apenas planos, desenhamos a estrutura que sustenta a sua expansão.
          </motion.p>
        </div>

        {/* ── 01 · Linha de Tração: o mostrador ── */}
        <PartHeading number="01" title={track.label} subtitle="As etapas do circuito" />

        <div id="metodo-painel" className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center mb-28 md:mb-36">
          {/* Mostrador circular */}
          <div className="metodo-dial relative mx-auto w-full max-w-[320px] sm:max-w-[420px] aspect-square">
            <style>{`
              @keyframes metodo-spin { to { transform: rotate(360deg); } }
              @keyframes metodo-twinkle { 0%, 100% { opacity: .15; } 50% { opacity: .9; } }
              .metodo-comet { animation: metodo-spin 14s linear infinite; }
              .metodo-star { animation: metodo-twinkle 3.2s ease-in-out infinite; }
              .metodo-node-spin { animation: metodo-spin 6s linear infinite; }
              @keyframes metodo-axes-travel { 0% { left: 10%; opacity: 0; } 10%, 90% { opacity: 1; } 100% { left: 90%; opacity: 0; } }
              .metodo-axes-light { animation: metodo-axes-travel 7s ease-in-out infinite; }
              @media (prefers-reduced-motion: reduce) {
                .metodo-node-spin { animation: none; }
                .metodo-axes-light { display: none; }
                .metodo-comet { animation: none; opacity: 0; }
                .metodo-star { animation: none; opacity: .5; }
              }
            `}</style>

            <div className="absolute inset-[10%] rounded-full border border-white/[0.12]" aria-hidden="true" />
            <div className="absolute inset-[29%] rounded-full border border-dashed border-white/[0.08]" aria-hidden="true" />
            <div className="absolute inset-[32%] rounded-full bg-brand-purple/25 blur-[50px]" aria-hidden="true" />

            {/* Estrelas dentro do mostrador, como o céu do resto do site */}
            {DIAL_STARS.map((star, index) => (
              <span
                key={index}
                className="metodo-star absolute w-[3px] h-[3px] rounded-full bg-white"
                style={{ top: `${star.top}%`, left: `${star.left}%`, animationDelay: `${star.delay}s` }}
                aria-hidden="true"
              />
            ))}

            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <linearGradient id="metodo-trilha" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#00ffff" />
                  <stop offset="0.5" stopColor="#8b00ff" />
                  <stop offset="1" stopColor="#d900ff" />
                </linearGradient>
                <linearGradient id="metodo-rastro" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              {/* Prévia: até onde a trilha iria se o item sob o mouse fosse escolhido */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="0.6"
                strokeLinecap="round"
                initial={false}
                animate={{
                  pathLength: (hovered ?? active) / total,
                  opacity: hovered !== null && hovered > active ? 1 : 0,
                }}
                transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Trilha do progresso: do primeiro item até o ativo */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#metodo-trilha)"
                strokeWidth="0.8"
                strokeLinecap="round"
                initial={false}
                animate={{ pathLength: active / total, opacity: active === 0 ? 0 : 1 }}
                transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ filter: 'drop-shadow(0 0 1.5px rgba(190,75,245,0.9))' }}
              />
            </svg>

            {/* Cometa que dá voltas na órbita, com rastro */}
            <div className="metodo-comet absolute inset-0 pointer-events-none" aria-hidden="true">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <path d="M 21.72 21.72 A 40 40 0 0 1 50 10" fill="none" stroke="url(#metodo-rastro)" strokeWidth="0.8" strokeLinecap="round" />
                <circle cx="50" cy="10" r="1.1" fill="#fff" style={{ filter: 'drop-shadow(0 0 2px #fff)' }} />
              </svg>
            </div>

            {/* Pulso a cada troca de item */}
            {!reduce && (
              <motion.div
                key={`pulso-${track.id}-${active}`}
                className="absolute inset-[29%] rounded-full border border-[#c04af2] pointer-events-none"
                initial={{ opacity: 0.7, scale: 0.85 }}
                animate={{ opacity: 0, scale: 1.55 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                aria-hidden="true"
              />
            )}

            {/* Número do item ativo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${track.id}-${active}`}
                  {...fade}
                  transition={{ duration: 0.25 }}
                  className="text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none"
                >
                  {pad(active + 1)}
                </motion.span>
              </AnimatePresence>
              <span className="mt-2 text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-white/50">
                {track.unit}
              </span>
            </div>

            {/* Itens em volta, começando no topo e seguindo no sentido horário */}
            {track.items.map((it, index) => {
              const angle = ((-90 + (index * 360) / total) * Math.PI) / 180;
              const selected = index === active;
              const isHovered = index === hovered;
              return (
                // Âncora de tamanho zero no ponto da órbita: o botão e a etiqueta se centralizam nela
                <div
                  key={`${track.id}-${it.title}`}
                  className={`absolute ${isHovered ? 'z-20' : 'z-10'}`}
                  style={{ left: `${50 + Math.cos(angle) * 40}%`, top: `${50 + Math.sin(angle) * 40}%` }}
                >
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                    aria-label={`${track.unit} ${index + 1}: ${it.title}`}
                    aria-pressed={selected}
                    className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs md:text-sm font-mono transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${
                      selected
                        ? `bg-gradient-to-br from-[#b44af5] to-[#d24bf2] text-white shadow-[0_0_0_8px_rgba(190,75,245,0.15),0_0_32px_rgba(190,75,245,0.6)] ${isHovered ? 'scale-[1.2]' : 'scale-110'}`
                        : isHovered
                          ? 'bg-[#1a0b2e] border border-[#c04af2] text-white scale-[1.15] shadow-[0_0_24px_rgba(190,75,245,0.55)]'
                          : 'bg-brand-dark border border-white/20 text-white/80'
                    }`}
                  >
                    {/* Anel pontilhado girando em volta do número, como uma pequena órbita */}
                    <span
                      className={`absolute -inset-2 rounded-full transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                      aria-hidden="true"
                    >
                      <span className="metodo-node-spin absolute inset-0 rounded-full border border-dashed border-[#c04af2]/80" />
                    </span>
                    <span className="relative">{pad(index + 1)}</span>
                  </button>

                  {/* Etiqueta com o nome do item */}
                  <span
                    className={`absolute left-0 bottom-8 md:bottom-9 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-full bg-[#120a24]/95 backdrop-blur border border-white/15 text-xs font-semibold text-white shadow-xl pointer-events-none transition-all duration-200 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                    }`}
                    aria-hidden="true"
                  >
                    {it.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Texto do item ativo e lista */}
          <div className="max-w-xl mx-auto lg:mx-0 w-full">
            <AnimatePresence mode="wait">
              <motion.div key={`${track.id}-${active}`} {...fade} transition={{ duration: 0.25 }} aria-live="polite">
                <p className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-[#c04af2] mb-5">
                  {track.unit} {pad(active + 1)} / {pad(total)}
                </p>
                <h4 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-5">{item.title}</h4>
                <p className="text-lg md:text-xl text-white/70 leading-relaxed min-h-[3.5em]">{item.desc}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-8 mb-10">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={`${track.unit} anterior`}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-white/60 hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={`Próximo: ${next.title}`}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-white/60 hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink"
              >
                <ArrowRight size={18} />
              </button>
              <p className="ml-3 text-sm text-white/50 truncate">
                Próximo: <span className="text-white">{next.title}</span>
              </p>
            </div>

            <ol className="border-t border-white/10">
              {track.items.map((it, index) => {
                const selected = index === active;
                return (
                  <li key={`${track.id}-${it.title}`} className="border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      aria-current={selected ? 'step' : undefined}
                      className="w-full flex items-center gap-4 py-3.5 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink"
                    >
                      <span className={`font-mono text-xs ${selected ? 'text-[#c04af2]' : 'text-white/35'}`}>{pad(index + 1)}</span>
                      <span className={`font-semibold transition-colors ${selected ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                        {it.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* ── 02 · Núcleo do Ecossistema: os eixos numa linha de órbita ── */}
        <PartHeading number="02" title={axes.label} subtitle="Os 5 eixos estratégicos" />
        <ol className="metodo-axes relative grid lg:grid-cols-5 gap-10 lg:gap-6 max-w-6xl mx-auto mb-28 md:mb-36">
          {/* Linha que liga os eixos: horizontal na tela grande, vertical no celular */}
          <span className="hidden lg:block absolute top-[7px] left-[10%] right-[10%] h-px bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-pink opacity-50" aria-hidden="true" />
          <span className="lg:hidden absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-cyan via-brand-purple to-brand-pink opacity-50" aria-hidden="true" />
          {/* Luz que viaja pela linha, como o cometa do mostrador */}
          <span className="metodo-axes-light hidden lg:block absolute top-[4px] w-2 h-2 -ml-1 rounded-full bg-white shadow-[0_0_12px_3px_rgba(255,255,255,0.7)]" aria-hidden="true" />

          {axes.items.map((it, index) => (
            <motion.li
              key={it.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative pl-10 lg:pl-0 lg:text-center"
            >
              <span
                className="absolute left-0 top-0 lg:static lg:mx-auto block w-[15px] h-[15px] rounded-full border-2 bg-brand-dark transition-all duration-300 group-hover:scale-125"
                style={{ borderColor: AXIS_COLORS[index], boxShadow: `0 0 14px ${AXIS_COLORS[index]}80` }}
                aria-hidden="true"
              >
                <span
                  className="block w-full h-full rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
                  style={{ background: AXIS_COLORS[index] }}
                />
              </span>
              <span className="block font-mono text-[11px] text-white/35 lg:mt-5 mb-1.5">{pad(index + 1)}</span>
              <h4 className="text-lg font-bold text-white tracking-tight mb-2 transition-colors group-hover:text-[#d58cff]">{it.title}</h4>
              <p className="text-white/60 leading-relaxed text-[15px] lg:max-w-[210px] lg:mx-auto">{it.desc}</p>
            </motion.li>
          ))}
        </ol>

        {/* ── 03 · Ciência do Propósito: texto solto, separado por linhas finas ── */}
        <PartHeading number="03" title={pillars.label} subtitle="A ciência por trás do propósito" />
        <ol className="grid md:grid-cols-2 max-w-5xl mx-auto">
          {pillars.items.map((it, index) => (
            <motion.li
              key={it.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`group flex gap-5 md:gap-6 py-8 md:p-10 border-white/10 ${index < pillars.items.length - 1 ? 'border-b' : ''} ${
                index >= 2 ? 'md:border-b-0' : ''
              } ${index % 2 === 0 ? 'md:border-r' : ''}`}
            >
              <span className="text-4xl md:text-5xl font-extrabold leading-none tabular-nums bg-gradient-to-br from-brand-cyan via-brand-purple to-brand-pink bg-clip-text text-transparent opacity-70 group-hover:opacity-100 transition-opacity">
                {pad(index + 1)}
              </span>
              <div>
                <h4 className="text-xl font-bold text-white tracking-tight mb-2">{it.title}</h4>
                <p className="text-white/65 leading-relaxed">{it.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

/** Título de cada parte do método. */
const PartHeading: React.FC<{ number: string; title: string; subtitle: string }> = ({ number, title, subtitle }) => (
  <div className="text-center mb-12 md:mb-14">
    <p className="font-mono text-xs tracking-[0.25em] uppercase text-white/40 mb-3">
      <span className="text-[#c04af2]">{number}</span> · {subtitle}
    </p>
    <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">{title}</h3>
  </div>
);

export default Methodology;
