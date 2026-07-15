import { FileX } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

// 오답노트로 이동하는 플로팅 버튼. 카드 영역 오른쪽 아래에 떠 있으며,
// 하단 액션 버튼(이해했어요/모르겠어요)과 겹치지 않도록 항상 그 위쪽에 배치합니다.
export default function FloatingReviewButton({ count, onClick, className = '' }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          type="button"
          onClick={onClick}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          className={`flex flex-col items-center gap-1.5 ${className}`}
        >
          <span className="relative flex">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-200 via-red-300 to-red-400 p-[3px] shadow-md">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-white">
                <FileX size={24} strokeWidth={2} className="text-ink-dark" />
              </span>
            </span>
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white ring-2 ring-white">
              {count}
            </span>
          </span>
          <span className="text-xs font-semibold text-ink-dark">오답노트</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
