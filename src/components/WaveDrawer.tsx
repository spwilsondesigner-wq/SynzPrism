import { useMemo, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import type { Asset } from "../data/mockData";
import { Button } from "./Button";
import { Input, Select, Textarea, Toggle } from "./FormControls";

type Props = { assets: Asset[]; onClose: () => void; onSuccess: () => void };
type FormErrors = Partial<Record<"name" | "workspace" | "date" | "email", string>>;

export function WaveDrawer({ assets, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "Wave 3",
    workspace: "",
    date: "",
    email: "",
    notes: "",
    validate: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const hasRetire = useMemo(() => assets.some((a) => a.decision === "Retire"), [assets]);

  const validate = (next = form) => {
    const e: FormErrors = {};
    if (!next.name.trim()) e.name = "Enter a wave name.";
    if (!next.workspace) e.workspace = "Select a target workspace.";
    if (!next.date) e.date = "Select a cutover date.";
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(`${next.date}T00:00:00`) < today) e.date = "Cutover date cannot be in the past.";
    }
    if (hasRetire && !next.email)
      e.email = "Approver email is required because retired assets are selected.";
    else if (next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email))
      e.email = "Enter a valid email address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const update = (key: keyof typeof form, value: string | boolean) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) validate(next);
  };
  const submit = () => {
    setSubmitted(true);
    if (validate()) onSuccess();
  };

  return (
    <div
      className="drawer-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header>
          <div>
            <span className="eyebrow">Migration wave</span>
            <h2 id="drawer-title">Create migration wave</h2>
            <p>Group assets for migration and schedule cutover.</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close panel">
            <X size={20} />
          </button>
        </header>
        <div className="drawer__body">
          {submitted && Object.keys(errors).length > 0 && (
            <div className="error-summary" role="alert">
              <AlertCircle size={20} />
              <div>
                <strong>
                  Check {Object.keys(errors).length} field
                  {Object.keys(errors).length > 1 ? "s" : ""}
                </strong>
                <ul>
                  {Object.entries(errors).map(([id, message]) => (
                    <li key={id}>
                      <a href={`#${id}`}>{message}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <Input
            id="name"
            label="Wave name *"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            error={errors.name}
          />
          <Select
            id="workspace"
            label="Target workspace *"
            value={form.workspace}
            onChange={(e) => update("workspace", e.target.value)}
            error={errors.workspace}
          >
            <option value="">Choose workspace</option>
            <option>Claims Analytics – Production</option>
            <option>Enterprise BI – Migration</option>
            <option>Risk & Underwriting</option>
          </Select>
          <Input
            id="date"
            label="Cutover date *"
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            error={errors.date}
            helper="Schedule at least 48 hours after validation."
          />
          <div className="selected-assets">
            <div>
              <label>Selected assets</label>
              <span>{assets.length}</span>
            </div>
            <ul>
              {assets.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <span>
                    <strong>{a.name}</strong>
                    <small>
                      {a.id} · {a.type}
                    </small>
                  </span>
                  <span>{a.decision}</span>
                </li>
              ))}
            </ul>
            {assets.length > 4 && <p>+ {assets.length - 4} more assets</p>}
          </div>
          <Input
            id="email"
            label={`Approver email ${hasRetire ? "*" : ""}`}
            type="email"
            placeholder="name@meridian.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
            helper={
              hasRetire
                ? "Required because this wave includes assets marked Retire."
                : "Optional for waves without retired assets."
            }
          />
          <Toggle
            checked={form.validate}
            onChange={(v) => update("validate", v)}
            label="Run validation after migration"
          />
          <Textarea
            id="notes"
            label="Notes"
            rows={4}
            placeholder="Add migration context or dependencies…"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>
        <footer>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary">Save draft</Button>
          <Button onClick={submit}>Create wave</Button>
        </footer>
      </aside>
    </div>
  );
}
