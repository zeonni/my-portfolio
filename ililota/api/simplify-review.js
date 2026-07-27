// Vercel Serverless Function
// 오답노트 팝업에서 '여전히 어려워요'를 눌렀을 때, 기존 복습 설명보다
// 한 단계 더 쉬운 설명으로 다시 생성합니다.
// GEMINI_API_KEY는 Vercel 프로젝트 환경변수로만 보관되어 클라이언트에 노출되지 않습니다.

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary_analogy: { type: 'STRING' },
    review_detail: { type: 'STRING' },
  },
  required: ['summary_analogy', 'review_detail'],
}

function buildPrompt(word, previousSummary, previousDetail) {
  return `너는 20~30대 사회초년생에게 경제 용어를 설명하는 해설가야.
아래 단어를 방금 전에 한 번 쉽게 설명했는데, 사용자가 그 설명을 읽고도 "여전히 어려워요"를 눌렀어. 지금보다 훨씬 더 쉬운 설명이 필요해.

단어: ${word}

이전 요약 비유: ${previousSummary}
이전 복습 설명: ${previousDetail}

규칙:
- 이전 설명과 완전히 똑같은 문장을 반복하지 말고, 더 쉬운 단어와 더 친숙한 비유로 처음부터 다시 설명할 것
- 초등학교 저학년도 혼자 읽고 이해할 수 있을 정도로 쉬운 말만 사용할 것. 한자어·학술 용어 금지
- 지금 설명하는 단어 하나를 빼고는 '증권사', '수수료', '계좌', '매수/매도', '차익', '이자율' 같은 다른 경제 용어를 절대 쓰지 말 것. 그런 개념이 필요하면 '주식을 사고파는 회사', '빌려 쓴 대가로 주는 돈'처럼 매번 풀어서 설명할 것
- summary_analogy: 1문장짜리, 이전보다 더 단순하고 직관적인 일상 비유
- review_detail: 구체적인 숫자나 상황을 최소 1개 포함한 4~6문장. 짧고 쉬운 문장 위주로, 친근한 말투로 쓸 것`
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { word, summary_analogy, review_detail } = req.body ?? {}

  if (!word || !summary_analogy || !review_detail) {
    res.status(400).json({ error: 'word, summary_analogy, review_detail이 필요합니다.' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.' })
    return
  }

  const prompt = buildPrompt(word, summary_analogy, review_detail)

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 1,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            thinkingConfig: { thinkingBudget: 0 },
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      res.status(502).json({ error: `Gemini API 오류: ${errText}` })
      return
    }

    const data = await geminiRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      res.status(502).json({ error: 'Gemini API가 빈 응답을 반환했습니다.' })
      return
    }

    const parsed = JSON.parse(text)

    if (!parsed.summary_analogy || !parsed.review_detail) {
      res.status(502).json({ error: 'Gemini API 응답 형식이 올바르지 않습니다.' })
      return
    }

    res.status(200).json(parsed)
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : '알 수 없는 오류' })
  }
}
