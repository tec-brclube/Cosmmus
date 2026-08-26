import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CloudOff,
  Clock,
  Download,
  Loader2,
  Lock,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { FieldDef, FieldValue, FormValues, SectionDef } from './types';
import FormField from './FormFields';
import {
  brazilTimestamp,
  buildTextSummary,
  FormSpec,
  generateProtocol,
  hasEndpoint,
  saveOnExit,
  SaveOptions,
  saveToSheets,
} from './submit';

/** Conteúdo da tela de abertura. Só o texto muda de um formulário para outro. */
export interface IntroConfig {
  eyebrow: string;
  /** Título em duas linhas; a segunda recebe o gradiente da marca. */
  titleTop: string;
  titleAccent: string;
  subtitle?: string;
  paragraphs: React.ReactNode[];
  /** Lista de tópicos opcional, exibida em duas colunas. */
  list?: { intro?: React.ReactNode; items: string[] };
  /** Ressalva destacada com barra lateral. */
  disclaimer?: React.ReactNode;
  privacyNote: React.ReactNode;
  /** Ex.: '5 a 8 minutos'. */
  estimatedTime: string;
}

/** Conteúdo da tela de confirmação. */
export interface SuccessConfig {
  title: string;
  paragraphs: React.ReactNode[];
  list?: { title: string; items: string[] };
}

export interface FormConfig {
  spec: FormSpec;
  /** Chave do rascunho no navegador. Precisa ser única por formulário. */
  draftKey: string;
  /** Nome do arquivo da cópia baixada, sem extensão nem protocolo. */
  fileSlug: string;
  /** Cabeçalho do arquivo de cópia. */
  summaryTitle: string[];
  intro: IntroConfig;
  success: SuccessConfig;
}

/** Tempo de inatividade antes de enviar as respostas para a planilha. */
const AUTOSAVE_DELAY = 2500;

type Stage = 'intro' | 'form' | 'success';
type SubmitState = 'idle' | 'sending' | 'error';
/** Situação do salvamento contínuo na planilha. */
type SyncState = 'idle' | 'saving' | 'saved' | 'offline';

interface Draft {
  values?: FormValues;
  stepIndex?: number;
  protocol?: string;
  createdAt?: string;
}

const isEmpty = (value: FieldValue | undefined): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return Object.values(value).every((v) => !v);
};

/** Há pelo menos uma resposta preenchida? Evita criar linhas vazias na planilha. */
const hasAnyAnswer = (values: FormValues): boolean => Object.values(values).some((v) => !isEmpty(v));

