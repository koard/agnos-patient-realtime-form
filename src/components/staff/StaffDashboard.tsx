"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check, RefreshCw } from "lucide-react";
import Link from "next/link";

import { useRealtimePatient } from "@/hooks/useRealtimePatient";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConnectionStatus } from "@/components/shared/ConnectionStatus";
import { PatientInfoCard } from "./PatientInfoCard";
import { StaffEmptyState } from "./StaffEmptyState";
import { Button } from "@/components/shared/Button";

interface StaffDashboardProps {
  sessionId: string;
}

/**
 * Staff monitoring dashboard — subscribes to realtime patient events
 * and renders a live-updating view of all patient data.
 */
export function StaffDashboard({ sessionId }: StaffDashboardProps) {
  const { patientData, isTyping, activeField, lastUpdated, connectionState } =
    useRealtimePatient(sessionId);

  const [copied, setCopied] = useState(false);

  // ─── Copy summary to clipboard ─────────────────────────────────────────────
  async function handleCopy() {
    if (!patientData) return;
    const summary = [
      `Patient Summary — Session: ${sessionId}`,
      `Status: ${patientData.status}`,
      `Name: ${[patientData.firstName, patientData.middleName, patientData.lastName].filter(Boolean).join(" ")}`,
      `Date of Birth: ${patientData.dateOfBirth}`,
      `Gender: ${patientData.gender}`,
      `Phone: ${patientData.phoneNumber}`,
      `Email: ${patientData.email}`,
      `Address: ${patientData.address}`,
      `Language: ${patientData.preferredLanguage}`,
      `Nationality: ${patientData.nationality}`,
      patientData.religion ? `Religion: ${patientData.religion}` : null,
      patientData.emergencyContact?.name
        ? `Emergency Contact: ${patientData.emergencyContact.name} (${patientData.emergencyContact.relationship ?? "—"})`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Staff Dashboard"
        subtitle={`Monitoring session: ${sessionId}`}
        rightSlot={
          <div className="flex items-center gap-2">
            <ConnectionStatus state={connectionState} />
            <Link
              href={`/patient?sessionId=${sessionId}`}
              target="_blank"
              className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium hidden sm:flex"
            >
              Patient View <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        }
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-16">
        {/* Top action bar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Live Patient Data
            </h2>
            <p className="text-xs text-slate-500">
              Updates in real time as the patient types
            </p>
          </div>
          {patientData && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={
                  copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )
                }
                onClick={handleCopy}
                aria-label="Copy patient summary to clipboard"
              >
                {copied ? "Copied!" : "Copy Summary"}
              </Button>
            </div>
          )}
        </div>

        {/* Disconnected / reconnecting banner */}
        {(connectionState === "disconnected" ||
          connectionState === "failed" ||
          connectionState === "suspended") && (
          <div
            role="alert"
            className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-700"
          >
            <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin" aria-hidden="true" />
            <span>
              Connection lost. Attempting to reconnect… Patient data shown may
              be out of date.
            </span>
          </div>
        )}

        {/* Content */}
        {!patientData ? (
          <StaffEmptyState />
        ) : (
          <PatientInfoCard
            data={patientData}
            isTyping={isTyping}
            activeField={activeField}
            lastUpdated={lastUpdated}
          />
        )}
      </main>
    </div>
  );
}
