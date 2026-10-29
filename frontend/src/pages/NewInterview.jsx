import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import Icon from '../components/Icon'
import { PageHeading } from '../components/UI'

const LEVELS = [
  {
    id: 'beginner',
    title: 'Beginner',
    desc: 'Build confidence with fundamentals and core concepts.',
    icon: 'book',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    desc: 'Put your knowledge to work with practical challenges.',
    icon: 'bars',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    desc: 'Go deeper into architecture, scale, and trade-offs.',
    icon: 'target',
  },
]

function roleIcon(role) {
  if (/data|machine learning/i.test(role)) return 'chart'
  if (/design/i.test(role)) return 'grid'
  if (/devops|qa/i.test(role)) return 'settings'
  return 'code'
}

export default function NewInterview() {
  const nav = useNavigate()
  const [roles, setRoles] = useState([])
  const [rolesError, setRolesError] = useState('')
  const [role, setRole] = useState('Python Developer')
  const [custom, setCustom] = useState('')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [count, setCount] = useState(5)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    api
      .roles()
      .then((r) => setRoles(r.roles))
      .catch((e) =>
        setRolesError(
          e.message ||
            'Could not load suggested roles. You can still enter a role below.',
        ),
      )
  }, [])
  async function start() {
    const finalRole = (custom.trim() || role).trim()
    if (finalRole.length < 2) {
      setError('Enter a role with at least 2 characters.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const s = await api.createSession({
        role: finalRole,
        difficulty,
        num_questions: count,
      })
      nav(`/interview/${s.id}`)
    } catch (e) {
      setError(e.message)
      setBusy(false)
    }
  }
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="PRACTICE WITH INTENTION"
        title="Your next great interview starts here."
        description="Make it relevant to you. Choose a role, find your level, and get ready to practice."
      />
      <div className="setup-layout">
        <div className="setup-form">
          <section className="panel setup-section">
            <div className="step-heading">
              <span>01</span>
              <div>
                <h2>Choose your path</h2>
                <p>What role are you preparing for?</p>
              </div>
            </div>
            {rolesError && (
              <p className="inline-message message-error" role="alert">
                <Icon name="info" size={17} />
                {rolesError}
              </p>
            )}
            <fieldset>
              <legend className="sr-only">Job role</legend>
              <div className="role-grid">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => {
                      setRole(r)
                      setCustom('')
                    }}
                    aria-pressed={!custom && role === r}
                    className={`role-option ${!custom && role === r ? 'is-selected' : ''}`}
                  >
                    <span className="role-option-icon">
                      <Icon name={roleIcon(r)} size={18} />
                    </span>
                    <span>{r}</span>
                    {!custom && role === r && (
                      <Icon name="checkCircle" size={16} />
                    )}
                  </button>
                ))}
              </div>
              <label htmlFor="custom-role" className="custom-role-label">
                Have another role in mind?
              </label>
              <input
                id="custom-role"
                className="field"
                placeholder="e.g. Android Developer or Product Manager"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                maxLength={80}
                disabled={busy}
              />
            </fieldset>
          </section>
          <section className="panel setup-section">
            <div className="step-heading">
              <span>02</span>
              <div>
                <h2>Find your challenge</h2>
                <p>A comfortable stretch is a good place to grow.</p>
              </div>
            </div>
            <fieldset>
              <legend className="sr-only">Difficulty level</legend>
              <div className="difficulty-grid">
                {LEVELS.map((level) => (
                  <button
                    type="button"
                    key={level.id}
                    onClick={() => setDifficulty(level.id)}
                    aria-pressed={difficulty === level.id}
                    className={`difficulty-option ${difficulty === level.id ? 'is-selected' : ''}`}
                  >
                    <span className="difficulty-top">
                      <Icon name={level.icon} size={21} />
                      <span className="selection-circle">
                        {difficulty === level.id && (
                          <Icon name="check" size={11} />
                        )}
                      </span>
                    </span>
                    <strong>{level.title}</strong>
                    <span>{level.desc}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </section>
          <section className="panel setup-section">
            <div className="step-heading">
              <span>03</span>
              <div>
                <h2>Make space for practice</h2>
                <p>Choose how many questions you'd like to explore.</p>
              </div>
            </div>
            <div className="question-count-heading">
              <label htmlFor="question-count">Number of questions</label>
              <output htmlFor="question-count">
                {count}
                <span> questions</span>
              </output>
            </div>
            <input
              id="question-count"
              type="range"
              min={3}
              max={10}
              value={count}
              onChange={(e) => setCount(+e.target.value)}
              className="question-range"
            />
            <div className="range-labels">
              <span>3 · A focused session</span>
              <span>10 · A deeper dive</span>
            </div>
          </section>
        </div>
        <aside className="setup-summary panel">
          <div className="summary-emblem">
            <Icon name="practice" size={28} />
          </div>
          <span className="eyebrow">YOUR PRACTICE PLAN</span>
          <h2>A session made for you.</h2>
          <p className="summary-intro">
            A clear focus. A fresh set of questions. Room to get better.
          </p>
          <dl className="configuration-list">
            <div>
              <dt>Role</dt>
              <dd>{custom.trim() || role}</dd>
            </div>
            <div>
              <dt>Level</dt>
              <dd>{LEVELS.find((level) => level.id === difficulty).title}</dd>
            </div>
            <div>
              <dt>Questions</dt>
              <dd>{count} questions</dd>
            </div>
          </dl>
          <div className="summary-includes">
            <strong>Every session includes</strong>
            <span>
              <Icon name="check" size={14} />
              Questions tailored to your role
            </span>
            <span>
              <Icon name="check" size={14} />
              Technical & communication scoring
            </span>
            <span>
              <Icon name="check" size={14} />
              Feedback you can put into action
            </span>
          </div>
          {error && (
            <p role="alert" className="inline-message message-error">
              {error}
            </p>
          )}
          <button
            className="btn-primary start-interview-button"
            onClick={start}
            disabled={busy}
          >
            {busy ? 'Preparing your questions…' : 'Start interview'}
            {!busy && <Icon name="arrow" size={17} />}
          </button>
          <p className="summary-footnote">
            <Icon name="sparkles" size={13} />
            Fresh questions. A new perspective.
          </p>
          <Link to="/" className="back-link">
            <Icon name="arrowLeft" size={14} />
            Back to dashboard
          </Link>
        </aside>
      </div>
    </div>
  )
}
