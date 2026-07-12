export default function ReviewListItem({ word, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(word)}
      className="flex w-full items-center justify-between rounded-xl border border-ink-light px-4 py-3 text-left"
    >
      <span className="font-semibold text-gray-900">{word.word}</span>
    </button>
  )
}
