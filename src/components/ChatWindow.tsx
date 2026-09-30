import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { useChatStore } from '../store/useChatStore'
import { useEffect } from 'react'
import type { Chat } from '../api/greenApi'

export function ChatWindow() {

  const activeChatId = useChatStore((s) => s.activeChatId)
  const chats = useChatStore((s) => s.chats)
  const activeChat = chats.find((c) => c.chatId === activeChatId) ?? null

  if (!activeChat) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50/50">
        <p className="text-gray-400 text-sm">Выберите чат или создайте новый</p>
      </main>
    )
  }

  return (
    <main className="flex-1 flex flex-col bg-gray-50/50">
      <header className="px-5 py-3 bg-white border-b border-gray-100">
        <h3 className="font-medium text-gray-800">{activeChat.name}</h3>
      </header>
      <MessageList />
      <MessageInput />
    </main>
  )
}