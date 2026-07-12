import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import CategoryGrid from '../components/onboarding/CategoryGrid'
import { fetchWords } from '../api/generateWords'

// 화면 1 · 온보딩 및 카테고리 선택
export default function OnboardingPage() {
  const seenWords = useAppStore((s) => s.seenWords)
  const isLoading = useAppStore((s) => s.isLoading)
  const error = useAppStore((s) => s.error)
  const setSelectedCategories = useAppStore((s) => s.setSelectedCategories)
  const setLoading = useAppStore((s) => s.setLoading)
  const setError = useAppStore((s) => s.setError)
  const startLearning = useAppStore((s) => s.startLearning)

  const [selected, setSelected] = useState([])

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))

  const handleStart = async () => {
    if (selected.length === 0 || isLoading) return
    setSelectedCategories(selected)
    setLoading(true)
    try {
      const words = await fetchWords(selected, seenWords)
      startLearning(words)
    } catch {
      setError('잠시 오류가 발생했어요. 다시 버튼을 눌러 주세요.')
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary">일일오따</h1>
        <p className="mt-2 text-sm text-ink-dark">하루 5단어로 시작하는 경제공부, 카테고리를 골라주세요!</p>
      </header>

      <CategoryGrid selected={selected} onToggle={toggle} />

      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleStart}
        disabled={selected.length === 0 || isLoading}
        className="mt-8 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? '오늘의 단어를 준비하고 있어요...' : '오늘의 단어 받기'}
      </button>
    </div>
  )
}
