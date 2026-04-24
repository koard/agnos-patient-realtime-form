import type { Metadata } from "next";
import { PatientForm } from "@/components/forms/PatientForm";

export const metadata: Metadata = {
  title: "Patient Registration — Agnos",
  description: "Fill in your personal information for your Agnos appointment.",
};

interface PatientPageProps {
  searchParams: Promise<{ sessionId?: string }>;
}

/**
 * Patient registration page.
 * Accepts optional `?sessionId=` query param so multiple sessions can run
 * concurrently without interfering with each other.
 */
export default async function PatientPage({ searchParams }: PatientPageProps) {
  const params = await searchParams;
  const sessionId = params.sessionId ?? "demo";

  return <PatientForm sessionId={sessionId} />;
}
