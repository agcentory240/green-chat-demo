import { useState } from 'react'
import { useChatStore } from '../store/useChatStore'

interface Props {
  open: boolean
  onClose: () => void
}

export function NewChatModal({ open, onClose }: Props) {
  const findOrCreateChat = useChatStore((s) => s.findOrCreateChat)

  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleCreate = async () => {
    if (!phone.trim()) return

    setLoading(true)
    setError(null)

    try {
      await findOrCreateChat(phone)
      setPhone('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось проверить номер')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    setPhone('')
    setError(null)
    onClose()
  }  

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Новый чат
        </h3>

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Номер телефона"
          disabled={loading}
          autoFocus
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                     text-gray-800 placeholder:text-gray-400
                     focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
                     disabled:opacity-60 transition"
        />

        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600
                       hover:bg-gray-50 disabled:opacity-60 transition cursor-pointer"
          >
            Отмена
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !phone.trim()}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium
                       hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed
                       transition cursor-pointer"
          >
            {loading ? 'Проверка...' : 'Создать'}
          </button>
        </div>
      </div>
    </div>
  )
}