import React, { useRef, useState } from "react";
import { SendHorizonal, Paperclip, Smile, X, FileText } from "lucide-react";

const EMOJIS = ["👍", "😊", "🚲", "📄", "💳", "❓", "🙏", "⭐", "💼", "🤝"];

export default function ChatInput({ disabled, onSend }) {
  const [value, setValue] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

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

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file.name);
    }
  }

  function submit() {
    let msg = value.trim();
    if (attachment) {
      msg = msg ? `[Attached File: ${attachment}]\n${msg}` : `[Attached File: ${attachment}]`;
    }
    if (!msg || disabled) return;
    onSend(msg);
    setValue("");
    setAttachment(null);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          className="msg-enter"
          style={{
            position: "absolute",
            bottom: "100%",
            left: "14px",
            marginBottom: "8px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "10px 12px",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            gap: "8px",
            zIndex: 100,
          }}
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setValue((prev) => prev + emoji);
                setShowEmojiPicker(false);
                textareaRef.current?.focus();
              }}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "2px 4px",
                borderRadius: "6px",
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Tag */}
      {attachment && (
        <div
          style={{
            alignSelf: "flex-start",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(124,58,237,0.12)",
            color: "var(--accent)",
            fontSize: "0.78rem",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "8px",
            border: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          <FileText size={13} />
          <span>{attachment}</span>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", padding: 0 }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Input container */}
      <div className="chat-input-wrap">
        {/* Icon buttons */}
        <button
          type="button"
          className="chat-icon-btn"
          aria-label="Attach file"
          id="attach-file-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={17} />
        </button>

        <button
          type="button"
          className="chat-icon-btn"
          aria-label="Emoji"
          id="emoji-btn"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
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
          disabled={disabled || (!value.trim() && !attachment)}
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
