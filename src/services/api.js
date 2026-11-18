const SUPABASE_URL = String(import.meta.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_ANON_KEY = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

export const isSupabaseConfigured =
  SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 20

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const UPLOAD_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
}

// Kolom yang boleh ditulis per tabel. Dipakai untuk membuang field turunan
// (id, created_at, dll.) sebelum dikirim ke Supabase.
const TABLE_COLUMNS = {
  projects: [
    'title',
    'category',
    'description',
    'problem',
    'solution',
    'role',
    'technologies',
    'image_url',
    'demo_url',
    'github_url',
    'sort_order',
    'is_published',
  ],
  blogs: [
    'title',
    'category',
    'excerpt',
    'content',
    'cover_url',
    'published_at',
    'is_published',
  ],
  certificates: ['title', 'organizer', 'description', 'year', 'file_url', 'is_published'],
  messages: ['name', 'email', 'subject', 'message', 'is_read'],
  testimonials: ['name', 'rating', 'message', 'status'],
}

// File columns that point at objects in the public `media` bucket. When a row
// is deleted or its file is replaced, the old object is cleaned up too so the
// bucket does not fill with orphaned uploads.
const FILE_COLUMNS = {
  projects: 'image_url',
  blogs: 'cover_url',
  certificates: 'file_url',
}

const STORAGE_MARKER = '/storage/v1/object/public/media/'

function storagePath(url) {
  if (typeof url !== 'string') return ''
  const index = url.indexOf(STORAGE_MARKER)
  if (index === -1) return ''
  const path = url.slice(index + STORAGE_MARKER.length).split(/[?#]/)[0]
  if (!path) return ''

  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}

async function removeStoredFile(client, url) {
  const path = storagePath(url)
  if (!path) return

  const { error } = await client.storage.from('media').remove([path])
  if (error) {
    // Cleanup is best effort: the database row is already saved, so a failed
    // file removal must not surface as a failed save to the admin.
    console.warn(`Gagal menghapus file storage "${path}":`, error.message)
  }
}

async function previousFileUrl(client, section, id) {
  const column = FILE_COLUMNS[section]
  if (!column || !id) return ''

  const { data, error } = await client.from(section).select(column).eq('id', id).maybeSingle()
  if (error) fail(error)
  return data?.[column] || ''
}

let supabasePromise = null

async function supabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Database is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart the dev server.',
    )
  }
  if (!supabasePromise) {
    supabasePromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true },
      }),
    )
  }
  return supabasePromise
}

function fail(error) {
  const message = error?.message || 'Permintaan gagal.'

  if (/invalid login credentials/i.test(message)) {
    throw new Error('Email atau password tidak sesuai.')
  }
  if (/email not confirmed/i.test(message)) {
    throw new Error('Email belum dikonfirmasi. Cek kotak masuk email admin.')
  }
  if (/too many submissions/i.test(message)) {
    throw new Error('Too many submissions right now. Please try again later.')
  }
  if (/row-level security/i.test(message)) {
    throw new Error('Akses ditolak. Pastikan Anda login sebagai admin.')
  }
  if (/does not exist|schema cache/i.test(message)) {
    throw new Error(
      'Tabel database belum dibuat. Jalankan file supabase/schema.sql di SQL Editor Supabase.',
    )
  }
  if (/bucket.*not found/i.test(message)) {
    throw new Error('Bucket Storage "media" belum dibuat. Jalankan file supabase/schema.sql.')
  }
  if (/duplicate key|already exists/i.test(message)) {
    throw new Error('Data dengan nilai unik tersebut sudah ada.')
  }

  throw new Error(message)
}

function adminProfile(user) {
  const email = user?.email || ''
  const name =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    email.split('@')[0] ||
    'Admin'

  return { name, email }
}

