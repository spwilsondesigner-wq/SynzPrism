import { ArrowRight, Download, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar } from "../components/AppShell";
import { StatusBadge } from "../components/Badge";
import { Button } from "../components/Button";
import { KpiCard } from "../components/KpiCard";
import { Toast } from "../components/Toast";
import ValidationDiffDrawer from "../components/ValidationDiffDrawer";

type QueueItem = {
  id: string;
  asset: string;
  type: string;
  problem: string;
  check: string;
  wave: "Wave 3" | "Wave 4";
  due?: string;
  status: string;
  action: string;
};

const queue: QueueItem[] = [
  {
    id: "AST-1042",
    asset: "Executive Claims Overview",
    type: "Dashboard",
    problem: "3 visual totals differ from source",
    check: "Visual totals",
    wave: "Wave 3",
    due: "24 May",
    status: "Failed checks",
    action: "Fix",
  },
  {
    id: "AST-1358",
    asset: "Customer Retention Cohorts",
    type: "Data model",
    problem: "Row count variance 2.6% (limit 2%)",
    check: "Row count",
    wave: "Wave 3",
    due: "24 May",
    status: "Failed checks",
    action: "Fix",
  },
  {
    id: "AST-1366",
    asset: "Claims Leakage Monitor",
    type: "Dashboard",
    problem: "Rounding differs on 2 measures",
    check: "Visual totals",
    wave: "Wave 3",
    due: "24 May",
    status: "Failed checks",
    action: "Fix",
  },
  {
    id: "AST-1371",
    asset: "Claims Triage Board",
    type: "Dashboard",
    problem: "Waiting on Catastrophe Exposure Model",
    check: "—",
    wave: "Wave 3",
    due: "24 May",
    status: "Blocked",
    action: "View",
  },
  {
    id: "AST-1503",
    asset: "Sales Pipeline Forecast",
    type: "Dashboard",
    problem: "Ready to migrate",
    check: "—",
    wave: "Wave 4",
    due: "18 Jun",
    status: "Ready",
    action: "Start",
  },
  {
    id: "AST-1124",
    asset: "Policy Renewal Monitor",
    type: "Dashboard",
    problem: "All checks passed",
    check: "—",
    wave: "Wave 3",
    status: "Validated",
    action: "Open",
  },
];

const failures = [
  ["Visual totals", 6],
  ["Row count", 4],
  ["Measure logic", 2],
  ["Row-level security", 1],
  ["Performance", 1],
] as const;

const recentRuns = [
  {
    asset: "Policy Renewal Monitor",
    type: "Validate",
    result: "Passed",
    duration: "3m 12s",
    time: "18 min ago",
  },
  {
    asset: "Executive Claims Overview",
    type: "Validate",
    result: "Failed",
    duration: "4m 08s",
    time: "42 min ago",
  },
  {
    asset: "Sales Pipeline Forecast",
    type: "Migrate",
    result: "Running",
    duration: "2m 34s",
    time: "Started 3 min ago",
    progress: 64,
  },
  {
    asset: "Open Claims Ageing",
    type: "Migrate",
    result: "Passed",
    duration: "6m 21s",
    time: "Yesterday",
  },
];

