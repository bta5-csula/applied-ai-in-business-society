import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

const T = {
  bg0: "#04050a",
  bg1: "#080c14",
  bg2: "#0d1220",
  bg3: "#121929",
  border: "#1a2236",
  border2: "#243047",
  accent: "#00d4ff",
  green: "#00e5a0",
  yellow: "#f5c542",
  red: "#ff4d6d",
  orange: "#ff8c42",
  purple: "#b48cff",
  text0: "#e8edf5",
  text1: "#8a97b0",
  text2: "#4a5568",
  font: "'IBM Plex Mono','Courier New',monospace",
};

const CUSTOMERS = [
  {
    id: "CUST-001",
    name: "Alpine Cycles Ltd",
    seg: "MID-MARKET",
    country: "US",
    city: "Denver",
    credit: 250000,
    terms: "Net 30",
    risk: "MEDIUM",
    revenue: 4825887.78,
    txns: 207,
    avgDays: 46.1,
    latePct: 76.8,
  },
  {
    id: "CUST-002",
    name: "Apex Bike Group",
    seg: "ENTERPRISE",
    country: "US",
    city: "Atlanta",
    credit: 300000,
    terms: "Net 45",
    risk: "LOW",
    revenue: 5854087.66,
    txns: 211,
    avgDays: 46.9,
    latePct: 50.2,
  },
  {
    id: "CUST-003",
    name: "Blaze Distribution",
    seg: "MID-MARKET",
    country: "DE",
    city: "Berlin",
    credit: 200000,
    terms: "Net 30",
    risk: "MEDIUM",
    revenue: 5139100.76,
    txns: 207,
    avgDays: 45.5,
    latePct: 72.5,
  },
  {
    id: "CUST-004",
    name: "Chain Reaction Ltd",
    seg: "ENTERPRISE",
    country: "DE",
    city: "München",
    credit: 300000,
    terms: "Net 45",
    risk: "HIGH",
    revenue: 5346858.85,
    txns: 225,
    avgDays: 172.1,
    latePct: 100,
  },
  {
    id: "CUST-005",
    name: "CrankShaft Corp",
    seg: "MID-MARKET",
    country: "US",
    city: "Chicago",
    credit: 150000,
    terms: "Net 30",
    risk: "MEDIUM",
    revenue: 5786019.44,
    txns: 223,
    avgDays: 45.8,
    latePct: 77.1,
  },
  {
    id: "CUST-006",
    name: "Crest Cycle Co",
    seg: "ENTERPRISE",
    country: "US",
    city: "Boston",
    credit: 300000,
    terms: "Net 30",
    risk: "HIGH",
    revenue: 5732829.42,
    txns: 222,
    avgDays: 153.9,
    latePct: 100,
  },
  {
    id: "CUST-007",
    name: "CycleCore B2B",
    seg: "MID-MARKET",
    country: "DE",
    city: "Hamburg",
    credit: 200000,
    terms: "Net 45",
    risk: "LOW",
    revenue: 4887465.98,
    txns: 196,
    avgDays: 46.7,
    latePct: 45.4,
  },
  {
    id: "CUST-008",
    name: "Enduro Supply Co",
    seg: "MID-MARKET",
    country: "US",
    city: "Seattle",
    credit: 100000,
    terms: "Net 30",
    risk: "MEDIUM",
    revenue: 4922477.45,
    txns: 207,
    avgDays: 45.0,
    latePct: 75.4,
  },
  {
    id: "CUST-009",
    name: "Gearhead Supply",
    seg: "SMB",
    country: "US",
    city: "Portland",
    credit: 50000,
    terms: "Net 30",
    risk: "HIGH",
    revenue: 5346150.52,
    txns: 212,
    avgDays: 162.6,
    latePct: 100,
  },
  {
    id: "CUST-010",
    name: "Gravity Sports Co",
    seg: "MID-MARKET",
    country: "DE",
    city: "Frankfurt",
    credit: 200000,
    terms: "Net 45",
    risk: "LOW",
    revenue: 6059858.2,
    txns: 214,
    avgDays: 46.9,
    latePct: 47.2,
  },
  {
    id: "CUST-011",
    name: "Momentum Traders",
    seg: "SMB",
    country: "US",
    city: "Phoenix",
    credit: 50000,
    terms: "Net 30",
    risk: "HIGH",
    revenue: 4972631.99,
    txns: 194,
    avgDays: 157.6,
    latePct: 100,
  },
  {
    id: "CUST-012",
    name: "Peak Veloce",
    seg: "MID-MARKET",
    country: "DE",
    city: "Hannover",
    credit: 250000,
    terms: "Net 45",
    risk: "MEDIUM",
    revenue: 5840412.47,
    txns: 219,
    avgDays: 61.1,
    latePct: 75.3,
  },
  {
    id: "CUST-013",
    name: "ProBike Partners",
    seg: "ENTERPRISE",
    country: "US",
    city: "New York",
    credit: 300000,
    terms: "Net 45",
    risk: "MEDIUM",
    revenue: 5946144.75,
    txns: 231,
    avgDays: 60.4,
    latePct: 78.4,
  },
  {
    id: "CUST-014",
    name: "RidePro Distribution",
    seg: "MID-MARKET",
    country: "DE",
    city: "Leipzig",
    credit: 200000,
    terms: "Net 30",
    risk: "LOW",
    revenue: 5814535.52,
    txns: 236,
    avgDays: 32.2,
    latePct: 53.8,
  },
  {
    id: "CUST-015",
    name: "RideRight Supply",
    seg: "SMB",
    country: "US",
    city: "Dallas",
    credit: 50000,
    terms: "Net 30",
    risk: "HIGH",
    revenue: 6284471.44,
    txns: 232,
    avgDays: 155.6,
    latePct: 100,
  },
  {
    id: "CUST-016",
    name: "Summit Bike Co",
    seg: "ENTERPRISE",
    country: "US",
    city: "Los Angeles",
    credit: 250000,
    terms: "Net 45",
    risk: "LOW",
    revenue: 5289730.47,
    txns: 207,
    avgDays: 46.9,
    latePct: 46.4,
  },
  {
    id: "CUST-017",
    name: "Swift Cycle Hub",
    seg: "MID-MARKET",
    country: "DE",
    city: "Stuttgart",
    credit: 100000,
    terms: "Net 30",
    risk: "MEDIUM",
    revenue: 5212532.24,
    txns: 203,
    avgDays: 47.4,
    latePct: 79.3,
  },
  {
    id: "CUST-018",
    name: "Terrain Bikes Ltd",
    seg: "MID-MARKET",
    country: "US",
    city: "Denver",
    credit: 50000,
    terms: "Net 45",
    risk: "MEDIUM",
    revenue: 5627843.15,
    txns: 216,
    avgDays: 58.9,
    latePct: 74.1,
  },
  {
    id: "CUST-019",
    name: "Trail Blazers Inc",
    seg: "MID-MARKET",
    country: "US",
    city: "Austin",
    credit: 75000,
    terms: "Net 30",
    risk: "MEDIUM",
    revenue: 6124144.44,
    txns: 227,
    avgDays: 45.0,
    latePct: 75.8,
  },
  {
    id: "CUST-020",
    name: "TwoWheels Direct",
    seg: "SMB",
    country: "US",
    city: "Philadelphia",
    credit: 75000,
    terms: "Net 30",
    risk: "HIGH",
    revenue: 5910203.5,
    txns: 226,
    avgDays: 159.7,
    latePct: 100,
  },
  {
    id: "CUST-021",
    name: "Urban Cycles Corp",
    seg: "ENTERPRISE",
    country: "DE",
    city: "Köln",
    credit: 250000,
    terms: "Net 45",
    risk: "LOW",
    revenue: 5511059.13,
    txns: 210,
    avgDays: 47.5,
    latePct: 53.8,
  },
  {
    id: "CUST-022",
    name: "Velo Wholesale",
    seg: "MID-MARKET",
    country: "DE",
    city: "Heidelberg",
    credit: 75000,
    terms: "Net 30",
    risk: "MEDIUM",
    revenue: 5945132.08,
    txns: 242,
    avgDays: 44.6,
    latePct: 75.2,
  },
  {
    id: "CUST-023",
    name: "Velocity Supply",
    seg: "SMB",
    country: "US",
    city: "Detroit",
    credit: 50000,
    terms: "Net 45",
    risk: "HIGH",
    revenue: 6082432.93,
    txns: 233,
    avgDays: 172.4,
    latePct: 100,
  },
];

