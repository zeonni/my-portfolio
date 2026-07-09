import { useAppStore, STAGE } from './store/useAppStore'
import OnboardingPage from './pages/OnboardingPage'
import LearningPage from './pages/LearningPage'
import CompletePage from './pages/CompletePage'

export default function App() {
  const stage = useAppStore((s) => s.stage)

  switch (stage) {
    case STAGE.LEARNING:
      return <LearningPage />
    case STAGE.COMPLETE:
      return <CompletePage />
    case STAGE.ONBOARDING:
    default:
      return <OnboardingPage />
  }
}
