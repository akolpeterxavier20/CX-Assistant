import React from "react";
import { ExternalLink } from "lucide-react";

export default function ActionButton({ action, large = false }) {
  if (!action?.url || !action?.label) return null;

  const base = "inline-flex items-center gap-2 rounded-md text-sm font-semibold text-white transition focus:outline-none focus:ring-2";
  const sizeClass = large ? "w-full justify-center px-5 py-3 text-base" : "px-4 py-2";
  const bgClass = "bg-gradient-to-r from-purple-600 to-purple-500 hover:scale-105 transform-gpu";

  return (
    <a
      href={action.url}
      target="_blank"
      rel="noreferrer"
      className={`${base} ${sizeClass} ${bgClass} shadow-md focus:ring-emerald-200`}>
      <ExternalLink size={16} aria-hidden="true" />
      {action.label}
    </a>
  );
}
