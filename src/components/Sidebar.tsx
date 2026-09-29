import { useState } from 'react'
import { NewChatModal } from './NewChatModal'
import { SidebarHeader } from './SidebarHeader';

export function Sidebar() {
  const [modalOpen, setModalOpen] = useState(false)

  // TODO: взять из zustand
  const chats: { id: string; name: string }[] = []

  return (
    <aside className="w-72 border-r border-gray-100 flex flex-col bg-white">
      <SidebarHeader/>

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