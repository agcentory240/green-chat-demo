import { create } from 'zustand'

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
  setCredentials: (c: Credentials) => void
  clearCredentials: () => void
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

export const useChatStore = create<ChatState>((set) => ({
  credentials: loadCredentials(),

  setCredentials: (c) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(c))
    set({ credentials: c })
  },

  clearCredentials: () => {
    sessionStorage.removeItem(STORAGE_KEY)
    set({ credentials: null })
  },
}))