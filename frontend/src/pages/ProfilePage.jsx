import { useState } from 'react'
import { Save, Loader2, User, Mail, FileText, Calendar } from 'lucide-react'
import { api } from '../api/client'

export default function ProfilePage({ user, setUser, toast }) {
  const [text,    setText]    = useState(user?.profile_text || '')
  const [saving,  setSaving]  = useState(false)

  async function save() {
    setSaving(true)
    try {
      const d = await api.updateProfileText(text)
      setUser(u => ({ ...u, profile_text: d.profile_text }))
      toast('Profile updated', 'success')
    } catch (e) { toast(e.message, 'error') }
    finally { setSaving(false) }
  }

  return (
    <div style={S.page}>
      {/* Info card */}
      <div style={S.infoCard}>
        <div style={S.avatar}>
          {user?.full_name ? user.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'}
        </div>
        <div>
          <div style={S.name}>{user?.full_name}</div>
          <div style={S.email}>{user?.email}</div>
          {user?.created_at && (
            <div style={S.joined}>
              <Calendar size={12} /> Joined {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
        </div>
      </div>

      {/* Read-only fields */}
      <div style={S.section}>
        <SectionTitle>Account Details</SectionTitle>
        <div style={S.detailGrid}>
          <DetailRow icon={<User size={13} />} label="Full Name" val={user?.full_name} />
          <DetailRow icon={<Mail size={13} />} label="Email" val={user?.email} />
        </div>
      </div>

      {/* Profile text editor */}
      <div style={S.section}>
        <SectionTitle>Profile Text <span style={{ color: 'var(--ink-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— used for AI matching</span></SectionTitle>
        <p style={S.hint}>
          Describe your academic background, field of study, country, interests, and the types of scholarships you're looking for.
          The matching engine uses this to find your most relevant opportunities.
        </p>
        <div style={S.exampleBox}>
          <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Example: </strong>
          <span style={{ color: 'var(--ink-2)' }}>
            "Computer science graduate from Nigeria interested in AI and machine learning. Looking for fully funded Masters or PhD scholarships in Europe or the US."
          </span>
        </div>
        <textarea
          style={S.textarea}
          rows={7}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a detailed profile text here…"
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{text.length} characters</span>
          <button style={{ ...S.saveBtn, opacity: saving ? 0.6 : 1 }} onClick={save} disabled={saving}>
            {saving ? <Loader2 size={15} style={{ animation: 'spin .7s linear infinite' }} /> : <Save size={15} />}
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }) {
  return <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--ink-3)', marginBottom: 12 }}>{children}</div>
}

function DetailRow({ icon, label, val }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', borderBottom: '1px solid var(--border)', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--ink-3)', fontWeight: 500 }}>
        {icon} {label}
      </div>
      <span style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{val || '—'}</span>
    </div>
  )
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 680 },
  infoCard: {
    display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
    padding: '22px 26px', background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--r-lg)', animation: 'fadeUp .35s both',
    backgroundImage: 'radial-gradient(ellipse at top left, rgba(52,211,153,.05) 0%, transparent 60%)',
  },
  avatar: {
    width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, var(--green), #16a34a)',
    color: '#0d1b14', fontSize: 22, fontWeight: 900,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 4 },
  email: { fontSize: 13.5, color: 'var(--ink-2)', marginBottom: 5 },
  joined: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ink-3)' },
  section: {
    background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
    padding: '20px 22px', animation: 'fadeUp .35s .07s both',
  },
  detailGrid: { border: '1px solid var(--border)', borderRadius: 'var(--r)', overflow: 'hidden' },
  hint: { fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: 12 },
  exampleBox: {
    padding: '12px 14px', background: 'var(--green-dim)', border: '1px solid rgba(52,211,153,.15)',
    borderRadius: 'var(--r)', fontSize: 13, lineHeight: 1.6, marginBottom: 14,
  },
  textarea: {
    width: '100%', padding: '12px 15px', background: 'var(--bg-input)', border: '1px solid var(--border)',
    borderRadius: 'var(--r)', color: 'var(--ink)', fontSize: 14, lineHeight: 1.65,
    outline: 'none', resize: 'vertical', transition: 'border-color var(--ease)',
  },
  saveBtn: {
    display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
    borderRadius: 'var(--r)', background: 'var(--green)', color: '#0d1b14',
    fontSize: 13, fontWeight: 700, transition: 'all var(--ease)',
  },
}
