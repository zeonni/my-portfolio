// PRD 6. AI 동작 정의
// 입력: 선택된 카테고리 배열, seenWords(중복 방지 배열)
// 출력: { words: [{ word, summary_analogy, full_definition }] } (5개)
//
// 실제 생성은 /api/generate-words (Vercel Serverless Function)에서 Gemini API를 호출해 처리합니다.
// API 키는 서버 쪽 환경변수로만 보관되어 클라이언트에 노출되지 않습니다.
import { API_BASE } from './config'

export async function fetchWords(selectedCategories, seenWords) {
  const res = await fetch(`${API_BASE}/api/generate-words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categories: selectedCategories, seenWords }),
  })

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error('단어를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
  }

  if (!res.ok) {
    throw new Error(data?.error ?? '단어를 불러오지 못했습니다.')
  }

  return data.words
}
