import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Clock3, Copy, Mail, MapPin, Send, Sparkles } from 'lucide-react'
import { api } from '../services/api'
import Reveal from '../components/Reveal'
import SocialIcon from '../components/SocialIcon'
import { profile, socialLinks } from '../data/profile'
import { Alert, Button, Field, Honeypot, Section, inputClasses } from '../components/ui'

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', website: '' })
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function copyEmail() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setNotice(''); setError(''); setSubmitting(true)
    try {
      const result = await api('contact', { method: 'POST', body: formData })
      setNotice(result.message || 'Message sent successfully.')
      setFormData({ name: '', email: '', subject: '', message: '', website: '' })
    } catch (err) {
      setError(err.message || 'Message could not be sent. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section id="contact" tone="muted" glow className="texture-paper">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <Reveal direction="up" distance={18}>
          <div className="relative">
            <div className="flex items-center gap-3">
              <p className="label-caps text-[#A5B4FC]">Get in touch</p>
              <span className="h-px flex-1 max-w-[6rem] bg-gradient-to-r from-[#6366F1]/60 to-transparent" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-4xl font-extrabold leading-[0.98] tracking-tight text-[#F5F5F5] sm:text-5xl lg:text-6xl">
              Let’s make
              <br />
              <span className="font-editorial font-medium italic text-[#A5B4FC]">something good.</span>
            </h2>
            <div className="mt-6 flex items-start gap-4">
              <span className="note-tag rotate-[-2deg] bg-[#18181F]/80">
                <Sparkles aria-hidden="true" className="h-3 w-3 text-[#A5B4FC]" />
                open inbox
              </span>
              <p className="max-w-sm text-base leading-8 text-[#A1A1AA]">
                Have a project idea, an opportunity, or just want to say hello? I’d be happy to hear from you.
              </p>
            </div>

            <div className="mt-10 space-y-7">
              <div>
                <p className="label-caps text-[#8b8b95]">Email</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className="group inline-flex min-w-0 items-center gap-2 rounded-full border border-[#27272A] bg-[#18181F]/70 px-3.5 py-2.5 text-sm text-[#F5F5F5] backdrop-blur transition-colors hover:border-[#6366F1]/40"
                  >
                    <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-[#A5B4FC]" />
                    <span className="truncate">{profile.email}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 text-[#8b8b95] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label={copied ? 'Email copied' : 'Copy email address'}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#27272A] bg-[#18181F]/70 text-[#A1A1AA] backdrop-blur transition-colors hover:border-[#6366F1]/40 hover:text-[#F5F5F5]"
                  >
                    {copied ? (
                      <Check aria-hidden="true" className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy aria-hidden="true" className="h-4 w-4" />
                    )}
                  </button>
                  <span
                    role="status"
                    className={`text-xs text-emerald-400 transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}
                  >
                    Copied!
                  </span>
                </div>
              </div>

              {socialLinks.length > 0 && (
                <div>
                  <p className="label-caps text-[#8b8b95]">Social</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {socialLinks.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group card-lift flex items-center justify-between gap-3 rounded-xl border border-[#27272A] bg-[#18181F]/55 px-3.5 py-3 text-sm text-[#A1A1AA] backdrop-blur transition-colors hover:text-[#F5F5F5]"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#27272A] bg-[#111116] text-[#A1A1AA] transition-colors group-hover:border-[#6366F1]/30 group-hover:text-[#A5B4FC]">
                              <SocialIcon name={link.name} />
                            </span>
                            <span className="truncate">{link.label}</span>
                          </span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-3.5 w-3.5 shrink-0 opacity-40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
                  <p className="label-caps flex items-center gap-1.5 text-emerald-300">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                      <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    Available
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#d4d4d8]">
                    Open to internships, freelance, and collaboration.
                  </p>
                </div>
                <div className="rounded-xl border border-[#27272A] bg-[#18181F]/55 p-4">
                  <p className="label-caps flex items-center gap-1.5 text-[#8b8b95]">
                    <Clock3 aria-hidden="true" className="h-3 w-3" />
                    Response time
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#d4d4d8]">
                    Usually within 1–2 working days.
                  </p>
                </div>
              </div>

              <p className="flex items-center gap-2 text-xs text-[#8b8b95]">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-[#6366F1]" />
                Based in Indonesia · working remotely
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal direction="up" delay={80} distance={18}>
          <div className="gradient-ring relative overflow-hidden rounded-2xl border border-[#27272A] bg-[#141419]/85 backdrop-blur">
            <div className="h-1 w-full bg-[linear-gradient(90deg,#6366F1,#A855F7,#22D3EE)]" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#6366F1]/10 blur-3xl" />
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#6366F1]/25 bg-[#6366F1]/10 text-[#A5B4FC]">
                  <Send aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#F5F5F5]">Send a message</h3>
                  <p className="text-xs text-[#8b8b95]">All fields are required.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative mt-7 space-y-5">
                <Honeypot value={formData.website} onChange={handleChange} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" htmlFor="contact-name">
                    <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" maxLength={100} required autoComplete="name" className={inputClasses} />
                  </Field>
                  <Field label="Your email" htmlFor="contact-email">
                    <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" maxLength={190} required autoComplete="email" className={inputClasses} />
                  </Field>
                </div>

                <Field label="Subject" htmlFor="contact-subject">
                  <input id="contact-subject" type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this about?" maxLength={150} required className={inputClasses} />
                </Field>

                <Field label="Message" htmlFor="contact-message" counter={`${formData.message.length}/3000`}>
                  <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} placeholder="Write your message..." rows={6} maxLength={3000} required className={`${inputClasses} min-h-[150px] resize-y`} />
                </Field>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={submitting} className="group">
                    {submitting ? 'Sending...' : 'Send message'}
                    {!submitting && (
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    )}
                  </Button>
                  <span className="text-xs text-[#8b8b95]">No spam, ever.</span>
                </div>

                {notice && <Alert tone="success">{notice}</Alert>}
                {error && <Alert tone="error">{error}</Alert>}
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

export default Contact
