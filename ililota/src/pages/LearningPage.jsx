import { useState } from 'react'
import { BookX, RefreshCw } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { CATEGORIES } from '../constants/categories'
import ProgressBar from '../components/cards/ProgressBar'
import WordCard from '../components/cards/WordCard'

// 화면 2 · 카드 학습 화면
export default function LearningPage() {
  const currentWords = useAppStore((s) => s.currentWords)
  const currentIndex = useAppStore((s) => s.currentIndex)
  const selectedCategories = useAppStore((s) => s.selectedCategories)
  const incorrectWords = useAppStore((s) => s.incorrectWords)
  const markUnderstood = useAppStore((s) => s.markUnderstood)
  const markUnknown = useAppStore((s) => s.markUnknown)
  const resetToOnboarding = useAppStore((s) => s.resetToOnboarding)
  const openReview = useAppStore((s) => s.openReview)

  // 방금 넘긴 카드의 스냅샷. 값이 있는 동안 오버레이로 날아가는 모션을 보여줍니다.
  const [flyingCard, setFlyingCard] = useState(null) // { word, type: 'understood' | 'unknown' } | null

  const total = currentWords.length
  const word = currentWords[currentIndex]

  const firstCategory = CATEGORIES.find((c) => c.id === selectedCategories[0])
  const extraCategoryCount = selectedCategories.length - 1

  const handleUnderstood = () => {
    setFlyingCard({ word, type: 'understood' })
    markUnderstood()
  }

  const handleUnknown = () => {
    setFlyingCard({ word, type: 'unknown' })
    markUnknown()
  }

  if (!word) return null

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
      <div className="mb-4 flex items-center justify-between rounded-lg bg-primary-50 py-1.5 pl-3 pr-1.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] leading-none text-ink-dark">선택된 카테고리</span>
          <span className="text-sm font-medium leading-none text-primary">
            {firstCategory?.sub}
            {extraCategoryCount > 0 && ` +${extraCategoryCount}`}
          </span>
        </div>
        <button
          type="button"
          onClick={resetToOnboarding}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-ink-dark hover:text-primary"
        >
          <RefreshCw size={14} />
          변경
        </button>
      </div>

      <div className="relative my-12 flex flex-1 flex-col justify-center">
        <button
          type="button"
          onClick={openReview}
          disabled={incorrectWords.length === 0}
          className="absolute -top-6 right-0 flex items-center gap-1.5 py-1.5 pl-2.5 pr-3 text-ink-dark hover:text-primary disabled:pointer-events-none disabled:opacity-50"
        >
          <BookX size={16} className="text-red-500" />
          <span className="text-xs font-semibold">오답노트 {incorrectWords.length}</span>
        </button>

        <WordCard key={currentIndex} word={word} />

        {flyingCard && (
          <WordCard
            key={`flying-${currentIndex}`}
            word={flyingCard.word}
            flyOut={flyingCard.type}
            onFlyOutComplete={() => setFlyingCard(null)}
            className="absolute inset-0 top-0"
          />
        )}
      </div>

      <div className="mt-8">
        <ProgressBar current={currentIndex + 1} total={total} />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleUnknown}
          disabled={flyingCard !== null}
          className="flex-1 rounded-xl border-2 border-ink-light py-4 font-semibold text-ink-dark transition hover:border-ink disabled:cursor-default"
        >
          모르겠어요
        </button>
        <button
          type="button"
          onClick={handleUnderstood}
          disabled={flyingCard !== null}
          className="flex-1 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600 disabled:cursor-default"
        >
          이해했어요
        </button>
      </div>
    </div>
  )
}
