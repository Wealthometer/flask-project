import { useState, useEffect } from 'react'
import { GraduationCap, Sparkles, Clock, TrendingUp, Database, Loader2, RefreshCw } from 'lucide-react'
import { api } from '../api/client'

function daysUntil(d) { return d ? Math.ceil((new Date(d) - new Date()) / 86400000) : null }
function fmtDate(d)   { return d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—' }

export default function Dashboard({ user, onNav, toast }) {
  const [scholarships, setScholarships] = useState([])
  const [matches,      setMatches]      = useState([])
  const [seeding,      setSeeding]      = useState(false)
  const [matching,     setMatching]     = useState(false)
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    Promise.all([
      api.getScholarships().catch(() => []),
      api.getMatches().catch(() => []),
    ]).then(([s, m]) => { setScholarships(s); setMatches(m) })
      .finally(() => setLoading(false))
  }, [])

  async function seed() {
    setSeeding(true)
    try {
      const d = await api.seedData()
      toast(`${d.message} — ${d.total_added} new scholarships added`, 'success')
      const s = await api.getScholarships()
      setScholarships(s)
    } catch (e) { toast(e.message, 'error') }
    finally { setSeeding(false) }
  }

  async function runMatch() {
    setMatching(true)
    try {
      const results = await api.runMatch()
      toast(`${results.length} matches found`, 'success')
      setMatches(results)
    } catch (e) { toast(e.message, 'error') }
    finally { setMatching(false) }
  }

  const urgent  = scholarships.filter(s => { const d = daysUntil(s.deadline); return d !== null && d <= 30 })
  const nearest = [...scholarships].sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 4)
  const topM    = matches.slice(0, 5)

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 10, color: 'var(--ink-2)' }}>
      <Loader2 size={20} style={{ animation: 'spin .7s linear infinite' }} /> Loading…
    </div>
  )

  return (
    <div style={S.page}>
      {/* Welcome */}
      <div style={S.welcome}>
        <div>
          <h1 style={S.welcomeTitle}>Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}</h1>
          <p style={S.welcomeSub}>
            {scholarships.length} scholarships in database · {matches.length} matches for your profile
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn icon={<Database size={14} />} onClick={seed} loading={seeding} label="Seed Data" />
          <Btn icon={<RefreshCw size={14} />} onClick={runMatch} loading={matching} label="Run Matching" primary />
        </div>
      </div>

      {/* Stats */}
      <div style={S.statsGrid}>
        {[
          { label: 'Scholarships',   val: scholarships.length, Icon: GraduationCap, color: 'var(--green)', page: 'scholarships' },
          { label: 'My Matches',     val: matches.length,      Icon: Sparkles,      color: 'var(--blue)',  page: 'matches' },
          { label: 'Urgent (30d)',   val: urgent.length,       Icon: Clock,         color: 'var(--red)',   page: 'scholarships' },
          { label: 'Top Score',      val: topM[0] ? `${Math.round(topM[0].score)}%` : '—', Icon: TrendingUp, color: 'var(--gold)', page: 'matches' },
        ].map(({ label, val, Icon, color, page }, i) => (
          <div key={label} style={{ ...S.stat, animationDelay: `${i * 60}ms` }} onClick={() => onNav(page)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={S.statLabel}>{label}</span>
              <div style={{ ...S.statIcon, background: `${color}18`, color }}><Icon size={15} strokeWidth={2} /></div>
            </div>
            <div style={S.statVal}>{val}</div>
          </div>
        ))}
      </div>

      <div style={S.twoCol}>
        {/* Top matches */}
        <div style={S.panel}>
          <div style={S.panelHead}>
            <span style={S.panelTitle}><Sparkles size={14} /> Top Matches</span>
            <button style={S.panelLink} onClick={() => onNav('matches')}>View all</button>
          </div>
          {topM.length === 0 ? (
            <EmptyState msg="No matches yet. Update your profile and run matching." />
          ) : topM.map((m, i) => (
            <div key={m.id || `${m.title}-${i}`} style={{ ...S.matchRow, animationDelay: `${i * 50}ms` }}>
              <span style={S.rank}>#{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.matchTitle}>{m.title}</div>
                <div style={S.matchSub}>{m.country}</div>
              </div>
              <span style={{ ...S.score, color: m.score >= 80 ? 'var(--green)' : m.score >= 60 ? 'var(--gold)' : 'var(--blue)' }}>
                {Math.round(m.score)}%
              </span>
            </div>
          ))}
        </div>

        {/* Deadlines */}
        <div style={S.panel}>
          <div style={S.panelHead}>
            <span style={S.panelTitle}><Clock size={14} /> Upcoming Deadlines</span>
            <button style={S.panelLink} onClick={() => onNav('scholarships')}>Browse</button>
          </div>
          {nearest.length === 0 ? (
            <EmptyState msg="No scholarships loaded yet. Use Seed Data to get started." />
          ) : nearest.map((s, i) => {
            const d = daysUntil(s.deadline)
            const urgent = d !== null && d <= 30
            return (
              <div key={s.id} style={{ ...S.deadlineRow, animationDelay: `${i * 50}ms` }}>
                <div style={{ ...S.deadlineDays, color: urgent ? 'var(--red)' : 'var(--green)' }}>
                  {d !== null ? `${d}d` : '—'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={S.matchTitle}>{s.title}</div>
                  <div style={S.matchSub}>{fmtDate(s.deadline)}</div>
                </div>
                {urgent && <span style={S.urgentBadge}>Urgent</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Profile nudge if no profile text */}
      {!user?.profile_text && (
        <div style={S.nudge}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Complete your profile to get matched</div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>Add a profile text describing your background and interests so the matching engine can find your best scholarships.</div>
          </div>
          <button style={S.nudgeBtn} onClick={() => onNav('profile')}>Go to Profile →</button>
        </div>
      )}
    </div>
  )
}

function Btn({ icon, label, onClick, loading, primary }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
      borderRadius: 'var(--r)', fontSize: 13, fontWeight: 600,
      background: primary ? 'var(--green)' : 'rgba(255,255,255,.05)',
      color: primary ? '#0d1b14' : 'var(--ink-2)',
      border: primary ? 'none' : '1px solid var(--border)',
      opacity: loading ? 0.6 : 1, transition: 'all var(--ease)',
    }}>
      {loading ? <Loader2 size={14} style={{ animation: 'spin .7s linear infinite' }} /> : icon}
      {label}
    </button>
  )
}

function EmptyState({ msg }) {
  return (
    <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>{msg}</div>
  )
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  welcome: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
    padding: '22px 26px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
    backgroundImage: 'radial-gradient(ellipse at top right, rgba(52,211,153,.05) 0%, transparent 60%)',
    animation: 'fadeUp .35s both',
  },
  welcomeTitle: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 5 },
  welcomeSub: { fontSize: 13.5, color: 'var(--ink-2)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 },
  stat: {
    padding: '18px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
    cursor: 'pointer', animation: 'fadeUp .35s both', transition: 'all var(--ease)',
  },
  statLabel: { fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)' },
  statIcon: { width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statVal: { fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--ink)', lineHeight: 1 },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 },
  panel: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', animation: 'fadeUp .35s .08s both' },
  panelHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' },
  panelTitle: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: 'var(--ink)' },
  panelLink: { fontSize: 12, color: 'var(--green)', fontWeight: 600 },
  matchRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderBottom: '1px solid var(--border)', animation: 'fadeUp .3s both' },
  rank: { fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', minWidth: 22 },
  matchTitle: { fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  matchSub: { fontSize: 11, color: 'var(--ink-3)', marginTop: 2 },
  score: { fontSize: 16, fontWeight: 900, letterSpacing: '-0.02em', flexShrink: 0 },
  deadlineRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--border)', animation: 'fadeUp .3s both' },
  deadlineDays: { fontSize: 20, fontWeight: 900, letterSpacing: '-0.03em', minWidth: 44 },
  urgentBadge: { fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(248,113,113,.2)' },
  nudge: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
    padding: '18px 22px', background: 'var(--gold-dim)', border: '1px solid rgba(251,191,36,.2)',
    borderRadius: 'var(--r-lg)', animation: 'fadeUp .35s .15s both',
  },
  nudgeBtn: { padding: '9px 18px', borderRadius: 'var(--r)', background: 'var(--gold)', color: '#0d1b14', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', transition: 'all var(--ease)' },
}
