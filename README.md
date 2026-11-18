# SynzPrism — Migration Command Center

A take-home UI/UX + front-end exercise: two business application screens, designed in Figma and built as responsive, componentised templates.

SynzPrism is a fictional workspace for teams moving a BI estate from Qlik to Power BI (sample client: *Meridian Insurance*). It tracks thousands of dashboards, reports, data models and scripts through five stages — **Discover → Assess → Migrate → Validate → Modernize** — and records a decision for each asset: **Migrate, Rebuild or Retire**.

| Brief item | Where it is |
| --- | --- |
| **Task 1 – Dashboard** | `Overview` page — navigation, KPI cards, wave/funnel charts, "Needs attention" list and recent activity |
| **Task 2 – Data / management page** | `Inventory` page — asset table, search, filter chips and selects, bulk actions, empty state, and the **Create migration wave** form with validation |
| **Design deliverables** | Figma file (link below) + the in-app **Design System** tab |
| **Development deliverables** | `src/` — pages, reusable components, design tokens and mock data |

---

## Links

- **Figma design file:** https://www.figma.com/design/HpjYvHdcQq5jn1MrQKkVig/SynzPrism-%E2%80%93-Wireframes?node-id=0-1&t=QTW1QBPeCUx6HLFg-1
- **Live preview:** https://horse-sienna-76460480.figma.site

---

## How to run

**Requirements:** Node.js 22 and pnpm 10 (pinned in `.mise.toml`). npm also works.

```bash
pnpm install      # install dependencies
pnpm dev          # start the dev server with hot reload (Vite prints the local URL)
pnpm build        # production build -> dist/
pnpm preview      # serve the production build locally
pnpm format       # format the code with oxfmt
```

`pnpm build` produces a static `dist/` folder (one `index.html` plus hashed CSS and JS files). You can host it on any static server or open it with `pnpm preview`. No backend is needed: all data comes from `src/data/mockData.ts`.

### Moving around the app

- **Top bar tabs:** `Design System`, `Version 1`, `Version 2`, `Version 3`. These are design iterations of the same screens. Version 3 is the final one and opens by default.
- **Sidebar:** switches between **Overview** (Task 1) and **Inventory** (Task 2).
- **Role switcher:** shows the dashboard as each user type sees it: **Lead**, **Developer** or **Client owner**.
- **Deep link:** `/#retirement-approvals` opens the Client owner view directly.

---

## Project structure

```
SynzPrism/
├── index.html                 # HTML shell with the #root mount point
├── public/                    # Static files copied as-is (favicon)
├── src/
│   ├── main.tsx               # Entry point – mounts <App/>, imports global CSS
│   ├── App.tsx                # Page routing plus version and role state
│   ├── index.css              # Global styles, layout and component CSS, breakpoints
│   ├── styles/
│   │   └── tokens.css         # Design tokens (colour, radius, shadow, layout sizes)
│   ├── assets/                # Logo files (mark, on-light, on-dark)
│   ├── data/
│   │   └── mockData.ts        # Typed mock data: assets, activity, attention items
│   ├── pages/                 # Screens, built from components
│   │   ├── Overview.tsx         # Task 1 – Lead dashboard
│   │   ├── DeveloperHome.tsx    # Task 1 – Developer view of the dashboard
│   │   ├── ClientOwnerHome.tsx  # Task 1 – Client owner view (includes a load-error state)
│   │   ├── Inventory.tsx        # Task 2 – Asset management table
│   │   └── DesignSystem.tsx     # Live style guide / component catalogue
│   └── components/            # Reusable UI elements
│       ├── AppShell.tsx         # Sidebar, top bar, logo, avatar, page frame
│       ├── KpiCard.tsx          # Summary metric card
│       ├── Charts.tsx           # WaveChart, FunnelChart (dependency-free SVG)
│       ├── InventoryTable.tsx   # Sortable, selectable data table
│       ├── FormControls.tsx     # Input, Select, Textarea, SearchField, Toggle, FilterChip
│       ├── Button.tsx           # Primary / secondary / ghost / danger buttons
│       ├── Badge.tsx            # StatusBadge, DecisionTag
│       ├── Toast.tsx            # Success feedback
│       ├── WaveDrawer.tsx       # "Create migration wave" form + validation
│       ├── AssetDetailDrawer.tsx      # Asset details side panel
│       ├── ValidationDiffDrawer.tsx   # Validation-check diff panel
│       ├── ClientSwitcher.tsx   # Client / workspace picker
│       └── RoleSwitcher.tsx     # Lead / Developer / Client owner
├── vite.config.ts             # Vite + React + Tailwind v4, "@" alias for src
└── .figma/                    # Figma Make config (keep it, the preview needs it)
```

**Layers:** `tokens.css` → `components/` → `pages/` → `App.tsx`. Pages contain no hard-coded colours and no copied markup. They put together components and pass mock data into them.

---

## Page breakdown

### Task 1 — Dashboard (`Overview`)

1. **Page heading:** greeting, cutover countdown, a link to blocked assets, date-range control (7D / 30D / Quarter) that updates the KPIs, and actions: *Export* (secondary) and *Create wave* (primary).
2. **KPI grid:** `KpiCard` ×4 with value, change vs. the previous period, and supporting text. In Version 3 each card links to the Inventory with a matching filter already applied.
3. **Data visualisation:** `WaveChart` (progress by migration wave) and `FunnelChart` (number of assets at each stage).
4. **Needs attention:** assets that are blocked, failing checks or awaiting approval.
5. **Recent activity:** a feed of the latest events, with avatars.

The Developer and Client owner roles use the same shell with content for that role: a work queue, failures by check type and recent runs for developers; my reports, key dates and "what's changing" for client owners.

### Task 2 — Management page (`Inventory`)

