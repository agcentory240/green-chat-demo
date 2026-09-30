import axios, { AxiosError } from 'axios'
import type { Chat } from '../types/chat';
import type { InstanceResponse, InstanceState } from '../types/instance';
import type { Message, SendMessageResponse } from '../types/message';
import type { CheckAccountResponse } from '../types/checkAccount';
import type { Notification } from '../types/notification'

const API_URL = '/api'  //Это только для дев

interface GreenApiError {
    statusCode: number
    timestamp: string
    path: string
    message: string
}


/**
 * Проверка состояния ид и токена
 * @param idInstance 
 * @param apiToken 
 * @returns InstanceResponse
 */
export async function getStateInstance(idInstance: string, apiToken: string): Promise<InstanceResponse> {
    const url = `${API_URL}/waInstance${idInstance}/getStateInstance/${apiToken}`
    try {
        const response = await axios.get<{ stateInstance: InstanceState }>(url)
        return { ok: true, state: response.data.stateInstance }
    } catch (err) {
        const error = err as AxiosError
        if (error.response?.status === 401) {
            return { ok: false, state: null, error: 'Неверный apiTokenInstance' }
        }
        if (error.response?.status === 403) {
            return { ok: false, state: null, error: 'Неверный idInstance' }
        }
        if (error.response?.status === 404) {
            return { ok: false, state: null, error: 'Инстанс не найден' }
        }
        return { ok: false, state: null, error: 'Ошибка соединения с GREEN-API' }
    }
}

/**
 * Получение списка xfnjd
 * @param idInstance 
 * @param apiToken 
 */
export async function getChatList(idInstance: string, apiToken: string): Promise<Chat[]> {
    const url = `${API_URL}/waInstance${idInstance}/getChats/${apiToken}`
    const response = await axios.get<Chat[]>(url)
    return response.data
}

/**
 * Получения сообщений из чата
 * @param idInstance 
 * @param apiToken 
 * @param chatId 
 * @param count 
 * @returns 
 */
export async function getChatHistory(idInstance: string, apiToken: string, chatId: string, count = 5): Promise<Message[]> {
    const url = `${API_URL}/waInstance${idInstance}/getChatHistory/${apiToken}`
    const response = await axios.post<Message[]>(url, { chatId, count })
    return response.data
}


export async function checkAccount(idInstance: string, apiToken: string, phoneNumber: string): Promise<CheckAccountResponse> {
    const url = `${API_URL}/waInstance${idInstance}/checkAccount/${apiToken}`
    const normalized = phoneNumber.replace(/\D/g, '')

    try {
        const response = await axios.post<CheckAccountResponse>(url, {
            phoneNumber: Number(normalized),
        })
        return response.data
    } catch (err) {
        const error = err as AxiosError<GreenApiError>

        // 1. Нет ответа — сеть, CORS, таймаут
        if (!error.response) {
            throw new Error('Нет соединения с GREEN-API. Проверьте интернет.')
        }

        // 2. Есть ответ — берём message из тела
        const apiMessage = error.response.data?.message
        if (apiMessage) {
            throw new Error(apiMessage)
        }

        // 3. Fallback — если message нет (нестандартный ответ)
        throw new Error(`Ошибка ${error.response.status}. Попробуйте позже`)
    }
}

export async function sendMessage(idInstance: string, apiToken: string, chatId: string, message: string,): Promise<SendMessageResponse> {
    const url = `${API_URL}/waInstance${idInstance}/sendMessage/${apiToken}`

    try {
        const response = await axios.post<SendMessageResponse>(url, {
            chatId,
            message,
        })
        return response.data
    } catch (err) {
        const error = err as AxiosError<GreenApiError>

        if (!error.response) {
            throw new Error('Нет соединения с GREEN-API')
        }

        // Специфичные статусы
        if (error.response.status === 403) {
            throw new Error('Аккаунт временно ограничен. Отправка возможна только на номера, сохранившие вас в контактах')
        }
        if (error.response.status === 500) {
            throw new Error('Сообщение слишком большое')
        }

        // Остальное — message из API
        const apiMessage = error.response.data?.message
        if (apiMessage) {
            throw new Error(apiMessage)
        }

        throw new Error(`Ошибка ${error.response.status}`)
    }
}

/**
 * Получить одно уведомление из очереди.
 * Возвращает null, если уведомлений нет (таймаут).
 */
export async function receiveNotification( idInstance: string, apiToken: string, receiveTimeout = 5, ): Promise<Notification | null> {
  const url = `${API_URL}/waInstance${idInstance}/receiveNotification/${apiToken}?receiveTimeout=${receiveTimeout}`
  const response = await axios.get<Notification | null>(url)
  return response.data
}

/**
 * Удалить уведомление из очереди (подтвердить обработку).
 */
export async function deleteNotification( idInstance: string, apiToken: string, receiptId: number, ): Promise<{ result: boolean }> {
  const url = `${API_URL}/waInstance${idInstance}/deleteNotification/${apiToken}/${receiptId}`
  const response = await axios.delete<{ result: boolean }>(url)
  return response.data
}