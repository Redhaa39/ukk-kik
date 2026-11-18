export const inputClasses =
  'w-full rounded-lg border border-[#27272A] bg-[#111116] px-4 py-3 text-sm text-[#F5F5F5] placeholder:text-[#8b8b95] outline-none transition duration-200 hover:border-[#3f3f46] focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20'

function Field({ label, htmlFor, hint, counter, className = '', children }) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        {label && (
          <label htmlFor={htmlFor} className="text-sm font-medium text-[#d4d4d8]">
            {label}
          </label>
        )}
        {counter && <span className="text-xs text-[#8b8b95]">{counter}</span>}
      </div>
      {children}
      {hint && <p className="mt-2 text-xs leading-5 text-[#8b8b95]">{hint}</p>}
    </div>
  )
}

export default Field
