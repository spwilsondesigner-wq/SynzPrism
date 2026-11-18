import { Check, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";

export type UserRole = "Lead" | "Developer" | "Client owner";

const roles: Array<{ role: UserRole; name: string; initials: string }> = [
  { role: "Lead", name: "Pravin Wilson", initials: "PW" },
  { role: "Developer", name: "Rahul Nair", initials: "RN" },
  { role: "Client owner", name: "James Cole", initials: "JC" },
];

export default function RoleSwitcher({
  role,
  onChange,
}: {
  role: UserRole;
  onChange: (role: UserRole) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(roles.findIndex((item) => item.role === role));
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selected = roles.find((item) => item.role === role) ?? roles[0];

  const select = (nextRole: UserRole) => {
    onChange(nextRole);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + direction + roles.length) % roles.length);
    }
    if (event.key === "Enter" && open) {
      event.preventDefault();
      select(roles[activeIndex].role);
    }
  };

  return (
    <div className="role-switcher" onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        className="role-switcher__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setActiveIndex(roles.findIndex((item) => item.role === role));
          setOpen((value) => !value);
        }}
      >
        <span>
          <small>View as</small>
          <strong>{selected.role}</strong>
        </span>
        <ChevronDown size={15} aria-hidden />
      </button>
      {open && (
        <div className="role-menu" role="listbox" aria-label="View as">
          {roles.map((item, index) => (
            <button
              key={item.role}
              role="option"
              aria-selected={item.role === role}
              className={index === activeIndex ? "active" : ""}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(item.role)}
            >
              <span className="avatar" aria-hidden>
                {item.initials}
              </span>
              <span>
                <strong>{item.role}</strong>
                <small>{item.name}</small>
              </span>
              {item.role === role && <Check size={16} aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
