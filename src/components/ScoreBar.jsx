export default function ScoreBar({ score, questionNum }) {
  return (
    <div className="flex gap-4 justify-center items-center mb-4">
      <div
        className="flex items-center gap-2 px-5 py-2 rounded-2xl font-bold text-sm shadow-md"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-forest)',
        }}
      >
        <span className="text-lg">&#x2705;</span>
        <span>{score}</span>
      </div>
      <div
        className="flex items-center gap-2 px-5 py-2 rounded-2xl font-bold text-sm shadow-md"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-lavender)',
        }}
      >
        <span className="text-lg">&#x1F4AC;</span>
        <span>Question {questionNum}</span>
      </div>
    </div>
  )
}
