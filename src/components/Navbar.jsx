import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from 'lucide-react'
import { EASE } from '../lib/motion'
import { ButtonLink } from './ui'
import useActiveSection from '../hooks/useActiveSection'

const homeLinks = [
  { name: 'Home', href: '/#home', id: 'home' },
  { name: 'Projects', href: '/#projects', id: 'projects' },
  { name: 'Blog', href: '/#blog', id: 'blog' },
  { name: 'Testimonials', href: '/#testimonials', id: 'testimonials' },
  { name: 'Contact', href: '/#contact', id: 'contact' },
]

const aboutLinks = [
  { name: 'About Me', href: '/about#about-me', id: 'about-me' },
  { name: 'Skills', href: '/about#skills', id: 'skills' },
  { name: 'Experience', href: '/about#experience', id: 'experience' },
  { name: 'Certificates', href: '/about#certificates', id: 'certificates' },
  { name: 'Education', href: '/about#education', id: 'education' },
]

const homeSectionIds = homeLinks.map((link) => link.id)
const aboutSectionIds = aboutLinks.map((link) => link.id)

function navClass(active) {
  return `nav-link relative isolate inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
    active ? 'text-[#F5F5F5]' : 'text-[#A1A1AA]'
  }`
}

function ActiveUnderline({ active, id = 'nav-active-underline' }) {
  if (!active) return null
  return (
    <motion.span
      layoutId={id}
      aria-hidden="true"
      className="nav-underline absolute inset-x-3 bottom-0.5 h-[2px] rounded-full"
      transition={{ type: 'spring', stiffness: 460, damping: 38, mass: 0.7 }}
    />
  )
}

function mobileClass(active) {
  return `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
    active
      ? 'bg-[#6366F1]/10 text-[#F5F5F5]'
      : 'text-[#A1A1AA] hover:bg-[#18181F] hover:text-[#F5F5F5]'
  }`
}

