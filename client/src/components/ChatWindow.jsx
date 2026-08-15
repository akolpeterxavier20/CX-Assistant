import React, { useMemo, useRef, useState } from "react";
import { ArrowLeft, Phone, MoreHorizontal } from "lucide-react";
import ChatInput from "./ChatInput.jsx";
import ChatMessage from "./ChatMessage.jsx";
import QuickReplies from "./QuickReplies.jsx";
import Sidebar from "./Sidebar.jsx";
import RightPanel from "./RightPanel.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/chat";

/** Pre-populated demo conversation */
const initialMessages = [
  {
    role: "assistant",
    content: "Hello! Welcome to CX Assistant. My name is Alex and I'm here to help you today. 😊\n\nHow can I assist you?",
    workflow: null,
  },
  {
    role: "user",
    content: "I want to get a bike on loan.",
    workflow: null,
  },
  {
    role: "assistant",
    content: "Sure, I'd be happy to help you with that! Are you looking to apply for a new motorcycle through Union?",
    workflow: null,
  },
  {
    role: "user",
    content: "Yes.",
    workflow: null,
  },
  {
    role: "assistant",
    content: "Great. I can help you get started. You only need to complete the official application form with your details.",
    workflow: {
      action: {
        url: "#",
        label: "Open Bike Loan Application ↗",
        title: "Apply for a Union Bike Loan",
        description: "Complete the official application form to get started with your motorcycle financing.",
      },
    },
  },
];

export default function ChatWindow() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [quickReplies, setQuickReplies] = useState([
    "What documents do I need?",
    "How long does approval take?",
  ]);
  const listRef = useRef(null);

  const conversation = useMemo(
    () => messages.map(({ role, content }) => ({ role, content })),
    [messages]
  );

  async function handleSend(text) {
    setQuickReplies([]);
    const userMessage = { role: "user", content: text, workflow: null };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversation }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || "Sorry, I'm having trouble processing that right now. Please try again.",
          workflow: data.workflow || null,
        },
      ]);
      setQuickReplies(Array.isArray(data.suggested_replies) ? data.suggested_replies : []);
    } catch (_err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble processing that right now. Please try again later.",
          workflow: null,
        },
      ]);
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }

  React.useEffect(() => {
    function onBeforeInstall(e) { e.preventDefault(); setDeferredPrompt(e); setShowInstall(true); }
    function onAppInstalled() { setDeferredPrompt(null); setShowInstall(false); }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  React.useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  function handleInstallClick() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { setDeferredPrompt(null); setShowInstall(false); });
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "16px",
        padding: "20px",
        minHeight: "100vh",
        maxWidth: "1400px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* LEFT SIDEBAR */}
      <Sidebar darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

      {/* CENTRAL CHAT PANEL */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          background: "var(--surface)",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border)",
        }}
      >
        {/* ── Chat Header ── */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
            flexShrink: 0,
          }}
        >
          {/* Left: back + agent info */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button
              id="back-btn"
              aria-label="Go back"
              style={{
                width: "34px",
                height: "34px",
                border: "1.5px solid var(--border)",
                borderRadius: "8px",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-secondary)",
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={16} />
            </button>

            {/* Agent avatar */}
            <div className="agent-avatar-ring">
              <img
                src="/agent-avatar.png"
                alt="CX Assistant Customer Care Agent"
                onError={(e) => {
                  // Fallback: initials avatar
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.style.background = "linear-gradient(135deg, #7c3aed, #5b21b6)";
                  e.currentTarget.parentElement.style.display = "flex";
                  e.currentTarget.parentElement.style.alignItems = "center";
                  e.currentTarget.parentElement.style.justifyContent = "center";
                  e.currentTarget.parentElement.innerHTML = `<span style="color:#fff;font-size:0.8rem;font-weight:700">CX</span>`;
                }}
              />
            </div>

            {/* Agent name & status */}
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", lineHeight: 1.2 }}>
                CX Assistant
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                Customer Care Agent
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
                <span className="online-dot" />
                <span style={{ fontSize: "0.72rem", color: "#16a34a", fontWeight: 500 }}>
                  Online · Ready to help
                </span>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {showInstall && (
              <button
                onClick={handleInstallClick}
                style={{
                  padding: "7px 14px",
                  border: "1.5px solid var(--border)",
                  borderRadius: "8px",
                  background: "transparent",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                Install App
              </button>
            )}
            <button
              id="more-options-btn"
              aria-label="More options"
              style={{
                width: "34px",
                height: "34px",
                border: "1.5px solid var(--border)",
                borderRadius: "8px",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              <MoreHorizontal size={16} />
            </button>
            <button
              id="end-chat-btn"
              className="end-chat-btn"
              aria-label="End chat session"
            >
              End Chat
            </button>
          </div>
        </header>

        {/* ── Messages Area ── */}
        <div
          ref={listRef}
          role="log"
          aria-live="polite"
          aria-label="Chat conversation"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            background: "var(--surface-alt)",
            minHeight: 0,
          }}
        >
          {/* Date separator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500, whiteSpace: "nowrap" }}>
              Today
            </span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          </div>

          {messages.map((message, index) => (
            <ChatMessage key={`${message.role}-${index}`} message={message} />
          ))}

          {/* Quick replies */}
          {!isLoading && quickReplies.length > 0 && (
            <QuickReplies suggestions={quickReplies} onSelect={handleSend} />
          )}

          {/* Typing indicator */}
          {isLoading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                CX
              </div>
              <div
                style={{
                  background: "var(--agent-bubble)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px 18px 18px 18px",
                  padding: "14px 18px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div className="typing-dots" style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Input Area ── */}
        <div
          style={{
            padding: "16px 24px 20px",
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            flexShrink: 0,
          }}
        >
          <ChatInput disabled={isLoading} onSend={handleSend} />
        </div>
      </div>

      {/* RIGHT INFO PANEL */}
      <RightPanel />
    </div>
  );
}
