import type { ViewState } from './types';

/**
 * Caminho de cada view que tem endereço próprio.
 *
 * Fica num arquivo à parte, sem importar imagens nem componentes, porque o
 * build (vite.config.ts) também lê este mapa para gerar o HTML de cada página.
 * Veja as observações em routes.ts antes de mudar um caminho.
 */
export const ROUTES: Partial<Record<ViewState, string>> = {
  about: '/sobre',
  equipe: '/equipe',
  services: '/areas-de-atuacao',
  methodology: '/metodologia',
  cases: '/cases',
  blog: '/conteudos',
  contact: '/contato',
  aplicacao: '/aplicacaocosmmus',
  diagnostico: '/diagnostico',
  coop: '/cosmmus-coop',
};
