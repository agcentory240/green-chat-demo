import { Navigate, Outlet } from 'react-router-dom'
import { useChatStore } from '../store/useChatStore'

export function RequireAuth() {
  const credentials = useChatStore((s) => s.credentials)

  if (!credentials) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}