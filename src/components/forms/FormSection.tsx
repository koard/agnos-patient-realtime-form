import { cn } from "@/lib/utils/cn";

interface FormSectionProps {
  /** Section number shown in the header bubble */
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Groups related form fields under a numbered section heading.
 * Provides consistent spacing and hierarchy across the patient form.
 */
export function FormSection({
  step,
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
        className
      )}
      aria-labelledby={`section-${step}-heading`}
    >
      {/* Section header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-semibold flex-shrink-0"
            aria-hidden="true"
          >
            {step}
          </span>
          <div>
            <h2
              id={`section-${step}-heading`}
              className="text-sm font-semibold text-slate-800"
            >
              {title}
            </h2>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        {children}
      </div>
    </section>
  );
}