const MONTHLY = [
  { m: "Jan", rev: 8.2, profit: 3.1, orders: 193, margin: 37.8 },
  { m: "Feb", rev: 9.4, profit: 3.6, orders: 293, margin: 38.3 },
  { m: "Mar", rev: 11.1, profit: 4.2, orders: 254, margin: 37.8 },
  { m: "Apr", rev: 13.2, profit: 5.0, orders: 676, margin: 37.9 },
  { m: "May", rev: 15.8, profit: 5.9, orders: 754, margin: 37.3 },
  { m: "Jun", rev: 14.3, profit: 5.4, orders: 1002, margin: 37.8 },
  { m: "Jul", rev: 10.6, profit: 3.9, orders: 452, margin: 36.8 },
  { m: "Aug", rev: 9.8, profit: 3.7, orders: 452, margin: 37.8 },
  { m: "Sep", rev: 8.7, profit: 3.2, orders: 358, margin: 36.8 },
  { m: "Oct", rev: 8.9, profit: 3.4, orders: 280, margin: 38.2 },
  { m: "Nov", rev: 9.1, profit: 3.4, orders: 138, margin: 37.4 },
  { m: "Dec", rev: 9.3, profit: 3.5, orders: 148, margin: 37.6 },
];

const PRODUCTS = [
  {
    sku: "RD-ELITE",
    name: "Elite Road Bike",
    cat: "Road Bikes",
    rev: 21.4,
    profit: 9.7,
    units: 1820,
    margin: 45.3,
  },
  {
    sku: "EBIKE-S1",
    name: "E-Bike Series 1",
    cat: "E-Bikes",
    rev: 18.2,
    profit: 7.1,
    units: 1240,
    margin: 39.0,
  },
  {
    sku: "GRVL-EXP",
    name: "Gravel Explorer",
    cat: "Gravel Bikes",
    rev: 15.6,
    profit: 5.6,
    units: 1980,
    margin: 35.9,
  },
  {
    sku: "FRAME-CF",
    name: "Carbon Fiber Frame",
    cat: "Frames",
    rev: 12.8,
    profit: 4.0,
    units: 890,
    margin: 31.3,
  },
  {
    sku: "WHEEL-SET",
    name: "Pro Wheelset",
    cat: "Components",
    rev: 10.3,
    profit: 3.5,
    units: 3100,
    margin: 34.0,
  },
  {
    sku: "HANDLEBARS",
    name: "Adjustable Handlebars",
    cat: "Components",
    rev: 8.9,
    profit: 3.6,
    units: 4200,
    margin: 40.4,
  },
  {
    sku: "ORBT-PRO",
    name: "Orbit Pro MTB",
    cat: "Mountain Bikes",
    rev: 14.1,
    profit: 5.5,
    units: 1560,
    margin: 39.0,
  },
  {
    sku: "TOURING-X",
    name: "Touring Xcel",
    cat: "Touring",
    rev: 7.2,
    profit: 2.6,
    units: 720,
    margin: 36.1,
  },
];

const AR_AGING = [
  { bucket: "Current", count: 1166, pct: 23.3, color: T.green },
  { bucket: "1–30 Days", count: 2222, pct: 44.4, color: T.yellow },
  { bucket: "31–60 Days", count: 406, pct: 8.1, color: T.orange },
  { bucket: "61–90 Days", count: 206, pct: 4.1, color: "#ff6b35" },
  { bucket: "90+ Days", count: 1000, pct: 20.0, color: T.red },
];

const FLAGS = [
  { flag: "Late Payment", count: 3834, pct: 76.7, color: T.red },
  { flag: "Off-Hours Txn", count: 2549, pct: 51.0, color: T.orange },
  { flag: "SOD Violation", count: 263, pct: 5.3, color: T.purple },
  { flag: "Over Credit Limit", count: 237, pct: 4.7, color: T.yellow },
  { flag: "Threshold Avoid.", count: 155, pct: 3.1, color: "#ff6b35" },
];

