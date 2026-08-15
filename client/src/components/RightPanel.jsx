import React from "react";

export default function RightPanel() {
  return (
    <aside className="hidden lg:flex lg:w-80 flex-col gap-4 p-4">
      <div className="rounded-md bg-white p-4 shadow-sm">
        <h3 className="font-semibold">About CX Assistant</h3>
        <p className="text-sm text-slate-600 mt-2">I'm your AI-powered customer service assistant. I can help you find the right solutions, forms, and information quickly.</p>
      </div>

      <div className="rounded-md bg-white p-4 shadow-sm">
        <h4 className="font-semibold">I can help you with:</h4>
        <ul className="mt-2 text-sm text-slate-600 space-y-1">
          <li>Applications & Forms</li>
          <li>Services & Support</li>
          <li>General Information</li>
          <li>FAQs & Guidance</li>
        </ul>
      </div>

      <div className="rounded-md bg-white p-4 shadow-sm">
        <h4 className="font-semibold">Popular Requests</h4>
        <ul className="mt-2 text-sm text-slate-600 space-y-1">
          <li>Apply for bike loan</li>
          <li>Application status</li>
          <li>General inquiries</li>
          <li>Contact support</li>
        </ul>
      </div>

      <div className="mt-auto rounded-md bg-emerald-600 text-white p-4 text-center">
        <div className="font-semibold">Need human support?</div>
        <div className="text-sm mt-2">Our team is ready to help you if you need assistance.</div>
        <button className="mt-3 bg-white text-emerald-700 px-4 py-2 rounded-md font-semibold">Contact Support</button>
      </div>
    </aside>
  );
}
