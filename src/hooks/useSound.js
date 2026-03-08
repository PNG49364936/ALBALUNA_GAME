import { useCallback, useRef, useEffect } from 'react'

const AudioContext = window.AudioContext || window.webkitAudioContext

function createBeep(ctx, freq, duration, type = 'sine', gain = 0.3) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.value = gain
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export function useSound() {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const playCorrect = useCallback(() => {
    const ctx = getCtx()
    createBeep(ctx, 523, 0.15, 'sine', 0.2)
    setTimeout(() => createBeep(ctx, 659, 0.15, 'sine', 0.2), 150)
    setTimeout(() => createBeep(ctx, 784, 0.3, 'sine', 0.25), 300)
  }, [getCtx])

  const playWrong = useCallback(() => {
    const ctx = getCtx()
    createBeep(ctx, 200, 0.3, 'square', 0.1)
    setTimeout(() => createBeep(ctx, 180, 0.3, 'square', 0.1), 200)
  }, [getCtx])

  const playClick = useCallback(() => {
    const ctx = getCtx()
    createBeep(ctx, 800, 0.05, 'sine', 0.15)
  }, [getCtx])

  const playReveal = useCallback(() => {
    const ctx = getCtx()
    createBeep(ctx, 330, 0.2, 'triangle', 0.15)
    setTimeout(() => createBeep(ctx, 440, 0.2, 'triangle', 0.15), 200)
    setTimeout(() => createBeep(ctx, 330, 0.3, 'triangle', 0.15), 400)
  }, [getCtx])

  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close()
      }
    }
  }, [])

  return { playCorrect, playWrong, playClick, playReveal }
}
