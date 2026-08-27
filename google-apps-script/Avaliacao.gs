/**
 * COSMMUS BUSINESS — Modelo de dimensionamento (IPC)
 *
 * Adaptação do "Pré-Diagnóstico Cosmmus Business v1.1" às perguntas do
 * formulário Diagnóstico Cosmmus do site.
 *
 * Cada resposta vira uma nota de 1 a 4 em nove dimensões. A soma é o IPC
 * (Índice de Complexidade do Projeto), de 9 a 36, que define o nível do
 * projeto e, a partir dele, horas, equipe, prazo e faixa de preço.
 *
 * O princípio do modelo: o IPC mede ESFORÇO DE CONSULTORIA, não porte do
 * cliente. Uma empresa pequena e desorganizada pode dar mais trabalho que uma
 * grande e estruturada.
 *
 * A faixa de preço é referência interna para montar a proposta, nunca preço
 * automático: toda linha nasce com "Aguardando revisão humana".
 *
 * ── PARA CALIBRAR ──
 * Depois de alguns projetos, compare horas previstas com realizadas e ajuste
 * PARAMETROS e NIVEIS abaixo. É para isso que ficam no topo do arquivo.
 */

/** Taxas-hora internas e reserva de escopo. Premissas v1.0 de 25/08/2026. */
var PARAMETROS = {
  reservaEscopo: 0.1, // 10% para incerteza de escopo
  valorMinimo: 0, // piso comercial; 0 = sem piso
  taxas: {
    analista: 220,
    consultor: 340,
    senior: 520,
    direcao: 680,
  },
};

/** Faixas de IPC e o que cada nível implica. */
var NIVEIS = [
  {
    nome: 'Nível I | Essencial',
    ipcMin: 9, ipcMax: 14,
    horasMin: 16, horasMax: 28,
    equipe: '1–2', prazo: '1–3 semanas',
    mix: { analista: 0.4, consultor: 0.4, senior: 0.15, direcao: 0.05 },
  },
  {
    nome: 'Nível II | Estruturado',
    ipcMin: 15, ipcMax: 21,
    horasMin: 28, horasMax: 50,
    equipe: '2', prazo: '3–5 semanas',
    mix: { analista: 0.3, consultor: 0.45, senior: 0.2, direcao: 0.05 },
  },
  {
    nome: 'Nível III | Amplo',
    ipcMin: 22, ipcMax: 28,
    horasMin: 50, horasMax: 90,
    equipe: '2–3', prazo: '5–8 semanas',
    mix: { analista: 0.25, consultor: 0.45, senior: 0.22, direcao: 0.08 },
  },
  {
    nome: 'Nível IV | Alta Complexidade',
    ipcMin: 29, ipcMax: 36,
    horasMin: 90, horasMax: 160,
    equipe: '3–5', prazo: '8–12 semanas',
    mix: { analista: 0.2, consultor: 0.45, senior: 0.25, direcao: 0.1 },
  },
];

/** Multiplicador de preço conforme a nota de urgência. */
var FATOR_URGENCIA = { 1: 1, 2: 1, 3: 1.1, 4: 1.2 };

/**
 * Tabelas de pontuação: texto exato da resposta → nota de 1 a 4.
 * Resposta que não constar aqui recebe a nota padrão da dimensão.
 */
