import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 화면 흐름: onboarding -> learning -> complete
export const STAGE = {
  ONBOARDING: 'onboarding',
  LEARNING: 'learning',
  COMPLETE: 'complete',
}

// 로컬 타임존 기준 'YYYY-MM-DD' 키 (연속 학습일 계산용)
function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ---- 화면 전이 (비영속) ----
      stage: STAGE.ONBOARDING,

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

      // '오답노트 닫기' -> 카드 화면으로 복귀 (진행 상태 유지)
      closeReview: () => set({ stage: STAGE.LEARNING }),

      // 학습 화면에서 오답노트 아이콘 클릭 -> 5단어를 다 풀지 않아도 오답노트 화면으로 이동
      openReview: () => set({ stage: STAGE.COMPLETE }),
    }),
    {
      name: 'ililota-storage', // LocalStorage key
      // 화면 전이/로딩 등 휘발성 상태는 저장하지 않고, PRD 7의 필드만 영속화
      partialize: (state) => ({
        selectedCategories: state.selectedCategories,
        seenWords: state.seenWords,
        incorrectWords: state.incorrectWords,
        streak: state.streak,
        lastCompletedDate: state.lastCompletedDate,
        moreStudyClickCount: state.moreStudyClickCount,
      }),
    }
  )
)
