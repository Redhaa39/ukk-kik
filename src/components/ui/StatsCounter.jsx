import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/**
 * Counts up once when scrolled into view. Falls back to the final value for
 * reduced-motion users so the layout never sits on zero.
 */
function CountUp({ value = 0, suffix = '', prefix = '', duration = 1600, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (reduceMotion || !inView) return undefined

    let frame = 0
    const start = performance.now()

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduceMotion, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {reduceMotion ? value : display}
      {suffix}
    </span>
  )
}

function StatsCounter({ items = [], className = '', itemClassName = '' }) {
  return (
    <dl className={className}>
      {items.map((item) => (
        <div key={item.label} className={itemClassName}>
          <dt className="sr-only">{item.label}</dt>
          <dd className="font-display text-3xl font-extrabold tracking-tight text-[#F5F5F5] sm:text-4xl">
            <CountUp value={item.value} suffix={item.suffix} prefix={item.prefix} />
            <span className="sr-only"> {item.label}</span>
          </dd>
          <p aria-hidden="true" className="label-caps mt-2 text-[#8b8b95]">
            {item.label}
          </p>
        </div>
      ))}
    </dl>
  )
}

export { CountUp }
export default StatsCounter
