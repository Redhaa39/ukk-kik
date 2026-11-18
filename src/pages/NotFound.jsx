import { ArrowLeft, Compass, Home, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Aurora from '../components/motion/Aurora'
import { ButtonLink, Section } from '../components/ui'

const quickLinks = [
  { label: 'Projects', to: '/#projects' },
  { label: 'Blog', to: '/#blog' },
  { label: 'Contact', to: '/#contact' },
]

function NotFound() {
  return (
    <Section className="flex min-h-[82vh] items-center overflow-hidden">
      <Aurora />

      <div className="relative mx-auto w-full max-w-xl">
        <Reveal className="text-center" once>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 text-[#A5B4FC] shadow-[0_0_40px_-12px_rgba(99,102,241,0.8)]">
            <SearchX aria-hidden="true" className="h-6 w-6" />
          </span>

          <p className="mt-7 label-caps text-[#A5B4FC]">Error 404</p>

          <h1 className="mt-4 text-7xl font-extrabold leading-none tracking-tighter text-[#F5F5F5] sm:text-9xl">
            <span className="text-outline">404</span>
            <span className="accent-gradient">.</span>
          </h1>

          <h2 className="mt-6 text-xl font-semibold text-[#F5F5F5] sm:text-2xl">
            This page wandered off.
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#A1A1AA] sm:text-base">
            The address you opened is unavailable or has been moved. Head back to the home page to
            keep exploring.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/" size="lg" className="group">
              <Home aria-hidden="true" className="h-4 w-4" />
              Back to Home
            </ButtonLink>
            <ButtonLink to="/about" variant="secondary" size="lg">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              About Me
            </ButtonLink>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-2 border-t border-[#27272A] pt-6">
            <span className="label-caps mr-1 inline-flex items-center gap-1.5 text-[#8b8b95]">
              <Compass aria-hidden="true" className="h-3 w-3" />
              Try
            </span>
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-full border border-[#27272A] px-3 py-1.5 text-xs text-[#A1A1AA] transition-colors hover:border-[#6366F1]/40 hover:text-[#F5F5F5]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

export default NotFound
