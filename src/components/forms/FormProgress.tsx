interface FormProgressProps {
  percent: number;
  filledCount: number;
  totalCount: number;
}

/**
 * Visual progress bar showing how many required fields are filled.
 */
export function FormProgress({ percent, filledCount, totalCount }: FormProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={`Form completion: ${filledCount} of ${totalCount} required fields filled`}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600">
          Form Completion
        </span>
        <span className="text-xs font-semibold text-teal-700">
          {filledCount} / {totalCount} required fields
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {percent === 100 && (
        <p className="text-xs text-emerald-600 font-medium mt-2">
          ✓ All required fields filled — you may submit
        </p>
      )}
    </div>
  );
}
