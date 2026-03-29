import { useState, useCallback, useEffect, useRef } from 'react'
import ScoreBar from '../components/ScoreBar'
import AttemptDots from '../components/AttemptDots'
import MicButton from '../components/MicButton'
import Feedback from '../components/Feedback'
import Fireworks from '../components/Fireworks'
import ColorDisplay from '../components/ColorDisplay'
import EmojiDisplay from '../components/EmojiDisplay'
import { useSpeechRecognition, speak, useIsSpeaking } from '../hooks/useSpeech'
import { useSound } from '../hooks/useSound'
import { COLORS } from '../data/colors'
import { ANIMALS } from '../data/animals'
import { FRUITS } from '../data/fruits'

const MAX_ATTEMPTS = 3

const CATEGORIES = {
  colors: {
    items: COLORS,
    question: 'Quelle est cette couleur ?',
    retry: 'Tu t\u2019es tromp\u00e9, dis-moi la couleur !',
    retrySpeech: 'Tu t\u2019es tromp\u00e9, dis-moi la couleur !',
  },
  animals: {
    items: ANIMALS,
    question: 'Quel est cet animal ?',
    retry: 'Tu t\u2019es tromp\u00e9, dis-moi le nom de l\u2019animal !',
    retrySpeech: 'Tu t\u2019es tromp\u00e9, dis-moi le nom de l\u2019animal !',
  },
  fruits: {
    items: FRUITS,
    question: 'Quel est ce fruit ou l\u00e9gume ?',
    retry: 'Tu t\u2019es tromp\u00e9, dis-moi le nom du fruit ou l\u00e9gume !',
    retrySpeech: 'Tu t\u2019es tromp\u00e9, dis-moi le nom du fruit ou l\u00e9gume !',
  },
}

