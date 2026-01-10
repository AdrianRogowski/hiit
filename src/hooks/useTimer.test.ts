import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer, createInitialState, getNextPhase } from './useTimer'
import type { TimerConfig } from '@/types/timer'

const testConfig: TimerConfig = {
  workDuration: 30 * 60, // 30 minutes
  restDuration: 30 * 60, // 30 minutes
  totalRounds: 5,
}

const GET_READY_DURATION = 10 // matches the constant in useTimer

describe('createInitialState', () => {
  it('creates initial state with ready phase', () => {
    const state = createInitialState(testConfig)
    
    expect(state.phase).toBe('ready')
    expect(state.currentRound).toBe(1)
    expect(state.timeRemaining).toBe(GET_READY_DURATION)
    expect(state.totalRounds).toBe(5)
    expect(state.isRunning).toBe(false)
    expect(state.config).toEqual(testConfig)
  })
})

describe('getNextPhase', () => {
  describe('Scenario: Round progression', () => {
    it('transitions from ready to work', () => {
      const result = getNextPhase('ready', 1, 5)
      
      expect(result.phase).toBe('work')
      expect(result.round).toBe(1)
    })

    it('transitions from work to rest (same round)', () => {
      const result = getNextPhase('work', 2, 5)
      
      expect(result.phase).toBe('rest')
      expect(result.round).toBe(2)
    })

    it('transitions from rest to work (next round)', () => {
      const result = getNextPhase('rest', 2, 5)
      
      expect(result.phase).toBe('work')
      expect(result.round).toBe(3)
    })

    it('transitions to complete after final rest', () => {
      const result = getNextPhase('rest', 5, 5)
      
      expect(result.phase).toBe('complete')
      expect(result.round).toBe(5)
    })

    it('handles transition from last work to last rest', () => {
      const result = getNextPhase('work', 5, 5)
      
      expect(result.phase).toBe('rest')
      expect(result.round).toBe(5)
    })
  })
})

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Scenario: Get ready countdown', () => {
    it('starts with ready phase and 10 second countdown', () => {
      const { result } = renderHook(() => useTimer(testConfig))
      
      expect(result.current.state.phase).toBe('ready')
      expect(result.current.state.timeRemaining).toBe(GET_READY_DURATION)
      expect(result.current.state.currentRound).toBe(1)
      expect(result.current.state.totalRounds).toBe(5)
      expect(result.current.state.isRunning).toBe(false)
    })

    it('transitions to work phase after ready countdown', () => {
      const { result } = renderHook(() => useTimer(testConfig))
      
      act(() => {
        result.current.start()
      })
      
      // Advance through ready countdown
      act(() => {
        vi.advanceTimersByTime(GET_READY_DURATION * 1000)
      })
      
      expect(result.current.state.phase).toBe('work')
      expect(result.current.state.timeRemaining).toBe(30 * 60)
    })
  })

  describe('Scenario: Timer countdown updates', () => {
    it('decrements time every second when running', () => {
      const { result } = renderHook(() => useTimer(testConfig))
      
      act(() => {
        result.current.start()
      })
      
      expect(result.current.state.isRunning).toBe(true)
      expect(result.current.state.timeRemaining).toBe(GET_READY_DURATION)
      
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      
      expect(result.current.state.timeRemaining).toBe(GET_READY_DURATION - 1)
      
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      
      expect(result.current.state.timeRemaining).toBe(GET_READY_DURATION - 6)
    })
  })

  describe('Scenario: Rest period display', () => {
    it('transitions to rest phase when work completes', () => {
      const shortConfig: TimerConfig = {
        workDuration: 5, // 5 seconds for quick test
        restDuration: 5,
        totalRounds: 2,
      }
      
      const { result } = renderHook(() => useTimer(shortConfig))
      
      act(() => {
        result.current.start()
      })
      
      // Advance through ready (10s) + work (5s)
      act(() => {
        vi.advanceTimersByTime((GET_READY_DURATION + 5) * 1000)
      })
      
      expect(result.current.state.phase).toBe('rest')
      expect(result.current.state.timeRemaining).toBe(5)
      expect(result.current.state.currentRound).toBe(1)
    })
  })

  describe('Scenario: Round progression', () => {
    it('increments round after rest completes', () => {
      const shortConfig: TimerConfig = {
        workDuration: 2,
        restDuration: 2,
        totalRounds: 3,
      }
      
      const { result } = renderHook(() => useTimer(shortConfig))
      
      act(() => {
        result.current.start()
      })
      
      // Complete ready (10s) + round 1 (work 2s + rest 2s)
      act(() => {
        vi.advanceTimersByTime((GET_READY_DURATION + 4) * 1000)
      })
      
      expect(result.current.state.phase).toBe('work')
      expect(result.current.state.currentRound).toBe(2)
    })
  })

  describe('Scenario: Session completion', () => {
    it('sets phase to complete after final rest', () => {
      const shortConfig: TimerConfig = {
        workDuration: 1,
        restDuration: 1,
        totalRounds: 2,
      }
      
      const { result } = renderHook(() => useTimer(shortConfig))
      
      act(() => {
        result.current.start()
      })
      
      // Complete ready (10s) + all rounds (2 rounds × (1s work + 1s rest) = 4s)
      act(() => {
        vi.advanceTimersByTime((GET_READY_DURATION + 4) * 1000)
      })
      
      expect(result.current.state.phase).toBe('complete')
      expect(result.current.state.isRunning).toBe(false)
    })
  })

  describe('Scenario: Pause timer', () => {
    it('stops countdown when paused', () => {
      const { result } = renderHook(() => useTimer(testConfig))
      
      act(() => {
        result.current.start()
      })
      
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      
      const timeBeforePause = result.current.state.timeRemaining
      
      act(() => {
        result.current.pause()
      })
      
      expect(result.current.state.phase).toBe('paused')
      expect(result.current.state.isRunning).toBe(false)
      
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      
      // Time should not have changed while paused
      expect(result.current.state.timeRemaining).toBe(timeBeforePause)
    })
  })

  describe('Scenario: Resume timer', () => {
    it('continues from paused time', () => {
      const { result } = renderHook(() => useTimer(testConfig))
      
      act(() => {
        result.current.start()
      })
      
      // Advance past ready into work phase
      act(() => {
        vi.advanceTimersByTime((GET_READY_DURATION + 5) * 1000)
      })
      
      act(() => {
        result.current.pause()
      })
      
      const pausedTime = result.current.state.timeRemaining
      
      act(() => {
        result.current.resume()
      })
      
      expect(result.current.state.isRunning).toBe(true)
      expect(result.current.state.phase).not.toBe('paused')
      
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      
      expect(result.current.state.timeRemaining).toBe(pausedTime - 1)
    })
  })

  describe('Scenario: Stop timer early', () => {
    it('resets timer when stopped (back to ready phase)', () => {
      const { result } = renderHook(() => useTimer(testConfig))
      
      act(() => {
        result.current.start()
      })
      
      act(() => {
        vi.advanceTimersByTime(60000) // 1 minute
      })
      
      act(() => {
        result.current.stop()
      })
      
      expect(result.current.state.isRunning).toBe(false)
      expect(result.current.state.phase).toBe('ready')
      expect(result.current.state.currentRound).toBe(1)
      expect(result.current.state.timeRemaining).toBe(GET_READY_DURATION)
    })
  })

  describe('Scenario: Skip current interval', () => {
    it('advances from ready to work when skipped', () => {
      const { result } = renderHook(() => useTimer(testConfig))
      
      act(() => {
        result.current.start()
      })
      
      act(() => {
        vi.advanceTimersByTime(5000) // 5 seconds into ready
      })
      
      act(() => {
        result.current.skip()
      })
      
      expect(result.current.state.phase).toBe('work')
      expect(result.current.state.timeRemaining).toBe(30 * 60)
      expect(result.current.state.currentRound).toBe(1)
    })

    it('advances from work to rest when skipped', () => {
      const { result } = renderHook(() => useTimer(testConfig))
      
      act(() => {
        result.current.start()
      })
      
      // Get past ready phase
      act(() => {
        vi.advanceTimersByTime(GET_READY_DURATION * 1000)
      })
      
      expect(result.current.state.phase).toBe('work')
      
      act(() => {
        result.current.skip()
      })
      
      expect(result.current.state.phase).toBe('rest')
      expect(result.current.state.timeRemaining).toBe(30 * 60)
      expect(result.current.state.currentRound).toBe(1)
    })

    it('skips from rest to next work', () => {
      const shortConfig: TimerConfig = {
        workDuration: 1,
        restDuration: 10,
        totalRounds: 3,
      }
      
      const { result } = renderHook(() => useTimer(shortConfig))
      
      act(() => {
        result.current.start()
      })
      
      // Complete ready + work, enter rest
      act(() => {
        vi.advanceTimersByTime((GET_READY_DURATION + 1) * 1000)
      })
      
      expect(result.current.state.phase).toBe('rest')
      
      act(() => {
        result.current.skip()
      })
      
      expect(result.current.state.phase).toBe('work')
      expect(result.current.state.currentRound).toBe(2)
    })
  })

  describe('Scenario: Add extra round mid-session', () => {
    it('increases total rounds', () => {
      const { result } = renderHook(() => useTimer(testConfig))
      
      act(() => {
        result.current.start()
      })
      
      expect(result.current.state.totalRounds).toBe(5)
      
      act(() => {
        result.current.addRound()
      })
      
      expect(result.current.state.totalRounds).toBe(6)
    })
  })

  describe('Scenario: Remove a round mid-session', () => {
    it('decreases total rounds', () => {
      const { result } = renderHook(() => useTimer(testConfig))
      
      act(() => {
        result.current.start()
      })
      
      expect(result.current.state.totalRounds).toBe(5)
      
      act(() => {
        result.current.removeRound()
      })
      
      expect(result.current.state.totalRounds).toBe(4)
    })

    it('cannot remove rounds below current round', () => {
      const shortConfig: TimerConfig = {
        workDuration: 1,
        restDuration: 1,
        totalRounds: 3,
      }
      
      const { result } = renderHook(() => useTimer(shortConfig))
      
      act(() => {
        result.current.start()
      })
      
      // Advance to round 2: ready (10s) + work (1s) + rest (1s) = 12s
      act(() => {
        vi.advanceTimersByTime((GET_READY_DURATION + 2) * 1000)
      })
      
      expect(result.current.state.currentRound).toBe(2)
      
      act(() => {
        result.current.removeRound()
      })
      
      // Can't go below current round
      expect(result.current.state.totalRounds).toBeGreaterThanOrEqual(2)
    })
  })
})
