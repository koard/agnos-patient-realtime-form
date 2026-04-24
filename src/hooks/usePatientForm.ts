"use client";

import {
  useForm,
  type UseFormReturn,
  type DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef, useState, useEffect } from "react";
import { patientFormSchema, type PatientFormValues } from "@/lib/validation/patientSchema";
import { getRealtimeClient } from "@/lib/realtime/realtimeClient";
import type { PatientFormData } from "@/types/patient";

// ─── Debounce Delay ────────────────────────────────────────────────────────────
const DEBOUNCE_MS = 300;

// ─── Default Values ────────────────────────────────────────────────────────────
const DEFAULT_VALUES: DefaultValues<PatientFormValues> = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phoneNumber: "",
  email: "",
  address: "",
  preferredLanguage: "",
  nationality: "",
  emergencyContact: { name: "", relationship: "" },
  religion: "",
};

export type SyncStatus = "idle" | "typing" | "synced" | "error";
export type FormStatus = "filling" | "submitted";

export interface UsePatientFormReturn {
  form: UseFormReturn<PatientFormValues>;
  syncStatus: SyncStatus;
  formStatus: FormStatus;
  onSubmit: (values: PatientFormValues) => Promise<void>;
  onReset: () => void;
  isSubmitting: boolean;
}

/**
 * Encapsulates all patient form logic:
 * - React Hook Form setup with Zod resolver
 * - Debounced real-time publish on every field change
 * - patient:typing event on focus/blur
 * - patient:submit on successful form submission
 * - patient:reset on form reset
 */
export function usePatientForm(sessionId: string): UsePatientFormReturn {
  const client = useRef(getRealtimeClient());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [formStatus, setFormStatus] = useState<FormStatus>("filling");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched", // validate on touch, not on every keystroke
  });

  // ─── Watch & Debounce Publish ──────────────────────────────────────────────

  useEffect(() => {
    const subscription = form.watch((values) => {
      setSyncStatus("typing");

      // Clear pending debounce
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        try {
          const payload: PatientFormData = {
            ...(values as PatientFormValues),
            status: "draft",
            updatedAt: new Date().toISOString(),
          };
          await client.current.publish("patient:update", payload);
          setSyncStatus("synced");
        } catch {
          setSyncStatus("error");
        }
      }, DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [form]);

  // ─── Submit Handler ────────────────────────────────────────────────────────

  const onSubmit = useCallback(
    async (values: PatientFormValues) => {
      setIsSubmitting(true);
      try {
        const payload: PatientFormData = {
          ...values,
          status: "submitted",
          updatedAt: new Date().toISOString(),
        };
        await client.current.publish("patient:submit", payload);
        setFormStatus("submitted");
        setSyncStatus("synced");
      } catch {
        setSyncStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  // ─── Reset Handler ─────────────────────────────────────────────────────────

  const onReset = useCallback(async () => {
    form.reset(DEFAULT_VALUES);
    setFormStatus("filling");
    setSyncStatus("idle");
    try {
      await client.current.publish("patient:reset", { sessionId });
    } catch {
      /* silent — reset is best-effort */
    }
  }, [form, sessionId]);

  // ─── Typing Events (field focus/blur) ─────────────────────────────────────

  // We expose a typing-publish helper that form fields can use
  const publishTyping = useCallback(
    (isTyping: boolean, field?: string) => {
      client.current
        .publish("patient:typing", { sessionId, isTyping, field })
        .catch(() => {/* silent */});
    },
    [sessionId]
  );

  // Attach to form context so FormField can call it
  // We store it on the form object for access by child components
  (form as UseFormReturn<PatientFormValues> & { publishTyping?: typeof publishTyping })
    .publishTyping = publishTyping;

  return { form, syncStatus, formStatus, onSubmit, onReset, isSubmitting };
}
