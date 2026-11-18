import { AlertCircle, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import { Textarea } from "./FormControls";

const differences = [
  {
    measure: "Total paid claims",
    qlik: "12,480,220",
    powerBi: "12,479,860",
    difference: "−360",
    outside: true,
  },
  {
    measure: "Average settlement",
    qlik: "4,218.42",
    powerBi: "4,218.29",
    difference: "−0.13",
    outside: true,
  },
  { measure: "Open claim count", qlik: "8,416", powerBi: "8,416", difference: "0", outside: false },
  {
    measure: "Loss ratio",
    qlik: "68.42%",
    powerBi: "68.41%",
    difference: "−0.01 pts",
    outside: false,
  },
];

export default function ValidationDiffDrawer({
  assetName,
  onClose,
  onRerun,
}: {
  assetName: string;
  onClose: () => void;
  onRerun: () => void;
}) {
  const [accepting, setAccepting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const accept = () => {
    if (!accepting) {
      setAccepting(true);
      return;
    }
    if (!reason.trim()) {
      setError("Enter a reason before accepting this difference.");
      return;
    }
    onClose();
  };

  return (
    <div
      className="drawer-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <aside
        className="drawer validation-diff-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="validation-diff-title"
      >
        <header>
          <div>
            <span className="eyebrow">Visual totals · Last run 08:42</span>
            <h2 id="validation-diff-title">{assetName}</h2>
            <div className="validation-links">
              <button>
                Open in Power BI <ExternalLink size={13} />
              </button>
              <button>
                Open in Qlik <ExternalLink size={13} />
              </button>
            </div>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close validation differences"
          >
            <X size={20} />
          </button>
        </header>
        <div className="drawer__body">
          <div className="diff-table-wrap">
            <table className="diff-table">
              <thead>
                <tr>
                  <th scope="col">Measure</th>
                  <th scope="col">Qlik value</th>
                  <th scope="col">Power BI value</th>
                  <th scope="col">Difference</th>
                </tr>
              </thead>
              <tbody>
                {differences.map((row) => (
                  <tr key={row.measure}>
                    <td>{row.measure}</td>
                    <td>{row.qlik}</td>
                    <td>{row.powerBi}</td>
                    <td className={row.outside ? "diff-outside" : ""}>
                      {row.outside && <AlertCircle size={14} aria-label="Outside tolerance" />}
                      {row.difference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="likely-cause">
            <AlertCircle size={18} />
            <div>
              <strong>Likely cause</strong>
              <p>Rounding applied before sum in the Power BI measure.</p>
            </div>
          </div>
          {accepting && (
            <Textarea
              id="accept-reason"
              label="Reason *"
              rows={4}
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                if (error) setError("");
              }}
              error={error}
              placeholder="Explain why this difference is acceptable…"
            />
          )}
        </div>
        <footer>
          <Button variant="ghost">Assign to…</Button>
          <Button variant="secondary" onClick={accept}>
            Mark as accepted difference
          </Button>
          <Button onClick={onRerun}>Re-run check</Button>
        </footer>
      </aside>
    </div>
  );
}