function normalizeRow(section, body) {
  const columns = TABLE_COLUMNS[section]
  const values = {}

  for (const column of columns) {
    if (!(column in body)) continue
    let value = body[column]

    if (column === 'technologies') {
      const list = Array.isArray(value) ? value : String(value ?? '').split(',')
      values[column] = list.map((item) => String(item).trim()).filter(Boolean)
      continue
    }

    if (column === 'is_published' || column === 'is_read') {
      values[column] = value === true || value === 1 || value === '1' || value === 'true'
      continue
    }

    if (column === 'rating') {
      values[column] = Math.min(5, Math.max(1, Number(value) || 5))
      continue
    }

    if (column === 'sort_order') {
      values[column] = Number(value) || 0
      continue
    }

    if (typeof value === 'string') value = value.trim()
    values[column] = value === '' && column === 'published_at' ? null : value
  }

  return values
}

const PUBLIC_FILTERS = {
  projects: ['is_published', true],
  blogs: ['is_published', true],
  certificates: ['is_published', true],
  testimonials: ['status', 'approved'],
}

async function list(section, scope) {
  const client = await supabase()
  let query = client.from(section).select('*')

  if (scope === 'public' && PUBLIC_FILTERS[section]) {
    const [column, value] = PUBLIC_FILTERS[section]
    query = query.eq(column, value)
  }

  // Projects follow the manual sort order set in the dashboard; every other
  // list shows the newest entry first.
  query =
    section === 'projects'
      ? query.order('sort_order', { ascending: true }).order('id', { ascending: true })
      : query.order('id', { ascending: false })

  const { data, error } = await query
  if (error) fail(error)
  return { items: data || [] }
}

async function save(section, { method, body, id }) {
  const values = normalizeRow(section, body || {})

  if (Object.keys(values).length === 0) {
    throw new Error('Tidak ada data untuk disimpan.')
  }

  const client = await supabase()

  if (method === 'POST') {
    const { error } = await client.from(section).insert(values)
    if (error) fail(error)
    return { message: 'Data berhasil ditambahkan.' }
  }

  if (!id) throw new Error('ID tidak valid.')

  const fileColumn = FILE_COLUMNS[section]
  const before = fileColumn ? await previousFileUrl(client, section, id) : ''

  const { error } = await client.from(section).update(values).eq('id', id)
  if (error) fail(error)

  if (fileColumn && fileColumn in values && before && before !== values[fileColumn]) {
    await removeStoredFile(client, before)
  }

  return { message: 'Data berhasil diperbarui.' }
}

async function removeRecord(section, id) {
  if (!id) throw new Error('ID tidak valid.')

  const client = await supabase()
  const before = FILE_COLUMNS[section] ? await previousFileUrl(client, section, id) : ''

  const { error } = await client.from(section).delete().eq('id', id)
  if (error) fail(error)

  if (before) await removeStoredFile(client, before)

  return { message: 'Data berhasil dihapus.' }
}

// Field "website" disembunyikan dari manusia. Bot yang mengisinya dianggap
// spam: kita pura-pura sukses supaya bot tidak belajar, tapi tidak menyimpan apa pun.
function isHoneypotTripped(body) {
  return String(body.website || '').trim() !== ''
}

async function submitContact(body) {
  if (isHoneypotTripped(body)) return { message: 'Message sent successfully.' }

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const subject = String(body.subject || '').trim()
  const message = String(body.message || '').trim()

  if (!name || !email || !subject || !message) {
    throw new Error('All fields are required.')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }

  const client = await supabase()
  const { error } = await client.from('messages').insert({ name, email, subject, message })
  if (error) fail(error)

  return { message: 'Message sent successfully.' }
}

async function submitTestimonial(body) {
  if (isHoneypotTripped(body)) {
    return { message: 'Thanks! Your testimonial is waiting for admin approval.' }
  }

  const name = String(body.name || '').trim()
  const message = String(body.message || '').trim()
  const rating = Math.min(5, Math.max(1, Number(body.rating) || 5))

  if (!name || !message) {
    throw new Error('Name and testimonial are required.')
  }

  // Status selalu dipaksa pending; hanya admin yang bisa mengubahnya.
  const client = await supabase()
  const { error } = await client
    .from('testimonials')
    .insert({ name, message, rating, status: 'pending' })

  if (error) fail(error)

  return { message: 'Thanks! Your testimonial is waiting for admin approval.' }
}

