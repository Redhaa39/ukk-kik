import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowDown,
  ArrowRight,
  Code2,
  Download,
  Layers,
  PenTool,
  Sparkles,
} from 'lucide-react'
import { ButtonLink } from '../components/ui'
import StatsCounter from '../components/ui/StatsCounter'
import { profile, stats } from '../data/profile'
import Portrait from '../components/Portrait'
import { api } from '../services/api'
import { EASE, fadeUp, staggerContainer } from '../lib/motion'
import Aurora from '../components/motion/Aurora'
import Magnetic from '../components/motion/Magnetic'
import Marquee from '../components/motion/Marquee'
import Parallax from '../components/motion/Parallax'
import TextReveal from '../components/motion/TextReveal'
import TiltCard from '../components/motion/TiltCard'

const notes = [
  { label: 'Based in', value: 'Indonesia' },
  { label: 'Focus', value: 'Front-End & UI/UX' },
  { label: 'Status', value: 'Open to internships' },
]

const meta = [
  { label: 'Discipline', value: 'Front-End Dev' },
  { label: 'Also', value: 'UI/UX Design' },
  { label: 'Currently', value: 'PPLG Student' },
]

const roles = ['Front-End Developer', 'UI/UX Designer', 'Creative Problem Solver']

const keywords = [
  'React',
  'JavaScript',
  'Tailwind CSS',
  'UI/UX Design',
  'Figma',
  'Motion Design',
  'Responsive Interfaces',
  'Front-End',
]

const nameParts = profile.name.split(' ')
const firstNameLine = nameParts.slice(0, 2).join(' ')
const lastNameLine = nameParts.slice(2).join(' ') || 'Ansori'

