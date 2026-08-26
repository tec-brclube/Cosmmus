import { ViewState } from './types';
import { getMemberBySlug } from './components/equipe/teamData';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SEO
 *
 * O site é uma SPA: o HTML entregue pelo servidor é sempre o mesmo. Para que
 * cada endereço apareça no Google com título e descrição próprios, as tags são
 * reescritas no navegador a cada troca de view (o Googlebot executa JavaScript
 * antes de indexar).
 *
 * Os textos abaixo são recortes do conteúdo já publicado em cada página —
 * nenhuma informação nova é introduzida aqui.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Endereço público do site — usado em canonical, Open Graph e sitemap. */
export const SITE_URL = 'https://www.cosmmus.com';

export const SITE_NAME = 'COSMMUS Business';

export const DEFAULT_TITLE = 'COSMMUS Business | Consultoria Empresarial e Plano de Negócios';

export const DEFAULT_DESCRIPTION =
  'Desenvolvendo negócios e potencializando pessoas. Consultoria empresarial em todo o Brasil: plano de negócios, finanças, sustentabilidade e treinamentos.';

/** Imagem de pré-visualização usada ao compartilhar links. */
const SOCIAL_IMAGE = `${SITE_URL}/og-image.svg`;

interface SeoEntry {
  title: string;
  description: string;
}

/** Título e descrição de cada view com endereço próprio. */
const VIEW_SEO: Partial<Record<ViewState, SeoEntry>> = {
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
  upsertMeta('property', 'og:image', SOCIAL_IMAGE);

  upsertMeta('name', 'twitter:title', entry.title);
  upsertMeta('name', 'twitter:description', entry.description);
  upsertMeta('name', 'twitter:image', SOCIAL_IMAGE);

  upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1');

  setMemberJsonLd(view === 'equipe-detalhe' ? memberSlug : null);
};
