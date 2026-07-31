import type React from 'react';
import marcosPhoto from '../../IMAGENS/FOTO MARCOS.webp';
import gustavoPhoto from '../../IMAGENS/Gustavo-Tavares.jpg';
import andersonPhoto from '../../IMAGENS/Anderson-Soares.webp';
import sandroPhoto from '../../IMAGENS/SANDRO-COLNAGO.webp';
import pedroPhoto from '../../IMAGENS/PEDRO-BERNARDES.jpg';

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
  /**
   * Desloca a foto para cima, em % da altura da caixa, quando há espaço vazio
   * acima da cabeça. Só faz efeito junto com photoZoom. Ex.: 14 sobe 14%.
   */
  photoOffsetY?: number;
  /** Uma linha de destaque, exibida no card da listagem. */
  headline: string;
  /** Apresentação curta, exibida no card da listagem. */
  summary: string;
  /** Texto completo da página individual, um item por parágrafo. */
  bio: string[];
  /** Áreas de atuação exibidas como etiquetas. */
  expertise: string[];
  /** Formação, cargos e reconhecimentos, exibidos na página individual. */
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
    role: 'Fundador & Consultor',
    photo: marcosPhoto,
    headline: 'Dirigir a própria operação ensina o que nenhum relatório ensina sobre a operação dos outros.',
    summary:
      'Fundador e CEO da BR Clube de Benefícios e fundador da Cosmmus Business. Há 12 anos à frente do programa Crisálida, une gestão de negócios, cooperativismo e economia solidária — com reconhecimento nacional e internacional.',
    bio: [
      'Marcos Antônio é fundador da BR Clube de Benefícios, onde atua como CEO e presidente, e fundador da Cosmmus Business, consultoria que atende empresas de diversos segmentos. Sua atuação reúne duas perspectivas que raramente se encontram na mesa de consultoria: a de quem dirige a própria operação e a de quem estrutura a operação dos outros.',
      'Há 12 anos coordena o programa Crisálida, voltado ao combate à extrema pobreza e à redução de vulnerabilidades sociais. Sustentar um programa por mais de uma década, com reconhecimento nacional e internacional, é um exercício de gestão em estado puro: diagnóstico, método, indicadores e continuidade — exatamente os pilares que sustentam um plano de negócios.',
      'Foi presidente do Conselho Regional de Economia Acadêmico de Goiás e da Federação Nacional de Estudantes de Economia, além de integrar o Fórum Nacional pela Redução das Desigualdades Sociais. Como palestrante e instrutor de cooperativismo, atua em todo o país — experiência que sustenta diretamente a frente Cosmmus Coop, dedicada a cooperativas.',
      'O trabalho rendeu reconhecimentos: o prêmio de cultura e extensão da Universidade Federal de Goiás (2016), pelo projeto "Do Individualismo no Lixão à Solidariedade na Cooperativa", e a Comenda Honestino Guimarães (2017). Foi convidado pelo Papa Francisco a apresentar as metodologias do Crisálida no Encontro Economia de Francisco, ocasião em que lhe entregou um exemplar de "O Dia que a Terra Voltou a Sorrir", livro infantil sobre economia solidária e sustentabilidade que escreveu com a jornalista Paula Fernandes.',
      'Vereador em Goiânia e comentarista semanal em emissoras de rádio da capital, leva ao debate público a mesma leitura que aplica às empresas: sustentabilidade e resultado não são caminhos opostos.',
    ],
    expertise: ['Gestão de Negócios', 'Cooperativismo', 'Economia Solidária', 'Sustentabilidade'],
    credentials: [
      'Comenda Honestino Guimarães (2017)',
      'Prêmio de Cultura e Extensão — Universidade Federal de Goiás (2016)',
      'Ex-presidente da Federação Nacional de Estudantes de Economia',
      'Ex-presidente do Conselho Regional de Economia Acadêmico de Goiás',
      'Coautor do livro infantil "O Dia que a Terra Voltou a Sorrir"',
    ],
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
    slug: 'sandro-colnago',
    name: 'Sandro Colnago',
    role: 'Psicólogo · Recursos Humanos',
    photo: sandroPhoto,
    // Plano mais aberto e com bastante teto acima da cabeça: aproxima e sobe
    photoZoom: 1.4,
    photoOffsetY: 18,
    headline: 'Gente não é recurso a administrar. É o que decide se a estratégia acontece.',
    summary:
      'Psicólogo, atua em Recursos Humanos. Traz para a Cosmmus Business a leitura do fator humano do trabalho — a dimensão que sustenta ou derruba qualquer plano de gestão.',
    bio: [
      'Psicólogo, Sandro atua na frente de Recursos Humanos da Cosmmus Business — a área que cuida de quem faz a empresa funcionar. É dele o olhar sobre como as pessoas efetivamente vivem a organização: o que motiva, o que desgasta e o que sustenta o trabalho no dia a dia.',
      'Essa leitura raramente aparece nas planilhas, mas sempre aparece nos números: no atestado recorrente, na rotatividade que não cede, na equipe que entrega menos sem que ninguém saiba explicar por quê. Plano de negócios nenhum se cumpre sem as pessoas que vão executá-lo.',
      'Sua atuação conecta a gestão de pessoas à realidade de quem executa: escuta qualificada, leitura dos fatores psicossociais do trabalho e medidas que a operação consiga sustentar — porque prática de RH que não cabe na rotina não muda nada.',
    ],
    expertise: ['Recursos Humanos', 'Gestão de Pessoas', 'Riscos Psicossociais', 'Clima Organizacional'],
    credentials: [],
  },
  {
    slug: 'pedro-bernardes',
    name: 'Pedro Bernardes',
    role: 'Advogado · Professor Universitário',
    photo: pedroPhoto,
    // Plano de corpo inteiro, como o do Anderson: aproxima para igualar o rosto
    photoZoom: 1.5,
    headline: 'Conformidade não é custo. É o que impede o passivo que ninguém viu chegando.',
    summary:
      'Advogado há mais de 12 anos, especialista em Direito do Trabalho e Cível, e professor universitário. Atua para trazer segurança jurídica e conformidade às empresas.',
    bio: [
      'Advogado há mais de 12 anos, Pedro é especialista em Direito do Trabalho e Cível — justamente as duas frentes em que a empresa costuma descobrir, tarde, que uma decisão de gestão tinha consequência jurídica.',
      'Sua atuação na Cosmmus Business é trazer segurança jurídica e conformidade ao negócio: contratos, rotinas e práticas que sustentam o crescimento sem acumular passivo. A conta de uma prática irregular raramente chega no mês em que ela acontece — chega anos depois, corrigida e com juros.',
      'Professor universitário, traz para a consultoria o hábito de explicar. Não basta apontar o risco: quem decide precisa entender de onde ele vem, para que a correção sobreviva à reunião em que foi combinada.',
    ],
    expertise: ['Direito do Trabalho', 'Direito Cível', 'Conformidade', 'Segurança Jurídica'],
    credentials: ['Professor universitário', 'Mais de 12 anos de advocacia'],
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
  // Limita o deslocamento ao espaço que a aproximação criou, para não sobrar vazio
  const maxOffset = (zoom - 1) * 100;
  const offset = Math.min(Math.max(member.photoOffsetY ?? 0, 0), maxOffset);

  return {
    width: `${zoom * 100}%`,
    height: `${zoom * 100}%`,
    left: `${((1 - zoom) / 2) * 100}%`,
    top: `${-offset}%`,
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
