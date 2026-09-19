import { api } from './client'

export function uploadImage(file) {
  const form = new FormData()
  form.append('file', file)
  return api.postForm('api/v1/upload-image', form)
}

export function uploadFile(file) {
  const form = new FormData()
  form.append('file', file)
  return api.postForm('api/v1/upload-file', form)
}

// Backend ini biasanya balikin url hasil upload di salah satu bentuk umum berikut.
// Dibikin fleksibel biar nggak gampang patah kalau nama field-nya beda dikit.
export function extractUploadedUrl(payload) {
  const d = payload?.data
  if (!d) return null
  if (typeof d === 'string') return d
  return d.url || d.path || d.file_url || d.image_url || d.location || null
}
