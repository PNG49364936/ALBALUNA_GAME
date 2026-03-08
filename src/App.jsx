import { useState } from 'react'
import FloatingShapes from './components/FloatingShapes'
import LandingScreen from './screens/LandingScreen'
import GameScreen from './screens/GameScreen'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [category, setCategory] = useState(null)

  const handleSelectCategory = (cat) => {
    setCategory(cat)
    setScreen('game')
  }

  const handleBack = () => {
    setCategory(null)
    setScreen('landing')
  }

  return (
    <>
      <FloatingShapes />
      {screen === 'landing' && (
        <LandingScreen onSelectCategory={handleSelectCategory} />
      )}
      {screen === 'game' && category && (
        <GameScreen
          key={category}
          category={category}
          onBack={handleBack}
        />
      )}
    </>
  )
}
