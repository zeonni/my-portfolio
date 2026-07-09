import { motion } from 'framer-motion'

const enterTransition = { type: 'spring', stiffness: 300, damping: 30 }

const exitTargets = {
  // '이해했어요': 위로 살짝 빠지며 다음 장으로 전환
  understood: { y: -24, scale: 0.96, opacity: 0 },
  // '모르겠어요': 오답 수첩(우상단) 쪽으로 날아가 흡수
  unknown: { x: 140, y: -160, scale: 0.15, rotate: 20, opacity: 0 },
}

const restPose = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
const enterPose = { opacity: 0, y: 24, scale: 0.98 }

// flyOut이 없으면 새 카드로 등장(enter)하는 실제 카드,
// flyOut이 있으면 직전 카드의 스냅샷을 그 자리에서 날려보내는 오버레이 클론입니다.
export default function WordCard({ word, flyOut, onFlyOutComplete, className = '' }) {
  return (
    <motion.div
      className={`rounded-2xl border border-ink-light bg-paper p-6 shadow-sketch ${className}`}
      initial={flyOut ? restPose : enterPose}
      animate={flyOut ? exitTargets[flyOut] : restPose}
      transition={flyOut === 'unknown' ? { duration: 0.45, ease: 'easeIn' } : flyOut === 'understood' ? { duration: 0.25 } : enterTransition}
      onAnimationComplete={flyOut ? onFlyOutComplete : undefined}
    >
      <h2 className="text-2xl font-bold text-gray-900">{word.word}</h2>

      <div className="mt-4 rounded-lg bg-primary-50 px-4 py-3">
        <p className="text-lg font-semibold leading-snug text-primary-800">
          {word.summary_analogy}
        </p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-dark">{word.full_definition}</p>
    </motion.div>
  )
}
