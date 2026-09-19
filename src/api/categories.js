import { api } from './client'

export function getCategories({ is_paginate = false, per_page = 12, page = 1 } = {}) {
  return api.get('api/v1/sport-categories', { is_paginate, per_page, page })
}

export function createCategory({ name }) {
  return api.post('api/v1/sport-categories/create', { name })
}

export function updateCategory(id, { name }) {
  return api.post(`api/v1/sport-categories/update/${id}`, { name })
}

export function deleteCategory(id) {
  return api.del(`api/v1/sport-categories/delete/${id}`)
}
