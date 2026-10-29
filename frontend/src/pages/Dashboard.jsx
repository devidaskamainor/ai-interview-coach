import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import ProgressChart from '../components/ProgressChart'
import SessionList from '../components/SessionList'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  StatCard,
} from '../components/UI'
import useProgress from '../lib/useProgress'

export default function Dashboard({ email }) {
  const { stats, sessions, error, reload, loading } = useProgress()
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (loading) return <LoadingState />
  const name = email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'there'
  const inProgress = sessions.find(
    (session) => session.status === 'in_progress',
  )
  const focusTopic = stats.weak_topics[0]?.topic
  const delta =
    stats.trend.length > 1
      ? stats.trend.at(-1).score - stats.trend.at(-2).score
      : null
  return (
    <div className="page-stack dashboard-page">
      <PageHeading
        eyebrow="YOUR NEXT CHAPTER STARTS HERE"
        title={
          <>
            Welcome back, <span className="welcome-name">{name}</span>.
          </>
        }
        description="A little more practice. A little more confidence. Let's make progress."
        action={
          <Link to="/new" className="btn-primary">
            <Icon name="plus" size={17} />
            Start interview
          </Link>
        }
      />
      <section className="practice-banner">
        <div className="practice-banner-copy">
          <span className="banner-label">
            <Icon name="sparkles" size={15} />A SPACE TO GET BETTER
          </span>
          <h2>
            Great interviews begin
            <br />
            with a little practice.
          </h2>
          <p>
            Build your knowledge, sharpen your answers, and feel ready for
            what's next.
          </p>
          <Link
            to={inProgress ? `/interview/${inProgress.id}` : '/new'}
            className="banner-link"
          >
            {inProgress
              ? 'Continue your interview'
              : 'Find your next challenge'}
            <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="banner-art" aria-hidden="true">
          <div className="banner-orbit" />
          <div className="banner-orbit banner-orbit-inner" />
          <span className="banner-art-center">
            <Icon name="practice" size={40} />
          </span>
          <span className="banner-art-icon art-code">
            <Icon name="code" size={23} />
          </span>
          <span className="banner-art-icon art-check">
            <Icon name="check" size={22} />
          </span>
          <span className="banner-art-icon art-message">
            <Icon name="message" size={22} />
          </span>
        </div>
      </section>
      <div className="stats-grid">
        <StatCard
          icon="checkCircle"
          label="Interviews completed"
          value={stats.completed}
          description="Every session is a step forward"
        />
        <StatCard
          icon="target"
          label="Average score"
          value={stats.avg_score}
          suffix="/100"
          description="Across completed interviews"
        />
        <StatCard
          icon="code"
          label="Technical average"
          value={stats.avg_technical}
          suffix="/10"
          description="Accuracy and completeness"
        />
        <StatCard
          icon="message"
          label="Communication"
          value={stats.avg_communication}
          suffix="/10"
          description="Clarity and structure"
        />
      </div>
      <div className="dashboard-middle">
        <section className="panel performance-panel">
          <div className="panel-heading">
            <div>
              <h2>Your progress, in perspective</h2>
              <p>Overall scores from your completed interviews.</p>
            </div>
            <Link to="/analytics" className="text-link">
              View insights
              <Icon name="arrow" size={14} />
            </Link>
          </div>
          {stats.trend.length ? (
            <>
              <div className="chart-summary">
                <strong>
                  {stats.trend.at(-1).score}
                  <span>/100</span>
                </strong>
                <span>Latest interview</span>
                {delta != null && (
                  <span className="neutral-badge">
                    {delta > 0 ? '+' : ''}
                    {Number(delta.toFixed(1))} points from previous
                  </span>
                )}
              </div>
              <div className="chart-container">
                <ProgressChart trend={stats.trend} />
              </div>
            </>
          ) : (
            <EmptyState
              title="Your progress starts with one interview"
              description="Finish a session to see your performance take shape here."
              action
            />
          )}
        </section>
        <section className="panel next-step-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">A LITTLE DIRECTION</span>
              <h2>Your next step</h2>
            </div>
            <span className="section-icon">
              <Icon name="target" size={20} />
            </span>
          </div>
          {inProgress ? (
            <div className="next-step-content">
              <span className="neutral-badge">Ready when you are</span>
              <h3>Pick up where you left off.</h3>
              <p>
                Your {inProgress.role} interview is still in progress. Keep the
                momentum going.
              </p>
              <Link to={`/interview/${inProgress.id}`} className="btn-ghost">
                Resume interview
                <Icon name="arrow" size={16} />
              </Link>
            </div>
          ) : focusTopic ? (
            <div className="next-step-content">
              <span className="neutral-badge">Based on your feedback</span>
              <h3>A little focus goes a long way.</h3>
              <p>
                Revisit <strong>{focusTopic}</strong>, then put what you've
                learned into practice.
              </p>
              <Link to="/new" className="btn-ghost">
                Start a focused session
                <Icon name="arrow" size={16} />
              </Link>
            </div>
          ) : (
            <div className="next-step-content">
              <h3>Build your starting point.</h3>
              <p>
                A short interview helps you discover what comes naturally and
                what to work on next.
              </p>
              <ol className="practice-steps">
                <li>
                  <span>01</span>Choose a role you care about
                </li>
                <li>
                  <span>02</span>Give each answer your best shot
                </li>
                <li>
                  <span>03</span>Turn feedback into your next step
                </li>
              </ol>
              <Link to="/new" className="text-link">
                Let's get started
                <Icon name="arrow" size={15} />
              </Link>
            </div>
          )}
        </section>
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Recent interviews</h2>
            <p>Your latest practice sessions, all in one place.</p>
          </div>
          <Link to="/history" className="text-link">
            View all
            <Icon name="arrow" size={14} />
          </Link>
        </div>
        {sessions.length ? (
          <SessionList sessions={sessions.slice(0, 5)} />
        ) : (
          <EmptyState
            icon="history"
            title="A fresh start, full of possibility"
            description="Your interview sessions will appear here. Start with a role you'd love to grow into."
          />
        )}
      </section>
    </div>
  )
}