const FormRunner: React.FC<{ config: FormConfig }> = ({ config }) => {
  const { spec, draftKey, fileSlug, summaryTitle, intro, success } = config;

  const [stage, setStage] = useState<Stage>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string>('');
  const [protocol, setProtocol] = useState<string>('');
  const [hasDraft, setHasDraft] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string>('');

  /**
   * Etapas realmente exibidas. Formulários com trilhas escondem seções
   * inteiras conforme respostas anteriores, então a contagem é dinâmica.
   */
  const sections: SectionDef[] = useMemo(
    () => spec.sections.filter((section) => !section.showIf || section.showIf(values)),
    [spec.sections, values],
  );

  /** Protocolo e horário de criação: identificam a linha na planilha. */
  const identityRef = useRef<{ protocol: string; createdAt: string } | null>(null);
  /** Valores mais recentes, para uso em listeners e temporizadores. */
  const latestRef = useRef({ values, stepIndex, total: sections.length });
  latestRef.current = { values, stepIndex, total: sections.length };
  /** Último conteúdo confirmado na planilha, para não reenviar o que não mudou. */
  const savedSnapshotRef = useRef<string>('');
  const savingRef = useRef(false);
  const pendingRef = useRef(false);

  // Recupera rascunho salvo localmente
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(draftKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Draft;
      if (parsed.values && Object.keys(parsed.values).length > 0) {
        setValues(parsed.values);
        setStepIndex(Math.min(parsed.stepIndex ?? 0, spec.sections.length - 1));
        setHasDraft(true);
        // Retoma a mesma linha da planilha em vez de criar outra
        if (parsed.protocol && parsed.createdAt) {
          identityRef.current = { protocol: parsed.protocol, createdAt: parsed.createdAt };
          setProtocol(parsed.protocol);
        }
      }
    } catch {
      // rascunho corrompido: ignora
    }
  }, [draftKey, spec.sections.length]);

  // Uma trilha pode encurtar o formulário: nunca deixa a etapa apontar para o vazio
  useEffect(() => {
    if (stepIndex > sections.length - 1) setStepIndex(Math.max(0, sections.length - 1));
  }, [sections.length, stepIndex]);

  // Salva rascunho local a cada alteração
  useEffect(() => {
    if (Object.keys(values).length === 0) return;
    try {
      const draft: Draft = {
        values,
        stepIndex,
        protocol: identityRef.current?.protocol,
        createdAt: identityRef.current?.createdAt,
      };
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {
      // armazenamento indisponível (modo privado): segue sem rascunho
    }
  }, [values, stepIndex, protocol, draftKey]);

  /** Cria protocolo e horário na primeira necessidade. */
  const ensureIdentity = useCallback(() => {
    if (!identityRef.current) {
      const identity = { protocol: generateProtocol(spec.protocolPrefix), createdAt: brazilTimestamp() };
      identityRef.current = identity;
      setProtocol(identity.protocol);
    }
    return identityRef.current;
  }, [spec.protocolPrefix]);

  const buildOptions = useCallback(
    (status: SaveOptions['status']): SaveOptions => {
      const identity = ensureIdentity();
      return {
        protocol: identity.protocol,
        createdAt: identity.createdAt,
        status,
        progress: `${latestRef.current.stepIndex + 1} de ${latestRef.current.total}`,
      };
    },
    [ensureIdentity],
  );

  /**
   * Envia o estado atual para a planilha.
   * Envios simultâneos são evitados: se já houver um em andamento, marca que
   * outro é necessário e o dispara ao final — assim nada se perde.
   */
  const performSaveRef = useRef<((status: SaveOptions['status']) => Promise<boolean>) | null>(null);

  const performSave = useCallback(
    async (status: SaveOptions['status']): Promise<boolean> => {
      if (!hasEndpoint()) return false;

      const snapshot = JSON.stringify(latestRef.current.values);
      if (status === 'Em preenchimento' && snapshot === savedSnapshotRef.current) return true;

      if (savingRef.current) {
        pendingRef.current = true;
        return true;
      }

      savingRef.current = true;
      setSyncState('saving');

      const result = await saveToSheets(spec, latestRef.current.values, buildOptions(status));

      savingRef.current = false;

      if (result.ok) {
        savedSnapshotRef.current = snapshot;
        setSyncState('saved');
        setLastSavedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      } else {
        setSyncState('offline');
      }

      // Houve alterações enquanto salvávamos: envia de novo
      if (pendingRef.current) {
        pendingRef.current = false;
        void performSaveRef.current?.('Em preenchimento');
      }

      return result.ok;
    },
    [buildOptions, spec],
  );
  performSaveRef.current = performSave;

  // Salvamento contínuo na planilha após alguns segundos sem digitar
  useEffect(() => {
    if (stage !== 'form' || !hasEndpoint() || !hasAnyAnswer(values)) return;
    const timer = window.setTimeout(() => void performSave('Em preenchimento'), AUTOSAVE_DELAY);
    return () => window.clearTimeout(timer);
  }, [values, stepIndex, stage, performSave]);

  // Rede de segurança: se a aba for fechada com alterações pendentes, dispara um beacon
  useEffect(() => {
    const handleExit = () => {
      if (stage !== 'form') return;
      const snapshot = JSON.stringify(latestRef.current.values);
      if (snapshot === savedSnapshotRef.current || !hasAnyAnswer(latestRef.current.values)) return;
      saveOnExit(spec, latestRef.current.values, buildOptions('Em preenchimento'));
    };
    window.addEventListener('pagehide', handleExit);
    return () => window.removeEventListener('pagehide', handleExit);
  }, [stage, buildOptions, spec]);

  /** Aguarda o fim de um salvamento em andamento (no máximo ~5s). */
  const waitForIdle = async () => {
    for (let i = 0; i < 20 && savingRef.current; i++) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  };

  const section = sections[Math.min(stepIndex, sections.length - 1)];

  const visibleFields = useMemo(
    (): FieldDef[] => (section ? section.fields.filter((field) => !field.showIf || field.showIf(values)) : []),
    [section, values],
  );

  const clearError = useCallback((id: string) => {
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleChange = useCallback(
    (id: string, value: FieldValue) => {
      setValues((prev) => ({ ...prev, [id]: value }));
      clearError(id);
    },
    [clearError],
  );

  /** Grades e grupos numéricos: mescla dentro do setState para não perder cliques rápidos. */
  const handlePatch = useCallback(
    (id: string, rowKey: string, value: string) => {
      setValues((prev) => {
        const current = prev[id];
        const record = (current && typeof current === 'object' && !Array.isArray(current) ? current : {}) as Record<
          string,
          string
        >;
        return { ...prev, [id]: { ...record, [rowKey]: value } };
      });
      clearError(id);
    },
    [clearError],
  );

  /** Caixas de seleção: idem, evitando sobrescrever marcações em sequência rápida. */
  const handleToggle = useCallback(
    (id: string, option: string, maxSelections?: number) => {
      setValues((prev) => {
        const current = Array.isArray(prev[id]) ? (prev[id] as string[]) : [];
        if (current.includes(option)) {
          return { ...prev, [id]: current.filter((o) => o !== option) };
        }
        if (maxSelections !== undefined && current.length >= maxSelections) {
          return prev; // limite atingido: ignora a marcação
        }
        return { ...prev, [id]: [...current, option] };
      });
      clearError(id);
    },
    [clearError],
  );

  const validateStep = (): boolean => {
    const nextErrors: Record<string, string> = {};
    for (const field of visibleFields) {
      if (field.required && isEmpty(values[field.id])) {
        nextErrors[field.id] = field.type === 'consent' ? 'É necessário aceitar para enviar.' : 'Campo obrigatório.';
      }
      if (field.type === 'email' && !isEmpty(values[field.id])) {
        const email = String(values[field.id]);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) nextErrors[field.id] = 'Informe um e-mail válido.';
      }
    }
    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.querySelector(`[data-field="${firstError}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  const goToStep = (index: number) => {
    setStepIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Ao trocar de etapa, sobe as respostas na hora em vez de esperar o debounce
    if (hasAnyAnswer(latestRef.current.values)) void performSave('Em preenchimento');
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (stepIndex < sections.length - 1) goToStep(stepIndex + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) goToStep(stepIndex - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setSubmitState('sending');
    setSubmitError('');

    // Espera um salvamento automático em andamento para não sobrescrever o status final
    await waitForIdle();

    const ok = await performSave('Concluído');
    const result: { ok: boolean; error?: string } = ok
      ? { ok: true }
      : {
          ok: false,
          error: hasEndpoint()
            ? 'Não houve resposta do servidor. Verifique sua conexão com a internet e tente novamente.'
            : 'Endpoint de envio não configurado (VITE_SHEETS_ENDPOINT).',
        };

    if (result.ok) {
      try {
        window.localStorage.removeItem(draftKey);
      } catch {
        // ignora
      }
      setSubmitState('idle');
      setStage('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSubmitState('error');
      setSubmitError(result.error || 'Não foi possível enviar as respostas.');
    }
  };

  const downloadCopy = () => {
    const code = protocol || generateProtocol(spec.protocolPrefix);
    const content = buildTextSummary(spec, summaryTitle, values, code);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileSlug}-${code}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ───────────────────────────────────────────── Apresentação
  if (stage === 'intro') {
    return (
      <div className="bg-paper-bg min-h-screen py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-paper-accent uppercase tracking-[0.25em]">{intro.eyebrow}</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-paper-ink leading-none mt-6 mb-6">
            {intro.titleTop} <br />
            <span className="gradient-text-ink">{intro.titleAccent}</span>
          </h1>
          {intro.subtitle && (
            <p className="text-paper-soft text-lg md:text-xl font-light leading-relaxed mb-12">{intro.subtitle}</p>
          )}

          <div className="bg-paper-card border border-paper-line rounded-3xl p-8 md:p-12 space-y-8 shadow-[0_20px_60px_-30px_rgba(23,12,46,0.25)]">
            {intro.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-paper-soft font-light leading-relaxed">
                {paragraph}
              </p>
            ))}

            {intro.list && (
              <div>
                {intro.list.intro && (
                  <p className="text-paper-soft font-light leading-relaxed mb-6">{intro.list.intro}</p>
                )}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {intro.list.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-paper-soft">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-paper-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {intro.disclaimer && (
              <div className="border-l-2 border-paper-accent/40 bg-paper-accent/[0.04] rounded-r-xl pl-6 pr-4 py-4">
                <p className="text-sm text-paper-soft font-light leading-relaxed">{intro.disclaimer}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="flex items-start gap-3">
                <Lock className="text-paper-accent flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-paper-soft font-light leading-relaxed">{intro.privacyNote}</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-paper-accent flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-paper-soft font-light leading-relaxed">
                  São {sections.length} etapas. Tempo estimado de preenchimento:{' '}
                  <strong className="text-paper-ink font-semibold">{intro.estimatedTime}</strong>. Você pode parar e
                  continuar depois: cada resposta é{' '}
                  <strong className="text-paper-ink font-semibold">salva automaticamente</strong> enquanto você
                  preenche, sem precisar concluir de uma vez.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => {
                  setStage('form');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 py-5 px-8 rounded-full bg-brand-dark text-white font-bold text-lg hover:bg-paper-accent transition-colors shadow-[0_10px_30px_-10px_rgba(23,12,46,0.5)] flex justify-center items-center gap-3 group"
              >
                {hasDraft ? 'Continuar preenchimento' : 'Iniciar preenchimento'}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              {hasDraft && (
                <button
                  type="button"
                  onClick={() => {
                    window.localStorage.removeItem(draftKey);
                    setValues({});
                    setStepIndex(0);
                    setHasDraft(false);
                    // Um novo preenchimento gera outra linha na planilha
                    identityRef.current = null;
                    setProtocol('');
                    savedSnapshotRef.current = '';
                    setSyncState('idle');
                    setLastSavedAt('');
                  }}
                  className="py-5 px-8 rounded-full border border-paper-line text-paper-soft font-semibold hover:border-paper-accent hover:text-paper-accent transition-colors"
                >
                  Começar do zero
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────── Confirmação
  if (stage === 'success') {
    return (
      <div className="bg-paper-bg min-h-screen py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-paper-accent/10 border border-paper-accent/30 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-paper-accent" size={36} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-paper-ink leading-none mb-6">
            {success.title}
          </h1>
          {success.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`text-paper-soft font-light leading-relaxed ${index === 0 ? 'text-lg mb-6' : 'mb-10'}`}
            >
              {paragraph}
            </p>
          ))}

          {success.list && (
            <div className="bg-paper-card border border-paper-line rounded-3xl p-8 text-left mb-10 shadow-[0_20px_60px_-30px_rgba(23,12,46,0.25)]">
              <p className="text-[11px] font-bold text-paper-accent uppercase tracking-widest mb-5">
                {success.list.title}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {success.list.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-paper-soft">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-paper-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-paper-card border border-paper-line rounded-2xl px-6 py-5 mb-10 inline-block shadow-sm">
            <p className="text-[11px] font-bold text-paper-accent uppercase tracking-widest mb-2">Protocolo</p>
            <p className="text-2xl font-mono font-bold text-paper-ink tracking-tight">{protocol}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={downloadCopy}
              className="py-4 px-8 rounded-full border border-paper-line text-paper-soft font-semibold hover:border-paper-accent hover:text-paper-accent transition-colors flex items-center justify-center gap-3"
            >
              <Download size={18} /> Baixar cópia das respostas
            </button>
            <a
              href="https://wa.me/5562999546265"
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-8 rounded-full bg-brand-dark text-white font-bold hover:bg-paper-accent transition-colors shadow-[0_10px_30px_-10px_rgba(23,12,46,0.5)] flex items-center justify-center gap-3"
            >
              Falar com a equipe
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────── Etapas do formulário
  const isLastStep = stepIndex === sections.length - 1;
  const progress = ((stepIndex + 1) / sections.length) * 100;

  return (
    <div className="bg-paper-bg min-h-screen pb-32">
      {/* Barra de progresso */}
      <div className="sticky top-24 z-30 bg-paper-bg/95 backdrop-blur-md border-b border-paper-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-paper-accent uppercase tracking-widest">
              Etapa {stepIndex + 1} de {sections.length}
            </span>
            <span className="text-[11px] font-bold text-paper-muted uppercase tracking-widest">
              {Math.round(progress)}% concluído
            </span>
          </div>
          <div className="h-1.5 w-full bg-paper-line rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Cabeçalho da seção */}
        <div className="mb-12">
          <span className="text-6xl md:text-7xl font-black text-paper-accent/15 leading-none block mb-2">
            {section.number.padStart(2, '0')}
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-paper-ink leading-tight">
            {section.title}
          </h2>
          {section.intro && (
            <p className="text-paper-soft font-light leading-relaxed mt-4 max-w-2xl">{section.intro}</p>
          )}
        </div>

        {/* Campos */}
        <form
          className="space-y-12"
          onSubmit={(e) => {
            e.preventDefault();
            if (isLastStep) handleSubmit();
            else handleNext();
          }}
        >
          {visibleFields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              values={values}
              error={errors[field.id]}
              onChange={handleChange}
              onPatch={handlePatch}
              onToggle={handleToggle}
            />
          ))}

          {!hasEndpoint() && isLastStep && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-5">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-amber-900 font-light leading-relaxed">
                O destino das respostas ainda não foi configurado neste ambiente. Defina{' '}
                <code className="font-mono font-semibold text-amber-800">VITE_SHEETS_ENDPOINT</code> no arquivo{' '}
                <code className="font-mono font-semibold text-amber-800">.env.local</code> para gravar na planilha.
              </p>
            </div>
          )}

          {submitState === 'error' && (
            <div className="rounded-2xl border border-paper-danger/30 bg-paper-danger/[0.04] p-5">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="text-paper-danger flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-paper-ink mb-1">Não conseguimos enviar suas respostas.</p>
                  <p className="text-sm text-paper-soft font-light leading-relaxed">{submitError}</p>
                  <p className="text-sm text-paper-soft font-light leading-relaxed mt-2">
                    Seu preenchimento continua salvo neste navegador. Tente novamente ou baixe uma cópia e envie para{' '}
                    <a href="mailto:contato@cosmmus.com" className="text-paper-accent font-medium hover:underline">
                      contato@cosmmus.com
                    </a>
                    .
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={downloadCopy}
                className="text-sm font-semibold text-paper-accent hover:text-paper-ink flex items-center gap-2"
              >
                <Download size={16} /> Baixar cópia das respostas
              </button>
            </div>
          )}

          {/* Navegação */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-8 border-t border-paper-line">
            <button
              type="button"
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="py-4 px-6 rounded-full border border-paper-line text-paper-soft font-semibold hover:border-paper-accent hover:text-paper-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Anterior
            </button>

            <div className="order-first sm:order-none flex items-center justify-center">
              {syncState === 'saving' && (
                <span className="flex items-center gap-2 text-xs text-paper-muted">
                  <RefreshCw size={14} className="animate-spin" /> Salvando respostas...
                </span>
              )}
              {syncState === 'saved' && (
                <span className="flex items-center gap-2 text-xs text-paper-muted">
                  <ShieldCheck size={14} className="text-paper-accent" /> Respostas salvas
                  {lastSavedAt && ` às ${lastSavedAt}`}
                </span>
              )}
              {syncState === 'offline' && (
                <button
                  type="button"
                  onClick={() => void performSave('Em preenchimento')}
                  className="flex items-center gap-2 text-xs font-semibold text-paper-danger hover:underline"
                >
                  <CloudOff size={14} /> Sem conexão com a planilha. Tentar novamente
                </button>
              )}
              {syncState === 'idle' && (
                <span className="flex items-center gap-2 text-xs text-paper-muted">
                  <ShieldCheck size={14} /> Salvamento automático ativo
                </span>
              )}
            </div>

            {isLastStep ? (
              <button
                type="submit"
                disabled={submitState === 'sending'}
                className="py-4 px-8 rounded-full bg-brand-dark text-white font-bold hover:bg-paper-accent transition-colors shadow-[0_10px_30px_-10px_rgba(23,12,46,0.5)] flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {submitState === 'sending' ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Enviando...
                  </>
                ) : (
                  <>
                    Enviar formulário <Send size={18} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                className="py-4 px-8 rounded-full bg-brand-dark text-white font-bold hover:bg-paper-accent transition-colors shadow-[0_10px_30px_-10px_rgba(23,12,46,0.5)] flex items-center justify-center gap-3 group"
              >
                Próxima etapa <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormRunner;
