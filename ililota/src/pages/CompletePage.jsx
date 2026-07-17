import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { CATEGORIES } from '../constants/categories'
import ReviewListItem from '../components/review/ReviewListItem'
import ReviewModal from '../components/review/ReviewModal'
import FloatingReviewButton from '../components/review/FloatingReviewButton'
import CelebrationScreen from '../components/celebration/CelebrationScreen'
import { simplifyReview } from '../api/simplifyReview'
import { trackEvent } from '../lib/analytics'

// 화면 3 · 완료 축하 및 오답노트 화면
export default function CompletePage() {
  const incorrectWords = useAppStore((s) => s.incorrectWords)
  const removeIncorrectWord = useAppStore((s) => s.removeIncorrectWord)
  const updateIncorrectWordExplanation = useAppStore((s) => s.updateIncorrectWordExplanation)
  const closeReview = useAppStore((s) => s.closeReview)
  const streak = useAppStore((s) => s.streak)
  const sessionJustCompleted = useAppStore((s) => s.sessionJustCompleted)
  const incrementMoreStudyClicks = useAppStore((s) => s.incrementMoreStudyClicks)
  const selectedCategories = useAppStore((s) => s.selectedCategories)

  // 오답노트 복습 세션 상태
  const [reviewQueue, setReviewQueue] = useState([])
  const [reviewIndex, setReviewIndex] = useState(0)
  const [phase, setPhase] = useState(null) // null | 'reviewing' | 'empty' | 'restart-prompt'
  // 축하 화면에서 '오답노트' 영역을 눌러 목록을 미리 보고 싶을 때만 true
  const [revealListFromCelebration, setRevealListFromCelebration] = useState(false)

  // reviewQueue는 큐 순서만 담당하고, 실제 내용은 store에서 실시간으로 가져옵니다.
  // '여전히 어려워요' 응답(더 쉬운 설명)이 늦게 도착해도 반영되도록 하기 위함입니다.
  const queuedWord = phase === 'reviewing' ? reviewQueue[reviewIndex] : null
  const currentWord = queuedWord
    ? incorrectWords.find((w) => w.word === queuedWord.word) ?? queuedWord
    : null

  const advance = () => {
    if (reviewIndex + 1 < reviewQueue.length) {
      setReviewIndex((i) => i + 1)
      return
    }
    const remaining = useAppStore.getState().incorrectWords
    setPhase(remaining.length === 0 ? 'empty' : 'restart-prompt')
  }

  const handleOpenReview = (word) => {
    const startIndex = incorrectWords.findIndex((w) => w.word === word.word)
    const rotated = [...incorrectWords.slice(startIndex), ...incorrectWords.slice(0, startIndex)]
    setReviewQueue(rotated)
    setReviewIndex(0)
    setPhase('reviewing')
  }

  const handleMaster = () => {
    trackEvent('Master Complete Clicked', { word: currentWord.word })
    removeIncorrectWord(currentWord.word)
    advance()
  }

  // 재생성은 백그라운드에서 처리하고 즉시 다음 단어로 넘어가, 사용자가 대기를 느끼지 않게 합니다.
  const handleStillHard = () => {
    trackEvent('Still Hard Clicked', { word: currentWord.word })
    const word = currentWord
    advance()
    simplifyReview(word.word, word.summary_analogy, word.review_detail ?? word.full_definition)
      .then(({ summary_analogy, review_detail }) => {
        updateIncorrectWordExplanation(word.word, { summary_analogy, review_detail })
      })
      .catch(() => {})
  }

  const handleRestartYes = () => {
    trackEvent('Restart Review Clicked', { answer: 'yes' })
    setReviewQueue(useAppStore.getState().incorrectWords)
    setReviewIndex(0)
    setPhase('reviewing')
  }

  const handleRestartNo = () => {
    trackEvent('Restart Review Clicked', { answer: 'no' })
    setPhase(null)
  }

  const handleCloseModal = () => setPhase(null)

  // 오답노트를 다 풀고 '홈으로 돌아갈래요'를 누른 경우:
  // 오늘 카드를 전부 학습한 뒤 들어왔다면 완료 축하 화면으로, 학습을 마치기 전(플로팅 버튼)
  // 들어왔다면 이어서 풀던 카드 화면으로 돌아갑니다. 카테고리 선택 화면으로는 보내지 않습니다.
  const handleGoHome = () => {
    trackEvent('Go Home Clicked')
    setPhase(null)
    if (sessionJustCompleted) {
      setRevealListFromCelebration(false)
    } else {
      closeReview()
    }
  }

  const handleMoreStudy = () => {
    trackEvent('More Study Clicked', { streak })
    incrementMoreStudyClicks()
  }

  const handleOpenReviewFromCelebration = () => {
    trackEvent('Review Note Opened', { source: 'celebration' })
    setRevealListFromCelebration(true)
  }

  // 오늘 학습을 이미 완료한 상태에서 열었던 오답노트라면 완료 축하 화면으로,
  // 아니라면(플로팅 버튼으로 학습 중 들어온 경우) 풀던 카드 화면으로 돌아갑니다.
  const handleCloseReview = () => {
    trackEvent('Review Note Closed')
    if (sessionJustCompleted) {
      setRevealListFromCelebration(false)
    } else {
      closeReview()
    }
  }

  const firstCategory = CATEGORIES.find((c) => c.id === selectedCategories[0])
  const extraCategoryCount = selectedCategories.length - 1

  // 카드 5장을 막 끝낸 경우, 오답노트로 넘어가지 않고 완료 화면을 계속 보여줌.
  // (오답노트 아이콘으로 중간에 들어온 경우는 sessionJustCompleted가 false라 바로 아래 오답노트 화면으로 진입)
  if (sessionJustCompleted && !revealListFromCelebration) {
    return (
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 pb-24 pt-8">
        <div className="mb-4 flex items-center rounded-full border-2 border-primary bg-white px-4 py-2 text-sm">
          <span className="text-ink">선택된 카테고리</span>
          {firstCategory && (
            <span className="ml-1.5 flex items-center gap-1 font-bold text-gray-900">
              <span>{firstCategory.emoji}</span>
              <span>{firstCategory.sub}</span>
            </span>
          )}
          {extraCategoryCount > 0 && <span className="ml-1.5 font-bold text-primary">+{extraCategoryCount}</span>}
        </div>

        <CelebrationScreen streak={streak} onMoreStudy={handleMoreStudy} />

        <FloatingReviewButton
          count={incorrectWords.length}
          onClick={handleOpenReviewFromCelebration}
          className="absolute bottom-8 right-4 z-20"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-24 pt-10">
      <header className="mb-8 text-center">
        <h1 className="text-xl font-bold text-primary">오답노트</h1>
        <p className="mt-2 text-sm text-ink-dark">어려웠던 용어를 다시 복습해 보아요.</p>
      </header>

      <section className="flex-1">
        {incorrectWords.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink-light px-4 py-8 text-center text-sm text-ink">
            오답노트가 비어있어요. 완벽했네요!
          </p>
        ) : (
          <div className="space-y-2">
            {incorrectWords.map((word) => (
              <ReviewListItem key={word.word} word={word} onOpen={handleOpenReview} />
            ))}
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={handleCloseReview}
        className="mt-8 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600"
      >
        오답노트 닫기
      </button>

      <ReviewModal
        phase={phase}
        word={currentWord}
        onMaster={handleMaster}
        onStillHard={handleStillHard}
        onGoHome={handleGoHome}
        onRestartYes={handleRestartYes}
        onRestartNo={handleRestartNo}
        onClose={handleCloseModal}
      />
    </div>
  )
}
