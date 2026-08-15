import React from "react";

export default function QuickReplies({ suggestions = [], onSelect }) {
  if (!suggestions.length) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
      {suggestions.map((text, i) => (
        <button
          key={i}
          onClick={() => onSelect(text)}
          style={{
            padding: "7px 14px",
            borderRadius: "20px",
            border: "1.5px solid var(--accent-light)",
            background: "transparent",
            color: "var(--accent)",
            fontSize: "0.8rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--accent)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--accent)";
          }}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
