import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 화면 흐름: welcome -> onboarding -> learning -> complete
export const STAGE = {
  WELCOME: 'welcome',
  ONBOARDING: 'onboarding',
  LEARNING: 'learning',
  COMPLETE: 'complete',
}

// 로컬 타임존 기준 'YYYY-MM-DD' 키 (연속 학습일 계산용)
function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 저장된 상태만으로 재접속 시 보여줄 화면을 판단합니다.
// 1) 풀다 만 카드가 있으면(완료 여부와 무관) 이어서 그 카드로,
// 2) 아니고 오늘 이미 완료했다면 완료 화면으로,
// 3) 둘 다 아니면 시작 화면으로.
function resolveStage({ currentWords, currentIndex, lastCompletedDate }) {
  if (currentWords.length > 0 && currentIndex < currentWords.length) return STAGE.LEARNING
  if (lastCompletedDate === dateKey(new Date())) return STAGE.COMPLETE
  return STAGE.WELCOME
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ---- 화면 전이 (비영속) ----
      stage: STAGE.WELCOME,

      // ---- 이번 세션에 AI가 내려준 카드 (비영속) ----
      currentWords: [], // [{ word, summary_analogy, full_definition }]
      currentIndex: 0,
      isLoading: false,
      error: null,

      // ---- LocalStorage 영속 데이터 (PRD 7) ----
      selectedCategories: [],
      seenWords: [], // string[] - 중복 방지용 전체 이력
      incorrectWords: [], // { word, summary_analogy, full_definition }[] - 오답노트
      streak: 0, // 연속 학습일
      lastCompletedDate: null, // 'YYYY-MM-DD' - 마지막으로 5장을 완료한 날
      moreStudyClickCount: 0, // 완료 화면 '더 공부하고 싶어요' 클릭 수 - 추가 학습 의지 측정용

      // ---- 완료 축하 화면 트리거 (비영속) ----
      sessionJustCompleted: false,

      // ---- actions ----
      // 시작 화면 '시작하기' -> 카테고리 선택 화면으로 이동
      enterOnboarding: () => set({ stage: STAGE.ONBOARDING }),

      setSelectedCategories: (categories) => set({ selectedCategories: categories }),

      setLoading: (isLoading) => set({ isLoading, error: null }),
      setError: (error) => set({ error, isLoading: false }),

      // AI 응답(5개 단어)을 받아 학습 화면 진입
      startLearning: (words) =>
        set({
          currentWords: words,
          currentIndex: 0,
          stage: STAGE.LEARNING,
          isLoading: false,
          sessionJustCompleted: false,
        }),

      // '이해했어요' -> seenWords에만 추가 후 다음 카드
      markUnderstood: () => {
        const { currentWords, currentIndex, seenWords } = get()
        const word = currentWords[currentIndex]
        const nextSeen = seenWords.includes(word.word) ? seenWords : [...seenWords, word.word]
        get()._advance(nextSeen)
      },

      // '모르겠어요' -> seenWords + incorrectWords 동시 추가 후 다음 카드
      markUnknown: () => {
        const { currentWords, currentIndex, seenWords, incorrectWords } = get()
        const word = currentWords[currentIndex]
        const nextSeen = seenWords.includes(word.word) ? seenWords : [...seenWords, word.word]
        const nextIncorrect = incorrectWords.some((w) => w.word === word.word)
          ? incorrectWords
          : [...incorrectWords, word]
        get()._advance(nextSeen, nextIncorrect)
      },

      // 내부 전용: 인덱스 진행 및 완료 판정
      _advance: (nextSeen, nextIncorrect) =>
        set((state) => {
          const isLast = state.currentIndex + 1 >= state.currentWords.length
          if (!isLast) {
            return {
              seenWords: nextSeen,
              incorrectWords: nextIncorrect ?? state.incorrectWords,
              currentIndex: state.currentIndex + 1,
            }
          }

          const now = new Date()
          const today = dateKey(now)
          const yesterday = dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
          let nextStreak
          if (state.lastCompletedDate === today) {
            nextStreak = state.streak
          } else if (state.lastCompletedDate === yesterday) {
            nextStreak = state.streak + 1
          } else {
            nextStreak = 1
          }

          return {
            seenWords: nextSeen,
            incorrectWords: nextIncorrect ?? state.incorrectWords,
            // 완료된 세션의 카드 데이터는 더 이상 필요 없음 - 재접속 시 lastCompletedDate로 완료 화면을 판단하므로 비워둠
            currentWords: [],
            currentIndex: 0,
            stage: STAGE.COMPLETE,
            streak: nextStreak,
            lastCompletedDate: today,
            sessionJustCompleted: true,
          }
        }),

      // 완료 화면의 '더 공부하고 싶어요' 클릭 수 집계 (추가 학습 의지 측정용, 클릭해도 화면 전환 없음)
      incrementMoreStudyClicks: () =>
        set((state) => ({ moreStudyClickCount: state.moreStudyClickCount + 1 })),

      // 오답노트에서 '마스터 완료' 클릭 시 개별 삭제
      removeIncorrectWord: (word) =>
        set((state) => ({
          incorrectWords: state.incorrectWords.filter((w) => w.word !== word),
        })),

      // 오답노트에서 '여전히 어려워요' 클릭 시 더 쉬운 설명으로 교체
      updateIncorrectWordExplanation: (word, { summary_analogy, review_detail }) =>
        set((state) => ({
          incorrectWords: state.incorrectWords.map((w) =>
            w.word === word ? { ...w, summary_analogy, review_detail } : w
          ),
        })),

      // '다른 카테고리 공부하기' -> 카테고리 선택 화면으로 리셋 (seen/incorrect는 유지)
      resetToOnboarding: () =>
        set({
          stage: STAGE.ONBOARDING,
          selectedCategories: [],
          currentWords: [],
          currentIndex: 0,
          sessionJustCompleted: false,
        }),

      // '오답노트 닫기' -> 진행 상태에 맞는 화면으로 복귀 (풀다 만 카드 / 완료 화면 / 카테고리 선택)
      closeReview: () =>
        set((state) => {
          const stage = resolveStage(state)
          return { stage, sessionJustCompleted: stage === STAGE.COMPLETE }
        }),

      // 학습 화면에서 오답노트 아이콘 클릭 -> 5단어를 다 풀지 않아도 오답노트 화면으로 이동
      openReview: () => set({ stage: STAGE.COMPLETE }),
    }),
    {
      name: 'ililota-storage', // LocalStorage key
      // 화면 전이 자체는 저장하지 않지만, 재접속 시 어느 화면으로 돌아갈지 판단하려면
      // 풀다 만 카드(currentWords/currentIndex)까지는 영속화가 필요합니다.
      partialize: (state) => ({
        selectedCategories: state.selectedCategories,
        seenWords: state.seenWords,
        incorrectWords: state.incorrectWords,
        streak: state.streak,
        lastCompletedDate: state.lastCompletedDate,
        moreStudyClickCount: state.moreStudyClickCount,
        currentWords: state.currentWords,
        currentIndex: state.currentIndex,
      }),
      // 하이드레이션 결과(로컬스토리지 값 + 초기 상태)를 합칠 때 시작 화면도 함께 결정합니다.
      // (localStorage는 동기 스토리지라 하이드레이션이 스토어 생성 도중 즉시 끝나버리므로,
      //  onRehydrateStorage 콜백에서 모듈 스코프의 useAppStore를 참조하면 TDZ 에러가 납니다.)
      merge: (persistedState, currentState) => {
        const merged = { ...currentState, ...persistedState }
        const stage = resolveStage(merged)
        return { ...merged, stage, sessionJustCompleted: stage === STAGE.COMPLETE }
      },
    }
  )
)
