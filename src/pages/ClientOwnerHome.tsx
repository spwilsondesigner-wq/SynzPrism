import {
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  HelpCircle,
  Mail,
  MessageSquare,
  PanelRight,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "../components/AppShell";
import { StatusBadge } from "../components/Badge";
import { Button } from "../components/Button";
import { Textarea } from "../components/FormControls";
import { KpiCard } from "../components/KpiCard";
import { Toast } from "../components/Toast";

const reports = [
  {
    name: "Commission Reconciliation",
    usage: "9 people · 198 views",
    status: "Delayed — new date 28 May",
    goLive: "Wave 3",
    action: "Compare with Qlik",
  },
  {
    name: "Reinsurance Treaty Summary",
    usage: "12 people · 286 views",
    status: "Being checked",
    goLive: "Wave 3 · 24 May",
    action: "Compare with Qlik",
  },
  {
    name: "Monthly Premium Bordereau",
    usage: "26 people · 724 views in 90 days",
    status: "Ready in Power BI",
    goLive: "Wave 3 · 24 May",
    action: "Open in Power BI",
    external: true,
  },
  {
    name: "Quarterly Reserve Movement",
    usage: "15 people · 402 views",
    status: "Ready in Power BI",
    goLive: "Wave 3 · 24 May",
    action: "Open in Power BI",
    external: true,
  },
  {
    name: "Broker Statement Pack",
    usage: "7 people · 120 views",
    status: "Planned",
    goLive: "Wave 4 · 18 Jun",
    action: "—",
  },
  {
    name: "Treaty Renewal Archive 2019",
    usage: "0 views",
    status: "Suggested to retire",
    goLive: "—",
    action: "Decide",
  },
];

const dates = [
  ["16 May", "Decide on suggested retirements"],
  ["20 May", "Try your reports in Power BI", "Testing opens"],
  ["24 May", "Go-live: Qlik becomes read-only"],
  ["31 May", "First month-end in Power BI", "Sorim team on standby"],
];

const retirementReports = [
  "Treaty Renewal Archive 2019",
  "Old Premium Pivot (2020)",
  "Broker Ranking Draft",
  "Q4 2021 Board Pack",
];

export default function ClientOwnerHome({
  isPreview,
  onExitPreview,
}: {
  isPreview: boolean;
  onExitPreview: () => void;
}) {
  const [view, setView] = useState<"home" | "approvals">(() =>
    window.location.hash === "#retirement-approvals" ? "approvals" : "home",
  );
  const [pending, setPending] = useState(4);
  const [search, setSearch] = useState("");
  const [introVisible, setIntroVisible] = useState(true);
  const [loading, setLoading] = useState(
    () => !new URLSearchParams(window.location.search).has("error"),
  );
  const [dataError, setDataError] = useState(() =>
    new URLSearchParams(window.location.search).has("error"),
  );
  const [confirming, setConfirming] = useState(false);
  const [decisions, setDecisions] = useState<Record<string, "retire" | "keep">>({});
  const [questionFor, setQuestionFor] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const visibleReports = useMemo(
    () =>
      reports.filter(
        (report) =>
          (pending > 0 || report.status !== "Suggested to retire") &&
          report.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [pending, search],
  );

  const openApprovals = () => {
    window.location.hash = "retirement-approvals";
    setView("approvals");
  };

  const returnHome = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setView("home");
  };

  const retry = () => {
    setDataError(false);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 500);
  };

  const retireAll = () => {
    setDecisions(Object.fromEntries(retirementReports.map((name) => [name, "retire"])));
    setPending(0);
    setConfirming(false);
    returnHome();
    setToast("4 reports retired. Qlik keeps read-only copies for 12 months.");
  };

  if (loading) return <ClientOwnerSkeleton isPreview={isPreview} onExitPreview={onExitPreview} />;
  if (dataError)
    return (
      <div className="page client-owner-page">
        <ClientPreviewBanner visible={isPreview} onExit={onExitPreview} />
        <div className="client-data-error">
          <HelpCircle size={28} />
          <h1>We couldn't load your reports</h1>
          <p>Your reports are safe. Try loading this page again.</p>
          <Button onClick={retry}>Retry</Button>
        </div>
      </div>
    );

  return (
    <div className="page client-owner-page">
      <ClientPreviewBanner visible={isPreview} onExit={onExitPreview} />
      {view === "approvals" ? (
        <ApprovalsPage
          decisions={decisions}
          questionFor={questionFor}
          onQuestion={setQuestionFor}
          onDecision={(name, decision) => {
            const next = { ...decisions, [name]: decision };
            setDecisions(next);
            setPending(Math.max(0, 4 - Object.keys(next).length));
          }}
          onBack={returnHome}
          onRetireAll={() => setConfirming(true)}
        />
      ) : (
        <>
          {introVisible && (
            <div className="client-intro" role="note">
              <HelpCircle size={19} />
              <div>
                <strong>What is this page?</strong>
                <p>
                  A simple view of your reports moving from Qlik to Power BI, plus any decisions we
                  need from you.
                </p>
              </div>
              <button
                className="icon-button"
                onClick={() => setIntroVisible(false)}
                aria-label="Dismiss introduction"
              >
                <X size={18} />
              </button>
            </div>
          )}
          <header className="page-heading client-owner-heading">
            <div>
              <span className="eyebrow">Meridian Insurance · Your reports</span>
              <h1>Good morning, James</h1>
              <p>21 of your 38 reports are ready in Power BI · {pending} need your decision</p>
            </div>
          </header>

          {pending > 0 && (
            <section className="decision-banner">
              <div>
                <CalendarDays size={21} />
                <p>
                  <strong>4 reports are suggested for retirement.</strong> Please decide by 16 May
                  so Wave 3 can go live on 24 May.
                </p>
              </div>
              <Button onClick={openApprovals}>Review now</Button>
            </section>
          )}

          <section className="client-kpi-grid" aria-label="Your report summary">
            <KpiCard
              label="Ready in Power BI"
              value="21 of 38"
              progress={55}
              progressTone="teal"
              detail="55% ready"
              link="Open your reports"
              onLink={() =>
                document.getElementById("my-reports")?.scrollIntoView({ behavior: "smooth" })
              }
            />
            <KpiCard
              label="Numbers match Qlik"
              value="21 of 21"
              valueTone="teal"
              detail="Every ready report passed accuracy checks"
            />
            <KpiCard
              label="Need your decision"
              value={String(pending)}
              detail={pending ? "Oldest waiting 3 days" : "You're all set"}
              warning={pending > 0}
              link={pending ? "Review" : undefined}
              onLink={pending ? openApprovals : undefined}
            />
            <KpiCard
              label="Your go-live date"
              value="24 May"
              detail="Qlik becomes read-only on this date"
            />
          </section>

          <div className="client-row client-row--reports">
            <section className="card client-reports-card" id="my-reports">
              <div className="card__header">
                <div>
                  <h2>My reports</h2>
                  <p>Only reports you own or regularly use</p>
                </div>
              </div>
              <label className="client-report-search">
                <Search size={17} />
                <span className="sr-only">Search your reports</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search your reports"
                />
              </label>
              {visibleReports.length ? (
                <>
                  <div className="client-report-table-wrap">
                    <table className="client-report-table">
                      <thead>
                        <tr>
                          <th scope="col">Report</th>
                          <th scope="col">Used by</th>
                          <th scope="col">Status</th>
                          <th scope="col">Go-live</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleReports.map((report) => (
                          <ReportRow key={report.name} report={report} onDecide={openApprovals} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="client-report-cards">
                    {visibleReports.map((report) => (
                      <ReportCard key={report.name} report={report} onDecide={openApprovals} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="client-reports-empty">
                  <FileSpreadsheet size={30} />
                  <strong>No reports found</strong>
                  <p>Try a different report name.</p>
                </div>
              )}
              <footer>
                Showing 1–{visibleReports.length} of {pending ? 38 : 37}
              </footer>
            </section>

            <section className="card key-dates-card">
              <div className="card__header">
                <div>
                  <h2>Key dates</h2>
                  <p>What happens next</p>
                </div>
              </div>
              <ol>
                {dates.map(([date, title, note]) => (
                  <li key={date}>
                    <span>{date}</span>
                    <div>
                      <strong>{title}</strong>
                      {note && <small>{note}</small>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="client-row client-row--lower">
            <section className="card changes-card">
              <div className="card__header">
                <div>
                  <h2>What's changing for you</h2>
                  <p>Three quick things to know</p>
                </div>
              </div>
              <div className="change-notes">
                <div>
                  <PanelRight size={20} />
                  <p>Filters now sit in a pane on the right.</p>
                </div>
                <div>
                  <FileSpreadsheet size={20} />
                  <p>Exports to Excel work the same way.</p>
                </div>
                <div>
                  <Bookmark size={20} />
                  <p>
                    Bookmarks need re-creating — <button>watch the 2-min guide</button>.
                  </p>
                </div>
              </div>
            </section>
            <section className="card help-card">
              <div className="card__header">
                <div>
                  <h2>Help and contacts</h2>
                  <p>We're here if you need us</p>
                </div>
              </div>
              <div className="contact-card">
                <Avatar initials="PW" name="Pravin Wilson" />
                <div>
                  <strong>Pravin Wilson</strong>
                  <span>Migration Lead · Sorim Technologies</span>
                </div>
                <Button variant="secondary" icon={<Mail size={15} />}>
                  Email
                </Button>
                <Button variant="secondary" icon={<MessageSquare size={15} />}>
                  Chat in Teams
                </Button>
              </div>
              <div className="help-links">
                <button>
                  Power BI quick-start guide <ExternalLink size={13} />
                </button>
                <button>
                  Report a problem with a report <ExternalLink size={13} />
                </button>
              </div>
            </section>
          </div>
        </>
      )}

      {confirming && (
        <RetirementConfirmation onCancel={() => setConfirming(false)} onConfirm={retireAll} />
      )}
      {toast && <Toast message={toast} tone="teal" onClose={() => setToast("")} />}
    </div>
  );
}

function ClientPreviewBanner({ visible, onExit }: { visible: boolean; onExit: () => void }) {
  if (!visible) return null;
  return (
    <div className="client-preview-banner">
      <span>You're previewing the client view</span>
      <button onClick={onExit}>Exit preview</button>
    </div>
  );
}

function ReportRow({
  report,
  onDecide,
}: {
  report: (typeof reports)[number];
  onDecide: () => void;
}) {
  return (
    <tr>
      <td>
        <strong>{report.name}</strong>
      </td>
      <td>{report.usage}</td>
      <td>
        <StatusBadge status={report.status} />
      </td>
      <td>{report.goLive}</td>
      <td>
        {report.action === "—" ? (
          "—"
        ) : (
          <button
            className="client-action"
            onClick={report.action === "Decide" ? onDecide : undefined}
          >
            {report.action}
            {report.external && <ExternalLink size={13} />}
          </button>
        )}
      </td>
    </tr>
  );
}

function ReportCard({
  report,
  onDecide,
}: {
  report: (typeof reports)[number];
  onDecide: () => void;
}) {
  return (
    <article>
      <div>
        <strong>{report.name}</strong>
        <StatusBadge status={report.status} />
      </div>
      <dl>
        <div>
          <dt>Used by</dt>
          <dd>{report.usage}</dd>
        </div>
        <div>
          <dt>Go-live</dt>
          <dd>{report.goLive}</dd>
        </div>
      </dl>
      {report.action !== "—" && (
        <Button variant="secondary" onClick={report.action === "Decide" ? onDecide : undefined}>
          {report.action}
          {report.external && <ExternalLink size={13} />}
        </Button>
      )}
    </article>
  );
}

function ApprovalsPage({
  decisions,
  questionFor,
  onQuestion,
  onDecision,
  onBack,
  onRetireAll,
}: {
  decisions: Record<string, "retire" | "keep">;
  questionFor: string | null;
  onQuestion: (name: string | null) => void;
  onDecision: (name: string, decision: "retire" | "keep") => void;
  onBack: () => void;
  onRetireAll: () => void;
}) {
  return (
    <div className="approvals-page">
      <nav className="breadcrumb">
        <button onClick={onBack}>My reports</button>
        <span>/</span>
        <span>Retirement decisions</span>
      </nav>
      <header className="approvals-heading">
        <div>
          <span className="eyebrow">Your decision</span>
          <h1>4 reports suggested for retirement</h1>
          <p>Review why each report was suggested and choose what should happen.</p>
        </div>
        <Button onClick={onRetireAll}>Retire all 4</Button>
      </header>
      <div className="retirement-cards">
        {retirementReports.map((name) => (
          <article key={name}>
            <header>
              <div>
                <h2>{name}</h2>
                <p>Last opened 214 days ago</p>
              </div>
              {decisions[name] && (
                <span className="decision-complete">
                  <CheckCircle2 size={15} />
                  {decisions[name] === "retire" ? "Retire" : "Keep and move"}
                </span>
              )}
            </header>
            <div className="retirement-explanation">
              <div>
                <strong>Why we suggest retiring it:</strong>
                <p>
                  No views in 90 days. No other report uses its data. The same figures are in
                  Reinsurance Treaty Summary.
                </p>
              </div>
              <div>
                <strong>What happens if you agree:</strong>
                <p>It won't be moved to Power BI. Qlik keeps a read-only copy for 12 months.</p>
              </div>
            </div>
            {questionFor === name && (
              <Textarea
                id={`question-${name.replace(/\W/g, "-")}`}
                label="Your question"
                rows={3}
                placeholder="What would you like to know?"
              />
            )}
            <footer>
              <Button onClick={() => onDecision(name, "retire")}>Retire</Button>
              <Button variant="secondary" onClick={() => onDecision(name, "keep")}>
                Keep and move it
              </Button>
              <Button
                variant="ghost"
                onClick={() => onQuestion(questionFor === name ? null : name)}
              >
                Ask a question
              </Button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

function RetirementConfirmation({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="confirmation-backdrop">
      <div
        className="confirmation-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-retirement-title"
      >
        <h2 id="confirm-retirement-title">Retire 4 reports?</h2>
        <p>These reports won't move to Power BI. Qlik will keep read-only copies for 12 months.</p>
        <ul>
          {retirementReports.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Retire 4 reports</Button>
        </footer>
      </div>
    </div>
  );
}

function ClientOwnerSkeleton({
  isPreview,
  onExitPreview,
}: {
  isPreview: boolean;
  onExitPreview: () => void;
}) {
  return (
    <div className="page client-owner-page">
      <ClientPreviewBanner visible={isPreview} onExit={onExitPreview} />
      <div className="client-heading-skeleton">
        <span />
        <span />
        <span />
      </div>
      <div className="client-kpi-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <KpiCard key={index} label="Loading" value="" loading />
        ))}
      </div>
      <div className="client-list-skeleton">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    </div>
  );
}
