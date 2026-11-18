import { Link } from 'react-router-dom'

const base =
  'btn-shine relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8]/70 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary:
    'bg-[linear-gradient(110deg,#6366F1,#7C3AED_52%,#4F46E5)] text-white shadow-[0_12px_34px_-14px_rgba(99,102,241,0.85)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-14px_rgba(124,58,237,0.9)] hover:brightness-110',
  secondary:
    'border border-[#27272A] bg-[#18181F]/80 text-[#F5F5F5] backdrop-blur hover:-translate-y-0.5 hover:border-[#6366F1]/40 hover:bg-[#1f1f2b] hover:shadow-[0_16px_38px_-22px_rgba(99,102,241,0.7)]',
  outline:
    'border border-[#27272A] text-[#A1A1AA] hover:border-[#6366F1]/40 hover:text-[#F5F5F5] hover:shadow-[0_12px_30px_-22px_rgba(99,102,241,0.6)]',
  ghost:
    'text-[#A1A1AA] hover:bg-[#18181F] hover:text-[#F5F5F5]',
  danger:
    'border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20',
  success:
    'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20',
  warning:
    'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm sm:text-[15px]',
}

function buttonClasses({ variant = 'primary', size = 'md', className = '' }) {
  return `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`
}

function Button({ variant, size, className, type = 'button', children, ...props }) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      {children}
    </button>
  )
}

function ButtonLink({ to, href, variant, size, className, children, ...props }) {
  const classes = buttonClasses({ variant, size, className })

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      rel={href?.startsWith('http') ? 'noreferrer noopener' : undefined}
      className={classes}
      {...props}
    >
      {children}
    </a>
  )
}

export { ButtonLink }
export default Button
