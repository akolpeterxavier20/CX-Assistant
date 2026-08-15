import React, { useMemo, useRef, useState } from "react";
import { ArrowLeft, MoreHorizontal, Trash2, Download, RefreshCw, HelpCircle } from "lucide-react";
import ChatInput from "./ChatInput.jsx";
import ChatMessage from "./ChatMessage.jsx";
import QuickReplies from "./QuickReplies.jsx";
import Sidebar from "./Sidebar.jsx";
import RightPanel from "./RightPanel.jsx";
import ApplicationModal from "./ApplicationModal.jsx";
import SupportModal from "./SupportModal.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/chat";

/** Clean initial greeting for fresh user session */
const initialMessages = [
  {
    role: "assistant",
    content: "Hello! Welcome to CX Assistant. My name is Alex and I'm here to help you today. 😊\n\nHow can I assist you with Union motorcycle financing or customer services?",
    workflow: null,
  },
];

export default function ChatWindow() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  
  // Modals state
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const [quickReplies, setQuickReplies] = useState([
    "Apply for a bike loan",
    "Application status",
    "Contact support",
  ]);
  const listRef = useRef(null);

  const conversation = useMemo(
    () => messages.map(({ role, content }) => ({ role, content })),
    [messages]
  );

  function resetConversation() {
    setMessages([
      {
        role: "assistant",
        content: "Hello! Welcome to CX Assistant. My name is Alex. How can I assist you today?",
        workflow: null,
      },
    ]);
    setQuickReplies(["Apply for a bike loan", "Application status", "Contact support"]);
    setSessionEnded(false);
  }

  async function handleSend(text) {
    if (sessionEnded) setSessionEnded(false);
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
          content: "Thank you for your request. An official application form link is available below or our human support team can follow up with you.",
          workflow: {
            action: {
              url: "https://union-bike-loans.vercel.app/",
              label: "Open Bike Loan Application ↗",
              title: "Apply for a Union Bike Loan",
              description: "Complete the official application form to get started with your motorcycle financing.",
            },
          },
        },
      ]);
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }

  function handleLoanFormSuccess(data) {
    const confirmationMsg = {
      role: "assistant",
      content: `🎉 Thank you, ${data.fullName || "Applicant"}! Your Union Bike Loan application (#UB-9482) for ${data.loanAmount || "financing"} has been submitted successfully.\n\nOur loan review team will process your details and reach out to you via ${data.phone || "phone"}.`,
      workflow: null,
    };
    setMessages((prev) => [...prev, confirmationMsg]);
  }

  function handleSupportCallbackSuccess() {
    const confirmationMsg = {
      role: "assistant",
      content: "📞 Callback request received! A Union Customer Care representative has been notified and will call you within 5 minutes.",
      workflow: null,
    };
    setMessages((prev) => [...prev, confirmationMsg]);
  }

  function exportTranscript() {
    const text = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cx-assistant-transcript-${Date.now()}.txt`;
    a.click();
    setShowMenu(false);
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
      {/* Interactive Modals */}
      <ApplicationModal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        onSubmitSuccess={handleLoanFormSuccess}
      />

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onRequestCallBack={handleSupportCallbackSuccess}
      />

      {/* LEFT SIDEBAR */}
      <Sidebar
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        onNewConversation={resetConversation}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
        onSendQuery={handleSend}
      />

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
            position: "relative",
          }}
        >
          {/* Left: back + agent info */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button
              id="back-btn"
              onClick={resetConversation}
              aria-label="New session / Back"
              title="Reset conversation"
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
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

            {/* Options Dropdown Menu */}
            <button
              id="more-options-btn"
              onClick={() => setShowMenu((prev) => !prev)}
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

            {showMenu && (
              <div
                className="msg-enter"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  width: "180px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow-md)",
                  padding: "6px",
                  zIndex: 200,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <button
                  onClick={resetConversation}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "8px 10px",
                    border: "none",
                    background: "none",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <Trash2 size={14} /> Clear Chat
                </button>
                <button
                  onClick={exportTranscript}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "8px 10px",
                    border: "none",
                    background: "none",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <Download size={14} /> Export Transcript
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setIsSupportModalOpen(true);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "8px 10px",
                    border: "none",
                    background: "none",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <HelpCircle size={14} /> Help &amp; Support
                </button>
              </div>
            )}

            <button
              id="end-chat-btn"
              onClick={() => setSessionEnded(true)}
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500, whiteSpace: "nowrap" }}>
              Today
            </span>
            <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          </div>

          {messages.map((message, index) => (
            <ChatMessage
              key={`${message.role}-${index}`}
              message={message}
              onOpenLoanModal={() => setIsLoanModalOpen(true)}
            />
          ))}

          {/* Quick replies */}
          {!isLoading && !sessionEnded && quickReplies.length > 0 && (
            <QuickReplies suggestions={quickReplies} onSelect={handleSend} />
          )}

          {/* Typing indicator */}
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  paddingLeft: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                CX Assistant is typing...
              </div>
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderLeft: "4px solid var(--accent)",
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

          {/* Session Ended Banner */}
          {sessionEnded && (
            <div
              className="msg-enter"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "18px",
                textAlign: "center",
                margin: "12px 0",
              }}
            >
              <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", margin: "0 0 6px" }}>
                Chat session ended
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0 0 12px" }}>
                Thank you for contacting Union Customer Care. How was your support experience?
              </p>
              <button
                onClick={resetConversation}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                <RefreshCw size={14} /> Start New Session
              </button>
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
          <ChatInput disabled={isLoading || sessionEnded} onSend={handleSend} />
        </div>
      </div>

      {/* RIGHT INFO PANEL */}
      <RightPanel
        onSendQuery={handleSend}
        onOpenLoanModal={() => setIsLoanModalOpen(true)}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
      />
    </div>
  );
}
