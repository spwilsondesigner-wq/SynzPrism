import { ArrowDownRight, ArrowUpRight, ArrowRight, Info } from "lucide-react";

type Props = {
  label: string;
  value: string;
  valueTone?: "danger" | "primary" | "teal";
  detail?: string;
  note?: string;
  infoTooltip?: string;
  delta?: string;
  deltaDown?: boolean;
  progress?: number;
  progressTone?: "primary" | "teal";
  warning?: boolean;
  link?: string;
  onLink?: () => void;
  loading?: boolean;
};

export function KpiCard({
  label,
  value,
  valueTone,
  detail,
  note,
  infoTooltip,
  delta,
  deltaDown,
  progress,
  progressTone = "primary",
  warning,
  link,
  onLink,
  loading,
}: Props) {
  const tooltipId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-tooltip`;
  if (loading)
    return (
      <article className="kpi-card" aria-label={`${label} loading`}>
        <div className="skeleton skeleton--label" />
        <div className="skeleton skeleton--value" />
        <div className="skeleton skeleton--line" />
      </article>
    );
  return (
    <article className={`kpi-card ${warning ? "kpi-card--warning" : ""}`}>
      <p className="kpi-card__label">{label}</p>
      <div className={`kpi-card__value ${valueTone ? `kpi-card__value--${valueTone}` : ""}`}>
        {value}
      </div>
      {progress !== undefined && (
        <div
          className={`progress ${progressTone === "teal" ? "progress--teal" : ""}`}
          aria-label={`${progress}% complete`}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
      <div className="kpi-card__footer">
        {delta && (
          <span className={`delta ${deltaDown ? "delta--down" : ""}`}>
            {deltaDown ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
            {delta}
          </span>
        )}
        {note && (
          <span className="kpi-note">
            {note}
            {infoTooltip && (
              <span className="kpi-info">
                <button aria-label={`About ${note}`} aria-describedby={tooltipId}>
                  <Info size={13} />
                </button>
                <span id={tooltipId} role="tooltip">
                  {infoTooltip}
                </span>
              </span>
            )}
          </span>
        )}
        {detail && <span>{detail}</span>}
        {link && (
          <button className="text-link" onClick={onLink}>
            {link}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </article>
  );
}
