export default function ColorDisplay({ hex, name }) {
  const needsBorder = name === 'blanc' || hex === '#F5F5F5'
  return (
    <div className="flex justify-center my-4">
      <div
        className="animate-pop-in rounded-full shadow-2xl"
        style={{
          width: 'min(10cm, 85vw)',
          height: 'min(10cm, 85vw)',
          background: hex,
          border: needsBorder ? '4px solid #e0e0e0' : 'none',
          boxShadow: `0 12px 50px ${hex}55, 0 4px 20px rgba(0,0,0,0.1)`,
        }}
      />
    </div>
  )
}
