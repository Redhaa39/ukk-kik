import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const baseTitle = 'Muhammad Redha Ansori'

const titles = {
  '/': `${baseTitle} — Front-End Developer & UI/UX Designer`,
  '/about': `About ${baseTitle} — Skills, Certificates & Experience`,
  '/admin': `Admin Dashboard — ${baseTitle}`,
}

// Pages that should never show up in search results.
const noindexPaths = new Set(['/admin'])

function setHeadTag(selector, create, apply) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  apply(el)
}

function DocumentTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const known = pathname in titles
    document.title = titles[pathname] || `Page Not Found — ${baseTitle}`

    const hidden = noindexPaths.has(pathname) || !known
    setHeadTag(
      'meta[name="robots"]',
      () => Object.assign(document.createElement('meta'), { name: 'robots' }),
      (el) => el.setAttribute('content', hidden ? 'noindex, nofollow' : 'index, follow'),
    )

    // Canonical follows the page; 404s and admin point nowhere useful.
    const canonical = document.head.querySelector('link[rel="canonical"]')
    if (known && !noindexPaths.has(pathname)) {
      setHeadTag(
        'link[rel="canonical"]',
        () => Object.assign(document.createElement('link'), { rel: 'canonical' }),
        (el) => el.setAttribute('href', `${window.location.origin}${pathname === '/' ? '/' : pathname}`),
      )
    } else if (canonical) {
      canonical.remove()
    }
  }, [pathname])

  return null
}

export default DocumentTitle
