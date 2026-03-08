export default function Feedback({ type, text }) {
  if (!text) return <div className="h-12" />

  const styles = {
    correct: { color: 'var(--color-forest)', bg: 'rgba(0,184,148,0.1)' },
    wrong: { color: 'var(--color-coral)', bg: 'rgba(255,107,107,0.1)' },
    reveal: { color: 'var(--color-lavender)', bg: 'rgba(108,92,231,0.1)' },
  }

  const s = styles[type] || styles.wrong

  // Masqué visuellement pour l'instant (logique conservée)
  return (
    <div
      className="animate-bounce-in text-center px-6 py-3 rounded-2xl font-bold text-xl mx-auto"
      style={{
        fontFamily: 'var(--font-heading)',
        color: s.color,
        background: s.bg,
        maxWidth: 400,
        display: 'none',
      }}
    >
      {text}
    </div>
  )
}
