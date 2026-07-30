import React from 'react';
import { ArrowLeft, ArrowRight, GraduationCap, Linkedin, Mail } from 'lucide-react';
import { getInitials, getMemberBySlug, teamMembers } from './teamData';

interface MemberPageProps {
  slug: string;
  onBack: () => void;
  onViewMember: (slug: string) => void;
  onCtaClick?: () => void;
}

const MemberPage: React.FC<MemberPageProps> = ({ slug, onBack, onViewMember, onCtaClick }) => {
  const member = getMemberBySlug(slug);

  // Slug inexistente (link antigo ou digitado à mão): volta para a listagem
  if (!member) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-6">
          Profissional não encontrado
        </h1>
        <p className="text-white/70 font-light leading-relaxed mb-10">
          O endereço acessado não corresponde a nenhum profissional da equipe.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="py-4 px-8 rounded-full bg-white text-brand-dark font-bold hover:bg-brand-cyan transition-colors inline-flex items-center gap-3"
        >
          <ArrowLeft size={18} /> Ver a equipe
        </button>
      </div>
    );
  }

  const others = teamMembers.filter((item) => item.slug !== member.slug);

  return (
    <div className="bg-transparent text-white relative overflow-hidden">
      {/* Brilhos de fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[0%] right-[-10%] w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[140px] opacity-30" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-brand-pink/5 rounded-full blur-[150px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Voltar */}
        <button
          type="button"
          onClick={onBack}
          className="mt-12 mb-10 inline-flex items-center gap-2 text-sm text-white/60 hover:text-brand-cyan transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para a equipe
        </button>

        {/* Perfil */}
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 pb-24">
          {/* Retrato */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-32">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl shadow-brand-purple/20 bg-brand-surface/40">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-navy via-brand-surface to-brand-dark">
                    <div className="w-32 h-32 rounded-full gradient-bg flex items-center justify-center mb-5 opacity-90">
                      <span className="text-4xl font-black text-white tracking-tight">{getInitials(member.name)}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                      Foto em breve
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
              </div>

              {/* Contatos */}
              {(member.linkedin || member.email) && (
                <div className="flex items-center gap-3 mt-6">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-5 rounded-full border border-white/10 bg-white/[0.03] text-white/80 text-sm font-semibold hover:border-brand-cyan hover:text-brand-cyan transition-all flex items-center justify-center gap-2"
                    >
                      <Linkedin size={16} /> LinkedIn
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex-1 py-3 px-5 rounded-full border border-white/10 bg-white/[0.03] text-white/80 text-sm font-semibold hover:border-brand-pink hover:text-brand-pink transition-all flex items-center justify-center gap-2"
                    >
                      <Mail size={16} /> E-mail
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Texto */}
          <div className="lg:col-span-3">
            <span className="text-brand-cyan font-bold tracking-widest uppercase text-xs mb-5 block">
              {member.role}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tighter mb-8">
              {member.name}
            </h1>

            <p className="text-xl md:text-2xl text-white font-light leading-snug border-l-2 border-brand-pink pl-6 py-1 mb-10">
              {member.headline}
            </p>

            <div className="space-y-6 text-lg text-white/70 font-light leading-relaxed mb-12">
              {member.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Áreas de atuação */}
            {member.expertise.length > 0 && (
              <div className="mb-12">
                <h2 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-5">Áreas de atuação</h2>
                <div className="flex flex-wrap gap-3">
                  {member.expertise.map((item) => (
                    <span
                      key={item}
                      className="text-sm font-medium text-white/80 border border-white/10 bg-white/[0.03] rounded-full px-5 py-2.5"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Formação */}
            {member.credentials.length > 0 && (
              <div className="rounded-3xl border border-white/10 bg-brand-surface/40 backdrop-blur-xl p-8">
                <h2 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-6">
                  Formação e certificações
                </h2>
                <ul className="space-y-4">
                  {member.credentials.map((item) => (
                    <li key={item} className="flex items-start gap-4 text-white/80 font-light">
                      <GraduationCap size={20} className="text-brand-purple flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Demais profissionais */}
        <div className="border-t border-white/10 py-20">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-10">Conheça o restante do time</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {others.map((other) => (
              <button
                key={other.slug}
                type="button"
                onClick={() => onViewMember(other.slug)}
                className="group text-left rounded-2xl border border-white/10 bg-brand-surface/40 backdrop-blur-xl p-5 hover:border-white/20 hover:shadow-xl hover:shadow-brand-purple/20 transition-all duration-500 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-brand-navy">
                  {other.photo ? (
                    <img src={other.photo} alt={other.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full gradient-bg flex items-center justify-center">
                      <span className="text-sm font-black text-white">{getInitials(other.name)}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold leading-tight truncate group-hover:text-brand-cyan transition-colors">
                    {other.name}
                  </p>
                  <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mt-1 truncate">
                    {other.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chamada final */}
        <div className="border-t border-white/10 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight mb-6">
            Vamos construir <span className="gradient-text">o próximo capítulo</span>?
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

export default MemberPage;
