/**
 * Tipos e utilidades comuns aos formulários do site.
 *
 * Cada formulário mora em sua própria pasta e traz apenas o conteúdo (seções,
 * perguntas e textos de abertura). Tela, validação, rascunho local e gravação
 * na planilha são os mesmos para todos — o que está aqui e em FormRunner.
 */

export type FieldType =
  | 'text'
  | 'paragraph'
  | 'number'
  | 'email'
  | 'tel'
  | 'cnpj'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'scale'
  | 'grid'
  | 'numberGroup'
  | 'consent';

export type FieldValue = string | string[] | Record<string, string>;
export type FormValues = Record<string, FieldValue>;

export interface FieldDef {
  /** Numeração oficial do formulário, ex.: '1.1'. Também é a chave do valor. */
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Texto de orientação exibido abaixo do enunciado. */
  help?: string;
  placeholder?: string;
  options?: string[];
  /** Exibe campo de texto livre quando a opção "Outro/Outra/Outros" é marcada. */
  allowOther?: boolean;
  /** Linhas de uma grade ou de um grupo numérico. */
  rows?: string[];
  /** Colunas de uma grade de múltipla escolha. */
  columns?: string[];
  /** Título da primeira coluna de uma grade. */
  rowHeader?: string;
  /** Limite de opções marcáveis em caixas de seleção. */
  maxSelections?: number;
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  /** Exibição condicional. */
  showIf?: (values: FormValues) => boolean;
}

export interface SectionDef {
  /** Numeração oficial, ex.: '1'. */
  number: string;
  title: string;
  /** Texto introdutório da etapa. */
  intro?: string;
  fields: FieldDef[];
  /**
   * Etapa condicional: quando devolve falso, a etapa inteira é pulada.
   * Usado nas trilhas que dependem de uma resposta anterior.
   */
  showIf?: (values: FormValues) => boolean;
}

export const OTHER_SUFFIX = '__outro';

/** Situação do preenchimento, registrada na planilha. */
export type SubmissionStatus = 'Em preenchimento' | 'Concluído';

export interface RowMeta {
  protocol: string;
  /** Momento do primeiro salvamento — não muda nos salvamentos seguintes. */
  createdAt: string;
  /** Momento do último salvamento. */
  updatedAt: string;
  status: SubmissionStatus;
  /** Etapa em que a pessoa estava, ex.: '7 de 22'. */
  progress: string;
}

/** Valor de texto normalizado, para uso nas condições de exibição. */
export const str = (v: FieldValue | undefined): string => (typeof v === 'string' ? v : '');

/** Lista de marcadas, para uso nas condições de exibição. */
export const list = (v: FieldValue | undefined): string[] => (Array.isArray(v) ? v : []);

/** Todos os campos de um formulário, na ordem em que aparecem. */
export const collectFields = (sections: SectionDef[]): FieldDef[] => sections.flatMap((s) => s.fields);

/** Colunas de controle, sempre no início da planilha. */
export const META_HEADERS = ['Data/hora', 'Protocolo', 'Status', 'Última atualização', 'Etapa alcançada'];

/**
 * Cabeçalhos das colunas da planilha, na ordem do formulário.
 * Campos compostos (grade e grupo numérico) geram uma coluna por linha.
 */
export const buildHeaders = (sections: SectionDef[]): string[] => {
  const headers = [...META_HEADERS];
  for (const field of collectFields(sections)) {
    if (field.type === 'grid' || field.type === 'numberGroup') {
      for (const row of field.rows || []) {
        headers.push(`${field.id} ${field.label} [${row}]`);
      }
    } else {
      headers.push(`${field.id} ${field.label}`);
    }
    if (field.allowOther) {
      headers.push(`${field.id} ${field.label} [Outro - especificar]`);
    }
  }
  return headers;
};

/** Converte os valores do formulário em uma linha alinhada a buildHeaders(). */
export const buildRow = (sections: SectionDef[], values: FormValues, meta: RowMeta): string[] => {
  const row: string[] = [meta.createdAt, meta.protocol, meta.status, meta.updatedAt, meta.progress];
  for (const field of collectFields(sections)) {
    const value = values[field.id];
    if (field.type === 'grid' || field.type === 'numberGroup') {
      const record = (value && typeof value === 'object' && !Array.isArray(value) ? value : {}) as Record<
        string,
        string
      >;
      for (const rowLabel of field.rows || []) {
        row.push(record[rowLabel] ?? '');
      }
    } else if (Array.isArray(value)) {
      row.push(value.join('; '));
    } else if (field.type === 'consent') {
      row.push(value === 'true' ? 'Sim' : 'Não');
    } else {
      row.push(typeof value === 'string' ? value : '');
    }
    if (field.allowOther) {
      const other = values[field.id + OTHER_SUFFIX];
      row.push(typeof other === 'string' ? other : '');
    }
  }
  return row;
};
