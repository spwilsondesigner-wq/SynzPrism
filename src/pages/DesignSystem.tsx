import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Inbox,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Avatar } from "../components/AppShell";
import { DecisionTag, StatusBadge } from "../components/Badge";
import { Button } from "../components/Button";
import { FunnelChart, WaveChart } from "../components/Charts";
import {
  FilterChip,
  Input,
  SearchField,
  Select,
  Textarea,
  Toggle,
} from "../components/FormControls";
import { InventoryTable } from "../components/InventoryTable";
import { KpiCard } from "../components/KpiCard";
import { assets } from "../data/mockData";

const colors = [
  {
    name: "Primary",
    token: "--primary",
    hex: "#4338CA",
    contrast: "7.1:1 on white",
    className: "swatch-primary",
  },
  {
    name: "Primary hover",
    token: "--primary-hover",
    hex: "#3730A3",
    contrast: "9.6:1 on white",
    className: "swatch-primary-hover",
  },
  {
    name: "Primary tint",
    token: "--primary-tint",
    hex: "#ECEBFF",
    contrast: "13.4:1 with ink",
    className: "swatch-primary-tint",
  },
  {
    name: "Ink / sidebar",
    token: "--ink",
    hex: "#0B1533",
    contrast: "17.6:1 on white",
    className: "swatch-ink",
  },
  {
    name: "Text",
    token: "--text",
    hex: "#111827",
    contrast: "17.7:1 on white",
    className: "swatch-text",
  },
  {
    name: "Muted text",
    token: "--muted",
    hex: "#4A5163",
    contrast: "7.7:1 on white",
    className: "swatch-muted",
  },
  {
    name: "Page",
    token: "--page",
    hex: "#F4F5FA",
    contrast: "16.2:1 with text",
    className: "swatch-page",
  },
  {
    name: "Surface",
    token: "--surface",
    hex: "#FFFFFF",
    contrast: "17.7:1 with text",
    className: "swatch-surface",
  },
  {
    name: "Border",
    token: "--border",
    hex: "#DFE2EC",
    contrast: "13.7:1 with text",
    className: "swatch-border",
  },
  {
    name: "Success",
    token: "--success",
    hex: "#0F766E",
    contrast: "5.4:1 on white",
    className: "swatch-success",
  },
  {
    name: "Warning",
    token: "--warning",
    hex: "#92400E",
    contrast: "7.5:1 on white",
    className: "swatch-warning",
  },
  {
    name: "Danger",
    token: "--danger",
    hex: "#B42318",
    contrast: "6.4:1 on white",
    className: "swatch-danger",
  },
  {
    name: "Info",
    token: "--info",
    hex: "#1D4ED8",
    contrast: "6.7:1 on white",
    className: "swatch-info",
  },
];

const states = ["Default", "Hover", "Focus", "Active", "Disabled", "Loading"];

function Specimen({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`ds-specimen ${className}`}>
      <span className="ds-specimen__label">{label}</span>
      <div className="ds-specimen__body">{children}</div>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ds-section" id={id}>
      <header className="ds-section__header">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {children}
    </section>
  );
}

