import { useCallback, useEffect, useState } from 'react'
import { api } from './api'

export default function useProgress() {
  const [stats, setStats] = useState(null)
  const [sessions, setSessions] = useState(null)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const reload = useCallback(async () => {
    setError('')
    try {
      const [summary, history] = await Promise.all([
        api.stats(),
        api.listSessions(),
      ])
      setStats(summary)
      setSessions(history.sessions)
    } catch (error) {
      setError(
        error.message || 'Unable to load your progress. Please try again.',
      )
    }
  }, [])
  useEffect(() => {
    reload()
  }, [reload])
  async function remove(id) {
    setDeletingId(id)
    setError('')
    try {
      await api.remove(id)
      await reload()
    } catch (error) {
      setError(
        error.message || 'Unable to delete this interview. Please try again.',
      )
    } finally {
      setDeletingId(null)
    }
  }
  return {
    stats,
    sessions,
    error,
    reload,
    remove,
    deletingId,
    loading: !stats || !sessions,
  }
}
