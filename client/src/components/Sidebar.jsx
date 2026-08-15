import React from "react";
import { Bot } from "lucide-react";

export default function Sidebar({ darkMode, onToggleDark }) {
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 gap-6">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-slate-900">
          <img src="/icon-192.svg" alt="Uma" className="h-10 w-10 rounded-full" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">CX Assistant</h2>
          <p className="text-xs opacity-90">Customer Experience Assistant</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <button className="text-sm rounded-md bg-white/10 px-3 py-2 text-white text-left">New Conversation</button>
        <button className="text-sm rounded-md px-3 py-2 text-white text-left hover:bg-white/5">Conversations</button>
        <button className="text-sm rounded-md px-3 py-2 text-white text-left hover:bg-white/5">Help & FAQs</button>
        <button className="text-sm rounded-md px-3 py-2 text-white text-left hover:bg-white/5">About CX Assistant</button>
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <div className="rounded-md bg-white/6 p-3 text-sm">
          <strong>Your data is safe</strong>
          <div className="text-xs opacity-90 mt-1">We follow strict security practices to keep your information confidential.</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">Dark mode</div>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={darkMode} onChange={onToggleDark} className="sr-only" />
            <span className="w-10 h-5 bg-white/10 rounded-full relative inline-block" />
          </label>
        </div>

        <div className="text-xs opacity-80">© 2026 CX Assistant</div>
      </div>
    </aside>
  );
}
