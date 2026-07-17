// Vercel Serverless Function
// PRD 6. AI 동작 정의 - Gemini API를 호출해 카테고리별 용어 5개를 실시간 생성합니다.
// GEMINI_API_KEY는 Vercel 프로젝트 환경변수로만 보관되어 클라이언트에 노출되지 않습니다.

const CATEGORY_LABELS = {
  stock: '주식·펀드 첫걸음 (재테크 기초)',
  realestate: '내 집 마련의 모든 것 (부동산·청약)',
  saving: '월급쟁이 돈 아끼기 (소비·절세)',
  news: '경제 기사 치트키 (시사·뉴스)',
  trend: '코인·NFT·조각투자 (트렌드 금융)',
}

function buildResponseSchema(categoryIds) {
  return {
    type: 'OBJECT',
    properties: {
      words: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            word: { type: 'STRING' },
            category: { type: 'STRING', enum: categoryIds },
            summary_analogy: { type: 'STRING' },
            full_definition: { type: 'STRING' },
            review_detail: { type: 'STRING' },
          },
          required: ['word', 'category', 'summary_analogy', 'full_definition', 'review_detail'],
        },
      },
    },
    required: ['words'],
  }
}

function buildPrompt(categoryEntries, seenWords) {
  const excludeList = seenWords.length > 0 ? seenWords.join(', ') : '(없음)'
  const categoryList = categoryEntries.map(([id, label]) => `${id}: ${label}`).join('\n')

  return `너는 20~30대 사회초년생을 위한 경제·시사 용어 해설가야.
타깃은 경제 뉴스를 챙겨보고 싶지만 어려운 용어 앞에서 막히는 사람들이야. '주식', '부동산', '적금', '대출', '이자', '청약'처럼 이미 다 아는 왕초보 단어는 시시하게 느껴지니 절대 뽑지 마.
아래 카테고리에서, 실제 경제 뉴스나 재테크 콘텐츠에는 자주 나오지만 초심자는 낯설어하는 한 단계 더 심화된 실전 용어 5개를 뽑아줘.
(참고 난이도 예시: LTV, DSR, 기저효과, 스태그플레이션, PER, 배당수익률, 리밸런싱, 예대마진, 서브프라임 모기지 — 이 정도의 낯섦과 구체성을 목표로 할 것)

카테고리 (id: 설명):
${categoryList}

규칙:
- 반드시 다음 목록에 있는 단어는 절대 포함하지 마 (이미 학습함): ${excludeList}
- 카테고리명 자체나 그 카테고리의 가장 기초적인 입문 단어는 금지. 그 카테고리 안에서 한 단계 더 들어간 구체적인 실전 용어를 뽑을 것
- 단어 자체는 어려워도 되지만, 설명은 정반대로 쉬워야 해: 어렵고 딱딱한 한자어·학술적 정의를 절대 쓰지 말고, 일상적인 비유로 풀어서 설명할 것
- category: 그 단어가 위 카테고리 목록 중 어디에 가장 잘 맞는지 id 값 그대로 적을 것 (설명 문구가 아닌 id)
- summary_analogy: 초등학생도 이해할 수 있는 1문장짜리 직관적인 일상 비유 (핵심 비유는 반드시 여기에만)
- full_definition: 비유를 뒷받침하는 2문장 이내의 구어체 개념 해설 (summary_analogy와 내용이 겹치지 않게, 상세 설명은 반드시 여기에만)
- review_detail: 사용자가 '모르겠어요'를 눌러 오답노트에 저장했을 때 나중에 복습용으로 보여줄 심화 설명. 초등학생이 혼자 읽어도 완벽하게 이해되는 쉬운 말로만 쓸 것. full_definition보다 길고 구체적인 예시(숫자나 상황 최소 1개)를 4~6문장으로 풀어 쓰되, 지금 설명하는 단어 하나를 빼고는 '증권사', '수수료', '계좌', '매수/매도', '차익', '이자율' 같은 다른 경제 용어를 절대 쓰지 말 것. 그런 개념이 필요하면 '주식을 사고파는 회사', '빌려 쓴 대가로 주는 돈'처럼 매번 풀어서 설명할 것. 문장도 짧고 쉬운 단어 위주로, 학교 다니는 어린이에게 설명해주듯 친근한 말투로 쓸 것
- 정확히 5개의 서로 다른 용어를 생성할 것`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { categories, seenWords } = req.body ?? {}

  if (!Array.isArray(categories) || categories.length === 0) {
    res.status(400).json({ error: 'categories(배열)가 필요합니다.' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다.' })
    return
  }

  const categoryEntries = categories.map((id) => [id, CATEGORY_LABELS[id] ?? id])
  const excludeWords = Array.isArray(seenWords) ? seenWords : []
  const prompt = buildPrompt(categoryEntries, excludeWords)

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
            responseSchema: buildResponseSchema(categories),
            // gemini-2.5-flash는 기본적으로 "생각하기"에 토큰을 써서 본문이 비거나
            // maxOutputTokens을 넘기기 쉬우므로 즉답 모드로 끕니다.
            thinkingConfig: { thinkingBudget: 0 },
            maxOutputTokens: 3072,
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

    if (!Array.isArray(parsed.words) || parsed.words.length === 0) {
      res.status(502).json({ error: 'Gemini API 응답 형식이 올바르지 않습니다.' })
      return
    }

    res.status(200).json(parsed)
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : '알 수 없는 오류' })
  }
}
