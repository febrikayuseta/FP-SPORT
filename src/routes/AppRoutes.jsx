import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminRoute from '../components/AdminRoute'

import Home from '../pages/Home'
import Browse from '../pages/Browse'
import ActivityDetail from '../pages/ActivityDetail'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import MyActivities from '../pages/MyActivities'
import CreateEditActivity from '../pages/CreateEditActivity'
import Checkout from '../pages/Checkout'
import MyTransactions from '../pages/MyTransactions'
import TransactionDetail from '../pages/TransactionDetail'
import NotFound from '../pages/NotFound'

import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminCategories from '../pages/admin/AdminCategories'
import AdminTransactions from '../pages/admin/AdminTransactions'
import AdminActivities from '../pages/admin/AdminActivities'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<Browse />} />
      <Route path="/aktivitas/:id" element={<ActivityDetail />} />
      <Route path="/masuk" element={<Login />} />
      <Route path="/daftar" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/profil" element={<Profile />} />
        <Route path="/aktivitas-saya" element={<MyActivities />} />
        <Route path="/aktivitas-saya/baru" element={<CreateEditActivity />} />
        <Route path="/aktivitas-saya/:id/edit" element={<CreateEditActivity />} />
        <Route path="/booking/:id" element={<Checkout />} />
        <Route path="/transaksi-saya" element={<MyTransactions />} />
        <Route path="/transaksi/:id" element={<TransactionDetail />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/kategori" element={<AdminCategories />} />
        <Route path="/admin/transaksi" element={<AdminTransactions />} />
        <Route path="/admin/aktivitas" element={<AdminActivities />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
