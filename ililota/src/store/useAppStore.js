import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 화면 흐름: onboarding -> learning -> complete
export const STAGE = {
  ONBOARDING: 'onboarding',
  LEARNING: 'learning',
  COMPLETE: 'complete',
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
          return {
            seenWords: nextSeen,
            incorrectWords: nextIncorrect ?? state.incorrectWords,
            currentIndex: isLast ? state.currentIndex : state.currentIndex + 1,
            stage: isLast ? STAGE.COMPLETE : state.stage,
          }
        }),

      // 오답노트에서 '마스터 완료' 클릭 시 개별 삭제
      removeIncorrectWord: (word) =>
        set((state) => ({
          incorrectWords: state.incorrectWords.filter((w) => w.word !== word),
        })),

      // '다른 카테고리 공부하기' -> 카테고리 선택 화면으로 리셋 (seen/incorrect는 유지)
      resetToOnboarding: () =>
        set({
          stage: STAGE.ONBOARDING,
          selectedCategories: [],
          currentWords: [],
          currentIndex: 0,
        }),
    }),
    {
      name: 'ililota-storage', // LocalStorage key
      // 화면 전이/로딩 등 휘발성 상태는 저장하지 않고, PRD 7의 3개 필드만 영속화
      partialize: (state) => ({
        selectedCategories: state.selectedCategories,
        seenWords: state.seenWords,
        incorrectWords: state.incorrectWords,
      }),
    }
  )
)
