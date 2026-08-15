import React from "react";
import ActionCard from "./ActionButton.jsx";

// Timestamp helper
function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatMessage({ message, onOpenLoanModal }) {
  const isUser = message.role === "user";

  return (
    <article
      className="msg-enter"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      {/* Sender Header Label */}
      <div
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: isUser ? "var(--text-muted)" : "var(--accent)",
          marginBottom: "4px",
          paddingLeft: isUser ? 0 : "4px",
          paddingRight: isUser ? "4px" : 0,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {isUser ? "You" : "CX Assistant · Customer Care"}
      </div>

      {/* Message Bubble Container */}
      <div style={{ maxWidth: "min(85%, 44rem)", width: "fit-content" }}>
        <div
          style={{
            borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
            padding: "14px 18px",
            background: isUser
              ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
              : "var(--surface)",
            color: isUser ? "#ffffff" : "var(--text-primary)",
            border: isUser ? "none" : "1px solid var(--border)",
            borderLeft: isUser ? "none" : "4px solid var(--accent)",
            boxShadow: isUser
              ? "0 4px 14px rgba(124, 58, 237, 0.25)"
              : "var(--shadow-sm)",
            fontSize: "0.9rem",
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
    </article>
  );
}
