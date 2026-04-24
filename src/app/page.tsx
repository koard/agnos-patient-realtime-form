import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, Monitor, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Agnos Patient Portal",
  description:
    "Real-time patient registration and staff monitoring system by Agnos.",
};

/**
 * Landing page — links to Patient Form and Staff View.
 * Useful for demo navigation.
 */
export default function HomePage() {
  const sessionId = "demo";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-200">
          <Activity className="w-6 h-6" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 leading-tight">
            Agnos
          </h1>
          <p className="text-xs text-slate-500 leading-tight">
            Patient Realtime Form
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-center text-slate-500 text-sm max-w-sm mb-10 leading-relaxed">
        A real-time patient registration system. Open both views side-by-side to
        see live synchronization in action.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <Link
          href={`/patient?sessionId=${sessionId}`}
          className="group flex flex-col gap-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          aria-label="Open Patient Form (demo session)"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 text-sm mb-0.5">
              Patient Form
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fill in personal and contact information
            </p>
          </div>
          <span className="mt-auto flex items-center gap-1 text-xs font-medium text-teal-600">
            Open Form <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </span>
        </Link>

        <Link
          href={`/staff?sessionId=${sessionId}`}
          className="group flex flex-col gap-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          aria-label="Open Staff Dashboard (demo session)"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 text-sm mb-0.5">
              Staff Dashboard
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Monitor patient data in real time
            </p>
          </div>
          <span className="mt-auto flex items-center gap-1 text-xs font-medium text-indigo-600">
            Open Dashboard <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </span>
        </Link>
      </div>

      {/* Demo note */}
      <p className="mt-8 text-xs text-slate-400 text-center">
        Both views default to session ID:{" "}
        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
          demo
        </code>{" "}
        — append{" "}
        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
          ?sessionId=xyz
        </code>{" "}
        to isolate sessions.
      </p>
    </div>
  );
}
