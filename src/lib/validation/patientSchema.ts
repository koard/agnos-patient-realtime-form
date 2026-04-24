import { z } from "zod";

// ─── Constants ─────────────────────────────────────────────────────────────────

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
  { value: "other", label: "Other" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "thai", label: "Thai (ภาษาไทย)" },
  { value: "mandarin", label: "Mandarin (中文)" },
  { value: "spanish", label: "Spanish (Español)" },
  { value: "french", label: "French (Français)" },
  { value: "arabic", label: "Arabic (العربية)" },
  { value: "japanese", label: "Japanese (日本語)" },
  { value: "korean", label: "Korean (한국어)" },
  { value: "hindi", label: "Hindi (हिन्दी)" },
  { value: "german", label: "German (Deutsch)" },
  { value: "portuguese", label: "Portuguese (Português)" },
  { value: "russian", label: "Russian (Русский)" },
  { value: "other", label: "Other" },
] as const;

export const RELATIONSHIP_OPTIONS = [
  { value: "spouse", label: "Spouse / Partner" },
  { value: "parent", label: "Parent" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "friend", label: "Friend" },
  { value: "guardian", label: "Legal Guardian" },
  { value: "other", label: "Other" },
] as const;

// ─── Validation Helpers ────────────────────────────────────────────────────────

/**
 * International phone regex: allows optional + prefix, digits, spaces, dashes,
 * and parentheses. Minimum 7 digits.
 */
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

// ─── Emergency Contact Sub-Schema ─────────────────────────────────────────────

const emergencyContactSchema = z.object({
  name: z.string().max(100, "Name must be 100 characters or fewer").optional(),
  relationship: z
    .string()
    .max(50, "Relationship must be 50 characters or fewer")
    .optional(),
});

// ─── Main Patient Form Schema ──────────────────────────────────────────────────

export const patientFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or fewer"),

  middleName: z
    .string()
    .max(50, "Middle name must be 50 characters or fewer")
    .optional()
    .or(z.literal("")),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or fewer"),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      return date < now;
    }, "Date of birth must be in the past"),

  gender: z.string().min(1, "Gender is required"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(PHONE_REGEX, "Enter a valid phone number (e.g. +66 81 234 5678)"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  address: z
    .string()
    .min(1, "Address is required")
    .max(300, "Address must be 300 characters or fewer"),

  preferredLanguage: z.string().min(1, "Preferred language is required"),

  nationality: z
    .string()
    .min(1, "Nationality is required")
    .max(100, "Nationality must be 100 characters or fewer"),

  emergencyContact: emergencyContactSchema.optional(),

  religion: z
    .string()
    .max(100, "Religion must be 100 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
