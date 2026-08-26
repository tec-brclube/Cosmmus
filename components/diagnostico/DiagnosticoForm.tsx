import React from 'react';
import FormRunner, { FormConfig } from '../formulario/FormRunner';
import { formSections } from './formSchema';

/**
 * DIAGNÓSTICO COSMMUS — /diagnostico
 *
 * Porta de entrada geral: serve para qualquer demanda, de uma ideia ainda no
 * papel a uma organização em reestruturação. As perguntas estão em
 * formSchema.ts e a mecânica em components/formulario.
 */
const config: FormConfig = {
  spec: {
    formName: 'Diagnóstico Cosmmus',
    sheetName: 'Diagnostico Cosmmus',
    protocolPrefix: 'DIAG',
    sections: formSections,
  },
  draftKey: 'cosmmus:diagnostico:v1',
  fileSlug: 'cosmmus-diagnostico',
  summaryTitle: ['Diagnóstico Cosmmus'],
  intro: {
    eyebrow: 'Antes de começarmos',
    titleTop: 'Diagnóstico',
    titleAccent: 'Cosmmus',
    subtitle: 'Para entendermos o momento da sua iniciativa e a dimensão da necessidade.',
    paragraphs: [
      'Este formulário tem como objetivo nos ajudar a compreender, de maneira inicial, o momento da sua ideia, negócio, organização ou projeto e a dimensão da necessidade apresentada.',
    ],
    list: {
      intro:
        'As informações fornecidas permitirão à equipe da Cosmmus Business avaliar preliminarmente:',
      items: [
        'O escopo do trabalho',
        'A complexidade envolvida',
        'Os profissionais necessários',
        'O prazo estimado',
        'A estrutura mais adequada para a proposta',
      ],
    },
    disclaimer: (
      <>
        Não se trata ainda de um diagnóstico completo. Algumas perguntas{' '}
        <strong className="text-paper-ink font-semibold">poderão variar</strong> de acordo com as respostas anteriores.
      </>
    ),
    privacyNote:
      'As informações serão tratadas de forma confidencial e utilizadas para a avaliação preliminar da necessidade apresentada.',
    estimatedTime: '5 a 8 minutos',
  },
  success: {
    title: 'Obrigado pelas informações.',
    paragraphs: [
      'As respostas serão analisadas pela equipe da Cosmmus Business e servirão de base para uma avaliação preliminar da necessidade apresentada. Caso seja necessário, poderemos entrar em contato para esclarecer algum ponto antes da elaboração da proposta.',
      'O preenchimento deste formulário não representa contratação, diagnóstico definitivo ou compromisso de execução. Seu objetivo é permitir que possamos compreender melhor a demanda e estruturar uma proposta compatível com a realidade e a complexidade do projeto.',
    ],
  },
};

const DiagnosticoForm: React.FC = () => <FormRunner config={config} />;

export default DiagnosticoForm;
