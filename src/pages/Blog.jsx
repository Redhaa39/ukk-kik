import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Clock3, Newspaper, Sparkles, X } from 'lucide-react'
import { api } from '../services/api'
import LoadingGrid from '../components/LoadingGrid'
import Reveal from '../components/Reveal'
import { EASE } from '../lib/motion'
import { Alert, Badge, Button, EmptyState, Section, SectionHeading } from '../components/ui'

const fallbackArticles = [
  {
    id: 'fallback-1',
    category: 'Web Development',
    date: '2026',
    title: 'Getting Started with Front-End Development',
    description: 'An introduction to HTML, CSS, and JavaScript as the foundation of building websites.',
    content: [
      'Front-end development is the part of web development that deals directly with the appearance and interactions visitors use.',
      'HTML structures the page, CSS controls the visual style, and JavaScript adds interaction. Together they form a strong base before learning a framework such as React.',
      'An effective way to learn is to build small projects, try things yourself, then improve the result step by step.',
    ],
  },
  {
    id: 'fallback-2',
    category: 'UI/UX Design',
    date: '2026',
    title: 'The Importance of UI/UX Design',
    description: 'Understanding how interface and user experience design make a website easier to use.',
    content: [
      'UI focuses on visual elements such as color, typography, buttons, and layout. UX focuses on how easy and comfortable a product is to use.',
      'Good design is not only about looking attractive. Users also need to understand how to use a feature without confusion.',
    ],
  },
  {
    id: 'fallback-3',
    category: 'Personal Journey',
    date: '2026',
    title: 'My Journey as a Developer',
    description: 'A story about learning programming, facing challenges, and growing my skills.',
    content: [
      'Becoming a developer is a process that needs curiosity, practice, and consistency. Not everything works on the first attempt.',
      'Every project, however small, can be a chance to grow and build a portfolio.',
    ],
  },
]

function formatDate(value) {
  if (!value) return 'Latest'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function readingTime(content) {
  const words = content.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

// Tiny markdown subset so articles can have structure without a parser
// dependency: "## heading", "- list item", ``` fenced code ```, and paragraphs
// separated by blank lines. Plain-text articles still render as paragraphs.
function parseBlocks(text) {
  const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n')
  const blocks = []
  let paragraph = []
  let list = []

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'p', text: paragraph.join(' ') })
    paragraph = []
  }
  const flushList = () => {
    if (list.length) blocks.push({ type: 'ul', items: list })
    list = []
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]

    if (line.trim().startsWith('```')) {
      flushParagraph()
      flushList()
      const code = []
      i += 1
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i])
        i += 1
      }
      blocks.push({ type: 'code', text: code.join('\n') })
      continue
    }

    if (!line.trim()) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = /^#{1,3}\s+(.+)$/.exec(line)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'h', text: heading[1].trim() })
      continue
    }

    const item = /^\s*[-*]\s+(.+)$/.exec(line)
    if (item) {
      flushParagraph()
      list.push(item[1].trim())
      continue
    }

    flushList()
    paragraph.push(line.trim())
  }

  flushParagraph()
  flushList()
  return blocks
}

function blocksToText(blocks) {
  return blocks
    .map((block) => (block.type === 'ul' ? block.items.join(' ') : block.text))
    .join(' ')
}

