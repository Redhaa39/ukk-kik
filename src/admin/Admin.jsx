import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Award,
  Check,
  ExternalLink,
  FolderKanban,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { api } from '../services/api'
import {
  Alert,
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Field,
  inputClasses,
} from '../components/ui'

const sections = [
  { key: 'projects', label: 'Proyek', icon: FolderKanban },
  { key: 'blogs', label: 'Blog', icon: Newspaper },
  { key: 'certificates', label: 'Sertifikat', icon: Award },
  { key: 'testimonials', label: 'Testimoni', icon: MessageSquareQuote },
  { key: 'messages', label: 'Pesan', icon: Mail },
]

const fieldMap = {
  projects: [
    ['title', 'Judul'],
    ['category', 'Kategori'],
    ['description', 'Deskripsi'],
    ['problem', 'Masalah'],
    ['solution', 'Solusi'],
    ['role', 'Peran'],
    ['technologies', 'Teknologi (pisahkan dengan koma)'],
    ['demo_url', 'URL Demo'],
    ['github_url', 'URL GitHub'],
    ['sort_order', 'Urutan'],
  ],
  blogs: [
    ['title', 'Judul'],
    ['category', 'Kategori'],
    ['excerpt', 'Ringkasan'],
    ['content', 'Konten'],
    ['published_at', 'Tanggal Terbit'],
  ],
  certificates: [
    ['title', 'Judul'],
    ['organizer', 'Penyelenggara'],
    ['description', 'Deskripsi'],
    ['year', 'Tahun'],
  ],
  testimonials: [
    ['name', 'Nama'],
    ['rating', 'Rating (1–5)'],
    ['message', 'Pesan'],
  ],
}

const uploadConfig = {
  projects: {
    field: 'image_url',
    label: 'Unggah gambar proyek',
    accept: 'image/png,image/jpeg,image/webp',
    types: ['image/png', 'image/jpeg', 'image/webp'],
  },
  blogs: {
    field: 'cover_url',
    label: 'Unggah cover blog',
    accept: 'image/png,image/jpeg,image/webp',
    types: ['image/png', 'image/jpeg', 'image/webp'],
  },
  certificates: {
    field: 'file_url',
    label: 'Unggah sertifikat (PDF/JPG/PNG/WEBP)',
    accept: 'application/pdf,image/png,image/jpeg,image/webp',
    types: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
  },
}

