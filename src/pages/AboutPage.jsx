import { ArrowLeft, Download, MapPin, Sparkles } from 'lucide-react'
import Skills from './Skills'
import Certificates from './Certificates'
import Experience from './Experience'
import Education from './Education'
import { ButtonLink, PageHero, Section } from '../components/ui'
import Reveal from '../components/Reveal'
import Spotlight from '../components/motion/Spotlight'
import TiltCard from '../components/motion/TiltCard'
import { profile } from '../data/profile'
import Portrait from '../components/Portrait'

const quickFacts = [
  { label: 'Focus', value: 'Front-End & UI/UX' },
  { label: 'Study', value: 'PPLG · SMK' },
  { label: 'Based in', value: 'Indonesia' },
  { label: 'Status', value: 'Open to internships' },
]

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <PageHero
        eyebrow="About"
        title="Background,"
        accent="in detail."
        description="A closer look at who I am, what I’m learning, and the path I’m taking in front-end development and UI/UX design."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink to="/" variant="outline" size="sm">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to Home
            </ButtonLink>
            <ButtonLink
              href="/Muhammad-Redha-Ansori-CV.pdf"
              download="Muhammad-Redha-Ansori-CV.pdf"
              variant="secondary"
              size="sm"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Download CV
            </ButtonLink>
          </div>
        }
      >
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickFacts.map((fact) => (
            <div
              key={fact.label}
              className="glass-panel rounded-xl px-4 py-3"
            >
              <p className="label-caps flex items-center gap-1.5 text-[#8b8b95]">
                {fact.label === 'Based in' ? (
                  <MapPin aria-hidden="true" className="h-3 w-3 text-[#6366F1]" />
                ) : (
                  <Sparkles aria-hidden="true" className="h-3 w-3 text-[#6366F1]" />
                )}
                {fact.label}
              </p>
              <p className="mt-1.5 text-sm font-medium text-[#F5F5F5]">{fact.value}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <Section id="about-me" tone="muted" offset="about" glow className="texture-paper">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal direction="up" distance={18}>
            <div className="relative max-w-md">
              <TiltCard max={4}>
                <Spotlight
                  layer="above"
                  size={300}
                  opacity={0.14}
                  className="photo-matte frame-cut rotate-[-1deg] rounded-xl"
                >
                  <div className="overflow-hidden rounded-lg">
                    <Portrait
                      alt={`${profile.name} portrait`}
                      className="aspect-[4/5] w-full"
                    />
                  </div>
                </Spotlight>
              </TiltCard>
              <div className="mt-5 flex items-start gap-3">
                <span className="mt-2 h-px w-8 bg-[#6366F1]" aria-hidden="true" />
                <p className="font-editorial text-sm italic text-[#A1A1AA]">
                  Curious about how good design and clean code can work together.
                </p>
              </div>
              <div className="pointer-events-none absolute -right-2 top-8 hidden rotate-3 sm:block">
                <span className="note-tag">profile note</span>
              </div>
            </div>
          </Reveal>

          <Reveal direction="up" delay={80} distance={18}>
            <div className="lg:pt-4">
              <p className="label-caps text-[#A5B4FC]">Biography</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#F5F5F5] sm:text-4xl">
                Hi, I’m <span className="font-editorial font-medium italic text-[#A5B4FC]">{profile.name.split(' ')[1] || 'Redha'}</span>.
              </h2>
              <div className="mt-6 space-y-5 text-[15px] leading-8 text-[#A1A1AA] sm:text-base">
                <p>
                  Hi, I’m Redha. I started out with absolutely no background in programming or design, but now I’ve set my sights on becoming an excellent programmer.
                </p>
                <p>
                  I am very fond of cats; for some reason, whenever I come across one on the street, I always approach it. I also really enjoy drinking coffee, and my favorite sport is basketball. My dream is to become someone who achieves success through a healthy path.
                </p>
              </div>

              <div className="mt-10 grid gap-x-8 gap-y-8 border-t border-[#27272A] pt-8 sm:grid-cols-2">
                <div>
                  <p className="label-caps text-[#8b8b95]">Education</p>
                  <p className="mt-3 text-sm font-medium text-[#F5F5F5]">SMK Negeri 2 Banjarmasin</p>
                  <p className="mt-1 text-sm leading-6 text-[#A1A1AA]">Major: PPLG — Software & Game Development</p>
                </div>
                <div>
                  <p className="label-caps text-[#8b8b95]">Hobbies & interests</p>
                  <ul className="mt-3 space-y-2 text-sm text-[#A1A1AA]">
                    <li className="flex gap-2"><span className="text-[#6366F1]">—</span>Exploring interface design</li>
                    <li className="flex gap-2"><span className="text-[#6366F1]">—</span>Building small web projects</li>
                    <li className="flex gap-2"><span className="text-[#6366F1]">—</span>Learning new tools & techniques</li>
                  </ul>
                </div>
                <div className="sm:col-span-2 rounded-lg border border-[#27272A] bg-[#111116]/60 p-5">
                  <p className="label-caps text-[#8b8b95]">Career goals</p>
                  <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">
                    To keep growing as a front-end developer and UI/UX designer, work on meaningful
                    projects, and contribute to products that are both well-built and genuinely
                    helpful to the people using them.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Skills />
      <Experience />
      <Certificates />
      <Education />
    </div>
  )
}

export default AboutPage
