import type { Metadata } from "next";
import { StaffDashboard } from "@/components/staff/StaffDashboard";

export const metadata: Metadata = {
  title: "Staff Dashboard — Agnos",
  description:
    "Real-time staff monitoring view for incoming patient registrations.",
};

interface StaffPageProps {
  searchParams: Promise<{ sessionId?: string }>;
}

/**
 * Staff monitoring page.
 * Subscribes to the same session as the patient form for real-time updates.
 */
export default async function StaffPage({ searchParams }: StaffPageProps) {
  const params = await searchParams;
  const sessionId = params.sessionId ?? "demo";

  return <StaffDashboard sessionId={sessionId} />;
}