const FLAG_COMBOS = [
  { combo: "Late + Off-Hours", count: 1689, color: T.red },
  { combo: "Late Only", count: 1639, color: T.orange },
  { combo: "Off-Hours Only", count: 537, color: T.yellow },
  { combo: "Late + Over Credit + Off-Hours", count: 111, color: T.purple },
  { combo: "Late + SOD Violation", count: 101, color: T.red },
  { combo: "Late + Over Credit Limit", count: 86, color: "#ff6b35" },
  { combo: "Late + SOD + Off-Hours", count: 82, color: T.purple },
  { combo: "Late + Threshold + Off-Hours", count: 51, color: T.red },
  { combo: "SOD Violation Only", count: 32, color: T.purple },
  { combo: "Threshold Avoid. + Off-Hours", count: 21, color: T.orange },
];

const THRESHOLD_DETAIL = [
  { threshold: "$10,000", count: 34, range: "$9,700–$9,999" },
  { threshold: "$25,000", count: 39, range: "$24,250–$24,999" },
  { threshold: "$50,000", count: 40, range: "$48,500–$49,999" },
  { threshold: "$100,000", count: 42, range: "$97,000–$99,999" },
];

const PAY_DIST = [
  { d: -5, n: 3 },
  { d: -4, n: 6 },
  { d: -3, n: 74 },
  { d: -2, n: 265 },
  { d: -1, n: 250 },
  { d: 0, n: 166 },
  { d: 1, n: 173 },
  { d: 2, n: 263 },
  { d: 3, n: 195 },
  { d: 4, n: 193 },
  { d: 5, n: 65 },
  { d: 6, n: 71 },
  { d: 7, n: 52 },
  { d: 8, n: 54 },
  { d: 9, n: 72 },
  { d: 10, n: 61 },
  { d: 11, n: 69 },
  { d: 12, n: 58 },
  { d: 13, n: 68 },
  { d: 14, n: 61 },
  { d: 20, n: 2 },
  { d: 30, n: 4 },
  { d: 60, n: 8 },
  { d: 90, n: 12 },
  { d: 120, n: 18 },
  { d: 180, n: 42 },
  { d: 240, n: 15 },
];

const fm = (n, d = 1) =>
  n >= 1e6
    ? `$${(n / 1e6).toFixed(d)}M`
    : n >= 1e3
      ? `$${(n / 1e3).toFixed(0)}K`
      : `$${n}`;
const riskColor = (r) =>
  r === "HIGH" ? T.red : r === "MEDIUM" ? T.yellow : T.green;
const segColor = (s) =>
  s === "ENTERPRISE" ? T.purple : s === "MID-MARKET" ? T.accent : T.text1;
const marginColor = (m) => (m >= 42 ? T.green : m >= 37 ? T.yellow : T.red);

const Pill = ({ children, color }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 4,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      background: `${color}18`,
      color,
      border: `1px solid ${color}40`,
    }}
  >
    {children}
  </span>
);