var PONTOS = {
  // 8A — pessoas envolvidas (trilha de quem ainda está estruturando)
  ideiaPessoas: {
    'Não, apenas eu.': 1,
    'Sim, mais 1 pessoa.': 1,
    'Sim, entre 2 e 5 pessoas.': 2,
    'Sim, entre 6 e 10 pessoas.': 3,
    'Mais de 10 pessoas.': 4,
  },

  // 7B — pessoas na operação
  operacaoPessoas: {
    '1 pessoa.': 1,
    '2 a 5 pessoas.': 1,
    '6 a 10 pessoas.': 2,
    '11 a 20 pessoas.': 2,
    '21 a 50 pessoas.': 3,
    '51 a 100 pessoas.': 3,
    '101 a 250 pessoas.': 4,
    'Mais de 250 pessoas.': 4,
  },

  // 8B — unidades ou locais
  operacaoUnidades: {
    'Apenas uma operação/local.': 1,
    '2 unidades.': 2,
    '3 a 5 unidades.': 3,
    '6 a 10 unidades.': 4,
    'Mais de 10 unidades.': 4,
    'A operação é predominantemente remota ou distribuída.': 3,
  },

  // 9B — áreas ou departamentos
  operacaoAreas: {
    'Ainda não existem áreas claramente definidas.': 1,
    'Até 3.': 1,
    'Entre 4 e 6.': 2,
    'Entre 7 e 10.': 3,
    'Mais de 10.': 4,
    'Não sei informar.': 3,
  },

  // 12 — processos e rotinas
  processos: {
    'Os principais processos estão definidos, documentados e são normalmente seguidos.': 1,
    'Existem processos definidos, mas apenas parte deles está documentada.': 2,
    'As pessoas conhecem suas rotinas, mas existe pouca documentação.': 3,
    'Muitas atividades dependem do conhecimento ou experiência de determinadas pessoas.': 4,
    'Existem atividades sem fluxo, padrão ou responsabilidade claramente definidos.': 4,
    'A operação funciona principalmente de maneira informal e reativa.': 4,
    'Ainda não existem processos porque a iniciativa está sendo criada.': 2,
    'Não sei avaliar.': 3,
  },

  // 13 — responsabilidades e funções
  responsabilidades: {
    'Existe estrutura organizacional clara, com responsabilidades bem definidas.': 1,
    'A maior parte das funções está definida, embora existam algumas sobreposições.': 2,
    'As pessoas sabem aproximadamente o que devem fazer, mas não existe formalização.': 3,
    'Existem muitas sobreposições, dúvidas ou indefinições.': 4,
    'Grande parte das decisões e atividades depende diretamente do fundador ou gestor principal.': 4,
    'Ainda não existe equipe ou estrutura definida.': 2,
    'Não sei avaliar.': 3,
  },

  // 14 — organização financeira
  financeiro: {
    'Existem controles financeiros, fluxo de caixa, orçamento e indicadores atualizados.': 1,
    'Existem bons controles, mas ainda existem informações ou processos a melhorar.': 2,
    'Existem controles básicos de entradas, saídas e compromissos.': 2,
    'Grande parte do controle é realizada por planilhas ou controles manuais.': 3,
    'Existem informações dispersas e dificuldade para consolidar os números.': 3,
    'Temos dificuldade para saber com segurança a situação financeira atual.': 4,
    'A iniciativa ainda não possui movimentação financeira.': 1,
    'Não sei avaliar.': 3,
  },

  // 18 — integração entre ferramentas
  integracao: {
    'Os sistemas estão bem integrados e as informações circulam adequadamente.': 1,
    'Existem algumas integrações, mas ainda realizamos atividades manualmente.': 2,
    'Utilizamos vários sistemas que não se comunicam entre si.': 3,
    'Muitas informações precisam ser repetidas ou transferidas manualmente.': 3,
    'A maior parte das informações está em planilhas, mensagens ou arquivos separados.': 4,
    'Utilizamos pouca tecnologia.': 2,
    'Ainda não se aplica.': 1,
    'Não sei avaliar.': 3,
  },

  // 23 — documentos e informações disponíveis
  documentos: {
    'Estão organizados e podem ser disponibilizados facilmente.': 1,
    'A maior parte existe, mas precisará ser reunida.': 2,
    'Existem informações em diferentes pessoas, sistemas ou locais.': 3,
    'Existem poucos documentos ou registros formalizados.': 4,
    'Não sabemos exatamente quais informações estão disponíveis.': 4,
    'A iniciativa ainda está sendo criada.': 1,
  },

  // 24 — disponibilidade das pessoas para entrevistas e reuniões
  disponibilidade: {
    'Há boa disponibilidade para participação.': 1,
    'Existe disponibilidade, mas precisará ser previamente organizada.': 2,
    'A disponibilidade é limitada.': 3,
    'Pode haver dificuldade para envolver algumas pessoas.': 4,
    'Ainda não sei informar.': 3,
    'Não se aplica.': 1,
  },

  // 25 — prazo e urgência
  urgencia: {
    'Não existe uma data específica.': 1,
    'Gostaríamos de iniciar em breve, mas existe flexibilidade.': 2,
    'Existe uma data importante nos próximos 90 dias.': 3,
    'Existe uma necessidade relevante nos próximos 30 dias.': 4,
    'A situação demanda intervenção ou resposta com urgência.': 4,
    'Existe uma data específica.': 3,
  },
};

