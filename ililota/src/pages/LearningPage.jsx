import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { CATEGORIES } from '../constants/categories'
import ProgressBar from '../components/cards/ProgressBar'
import WordCard from '../components/cards/WordCard'
import FloatingReviewButton from '../components/review/FloatingReviewButton'
import { trackEvent } from '../lib/analytics'

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
    trackEvent('Understood Clicked', { word: word.word })
    setFlyingCard({ word, type: 'understood' })
    markUnderstood()
  }

  const handleUnknown = () => {
    trackEvent('Unknown Clicked', { word: word.word })
    setFlyingCard({ word, type: 'unknown' })
    markUnknown()
  }

  const handleChangeCategory = () => {
    trackEvent('Change Category Clicked')
    resetToOnboarding()
  }

  const handleOpenReview = () => {
    trackEvent('Review Note Opened', { source: 'learning' })
    openReview()
  }

  if (!word) return null

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
      <div className="mb-4 flex items-center justify-between rounded-full border-2 border-primary bg-white px-4 py-2">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-ink">선택된 카테고리</span>
          {firstCategory && (
            <span className="flex items-center gap-1 font-bold text-gray-900">
              <span>{firstCategory.emoji}</span>
              <span>{firstCategory.sub}</span>
            </span>
          )}
          {extraCategoryCount > 0 && <span className="font-bold text-primary">+{extraCategoryCount}</span>}
        </div>
        <button
          type="button"
          onClick={handleChangeCategory}
          className="flex items-center gap-1 text-sm text-ink hover:text-primary"
        >
          <RefreshCw size={14} />
          변경
        </button>
      </div>

      <div className="relative my-12 flex flex-1 flex-col justify-center">
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

      <FloatingReviewButton
        count={incorrectWords.length}
        onClick={handleOpenReview}
        className="absolute bottom-36 right-4 z-20"
      />

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
