import { ArrowRight, Code2, Compass, MapPin, Sparkles } from 'lucide-react'
import Reveal from '../components/Reveal'
import Spotlight from '../components/motion/Spotlight'
import TiltCard from '../components/motion/TiltCard'
import { ButtonLink, Section, SectionHeading } from '../components/ui'
import { profile } from '../data/profile'
import Portrait from '../components/Portrait'

const capabilities = [
  {
    icon: Code2,
    title: 'Front-End Craft',
    text: 'Semantic markup, responsive layouts, and React interfaces built to feel fast and predictable.',
  },
  {
    icon: Sparkles,
    title: 'Interface Design',
    text: 'Clear hierarchy, careful spacing, and small interactions that make a product feel considered.',
  },
  {
    icon: Compass,
    title: 'Product Thinking',
    text: 'I like understanding the problem first, then shaping the simplest path a person can follow.',
  },
]

function About() {
  return (
    <Section id="about" tone="muted" glow className="texture-paper">
      <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <Reveal direction="up" distance={18}>
          <div className="relative mx-auto max-w-md lg:sticky lg:top-28">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2rem] border border-dashed border-[#6366F1]/20 sm:-inset-6"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-12 h-40 w-40 rounded-full bg-[#6366F1]/15 blur-3xl sm:-right-10"
            />

            <div className="relative">
              <div className="relative">
                <TiltCard max={4}>
                  <Spotlight
                    layer="above"
                    size={320}
                    opacity={0.16}
                    className="photo-matte frame-cut rotate-[-1deg] rounded-2xl"
                  >
                    <div className="overflow-hidden rounded-xl">
                      <Portrait
                        alt={`${profile.name} portrait`}
                        className="aspect-[4/5] w-full"
                        loading="lazy"
                      />
                    </div>
                  </Spotlight>
                </TiltCard>

                <div className="absolute -bottom-6 -right-2 max-w-[15rem] rotate-[2deg] rounded-xl border border-[#27272A] bg-[#18181F]/90 p-4 shadow-xl shadow-black/30 backdrop-blur sm:-right-5">
                  <p className="label-caps flex items-center gap-1.5 text-[#A5B4FC]">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                      <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    Currently
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#F5F5F5]">
                    Studying at SMK Negeri 2 Banjarmasin & building my way into front-end and UI/UX.
                  </p>
                </div>

                <div className="pointer-events-none absolute -left-3 top-10 hidden -rotate-6 sm:block">
                  <span className="note-tag bg-[#111116]/90 backdrop-blur">SMK — PPLG</span>
                </div>
              </div>

              <div className="mt-9 flex items-center gap-2 text-xs text-[#8b8b95]">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-[#6366F1]" />
                Indonesia · open to remote collaboration
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="up" delay={80} distance={18}>
          <div className="lg:pt-2">
            <SectionHeading
              eyebrow="Get to know me"
              title="A bit about"
              accent="who I am."
              description="I like making things on the web that are clear, useful, and pleasant to spend time with."
            />

            <div className="mt-8 space-y-5 text-[15px] leading-8 text-[#A1A1AA] sm:text-base">
              <p>
                I’m <span className="text-[#F5F5F5]">{profile.name}</span>, a vocational high school
                student majoring in Pengembangan Perangkat Lunak dan Gim (PPLG). I’m drawn to the
                space where <span className="ink-underline text-[#e4e4e7]">design and code meet</span> —
                turning rough ideas into interfaces people can actually use.
              </p>
              <p>
                Right now I’m focused on sharpening my front-end skills while learning more about
                UI/UX. My goal is to grow into a developer who thinks carefully about both how a
                product works and how it feels.
              </p>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {capabilities.map((item, index) => {
                const Icon = item.icon
                return (
                  <Reveal key={item.title} delay={index * 70} distance={14}>
                    <div className="card-lift gradient-ring group h-full rounded-xl border border-[#27272A] bg-[#18181F]/70 p-4 backdrop-blur">
                      <span className="icon-tile flex h-9 w-9 items-center justify-center rounded-lg border border-[#6366F1]/25 bg-[#6366F1]/10 text-[#A5B4FC]">
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <p className="mt-3 text-sm font-semibold text-[#F5F5F5]">{item.title}</p>
                      <p className="mt-1.5 text-xs leading-6 text-[#A1A1AA]">{item.text}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>

            <div className="mt-9 grid gap-8 border-t border-[#27272A] pt-7 sm:grid-cols-2">
              <div>
                <p className="label-caps text-[#8b8b95]">Interests</p>
                <ul className="mt-3 space-y-2 text-sm text-[#d4d4d8]">
                  <li className="flex gap-2"><span className="text-[#6366F1]">—</span>Front-end development</li>
                  <li className="flex gap-2"><span className="text-[#6366F1]">—</span>UI/UX & interface design</li>
                  <li className="flex gap-2"><span className="text-[#6366F1]">—</span>Learning by building projects</li>
                </ul>
              </div>
              <div>
                <p className="label-caps text-[#8b8b95]">Background</p>
                <ul className="mt-3 space-y-2 text-sm text-[#d4d4d8]">
                  <li className="flex gap-2"><span className="text-[#6366F1]">—</span>Vocational High School — PPLG</li>
                  <li className="flex gap-2"><span className="text-[#6366F1]">—</span>Based in Indonesia</li>
                  <li className="flex gap-2"><span className="text-[#6366F1]">—</span>Open to internships & collaboration</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink to="/about#about-me" variant="secondary" className="group">
                More about me
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </ButtonLink>
              <span className="font-editorial text-sm italic text-[#8b8b95]">background, goals & more</span>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

export default About
