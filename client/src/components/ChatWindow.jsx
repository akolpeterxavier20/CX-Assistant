import React, { useMemo, useRef, useState } from "react";
import { Bot, Loader2 } from "lucide-react";
import ChatInput from "./ChatInput.jsx";
import ChatMessage from "./ChatMessage.jsx";

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

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6">
      <header className="flex items-center gap-3 border-b border-slate-200 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-700 text-white">
          <Bot size={24} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">CX Assistant</h1>
          <p className="text-sm text-slate-600">Customer Experience Assistant</p>
        </div>
      </header>

      <div
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto py-6"
        aria-live="polite"
      >
        {messages.map((message, index) => (
          <ChatMessage key={`${message.role}-${index}`} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            CX is checking the approved workflow
          </div>
        )}
      </div>

      <ChatInput disabled={isLoading} onSend={handleSend} />
    </section>
  );
}
