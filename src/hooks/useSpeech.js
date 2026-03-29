import { useState, useCallback, useRef, useSyncExternalStore } from 'react'

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY
const VOICE_ID = 'XB0fDUnXU5powFXDhCwa' // Charlotte - voix feminine douce
const MODEL_ID = 'eleven_multilingual_v2'

// Cache audio pour eviter de re-generer les memes phrases
const audioCache = new Map()
let currentAudio = null

// --- Speaking state tracking ---
let _isSpeaking = false
const _speakingListeners = new Set()

function setSpeaking(val) {
  _isSpeaking = val
  _speakingListeners.forEach(fn => fn())
}

function subscribeSpeaking(listener) {
  _speakingListeners.add(listener)
  return () => _speakingListeners.delete(listener)
}

function getSpeakingSnapshot() {
  return _isSpeaking
}

export function useIsSpeaking() {
  return useSyncExternalStore(subscribeSpeaking, getSpeakingSnapshot)
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const isSupported = !!SpeechRecognition

  const listen = useCallback((onResult) => {
    if (!SpeechRecognition || isListening) return
    setIsListening(true)
    setTranscript('')

    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 5
    recognitionRef.current = recognition

    recognition.onresult = (e) => {
      setIsListening(false)
      const text = e.results[0][0].transcript
      setTranscript(text)
      onResult?.(text)
    }

    recognition.onerror = (e) => {
      setIsListening(false)
      if (e.error === 'no-speech') {
        setTranscript("Je n'ai rien entendu...")
      } else {
        setTranscript("Erreur, r\u00e9essaie !")
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }, [SpeechRecognition, isListening])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch (e) { /* ignore */ }
    }
    setIsListening(false)
  }, [])

  return { isListening, transcript, listen, stop, isSupported }
}

export async function speak(text, callback) {
  // Stopper l'audio en cours
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }

  setSpeaking(true)

  const onDone = () => {
    setSpeaking(false)
    callback?.()
  }

  // Si pas de cle API, fallback sur Web Speech API
  if (!ELEVENLABS_API_KEY) {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'fr-FR'
    u.rate = 0.85
    u.pitch = 1.1
    u.onend = onDone
    u.onerror = onDone
    speechSynthesis.cancel()
    speechSynthesis.speak(u)
    return
  }

  try {
    // Verifier le cache
    let audioUrl = audioCache.get(text)

    if (!audioUrl) {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.4,
          },
        }),
      })

      if (!response.ok) throw new Error('ElevenLabs API error')

      const blob = await response.blob()
      audioUrl = URL.createObjectURL(blob)
      audioCache.set(text, audioUrl)
    }

    const audio = new Audio(audioUrl)
    currentAudio = audio
    audio.onended = () => {
      currentAudio = null
      onDone()
    }
    audio.onerror = () => {
      currentAudio = null
      onDone()
    }
    await audio.play()
  } catch (e) {
    // Fallback sur Web Speech API en cas d'erreur
    console.warn('ElevenLabs fallback:', e)
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'fr-FR'
    u.rate = 0.85
    u.pitch = 1.1
    u.onend = onDone
    u.onerror = onDone
    speechSynthesis.cancel()
    speechSynthesis.speak(u)
  }
}
