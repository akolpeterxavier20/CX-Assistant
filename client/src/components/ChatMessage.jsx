import React from "react";
import ActionButton from "./ActionButton.jsx";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <article className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mr-3 mt-1 flex-shrink-0">
          <div className="h-9 w-9 rounded-md bg-emerald-600 text-white flex items-center justify-center font-semibold">U</div>
        </div>
      )}

      <div className={`max-w-[min(78%,42rem)] ${isUser ? "ml-3" : ""}`}>
        <div
          className={`rounded-xl px-4 py-3 shadow-sm ${
            isUser
              ? "bg-slate-900 text-white rounded-br-lg"
              : "bg-white text-slate-900 border border-slate-100 rounded-bl-lg"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
          {!isUser && message.workflow?.action && (
            <div className="mt-4">
              <ActionButton action={message.workflow.action} large />
            </div>
          )}
        </div>
        <div className={`mt-2 text-xs ${isUser ? "text-right text-slate-500" : "text-left text-slate-400"}`} />
      </div>
    </article>
  );
}