function Navbar() {
  const { pathname, hash } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [lightMode, setLightMode] = useState(() => {
    try {
      return localStorage.getItem('redha-theme') === 'light'
    } catch {
      return false
    }
  })
  const aboutRef = useRef(null)
  const attachedRef = useRef(true)

  const isHome = pathname === '/'
  const isAbout = pathname === '/about'
  const activeHomeSection = useActiveSection(homeSectionIds, isHome)
  const activeAboutSection = useActiveSection(aboutSectionIds, isAbout)

  const hashId = hash.slice(1)
  const currentHomeId = activeHomeSection || hashId || (isHome ? 'home' : '')
  const currentAboutId = activeAboutSection || hashId || (isAbout ? 'about-me' : '')

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', lightMode)
    try {
      localStorage.setItem('redha-theme', lightMode ? 'light' : 'dark')
    } catch {
      // Storage may be unavailable (private mode); the class still applies.
    }
    const themeColor = document.querySelector('meta[name="theme-color"]')
    if (themeColor) themeColor.setAttribute('content', lightMode ? '#f7f7f8' : '#09090B')
  }, [lightMode])

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY
      // Hysteresis keeps the bar attached only at the very top, then floats it.
      const next = attachedRef.current ? y <= 32 : y <= 8
      if (next !== attachedRef.current) {
        attachedRef.current = next
        setAtTop(next)
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!aboutOpen) return undefined
    function handlePointerDown(event) {
      if (aboutRef.current && !aboutRef.current.contains(event.target)) setAboutOpen(false)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setAboutOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [aboutOpen])

  useEffect(() => {
    if (!isOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  function closeMenus() {
    setIsOpen(false)
    setAboutOpen(false)
    setMobileAboutOpen(false)
  }

  function handleLink(href) {
    closeMenus()
    if (href === `${pathname}${hash}`) {
      const id = href.split('#')[1]
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const themeBtn = (extra = '') => (
    <button
      type="button"
      onClick={() => setLightMode((v) => !v)}
      aria-label={lightMode ? 'Switch to dark theme' : 'Switch to light theme'}
      aria-pressed={lightMode}
      className={`nav-icon group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#27272A] bg-[#111116]/60 text-[#A1A1AA] backdrop-blur hover:border-[#6366F1]/40 hover:text-[#F5F5F5] ${extra}`}
    >
      <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={lightMode ? 'moon' : 'sun'}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ duration: 0.24, ease: EASE.out }}
          >
            {lightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )

  return (
    <>
      <div aria-hidden="true" className="h-[72px]" />
      <nav aria-label="Primary" className="fixed inset-x-0 top-0 z-50">
        <div
          className={`mx-auto w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            atTop ? 'max-w-6xl px-5 sm:px-6' : 'max-w-5xl px-3 pt-3 sm:px-4 sm:pt-4'
          }`}
        >
          <div
            className={`flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:gap-3 ${
              atTop
                ? 'h-[72px] border border-transparent bg-[#09090B]/55 backdrop-blur-xl'
                : 'nav-bubble h-14 rounded-2xl border border-[#27272A]/80 bg-[#09090B]/85 px-2.5 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:h-16 sm:px-3'
            }`}
          >
            <Link
              to="/#home"
              onClick={() => handleLink('/#home')}
              className="group relative flex shrink-0 items-center gap-2.5"
            >
              <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-[0.6rem] bg-[linear-gradient(135deg,#6366F1,#A855F7)] text-[11px] font-bold tracking-tight text-white shadow-[0_10px_24px_-10px_rgba(99,102,241,0.95)]">
                RA
                <span className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.24))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-[#F5F5F5]">
                Redha
                <motion.span
                  className="inline-block text-[#818CF8]"
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  .
                </motion.span>
              </span>
            </Link>

            <div className="ml-auto hidden items-center gap-0.5 lg:flex">
              <Link
                to="/#home"
                onClick={() => handleLink('/#home')}
                aria-current={isHome && currentHomeId === 'home' ? 'page' : undefined}
                className={navClass(isHome && currentHomeId === 'home')}
              >
                <ActiveUnderline active={isHome && currentHomeId === 'home'} />
                Home
              </Link>

              <div ref={aboutRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAboutOpen((open) => !open)}
                  aria-expanded={aboutOpen}
                  aria-haspopup="true"
                  aria-controls="about-dropdown"
                  aria-current={isAbout ? 'page' : undefined}
                  className={`${navClass(isAbout)} gap-1`}
                >
                  <ActiveUnderline active={isAbout} />
                  About
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${aboutOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      id="about-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.97, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -6, scale: 0.98, filter: 'blur(4px)' }}
                      transition={{ duration: 0.22, ease: EASE.expo }}
                      className="absolute left-0 top-[calc(100%+0.55rem)] w-60 origin-top rounded-2xl border border-[#27272A] bg-[#141419]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
                    >
                      <p className="px-3 pb-2 pt-1 text-[10px] uppercase tracking-[0.22em] text-[#8b8b95]">
                        Explore about
                      </p>
                      {aboutLinks.map((link, index) => {
                        const isCurrent = isAbout && currentAboutId === link.id
                        return (
                          <motion.div
                            key={link.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.22, delay: 0.03 + index * 0.025, ease: EASE.out }}
                          >
                            <Link
                              to={link.href}
                              onClick={() => handleLink(link.href)}
                              aria-current={isCurrent ? 'page' : undefined}
                              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                                isCurrent
                                  ? 'bg-[#6366F1]/10 text-[#F5F5F5]'
                                  : 'text-[#A1A1AA] hover:bg-[#18181F] hover:text-[#F5F5F5]'
                              }`}
                            >
                              {link.name}
                              <ArrowUpRight aria-hidden="true" className="h-3 w-3 opacity-40" />
                            </Link>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {homeLinks.slice(1).map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => handleLink(link.href)}
                  aria-current={isHome && currentHomeId === link.id ? 'page' : undefined}
                  className={navClass(isHome && currentHomeId === link.id)}
                >
                  <ActiveUnderline active={isHome && currentHomeId === link.id} />
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2 lg:ml-3">
              <span
                aria-hidden="true"
                className="mx-1 hidden h-5 w-px bg-[#27272A] lg:block"
              />
              {themeBtn()}
              <ButtonLink
                to="/#contact"
                onClick={() => handleLink('/#contact')}
                size="sm"
                className="group max-lg:hidden"
              >
                <span className="relative mr-0.5 flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-300" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                </span>
                Available for work
              </ButtonLink>
              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                className="nav-icon relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#27272A] text-[#F5F5F5] hover:border-[#6366F1]/40 lg:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isOpen ? 'close' : 'menu'}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
                    transition={{ duration: 0.22, ease: EASE.out }}
                  >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="mobile-navigation"
                key="mobile-navigation"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.34, ease: EASE.expo }}
                className="mt-2 overflow-hidden rounded-2xl border border-[#27272A]/80 bg-[#09090B]/95 backdrop-blur-xl lg:hidden"
              >
                <div className="flex max-h-[calc(100vh-7rem)] w-full flex-col gap-1 overflow-y-auto px-3 py-3">
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.06, ease: EASE.out }}
                  >
                    <Link
                      to="/#home"
                      onClick={() => handleLink('/#home')}
                      className={mobileClass(isHome && currentHomeId === 'home')}
                    >
                      Home
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 opacity-40" />
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1, ease: EASE.out }}
                  >
                    <button
                      type="button"
                      onClick={() => setMobileAboutOpen((open) => !open)}
                      aria-expanded={mobileAboutOpen}
                      aria-controls="mobile-about-links"
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isAbout
                          ? 'bg-[#6366F1]/10 text-[#F5F5F5]'
                          : 'text-[#A1A1AA] hover:bg-[#18181F] hover:text-[#F5F5F5]'
                      }`}
                    >
                      About
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 transition-transform duration-300 ${mobileAboutOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {mobileAboutOpen && (
                        <motion.div
                          id="mobile-about-links"
                          key="mobile-about-links"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: EASE.expo }}
                          className="overflow-hidden"
                        >
                          <div className="ml-3 mt-1 flex flex-col border-l border-[#27272A] pl-3">
                            {aboutLinks.map((link) => {
                              const isCurrent = isAbout && currentAboutId === link.id
                              return (
                                <Link
                                  key={link.id}
                                  to={link.href}
                                  onClick={() => handleLink(link.href)}
                                  aria-current={isCurrent ? 'page' : undefined}
                                  className={mobileClass(isCurrent)}
                                >
                                  {link.name}
                                </Link>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {homeLinks.slice(1).map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.12 + index * 0.04, ease: EASE.out }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => handleLink(link.href)}
                        aria-current={isHome && currentHomeId === link.id ? 'page' : undefined}
                        className={mobileClass(isHome && currentHomeId === link.id)}
                      >
                        {link.name}
                        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 opacity-40" />
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3, ease: EASE.out }}
                    className="mt-2 border-t border-[#27272A]/80 pt-3"
                  >
                    <ButtonLink
                      to="/#contact"
                      onClick={() => handleLink('/#contact')}
                      className="w-full"
                    >
                      <span className="relative mr-0.5 flex h-1.5 w-1.5" aria-hidden="true">
                        <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-300" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      </span>
                      Available for work
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </ButtonLink>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  )
}

export default Navbar
