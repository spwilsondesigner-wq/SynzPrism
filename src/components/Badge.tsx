import type { Decision, Validation } from "../data/mockData";

export function StatusBadge({ status }: { status: Validation | string }) {
  const key = status.toLowerCase().replace(/ /g, "-");
  return (
    <span className={`status status--${key}`}>
      <span className="status__dot" aria-hidden />
      {status}
    </span>
  );
}

export function DecisionTag({ decision }: { decision: Decision }) {
  return <span className={`decision decision--${decision.toLowerCase()}`}>{decision}</span>;
}
