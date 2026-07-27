// Apps-in-Toss 빌드는 dist 산출물을 토스 자체 도메인에서 서빙하므로,
// 상대경로 fetch로는 Vercel에 있는 API(Serverless Function)에 닿을 수 없습니다.
// 항상 배포된 Vercel 도메인을 절대 URL로 호출합니다.
export const API_BASE = 'https://ililota.vercel.app'
