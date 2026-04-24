"use client";

import { FormProvider } from "react-hook-form";
import { CheckCircle2, RotateCcw, Send, ExternalLink } from "lucide-react";
import Link from "next/link";

import { usePatientForm } from "@/hooks/usePatientForm";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { FormSection } from "./FormSection";
import {
  InputField,
  SelectField,
  TextareaField,
} from "./FormField";
import { Button } from "@/components/shared/Button";
import { ConnectionStatus } from "@/components/shared/ConnectionStatus";
import { SyncStatus } from "@/components/shared/SyncStatus";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormProgress } from "./FormProgress";
import {
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  RELATIONSHIP_OPTIONS,
} from "@/lib/validation/patientSchema";

// ─── Required field labels for progress calculation ────────────────────────────
const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "gender",
  "phoneNumber",
  "email",
  "address",
  "preferredLanguage",
  "nationality",
] as const;

interface PatientFormProps {
  sessionId: string;
}

/**
 * Patient form — all sections, validation, real-time sync, and submission state.
 * Business logic lives in usePatientForm; this component is purely presentational.
 */
export function PatientForm({ sessionId }: PatientFormProps) {
  const { form, syncStatus, formStatus, onSubmit, onReset, isSubmitting } =
    usePatientForm(sessionId);
  const { connectionState } = useConnectionStatus(sessionId);

  const watchedValues = form.watch();

  // Calculate progress: count non-empty required fields
  const filledCount = REQUIRED_FIELDS.filter((f) => {
    const val = watchedValues[f as keyof typeof watchedValues];
    return typeof val === "string" && val.trim().length > 0;
  }).length;
  const progressPct = Math.round((filledCount / REQUIRED_FIELDS.length) * 100);

  // ─── Success State ──────────────────────────────────────────────────────────
  if (formStatus === "submitted") {
    return (
      <div className="min-h-screen bg-slate-50">
        <PageHeader
          title="Patient Registration"
          subtitle={`Session: ${sessionId}`}
          rightSlot={
            <Link
              href={`/staff?sessionId=${sessionId}`}
              target="_blank"
              className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium"
            >
              Staff View <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </Link>
          }
        />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Registration Submitted
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Your information has been received. A staff member will review it
            shortly.
          </p>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onReset}
          >
            Start New Registration
          </Button>
        </div>
      </div>
    );
  }

  // ─── Form State ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Patient Registration"
        subtitle={`Session: ${sessionId}`}
        rightSlot={
          <div className="flex items-center gap-2">
            <SyncStatus status={syncStatus} />
            <ConnectionStatus state={connectionState} />
            <Link
              href={`/staff?sessionId=${sessionId}`}
              target="_blank"
              className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium hidden sm:flex"
            >
              Staff View <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        }
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-16">
        {/* Progress bar */}
        <FormProgress percent={progressPct} filledCount={filledCount} totalCount={REQUIRED_FIELDS.length} />

        {/* Form */}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            aria-label="Patient registration form"
            className="space-y-4 mt-5"
          >
            {/* ── Section 1: Personal Information ─────────────────────────── */}
            <FormSection
              step={1}
              title="Personal Information"
              description="Basic identification details"
            >
              <InputField
                name="firstName"
                label="First Name"
                required
                placeholder="e.g. John"
                autoComplete="given-name"
              />
              <InputField
                name="middleName"
                label="Middle Name"
                placeholder="Optional"
                autoComplete="additional-name"
              />
              <InputField
                name="lastName"
                label="Last Name"
                required
                placeholder="e.g. Smith"
                autoComplete="family-name"
              />
              <InputField
                name="dateOfBirth"
                label="Date of Birth"
                required
                type="date"
                autoComplete="bday"
              />
              <SelectField
                name="gender"
                label="Gender"
                required
                options={GENDER_OPTIONS}
                placeholder="Select gender…"
              />
              <InputField
                name="nationality"
                label="Nationality"
                required
                placeholder="e.g. Thai"
                autoComplete="country-name"
              />
            </FormSection>

            {/* ── Section 2: Contact Information ───────────────────────────── */}
            <FormSection
              step={2}
              title="Contact Information"
              description="How we can reach you"
            >
              <InputField
                name="phoneNumber"
                label="Phone Number"
                required
                type="tel"
                placeholder="e.g. +66 81 234 5678"
                autoComplete="tel"
              />
              <InputField
                name="email"
                label="Email Address"
                required
                type="email"
                placeholder="e.g. john@example.com"
                autoComplete="email"
              />
              <TextareaField
                name="address"
                label="Address"
                required
                placeholder="Full address including city and postal code"
                fullWidth
                rows={3}
              />
            </FormSection>

            {/* ── Section 3: Additional Information ───────────────────────── */}
            <FormSection
              step={3}
              title="Additional Information"
              description="Help us serve you better"
            >
              <SelectField
                name="preferredLanguage"
                label="Preferred Language"
                required
                options={LANGUAGE_OPTIONS}
                placeholder="Select language…"
              />
              <InputField
                name="religion"
                label="Religion"
                placeholder="Optional"
              />
            </FormSection>

            {/* ── Section 4: Emergency Contact ─────────────────────────────── */}
            <FormSection
              step={4}
              title="Emergency Contact"
              description="Optional — person to contact in case of emergency"
            >
              <InputField
                name="emergencyContact.name"
                label="Contact Name"
                placeholder="Full name"
                autoComplete="name"
              />
              <SelectField
                name="emergencyContact.relationship"
                label="Relationship"
                options={RELATIONSHIP_OPTIONS}
                placeholder="Select relationship…"
              />
            </FormSection>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-400">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  onClick={onReset}
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                  aria-label="Submit patient registration"
                >
                  Submit Registration
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </main>
    </div>
  );
}
