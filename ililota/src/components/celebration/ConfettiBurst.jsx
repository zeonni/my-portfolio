import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#012FFE', '#FFD93D', '#6BCB77', '#FF6B6B', '#4D6DFE']

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

// 화면 중앙에서 사방으로 흩어지는 종이 조각 폭죽 연출
export default function ConfettiBurst({ count = 50 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: randomBetween(-160, 160),
        y: randomBetween(-260, 260),
        rotate: randomBetween(-360, 360),
        delay: randomBetween(0, 0.25),
        duration: randomBetween(0.9, 1.6),
        color: COLORS[i % COLORS.length],
        width: randomBetween(6, 11),
        height: randomBetween(8, 14),
      })),
    [count]
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{ width: p.width, height: p.height, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
