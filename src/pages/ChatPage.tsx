import { Sidebar } from '../components/Sidebar'
import { ChatWindow } from '../components/ChatWindow'

export function ChatPage() {
  return (
    <div className="flex-1 flex overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  )
}