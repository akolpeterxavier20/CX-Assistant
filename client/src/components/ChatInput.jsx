import React, { useState } from "react";
import { SendHorizonal } from "lucide-react";

export default function ChatInput({ disabled, onSend }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const message = value.trim();
    if (!message || disabled) return;
    onSend(message);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-t border-slate-200 pt-4"
    >
      <label htmlFor="chat-message" className="sr-only">
        How can we help you today?
      </label>
      <input
        id="chat-message"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        placeholder="How can we help you today?"
        className="min-h-12 flex-1 rounded-md border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-medium text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300"
        aria-label="Send message"
      >
        <SendHorizonal size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Send</span>
      </button>
    </form>
  );
}
