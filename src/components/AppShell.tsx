import { useState, type ReactNode } from "react";
import {
  Bell,
  Boxes,
  CheckCheck,
  CircleGauge,
  ClipboardCheck,
  Menu,
  Palette,
  Settings,
  Waves,
} from "lucide-react";
import { SearchField } from "./FormControls";
import ClientSwitcher from "./ClientSwitcher";
import synzPrismOnDark from "../assets/synzprism-on-dark.png";
import synzPrismOnLight from "../assets/synzprism-on-light.png";
import synzPrismMark from "../assets/synzprism-mark.png";
import RoleSwitcher, { type UserRole } from "./RoleSwitcher";

const currentNav = [
  { label: "Overview", icon: CircleGauge },
  { label: "Inventory", icon: Boxes },
  { label: "Settings", icon: Settings },
];

const developerNav = [
  { label: "My work", page: "Overview", icon: CircleGauge },
  { label: "Inventory", page: "Inventory", icon: Boxes },
  { label: "Settings", page: "Settings", icon: Settings },
];

const clientOwnerNav = [
  { label: "My reports", page: "Overview", icon: Boxes },
  { label: "Help", page: "Help", icon: CircleGauge },
];

const legacyNav = [
  { label: "Overview", icon: CircleGauge },
  { label: "Inventory", icon: Boxes },
  { label: "Waves", icon: Waves },
  { label: "Validation", icon: CheckCheck },
  { label: "Approvals", icon: ClipboardCheck },
  { label: "Design system", icon: Palette },
  { label: "Settings", icon: Settings },
];

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`logo ${inverse ? "logo--inverse" : ""}`}>
      <img
        className="logo__lockup"
        src={inverse ? synzPrismOnDark : synzPrismOnLight}
        alt="SynzPrism"
      />
      <img className="logo__mark-only" src={synzPrismMark} alt="SynzPrism" />
    </div>
  );
}

export function Avatar({ initials, name }: { initials: string; name?: string }) {
  return (
    <span className="avatar" aria-label={name}>
      {initials}
    </span>
  );
}

export function AppShell({
  page,
  onNavigate,
  version,
  onVersionChange,
  role,
  onRoleChange,
  clientPreview,
  children,
}: {
  page: string;
  onNavigate: (page: "Overview" | "Inventory" | "Design system") => void;
  version: 1 | 2 | 3;
  onVersionChange: (version: 1 | 2 | 3) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  clientPreview: boolean;
  children: ReactNode;
}) {
  const [search, setSearch] = useState("");
  const nav =
    role === "Developer"
      ? developerNav
      : role === "Client owner"
        ? clientOwnerNav
        : version === 1
          ? legacyNav
          : currentNav;
  const user =
    role === "Developer"
      ? { name: "Rahul Nair", initials: "RN", title: "BI Developer" }
      : role === "Client owner"
        ? { name: "James Cole", initials: "JC", title: "Finance Reporting Manager" }
        : { name: "Pravin Wilson", initials: "PW", title: "Migration Lead" };
  const selectVersion = (nextVersion: 1 | 2 | 3) => {
    onVersionChange(nextVersion);
    if (page === "Design system") onNavigate("Overview");
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo inverse />
        <nav aria-label="Primary navigation">
          {nav.map(({ label, icon: Icon, ...item }) => {
            const destination = "page" in item ? item.page : label;
            return (
              <button
                key={label}
                onClick={() =>
                  (destination === "Overview" ||
                    destination === "Inventory" ||
                    destination === "Design system") &&
                  onNavigate(destination)
                }
                className={page === destination ? "active" : ""}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar__user">
          <Avatar initials={user.initials} name={user.name} />
          <span>
            <strong>{user.name}</strong>
            <small>{user.title}</small>
          </span>
          <Menu size={18} />
        </div>
      </aside>
      <header className={`topbar ${role === "Client owner" ? "topbar--client" : ""}`}>
        <button className="icon-button mobile-menu" aria-label="Open menu">
          <Menu size={21} />
        </button>
        <div className="version-tabs" role="tablist" aria-label="Application views">
          <button
            role="tab"
            aria-selected={page === "Design system"}
            className={page === "Design system" ? "active" : ""}
            onClick={() => onNavigate("Design system")}
          >
            Design System
          </button>
          <button
            role="tab"
            aria-selected={page !== "Design system" && version === 1}
            className={page !== "Design system" && version === 1 ? "active" : ""}
            onClick={() => selectVersion(1)}
          >
            Version 1
          </button>
          <button
            role="tab"
            aria-selected={page !== "Design system" && version === 2}
            className={page !== "Design system" && version === 2 ? "active" : ""}
            onClick={() => selectVersion(2)}
          >
            Version 2
          </button>
          <button
            role="tab"
            aria-selected={page !== "Design system" && version === 3}
            className={page !== "Design system" && version === 3 ? "active" : ""}
            onClick={() => selectVersion(3)}
          >
            Version 3
          </button>
        </div>
        {role !== "Client owner" && (
          <>
            <div className="topbar__search">
              <SearchField
                value={search}
                onChange={setSearch}
                placeholder="Search assets, waves, people…"
              />
            </div>
            {version === 1 ? (
              <button className="client-switcher legacy-client-switcher">
                <span>
                  <strong>Meridian Insurance</strong>
                  <small>Qlik → Power BI</small>
                </span>
              </button>
            ) : (
              <ClientSwitcher />
            )}
          </>
        )}
        {(role !== "Client owner" || clientPreview) && (
          <RoleSwitcher role={role} onChange={onRoleChange} />
        )}
        <button className="icon-button notification" aria-label="Notifications">
          <Bell size={20} />
          <span />
        </button>
        <Avatar initials={user.initials} name={user.name} />
      </header>
      <main>{children}</main>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {nav.slice(0, 4).map(({ label, icon: Icon, ...item }) => {
          const destination = "page" in item ? item.page : label;
          return (
            <button
              key={label}
              onClick={() =>
                (destination === "Overview" || destination === "Inventory") &&
                onNavigate(destination)
              }
              className={page === destination ? "active" : ""}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
