import { useState } from 'react'
import { NewChatModal } from './NewChatModal'

export function Sidebar() {
  const [modalOpen, setModalOpen] = useState(false)

  // TODO: взять из zustand
  const chats: { id: string; name: string }[] = []

  return (
    <aside className="w-72 border-r border-gray-100 flex flex-col bg-white">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Чаты</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="w-8 h-8 rounded-full bg-emerald-500 text-white
                     flex items-center justify-center text-lg leading-none
                     hover:bg-emerald-600 transition"
          aria-label="Новый чат"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 && (
          <p className="p-4 text-sm text-gray-400 text-center">Нет чатов</p>
        )}
        {chats.map((c) => (
          <button
            key={c.id}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition
                       border-b border-gray-50"
          >
            <p className="text-sm font-medium text-gray-800 truncate">{c.name}</p>
          </button>
        ))}
      </div>

      <NewChatModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </aside>
  )
}