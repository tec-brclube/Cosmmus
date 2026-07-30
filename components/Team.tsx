import React from 'react';
import { ArrowRight, Linkedin, Mail } from 'lucide-react';
import marcosPhoto from '../IMAGENS/FOTO MARCOS.webp';

interface TeamMember {
  name: string;
  role: string;
  /** Foto em formato retrato. Sem foto, o card exibe as iniciais. */
  photo?: string;
  /** Texto de apresentação — 2 a 4 linhas. */
  description: string;
  /** Áreas de atuação exibidas como etiquetas. */
  expertise: string[];
  linkedin?: string;
  email?: string;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DADOS DA EQUIPE
 *
 * Para atualizar a página, edite apenas esta lista.
 *
 * Os textos entre colchetes [ ] são marcadores a substituir pelos dados reais.
 * Para adicionar a foto de um profissional:
 *   1. coloque o arquivo em IMAGENS/ (formato retrato, .webp de preferência)
 *   2. importe no topo deste arquivo, ex.: import anaPhoto from '../IMAGENS/FOTO ANA.webp';
 *   3. informe photo: anaPhoto no item correspondente
 * ─────────────────────────────────────────────────────────────────────────────
 */
const teamMembers: TeamMember[] = [
  {
    name: 'Marcos Antônio da Silva e Silva',
    role: 'Fundador & CEO',
    photo: marcosPhoto,
    description:
      '[Descrição de Marcos Antônio: 2 a 4 linhas apresentando sua trajetória, formação e o que ele lidera dentro da Cosmmus Business.]',
    expertise: ['[Área 1]', '[Área 2]', '[Área 3]'],
  },
  {
    name: '[Nome do segundo profissional]',
    role: '[Cargo ou função]',
    description:
      '[Descrição: 2 a 4 linhas apresentando o profissional, sua formação e sua atuação dentro da Cosmmus Business.]',
    expertise: ['[Área 1]', '[Área 2]', '[Área 3]'],
  },
  {
    name: '[Nome do terceiro profissional]',
    role: '[Cargo ou função]',
    description:
      '[Descrição: 2 a 4 linhas apresentando o profissional, sua formação e sua atuação dentro da Cosmmus Business.]',
    expertise: ['[Área 1]', '[Área 2]', '[Área 3]'],
  },
  {
    name: '[Nome do quarto profissional]',
    role: '[Cargo ou função]',
    description:
      '[Descrição: 2 a 4 linhas apresentando o profissional, sua formação e sua atuação dentro da Cosmmus Business.]',
    expertise: ['[Área 1]', '[Área 2]', '[Área 3]'],
  },
];

/** Iniciais usadas quando ainda não há foto (ignora preposições e marcadores). */
const getInitials = (name: string): string => {
  const clean = name.replace(/[[\]]/g, '');
  const parts = clean.split(' ').filter((part) => part.length > 2 && !['da', 'de', 'do', 'dos', 'das'].includes(part.toLowerCase()));
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
};

interface TeamProps {
  onCtaClick?: () => void;
}

const Team: React.FC<TeamProps> = ({ onCtaClick }) => {
  return (
    <div className="bg-transparent text-white relative overflow-hidden">
      {/* Brilhos de fundo, no mesmo padrão das demais páginas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[15%] right-[-10%] w-[600px] h-[600px] bg-brand-pink/5 rounded-full blur-[150px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho */}
        <div className="pt-28 pb-20 max-w-4xl">
          <span className="text-brand-cyan font-bold tracking-widest uppercase text-xs mb-6 block">Nossa Equipe</span>
          <h1 className="text-4xl md:text-6xl font-black leading-none mb-8 tracking-tighter">
            Método é gente. <br />
            <span className="text-brand-purple">Conheça quem executa.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
            Uma equipe multidisciplinar que une finanças, marketing, operação e gestão de pessoas. Não terceirizamos o
            que importa: quem desenha a estratégia é quem senta com você para executá-la.
          </p>
        </div>

        {/* Grade de profissionais */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 pb-24">
          {teamMembers.map((member, index) => (
            <article
              key={member.name}
              className="group relative rounded-3xl overflow-hidden bg-brand-surface/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-brand-purple/10 hover:shadow-brand-purple/30 hover:border-white/20 transition-all duration-700 flex flex-col"
            >
              {/* Retrato */}
              <div className="relative aspect-[4/5] sm:aspect-[16/11] overflow-hidden">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-navy via-brand-surface to-brand-dark">
                    <div className="w-28 h-28 rounded-full gradient-bg flex items-center justify-center mb-4 opacity-90 group-hover:scale-105 transition-transform duration-700">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {getInitials(member.name) || '••'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Foto em breve</span>
                  </div>
                )}

                {/* Numeração discreta */}
                <div className="absolute top-5 right-5 z-10">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                    <div className="w-1 h-1 bg-brand-cyan rounded-full animate-pulse" />
                    <span className="text-[9px] font-mono text-white/90 uppercase tracking-[0.15em] leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/20 to-transparent" />

                {/* Nome sobre a imagem */}
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight group-hover:text-brand-cyan transition-colors">
                    {member.name}
                  </h2>
                  <p className="text-brand-cyan text-xs tracking-[0.2em] uppercase font-bold mt-2">{member.role}</p>
                </div>
              </div>

              {/* Apresentação */}
              <div className="p-6 md:p-8 pt-6 flex flex-col flex-grow">
                <p className="text-white/70 font-light leading-relaxed mb-6 flex-grow">{member.description}</p>

                {member.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {member.expertise.map((item) => (
                      <span
                        key={item}
                        className="text-[11px] font-medium uppercase tracking-wider text-white/60 border border-white/10 bg-white/[0.03] rounded-full px-3 py-1.5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {(member.linkedin || member.email) && (
                  <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn de ${member.name}`}
                        className="w-10 h-10 mt-4 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-brand-cyan hover:text-brand-dark transition-all duration-300"
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        aria-label={`E-mail de ${member.name}`}
                        className="w-10 h-10 mt-4 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-brand-pink hover:text-white transition-all duration-300"
                      >
                        <Mail size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Chamada final */}
        <div className="border-t border-white/10 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight mb-6">
            Quer conversar com <span className="gradient-text">quem faz</span>?
          </h2>
          <p className="text-white/70 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Agende uma reunião estratégica e conheça de perto a metodologia que sustenta cada projeto da Cosmmus
            Business.
          </p>
          <button
            type="button"
            onClick={onCtaClick}
            className="py-5 px-10 rounded-full bg-white text-brand-dark font-bold text-lg hover:bg-brand-cyan transition-colors inline-flex items-center gap-3 group"
          >
            Agende uma reunião estratégica
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Team;
