import React from "react";
import { ExternalLink, Lock, Shield } from "lucide-react";

export default function ActionCard({ action, onOpenLoanModal }) {
  if (!action?.label) return null;

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

      {/* CTA Button - Triggers Modal or Navigation smoothly */}
      <button
        onClick={() => {
          if (onOpenLoanModal) {
            onOpenLoanModal();
          } else if (action.url && action.url !== "#") {
            window.open(action.url, "_blank");
          }
        }}
        className="action-card-btn"
        id="bike-loan-application-btn"
      >
        <ExternalLink size={15} />
        {action.label}
      </button>

      {/* Security note */}
      <div className="secure-tag">
        <Lock size={11} />
        Official application form
      </div>
    </div>
  );
}
