import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import confetti from 'canvas-confetti'

const FIREWORKS_URL = 'https://assets2.lottiefiles.com/packages/lf20_u4yrau.json'

export default function Fireworks({ fire }) {
  const [animationData, setAnimationData] = useState(null)
  const [show, setShow] = useState(false)

  // Preload Lottie animation
  useEffect(() => {
    fetch(FIREWORKS_URL)
      .then(r => r.json())
      .then(setAnimationData)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!fire) return

    setShow(true)

    // Canvas confetti burst
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#FDCB6E', '#fd79a8']
    confetti({ particleCount: 100, spread: 120, origin: { y: 0.55 }, colors, startVelocity: 40 })

    const duration = 2200
    const end = Date.now() + duration
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()

    const timer = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timer)
  }, [fire])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none flex items-center justify-center"
      style={{ zIndex: 100 }}
    >
      {animationData && (
        <Lottie
          animationData={animationData}
          loop={false}
          autoplay
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        />
      )}
    </div>
  )
}
