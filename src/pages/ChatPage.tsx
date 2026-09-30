import { Sidebar } from '../components/Sidebar'
import { ChatWindow } from '../components/ChatWindow'
import { usePolling } from '../hooks/polling'

export function ChatPage() {
  
  //Слушаем
  usePolling()
  
  return (
    <div className="flex-1 flex overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  )
}