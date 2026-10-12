interface ChoiceGroupProps {
  label: string; options: string[]; value: string; onChange: (value: string) => void;
}

export default function ChoiceGroup({ label, options, value, onChange }: ChoiceGroupProps) {
  return (
    <div className="choice-field">
      <span>{label}<em>*</em></span>
      <div>{options.map((option) => (
        <button type="button" key={option} className={value === option ? "is-selected" : ""} onClick={() => onChange(option)}>
          <i />{option}
        </button>
      ))}</div>
    </div>
  );
}
