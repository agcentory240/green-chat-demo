import { create } from 'zustand'
import { checkAccount, getChatHistory, getChatList, sendMessage } from '../api/greenApi'
import type { Message } from '../types/message'
import type { Chat } from '../types/chat'
import type { IncomingTextNotification } from '../types/notification'

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
  messages: Message[]
  messagesLoading: boolean
  setCredentials: (c: Credentials) => void
  clearCredentials: () => void
  setActiveChat: (id: string | null) => void
  loadChats: () => Promise<void>
  loadMessages: (chatId: string) => Promise<void>
  findOrCreateChat: (phoneNumber: string) => Promise<Chat>
  sendMessage: (text: string) => Promise<void>
  addIncomingMessage: (notification: IncomingTextNotification) => void
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
  messages: [],
  activeChatId: null,
  chatsLoading: false,
  messagesLoading: false,

  setCredentials: (c) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(c))
    set({ credentials: c })
  },
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
      // обработать ошибку - и свалиться  в логин в последующем
      console.error('Failed to load chats', err)
    } finally {
      set({ chatsLoading: false })
    }
  },

  loadMessages: async (chatId: string) => {
    const credentials = get().credentials
    if (!credentials) return

    // 
    if (get().messagesLoading) return

    set({ messagesLoading: true, messages: [] })
    try {
      const messages = await getChatHistory(
        credentials.idInstance,
        credentials.apiToken,
        chatId,
      )
      // разворачиваем
      set({ messages: messages.reverse() })
    } catch (err) {
      console.error('Failed to load messages', err)
    } finally {
      set({ messagesLoading: false })
    }
  },

  findOrCreateChat: async (phoneNumber: string) => {
    const credentials = get().credentials
    if (!credentials) throw new Error('Нет авторизации')

    const normalized = phoneNumber.replace(/\D/g, '')
    if (!normalized) throw new Error('Введите номер телефона')

    // 1. Поиск в существующих чатах
    const existing = get().chats.find(
      (c) => c.phoneNumber === Number(normalized),
    )
    if (existing) {
      set({ activeChatId: existing.chatId, messages: [] })
      return existing
    }

    // 2. Проверка аккаунта
    const result = await checkAccount(
      credentials.idInstance,
      credentials.apiToken,
      normalized,
    )

    if (!result.exist || !result.chatId) {
      throw new Error('Аккаунт MAX не найден на этом номере')
    }

    // 3. Создание локального чата
    const newChat: Chat = {
      chatId: result.chatId,
      name: normalized,
      type: 'user',
      phoneNumber: Number(normalized),
      unreadCount: 0,
    }

    set({
      chats: [newChat, ...get().chats],
      activeChatId: newChat.chatId,
      messages: [],
    })
    return newChat
  },

  sendMessage: async (text: string) => {
    const credentials = get().credentials
    const activeChatId = get().activeChatId
    if (!credentials || !activeChatId) throw new Error('Нет активного чата')

    const trimmed = text.trim()
    if (!trimmed) return

    const result = await sendMessage(
      credentials.idInstance,
      credentials.apiToken,
      activeChatId,
      trimmed,
    )

    // Успех — добавляем сообщение в список
    const newMessage: Message = {
      idMessage: result.idMessage,
      timestamp: Math.floor(Date.now() / 1000),  // yt jxtym ghfdbkmyj
      type: 'outgoing',
      typeMessage: 'textMessage',
      chatId: activeChatId,
      chatType: 'user',
      textMessage: trimmed,
    }

    set({ messages: [...get().messages, newMessage] })
  },

  addIncomingMessage: (notification: IncomingTextNotification) => {
    // Проверяем, что это сообщение для активного чата
    if (notification.senderData.chatId !== get().activeChatId) return

    const newMessage: Message = {
      idMessage: notification.idMessage,
      timestamp: notification.timestamp,
      type: 'incoming',
      typeMessage: 'textMessage',
      chatId: notification.senderData.chatId,
      chatType: notification.senderData.chatType,
      textMessage: notification.messageData.textMessageData.textMessage,
      senderName: notification.senderData.senderName,
    }

    set({ messages: [...get().messages, newMessage] })
  },

}))