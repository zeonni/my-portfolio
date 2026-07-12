import { motion } from 'framer-motion'
import { CATEGORIES } from '../../constants/categories'

const enterTransition = { type: 'spring', stiffness: 300, damping: 30 }

const exitTargets = {
  // '이해했어요': 위로 살짝 빠지며 다음 장으로 전환
  understood: { y: -24, scale: 0.96, opacity: 0, rotate: 0 },
  // '모르겠어요': 오답 수첩(우상단) 쪽으로 날아가 흡수
  unknown: { x: 140, y: -160, scale: 0.15, rotate: 20, opacity: 0 },
}

const restPose = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
const enterPose = { opacity: 0, y: 24, scale: 0.98, rotate: 0 }

// flyOut이 없으면 새 카드로 등장(enter)하는 실제 카드,
// flyOut이 있으면 직전 카드의 스냅샷을 그 자리에서 날려보내는 오버레이 클론입니다.
export default function WordCard({ word, flyOut, onFlyOutComplete, className = '' }) {
  const category = CATEGORIES.find((c) => c.id === word.category)

  return (
    <motion.div
      className={`relative ${className}`}
      initial={flyOut ? restPose : enterPose}
      animate={flyOut ? exitTargets[flyOut] : restPose}
      transition={flyOut === 'unknown' ? { duration: 0.45, ease: 'easeIn' } : flyOut === 'understood' ? { duration: 0.25 } : enterTransition}
      onAnimationComplete={flyOut ? onFlyOutComplete : undefined}
    >
      {/* 테이프로 붙인 듯한 장식 */}
      <div className="absolute -top-2 left-8 h-6 w-16 -rotate-6 rounded-sm bg-white/60 ring-1 ring-black/5" />

      <div className="newsprint-texture drop-shadow-sketch p-6">
        {category && (
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-dark">
            <span>{category.emoji}</span>
            <span>{category.sub}</span>
          </div>
        )}

        <h2 className="border-y-2 border-gray-800 py-3 text-center font-hand text-3xl font-bold text-gray-900">
          {word.word}
        </h2>

        <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3">
          <p className="text-lg font-semibold leading-snug text-gray-700">
            {word.summary_analogy}
          </p>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-ink-dark">{word.full_definition}</p>
      </div>
    </motion.div>
  )
}
