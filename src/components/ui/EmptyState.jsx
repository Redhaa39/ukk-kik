function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-dashed border-[#27272A] bg-[#111116] px-6 py-12 text-center ${className}`}
    >
      {Icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#27272A] bg-[#18181F] text-[#A5B4FC]">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
      )}
      {title && (
        <p className="mt-5 text-base font-semibold text-[#F5F5F5]">{title}</p>
      )}
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#A1A1AA]">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState
