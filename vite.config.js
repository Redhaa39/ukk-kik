import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Social crawlers need absolute URLs for og:image / canonical. Set
// VITE_SITE_URL (e.g. https://redha.dev) in the host's env vars.
function siteUrl(mode) {
  const env = loadEnv(mode, '.', 'VITE_')
  return String(env.VITE_SITE_URL || '').trim().replace(/\/+$/, '')
}

function htmlSiteUrl(mode) {
  const url = siteUrl(mode)
  return {
    name: 'html-site-url',
    transformIndexHtml(html) {
      if (!url && mode === 'production') {
        console.warn(
          '\n[html-site-url] VITE_SITE_URL is not set: og:image and canonical will not be absolute URLs.\n',
        )
      }
      return html.replaceAll('%SITE_URL%', url)
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), htmlSiteUrl(mode)],
}))
