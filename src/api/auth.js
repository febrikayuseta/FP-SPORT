import { api } from './client'

export function login({ email, password }) {
  return api.post('api/v1/login', { email, password })
}

export function register({ email, name, password, c_password, role = 'user', phone_number = '' }) {
  return api.post('api/v1/register', { email, name, password, c_password, role, phone_number })
}

export function updateUser(id, payload) {
  return api.post(`api/v1/update-user/${id}`, payload)
}

export function me() {
  return api.get('api/v1/me')
}

export function logout() {
  return api.get('api/v1/logout')
}
