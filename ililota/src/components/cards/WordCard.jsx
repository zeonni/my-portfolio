import { motion } from 'framer-motion'
import { CATEGORIES } from '../../constants/categories'

const transition = { duration: 0.2, ease: 'easeOut' }

const exitTargets = {
  // '이해했어요': 오른쪽으로 카드만 슬라이드 아웃
  understood: { x: 80, opacity: 0 },
  // '모르겠어요': 왼쪽으로 카드만 슬라이드 아웃
  unknown: { x: -80, opacity: 0 },
}

const restPose = { opacity: 1, x: 0 }
const enterPose = { opacity: 0, x: 0 }

// flyOut이 없으면 새 카드로 등장(enter)하는 실제 카드,
// flyOut이 있으면 직전 카드의 스냅샷을 그 자리에서 날려보내는 오버레이 클론입니다.
export default function WordCard({ word, flyOut, onFlyOutComplete, className = 'relative' }) {
  const category = CATEGORIES.find((c) => c.id === word.category)

  return (
    <motion.div
      className={className}
      initial={flyOut ? restPose : enterPose}
      animate={flyOut ? exitTargets[flyOut] : restPose}
      transition={transition}
      onAnimationComplete={flyOut ? onFlyOutComplete : undefined}
    >
      {/* 테이프로 붙인 듯한 장식 */}
      <div className="absolute -top-2 left-8 h-6 w-16 -rotate-6 rounded-sm bg-white/60 ring-1 ring-black/5" />

      <div className="newsprint-texture drop-shadow-sketch flex h-[380px] flex-col overflow-y-auto p-6">
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
