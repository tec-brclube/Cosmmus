import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, LoaderCircle, MessageCircle } from 'lucide-react';
import { FormSpec, brazilTimestamp, generateProtocol, saveToSheets } from '../formulario/submit';
import { FormValues, SectionDef } from '../formulario/types';

/**
 * Formulário de contato da Cosmmus Coop.
 *
 * Grava na mesma planilha dos demais formulários, na aba "Cosmmus Coop", e
 * dispara os mesmos avisos (e-mail e Google Chat) no envio. Se a planilha não
 * responder, o texto já preenchido segue pelo WhatsApp — o contato não se perde.
 */

export const INTERESTS = ['Diagnóstico', 'Oficina de Planejamento 2027', 'Palestra ou curso', 'Outro assunto'] as const;
export type CoopInterest = (typeof INTERESTS)[number];

/** Os sete ramos do cooperativismo reconhecidos pelo Sistema OCB. */
const RAMOS = [
  'Agropecuário',
  'Consumo',
  'Crédito',
  'Infraestrutura',
  'Saúde',
  'Trabalho, produção de bens e serviços',
  'Transporte',
  'Ainda não definido',
];

/** Perguntas, na ordem das colunas da planilha. O id numera a coluna. */
const SECTIONS: SectionDef[] = [
  {
    number: '1',
    title: 'Contato Cosmmus Coop',
    fields: [
      { id: '1', label: 'Nome', type: 'text', required: true },
      { id: '2', label: 'Cooperativa', type: 'text' },
      { id: '3', label: 'Ramo', type: 'select', options: RAMOS },
      { id: '4', label: 'Cidade e UF', type: 'text' },
      { id: '5', label: 'WhatsApp', type: 'tel', required: true },
      { id: '6', label: 'E-mail', type: 'email' },
      { id: '7', label: 'O que você procura?', type: 'radio', options: [...INTERESTS] },
      { id: '8', label: 'Mensagem', type: 'paragraph' },
    ],
  },
];

const SPEC: FormSpec = {
  formName: 'Cosmmus Coop',
  sheetName: 'Cosmmus Coop',
  protocolPrefix: 'COOP',
  sections: SECTIONS,
};

const WHATSAPP_NUMBER = '5562999546265';

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface CoopContactFormProps {
  interest: CoopInterest | '';
  onInterestChange: (interest: CoopInterest) => void;
  accent: string;
}

const inputClass =
  'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 transition-colors focus:outline-none focus:border-[#19c46e] focus:bg-white/[0.05]';
const labelClass = 'block text-xs font-bold tracking-[0.15em] uppercase text-white/60 mb-2';

