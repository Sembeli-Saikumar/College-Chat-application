// src/App.jsx
// Root component with routing and auth initialization

import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import AdminPage from './pages/AdminPage'
import SettingsPage from './pages/SettingsPage'
import UserLayout from './components/layout/UserLayout'
import AdminLayout from './components/layout/AdminLayout'

// Route guard for authenticated users
function PrivateRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

// Route guard for admin only
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuthStore()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [])

  return (
    <BrowserRouter>
      {/* Toast notifications – Premium Neon Purple */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px var(--glow)',
          },
          success: { iconTheme: { primary: 'var(--accent)', secondary: 'var(--bg)' } },
          error: { iconTheme: { primary: '#EF4444', secondary: 'var(--bg)' } },
        }}
      />

      <Routes>
        <Route path="/login" element={<UserLayout><LoginPage /></UserLayout>} />
        <Route path="/" element={<PrivateRoute><UserLayout><ChatPage /></UserLayout></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><UserLayout><SettingsPage /></UserLayout></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminPage /></AdminLayout></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
