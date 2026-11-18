import { useEffect, useState } from 'react'
import { Award, ArrowUpRight, FileText, Sparkles } from 'lucide-react'
import { api } from '../services/api'
import LoadingGrid from '../components/LoadingGrid'
import Reveal from '../components/Reveal'
import { Alert, Button, ButtonLink, EmptyState, Section, SectionHeading } from '../components/ui'

function safeHttpUrl(value) {
  if (!value) return ''
  try {
    const url = new URL(value, window.location.origin)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

function Certificates() {
  const [certificateItems, setCertificateItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    api('certificates', { scope: 'public' })
      .then((result) => { if (!active) return; setCertificateItems(result.items || []); setStatus('ready') })
      .catch(() => { if (!active) return; setCertificateItems([]); setStatus('error') })
    return () => { active = false }
  }, [reloadKey])

  function retryLoad() { setStatus('loading'); setReloadKey((v) => v + 1) }

  return (
    <Section id="certificates" tone="base" offset="about" glow className="texture-paper">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <SectionHeading
          eyebrow="Accomplishments"
          title="Certificates &"
          accent="achievements."
          description="Certifications and learning experiences that mark steps in my development."
        />
        <div className="flex flex-wrap items-end gap-4 lg:justify-end">
          <span className="font-editorial text-lg italic text-[#A1A1AA]">milestones</span>
          {status === 'ready' && certificateItems.length > 0 && (
            <span className="note-tag bg-[#111116]/80">
              <Sparkles aria-hidden="true" className="h-3 w-3 text-[#A5B4FC]" />
              {certificateItems.length} items
            </span>
          )}
        </div>
      </div>

      <div className="mt-12">
        {status === 'loading' && <LoadingGrid />}

        {status === 'error' && (
          <Alert
            tone="info"
            title="Certificates could not be loaded"
            action={<Button variant="outline" size="sm" onClick={retryLoad}>Try again</Button>}
          >
            The certificate list will appear once the data is available.
          </Alert>
        )}

        {status === 'ready' && certificateItems.length === 0 && (
          <EmptyState
            icon={Award}
            title="No certificates yet"
            description="Certificates added from the admin dashboard will appear here."
          />
        )}

        {status === 'ready' && certificateItems.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificateItems.map((certificate, index) => {
              const fileUrl = safeHttpUrl(certificate.file_url)
              return (
                <Reveal as="article" key={certificate.id} delay={(index % 4) * 40}>
                  <div className="card-lift gradient-ring group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#27272A] bg-[#18181F]/55 p-5 backdrop-blur">
                    <Award
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 text-white/[0.03] transition-colors group-hover:text-[#6366F1]/10"
                    />

                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex h-9 min-w-[2.5rem] items-center justify-center rounded-lg border border-[#6366F1]/25 bg-[#6366F1]/10 px-2 text-xs font-semibold text-[#A5B4FC]">
                        {certificate.year || String(certificate.id).padStart(2, '0')}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#27272A] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#8b8b95]">
                        <FileText aria-hidden="true" className="h-3 w-3" />
                        {fileUrl ? 'PDF' : 'Record'}
                      </span>
                    </div>

                    <h3 className="relative mt-4 text-lg font-bold leading-6 tracking-tight text-[#F5F5F5]">
                      {certificate.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#A5B4FC]">{certificate.organizer}</p>
                    {certificate.description && (
                      <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#A1A1AA]">
                        {certificate.description}
                      </p>
                    )}

                    <div className="mt-auto pt-5">
                      {fileUrl ? (
                        <ButtonLink href={fileUrl} target="_blank" variant="secondary" size="sm" className="w-full">
                          View certificate
                          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                        </ButtonLink>
                      ) : (
                        <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#27272A] px-3 py-2 text-xs text-[#8b8b95]">
                          <FileText aria-hidden="true" className="h-3.5 w-3.5" />
                          No file attached
                        </span>
                      )}
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

export default Certificates
