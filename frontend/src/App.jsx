import { useState, useEffect } from 'react'
import { api } from './api/client'
import { useToast } from './hooks/useToast'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import ScholarshipsPage from './pages/ScholarshipsPage'
import MatchesPage from './pages/MatchesPage'
import ProfilePage from './pages/ProfilePage'
import Sidebar from './components/Sidebar'
import Toasts from './components/Toasts'

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('sf_token'))
  const [user,   setUser]   = useState(null)
  const [page,   setPage]   = useState('dashboard')
  const { toasts, toast }   = useToast()

  useEffect(() => {
    if (authed) {
      api.profile().then(setUser).catch(() => { logout() })
    }
  }, [authed])

  function logout() {
    localStorage.removeItem('sf_token')
    setAuthed(false)
    setUser(null)
    setPage('dashboard')
  }

  if (!authed) return (
    <>
      <AuthPage onLogin={() => setAuthed(true)} />
      <Toasts toasts={toasts} />
    </>
  )

  const PAGE_TITLES = {
    dashboard:    'Dashboard',
    scholarships: 'Scholarships',
    matches:      'My Matches',
    profile:      'Profile',
  }

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar className="sidebar" page={page} user={user} onNav={setPage} onLogout={logout} />

      <div className="content-wrapper" style={{ marginLeft: 'var(--sidebar)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header className="topbar" style={{
          height: 'var(--topbar)', background: 'var(--bg-2)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 28px', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>ScholarFind</span>
            <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>/</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{PAGE_TITLES[page]}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="app-main" style={{ flex: 1, padding: 28, maxWidth: 1200 }}>
          {page === 'dashboard'    && <Dashboard    user={user}  onNav={setPage} toast={toast} />}
          {page === 'scholarships' && <ScholarshipsPage          toast={toast} />}
          {page === 'matches'      && <MatchesPage               toast={toast} />}
          {page === 'profile'      && <ProfilePage  user={user}  setUser={setUser} toast={toast} />}
        </main>
      </div>

      <Toasts toasts={toasts} />
    </div>
  )
}
