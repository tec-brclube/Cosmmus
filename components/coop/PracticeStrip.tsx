import React from 'react';

interface Photo {
  src: string;
  alt: string;
  /** Dimensões reais: reservam o espaço antes do carregamento, senão a faixa salta. */
  width: number;
  height: number;
}

interface PracticeStripProps {
  photos: Photo[];
}

/**
 * Faixa de fotos que desliza sem parar e pausa sob o mouse (ou com o foco do
 * teclado). A lista vai duplicada para o fim emendar no começo sem salto: a
 * animação anda exatamente metade da largura e recomeça.
 *
 * Quem pede menos movimento recebe a faixa parada, com rolagem lateral.
 */
const PracticeStrip: React.FC<PracticeStripProps> = ({ photos }) => {
  const renderPhotos = (copy: 'a' | 'b') =>
    photos.map((photo, index) => (
      // Espaço dentro do item, e não gap: assim as duas cópias medem exatamente o mesmo
      <li key={`${copy}-${index}`} className="shrink-0 pr-4">
        <img
          src={photo.src}
          alt={copy === 'a' ? photo.alt : ''}
          width={photo.width}
          height={photo.height}
          className="h-[220px] sm:h-[280px] lg:h-[320px] w-auto rounded-2xl object-cover border border-white/10"
          loading="lazy"
          draggable={false}
        />
      </li>
    ));

  return (
    <div className="coop-strip relative">
      <style>{`
        @keyframes coop-strip-scroll { to { transform: translateX(-50%); } }
        .coop-strip-track { animation: coop-strip-scroll 70s linear infinite; }
        .coop-strip:hover .coop-strip-track,
        .coop-strip:focus-within .coop-strip-track { animation-play-state: paused; }
        .coop-strip-viewport {
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .coop-strip-track { animation: none; }
          .coop-strip-viewport { overflow-x: auto; -webkit-mask-image: none; mask-image: none; }
          .coop-strip-copy { display: none; }
        }
      `}</style>
      <div className="coop-strip-viewport overflow-hidden" tabIndex={0} aria-label="Fotos da Cosmmus Coop na prática">
        <div className="coop-strip-track flex w-max">
          <ul className="flex">{renderPhotos('a')}</ul>
          {/* Segunda cópia só para emendar a animação; leitores de tela ignoram */}
          <ul className="coop-strip-copy flex" aria-hidden="true">
            {renderPhotos('b')}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PracticeStrip;
