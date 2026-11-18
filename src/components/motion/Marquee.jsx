import { useReducedMotion } from 'motion/react'

/**
 * Infinite ticker. Two identical copies sit side by side and the track slides
 * -50%, so the loop is seamless. Hovering pauses it; reduced-motion users get
 * a plain wrapped list instead.
 */
function Marquee({
  items = [],
  className = '',
  itemClassName = '',
  duration = 34,
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <div className={`flex flex-wrap gap-x-6 gap-y-2 ${className}`}>
        {items.map((item) => (
          <span key={item} className={itemClassName}>
            {item}
          </span>
        ))}
      </div>
    )
  }

  const renderCopy = (copy) => (
    <div
      key={copy}
      aria-hidden={copy > 0}
      className="flex shrink-0 items-center"
    >
      {items.map((item) => (
        <span
          key={`${copy}-${item}`}
          className={`flex items-center whitespace-nowrap ${itemClassName}`}
        >
          {item}
          <span
            aria-hidden="true"
            className="mx-5 inline-block h-1 w-1 rounded-full bg-[#6366F1]"
          />
        </span>
      ))}
    </div>
  )

  return (
    <div className={`marquee-mask relative overflow-hidden ${className}`}>
      <div
        className="marquee-track flex w-max"
        style={{ '--marquee-duration': `${duration}s` }}
      >
        {renderCopy(0)}
        {renderCopy(1)}
      </div>
    </div>
  )
}

export default Marquee
