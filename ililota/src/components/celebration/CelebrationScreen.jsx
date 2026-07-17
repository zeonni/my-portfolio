import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ConfettiBurst from './ConfettiBurst'

// 다음 학습은 로컬 자정(lastCompletedDate가 바뀌는 시점)에 열리므로,
// 그때까지 남은 시간을 계산합니다.
function getMsUntilNextSession() {
  const now = new Date()
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return nextMidnight - now
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

// 카드 5장 완료 후 오답노트로 넘어가지 않고 계속 유지되는 완료 화면.
// '더 공부하고 싶어요'는 화면 전환 없이 추가 학습 의지 측정용 클릭 수만 집계합니다.
export default function CelebrationScreen({ streak, onMoreStudy }) {
  const [justClicked, setJustClicked] = useState(false)
  const [remainingMs, setRemainingMs] = useState(getMsUntilNextSession)

  useEffect(() => {
    const timer = setInterval(() => setRemainingMs(getMsUntilNextSession()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleMoreStudy = () => {
    onMoreStudy()
    setJustClicked(true)
    setTimeout(() => setJustClicked(false), 1600)
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center">
      <ConfettiBurst />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10"
      >
        <p className="text-2xl font-bold text-gray-900">오늘의 학습 완료!</p>
        <p className="mt-3 text-lg font-semibold text-primary">
          현재 {streak}일 연속 성공 중입니다. 🔥
        </p>
        <p className="mt-2 text-sm text-ink-dark">내일도 이 기록을 깨지 말고 이어가세요!</p>

        <p className="mt-4 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-medium text-primary-800">
          다음 학습까지 {formatCountdown(remainingMs)} 남았어요
        </p>

        <button
          type="button"
          onClick={handleMoreStudy}
          className="mt-8 rounded-xl border-2 border-primary px-8 py-3 font-semibold text-primary transition hover:bg-primary-50"
        >
          더 공부하고 싶어요
        </button>

        <div className="mt-3 h-5">
          <AnimatePresence>
            {justClicked && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-ink-dark"
              >
                의견 감사해요! 곧 더 많은 학습을 준비할게요.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
