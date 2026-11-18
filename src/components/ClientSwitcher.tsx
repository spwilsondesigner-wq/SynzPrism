import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const clients = [
  { name: "Meridian Insurance", path: "Qlik → Power BI" },
  { name: "Apex Auto Components", path: "Qlik → Power BI" },
  { name: "CareFirst Health", path: "Qlik → Power BI" },
  { name: "Northwind Retail", path: "Qlik → Power BI" },
];

export default function ClientSwitcher() {
  const [selected, setSelected] = useState(clients[0]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => clients.filter((client) => client.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const openMenu = () => {
    setOpen(true);
    setQuery("");
    setActiveIndex(
      Math.max(
        0,
        clients.findIndex((client) => client.name === selected.name),
      ),
    );
  };

  const selectClient = (client: (typeof clients)[number]) => {
    setSelected(client);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      if (!filtered.length) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + direction + filtered.length) % filtered.length);
    }
    if (event.key === "Enter" && open && filtered[activeIndex]) {
      event.preventDefault();
      selectClient(filtered[activeIndex]);
    }
  };

  return (
    <div className="client-switcher-wrap" ref={rootRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        className="client-switcher"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
      >
        <span>
          <strong>{selected.name}</strong>
          <small>{selected.path}</small>
        </span>
        <ChevronDown size={16} aria-hidden />
      </button>
      {open && (
        <div className="client-menu">
          <label className="client-menu__search">
            <Search size={16} aria-hidden />
            <span className="sr-only">Search clients</span>
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              placeholder="Search clients…"
            />
          </label>
          <div
            role="listbox"
            aria-label="Clients"
            aria-activedescendant={
              filtered[activeIndex] ? `client-option-${activeIndex}` : undefined
            }
          >
            {filtered.map((client, index) => (
              <button
                id={`client-option-${index}`}
                key={client.name}
                role="option"
                aria-selected={client.name === selected.name}
                className={index === activeIndex ? "active" : ""}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectClient(client)}
              >
                <span>
                  <strong>{client.name}</strong>
                  <small>{client.path}</small>
                </span>
                {client.name === selected.name && <Check size={17} aria-hidden />}
              </button>
            ))}
            {!filtered.length && <p>No clients found</p>}
          </div>
        </div>
      )}
    </div>
  );
}
