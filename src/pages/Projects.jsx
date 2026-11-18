import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Code2, FolderKanban, Globe, Sparkles } from 'lucide-react'
import { api } from '../services/api'
import LoadingGrid from '../components/LoadingGrid'
import Reveal from '../components/Reveal'
import Spotlight from '../components/motion/Spotlight'
import TiltCard from '../components/motion/TiltCard'
import { EASE } from '../lib/motion'
import { Alert, Badge, Button, ButtonLink, EmptyState, Section, SectionHeading } from '../components/ui'

const fallbackProjects = [
  {
    number: '01',
    title: 'Portfolio Website',
    category: 'Front-End Development',
    description:
      'A personal portfolio website to introduce my profile, showcase skills, and present selected projects.',
    problem: 'There was no dedicated place to present my profile and work in a structured way.',
    solution: 'Built a responsive portfolio website with clear navigation and a modern layout.',
    role: 'Front-End Developer & UI/UX Designer',
    tech: ['React', 'Tailwind CSS', 'JavaScript'],
  },
  {
    number: '02',
    title: 'EduSmart',
    category: 'Front-End Development',
    description:
      'An interactive learning platform concept that helps students access learning materials and quizzes.',
    problem: 'Learning materials needed a more structured and interactive way to be delivered.',
    solution: 'Designed the interface of a learning platform with material pages and quizzes.',
    role: 'Front-End Developer',
    tech: ['HTML', 'Tailwind CSS', 'JavaScript'],
  },
  {
    number: '03',
    title: 'Fluento',
    category: 'UI/UX Design',
    description:
      'A language-learning app concept designed to make exploring and practicing foreign languages feel approachable.',
    problem: 'Learning a foreign language can feel repetitive and unfocused.',
    solution: 'Created an app concept with a simple learning flow and an easy-to-follow interface.',
    role: 'UI/UX Designer',
    tech: ['Figma', 'Wireframing', 'UI Design'],
  },
]

