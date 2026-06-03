import { useState } from 'react'
import { BookOpen, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { api } from '../api/client'

export default function AuthPage({ onLogin }) {
  const [mode, setMode]       = useState('login') // 'login' | 'register'
  const [form, setForm]       = useState({ full_name: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        await api.register(form)
        setMode('login')
        setForm(f => ({ ...f, full_name: '' }))
        return
      }
      const data = await api.login({ email: form.email, password: form.password })
      localStorage.setItem('sf_token', data.access_token)
      onLogin()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page" style={S.page}>
      {/* Left panel */}
      <div className="auth-left" style={S.left}>
        <div style={S.brand}>
          <div style={S.logoMark}><BookOpen size={22} strokeWidth={2.5} color="#0d1b14" /></div>
          <span style={S.logoText}>ScholarFind</span>
        </div>
        <div style={S.hero}>
          <h1 className="heroTitle" style={S.heroTitle}>Find your<br /><em style={S.heroEm}>perfect scholarship</em></h1>
          <p style={S.heroSub}>AI-powered matching connects you to global funding opportunities tailored to your profile and goals.</p>
        </div>
        <div style={S.features}>
          {['AI-powered cosine similarity matching','Live scholarship scraping engine','Deadline calendar sync','Profile-based eligibility scoring'].map(f => (
            <div key={f} style={S.feature}>
              <div style={S.featureDot} />
              <span style={S.featureText}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right" style={S.right}>
        <form className="auth-form" onSubmit={submit} style={S.form}>
          <div style={S.formHeader}>
            <h2 style={S.formTitle}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
            <p style={S.formSub}>{mode === 'login' ? 'Sign in to your ScholarFind account' : 'Start finding scholarships today'}</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs" style={S.tabs}>
            {['login','register'].map(m => (
              <button key={m} type="button" className="auth-tab" style={{ ...S.tab, ...(mode === m ? S.tabActive : {}) }}
                onClick={() => { setMode(m); setError('') }}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {mode === 'register' && (
            <Field label="Full Name" icon={<User size={15} />} value={form.full_name} onChange={set('full_name')} placeholder="Chioma Adeyemi" required />
          )}
          <Field label="Email" icon={<Mail size={15} />} type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
          <div style={{ position: 'relative' }}>
            <Field label="Password" icon={<Lock size={15} />} type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPw(s => !s)} style={S.eyeBtn}>
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && <div style={S.errorBox}>{error}</div>}

          <button type="submit" className="auth-submitBtn" style={S.submitBtn} disabled={loading}>
            {loading
              ? <><Loader2 size={16} style={{ animation: 'spin .7s linear infinite' }} /> Processing…</>
              : <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={15} /></>
            }
          </button>

          <p style={S.switchText}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" style={S.switchBtn} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

function Field({ label, icon, ...props }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      <div style={S.inputWrap}>
        <span style={S.inputIcon}>{icon}</span>
        <input style={S.input} {...props} />
      </div>
    </div>
  )
}

const S = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    width: '45%', background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
    padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: 0,
    backgroundImage: 'radial-gradient(ellipse at bottom left, rgba(52,211,153,0.07) 0%, transparent 60%)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 60 },
  logoMark: {
    width: 40, height: 40, borderRadius: 12, background: 'var(--green)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink)' },
  hero: { marginBottom: 40 },
  heroTitle: { fontSize: 40, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'var(--ink)', marginBottom: 16 },
  heroEm: { fontStyle: 'italic', color: 'var(--green)', fontWeight: 900 },
  heroSub: { fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.65, maxWidth: 340 },
  features: { display: 'flex', flexDirection: 'column', gap: 14, marginTop: 'auto', paddingTop: 40 },
  feature: { display: 'flex', alignItems: 'center', gap: 12 },
  featureDot: { width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 },
  featureText: { fontSize: 13.5, color: 'var(--ink-2)' },

  right: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 40,
  },
  form: {
    width: '100%', maxWidth: 400,
    display: 'flex', flexDirection: 'column', gap: 18,
    animation: 'fadeUp .4s both',
  },
  formHeader: { marginBottom: 4 },
  formTitle: { fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 },
  formSub: { fontSize: 14, color: 'var(--ink-2)' },

  tabs: {
    display: 'flex', background: 'var(--bg-2)', border: '1px solid var(--border)',
    borderRadius: 'var(--r)', padding: 3, gap: 3,
  },
  tab: {
    flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
    color: 'var(--ink-2)', transition: 'all var(--ease)',
  },
  tabActive: {
    background: 'var(--bg-card)', color: 'var(--ink)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)', fontWeight: 600,
  },

  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.07em' },
  inputWrap: { position: 'relative' },
  inputIcon: {
    position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
    color: 'var(--ink-3)', pointerEvents: 'none',
  },
  input: {
    width: '100%', padding: '11px 14px 11px 38px',
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    borderRadius: 'var(--r)', color: 'var(--ink)', fontSize: 14,
    outline: 'none', transition: 'border-color var(--ease)',
  },
  eyeBtn: {
    position: 'absolute', right: 13, bottom: 13,
    color: 'var(--ink-3)', display: 'flex', alignItems: 'center',
  },

  errorBox: {
    background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,0.2)',
    borderRadius: 'var(--r)', padding: '10px 14px', fontSize: 13, color: 'var(--red)',
  },

  submitBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '13px 0', background: 'var(--green)', color: '#0d1b14',
    borderRadius: 'var(--r)', fontSize: 14, fontWeight: 700,
    transition: 'all var(--ease)',
  },

  switchText: { textAlign: 'center', fontSize: 13, color: 'var(--ink-2)' },
  switchBtn: { color: 'var(--green)', fontWeight: 600, fontSize: 13 },
}
