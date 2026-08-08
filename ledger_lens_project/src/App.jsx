import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Database,
  Hammer,
  BrainCircuit,
  FileCode2,
  PlayCircle,
  Printer,
  ArrowLeft,
} from "lucide-react";

// Import components
import RealCompaniesStep from "./components/RealCompaniesStep";
import YourDataFitStep from "./components/YourDataFitStep";
import WhatToBuildStep from "./components/WhatToBuildStep";
import AIMethodStep from "./components/AIMethodStep";
import PythonCodeStep from "./components/PythonCodeStep";
import InteractiveDemoStep from "./components/InteractiveDemoStep";

const MotionDiv = motion.div;

const steps = [
  {
    id: 1,
    label: "Real Companies",
    title: "3 Real Companies Using AI in Tax Strategy",
    content: RealCompaniesStep,
    icon: Building2,
  },
  {
    id: 2,
    label: "Your Data Fit",
    title: "Which Problems Can YOU Solve With This Data?",
    content: YourDataFitStep,
    icon: Database,
  },
  {
    id: 3,
    label: "What to Build",
    title: "What Would You Build? (Specific Blueprint)",
    content: WhatToBuildStep,
    icon: Hammer,
  },
  {
    id: 4,
    label: "AI Method",
    title: "Which AI/ML Method to Use?",
    content: AIMethodStep,
    icon: BrainCircuit,
  },
  {
    id: 5,
    label: "Python Code",
    title: "Python Code — Step by Step",
    content: PythonCodeStep,
    icon: FileCode2,
  },
  {
    id: 6,
    label: "Interactive Demo",
    title: "Run Analysis Workflow",
    content: InteractiveDemoStep,
    icon: PlayCircle,
  },
];

