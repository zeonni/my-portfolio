import { BookOpen, MessageCircle } from 'lucide-react'

const TABS = [
  { id: 'study', label: '공부', icon: BookOpen },
  { id: 'feedback', label: '의견', icon: MessageCircle },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-light bg-white">
      <div className="mx-auto flex max-w-md">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition ${
                isActive ? 'text-primary' : 'text-ink'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
