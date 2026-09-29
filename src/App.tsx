import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { ChatPage } from './pages/ChatPage'
import { useChatStore } from './store/useChatStore'
import { RequireAuth } from './guards/RequireAuth'

function RootRedirect() {
  const credentials = useChatStore((s) => s.credentials)
  return <Navigate to={credentials ? '/chat' : '/login'} replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App