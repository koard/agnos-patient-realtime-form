import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Removes default padding — useful for cards with custom inner layouts */
  noPadding?: boolean;
}

/**
 * Base card component used across patient form sections and staff view panels.
 */
export function Card({ children, className, noPadding = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-sm",
        !noPadding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
