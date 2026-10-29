import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import ProgressChart from '../components/ProgressChart'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeading,
  StatCard,
} from '../components/UI'
import useProgress from '../lib/useProgress'

export default function Analytics() {
  const { stats, error, reload, loading } = useProgress()
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (loading) return <LoadingState label="Loading performance analytics…" />
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="PROGRESS WITH PERSPECTIVE"
        title="See your practice paying off."
        description="A clear view of your completed interviews and where to focus next."
        action={
          <Link to="/new" className="btn-primary">
            Keep practicing
            <Icon name="arrow" size={17} />
          </Link>
        }
      />
      <div className="stats-grid">
        <StatCard
          icon="checkCircle"
          label="Completed interviews"
          value={stats.completed}
          description="Your practice, put into action"
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
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Performance over time</h2>
            <p>Each point represents a completed interview.</p>
          </div>
          <span className="chart-legend">
            <i />
            Overall score
          </span>
        </div>
        {stats.trend.length ? (
          <div className="chart-container">
            <ProgressChart trend={stats.trend} />
          </div>
        ) : (
          <EmptyState
            title="A clearer picture with every session"
            description="Complete your first interview to begin tracking your scores over time."
            action
          />
        )}
      </section>
      <div className="two-column-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Performance by role</h2>
              <p>Find your strengths across different paths.</p>
            </div>
            <Icon name="bars" size={19} />
          </div>
          {stats.by_role.length ? (
            <div className="role-performance-list">
              {stats.by_role.map((role) => (
                <div key={role.role} className="role-performance">
                  <div>
                    <span>{role.role}</span>
                    <strong>
                      {role.avg}
                      <small>/100</small>
                    </strong>
                  </div>
                  <div className="track">
                    <span
                      style={{
                        width: `${Math.max(0, Math.min(100, role.avg))}%`,
                      }}
                    />
                  </div>
                  <p>
                    {role.count} completed{' '}
                    {role.count === 1 ? 'interview' : 'interviews'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="code"
              title="Discover your strengths"
              description="Role averages will appear as you complete interviews."
            />
          )}
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Your next learning opportunities</h2>
              <p>Topics that scored below 60 in completed sessions.</p>
            </div>
            <Icon name="book" size={19} />
          </div>
          {stats.weak_topics.length ? (
            <ul className="topic-list">
              {stats.weak_topics.map((topic) => (
                <li key={topic.topic}>
                  <span className="topic-icon">
                    <Icon name="book" size={17} />
                  </span>
                  <div>
                    <strong>{topic.topic}</strong>
                    <p>Revisit this topic in your next practice.</p>
                  </div>
                  <span className="neutral-badge">
                    {topic.count} {topic.count === 1 ? 'question' : 'questions'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon="target"
              title={
                stats.completed
                  ? 'Keep building on your foundation'
                  : 'Find your next focus'
              }
              description={
                stats.completed
                  ? 'No recurring low-scoring topics have been identified in your completed interviews.'
                  : 'After an interview, this space highlights topics you can work on.'
              }
            />
          )}
        </section>
      </div>
    </div>
  )
}
