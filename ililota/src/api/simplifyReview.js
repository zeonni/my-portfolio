// 오답노트 팝업의 '여전히 어려워요' 버튼에서 사용합니다.
// 입력: word, 현재 summary_analogy, 현재 review_detail
// 출력: { summary_analogy, review_detail } (더 쉬운 버전)
export async function simplifyReview(word, summaryAnalogy, reviewDetail) {
  const res = await fetch('/api/simplify-review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      word,
      summary_analogy: summaryAnalogy,
      review_detail: reviewDetail,
    }),
  })

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error('더 쉬운 설명을 불러오지 못했습니다.')
  }

  if (!res.ok) {
    throw new Error(data?.error ?? '더 쉬운 설명을 불러오지 못했습니다.')
  }

  return data
}
