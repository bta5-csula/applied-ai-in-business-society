import React, { useState, useEffect, lazy, Suspense } from "react";
import "./styles/Theme.css";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
// Lazy-load tabs to improve performance
const OverviewTab = lazy(() => import("./tabs/OverviewTab").then(m => ({ default: m.OverviewTab })));
const BenfordTab = lazy(() => import("./tabs/BenfordTab").then(m => ({ default: m.BenfordTab })));
const ExceptionsTab = lazy(() => import("./tabs/ExceptionsTab").then(m => ({ default: m.ExceptionsTab })));
const RiskMatrixTab = lazy(() => import("./tabs/RiskMatrixTab").then(m => ({ default: m.RiskMatrixTab })));
import { Activity, TrendingUp, FileText, Shield, ArrowLeft } from "lucide-react";

const TABS_CONFIG = [
  { id: "overview", label: "Overview", icon: <Activity size={12} /> },
  { id: "benford", label: "Benford's Law", icon: <TrendingUp size={12} /> },
  { id: "exceptions", label: "Exception Log", icon: <FileText size={12} /> },
  { id: "risk", label: "Risk Matrix", icon: <Shield size={12} /> },
];

export default function App() {
  const [tab, setTab] = useState("overview");
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const backButton = (
    <a
      href="https://applied-ai-in-business-society.vercel.app/index.html#projects"
      className="back-btn"
    >
      <ArrowLeft size={14} />
      <span className="back-btn-label"> Projects</span>
    </a>
  );

  return (
    <div className="audit-app">
      <Header backButton={backButton} />

      <Tabs
        tabs={TABS_CONFIG}
        activeTab={tab}
        onTabChange={setTab}
      />

      <main className="audit-main">
        <Suspense fallback={
          <div style={{ 
            display: 'flex', 
            minHeight: 'calc(100vh - 136px)',
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--text-3)',
            fontFamily: 'var(--mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em'
          }}>
            <span className="live-dot" style={{ position: 'relative', top: -1 }} /> 
            LOADING ANALYTICS MODULE...
          </div>
        }>
          {tab === "overview" && <OverviewTab />}
          {tab === "benford" && <BenfordTab />}
          {tab === "exceptions" && <ExceptionsTab />}
          {tab === "risk" && <RiskMatrixTab />}
        </Suspense>
      </main>

      {/* FOOTER */}
      {!isPrinting && (
        <footer>
          <span>Gonzalez, Michael S. · Society for AI in Enterprise Systems · Est. CSULA 2026</span>
          <span>Data: Audit Analytics Bike Manufacturer Dataset · FY 2023</span>
        </footer>
      )}
    </div>
  );
}