const KpiCard = ({ label, value, sub, color = T.accent, delta }) => (
  <div
    style={{
      background: T.bg2,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      padding: "16px 18px",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg,${color}00,${color},${color}00)`,
      }}
    />
    <div
      style={{
        fontSize: 10,
        letterSpacing: "0.15em",
        color: T.text1,
        textTransform: "uppercase",
        marginBottom: 8,
        lineHeight: 1.4,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 22,
        fontWeight: 700,
        color,
        letterSpacing: "-0.5px",
        lineHeight: 1.2,
        wordBreak: "break-word",
      }}
    >
      {value}
    </div>
    {sub && (
      <div
        style={{ fontSize: 11, color: T.text1, marginTop: 6, lineHeight: 1.5 }}
      >
        {sub}
      </div>
    )}
    {delta !== undefined && (
      <div
        style={{
          fontSize: 11,
          color: delta >= 0 ? T.green : T.red,
          marginTop: 4,
        }}
      >
        {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs prev
      </div>
    )}
  </div>
);

const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 10,
      letterSpacing: "0.2em",
      color: T.text1,
      textTransform: "uppercase",
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    <div
      style={{ width: 16, height: 1, background: T.border2, flexShrink: 0 }}
    />
    {children}
    <div style={{ flex: 1, height: 1, background: T.border }} />
  </div>
);

const Panel = ({ children, style = {} }) => (
  <div
    style={{
      background: T.bg2,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      padding: 20,
      ...style,
    }}
  >
    {children}
  </div>
);

const CustomTooltip = ({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}) => {
  if (!active || !payload?.length) return null;
  const displayLabel = labelFormatter ? labelFormatter(label) : label;
  return (
    <div
      style={{
        background: T.bg3,
        border: `1px solid ${T.border2}`,
        borderRadius: 6,
        padding: "10px 14px",
        fontSize: 12,
        fontFamily: T.font,
      }}
    >
      {displayLabel != null && (
        <div style={{ color: T.text1, marginBottom: 6, fontSize: 11 }}>
          {displayLabel}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || T.text0, marginBottom: 2 }}>
          {p.name}:{" "}
          <span style={{ fontWeight: 700 }}>
            {formatter ? formatter(p.value, p.name) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── AI PROGRESS INDICATOR ─────────────────────────────────────────────────────
const AI_STAGES = [
  { label: "Parsing query…", pct: 10, dur: 400 },
  { label: "Loading financial data…", pct: 28, dur: 700 },
  { label: "Running analysis…", pct: 52, dur: 900 },
  { label: "Generating insights…", pct: 76, dur: 650 },
  { label: "Formatting response…", pct: 93, dur: 400 },
];

function AiProgressBar({ stage, pct }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 10,
        background: T.bg2,
        border: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.accent,
              boxShadow: `0 0 10px ${T.accent}`,
              animation: "aipulse 1.1s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 12, color: T.text1, fontFamily: T.font }}>
            {stage}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.accent }}>
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: T.border,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 2,
            background: `linear-gradient(90deg,${T.accent},${T.purple})`,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: `0 0 12px ${T.accent}60`,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        {AI_STAGES.map((s, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: pct >= s.pct ? T.accent : T.border2,
              transition: "background 0.3s",
              boxShadow: pct >= s.pct ? `0 0 6px ${T.accent}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const QUICK_PROMPTS = [
  "Which customers are highest collection risk?",
  "What's our biggest audit exposure?",
  "Where should we focus margin improvement?",
  "Summarize payment behavior patterns",
];

const TABS = [
  "Overview",
  "Customers",
  "Products",
  "AR & Payments",
  "Audit Flags",
  "AI Analyst",
];

export default function App() {
  const [tab, setTab] = useState("Overview");
  const [selCust, setSelCust] = useState(null);
  const [custSearch, setCustSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [chatMsgs, setChatMsgs] = useState([
    {
      role: "assistant",
      content:
        "Analyst ready. Ask me anything about TechFlow's FY 2023 financials, payment risk, or audit flags.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [aiStage, setAiStage] = useState("");
  const [aiPct, setAiPct] = useState(0);
  const chatRef = useRef(null);
  const chatInputRef = useRef(null);
  const timerRefs = useRef([]);
  // Responsive breakpoint — mirrors V1 approach
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMsgs, chatLoading]);

  const runStages = useCallback(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
    let elapsed = 0;
    AI_STAGES.forEach((s) => {
      const t = setTimeout(() => {
        setAiStage(s.label);
        setAiPct(s.pct);
      }, elapsed);
      timerRefs.current.push(t);
      elapsed += s.dur;
    });
  }, []);

  const sendChat = async (text) => {
    const q = (text || chatInput).trim();
    if (!q || chatLoading) return;

    setChatInput("");
    if (chatInputRef.current) chatInputRef.current.style.height = "42px";
    setChatMsgs((prev) => [...prev, { role: "user", content: q }]);
    setChatLoading(true);
    setAiPct(5);
    setAiStage("Analyzing data...");
    runStages();

    try {
      const res = await fetch(window.location.origin + "/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "techflow-2023",
          userInput: q,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const error = new Error(data.error || "The AI service could not complete the request.");
        error.status = res.status;
        throw error;
      }

      let finalReply = String(data.text || "").trim();
      if (!finalReply) {
        throw new Error("The AI service did not produce a response. Please try rephrasing your question.");
      }
      if (data.truncated) {
        finalReply +=
          "\n\nThis response reached its length limit. Ask for a specific section if you would like more detail.";
      }

      timerRefs.current.forEach(clearTimeout);
      setAiPct(100);
      setAiStage("Done");

      await new Promise((r) => setTimeout(r, 400));

      setChatMsgs((prev) => [
        ...prev,
        { role: "assistant", content: String(finalReply).trim() },
      ]);
    } catch (err) {
      console.error("V2 AI error:", err);
      timerRefs.current.forEach(clearTimeout);
      setChatMsgs((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err.status === 429
              ? err.message
              : err.message || "The AI service is temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
      setAiPct(0);
      setAiStage("");
    }
  };

  const filteredCustomers = useMemo(
    () =>
      CUSTOMERS.filter(
        (c) =>
          (riskFilter === "ALL" || c.risk === riskFilter) &&
          (c.name.toLowerCase().includes(custSearch.toLowerCase()) ||
            c.city.toLowerCase().includes(custSearch.toLowerCase())),
      ).sort((a, b) => b.revenue - a.revenue),
    [riskFilter, custSearch],
  );

  return (
    <div
      style={{
        fontFamily: T.font,
        background: T.bg0,
        minHeight: "100vh", // minHeight instead of height so content can grow on mobile
        width: "100%",
        color: T.text0,
        overflowX: "hidden", // IMPORTANT: prevents horizontal scroll on mobile
        overflowY: "auto",
      }}
    >
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${T.border2};border-radius:2px}
      `}</style>

      {/* ── TOPBAR ── */}
      {/* Desktop: [logo] [tabs] [back+verified] in one row (flex row, space-between) */}
      {/* Mobile: [logo | back] on top row, [tabs] on second row (flex column) */}
      <div
        className="glass-header"
        style={{
          padding: isMobile ? "0 16px" : "0 28px",
          minHeight: 64,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* On desktop this is just the logo section (left side).
            On mobile it becomes the full top row containing logo + back button. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // pushes back button to right on mobile
            flexShrink: 0,
            minHeight: isMobile ? 52 : "auto",
          }}
        >
          {/* Logo + title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: isMobile ? "0" : "12px 0",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                flexShrink: 0,
                background: `linear-gradient(135deg,${T.accent},${T.purple})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 900,
                color: "#000",
              }}
            >
              TF
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.text0,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                TechFlow NexCore
              </div>
              {/* Subtitle hidden on mobile to save space */}
              {!isMobile && (
                <div
                  style={{
                    fontSize: 12,
                    color: T.text1,
                    letterSpacing: "0.12em",
                    whiteSpace: "nowrap",
                  }}
                >
                  FY 2023 · ORDER-TO-CASH ANALYTICS
                </div>
              )}
            </div>
          </div>

          {/* BACK BUTTON — shown inline with logo on mobile only.
              On desktop this is hidden here; the real one is in the right section below. */}
          {isMobile && (
            <a
              href="https://society-for-ai-in-enterprise-systems.vercel.app/index.html#projects"
              style={{
                textDecoration: "none",
                color: T.accent,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: T.font,
                letterSpacing: "0.05em",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = 0.7)}
              onMouseLeave={(e) => (e.target.style.opacity = 1)}
            >
              ← BACK
            </a>
          )}
        </div>

        {/* ── TAB STRIP ── center on desktop, second row on mobile ── */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 0,
            flex: isMobile ? "none" : 1,
            overflowX: "auto",
            scrollbarWidth: "none",
            marginLeft: isMobile ? 0 : "40px",
            // Thin separator between logo row and tabs on mobile
            borderTop: isMobile ? `1px solid ${T.border}` : "none",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: isMobile ? "10px 10px" : "0 10px",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${tab === t ? T.accent : "transparent"}`,
                color: tab === t ? T.accent : T.text1,
                fontSize: isMobile ? 10 : 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: T.font,
                cursor: "pointer",
                fontWeight: tab === t ? 700 : 400,
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── RIGHT SECTION — desktop only: back button + verified indicator ── */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 4,
              flexShrink: 0,
              paddingLeft: 8,
            }}
          >
            {/* BACK BUTTON (Top Row) */}
            <a
              href="https://society-for-ai-in-enterprise-systems.vercel.app/index.html#projects"
              style={{
                textDecoration: "none",
                color: T.accent,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: T.font,
                letterSpacing: "0.05em",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = 0.7)}
              onMouseLeave={(e) => (e.target.style.opacity = 1)}
            >
              ← BACK TO PROJECTS
            </a>

            {/* VERIFIED INDICATOR */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: T.text1,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: T.green,
                  boxShadow: `0 0 8px ${T.green}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ whiteSpace: "nowrap" }}>VERIFIED · 5,000 TXN</span>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          padding: isMobile ? "16px" : "24px 28px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* ══ OVERVIEW ══ */}
        {tab === "Overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <SectionLabel>Portfolio Summary · FY 2023</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2,1fr)"
                  : "repeat(5,1fr)",
                gap: 12,
              }}
            >
              <KpiCard
                label="Total Revenue"
                value="$128.5M"
                sub="23 B2B customers"
                color={T.accent}
              />
              <KpiCard
                label="Gross Profit"
                value="$50.8M"
                sub="37.4% blended margin"
                color={T.green}
              />
              <KpiCard
                label="Total COGS"
                value="$77.6M"
                sub="Verified exact match"
                color={T.text1}
              />
              <KpiCard
                label="Active Customers"
                value="23"
                sub="US + Germany"
                color={T.purple}
              />
              <KpiCard
                label="Transactions"
                value="5,000"
                sub="89.6% flagged"
                color={T.yellow}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
                gap: 16,
              }}
            >
              <Panel>
                <SectionLabel>Monthly Revenue & Profit ($M)</SectionLabel>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart
                    data={MONTHLY}
                    margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                  >
                    <defs>
                      <linearGradient id="gRev2" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={T.accent}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={T.accent}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="gProfit2" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={T.green}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={T.green}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke={T.border}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="m"
                      tick={{ fill: T.text1, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: T.text1, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}M`}
                      width={40}
                    />
                    <Tooltip
                      content={<CustomTooltip formatter={(v) => `$${v}M`} />}
                    />
                    <Area
                      dataKey="rev"
                      name="Revenue"
                      stroke={T.accent}
                      strokeWidth={2}
                      fill="url(#gRev2)"
                    />
                    <Area
                      dataKey="profit"
                      name="Profit"
                      stroke={T.green}
                      strokeWidth={2}
                      fill="url(#gProfit2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Panel>
              <Panel>
                <SectionLabel>AR Aging Buckets</SectionLabel>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginTop: 4,
                  }}
                >
                  {AR_AGING.map((a) => (
                    <div key={a.bucket}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 11,
                          marginBottom: 4,
                        }}
                      >
                        <span style={{ color: T.text1 }}>{a.bucket}</span>
                        <span style={{ color: a.color, fontWeight: 700 }}>
                          {a.count.toLocaleString()}{" "}
                          <span style={{ color: T.text1, fontWeight: 400 }}>
                            ({a.pct}%)
                          </span>
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: T.bg3,
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${a.pct * 2}%`,
                            background: a.color,
                            borderRadius: 3,
                            transition: "width 0.8s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    padding: "10px 12px",
                    background: T.bg3,
                    borderRadius: 6,
                    border: `1px solid ${T.red}30`,
                  }}
                >
                  <div
                    style={{ fontSize: 10, color: T.text1, marginBottom: 4 }}
                  >
                    CRITICAL EXPOSURE
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: T.red }}>
                    20.0%
                  </div>
                  <div style={{ fontSize: 11, color: T.text1 }}>
                    1,000 invoices 90+ days overdue
                  </div>
                </div>
              </Panel>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 16,
              }}
            >
              <Panel>
                <SectionLabel>Revenue by Product ($M)</SectionLabel>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[...PRODUCTS].sort((a, b) => b.rev - a.rev)}
                    layout="vertical"
                    margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fill: T.text1, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}M`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: T.text1, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={130}
                    />
                    <Tooltip
                      content={<CustomTooltip formatter={(v) => `$${v}M`} />}
                    />
                    <Bar dataKey="rev" name="Revenue" radius={[0, 4, 4, 0]}>
                      {[...PRODUCTS]
                        .sort((a, b) => b.rev - a.rev)
                        .map((p, i) => (
                          <Cell key={i} fill={i === 0 ? T.accent : T.border2} />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
              <Panel>
                <SectionLabel>Audit Flag Distribution</SectionLabel>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {FLAGS.map((f) => (
                    <div
                      key={f.flag}
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 3,
                          height: 36,
                          background: f.color,
                          borderRadius: 2,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          }}
                        >
                          <span style={{ fontSize: 12, color: T.text0 }}>
                            {f.flag}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: f.color,
                            }}
                          >
                            {f.count.toLocaleString()}
                          </span>
                        </div>
                        <div
                          style={{
                            height: 4,
                            background: T.bg3,
                            borderRadius: 2,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${f.pct}%`,
                              background: f.color,
                              borderRadius: 2,
                              opacity: 0.7,
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.text1,
                          width: 36,
                          textAlign: "right",
                        }}
                      >
                        {f.pct}%
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* ══ CUSTOMERS ══ */}
        {tab === "Customers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel>Customer Master · 23 Accounts</SectionLabel>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
              }}
            >
              <input
                value={custSearch}
                onChange={(e) => setCustSearch(e.target.value)}
                placeholder="Search customer or city…"
                style={{
                  flex: 1,
                  minWidth: isMobile ? "100%" : "auto", // full width on mobile so buttons wrap below
                  maxWidth: 300,
                  background: T.bg2,
                  border: `1px solid ${T.border2}`,
                  borderRadius: 6,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: T.text0,
                  fontFamily: T.font,
                  outline: "none",
                }}
              />
              {["ALL", "HIGH", "MEDIUM", "LOW"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: T.font,
                    border: `1px solid ${riskFilter === r ? (r === "ALL" ? T.accent : riskColor(r)) : T.border}`,
                    background:
                      riskFilter === r
                        ? r === "ALL"
                          ? `${T.accent}15`
                          : `${riskColor(r)}15`
                        : T.bg2,
                    color:
                      riskFilter === r
                        ? r === "ALL"
                          ? T.accent
                          : riskColor(r)
                        : T.text1,
                    cursor: "pointer",
                    letterSpacing: "0.08em",
                    fontWeight: riskFilter === r ? 700 : 400,
                  }}
                >
                  {r}
                </button>
              ))}
              <div style={{ fontSize: 11, color: T.text1, marginLeft: "auto" }}>
                {filteredCustomers.length} customers
              </div>
            </div>
            <Panel style={{ padding: 0, overflow: "hidden" }}>
              {/* Horizontal scroll on mobile so all columns remain accessible */}
              <div
                style={{
                  overflowX: isMobile ? "auto" : "visible",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    minWidth: isMobile ? 640 : "auto", // ensures columns don't squish below readable size
                    borderCollapse: "collapse",
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr style={{ background: T.bg3 }}>
                      {[
                        "Customer",
                        "Segment",
                        "Location",
                        "Revenue",
                        "Txns",
                        "Avg Days",
                        "Late %",
                        "Credit",
                        "Risk",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 14px",
                            textAlign: "left",
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            color: T.text1,
                            textTransform: "uppercase",
                            borderBottom: `1px solid ${T.border}`,
                            fontWeight: 400,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c, i) => (
                      <tr
                        key={c.id}
                        onClick={() =>
                          setSelCust(selCust?.id === c.id ? null : c)
                        }
                        style={{
                          background:
                            selCust?.id === c.id
                              ? `${T.accent}08`
                              : i % 2 === 0
                                ? T.bg2
                                : T.bg1,
                          borderLeft: `3px solid ${selCust?.id === c.id ? T.accent : "transparent"}`,
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                      >
                        <td
                          style={{
                            padding: "11px 14px",
                            color: T.text0,
                            fontWeight: 600,
                          }}
                        >
                          {c.name}
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <Pill color={segColor(c.seg)}>{c.seg}</Pill>
                        </td>
                        <td style={{ padding: "11px 14px", color: T.text1 }}>
                          {c.country} · {c.city}
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            color: T.accent,
                            fontWeight: 700,
                          }}
                        >
                          {fm(c.revenue)}
                        </td>
                        <td style={{ padding: "11px 14px", color: T.text1 }}>
                          {c.txns}
                        </td>
                        <td
                          style={{
                            padding: "11px 14px",
                            color:
                              c.avgDays > 100
                                ? T.red
                                : c.avgDays > 50
                                  ? T.yellow
                                  : T.green,
                            fontWeight: 700,
                          }}
                        >
                          {c.avgDays}d
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                maxWidth: 60,
                                height: 4,
                                background: T.bg3,
                                borderRadius: 2,
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${c.latePct}%`,
                                  background:
                                    c.latePct === 100
                                      ? T.red
                                      : c.latePct > 70
                                        ? T.yellow
                                        : T.green,
                                  borderRadius: 2,
                                }}
                              />
                            </div>
                            <span
                              style={{
                                color:
                                  c.latePct === 100
                                    ? T.red
                                    : c.latePct > 70
                                      ? T.yellow
                                      : T.green,
                                fontWeight: 700,
                              }}
                            >
                              {c.latePct}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "11px 14px", color: T.text1 }}>
                          ${(c.credit / 1000).toFixed(0)}K
                        </td>
                        <td style={{ padding: "11px 14px" }}>
                          <Pill color={riskColor(c.risk)}>{c.risk}</Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* end horizontal scroll wrapper */}
            </Panel>
            {selCust && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                <Panel style={{ gridColumn: isMobile ? "1" : "1/3" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: T.text0,
                        }}
                      >
                        {selCust.name}
                      </div>
                      <div
                        style={{ fontSize: 11, color: T.text1, marginTop: 2 }}
                      >
                        {selCust.city}, {selCust.country} · {selCust.seg} ·{" "}
                        {selCust.terms}
                      </div>
                    </div>
                    <Pill color={riskColor(selCust.risk)}>
                      {selCust.risk} RISK
                    </Pill>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "repeat(2,1fr)"
                        : "repeat(4,1fr)",
                      gap: 12,
                    }}
                  >
                    {[
                      {
                        l: "Total Revenue",
                        v: fm(selCust.revenue),
                        c: T.accent,
                      },
                      { l: "Transactions", v: selCust.txns, c: T.text0 },
                      {
                        l: "Avg Days to Pay",
                        v: `${selCust.avgDays}d`,
                        c: selCust.avgDays > 100 ? T.red : T.text0,
                      },
                      {
                        l: "Late Payment %",
                        v: `${selCust.latePct}%`,
                        c: selCust.latePct === 100 ? T.red : T.yellow,
                      },
                    ].map(({ l, v, c }) => (
                      <div
                        key={l}
                        style={{
                          background: T.bg3,
                          borderRadius: 6,
                          padding: "12px 14px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            color: T.text1,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            marginBottom: 6,
                          }}
                        >
                          {l}
                        </div>
                        <div
                          style={{ fontSize: 20, fontWeight: 700, color: c }}
                        >
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel>
                  <div
                    style={{
                      fontSize: 10,
                      color: T.text1,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    Credit Profile
                  </div>
                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div
                      style={{ fontSize: 11, color: T.text1, marginBottom: 4 }}
                    >
                      Credit Limit
                    </div>
                    <div
                      style={{ fontSize: 28, fontWeight: 700, color: T.accent }}
                    >
                      {fm(selCust.credit)}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      marginTop: 10,
                    }}
                  >
                    <span style={{ color: T.text1 }}>Terms</span>
                    <span style={{ color: T.text0, fontWeight: 600 }}>
                      {selCust.terms}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      marginTop: 10,
                    }}
                  >
                    <span style={{ color: T.text1 }}>Segment</span>
                    <Pill color={segColor(selCust.seg)}>{selCust.seg}</Pill>
                  </div>
                </Panel>
              </div>
            )}
          </div>
        )}

        {/* ══ PRODUCTS ══ */}
        {tab === "Products" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel>Product Performance · 8 SKUs</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 16,
              }}
            >
              <Panel>
                <SectionLabel>
                  Margin vs Revenue (bubble = unit volume)
                </SectionLabel>
                <ResponsiveContainer width="100%" height={240}>
                  <ScatterChart
                    margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
                  >
                    <CartesianGrid stroke={T.border} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="rev"
                      type="number"
                      name="Revenue"
                      tick={{ fill: T.text1, fontSize: 10 }}
                      tickFormatter={(v) => `$${v}M`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="margin"
                      type="number"
                      name="Margin"
                      tick={{ fill: T.text1, fontSize: 10 }}
                      tickFormatter={(v) => `${v}%`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ZAxis dataKey="units" range={[60, 400]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3", stroke: T.border2 }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div
                            style={{
                              background: T.bg3,
                              border: `1px solid ${T.border2}`,
                              borderRadius: 6,
                              padding: "10px 14px",
                              fontSize: 12,
                              fontFamily: T.font,
                            }}
                          >
                            <div
                              style={{
                                color: T.text0,
                                fontWeight: 700,
                                marginBottom: 4,
                              }}
                            >
                              {d.name}
                            </div>
                            <div style={{ color: T.text1 }}>
                              Revenue:{" "}
                              <span style={{ color: T.accent }}>${d.rev}M</span>
                            </div>
                            <div style={{ color: T.text1 }}>
                              Margin:{" "}
                              <span style={{ color: T.green }}>
                                {d.margin}%
                              </span>
                            </div>
                            <div style={{ color: T.text1 }}>
                              Units:{" "}
                              <span style={{ color: T.text0 }}>
                                {d.units.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Scatter
                      data={PRODUCTS}
                      fill={T.accent}
                      fillOpacity={0.85}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Panel>
              <Panel>
                <SectionLabel>Gross Margin % by Product</SectionLabel>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={[...PRODUCTS].sort((a, b) => b.margin - a.margin)}
                    layout="vertical"
                    margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fill: T.text1, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 55]}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: T.text1, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={130}
                    />
                    <ReferenceLine
                      x={37.4}
                      stroke={T.yellow}
                      strokeDasharray="4 2"
                      label={{
                        value: "avg 37.4%",
                        position: "top",
                        fill: T.yellow,
                        fontSize: 9,
                      }}
                    />
                    <Tooltip
                      content={<CustomTooltip formatter={(v) => `${v}%`} />}
                    />
                    <Bar dataKey="margin" name="Margin" radius={[0, 4, 4, 0]}>
                      {[...PRODUCTS]
                        .sort((a, b) => b.margin - a.margin)
                        .map((p, i) => (
                          <Cell key={i} fill={marginColor(p.margin)} />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2,1fr)"
                  : "repeat(4,1fr)",
                gap: 12,
              }}
            >
              {[...PRODUCTS]
                .sort((a, b) => b.rev - a.rev)
                .map((p) => (
                  <Panel key={p.sku} style={{ padding: 16 }}>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.accent,
                        letterSpacing: "0.1em",
                        marginBottom: 4,
                      }}
                    >
                      {p.sku}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.text0,
                        marginBottom: 2,
                        lineHeight: 1.3,
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{ fontSize: 10, color: T.text1, marginBottom: 12 }}
                    >
                      {p.cat}
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                      }}
                    >
                      {[
                        { l: "Revenue", v: `$${p.rev}M`, c: T.accent },
                        { l: "Profit", v: `$${p.profit}M`, c: T.green },
                        { l: "Units", v: p.units.toLocaleString(), c: T.text0 },
                        {
                          l: "Margin",
                          v: `${p.margin}%`,
                          c: marginColor(p.margin),
                        },
                      ].map(({ l, v, c }) => (
                        <div key={l}>
                          <div
                            style={{
                              fontSize: 9,
                              color: T.text1,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              marginBottom: 2,
                            }}
                          >
                            {l}
                          </div>
                          <div
                            style={{ fontSize: 14, fontWeight: 700, color: c }}
                          >
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        marginTop: 12,
                        height: 4,
                        background: T.bg3,
                        borderRadius: 2,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${p.margin * 2}%`,
                          background: marginColor(p.margin),
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </Panel>
                ))}
            </div>
          </div>
        )}

        {/* ══ AR & PAYMENTS ══ */}
        {tab === "AR & Payments" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel>Accounts Receivable & Payment Analysis</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2,1fr)"
                  : "repeat(4,1fr)",
                gap: 12,
              }}
            >
              <KpiCard
                label="Late Payments"
                value="76.7%"
                sub="3,834 of 5,000 txns"
                color={T.red}
              />
              <KpiCard
                label="Avg Days Over Terms"
                value="61.5d"
                sub="Late payers only"
                color={T.orange}
              />
              <KpiCard
                label="Max Days Over"
                value="240d"
                sub="Extreme outliers"
                color={T.red}
              />
              <KpiCard
                label="90+ Day Exposure"
                value="1,000"
                sub="Invoices at risk"
                color={T.yellow}
              />
            </div>
            <Panel>
              <SectionLabel>
                Payment Distribution — Days Over Terms
              </SectionLabel>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={PAY_DIST}
                  margin={{ top: 4, right: 4, bottom: 20, left: 0 }}
                >
                  <CartesianGrid
                    stroke={T.border}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="d"
                    tick={{ fill: T.text1, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: T.text1, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatter={(v) => `${v} invoices`}
                        labelFormatter={(d) => `${d > 0 ? "+" : ""}${d} days`}
                      />
                    }
                  />
                  <ReferenceLine x={0} stroke={T.border2} strokeWidth={2} />
                  <Bar dataKey="n" name="Invoices" radius={[2, 2, 0, 0]}>
                    {PAY_DIST.map((d) => (
                      <Cell key={d.d} fill={d.d <= 0 ? T.green : T.red} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel>
              <SectionLabel>
                High-Risk Customers — Payment Performance
              </SectionLabel>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
                  gap: 10,
                }}
              >
                {CUSTOMERS.filter((c) => c.risk === "HIGH")
                  .sort((a, b) => b.avgDays - a.avgDays)
                  .map((c) => (
                    <div
                      key={c.id}
                      style={{
                        background: T.bg3,
                        borderRadius: 8,
                        padding: "14px 16px",
                        border: `1px solid ${T.red}25`,
                        borderLeft: `3px solid ${T.red}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: T.text0,
                          marginBottom: 2,
                        }}
                      >
                        {c.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: T.text1,
                          marginBottom: 10,
                        }}
                      >
                        {c.seg} · {c.city}
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                        }}
                      >
                        {[
                          ["Avg Days", `${c.avgDays}d`],
                          ["Late %", `${c.latePct}%`],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <div
                              style={{
                                fontSize: 9,
                                color: T.text1,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginBottom: 2,
                              }}
                            >
                              {k}
                            </div>
                            <div
                              style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: T.red,
                              }}
                            >
                              {v}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 11,
                          color: T.accent,
                          fontWeight: 600,
                        }}
                      >
                        {fm(c.revenue)} revenue
                      </div>
                    </div>
                  ))}
              </div>
            </Panel>
          </div>
        )}

        {/* ══ AUDIT FLAGS ══ */}
        {tab === "Audit Flags" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SectionLabel>Audit Analytics — Forensic Signals</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2,1fr)"
                  : "repeat(5,1fr)",
                gap: 12,
              }}
            >
              {FLAGS.map((f) => (
                <KpiCard
                  key={f.flag}
                  label={f.flag}
                  value={f.count.toLocaleString()}
                  sub={`${f.pct}% of transactions`}
                  color={f.color}
                />
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 16,
              }}
            >
              <Panel>
                <SectionLabel>Flag Co-occurrence Patterns</SectionLabel>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  {FLAG_COMBOS.map((row) => (
                    <div
                      key={row.combo}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 3,
                          height: 24,
                          background: row.color,
                          borderRadius: 2,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, fontSize: 12, color: T.text1 }}>
                        {row.combo}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: row.color,
                          width: 50,
                          textAlign: "right",
                        }}
                      >
                        {row.count}
                      </div>
                      <div
                        style={{
                          width: 80,
                          height: 4,
                          background: T.bg3,
                          borderRadius: 2,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${(row.count / 1689) * 100}%`,
                            background: row.color,
                            borderRadius: 2,
                            opacity: 0.7,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel>
                <SectionLabel>Threshold Avoidance Detail</SectionLabel>
                <div
                  style={{
                    marginBottom: 12,
                    padding: "12px 14px",
                    background: T.bg3,
                    borderRadius: 6,
                    border: `1px solid ${T.orange}30`,
                  }}
                >
                  <div
                    style={{ fontSize: 11, color: T.text1, lineHeight: 1.6 }}
                  >
                    155 transactions where{" "}
                    <span style={{ color: T.orange, fontWeight: 700 }}>
                      Gross Amount ≠ Qty × Unit Price
                    </span>
                    . All amounts fall just below approval thresholds —
                    indicating intentional invoice manipulation.
                  </div>
                </div>
                {THRESHOLD_DETAIL.map((t) => (
                  <div
                    key={t.threshold}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          color: T.text0,
                          fontWeight: 600,
                        }}
                      >
                        Below {t.threshold}
                      </div>
                      <div style={{ fontSize: 10, color: T.text1 }}>
                        {t.range}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: T.orange,
                        }}
                      >
                        {t.count}
                      </div>
                      <div style={{ fontSize: 10, color: T.text1 }}>
                        transactions
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 20 }}>
                  <SectionLabel>SOD Violations</SectionLabel>
                  <div
                    style={{
                      padding: "12px 14px",
                      background: T.bg3,
                      borderRadius: 6,
                      border: `1px solid ${T.purple}30`,
                    }}
                  >
                    <div
                      style={{ fontSize: 24, fontWeight: 700, color: T.purple }}
                    >
                      263
                    </div>
                    <div style={{ fontSize: 11, color: T.text1, marginTop: 4 }}>
                      transactions where Rep ID = Approver ID
                    </div>
                    <div style={{ fontSize: 10, color: T.text1, marginTop: 4 }}>
                      AS2201.15 control deficiency · 5.3% of all txns
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* ══ AI ANALYST ══ */}
        {tab === "AI Analyst" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 860,
              margin: "0 auto",
              width: "100%",
            }}
          >
            <SectionLabel>AI Analyst — Powered by Gemini</SectionLabel>
            <div
              ref={chatRef}
              style={{
                background: T.bg1,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: 20,
                height: isMobile ? 300 : 500, // Shorter on mobile to fit viewport
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {chatMsgs.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        flexShrink: 0,
                        marginRight: 10,
                        marginTop: 2,
                        background: `linear-gradient(135deg,${T.accent},${T.purple})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 900,
                        color: "#000",
                      }}
                    >
                      TF
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: "78%",
                      padding: "12px 16px",
                      borderRadius: 10,
                      fontSize: 13,
                      lineHeight: 1.7,
                      fontFamily: T.font,
                      whiteSpace: "pre-wrap",
                      background: msg.role === "user" ? `${T.accent}18` : T.bg2,
                      border: `1px solid ${msg.role === "user" ? T.accent + "40" : T.border}`,
                      color: msg.role === "user" ? T.accent : T.text0,
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    animation: "fadeIn 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      flexShrink: 0,
                      background: `linear-gradient(135deg,${T.accent},${T.purple})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    AI
                  </div>
                  <div style={{ flex: 1 }}>
                    <AiProgressBar stage={aiStage} pct={aiPct} />
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendChat(q)}
                  disabled={chatLoading}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontFamily: T.font,
                    border: `1px solid ${T.border2}`,
                    background: T.bg2,
                    color: T.text1,
                    cursor: chatLoading ? "not-allowed" : "pointer",
                    letterSpacing: "0.05em",
                    opacity: chatLoading ? 0.5 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={chatInputRef}
                rows={1}
                maxLength={12000}
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendChat();
                  }
                }}
                disabled={chatLoading}
                placeholder="Ask anything about the FY 2023 data…"
                aria-label="Ask the TechFlow 2023 AI analyst"
                style={{
                  flex: 1,
                  height: 42,
                  minHeight: 42,
                  maxHeight: 112,
                  background: T.bg2,
                  border: `1px solid ${T.border2}`,
                  borderRadius: 8,
                  padding: "12px 16px",
                  fontSize: 13,
                  color: T.text0,
                  fontFamily: T.font,
                  outline: "none",
                  lineHeight: 1.45,
                  resize: "none",
                  overflowY: "auto",
                  opacity: chatLoading ? 0.6 : 1,
                }}
              />
              <button
                onClick={() => sendChat()}
                disabled={chatLoading}
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  background: chatLoading
                    ? T.bg3
                    : `linear-gradient(135deg,${T.accent},${T.purple})`,
                  color: chatLoading ? T.text2 : "#000",
                  border: "none",
                  fontSize: 12,
                  fontFamily: T.font,
                  fontWeight: 700,
                  cursor: chatLoading ? "not-allowed" : "pointer",
                  letterSpacing: "0.08em",
                  transition: "all 0.2s",
                }}
              >
                SEND
              </button>
            </div>
            <div
              style={{
                fontSize: 9,
                lineHeight: 1.5,
                color: T.text2,
                letterSpacing: "0.04em",
              }}
            >
              Enter sends. Shift+Enter adds a new line. Do not submit confidential,
              personal, or sensitive business information.
            </div>
          </div>
        )}
        {/* FOOTER */}
        <footer
          style={{
            marginTop: "48px",
            padding: "24px 0",
            borderTop: `1px solid ${"#1f2937"}`,
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "12px",
            fontFamily: T.font,
            letterSpacing: "0.05em",
          }}
        >
          A project by Lizzie Reyes — Society for AI in Enterprise Systems · Cal
          State LA
        </footer>
      </div>
    </div>
  );
}
