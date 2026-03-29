import { describe, it, expect } from 'vitest'

// Re-implement the functions here to test them in isolation
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
  if (allAccepted.some(a => clean.includes(a))) return true

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

describe('checkAnswer - exact matches', () => {
  it('accepts exact name', () => {
    expect(checkAnswer('marron', { name: 'marron', alt: [] })).toBe(true)
  })

  it('accepts alt variant', () => {
    expect(checkAnswer('brun', { name: 'marron', alt: ['brun', 'brune'] })).toBe(true)
  })

  it('accepts name within a sentence', () => {
    expect(checkAnswer("c'est du marron", { name: 'marron', alt: [] })).toBe(true)
  })
})

describe('checkAnswer - Levenshtein tolerance', () => {
  it('"marrant" matches "marron" (distance 2)', () => {
    expect(checkAnswer('marrant', { name: 'marron', alt: [] })).toBe(true)
  })

  it('"maron" matches "marron" (distance 1)', () => {
    expect(checkAnswer('maron', { name: 'marron', alt: [] })).toBe(true)
  })

  it('"ver" matches "vert" (distance 1, short word)', () => {
    expect(checkAnswer('ver', { name: 'vert', alt: [] })).toBe(true)
  })

  it('"poison" matches "poisson" (distance 1)', () => {
    expect(checkAnswer('poison', { name: 'poisson', alt: [] })).toBe(true)
  })

  it('"elefant" matches "éléphant" (after normalize)', () => {
    expect(checkAnswer('elefant', { name: 'éléphant', alt: [] })).toBe(true)
  })

  it('"raison" matches "raisin" (distance 1)', () => {
    expect(checkAnswer('raison', { name: 'raisin', alt: [] })).toBe(true)
  })

  it('"chanpignon" matches "champignon" (distance 1)', () => {
    expect(checkAnswer('chanpignon', { name: 'champignon', alt: [] })).toBe(true)
  })

  it('"grenouie" matches "grenouille" (distance 2)', () => {
    expect(checkAnswer('grenouie', { name: 'grenouille', alt: [] })).toBe(true)
  })
})

describe('checkAnswer - rejects wrong answers', () => {
  it('"bleu" does not match "rouge"', () => {
    expect(checkAnswer('bleu', { name: 'rouge', alt: [] })).toBe(false)
  })

  it('"chat" does not match "cheval"', () => {
    expect(checkAnswer('chat', { name: 'cheval', alt: [] })).toBe(false)
  })

  it('"pomme" does not match "poire"', () => {
    expect(checkAnswer('pomme', { name: 'poire', alt: [] })).toBe(false)
  })

  it('"banane" does not match "carotte"', () => {
    expect(checkAnswer('banane', { name: 'carotte', alt: [] })).toBe(false)
  })
})

describe('checkAnswer - words within phrases', () => {
  it('"c\'est marrant" matches marron via Levenshtein', () => {
    expect(checkAnswer("c'est marrant", { name: 'marron', alt: [] })).toBe(true)
  })

  it('"je pense que c\'est un lien" matches lion', () => {
    expect(checkAnswer("je pense que c'est un lien", { name: 'lion', alt: ['lien'] })).toBe(true)
  })
})
