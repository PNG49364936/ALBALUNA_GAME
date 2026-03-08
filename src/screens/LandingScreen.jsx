import CategoryCard from '../components/CategoryCard'

export default function LandingScreen({ onSelectCategory }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 relative" style={{ zIndex: 1 }}>
      {/* Title */}
      <div className="animate-slide-up text-center" style={{ marginTop: '-2cm', marginBottom: '3cm' }}>
        <h1
          className="text-5xl md:text-6xl font-extrabold tracking-tight mb-3"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-ink)',
            textShadow: '0 2px 0 rgba(0,0,0,0.05)',
          }}
        >
          <span className="inline-block animate-float" style={{ animationDelay: '0s' }}>&#x1F308;</span>
          {' '}D&eacute;couverte{' '}
          <span className="inline-block animate-float" style={{ animationDelay: '0.5s' }}>&#x2728;</span>
        </h1>
        <p
          className="text-lg font-semibold animate-slide-up"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-ink-light)',
            animationDelay: '200ms',
          }}
        >
          Choisis ce que tu veux apprendre !
        </p>
      </div>

      {/* Category cards */}
      <div className="flex flex-wrap gap-6 justify-center max-w-3xl">
        <CategoryCard
          icon="&#x1F3A8;"
          label="Couleurs"
          gradient="linear-gradient(135deg, #FF6B6B, #ee5a24)"
          onClick={() => onSelectCategory('colors')}
          delay={100}
        />
        <CategoryCard
          icon="&#x1F981;"
          label="Animaux"
          gradient="linear-gradient(135deg, #4ECDC4, #0abde3)"
          onClick={() => onSelectCategory('animals')}
          delay={250}
        />
        <CategoryCard
          icon="&#x1F34E;"
          label="Fruits & L&eacute;gumes"
          gradient="linear-gradient(135deg, #FFD93D, #e67e22)"
          onClick={() => onSelectCategory('fruits')}
          delay={400}
        />
      </div>

      {/* Footer */}
      <p
        className="mt-16 text-xs font-medium animate-slide-up"
        style={{
          color: 'var(--color-ink-light)',
          animationDelay: '600ms',
          fontFamily: 'var(--font-body)',
        }}
      >
       
      </p>
    </div>
  )
}
