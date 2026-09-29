import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface OficinaVideoProps {
  src: string;
  poster: string;
  label: string;
  /** Quem pede menos movimento: o vídeo não toca sozinho e ganha os controles do navegador. */
  reduceMotion: boolean;
}

/**
 * Cada navegador expõe de um jeito se o arquivo tem trilha de áudio. Nenhum
 * desses campos está no padrão, por isso a leitura é defensiva.
 */
const hasAudioTrack = (video: HTMLVideoElement): boolean => {
  const v = video as HTMLVideoElement & {
    mozHasAudio?: boolean;
    webkitAudioDecodedByteCount?: number;
    audioTracks?: { length: number };
  };
  return Boolean(v.mozHasAudio || v.webkitAudioDecodedByteCount || v.audioTracks?.length);
};

/**
 * Vídeo da oficina: começa sem som, porque os navegadores bloqueiam vídeo que
 * toca sozinho com áudio. O botão de som só aparece quando o arquivo de fato
 * tem áudio — um botão que não faz nada seria pior que nenhum.
 */
const OficinaVideo: React.FC<OficinaVideoProps> = ({ src, poster, label, reduceMotion }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasAudio) return;

    // No Chrome o sinal só aparece depois de alguns quadros decodificados
    const check = () => {
      if (hasAudioTrack(video)) setHasAudio(true);
    };
    video.addEventListener('loadeddata', check);
    video.addEventListener('timeupdate', check);
    return () => {
      video.removeEventListener('loadeddata', check);
      video.removeEventListener('timeupdate', check);
    };
  }, [hasAudio]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted && video.paused) void video.play();
  };

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        autoPlay={!reduceMotion}
        controls={reduceMotion}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
      {hasAudio && !reduceMotion && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? 'Ligar o som do vídeo' : 'Desligar o som do vídeo'}
          aria-pressed={!muted}
          className="absolute right-3 bottom-3 flex items-center gap-2 h-10 rounded-full bg-[#07051a]/80 backdrop-blur border border-white/15 px-3.5 text-xs font-semibold text-white hover:bg-[#07051a] hover:border-white/40 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19c46e]"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {muted ? 'Ligar o som' : 'Som ligado'}
        </button>
      )}
    </div>
  );
};

export default OficinaVideo;
