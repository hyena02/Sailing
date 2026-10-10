import Icon, { type IconName } from "../../../components/common/icon";

interface SearchDropdownProps {
  icon: IconName;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}

export default function SearchDropdown({ icon, value, options, open, onToggle, onChange }: SearchDropdownProps) {
  return (
    <div className="search-dropdown">
      <button type="button" className={`search-dropdown__trigger ${open ? "is-open" : ""}`} onClick={onToggle} aria-expanded={open}>
        <Icon name={icon} size={18} /><span>{value}</span>
        <i><Icon name="chevron" size={15} /></i>
      </button>
      {open && (
        <div className="search-dropdown__menu">
          {options.map((option) => (
            <button type="button" key={option} className={value === option ? "is-selected" : ""} onClick={() => onChange(option)}>
              {option}{value === option && <span />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}