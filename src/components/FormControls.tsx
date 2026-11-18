import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { AlertCircle, Check, Search } from "lucide-react";

type FieldBase = { label: string; helper?: string; error?: string; success?: boolean; id: string };

export function Input({
  label,
  helper,
  error,
  success,
  id,
  ...props
}: FieldBase & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`field ${error ? "field--error" : success ? "field--success" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="field__control">
        <input id={id} aria-invalid={!!error} aria-describedby={`${id}-message`} {...props} />
        {(error || success) && (
          <span className="field__state" aria-hidden>
            {error ? <AlertCircle size={17} /> : <Check size={17} />}
          </span>
        )}
      </div>
      {(error || helper) && (
        <p id={`${id}-message`} className="field__message">
          {error && <AlertCircle size={14} aria-hidden />}
          {error || helper}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  helper,
  error,
  success,
  id,
  children,
  ...props
}: FieldBase & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`field ${error ? "field--error" : success ? "field--success" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="field__control">
        <select id={id} aria-invalid={!!error} aria-describedby={`${id}-message`} {...props}>
          {children}
        </select>
      </div>
      {(error || helper) && (
        <p id={`${id}-message`} className="field__message">
          {error && <AlertCircle size={14} aria-hidden />}
          {error || helper}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  helper,
  error,
  id,
  ...props
}: FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} aria-invalid={!!error} aria-describedby={`${id}-message`} {...props} />
      {(error || helper) && (
        <p id={`${id}-message`} className="field__message">
          {error && <AlertCircle size={14} aria-hidden />}
          {error || helper}
        </p>
      )}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  compact = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
}) {
  return (
    <label className={`search ${compact ? "search--compact" : ""}`}>
      <Search size={18} aria-hidden />
      <span className="sr-only">Search assets</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {!compact && <kbd>⌘K</kbd>}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="toggle-row">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle ${checked ? "toggle--on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
      <span>{label}</span>
    </label>
  );
}

export function FilterChip({
  selected,
  count,
  children,
  onClick,
}: {
  selected?: boolean;
  count?: number;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`filter-chip ${selected ? "filter-chip--selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
      {count !== undefined && <span>{count}</span>}
    </button>
  );
}
