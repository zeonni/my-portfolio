import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

// phase: 'reviewing' | 'empty' | 'restart-prompt'
export default function ReviewModal({
  phase,
  word,
  onMaster,
  onStillHard,
  onGoHome,
  onRestartYes,
  onRestartNo,
  onClose,
}) {
  if (!phase) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl bg-paper p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {phase === 'reviewing' && word && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{word.word}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-ink hover:text-primary"
                  aria-label="닫기"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <p className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-800">
                  {word.summary_analogy}
                </p>
                <p className="text-sm leading-relaxed text-ink-dark">
                  {word.review_detail ?? word.full_definition}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onStillHard}
                  className="flex-1 rounded-xl border-2 border-ink-light py-3 font-semibold text-ink-dark transition hover:border-ink"
                >
                  여전히 어려워요
                </button>
                <button
                  type="button"
                  onClick={onMaster}
                  className="flex-1 rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-600"
                >
                  마스터 완료
                </button>
              </div>
            </>
          )}

          {phase === 'empty' && (
            <div className="py-2 text-center">
              <p className="text-base font-semibold leading-relaxed text-gray-900">
                오답노트가 텅 비었어요.
                <br />
                빈 건 노트뿐, 실력은 가득 채워졌어요.
              </p>
              <button
                type="button"
                onClick={onGoHome}
                className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-600"
              >
                홈으로 돌아갈래요
              </button>
            </div>
          )}

          {phase === 'restart-prompt' && (
            <div className="py-2 text-center">
              <p className="text-base font-semibold leading-relaxed text-gray-900">
                아직 복습할 내용이 남아 있어요.
                <br />
                더 쉬운 설명으로 다시 살펴볼까요?
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onRestartNo}
                  className="flex-1 rounded-xl border-2 border-ink-light py-3 font-semibold text-ink-dark transition hover:border-ink"
                >
                  아니오
                </button>
                <button
                  type="button"
                  onClick={onRestartYes}
                  className="flex-1 rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-600"
                >
                  예
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
