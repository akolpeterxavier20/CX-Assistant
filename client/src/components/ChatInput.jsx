import React, { useRef, useState } from "react";
import { SendHorizonal, Paperclip, Smile } from "lucide-react";

export default function ChatInput({ disabled, onSend }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  function autoResize() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }

  function handleChange(e) {
    setValue(e.target.value);
    autoResize();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const msg = value.trim();
    if (!msg || disabled) return;
    onSend(msg);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <div className="chat-input-wrap">
        {/* Icon buttons */}
        <button type="button" className="chat-icon-btn" aria-label="Attach file" id="attach-file-btn">
          <Paperclip size={17} />
        </button>
        <button type="button" className="chat-icon-btn" aria-label="Emoji" id="emoji-btn">
          <Smile size={17} />
        </button>

        {/* Text input */}
        <textarea
          ref={textareaRef}
          id="chat-message-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type your message here..."
          rows={1}
          className="chat-textarea"
          aria-label="Chat message input"
          style={{ paddingTop: "8px" }}
        />

        {/* Send button */}
        <button
          type="submit"
          id="send-message-btn"
          className="send-btn"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <SendHorizonal size={17} />
        </button>
      </div>

      <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
        Press Enter to send · Shift+Enter for new line
      </p>
    </form>
  );
}
