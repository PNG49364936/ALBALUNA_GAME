const shapes = [
  { size: 180, color: '#FF6B6B', top: '-5%', left: '-8%', delay: '0s', dur: '7s' },
  { size: 140, color: '#4ECDC4', top: '15%', right: '-6%', delay: '1.5s', dur: '8s' },
  { size: 200, color: '#FFD93D', bottom: '-8%', left: '25%', delay: '2.5s', dur: '9s' },
  { size: 100, color: '#6C5CE7', bottom: '15%', right: '8%', delay: '3.5s', dur: '6s' },
  { size: 120, color: '#FDCB6E', top: '60%', left: '5%', delay: '4s', dur: '10s' },
  { size: 80, color: '#74b9ff', top: '40%', right: '15%', delay: '1s', dur: '7.5s' },
]

export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {shapes.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10"
          style={{
            width: s.size,
            height: s.size,
            background: s.color,
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            animation: `float ${s.dur} ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        />
      ))}
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
