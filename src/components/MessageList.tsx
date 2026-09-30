import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import type { Message } from "../types/message";
import { MessageBubble } from "./MessageBubble";


export function MessageList() {


  const activeChatId = useChatStore((s) => s.activeChatId)
  const messagesLoading = useChatStore((s) => s.messagesLoading)
  const loadMessages = useChatStore((s) => s.loadMessages)
  const messages = useChatStore((s) => s.messages)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activeChatId) return
    loadMessages(activeChatId);
  }, [activeChatId, loadMessages])

  // Автоскролл вниз при новых сообщениях
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
      {messagesLoading && (
        <div className="flex justify-center py-2">
          <span className="text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full shadow-sm">
            Загружаем последние 10 сообщений...
          </span>
        </div>
      )}

      {!messagesLoading && messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">Нет сообщений</p>
        </div>
      )}

      {messages.map((m) => (
        <MessageBubble key={m.idMessage} message={m} />
      ))}

      <div ref={bottomRef} />
    </div>
  )
}