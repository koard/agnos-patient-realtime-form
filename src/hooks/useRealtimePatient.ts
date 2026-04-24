"use client";

import { useState, useEffect, useRef } from "react";
import { getRealtimeClient } from "@/lib/realtime/realtimeClient";
import type {
  PatientFormData,
  PatientTypingEvent,
  StaffViewState,
} from "@/types/patient";
import type { RealtimeMessage } from "@/lib/realtime/realtimeTypes";

const TYPING_TIMEOUT_MS = 3000;

/**
 * Hook for the staff view that subscribes to all patient events
 * and maintains a unified StaffViewState.
 */
export function useRealtimePatient(sessionId: string): StaffViewState {
  const client = useRef(getRealtimeClient());
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<StaffViewState>({
    patientData: null,
    isTyping: false,
    lastUpdated: null,
    connectionState: "connecting",
    activeField: null,
  });

  useEffect(() => {
    const c = client.current;

    // Connect and track connection state
    c.connect(sessionId).then(() => {
      setState((prev) => ({ ...prev, connectionState: c.getConnectionState() }));
    });

    c.onConnectionStateChange((connectionState) => {
      setState((prev) => ({ ...prev, connectionState }));
    });

    // ── patient:update ────────────────────────────────────────────────────────
    const onUpdate = (msg: RealtimeMessage<PatientFormData>) => {
      setState((prev) => ({
        ...prev,
        patientData: msg.payload,
        lastUpdated: msg.timestamp,
      }));
    };

    // ── patient:typing ────────────────────────────────────────────────────────
    const onTyping = (msg: RealtimeMessage<PatientTypingEvent>) => {
      const { isTyping, field } = msg.payload;

      // Auto-clear typing flag after TYPING_TIMEOUT_MS of inactivity
      if (typingTimer.current) clearTimeout(typingTimer.current);

      setState((prev) => ({
        ...prev,
        isTyping,
        activeField: field ?? null,
      }));

      if (isTyping) {
        typingTimer.current = setTimeout(() => {
          setState((prev) => ({ ...prev, isTyping: false, activeField: null }));
        }, TYPING_TIMEOUT_MS);
      }
    };

    // ── patient:submit ────────────────────────────────────────────────────────
    const onSubmit = (msg: RealtimeMessage<PatientFormData>) => {
      setState((prev) => ({
        ...prev,
        patientData: msg.payload,
        isTyping: false,
        activeField: null,
        lastUpdated: msg.timestamp,
      }));
    };

    // ── patient:reset ─────────────────────────────────────────────────────────
    const onReset = () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      setState((prev) => ({
        ...prev,
        patientData: null,
        isTyping: false,
        activeField: null,
        lastUpdated: null,
      }));
    };

    c.subscribe("patient:update", onUpdate);
    c.subscribe("patient:typing", onTyping);
    c.subscribe("patient:submit", onSubmit);
    c.subscribe("patient:reset", onReset);

    return () => {
      c.unsubscribe("patient:update", onUpdate as Parameters<typeof c.unsubscribe>[1]);
      c.unsubscribe("patient:typing", onTyping as Parameters<typeof c.unsubscribe>[1]);
      c.unsubscribe("patient:submit", onSubmit as Parameters<typeof c.unsubscribe>[1]);
      c.unsubscribe("patient:reset", onReset as Parameters<typeof c.unsubscribe>[1]);
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [sessionId]);

  return state;
}
