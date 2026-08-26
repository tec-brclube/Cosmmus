import React from 'react';
import FormRunner, { FormConfig } from '../formulario/FormRunner';
import { formSections } from './formSchema';

/**
 * FORMULÁRIO DE CARACTERIZAÇÃO ORGANIZACIONAL — /aplicacaocosmmus
 *
 * Só o conteúdo mora aqui: as perguntas estão em formSchema.ts e toda a
 * mecânica (etapas, validação, rascunho, salvamento) em components/formulario.
 */
const config: FormConfig = {
  spec: {
    formName: 'Caracterização Organizacional — Riscos Psicossociais',
    sheetName: 'Respostas',
    protocolPrefix: 'COSMMUS',
    sections: formSections,
  },
  draftKey: 'cosmmus:aplicacao:v1',
  fileSlug: 'cosmmus-caracterizacao',
  summaryTitle: [
    'Formulário de Caracterização Organizacional',
    'Gestão de Riscos Psicossociais e Saúde no Trabalho',
  ],
  intro: {
    eyebrow: 'Aplicação para consultoria',
    titleTop: 'Formulário de',
    titleAccent: 'caracterização organizacional',
    subtitle: 'Gestão de Riscos Psicossociais e Saúde no Trabalho',
    paragraphs: [
      'Este formulário tem como finalidade conhecer as características gerais da empresa, sua estrutura, atividades, jornadas, práticas de gestão e principais desafios relacionados ao trabalho.',
    ],
    list: {
      intro:
        'As informações fornecidas ajudarão a Cosmmus Business a compreender o contexto inicial da empresa e elaborar uma proposta técnica e comercial compatível com:',
      items: [
        'O número de trabalhadores',
        'A quantidade de unidades, setores e funções',
        'A natureza e a complexidade das atividades',
        'As jornadas e modalidades de trabalho',
        'Os instrumentos e métodos que poderão ser utilizados',
        'O número de grupos que precisarão ser avaliados',
        'A necessidade de entrevistas, reuniões, visitas e análise documental',
        'A elaboração do diagnóstico e do plano de ação',
        'O prazo estimado para execução',
        'A capacidade e o interesse de investimento da organização',
      ],
    },
    disclaimer: (
      <>
        O preenchimento deste formulário <strong className="text-paper-ink font-semibold">não constitui</strong>{' '}
        avaliação de riscos, diagnóstico psicológico, laudo, parecer técnico, inventário de riscos ou certificação de
        conformidade com a NR-1.
      </>
    ),
    privacyNote:
      'As informações serão tratadas de forma confidencial e utilizadas inicialmente para análise de escopo e elaboração da proposta.',
    estimatedTime: '35 a 50 minutos',
  },
  success: {
    title: 'Recebemos suas informações.',
    paragraphs: [
      'Agradecemos pelas informações. A equipe da Cosmmus Business analisará as características da organização, a dimensão do público, a complexidade das atividades, as modalidades de aplicação e os resultados esperados.',
      'Caso seja necessário, entraremos em contato para uma breve reunião de qualificação antes da elaboração da proposta.',
    ],
    list: {
      title: 'A proposta poderá contemplar etapas como',
      items: [
        'Alinhamento e planejamento',
        'Análise documental e caracterização da organização',
        'Sensibilização dos participantes',
        'Aplicação dos instrumentos',
        'Entrevistas, grupos focais ou visitas técnicas',
        'Análise e classificação dos fatores de risco',
        'Elaboração e apresentação do diagnóstico',
        'Construção do plano de ação',
        'Capacitação de lideranças e trabalhadores',
        'Acompanhamento e reavaliação',
      ],
    },
  },
};

const ApplicationForm: React.FC = () => <FormRunner config={config} />;

export default ApplicationForm;
