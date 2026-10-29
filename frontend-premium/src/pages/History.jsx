import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import SessionList from '../components/SessionList'
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
} from '../components/UI'
import useProgress from '../lib/useProgress'

export default function History() {
  const { sessions, loading, error, reload, remove, deletingId } = useProgress()
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')
  const [pendingDelete, setPendingDelete] = useState(null)
  const filtered = useMemo(
    () =>
      (sessions || [])
        .filter(
          (session) =>
            session.role.toLowerCase().includes(query.toLowerCase().trim()) &&
            (difficulty === 'all' || session.difficulty === difficulty) &&
            (status === 'all' || session.status === status),
        )
        .sort((a, b) =>
          sort === 'score'
            ? (b.overall_score ?? -1) - (a.overall_score ?? -1)
            : sort === 'oldest'
              ? new Date(a.created_at) - new Date(b.created_at)
              : new Date(b.created_at) - new Date(a.created_at),
        ),
    [sessions, query, difficulty, status, sort],
  )
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (loading) return <LoadingState label="Loading your interview history…" />
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="YOUR PRACTICE LIBRARY"
        title="Every session. Every step forward."
        description="Revisit your feedback, resume a session, and see how far you've come."
        action={
          <Link className="btn-primary" to="/new">
            <Icon name="plus" size={17} />
            Start interview
          </Link>
        }
      />
      <section className="panel">
        <div className="history-toolbar">
          <label className="search-field">
            <Icon name="search" size={18} />
            <span className="sr-only">Search interviews by role</span>
            <input
              type="search"
              placeholder="Search by role…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="history-filters">
            <label>
              <span className="sr-only">Filter by difficulty</span>
              <select
                className="field"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="all">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by status</span>
              <select
                className="field"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In progress</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Sort interviews</span>
              <select
                className="field"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="score">Highest score</option>
              </select>
            </label>
          </div>
        </div>
        <div className="results-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'interview' : 'interviews'}
          {sessions.length >= 100
            ? ' in your latest 100 sessions'
            : ' in your library'}
        </div>
        {filtered.length ? (
          <SessionList
            sessions={filtered}
            onDelete={setPendingDelete}
            deletingId={deletingId}
          />
        ) : (
          <EmptyState
            icon="history"
            title={
              sessions.length
                ? 'No matching interviews'
                : 'Your story starts here'
            }
            description={
              sessions.length
                ? 'Try another role or adjust your filters.'
                : 'Your interviews and feedback will appear here after your first practice session.'
            }
            action={!sessions.length}
          />
        )}
      </section>
      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this interview?"
        confirmLabel="Delete interview"
        destructive
        busy={!!deletingId}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          await remove(pendingDelete.id)
          setPendingDelete(null)
        }}
      >
        This removes the interview and its feedback from your history. This
        action cannot be undone.
      </ConfirmDialog>
    </div>
  )
}
