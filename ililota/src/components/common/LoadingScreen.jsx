import { motion } from 'framer-motion'

// 단어 생성 API 응답을 기다리는 동안 보여주는 전체 화면 로딩 상태
export default function LoadingScreen({ message = '오늘의 단어를 준비하고 있어요...' }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 pb-24 pt-10 text-center">
      <motion.div
        animate={{ scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="text-2xl"
      >
        📚
      </motion.div>

      <p className="mt-6 text-sm font-medium text-ink-dark">{message}</p>

      <div className="mt-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-primary"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}
