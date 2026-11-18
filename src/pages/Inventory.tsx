import { useMemo, useState } from "react";
import { ChevronRight, Download, Filter, Plus, RefreshCcw, Trash2, Upload, X } from "lucide-react";
import { assets as initialAssets, type Asset } from "../data/mockData";
import { Button } from "../components/Button";
import { FilterChip, SearchField, Select } from "../components/FormControls";
import { InventoryTable } from "../components/InventoryTable";
import { WaveDrawer } from "../components/WaveDrawer";
import { Toast } from "../components/Toast";
import AssetDetailDrawer from "../components/AssetDetailDrawer";

const versionTwoOverrides: Record<string, Partial<Asset>> = {
  "AST-1042": {
    validation: "Failed checks",
    dependents: 14,
    dataSources: ["Claims fact QVD", "Policy master", "Regional hierarchy"],
    usageTrend: [72, 78, 81, 79, 86, 91, 88, 95, 97, 93, 98, 100],
  },
  "AST-1078": {
    validation: "Not run",
    dependents: 6,
    dataSources: ["Underwriting mart", "Geography reference"],
    usageTrend: [58, 61, 55, 64, 67, 63, 69, 71, 68, 75, 73, 78],
  },
  "AST-1124": {
    validation: "Validated",
    dependents: 11,
    dataSources: ["Policy transactions", "Renewal propensity model"],
    usageTrend: [66, 70, 74, 72, 78, 82, 85, 81, 88, 90, 94, 96],
  },
  "AST-1191": {
    validation: "Not run",
    dependents: 4,
    dataSources: ["Broker master", "Commission ledger"],
    usageTrend: [22, 26, 24, 28, 30, 27, 31, 33, 35, 32, 36, 38],
  },
  "AST-1235": {
    validation: "Validated",
    dependents: 8,
    dataSources: ["Premium ledger", "Finance calendar"],
    usageTrend: [48, 51, 55, 52, 57, 61, 64, 60, 66, 69, 72, 74],
  },
  "AST-1277": {
    validation: "Awaiting approval",
    dependents: 1,
    dataSources: ["Legacy agent snapshot"],
    usageTrend: [20, 18, 16, 14, 12, 10, 9, 8, 6, 5, 4, 3],
  },
  "AST-1304": {
    validation: "Not run",
    dependents: 9,
    dataSources: ["Exposure warehouse", "Catastrophe zones", "Treaty limits"],
    usageTrend: [40, 43, 45, 49, 52, 50, 55, 58, 61, 59, 64, 67],
  },
  "AST-1358": {
    validation: "Failed checks",
    dependents: 7,
    dataSources: ["Customer 360 model", "Policy events"],
    usageTrend: [34, 37, 39, 38, 42, 44, 47, 45, 49, 52, 50, 54],
  },
  "AST-1399": {
    validation: "Validated",
    dependents: 10,
    dataSources: ["Open claims QVD", "Adjuster directory"],
    usageTrend: [60, 64, 68, 66, 72, 75, 73, 79, 82, 85, 83, 88],
  },
  "AST-1421": {
    validation: "Awaiting approval",
    dependents: 5,
    dataSources: ["Treaty register", "Reinsurance recoveries"],
    usageTrend: [29, 32, 31, 35, 38, 36, 40, 42, 45, 43, 47, 49],
  },
  "AST-1450": {
    stage: "Assess",
    validation: "Awaiting approval",
    dependents: 0,
    dataSources: ["Policy archive snapshot"],
    usageTrend: [8, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
  },
  "AST-1503": {
    validation: "Not run",
    dependents: 8,
    dataSources: ["CRM opportunities", "Sales targets"],
    usageTrend: [52, 56, 54, 60, 63, 66, 64, 70, 73, 76, 74, 79],
  },
};

export function Inventory({
  onOverview,
  version,
  preset,
}: {
  onOverview: () => void;
  version: 1 | 2 | 3;
  preset?: { stage?: string; decision?: string; validation?: string } | null;
}) {
  const [allAssets, setAllAssets] = useState(initialAssets);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [stage, setStage] = useState(preset?.stage ?? "");
  const [decision, setDecision] = useState(preset?.decision ?? "");
  const [validation, setValidation] = useState(preset?.validation ?? "");
  const [owner, setOwner] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [detailAsset, setDetailAsset] = useState<Asset | null>(null);
  const estateAssets = useMemo(
    () =>
      version !== 1
        ? allAssets.map((asset) => ({
            ...asset,
            ...versionTwoOverrides[asset.id],
            ...(version === 3 && asset.id === "AST-1304" ? { validation: "Blocked" as const } : {}),
          }))
        : allAssets,
    [allAssets, version],
  );

  const filtered = useMemo(
    () =>
      estateAssets.filter((a) => {
        const q = search.toLowerCase();
        return (
          (!q || `${a.name} ${a.id} ${a.owner} ${a.source}`.toLowerCase().includes(q)) &&
          (type === "All" ||
            a.type === type.slice(0, -1) ||
            (type === "Data models" && a.type === "Data model")) &&
          (!stage || a.stage === stage) &&
          (!decision || a.decision === decision) &&
          (!validation || a.validation === validation) &&
          (!owner || a.owner === owner)
        );
      }),
    [estateAssets, search, type, stage, decision, validation, owner],
  );
  const counts =
    version !== 1
      ? { All: 4286, Dashboards: 1734, Reports: 1288, "Data models": 642, Scripts: 622 }
      : {
          All: allAssets.length,
          Dashboards: allAssets.filter((a) => a.type === "Dashboard").length,
          Reports: allAssets.filter((a) => a.type === "Report").length,
          "Data models": allAssets.filter((a) => a.type === "Data model").length,
          Scripts: allAssets.filter((a) => a.type === "Script").length,
        };
  const activeCount = [type !== "All", stage, decision, validation, owner].filter(Boolean).length;
  const hasResultFilters = Boolean(search.trim() || activeCount > 0);
  const versionThreeResultTotal = hasResultFilters ? filtered.length : 4286;
  const versionThreeResultEnd = hasResultFilters ? filtered.length : 12;
  const showPagination = version !== 3 || !hasResultFilters || versionThreeResultTotal > 12;
  const selectedAssets = estateAssets.filter((a) => selected.includes(a.id));
  const clear = () => {
    setSearch("");
    setType("All");
    setStage("");
    setDecision("");
    setValidation("");
    setOwner("");
  };
  const createWave = () => {
    setAllAssets((prev) =>
      prev.map((a) => (selected.includes(a.id) ? { ...a, stage: "Migrate" as const } : a)),
    );
    const count = selected.length;
    setDrawer(false);
    setSelected([]);
    setToast(`Wave 3 created · ${count} asset${count === 1 ? "" : "s"}`);
  };
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () =>
    setSelected((s) =>
      filtered.every((a) => s.includes(a.id))
        ? s.filter((id) => !filtered.some((a) => a.id === id))
        : [...new Set([...s, ...filtered.map((a) => a.id)])],
    );

  return (
    <div className="page inventory-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button onClick={onOverview}>Migration console</button>
        <ChevronRight size={14} />
        <span>Inventory</span>
      </nav>
      <header className="page-heading">
        <div>
          <h1>Asset inventory</h1>
          <p>Review, classify, and move Qlik assets through the migration lifecycle.</p>
        </div>
        <div className="page-actions inventory-actions">
          <Button variant="secondary" icon={<Upload size={17} />}>
            Import
          </Button>
          <Button variant="secondary" icon={<Download size={17} />}>
            Export
          </Button>
          <Button
            disabled={!selected.length}
            icon={<Plus size={17} />}
            onClick={() => setDrawer(true)}
          >
            Add to wave
          </Button>
        </div>
      </header>
      <section className="inventory-toolbar" aria-label="Inventory filters">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search name, owner, or Qlik app…"
        />
        <div className="filter-chips">
          {Object.entries(counts).map(([label, count]) => (
            <FilterChip
              key={label}
              selected={type === label}
              count={count}
              onClick={() => setType(label)}
            >
              {label}
            </FilterChip>
          ))}
        </div>
        <button className="mobile-filter-button" onClick={() => setFiltersOpen(true)}>
          <Filter size={18} />
          Filters{activeCount > 0 && <span>{activeCount}</span>}
        </button>
        <div className="filter-selects">
          <Select
            id="stage-filter"
            label="Stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            <option value="">All stages</option>
            {["Discover", "Assess", "Migrate", "Validate", "Modernize"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <Select
            id="decision-filter"
            label="Decision"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
          >
            <option value="">All decisions</option>
            {["Migrate", "Rebuild", "Retire"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <Select
            id="validation-filter"
            label="Validation"
            value={validation}
            onChange={(e) => setValidation(e.target.value)}
          >
            <option value="">All validation</option>
            {(version !== 1
              ? [
                  "Validated",
                  "Failed checks",
                  "Not run",
                  "Awaiting approval",
                  ...(version === 3 ? ["Blocked"] : []),
                ]
              : ["Validated", "In progress", "Failed checks", "Blocked", "Not started", "Retired"]
            ).map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <Select
            id="owner-filter"
            label="Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          >
            <option value="">All owners</option>
            {[...new Set(estateAssets.map((a) => a.owner))].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          {activeCount > 0 && (
            <button className="clear-filters" onClick={clear}>
              Clear filters
            </button>
          )}
        </div>
      </section>
      <div className="result-meta">
        <span>
          {version === 3 ? (
            <>
              Showing {versionThreeResultEnd > 0 ? 1 : 0}–{versionThreeResultEnd} of{" "}
              <strong>{versionThreeResultTotal.toLocaleString()}</strong>{" "}
              {versionThreeResultTotal === 1 ? "asset" : "assets"}
            </>
          ) : version === 2 ? (
            <>
              Showing 1–12 of <strong>4,286</strong> assets
            </>
          ) : (
            <>
              <strong>{filtered.length}</strong> of {allAssets.length} assets
            </>
          )}
        </span>
        <span>Last discovery sync: Today, 08:42</span>
      </div>
      {filtered.length ? (
        <InventoryTable
          assets={filtered}
          selected={selected}
          onToggle={toggle}
          onToggleAll={toggleAll}
          version={version}
          onViewDetails={setDetailAsset}
        />
      ) : (
        <EmptyState onClear={clear} />
      )}
      {showPagination && (
        <div className="pagination">
          <span>
            {version !== 1
              ? "12 rows per page"
              : `Showing ${filtered.length ? 1 : 0}–${filtered.length} of ${filtered.length}`}
          </span>
          <div>
            <Button variant="secondary" disabled>
              Previous
            </Button>
            <button className="page-number">1</button>
            {version !== 1 && (
              <>
                <button className="page-number page-number--inactive">2</button>
                <button className="page-number page-number--inactive">3</button>
                <span className="pagination-ellipsis">…</span>
                <button className="page-number page-number--inactive">358</button>
              </>
            )}
            <Button variant="secondary" disabled={version === 1}>
              Next
            </Button>
          </div>
        </div>
      )}
      {selected.length > 0 && (
        <div className="bulk-bar">
          <strong>{selected.length} selected</strong>
          <span />
          <Button icon={<Plus size={16} />} onClick={() => setDrawer(true)}>
            Add to wave
          </Button>
          <Button variant="ghost" icon={<Trash2 size={16} />}>
            Mark retire
          </Button>
          <Button variant="ghost" icon={<RefreshCcw size={16} />}>
            Re-run validation
          </Button>
          <button className="bulk-clear" onClick={() => setSelected([])}>
            Clear
          </button>
        </div>
      )}
      <button
        className="floating-action"
        disabled={!selected.length}
        onClick={() => setDrawer(true)}
        aria-label="Add selected assets to wave"
      >
        <Plus size={22} />
      </button>
      {filtersOpen && (
        <div
          className="filter-sheet-backdrop"
          onMouseDown={(e) => e.currentTarget === e.target && setFiltersOpen(false)}
        >
          <div className="filter-sheet">
            <header>
              <h2>Filters</h2>
              <button
                className="icon-button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </header>
            <div className="filter-sheet__body">
              <div className="filter-chips">
                {Object.entries(counts).map(([label, count]) => (
                  <FilterChip
                    key={label}
                    selected={type === label}
                    count={count}
                    onClick={() => setType(label)}
                  >
                    {label}
                  </FilterChip>
                ))}
              </div>
              <MobileSelects
                stage={stage}
                setStage={setStage}
                decision={decision}
                setDecision={setDecision}
                validation={validation}
                setValidation={setValidation}
                owner={owner}
                setOwner={setOwner}
                assets={estateAssets}
                version={version}
              />
            </div>
            <footer>
              <Button variant="ghost" onClick={clear}>
                Clear all
              </Button>
              <Button onClick={() => setFiltersOpen(false)}>Show {filtered.length} assets</Button>
            </footer>
          </div>
        </div>
      )}
      {drawer && (
        <WaveDrawer
          assets={selectedAssets}
          onClose={() => setDrawer(false)}
          onSuccess={createWave}
        />
      )}
      {toast && (
        <Toast
          message={toast}
          onClose={() => setToast("")}
          onUndo={() => setToast("Wave creation undone")}
        />
      )}
      {version !== 1 && detailAsset && (
        <AssetDetailDrawer asset={detailAsset} onClose={() => setDetailAsset(null)} />
      )}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <section className="empty-state">
      <svg viewBox="0 0 160 100" aria-hidden>
        <rect x="28" y="16" width="92" height="68" rx="10" />
        <path d="M42 35h62M42 49h38M42 63h22" />
        <circle cx="118" cy="70" r="19" />
        <path d="m130 84 13 10" />
        <path d="m111 70 5 5 10-11" />
      </svg>
      <h2>No assets found</h2>
      <p>Try changing your search or removing one or more filters.</p>
      <Button variant="secondary" onClick={onClear}>
        Clear filters
      </Button>
    </section>
  );
}

type MobileProps = {
  stage: string;
  setStage: (v: string) => void;
  decision: string;
  setDecision: (v: string) => void;
  validation: string;
  setValidation: (v: string) => void;
  owner: string;
  setOwner: (v: string) => void;
  assets: Asset[];
  version: 1 | 2 | 3;
};
function MobileSelects(p: MobileProps) {
  return (
    <>
      <Select
        id="m-stage"
        label="Stage"
        value={p.stage}
        onChange={(e) => p.setStage(e.target.value)}
      >
        <option value="">All stages</option>
        {["Discover", "Assess", "Migrate", "Validate", "Modernize"].map((x) => (
          <option key={x}>{x}</option>
        ))}
      </Select>
      <Select
        id="m-decision"
        label="Decision"
        value={p.decision}
        onChange={(e) => p.setDecision(e.target.value)}
      >
        <option value="">All decisions</option>
        {["Migrate", "Rebuild", "Retire"].map((x) => (
          <option key={x}>{x}</option>
        ))}
      </Select>
      <Select
        id="m-validation"
        label="Validation"
        value={p.validation}
        onChange={(e) => p.setValidation(e.target.value)}
      >
        <option value="">All validation</option>
        {(p.version !== 1
          ? [
              "Validated",
              "Failed checks",
              "Not run",
              "Awaiting approval",
              ...(p.version === 3 ? ["Blocked"] : []),
            ]
          : ["Validated", "In progress", "Failed checks", "Blocked", "Not started", "Retired"]
        ).map((x) => (
          <option key={x}>{x}</option>
        ))}
      </Select>
      <Select
        id="m-owner"
        label="Owner"
        value={p.owner}
        onChange={(e) => p.setOwner(e.target.value)}
      >
        <option value="">All owners</option>
        {[...new Set(p.assets.map((a) => a.owner))].map((x) => (
          <option key={x}>{x}</option>
        ))}
      </Select>
    </>
  );
}
