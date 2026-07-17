import { useEffect } from 'react'
import { useAppStore, STAGE } from './store/useAppStore'
import WelcomePage from './pages/WelcomePage'
import OnboardingPage from './pages/OnboardingPage'
import LearningPage from './pages/LearningPage'
import CompletePage from './pages/CompletePage'
import { trackPageView } from './lib/analytics'

const SCREEN_NAMES = {
  [STAGE.WELCOME]: 'Welcome',
  [STAGE.ONBOARDING]: 'Onboarding',
  [STAGE.LEARNING]: 'Learning',
  [STAGE.COMPLETE]: 'Complete',
}

export default function App() {
  const stage = useAppStore((s) => s.stage)

  useEffect(() => {
    trackPageView(SCREEN_NAMES[stage] ?? stage)
  }, [stage])

  switch (stage) {
    case STAGE.LEARNING:
      return <LearningPage />
    case STAGE.COMPLETE:
      return <CompletePage />
    case STAGE.ONBOARDING:
      return <OnboardingPage />
    case STAGE.WELCOME:
    default:
      return <WelcomePage />
  }
}
