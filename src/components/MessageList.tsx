export function MessageList() {
  // TODO: сообщения из zustand
  const messages: { id: string; text: string; sender: 'me' | 'them' }[] = []

  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm
            ${m.sender === 'me'
              ? 'self-end bg-emerald-500 text-white rounded-br-md'
              : 'self-start bg-white text-gray-800 rounded-bl-md shadow-sm'
            }`}
        >
          {m.text}
        </div>
      ))}
    </div>
  )
}