/** 5 — objetivos que puxam o entregável para cima. */
var ENTREGAVEIS = {
  quatro: ['Reorganizar ou reestruturar a organização.'],
  tres: [
    'Realizar um Diagnóstico 360º.',
    'Planejar a implantação de um negócio ou projeto.',
    'Desenvolver um projeto específico.',
  ],
  dois: [
    'Elaborar um Plano de Negócios.',
    'Elaborar ou revisar o planejamento estratégico.',
    'Estruturar processos, fluxos e procedimentos.',
    'Avaliar tecnologia, sistemas, dados e automações.',
    'Construir ou revisar o modelo de negócio.',
  ],
};

/** Colunas que o modelo acrescenta à direita das respostas. */
var COLUNAS_AVALIACAO = [
  'IPC (9-36)',
  'Nível',
  'Porte',
  'Maturidade organizacional',
  'Maturidade financeira',
  'Tecnologia e dados',
  'Amplitude do escopo',
  'Qualidade das informações',
  'Disponibilidade das pessoas',
  'Urgência',
  'Entregável',
  'Horas mín.',
  'Horas máx.',
  'Equipe sugerida',
  'Prazo sugerido',
  'Preço referência mín. (R$)',
  'Preço referência máx. (R$)',
  'Alerta',
  'Situação da precificação',
];

/**
 * Resposta de uma pergunta pelo número dela (ex.: '12', '7B', '2.1').
 * Casar pelo número, e não pelo texto inteiro do cabeçalho, mantém o modelo
 * funcionando quando alguém reescreve o enunciado de uma pergunta.
 */
function respostaPorId(headers, row, id) {
  var prefixo = id + ' ';
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).indexOf(prefixo) === 0) return String(row[i] === undefined || row[i] === null ? '' : row[i]).trim();
  }
  return '';
}

/** Nota da tabela; quando a resposta não consta, devolve o padrão. */
function pontuar(tabela, resposta, padrao) {
  if (!resposta) return padrao;
  var nota = tabela[resposta];
  return nota === undefined ? padrao : nota;
}

/** Maior nota entre as informadas — a dimensão vale pelo pior caso. */
function maiorDe(notas) {
  var maior = 0;
  for (var i = 0; i < notas.length; i++) {
    if (notas[i] > maior) maior = notas[i];
  }
  return maior || 1;
}

/** Quantas opções foram marcadas numa pergunta de múltipla escolha. */
function quantasMarcadas(resposta) {
  if (!resposta) return 0;
  return resposta.split(';').filter(function (parte) {
    return parte.trim() !== '';
  }).length;
}

function contem(resposta, trecho) {
  return String(resposta).indexOf(trecho) !== -1;
}

/**
 * Calcula as nove dimensões, o IPC e a faixa de preço de uma resposta.
 * Devolve os valores na ordem de COLUNAS_AVALIACAO.
 */