const CoopContactForm: React.FC<CoopContactFormProps> = ({ interest, onInterestChange, accent }) => {
  const [fields, setFields] = useState({ nome: '', cooperativa: '', ramo: '', cidade: '', whatsapp: '', email: '', mensagem: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [protocol, setProtocol] = useState('');
  const [error, setError] = useState('');
  const confirmationRef = useRef<HTMLDivElement>(null);

  // A confirmação é mais curta que o formulário: sem isso, ela ficaria acima da tela
  useEffect(() => {
    if (status === 'sent') confirmationRef.current?.scrollIntoView({ block: 'center' });
  }, [status]);

  const set = (key: keyof typeof fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFields((current) => ({ ...current, [key]: event.target.value }));

  const toValues = (): FormValues => ({
    '1': fields.nome.trim(),
    '2': fields.cooperativa.trim(),
    '3': fields.ramo,
    '4': fields.cidade.trim(),
    '5': fields.whatsapp.trim(),
    '6': fields.email.trim(),
    '7': interest,
    '8': fields.mensagem.trim(),
  });

  /** Mesmo conteúdo em texto, para seguir pelo WhatsApp se a planilha falhar. */
  const whatsappLink = () => {
    const values = toValues();
    const lines = ['Olá! Vim pela página da Cosmmus Coop.'];
    for (const field of SECTIONS[0].fields) {
      const value = values[field.id];
      if (typeof value === 'string' && value) lines.push(`${field.label}: ${value}`);
    }
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === 'sending') return;

    const newProtocol = protocol || generateProtocol(SPEC.protocolPrefix);
    setProtocol(newProtocol);
    setStatus('sending');
    setError('');

    const result = await saveToSheets(SPEC, toValues(), {
      protocol: newProtocol,
      createdAt: brazilTimestamp(),
      status: 'Concluído',
      progress: '1 de 1',
    });

    if (result.ok) {
      setStatus('sent');
    } else {
      setStatus('error');
      setError(result.error || 'Não foi possível enviar agora.');
    }
  };

  if (status === 'sent') {
    return (
      <div
        ref={confirmationRef}
        className="rounded-3xl border border-white/10 bg-[#07051a]/80 backdrop-blur-xl p-8 md:p-12 text-center"
        role="status"
      >
        <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-[#03140b]" style={{ background: accent }}>
          <Check size={30} strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Recebemos a sua mensagem.</h3>
        <p className="text-white/70 leading-relaxed max-w-md mx-auto mb-6">
          Vamos entender o momento da cooperativa e responder com uma proposta de primeiro passo.
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
          Protocolo <span className="text-white/80 font-bold tracking-normal">{protocol}</span>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-[#07051a]/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 space-y-6 shadow-2xl"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="coop-nome" className={labelClass}>Nome</label>
          <input id="coop-nome" required autoComplete="name" value={fields.nome} onChange={set('nome')} className={inputClass} placeholder="Seu nome" />
        </div>
        <div>
          <label htmlFor="coop-cooperativa" className={labelClass}>Cooperativa</label>
          <input id="coop-cooperativa" autoComplete="organization" value={fields.cooperativa} onChange={set('cooperativa')} className={inputClass} placeholder="Nome da cooperativa ou do grupo" />
        </div>
        <div>
          <label htmlFor="coop-ramo" className={labelClass}>Ramo</label>
          <select
            id="coop-ramo"
            value={fields.ramo}
            onChange={set('ramo')}
            className={`${inputClass} appearance-none cursor-pointer ${fields.ramo ? '' : 'text-white/30'}`}
          >
            <option value="" className="bg-[#07051a] text-white/50">Selecione</option>
            {RAMOS.map((ramo) => (
              <option key={ramo} value={ramo} className="bg-[#07051a] text-white">{ramo}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="coop-cidade" className={labelClass}>Cidade e UF</label>
          <input id="coop-cidade" autoComplete="address-level2" value={fields.cidade} onChange={set('cidade')} className={inputClass} placeholder="Ex.: Goiânia-GO" />
        </div>
        <div>
          <label htmlFor="coop-whatsapp" className={labelClass}>WhatsApp</label>
          <input id="coop-whatsapp" type="tel" required autoComplete="tel" value={fields.whatsapp} onChange={set('whatsapp')} className={inputClass} placeholder="(00) 00000-0000" />
        </div>
        <div>
          <label htmlFor="coop-email" className={labelClass}>E-mail</label>
          <input id="coop-email" type="email" autoComplete="email" value={fields.email} onChange={set('email')} className={inputClass} placeholder="voce@cooperativa.coop.br" />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>O que você procura?</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INTERESTS.map((option) => {
            const selected = interest === option;
            return (
              <label
                key={option}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#19c46e] ${
                  selected ? 'border-[#19c46e] bg-[#19c46e]/10 text-white' : 'border-white/10 text-white/75 hover:border-white/25'
                }`}
              >
                <input
                  type="radio"
                  name="coop-interesse"
                  value={option}
                  checked={selected}
                  onChange={() => onInterestChange(option)}
                  className="sr-only"
                />
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selected ? 'border-[#19c46e]' : 'border-white/30'}`}
                  aria-hidden="true"
                >
                  {selected && <span className="w-2 h-2 rounded-full" style={{ background: accent }} />}
                </span>
                <span className="text-sm font-semibold">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="coop-mensagem" className={labelClass}>Mensagem</label>
        <textarea
          id="coop-mensagem"
          rows={4}
          value={fields.mensagem}
          onChange={set('mensagem')}
          className={`${inputClass} resize-y min-h-[120px]`}
          placeholder="Conte em que momento a cooperativa está"
        />
      </div>

      {status === 'error' && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-4 text-sm text-amber-100" role="alert">
          <p className="mb-3">{error} Tente de novo ou envie as mesmas informações pelo WhatsApp.</p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-white hover:underline"
          >
            <MessageCircle size={16} />
            Enviar pelo WhatsApp
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group w-full h-14 rounded-full font-bold text-lg text-[#03140b] flex items-center justify-center gap-3 transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_32px_rgba(25,196,110,0.45)] disabled:opacity-70 disabled:cursor-wait focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#19c46e]"
        style={{ background: accent }}
      >
        {status === 'sending' ? (
          <>
            <LoaderCircle size={20} className="animate-spin" />
            Enviando
          </>
        ) : (
          <>
            Enviar
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
};

export default CoopContactForm;