function ArticleBlock({ block }) {
  if (block.type === 'h') {
    return (
      <h4 className="pt-3 text-xl font-bold tracking-tight text-[#F5F5F5] sm:text-2xl">
        {block.text}
      </h4>
    )
  }
  if (block.type === 'ul') {
    return (
      <ul className="list-disc space-y-2 pl-6 text-sm leading-8 text-[#d4d4d8] marker:text-[#8b8b95] sm:text-base">
        {block.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    )
  }
  if (block.type === 'code') {
    return (
      <pre className="overflow-x-auto rounded-xl border border-[#27272A] bg-[#09090B] p-4 text-[13px] leading-6 text-[#d4d4d8]">
        <code>{block.text}</code>
      </pre>
    )
  }
  return <p className="text-sm leading-8 text-[#d4d4d8] sm:text-base">{block.text}</p>
}

function Blog() {
  const [articleItems, setArticleItems] = useState([])
  const [activeArticle, setActiveArticle] = useState(null)
  const [status, setStatus] = useState('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const [progress, setProgress] = useState(0)
  const closeButtonRef = useRef(null)
  const lastFocusedRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    let active = true
    api('blogs', { scope: 'public' })
      .then((result) => {
        if (!active) return
        const items = (result.items || []).map((item) => {
          const blocks = parseBlocks(item.content)
          return {
            ...item,
            key: `article-${item.id}`,
            description: item.excerpt || '',
            date: formatDate(item.published_at),
            readTime: readingTime(blocksToText(blocks)),
            cover_url: item.cover_url || '',
            blocks,
          }
        })
        setArticleItems(items)
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return
        setArticleItems(
          fallbackArticles.map((item) => {
            const blocks = item.content.map((text) => ({ type: 'p', text }))
            return { ...item, key: item.id, blocks, readTime: readingTime(blocksToText(blocks)) }
          }),
        )
        setStatus('error')
      })
    return () => { active = false }
  }, [reloadKey])

  function retryLoad() {
    setStatus('loading')
    setReloadKey((v) => v + 1)
  }

  function openArticle(article) {
    setProgress(0)
    setActiveArticle(article)
  }

  useEffect(() => {
    if (!activeArticle) return undefined
    lastFocusedRef.current = document.activeElement
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setActiveArticle(null)
        return
      }
      if (event.key !== 'Tab') return

      // Focus trap: keep Tab / Shift+Tab cycling inside the dialog.
      const focusable = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const current = document.activeElement
      if (!dialogRef.current.contains(current)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKeyDown)
      lastFocusedRef.current?.focus?.()
    }
  }, [activeArticle])

  function handleReaderScroll(event) {
    const el = event.currentTarget
    const max = el.scrollHeight - el.clientHeight
    setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0)
  }

  const [featured, ...rest] = articleItems

  return (
    <Section id="blog" tone="muted" glow className="texture-paper">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <SectionHeading
          eyebrow="Writing"
          title="Notes &"
          accent="articles."
          description="Thoughts, lessons, and bits of my learning journey — written down as I go."
        />
        <div className="flex flex-wrap items-end gap-4 lg:justify-end">
          <span className="font-editorial text-lg italic text-[#A1A1AA]">journal & learnings</span>
          <span className="note-tag bg-[#18181F]/80">
            <Sparkles aria-hidden="true" className="h-3 w-3 text-[#A5B4FC]" />
            {articleItems.length} articles
          </span>
        </div>
      </div>

      <div className="mt-10">
        {status === 'error' && (
          <Alert
            tone="info"
            title="Preview mode"
            className="mb-8"
            action={<Button variant="outline" size="sm" onClick={retryLoad}>Try again</Button>}
          >
            Showing sample articles because server data is not available yet.
          </Alert>
        )}

        {status === 'loading' && <LoadingGrid />}

        {status !== 'loading' && articleItems.length === 0 && (
          <EmptyState
            icon={Newspaper}
            title="No articles yet"
            description="I haven’t published anything here yet — check back later for notes and write-ups."
          />
        )}

        {status !== 'loading' && articleItems.length > 0 && (
          <div className="space-y-12">
            <Reveal as="article">
              <button
                type="button"
                onClick={() => openArticle(featured)}
                className="group gradient-ring relative grid w-full overflow-hidden rounded-2xl border border-[#27272A] bg-[#18181F]/80 text-left transition-colors hover:border-[#6366F1]/35 lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div className="relative min-h-[16rem] overflow-hidden bg-[#111116] lg:min-h-[24rem]">
                  {featured.cover_url ? (
                    <img
                      src={featured.cover_url}
                      alt={`Cover for ${featured.title}`}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="relative flex h-full min-h-[16rem] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#1b1b2b,#111116_55%,#181828)]">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
                      />
                      <div className="relative flex flex-col items-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 text-[#A5B4FC] shadow-[0_0_40px_-12px_rgba(99,102,241,0.7)]">
                          <Newspaper aria-hidden="true" className="h-7 w-7" />
                        </span>
                        <span className="mt-4 font-editorial text-sm italic text-[#8b8b95]">
                          the latest note
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#818CF8]" />
                    Featured
                  </span>
                </div>

                <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#A1A1AA]">
                    <Badge tone="accent">{featured.category}</Badge>
                    <span>{featured.date}</span>
                    <span className="text-[#3f3f46]">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 aria-hidden="true" className="h-3 w-3" />
                      {featured.readTime}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-[#F5F5F5] transition-colors group-hover:text-[#c7d2fe] sm:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#A1A1AA] sm:text-base sm:leading-8">
                    {featured.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-[#A5B4FC]">
                    Read article
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </div>
              </button>
            </Reveal>

            {rest.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article, index) => (
                  <Reveal key={article.key} as="article" delay={(index % 3) * 60}>
                    <button
                      type="button"
                      onClick={() => openArticle(article)}
                      className="group card-lift flex h-full w-full flex-col rounded-xl border border-[#27272A] bg-[#18181F]/55 p-5 text-left backdrop-blur"
                    >
                      <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                        <span className="rounded-full border border-[#6366F1]/25 bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-medium text-[#A5B4FC]">
                          {article.category}
                        </span>
                        <span className="text-[#3f3f46]">·</span>
                        <span>{article.date}</span>
                      </div>
                      <h3 className="mt-4 text-lg font-bold leading-7 text-[#F5F5F5] transition-colors group-hover:text-[#A5B4FC]">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-7 text-[#A1A1AA]">{article.description}</p>
                      <div className="mt-auto flex items-center justify-between pt-5 text-xs text-[#8b8b95]">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 aria-hidden="true" className="h-3 w-3" />
                          {article.readTime}
                        </span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#27272A] text-[#8b8b95] transition-colors group-hover:border-[#6366F1]/40 group-hover:text-[#A5B4FC]">
                          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {activeArticle && (
            <motion.div
              key="blog-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md sm:px-5 sm:py-8"
              onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveArticle(null) }}
            >
            <motion.article
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="blog-dialog-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.985 }}
              transition={{ duration: 0.32, ease: EASE.expo }}
              className="relative flex max-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#27272A] bg-[#141419] shadow-2xl sm:max-h-[calc(100dvh-4rem)]"
            >
              <div className="relative z-10 h-0.5 shrink-0 bg-[#27272A]">
                <div
                  className="h-full origin-left bg-gradient-to-r from-[#6366F1] via-[#A5B4FC] to-[#22D3EE] transition-[width] duration-150"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>

              <div
                className="min-h-0 overflow-y-auto overscroll-contain"
                onScroll={handleReaderScroll}
              >
                {activeArticle.cover_url && (
                  <div className="relative h-40 overflow-hidden sm:h-52">
                    <img
                      src={activeArticle.cover_url}
                      alt={`Cover for ${activeArticle.title}`}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-[#141419]/20 to-transparent" />
                  </div>
                )}

                <div className="p-6 sm:p-8 md:p-10">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="accent">{activeArticle.category}</Badge>
                      <span className="text-xs text-[#8b8b95]">{activeArticle.date}</span>
                    </div>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => setActiveArticle(null)}
                      aria-label="Close article"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#27272A] text-[#A1A1AA] transition hover:border-[#6366F1]/40 hover:text-[#F5F5F5]"
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 id="blog-dialog-title" className="text-2xl font-extrabold leading-tight tracking-tight text-[#F5F5F5] md:text-3xl">
                    {activeArticle.title}
                  </h3>
                  <p className="mt-3 inline-flex items-center gap-2 text-xs text-[#8b8b95]">
                    <Clock3 aria-hidden="true" className="h-3 w-3" />
                    {activeArticle.readTime}
                  </p>

                  <div className="mt-7 space-y-5">
                    {activeArticle.blocks.map((block, index) => (
                      <ArticleBlock key={index} block={block} />
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#27272A] pt-6">
                    <p className="font-editorial text-sm italic text-[#8b8b95]">
                      Thanks for reading — Redha
                    </p>
                    <Button variant="secondary" size="sm" onClick={() => setActiveArticle(null)}>Close article</Button>
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>,
        document.body,
      )}
    </Section>
  )
}

export default Blog
