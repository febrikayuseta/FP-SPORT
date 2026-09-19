import { api } from './client'

export function createTransaction({ sport_activity_id, payment_method_id }) {
  return api.post('api/v1/transaction/create', { sport_activity_id, payment_method_id })
}

export function getMyTransactions({ is_paginate = false, per_page = 10, page = 1, search = '' } = {}) {
  return api.get('api/v1/my-transaction', { is_paginate, per_page, page, search })
}

export function getAllTransactions({ is_paginate = true, per_page = 10, page = 1, search = '' } = {}) {
  return api.get('api/v1/all-transaction', { is_paginate, per_page, page, search })
}

export function getTransaction(id) {
  return api.get(`api/v1/transaction/${id}`)
}

export function updateProofPayment(id, { proof_payment_url }) {
  return api.post(`api/v1/transaction/update-proof-payment/${id}`, { proof_payment_url })
}

export function updateStatus(id, { status }) {
  return api.post(`api/v1/transaction/update-status/${id}`, { status })
}

export function cancelTransaction(id) {
  return api.post(`api/v1/transaction/cancel/${id}`, {})
}
