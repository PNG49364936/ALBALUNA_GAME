export default function AttemptDots({ attempts, max = 3 }) {
  return (
    <div className="flex gap-3 justify-center my-3">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            background: i < attempts
              ? 'linear-gradient(135deg, #FF6B6B, #ee5a24)'
              : 'rgba(255,255,255,0.7)',
            border: i < attempts ? 'none' : '3px solid #ddd',
            transform: i < attempts ? 'scale(1.15)' : 'scale(1)',
            boxShadow: i < attempts ? '0 3px 12px rgba(255,107,107,0.4)' : '0 1px 4px rgba(0,0,0,0.06)',
            fontSize: 14,
          }}
        >
          {i < attempts ? '\u2716' : ''}
        </div>
      ))}
      <span
        className="flex items-center font-bold text-xs ml-1"
        style={{ color: 'var(--color-ink-light)', fontFamily: 'var(--font-body)' }}
      >
        {attempts === 0 ? '3 essais' : `${max - attempts} restant${max - attempts > 1 ? 's' : ''}`}
      </span>
    </div>
  )
}
