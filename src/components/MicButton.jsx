export default function MicButton({ isListening, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative rounded-full border-none cursor-pointer text-white text-4xl transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label="Parler"
      style={{
        width: 'calc(4rem + 1.2cm)',
        height: 'calc(4rem + 1.2cm)',
        background: disabled
          ? 'linear-gradient(135deg, #b2bec3, #95a5a6)'
          : isListening
            ? 'linear-gradient(135deg, #e74c3c, #fd79a8)'
            : 'linear-gradient(135deg, #6C5CE7, #a855f7)',
        boxShadow: disabled
          ? '0 4px 12px rgba(0,0,0,0.1)'
          : isListening
            ? '0 6px 30px rgba(231,76,60,0.45)'
            : '0 6px 24px rgba(108,92,231,0.35)',
        animation: isListening ? 'pulse-soft 1s ease-in-out infinite' : 'none',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span role="img" aria-label="microphone">&#x1F3A4;</span>
      {isListening && (
        <>
          <span
            className="absolute inset-0 rounded-full"
            style={{
              border: '3px solid rgba(231,76,60,0.3)',
              animation: 'pulse-soft 1.5s ease-in-out infinite',
            }}
          />
          <span
            className="absolute inset-[-8px] rounded-full"
            style={{
              border: '2px solid rgba(231,76,60,0.15)',
              animation: 'pulse-soft 1.5s ease-in-out infinite 0.3s',
            }}
          />
        </>
      )}
    </button>
  )
}
