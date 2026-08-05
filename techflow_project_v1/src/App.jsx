import { useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg: "#07080f",
  surface: "#0d1117",
  card: "#111827",
  border: "#1f2937",
  border2: "#374151",
  indigo: "#6366f1",
  green: "#4ade80",
  amber: "#fbbf24",
  red: "#f87171",
  purple: "#a78bfa",
  sky: "#38bdf8",
  text: "#f1f5f9",
  muted: "#94a3b8",
  dim: "#475569",
  font: "'DM Mono', 'Courier New', monospace",
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const CUSTOMERS = [
  {
    customer_id: 1000,
    customer_name: "Rocky Mountain Bikes",
    city: "Denver",
    country: "US",
    segment: "MID-MARKET",
    lifetime_revenue: 2864204.71,
    total_orders: 98,
    avg_days_from_due: 3.6,
    pct_late: 68.4,
    total_paid: 2778279,
  },
  {
    customer_id: 2000,
    customer_name: "Big Apple Bikes",
    city: "New York City",
    country: "US",
    segment: "MID-MARKET",
    lifetime_revenue: 2618940.74,
    total_orders: 110,
    avg_days_from_due: 3.7,
    pct_late: 66.4,
    total_paid: 2540372,
  },
  {
    customer_id: 3000,
    customer_name: "Philly Bikes",
    city: "Philadelphia",
    country: "US",
    segment: "MID-MARKET",
    lifetime_revenue: 2514893.89,
    total_orders: 90,
    avg_days_from_due: 3.0,
    pct_late: 67.8,
    total_paid: 2439447,
  },
  {
    customer_id: 4000,
    customer_name: "Peachtree Bikes",
    city: "Atlanta",
    country: "US",
    segment: "MID-MARKET",
    lifetime_revenue: 2183079.9,
    total_orders: 90,
    avg_days_from_due: 3.7,
    pct_late: 66.7,
    total_paid: 2117587,
  },
  {
    customer_id: 5000,
    customer_name: "Beantown Bikes",
    city: "Boston",
    country: "US",
    segment: "MID-MARKET",
    lifetime_revenue: 4068594.72,
    total_orders: 173,
    avg_days_from_due: 3.6,
    pct_late: 68.2,
    total_paid: 3865165,
  },
  {
    customer_id: 6000,
    customer_name: "Windy City Bikes",
    city: "Chicago",
    country: "US",
    segment: "MID-MARKET",
    lifetime_revenue: 1937295.57,
    total_orders: 91,
    avg_days_from_due: 4.1,
    pct_late: 75.8,
    total_paid: 1879177,
  },
  {
    customer_id: 7000,
    customer_name: "Furniture City Bikes",
    city: "Grand Rapids",
    country: "US",
    segment: "SMB",
    lifetime_revenue: 804865.81,
    total_orders: 39,
    avg_days_from_due: 10.7,
    pct_late: 87.2,
    total_paid: 804866,
  },
  {
    customer_id: 8000,
    customer_name: "Motown Bikes",
    city: "Detroit",
    country: "US",
    segment: "MID-MARKET",
    lifetime_revenue: 2776177.83,
    total_orders: 96,
    avg_days_from_due: 3.4,
    pct_late: 68.8,
    total_paid: 2692892,
  },
  {
    customer_id: 9000,
    customer_name: "SoCal Bikes",
    city: "Irvine",
    country: "US",
    segment: "MID-MARKET",
    lifetime_revenue: 2282181.38,
    total_orders: 87,
    avg_days_from_due: 3.6,
    pct_late: 65.5,
    total_paid: 2213716,
  },
  {
    customer_id: 11000,
    customer_name: "DC Bikes",
    city: "Washington DC",
    country: "US",
    segment: "MID-MARKET",
    lifetime_revenue: 1604025.95,
    total_orders: 72,
    avg_days_from_due: 3.3,
    pct_late: 68.1,
    total_paid: 1555905,
  },
  {
    customer_id: 12000,
    customer_name: "Northwest Bikes",
    city: "Seattle",
    country: "US",
    segment: "MID-MARKET",
    lifetime_revenue: 2279314.35,
    total_orders: 95,
    avg_days_from_due: 3.3,
    pct_late: 68.4,
    total_paid: 2210935,
  },
  {
    customer_id: 13000,
    customer_name: "Airport Bikes",
    city: "Frankfurt",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 1917788.6,
    total_orders: 73,
    avg_days_from_due: 3.1,
    pct_late: 68.5,
    total_paid: 1860255,
  },
  {
    customer_id: 14000,
    customer_name: "Alster Cycling",
    city: "Hamburg",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 2724198.66,
    total_orders: 101,
    avg_days_from_due: 4.5,
    pct_late: 69.3,
    total_paid: 2642473,
  },
  {
    customer_id: 15000,
    customer_name: "Bavaria Bikes",
    city: "München",
    country: "DE",
    segment: "ENTERPRISE",
    lifetime_revenue: 5483356.13,
    total_orders: 178,
    avg_days_from_due: -0.5,
    pct_late: 26.4,
    total_paid: 5209188,
  },
  {
    customer_id: 16000,
    customer_name: "Capital Bikes",
    city: "Berlin",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 4114288.73,
    total_orders: 133,
    avg_days_from_due: 3.2,
    pct_late: 69.2,
    total_paid: 3990860,
  },
  {
    customer_id: 17000,
    customer_name: "Cruiser Bikes",
    city: "Hannover",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 2899798.45,
    total_orders: 92,
    avg_days_from_due: 4.1,
    pct_late: 76.1,
    total_paid: 2812805,
  },
  {
    customer_id: 18000,
    customer_name: "Drahtesel",
    city: "Leipzig",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 1994780.81,
    total_orders: 67,
    avg_days_from_due: 3.2,
    pct_late: 73.1,
    total_paid: 1994781,
  },
  {
    customer_id: 19000,
    customer_name: "Fahrpott",
    city: "Bochum",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 2247212.83,
    total_orders: 90,
    avg_days_from_due: 4.0,
    pct_late: 70.0,
    total_paid: 2247213,
  },
  {
    customer_id: 20000,
    customer_name: "Neckarrad",
    city: "Heidelberg",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 3604472.5,
    total_orders: 100,
    avg_days_from_due: 2.8,
    pct_late: 68.0,
    total_paid: 3496338,
  },
  {
    customer_id: 21000,
    customer_name: "Ostseerad",
    city: "Anklam",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 1565878.03,
    total_orders: 53,
    avg_days_from_due: 3.3,
    pct_late: 77.4,
    total_paid: 1565878,
  },
  {
    customer_id: 22000,
    customer_name: "Rädlelland",
    city: "Stuttgart",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 3418331.89,
    total_orders: 137,
    avg_days_from_due: 3.2,
    pct_late: 67.2,
    total_paid: 3315782,
  },
  {
    customer_id: 23000,
    customer_name: "Red Light Bikes",
    city: "Hamburg",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 1851072.56,
    total_orders: 95,
    avg_days_from_due: 3.1,
    pct_late: 66.3,
    total_paid: 1795540,
  },
  {
    customer_id: 24000,
    customer_name: "Velodrom",
    city: "Magdeburg",
    country: "DE",
    segment: "MID-MARKET",
    lifetime_revenue: 1862008.06,
    total_orders: 77,
    avg_days_from_due: 3.1,
    pct_late: 63.6,
    total_paid: 1862008,
  },
];

const MONTHLY = [
  { month: 1, revenue: 2183298, profit: 930441, orders: 193 },
  { month: 2, revenue: 3611420, profit: 1562446, orders: 293 },
  { month: 3, revenue: 3217843, profit: 1383562, orders: 254 },
  { month: 4, revenue: 8008017, profit: 3621497, orders: 676 },
  { month: 5, revenue: 9269366, profit: 4166447, orders: 754 },
  { month: 6, revenue: 12070957, profit: 5421334, orders: 1002 },
  { month: 7, revenue: 5234239, profit: 2335917, orders: 452 },
  { month: 8, revenue: 5362476, profit: 2390756, orders: 452 },
  { month: 9, revenue: 4741638, profit: 2068130, orders: 358 },
  { month: 10, revenue: 2977355, profit: 1292693, orders: 280 },
  { month: 11, revenue: 1338051, profit: 593967, orders: 138 },
  { month: 12, revenue: 1602101, profit: 707198, orders: 148 },
];

const PRODUCTS = [
  {
    product_id: "BOTL1000",
    product_name: "Water Bottle",
    category: "Accessoire",
    total_revenue: 14710,
    total_profit: 8130,
    units: 562,
    margin: 55.3,
  },
  {
    product_id: "CAGE1000",
    product_name: "Water Bottle Cage",
    category: "Accessoire",
    total_revenue: 47081,
    total_profit: 26060,
    units: 1998,
    margin: 55.4,
  },
  {
    product_id: "CITY1000",
    product_name: "City Max",
    category: "Trend Bike",
    total_revenue: 186110,
    total_profit: 74578,
    units: 95,
    margin: 40.1,
  },
  {
    product_id: "DXRD1000",
    product_name: "Road Bike Alu Shimano",
    category: "Roadbike",
    total_revenue: 4721273,
    total_profit: 2141975,
    units: 2115,
    margin: 45.4,
  },
  {
    product_id: "DXRD2000",
    product_name: "Road Bike Alu SRAM",
    category: "Roadbike",
    total_revenue: 1685990,
    total_profit: 761217,
    units: 780,
    margin: 45.1,
  },
  {
    product_id: "DXTR1000",
    product_name: "Deluxe Touring Bike-Black",
    category: "Touring Bike",
    total_revenue: 4218178,
    total_profit: 1784499,
    units: 1074,
    margin: 42.3,
  },
  {
    product_id: "DXTR2000",
    product_name: "Deluxe Touring Bike-Silver",
    category: "Touring Bike",
    total_revenue: 7391538,
    total_profit: 3123392,
    units: 1894,
    margin: 42.3,
  },
  {
    product_id: "ELBK1000",
    product_name: "E-Bike Tailwind",
    category: "E Bike",
    total_revenue: 3410187,
    total_profit: 1326700,
    units: 648,
    margin: 38.9,
  },
  {
    product_id: "EPAD1000",
    product_name: "Elbow Pads",
    category: "Accessoire",
    total_revenue: 31614,
    total_profit: 17240,
    units: 325,
    margin: 54.5,
  },
  {
    product_id: "FAID1000",
    product_name: "First Aid Kit",
    category: "Accessoire",
    total_revenue: 72086,
    total_profit: 39796,
    units: 1378,
    margin: 55.2,
  },
  {
    product_id: "FXGR1000",
    product_name: "Edel Fixie",
    category: "Trend Bike",
    total_revenue: 73621,
    total_profit: 29901,
    units: 47,
    margin: 40.6,
  },
  {
    product_id: "KPAD1000",
    product_name: "Knee Pads",
    category: "Accessoire",
    total_revenue: 22593,
    total_profit: 12478,
    units: 230,
    margin: 55.2,
  },
  {
    product_id: "OHMT1000",
    product_name: "Off Road Helmet",
    category: "Accessoire",
    total_revenue: 48265,
    total_profit: 27112,
    units: 724,
    margin: 56.2,
  },
  {
    product_id: "ORHT1000",
    product_name: "Off Road Bike HT Shimano",
    category: "Offroad Bike",
    total_revenue: 3041308,
    total_profit: 1440303,
    units: 1440,
    margin: 47.4,
  },
  {
    product_id: "ORHT2000",
    product_name: "Off Road Bike HT SRAM",
    category: "Offroad Bike",
    total_revenue: 4235777,
    total_profit: 2002300,
    units: 1889,
    margin: 47.3,
  },
  {
    product_id: "ORMN1000",
    product_name: "Men's Off Road Fully",
    category: "Offroad Bike",
    total_revenue: 5119496,
    total_profit: 2401832,
    units: 1624,
    margin: 46.9,
  },
  {
    product_id: "ORWN1000",
    product_name: "Women's Off Road Fully",
    category: "Offroad Bike",
    total_revenue: 2479613,
    total_profit: 1181646,
    units: 745,
    margin: 47.7,
  },
  {
    product_id: "PRRD1000",
    product_name: "Road Bike Carbon Shimano",
    category: "Roadbike",
    total_revenue: 7195086,
    total_profit: 3280678,
    units: 1365,
    margin: 45.6,
  },
  {
    product_id: "PRRD2000",
    product_name: "Road Bike Carbon SRAM",
    category: "Roadbike",
    total_revenue: 1788668,
    total_profit: 808357,
    units: 326,
    margin: 45.2,
  },
  {
    product_id: "PRRD3000",
    product_name: "Road Bike Carbon Campagnolo",
    category: "Roadbike",
    total_revenue: 1953627,
    total_profit: 873837,
    units: 334,
    margin: 44.7,
  },
  {
    product_id: "PRTR1000",
    product_name: "Pro Touring Bike-Black",
    category: "Touring Bike",
    total_revenue: 4096057,
    total_profit: 1762116,
    units: 974,
    margin: 43.0,
  },
  {
    product_id: "PRTR2000",
    product_name: "Pro Touring Bike-Silver",
    category: "Touring Bike",
    total_revenue: 7571346,
    total_profit: 3232627,
    units: 1805,
    margin: 42.7,
  },
  {
    product_id: "PUMP1000",
    product_name: "Air Pump",
    category: "Accessoire",
    total_revenue: 115846,
    total_profit: 64185,
    units: 3150,
    margin: 55.4,
  },
  {
    product_id: "RHMT1000",
    product_name: "Road Helmet",
    category: "Accessoire",
    total_revenue: 37369,
    total_profit: 20702,
    units: 567,
    margin: 55.4,
  },
  {
    product_id: "RKIT1000",
    product_name: "Repair Kit",
    category: "Accessoire",
    total_revenue: 29519,
    total_profit: 16176,
    units: 708,
    margin: 54.8,
  },
  {
    product_id: "SHRT1000",
    product_name: "T-shirt",
    category: "Accessoire",
    total_revenue: 29804,
    total_profit: 16549,
    units: 754,
    margin: 55.5,
  },
];

const PAY_DIST = [
  { days: -5, count: 3 },
  { days: -4, count: 6 },
  { days: -3, count: 74 },
  { days: -2, count: 265 },
  { days: -1, count: 250 },
  { days: 0, count: 166 },
  { days: 1, count: 173 },
  { days: 2, count: 263 },
  { days: 3, count: 195 },
  { days: 4, count: 193 },
  { days: 5, count: 65 },
  { days: 6, count: 71 },
  { days: 7, count: 52 },
  { days: 8, count: 54 },
  { days: 9, count: 72 },
  { days: 10, count: 61 },
  { days: 11, count: 69 },
  { days: 12, count: 58 },
  { days: 13, count: 68 },
  { days: 14, count: 61 },
  { days: 15, count: 2 },
  { days: 16, count: 2 },
  { days: 17, count: 4 },
  { days: 18, count: 1 },
  { days: 19, count: 1 },
  { days: 20, count: 2 },
  { days: 21, count: 2 },
  { days: 22, count: 1 },
  { days: 23, count: 2 },
  { days: 24, count: 1 },
];

const MONTH_NAMES = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const CAT_COLORS = {
  Accessoire: "#4ade80",
  Roadbike: "#38bdf8",
  "Touring Bike": "#fbbf24",
  "Offroad Bike": "#f87171",
  "E Bike": "#a78bfa",
  "Trend Bike": "#fb923c",
};

const AI_STAGES = [
  { label: "Parsing query…", pct: 10, dur: 400 },
  { label: "Loading financial data…", pct: 28, dur: 700 },
  { label: "Running analysis…", pct: 52, dur: 900 },
  { label: "Generating insights…", pct: 76, dur: 650 },
  { label: "Formatting response…", pct: 93, dur: 400 },
];

// ── RESPONSIVE HOOK ───────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 1e6
    ? `$${(n / 1e6).toFixed(1)}M`
    : n >= 1e3
      ? `$${(n / 1e3).toFixed(0)}K`
      : `$${n}`;

function riskScore(c) {
  const latePct = c.pct_late / 100;
  const daysNorm = Math.min(Math.max(c.avg_days_from_due, 0), 15) / 15;
  return Math.round((latePct * 0.6 + daysNorm * 0.4) * 100);
}
function riskLabel(s) {
  if (s < 40) return { label: "LOW", color: C.green };
  if (s < 65) return { label: "MEDIUM", color: C.amber };
  return { label: "HIGH", color: C.red };
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function Badge({ children, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.07em",
        background: `${color}18`,
        color,
        border: `1px solid ${color}35`,
      }}
    >
      {children}
    </span>
  );
}

