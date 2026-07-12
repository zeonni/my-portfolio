import { motion } from 'framer-motion'

// 진행률을 숫자(n/total) 대신, 카드 개수만큼의 점으로 표시합니다.
// 지나온 카드는 채워진 점, 지금 보는 카드는 크고 진한 점, 남은 카드는 빈 점입니다.
export default function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => {
        const isCurrent = step === current
        const isDone = step < current

        return (
          <motion.span
            key={step}
            layout
            className={`rounded-full ${
              isDone ? 'bg-primary/50' : isCurrent ? 'bg-primary' : 'border-2 border-ink-light bg-transparent'
            }`}
            animate={{ width: isCurrent ? 12 : 8, height: isCurrent ? 12 : 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        )
      })}
    </div>
  )
}
