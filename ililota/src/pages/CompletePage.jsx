import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import ReviewListItem from '../components/review/ReviewListItem'
import ReviewModal from '../components/review/ReviewModal'
import CelebrationScreen from '../components/celebration/CelebrationScreen'
import { simplifyReview } from '../api/simplifyReview'

// 화면 3 · 완료 축하 및 오답노트 화면
export default function CompletePage() {
  const incorrectWords = useAppStore((s) => s.incorrectWords)
  const removeIncorrectWord = useAppStore((s) => s.removeIncorrectWord)
  const updateIncorrectWordExplanation = useAppStore((s) => s.updateIncorrectWordExplanation)
  const closeReview = useAppStore((s) => s.closeReview)
  const resetToOnboarding = useAppStore((s) => s.resetToOnboarding)
  const streak = useAppStore((s) => s.streak)
  const sessionJustCompleted = useAppStore((s) => s.sessionJustCompleted)
  const incrementMoreStudyClicks = useAppStore((s) => s.incrementMoreStudyClicks)

  // 오답노트 복습 세션 상태
  const [reviewQueue, setReviewQueue] = useState([])
  const [reviewIndex, setReviewIndex] = useState(0)
  const [phase, setPhase] = useState(null) // null | 'reviewing' | 'empty' | 'restart-prompt'

  const currentWord = phase === 'reviewing' ? reviewQueue[reviewIndex] : null

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
    removeIncorrectWord(currentWord.word)
    advance()
  }

  // 재생성은 백그라운드에서 처리하고 즉시 다음 단어로 넘어가, 사용자가 대기를 느끼지 않게 합니다.
  const handleStillHard = () => {
    const word = currentWord
    advance()
    simplifyReview(word.word, word.summary_analogy, word.review_detail ?? word.full_definition)
      .then(({ summary_analogy, review_detail }) => {
        updateIncorrectWordExplanation(word.word, { summary_analogy, review_detail })
      })
      .catch(() => {})
  }

  const handleRestartYes = () => {
    setReviewQueue(useAppStore.getState().incorrectWords)
    setReviewIndex(0)
    setPhase('reviewing')
  }

  const handleCloseModal = () => setPhase(null)

  const handleGoHome = () => {
    setPhase(null)
    resetToOnboarding()
  }

  // 카드 5장을 막 끝낸 경우, 오답노트로 넘어가지 않고 완료 화면을 계속 보여줌.
  // (오답노트 아이콘으로 중간에 들어온 경우는 sessionJustCompleted가 false라 바로 아래 오답노트 화면으로 진입)
  if (sessionJustCompleted) {
    return <CelebrationScreen streak={streak} onMoreStudy={incrementMoreStudyClicks} />
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
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
        onClick={closeReview}
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
        onRestartNo={handleCloseModal}
        onClose={handleCloseModal}
      />
    </div>
  )
}
