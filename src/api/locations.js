import { api } from './client'

export function getProvinces({ is_paginate = false, per_page = 50, page = 1 } = {}) {
  return api.get('api/v1/location/provinces', { is_paginate, per_page, page })
}

export function getCitiesByProvince(provinceId, { is_paginate = false, per_page = 100, page = 1 } = {}) {
  return api.get(`api/v1/location/cities/${provinceId}`, { is_paginate, per_page, page })
}

export function getCities({ is_paginate = false, per_page = 20, page = 1 } = {}) {
  return api.get('api/v1/location/cities', { is_paginate, per_page, page })
}