function isSafeHttpUrl(value) {
  if (!value) return ''
  try {
    const url = new URL(value, window.location.origin)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

function Projects() {
  const [projectItems, setProjectItems] = useState([])
  const [activeFilter, setActiveFilter] = useState('All Projects')
  const [expandedProject, setExpandedProject] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    api('projects', { scope: 'public' })
      .then((result) => {
        if (!active) return
        const items = (result.items || []).map((item) => ({
          ...item,
          key: `project-${item.id}`,
          tech: Array.isArray(item.technologies)
            ? item.technologies
            : item.technologies
              ? String(item.technologies).split(',').map((v) => v.trim()).filter(Boolean)
              : [],
          role: item.role || 'Project Contributor',
        }))
        setProjectItems(items)
        setStatus('ready')
      })
      .catch((loadError) => {
        if (!active) return
        setProjectItems(fallbackProjects.map((item, index) => ({ ...item, key: `fallback-${index}` })))
        setError(loadError.message)
        setStatus('error')
      })
    return () => { active = false }
  }, [reloadKey])

  function retryLoad() {
    setStatus('loading')
    setError('')
    setReloadKey((v) => v + 1)
  }

  const filters = useMemo(
    () => ['All Projects', ...Array.from(new Set(projectItems.map((p) => p.category).filter(Boolean)))],
    [projectItems],
  )
  const safeFilter = filters.includes(activeFilter) ? activeFilter : 'All Projects'
  const filteredProjects = useMemo(
    () => (safeFilter === 'All Projects' ? projectItems : projectItems.filter((p) => p.category === safeFilter)),
    [projectItems, safeFilter],
  )

  return (
    <Section id="projects" tone="base" glow>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <SectionHeading
          eyebrow="Selected work"
          title="Featured"
          accent="projects."
          description="A small selection of things I’ve designed and built while learning — presented like case notes rather than a grid of identical cards."
        />
        <div className="flex flex-wrap items-end justify-between gap-4 lg:justify-end">
          <span className="font-editorial text-lg italic text-[#A1A1AA]">curated work</span>
          <p className="note-tag bg-[#111116]/80">
            <Sparkles aria-hidden="true" className="h-3 w-3 text-[#A5B4FC]" />
            {String(filteredProjects.length).padStart(2, '0')} items
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-2 border-y border-[#27272A] py-4" aria-label="Filter projects">
        <span className="label-caps mr-2 text-[#8b8b95]">Filter</span>
        {filters.map((filter) => {
          const isActive = safeFilter === filter
          return (
            <motion.button
              key={filter}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => { setActiveFilter(filter); setExpandedProject(null) }}
              aria-pressed={isActive}
              className={`relative isolate overflow-hidden rounded-full border px-4 py-2 text-sm transition-colors ${
                isActive
                  ? 'border-transparent text-white'
                  : 'border-[#27272A] text-[#A1A1AA] hover:border-[#6366F1]/40 hover:text-[#F5F5F5]'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="project-filter-pill"
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full bg-[linear-gradient(110deg,#6366F1,#7C3AED)] shadow-[0_8px_24px_-12px_rgba(99,102,241,0.9)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{filter}</span>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-12">
        {status === 'error' && (
          <Alert
            tone="info"
            title="Preview mode"
            className="mb-8"
            action={<Button variant="outline" size="sm" onClick={retryLoad}>Try again</Button>}
          >
            {error ? `${error} ` : ''}Showing sample projects because server data is not available yet.
          </Alert>
        )}

        {status === 'loading' && <LoadingGrid />}

        {status !== 'loading' && filteredProjects.length === 0 && (
          <EmptyState
            icon={FolderKanban}
            title="No projects in this category"
            description="Choose another category to see more work."
            action={<Button variant="secondary" size="sm" onClick={() => setActiveFilter('All Projects')}>Show all projects</Button>}
          />
        )}

        {status !== 'loading' && filteredProjects.length > 0 && (
          <div className="space-y-24 lg:space-y-32">
            {filteredProjects.map((project, index) => {
              const demoUrl = isSafeHttpUrl(project.demo_url)
              const githubUrl = isSafeHttpUrl(project.github_url)
              const isExpanded = expandedProject === project.key
              const reverse = index % 2 === 1
              // Display order, not the database id, so numbering never skips after deletes or reorders.
              const number = String(index + 1).padStart(2, '0')

              return (
                <Reveal key={project.key} as="article">
                  <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
                    <div className={`relative lg:col-span-7 ${reverse ? 'lg:order-2' : ''}`}>
                      <TiltCard max={4} className="relative">
                        <Spotlight
                          layer="above"
                          size={460}
                          opacity={0.18}
                          className="photo-matte gradient-ring group relative overflow-hidden rounded-2xl"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#18181F]">
                            {project.image_url ? (
                              <img
                                src={project.image_url}
                                alt={`Preview of ${project.title}`}
                                loading="lazy"
                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                              />
                            ) : (
                              <div className="relative flex h-full w-full items-end bg-[linear-gradient(135deg,#1b1b29,#111116_55%,#171724)] p-6 sm:p-8">
                                <div
                                  aria-hidden="true"
                                  className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
                                />
                                <div className="relative">
                                  <p className="font-editorial text-sm italic text-[#A5B4FC]">Case study</p>
                                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#F5F5F5]">{project.title}</p>
                                  <span className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 text-[#A5B4FC]">
                                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

                            <div className="absolute left-4 top-4 flex items-center gap-2">
                              <span className="rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                                Case {number}
                              </span>
                            </div>

                            {project.tech?.length > 0 && (
                              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                                {project.tech.slice(0, 3).map((tech) => (
                                  <span
                                    key={tech}
                                    className="rounded-full border border-white/10 bg-black/55 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Spotlight>
                      </TiltCard>
                      <div className="absolute -bottom-3 left-4 z-10 sm:left-6">
                        <span className="note-tag bg-[#09090B]">{project.category}</span>
                      </div>
                    </div>

                    <div className={`relative lg:col-span-5 ${reverse ? 'lg:order-1 lg:pt-4' : 'lg:pt-8'}`}>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-10 right-0 select-none font-display text-7xl font-extrabold leading-none text-white/[0.03]"
                      >
                        {number}
                      </div>

                      <div className="relative flex items-center gap-3">
                        <span className="font-display text-xs font-bold tracking-[0.2em] text-[#818CF8]">NO. {number}</span>
                        <span className="h-px w-10 bg-gradient-to-r from-[#6366F1]/60 to-transparent" aria-hidden="true" />
                        <span className="font-editorial text-sm italic text-[#8b8b95]">featured work</span>
                      </div>

                      <h3 className="relative mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight text-[#F5F5F5] sm:text-4xl">
                        {project.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8">
                        {project.description}
                      </p>

                      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-[#27272A] py-4">
                        <div>
                          <dt className="label-caps text-[#8b8b95]">Role</dt>
                          <dd className="mt-1 text-sm text-[#d4d4d8]">{project.role}</dd>
                        </div>
                        <div>
                          <dt className="label-caps text-[#8b8b95]">Category</dt>
                          <dd className="mt-1 text-sm text-[#d4d4d8]">{project.category}</dd>
                        </div>
                      </dl>

                      {project.tech?.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.tech.map((item) => (
                            <Badge key={item} tone="outline">{item}</Badge>
                          ))}
                        </div>
                      )}

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        {demoUrl && (
                          <ButtonLink href={demoUrl} target="_blank" rel="noreferrer noopener" size="sm" className="group">
                            <Globe aria-hidden="true" className="h-3.5 w-3.5" />
                            Live Demo
                            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </ButtonLink>
                        )}
                        {githubUrl && (
                          <ButtonLink href={githubUrl} target="_blank" rel="noreferrer noopener" variant="secondary" size="sm" className="group">
                            <Code2 aria-hidden="true" className="h-3.5 w-3.5" />
                            GitHub
                            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </ButtonLink>
                        )}
                        {(project.problem || project.solution) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedProject(isExpanded ? null : project.key)}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? 'Hide case study' : 'Read case study'}
                          </Button>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (project.problem || project.solution) && (
                          <motion.div
                            key="details"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE.inOut }}
                            className="overflow-hidden"
                          >
                            <div className="edge-glow mt-6 space-y-5 rounded-xl border border-[#27272A] bg-[linear-gradient(145deg,#141419,#111116)] p-5">
                              {project.problem && (
                                <div>
                                  <p className="label-caps text-[#A5B4FC]">Problem / Background</p>
                                  <p className="mt-2 text-sm leading-7 text-[#A1A1AA]">{project.problem}</p>
                                </div>
                              )}
                              {project.solution && (
                                <div>
                                  <p className="label-caps text-[#A5B4FC]">Process & solution</p>
                                  <p className="mt-2 text-sm leading-7 text-[#A1A1AA]">{project.solution}</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </Section>
  )
}

export default Projects