const CATEGORY_COLORS = {
  colors: { accent: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B, #ee5a24)' },
  animals: { accent: '#4ECDC4', gradient: 'linear-gradient(135deg, #4ECDC4, #0abde3)' },
  fruits: { accent: '#FFD93D', gradient: 'linear-gradient(135deg, #FFD93D, #e67e22)' },
}

function pickRandom(arr, exclude) {
  const filtered = exclude ? arr.filter(i => i.name !== exclude.name) : arr
  const pool = filtered.length > 0 ? filtered : arr
  return pool[Math.floor(Math.random() * pool.length)]
}

function normalize(str) {
  return str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function levenshtein(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function extractWords(str) {
  return normalize(str).split(/\s+/).filter(w => w.length > 0)
}

function checkAnswer(transcript, item) {
  const clean = normalize(transcript)
  const allAccepted = [item.name, ...(item.alt || [])].map(normalize)

  // Match exacte (inclus dans la transcription)
  if (allAccepted.some(a => clean.includes(a))) return true

  // Tolérance Levenshtein : on compare chaque mot de la transcription
  // avec chaque variante acceptée (mot principal seulement, pas les articles)
  const spokenWords = extractWords(transcript)
  const targetWords = [normalize(item.name), ...(item.alt || []).map(normalize)]
    .flatMap(a => a.split(/\s+/))
    .filter(w => w.length >= 3 && !['le', 'la', 'un', 'une', 'les', 'des', 'du'].includes(w))
  const uniqueTargets = [...new Set(targetWords)]

  for (const spoken of spokenWords) {
    if (spoken.length < 3) continue
    for (const target of uniqueTargets) {
      const maxDist = target.length <= 5 ? 1 : 2
      if (levenshtein(spoken, target) <= maxDist) return true
    }
  }

  return false
}

export default function GameScreen({ category, onBack }) {
  const { items, question, retry, retrySpeech } = CATEGORIES[category]
  const catColor = CATEGORY_COLORS[category]

  const [currentItem, setCurrentItem] = useState(() => pickRandom(items))
  const [attempts, setAttempts] = useState(0)
  const [score, setScore] = useState(0)
  const [questionNum, setQuestionNum] = useState(1)
  const [feedback, setFeedback] = useState({ type: null, text: '' })
  const [confettiFire, setConfettiFire] = useState(0)
  const [heardText, setHeardText] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const [displayKey, setDisplayKey] = useState(0)

  const { isListening, listen, stop, isSupported } = useSpeechRecognition()
  const { playCorrect, playWrong, playClick, playReveal } = useSound()
  const isSpeaking = useIsSpeaking()

  const prevItemRef = useRef(null)

  const nextRound = useCallback(() => {
    setTransitioning(true)
    setTimeout(() => {
      prevItemRef.current = currentItem
      const next = pickRandom(items, currentItem)
      setCurrentItem(next)
      setAttempts(0)
      setQuestionNum(q => q + 1)
      setFeedback({ type: null, text: '' })
      setHeardText('')
      setDisplayKey(k => k + 1)
      setTransitioning(false)
      speak(question)
    }, 300)
  }, [items, question, currentItem])

  const handleResult = useCallback((transcript) => {
    setHeardText(`J'ai entendu : "${transcript}"`)

    if (checkAnswer(transcript, currentItem)) {
      setScore(s => s + 1)
      setFeedback({ type: 'correct', text: 'Bravo ! \u{1F389}' })
      playCorrect()
      setConfettiFire(f => f + 1)
      speak('Bravo, tu as gagn\u00e9 !', () => {
        setTimeout(nextRound, 600)
      })
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      playWrong()

      if (newAttempts >= MAX_ATTEMPTS) {
        const answer = currentItem.name
        setFeedback({ type: 'reveal', text: `C'est : ${answer} !` })
        playReveal()
        speak(`Ce n'est pas \u00e7a. La bonne r\u00e9ponse est : ${answer}.`, () => {
          setTimeout(nextRound, 1200)
        })
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts
        setFeedback({
          type: 'wrong',
          text: `${retry} (${remaining} essai${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''})`,
        })
        speak(retrySpeech)
      }
    }
  }, [currentItem, attempts, playCorrect, playWrong, playReveal, nextRound])

  const handleMicClick = useCallback(() => {
    if (isSpeaking) return
    playClick()
    listen(handleResult)
  }, [isSpeaking, playClick, listen, handleResult])

  // Speak question on first mount
  useEffect(() => {
    const timer = setTimeout(() => speak(question), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleBack = () => {
    stop()
    speechSynthesis.cancel()
    onBack()
  }

  return (
    <div
      className="flex flex-col items-center h-screen px-4 relative overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <Fireworks fire={confettiFire} />

      {/* Scrollable content area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full overflow-auto">

        {/* Display zone */}
        <div
          className="my-2 transition-all duration-300"
          key={displayKey}
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'scale(0.8)' : 'scale(1)',
          }}
        >
          {category === 'colors' ? (
            <ColorDisplay hex={currentItem.hex} name={currentItem.name} />
          ) : (
            <EmojiDisplay emoji={currentItem.emoji} />
          )}
        </div>

        {/* Question */}
        <p
          className="text-2xl font-bold text-center mb-1 animate-slide-up"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ink)', marginTop: '1cm' }}
        >
          {question} &#x1F914;
        </p>

        {/* Attempt dots */}
        <AttemptDots attempts={attempts} max={MAX_ATTEMPTS} />

        {/* Heard text */}
        <p
          className="text-sm font-bold italic text-center min-h-[24px] mb-1"
          style={{ color: 'var(--color-ink-light)', fontFamily: 'var(--font-body)', marginTop: '0.5cm' }}
        >
          {isListening ? '\u{1F442} \u00c9coute en cours...' : heardText || '\u00a0'}
        </p>

        {/* Feedback */}
        <Feedback type={feedback.type} text={feedback.text} />

        {/* No speech warning */}
        {!isSupported && (
          <div
            className="mt-2 px-6 py-4 rounded-2xl font-bold text-sm text-center max-w-sm"
            style={{
              background: 'rgba(253,203,110,0.3)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-body)',
            }}
          >
            &#x26A0;&#xFE0F; La reconnaissance vocale n'est pas disponible.
            Utilise <strong>Google Chrome</strong> pour la meilleure exp&eacute;rience.
          </div>
        )}
      </div>

      {/* Fixed bottom: Mic at 1.5cm from bottom, Back at 0.5cm from bottom */}
      <div className="w-full flex flex-col items-center shrink-0" style={{ paddingBottom: '0.5cm' }}>
        <div style={{ marginBottom: '1.5cm' }}>
          <MicButton isListening={isListening} disabled={isSpeaking} onClick={handleMicClick} />
        </div>
        <div style={{ marginBottom: '0.5cm' }}>
          <ScoreBar score={score} questionNum={questionNum} />
        </div>
        <button
          onClick={handleBack}
          className="px-6 py-2 rounded-full border-none cursor-pointer font-bold text-sm transition-all duration-200 hover:scale-105"
          style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(8px)',
            color: 'var(--color-ink-light)',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          &#x2B05; Retour au menu
        </button>
      </div>
    </div>
  )
}
