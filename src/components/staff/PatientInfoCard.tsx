import { Clock, CheckCircle2, Pencil } from "lucide-react";
import type { PatientFormData } from "@/types/patient";
import { Card } from "@/components/shared/Card";
import { formatDate, formatLastUpdated } from "@/lib/utils/formatDate";
import { cn } from "@/lib/utils/cn";

interface PatientInfoCardProps {
  data: PatientFormData;
  isTyping: boolean;
  activeField: string | null;
  lastUpdated: string | null;
}

interface FieldRowProps {
  label: string;
  value: string | undefined | null;
  /** Highlights this row if the patient is currently editing it */
  isActive?: boolean;
}

function FieldRow({ label, value, isActive = false }: FieldRowProps) {
  const isEmpty = !value || value.trim() === "";
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2.5 px-4 rounded-lg transition-colors duration-200",
        isActive && "bg-teal-50 ring-1 ring-teal-200"
      )}
    >
      <dt className="text-xs font-medium text-slate-500 sm:w-40 flex-shrink-0 pt-0.5">
        {label}
        {isActive && (
          <span className="ml-1.5 inline-flex items-center gap-0.5 text-teal-600">
            <Pencil className="w-3 h-3" aria-hidden="true" />
            <span className="sr-only">(patient is typing)</span>
          </span>
        )}
      </dt>
      <dd
        className={cn(
          "text-sm font-medium break-words",
          isEmpty ? "text-slate-300 italic font-normal" : "text-slate-800"
        )}
      >
        {isEmpty ? "Not provided" : value}
      </dd>
    </div>
  );
}

/**
 * Displays all patient form data in a scannable card layout.
 * Highlights the field the patient is currently editing.
 */
export function PatientInfoCard({
  data,
  isTyping,
  activeField,
  lastUpdated,
}: PatientInfoCardProps) {
  const isSubmitted = data.status === "submitted";

  return (
    <div className="space-y-4">
      {/* Status banner */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
          isSubmitted
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : isTyping
            ? "bg-amber-50 text-amber-700 border border-amber-200"
            : "bg-slate-50 text-slate-600 border border-slate-200"
        )}
        role="status"
        aria-live="polite"
      >
        {isSubmitted ? (
          <>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>Patient has submitted the form</span>
          </>
        ) : isTyping ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" aria-hidden="true" />
            <span>
              Patient is actively filling the form
              {activeField && (
                <span className="font-normal opacity-75"> · {activeField}</span>
              )}
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0" aria-hidden="true" />
            <span>Patient form in draft</span>
          </>
        )}

        {/* Last updated */}
        {lastUpdated && (
          <span className="ml-auto flex items-center gap-1 text-xs font-normal opacity-70 flex-shrink-0">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {formatLastUpdated(lastUpdated)}
          </span>
        )}
      </div>

      {/* ── Section 1: Personal Information ─────────────────────────────── */}
      <Card noPadding>
        <SectionHeader step={1} title="Personal Information" />
        <dl className="divide-y divide-slate-50">
          <FieldRow label="First Name" value={data.firstName} isActive={activeField === "firstName"} />
          <FieldRow label="Middle Name" value={data.middleName} isActive={activeField === "middleName"} />
          <FieldRow label="Last Name" value={data.lastName} isActive={activeField === "lastName"} />
          <FieldRow label="Date of Birth" value={formatDate(data.dateOfBirth)} isActive={activeField === "dateOfBirth"} />
          <FieldRow label="Gender" value={capitalise(data.gender)} isActive={activeField === "gender"} />
          <FieldRow label="Nationality" value={data.nationality} isActive={activeField === "nationality"} />
        </dl>
      </Card>

      {/* ── Section 2: Contact Information ──────────────────────────────── */}
      <Card noPadding>
        <SectionHeader step={2} title="Contact Information" />
        <dl className="divide-y divide-slate-50">
          <FieldRow label="Phone Number" value={data.phoneNumber} isActive={activeField === "phoneNumber"} />
          <FieldRow label="Email" value={data.email} isActive={activeField === "email"} />
          <FieldRow label="Address" value={data.address} isActive={activeField === "address"} />
        </dl>
      </Card>

      {/* ── Section 3: Additional Information ───────────────────────────── */}
      <Card noPadding>
        <SectionHeader step={3} title="Additional Information" />
        <dl className="divide-y divide-slate-50">
          <FieldRow
            label="Preferred Language"
            value={capitalise(data.preferredLanguage)}
            isActive={activeField === "preferredLanguage"}
          />
          <FieldRow label="Religion" value={data.religion} isActive={activeField === "religion"} />
        </dl>
      </Card>

      {/* ── Section 4: Emergency Contact ────────────────────────────────── */}
      <Card noPadding>
        <SectionHeader step={4} title="Emergency Contact" />
        <dl className="divide-y divide-slate-50">
          <FieldRow
            label="Name"
            value={data.emergencyContact?.name}
            isActive={activeField === "emergencyContact.name"}
          />
          <FieldRow
            label="Relationship"
            value={capitalise(data.emergencyContact?.relationship)}
            isActive={activeField === "emergencyContact.relationship"}
          />
        </dl>
      </Card>
    </div>
  );
}

// ─── Local Helpers ─────────────────────────────────────────────────────────────

function SectionHeader({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/70">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-semibold">
        {step}
      </span>
      <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );
}

function capitalise(str: string | undefined | null): string | undefined {
  if (!str) return undefined;
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
}
