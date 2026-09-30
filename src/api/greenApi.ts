import axios, { AxiosError } from 'axios'
import type { Chat } from '../types/chat';
import type { InstanceResponse, InstanceState } from '../types/instance';
import type { Message } from '../types/message';

const API_URL = '/api'  //Это только для дев


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
export async function getChatHistory(idInstance: string, apiToken: string, chatId: string, count = 50): Promise<Message[]> {
  const url = `${API_URL}/waInstance${idInstance}/getChatHistory/${apiToken}`
  const response = await axios.post<Message[]>(url, { chatId, count })
  return response.data
}