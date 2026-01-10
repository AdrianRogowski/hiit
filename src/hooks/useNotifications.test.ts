import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNotifications } from './useNotifications'

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Scenario: Request notification permission', () => {
    it('reports current permission status', () => {
      const { result } = renderHook(() => useNotifications())
      
      expect(result.current.permission).toBeDefined()
      expect(['default', 'granted', 'denied']).toContain(result.current.permission)
    })

    it('can request notification permission', async () => {
      const { result } = renderHook(() => useNotifications())
      
      let permission: NotificationPermission
      await act(async () => {
        permission = await result.current.requestPermission()
      })
      
      expect(['granted', 'denied', 'default']).toContain(permission!)
    })

    it('reports if notifications are supported', () => {
      const { result } = renderHook(() => useNotifications())
      
      expect(typeof result.current.isSupported).toBe('boolean')
    })
  })

  describe('Scenario: Sound persists in background', () => {
    it('can send notification', () => {
      const { result } = renderHook(() => useNotifications())
      
      // Should not throw even if permission not granted
      expect(() => {
        act(() => {
          result.current.sendNotification('Work Time!', 'Time to get back to work')
        })
      }).not.toThrow()
    })
  })
})
