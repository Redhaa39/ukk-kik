const tones = {
  accent:
    'border-[#6366F1]/30 bg-[#6366F1]/10 text-[#A5B4FC] shadow-[0_0_24px_-14px_rgba(99,102,241,0.9)]',
  neutral: 'border-[#27272A] bg-[#18181F] text-[#A1A1AA]',
  violet: 'border-[#A855F7]/30 bg-[#A855F7]/10 text-[#D8B4FE]',
  success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  danger: 'border-red-500/25 bg-red-500/10 text-red-300',
  outline: 'border-[#27272A] text-[#A1A1AA] bg-transparent',
}

function Badge({ tone = 'neutral', className = '', children, ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none backdrop-blur-sm ${tones[tone] || tones.neutral} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
