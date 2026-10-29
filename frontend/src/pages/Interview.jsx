import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { cap } from '../lib/format'
import Icon from '../components/Icon'
import QuestionFeedback from '../components/QuestionFeedback'
import ScoreRing from '../components/ScoreRing'
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
} from '../components/UI'

function FeedbackBlock({ icon, title, items }) {
  if (!items?.length) return null
  return (
    <section className="panel report-block">
      <span className="section-icon">
        <Icon name={icon} size={19} />
      </span>
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

function Results({ session }) {
  const summary = session.summary || {}
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="ANOTHER STEP FORWARD"
        title="Good practice. A clearer path ahead."
        description={`${session.role} · ${cap(session.difficulty)} · ${session.num_questions} questions`}
        action={
          <Link to="/new" className="btn-primary">
            <Icon name="plus" size={17} />
            Practice again
          </Link>
        }
      />
      <section className="panel result-overview">
        <div className="result-score">
          <ScoreRing
            score={session.overall_score ?? 0}
            size={144}
            label="overall score"
          />
          <span>YOUR INTERVIEW SCORE</span>
        </div>
        <div className="result-summary">
          <span className="eyebrow">
            <Icon name="sparkles" size={13} />
            YOUR COACH'S PERSPECTIVE
          </span>
          <h2>Take the insight. Build the confidence.</h2>
          <p>
            {summary.summary ||
              'Your question-by-question feedback is ready below. An overall summary is currently unavailable.'}
          </p>
          <div className="result-dimensions">
            <div>
              <span>
                <Icon name="code" size={16} />
                Technical
              </span>
              <strong>
                {session.technical_avg ?? '—'}
                <small>/10</small>
              </strong>
            </div>
            <div>
              <span>
                <Icon name="message" size={16} />
                Communication
              </span>
              <strong>
                {session.communication_avg ?? '—'}
                <small>/10</small>
              </strong>
            </div>
          </div>
          <a href="#question-review" className="text-link">
            Explore your answers
            <Icon name="arrow" size={15} />
          </a>
        </div>
      </section>
      <div className="report-block-grid">
        <FeedbackBlock
          icon="checkCircle"
          title="Build on your strengths"
          items={summary.strengths}
        />
        <FeedbackBlock
          icon="target"
          title="Room to grow"
          items={summary.improvements}
        />
        <FeedbackBlock
          icon="book"
          title="Put it into practice"
          items={summary.next_steps}
        />
      </div>
      <section id="question-review" className="question-review">
        <div className="review-heading">
          <div>
            <span className="eyebrow">THE DETAILS THAT MAKE A DIFFERENCE</span>
            <h2>A closer look at your answers</h2>
          </div>
          <span className="neutral-badge">
            {session.questions.length} questions reviewed
          </span>
        </div>
        <div className="question-accordions">
          {session.questions.map((question) => (
            <details key={question.id} className="panel question-accordion">
              <summary>
                <span className="question-number">
                  {String(question.position).padStart(2, '0')}
                </span>
                <span className="accordion-question">
                  {question.question}
                  <small>{question.topic}</small>
                </span>
                <span className="accordion-score">
                  {question.score}
                  <small>/100</small>
                </span>
                <Icon name="chevronDown" size={17} />
              </summary>
              <div className="question-accordion-body">
                <div className="answer-review">
                  <span className="eyebrow">YOUR ANSWER</span>
                  <p>{question.answer}</p>
                </div>
                <QuestionFeedback q={question} />
              </div>
            </details>
          ))}
        </div>
      </section>
      <div className="results-next">
        <span className="section-icon">
          <Icon name="practice" size={24} />
        </span>
        <div>
          <h3>Carry this momentum into your next session.</h3>
          <p>
            Use one piece of feedback to make your next answer a little
            stronger.
          </p>
        </div>
        <Link to="/new" className="btn-primary">
          Practice again
          <Icon name="arrow" size={16} />
        </Link>
      </div>
      <Link to="/" className="back-link">
        <Icon name="arrowLeft" size={15} />
        Return to dashboard
      </Link>
    </div>
  )
}

export default function Interview() {
  const { id } = useParams()
  const [session, setSession] = useState(null)
  const [idx, setIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [finishOpen, setFinishOpen] = useState(false)
  useEffect(() => {
    setSession(null)
    setError('')
    api
      .getSession(id)
      .then((s) => {
        setSession(s)
        const first = s.questions.findIndex((q) => !q.evaluated_at)
        setIdx(first === -1 ? s.questions.length - 1 : first)
      })
      .catch((e) => setError(e.message))
  }, [id])
  if (error && !session)
    return (
      <>
        <ErrorState message={error} />
        <Link to="/" className="back-link mt-5">
          <Icon name="arrowLeft" size={15} />
          Back to dashboard
        </Link>
      </>
    )
  if (!session) return <LoadingState label="Getting your interview ready…" />
  if (session.status === 'completed') return <Results session={session} />
  if (!session.questions.length)
    return (
      <section className="panel">
        <EmptyState
          icon="practice"
          title="This session needs a fresh start"
          description="No questions were saved for this interview. Start another session to continue practicing."
          action
        />
      </section>
    )
  const question = session.questions[idx]
  const isLast = idx === session.questions.length - 1
  const answeredCount = session.questions.filter((q) => q.evaluated_at).length
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0
  async function submit() {
    setBusy(true)
    setError('')
    try {
      const updated = await api.submitAnswer(id, question.id, answer)
      setSession((s) => ({
        ...s,
        questions: s.questions.map((q) => (q.id === question.id ? updated : q)),
      }))
    } catch (e) {
      setError(e.message || 'Unable to submit your answer. Please try again.')
    } finally {
      setBusy(false)
    }
  }
  async function next() {
    setAnswer('')
    setError('')
    if (!isLast) return setIdx(idx + 1)
    setBusy(true)
    try {
      setSession(await api.complete(id))
    } catch (e) {
      setError(
        e.message || 'Unable to finish this interview. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="page-stack interview-page">
      <div className="room-heading">
        <div>
          <Link to="/" className="back-link">
            <Icon name="arrowLeft" size={14} />
            Back to dashboard
          </Link>
          <h1>A little space to think clearly.</h1>
          <p>Take a breath. Explain your thinking. Make it your own.</p>
        </div>
        <span className="neutral-badge">
          <Icon name="practice" size={14} />
          Practice session
        </span>
      </div>
      <div className="room-progress">
        <div>
          <span>
            Question <strong>{idx + 1}</strong> of {session.questions.length}
          </span>
          <span>
            {answeredCount} of {session.questions.length} answered
          </span>
        </div>
        <div
          className="segmented-progress"
          role="progressbar"
          aria-label="Interview completion"
          aria-valuemin={0}
          aria-valuemax={session.questions.length}
          aria-valuenow={answeredCount}
        >
          {session.questions.map((q, index) => (
            <span
              key={q.id}
              className={
                q.evaluated_at
                  ? 'is-complete'
                  : index === idx
                    ? 'is-current'
                    : ''
              }
            />
          ))}
        </div>
      </div>
      <div className="room-layout">
        <div className="room-main">
          <section className="panel question-panel">
            <div className="question-topline">
              <span className="question-topic">
                <Icon name="code" size={15} />
                {question.topic || 'Interview question'}
              </span>
              <span>{String(idx + 1).padStart(2, '0')}</span>
            </div>
            <h2>{question.question}</h2>
            <p>
              Explain your reasoning and include a practical example where it
              helps.
            </p>
          </section>
          {!question.evaluated_at ? (
            <section className="panel answer-editor">
              <div className="editor-heading">
                <label htmlFor="answer">
                  <Icon name="message" size={16} />
                  Your answer
                </label>
                <span>Make your thinking visible</span>
              </div>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                maxLength={6000}
                disabled={busy}
                placeholder="Start with the main idea. Walk through your reasoning, then bring it to life with an example…"
              />
              <div className="editor-footer">
                <span>
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                  <span className="metadata-dot">·</span>
                  {answer.length}/6000 characters
                </span>
                <span className="editor-status">Not submitted</span>
              </div>
            </section>
          ) : (
            <section className="panel submitted-answer">
              <div className="submitted-heading">
                <span className="eyebrow">YOUR ANSWER</span>
                <span className="status-badge status-complete">
                  <Icon name="checkCircle" size={12} />
                  Answer submitted
                </span>
              </div>
              <p className="submitted-answer-text">{question.answer}</p>
              <div className="feedback-divider">
                <span>
                  <Icon name="sparkles" size={16} />A little feedback to move
                  you forward
                </span>
              </div>
              <QuestionFeedback q={question} />
            </section>
          )}
          {error && (
            <p role="alert" className="inline-message message-error">
              <Icon name="info" size={17} />
              {error}
            </p>
          )}
          <div className="room-actions">
            <span>
              <Icon name="shield" size={14} />
              Your submitted answers are saved.
            </span>
            {!question.evaluated_at ? (
              <button
                className="btn-primary"
                onClick={submit}
                disabled={busy || answer.trim().length < 3}
              >
                {busy ? 'Reviewing your answer…' : 'Submit answer'}
                {!busy && <Icon name="arrow" size={16} />}
              </button>
            ) : (
              <button
                className="btn-primary"
                disabled={busy}
                onClick={() => (isLast ? setFinishOpen(true) : next())}
              >
                {busy
                  ? 'Preparing your report…'
                  : isLast
                    ? 'Finish & see results'
                    : 'Next question'}
                <Icon name={isLast ? 'check' : 'arrow'} size={16} />
              </button>
            )}
          </div>
        </div>
        <aside className="room-sidebar">
          <section className="panel session-details">
            <span className="eyebrow">YOUR SESSION</span>
            <span className="section-icon">
              <Icon name="practice" size={21} />
            </span>
            <h3>{session.role}</h3>
            <dl>
              <div>
                <dt>Difficulty</dt>
                <dd>{cap(session.difficulty)}</dd>
              </div>
              <div>
                <dt>Questions</dt>
                <dd>{session.questions.length}</dd>
              </div>
              <div>
                <dt>Answered</dt>
                <dd>
                  {answeredCount} of {session.questions.length}
                </dd>
              </div>
            </dl>
          </section>
          <div className="writing-note">
            <Icon name="book" size={22} />
            <h3>A thoughtful answer goes a long way.</h3>
            <p>
              Start with what you know. Explain why it matters. Use a concrete
              example to connect the dots.
            </p>
            <span>You don't have to be perfect to make progress.</span>
          </div>
        </aside>
      </div>
      <ConfirmDialog
        open={finishOpen}
        title="Ready for the bigger picture?"
        confirmLabel="Finish interview"
        busy={busy}
        onClose={() => setFinishOpen(false)}
        onConfirm={async () => {
          await next()
          setFinishOpen(false)
        }}
      >
        All your answers are submitted. Finish this interview to see your
        overall score, strengths, and next steps.
      </ConfirmDialog>
    </div>
  )
}
