/**
 * Schema do DIAGNÓSTICO COSMMUS
 *
 * Este arquivo define as perguntas exibidas na tela e, por consequência, os
 * nomes das colunas gravadas na planilha. A mecânica (etapas, validação,
 * rascunho e envio) é compartilhada e mora em components/formulario.
 *
 * O formulário tem duas trilhas, escolhidas pela pergunta 4:
 *   Trilha A — quem ainda está estruturando uma ideia ou iniciativa
 *   Trilha B — negócios, organizações e projetos já em operação
 * Só uma delas aparece; a outra é pulada por inteiro.
 */

import { FormValues, SectionDef, str } from '../formulario/types';

/** Respostas da pergunta 4 que levam à trilha de quem ainda está estruturando. */
const MOMENTOS_INICIAIS = [
  'Tenho uma ideia e quero estruturá-la ou avaliar sua viabilidade.',
  'A iniciativa já começou informalmente, mas ainda precisa ser estruturada e/ou formalizada.',
  'Está em fase de implantação.',
];

/** Trilha A: ideia, iniciativa informal ou implantação. */
const trilhaInicial = (values: FormValues): boolean => MOMENTOS_INICIAIS.includes(str(values['4']));

/**
 * Trilha B: operação, crescimento, reorganização ou dificuldade.
 * Também atende "Outro" e o caso de a pergunta ainda não ter sido respondida,
 * por ser a trilha mais abrangente.
 */
const trilhaOperacao = (values: FormValues): boolean => !trilhaInicial(values);