async function login(body) {
  const email = String(body.email || '').trim()
  const password = String(body.password || '')

  if (!email || !password) {
    throw new Error('Email dan password wajib diisi.')
  }

  const client = await supabase()
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) fail(error)

  // Akun Supabase biasa belum tentu admin: cek allow-list di database.
  if (!(await isAdminUser(client))) {
    await client.auth.signOut()
    throw new Error('Akun ini tidak punya akses admin.')
  }

  return { admin: adminProfile(data.user) }
}

async function currentAdmin() {
  const client = await supabase()
  const { data, error } = await client.auth.getSession()
  if (error) fail(error)
  if (!data.session) throw new Error('Unauthorized')
  if (!(await isAdminUser(client))) {
    await client.auth.signOut()
    throw new Error('Unauthorized')
  }

  return { admin: adminProfile(data.session.user) }
}

async function isAdminUser(client) {
  const { data, error } = await client.rpc('is_admin')
  if (error) {
    // Fungsi belum dibuat (schema.sql lama): beri petunjuk, jangan loloskan diam-diam.
    if (/is_admin|schema cache|does not exist/i.test(error.message || '')) {
      throw new Error('Jalankan ulang supabase/schema.sql agar fungsi is_admin() tersedia.')
    }
    fail(error)
  }
  return data === true
}

async function logout() {
  const client = await supabase()
  const { error } = await client.auth.signOut()
  if (error) fail(error)
  return { message: 'Logout berhasil' }
}

// Counts of what the public site actually shows, so the Home stats follow the
// dashboard automatically (add or hide a project and the number changes).
async function publicCounts() {
  const client = await supabase()

  async function countPublished(table) {
    const [column, value] = PUBLIC_FILTERS[table]
    const { count, error } = await client
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq(column, value)
    if (error) fail(error)
    return count ?? 0
  }

  const [projects, certificates] = await Promise.all([
    countPublished('projects'),
    countPublished('certificates'),
  ])
  return { projects, certificates }
}

async function dashboard() {
  const client = await supabase()
  const entries = await Promise.all(
    Object.keys(TABLE_COLUMNS).map(async (table) => {
      const { count, error } = await client
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) fail(error)
      return [table, count || 0]
    }),
  )

  return { counts: Object.fromEntries(entries) }
}

async function upload(body) {
  const file = body instanceof FormData ? body.get('file') : null

  if (!(file instanceof File) || !file.size) {
    throw new Error('File gagal diunggah.')
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Ukuran maksimal 5 MB.')
  }

  const extension = UPLOAD_EXTENSIONS[file.type]
  if (!extension) {
    throw new Error('Format: JPG, PNG, WEBP, PDF.')
  }

  const unique =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  const path = `${new Date().toISOString().slice(0, 10)}/${unique}.${extension}`

  const client = await supabase()
  const { error } = await client.storage
    .from('media')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) fail(error)

  const { data } = client.storage.from('media').getPublicUrl(path)
  return { url: data.publicUrl }
}

export async function api(action, options = {}) {
  const { method = 'GET', body, id } = options

  try {
    if (action === 'login' && method === 'POST') return await login(body || {})
    if (action === 'me' && method === 'GET') return await currentAdmin()
    if (action === 'logout' && method === 'POST') return await logout()

    if (action === 'contact' && method === 'POST') return await submitContact(body || {})
    if (action === 'testimonials' && method === 'POST') return await submitTestimonial(body || {})

    if (action === 'public-counts' && method === 'GET') return await publicCounts()
    if (action === 'dashboard' && method === 'GET') return await dashboard()
    if (action === 'upload' && method === 'POST') return await upload(body)

    if (TABLE_COLUMNS[action] && method === 'GET') return await list(action, options.scope)
    if (TABLE_COLUMNS[action] && (method === 'POST' || method === 'PUT')) {
      return await save(action, { method, body, id })
    }
    if (TABLE_COLUMNS[action] && method === 'DELETE') return await removeRecord(action, id)

    throw new Error('Endpoint tidak ditemukan.')
  } catch (error) {
    if (/failed to fetch|networkerror|load failed/i.test(error?.message || '')) {
      throw new Error('Database is unreachable. Check your internet connection.', {
        cause: error,
      })
    }
    throw error
  }
}
