import { Wifi, WifiOff, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ConnectionState } from "@/types/patient";

interface ConnectionStatusProps {
  state: ConnectionState;
  className?: string;
}

interface StatusConfig {
  label: string;
  icon: React.ReactNode;
  dotClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

const CONFIG: Record<ConnectionState, StatusConfig> = {
  connected: {
    label: "Connected",
    icon: <Wifi className="w-3.5 h-3.5" aria-hidden="true" />,
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
  },
  connecting: {
    label: "Connecting…",
    icon: (
      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
    ),
    dotClass: "bg-amber-400",
    textClass: "text-amber-700",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
  },
  disconnected: {
    label: "Offline",
    icon: <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />,
    dotClass: "bg-slate-400",
    textClass: "text-slate-600",
    bgClass: "bg-slate-50",
    borderClass: "border-slate-200",
  },
  suspended: {
    label: "Reconnecting…",
    icon: (
      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
    ),
    dotClass: "bg-amber-400",
    textClass: "text-amber-700",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
  },
  failed: {
    label: "Connection Failed",
    icon: <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />,
    dotClass: "bg-red-500",
    textClass: "text-red-700",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
  },
};

/**
 * Pill-shaped connection status indicator.
 * Uses both icon+text (not color alone) for accessibility.
 */
export function ConnectionStatus({ state, className }: ConnectionStatusProps) {
  const config = CONFIG[state];

  return (
    <span
      role="status"
      aria-label={`Connection status: ${config.label}`}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bgClass,
        config.textClass,
        config.borderClass,
        className
      )}
    >
      {/* Animated dot */}
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full flex-shrink-0",
          config.dotClass,
          state === "connected" && "animate-pulse"
        )}
        aria-hidden="true"
      />
      {config.icon}
      {config.label}
    </span>
  );
}
