import { ArrowRight, Download, Plus } from "lucide-react";
import { useState } from "react";
import { activities, assets, attentionItems } from "../data/mockData";
import { Avatar } from "../components/AppShell";
import { StatusBadge } from "../components/Badge";
import { Button } from "../components/Button";
import { FunnelChart, WaveChart } from "../components/Charts";
import { KpiCard } from "../components/KpiCard";
import { Toast } from "../components/Toast";
import { WaveDrawer } from "../components/WaveDrawer";

export function Overview({
  onInventory,
  onInventoryFilter,
  version,
}: {
  onInventory: () => void;
  onInventoryFilter: (preset: { stage?: string; decision?: string; validation?: string }) => void;
  version: 1 | 2 | 3;
}) {
  const [range, setRange] = useState("30D");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState("");
  const data =
    range === "7D"
      ? { discovered: "4,214", pass: "92.8%", delta: "0.8 pts" }
      : range === "Quarter"
        ? { discovered: "4,286", pass: "94.2%", delta: "4.7 pts" }
        : { discovered: "4,286", pass: "94.2%", delta: "1.6 pts" };
  const visibleAttentionItems =
    version === 1
      ? attentionItems
      : attentionItems.map((item) =>
          item.id === "AST-1277" ? { ...item, severity: "Awaiting approval" } : item,
        );
  const visibleActivities = activities;
  return (
    <div className="page">
      <header className="page-heading overview-heading">
        <div>
          <span className="eyebrow">Migration command center</span>
          <h1>Good morning, Pravin</h1>
          <p>
            Wave 3 cutover in <strong>12 days</strong> ·{" "}
            <button onClick={onInventory}>18 assets blocked</button>
          </p>
        </div>
        <div className="page-actions">
          <div className="segmented" aria-label="Date range">
            {["7D", "30D", "Quarter"].map((r) => (
              <button key={r} className={range === r ? "active" : ""} onClick={() => setRange(r)}>
                {r}
              </button>
            ))}
          </div>
          <Button variant="secondary" icon={<Download size={17} />}>
            Export
          </Button>
          <Button
            icon={<Plus size={17} />}
            onClick={version === 1 ? onInventory : () => setDrawerOpen(true)}
          >
            Create wave
          </Button>
        </div>
      </header>
      <section className="kpi-grid" aria-label="Migration summary">
        <KpiCard
          label="Assets discovered"
          value={data.discovered}
          detail={
            version !== 1
              ? "Across 46 Qlik apps"
              : range === "7D"
                ? "+38 this week"
                : "Across 46 Qlik apps"
          }
          delta={version === 1 ? "+3.4%" : undefined}
          note={version !== 1 ? "+146 found this month" : undefined}
          link={version === 3 ? "View assets" : undefined}
          onLink={version === 3 ? () => onInventoryFilter({ stage: "Discover" }) : undefined}
        />
        <KpiCard
          label="Retire candidates"
          value="1,412"
          detail="33% unused in 90 days"
          delta={version === 1 ? "Save 2,160 hrs" : undefined}
          note={version !== 1 ? "Save ~2,120 hrs" : undefined}
          infoTooltip={
            version !== 1
              ? "Estimate: 1,412 retire candidates × 1.5 hrs avoided per asset"
              : undefined
          }
          link={version === 3 ? "View assets" : undefined}
          onLink={version === 3 ? () => onInventoryFilter({ decision: "Retire" }) : undefined}
        />
        <KpiCard
          label="Migrated"
          value="1,120"
          detail="of 2,874 in scope"
          progress={39}
          link={version === 3 ? "View assets" : undefined}
          onLink={version === 3 ? () => onInventoryFilter({ stage: "Migrate" }) : undefined}
        />
        <KpiCard
          label="Validation pass rate"
          value={data.pass}
          delta={data.delta}
          detail="vs prior period"
          link={version === 3 ? "View assets" : undefined}
          onLink={version === 3 ? () => onInventoryFilter({ validation: "Validated" }) : undefined}
        />
        <KpiCard
          label="Blocked"
          value="18"
          detail="6 critical dependencies"
          warning
          link="View assets"
          onLink={version === 3 ? () => onInventoryFilter({ validation: "Blocked" }) : onInventory}
        />
      </section>
      <div className="dashboard-row charts-row">
        <WaveChart showViewAll={version === 1} revised={version !== 1} />
        <FunnelChart />
      </div>
      <div className="dashboard-row lower-row">
        <section className="card attention-card">
          <div className="card__header">
            <div>
              <h2>Needs attention</h2>
              <p>Failures and approvals that may affect cutover</p>
            </div>
            <button className="text-link" onClick={onInventory}>
              View inventory
              <ArrowRight size={15} />
            </button>
          </div>
          <div className="attention-table-wrap">
            <table className="attention-table">
              <thead>
                <tr>
                  <th scope="col">Asset</th>
                  <th scope="col">Issue</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Age</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {visibleAttentionItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.asset}</strong>
                      <small>{item.id}</small>
                    </td>
                    <td>
                      <StatusBadge status={item.severity} />
                      <span>{item.issue}</span>
                    </td>
                    <td>
                      <div className="owner">
                        <Avatar initials={item.initials} name={item.owner} />
                        <span>{item.owner}</span>
                      </div>
                    </td>
                    <td>{item.age}</td>
                    <td>
                      <Button variant="secondary">Review</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card activity-card">
          <div className="card__header">
            <div>
              <h2>Activity</h2>
              <p>Latest across your team</p>
            </div>
          </div>
          <ol>
            {visibleActivities.map((a, i) => (
              <li key={i}>
                <Avatar initials={a.initials} name={a.name} />
                <div>
                  <p>
                    <strong>{a.name}</strong> {a.action}
                  </p>
                  <small>{a.time}</small>
                </div>
              </li>
            ))}
          </ol>
          <button className="activity-card__all">
            View all activity
            <ArrowRight size={15} />
          </button>
        </section>
      </div>
      {drawerOpen && (
        <WaveDrawer
          assets={assets}
          onClose={() => setDrawerOpen(false)}
          onSuccess={() => {
            setDrawerOpen(false);
            setToast(`Wave 3 created · ${assets.length} assets`);
          }}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
