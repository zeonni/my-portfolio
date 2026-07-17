import { useEffect, useState } from 'react'
import { useAppStore, STAGE } from './store/useAppStore'
import WelcomePage from './pages/WelcomePage'
import OnboardingPage from './pages/OnboardingPage'
import LearningPage from './pages/LearningPage'
import CompletePage from './pages/CompletePage'
import FeedbackPage from './pages/FeedbackPage'
import BottomNav from './components/nav/BottomNav'
import { trackPageView } from './lib/analytics'

const SCREEN_NAMES = {
  [STAGE.WELCOME]: 'Welcome',
  [STAGE.ONBOARDING]: 'Onboarding',
  [STAGE.LEARNING]: 'Learning',
  [STAGE.COMPLETE]: 'Complete',
}

function StudyTab() {
  const stage = useAppStore((s) => s.stage)

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

export default function App() {
  const stage = useAppStore((s) => s.stage)
  const [activeTab, setActiveTab] = useState('study')

  useEffect(() => {
    const screenName = activeTab === 'feedback' ? 'Feedback' : (SCREEN_NAMES[stage] ?? stage)
    trackPageView(screenName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, stage])

  return (
    <>
      {activeTab === 'feedback' ? <FeedbackPage /> : <StudyTab />}
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </>
  )
}
