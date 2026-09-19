import { api } from './client'

export function getActivities({
  is_paginate = true,
  per_page = 9,
  page = 1,
  search = '',
  sport_category_id = '',
  city_id = '',
} = {}) {
  return api.get('api/v1/sport-activities', {
    is_paginate,
    per_page,
    page,
    search,
    sport_category_id,
    city_id,
  })
}

export function getActivity(id) {
  return api.get(`api/v1/sport-activities/${id}`)
}

export function createActivity(payload) {
  return api.post('api/v1/sport-activities/create', payload)
}

export function updateActivity(id, payload) {
  return api.post(`api/v1/sport-activities/update/${id}`, payload)
}

export function deleteActivity(id) {
  return api.del(`api/v1/sport-activities/delete/${id}`)
}
