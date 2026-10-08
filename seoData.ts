import type { ViewState } from './types';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Textos de SEO de cada página.
 *
 * Ficam num arquivo à parte, sem importar imagens nem componentes, porque são
 * lidos em dois lugares: pelo navegador (seo.ts, a cada troca de página) e pelo
 * build (vite.config.ts), que gera um HTML por endereço. O segundo é o que
 * importa para compartilhar links: WhatsApp, Facebook, LinkedIn e X não rodam
 * JavaScript, então só enxergam o que já está no HTML entregue pelo servidor.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Endereço público do site — usado em canonical, Open Graph e sitemap. */
export const SITE_URL = 'https://www.cosmmus.com';

export const SITE_NAME = 'COSMMUS Business';

export const DEFAULT_TITLE = 'COSMMUS Business | Consultoria Empresarial e Plano de Negócios';

export const DEFAULT_DESCRIPTION =
  'Desenvolvendo negócios e potencializando pessoas. Consultoria empresarial em todo o Brasil: plano de negócios, finanças, sustentabilidade e treinamentos.';

export interface SeoEntry {
  title: string;
  description: string;
  /** Imagem da pré-visualização ao compartilhar; sem ela vale a imagem padrão. */
  image?: string;
}

/**
 * Imagens de pré-visualização (1200 × 630, JPG). Precisam ser JPG ou PNG:
 * WhatsApp, Facebook, LinkedIn e X ignoram SVG. Ficam em public/.
 */
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
export const COOP_IMAGE = `${SITE_URL}/og-coop.jpg`;
export const DEFAULT_IMAGE_ALT = 'COSMMUS Business: desenvolvendo negócios e potencializando pessoas';
export const COOP_IMAGE_ALT = 'Cosmmus Coop: cooperativismo e estratégia caminham juntos';

/** Título e descrição de cada view com endereço próprio. */
export const VIEW_SEO: Partial<Record<ViewState, SeoEntry>> = {
  home: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  about: {
    title: 'Sobre Nós | COSMMUS Business',
    description:
      'Não somos consultores, somos arquitetos de legado. Conheça o manifesto da COSMMUS Business e a forma como unimos a precisão dos números à força das relações humanas.',
  },
  equipe: {
    title: 'Equipe | COSMMUS Business',
    description:
      'Economistas, contadores, advogados, psicólogos e designers que assinam os projetos da COSMMUS Business. Conheça a trajetória de cada profissional.',
  },
  services: {
    title: 'Áreas de Atuação | COSMMUS Business',
    description:
      'Consultoria, finanças, sustentabilidade, cooperativismo e treinamentos: as soluções da COSMMUS Business para quem não aceita o médio.',
  },
  methodology: {
    title: 'Metodologia | COSMMUS Business',
    description:
      'Diagnóstico de precisão, arquitetura do plano, ativação tática, monitoramento por indicadores e evolução contínua: as cinco etapas do método COSMMUS.',
  },
  cases: {
    title: 'Cases e Projetos | COSMMUS Business',
    description:
      'Cases e projetos da COSMMUS Business: o desafio de cada cliente, a estratégia aplicada e os resultados alcançados.',
  },
  blog: {
    title: 'Conteúdos e Insights | COSMMUS Business',
    description:
      'Conteúdos e insights da COSMMUS Business sobre gestão estratégica, finanças, sustentabilidade e o futuro dos negócios.',
  },
  contact: {
    title: 'Contato | COSMMUS Business',
    description:
      'Fale com a COSMMUS Business e agende uma reunião estratégica para desenhar o próximo ciclo da sua empresa.',
  },
  coop: {
    title: 'Cosmmus Coop | Consultoria para Cooperativas | COSMMUS Business',
    description:
      'Apoiamos cooperativas da constituição à expansão: governança, planejamento, gestão econômica e educação cooperativista, com gestão que respeita a autogestão.',
    image: COOP_IMAGE,
  },
  diagnostico: {
    title: 'Diagnóstico Cosmmus | COSMMUS Business',
    description:
      'Conte em poucos minutos o momento da sua empresa, organização ou ideia: a Cosmmus Business avalia o escopo e monta uma proposta compatível.',
  },
  aplicacao: {
    title: 'NR-01 | Caracterização Organizacional | COSMMUS Business',
    description:
      'Formulário de caracterização organizacional da COSMMUS Business: o primeiro passo para o diagnóstico da sua empresa.',
  },
};