function KpiCard({ label, value, sub, color = C.indigo }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "18px 20px",
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
          background: `linear-gradient(90deg,transparent,${color},transparent)`,
        }}
      />
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.18em",
          color: C.muted,
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
          style={{
            fontSize: 11,
            color: C.muted,
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function Panel({ children, style = {} }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 22,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        letterSpacing: "0.18em",
        color: C.sky,
        textTransform: "uppercase",
        marginBottom: 14,
        fontWeight: 600,
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
}

function ChartTip({ active, payload, label, labelFmt, valFmt }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1a2035",
        border: `1px solid ${C.border2}`,
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 12,
        fontFamily: C.font,
      }}
    >
      {label !== undefined && (
        <div style={{ color: C.muted, marginBottom: 6, fontSize: 11 }}>
          {labelFmt ? labelFmt(label) : label}
        </div>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.text, marginBottom: 2 }}>
          <span style={{ color: C.muted }}>{p.name}: </span>
          <span style={{ fontWeight: 700 }}>
            {valFmt ? valFmt(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function AiProgressBar({ stage, pct }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 10,
        background: C.surface,
        border: `1px solid ${C.border}`,
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
              background: C.indigo,
              boxShadow: `0 0 10px ${C.indigo}`,
              animation: "aipulse 1.1s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 12, color: C.muted, fontFamily: C.font }}>
            {stage}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.indigo }}>
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: C.border,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 2,
            background: `linear-gradient(90deg,${C.indigo},${C.purple})`,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: `0 0 12px ${C.indigo}60`,
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
              background: pct >= s.pct ? C.indigo : C.border2,
              transition: "background 0.3s",
              boxShadow: pct >= s.pct ? `0 0 6px ${C.indigo}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Customers", "Products", "Payments", "AI Analyst"];

export default function App() {
  const isMobile = useWindowWidth() < 768;
  const [tab, setTab] = useState("Overview");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [catFilter, setCatFilter] = useState("All");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "ai",
      text: "👋 Ask me anything about TechFlow's 2019 performance — customers, products, revenue trends, or payment risk.",
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStage, setAiStage] = useState("");
  const [aiPct, setAiPct] = useState(0);
  const chatRef = useRef(null);
  const chatInputRef = useRef(null);
  const timerRefs = useRef([]);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatHistory, aiLoading]);

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

  const sendChat = async (overrideQ) => {
    const q = (overrideQ || chatInput).trim();
    if (!q || aiLoading) return;

    setChatInput("");
    if (chatInputRef.current) chatInputRef.current.style.height = "42px";
    setChatHistory((h) => [...h, { role: "user", text: q }]);
    setAiLoading(true);
    setAiPct(5);
    setAiStage("Analyzing data...");
    runStages();

    try {
      const res = await fetch(window.location.origin + "/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: "techflow-2019",
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
      setChatHistory((prev) => [...prev, { role: "ai", text: finalReply }]);
    } catch (err) {
      console.error("Dashboard AI Error:", err);
      timerRefs.current.forEach(clearTimeout);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            err.status === 429
              ? err.message
              : err.message || "The AI service is temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setAiLoading(false);
      setAiPct(0);
      setAiStage("");
    }
  };

  const totalRevenue = MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const totalProfit = MONTHLY.reduce((s, m) => s + m.profit, 0);
  const lateCount = CUSTOMERS.filter((c) => c.pct_late > 70).length;
  const categories = [
    "All",
    ...Array.from(new Set(PRODUCTS.map((p) => p.category))),
  ];
  const filteredProducts =
    catFilter === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === catFilter);
  const catSummary = Object.entries(
    PRODUCTS.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = { revenue: 0, profit: 0 };
      acc[p.category].revenue += p.total_revenue;
      acc[p.category].profit += p.total_profit;
      return acc;
    }, {}),
  ).map(([cat, v]) => ({
    cat,
    revenue: v.revenue,
    profit: v.profit,
    margin: Math.round((v.profit / v.revenue) * 100),
  }));

  return (
    <div
      style={{
        fontFamily: C.font,
        background: C.bg,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <style>{`
        @keyframes aipulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border2};border-radius:2px}
      `}</style>

      {/* HEADER */}
      <div
        className="glass-header"
        style={{
          padding: isMobile ? "0 14px" : "0 24px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "stretch",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
        }}
      >
        {/* LOGO + TITLE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 0",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              flexShrink: 0,
              background: `linear-gradient(135deg,${C.indigo},${C.purple})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            TF
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.text,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              TechFlow Industries
            </div>
            <div
              style={{
                fontSize: isMobile ? 10 : 12,
                color: "#cbd5e1",
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
              }}
            >
              FY 2019 · ANALYTICS DASHBOARD
            </div>
          </div>
        </div>

        {/* NAV TABS — inline on desktop, second row on mobile */}
        <nav
          style={{
            display: "flex",
            alignItems: "stretch",
            marginLeft: isMobile ? 0 : 40,
            gap: 0,
            flex: isMobile ? "unset" : 1,
            width: isMobile ? "100%" : "auto",
            overflowX: "auto",
            scrollbarWidth: "none",
            borderTop: isMobile ? `1px solid ${C.border}` : "none",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: isMobile ? "10px 14px" : "0 12px",
                height: isMobile ? "auto" : "100%",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${tab === t ? C.indigo : "transparent"}`,
                color: tab === t ? "#818cf8" : "#cbd5e1",
                fontSize: isMobile ? 11 : 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: C.font,
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
        </nav>

        {/* RIGHT GROUP — back button + live status, desktop only */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 4,
              flexShrink: 0,
              paddingLeft: 16,
            }}
          >
            <a
              href="https://applied-ai-in-business-society.vercel.app/index.html#projects"
              style={{
                textDecoration: "none",
                color: "#818cf8",
                fontSize: "12px",
                fontWeight: "700",
                fontFamily: C.font,
                letterSpacing: "0.05em",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = 0.7)}
              onMouseLeave={(e) => (e.target.style.opacity = 1)}
            >
              ← BACK TO PROJECTS
            </a>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#cbd5e1",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.green,
                  boxShadow: `0 0 8px ${C.green}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ whiteSpace: "nowrap" }}>LIVE · 23 CUSTOMERS</span>
            </div>
          </div>
        )}
      </div>

      <main
        style={{
          padding: isMobile ? "16px 14px" : "28px 32px",
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          flex: "1 0 auto",
          overscrollBehaviorY: "contain",
          boxSizing: "border-box",
        }}
      >
        {/* OVERVIEW */}
        {tab === "Overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2,1fr)"
                  : "repeat(4,1fr)",
                gap: 14,
              }}
            >
              <KpiCard
                label="Total Revenue"
                value={fmt(totalRevenue)}
                sub="FY 2019 · 12 months"
                color={C.sky}
              />
              <KpiCard
                label="Total Profit"
                value={fmt(totalProfit)}
                sub={`${((totalProfit / totalRevenue) * 100).toFixed(1)}% blended margin`}
                color={C.green}
              />
              <KpiCard
                label="Active Customers"
                value="23"
                sub="US + Germany"
                color={C.purple}
              />
              <KpiCard
                label="Late Payers"
                value={`${lateCount}`}
                sub="customers above 70% late rate"
                color={C.red}
              />
            </div>
            <Panel>
              <SLabel>Monthly Revenue vs. Profit</SLabel>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart
                  data={MONTHLY}
                  barGap={4}
                  barCategoryGap="30%"
                  margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="month"
                    tickFormatter={(m) => MONTH_NAMES[m]}
                    tick={{ fill: "#cbd5e1", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`}
                    tick={{ fill: "#cbd5e1", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    content={
                      <ChartTip labelFmt={(m) => MONTH_NAMES[m]} valFmt={fmt} />
                    }
                  />
                  <Bar
                    dataKey="revenue"
                    fill={C.indigo}
                    radius={[4, 4, 0, 0]}
                    name="Revenue"
                  />
                  <Bar
                    dataKey="profit"
                    fill={C.green}
                    radius={[4, 4, 0, 0]}
                    name="Profit"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 16,
              }}
            >
              <Panel>
                <SLabel>Revenue by Category</SLabel>
                <ResponsiveContainer width="100%" height={isMobile ? 300 : 280}>
                  <PieChart>
                    <Pie
                      data={catSummary}
                      dataKey="revenue"
                      nameKey="cat"
                      cx="50%"
                      cy="42%"
                      outerRadius={isMobile ? 85 : 80}
                      innerRadius={isMobile ? 38 : 36}
                      paddingAngle={2}
                      minAngle={5}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={true}
                      fontSize={11}
                    >
                      {catSummary.map((c) => (
                        <Cell key={c.cat} fill={CAT_COLORS[c.cat] || C.muted} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTip valFmt={fmt} />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(v) => (
                        <span style={{ fontSize: 11, color: "#cbd5e1" }}>
                          {v}
                        </span>
                      )}
                      wrapperStyle={{ paddingTop: "4px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Panel>
              <Panel>
                <SLabel>Gross Margin by Category</SLabel>
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
                  <BarChart
                    data={[...catSummary].sort((a, b) => b.margin - a.margin)}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      type="number"
                      domain={[0, 60]}
                      tick={{ fill: "#cbd5e1", fontSize: 10 }}
                      tickFormatter={(v) => `${v}%`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="cat"
                      tick={{ fill: "#cbd5e1", fontSize: isMobile ? 9 : 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={isMobile ? 80 : 90}
                    />
                    <Tooltip content={<ChartTip valFmt={(v) => `${v}%`} />} />
                    <Bar dataKey="margin" name="Margin" radius={[0, 4, 4, 0]}>
                      {[...catSummary]
                        .sort((a, b) => b.margin - a.margin)
                        .map((c) => (
                          <Cell
                            key={c.cat}
                            fill={CAT_COLORS[c.cat] || C.muted}
                          />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </div>
        )}

        {/* CUSTOMERS */}
        {tab === "Customers" && (
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 20,
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                23 Accounts · Sorted by Revenue
              </div>
              {[...CUSTOMERS]
                .sort((a, b) => b.lifetime_revenue - a.lifetime_revenue)
                .map((c) => {
                  const score = riskScore(c);
                  const { label, color } = riskLabel(score);
                  const selected =
                    selectedCustomer?.customer_id === c.customer_id;
                  return (
                    <div
                      key={c.customer_id}
                      onClick={() => setSelectedCustomer(selected ? null : c)}
                      style={{
                        background: selected ? `${C.indigo}12` : C.card,
                        border: `1px solid ${selected ? C.indigo : C.border}`,
                        borderLeft: `3px solid ${selected ? C.indigo : "transparent"}`,
                        borderRadius: 10,
                        padding: "12px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 7,
                            background: C.surface,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                          }}
                        >
                          {c.country === "DE" ? "🇩🇪" : "🇺🇸"}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              color: C.text,
                            }}
                          >
                            {c.customer_name}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: C.muted,
                              marginTop: 1,
                            }}
                          >
                            {c.city} ·{" "}
                            <Badge
                              color={
                                c.segment === "ENTERPRISE"
                                  ? C.purple
                                  : c.segment === "MID-MARKET"
                                    ? C.sky
                                    : C.muted
                              }
                            >
                              {c.segment}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 28,
                          alignItems: "center",
                        }}
                      >
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: C.sky,
                            }}
                          >
                            {fmt(c.lifetime_revenue)}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted }}>
                            {c.total_orders} orders
                          </div>
                        </div>
                        <div style={{ textAlign: "center", minWidth: 68 }}>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color,
                              background: `${color}18`,
                              borderRadius: 5,
                              padding: "2px 8px",
                            }}
                          >
                            {label}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: C.muted,
                              marginTop: 2,
                            }}
                          >
                            risk {score}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {selectedCustomer &&
              (() => {
                const c = selectedCustomer;
                const score = riskScore(c);
                const { label, color } = riskLabel(score);
                return (
                  <div
                    style={{
                      width: isMobile ? "100%" : 300,
                      background: C.card,
                      border: `1px solid ${C.indigo}`,
                      borderRadius: 14,
                      padding: 22,
                      alignSelf: "flex-start",
                      position: isMobile ? "relative" : "sticky",
                      top: isMobile ? "auto" : 76,
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    <div
                      style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}
                    >
                      {c.customer_name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.indigo,
                        marginBottom: 20,
                      }}
                    >
                      {c.city}, {c.country} · {c.segment}
                    </div>
                    {[
                      ["Lifetime Revenue", fmt(c.lifetime_revenue)],
                      ["Total Paid", fmt(c.total_paid)],
                      ["Total Orders", c.total_orders],
                      ["Late Payments", `${c.pct_late}%`],
                      [
                        "Avg Days from Due",
                        `${c.avg_days_from_due > 0 ? "+" : ""}${c.avg_days_from_due}d`,
                      ],
                      ["Risk Score", `${score} / 100`],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "9px 0",
                          borderBottom: `1px solid ${C.border}`,
                          fontSize: 13,
                        }}
                      >
                        <span style={{ color: C.muted }}>{k}</span>
                        <span style={{ fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                    <div
                      style={{
                        marginTop: 18,
                        padding: "14px 18px",
                        borderRadius: 10,
                        background: `${color}12`,
                        border: `1px solid ${color}30`,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color,
                          textTransform: "uppercase",
                          letterSpacing: "0.15em",
                        }}
                      >
                        Payment Risk
                      </div>
                      <div
                        style={{
                          fontSize: 30,
                          fontWeight: 900,
                          color,
                          marginTop: 4,
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "Products" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontFamily: C.font,
                    cursor: "pointer",
                    border: `1px solid ${catFilter === cat ? CAT_COLORS[cat] || C.indigo : C.border}`,
                    background:
                      catFilter === cat
                        ? `${CAT_COLORS[cat] || C.indigo}18`
                        : C.card,
                    color:
                      catFilter === cat ? CAT_COLORS[cat] || C.indigo : C.muted,
                    fontWeight: catFilter === cat ? 700 : 400,
                    letterSpacing: "0.08em",
                    transition: "all 0.12s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                gap: 14,
              }}
            >
              {[...filteredProducts]
                .sort((a, b) => b.total_revenue - a.total_revenue)
                .map((p) => (
                  <Panel key={p.product_id} style={{ padding: 18 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 14,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            lineHeight: 1.3,
                          }}
                        >
                          {p.product_name}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: CAT_COLORS[p.category] || C.muted,
                            marginTop: 3,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                          }}
                        >
                          {p.category}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.green,
                          background: `${C.green}18`,
                          borderRadius: 5,
                          padding: "3px 8px",
                        }}
                      >
                        {p.margin}%
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                      }}
                    >
                      {[
                        ["Revenue", fmt(p.total_revenue)],
                        ["Profit", fmt(p.total_profit)],
                        ["Units", p.units.toLocaleString()],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <div
                            style={{
                              fontSize: 10,
                              color: C.muted,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {k}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: C.text,
                              marginTop: 2,
                            }}
                          >
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        marginTop: 14,
                        height: 4,
                        background: C.border,
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${p.margin}%`,
                          background: CAT_COLORS[p.category] || C.indigo,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </Panel>
                ))}
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {tab === "Payments" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
                gap: 14,
              }}
            >
              <KpiCard
                label="Pay Early"
                value="27%"
                sub="598 invoices cleared before due"
                color={C.green}
              />
              <KpiCard
                label="Pay On-Time"
                value="7%"
                sub="166 invoices — net zero"
                color={C.sky}
              />
              <KpiCard
                label="Pay Late"
                value="66%"
                sub="1,473 invoices overdue"
                color={C.red}
              />
            </div>
            <Panel>
              <SLabel>Payment Distribution — Days from Due Date</SLabel>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={PAY_DIST}>
                  <XAxis
                    dataKey="days"
                    tick={{ fill: "#cbd5e1", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#cbd5e1", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={
                      <ChartTip
                        labelFmt={(d) => `${d > 0 ? "+" : ""}${d} days`}
                        valFmt={(v) => `${v} invoices`}
                      />
                    }
                  />
                  <Bar dataKey="count" name="Invoices" radius={[3, 3, 0, 0]}>
                    {PAY_DIST.map((d) => (
                      <Cell
                        key={d.days}
                        fill={
                          d.days < 0 ? C.green : d.days === 0 ? C.sky : C.red
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>
            <Panel>
              <SLabel>Customer Risk Scores</SLabel>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
                  gap: 10,
                }}
              >
                {[...CUSTOMERS]
                  .sort((a, b) => riskScore(b) - riskScore(a))
                  .map((c) => {
                    const score = riskScore(c);
                    const { label, color } = riskLabel(score);
                    return (
                      <div
                        key={c.customer_id}
                        style={{
                          background: C.surface,
                          borderRadius: 8,
                          padding: "12px 14px",
                          border: `1px solid ${color}25`,
                          borderLeft: `3px solid ${color}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>
                            {c.customer_name}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: C.muted,
                              marginTop: 2,
                            }}
                          >
                            {c.avg_days_from_due > 0 ? "+" : ""}
                            {c.avg_days_from_due}d · {c.pct_late}% late
                          </div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color }}>
                            {score}
                          </div>
                          <div
                            style={{
                              fontSize: 9,
                              color,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Panel>
          </div>
        )}

        {/* AI ANALYST */}
        {tab === "AI Analyst" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: isMobile ? "100%" : 820,
              margin: "0 auto",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: `linear-gradient(135deg,${C.indigo},${C.purple})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                AI
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>AI Analyst</div>
                <div
                  style={{
                    fontSize: 10,
                    color: C.muted,
                    letterSpacing: "0.12em",
                  }}
                >
                  POWERED BY GEMINI · TECHFLOW 2019 DATA
                </div>
              </div>
            </div>

            <div
              ref={chatRef}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 20,
                height: isMobile
                  ? 300
                  : "clamp(300px, calc(100vh - 420px), 460px)",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                    animation: "fadeIn 0.2s ease",
                  }}
                >
                  {msg.role === "ai" && (
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        flexShrink: 0,
                        marginRight: 10,
                        marginTop: 2,
                        background: `linear-gradient(135deg,${C.indigo},${C.purple})`,
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
                  )}
                  <div
                    style={{
                      maxWidth: "78%",
                      padding: "12px 16px",
                      borderRadius: 10,
                      fontSize: 13,
                      lineHeight: 1.7,
                      fontFamily: C.font,
                      background:
                        msg.role === "user" ? `${C.indigo}20` : C.card,
                      border: `1px solid ${msg.role === "user" ? C.indigo + "40" : C.border}`,
                      color: msg.role === "user" ? C.indigo : C.text,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
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
                      background: `linear-gradient(135deg,${C.indigo},${C.purple})`,
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
              {[
                "Who is the highest risk customer?",
                "What's our most profitable product?",
                "Why is June so strong?",
                "How can we improve margins?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendChat(q)}
                  disabled={aiLoading}
                  style={{
                    padding: "6px 13px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontFamily: C.font,
                    cursor: aiLoading ? "not-allowed" : "pointer",
                    border: `1px solid ${C.border2}`,
                    background: C.card,
                    color: C.muted,
                    opacity: aiLoading ? 0.5 : 1,
                    transition: "all 0.12s",
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
                disabled={aiLoading}
                placeholder="Ask anything about TechFlow's 2019 data…"
                aria-label="Ask the TechFlow 2019 AI analyst"
                style={{
                  flex: 1,
                  height: 42,
                  minHeight: 42,
                  maxHeight: 112,
                  background: C.card,
                  border: `1px solid ${C.border2}`,
                  borderRadius: 8,
                  padding: "12px 16px",
                  fontSize: 13,
                  color: C.text,
                  fontFamily: C.font,
                  outline: "none",
                  lineHeight: 1.45,
                  resize: "none",
                  overflowY: "auto",
                  opacity: aiLoading ? 0.6 : 1,
                  transition: "opacity 0.15s",
                }}
              />
              <button
                onClick={() => sendChat()}
                disabled={aiLoading}
                style={{
                  padding: "12px 22px",
                  borderRadius: 8,
                  background: aiLoading
                    ? C.border
                    : `linear-gradient(135deg,${C.indigo},${C.purple})`,
                  color: aiLoading ? C.dim : "#fff",
                  border: "none",
                  fontSize: 12,
                  fontFamily: C.font,
                  fontWeight: 700,
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  letterSpacing: "0.1em",
                  transition: "all 0.15s",
                }}
              >
                SEND
              </button>
            </div>
            <div
              style={{
                fontSize: 9,
                lineHeight: 1.5,
                color: C.dim,
                letterSpacing: "0.04em",
              }}
            >
              Enter sends. Shift+Enter adds a new line. Questions are processed by
              Google Gemini. Do not submit personal, confidential, or sensitive
              information.
            </div>
          </div>
        )}
        {/* FOOTER */}
        <footer
          style={{
            marginTop: "48px",
            padding: "24px 0",
            borderTop: `1px solid ${C.border}`,
            textAlign: "center",
            color: "#cbd5e1",
            fontSize: "12px",
            fontFamily: C.font,
            letterSpacing: "0.05em",
          }}
        >
          A project by Lizzie Reyes — Society for AI in Enterprise Systems · Cal
          State LA
        </footer>
      </main>
    </div>
  );
}
