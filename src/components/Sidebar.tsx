import { useEffect, useState } from 'react'
import { NewChatModal } from './NewChatModal'
import { SidebarHeader } from './SidebarHeader';
import { useChatStore } from '../store/useChatStore';
import { getChatList } from '../api/greenApi';

export function Sidebar() {

  const credentials = useChatStore((s) => s.credentials)
  const chatsLoading = useChatStore((s) => s.chatsLoading)
  const chats = useChatStore((s) => s.chats)
  const loadChats = useChatStore((s) => s.loadChats)
  const activeChatId = useChatStore((s) => s.activeChatId)
  const setActiveChat = useChatStore((s) => s.setActiveChat)

  useEffect(() => {
    loadChats()
  }, [loadChats])

  return (
    <aside className="w-72 border-r border-gray-100 flex flex-col bg-white">
      <SidebarHeader />

      <div className="flex-1 overflow-y-auto">
        {chatsLoading && (
          <p className="p-4 text-sm text-gray-400 text-center">Загрузка...</p>
        )}

        {!chatsLoading && chats.length === 0 && (
          <p className="p-4 text-sm text-gray-400 text-center">Нет чатов</p>
        )}
        {chats.map((c) => (
          <button
            key={c.chatId}
            onClick={() => setActiveChat(c.chatId)}
            className={`w-full text-left px-4 py-3 transition
                border-b border-gray-100 cursor-pointer
                ${activeChatId === c.chatId
                ? 'bg-gray-200 hover:bg-gray-200'
                : 'hover:bg-gray-100'}`}
          >
            <p className="text-sm font-medium text-gray-800 truncate">{c.name}</p>
            {c.phoneNumber != 0 && <p className="text-sm font-normal text-gray-500 truncate">{c.phoneNumber}</p>}

          </button>
        ))}
      </div>

      {/* <NewChatModal open={modalOpen} onClose={() => setModalOpen(false)} /> */}
    </aside>
  )
}