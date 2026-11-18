import { CheckCircle2, X } from "lucide-react";

export function Toast({
  message,
  onClose,
  onUndo,
  tone = "default",
}: {
  message: string;
  onClose: () => void;
  onUndo?: () => void;
  tone?: "default" | "teal";
}) {
  return (
    <div className={`toast ${tone === "teal" ? "toast--teal" : ""}`} role="status">
      <CheckCircle2 size={20} />
      <span>{message}</span>
      {onUndo && <button onClick={onUndo}>Undo</button>}
      <button className="icon-button" onClick={onClose} aria-label="Dismiss notification">
        <X size={18} />
      </button>
    </div>
  );
}
