import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { Asset } from "../data/mockData";
import { DecisionTag, StatusBadge } from "./Badge";
import { Avatar } from "./AppShell";

type Props = {
  assets: Asset[];
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  version?: 1 | 2 | 3;
  onViewDetails?: (asset: Asset) => void;
  loading?: boolean;
};

export function InventoryTable({
  assets,
  selected,
  onToggle,
  onToggleAll,
  version = 1,
  onViewDetails,
  loading,
}: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  if (loading)
    return (
      <div className="table-card">
        {Array.from({ length: 7 }).map((_, i) => (
          <div className="table-skeleton" key={i}>
            <span />
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    );
  return (
    <>
      <div className="table-card inventory-table-wrap">
        <table className={`inventory-table ${version !== 1 ? "inventory-table--v2" : ""}`}>
          <thead>
            <tr>
              <th className="check-col" scope="col">
                <input
                  type="checkbox"
                  aria-label="Select all assets"
                  checked={assets.length > 0 && assets.every((a) => selected.includes(a.id))}
                  onChange={onToggleAll}
                />
              </th>
              {version !== 1 ? (
                <>
                  <Sortable>Asset</Sortable>
                  <Sortable>Owner</Sortable>
                  <Sortable align="right">90-day views</Sortable>
                  <Sortable>Complexity</Sortable>
                  <Sortable>Decision</Sortable>
                  <Sortable>Stage</Sortable>
                  <Sortable>Validation</Sortable>
                </>
              ) : (
                <>
                  <Sortable>Name + ID</Sortable>
                  <Sortable>Type</Sortable>
                  <Sortable>Source app</Sortable>
                  <Sortable>Owner</Sortable>
                  <Sortable>90-day views</Sortable>
                  <Sortable>Complexity</Sortable>
                  <Sortable>Decision</Sortable>
                  <Sortable>Stage</Sortable>
                  <Sortable>Validation</Sortable>
                  <Sortable>Last updated</Sortable>
                </>
              )}
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className={selected.includes(asset.id) ? "selected" : ""}>
                <td className="check-col">
                  <input
                    type="checkbox"
                    aria-label={`Select ${asset.name}`}
                    checked={selected.includes(asset.id)}
                    onChange={() => onToggle(asset.id)}
                  />
                </td>
                {version !== 1 ? (
                  <>
                    <td className="asset-cell">
                      <strong>{asset.name}</strong>
                      <small>
                        {asset.id} · {asset.type} · Qlik: {asset.source}
                      </small>
                    </td>
                    <td>
                      <div className="owner">
                        <Avatar initials={asset.initials} name={asset.owner} />
                        <span>{asset.owner}</span>
                      </div>
                    </td>
                    <td className="views-cell">
                      <div className="views">
                        <span>{asset.views.toLocaleString()}</span>
                        <i>
                          <b
                            style={{
                              width: `${asset.views === 0 ? 0 : Math.min(100, Math.max(4, asset.views / 18))}%`,
                            }}
                          />
                        </i>
                      </div>
                    </td>
                    <td>
                      <span className="complexity complexity--neutral">
                        {asset.complexity === "Med" ? "Medium" : asset.complexity}
                      </span>
                    </td>
                    <td>
                      <DecisionTag decision={asset.decision} />
                    </td>
                    <td>
                      <span className="stage-with-dot">
                        <i className={`stage-dot stage-dot--${asset.stage.toLowerCase()}`} />
                        {asset.stage}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={asset.validation} />
                    </td>
                    <td className="row-actions">
                      <button
                        className="icon-button"
                        aria-label={`Actions for ${asset.name}`}
                        aria-haspopup="menu"
                        aria-expanded={openMenu === asset.id}
                        onClick={() => setOpenMenu(openMenu === asset.id ? null : asset.id)}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {openMenu === asset.id && (
                        <div className="row-menu" role="menu">
                          <button
                            role="menuitem"
                            onClick={() => {
                              onViewDetails?.(asset);
                              setOpenMenu(null);
                            }}
                          >
                            View details
                          </button>
                          <button role="menuitem" onClick={() => setOpenMenu(null)}>
                            Add to wave
                          </button>
                          <button role="menuitem" onClick={() => setOpenMenu(null)}>
                            Mark retire
                          </button>
                          <button role="menuitem" onClick={() => setOpenMenu(null)}>
                            Re-run validation
                          </button>
                        </div>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <strong>{asset.name}</strong>
                      <small>{asset.id}</small>
                    </td>
                    <td>{asset.type}</td>
                    <td>
                      <span className="platform">Qlik</span>
                      {asset.source}
                    </td>
                    <td>
                      <div className="owner">
                        <Avatar initials={asset.initials} name={asset.owner} />
                        <span>{asset.owner}</span>
                      </div>
                    </td>
                    <td>
                      <div className="views">
                        <span>{asset.views.toLocaleString()}</span>
                        <i>
                          <b
                            style={{
                              width: `${Math.min(100, Math.max(4, asset.views / 18))}%`,
                            }}
                          />
                        </i>
                      </div>
                    </td>
                    <td>
                      <span className={`complexity complexity--${asset.complexity.toLowerCase()}`}>
                        {asset.complexity}
                      </span>
                    </td>
                    <td>
                      <DecisionTag decision={asset.decision} />
                    </td>
                    <td>
                      <span className="stage-text">{asset.stage}</span>
                    </td>
                    <td>
                      <StatusBadge status={asset.validation} />
                    </td>
                    <td>{asset.updated}</td>
                    <td>
                      <button className="icon-button" aria-label={`Actions for ${asset.name}`}>
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="asset-cards">
        {assets.map((asset) => (
          <article
            className={`asset-card ${selected.includes(asset.id) ? "selected" : ""}`}
            key={asset.id}
          >
            <div className="asset-card__top">
              <input
                type="checkbox"
                aria-label={`Select ${asset.name}`}
                checked={selected.includes(asset.id)}
                onChange={() => onToggle(asset.id)}
              />
              <div>
                <strong>{asset.name}</strong>
                <small>
                  {asset.id} · {asset.type}
                </small>
              </div>
              <button className="icon-button" aria-label={`Actions for ${asset.name}`}>
                <MoreHorizontal size={18} />
              </button>
            </div>
            <div className="asset-card__badges">
              <DecisionTag decision={asset.decision} />
              <StatusBadge status={asset.validation} />
            </div>
            <dl>
              <div>
                <dt>Source</dt>
                <dd>{asset.source}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{asset.owner}</dd>
              </div>
              <div>
                <dt>Stage</dt>
                <dd>{asset.stage}</dd>
              </div>
              <div>
                <dt>90-day views</dt>
                <dd>{asset.views.toLocaleString()}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}

function Sortable({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <th scope="col" className={align === "right" ? "align-right" : ""}>
      <button>
        {children}
        <ArrowUpDown size={13} aria-label="Sort" />
      </button>
    </th>
  );
}
