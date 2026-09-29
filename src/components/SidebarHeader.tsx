import { useChatStore } from "../store/useChatStore"

export function SidebarHeader() {
  const credentials = useChatStore((s) => s.credentials)

  return (
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-gray-800">Чаты</h2>
          <div className="text-gray-500 font-light text-xs">ID #{credentials?.idInstance}</div>
        </div>
        
        <button
          className="w-8 h-8 rounded-full bg-emerald-500 text-white
                     flex items-center justify-center text-lg leading-none
                     hover:bg-emerald-600 transition cursor-pointer"
          aria-label="Новый чат"
        >
          +
        </button>
        
      </div>

  )
}