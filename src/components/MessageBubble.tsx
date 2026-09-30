import type { Message } from "../types/message"

export function MessageBubble({ message }: { message: Message }) {
  const isOutgoing = message.type === 'outgoing'
  const time = formatTime(message.timestamp)

  return (
    <div className={`flex flex-col max-w-[75%]
                     ${isOutgoing ? 'self-end items-end' : 'self-start items-start'}`}>
      {/* Имя отправителя — только для входящих */}
      {!isOutgoing && message.senderName && (
        <span className="text-xs font-medium text-emerald-600 px-1 mb-1">
          {message.senderName}
        </span>
      )}

      {/* Текст сообщения */}
      <div
        className={`px-4 py-2 text-sm whitespace-pre-wrap break-words
          ${isOutgoing
            ? 'bg-emerald-500 text-white rounded-2xl rounded-br-md'
            : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm'
          }`}
      >
        {message.textMessage}
      </div>

      {/* Время */}
      <span className="text-[10px] text-gray-400 px-1 mt-1">
        {time}
      </span>
    </div>
  )
}

/**
 * Форматирует UNIX-timestamp в "HH:MM".
 * timestamp в GREEN-API — в секундах, не в миллисекундах!
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)  // * 1000, потому что секунды
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}