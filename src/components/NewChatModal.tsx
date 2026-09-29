import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export function NewChatModal({ open, onClose }: Props) {
  const [phone, setPhone] = useState('')

  if (!open) return null

  const handleCreate = () => {
    if (!phone.trim()) return
    // TODO: создать чат через zustand + API
    setPhone('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
         onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
           onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Новый чат</h3>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Номер телефона получателя"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                     focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
        />
        <div className="flex gap-2 mt-4">
          <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600
                             hover:bg-gray-50 transition">
            Отмена
          </button>
          <button onClick={handleCreate}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium
                             hover:bg-emerald-600 transition">
            Создать
          </button>
        </div>
      </div>
    </div>
  )
}