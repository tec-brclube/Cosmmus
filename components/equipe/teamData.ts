import type React from 'react';
import marcosPhoto from '../../IMAGENS/FOTO MARCOS.webp';
import gustavoPhoto from '../../IMAGENS/Gustavo-Tavares.jpg';
import andersonPhoto from '../../IMAGENS/Anderson-Soares.webp';

export interface TeamMember {
  /** Identificador usado na URL: /equipe/<slug> */
  slug: string;
  name: string;
  role: string;
  /** Foto em formato retrato (proporção 2:3 ou 3:4 funcionam melhor). */
  photo?: string;
  /**
   * Aproximação da foto, para igualar o enquadramento entre retratos diferentes.
   * 1 = foto inteira (padrão) · 1.5 = 50% mais perto · útil quando a foto é de
   * corpo inteiro e o rosto fica pequeno ao lado dos demais. A aproximação
   * parte do topo, preservando a cabeça.
   */
  photoZoom?: number;
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
    slug: 'gustavo-tavares',
    name: 'Gustavo Tavares',
    role: 'Economista',
    photo: gustavoPhoto,
    headline: 'Plano que não cabe na operação não é estratégia — é intenção.',
    summary:
      'Economista formado pela Universidade Federal de Goiás. Une gestão administrativa e financeira à elaboração de projetos, conduzindo equipes para transformar diagnóstico em execução.',
    bio: [
      'Economista formado pela Universidade Federal de Goiás (UFG), Gustavo construiu sua trajetória na fronteira entre a gestão administrativa e a financeira — o ponto exato em que se decide se um plano sai do papel ou fica na apresentação.',
      'Sua experiência reúne três frentes que raramente andam juntas: a estruturação administrativa e financeira, a elaboração de projetos e o gerenciamento de equipes. É essa combinação que permite desenhar um caminho viável e, ao mesmo tempo, sustentar quem vai percorrê-lo.',
      'Na Cosmmus Business, atua para que a análise econômica se converta em rotina possível: números com lastro na operação, projetos com responsáveis definidos e equipes que sabem exatamente qual é o próximo passo.',
    ],
    expertise: ['Gestão Administrativa e Financeira', 'Elaboração de Projetos', 'Gerenciamento de Equipes'],
    credentials: ['Economia — Universidade Federal de Goiás (UFG)'],
  },
  {
    slug: 'anderson-soares',
    name: 'Anderson Soares',
    role: 'Contador',
    photo: andersonPhoto,
    // Foto de corpo inteiro: aproxima para o rosto ficar do tamanho dos demais
    photoZoom: 1.55,
    headline: 'Contabilidade organizada é o que separa a empresa que decide da que descobre tarde.',
    summary:
      'Contador com dez anos de atuação dedicados a aprimorar as rotinas contábeis de empresas — do registro correto no dia a dia à informação confiável na hora da decisão.',
    bio: [
      'Há dez anos Anderson trabalha para que a contabilidade deixe de ser apenas obrigação a cumprir e passe a ser instrumento de gestão. Sua atuação se concentra no aprimoramento das rotinas contábeis das empresas — a base silenciosa sobre a qual todo o resto se apoia.',
      'Rotina bem construída significa lançamento no lugar certo, prazo cumprido sem correria e relatório que reflete a realidade do negócio. Quando essa base falha, o efeito aparece longe dali: no preço mal calculado, no imposto pago a mais, na decisão tomada com número desatualizado.',
      'Na Cosmmus Business, é quem garante que os dados que chegam à mesa de decisão sejam confiáveis — porque nenhum plano financeiro se sustenta sobre informação frágil.',
    ],
    expertise: ['Contabilidade Empresarial', 'Rotinas Contábeis', 'Gestão Contábil'],
    credentials: [],
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

/**
 * Estilo que aplica a aproximação da foto.
 *
 * Amplia o próprio elemento <img> em vez de usar transform, para não conflitar
 * com a animação de hover dos cards. O deslocamento lateral mantém a pessoa
 * centralizada; o topo fica ancorado para nunca cortar a cabeça.
 */
export const getPhotoStyle = (member: TeamMember): React.CSSProperties | undefined => {
  const zoom = member.photoZoom;
  if (!zoom || zoom <= 1) return undefined;
  return {
    width: `${zoom * 100}%`,
    height: `${zoom * 100}%`,
    left: `${((1 - zoom) / 2) * 100}%`,
    top: 0,
    // O reset do Tailwind aplica max-width:100% em <img>, o que travaria a
    // largura no tamanho da caixa e deslocaria a foto para a esquerda.
    maxWidth: 'none',
    maxHeight: 'none',
  };
};

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
