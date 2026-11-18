import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import DocumentTitle from './components/DocumentTitle'
import ScrollToTop from './components/ScrollToTop'
import ScrollProgress from './components/motion/ScrollProgress'
import CursorGlow from './components/motion/CursorGlow'
import { EASE } from './lib/motion'
import Home from './pages/Home'
import About from './pages/About'
import AboutPage from './pages/AboutPage'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import Testimonials from './pages/Testimonials'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
// Admin is only used by one person; keep it (and its code) out of the public bundle.
const Admin = lazy(() => import('./admin/Admin'))

function HomePage() {
  return (
    <>
      <Home />
      <About />
      <Projects />
      <Blog />
      <Testimonials />
      <Contact />
    </>
  )
}

function SiteLayout({ children }) {
  const { pathname } = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex min-h-screen flex-col bg-[#09090B] text-[#F5F5F5]">
        <div
          aria-hidden="true"
          className="grain-overlay pointer-events-none fixed inset-0 z-[80]"
        />
        <CursorGlow />
        <ScrollProgress />
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 18, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.995 }}
              transition={{ duration: 0.5, ease: EASE.expo }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}

function App() {
  return (
    <BrowserRouter>
      <DocumentTitle />
      <Routes>
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#111318] text-sm text-[#cfc9bf]">
                  <p role="status">Memuat admin...</p>
                </div>
              }
            >
              <Admin />
            </Suspense>
          }
        />
        <Route path="/" element={<SiteLayout><HomePage /></SiteLayout>} />
        <Route path="/about" element={<SiteLayout><AboutPage /></SiteLayout>} />

        {/* Friendly aliases so typed URLs do not end up on the 404 page. */}
        <Route path="/home" element={<Navigate to="/#home" replace />} />
        <Route path="/projects" element={<Navigate to="/#projects" replace />} />
        <Route path="/blog" element={<Navigate to="/#blog" replace />} />
        <Route path="/testimonials" element={<Navigate to="/#testimonials" replace />} />
        <Route path="/contact" element={<Navigate to="/#contact" replace />} />
        <Route path="/skills" element={<Navigate to="/about#skills" replace />} />
        <Route path="/certificates" element={<Navigate to="/about#certificates" replace />} />
        <Route path="/experience" element={<Navigate to="/about#experience" replace />} />
        <Route path="/education" element={<Navigate to="/about#education" replace />} />

        <Route path="*" element={<SiteLayout><NotFound /></SiteLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
