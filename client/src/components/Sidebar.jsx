import React from "react";
import {
  Headphones,
  Plus,
  MessageSquare,
  HelpCircle,
  Info,
  Lock,
  Moon,
  Sun,
} from "lucide-react";

export default function Sidebar({ darkMode, onToggleDark }) {
  return (
    <aside
      className="sidebar-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "240px",
        background: "var(--sidebar-bg)",
        borderRadius: "18px",
        padding: "24px 16px",
        gap: "0",
        flexShrink: 0,
        boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
        overflow: "hidden",
      }}
    >
      {/* ── Logo / Brand ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", paddingLeft: "4px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
            flexShrink: 0,
          }}
        >
          <Headphones size={20} color="#fff" />
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
            CX ASSISTANT
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.68rem", lineHeight: 1.3, marginTop: "2px" }}>
            Customer Experience<br />Assistant
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "20px" }}>
        <button className="new-convo-btn" style={{ marginBottom: "10px" }}>
          <Plus size={15} />
          New Conversation
        </button>

        <button className="nav-item active">
          <MessageSquare size={16} />
          Conversations
        </button>
        <button className="nav-item">
          <HelpCircle size={16} />
          Help &amp; FAQs
        </button>
        <button className="nav-item">
          <Info size={16} />
          About CX Assistant
        </button>
      </nav>

      {/* ── Bottom section ── */}
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Security badge */}
        <div className="security-badge">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
            <Lock size={13} color="rgba(255,255,255,0.7)" />
            <strong>Your data is safe</strong>
          </div>
          We follow strict security practices to keep your information confidential.
        </div>

        {/* Dark mode toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 4px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "rgba(255,255,255,0.65)" }}>
            {darkMode ? <Moon size={14} /> : <Sun size={14} />}
            Dark mode
          </div>
          <button
            onClick={onToggleDark}
            aria-label="Toggle dark mode"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            <span className={`toggle-track ${darkMode ? "on" : ""}`}>
              <span className="toggle-thumb" />
            </span>
          </button>
        </div>

        {/* Copyright */}
        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.5, padding: "0 4px" }}>
          © 2026 CX Assistant<br />All rights reserved.
        </div>
      </div>
    </aside>
  );
}
