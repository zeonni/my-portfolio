import { useAppStore } from '../store/useAppStore'
import AccordionItem from '../components/review/AccordionItem'

// 화면 3 · 완료 및 오답노트 화면
export default function CompletePage() {
  const incorrectWords = useAppStore((s) => s.incorrectWords)
  const removeIncorrectWord = useAppStore((s) => s.removeIncorrectWord)
  const resetToOnboarding = useAppStore((s) => s.resetToOnboarding)

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-xl font-bold text-primary">오늘의 뉴스 스크랩 완료!</h1>
        <p className="mt-2 text-sm text-ink-dark">5장의 카드를 모두 확인했어요</p>
      </header>

      <section className="flex-1">
        <h2 className="mb-3 text-sm font-semibold text-ink-dark">내가 헷갈린 용어 복습하기</h2>

        {incorrectWords.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink-light px-4 py-8 text-center text-sm text-ink">
            오답노트가 비어있어요. 완벽했네요!
          </p>
        ) : (
          <div className="space-y-2">
            {incorrectWords.map((word) => (
              <AccordionItem key={word.word} word={word} onMaster={removeIncorrectWord} />
            ))}
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={resetToOnboarding}
        className="mt-8 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600"
      >
        다른 카테고리 공부하기
      </button>
    </div>
  )
}
