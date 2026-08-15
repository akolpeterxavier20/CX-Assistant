import React from "react";
import ActionCard from "./ActionButton.jsx";

// Timestamp helper
function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessage({ message, onOpenLoanModal }) {
  const isUser = message.role === "user";

  return (
    <article className={`msg-enter`} style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
      {/* Sender label */}
      {!isUser && (
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "var(--text-muted)",
            marginBottom: "5px",
            paddingLeft: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          CX Assistant · Customer Care
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", maxWidth: "min(80%, 44rem)", flexDirection: isUser ? "row-reverse" : "row" }}>
        {/* Avatar for agent */}
        {!isUser && (
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#fff",
              border: "2px solid rgba(124,58,237,0.3)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            aria-hidden="true"
          >
            CX
          </div>
        )}

        {/* Bubble */}
        <div style={{ flex: "0 1 auto" }}>
          <div
            style={{
              borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              padding: "12px 16px",
              background: isUser ? "var(--user-bubble)" : "var(--agent-bubble)",
              color: isUser ? "#fff" : "var(--text-primary)",
              border: isUser ? "none" : "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              fontSize: "0.875rem",
              lineHeight: 1.65,
            }}
          >
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{message.content}</p>

            {/* Action card inside assistant bubble */}
            {!isUser && message.workflow?.action && (
              <ActionCard action={message.workflow.action} onOpenLoanModal={onOpenLoanModal} />
            )}
          </div>

          {/* Timestamp */}
          <div
            style={{
              fontSize: "0.68rem",
              color: "var(--text-muted)",
              marginTop: "4px",
              textAlign: isUser ? "right" : "left",
              paddingLeft: isUser ? 0 : "4px",
              paddingRight: isUser ? "4px" : 0,
            }}
          >
            {getTime()}
          </div>
        </div>
      </div>
    </article>
  );
}
