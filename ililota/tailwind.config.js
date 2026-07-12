/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 신뢰감을 주는 프라이머리 블루 (포인트 컬러)
        primary: {
          DEFAULT: '#012FFE',
          50: '#F0F3FF',
          100: '#DBE2FF',
          200: '#B3C1FF',
          300: '#859BFF',
          400: '#4D6DFE',
          500: '#1F48FE',
          600: '#012FFE',
          700: '#012FFE', // brand base
          800: '#0126CB',
          900: '#011D9D',
        },
        // 카드/일러스트용 손그림 라인 그레이
        ink: {
          light: '#E5E7EB',
          DEFAULT: '#9CA3AF',
          dark: '#4B5563',
        },
        paper: '#FFFFFF',
        // 손그림 신문지 카드용 누런 종이 톤
        newsprint: {
          DEFAULT: '#F7EFDA',
          dark: '#EFE3C4',
        },
      },
      fontFamily: {
        // 고딕(Sans-serif) 계열, Pretendard 우선
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
        // 손글씨 느낌, 신문지 카드 제목/포인트용
        hand: ['Gaegu', 'cursive'],
      },
      dropShadow: {
        // 손그림 저널 카드용 미세한 스케치 그림자 (clip-path로 잘린 모서리를 따라가도록 drop-shadow 사용)
        sketch: '2px 3px 0px rgba(75, 85, 99, 0.35)',
      },
    },
  },
  plugins: [],
}