export default function DeveloperHome() {
  const [wave, setWave] = useState("All my waves");
  const [loading, setLoading] = useState(false);
  const [rerunning, setRerunning] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const visibleQueue = useMemo(
    () => queue.filter((item) => wave === "All my waves" || item.wave === wave),
    [wave],
  );

  const changeWave = (nextWave: string) => {
    setWave(nextWave);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 550);
  };

  const rerun = () => {
    setRerunning(true);
    window.setTimeout(() => {
      setRerunning(false);
      setSelectedAsset(null);
      setToast("3 checks passed on Executive Claims Overview");
    }, 800);
  };

  return (
    <div className="page developer-page">
      <header className="page-heading developer-heading">
        <div>
          <span className="eyebrow">My work</span>
          <h1>Good morning, Rahul</h1>
          <p>
            5 assets failed checks ·{" "}
            <button className="due-link" onClick={() => changeWave("Wave 3")}>
              2 due before Wave 3 cutover
            </button>
          </p>
        </div>
        <div className="page-actions">
          <div className="segmented" aria-label="Wave filter">
            {["All my waves", "Wave 3", "Wave 4"].map((item) => (
              <button
                key={item}
                className={wave === item ? "active" : ""}
                onClick={() => changeWave(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <Button variant="secondary" icon={<Download size={17} />}>
            Export failure report
          </Button>
          <Button
            className="developer-rerun"
            icon={<RefreshCcw size={17} />}
            loading={rerunning}
            onClick={rerun}
          >
            Re-run failed checks
          </Button>
        </div>
      </header>

      <section className="kpi-grid developer-kpis" aria-label="My work summary">
        <KpiCard label="Assigned to me" value="186" detail="Across Waves 3–4" loading={loading} />
        <KpiCard
          label="Failed checks"
          value="14"
          valueTone="danger"
          detail="On 5 assets · 2 due before 24 May"
          link="Fix now"
          onLink={() => setSelectedAsset(queue[0].asset)}
          loading={loading}
        />
        <KpiCard
          label="Ready to migrate"
          value="23"
          valueTone="primary"
          detail="Decided and unblocked"
          loading={loading}
        />
        <KpiCard
          label="Passed this week"
          value="18"
          delta="6 vs last week"
          detail="Validation runs"
          loading={loading}
        />
        <KpiCard
          label="Avg. time to fix"
          value="1.6 days"
          detail="Target ≤ 2 days"
          loading={loading}
        />
      </section>

      <div className="developer-row developer-row--queue">
        <section className="card my-queue-card">
          <div className="card__header">
            <div>
              <h2>My queue</h2>
              <p>Sorted by urgency and readiness</p>
            </div>
            <span className="queue-count">{visibleQueue.length} assets</span>
          </div>
          {loading ? (
            <QueueSkeleton />
          ) : visibleQueue.length ? (
            <>
              <div className="developer-table-wrap">
                <table className="developer-table">
                  <thead>
                    <tr>
                      <th scope="col">Asset</th>
                      <th scope="col">Problem</th>
                      <th scope="col">Check</th>
                      <th scope="col">Wave / due</th>
                      <th scope="col">Status</th>
                      <th scope="col">
                        <span className="sr-only">Action</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleQueue.map((item) => (
                      <QueueRow
                        key={item.id}
                        item={item}
                        onAction={() => item.action === "Fix" && setSelectedAsset(item.asset)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="developer-queue-cards">
                {visibleQueue.map((item) => (
                  <QueueCard
                    key={item.id}
                    item={item}
                    onAction={() => item.action === "Fix" && setSelectedAsset(item.asset)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="developer-empty">
              <strong>All clear. Nothing assigned needs action.</strong>
              <p>Your queue is up to date for this wave.</p>
              <Button variant="secondary">Pick up a ready asset</Button>
            </div>
          )}
        </section>

        <section className="card failures-card">
          <div className="card__header">
            <div>
              <h2>Failures by check type</h2>
              <p>14 open failures</p>
            </div>
          </div>
          <div className="failure-bars">
            {failures.map(([label, count]) => (
              <div key={label}>
                <div>
                  <span>{label}</span>
                  <strong>{count}</strong>
                </div>
                <i>
                  <b style={{ width: `${(count / 6) * 100}%` }} />
                </i>
              </div>
            ))}
          </div>
          <div className="developer-insight">
            <strong>Pattern detected</strong>
            <p>
              6 visual-total failures share the same rounding measure. Fix it once in the Claims
              dataset.
            </p>
            <button>
              Open dataset <ArrowRight size={14} />
            </button>
          </div>
        </section>
      </div>

      <div className="developer-row developer-row--lower">
        <section className="card dependencies-card">
          <div className="card__header">
            <div>
              <h2>Blocked by dependencies</h2>
              <p>Items waiting on another owner</p>
            </div>
          </div>
          <div className="dependency-list">
            <div>
              <div>
                <strong>Claims Triage Board</strong>
                <span>waiting on</span>
                <b>Catastrophe Exposure Model</b>
                <small>Gateway credentials expired</small>
              </div>
              <div className="dependency-owner">
                <Avatar initials="AV" name="Aman Verma" />
                <span>
                  Aman Verma<small>Since 1 day</small>
                </span>
                <Button variant="secondary">Nudge owner</Button>
              </div>
            </div>
            <div>
              <div>
                <strong>Customer Retention Cohorts</strong>
                <span>waiting on</span>
                <b>Customer 360 model refresh</b>
                <small>Source refresh incomplete</small>
              </div>
              <div className="dependency-owner">
                <Avatar initials="PS" name="Priya Shah" />
                <span>
                  Priya Shah<small>Since 6 hours</small>
                </span>
                <Button variant="secondary">Nudge owner</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="card recent-runs-card">
          <div className="card__header">
            <div>
              <h2>Recent runs</h2>
              <p>Migration and validation activity</p>
            </div>
          </div>
          <div className="recent-runs">
            {recentRuns.map((run) => (
              <div key={run.asset}>
                <div>
                  <strong>{run.asset}</strong>
                  <small>
                    {run.type} · {run.time}
                  </small>
                </div>
                <div className="run-result">
                  <StatusBadge status={run.result} />
                  {run.progress && (
                    <div className="run-progress" aria-label={`${run.progress}% complete`}>
                      <span style={{ width: `${run.progress}%` }} />
                    </div>
                  )}
                </div>
                <span>{run.duration}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedAsset && (
        <ValidationDiffDrawer
          assetName={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onRerun={rerun}
        />
      )}
      {toast && <Toast message={toast} tone="teal" onClose={() => setToast("")} />}
    </div>
  );
}

function QueueRow({ item, onAction }: { item: QueueItem; onAction: () => void }) {
  return (
    <tr>
      <td>
        <strong>{item.asset}</strong>
        <small>
          {item.id} · {item.type}
        </small>
      </td>
      <td>{item.problem}</td>
      <td>{item.check}</td>
      <td className={item.due === "24 May" ? "due-soon" : ""}>
        <strong>{item.wave}</strong>
        {item.due && <small>{item.due}</small>}
      </td>
      <td>
        <StatusBadge status={item.status} />
      </td>
      <td>
        <Button variant={item.action === "Fix" ? "primary" : "secondary"} onClick={onAction}>
          {item.action}
        </Button>
      </td>
    </tr>
  );
}

function QueueCard({ item, onAction }: { item: QueueItem; onAction: () => void }) {
  return (
    <article>
      <div>
        <strong>{item.asset}</strong>
        <small>
          {item.id} · {item.type}
        </small>
      </div>
      <StatusBadge status={item.status} />
      <p>{item.problem}</p>
      <dl>
        <div>
          <dt>Check</dt>
          <dd>{item.check}</dd>
        </div>
        <div>
          <dt>Wave / due</dt>
          <dd className={item.due === "24 May" ? "due-soon" : ""}>
            {item.wave}
            {item.due ? ` · ${item.due}` : ""}
          </dd>
        </div>
      </dl>
      <Button className="developer-card-action" onClick={onAction}>
        {item.action === "Fix" ? "Fix" : item.action}
      </Button>
    </article>
  );
}

function QueueSkeleton() {
  return (
    <div className="queue-skeleton" aria-label="Queue loading">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index}>
          <span />
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