1. **Header and actions:** Import / Export (secondary) and *Create wave* (primary).
2. **Type tabs** with counts (All, Dashboards, Reports, Data models, Scripts).
3. **Search and filters:** free-text search over name, ID, owner and source; dropdowns for stage, decision, validation and owner; removable filter chips; a collapsible filter panel on small screens.
4. **Data table:** row selection, status badges and decision tags. Clicking a row opens the **Asset detail drawer**.
5. **Bulk action bar:** appears when rows are selected (*Add to wave*, *Mark retire*, *Re-run validation*, *Clear*). On mobile it is replaced by a floating "add to wave" button.
6. **Empty state:** "No assets found", with a way to clear the filters.
7. **Create migration wave form (`WaveDrawer`):**
   - Required fields: name, target workspace and cutover date.
   - The cutover date cannot be in the past.
   - An approver email becomes required as soon as any selected asset is marked *Retire*, and it must be a valid email.
   - Fields are checked when the user submits, then again on every change after that. An error summary at the top links to each field, and each field shows its own error message, uses `aria-invalid`, and is linked to its message with `aria-describedby`.
   - On success the drawer closes and a toast confirms the wave.

---

## Design decisions

- **Task-first hierarchy.** The heading answers "what needs me today?" (cutover countdown, blocked count) before showing totals. Each KPI links to the assets it counts, so the dashboard leads straight into work.
- **One primary action per view.** *Create wave* is the only filled button. Export and Import are secondary, bulk actions use the lighter ghost style, and a `danger` button variant is reserved for destructive actions.
- **Status is never colour alone.** Every badge has a text label and an icon, and each status colour has a darker text shade on a light tint. Contrast targets WCAG 2.1 AA.
- **Same structure on every page.** Eyebrow → H1 → summary → actions. Panels use 12px corners, controls use 8px, and indigo `--primary` is reserved for actions and focus.
- **Drawers instead of new pages** for creating and inspecting items, so the table's filters and selection are kept.
- **Views by role.** Leads, developers and client owners need different information, so they get different home screens inside one shell instead of one crowded dashboard.
- **Iterations kept visible.** The Version 1–3 tabs show how the design changed: V1 is the baseline, V2 adds richer validation states and asset detail, and V3 adds linked KPIs, preset filters and approval states.

### Responsive behaviour

| Breakpoint | Behaviour |
| --- | --- |
| `> 1180px` | Full desktop: fixed 232px sidebar, 4-column KPI grid, charts side by side |
| `≤ 1180px` | KPI grid drops to 2 columns, charts stack |
| `≤ 900px` | Panels become single-column |
| `≤ 767px` | Sidebar is replaced by a menu button, top-bar search is hidden, filters collapse into a panel, the table scrolls sideways inside its card, drawers go full width |
| `≤ 420px` | Smaller spacing and type, action buttons stack |

### Interaction states covered

Hover, focus-visible (`--focus` ring), active/selected (tabs, segmented control, table rows), disabled (bulk actions with no rows selected), error, success, empty, loading/error (Client owner reports), and toast confirmation.

---

## Design tokens

Tokens are in `src/styles/tokens.css` as CSS custom properties, so plain CSS, Tailwind, React or Angular can all use them:

| Group | Tokens |
| --- | --- |
| Brand | `--primary`, `--primary-hover`, `--primary-tint`, `--focus` |
| Neutrals | `--ink`, `--text`, `--muted`, `--page`, `--surface`, `--border` |
| Semantic | `--success`, `--warning`, `--danger`, `--info` (each has a `-tint`) |
| Shape | `--radius-control` (8px), `--radius-card` (12px), `--shadow-panel` |
| Layout | `--sidebar-width` (232px), `--topbar-height` (72px) |

Typeface: **Inter** (400/500/600/700) from Google Fonts. Icons: **lucide-react**.

---

## Mapping to frameworks

The templates are built in **React 19 + TypeScript**. Each component is a self-contained piece of markup, styles and behaviour, so it maps one-to-one onto plain HTML templates or Angular.

| Template element | React (this repo) | Angular equivalent | Plain HTML/CSS/JS |
| --- | --- | --- | --- |
| App frame | `<AppShell>` with `children` | `AppShellComponent` with `<ng-content>` | `<aside>` + `<header>` + `<main>` partial |
| KPI card | `<KpiCard label value delta />` | `<app-kpi-card [label] [value] [delta]>` | `.kpi-card` block |
| Data table | `<InventoryTable rows onSelect />` | `<app-inventory-table [rows] (select)>` | `<table class="inventory-table">` + JS |
| Form fields | `<Input error helper />` | Reactive Forms `FormControl` + `<app-input>` | `.field` / `.field--error` + JS validation |
| Drawer | `<WaveDrawer onClose onSuccess />` | `WaveDrawerComponent` / CDK Overlay | `<aside role="dialog">` toggled by JS |
| Page | `pages/Inventory.tsx` | `InventoryPageComponent` (route) | `inventory.html` |
| Navigation | `useState` page switch in `App.tsx` | Angular Router routes | Separate HTML files / hash links |
| State | `useState` / `useMemo` | Signals or component properties + RxJS | DOM state + event listeners |
| Data | `data/mockData.ts` | `AssetService` (injectable) | JSON or JS module |
| Tokens | `styles/tokens.css` | Global `styles.css` | Same file |

Props become `@Input()`, callback props such as `onClose` become `@Output()` EventEmitters, and the CSS class names (`.field`, `.kpi-card`, `.drawer`, `.bulk-bar`, …) work in either framework without changes.

---

## Tech stack

React 19 · TypeScript 5.7 · Vite 8 · Tailwind CSS v4 (via `@tailwindcss/vite`) · lucide-react · oxfmt. Built and previewed in Figma Make.
