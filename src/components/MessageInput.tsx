import { useState } from 'react'

export function MessageInput() {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim()) return
    // TODO: отправить через API
    setText('')
  }

  return (
    <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Написать сообщение..."
        className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-sm text-gray-800
                   placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-emerald-100 transition"
      />
      <button
        onClick={handleSend}
        className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium
                   hover:bg-emerald-600 active:scale-[0.98] transition"
      >
        Отправить
      </button>
    </div>
  )
}