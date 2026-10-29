import { Link } from 'react-router-dom'
import { cap, fmtDate, scoreColor } from '../lib/format'
import Icon from './Icon'
import { StatusBadge } from './UI'

export default function SessionList({ sessions, onDelete, deletingId }) {
  return (
    <div className="session-table-wrap">
      <table className="session-table">
        <caption className="sr-only">Interview sessions and results</caption>
        <thead>
          <tr>
            <th>Interview</th>
            <th>Date</th>
            <th>Status</th>
            <th>Score</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td className="session-name-cell">
                <div className="session-name">
                  <span className="session-icon">
                    <Icon name="code" size={18} />
                  </span>
                  <div>
                    <strong>{session.role}</strong>
                    <span>
                      {cap(session.difficulty)}
                      <span className="metadata-dot">·</span>
                      {session.num_questions} questions
                    </span>
                  </div>
                </div>
              </td>
              <td className="session-date">{fmtDate(session.created_at)}</td>
              <td>
                <StatusBadge completed={session.status === 'completed'} />
              </td>
              <td>
                <span
                  className={`table-score ${session.overall_score == null ? 'text-muted' : scoreColor(session.overall_score)}`}
                >
                  {session.overall_score == null
                    ? '—'
                    : Math.round(session.overall_score)}
                  {session.overall_score != null && <small>/100</small>}
                </span>
              </td>
              <td>
                <div className="session-actions">
                  <Link to={`/interview/${session.id}`} className="table-link">
                    {session.status === 'completed' ? 'Review' : 'Resume'}
                    <Icon name="arrow" size={15} />
                  </Link>
                  {onDelete && (
                    <button
                      className="icon-button delete-button"
                      aria-label={`Delete ${session.role} interview from ${fmtDate(session.created_at)}`}
                      disabled={deletingId === session.id}
                      onClick={() => onDelete(session)}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