export default function TaxAIGuide() {
  const [activeStep, setActiveStep] = useState(0);

  const ActiveComponent = steps[activeStep].content;
  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  const handlePrint = () => window.print();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-main)",
        color: "var(--text-main)",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: 0,
        position: "relative",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --bg-main: #0a1520;
          --bg-card: #0d1e2a;
          --bg-card-alt: #0a2233;
          --bg-card-dark: #060e14;
          --text-main: #c8dde8;
          --text-bright: #e2c074;
          --text-muted: #8cabb8;
          --text-dim: #5bc8d4;
          --border-main: #1e3a4a;
          --accent: #5bc8d4;
        }

        .nav-container div::-webkit-scrollbar { display: none; }
        
        @media print {
          /* Remap CSS vars to light/print-friendly colors */
          :root {
            --bg-main: #ffffff;
            --bg-card: #ffffff;
            --bg-card-alt: #f8f9fa;
            --bg-card-dark: #f1f3f5;
            --text-main: #000000;
            --text-bright: #94711a;
            --text-muted: #444444;
            --text-dim: #222222;
            --border-main: #cccccc;
            --accent: #008899;
          }
          body, html, main { background: #ffffff !important; color: #000000 !important; }
          .print-header { display: block !important; }
          .step-container { page-break-inside: avoid; border-bottom: 1px solid #eee; padding-bottom: 2rem; margin-bottom: 2rem; }
        }

        /* Tablet (≤768px) */
        @media (max-width: 768px) {
          .site-title { font-size: 24px !important; }
          .header-sub { letter-spacing: 2px !important; font-size: 10px !important; }
          .header-desc { font-size: 12px !important; }
          .header-wrapper { padding-top: 52px !important; }
          .content-panel { padding: 14px !important; }
          .nav-btn { padding: 12px 8px !important; font-size: 11px !important; }
        }
        /* Phone (≤480px) */
        @media (max-width: 480px) {
          .site-title { font-size: 24px !important; }
          .back-btn-label, .print-btn-label { display: none !important; }
          .back-btn, .print-btn { padding: 8px 10px !important; }
          .content-panel { padding: 12px !important; }
          .prev-next-row { gap: 8px !important; }
        }
      `,
        }}
      />
      {/* Top glowing progress bar - fixed so it never scrolls away */}
      <MotionDiv
        className="screen-only"
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3px",
          background: "#5bc8d4",
          boxShadow: "0 0 10px #5bc8d4",
          zIndex: 1000,
        }}
      />
      <div style={{ maxWidth: 820, margin: "0 auto", overflowX: "hidden" }}>
        {/* Always in DOM — hidden on screen, visible on print */}
        <div className="print-all-steps">
          {steps.map((s, index) => {
            const StepContent = s.content;
            return (
              <div key={s.id} className="step-container">
                <h2>
                  Step {index + 1}: {s.title}
                </h2>
                <StepContent isPrinting={true} />
              </div>
            );
          })}
        </div>
        {/* Sticky header - pins title + nav to top, never scrolls away */}
        <div
          className="screen-only"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "#0a1520",
            paddingTop: "24px",
            paddingBottom: 0,
          }}
        >
          {/* Header Container */}
          <div
            style={{
              position: "relative",
              textAlign: "center",
              marginBottom: 20,
              padding: "0 16px",
            }}
            className="header-wrapper"
          >
            {/* Back to Projects link — top left */}
            <a
              href="https://applied-ai-in-business-society.vercel.app/index.html#projects"
              className="back-btn"
              style={{
                position: "absolute",
                left: 16,
                top: 0,
                color: "#8cabb8",
                border: "1px solid #1e3a4a",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1e3a4a";
                e.currentTarget.style.color = "#cbe0eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#8cabb8";
              }}
            >
              <ArrowLeft size={14} />
              <span className="back-btn-label"> Projects</span>
            </a>

            {/* Print Button — top right */}
            <button
              onClick={handlePrint}
              className="screen-only print-btn"
              style={{
                position: "absolute",
                right: 16,
                top: 0,
                background: "transparent",
                color: "#8cabb8",
                border: "1px solid #1e3a4a",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1e3a4a";
                e.currentTarget.style.color = "#cbe0eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#8cabb8";
              }}
            >
              <Printer size={16} />
              <span className="print-btn-label"> Print Full Report</span>
            </button>

            <div
              className="header-sub"
              style={{
                color: "var(--text-dim)",
                fontSize: 11,
                letterSpacing: 4,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              ENTERPRISE AI FOR TAX PROFESSIONALS
            </div>
            <h1
              className="site-title"
              style={{
                color: "var(--text-bright)",
                fontSize: 28,
                fontWeight: 700,
                margin: "0 0 8px",
              }}
            >
              From Bike Sales Data → Tax Intelligence
            </h1>
            <p
              className="header-desc"
              style={{ color: "var(--text-main)", fontSize: 13, margin: 0 }}
            >
              A practical walkthrough for public accounting professionals
            </p>
          </div>

          {/* Step Nav - also sticky, sits directly below header */}
          <div
            className="nav-container"
            style={{ padding: "0 16px", paddingBottom: "12px" }}
          >
            <div
              style={{
                display: "flex",
                gap: 0,
                background: "#0f1923",
                borderRadius: 10,
                border: "1px solid #1e3a4a",
                overflowX: "auto",
                whiteSpace: "nowrap",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {steps.map((s, i) => {
                const Icon = s.icon;
                const isActive = activeStep === i;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveStep(i)}
                    style={{
                      flex: "1 0 auto",
                      padding: "16px 14px 12px",
                      background: isActive ? "#1e3a4a" : "transparent",
                      color: isActive ? "#e2c074" : "#b0c4cf",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: 0.5,
                      borderRight:
                        i < steps.length - 1 ? "1px solid #1e3a4a" : "none",
                      transition: "all .2s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>{" "}
        {/* END sticky header wrapper */}
        {/* Scrollable content below the sticky header */}
        <div style={{ padding: "0 16px 24px" }}>
          {/* --- STANDARD INTERACTIVE INTERFACE --- */}
          <>
            {/* Content Container */}
            <div
              className="screen-only content-panel"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-main)",
                borderRadius: 12,
                padding: 24,
                minHeight: "450px",
              }}
            >
              <AnimatePresence mode="wait">
                <MotionDiv
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2
                    style={{
                      color: "var(--text-bright)",
                      fontSize: 18,
                      marginTop: 0,
                      marginBottom: 20,
                      paddingBottom: 12,
                      borderBottom: "1px solid var(--border-main)",
                    }}
                  >
                    {steps[activeStep].title}
                  </h2>
                  <ActiveComponent isPrinting={false} />
                </MotionDiv>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div
              className="screen-only"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                style={{
                  background: "var(--border-main)",
                  color: "var(--text-dim)",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 20px",
                  cursor: activeStep === 0 ? "default" : "pointer",
                  opacity: activeStep === 0 ? 0.3 : 1,
                  fontSize: 13,
                }}
              >
                ← Previous
              </button>
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: 12,
                  alignSelf: "center",
                  fontWeight: 600,
                }}
              >
                {activeStep + 1} / {steps.length}
              </span>
              <button
                onClick={() =>
                  setActiveStep(Math.min(steps.length - 1, activeStep + 1))
                }
                disabled={activeStep === steps.length - 1}
                style={{
                  background: "var(--text-bright)",
                  color: "var(--bg-main)",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 20px",
                  cursor:
                    activeStep === steps.length - 1 ? "default" : "pointer",
                  opacity: activeStep === steps.length - 1 ? 0.3 : 1,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Next →
              </button>
            </div>
          </>
        </div>{" "}
        {/* END scrollable content wrapper */}
      </div>{" "}
      {/* END maxWidth wrapper */}
      {/* FOOTER */}
      <footer>
        <span>
          Berumen Escobedo, Anthony · Society for AI in Enterprise Systems ·
          Est. CSULA 2026
        </span>
        <span>Data: Audit Analytics Bike Manufacturer Dataset · FY 2023</span>
      </footer>
    </main>
  );
}