function avaliar(headers, row) {
  var r = function (id) {
    return respostaPorId(headers, row, id);
  };

  // ── 1. Porte: vale a maior evidência, venha da trilha que vier ──
  var porte = maiorDe([
    pontuar(PONTOS.ideiaPessoas, r('8A'), 0),
    pontuar(PONTOS.operacaoPessoas, r('7B'), 0),
    pontuar(PONTOS.operacaoUnidades, r('8B'), 0),
    pontuar(PONTOS.operacaoAreas, r('9B'), 0),
  ]);

  // ── 2. Maturidade organizacional: processos e responsabilidades, pelo pior ──
  var maturidadeOrg = maiorDe([
    pontuar(PONTOS.processos, r('12'), 0),
    pontuar(PONTOS.responsabilidades, r('13'), 0),
  ]);

  // ── 3. Maturidade financeira ──
  var maturidadeFin = pontuar(PONTOS.financeiro, r('14'), 3);

  // ── 4. Tecnologia e dados: integração mais os sinais das ferramentas ──
  var ferramentas = r('16');
  var tecnologia = maiorDe([
    pontuar(PONTOS.integracao, r('18'), 2),
    contem(ferramentas, 'Planilhas como principal instrumento de controle') ? 3 : 1,
    contem(ferramentas, 'Sistemas próprios desenvolvidos para a organização') ? 3 : 1,
    contem(ferramentas, 'Nenhuma ferramenta estruturada atualmente') ? 3 : 1,
  ]);

  // ── 5. Amplitude do escopo: quantas áreas precisam ser trabalhadas ──
  var areasEscopo = r('22');
  var amplitude;
  if (contem(areasEscopo, 'Ainda não sabemos exatamente')) {
    amplitude = 4; // escopo indefinido é o mais caro de dimensionar
  } else {
    var quantas = quantasMarcadas(areasEscopo);
    amplitude = quantas === 0 ? 1 : quantas <= 2 ? 1 : quantas <= 4 ? 2 : quantas <= 7 ? 3 : 4;
  }

  // ── 6. Qualidade das informações ──
  var qualidadeInfo = pontuar(PONTOS.documentos, r('23'), 3);

  // ── 7. Disponibilidade das pessoas ──
  var disponibilidade = pontuar(PONTOS.disponibilidade, r('24'), 3);

  // ── 8. Urgência ──
  var urgencia = pontuar(PONTOS.urgencia, r('25'), 2);

  // ── 9. Entregável ──
  var objetivos = r('5');
  var entregavel = 1;
  if (ENTREGAVEIS.quatro.some(function (o) { return contem(objetivos, o); })) entregavel = 4;
  else if (ENTREGAVEIS.tres.some(function (o) { return contem(objetivos, o); })) entregavel = 3;
  else if (ENTREGAVEIS.dois.some(function (o) { return contem(objetivos, o); })) entregavel = 2;

  var dimensoes = [porte, maturidadeOrg, maturidadeFin, tecnologia, amplitude, qualidadeInfo, disponibilidade, urgencia, entregavel];
  var ipc = dimensoes.reduce(function (soma, n) { return soma + n; }, 0);

  var nivel = NIVEIS.filter(function (n) { return ipc >= n.ipcMin && ipc <= n.ipcMax; })[0] || NIVEIS[0];

  // Taxa média ponderada pela composição de equipe do nível
  var t = PARAMETROS.taxas;
  var taxaMedia =
    nivel.mix.analista * t.analista +
    nivel.mix.consultor * t.consultor +
    nivel.mix.senior * t.senior +
    nivel.mix.direcao * t.direcao;

  var fator = FATOR_URGENCIA[urgencia] || 1;
  var multiplicador = taxaMedia * (1 + PARAMETROS.reservaEscopo) * fator;
  var precoMin = Math.max(Math.round(nivel.horasMin * multiplicador), PARAMETROS.valorMinimo);
  var precoMax = Math.max(Math.round(nivel.horasMax * multiplicador), PARAMETROS.valorMinimo);

  // Alerta: o ponto que mais pesa quando alguma nota estourou
  var alerta = 'Sem alerta crítico';
  if (maturidadeFin === 4) alerta = 'Alerta financeiro';
  else if (tecnologia === 4) alerta = 'Alerta de tecnologia e dados';
  else if (qualidadeInfo === 4) alerta = 'Alerta documental';
  else if (urgencia === 4) alerta = 'Alerta de urgência';
  else if (amplitude === 4) alerta = 'Alerta de escopo';
  else if (disponibilidade === 4) alerta = 'Alerta de disponibilidade';

  return {
    ipc: ipc,
    nivel: nivel,
    alerta: alerta,
    precoMin: precoMin,
    precoMax: precoMax,
    valores: [
      ipc,
      nivel.nome,
      porte,
      maturidadeOrg,
      maturidadeFin,
      tecnologia,
      amplitude,
      qualidadeInfo,
      disponibilidade,
      urgencia,
      entregavel,
      nivel.horasMin,
      nivel.horasMax,
      nivel.equipe,
      nivel.prazo,
      precoMin,
      precoMax,
      alerta,
      'Aguardando revisão humana',
    ],
  };
}

