import React from "react";
import ChatWindow from "./components/ChatWindow.jsx";
import "./styles.css";

export default function App() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--surface-alt)" }}>
      <ChatWindow />
    </main>
  );
}
