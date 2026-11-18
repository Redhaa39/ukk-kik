const tones = {
  base: 'bg-[#09090B]',
  muted: 'bg-[#111116]',
  surface: 'bg-[#18181F]',
}

const scrollOffsets = {
  default: 'scroll-mt-24',
  about: 'scroll-mt-28',
}

function Section({
  id,
  tone = 'base',
  offset = 'default',
  glow = false,
  className = '',
  containerClassName = '',
  children,
  ...props
}) {
  return (
    <section
      id={id}
      className={`relative isolate px-5 py-20 sm:px-6 sm:py-24 lg:py-28 ${tones[tone] || tones.base} ${scrollOffsets[offset] || scrollOffsets.default} ${className}`}
      {...props}
    >
      {glow && <div className="section-aura" aria-hidden="true" />}
      <div className={`relative z-10 mx-auto w-full max-w-6xl ${containerClassName}`}>
        {children}
      </div>
    </section>
  )
}

export default Section
