import { useState } from 'react'
import { useChatStore } from '../store/useChatStore'

export function MessageInput() {

  const sendMessage = useChatStore((s) => s.sendMessage)
  const activeChatId = useChatStore((s) => s.activeChatId)

  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError(null)
    try {
      await sendMessage(trimmed)
      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить')
      // текст НЕ очищаем
    } finally {
      setLoading(false)
    }
  }

  if (!activeChatId) return null  // нет активного чата — нет инпута

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Написать сообщение..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-800
                     placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-emerald-100
                     disabled:opacity-60 transition"
        />
        <button
          onClick={handleSend}
          disabled={loading || !text.trim()}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium
                     hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed
                     active:scale-[0.98] transition cursor-pointer"
        >
          {loading ? '...' : 'Отправить'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}