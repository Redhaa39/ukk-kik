/**
 * Shared motion language for the whole site.
 * Kept subtle so the content feels calm and intentional.
 */

export const EASE = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  soft: [0.22, 0.61, 0.36, 1],
  // Long, confident deceleration used by the headline and card reveals.
  expo: [0.16, 1, 0.3, 1],
}

export const SPRING = {
  soft: { type: 'spring', stiffness: 140, damping: 24, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 320, damping: 30 },
  bouncy: { type: 'spring', stiffness: 420, damping: 24 },
  layout: { type: 'spring', stiffness: 380, damping: 32 },
}

export const viewportOnce = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -8% 0px',
}

export const viewportRepeat = {
  once: false,
  amount: 0.18,
  margin: '0px 0px -6% 0px',
}

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE.out },
  },
}

export const fadeUpFor = {
  hidden: (direction) => ({
    opacity: 0,
    y: direction === 'up' ? -16 : 16,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE.out },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE.out } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE.out },
  },
}

export const slideFromRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EASE.out },
  },
}

/**
 * Parent variant that spaces out the entrance of its children.
 * Pair with `fadeUpFor` on `motion` children and pass `custom` down.
 */
export function staggerContainer(staggerChildren = 0.08, delayChildren = 0.06) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  }
}

/**
 * Direction-aware reveal offset, used by <Reveal />.
 * The direction describes the movement: `up` means the element travels up
 * into place, so it starts below the final position.
 */
export function revealOffset(direction, distance) {
  switch (direction) {
    case 'down':
      return { y: -distance }
    case 'left':
      return { x: distance }
    case 'right':
      return { x: -distance }
    case 'none':
      return {}
    default:
      return { y: distance }
  }
}