export function DesignSystem({ version = 2 }: { version?: 1 | 2 | 3 }) {
  return (
    <div className="page ds-page">
      <header className="ds-hero">
        <div>
          <span className="eyebrow">SynzX foundations · v1.0</span>
          <h1>Design system</h1>
          <p>
            The visual and interaction reference for product, engineering, and accessibility
            handoff.
          </p>
        </div>
        <div className="ds-hero__meta">
          <span>
            <CheckCircle2 size={16} />
            WCAG AA
          </span>
          <span>Updated today</span>
        </div>
      </header>

      <nav className="ds-anchor-nav" aria-label="Design system sections">
        {[
          "Foundations",
          "Actions",
          "Forms",
          "Status",
          "Data display",
          "Feedback",
          "Navigation",
        ].map((item) => (
          <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}>
            {item}
          </a>
        ))}
      </nav>

      <Section
        id="foundations"
        eyebrow="01 · Foundations"
        title="Tokens"
        description="Use semantic variables so every surface remains consistent and theme-ready."
      >
        <div className="ds-subsection">
          <div className="ds-subsection__title">
            <h3>Colour</h3>
            <p>All foreground pairings meet WCAG AA for normal text.</p>
          </div>
          <div className="color-grid">
            {colors.map((color) => (
              <article className="color-swatch" key={color.name}>
                <div className={color.className} />
                <h4>{color.name}</h4>
                <code>{color.hex}</code>
                <small>{color.token}</small>
                <span>{color.contrast}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="ds-foundation-grid">
          <div className="ds-subsection">
            <div className="ds-subsection__title">
              <h3>Type scale</h3>
              <p>Inter with tabular figures.</p>
            </div>
            <div className="type-scale">
              <div>
                <span>Display · 32/40 · Bold</span>
                <strong className="type-display">4,286 assets</strong>
              </div>
              <div>
                <span>Page title · 24/32 · Semibold</span>
                <strong className="type-title">Asset inventory</strong>
              </div>
              <div>
                <span>Card title · 18/26 · Semibold</span>
                <strong className="type-card">Wave progress</strong>
              </div>
              <div>
                <span>Body · 14/20 · Regular</span>
                <p>Migration validation completed successfully.</p>
              </div>
              <div>
                <span>Label · 12/16 · Medium</span>
                <b>VALIDATION STATUS</b>
              </div>
            </div>
          </div>
          <div className="ds-subsection">
            <div className="ds-subsection__title">
              <h3>Spacing</h3>
              <p>8-point grid with 4px half-step.</p>
            </div>
            <div className="spacing-scale">
              {[4, 8, 12, 16, 24, 32, 48].map((value) => (
                <div key={value}>
                  <span>{value}</span>
                  <i className={`space-${value}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="ds-subsection">
            <div className="ds-subsection__title">
              <h3>Radius & elevation</h3>
              <p>Controls, cards, pills, and overlays.</p>
            </div>
            <div className="radius-grid">
              <div className="radius-control">
                <span>8px</span>
                <small>Control</small>
              </div>
              <div className="radius-card-demo">
                <span>12px</span>
                <small>Card</small>
              </div>
              <div className="radius-pill">
                <span>Full</span>
                <small>Pill</small>
              </div>
              <div className="shadow-card">
                <span>1px border</span>
                <small>Card</small>
              </div>
              <div className="shadow-panel">
                <span>0 8 24</span>
                <small>Panel</small>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="actions"
        eyebrow="02 · Actions"
        title="Buttons"
        description="Use one primary action per decision area. All controls have a 3px focus-visible ring."
      >
        <div className="state-matrix">
          <div className="state-matrix__head">
            <span>Variant</span>
            {states.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          {(["primary", "secondary", "ghost", "danger"] as const).map((variant) => (
            <div className="state-matrix__row" key={variant}>
              <strong>{variant}</strong>
              <Button variant={variant} icon={<Plus size={16} />}>
                Action
              </Button>
              <Button variant={variant} icon={<Plus size={16} />} className="is-hover">
                Action
              </Button>
              <Button variant={variant} icon={<Plus size={16} />} className="is-focus">
                Action
              </Button>
              <Button variant={variant} icon={<Plus size={16} />} className="is-active">
                Action
              </Button>
              <Button variant={variant} disabled icon={<Plus size={16} />}>
                Action
              </Button>
              <Button variant={variant} loading>
                Action
              </Button>
            </div>
          ))}
        </div>
        <div className="ds-inline-specimens">
          <Specimen label="36px · Standard">
            <Button icon={<Download size={16} />}>Export</Button>
          </Specimen>
          <Specimen label="44px · Large">
            <Button size="lg" icon={<Plus size={18} />}>
              Create wave
            </Button>
          </Specimen>
          <Specimen label="Icon only">
            <button className="icon-button ds-focus-demo" aria-label="Search">
              <Search size={18} />
            </button>
          </Specimen>
        </div>
      </Section>

      <Section
        id="forms"
        eyebrow="03 · Forms"
        title="Inputs and selection"
        description="Labels remain visible. Validation pairs colour with text and an icon."
      >
        <div className="ds-form-grid">
          <Specimen label="Input · Default">
            <Input
              id="ds-input"
              label="Wave name"
              placeholder="Enter a name"
              helper="Use a unique, descriptive name."
            />
          </Specimen>
          <Specimen label="Input · Focus">
            <div className="ds-force-focus">
              <Input id="ds-focus" label="Wave name" value="Wave 3" readOnly />
            </div>
          </Specimen>
          <Specimen label="Input · Success">
            <Input id="ds-success" label="Workspace" value="Claims Analytics" readOnly success />
          </Specimen>
          <Specimen label="Input · Error">
            <Input
              id="ds-error"
              label="Approver email"
              value="meera@"
              readOnly
              error="Enter a valid email address."
            />
          </Specimen>
          <Specimen label="Input · Disabled">
            <Input id="ds-disabled" label="Source platform" value="Qlik" disabled />
          </Specimen>
          <Specimen label="Date picker">
            <Input
              id="ds-date"
              label="Cutover date"
              type="date"
              defaultValue="2026-06-18"
              helper="Use local workspace time."
            />
          </Specimen>
          <Specimen label="Select">
            <Select id="ds-select" label="Migration stage" defaultValue="Migrate">
              <option>Migrate</option>
              <option>Validate</option>
            </Select>
          </Specimen>
          <Specimen label="Textarea">
            <Textarea id="ds-notes" label="Notes" rows={3} placeholder="Add migration context…" />
          </Specimen>
          <Specimen label="Search field">
            <SearchField value="" onChange={() => {}} placeholder="Search assets…" />
          </Specimen>
        </div>
        <div className="ds-control-row">
          <Specimen label="Checkboxes">
            <div className="check-stack">
              <label>
                <input type="checkbox" />
                Unchecked
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                Checked
              </label>
              <label>
                <input type="checkbox" disabled />
                Disabled
              </label>
            </div>
          </Specimen>
          <Specimen label="Toggle">
            <div className="check-stack">
              <Toggle checked={false} onChange={() => {}} label="Off" />
              <Toggle checked onChange={() => {}} label="On" />
            </div>
          </Specimen>
          <Specimen label="Filter chips">
            <div className="filter-chips">
              <FilterChip count={12} onClick={() => {}}>
                Default
              </FilterChip>
              <FilterChip selected count={4} onClick={() => {}}>
                Selected
              </FilterChip>
              <button className="filter-chip is-focus">
                Focus <span>8</span>
              </button>
            </div>
          </Specimen>
        </div>
      </Section>

      <Section
        id="status"
        eyebrow="04 · Status"
        title="Badges and tags"
        description="Status is always expressed through text and shape, never colour alone."
      >
        <div className="ds-status-board">
          <div>
            <h3>Status badge</h3>
            <div className="ds-status-row">
              {[
                "Not started",
                "In progress",
                "Validated",
                "Failed checks",
                "Blocked",
                "Retired",
                ...(version !== 1 ? ["Awaiting approval"] : []),
              ].map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </div>
          </div>
          <div>
            <h3>Decision tag</h3>
            <div className="ds-status-row">
              <DecisionTag decision="Migrate" />
              <DecisionTag decision="Rebuild" />
              <DecisionTag decision="Retire" />
            </div>
          </div>
          <div>
            <h3>Platform badge</h3>
            <div className="ds-status-row">
              <span className="platform">Qlik</span>
              <span className="platform">Power BI</span>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="data-display"
        eyebrow="05 · Data display"
        title="Cards, charts, and tables"
        description="Dense data remains scannable with consistent hierarchy and accessible summaries."
      >
        <div className="ds-kpi-grid">
          <Specimen label="KPI · Default">
            <KpiCard
              label="Assets discovered"
              value="4,286"
              delta="+3.4%"
              detail="Across 46 Qlik apps"
            />
          </Specimen>
          <Specimen label="KPI · Progress">
            <KpiCard label="Migrated" value="1,120" detail="of 2,874 in scope" progress={39} />
          </Specimen>
          <Specimen label="KPI · Warning">
            <KpiCard label="Blocked" value="18" warning link="View assets" />
          </Specimen>
          <Specimen label="KPI · Loading">
            <KpiCard label="Loading KPI" value="" loading />
          </Specimen>
        </div>
        <div className="ds-chart-grid">
          <WaveChart revised={version !== 1} />
          <FunnelChart />
        </div>
        <div className="ds-table-demo">
          <div className="ds-subsection__title">
            <h3>Data table · Default and selected</h3>
            <p>Sticky sortable header, row hover, checkbox selection, and responsive card view.</p>
          </div>
          <InventoryTable
            assets={assets.slice(0, 4)}
            selected={[assets[1].id]}
            onToggle={() => {}}
            onToggleAll={() => {}}
            version={version}
          />
        </div>
        <div className="ds-inline-specimens">
          <Specimen label="Data table · Loading" className="ds-wide">
            <InventoryTable
              assets={[]}
              selected={[]}
              onToggle={() => {}}
              onToggleAll={() => {}}
              version={version}
              loading
            />
          </Specimen>
          <Specimen label="Bulk action bar" className="ds-wide">
            <div className="ds-bulk-demo">
              <strong>3 selected</strong>
              <Button icon={<Plus size={16} />}>Add to wave</Button>
              <Button variant="ghost" icon={<Trash2 size={16} />}>
                Mark retire
              </Button>
              <button>Clear</button>
            </div>
          </Specimen>
        </div>
      </Section>

      <Section
        id="feedback"
        eyebrow="06 · Feedback"
        title="Feedback and overlays"
        description="Feedback is timely, specific, dismissible where appropriate, and announced to assistive technology."
      >
        <div className="ds-feedback-grid">
          <Specimen label="Error summary">
            <div className="error-summary">
              <AlertCircle size={20} />
              <div>
                <strong>Check 2 fields</strong>
                <ul>
                  <li>
                    <a href="#ds-error">Enter a valid email address.</a>
                  </li>
                  <li>
                    <a href="#ds-date">Select a cutover date.</a>
                  </li>
                </ul>
              </div>
            </div>
          </Specimen>
          <Specimen label="Toast · Success">
            <div className="ds-toast">
              <CheckCircle2 size={20} />
              <span>Wave 3 created · 24 assets</span>
              <button>Undo</button>
              <X size={18} />
            </div>
          </Specimen>
          <Specimen label="Toast · Error">
            <div className="ds-toast ds-toast--error">
              <AlertCircle size={20} />
              <span>Validation run failed</span>
              <button>Retry</button>
              <X size={18} />
            </div>
          </Specimen>
          <Specimen label="Empty state">
            <div className="ds-empty">
              <Inbox size={36} />
              <strong>No assets found</strong>
              <p>Change your search or remove a filter.</p>
              <Button variant="secondary">Clear filters</Button>
            </div>
          </Specimen>
        </div>
        <div className="ds-drawer-demo">
          <div className="ds-subsection__title">
            <h3>Side panel / drawer</h3>
            <p>Header and footer remain fixed while content scrolls.</p>
          </div>
          <aside>
            <header>
              <div>
                <span className="eyebrow">Migration wave</span>
                <h3>Create migration wave</h3>
                <p>Group assets and schedule cutover.</p>
              </div>
              <button className="icon-button">
                <X size={18} />
              </button>
            </header>
            <div>
              <Input id="ds-drawer-name" label="Wave name *" value="Wave 3" readOnly />
              <Select id="ds-drawer-workspace" label="Workspace *">
                <option>Claims Analytics</option>
              </Select>
              <Toggle checked onChange={() => {}} label="Run validation after migration" />
            </div>
            <footer>
              <Button variant="secondary">Save draft</Button>
              <Button>Create wave</Button>
            </footer>
          </aside>
        </div>
      </Section>

      <Section
        id="navigation"
        eyebrow="07 · Navigation"
        title="Identity and wayfinding"
        description="Persistent context helps teams orient quickly across complex migration work."
      >
        <div className="ds-navigation-grid">
          <Specimen label="Avatar">
            <div className="ds-avatar-row">
              <Avatar initials="PW" name="Pravin Wilson" />
              <Avatar initials="RN" name="Rahul Nair" />
              <span>32px · Initial fallback</span>
            </div>
          </Specimen>
          <Specimen label="Breadcrumb">
            <nav className="breadcrumb">
              <button>Migration console</button>
              <ArrowRight size={14} />
              <span>Inventory</span>
            </nav>
          </Specimen>
          <Specimen label="Sidebar nav item">
            <div className="ds-nav-demo">
              <button>
                <Inbox size={18} />
                <span>Inventory</span>
              </button>
              <button className="active">
                <Check size={18} />
                <span>Validation</span>
              </button>
            </div>
          </Specimen>
        </div>
      </Section>
    </div>
  );
}
