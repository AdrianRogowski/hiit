import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSound, getTransitionSound, shouldPlayWarning } from './useSound'

describe('getTransitionSound', () => {
  describe('Scenario: Work-to-rest transition sound', () => {
    it('returns work-complete when transitioning from work to rest', () => {
      const sound = getTransitionSound('work', 'rest')
      expect(sound).toBe('work-complete')
    })
  })

  describe('Scenario: Rest-to-work transition sound', () => {
    it('returns rest-complete when transitioning from rest to work', () => {
      const sound = getTransitionSound('rest', 'work')
      expect(sound).toBe('rest-complete')
    })
  })

  describe('Scenario: Session completion sound', () => {
    it('returns session-complete when transitioning to complete', () => {
      const sound = getTransitionSound('rest', 'complete')
      expect(sound).toBe('session-complete')
    })
  })

  it('returns null for pause transitions', () => {
    expect(getTransitionSound('work', 'paused')).toBeNull()
    expect(getTransitionSound('rest', 'paused')).toBeNull()
  })

  it('returns null for resume transitions', () => {
    expect(getTransitionSound('paused', 'work')).toBeNull()
    expect(getTransitionSound('paused', 'rest')).toBeNull()
  })
})

describe('shouldPlayWarning', () => {
  describe('Scenario: Warning before transition', () => {
    it('returns true when 10 seconds remaining', () => {
      expect(shouldPlayWarning(10)).toBe(true)
    })

    it('returns true for each second from 10 to 1', () => {
      expect(shouldPlayWarning(10)).toBe(true)
      expect(shouldPlayWarning(5)).toBe(true)
      expect(shouldPlayWarning(3)).toBe(true)
      expect(shouldPlayWarning(1)).toBe(true)
    })

    it('returns false when more than 10 seconds remaining', () => {
      expect(shouldPlayWarning(11)).toBe(false)
      expect(shouldPlayWarning(30)).toBe(false)
      expect(shouldPlayWarning(100)).toBe(false)
    })

    it('returns false when 0 seconds remaining', () => {
      expect(shouldPlayWarning(0)).toBe(false)
    })
  })
})

describe('useSound', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Scenario: Mute sounds', () => {
    it('starts with sounds unmuted', () => {
      const { result } = renderHook(() => useSound())
      
      expect(result.current.isMuted).toBe(false)
    })

    it('mutes all sounds when setMuted(true)', () => {
      const { result } = renderHook(() => useSound())
      
      act(() => {
        result.current.setMuted(true)
      })
      
      expect(result.current.isMuted).toBe(true)
    })

    it('unmutes sounds when setMuted(false)', () => {
      const { result } = renderHook(() => useSound())
      
      act(() => {
        result.current.setMuted(true)
      })
      
      act(() => {
        result.current.setMuted(false)
      })
      
      expect(result.current.isMuted).toBe(false)
    })
  })

  describe('Sound playback', () => {
    it('can play work complete sound', () => {
      const { result } = renderHook(() => useSound())
      
      // Should not throw
      expect(() => {
        act(() => {
          result.current.playWorkComplete()
        })
      }).not.toThrow()
    })

    it('can play rest complete sound', () => {
      const { result } = renderHook(() => useSound())
      
      expect(() => {
        act(() => {
          result.current.playRestComplete()
        })
      }).not.toThrow()
    })

    it('can play warning sound', () => {
      const { result } = renderHook(() => useSound())
      
      expect(() => {
        act(() => {
          result.current.playWarning()
        })
      }).not.toThrow()
    })

    it('can play session complete sound', () => {
      const { result } = renderHook(() => useSound())
      
      expect(() => {
        act(() => {
          result.current.playSessionComplete()
        })
      }).not.toThrow()
    })

    it('does not play sounds when muted', () => {
      const playMock = vi.fn()
      vi.spyOn(global, 'Audio').mockImplementation(() => ({
        play: playMock,
        pause: vi.fn(),
        load: vi.fn(),
        src: '',
        volume: 1,
        loop: false,
      } as unknown as HTMLAudioElement))
      
      const { result } = renderHook(() => useSound())
      
      act(() => {
        result.current.setMuted(true)
      })
      
      act(() => {
        result.current.playWorkComplete()
      })
      
      // When muted, should not call play
      expect(playMock).not.toHaveBeenCalled()
    })
  })
})
