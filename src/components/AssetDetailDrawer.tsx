import { Database, GitBranch, X } from "lucide-react";
import type { Asset } from "../data/mockData";
import { Avatar } from "./AppShell";
import { DecisionTag, StatusBadge } from "./Badge";
import { Button } from "./Button";

export default function AssetDetailDrawer({
  asset,
  onClose,
}: {
  asset: Asset;
  onClose: () => void;
}) {
  const sources = asset.dataSources ?? [
    `${asset.source} semantic model`,
    "Enterprise policy warehouse",
  ];
  const trend = asset.usageTrend ?? [42, 48, 55, 51, 63, 70, 68, 74, 81, 78, 88, 92];
  const maxTrend = Math.max(...trend, 1);

  return (
    <div
      className="drawer-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <aside
        className="drawer asset-detail-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="asset-detail-title"
      >
        <header>
          <div>
            <span className="eyebrow">Asset details · {asset.id}</span>
            <h2 id="asset-detail-title">{asset.name}</h2>
            <p>
              {asset.type} · Qlik: {asset.source}
            </p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close asset details">
            <X size={20} />
          </button>
        </header>
        <div className="drawer__body">
          <div className="asset-detail-owner">
            <Avatar initials={asset.initials} name={asset.owner} />
            <span>
              <small>Owner</small>
              <strong>{asset.owner}</strong>
            </span>
            <DecisionTag decision={asset.decision} />
          </div>
          <dl className="asset-detail-grid">
            <div>
              <dt>Asset ID</dt>
              <dd>{asset.id}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{asset.type}</dd>
            </div>
            <div>
              <dt>Qlik app</dt>
              <dd>{asset.source}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{asset.updated}</dd>
            </div>
            <div>
              <dt>Complexity</dt>
              <dd>{asset.complexity === "Med" ? "Medium" : asset.complexity}</dd>
            </div>
            <div>
              <dt>Decision</dt>
              <dd>
                <DecisionTag decision={asset.decision} />
              </dd>
            </div>
            <div>
              <dt>Stage</dt>
              <dd>
                <span className="stage-with-dot">
                  <i className={`stage-dot stage-dot--${asset.stage.toLowerCase()}`} />
                  {asset.stage}
                </span>
              </dd>
            </div>
            <div>
              <dt>Validation</dt>
              <dd>
                <StatusBadge status={asset.validation} />
              </dd>
            </div>
            <div>
              <dt>90-day views</dt>
              <dd>{asset.views.toLocaleString()}</dd>
            </div>
            <div>
              <dt>Dependents</dt>
              <dd>{asset.dependents ?? Math.max(1, Math.round(asset.views / 180))} assets</dd>
            </div>
          </dl>
          <section className="asset-detail-section">
            <h3>
              <Database size={16} />
              Data sources
            </h3>
            <ul>
              {sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </section>
          <section className="asset-detail-section">
            <h3>
              <GitBranch size={16} />
              90-day usage trend
            </h3>
            <div className="usage-summary">
              <strong>{asset.views.toLocaleString()}</strong>
              <span>total views</span>
            </div>
            <div
              className="usage-trend"
              role="img"
              aria-label={`90-day usage trend for ${asset.name}`}
            >
              {trend.map((value, index) => (
                <i key={index} style={{ height: `${Math.max(4, (value / maxTrend) * 100)}%` }} />
              ))}
            </div>
            <div className="usage-trend-labels">
              <span>12 weeks ago</span>
              <span>Current</span>
            </div>
          </section>
        </div>
        <footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button>Add to wave</Button>
        </footer>
      </aside>
    </div>
  );
}
