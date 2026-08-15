import React, { useState } from "react";
import { X, PhoneCall, Mail, Clock, CheckCircle2, MessageSquare } from "lucide-react";

export default function SupportModal({ isOpen, onClose, onRequestCallBack }) {
  const [requested, setRequested] = useState(false);

  if (!isOpen) return null;

  function handleCallback() {
    setRequested(true);
    setTimeout(() => {
      onRequestCallBack();
      setRequested(false);
      onClose();
    }, 1400);
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
          maxWidth: "460px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
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
              <PhoneCall size={18} color="#c4b5fd" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Union Customer Care</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>Human Representative Channel</div>
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

        {/* Content */}
        {requested ? (
          <div style={{ padding: "36px 24px", textAlign: "center" }}>
            <CheckCircle2 size={48} color="#22c55e" style={{ margin: "0 auto 14px" }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>
              Call Request Queued!
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              A customer care agent will call your phone number shortly.
            </p>
          </div>
        ) : (
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "var(--surface-alt)", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <PhoneCall size={16} color="var(--accent)" />
                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>Direct Helpline</span>
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)" }}>+1 (800) 555-UNION</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Mon - Fri: 8:00 AM - 8:00 PM EST</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  <Clock size={14} color="#eab308" />
                  Live Queue
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>~ 1 min wait</div>
              </div>

              <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  <Mail size={14} color="var(--accent)" />
                  Email Care
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>support@union.com</div>
              </div>
            </div>

            <button
              onClick={handleCallback}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
              }}
            >
              <MessageSquare size={16} />
              Request Agent Callback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
