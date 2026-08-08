import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  AlertTriangle,
  DollarSign,
  Users,
  FileText,
  Activity,
  ArrowRight
} from "lucide-react";
import { KPICard, LegDot, BarTip } from "../components/Common";
import { useCounter } from "../hooks/useCounter";
import { exceptionData } from "../data/mockData";

export function OverviewTab() {
  const exc = useCounter(685, 1100, 180);
  const txn = useCounter(5000, 1100, 60);
  const cust = useCounter(23, 1100, 120);

  const summaryCards = [
    {
      label: "Highest Volume Exception",
      value: "Duplicate Payments",
      sub: "3,588 occurrences · AS2201.43",
      color: "#ef4444",
    },
    {
      label: "Primary Revenue Risk",
      value: "Late Payments",
      sub: "2,873 events · ASC 606 exposure",
      color: "#f59e0b",
    },
    {
      label: "Critical Control Gap",
      value: "SOD Violations",
      sub: "87 instances · AS2201.15 · HIGH",
      color: "#ef4444",
    },
  ];

  return (
    <>
      <div className="kpi-grid">
        <KPICard
          label="Total Revenue"
          display="$120.8M"
          accent="#3b82f6"
          icon={<DollarSign size={12} />}
          sub="FY 2023 · B2B"
          delay={0}
        />
        <KPICard
          label="Transactions Analyzed"
          display={txn.toLocaleString()}
          accent="#3b82f6"
          icon={<FileText size={12} />}
          sub="Manufacturing invoices"
          delay={60}
        />
        <KPICard
          label="B2B Customers"
          display={cust}
          accent="#3b82f6"
          icon={<Users size={12} />}
          sub="Concentrated portfolio"
          delay={120}
        />
        <KPICard
          label="Exceptions Flagged"
          display={exc.toLocaleString()}
          accent="#ef4444"
          icon={<AlertTriangle size={12} />}
          sub="High + Medium risk"
          delay={180}
        />
        <KPICard
          label="Exception Rate"
          display="13.7%"
          accent="#f59e0b"
          icon={<Activity size={12} />}
          sub="Industry avg: ~8–10%"
          delay={240}
        />
      </div>

      <div className="card">
        <div className="card-title" style={{ fontSize: '1rem', letterSpacing: '0.15em' }}>Exception Volume by Control Test</div>
        <div className="card-sub" style={{ fontSize: '0.68rem', marginBottom: '1.5rem' }}>
          Total occurrence count · All flagged transactions · FY 2023 engagement
        </div>
        <div style={{ height: 300, minWidth: 0, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={exceptionData}
              margin={{ top: 8, right: 20, bottom: 48, left: 16 }}
              barCategoryGap="32%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1c2d4a"
                vertical={false}
              />
              <XAxis
                dataKey="test"
                tick={{ fill: "var(--text-3)", fontSize: 9, fontFamily: "var(--mono)" }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
                tickLine={false}
                axisLine={{ stroke: "#1c2d4a" }}
              />
              <YAxis
                tick={{ fill: "var(--text-3)", fontSize: 10, fontFamily: "var(--mono)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.toLocaleString()}
              />
              <Tooltip content={<BarTip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]} isAnimationActive={false}>
                {exceptionData.map((e, i) => (
                  <Cell
                    key={i}
                    fill={e.risk === "HIGH" ? "#ef4444" : "#f59e0b"}
                    fillOpacity={0.82}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)"
          }}
        >
          <LegDot color="#ef4444" label="HIGH Risk" />
          <LegDot color="#f59e0b" label="MEDIUM Risk" />
        </div>
      </div>

      <div className="summary-grid">
        {summaryCards.map((s, i) => (
          <div
            key={i}
            className="card"
            style={{ 
              marginBottom: 0, 
              borderLeft: `3px solid ${s.color}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingTop: '1.25rem',
              paddingBottom: '1.25rem'
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.6rem",
                color: "var(--text-3)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{s.label}</span>
              <ArrowRight size={10} style={{ opacity: 0.5 }} />
            </div>
            <div
              style={{
                fontFamily: "var(--display)",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text-1)",
                marginBottom: 4,
                letterSpacing: '0.02em'
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.62rem",
                color: "var(--text-3)",
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
