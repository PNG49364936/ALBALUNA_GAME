export default function CategoryCard({ icon, label, gradient, onClick, delay = 0 }) {
  return (
    <button
      onClick={onClick}
      className="animate-bounce-in border-none cursor-pointer rounded-[28px] flex flex-col items-center justify-center gap-3 text-white shadow-lg transition-all duration-200 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.03] active:scale-95"
      style={{
        width: 200,
        height: 200,
        background: gradient,
        fontFamily: 'var(--font-heading)',
        fontSize: '1.3rem',
        fontWeight: 700,
        animationDelay: `${delay}ms`,
      }}
    >
      <span className="text-6xl drop-shadow-md" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>
        {icon}
      </span>
      <span className="drop-shadow-sm">{label}</span>
    </button>
  )
}
