import { create } from 'zustand'
import { getChatList, type Chat } from '../api/greenApi'

// Ключ в сессии
const STORAGE_KEY = 'green-api-credentials'

/**
 * Данные для подключения
 */
interface Credentials {
  idInstance: string
  apiToken: string
}

//Состаниние 
interface ChatState {
  credentials: Credentials | null
  activeChatId: string | null
  chats: Chat[]
  chatsLoading: boolean 
  setCredentials: (c: Credentials) => void
  clearCredentials: () => void
  setActiveChat: (id: string | null) => void
  loadChats: () => Promise<void> 
}


/**
 * Получение данных о доступе из локального хранилища
 * @returns Сохраненный доступ
 */
function loadCredentials(): Credentials | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  credentials: loadCredentials(),
  chats: [],
  activeChatId: null,
  chatsLoading: false,  

  setCredentials: (c) => { /* ... */ },
  clearCredentials: () => {
    sessionStorage.removeItem(STORAGE_KEY)
    set({ credentials: null, chats: [], activeChatId: null })
  },

  setChats: (chats: Chat[]) => set({ chats }),
  setActiveChat: (id) => set({ activeChatId: id }),

  loadChats: async () => {
    if (get().chatsLoading) return 
    
    const credentials = get().credentials
    if (!credentials) return

    set({ chatsLoading: true }) 
    try {
      const chats = await getChatList(credentials.idInstance, credentials.apiToken)
      set({ chats })
    } catch (err) {
      // обработать ошибку - и свалиться  в логин.
      console.error('Failed to load chats', err)
    } finally {
      set({ chatsLoading: false })
    }
  },
}))