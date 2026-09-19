import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

export default function ProtectedRoute() {
  const { isAuthenticated, booting } = useAuth()
  const location = useLocation()

  if (booting) return <Loader label="Nyiapin sesi kamu..." />
  if (!isAuthenticated) return <Navigate to="/masuk" state={{ from: location }} replace />
  return <Outlet />
}
