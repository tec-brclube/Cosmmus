import React from 'react';

interface CoopOrbitProps {
  /** O símbolo que fica no centro. */
  children: React.ReactNode;
  /** Cores do degradê, do verde ao roxo. */
  colors: [string, string, string, string];
}

/** Estrelas ao redor da órbita: posição (%), tamanho (px) e atraso da piscada (s). */
const STARS = [
  { top: 6, left: 18, size: 3, delay: 0 },
  { top: 14, left: 86, size: 2, delay: 1.2 },
  { top: 34, left: 2, size: 2, delay: 2.1 },
  { top: 48, left: 97, size: 3, delay: 0.6 },
  { top: 72, left: 6, size: 2, delay: 1.7 },
  { top: 88, left: 30, size: 3, delay: 2.6 },
  { top: 93, left: 74, size: 2, delay: 0.9 },
  { top: 24, left: 60, size: 2, delay: 3.1 },
  { top: 66, left: 90, size: 2, delay: 1.4 },
];

/** Ponto de uma órbita, preso a um ângulo do anel que gira. */
const Dot: React.FC<{ color: string; angle: number; size: number }> = ({ color, angle, size }) => (
  <span className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
    <span
      className="absolute left-1/2 top-0 rounded-full"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
    />
  </span>
);

/**
 * Abertura em movimento: o símbolo no centro de uma pequena órbita, com pontos
 * nas cores do degradê girando em volta — cooperados em torno de um centro
 * comum — e estrelas piscando, como o céu do resto do site.
 *
 * Tudo em CSS, sem JavaScript por quadro. Quem pede menos movimento vê a
 * composição parada.
 */
const CoopOrbit: React.FC<CoopOrbitProps> = ({ children, colors }) => {
  const [green, teal, blue, violet] = colors;

  return (
    <div className="coop-orbit relative aspect-square w-full" aria-hidden="true">
      <style>{`
        @keyframes coop-orbit-spin { to { transform: rotate(360deg); } }
        @keyframes coop-orbit-twinkle { 0%, 100% { opacity: .15; transform: scale(.7); } 50% { opacity: 1; transform: scale(1); } }
        .coop-orbit-ring { animation: coop-orbit-spin var(--coop-orbit-speed) linear infinite; }
        .coop-orbit-ring.is-reverse { animation-direction: reverse; }
        .coop-orbit-star { animation: coop-orbit-twinkle 3.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .coop-orbit-ring, .coop-orbit-star { animation: none; }
          .coop-orbit-star { opacity: .6; }
        }
      `}</style>

      {/* Brilho atrás de tudo */}
      <div
        className="absolute inset-[18%] rounded-full blur-[70px] opacity-40"
        style={{ backgroundImage: `linear-gradient(90deg, ${green}, ${blue}, ${violet})` }}
      />

      {/* Trilhas das órbitas */}
      <div className="absolute inset-[4%] rounded-full border border-white/[0.14]" />
      <div className="absolute inset-[17%] rounded-full border border-dashed border-white/[0.14]" />

      {/* Órbita externa, no sentido horário */}
      <div className="coop-orbit-ring absolute inset-[4%]" style={{ ['--coop-orbit-speed' as string]: '38s' }}>
        <Dot color={green} angle={0} size={12} />
        <Dot color={blue} angle={130} size={9} />
        <Dot color={violet} angle={240} size={10} />
      </div>

      {/* Órbita interna, no sentido contrário e mais rápida */}
      <div className="coop-orbit-ring is-reverse absolute inset-[17%]" style={{ ['--coop-orbit-speed' as string]: '24s' }}>
        <Dot color={teal} angle={60} size={8} />
        <Dot color={violet} angle={200} size={7} />
        <Dot color={green} angle={300} size={6} />
      </div>

      {/* Estrelas */}
      {STARS.map((star, index) => (
        <span
          key={index}
          className="coop-orbit-star absolute rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Símbolo no centro */}
      <div className="absolute inset-[26%]">{children}</div>
    </div>
  );
};

export default CoopOrbit;
