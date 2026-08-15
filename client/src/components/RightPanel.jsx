import React from "react";
import { Headphones, Building2, ChevronRight, Phone } from "lucide-react";

const capabilities = [
  { icon: "📄", label: "Applications & Forms" },
  { icon: "🛠", label: "Services & Support" },
  { icon: "ℹ️", label: "General Information" },
  { icon: "❓", label: "FAQs & Guidance" },
];

const popularRequests = [
  { icon: "🏍", label: "Apply for bike loan" },
  { icon: "📄", label: "Application status" },
  { icon: "💬", label: "General inquiries" },
  { icon: "☎", label: "Contact support" },
];

export default function RightPanel() {
  return (
    <aside
      className="right-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "300px",
        flexShrink: 0,
      }}
    >
      {/* ── About CX Assistant ── */}
      <div className="info-card">
        <div className="info-card-title">About CX Assistant</div>
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 14px" }}>
          Your customer-care assistant for finding the right service, application, or support channel.
        </p>

        <div className="info-card-title" style={{ marginBottom: "6px" }}>I can help with:</div>
        {capabilities.map((c) => (
          <div key={c.label} className="capability-item">
            <span style={{ fontSize: "1rem", lineHeight: 1 }}>{c.icon}</span>
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      {/* ── Current Company ── */}
      <div className="info-card">
        <div className="info-card-title">Current Company</div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1e293b, #334155)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Building2 size={20} color="#94a3b8" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>Union</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Motorcycle services<br />and financing
            </div>
          </div>
        </div>
      </div>

      {/* ── Popular Requests ── */}
      <div className="info-card">
        <div className="info-card-title">Popular Requests</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {popularRequests.map((r) => (
            <button
              key={r.label}
              className="popular-item"
              id={`popular-${r.label.toLowerCase().replace(/\s+/g, "-")}`}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.95rem" }}>{r.icon}</span>
                <span>{r.label}</span>
              </span>
              <ChevronRight size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Need human support? ── */}
      <div
        className="info-card"
        style={{
          background: "linear-gradient(135deg, #1e1b4b, #2e1065)",
          border: "1px solid rgba(124,58,237,0.3)",
          marginTop: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(124,58,237,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Headphones size={18} color="#c4b5fd" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>Need human support?</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>
              Our customer-care team is ready to assist you.
            </div>
          </div>
        </div>

        <button className="contact-btn" id="contact-support-btn">
          <Phone size={15} />
          Contact Support
        </button>
      </div>
    </aside>
  );
}
