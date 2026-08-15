import React, { useState } from "react";
import { X, ExternalLink, ShieldCheck, RefreshCw, Lock } from "lucide-react";

export default function ApplicationModal({ isOpen, onClose, targetUrl = "https://union-bike-loans.vercel.app/" }) {
  const [iframeKey, setIframeKey] = useState(0);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        padding: "16px",
      }}
    >
      <div
        className="msg-enter"
        style={{
          width: "100%",
          maxWidth: "860px",
          height: "85vh",
          maxHeight: "780px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, #1e1b4b 0%, #2e1065 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "rgba(124, 58, 237, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={20} color="#c4b5fd" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.2 }}>
                Union Bike Loan Application
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                <Lock size={11} color="#22c55e" />
                <span style={{ color: "#86efac", fontWeight: 600 }}>Official Portal:</span> {targetUrl}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Refresh iframe button */}
            <button
              onClick={() => setIframeKey((prev) => prev + 1)}
              title="Reload form"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "8px",
                height: "34px",
                padding: "0 10px",
                color: "#fff",
                fontSize: "0.8rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <RefreshCw size={14} />
            </button>

            {/* Open Full Window Button */}
            <a
              href={targetUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                height: "34px",
                padding: "0 14px",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(124, 58, 237, 0.4)",
              }}
            >
              <ExternalLink size={14} />
              Open Full Window
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "8px",
                width: "34px",
                height: "34px",
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
        </div>

        {/* Embedded Portal iframe */}
        <div style={{ flex: 1, width: "100%", background: "#f8fafc", position: "relative" }}>
          <iframe
            key={iframeKey}
            src={targetUrl}
            title="Union Bike Loan Application"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
