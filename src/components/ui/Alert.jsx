import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'

const tones = {
  error: {
    wrap: 'border-red-500/25 bg-red-500/10 text-red-200',
    icon: AlertCircle,
  },
  success: {
    wrap: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200',
    icon: CheckCircle2,
  },
  warning: {
    wrap: 'border-amber-500/25 bg-amber-500/10 text-amber-200',
    icon: TriangleAlert,
  },
  info: {
    wrap: 'border-[#6366F1]/25 bg-[#6366F1]/10 text-[#A5B4FC]',
    icon: Info,
  },
}

function Alert({ tone = 'info', title, children, action, className = '', ...props }) {
  const config = tones[tone] || tones.info
  const Icon = config.icon
  const role = props.role || (tone === 'error' ? 'alert' : 'status')

  return (
    <div
      role={role}
      className={`flex flex-col gap-3 rounded-xl border p-4 text-sm sm:flex-row sm:items-center sm:justify-between ${config.wrap} ${className}`}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-3">
        <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          {title && <p className="font-semibold">{title}</p>}
          {children && <div className={`break-words leading-6 ${title ? 'mt-1' : ''}`}>{children}</div>}
        </div>
      </div>
      {action && <div className="shrink-0 sm:pl-4">{action}</div>}
    </div>
  )
}

export default Alert
