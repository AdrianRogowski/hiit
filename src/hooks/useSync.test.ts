import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useSync,
  generateSessionId,
  getShareUrl,
  parseSessionUrl,
} from './useSync'
import type { TimerConfig, TimerState } from '@/types/timer'

const testConfig: TimerConfig = {
  workDuration: 30 * 60,
  restDuration: 30 * 60,
  totalRounds: 5,
}

const testState: TimerState = {
  phase: 'work',
  currentRound: 2,
  timeRemaining: 1500,
  totalRounds: 5,
  isRunning: true,
  config: testConfig,
}

describe('generateSessionId', () => {
  describe('Scenario: Generate shareable link', () => {
    it('generates a unique session ID', () => {
      const id1 = generateSessionId()
      const id2 = generateSessionId()
      
      expect(id1).toBeDefined()
      expect(id1.length).toBeGreaterThan(5)
      expect(id1).not.toBe(id2)
    })

    it('generates URL-safe session IDs', () => {
      const id = generateSessionId()
      
      // Should only contain alphanumeric characters
      expect(id).toMatch(/^[a-zA-Z0-9]+$/)
    })
  })
})

describe('getShareUrl', () => {
  describe('Scenario: Generate shareable link', () => {
    it('creates a valid URL with session ID', () => {
      const url = getShareUrl('abc123xyz')
      
      expect(url).toContain('abc123xyz')
      expect(() => new URL(url)).not.toThrow()
    })

    it('uses the app domain', () => {
      const url = getShareUrl('test123')
      
      // Should be a path like /s/test123 or full URL
      expect(url).toMatch(/\/s\/test123/)
    })
  })
})

describe('parseSessionUrl', () => {
  describe('Scenario: Join existing session from link', () => {
    it('extracts session ID from full URL', () => {
      const sessionId = parseSessionUrl('https://hiit.app/s/abc123xyz')
      
      expect(sessionId).toBe('abc123xyz')
    })

    it('extracts session ID from relative path', () => {
      const sessionId = parseSessionUrl('/s/abc123xyz')
      
      expect(sessionId).toBe('abc123xyz')
    })

    it('returns null for invalid URLs', () => {
      expect(parseSessionUrl('https://example.com/other')).toBeNull()
      expect(parseSessionUrl('invalid')).toBeNull()
      expect(parseSessionUrl('')).toBeNull()
    })
  })
})

describe('useSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Scenario: Generate shareable link', () => {
    it('starts with no active session', () => {
      const { result } = renderHook(() => useSync())
      
      expect(result.current.session).toBeNull()
    })

    it('creates a new session and returns share URL', async () => {
      const { result } = renderHook(() => useSync())
      
      let session: typeof result.current.session
      await act(async () => {
        session = await result.current.createSession(testConfig)
      })
      
      expect(session).not.toBeNull()
      expect(session!.sessionId).toBeDefined()
      expect(session!.shareUrl).toBeDefined()
      expect(session!.isHost).toBe(true)
      expect(result.current.session).not.toBeNull()
    })

    it('provides QR code data for the share URL', async () => {
      const { result } = renderHook(() => useSync())
      
      await act(async () => {
        await result.current.createSession(testConfig)
      })
      
      const qrData = result.current.getQRCodeData()
      expect(qrData).toBeDefined()
      expect(qrData).toContain(result.current.session!.sessionId)
    })
  })

  describe('Scenario: Join existing session from link', () => {
    it('joins an existing session by ID', async () => {
      const { result } = renderHook(() => useSync())
      
      let session: typeof result.current.session
      await act(async () => {
        session = await result.current.joinSession('existing123')
      })
      
      expect(session).not.toBeNull()
      expect(session!.sessionId).toBe('existing123')
      expect(session!.isHost).toBe(false)
    })
  })

  describe('Scenario: Real-time sync across devices', () => {
    it('can broadcast state updates', async () => {
      const { result } = renderHook(() => useSync())
      
      await act(async () => {
        await result.current.createSession(testConfig)
      })
      
      expect(() => {
        act(() => {
          result.current.broadcastState(testState)
        })
      }).not.toThrow()
    })

    it('can subscribe to state updates', async () => {
      const { result } = renderHook(() => useSync())
      const callback = vi.fn()
      
      await act(async () => {
        await result.current.joinSession('test123')
      })
      
      const unsubscribe = result.current.onStateUpdate(callback)
      
      expect(typeof unsubscribe).toBe('function')
      
      // Cleanup
      unsubscribe()
    })
  })

  describe('Scenario: Device count indicator', () => {
    it('tracks connected devices count', async () => {
      const { result } = renderHook(() => useSync())
      
      await act(async () => {
        await result.current.createSession(testConfig)
      })
      
      // Host counts as 1 connected device
      expect(result.current.session!.connectedDevices).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Scenario: Leave session', () => {
    it('clears session when leaving', async () => {
      const { result } = renderHook(() => useSync())
      
      await act(async () => {
        await result.current.createSession(testConfig)
      })
      
      expect(result.current.session).not.toBeNull()
      
      act(() => {
        result.current.leaveSession()
      })
      
      expect(result.current.session).toBeNull()
    })
  })
})
