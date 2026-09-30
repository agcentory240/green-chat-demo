import type { ChatType } from "./chat"

export type MessageDirection = 'outgoing' | 'incoming'

export type MessageContentType =
  | 'textMessage'
  | 'extendedTextMessage'
  | 'imageMessage'
  | 'videoMessage'
  | 'documentMessage'
  | 'audioMessage'
  | 'stickerMessage'
  | 'reactionMessage'
  | 'pollMessage'

export type StatusMessage = 'sent' | 'delivered' | 'read' | ''

export interface Message {
  idMessage: string
  timestamp: number
  type: MessageDirection
  typeMessage: MessageContentType
  chatId: string
  chatType: ChatType
  textMessage?: string
  statusMessage?: StatusMessage
  sendByApi?: boolean
  senderId?: string
  senderName?: string
  senderType?: ChatType
  senderContactName?: string
}

export interface SendMessageResponse {
  idMessage: string
}