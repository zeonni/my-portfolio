import { useState } from 'react'
import { BookMarked } from 'lucide-react'
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

  // 방금 넘긴 카드의 스냅샷. 값이 있는 동안 오버레이로 날아가는 모션을 보여줍니다.
  const [flyingCard, setFlyingCard] = useState(null) // { word, type: 'understood' | 'unknown' } | null

  const total = currentWords.length
  const word = currentWords[currentIndex]

  const categoryLabel = selectedCategories
    .map((id) => CATEGORIES.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .join(' · ')

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
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-primary">{categoryLabel}</span>
        <button
          type="button"
          onClick={resetToOnboarding}
          className="text-sm text-ink-dark underline decoration-ink-light underline-offset-4 hover:text-primary"
        >
          카테고리 변경
        </button>
      </div>

      <ProgressBar current={currentIndex + 1} total={total} />

      <div className="relative mt-10 flex-1">
        <div className="pointer-events-none absolute -top-6 right-0 flex items-center gap-1 text-ink">
          <BookMarked size={18} />
          <span className="text-xs font-medium">{incorrectWords.length}</span>
        </div>

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

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={handleUnknown}
          disabled={flyingCard !== null}
          className="flex-1 rounded-xl border-2 border-ink-light py-4 font-semibold text-ink-dark transition hover:border-ink disabled:opacity-50"
        >
          모르겠어요
        </button>
        <button
          type="button"
          onClick={handleUnderstood}
          disabled={flyingCard !== null}
          className="flex-1 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50"
        >
          이해했어요
        </button>
      </div>
    </div>
  )
}
