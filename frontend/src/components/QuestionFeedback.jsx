import Icon from './Icon'
import RubricBars from './RubricBars'
import ScoreRing from './ScoreRing'

function FeedbackList({ title, items, icon }) {
  if (!items?.length) return null
  return (
    <div className="feedback-list">
      <h4>
        <Icon name={icon} size={15} />
        {title}
      </h4>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default function QuestionFeedback({ q }) {
  const feedback = q.feedback || {}
  return (
    <div className="question-feedback">
      <div className="feedback-score">
        <ScoreRing score={q.score ?? 0} size={95} />
        <div className="feedback-dimensions">
          <div>
            <span>Technical</span>
            <strong>
              {q.technical_score == null
                ? '—'
                : Number(q.technical_score).toFixed(1)}
              <small>/10</small>
            </strong>
          </div>
          <div>
            <span>Communication</span>
            <strong>
              {q.communication_score == null
                ? '—'
                : Number(q.communication_score).toFixed(1)}
              <small>/10</small>
            </strong>
          </div>
        </div>
      </div>
      <RubricBars rubric={q.rubric} />
      <div className="feedback-list-grid">
        <FeedbackList
          title="What worked well"
          items={feedback.strengths}
          icon="checkCircle"
        />
        <FeedbackList
          title="Make it stronger"
          items={feedback.improvements}
          icon="target"
        />
        <FeedbackList
          title="Explore a little further"
          items={feedback.missing_points}
          icon="book"
        />
      </div>
      {q.suggested_answer && (
        <div className="suggested-answer">
          <h4>
            <Icon name="sparkles" size={17} />A different way to approach it
          </h4>
          <span className="suggested-answer-label">SUGGESTED ANSWER</span>
          <p>{q.suggested_answer}</p>
        </div>
      )}
    </div>
  )
}
