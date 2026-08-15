import React from "react";
import ActionButton from "./ActionButton.jsx";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <article className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[min(78%,42rem)] rounded-md px-4 py-3 shadow-sm ${
          isUser
            ? "bg-slate-900 text-white"
            : "border border-slate-200 bg-white text-slate-900"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
        {!isUser && message.workflow?.action && (
          <div className="mt-3">
            <ActionButton action={message.workflow.action} />
          </div>
        )}
      </div>
    </article>
  );
}
