import React from "react";
import { ExternalLink } from "lucide-react";

export default function ActionButton({ action }) {
  if (!action?.url || !action?.label) return null;

  return (
    <a
      href={action.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
    >
      <ExternalLink size={16} aria-hidden="true" />
      {action.label}
    </a>
  );
}