function RoleRotator() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % roles.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [reduceMotion])

  if (reduceMotion) {
    return <span className="text-gradient-warm font-semibold">{roles[0]}</span>
  }

  return (
    <span className="relative inline-flex h-[1.35em] min-w-[14rem] items-center overflow-hidden align-bottom sm:min-w-[15rem]">
      <AnimatePresence initial={false}>
        <motion.span
          key={roles[index]}
          initial={{ y: '105%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-105%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.48, ease: EASE.expo }}
          className="absolute inset-0 flex items-center whitespace-nowrap text-gradient-warm font-semibold"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Home() {
  const reduceMotion = useReducedMotion()
  const [counts, setCounts] = useState(null)

  // Project and certificate totals come from the database, so they match the
  // dashboard. If the request fails, only the static stats are shown.
  useEffect(() => {
    let active = true
    api('public-counts')
      .then((result) => {
        if (active) setCounts(result)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const homeStats = [
    ...stats,
    ...(counts?.projects > 0 ? [{ value: counts.projects, label: 'Projects built' }] : []),
    ...(counts?.certificates > 0 ? [{ value: counts.certificates, label: 'Certificates' }] : []),
  ]

  return (
    <section
      id="home"
      className="scroll-mt-24 relative isolate overflow-hidden border-b border-[#27272A] bg-[#09090B] pt-10 sm:pt-12 lg:pt-8"
    >
      <Aurora />

      <motion.div
        aria-hidden="true"
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={reduceMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE.out, delay: 0.6 }}
        className="pointer-events-none absolute right-4 top-24 hidden select-none text-[11rem] font-extrabold leading-none tracking-tighter text-white/[0.02] lg:block"
      >
        FOLIO
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="relative">
          <div className="grid items-center gap-16 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24">
            <motion.div
              initial={reduceMotion ? undefined : 'hidden'}
              animate={reduceMotion ? undefined : 'visible'}
              variants={staggerContainer(0.1, 0.08)}
              className="relative"
            >
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                <span className="note-tag border-[#6366F1]/30 bg-[#18181F]/80 backdrop-blur">
                  <span className="relative mr-0.5 flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Open to internships
                </span>
                <motion.span
                  aria-hidden="true"
                  className="hidden h-px w-8 origin-left bg-gradient-to-r from-[#6366F1] to-transparent sm:block"
                  initial={reduceMotion ? undefined : { scaleX: 0 }}
                  animate={reduceMotion ? undefined : { scaleX: 1 }}
                  transition={{ duration: 0.9, ease: EASE.expo, delay: 0.5 }}
                />
                <span className="font-editorial text-sm italic text-[#8b8b95]">
                  portfolio / 2026
                </span>
              </motion.div>

              <h1 className="mt-7 text-[3.2rem] font-extrabold leading-[0.88] tracking-[-0.035em] text-[#F5F5F5] sm:text-6xl lg:text-[5.4rem]">
                <TextReveal
                  as="span"
                  text={firstNameLine}
                  className="block"
                  trigger="mount"
                  delay={0.24}
                  stagger={0.07}
                />
                <span className="flex flex-wrap items-baseline">
                  <TextReveal
                    as="span"
                    text={lastNameLine}
                    className="font-editorial font-medium italic tracking-normal text-[#A5B4FC]"
                    trigger="mount"
                    delay={0.4}
                    stagger={0.07}
                    wordClassName="accent-gradient"
                  />
                  <motion.span
                    className="inline-block text-[#6366F1]"
                    initial={reduceMotion ? undefined : { opacity: 0, scale: 0, y: 10 }}
                    animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.95 }}
                  >
                    .
                  </motion.span>
                </span>
              </h1>

              <motion.span
                aria-hidden="true"
                className="mt-5 block h-px w-28 origin-left bg-gradient-to-r from-[#6366F1] via-[#A5B4FC] to-transparent"
                initial={reduceMotion ? undefined : { scaleX: 0, opacity: 0 }}
                animate={reduceMotion ? undefined : { scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: EASE.expo, delay: 0.85 }}
              />

              <motion.div variants={fadeUp} className="mt-6 flex items-start gap-4">
                <span className="mt-3 hidden h-px w-10 bg-[#6366F1] sm:block" aria-hidden="true" />
                <div>
                  <p className="flex flex-wrap items-center gap-x-2 text-lg leading-8 text-[#e4e4e7] sm:text-xl">
                    <span className="text-[#8b8b95]">I’m a</span>
                    <RoleRotator />
                  </p>
                  <p className="mt-3 max-w-xl text-base leading-8 text-[#A1A1AA]">
                    A vocational student who enjoys shaping ideas into interfaces that feel clear,
                    calm, and considered — caring as much about how things work as how they feel.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
                <Magnetic strength={0.22}>
                  <ButtonLink to="/#contact" size="lg" className="btn-shine group">
                    <span className="relative mr-0.5 flex h-2 w-2" aria-hidden="true">
                      <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-300" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                    </span>
                    Available for work
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </ButtonLink>
                </Magnetic>
                <Magnetic strength={0.16}>
                  <ButtonLink
                    href="/Muhammad-Redha-Ansori-CV.pdf"
                    download="Muhammad-Redha-Ansori-CV.pdf"
                    variant="secondary"
                    size="lg"
                    className="btn-shine group"
                  >
                    <Download
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    />
                    Download CV
                  </ButtonLink>
                </Magnetic>
              </motion.div>

              {homeStats.length > 0 && (
                <motion.div
                  variants={staggerContainer(0.09, 0.1)}
                  className="mt-11 border-t border-[#27272A] pt-7"
                >
                  <StatsCounter
                    items={homeStats}
                    className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4"
                    itemClassName="group relative pl-3 before:absolute before:left-0 before:top-1 before:h-8 before:w-px before:bg-gradient-to-b before:from-[#6366F1]/70 before:to-transparent"
                  />
                </motion.div>
              )}

              <motion.div
                variants={staggerContainer(0.09, 0.1)}
                className="mt-8 hidden gap-4 text-sm text-[#A1A1AA] sm:grid sm:grid-cols-3"
              >
                {meta.map((item) => (
                  <motion.div key={item.label} variants={fadeUp} className="group">
                    <p className="label-caps text-[#8b8b95] transition-colors group-hover:text-[#A5B4FC]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[#d4d4d8]">{item.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 28 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE.expo, delay: 0.25 }}
              className="relative mx-auto w-full max-w-[24rem] sm:max-w-[26rem] lg:max-w-none lg:self-start"
            >
              <div
                aria-hidden="true"
                className="conic-halo absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[30rem] sm:w-[30rem]"
              />

              <motion.div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2rem] border border-dashed border-[#6366F1]/25 sm:-inset-5"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
              />

              <motion.span
                aria-hidden="true"
                className="absolute -left-3 top-4 z-20 hidden text-[#818CF8] sm:block"
                animate={
                  reduceMotion
                    ? undefined
                    : { y: [0, -10, 0], opacity: [0.35, 0.9, 0.35], rotate: [0, 12, 0] }
                }
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.span>

              <Parallax distance={22} rotate={1.4} className="relative">
                <motion.div
                  initial={
                    reduceMotion ? false : { clipPath: 'inset(0 0 100% 0 round 18px)' }
                  }
                  animate={reduceMotion ? undefined : { clipPath: 'inset(0 0 0% 0 round 18px)' }}
                  transition={{ duration: 1.15, ease: EASE.expo, delay: 0.35 }}
                >
                  <TiltCard max={5} className="relative">
                    <div className="group/portrait photo-matte relative z-10 rotate-[-1.2deg] rounded-[1.35rem]">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem]">
                        <motion.div
                          className="h-full w-full"
                          initial={reduceMotion ? undefined : { scale: 1.12 }}
                          animate={reduceMotion ? undefined : { scale: 1 }}
                          transition={{ duration: 1.5, ease: EASE.expo, delay: 0.4 }}
                        >
                          <Portrait
                            alt={`Portrait of ${profile.name}`}
                            className="h-full w-full transition-transform duration-700 ease-out group-hover/portrait:scale-[1.045]"
                          />
                        </motion.div>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/portrait:opacity-100"
                          style={{
                            background:
                              'radial-gradient(circle at 32% 8%, rgba(165,180,252,0.22), transparent 62%)',
                          }}
                        />

                        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-black/55 px-3.5 py-2.5 backdrop-blur-md">
                          <div className="min-w-0">
                            <p className="truncate font-display text-[13px] font-semibold tracking-tight text-white">
                              {profile.name}
                            </p>
                            <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.16em] text-white/65">
                              {profile.role}
                            </p>
                          </div>
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
                            <span className="relative flex h-2 w-2" aria-hidden="true">
                              <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </Parallax>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 22, rotate: -8, scale: 0.9 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: -3, scale: 1 }}
                transition={{ type: 'spring', stiffness: 160, damping: 15, delay: 0.85 }}
                whileHover={reduceMotion ? undefined : { rotate: 0, y: -4, scale: 1.03 }}
                className="absolute -bottom-6 -left-2 z-20 hidden sm:-left-8 sm:block"
              >
                <div className="glass-panel rounded-xl px-4 py-3">
                  <p className="font-editorial text-sm italic text-[#F5F5F5]">
                    Hello, I’m Redha
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8b8b95]">nice to meet you</p>
                </div>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: 30, rotate: 4 }}
                animate={reduceMotion ? undefined : { opacity: 1, x: 0, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 170, damping: 17, delay: 1.05 }}
                className="float-y-slow absolute -right-2 top-8 z-20 hidden sm:-right-5 sm:block"
              >
                <div className="glass-panel flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#F5F5F5]">
                  <Code2 aria-hidden="true" className="h-3.5 w-3.5 text-[#A5B4FC]" />
                  React
                </div>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, x: 30, rotate: -4 }}
                animate={reduceMotion ? undefined : { opacity: 1, x: 0, rotate: -2 }}
                transition={{ type: 'spring', stiffness: 170, damping: 17, delay: 1.2 }}
                className="float-y absolute -left-4 top-1/3 z-20 hidden sm:-left-8 sm:block"
              >
                <div className="glass-panel flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#F5F5F5]">
                  <PenTool aria-hidden="true" className="h-3.5 w-3.5 text-[#D8B4FE]" />
                  Figma
                </div>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16, rotate: 6 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 1.35 }}
                className="absolute -right-3 bottom-16 z-20 hidden sm:-right-7 sm:block lg:-right-4"
              >
                <div className="glass-panel w-40 rounded-xl p-3 font-mono text-[10px] leading-5 text-[#A1A1AA]">
                  <p className="mb-1 flex items-center gap-1.5 text-[#8b8b95]">
                    <Layers aria-hidden="true" className="h-3 w-3" />
                    redha.config.js
                  </p>
                  <p><span className="text-[#818CF8]">const</span> redha = {'{'}</p>
                  <p className="pl-3">role: <span className="text-emerald-300">'dev'</span>,</p>
                  <p className="pl-3">design: <span className="text-emerald-300">true</span>,</p>
                  <p>{'}'}</p>
                </div>
              </motion.div>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, rotate: 8, y: -10 }}
                animate={reduceMotion ? undefined : { opacity: 1, rotate: 2, y: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 1.5 }}
                className="pointer-events-none absolute -top-5 right-8 z-20 hidden sm:block"
              >
                <span className="note-tag bg-[#111116]/90 backdrop-blur">figma + code</span>
              </motion.div>

              <div className="mt-6 grid grid-cols-3 gap-2 sm:hidden">
                {notes.map((note) => (
                  <div key={note.label} className="rounded-lg border border-[#27272A] bg-[#18181F]/80 p-3">
                    <p className="label-caps text-[#8b8b95]">{note.label}</p>
                    <p className="mt-1 text-xs font-medium leading-5 text-[#F5F5F5]">{note.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="relative border-y border-[#27272A]/80 py-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#09090B] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#09090B] to-transparent" />
            <Marquee
              items={keywords}
              duration={42}
              itemClassName="ticker-row font-display text-2xl font-extrabold uppercase tracking-tight text-outline sm:text-3xl"
            />
          </div>

          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE.out, delay: 1.6 }}
            className="flex items-center justify-center gap-3 py-7"
          >
            <span className="scroll-cue relative flex h-10 w-[1px] overflow-hidden bg-[#27272A]" aria-hidden="true" />
            <span className="label-caps text-[#8b8b95]">Scroll to explore</span>
            <ArrowDown aria-hidden="true" className="h-3 w-3 text-[#6366F1]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Home
