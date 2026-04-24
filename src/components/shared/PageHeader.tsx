import Link from "next/link";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional right-side content (status badges, links) */
  rightSlot?: React.ReactNode;
  className?: string;
}

/**
 * Top page header used in both Patient and Staff views.
 */
export function PageHeader({
  title,
  subtitle,
  rightSlot,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm",
        className
      )}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        {/* Brand mark */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
          aria-label="Agnos — go to home"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white">
            <Activity className="w-4.5 h-4.5" aria-hidden="true" />
          </span>
          <span className="hidden sm:block font-semibold text-slate-800 text-sm">
            Agnos
          </span>
        </Link>

        {/* Divider */}
        <span className="hidden sm:block text-slate-300 text-lg" aria-hidden="true">
          /
        </span>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-slate-800 leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 leading-tight truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right slot */}
        {rightSlot && (
          <div className="flex items-center gap-2 flex-shrink-0">{rightSlot}</div>
        )}
      </div>
    </header>
  );
}
