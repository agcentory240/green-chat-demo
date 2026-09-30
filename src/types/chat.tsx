export type ChatType = 'user' | 'bot' | 'group' | 'channel'

export interface Chat {
    chatId: string
    name: string
    type: ChatType
    phoneNumber: number
    unreadCount: number
}