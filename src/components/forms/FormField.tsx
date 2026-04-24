"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils/cn";
import type { PatientFormValues } from "@/lib/validation/patientSchema";

// ─── Shared Props ──────────────────────────────────────────────────────────────

interface BaseFieldProps {
  /** Dot-path into PatientFormValues — e.g. "firstName" or "emergencyContact.name" */
  name: string;
  label: string;
  required?: boolean;
  className?: string;
  /** Spans both columns in the 2-col grid */
  fullWidth?: boolean;
}

// ─── Input Field ──────────────────────────────────────────────────────────────

interface InputFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  autoComplete?: string;
}

/**
 * Controlled text/email/tel/date input connected to React Hook Form context.
 * Shows error message on touch/submit and highlights border in red.
 */
export function InputField({
  name,
  label,
  required = false,
  type = "text",
  placeholder,
  autoComplete,
  className,
  fullWidth = false,
}: InputFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientFormValues>();

  // Navigate nested paths like "emergencyContact.name"
  const error = getNestedError(errors, name);

  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "sm:col-span-2", className)}>
      <label
        htmlFor={name}
        className="text-xs font-medium text-slate-600 flex items-center gap-1"
      >
        {label}
        {required && (
          <span className="text-red-500" aria-label="required">
            *
          </span>
        )}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={required}
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={!!error}
        className={cn(
          "h-10 px-3 rounded-lg border text-sm text-slate-800 bg-white",
          "placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
          "transition-colors duration-150",
          error
            ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
            : "border-slate-300 hover:border-slate-400"
        )}
        {...register(name as Parameters<typeof register>[0])}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">↑</span>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Select Field ─────────────────────────────────────────────────────────────

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends BaseFieldProps {
  options: readonly SelectOption[];
  placeholder?: string;
}

/**
 * Controlled <select> connected to React Hook Form context.
 */
export function SelectField({
  name,
  label,
  required = false,
  options,
  placeholder = "Select…",
  className,
  fullWidth = false,
}: SelectFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientFormValues>();

  const error = getNestedError(errors, name);

  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "sm:col-span-2", className)}>
      <label
        htmlFor={name}
        className="text-xs font-medium text-slate-600 flex items-center gap-1"
      >
        {label}
        {required && (
          <span className="text-red-500" aria-label="required">
            *
          </span>
        )}
      </label>
      <select
        id={name}
        aria-required={required}
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={!!error}
        className={cn(
          "h-10 px-3 rounded-lg border text-sm text-slate-800 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
          "transition-colors duration-150",
          "appearance-none cursor-pointer",
          error
            ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
            : "border-slate-300 hover:border-slate-400"
        )}
        {...register(name as Parameters<typeof register>[0])}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">↑</span>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Textarea Field ───────────────────────────────────────────────────────────

interface TextareaFieldProps extends BaseFieldProps {
  placeholder?: string;
  rows?: number;
}

/**
 * Controlled <textarea> for multi-line fields like address.
 */
export function TextareaField({
  name,
  label,
  required = false,
  placeholder,
  rows = 3,
  className,
  fullWidth = false,
}: TextareaFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientFormValues>();

  const error = getNestedError(errors, name);

  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "sm:col-span-2", className)}>
      <label
        htmlFor={name}
        className="text-xs font-medium text-slate-600 flex items-center gap-1"
      >
        {label}
        {required && (
          <span className="text-red-500" aria-label="required">
            *
          </span>
        )}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        aria-required={required}
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={!!error}
        className={cn(
          "px-3 py-2 rounded-lg border text-sm text-slate-800 bg-white resize-none",
          "placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
          "transition-colors duration-150",
          error
            ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
            : "border-slate-300 hover:border-slate-400"
        )}
        {...register(name as Parameters<typeof register>[0])}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">↑</span>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Traverses nested error objects using dot-path notation.
 * e.g. getNestedError(errors, "emergencyContact.name")
 */
function getNestedError(
  errors: Record<string, unknown>,
  path: string
): string | undefined {
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = errors;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[part];
  }
  if (current && typeof current === "object" && "message" in current) {
    return current.message as string;
  }
  return undefined;
}
