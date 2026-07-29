import React from 'react';
import { Check } from 'lucide-react';
import { FieldDef, FieldValue, FormValues, OTHER_SUFFIX } from './formSchema';

const OTHER_LABELS = ['Outro', 'Outra', 'Outros'];
const isOtherOption = (option: string) => OTHER_LABELS.includes(option);

const inputClass =
  'w-full bg-transparent border-b-2 border-paper-muted/40 py-3 text-paper-ink text-base focus:border-paper-accent focus:outline-none transition-colors placeholder-paper-muted/70';

interface FieldProps {
  field: FieldDef;
  values: FormValues;
  error?: string;
  onChange: (id: string, value: FieldValue) => void;
  /** Altera uma linha de grade/grupo numérico sem depender do estado renderizado. */
  onPatch: (id: string, rowKey: string, value: string) => void;
  /** Marca ou desmarca uma opção de caixa de seleção, respeitando o limite. */
  onToggle: (id: string, option: string, maxSelections?: number) => void;
}

/** Máscara de CNPJ: 00.000.000/0000-00 */
const maskCnpj = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

/** Máscara de telefone: (00) 00000-0000 */
const maskPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};

const OtherInput: React.FC<{ field: FieldDef; values: FormValues; onChange: FieldProps['onChange'] }> = ({
  field,
  values,
  onChange,
}) => {
  const value = values[field.id];
  const selected = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
  if (!selected.some(isOtherOption)) return null;

  return (
    <input
      type="text"
      value={(values[field.id + OTHER_SUFFIX] as string) || ''}
      onChange={(e) => onChange(field.id + OTHER_SUFFIX, e.target.value)}
      placeholder="Especifique"
      className={`${inputClass} mt-4`}
    />
  );
};

/** Botão de opção (rádio ou caixa de seleção). */
const OptionButton: React.FC<{
  label: string;
  selected: boolean;
  multiple: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ label, selected, multiple, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    disabled={disabled}
    className={`flex items-start gap-3 text-left px-4 py-3 rounded-2xl border transition-all duration-200 ${
      selected
        ? 'border-paper-accent bg-paper-accent/[0.07] text-paper-ink shadow-sm'
        : disabled
          ? 'border-paper-line bg-paper-card text-paper-muted opacity-50 cursor-not-allowed'
          : 'border-paper-line bg-paper-card text-paper-soft hover:border-paper-accent/50 hover:text-paper-ink'
    }`}
  >
    <span
      className={`flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center border-2 transition-colors ${
        multiple ? 'rounded-md' : 'rounded-full'
      } ${selected ? 'border-paper-accent bg-paper-accent text-white' : 'border-paper-muted/60'}`}
    >
      {selected && (multiple ? <Check size={13} strokeWidth={3} /> : <span className="w-2 h-2 rounded-full bg-white" />)}
    </span>
    <span className="text-sm leading-snug">{label}</span>
  </button>
);

