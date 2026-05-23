import { LayoutDashboard, GraduationCap, Sparkles, UserCircle, LogOut, BookOpen, Webhook, ChevronRight } from 'lucide-react'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'scholarships', label: 'Scholarships', Icon: GraduationCap },
  { id: 'matches',      label: 'My Matches',   Icon: Sparkles },
  { id: 'profile',      label: 'Profile',      Icon: UserCircle },
]

export default function Sidebar({ page, user, onNav, onLogout }) {
  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <aside style={S.sidebar}>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoMark}><BookOpen size={17} strokeWidth={2.5} color="#0d1b14" /></div>
        <div>
          <div style={S.logoName}>ScholarFind</div>
          <div style={S.logoSub}>AI Matcher</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        <div style={S.sectionLabel}>Navigation</div>
        {NAV.map(({ id, label, Icon }) => {
          const active = page === id
          return (
            <button key={id} style={{ ...S.item, ...(active ? S.itemActive : {}) }} onClick={() => onNav(id)}>
              <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
              <span style={S.itemLabel}>{label}</span>
              {active && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.5, color: 'var(--green)' }} />}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={S.bottom}>
        <div style={S.userCard}>
          <div style={S.avatar}>{initials}</div>
          <div style={S.userInfo}>
            <div style={S.userName}>{user?.full_name || 'User'}</div>
            <div style={S.userEmail}>{user?.email || ''}</div>
          </div>
        </div>
        <button style={S.logoutBtn} onClick={onLogout}>
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  )
}

const S = {
  sidebar: {
    width: 'var(--sidebar)', background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '20px 18px 16px', borderBottom: '1px solid var(--border)',
  },
  logoMark: {
    width: 34, height: 34, borderRadius: 10, background: 'var(--green)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  logoName: { fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)' },
  logoSub: { fontSize: 10, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 1 },

  nav: { flex: 1, padding: '14px 10px', overflow: 'auto' },
  sectionLabel: {
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
    color: 'var(--ink-3)', padding: '0 10px 8px',
  },
  item: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px', borderRadius: 'var(--r)', width: '100%', textAlign: 'left',
    color: 'var(--ink-2)', fontSize: 13.5, fontWeight: 400,
    marginBottom: 2, transition: 'all var(--ease)',
  },
  itemActive: { background: 'var(--green-dim)', color: 'var(--green)', fontWeight: 600 },
  itemLabel: { flex: 1 },

  bottom: { padding: '12px 10px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 },
  userCard: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--r)', background: 'rgba(255,255,255,0.03)' },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--green), #16a34a)',
    color: '#0d1b14', fontSize: 12, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  userInfo: { flex: 1, overflow: 'hidden' },
  userName: { fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userEmail: { fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
    borderRadius: 'var(--r)', fontSize: 12.5, color: 'var(--ink-2)',
    transition: 'all var(--ease)', width: '100%',
  },
}
