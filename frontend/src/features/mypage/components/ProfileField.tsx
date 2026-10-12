
type ProfileFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "date";
  required?: boolean;
  wide?: boolean;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
};

export default function ProfileField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  wide = false,
  placeholder,
  maxLength,
  disabled = false,
}: ProfileFieldProps) {
  return (
    <label className={`profile-field${wide ? " is-wide" : ""}`}>
      <span> {label} {required && " *"} </span>

      <input type={type} value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required} placeholder={placeholder} maxLength={maxLength} disabled={disabled}
      />
    </label>
  );
}
