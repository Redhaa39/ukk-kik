import { Code2, Database, GraduationCap, Layers, PenTool, Sparkles } from 'lucide-react'
import Reveal from '../components/Reveal'
import { Badge, Section, SectionHeading } from '../components/ui'

const focusAreas = [
  { icon: Code2, title: 'Web Development', text: 'HTML, CSS, JavaScript, and React fundamentals.' },
  { icon: Database, title: 'Database', text: 'SQL basics and simple data modelling.' },
  { icon: PenTool, title: 'UI/UX Design', text: 'Wireframes, layout, and interface design in Figma.' },
  { icon: Layers, title: 'Software Basics', text: 'Programming logic and software development flow.' },
]

const subjects = ['Software Engineering', 'Web Development', 'UI/UX', 'Database']

// Newest first. Add `period: '2019 — 2022'` to show the years on a card.
const schools = [
  {
    id: 'smk',
    current: true,
    name: 'SMK Negeri 2 Banjarmasin',
    level: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
  },
  {
    id: 'smp',
    name: 'SMP Negeri 27 Banjarmasin',
    level: 'Junior High School (SMP)',
    period: '', // TODO: tahun masuk — lulus
  },
  {
    id: 'sd',
    name: 'SD Negeri Sungai Jingah 5 Banjarmasin',
    level: 'Elementary School (SD)',
    period: '', // TODO: tahun masuk — lulus
  },
]

function Education() {
  return (
    <Section id="education" tone="muted" offset="about" glow className="texture-ruled">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal direction="up" distance={18}>
          <div>
            <SectionHeading
              eyebrow="Background"
              title="Education &"
              accent="learning."
              description="My educational journey and the foundation of my knowledge in technology and software development."
            />

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="glass-panel rounded-xl px-4 py-3">
                <p className="label-caps text-[#8b8b95]">School</p>
                <p className="mt-1.5 text-sm font-medium text-[#F5F5F5]">{schools[0].name}</p>
              </div>
              <div className="glass-panel rounded-xl px-4 py-3">
                <p className="label-caps text-[#8b8b95]">Major</p>
                <p className="mt-1.5 text-sm font-medium text-[#F5F5F5]">PPLG</p>
              </div>
            </div>

            <div className="relative mt-10 space-y-5 pl-7 sm:pl-9">
              <div
                aria-hidden="true"
                className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-[#6366F1]/80 via-[#3f3f52] to-transparent sm:left-[7px]"
              />
              {schools.map((school) => (
                <div key={school.id} className="relative">
                  {school.current ? (
                    <span
                      className="absolute -left-[27px] top-7 flex h-3 w-3 items-center justify-center rounded-full bg-[#6366F1] ring-4 ring-[#111116] sm:-left-[33px]"
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  ) : (
                    <span
                      className="absolute -left-[27px] top-7 h-3 w-3 rounded-full bg-[#3f3f52] ring-4 ring-[#111116] sm:-left-[33px]"
                      aria-hidden="true"
                    />
                  )}

                  {school.current ? (
                    <div className="card-lift gradient-ring rounded-xl border border-[#27272A] bg-[#18181F]/60 p-5 backdrop-blur sm:p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge tone="success">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          In progress
                        </Badge>
                        <span className="text-xs text-[#8b8b95]">Current</span>
                      </div>
                      <h3 className="mt-4 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-[#F5F5F5]">
                        <GraduationCap aria-hidden="true" className="h-5 w-5 shrink-0 text-[#A5B4FC]" />
                        {school.name}
                      </h3>
                      <p className="mt-1 text-base text-[#d4d4d8]">{school.level}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {subjects.map((subject) => (
                          <Badge key={subject} tone={subject === 'Software Engineering' ? 'accent' : 'neutral'}>
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-5 max-w-2xl text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8">
                        Studying programming, web development, database management, and software
                        development fundamentals while building projects to practise what I learn.
                      </p>

                      <div className="mt-5 flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#27272A]">
                          <div className="h-full w-[72%] rounded-full bg-[linear-gradient(90deg,#6366F1,#A855F7)]" />
                        </div>
                        <span className="text-[11px] text-[#8b8b95]">on track</span>
                      </div>
                    </div>
                  ) : (
                    <div className="card-lift rounded-xl border border-[#27272A] bg-[#18181F]/60 p-5 backdrop-blur">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge tone="neutral">Graduated</Badge>
                        {school.period && (
                          <span className="text-xs text-[#8b8b95]">{school.period}</span>
                        )}
                      </div>
                      <h3 className="mt-3 flex items-center gap-2 text-lg font-bold tracking-tight text-[#F5F5F5] sm:text-xl">
                        <GraduationCap aria-hidden="true" className="h-5 w-5 shrink-0 text-[#A5B4FC]" />
                        {school.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#d4d4d8]">{school.level}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal direction="up" delay={80} distance={18}>
          <div className="lg:pt-16">
            <p className="label-caps flex items-center gap-2 text-[#8b8b95]">
              <Sparkles aria-hidden="true" className="h-3 w-3 text-[#6366F1]" />
              Focus areas
            </p>
            <h3 className="mt-3 text-xl font-bold tracking-tight text-[#F5F5F5]">What I’m learning</h3>
            <ul className="mt-6 grid gap-3">
              {focusAreas.map((area) => {
                const Icon = area.icon
                return (
                  <li
                    key={area.title}
                    className="card-lift group flex gap-4 rounded-xl border border-[#27272A] bg-[#18181F]/50 p-4 backdrop-blur"
                  >
                    <span className="icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#27272A] bg-[#111116] text-[#A5B4FC]">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#F5F5F5]">{area.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#A1A1AA]">{area.text}</p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="edge-glow mt-6 rounded-xl border border-[#27272A] bg-[#111116]/70 p-5">
              <p className="font-editorial text-sm italic leading-7 text-[#A1A1AA]">
                “School gives me the fundamentals — building projects is where it actually starts
                to click.”
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

export default Education
