import { notifications } from '@mantine/notifications'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

export interface NotificationFeedItem {
  id: string
  title: string
  message: string
  color?: string
  createdAt: number
}

interface AddNotificationInput {
  title: string
  message: string
  color?: string
}

interface NotificationCenterContextValue {
  items: NotificationFeedItem[]
  addNotification: (input: AddNotificationInput) => void
  clearNotifications: () => void
}

const NotificationCenterContext = createContext<NotificationCenterContextValue | null>(
  null,
)

function createNotificationId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function NotificationCenterProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<NotificationFeedItem[]>([])

  const addNotification = useCallback(
    ({ title, message, color }: AddNotificationInput) => {
      const notificationItem: NotificationFeedItem = {
        id: createNotificationId(),
        title,
        message,
        color,
        createdAt: Date.now(),
      }

      setItems((previousItems) => [notificationItem, ...previousItems].slice(0, 30))
      notifications.show({ title, message, color })
    },
    [],
  ) // setItems is stable

  const clearNotifications = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      addNotification,
      clearNotifications,
    }),
    [items, addNotification, clearNotifications],
  )

  return (
    <NotificationCenterContext.Provider value={value}>
      {children}
    </NotificationCenterContext.Provider>
  )
}

export function useNotificationCenter() {
  const context = useContext(NotificationCenterContext)
  if (!context) {
    throw new Error(
      'useNotificationCenter must be used within NotificationCenterProvider',
    )
  }

  return context
}