export const formSections: SectionDef[] = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '1',
    title: 'Identificação e contato',
    intro: 'Quem está preenchendo, como falamos com você e a qual iniciativa as respostas se referem.',
    fields: [
      {
        id: 'C1',
        label: 'E-mail para contato',
        type: 'email',
        required: true,
        placeholder: 'nome@empresa.com.br',
        help: 'É por aqui que retornamos com a análise.',
      },
      {
        id: 'C2',
        label: 'WhatsApp',
        type: 'tel',
        required: true,
        placeholder: '(00) 00000-0000',
        help: 'Com DDD.',
      },
      {
        id: 'C3',
        label: 'Instagram da empresa ou do projeto',
        type: 'text',
        placeholder: '@perfil',
        help: 'Opcional.',
      },
      {
        id: '1',
        label: 'Nome da pessoa responsável pelo preenchimento',
        type: 'text',
        required: true,
        placeholder: 'Nome completo',
      },
      {
        id: '2',
        label: 'Nome da empresa, organização, projeto ou iniciativa',
        type: 'text',
        required: true,
        help: 'Caso ainda não exista um nome definido, informe apenas "a definir".',
      },
      {
        id: '2.1',
        label: 'Qual é o segmento ou a atividade principal?',
        type: 'select',
        required: true,
        allowOther: true,
        help: 'Se nenhuma opção descrever bem, escolha "Outro" e escreva do seu jeito.',
        options: [
          'Agronegócio, produção rural ou pesca',
          'Alimentação — restaurante, bar, lanchonete ou cafeteria',
          'Associação, ONG, instituto ou projeto social',
          'Beleza, estética e bem-estar',
          'Comércio varejista — loja física ou online',
          'Comunicação, marketing e publicidade',
          'Construção civil, engenharia e arquitetura',
          'Cooperativa',
          'Educação, cursos e treinamentos',
          'Eventos e entretenimento',
          'Fotografia, audiovisual e produção de conteúdo',
          'Imobiliário e incorporação',
          'Indústria, fabricação e produção',
          'Logística, transporte e entregas',
          'Moda, vestuário e acessórios',
          'Saúde, clínicas e cuidados',
          'Serviços profissionais — contabilidade, advocacia, consultoria',
          'Serviços gerais e manutenção',
          'Tecnologia, software e serviços digitais',
          'Turismo, hospedagem e lazer',
          'Outro',
        ],
      },
      {
        id: '2.2',
        label: 'Em qual cidade a iniciativa está baseada?',
        type: 'text',
        required: true,
        placeholder: 'Cidade e estado, ex.: Goiânia - GO',
        help: 'Se a operação for remota ou em várias cidades, informe a principal.',
      },
      {
        id: '3',
        label: 'Qual é a sua função ou relação com essa iniciativa?',
        type: 'radio',
        required: true,
        allowOther: true,
        options: [
          'Fundador(a) / empreendedor(a)',
          'Sócio(a)',
          'Diretor(a) / gestor(a)',
          'Coordenador(a) / responsável pelo projeto',
          'Representante de organização',
          'Profissional responsável pela contratação',
          'Outro',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '2',
    title: 'Momento atual',
    intro: 'Esta resposta define o restante do formulário: as perguntas seguintes se ajustam a ela.',
    fields: [
      {
        id: '4',
        label: 'Em qual situação sua iniciativa, negócio, organização ou projeto se encontra atualmente?',
        type: 'radio',
        required: true,
        allowOther: true,
        options: [
          'Tenho uma ideia e quero estruturá-la ou avaliar sua viabilidade.',
          'A iniciativa já começou informalmente, mas ainda precisa ser estruturada e/ou formalizada.',
          'Está em fase de implantação.',
          'Já está em operação, mas ainda possui estrutura simples ou pouco formalizada.',
          'Está em operação e possui estrutura organizacional definida.',
          'Está em processo de crescimento ou expansão.',
          'Está passando por reorganização ou reestruturação.',
          'Está enfrentando dificuldades relevantes e precisa de diagnóstico ou intervenção.',
          'Outro',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '3',
    title: 'O que motivou a procura pela Cosmmus',
    fields: [
      {
        id: '5',
        label: 'O que você espera que a Cosmmus Business ajude a construir, avaliar ou resolver?',
        type: 'checkbox',
        required: true,
        allowOther: true,
        help: 'Marque quantas opções quiser.',
        options: [
          'Estruturar uma ideia.',
          'Avaliar a viabilidade de um negócio ou projeto.',
          'Elaborar um Plano de Negócios.',
          'Construir ou revisar o modelo de negócio.',
          'Formalizar uma iniciativa empreendedora.',
          'Planejar a implantação de um negócio ou projeto.',
          'Realizar um Diagnóstico 360º.',
          'Elaborar ou revisar o planejamento estratégico.',
          'Organizar a gestão financeira.',
          'Estruturar processos, fluxos e procedimentos.',
          'Definir estrutura organizacional e responsabilidades.',
          'Melhorar a gestão de pessoas.',
          'Estruturar a área comercial e vendas.',
          'Melhorar marketing e comunicação.',
          'Avaliar tecnologia, sistemas, dados e automações.',
          'Estruturar indicadores e ferramentas de gestão.',
          'Reorganizar ou reestruturar a organização.',
          'Desenvolver um projeto específico.',
          'Identificar problemas e oportunidades ainda não claramente conhecidos.',
          'Outro',
        ],
      },
      {
        id: '6',
        label:
          'Em poucas palavras, quais são hoje as três principais preocupações, problemas, necessidades ou oportunidades que levaram você a procurar a Cosmmus?',
        type: 'paragraph',
        required: true,
        placeholder: 'Pode escrever livremente, em tópicos ou em texto corrido.',
      },
    ],
  },

  // ───────────────────────────────── TRILHA A ──────────────────────────────
  {
    number: '4',
    title: 'Sobre a ideia ou iniciativa',
    intro: 'Perguntas para quem ainda está estruturando: ajudam a entender o ponto de partida.',
    showIf: trilhaInicial,
    fields: [
      {
        id: '7A',
        label: 'Em que nível essa ideia ou iniciativa já foi desenvolvida?',
        type: 'radio',
        required: true,
        options: [
          'Ainda está principalmente no campo da ideia.',
          'Já tenho uma proposta relativamente definida.',
          'Já sei qual produto ou serviço pretendo oferecer.',
          'Já identifiquei o público ou cliente que pretendo atender.',
          'Já fiz testes, protótipos ou validações.',
          'Já existem clientes, usuários ou beneficiários.',
          'Já realizo vendas ou atendimentos.',
          'A operação já começou, mesmo que informalmente.',
        ],
      },
      {
        id: '8A',
        label: 'Existem outras pessoas envolvidas atualmente?',
        type: 'radio',
        required: true,
        options: [
          'Não, apenas eu.',
          'Sim, mais 1 pessoa.',
          'Sim, entre 2 e 5 pessoas.',
          'Sim, entre 6 e 10 pessoas.',
          'Mais de 10 pessoas.',
        ],
      },
      {
        id: '9A',
        label: 'A iniciativa já gera alguma receita?',
        type: 'radio',
        required: true,
        options: [
          'Ainda não.',
          'Já houve receitas pontuais ou experimentais.',
          'Existe alguma receita, mas ainda irregular.',
          'Existe receita recorrente.',
          'Prefiro não informar neste momento.',
        ],
      },
      {
        id: '10A',
        label: 'Qual é atualmente a situação de formalização?',
        type: 'radio',
        required: true,
        allowOther: true,
        options: [
          'Ainda não existe qualquer formalização.',
          'Estou avaliando como formalizar.',
          'Já possuo MEI.',
          'Já existe empresa/CNPJ.',
          'Trata-se ou poderá se tratar de associação, cooperativa, instituto ou outra organização.',
          'Ainda não sei qual modelo jurídico é mais adequado.',
          'Outro',
        ],
      },
      {
        id: '11A',
        label:
          'Você já possui alguma estimativa dos recursos necessários para colocar ou manter essa iniciativa em funcionamento?',
        type: 'radio',
        required: true,
        options: [
          'Ainda não.',
          'Tenho apenas uma estimativa inicial.',
          'Já possuo orçamento ou projeção aproximada.',
          'Parte do investimento já está disponível.',
          'O projeto já possui recursos ou fontes de financiamento definidas.',
          'Preciso justamente da Cosmmus para ajudar a dimensionar essa necessidade.',
        ],
      },
    ],
  },

  // ───────────────────────────────── TRILHA B ──────────────────────────────
  {
    number: '4',
    title: 'Dimensão da operação',
    intro: 'Perguntas para iniciativas já em funcionamento: ajudam a dimensionar o trabalho.',
    showIf: trilhaOperacao,
    fields: [
      {
        id: '7B',
        label: 'Aproximadamente quantas pessoas participam atualmente da operação?',
        type: 'radio',
        required: true,
        help: 'Considere sócios, funcionários, colaboradores permanentes e outros profissionais diretamente envolvidos na operação.',
        options: [
          '1 pessoa.',
          '2 a 5 pessoas.',
          '6 a 10 pessoas.',
          '11 a 20 pessoas.',
          '21 a 50 pessoas.',
          '51 a 100 pessoas.',
          '101 a 250 pessoas.',
          'Mais de 250 pessoas.',
        ],
      },
      {
        id: '8B',
        label: 'Quantas unidades, escritórios, lojas, filiais ou locais de operação existem?',
        type: 'radio',
        required: true,
        options: [
          'Apenas uma operação/local.',
          '2 unidades.',
          '3 a 5 unidades.',
          '6 a 10 unidades.',
          'Mais de 10 unidades.',
          'A operação é predominantemente remota ou distribuída.',
        ],
      },
      {
        id: '9B',
        label: 'Quantas áreas, departamentos ou funções diferentes existem aproximadamente?',
        type: 'radio',
        required: true,
        options: [
          'Ainda não existem áreas claramente definidas.',
          'Até 3.',
          'Entre 4 e 6.',
          'Entre 7 e 10.',
          'Mais de 10.',
          'Não sei informar.',
        ],
      },
      {
        id: '10B',
        label: 'Quais áreas estão presentes na organização?',
        type: 'checkbox',
        required: true,
        allowOther: true,
        options: [
          'Direção / gestão',
          'Administrativo',
          'Financeiro',
          'Contabilidade',
          'Comercial / vendas',
          'Marketing / comunicação',
          'Atendimento / relacionamento',
          'Operações',
          'Compras / suprimentos',
          'Logística',
          'Recursos Humanos / Gestão de Pessoas',
          'Tecnologia / dados',
          'Jurídico / compliance',
          'Projetos',
          'Produção',
          'Outras',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '5',
    title: 'Organização e maturidade de gestão',
    fields: [
      {
        id: '12',
        label: 'Como você descreveria atualmente a organização dos processos e rotinas?',
        type: 'radio',
        required: true,
        options: [
          'Os principais processos estão definidos, documentados e são normalmente seguidos.',
          'Existem processos definidos, mas apenas parte deles está documentada.',
          'As pessoas conhecem suas rotinas, mas existe pouca documentação.',
          'Muitas atividades dependem do conhecimento ou experiência de determinadas pessoas.',
          'Existem atividades sem fluxo, padrão ou responsabilidade claramente definidos.',
          'A operação funciona principalmente de maneira informal e reativa.',
          'Ainda não existem processos porque a iniciativa está sendo criada.',
          'Não sei avaliar.',
        ],
      },
      {
        id: '13',
        label: 'Como estão definidas as responsabilidades e funções?',
        type: 'radio',
        required: true,
        options: [
          'Existe estrutura organizacional clara, com responsabilidades bem definidas.',
          'A maior parte das funções está definida, embora existam algumas sobreposições.',
          'As pessoas sabem aproximadamente o que devem fazer, mas não existe formalização.',
          'Existem muitas sobreposições, dúvidas ou indefinições.',
          'Grande parte das decisões e atividades depende diretamente do fundador ou gestor principal.',
          'Ainda não existe equipe ou estrutura definida.',
          'Não sei avaliar.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '6',
    title: 'Organização financeira',
    fields: [
      {
        id: '14',
        label: 'Como você avalia atualmente a organização das informações financeiras?',
        type: 'radio',
        required: true,
        options: [
          'Existem controles financeiros, fluxo de caixa, orçamento e indicadores atualizados.',
          'Existem bons controles, mas ainda existem informações ou processos a melhorar.',
          'Existem controles básicos de entradas, saídas e compromissos.',
          'Grande parte do controle é realizada por planilhas ou controles manuais.',
          'Existem informações dispersas e dificuldade para consolidar os números.',
          'Temos dificuldade para saber com segurança a situação financeira atual.',
          'A iniciativa ainda não possui movimentação financeira.',
          'Não sei avaliar.',
        ],
      },
      {
        id: '15',
        label: 'Qual faixa melhor representa o faturamento ou receita média mensal atual?',
        type: 'radio',
        required: true,
        options: [
          'Ainda não existe faturamento.',
          'Até R$ 10 mil.',
          'De R$ 10 mil a R$ 30 mil.',
          'De R$ 30 mil a R$ 100 mil.',
          'De R$ 100 mil a R$ 300 mil.',
          'De R$ 300 mil a R$ 1 milhão.',
          'De R$ 1 milhão a R$ 5 milhões.',
          'Acima de R$ 5 milhões.',
          'Não se aplica ao tipo de organização/projeto.',
          'Prefiro não informar neste momento.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '7',
    title: 'Tecnologia, dados e ferramentas',
    fields: [
      {
        id: '16',
        label: 'Quais recursos tecnológicos são utilizados atualmente?',
        type: 'checkbox',
        required: true,
        allowOther: true,
        options: [
          'ERP / sistema integrado de gestão.',
          'Sistema ou aplicativo de gestão financeira.',
          'Sistema contábil integrado.',
          'CRM / gestão comercial e de clientes.',
          'Sistema de atendimento ao cliente.',
          'Sistema de projetos ou gestão de tarefas.',
          'Sistema de estoque ou logística.',
          'Sistema de RH, folha ou controle de jornada.',
          'Business Intelligence / dashboards.',
          'Ferramentas de automação.',
          'Google Workspace.',
          'Microsoft 365.',
          'Armazenamento em nuvem.',
          'Ferramentas de Inteligência Artificial.',
          'Plataforma de comércio eletrônico.',
          'Sistemas próprios desenvolvidos para a organização.',
          'Planilhas como principal instrumento de controle.',
          'Nenhuma ferramenta estruturada atualmente.',
          'Outras',
        ],
      },
      {
        id: '17',
        label: 'Se souber, informe os principais sistemas e ferramentas utilizados.',
        type: 'text',
        help: 'Opcional. Exemplos: Conta Azul, Omie, SAP, HubSpot, Pipedrive, Trello, Monday, Google Workspace, Microsoft 365, Power BI, ChatGPT.',
        placeholder: 'Separe por vírgulas',
      },
      {
        id: '18',
        label: 'Como você avalia a integração entre as ferramentas e informações utilizadas?',
        type: 'radio',
        required: true,
        options: [
          'Os sistemas estão bem integrados e as informações circulam adequadamente.',
          'Existem algumas integrações, mas ainda realizamos atividades manualmente.',
          'Utilizamos vários sistemas que não se comunicam entre si.',
          'Muitas informações precisam ser repetidas ou transferidas manualmente.',
          'A maior parte das informações está em planilhas, mensagens ou arquivos separados.',
          'Utilizamos pouca tecnologia.',
          'Ainda não se aplica.',
          'Não sei avaliar.',
        ],
      },
      {
        id: '19',
        label: 'Como a organização utiliza Inteligência Artificial atualmente?',
        type: 'radio',
        required: true,
        options: [
          'Ainda não utiliza.',
          'Algumas pessoas utilizam por iniciativa própria.',
          'Utilizamos pontualmente em algumas atividades.',
          'Existem orientações ou ferramentas de IA adotadas pela organização.',
          'A IA já participa de processos ou automações estruturadas.',
          'Ainda não se aplica.',
          'Não sei avaliar.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '8',
    title: 'Comercial, marketing e presença digital',
    fields: [
      {
        id: '20',
        label: 'Quais recursos são utilizados atualmente para divulgação, relacionamento ou aquisição de clientes?',
        type: 'checkbox',
        required: true,
        options: [
          'Site institucional.',
          'Loja virtual / e-commerce.',
          'Instagram.',
          'Facebook.',
          'LinkedIn.',
          'TikTok.',
          'WhatsApp Business.',
          'Perfil da Empresa no Google.',
          'E-mail marketing.',
          'CRM.',
          'Google Ads.',
          'Meta Ads.',
          'Outras plataformas de anúncios.',
          'Gestão profissional de redes sociais.',
          'Produção recorrente de conteúdo.',
          'Automação de marketing.',
          'Equipe comercial estruturada.',
          'Indicações e relacionamento como principal fonte de clientes.',
          'Nenhum desses atualmente.',
          'Não se aplica.',
        ],
      },
      {
        id: '21',
        label: 'Existe investimento em anúncios ou tráfego pago?',
        type: 'radio',
        required: true,
        options: [
          'Não.',
          'Apenas eventualmente.',
          'Sim, mas sem planejamento ou acompanhamento estruturado.',
          'Sim, de forma recorrente.',
          'Sim, com planejamento, indicadores e acompanhamento profissional.',
          'Não se aplica.',
          'Não sei informar.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '9',
    title: 'Amplitude do possível projeto',
    fields: [
      {
        id: '22',
        label: 'Quais áreas você acredita que precisarão ser avaliadas ou trabalhadas?',
        type: 'checkbox',
        required: true,
        allowOther: true,
        options: [
          'Estratégia e modelo de negócio.',
          'Planejamento.',
          'Gestão e governança.',
          'Financeiro.',
          'Estrutura organizacional.',
          'Pessoas.',
          'Processos e procedimentos.',
          'Comercial e vendas.',
          'Marketing e comunicação.',
          'Atendimento e experiência do cliente.',
          'Tecnologia e sistemas.',
          'Dados e indicadores.',
          'Inteligência Artificial e automação.',
          'Jurídico / compliance.',
          'Projetos.',
          'Operações.',
          'Ainda não sabemos exatamente e esperamos que o diagnóstico identifique.',
          'Outras',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '10',
    title: 'Informações, documentos e participação',
    fields: [
      {
        id: '23',
        label:
          'Como estão organizados atualmente os documentos e informações que poderão ser necessários para o trabalho?',
        type: 'radio',
        required: true,
        options: [
          'Estão organizados e podem ser disponibilizados facilmente.',
          'A maior parte existe, mas precisará ser reunida.',
          'Existem informações em diferentes pessoas, sistemas ou locais.',
          'Existem poucos documentos ou registros formalizados.',
          'Não sabemos exatamente quais informações estão disponíveis.',
          'A iniciativa ainda está sendo criada.',
        ],
      },
      {
        id: '24',
        label:
          'Caso o trabalho exija entrevistas, reuniões ou levantamento de informações, qual seria a disponibilidade das pessoas envolvidas?',
        type: 'radio',
        required: true,
        options: [
          'Há boa disponibilidade para participação.',
          'Existe disponibilidade, mas precisará ser previamente organizada.',
          'A disponibilidade é limitada.',
          'Pode haver dificuldade para envolver algumas pessoas.',
          'Ainda não sei informar.',
          'Não se aplica.',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '11',
    title: 'Prazo e urgência',
    fields: [
      {
        id: '25',
        label: 'Existe alguma data ou situação que torne este projeto urgente?',
        type: 'radio',
        required: true,
        options: [
          'Não existe uma data específica.',
          'Gostaríamos de iniciar em breve, mas existe flexibilidade.',
          'Existe uma data importante nos próximos 90 dias.',
          'Existe uma necessidade relevante nos próximos 30 dias.',
          'A situação demanda intervenção ou resposta com urgência.',
          'Existe uma data específica.',
        ],
      },
      {
        id: '25.1',
        label: 'Informe a data e, se desejar, o motivo.',
        type: 'paragraph',
        required: true,
        showIf: (values) => str(values['25']) === 'Existe uma data específica.',
        placeholder: 'Ex.: 30/11 — apresentação para o conselho',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    number: '12',
    title: 'Encerramento',
    intro:
      'As respostas serão analisadas pela equipe da Cosmmus Business e servirão de base para uma avaliação preliminar da necessidade apresentada.',
    fields: [
      {
        id: '26',
        label:
          'Existe alguma outra informação que você considera importante para que a Cosmmus compreenda melhor sua realidade ou necessidade?',
        type: 'paragraph',
        help: 'Opcional.',
        placeholder: 'Fique à vontade para acrescentar o que julgar relevante.',
      },
    ],
  },
];
