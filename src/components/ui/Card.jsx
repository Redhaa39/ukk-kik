const paddings = {
  none: '',
  sm: 'p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-7 sm:p-8',
}

function Card({
  as: Tag = 'div',
  padding = 'md',
  hover = false,
  variant = 'solid',
  className = '',
  children,
  ...props
}) {
  const base =
    variant === 'outline'
      ? 'border border-[#27272A] bg-transparent'
      : variant === 'glass'
        ? 'border border-[#27272A] bg-[#18181F]/70 backdrop-blur-xl'
        : variant === 'soft'
          ? 'border border-[#27272A] bg-[#111116]'
          : 'border border-[#27272A] bg-[#18181F]'

  return (
    <Tag
      className={`rounded-xl ${base} ${hover ? 'card-lift gradient-ring' : ''} ${paddings[padding] ?? paddings.md} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Card
