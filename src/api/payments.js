import { api } from './client'

export function getPaymentMethods() {
  return api.get('api/v1/payment-methods')
}
