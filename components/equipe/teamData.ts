import marcosPhoto from '../../IMAGENS/FOTO MARCOS.webp';

export interface TeamMember {
  /** Identificador usado na URL: /equipe/<slug> */
  slug: string;
  name: string;
  role: string;
  /** Foto em formato retrato (proporção 2:3 ou 3:4 funcionam melhor). */
  photo?: string;
  /** Uma linha de destaque, exibida no card da listagem. */
  headline: string;
  /** Apresentação curta, exibida no card da listagem. */
  summary: string;
  /** Texto completo da página individual, um item por parágrafo. */
  bio: string[];
  /** Áreas de atuação exibidas como etiquetas. */
  expertise: string[];
  /** Formação acadêmica e certificações, exibidas na página individual. */
  credentials: string[];
  linkedin?: string;
  email?: string;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DADOS DA EQUIPE
 *
 * Este arquivo concentra todo o conteúdo das páginas de equipe:
 *   /equipe            → listagem dos profissionais
 *   /equipe/<slug>     → página individual de cada um
 *
 * Os textos entre colchetes [ ] são marcadores a substituir pelos dados reais.
 *
 * Para adicionar a foto de um profissional:
 *   1. coloque o arquivo em IMAGENS/ (formato retrato, .webp de preferência)
 *   2. importe no topo deste arquivo, ex.: import anaPhoto from '../../IMAGENS/FOTO ANA.webp';
 *   3. informe photo: anaPhoto no item correspondente
 *
 * O slug aparece na URL — se alterar, links já compartilhados deixam de funcionar.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const teamMembers: TeamMember[] = [
  {
    slug: 'marcos-antonio',
    name: 'Marcos Antônio da Silva e Silva',
    role: 'Fundador & CEO',
    photo: marcosPhoto,
    headline: '[Uma frase que resume a atuação de Marcos Antônio]',
    summary:
      '[Apresentação curta de Marcos Antônio, 2 a 3 linhas, exibida no card da listagem.]',
    bio: [
      '[Primeiro parágrafo: trajetória profissional de Marcos Antônio — onde atuou, o que construiu e o que o levou a fundar a Cosmmus Business.]',
      '[Segundo parágrafo: como ele atua hoje dentro da consultoria, que frentes lidera e qual é a sua abordagem com os clientes.]',
      '[Terceiro parágrafo (opcional): visão, propósito ou uma marca pessoal de trabalho.]',
    ],
    expertise: ['[Área de atuação 1]', '[Área de atuação 2]', '[Área de atuação 3]'],
    credentials: ['[Formação acadêmica]', '[Pós-graduação ou especialização]', '[Certificação relevante]'],
  },
  {
    slug: 'profissional-2',
    name: '[Nome do segundo profissional]',
    role: '[Cargo ou função]',
    headline: '[Uma frase que resume a atuação deste profissional]',
    summary: '[Apresentação curta, 2 a 3 linhas, exibida no card da listagem.]',
    bio: [
      '[Primeiro parágrafo: trajetória profissional — formação, experiências anteriores e como chegou à Cosmmus Business.]',
      '[Segundo parágrafo: que frentes conduz na consultoria e como é a sua atuação junto aos clientes.]',
    ],
    expertise: ['[Área de atuação 1]', '[Área de atuação 2]', '[Área de atuação 3]'],
    credentials: ['[Formação acadêmica]', '[Pós-graduação ou especialização]'],
  },
  {
    slug: 'profissional-3',
    name: '[Nome do terceiro profissional]',
    role: '[Cargo ou função]',
    headline: '[Uma frase que resume a atuação deste profissional]',
    summary: '[Apresentação curta, 2 a 3 linhas, exibida no card da listagem.]',
    bio: [
      '[Primeiro parágrafo: trajetória profissional — formação, experiências anteriores e como chegou à Cosmmus Business.]',
      '[Segundo parágrafo: que frentes conduz na consultoria e como é a sua atuação junto aos clientes.]',
    ],
    expertise: ['[Área de atuação 1]', '[Área de atuação 2]', '[Área de atuação 3]'],
    credentials: ['[Formação acadêmica]', '[Pós-graduação ou especialização]'],
  },
  {
    slug: 'profissional-4',
    name: '[Nome do quarto profissional]',
    role: '[Cargo ou função]',
    headline: '[Uma frase que resume a atuação deste profissional]',
    summary: '[Apresentação curta, 2 a 3 linhas, exibida no card da listagem.]',
    bio: [
      '[Primeiro parágrafo: trajetória profissional — formação, experiências anteriores e como chegou à Cosmmus Business.]',
      '[Segundo parágrafo: que frentes conduz na consultoria e como é a sua atuação junto aos clientes.]',
    ],
    expertise: ['[Área de atuação 1]', '[Área de atuação 2]', '[Área de atuação 3]'],
    credentials: ['[Formação acadêmica]', '[Pós-graduação ou especialização]'],
  },
];

export const getMemberBySlug = (slug: string): TeamMember | undefined =>
  teamMembers.find((member) => member.slug === slug);

/** Iniciais exibidas enquanto não há foto (ignora preposições e marcadores). */
export const getInitials = (name: string): string => {
  const clean = name.replace(/[[\]]/g, '');
  const parts = clean
    .split(' ')
    .filter((part) => part.length > 2 && !['da', 'de', 'do', 'dos', 'das'].includes(part.toLowerCase()));
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase() || '••';
};
