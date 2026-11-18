import { Link, useLocation } from 'react-router-dom'
import { ArrowUp, ArrowUpRight, Sparkles } from 'lucide-react'
import SocialIcon from './SocialIcon'
import { ButtonLink } from './ui'
import { profile, socialLinks } from '../data/profile'

const exploreLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
]

const aboutLinks = [
  { label: 'About Me', href: '/about#about-me' },
  { label: 'Skills', href: '/about#skills' },
  { label: 'Experience', href: '/about#experience' },
  { label: 'Certificates', href: '/about#certificates' },
  { label: 'Education', href: '/about#education' },
]

function Footer() {
  const { pathname, hash } = useLocation()

  function handleLink(event, href) {
    if (href !== `${pathname}${hash}`) return
    event.preventDefault()
    const id = href.split('#')[1]
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden border-t border-[#27272A] bg-[#09090B]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[#6366F1]/10 blur-[110px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-8 pt-16 sm:px-6 sm:pt-20">
        <div className="gradient-ring relative overflow-hidden rounded-3xl border border-[#27272A] bg-[linear-gradient(145deg,#15151f,#0f0f16_58%,#171326)] px-6 py-10 sm:px-10 sm:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-dashed border-[#6366F1]/25"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-[#A855F7]/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 select-none font-display text-[7rem] font-extrabold leading-none tracking-tighter text-white/[0.025] lg:block"
          >
            HI.
          </div>

          <div className="relative max-w-2xl">
            <p className="label-caps flex items-center gap-2 text-[#A5B4FC]">
              <Sparkles aria-hidden="true" className="h-3 w-3" />
              Have a project in mind?
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.02] tracking-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl">
              Let’s build something
              <br />
              <span className="accent-gradient font-editorial font-medium italic tracking-normal">
                worth remembering.
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#A1A1AA] sm:text-base">
              I’m open to internships, freelance projects, and collaborations. Tell me what you’re
              working on — I’d love to hear it.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink to="/#contact" onClick={(event) => handleLink(event, '/#contact')} size="lg" className="group">
                Start a conversation
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </ButtonLink>
              <ButtonLink href={`mailto:${profile.email}`} variant="secondary" size="lg">
                {profile.email}
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <Link
              to="/#home"
              onClick={(event) => handleLink(event, '/#home')}
              className="group inline-flex items-center gap-2.5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] bg-[linear-gradient(135deg,#6366F1,#A855F7)] text-[11px] font-bold text-white shadow-[0_10px_24px_-10px_rgba(99,102,241,0.95)]">
                RA
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-[#F5F5F5]">
                Redha<span className="text-[#818CF8]">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#A1A1AA]">
              {profile.role} — building thoughtful interfaces with clean code and careful design.
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-[#8b8b95]">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Available for opportunities
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={link.label}
                  title={link.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#27272A] text-[#A1A1AA] transition-colors hover:border-[#6366F1]/40 hover:text-[#F5F5F5]"
                >
                  <SocialIcon name={link.name} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer explore links">
            <p className="label-caps text-[#A1A1AA]">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    onClick={(event) => handleLink(event, link.href)}
                    className="group inline-flex items-center gap-1.5 text-sm text-[#A1A1AA] transition-colors hover:text-[#F5F5F5]"
                  >
                    <span className="h-px w-0 bg-[#6366F1] transition-all duration-300 group-hover:w-3" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer about links">
            <p className="label-caps text-[#A1A1AA]">About</p>
            <ul className="mt-4 space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    onClick={(event) => handleLink(event, link.href)}
                    className="group inline-flex items-center gap-1.5 text-sm text-[#A1A1AA] transition-colors hover:text-[#F5F5F5]"
                  >
                    <span className="h-px w-0 bg-[#6366F1] transition-all duration-300 group-hover:w-3" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none mt-12 select-none overflow-hidden text-center font-display text-[18vw] font-extrabold leading-[0.8] tracking-tighter text-outline opacity-[0.16] sm:text-[13rem] lg:text-[15rem]"
        >
          REDHA
        </div>

        <div className="mt-4 flex flex-col gap-4 border-t border-[#27272A] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-[#8b8b95]">
            © {new Date().getFullYear()} {profile.name}. Built with care.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/admin" className="text-xs text-[#8b8b95] transition-colors hover:text-[#F5F5F5]">
              Admin
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 rounded-full border border-[#27272A] px-3 py-2 text-xs text-[#A1A1AA] transition-colors hover:border-[#6366F1]/40 hover:text-[#F5F5F5]"
            >
              Back to top
              <ArrowUp
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
