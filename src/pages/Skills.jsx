import { Braces, Code2, Database, FileCode2, Layout, Paintbrush, PenTool, Server, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import Reveal from '../components/Reveal'
import { Section, SectionHeading } from '../components/ui'

const hardSkills = [
  { name: 'HTML', icon: FileCode2, note: 'Semantic structure', level: 'Intermediate' },
  { name: 'CSS', icon: Paintbrush, note: 'Layouts & styling', level: 'Intermediate' },
  { name: 'JavaScript', icon: Braces, note: 'Interactivity', level: 'Learning' },
  { name: 'React', icon: Code2, note: 'Component-based UI', level: 'Learning' },
  { name: 'PHP', icon: Server, note: 'Server-side basics', level: 'Learning' },
  { name: 'SQL / Database', icon: Database, note: 'Data & queries', level: 'Intermediate' },
  { name: 'Tailwind CSS', icon: Layout, note: 'Utility-first styling', level: 'Learning' },
  { name: 'Figma', icon: PenTool, note: 'Interface design', level: 'Intermediate' },
]

const softSkills = [
  'Communication',
  'Teamwork',
  'Problem Solving',
  'Time Management',
  'Curiosity',
  'Adaptability',
]

const learningNext = ['TypeScript', 'Next.js', 'Advanced Motion', 'Design Systems']

// Change a skill's `level` above to 'learning', 'intermediate' or 'advanced'.
const LEVELS = {
  learning: { label: 'Learning', steps: 1 },
  intermediate: { label: 'Intermediate', steps: 2 },
  advanced: { label: 'Advanced', steps: 3 },
}

function SkillLevel({ label, level }) {
  const { steps } = LEVELS[level] || LEVELS.learning

  return (
    <div
      className="mt-3 grid grid-cols-3 gap-1.5"
      role="img"
      aria-label={`${label}: ${LEVELS[level]?.label || LEVELS.learning.label}`}
    >
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={`h-1.5 rounded-full ${
            step <= steps ? 'bg-[linear-gradient(90deg,#6366F1,#A855F7)]' : 'bg-[#27272A]'
          }`}
        />
      ))}
    </div>
  )
}

function Skills() {
  return (
    <Section id="skills" tone="base" offset="about" glow className="texture-paper">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal direction="up" distance={18}>
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="What I work with"
              title="Skills &"
              accent="tools."
              description="A mix of technologies I’m learning and the habits that help me work well with others."
            />
            <div className="gradient-ring mt-8 max-w-sm rounded-xl border border-[#27272A] bg-[#111116]/80 p-5 backdrop-blur">
              <p className="font-editorial text-sm italic leading-7 text-[#A1A1AA]">
                “I focus on building a solid foundation first — clear markup, thoughtful styles,
                and interfaces that are easy to understand.”
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="note-tag bg-[#111116]/80">
                <Sparkles aria-hidden="true" className="h-3 w-3 text-[#A5B4FC]" />
                always learning
              </span>
            </div>

            <div className="mt-8 rounded-xl border border-[#27272A] bg-[#111116]/60 p-5">
              <p className="label-caps text-[#8b8b95]">Learning next</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {learningNext.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[#6366F1]/25 bg-[#6366F1]/10 px-3 py-1.5 text-xs text-[#c7d2fe]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="space-y-12">
          <Reveal direction="up" distance={18}>
            <div>
              <div className="flex items-baseline justify-between gap-4 border-b border-[#27272A] pb-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F5F5F5]">
                  Hard skills
                </h3>
                <span className="font-editorial text-sm italic text-[#A1A1AA]">tools & tech</span>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {hardSkills.map((skill) => {
                  const Icon = skill.icon
                  return (
                    <li
                      key={skill.name}
                      className="card-lift group rounded-xl border border-[#27272A] bg-[#18181F]/50 p-4 backdrop-blur"
                    >
                      <div className="flex items-start gap-3">
                        <span className="icon-tile flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#27272A] bg-[#111116] text-[#A5B4FC]">
                          <Icon aria-hidden="true" className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-sm font-medium text-[#F5F5F5]">{skill.name}</p>
                            <span className="font-display text-[10px] font-semibold uppercase tracking-wider text-[#8b8b95]">
                              {(LEVELS[skill.level] || LEVELS.learning).label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-[#A1A1AA]">{skill.note}</p>
                          <SkillLevel label={skill.name} level={skill.level} />
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>

          <Reveal direction="up" delay={80} distance={18}>
            <div className="edge-glow relative rounded-xl border border-[#27272A] bg-[linear-gradient(145deg,#15151d,#111116)] p-6 sm:p-7">
              <div className="absolute -top-3 left-5">
                <span className="note-tag bg-[#09090B]">note to self</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F5F5F5]">
                  Soft skills
                </h3>
                <span className="font-editorial text-sm italic text-[#A1A1AA]">how I work</span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {softSkills.map((skill, index) => (
                  <motion.li
                    key={skill}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-2 rounded-full border border-[#27272A] bg-[#18181F] px-4 py-2 text-sm text-[#d4d4d8]"
                  >
                    <span className="font-display text-[10px] font-bold text-[#6366F1]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

export default Skills
