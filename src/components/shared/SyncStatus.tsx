import { Pencil, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SyncStatus } from "@/hooks/usePatientForm";

interface SyncStatusProps {
  status: SyncStatus;
  className?: string;
}

interface StatusConfig {
  label: string;
  icon: React.ReactNode;
  textClass: string;
}

const CONFIG: Record<SyncStatus, StatusConfig> = {
  idle: {
    label: "Ready",
    icon: <Clock className="w-3.5 h-3.5" aria-hidden="true" />,
    textClass: "text-slate-500",
  },
  typing: {
    label: "Typing…",
    icon: <Pencil className="w-3.5 h-3.5" aria-hidden="true" />,
    textClass: "text-amber-600",
  },
  synced: {
    label: "Synced",
    icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
    textClass: "text-emerald-600",
  },
  error: {
    label: "Not synced",
    icon: <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    textClass: "text-red-600",
  },
};

/**
 * Sync/save status indicator shown below the patient form.
 */
export function SyncStatus({ status, className }: SyncStatusProps) {
  const config = CONFIG[status];

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={`Save status: ${config.label}`}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        config.textClass,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
