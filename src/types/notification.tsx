/**
 * Общие поля любого уведомления от GREEN-API.
 */
export interface InstanceData {
  idInstance: number
  wid: string
  typeInstance: string
}

export interface SenderData {
  chatId: string
  chatName: string
  chatType: 'user' | 'group' | 'channel' | 'bot'
  sender: string
  senderName: string
  senderType: 'user' | 'group' | 'channel' | 'bot'
  senderContactName: string
  senderPhoneNumber: number
}

export interface TextMessageData {
  textMessage: string
  isForwarded?: boolean
  forwardingScore?: number
}

export interface QuotedMessage {
  stanzaId: string
  participant: string
}

export interface TextMessageDataWrapper {
  typeMessage: 'textMessage'
  textMessageData: TextMessageData
  quotedMessage?: QuotedMessage
}

/**
 * Входящее текстовое сообщение.
 * typeWebhook = 'incomingMessageReceived'
 * messageData.typeMessage = 'textMessage'
 */
export interface IncomingTextNotification {
  typeWebhook: 'incomingMessageReceived'
  instanceData: InstanceData
  timestamp: number
  idMessage: string
  senderData: SenderData
  messageData: TextMessageDataWrapper
}

/**
 * Обёртка уведомления, как оно приходит из ReceiveNotification.
 */
export interface Notification {
  receiptId: number
  body: IncomingTextNotification  // только текстовые
}