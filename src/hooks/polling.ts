import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { deleteNotification, receiveNotification } from '../api/greenApi'

export function usePolling() {
  const credentials = useChatStore((s) => s.credentials)
  const addIncomingMessage = useChatStore((s) => s.addIncomingMessage)

  useEffect(() => {
    if (!credentials) return

    let stopped = false

    const poll = async () => {
      while (!stopped) {
        try {
          const notification = await receiveNotification(
            credentials.idInstance,
            credentials.apiToken,
          )

          if (notification) {
            // Обрабатываем — если это входящее текстовое
            if (notification.body.typeWebhook === 'incomingMessageReceived') {
              addIncomingMessage(notification.body)
            }

            // Обязательно удаляем из очереди
            await deleteNotification(
              credentials.idInstance,
              credentials.apiToken,
              notification.receiptId,
            )
          }
        } catch (err) {
          console.error('Polling error', err)
        }

        // Пауза перед следующим запросом
        await new Promise((r) => setTimeout(r, 2000))
      }
    }

    poll()

    return () => {
      stopped = true  // остановка при размонтировании
    }
  }, [credentials, addIncomingMessage])
}