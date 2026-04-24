import { format, parseISO, isValid } from "date-fns";

/**
 * Formats an ISO date string to a human-readable date.
 * Returns an em-dash if the value is missing or invalid.
 */
export function formatDate(isoString: string | undefined | null): string {
  if (!isoString) return "—";
  try {
    const date = parseISO(isoString);
    if (!isValid(date)) return "—";
    return format(date, "dd MMM yyyy");
  } catch {
    return "—";
  }
}

/**
 * Formats an ISO datetime string to a relative "last updated" label.
 * E.g. "Just now", "2 min ago", or a full timestamp for older entries.
 */
export function formatLastUpdated(isoString: string | null): string {
  if (!isoString) return "—";
  try {
    const date = parseISO(isoString);
    if (!isValid(date)) return "—";
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 10) return "Just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    return format(date, "HH:mm");
  } catch {
    return "—";
  }
}
