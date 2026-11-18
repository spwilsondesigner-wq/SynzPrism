const waveRows = [
  { wave: "Wave 1", date: "Complete", values: [12, 18, 35, 27, 8] },
  { wave: "Wave 2", date: "Complete", values: [8, 14, 38, 32, 8] },
  { wave: "Wave 3", date: "Cutover 24 May", values: [6, 16, 40, 26, 12] },
  { wave: "Wave 4", date: "18 Jun", values: [16, 37, 31, 10, 6] },
  { wave: "Wave 5", date: "09 Jul", values: [35, 42, 16, 5, 2] },
];

const stages = ["Discover", "Assess", "Migrate", "Validate", "Modernize"];

export function WaveChart({
  showViewAll = false,
  revised = false,
}: {
  showViewAll?: boolean;
  revised?: boolean;
}) {
  const revisedValues = [
    [12, 18, 35, 27, 8],
    [8, 14, 38, 32, 8],
    [6, 12, 24, 10, 4],
    [12, 18, 12, 5, 1],
    [18, 14, 6, 2, 0],
  ];
  const remaining = [0, 0, 44, 52, 60];
  return (
    <section className="card chart-card">
      <div className="card__header">
        <div>
          <h2>Wave progress</h2>
          <p>
            {revised
              ? "Time spent in each stage · % shows wave completion"
              : "2,874 assets in migration scope"}
          </p>
        </div>
        {showViewAll && <button className="text-link">View all waves</button>}
      </div>
      <div className="legend" aria-hidden>
        {stages.map((s, i) => (
          <span key={s}>
            <i className={`stage-${i}`} />
            {s}
          </span>
        ))}
        {revised && (
          <span>
            <i className="stage-remaining" />
            Remaining
          </span>
        )}
      </div>
      <div
        className="wave-chart"
        role="img"
        aria-label="Wave 1 and 2 are complete. Wave 3 is 66 percent through migrate and validate with cutover on 24 May."
      >
        {waveRows.map((row, ri) => (
          <div className="wave-row" key={row.wave}>
            <div>
              <strong>{row.wave}</strong>
              <small>{row.date}</small>
            </div>
            <div className="stacked-bar">
              {(revised ? revisedValues[ri] : row.values).map((v, i) => (
                <span key={i} className={`stage-${i}`} style={{ width: `${v}%` }} />
              ))}
              {revised && remaining[ri] > 0 && (
                <span className="stage-remaining" style={{ width: `${remaining[ri]}%` }} />
              )}
              {ri === 2 && <i className="cutover-marker" title="Today" />}
            </div>
            <b>{ri < 2 ? "100%" : `${72 - ri * 8}%`}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FunnelChart() {
  const values = [4286, 3560, 2874, 1120, 642];
  return (
    <section className="card funnel-card">
      <div className="card__header">
        <div>
          <h2>Stage funnel</h2>
          <p>Current estate distribution</p>
        </div>
      </div>
      <div
        className="funnel"
        role="img"
        aria-label="4,286 discovered, 3,560 assessed, 2,874 selected to migrate, 1,120 validated, and 642 modernized."
      >
        {stages.map((stage, i) => (
          <div key={stage}>
            <span style={{ width: `${100 - i * 11}%` }} className={`funnel-${i}`}>
              <strong>{values[i].toLocaleString()}</strong>
              <small>{stage}</small>
            </span>
            {i < 4 && <b>−{[17, 19, 61, 43][i]}%</b>}
          </div>
        ))}
      </div>
    </section>
  );
}
