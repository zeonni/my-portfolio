import { motion } from 'framer-motion'

export default function CategoryCard({ category, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(category.id)}
      aria-pressed={selected}
      className={`relative flex items-center gap-3 overflow-hidden rounded-xl border-2 px-4 py-4 text-left transition-colors ${
        selected ? 'border-primary bg-primary-50/40' : 'border-ink-light hover:border-ink'
      }`}
    >
      <span className="text-2xl">{category.emoji}</span>
      <span className="flex flex-col">
        <span className="font-semibold text-gray-900">{category.label}</span>
        <span className="text-xs text-ink">{category.sub}</span>
      </span>

      {selected && (
        <motion.span
          className="absolute inset-x-3 bottom-1.5 h-1.5 origin-left rounded-full bg-primary/70"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />
      )}
    </button>
  )
}
