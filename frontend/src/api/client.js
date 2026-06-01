const BASE = 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('sf_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) throw new Error(data.error || data.message || `Error ${res.status}`)
  return data
}

export const api = {
  register: (body) => request('/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/login',    { method: 'POST', body: JSON.stringify(body) }),
  profile:  ()     => request('/profile'),
  updateProfileText: (profile_text) =>
    request('/profile/text', { method: 'PUT', body: JSON.stringify({ profile_text }) }),
  getScholarships: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/scholarships${qs ? '?' + qs : ''}`)
  },
  getMatches: () => request('/matches'),
  runMatch:   () => request('/match', { method: 'POST' }),
  seedData:   () => request('/scholarships/seed', { method: 'POST' }),
}
