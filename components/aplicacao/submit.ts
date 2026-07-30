import {
  FormValues,
  RowMeta,
  SubmissionStatus,
  allFields,
  buildHeaders,
  buildRow,
  OTHER_SUFFIX,
} from './formSchema';

/**
 * Endpoint do Google Apps Script (implantado como aplicativo da web) que grava
 * as respostas na planilha. Veja docs/FORMULARIO-SHEETS.md.
 *
 * O endereço fica no código porque variáveis VITE_* são embutidas no bundle
 * durante o build: mantê-lo em .env não o tornaria mais reservado, apenas
 * exigiria acesso ao painel da hospedagem para publicar o site. A proteção real
 * é o script aceitar somente gravação, nunca leitura.
 *
 * Para apontar para outra planilha (testes, homologação), defina
 * VITE_SHEETS_ENDPOINT em .env.local — o valor abaixo é usado apenas quando a
 * variável não existe.
 */
const DEFAULT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbzGq45d5Sq5W-YF_elQ6aIcKsjjkFEbJb1HniVcwZ2_15TuYbxk_F5qpkWlMmuW4AdD/exec';

const ENDPOINT = (import.meta.env.VITE_SHEETS_ENDPOINT as string | undefined) || DEFAULT_ENDPOINT;

export const hasEndpoint = (): boolean => ENDPOINT.startsWith('https://');

/** Protocolo legível para o cliente e chave que identifica a linha na planilha. */
export const generateProtocol = (): string => {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `COSMMUS-${stamp}-${suffix}`;
};

/** Data e hora no fuso de Brasília. */
export const brazilTimestamp = (): string =>
  new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export interface SaveOptions {
  protocol: string;
  createdAt: string;
  status: SubmissionStatus;
  /** Ex.: '7 de 22' */
  progress: string;
}

const buildPayload = (values: FormValues, options: SaveOptions) => {
  const meta: RowMeta = {
    protocol: options.protocol,
    createdAt: options.createdAt,
    updatedAt: brazilTimestamp(),
    status: options.status,
    progress: options.progress,
  };

  return {
    formulario: 'Caracterização Organizacional — Riscos Psicossociais',
    protocolo: meta.protocol,
    status: meta.status,
    dataHora: meta.createdAt,
    headers: buildHeaders(),
    row: buildRow(values, meta),
  };
};

/**
 * Grava (ou atualiza) a linha do protocolo na planilha.
 *
 * O Apps Script localiza a linha pelo protocolo: o primeiro salvamento cria a
 * linha e os seguintes apenas a atualizam, sem duplicar registros.
 *
 * Usa Content-Type text/plain para evitar preflight CORS (o Apps Script não
 * responde a OPTIONS).
 */
export const saveToSheets = async (values: FormValues, options: SaveOptions): Promise<SubmitResult> => {
  if (!hasEndpoint()) {
    return { ok: false, error: 'Endpoint de envio não configurado (VITE_SHEETS_ENDPOINT).' };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(buildPayload(values, options)),
      redirect: 'follow',
    });

    if (!response.ok) {
      return { ok: false, error: `O servidor respondeu com status ${response.status}.` };
    }

    const text = await response.text();
    if (text && text.toLowerCase().includes('"error"')) {
      return { ok: false, error: 'A planilha recusou o registro. Verifique a implantação do script.' };
    }
    return { ok: true };
  } catch {
    // Erros de rede/CORS chegam aqui sem detalhe útil para o cliente
    return {
      ok: false,
      error: 'Não houve resposta do servidor. Verifique sua conexão com a internet e tente novamente.',
    };
  }
};

/**
 * Salvamento de emergência quando a aba está sendo fechada.
 * sendBeacon continua sendo enviado pelo navegador mesmo depois de a página
 * morrer, mas não permite ler a resposta — serve apenas como rede de segurança.
 */
export const saveOnExit = (values: FormValues, options: SaveOptions): void => {
  if (!hasEndpoint() || typeof navigator.sendBeacon !== 'function') return;
  try {
    const blob = new Blob([JSON.stringify(buildPayload(values, options))], {
      type: 'text/plain;charset=utf-8',
    });
    navigator.sendBeacon(ENDPOINT, blob);
  } catch {
    // best-effort: se falhar, o rascunho local continua disponível
  }
};

/** Gera um resumo em texto das respostas, para o cliente guardar uma cópia. */
export const buildTextSummary = (values: FormValues, protocol: string): string => {
  const lines: string[] = [
    'COSMMUS BUSINESS',
    'Formulário de Caracterização Organizacional',
    'Gestão de Riscos Psicossociais e Saúde no Trabalho',
    '',
    `Protocolo: ${protocol}`,
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    '',
    '='.repeat(60),
    '',
  ];

  for (const field of allFields) {
    const value = values[field.id];
    let printed = '';

    if (Array.isArray(value)) {
      printed = value.join('; ');
    } else if (value && typeof value === 'object') {
      printed = Object.entries(value)
        .filter(([, v]) => v)
        .map(([k, v]) => `\n    - ${k}: ${v}`)
        .join('');
    } else if (field.type === 'consent') {
      printed = value === 'true' ? 'Sim' : 'Não';
    } else if (typeof value === 'string') {
      printed = value;
    }

    const other = values[field.id + OTHER_SUFFIX];
    if (typeof other === 'string' && other) {
      printed += ` (Outro: ${other})`;
    }

    lines.push(`${field.id} ${field.label}`);
    lines.push(`  ${printed || '(não respondido)'}`);
    lines.push('');
  }

  return lines.join('\n');
};
