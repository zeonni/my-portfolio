import { motion } from 'framer-motion'

export default function ProgressBar({ current, total }) {
  const pct = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-light">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>
      <span className="whitespace-nowrap text-xs font-medium text-ink">
        {current}/{total}
      </span>
    </div>
  )
}
