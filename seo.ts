import { ViewState } from './types';
import { getMemberBySlug } from './components/equipe/teamData';
import {
  COOP_IMAGE,
  COOP_IMAGE_ALT,
  DEFAULT_IMAGE,
  DEFAULT_IMAGE_ALT,
  SITE_NAME,
  SITE_URL,
  VIEW_SEO,
  SeoEntry,
} from './seoData';

export { SITE_URL, SITE_NAME };

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SEO
 *
 * O site é uma SPA: o HTML entregue pelo servidor é sempre o mesmo. Para que
 * cada endereço apareça no Google com título e descrição próprios, as tags são
 * reescritas no navegador a cada troca de view (o Googlebot executa JavaScript
 * antes de indexar).
 *
 * Os textos de cada página estão em seoData.ts, que o build também lê para
 * gerar um HTML por endereço (é o que WhatsApp, Facebook e LinkedIn enxergam,
 * já que não rodam JavaScript). Esta troca no navegador mantém título e
 * descrição certos para quem navega pelo site e para o Googlebot.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Corta a descrição no limite que os buscadores costumam exibir. */
const trim = (text: string, max = 158): string =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

const seoForMember = (slug: string): SeoEntry | null => {
  const member = getMemberBySlug(slug);
  if (!member) return null;
  return {
    title: `${member.name} — ${member.role} | ${SITE_NAME}`,
    description: trim(member.summary),
  };
};

const upsertMeta = (attr: 'name' | 'property', key: string, content: string): void => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const upsertCanonical = (url: string): void => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
};

/** Dados estruturados da página individual de cada profissional (schema.org/Person). */
const MEMBER_JSONLD_ID = 'member-jsonld';

const setMemberJsonLd = (slug: string | null): void => {
  const existing = document.getElementById(MEMBER_JSONLD_ID);
  const member = slug ? getMemberBySlug(slug) : undefined;

  if (!member) {
    existing?.remove();
    return;
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    description: member.summary,
    url: `${SITE_URL}/equipe/${member.slug}`,
    ...(member.photo ? { image: new URL(member.photo, SITE_URL).href } : {}),
    ...(member.linkedin ? { sameAs: [member.linkedin] } : {}),
    knowsAbout: member.expertise,
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const script = (existing as HTMLScriptElement | null) ?? document.createElement('script');
  script.id = MEMBER_JSONLD_ID;
  (script as HTMLScriptElement).type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
};

/**
 * Atualiza título, descrição, canonical e Open Graph de acordo com a view atual.
 * Views sem endereço próprio (detalhes de serviço e de case) reaproveitam os
 * dados da página inicial, já que continuam respondendo na raiz.
 */
export const applySeo = (view: ViewState, memberSlug: string | null, path: string): void => {
  const entry =
    (view === 'equipe-detalhe' && memberSlug ? seoForMember(memberSlug) : null) ||
    VIEW_SEO[view] ||
    VIEW_SEO.home!;

  const url = `${SITE_URL}${path === '/' ? '/' : path}`;

  document.title = entry.title;
  upsertMeta('name', 'description', entry.description);
  upsertCanonical(url);

  upsertMeta('property', 'og:title', entry.title);
  upsertMeta('property', 'og:description', entry.description);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:type', view === 'equipe-detalhe' ? 'profile' : 'website');
  const isCoop = entry.image === COOP_IMAGE;
  const image = entry.image || DEFAULT_IMAGE;
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:image:alt', isCoop ? COOP_IMAGE_ALT : DEFAULT_IMAGE_ALT);

  upsertMeta('name', 'twitter:title', entry.title);
  upsertMeta('name', 'twitter:description', entry.description);
  upsertMeta('name', 'twitter:image', image);
  upsertMeta('name', 'twitter:image:alt', isCoop ? COOP_IMAGE_ALT : DEFAULT_IMAGE_ALT);

  upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1');

  setMemberJsonLd(view === 'equipe-detalhe' ? memberSlug : null);
};
