import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Mock fetch to fail immediately (triggers fallback to Web Speech API)
vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('no network'))))

// Mock Web Speech API
const mockSpeechSpeak = vi.fn()

class MockUtterance {
  constructor(text) {
    this.text = text
    this.lang = ''
    this.rate = 1
    this.pitch = 1
    this.onend = null
    this.onerror = null
  }
}

vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance)
vi.stubGlobal('speechSynthesis', {
  cancel: vi.fn(),
  speak: mockSpeechSpeak,
})

// Suppress console.warn from the fallback
vi.spyOn(console, 'warn').mockImplementation(() => {})

const { speak, useIsSpeaking } = await import('./useSpeech.js')

function getLastUtterance() {
  const calls = mockSpeechSpeak.mock.calls
  if (calls.length === 0) return undefined
  return calls[calls.length - 1][0]
}

beforeEach(() => {
  mockSpeechSpeak.mockClear()
})

describe('useIsSpeaking', () => {
  it('starts as false', () => {
    const { result } = renderHook(() => useIsSpeaking())
    expect(result.current).toBe(false)
  })

  it('becomes true when speak() is called, false when speech ends', async () => {
    const { result } = renderHook(() => useIsSpeaking())

    await act(async () => {
      await speak('Bonjour')
    })

    expect(mockSpeechSpeak).toHaveBeenCalled()
    expect(result.current).toBe(true)

    const utterance = getLastUtterance()
    expect(utterance).toBeDefined()

    act(() => {
      utterance.onend?.()
    })

    expect(result.current).toBe(false)
  })

  it('becomes false on speech error', async () => {
    const { result } = renderHook(() => useIsSpeaking())

    await act(async () => {
      await speak('Erreur test')
    })

    const utterance = getLastUtterance()
    act(() => {
      utterance.onerror?.()
    })

    expect(result.current).toBe(false)
  })

  it('fires callback when speech ends', async () => {
    const cb = vi.fn()

    await act(async () => {
      await speak('Avec callback', cb)
    })

    expect(cb).not.toHaveBeenCalled()

    const utterance = getLastUtterance()
    act(() => {
      utterance.onend?.()
    })

    expect(cb).toHaveBeenCalledOnce()
  })
})

describe('mic blocked during speech', () => {
  it('isSpeaking prevents mic activation, allows after speech ends', async () => {
    const { result } = renderHook(() => useIsSpeaking())

    await act(async () => {
      await speak('Quelle est cette couleur ?')
    })

    // While speaking — mic blocked
    expect(result.current).toBe(true)

    let micActivated = false
    if (!result.current) micActivated = true
    expect(micActivated).toBe(false)

    // Speech ends — mic unblocked
    const utterance = getLastUtterance()
    act(() => {
      utterance.onend?.()
    })

    expect(result.current).toBe(false)
    if (!result.current) micActivated = true
    expect(micActivated).toBe(true)
  })
})