/**
 * Garante que a aba tenha colunas suficientes.
 * Sem isto, escrever além da grade da planilha dá erro em vez de expandi-la.
 */
function garantirColunas(aba, quantidade) {
  var atuais = aba.getMaxColumns();
  if (atuais < quantidade) aba.insertColumnsAfter(atuais, quantidade - atuais);
}

/**
 * Aplica o modelo às respostas que já estão na planilha.
 *
 * Serve para dois casos: a primeira implantação, quando existem respostas
 * anteriores ao modelo; e depois de mexer nas tabelas de pontuação, para
 * reprocessar tudo com os critérios novos.
 *
 * Só pontua linhas com status "Concluído" — formulário incompleto não tem
 * dados suficientes e receberia um IPC enganoso. Anotações já feitas na
 * coluna "Situação da precificação" são preservadas.
 *
 * COMO USAR: selecione recalcularRespostas no menu de funções e execute.
 */
function recalcularRespostas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getSheetByName(ABA_DADOS);
  if (!aba) throw new Error('Não encontrei a aba "' + ABA_DADOS + '".');

  var ultimaLinha = aba.getLastRow();
  if (ultimaLinha < 2) throw new Error('A aba "' + ABA_DADOS + '" ainda não tem respostas.');

  var headers = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];

  // Cria as colunas do modelo que ainda não existirem, à direita das demais
  var faltantes = COLUNAS_AVALIACAO.filter(function (nome) {
    return headers.indexOf(nome) === -1;
  });
  if (faltantes.length > 0) {
    garantirColunas(aba, headers.length + faltantes.length);
    aba
      .getRange(1, headers.length + 1, 1, faltantes.length)
      .setValues([faltantes])
      .setFontWeight('bold')
      .setBackground('#120b24')
      .setFontColor('#ffffff')
      .setWrap(true);
    headers = headers.concat(faltantes);
  }

  var colStatus = headers.indexOf('Status');
  var colSituacao = headers.indexOf('Situação da precificação');
  var primeiraColuna = headers.indexOf(COLUNAS_AVALIACAO[0]) + 1;

  var linhas = aba.getRange(2, 1, ultimaLinha - 1, headers.length).getValues();
  var pontuadas = 0;
  var ignoradas = 0;

  for (var i = 0; i < linhas.length; i++) {
    var linha = linhas[i];

    // Linha vazia (sem protocolo) não interessa
    if (!String(linha[headers.indexOf('Protocolo')] || '').trim()) continue;

    if (String(linha[colStatus] || '').trim() !== 'Concluído') {
      ignoradas++;
      continue;
    }

    var resultado = avaliar(headers, linha);
    var valores = resultado.valores.slice();

    // Preserva o que alguém já escreveu na coluna de revisão
    var situacaoAtual = colSituacao === -1 ? '' : String(linha[colSituacao] || '').trim();
    if (situacaoAtual) valores[valores.length - 1] = situacaoAtual;

    aba.getRange(i + 2, primeiraColuna, 1, valores.length).setValues([valores]);
    pontuadas++;
  }

  var recado =
    pontuadas + ' resposta(s) pontuada(s).' +
    (ignoradas > 0 ? ' ' + ignoradas + ' ignorada(s) por não estarem concluídas.' : '');
  SpreadsheetApp.getActive().toast(recado, 'COSMMUS', 8);
  console.log(recado);
  return recado;
}
