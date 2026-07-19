import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { trackEvent } from '../lib/analytics'
import { CATEGORIES } from '../constants/categories'

// 화면 0 · 시작 화면
export default function WelcomePage() {
  const enterOnboarding = useAppStore((s) => s.enterOnboarding)

  const handleStart = () => {
    trackEvent('Welcome Start Clicked')
    enterOnboarding()
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 pb-24 pt-10 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <p className="text-sm">{CATEGORIES.map((c) => c.emoji).join(' ')}</p>

        <h1 className="mt-3 font-hand text-4xl font-bold text-primary">일일오따</h1>

        <p className="mt-4 text-sm leading-relaxed text-ink-dark">
          하루 한 번, 5가지 경제 단어를 내 것으로 쏙 따먹기
          <br />
          오늘도 시작해 볼까요?
        </p>
      </motion.div>

      <button
        type="button"
        onClick={handleStart}
        className="mt-10 w-full rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600"
      >
        시작하기
      </button>
    </div>
  )
}
