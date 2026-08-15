import React from "react";
import { ExternalLink, Lock, Shield } from "lucide-react";

export default function ActionCard({ action, onOpenLoanModal }) {
  if (!action?.label) return null;
  const targetUrl = action.url && action.url !== "#" ? action.url : "https://union-bike-loans.vercel.app/";

  return (
    <div className="action-card">
      {/* Card header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#7c3aed",
              marginBottom: "5px",
            }}
          >
            Action Required
          </div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", lineHeight: 1.3 }}>
            {action.title || "Apply for a Union Bike Loan"}
          </div>
        </div>
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "rgba(124,58,237,0.12)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Shield size={18} color="#7c3aed" />
        </div>
      </div>

      <p style={{ fontSize: "0.83rem", color: "var(--text-secondary)", marginTop: "8px", lineHeight: 1.6 }}>
        {action.description || "Complete the official application form to get started."}
      </p>

      {/* CTA Button */}
      <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
        <button
          onClick={() => onOpenLoanModal ? onOpenLoanModal(targetUrl) : window.open(targetUrl, "_blank")}
          className="action-card-btn"
          style={{ margin: 0, flex: 1 }}
          id="bike-loan-application-btn"
        >
          <ExternalLink size={15} />
          {action.label}
        </button>

        <a
          href={targetUrl}
          target="_blank"
          rel="noreferrer"
          title="Open in new window"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 14px",
            borderRadius: "9px",
            border: "1.5px solid var(--accent)",
            color: "var(--accent)",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          ↗
        </a>
      </div>

      {/* Security note */}
      <div className="secure-tag">
        <Lock size={11} />
        Official application: {targetUrl}
      </div>
    </div>
  );
}
