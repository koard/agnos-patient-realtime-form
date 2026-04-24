import { Users, MonitorSmartphone } from "lucide-react";

/**
 * Shown in the staff dashboard before any patient data arrives.
 */
export function StaffEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
          <Users className="w-9 h-9 text-slate-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
          <MonitorSmartphone className="w-4 h-4 text-teal-600" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-slate-700 mb-2">
        Waiting for Patient
      </h2>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
        No patient data received yet. As soon as the patient starts filling in
        the form, their information will appear here in real time.
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        Listening for updates…
      </div>
    </div>
  );
}
