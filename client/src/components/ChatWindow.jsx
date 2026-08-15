import React, { useMemo, useRef, useState } from "react";
import { Bot } from "lucide-react";
import ChatInput from "./ChatInput.jsx";
import ChatMessage from "./ChatMessage.jsx";
import QuickReplies from "./QuickReplies.jsx";
import Sidebar from "./Sidebar.jsx";
import RightPanel from "./RightPanel.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/chat";

const initialMessages = [
  {
    role: "assistant",
    content: "Hello. How can we help you today?",
    workflow: null
  }
];

export default function ChatWindow() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [quickReplies, setQuickReplies] = useState(["Apply for a bike loan", "How do I apply?"]);
  const listRef = useRef(null);

  const conversation = useMemo(
    () => messages.map(({ role, content }) => ({ role, content })),
    [messages]
  );

  async function handleSend(text) {
    const userMessage = { role: "user", content: text, workflow: null };
    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversation })
      });

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.message || "Sorry, I'm having trouble processing that right now. Please try again.",
          workflow: data.workflow || null
        }
      ]);
    } catch (_error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble processing that right now. Please try again.",
          workflow: null
        }
      ]);
    } finally {
      setIsLoading(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }

  React.useEffect(() => {
    function onBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    }

    function onAppInstalled() {
      setDeferredPrompt(null);
      setShowInstall(false);
    }

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
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setShowInstall(false);
    });
  }

  return (
    <section className="min-h-screen w-full bg-transparent px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-7xl grid grid-cols-1 md:grid-cols-[240px,1fr,320px] gap-6">
        <Sidebar darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-lg ring-1 ring-slate-100 overflow-hidden flex flex-col">
          <header className="flex items-center justify-between gap-4 px-6 py-5 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
              <Bot size={24} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">CX Assistant</h1>
              <p className="text-xs opacity-90">Customer Experience Assistant — Uma</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {showInstall && (
                <button
                  onClick={handleInstallClick}
                  aria-label="Install app"
                  className="rounded-md bg-white/20 px-3 py-1 text-sm"
                >
                  Install
                </button>
              )}
              <button
                onClick={() => setDarkMode((d) => !d)}
                aria-label="Toggle dark mode"
                className="rounded-md bg-white/10 px-2 py-1 text-sm"
              >
                {darkMode ? "Light" : "Dark"}
              </button>
            </div>
            <button className="rounded-md bg-white/20 px-3 py-1 text-sm">End Chat</button>
          </div>
        </header>

          <div className="flex flex-col h-[70vh]">
            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto p-6" aria-live="polite">
              {messages.map((message, index) => (
                <ChatMessage key={`${message.role}-${index}`} message={message} />
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-md bg-emerald-700/10" />
                  <div className="rounded-md bg-white/80 px-4 py-2 shadow-sm">
                    <div className="typing-dots flex items-center gap-1 px-1 py-1">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-6 py-4">
              <ChatInput disabled={isLoading} onSend={handleSend} />
            </div>
          </div>
        </div>

        <RightPanel />
      </div>
    </section>
  );
}
