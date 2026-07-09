import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'

export default function AccordionItem({ word, onMaster }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-xl border border-ink-light">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center justify-between px-4 py-3 text-left"
        >
          <span className="font-semibold text-gray-900">{word.word}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-ink" />
          </motion.span>
        </button>
        <button
          type="button"
          onClick={() => onMaster(word.word)}
          className="flex items-center gap-1 border-l border-ink-light px-3 py-3 text-xs font-medium text-ink-dark hover:text-primary"
        >
          <X size={14} />
          마스터 완료
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 border-t border-ink-light px-4 py-3">
              <p className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-800">
                {word.summary_analogy}
              </p>
              <p className="text-sm leading-relaxed text-ink-dark">{word.full_definition}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