const createSections = ['projects', 'blogs', 'certificates']
const longFields = ['description', 'problem', 'solution', 'excerpt', 'content', 'message']
const requiredMap = {
  projects: ['title', 'category', 'description'],
  blogs: ['title', 'category', 'excerpt', 'content'],
  certificates: ['title', 'organizer'],
  testimonials: ['name', 'message'],
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

function sectionMeta(key) {
  return sections.find((item) => item.key === key) || sections[0]
}

function formatAdminDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function entryBadge(section, item) {
  if (section === 'messages') {
    return { label: item.is_read ? 'Dibaca' : 'Belum dibaca', tone: item.is_read ? 'neutral' : 'accent' }
  }
  if (section === 'testimonials') {
    if (item.status === 'approved') return { label: 'Disetujui', tone: 'success' }
    if (item.status === 'rejected') return { label: 'Ditolak', tone: 'danger' }
    return { label: 'Menunggu', tone: 'warning' }
  }
  if (section === 'certificates') {
    return { label: item.year || 'Sertifikat', tone: 'neutral' }
  }
  return { label: item.category || '', tone: 'neutral' }
}

function entrySubtitle(section, item) {
  if (section !== 'messages') return ''
  return [item.email, item.subject].filter(Boolean).join(' · ')
}

function entryCaption(section, item) {
  if (section === 'messages') return item.message || ''
  if (section === 'certificates') return item.description || item.organizer || ''
  return item.description || item.message || ''
}

function Admin() {
  const [admin, setAdmin] = useState(null)
  const [section, setSection] = useState('projects')
  const [items, setItems] = useState([])
  const [counts, setCounts] = useState({})
  const [form, setForm] = useState({})
  const [editing, setEditing] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadedSection, setLoadedSection] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [openMessageId, setOpenMessageId] = useState(null)

  // The admin dashboard is intentionally dark. Remove the public light theme
  // while this page is mounted; the Navbar restores it when returning home.
  useEffect(() => {
    document.documentElement.classList.remove('light-mode')
  }, [])

  async function refresh() {
    const [list, stats] = await Promise.all([api(section), api('dashboard')])
    setItems(list.items || [])
    setCounts(stats.counts || {})
  }

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const result = await api('me')
        if (alive) setAdmin(result.admin)
      } catch {
        if (alive) setAdmin(null)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!admin) return undefined
    let active = true

    Promise.all([api(section), api('dashboard')])
      .then(([list, stats]) => {
        if (!active) return
        setItems(list.items || [])
        setCounts(stats.counts || {})
        setError('')
        setLoadedSection(section)
      })
      .catch((e) => {
        if (!active) return
        setError(e.message)
        setLoadedSection(section)
      })

    return () => {
      active = false
    }
  }, [admin, section])

  const fields = useMemo(() => fieldMap[section] || [], [section])
  const upload = uploadConfig[section]
  const canCreate = createSections.includes(section)
  const requiredFields = requiredMap[section] || []
  const listLoading = Boolean(admin) && loadedSection !== section
  const activeSection = sectionMeta(section)

  async function login(event) {
    event.preventDefault()
    setError('')
    setLoggingIn(true)
    try {
      const result = await api('login', { method: 'POST', body: { email, password } })
      setAdmin(result.admin)
      setPassword('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoggingIn(false)
    }
  }

  async function logout() {
    try {
      await api('logout', { method: 'POST' })
    } catch (e) {
      setError(e.message)
    }
    setAdmin(null)
  }

  function startCreate() {
    setEditing('new')
    setForm({ is_published: true, status: 'pending', rating: 5 })
    setError('')
    setNotice('')
  }

  function startEdit(item) {
    setEditing(item.id)
    setForm({
      ...item,
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(', ')
        : item.technologies,
    })
    setError('')
    setNotice('')
  }

  function cancelEdit() {
    setEditing(null)
    setForm({})
  }

  async function save(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    setSaving(true)

    const payload = { ...form }
    if (section === 'projects') {
      payload.technologies = String(form.technologies || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    }
    if (section !== 'testimonials') payload.is_published = form.is_published !== false

    try {
      await api(section, {
        method: editing === 'new' ? 'POST' : 'PUT',
        id: editing === 'new' ? undefined : editing,
        body: payload,
      })
      setEditing(null)
      setForm({})
      setNotice('Data berhasil disimpan.')
      await refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function remove(item) {
    const label = item.title || item.name || item.subject || `#${item.id}`
    if (!window.confirm(`Hapus data "${label}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return
    }

    setError('')
    setNotice('')
    setDeletingId(item.id)
    try {
      await api(section, { method: 'DELETE', id: item.id })
      if (editing === item.id) setEditing(null)
      setNotice('Data berhasil dihapus.')
      await refresh()
    } catch (e) {
      setError(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  async function uploadFile(file) {
    if (!file || !upload) return

    if (file.type && !upload.types.includes(file.type)) {
      setNotice('')
      setError('Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF.')
      return
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setNotice('')
      setError('Ukuran file maksimal 5 MB.')
      return
    }

    setError('')
    setNotice('')
    setUploading(true)

    const data = new FormData()
    data.append('file', file)

    try {
      const result = await api('upload', { method: 'POST', body: data })
      setForm((current) => ({ ...current, [upload.field]: result.url }))
      setNotice(`File berhasil diunggah: ${result.url}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  async function updateTestimonial(item, status) {
    setError('')
    try {
      await api('testimonials', { method: 'PUT', id: item.id, body: { status } })
      setNotice(`Testimoni ditandai sebagai ${status}.`)
      await refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  async function setRead(item, read) {
    setError('')
    try {
      await api('messages', { method: 'PUT', id: item.id, body: { is_read: read } })
      await refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  // Opening a message shows it in full; an unread one is marked read on open.
  async function toggleMessage(item) {
    const opening = openMessageId !== item.id
    setOpenMessageId(opening ? item.id : null)
    if (opening && !item.is_read) await setRead(item, true)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111318] px-5">
        <div className="flex items-center gap-3 rounded-xl border border-[#2a2f3a] bg-[#171a21] px-5 py-4 text-sm text-[#cfc9bf]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p role="status">Memuat admin...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111318] px-5 py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-600/10 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-blue-600/10 blur-[110px]"
        />

        <div className="relative w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#a9a39a] transition hover:text-[#d4a373]"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Kembali ke Portfolio
          </Link>

          <Card padding="lg" className="mt-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4a373]/25 bg-[#d4a373]/10 text-[#d4a373]">
              <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            </span>

            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4a373]">
              Area Privat
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              Login <span className="text-[#d4a373]">Admin.</span>
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#a9a39a]">
              Masuk untuk mengelola konten portfolio.
            </p>

            <form onSubmit={login} className="mt-7 space-y-5">
              <Field label="Email" htmlFor="admin-email">
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className={inputClasses}
                />
              </Field>

              <Field label="Password" htmlFor="admin-password">
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClasses}
                />
              </Field>

              {error && <Alert tone="error">{error}</Alert>}

              <Button type="submit" disabled={loggingIn} className="w-full">
                {loggingIn ? 'Memproses...' : 'Masuk Dashboard'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#111318] text-white">
      <header className="sticky top-0 z-40 border-b border-[#2a2f3a] bg-[#171a21]/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d4a373]">
              Redha Portfolio
            </p>
            <h1 className="mt-1 truncate text-lg font-bold sm:text-xl">Dashboard Admin</h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden text-sm text-[#a9a39a] md:block">{admin.name}</span>
            <ButtonLink to="/" variant="outline" size="sm">
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lihat Situs</span>
            </ButtonLink>
            <Button variant="danger" size="sm" onClick={logout}>
              <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sections.map((item) => {
            const Icon = item.icon
            const isActive = section === item.key
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setSection(item.key)
                  setEditing(null)
                  setError('')
                  setNotice('')
                }}
                aria-pressed={isActive}
                className={`rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${
                  isActive
                    ? 'border-blue-500/60 bg-[#d4a373]/10'
                    : 'border-[#2a2f3a] bg-[#171a21] hover:border-white/20'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                    isActive
                      ? 'border-blue-500/30 bg-blue-500/15 text-[#ddb892]'
                      : 'border-[#2a2f3a] bg-white/[0.03] text-[#a9a39a]'
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <p className="mt-3 text-xs text-[#a9a39a]">{item.label}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{counts[item.key] ?? 0}</p>
              </button>
            )
          })}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d4a373]">
              Manajemen Konten
            </p>
            <h2 className="mt-2 text-2xl font-bold">{activeSection.label}</h2>
          </div>
          {canCreate && (
            <Button onClick={startCreate} size="sm">
              <Plus aria-hidden="true" className="h-4 w-4" />
              Tambah
            </Button>
          )}
        </div>

        {(error || notice) && (
          <div className="mt-5 space-y-3">
            {error && <Alert tone="error">{error}</Alert>}
            {notice && <Alert tone="success">{notice}</Alert>}
          </div>
        )}

        {editing !== null && (
          <Card className="mt-6 border-[#d4a373]/25">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d4a373]">
                  {editing === 'new' ? 'Data baru' : 'Edit data'}
                </p>
                <h3 className="mt-1 text-lg font-semibold">
                  {editing === 'new' ? 'Tambah' : 'Edit'} {activeSection.label}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={cancelEdit} aria-label="Tutup form">
                <X aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={save} className="mt-6 grid gap-5 md:grid-cols-2">
              {upload && (
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium text-[#cfc9bf]">{upload.label}</p>
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-[#151922] px-4 py-6 text-center transition hover:border-[#4a4f5a]">
                    <span className="text-xs text-[#a9a39a]">
                      JPG, PNG, WEBP{upload.types.includes('application/pdf') ? ', PDF' : ''} · maksimal 5 MB
                    </span>
                    <span className="rounded-lg border border-[#2a2f3a] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#e7e2d9]">
                      {uploading ? 'Mengunggah...' : 'Pilih file'}
                    </span>
                    <input
                      type="file"
                      accept={upload.accept}
                      disabled={uploading}
                      onChange={(e) => {
                        uploadFile(e.target.files?.[0])
                        e.target.value = ''
                      }}
                      className="sr-only"
                    />
                  </label>
                  {uploading && (
                    <p role="status" className="mt-2 text-xs text-[#ddb892]">
                      Mengunggah file...
                    </p>
                  )}
                  {form[upload.field] && (
                    <p className="mt-2 break-all text-xs text-emerald-400">
                      Tersimpan: {form[upload.field]}
                    </p>
                  )}
                </div>
              )}

              {fields.map(([key, label]) => {
                const isLong = longFields.includes(key)
                const fieldId = `admin-field-${key}`
                return (
                  <Field
                    key={key}
                    label={label}
                    htmlFor={fieldId}
                    className={isLong ? 'md:col-span-2' : ''}
                    hint={
                      section === 'blogs' && key === 'content'
                        ? 'Pisahkan paragraf dengan baris kosong. Judul: "## Judul". Daftar: "- item". Kode: bungkus dengan ``` di baris sendiri.'
                        : undefined
                    }
                  >
                    {isLong ? (
                      <textarea
                        id={fieldId}
                        rows={key === 'content' ? 7 : 3}
                        value={form[key] ?? ''}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        required={requiredFields.includes(key)}
                        className={`${inputClasses} resize-y`}
                      />
                    ) : (
                      <input
                        id={fieldId}
                        type={key === 'published_at' ? 'date' : key === 'rating' ? 'number' : 'text'}
                        min={key === 'rating' ? 1 : undefined}
                        max={key === 'rating' ? 5 : undefined}
                        value={form[key] ?? ''}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        required={requiredFields.includes(key)}
                        className={inputClasses}
                      />
                    )}
                  </Field>
                )
              })}

              {section === 'testimonials' ? (
                <Field label="Status" htmlFor="admin-status">
                  <select
                    id="admin-status"
                    value={form.status || 'pending'}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="pending">Menunggu</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                  </select>
                </Field>
              ) : (
                <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-[#2a2f3a] bg-[#151922] px-4 py-3 text-sm text-[#cfc9bf]">
                  <input
                    type="checkbox"
                    checked={form.is_published !== false}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="h-4 w-4 accent-blue-500"
                  />
                  Publikasikan konten
                </label>
              )}

              <div className="flex flex-wrap gap-3 md:col-span-2">
                <Button type="submit" disabled={saving || uploading}>
                  <Check aria-hidden="true" className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Batal
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card padding="none" className="mt-6 overflow-hidden">
          {listLoading ? (
            <p role="status" className="p-8 text-center text-sm text-[#8f897f]">
              Memuat data...
            </p>
          ) : items.length === 0 ? (
            <EmptyState
              icon={activeSection.icon}
              title="Belum ada data"
              description={`Belum ada konten di bagian ${activeSection.label}.`}
              className="m-4 border-0 bg-transparent"
              action={
                canCreate ? (
                  <Button size="sm" onClick={startCreate}>
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    Tambah
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="divide-y divide-white/10">
              {items.map((item) => {
                const title =
                  item.title ||
                  item.name ||
                  item.subject ||
                  (section === 'messages' ? `Pesan #${item.id}` : `Data #${item.id}`)
                const badge = entryBadge(section, item)
                const subtitle = entrySubtitle(section, item)
                const caption = entryCaption(section, item)
                const image = item.image_url || item.cover_url
                const fileUrl =
                  section === 'certificates' && item.file_url ? item.file_url : ''
                const isDeleting = deletingId === item.id
                const ActiveIcon = activeSection.icon
                const isMessageOpen = section === 'messages' && openMessageId === item.id

                return (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between gap-4 p-5 transition hover:bg-white/[0.02] md:flex-row md:items-center"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          className="h-14 w-14 shrink-0 rounded-lg border border-[#2a2f3a] object-cover"
                        />
                      ) : (
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#2a2f3a] bg-[#151922] text-[#8f897f]">
                          <ActiveIcon aria-hidden="true" className="h-5 w-5" />
                        </span>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-words font-semibold">{title}</h3>
                          {badge.label && <Badge tone={badge.tone}>{badge.label}</Badge>}
                          {item.is_published === false && <Badge tone="warning">Draft</Badge>}
                        </div>
                        {subtitle && (
                          <p className="mt-1 break-words text-xs font-medium text-[#8f897f]">
                            {subtitle}
                          </p>
                        )}
                        {caption && (
                          <p
                            className={`mt-2 break-words text-sm text-[#a9a39a] ${
                              section === 'messages' && isMessageOpen
                                ? 'whitespace-pre-wrap rounded-lg border border-white/10 bg-white/[0.03] p-4 leading-7 text-[#d4d4d8]'
                                : 'line-clamp-2'
                            }`}
                          >
                            {caption}
                          </p>
                        )}
                        {item.created_at && (
                          <p className="mt-1 text-xs text-zinc-600">
                            {formatAdminDate(item.created_at)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {section === 'testimonials' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => updateTestimonial(item, 'approved')}
                          >
                            Setujui
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => updateTestimonial(item, 'rejected')}
                          >
                            Tolak
                          </Button>
                        </>
                      )}
                      {section === 'messages' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            aria-expanded={isMessageOpen}
                            onClick={() => toggleMessage(item)}
                          >
                            {isMessageOpen ? 'Tutup' : 'Buka pesan'}
                          </Button>
                          <ButtonLink
                            variant="primary"
                            size="sm"
                            href={`mailto:${item.email}?subject=${encodeURIComponent(
                              `Re: ${item.subject || ''}`,
                            )}`}
                          >
                            <Mail aria-hidden="true" className="h-3.5 w-3.5" />
                            Balas
                          </ButtonLink>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setRead(item, !item.is_read)}
                          >
                            {item.is_read ? 'Tandai belum dibaca' : 'Tandai dibaca'}
                          </Button>
                        </>
                      )}
                      {fieldMap[section] && (
                        <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                          <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      )}
                      {fileUrl && (
                        <ButtonLink
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                          Lihat File
                        </ButtonLink>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => remove(item)}
                        disabled={isDeleting}
                      >
                        <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                        {isDeleting ? 'Menghapus...' : 'Hapus'}
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}

export default Admin
