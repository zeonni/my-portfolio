/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 신뢰감을 주는 프라이머리 블루 (포인트 컬러)
        primary: {
          DEFAULT: '#1E40AF',
          50: '#EFF3FC',
          100: '#DCE5F8',
          200: '#B9CBF1',
          300: '#8EABE8',
          400: '#5A7FDA',
          500: '#3357C5',
          600: '#25459E',
          700: '#1E40AF', // brand base
          800: '#182F7D',
          900: '#13245E',
        },
        // 카드/일러스트용 손그림 라인 그레이
        ink: {
          light: '#E5E7EB',
          DEFAULT: '#9CA3AF',
          dark: '#4B5563',
        },
        paper: '#FFFFFF',
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
      },
      boxShadow: {
        // 손그림 저널 카드용 미세한 스케치 그림자
        sketch: '2px 2px 0px 0px rgba(30, 64, 175, 0.15)',
      },
    },
  },
  plugins: [],
}
