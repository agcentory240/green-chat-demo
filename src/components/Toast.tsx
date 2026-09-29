interface Props {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: Props) {
  return (
    <div className="fixed top-4 right-4 z-50
                    bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg
                    flex items-center gap-3
                    animate-in fade-in slide-in-from-top-2">
      <span className="text-sm">{message}</span>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white text-lg leading-none"
        aria-label="Закрыть"
      >
        ×
      </button>
    </div>
  )
}