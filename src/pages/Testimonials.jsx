import { useEffect, useState } from 'react'
import { MessageSquareQuote, Quote, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { api } from '../services/api'
import LoadingGrid from '../components/LoadingGrid'
import Reveal from '../components/Reveal'
import { Alert, Button, EmptyState, Field, Honeypot, Section, SectionHeading, inputClasses } from '../components/ui'

function formatTestimonialDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function StarRating({ value, onChange, readOnly = false }) {
  const rating = Number(value) || 0

  if (readOnly) {
    return (
      <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden="true"
            className={`h-4 w-4 ${star <= rating ? 'text-amber-400' : 'text-[#3f3f46]'}`}
            fill={star <= rating ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Select a star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          onClick={() => onChange?.(star)}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          aria-checked={rating === star}
          className="rounded-md p-1 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/60"
        >
          <Star
            aria-hidden="true"
            className={`h-7 w-7 ${star <= rating ? 'text-amber-400' : 'text-[#3f3f46]'}`}
            fill={star <= rating ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}

function Testimonials() {
  const [items, setItems] = useState([])
  const [formData, setFormData] = useState({ name: '', rating: 5, message: '', website: '' })
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('loading')
  const [submitting, setSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    api('testimonials', { scope: 'public' })
      .then((result) => {
    if (!active) return
      // Pengaman tambahan: hanya tampilkan yang sudah disetujui admin.
      setItems((result.items || []).filter((item) => item.status === 'approved'))
      setStatus('ready')
    })
      .catch(() => { if (!active) return; setItems([]); setStatus('error') })
    return () => { active = false }
  }, [reloadKey])

  function retryLoad() { setStatus('loading'); setReloadKey((v) => v + 1) }
  function handleChange(event) { setFormData((c) => ({ ...c, [event.target.name]: event.target.value })) }

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice(''); setError(''); setSubmitting(true)
    try {
      const result = await api('testimonials', { method: 'POST', body: { ...formData, rating: Number(formData.rating) } })
      setFormData({ name: '', rating: 5, message: '', website: '' })
      setNotice(result.message || 'Thanks! Your testimonial is waiting for admin approval.')
    } catch (submitError) {
      setError(submitError.message || 'Your testimonial could not be sent. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const average = items.length
    ? (items.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) / items.length).toFixed(1)
    : '—'

  return (
    <Section id="testimonials" tone="base" glow className="texture-ruled">
      <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <Reveal direction="up" distance={18}>
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Testimonials"
              title="Words from"
              accent="visitors."
              description="If we’ve worked together or you have thoughts about my work, I’d appreciate hearing from you."
            />

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="note-tag bg-[#111116]/80">
                <Sparkles aria-hidden="true" className="h-3 w-3 text-[#A5B4FC]" />
                guestbook
              </span>
              <span className="note-tag bg-[#111116]/80">
                <ShieldCheck aria-hidden="true" className="h-3 w-3 text-emerald-400" />
                moderated
              </span>
            </div>

            <div className="gradient-ring mt-8 rounded-2xl border border-[#27272A] bg-[#141419]/80 p-5 backdrop-blur sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6366F1]/25 bg-[#6366F1]/10 text-[#A5B4FC]">
                  <MessageSquareQuote aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-[#F5F5F5]">Leave a note</p>
                  <p className="text-xs text-[#8b8b95]">Shown after approval</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative mt-5 space-y-5">
                <Honeypot value={formData.website} onChange={handleChange} />
                <Field label="Your name" htmlFor="testimonial-name">
                  <input
                    id="testimonial-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    maxLength={60}
                    required
                    className={inputClasses}
                  />
                </Field>

                <div>
                  <p className="mb-3 text-sm font-medium text-[#d4d4d8]">Your rating</p>
                  <StarRating value={formData.rating} onChange={(rating) => setFormData((c) => ({ ...c, rating }))} />
                  <p className="mt-2 text-xs text-[#8b8b95]">{formData.rating} out of 5 stars</p>
                </div>

                <Field label="Your testimonial" htmlFor="testimonial-message" counter={`${formData.message.length}/500`}>
                  <textarea
                    id="testimonial-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your experience..."
                    rows={5}
                    maxLength={500}
                    required
                    className={`${inputClasses} resize-y`}
                  />
                </Field>

                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? 'Sending...' : 'Submit testimonial'}
                </Button>

                {notice && <Alert tone="success">{notice}</Alert>}
                {error && <Alert tone="error">{error}</Alert>}
              </form>
            </div>
          </div>
        </Reveal>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#27272A] pb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#F5F5F5]">Approved testimonials</h3>
              <p className="mt-1 text-xs text-[#8b8b95]">{items.length} shared · real words from real people</p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-[#27272A] bg-[#18181F]/70 px-4 py-2">
              <span className="font-display text-lg font-extrabold text-[#F5F5F5]">{average}</span>
              <span className="text-[#3f3f46]">/</span>
              <span className="text-xs text-[#A1A1AA]">5 average</span>
            </div>
          </div>

          {status === 'loading' && <LoadingGrid count={2} columns="grid-cols-1" />}

          {status === 'error' && (
            <Alert
              tone="info"
              title="Testimonials could not be loaded"
              action={<Button variant="outline" size="sm" onClick={retryLoad}>Try again</Button>}
            >
              Testimonials will appear once the data is available.
            </Alert>
          )}

          {status === 'ready' && items.length === 0 && (
            <EmptyState
              icon={Quote}
              title="No testimonials yet"
              description="Be the first to share a note — your message will appear here after approval."
            />
          )}

          {status === 'ready' && items.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              {items.map((item, index) => (
                <Reveal key={item.id} as="article" delay={(index % 3) * 50}>
                  <div className="group card-lift gradient-ring relative flex h-full flex-col overflow-hidden rounded-xl border border-[#27272A] bg-[#18181F]/65 p-5 backdrop-blur">
                    <Quote
                      aria-hidden="true"
                      className="absolute -right-1 -top-1 h-16 w-16 text-white/[0.035] transition-colors group-hover:text-[#6366F1]/15"
                      fill="currentColor"
                    />
                    <StarRating value={item.rating} readOnly />
                    <p className="relative mt-3 flex-1 text-sm leading-7 text-[#d4d4d8]">
                      “{item.message}”
                    </p>
                    <div className="mt-5 flex items-center gap-3 border-t border-[#27272A]/80 pt-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6366F1,#A855F7)] text-[11px] font-bold text-white">
                        {initials(item.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#F5F5F5]">{item.name}</p>
                        {item.created_at && (
                          <p className="text-[11px] text-[#8b8b95]">{formatTestimonialDate(item.created_at)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}

export default Testimonials
