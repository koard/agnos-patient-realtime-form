// ─── Patient Data Model ────────────────────────────────────────────────────────

export interface EmergencyContact {
  name?: string;
  relationship?: string;
}

export type PatientStatus = "draft" | "submitted";

export interface PatientFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  preferredLanguage: string;
  nationality: string;
  emergencyContact?: EmergencyContact;
  religion?: string;
  status: PatientStatus;
  updatedAt: string;
}

// ─── Realtime Event Types ──────────────────────────────────────────────────────

export type RealtimeEventName =
  | "patient:update"
  | "patient:typing"
  | "patient:submit"
  | "patient:reset"
  | "connection:status";

export interface PatientUpdateEvent {
  sessionId: string;
  data: PatientFormData;
}

export interface PatientTypingEvent {
  sessionId: string;
  isTyping: boolean;
  field?: string;
}

export interface PatientSubmitEvent {
  sessionId: string;
  data: PatientFormData;
}

export interface PatientResetEvent {
  sessionId: string;
}

export type ConnectionState =
  | "connected"
  | "connecting"
  | "disconnected"
  | "failed"
  | "suspended";

// ─── Staff View State ──────────────────────────────────────────────────────────

export interface StaffViewState {
  patientData: PatientFormData | null;
  isTyping: boolean;
  lastUpdated: string | null;
  connectionState: ConnectionState;
  activeField: string | null;
}
