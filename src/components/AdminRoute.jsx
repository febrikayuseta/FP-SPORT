import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

export default function AdminRoute() {
  const { isAdmin, booting, isAuthenticated } = useAuth()

  if (booting) return <Loader label="Ngecek akses..." />
  if (!isAuthenticated) return <Navigate to="/masuk" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}
