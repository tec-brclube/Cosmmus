import type React from 'react';
import { ViewState } from './types';
import { getMemberBySlug } from './components/equipe/teamData';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ROTAS
 *
 * Cada view listada aqui responde em um endereço próprio. Endereço próprio é o
 * que permite ao Google indexar a página separadamente e ao visitante
 * compartilhar o link — por isso os itens de menu são links reais (<a href>),
 * e não apenas botões.
 *
 * Ao mudar um caminho, lembre que links já compartilhados deixam de funcionar,
 * e que o mesmo caminho precisa constar em vercel.json e em public/sitemap.xml.
 * ─────────────────────────────────────────────────────────────────────────────
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
};

/** Prefixo das páginas individuais da equipe: /equipe/<slug> */
export const MEMBER_PREFIX = '/equipe/';

export interface Route {
  view: ViewState;
  memberSlug?: string;
}

export const routeFromPath = (pathname: string): Route | null => {
  const normalized = pathname.replace(/\/+$/, '').toLowerCase() || '/';

  if (normalized.startsWith(MEMBER_PREFIX)) {
    const slug = normalized.slice(MEMBER_PREFIX.length);
    // Slug desconhecido cai na listagem, evitando uma página vazia
    return getMemberBySlug(slug) ? { view: 'equipe-detalhe', memberSlug: slug } : { view: 'equipe' };
  }

  const entry = Object.entries(ROUTES).find(([, path]) => path === normalized);
  return entry ? { view: entry[0] as ViewState } : null;
};

/** Endereço correspondente ao estado atual da navegação. */
export const pathFromView = (view: ViewState, memberSlug: string | null): string => {
  if (view === 'equipe-detalhe' && memberSlug) return `${MEMBER_PREFIX}${memberSlug}`;
  return ROUTES[view] || '/';
};

/**
 * Clique em link interno: deixa o navegador cuidar de "abrir em nova aba"
 * (Ctrl/Cmd/Shift ou botão do meio) e, no clique comum, navega sem recarregar.
 */
export const isPlainLeftClick = (event: React.MouseEvent): boolean =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
