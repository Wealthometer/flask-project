import { useState, useEffect } from 'react'
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react'
import { api } from '../api/client'
import ScholarshipCard from '../components/ScholarshipCard'
import ScholarshipModal from '../components/ScholarshipModal'

export default function MatchesPage({ toast }) {
  const [matches,  setMatches]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [running,  setRunning]  = useState(false)
  const [modal,    setModal]    = useState(null)

  async function load() {
    setLoading(true)
    api.getMatches().then(setMatches).catch(() => toast('Failed to load matches', 'error')).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function rerun() {
    setRunning(true)
    try {
      const results = await api.runMatch()
      toast(`${results.length} matches found`, 'success')
      setMatches(results)
    } catch (e) { toast(e.message, 'error') }
    finally { setRunning(false) }
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h2 style={S.title}>My Matches</h2>
          <p style={S.sub}>{matches.length} scholarship{matches.length !== 1 ? 's' : ''} matched to your profile</p>
        </div>
        <button style={S.rerunBtn} onClick={rerun} disabled={running}>
          {running ? <Loader2 size={15} style={{ animation: 'spin .7s linear infinite' }} /> : <RefreshCw size={15} />}
          Re-run Matching
        </button>
      </div>

      {loading ? (
        <div style={S.centered}><Loader2 size={20} style={{ animation: 'spin .7s linear infinite' }} /> Loading…</div>
      ) : matches.length === 0 ? (
        <div style={S.emptyState}>
          <Sparkles size={36} strokeWidth={1.2} style={{ color: 'var(--ink-3)', marginBottom: 14 }} />
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>No matches yet</div>
          <div style={{ fontSize: 13.5, color: 'var(--ink-2)', maxWidth: 360, textAlign: 'center', marginBottom: 20 }}>
            Make sure your profile text is filled in, then click Re-run Matching.
          </div>
          <button style={S.rerunBtn} onClick={rerun} disabled={running}>
            {running ? <Loader2 size={14} style={{ animation: 'spin .7s linear infinite' }} /> : <Sparkles size={14} />}
            Run Matching Now
          </button>
        </div>
      ) : (
        <div style={S.grid}>
          {matches.map((m, i) => (
            <ScholarshipCard
              key={m.id || `${m.title}-${i}`}
              sch={m}
              score={m.score}
              onView={(sch) => setModal({ sch, score: m.score })}
              index={i}
            />
          ))}
        </div>
      )}

      {modal && <ScholarshipModal sch={modal.sch} score={modal.score} onClose={() => setModal(null)} />}
    </div>
  )
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)', animation: 'fadeUp .3s both',
    backgroundImage: 'radial-gradient(ellipse at top right, rgba(96,165,250,.05) 0%, transparent 60%)',
  },
  title: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 },
  sub: { fontSize: 13.5, color: 'var(--ink-2)' },
  rerunBtn: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
    borderRadius: 'var(--r)', background: 'var(--blue-dim)', color: 'var(--blue)',
    border: '1px solid rgba(96,165,250,.2)', fontSize: 13, fontWeight: 600,
    transition: 'all var(--ease)',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 },
  centered: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--ink-2)', padding: '60px 0' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 20px', textAlign: 'center', animation: 'fadeUp .3s both' },
}
