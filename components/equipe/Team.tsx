import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getInitials, getPhotoStyle, teamMembers } from './teamData';
import { pathFromView, isPlainLeftClick } from '../../routes';

interface TeamProps {
  onViewMember: (slug: string) => void;
  onCtaClick?: () => void;
}

const Team: React.FC<TeamProps> = ({ onViewMember, onCtaClick }) => {
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
          <p className="text-lg md:text-xl text-white/85 leading-relaxed">
            Uma equipe multidisciplinar que une finanças, marketing, operação e gestão de pessoas. Não terceirizamos o
            que importa: quem desenha a estratégia é quem senta com você para executá-la.
          </p>
        </div>

        {/* Grade de profissionais */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 pb-24">
          {teamMembers.map((member, index) => (
            <article
              key={member.slug}
              onClick={() => onViewMember(member.slug)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-brand-surface/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-brand-purple/10 hover:shadow-brand-purple/30 hover:border-white/20 transition-all duration-500 flex flex-col sm:flex-row"
            >
              {/* Retrato: proporção próxima à da foto original, para não ampliar demais */}
              <div className="relative sm:w-[42%] sm:flex-shrink-0 aspect-[3/4] sm:aspect-auto overflow-hidden">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    style={getPhotoStyle(member)}
                    className="absolute inset-0 w-full h-full object-cover object-top transform group-hover:scale-[1.03] transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-navy via-brand-surface to-brand-dark">
                    <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mb-4 opacity-90 group-hover:scale-105 transition-transform duration-500">
                      <span className="text-2xl font-black text-white tracking-tight">{getInitials(member.name)}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Foto em breve</span>
                  </div>
                )}

                {/* Numeração discreta */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                    <div className="w-1 h-1 bg-brand-cyan rounded-full animate-pulse" />
                    <span className="text-[9px] font-mono text-white/90 uppercase tracking-[0.15em] leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Degradê apenas na emenda com o texto */}
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-brand-surface/80 sm:from-transparent sm:to-brand-surface/60 to-transparent" />
              </div>

              {/* Apresentação */}
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h2 className="text-xl lg:text-2xl font-bold text-white leading-tight tracking-tight group-hover:text-brand-cyan transition-colors">
                  {member.name}
                </h2>
                <p className="text-brand-cyan text-[11px] tracking-[0.2em] uppercase font-bold mt-2 mb-4">
                  {member.role}
                </p>

                <p className="text-white/85 leading-relaxed text-[15px] flex-grow">{member.summary}</p>

                {member.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {member.expertise.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="text-[10px] font-semibold uppercase tracking-wider text-white/75 border border-white/15 bg-white/[0.05] rounded-full px-3 py-1.5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                <a
                  href={pathFromView('equipe-detalhe', member.slug)}
                  onClick={(event) => isPlainLeftClick(event) && event.preventDefault()}
                  className="flex items-center text-brand-cyan font-medium text-sm mt-6 group-hover:translate-x-2 transition-transform"
                >
                  Ver perfil completo
                  <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Chamada final */}
        <div className="border-t border-white/10 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight mb-6">
            Quer conversar com <span className="gradient-text">quem faz</span>?
          </h2>
          <p className="text-white/85 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
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
