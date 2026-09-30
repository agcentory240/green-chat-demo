export type ChatType = 'user' | 'bot' | 'group'

export interface Chat {
    chatId: string
    name: string
    type: ChatType
    phoneNumber: number
    unreadCount: number
}