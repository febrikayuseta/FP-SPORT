// Lapisan tipis di atas fetch() buat ngomong sama Sport Reservation API
// (lihat file Postman collection "Sport Reservation" — semua path & body di sini
// disamain persis sama yang ada di collection itu).

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'mabar_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors || null
  }
}

// Dipanggil dari luar (AuthContext) kalau server bilang token expired/invalid,
// biar bisa nge-redirect ke halaman login.
let onUnauthorized = null
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

async function request(path, { method = 'GET', body, params, isForm = false, auth = true } = {}) {
  const url = new URL(path.replace(/^\//, ''), BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/')

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      url.searchParams.set(key, value)
    })
  }

  const headers = { Accept: 'application/json' }
  if (!isForm && body !== undefined) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    })
  } catch (err) {
    throw new ApiError(
      `Nggak bisa konek ke server (${BASE_URL}). Pastiin backend-nya lagi jalan & VITE_API_BASE_URL bener.`,
      { status: 0 }
    )
  }

  let payload = null
  const text = await res.text()
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = null
    }
  }

  if (res.status === 401) {
    setToken(null)
    if (onUnauthorized) onUnauthorized()
  }

  if (!res.ok) {
    const message =
      payload?.message ||
      (payload?.errors ? Object.values(payload.errors).flat()[0] : null) ||
      `Request gagal (${res.status})`
    throw new ApiError(message, { status: res.status, errors: payload?.errors })
  }

  // API returns { error, result } but components expect { data }
  if (payload !== null && 'result' in payload && !('data' in payload)) {
    payload = { ...payload, data: payload.result }
  }

  return payload
}

export const api = {
  get: (path, params) => request(path, { method: 'GET', params }),
  post: (path, body) => request(path, { method: 'POST', body }),
  postForm: (path, formData) => request(path, { method: 'POST', body: formData, isForm: true }),
  del: (path) => request(path, { method: 'DELETE' }),
}

// Normalisasi response list: backend ini bisa balikin data sebagai array polos
// (is_paginate=false) atau sebagai Laravel paginator object (is_paginate=true).
export function normalizeList(payload) {
  const data = payload?.data
  if (Array.isArray(data)) {
    return { items: data, meta: null }
  }
  if (data && Array.isArray(data.data)) {
    const { data: items, ...meta } = data
    return { items, meta }
  }
  return { items: [], meta: null }
}

export { BASE_URL }
