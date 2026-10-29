import { supabase } from './supabase'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) {
    let detail = res.statusText
    try { detail = (await res.json()).detail || detail } catch { /* ignore */ }
    throw new Error(detail)
  }
  return res.json()
}

export const api = {
  roles: () => request('/api/roles'),
  createSession: (body) => request('/api/sessions', { method: 'POST', body: JSON.stringify(body) }),
  listSessions: () => request('/api/sessions'),
  getSession: (id) => request(`/api/sessions/${id}`),
  submitAnswer: (sid, qid, answer) =>
    request(`/api/sessions/${sid}/questions/${qid}/answer`, { method: 'POST', body: JSON.stringify({ answer }) }),
  complete: (id) => request(`/api/sessions/${id}/complete`, { method: 'POST' }),
  remove: (id) => request(`/api/sessions/${id}`, { method: 'DELETE' }),
  stats: () => request('/api/stats'),
}
