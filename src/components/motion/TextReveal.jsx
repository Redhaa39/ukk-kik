import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { EASE } from '../../lib/motion'

/**
 * Word-by-word masked reveal.
 *
 * Each word slides up from behind an invisible clip edge with a touch of blur
 * and rotation, staggered so the sentence unfurls instead of simply fading in.
 *
 * `trigger="mount"` runs immediately (hero headings), while the default
 * `trigger="view"` waits until the element scrolls into view.
 */
function TextReveal({
  as: Tag = 'span',
  text = '',
  children,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.05,
  duration = 0.9,
  once = false,
  amount = 0.5,
  trigger = 'view',
  ...props
}) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { once, amount })
  const content = text || children
  const canSplit = typeof content === 'string' && content.trim().length > 0
  const words = canSplit ? content.split(/\s+/).filter(Boolean) : []
  const MotionTag = motion[Tag] || motion.span
  const active = trigger === 'mount' || inView

  if (reduceMotion || !canSplit) {
    return (
      <Tag className={className} {...props}>
        {content}
      </Tag>
    )
  }

  return (
    <MotionTag ref={ref} className={className} {...props}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
            <motion.span
              className={`inline-block will-change-transform ${wordClassName}`}
              initial={{ y: '115%', opacity: 0, rotate: 3, filter: 'blur(8px)' }}
              animate={
                active
                  ? { y: '0%', opacity: 1, rotate: 0, filter: 'blur(0px)' }
                  : { y: '115%', opacity: 0, rotate: 3, filter: 'blur(8px)' }
              }
              transition={{
                duration,
                ease: EASE.expo,
                delay: delay + index * stagger,
              }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </MotionTag>
  )
}

export default TextReveal
