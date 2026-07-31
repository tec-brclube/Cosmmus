import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Activity, Target, Zap, ActivitySquare, RefreshCw, Crosshair, BarChart2, ShoppingCart, MessageSquare, Settings, CheckCircle2, ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface MethodologyProps {
  preview?: boolean;
}

const Methodology: React.FC<MethodologyProps> = ({ preview }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  
  useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: lineProgress } = useScroll({
    target: lineRef,
    offset: ["start center", "end center"]
  });

  // Parallax line height
  const lineHeight = useTransform(lineProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    { num: '01', title: 'Diagnóstico de Precisão', desc: 'Entramos no núcleo da operação para entender onde a energia está sendo dissipada.', icon: Crosshair },
    { num: '02', title: 'Arquitetura do Plano', desc: 'Construímos o Plano de Negócios — o mapa técnico que define o destino e os recursos necessários.', icon: Target },
    { num: '03', title: 'Ativação Tática', desc: 'A fase de implementação. Onde o plano ganha massa e as ações saem do papel para o mercado.', icon: Zap },
    { num: '04', title: 'Monitoramento de Órbita', desc: 'Acompanhamento de 6 meses via indicadores. Se não medimos, não gerenciamos.', icon: Activity },
    { num: '05', title: 'Evolução e Ciclo', desc: 'Revisão de rota e continuidade. O sucesso não é um ponto de chegada, é um movimento constante.', icon: RefreshCw },
  ];

  const axes = [
    { id: 'mercado', title: 'Mercado', desc: 'Análise de ambiente e posicionamento de vanguarda.', icon: Target, angle: -90, color: '#0ea5e9' },
    { id: 'financas', title: 'Finanças', desc: 'Inteligência de capital, custos e precificação estratégica.', icon: BarChart2, angle: -18, color: '#22c55e' },
    { id: 'comercial', title: 'Comercial', desc: 'A máquina de vendas: processos escaláveis e conversão.', icon: ShoppingCart, angle: 54, color: '#eab308' },
    { id: 'comunicacao', title: 'Comunicação', desc: 'Branding e voz: como o mercado percebe o seu valor.', icon: MessageSquare, angle: 126, color: '#d946ef' },
    { id: 'operacao', title: 'Operação', desc: 'Eficiência interna: processos que rodam sem fricção.', icon: Settings, angle: 198, color: '#f97316' },
  ];

  const [activeAxis, setActiveAxis] = useState<string | null>(null);

  const differentials = [
    { title: 'Personalização Cirúrgica', desc: 'Negócios são organismos vivos; não usamos fórmulas prontas.' },
    { title: 'Presença de Cabine', desc: 'Não somos consultores de relatório. Estamos ao seu lado no acompanhamento contínuo.' },
    { title: 'Equipe Multidisciplinar', desc: 'Uma fusão de expertises (Finanças, Marketing, Operação e Gestão).' },
    { title: 'Base em Dados e Propósito', desc: 'Decisões frias em dados, mas guiadas pelo calor do seu propósito.' },
  ];

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-transparent relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-brand-purple/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-cyan font-bold tracking-widest uppercase text-sm mb-4 font-mono"
          >
            Metodologia: O Blueprint do Crescimento
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
          >
            Transformamos complexidade em <span className="text-brand-pink">método</span>.
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/85 max-w-3xl mx-auto text-lg md:text-xl font-light"
          >
            Não entregamos apenas planos, desenhamos a estrutura que sustenta a sua expansão.
          </motion.p>
        </div>

        {/* Section 1: A Linha de Tração */}
        <div className="mb-32 relative">
          <div className="text-center mb-16">
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">1. A Linha de Tração</h4>
            <p className="text-white/70 font-sans text-sm">As Etapas do Circuito</p>
          </div>

          <div ref={lineRef} className="relative max-w-4xl mx-auto">
            {/* Continuous Flow Line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-white/5 md:-translate-x-1/2 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-brand-cyan via-brand-purple to-brand-pink"
                style={{ height: lineHeight }}
              />
            </div>

            <div className="space-y-16 md:space-y-24 relative">
              {steps.map((step, index) => {
                const isEven = index % 2 === 0;
                const Icon = step.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex flex-col md:flex-row items-start md:items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Content */}
                    <div className={`flex-1 md:w-1/2 ${isEven ? 'md:text-left pl-16 md:pl-0' : 'md:text-right pl-16 md:pl-0 md:pr-16'}`}>
                      <div className="bg-brand-surface/40 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/5 hover:border-brand-cyan/30 transition-colors group">
                        <div className={`flex items-center gap-4 mb-4 ${isEven ? 'justify-start' : 'md:justify-end justify-start'}`}>
                          <span className="font-mono text-brand-cyan text-lg font-bold">{step.num}</span>
                          <h5 className="text-xl md:text-2xl font-bold text-white">{step.title}</h5>
                        </div>
                        <p className="text-white/75 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>

                    {/* Node */}
                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-full bg-brand-dark border-2 border-brand-purple flex items-center justify-center z-10 shadow-[0_0_20px_rgba(139,0,255,0.3)]">
                      <Icon className="w-6 h-6 text-brand-cyan" />
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1 md:w-1/2"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: O Núcleo do Ecossistema */}
        <div className="mb-32 relative">
          {/* Decorative Stars Background for this section */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ opacity: 0.2 }}
                animate={{ 
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 3, 
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
                style={{ 
                  top: `${Math.random() * 100}%`, 
                  left: `${Math.random() * 100}%` 
                }}
              />
            ))}
          </div>

          <div className="text-center mb-16 relative z-10">
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">2. O Núcleo do Ecossistema</h4>
            <p className="text-white/70 font-sans text-sm">Os 5 Eixos Estratégicos</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10">
            {/* Interactive Constellation */}
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex-shrink-0">
              
              {/* Static Center Core - The Sun/Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center z-30">
                <motion.div 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand-pink/10 blur-3xl absolute"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-brand-dark/90 backdrop-blur-md border border-brand-pink/30 flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(217,0,255,0.2)] overflow-hidden p-5">
                  <Logo className="w-full h-full text-white" />
                </div>
              </div>

              {/* Rotating Orbit Elements */}
              <motion.div 
                className="absolute inset-0 w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                {/* Connecting Lines (Constellation style) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 400">
                  {/* Outer circle line */}
                  <circle 
                    cx="200" cy="200" r="160" 
                    fill="none" 
                    stroke="rgba(217,0,255,0.1)" 
                    strokeWidth="1"
                    strokeDasharray="8 8"
                  />
                  
                  {/* Lines to center */}
                  {axes.map((axis, i) => {
                    const radian = (axis.angle * Math.PI) / 180;
                    const x2 = 200 + Math.cos(radian) * 160;
                    const y2 = 200 + Math.sin(radian) * 160;
                    const isActive = activeAxis === axis.id;
                    
                    return (
                      <motion.line 
                        key={i}
                        x1="200" y1="200" 
                        x2={x2} y2={y2} 
                        stroke={isActive ? axis.color : "rgba(217,0,255,0.05)"} 
                        strokeWidth={isActive ? "2" : "1"}
                        opacity={isActive ? 0.8 : 0.3}
                        transition={{ duration: 0.3 }}
                      />
                    );
                  })}
                </svg>

                {/* Axis Nodes */}
                {axes.map((axis) => {
                  const radiusPercent = 40; 
                  const radian = (axis.angle * Math.PI) / 180;
                  const xPercent = Math.cos(radian) * radiusPercent;
                  const yPercent = Math.sin(radian) * radiusPercent;
                  const isActive = activeAxis === axis.id;
                  const Icon = axis.icon;

                  return (
                    <motion.div
                      key={axis.id}
                      className="absolute z-10"
                      style={{ 
                        left: `calc(50% + ${xPercent}%)`, 
                        top: `calc(50% + ${yPercent}%)`,
                        x: '-50%', 
                        y: '-50%' 
                      }}
                    >
                      {/* Counter-rotation to keep icons upright */}
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="relative"
                      >
                        <div 
                          className="relative group cursor-pointer"
                          onMouseEnter={() => setActiveAxis(axis.id)}
                          onMouseLeave={() => setActiveAxis(null)}
                          onClick={() => setActiveAxis(isActive ? null : axis.id)}
                        >
                          {/* Circular Container */}
                          <div 
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 border-2 ${
                              isActive 
                                ? 'shadow-[0_0_30px_rgba(217,0,255,0.4)] border-brand-pink scale-110' 
                                : 'bg-brand-surface/90 border-brand-pink/40 hover:border-brand-pink hover:scale-105'
                            }`}
                          >
                            <Icon 
                              size={isActive ? 28 : 24} 
                              className="transition-all duration-300"
                              style={{ color: isActive ? '#fff' : axis.color }} 
                            />
                          </div>

                          {/* Label Container */}
                          <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-1.5 rounded-lg bg-brand-dark/90 backdrop-blur-md border border-brand-pink/20 transition-all duration-500 min-w-[100px] text-center shadow-xl ${
                            isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-90'
                          }`}>
                            <span 
                              className="text-[10px] md:text-xs font-sans font-black tracking-widest whitespace-nowrap uppercase"
                              style={{ color: axis.color }}
                            >
                              {axis.title}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Description Panel */}
            <div className="w-full lg:w-1/3 min-h-[200px]">
              <div className="bg-brand-surface/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 h-full flex flex-col justify-center relative overflow-hidden">
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                
                {activeAxis ? (
                  <motion.div
                    key={activeAxis}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: axes.find(a => a.id === activeAxis)?.color }}
                      ></div>
                      <h5 className="text-2xl font-bold text-white font-sans uppercase tracking-wider">
                        {axes.find(a => a.id === activeAxis)?.title}
                      </h5>
                    </div>
                    <p className="text-white/85 text-lg leading-relaxed font-sans">
                      {axes.find(a => a.id === activeAxis)?.desc}
                    </p>
                  </motion.div>
                ) : (
                  <div className="relative z-10 text-center opacity-50">
                    <ActivitySquare className="w-12 h-12 mx-auto mb-4 text-white/50" />
                    <p className="font-sans text-sm uppercase tracking-widest">Inicie a varredura<br/>(Passe o mouse sobre os eixos)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Nosso Diferencial */}
        <div>
          <div className="text-center mb-16">
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">3. A Ciência por Trás do Propósito</h4>
            <p className="text-white/70 font-sans text-sm">Especificações de Sistema</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {differentials.map((diff, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-brand-surface/40 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-white/5 hover:border-brand-purple/30 transition-colors relative overflow-hidden group"
              >
                {/* Techy corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-cyan/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-pink/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-brand-cyan flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="text-lg font-bold text-white mb-2 font-sans">{diff.title}</h5>
                    <p className="text-white/75 text-sm leading-relaxed font-sans">{diff.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Methodology;