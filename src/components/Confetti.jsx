import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function Confetti({ fire }) {
  useEffect(() => {
    if (!fire) return

    const duration = 2000
    const end = Date.now() + duration

    const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#FDCB6E', '#fd79a8']

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    // Initial burst
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors,
      startVelocity: 35,
    })

    frame()
  }, [fire])

  return null
}
