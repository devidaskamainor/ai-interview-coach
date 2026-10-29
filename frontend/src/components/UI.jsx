import { useEffect, useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action}
    </div>
  )
}
export function EmptyState({
  icon = 'chart',
  title,
  description,
  action = false,
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={24} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <Link to="/new" className="btn-primary mt-5">
          Start an interview
          <Icon name="arrow" size={16} />
        </Link>
      )}
    </div>
  )
}
export function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <Icon name="info" size={22} />
      <div>
        <h2>Let's try that again</h2>
        <p>{message}</p>
        {onRetry && (
          <button className="btn-ghost mt-4" onClick={onRetry}>
            Try again
            <Icon name="arrow" size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
export function LoadingState({ label = 'Getting your workspace ready…' }) {
  return (
    <div className="loading-layout" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-subtitle" />
      <div className="skeleton-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton skeleton-stat" />
        ))}
      </div>
      <div className="skeleton skeleton-panel" />
    </div>
  )
}
export function StatusBadge({ completed }) {
  return (
    <span
      className={`status-badge ${completed ? 'status-complete' : 'status-progress'}`}
    >
      <Icon name={completed ? 'checkCircle' : 'clock'} size={12} />
      {completed ? 'Completed' : 'In progress'}
    </span>
  )
}
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  onConfirm,
  onClose,
  busy = false,
  destructive = false,
}) {
  const ref = useRef(null)
  const titleId = useId()
  useEffect(() => {
    if (open && !ref.current.open) ref.current.showModal()
    if (!open && ref.current.open) ref.current.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        if (!busy) onClose()
      }}
    >
      <div className="dialog-icon">
        <Icon name={destructive ? 'trash' : 'checkCircle'} size={24} />
      </div>
      <h2 id={titleId}>{title}</h2>
      <p>{children}</p>
      <div className="dialog-actions">
        <button
          autoFocus
          className="btn-ghost"
          onClick={onClose}
          disabled={busy}
        >
          Cancel
        </button>
        <button
          className={destructive ? 'btn-danger' : 'btn-primary'}
          disabled={busy}
          onClick={onConfirm}
        >
          {busy ? 'Please wait…' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
export function StatCard({ icon, label, value, suffix, description }) {
  return (
    <section className="stat-card">
      <div className="stat-card-top">
        <span>{label}</span>
        <Icon name={icon} size={18} />
      </div>
      <p className="stat-value">
        {value ?? '—'}
        {value != null && suffix && <span>{suffix}</span>}
      </p>
      <p className="stat-description">{description}</p>
    </section>
  )
}
