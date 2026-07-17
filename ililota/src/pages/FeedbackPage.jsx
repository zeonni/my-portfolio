import { useState } from 'react'
import { trackEvent } from '../lib/analytics'

// 바텀 메뉴 · 의견 탭
export default function FeedbackPage() {
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const trimmed = message.trim()
    if (!trimmed) return
    trackEvent('Feedback Submitted', { message: trimmed })
    setMessage('')
    setSubmitted(true)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-24 pt-10">
      <header className="mb-8 text-center">
        <h1 className="text-xl font-bold text-primary">의견 보내기</h1>
        <p className="mt-2 text-sm text-ink-dark">서비스에 대해 하고 싶은 말을 자유롭게 남겨주세요.</p>
      </header>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={8}
        placeholder="어떤 점이 좋았는지, 아쉬웠는지, 원하는 기능이 있다면 편하게 적어주세요."
        className="flex-1 resize-none rounded-xl border-2 border-ink-light p-4 text-sm text-gray-900 outline-none transition focus:border-primary"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!message.trim()}
        className="mt-4 rounded-xl bg-primary py-4 font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        보내기
      </button>

      {submitted && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          onClick={() => setSubmitted(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-paper p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold text-gray-900">소중한 의견 감사합니다!</p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-600"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
