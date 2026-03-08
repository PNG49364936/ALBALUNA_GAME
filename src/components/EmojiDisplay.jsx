export default function EmojiDisplay({ emoji }) {
  return (
    <div className="flex justify-center my-4">
      <div
        className="animate-pop-in flex items-center justify-center"
        style={{
          width: 'min(10cm, 85vw)',
          height: 'min(10cm, 85vw)',
          fontSize: 'min(10rem, 30vw)',
          lineHeight: 1,
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: 32,
          backdropFilter: 'blur(8px)',
          border: '3px solid rgba(255,255,255,0.6)',
        }}
      >
        {emoji}
      </div>
    </div>
  )
}
