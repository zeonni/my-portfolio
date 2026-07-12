export default function CategoryCard({ category, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(category.id)}
      aria-pressed={selected}
      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-4 text-left transition-colors ${
        selected ? 'border-primary bg-primary-50/40' : 'border-ink-light hover:border-ink'
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
          selected ? 'border-primary bg-primary text-white' : 'border-ink-light'
        }`}
      >
        {selected && (
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
            <path
              d="M3 8.5L6.5 12L13 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <span className="text-2xl">{category.emoji}</span>
      <span className="flex flex-col">
        <span className="font-semibold text-gray-900">{category.label}</span>
        <span className="text-xs text-ink">{category.sub}</span>
      </span>
    </button>
  )
}
