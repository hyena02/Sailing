import type { HTMLInputTypeAttribute, ReactNode } from "react";

interface FormFieldProps {
  label: string; name: string; value: string; onChange: (value: string) => void;
  placeholder?: string; type?: HTMLInputTypeAttribute; required?: boolean;
  hint?: string; error?: string; action?: ReactNode; maxLength?: number;
}

export default function FormField({ label, name, value, onChange, placeholder, type = "text", required, hint, error, action, maxLength }: FormFieldProps) {
  return (
    <label className={`form-field ${error ? "has-error" : ""}`}>
      <span className="form-field__label">{label}{required && <em>*</em>}</span>
      <span className="form-field__control">
        <input name={name} type={type} value={value} onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder} maxLength={maxLength} />
        {action}
      </span>
      {(error || hint) && <small className={error ? "form-field__error" : ""}>{error || hint}</small>}
    </label>
  );
}
