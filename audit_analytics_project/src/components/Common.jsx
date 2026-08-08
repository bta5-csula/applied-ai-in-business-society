import React, { forwardRef, memo } from "react";

// KPI Card
export const KPICard = memo(({ label, display, icon, accent, sub, delay = 0 }) => {
  return (
    <div
      className="kpi-card fade-up"
      style={{ "--accent": accent, animationDelay: `${delay}ms` }}
    >
      <div className="kpi-label">
        {label}
        <span style={{ color: accent, opacity: 0.75 }}>{icon}</span>
      </div>
      <div
        className="kpi-value"
        style={{ color: accent === "#ef4444" ? "#ef4444" : "var(--text-1)" }}
      >
        {display}
      </div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
});

// Legend Dot
export const LegDot = memo(({ color, label }) => {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "0.62rem",
        color,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          background: color,
          borderRadius: 2,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
});

// Custom tooltips
export const BenfordTip = memo(forwardRef(({ active, payload, label }, ref) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="c-tip" ref={ref}>
      <div style={{ color: "var(--text-3)", fontSize: "0.6rem", letterSpacing: "0.08em", marginBottom: 4 }}>
        LEADING DIGIT: {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: {p.value}%
        </div>
      ))}
    </div>
  );
}));

export const BarTip = memo(forwardRef(({ active, payload, label }, ref) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="c-tip" ref={ref}>
      <div style={{ color: "var(--text-3)", fontSize: "0.6rem", letterSpacing: "0.08em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: "var(--text-1)" }}>
        {payload[0].value.toLocaleString()} occurrences
      </div>
    </div>
  );
}));
