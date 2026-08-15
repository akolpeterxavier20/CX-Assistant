import React, { useState } from "react";
import { X, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";

export default function ApplicationModal({ isOpen, onClose, onSubmitSuccess }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    loanAmount: "$2,500",
    employment: "Employed",
  });

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmitSuccess(formData);
      setSubmitted(false);
      onClose();
    }, 1500);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
    >
      <div
        className="msg-enter"
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #1e1b4b 0%, #2e1065 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(124, 58, 237, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={20} color="#c4b5fd" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Union Bike Loan</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>Official Application Form</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <CheckCircle size={52} color="#22c55e" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
              Application Submitted!
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0 }}>
              Your bike loan request (#UB-9482) is being processed. Returning to chat...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Full Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-alt)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: "var(--surface-alt)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Loan Amount
                </label>
                <select
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: "var(--surface-alt)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                >
                  <option>$1,500 - Urban Commuter</option>
                  <option>$2,500 - Standard Motorcycle</option>
                  <option>$4,000 - Touring Bike</option>
                  <option>$6,000+ - Premium Cruiser</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                Employment Status
              </label>
              <select
                value={formData.employment}
                onChange={(e) => setFormData({ ...formData, employment: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--surface-alt)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              >
                <option>Employed (Full-Time)</option>
                <option>Self-Employed / Business</option>
                <option>Part-Time</option>
                <option>Student / Other</option>
              </select>
            </div>

            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", background: "var(--surface-alt)", padding: "10px 12px", borderRadius: "8px" }}>
              🔒 Protected by 256-bit encryption. Union Financial Services will review your pre-approval within 24 hours.
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
              }}
            >
              Submit Application
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