const FormField: React.FC<FieldProps> = ({ field, values, error, onChange, onPatch, onToggle }) => {
  const value = values[field.id];
  const stringValue = typeof value === 'string' ? value : '';
  const arrayValue = Array.isArray(value) ? value : [];
  const recordValue = (value && typeof value === 'object' && !Array.isArray(value) ? value : {}) as Record<string, string>;

  const renderControl = () => {
    switch (field.type) {
      case 'paragraph':
        return (
          <textarea
            id={field.id}
            rows={4}
            value={stringValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full bg-paper-card border border-paper-line rounded-2xl p-4 text-paper-ink text-base focus:border-paper-accent focus:outline-none focus:ring-4 focus:ring-paper-accent/10 transition-all placeholder-paper-muted/70 resize-y"
          />
        );

      case 'number':
        return (
          <input
            id={field.id}
            type="number"
            min={0}
            inputMode="numeric"
            value={stringValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`${inputClass} max-w-xs`}
          />
        );

      case 'email':
        return (
          <input
            id={field.id}
            type="email"
            autoComplete="email"
            value={stringValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
        );

      case 'tel':
        return (
          <input
            id={field.id}
            type="tel"
            inputMode="tel"
            value={stringValue}
            onChange={(e) => onChange(field.id, maskPhone(e.target.value))}
            placeholder={field.placeholder}
            className={`${inputClass} max-w-xs`}
          />
        );

      case 'cnpj':
        return (
          <input
            id={field.id}
            type="text"
            inputMode="numeric"
            value={stringValue}
            onChange={(e) => onChange(field.id, maskCnpj(e.target.value))}
            placeholder={field.placeholder}
            className={`${inputClass} max-w-xs`}
          />
        );

      case 'select':
        return (
          <>
            <select
              id={field.id}
              value={stringValue}
              onChange={(e) => onChange(field.id, e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option className="bg-paper-card text-paper-ink" value="">
                Selecione uma opção
              </option>
              {(field.options || []).map((option) => (
                <option className="bg-paper-card text-paper-ink" key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {field.allowOther && <OtherInput field={field} values={values} onChange={onChange} />}
          </>
        );

      case 'radio':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(field.options || []).map((option) => (
                <OptionButton
                  key={option}
                  label={option}
                  multiple={false}
                  selected={stringValue === option}
                  onClick={() => onChange(field.id, stringValue === option ? '' : option)}
                />
              ))}
            </div>
            {field.allowOther && <OtherInput field={field} values={values} onChange={onChange} />}
          </>
        );

      case 'checkbox': {
        const limit = field.maxSelections;
        const atLimit = limit !== undefined && arrayValue.length >= limit;
        return (
          <>
            {limit !== undefined && (
              <p
                className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                  atLimit ? 'text-paper-danger' : 'text-paper-muted'
                }`}
              >
                {arrayValue.length} de {limit} selecionadas
                {atLimit && ' — limite atingido'}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(field.options || []).map((option) => {
                const selected = arrayValue.includes(option);
                return (
                  <OptionButton
                    key={option}
                    label={option}
                    multiple
                    selected={selected}
                    disabled={atLimit && !selected}
                    onClick={() => onToggle(field.id, option, limit)}
                  />
                );
              })}
            </div>
            {field.allowOther && <OtherInput field={field} values={values} onChange={onChange} />}
          </>
        );
      }

      case 'scale': {
        const min = field.scaleMin ?? 1;
        const max = field.scaleMax ?? 5;
        const steps = Array.from({ length: max - min + 1 }, (_, i) => String(min + i));
        return (
          <div>
            <div className="flex flex-wrap gap-3">
              {steps.map((step) => (
                <button
                  type="button"
                  key={step}
                  onClick={() => onChange(field.id, stringValue === step ? '' : step)}
                  aria-pressed={stringValue === step}
                  className={`w-14 h-14 rounded-2xl border text-lg font-bold transition-all duration-200 ${
                    stringValue === step
                      ? 'border-paper-accent bg-paper-accent text-white shadow-[0_6px_20px_rgba(122,0,224,0.28)]'
                      : 'border-paper-line bg-paper-card text-paper-soft hover:border-paper-accent/60 hover:text-paper-ink'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
            <div className="flex justify-between max-w-md mt-3 text-[11px] uppercase tracking-widest text-paper-muted">
              <span>
                {min} — {field.scaleMinLabel}
              </span>
              <span>
                {max} — {field.scaleMaxLabel}
              </span>
            </div>
          </div>
        );
      }

      case 'grid':
        return (
          <div className="space-y-3">
            {/* Desktop: grade com cabeçalho */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] font-bold uppercase tracking-widest text-paper-muted pb-3 pr-4 w-1/4">
                      {field.rowHeader || 'Item'}
                    </th>
                    {(field.columns || []).map((column) => (
                      <th
                        key={column}
                        className="text-center text-[11px] font-bold uppercase tracking-widest text-paper-muted pb-3 px-2"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(field.rows || []).map((row) => (
                    <tr key={row} className="border-t border-paper-line">
                      <td className="text-sm text-paper-soft py-3 pr-4">{row}</td>
                      {(field.columns || []).map((column) => {
                        const selected = recordValue[row] === column;
                        return (
                          <td key={column} className="text-center py-3 px-2">
                            <button
                              type="button"
                              aria-label={`${row}: ${column}`}
                              aria-pressed={selected}
                              onClick={() => onPatch(field.id, row, selected ? '' : column)}
                              className={`w-6 h-6 rounded-full border transition-all duration-200 flex items-center justify-center ${
                                selected
                                  ? 'border-paper-accent bg-paper-accent shadow-[0_2px_10px_rgba(122,0,224,0.35)]'
                                  : 'border-paper-muted/60 hover:border-paper-accent'
                              }`}
                            >
                              {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: um bloco por linha */}
            <div className="md:hidden space-y-5">
              {(field.rows || []).map((row) => (
                <div key={row}>
                  <p className="text-sm font-semibold text-paper-ink mb-2">{row}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {(field.columns || []).map((column) => (
                      <OptionButton
                        key={column}
                        label={column}
                        multiple={false}
                        selected={recordValue[row] === column}
                        onClick={() => onPatch(field.id, row, recordValue[row] === column ? '' : column)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'numberGroup':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(field.rows || []).map((row) => (
              <div key={row} className="flex items-center justify-between gap-4 bg-paper-card border border-paper-line rounded-2xl px-4 py-3">
                <label htmlFor={`${field.id}-${row}`} className="text-sm text-paper-soft leading-snug">
                  {row}
                </label>
                <input
                  id={`${field.id}-${row}`}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={recordValue[row] || ''}
                  onChange={(e) => onPatch(field.id, row, e.target.value)}
                  placeholder="0"
                  className="w-20 flex-shrink-0 bg-transparent border-b-2 border-paper-muted/40 py-1 text-paper-ink font-semibold text-right focus:border-paper-accent focus:outline-none transition-colors placeholder-paper-muted/60"
                />
              </div>
            ))}
          </div>
        );

      case 'consent':
        return (
          <OptionButton
            label="Sim, declaro e autorizo."
            multiple
            selected={stringValue === 'true'}
            onClick={() => onChange(field.id, stringValue === 'true' ? '' : 'true')}
          />
        );

      case 'text':
      default:
        return (
          <input
            id={field.id}
            type="text"
            value={stringValue}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
        );
    }
  };

  const isConsent = field.type === 'consent';

  return (
    <div className="scroll-mt-32" data-field={field.id}>
      <label
        htmlFor={field.id}
        className={`block mb-3 ${
          isConsent ? 'text-sm text-paper-soft font-light leading-relaxed' : 'text-base md:text-lg text-paper-ink font-semibold leading-snug'
        }`}
      >
        {!isConsent && <span className="text-paper-accent font-mono text-sm mr-2">{field.id}</span>}
        {field.label}
        {field.required && <span className="text-paper-danger ml-1">*</span>}
      </label>

      {field.help && <p className="text-sm text-paper-muted font-light mb-4 -mt-1">{field.help}</p>}

      {renderControl()}

      {error && <p className="mt-2 text-sm font-medium text-paper-danger">{error}</p>}
    </div>
  );
};

export default FormField;
