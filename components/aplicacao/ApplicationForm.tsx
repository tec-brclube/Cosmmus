import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Lock,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { FieldDef, FieldValue, FormValues, formSections } from './formSchema';
import FormField from './FormFields';
import { buildTextSummary, generateProtocol, hasEndpoint, submitToSheets } from './submit';

const DRAFT_KEY = 'cosmmus:aplicacao:v1';

type Stage = 'intro' | 'form' | 'success';
type SubmitState = 'idle' | 'sending' | 'error';

const isEmpty = (value: FieldValue | undefined): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return Object.values(value).every((v) => !v);
};

const ApplicationForm: React.FC = () => {
  const [stage, setStage] = useState<Stage>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string>('');
  const [protocol, setProtocol] = useState<string>('');
  const [hasDraft, setHasDraft] = useState(false);

  // Recupera rascunho salvo localmente
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { values?: FormValues; stepIndex?: number };
      if (parsed.values && Object.keys(parsed.values).length > 0) {
        setValues(parsed.values);
        setStepIndex(Math.min(parsed.stepIndex ?? 0, formSections.length - 1));
        setHasDraft(true);
      }
    } catch {
      // rascunho corrompido: ignora
    }
  }, []);

  // Salva rascunho a cada alteração
  useEffect(() => {
    if (Object.keys(values).length === 0) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ values, stepIndex }));
    } catch {
      // armazenamento indisponível (modo privado): segue sem rascunho
    }
  }, [values, stepIndex]);

  const section = formSections[stepIndex];

  const visibleFields = useMemo(
    (): FieldDef[] => section.fields.filter((field) => !field.showIf || field.showIf(values)),
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
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (stepIndex < formSections.length - 1) goToStep(stepIndex + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) goToStep(stepIndex - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const currentProtocol = protocol || generateProtocol();
    setProtocol(currentProtocol);
    setSubmitState('sending');
    setSubmitError('');

    const result = await submitToSheets(values, currentProtocol);

    if (result.ok) {
      try {
        window.localStorage.removeItem(DRAFT_KEY);
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
    const content = buildTextSummary(values, protocol || generateProtocol());
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cosmmus-caracterizacao-${protocol || 'respostas'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ───────────────────────────────────────────── Apresentação
  if (stage === 'intro') {
    return (
      <div className="bg-paper-bg min-h-screen py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-paper-accent uppercase tracking-[0.25em]">
            Aplicação para consultoria
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-paper-ink leading-none mt-6 mb-6">
            Formulário de <br />
            <span className="gradient-text-ink">caracterização organizacional</span>
          </h1>
          <p className="text-paper-soft text-lg md:text-xl font-light leading-relaxed mb-12">
            Gestão de Riscos Psicossociais e Saúde no Trabalho
          </p>

          <div className="bg-paper-card border border-paper-line rounded-3xl p-8 md:p-12 space-y-8 shadow-[0_20px_60px_-30px_rgba(23,12,46,0.25)]">
            <p className="text-paper-soft font-light leading-relaxed">
              Este formulário tem como finalidade conhecer as características gerais da empresa, sua estrutura,
              atividades, jornadas, práticas de gestão e principais desafios relacionados ao trabalho.
            </p>

            <div>
              <p className="text-paper-soft font-light leading-relaxed mb-6">
                As informações fornecidas ajudarão a Cosmmus Business a compreender o contexto inicial da empresa e
                elaborar uma proposta técnica e comercial compatível com:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {[
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
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-paper-soft">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-paper-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-2 border-paper-accent/40 bg-paper-accent/[0.04] rounded-r-xl pl-6 pr-4 py-4">
              <p className="text-sm text-paper-soft font-light leading-relaxed">
                O preenchimento deste formulário <strong className="text-paper-ink font-semibold">não constitui</strong>{' '}
                avaliação de riscos, diagnóstico psicológico, laudo, parecer técnico, inventário de riscos ou
                certificação de conformidade com a NR-1.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="flex items-start gap-3">
                <Lock className="text-paper-accent flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-paper-soft font-light leading-relaxed">
                  As informações serão tratadas de forma confidencial e utilizadas inicialmente para análise de escopo e
                  elaboração da proposta.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-paper-accent flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-paper-soft font-light leading-relaxed">
                  São 22 etapas. Tempo estimado de preenchimento:{' '}
                  <strong className="text-paper-ink font-semibold">35 a 50 minutos</strong>. Você pode parar e
                  continuar depois: as respostas são salvas automaticamente neste navegador.
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
                    window.localStorage.removeItem(DRAFT_KEY);
                    setValues({});
                    setStepIndex(0);
                    setHasDraft(false);
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
            Recebemos suas informações.
          </h1>
          <p className="text-paper-soft text-lg font-light leading-relaxed mb-6">
            Agradecemos pelas informações. A equipe da Cosmmus Business analisará as características da organização, a
            dimensão do público, a complexidade das atividades, as modalidades de aplicação e os resultados esperados.
          </p>
          <p className="text-paper-soft font-light leading-relaxed mb-10">
            Caso seja necessário, entraremos em contato para uma breve reunião de qualificação antes da elaboração da
            proposta.
          </p>

          <div className="bg-paper-card border border-paper-line rounded-3xl p-8 text-left mb-10 shadow-[0_20px_60px_-30px_rgba(23,12,46,0.25)]">
            <p className="text-[11px] font-bold text-paper-accent uppercase tracking-widest mb-5">
              A proposta poderá contemplar etapas como
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
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
              ].map((etapa) => (
                <li key={etapa} className="flex items-start gap-3 text-sm text-paper-soft">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-paper-accent flex-shrink-0" />
                  {etapa}
                </li>
              ))}
            </ul>
          </div>

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
  const isLastStep = stepIndex === formSections.length - 1;
  const progress = ((stepIndex + 1) / formSections.length) * 100;

  return (
    <div className="bg-paper-bg min-h-screen pb-32">
      {/* Barra de progresso */}
      <div className="sticky top-24 z-30 bg-paper-bg/95 backdrop-blur-md border-b border-paper-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-paper-accent uppercase tracking-widest">
              Etapa {stepIndex + 1} de {formSections.length}
            </span>
            <span className="text-[11px] font-bold text-paper-muted uppercase tracking-widest">
              {Math.round(progress)}% concluído
            </span>
          </div>
          <div className="h-1.5 w-full bg-paper-line rounded-full overflow-hidden">
            <div className="h-full gradient-bg rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Cabeçalho da seção */}
        <div className="mb-12">
          <span className="text-6xl md:text-7xl font-black text-paper-accent/15 leading-none block mb-2">
            {section.number.padStart(2, '0')}
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-paper-ink leading-tight">{section.title}</h2>
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

            <div className="flex items-center gap-2 text-xs text-paper-muted order-first sm:order-none">
              <ShieldCheck size={14} /> Rascunho salvo automaticamente
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

export default ApplicationForm;
