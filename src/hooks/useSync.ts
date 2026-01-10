import { useState, useCallback, useRef, useEffect } from 'react'
import type { TimerState, TimerConfig } from '@/types/timer'

export interface SyncSession {
  sessionId: string
  shareUrl: string
  connectedDevices: number
  isHost: boolean
}

export interface UseSyncReturn {
  session: SyncSession | null
  createSession: (config: TimerConfig) => Promise<SyncSession>
  joinSession: (sessionId: string) => Promise<SyncSession>
  leaveSession: () => void
  broadcastState: (state: TimerState) => void
  onStateUpdate: (callback: (state: TimerState) => void) => () => void
  getShareUrl: () => string | null
  getQRCodeData: () => string | null
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate shareable URL from session ID
 */
export function getShareUrl(sessionId: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://hiit.app'
  return `${baseUrl}/s/${sessionId}`
}

/**
 * Extract session ID from URL
 */
export function parseSessionUrl(url: string): string | null {
  if (!url) return null
  
  // Match /s/{sessionId} pattern
  const match = url.match(/\/s\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}

/**
 * Hook for managing multi-device sync via WebSocket/real-time connection
 * 
 * Note: This is a simplified implementation. In production, you would use
 * a real-time service like Supabase Realtime, Firebase, or a WebSocket server.
 */
export function useSync(): UseSyncReturn {
  const [session, setSession] = useState<SyncSession | null>(null)
  const listenersRef = useRef<Set<(state: TimerState) => void>>(new Set())
  const channelRef = useRef<BroadcastChannel | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.close()
      }
    }
  }, [])

  const setupChannel = useCallback((sessionId: string) => {
    // Use BroadcastChannel API for same-origin tab sync
    // In production, replace with WebSocket/Supabase/Firebase
    if (typeof BroadcastChannel !== 'undefined') {
      channelRef.current = new BroadcastChannel(`hiit-timer-${sessionId}`)
      
      channelRef.current.onmessage = (event) => {
        if (event.data.type === 'state-update') {
          listenersRef.current.forEach((listener) => {
            listener(event.data.state)
          })
        }
      }
    }
  }, [])

  const createSession = useCallback(async (config: TimerConfig): Promise<SyncSession> => {
    const sessionId = generateSessionId()
    const shareUrl = getShareUrl(sessionId)
    
    const newSession: SyncSession = {
      sessionId,
      shareUrl,
      connectedDevices: 1,
      isHost: true,
    }

    setupChannel(sessionId)
    setSession(newSession)
    
    // Store config in sessionStorage for guests to retrieve
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(`hiit-config-${sessionId}`, JSON.stringify(config))
    }

    return newSession
  }, [setupChannel])

  const joinSession = useCallback(async (sessionId: string): Promise<SyncSession> => {
    const shareUrl = getShareUrl(sessionId)
    
    const newSession: SyncSession = {
      sessionId,
      shareUrl,
      connectedDevices: 2, // Simplified - in production, get from server
      isHost: false,
    }

    setupChannel(sessionId)
    setSession(newSession)

    return newSession
  }, [setupChannel])

  const leaveSession = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.close()
      channelRef.current = null
    }
    setSession(null)
  }, [])

  const broadcastState = useCallback((state: TimerState) => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'state-update',
        state,
      })
    }
  }, [])

  const onStateUpdate = useCallback((callback: (state: TimerState) => void) => {
    listenersRef.current.add(callback)
    
    return () => {
      listenersRef.current.delete(callback)
    }
  }, [])

  const getShareUrlFn = useCallback(() => {
    return session?.shareUrl ?? null
  }, [session])

  const getQRCodeData = useCallback(() => {
    return session?.shareUrl ?? null
  }, [session])

  return {
    session,
    createSession,
    joinSession,
    leaveSession,
    broadcastState,
    onStateUpdate,
    getShareUrl: getShareUrlFn,
    getQRCodeData,
  }
}
