import { useState, useCallback, useEffect } from 'react'

/**
 * Hook for managing browser notifications
 */
export interface UseNotificationsReturn {
  permission: NotificationPermission
  requestPermission: () => Promise<NotificationPermission>
  sendNotification: (title: string, body?: string) => void
  isSupported: boolean
}

export function useNotifications(): UseNotificationsReturn {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window
  
  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported ? Notification.permission : 'denied'
  )

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission)
    }
  }, [isSupported])

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied'
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch {
      return 'denied'
    }
  }, [isSupported])

  const sendNotification = useCallback((title: string, body?: string) => {
    if (!isSupported || permission !== 'granted') {
      return
    }

    try {
      new Notification(title, {
        body,
        icon: '/timer-icon.png',
        badge: '/timer-badge.png',
        tag: 'hiit-timer',
        renotify: true,
      })
    } catch {
      // Notification failed
    }
  }, [isSupported, permission])

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported,
  }
}
