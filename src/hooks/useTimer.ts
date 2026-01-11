import { useState, useEffect, useCallback, useRef } from 'react'
import type { TimerConfig, TimerState, TimerPhase } from '@/types/timer'

const GET_READY_DURATION = 10 // seconds

export interface UseTimerReturn {
  state: TimerState
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  skip: () => void
  addRound: () => void
  removeRound: () => void
  reset: () => void
}

/**
 * Calculate initial timer state from config
 * Starts with 'ready' phase for 10 second countdown
 */
export function createInitialState(config: TimerConfig): TimerState {
  return {
    phase: 'ready',
    currentRound: 1,
    timeRemaining: GET_READY_DURATION,
    totalRounds: config.totalRounds,
    isRunning: false,
    config,
  }
}

/**
 * Get the next phase after current phase completes
 * Note: Final round has no rest - session completes after final work period
 */
export function getNextPhase(
  currentPhase: TimerPhase,
  currentRound: number,
  totalRounds: number
): { phase: TimerPhase; round: number } {
  if (currentPhase === 'ready') {
    return { phase: 'work', round: 1 }
  }
  
  if (currentPhase === 'work') {
    // Final round: complete immediately (no rest needed)
    if (currentRound >= totalRounds) {
      return { phase: 'complete', round: currentRound }
    }
    return { phase: 'rest', round: currentRound }
  }
  
  if (currentPhase === 'rest') {
    return { phase: 'work', round: currentRound + 1 }
  }
  
  // Paused or complete - no change
  return { phase: currentPhase, round: currentRound }
}

/**
 * Hook for managing timer state and controls
 */
export function useTimer(config: TimerConfig): UseTimerReturn {
  const [state, setState] = useState<TimerState>(() => createInitialState(config))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const previousPhaseRef = useRef<TimerPhase>('ready')

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Timer tick logic
  useEffect(() => {
    if (!state.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 1) {
          // Time's up - transition to next phase
          const { phase: nextPhase, round: nextRound } = getNextPhase(
            prev.phase,
            prev.currentRound,
            prev.totalRounds
          )

          if (nextPhase === 'complete') {
            return {
              ...prev,
              timeRemaining: 0,
              phase: 'complete',
              isRunning: false,
            }
          }

          // Determine next duration based on phase
          let nextDuration: number
          if (nextPhase === 'work') {
            nextDuration = prev.config.workDuration
          } else {
            nextDuration = prev.config.restDuration
          }

          return {
            ...prev,
            phase: nextPhase,
            currentRound: nextRound,
            timeRemaining: nextDuration,
          }
        }

        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.isRunning])

  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
    }))
  }, [])

  const pause = useCallback(() => {
    previousPhaseRef.current = state.phase === 'paused' ? previousPhaseRef.current : state.phase
    setState((prev) => ({
      ...prev,
      phase: 'paused',
      isRunning: false,
    }))
  }, [state.phase])

  const resume = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: previousPhaseRef.current,
      isRunning: true,
    }))
  }, [])

  const stop = useCallback(() => {
    setState(createInitialState(config))
  }, [config])

  const skip = useCallback(() => {
    setState((prev) => {
      const currentPhase = prev.phase === 'paused' ? previousPhaseRef.current : prev.phase
      const { phase: nextPhase, round: nextRound } = getNextPhase(
        currentPhase,
        prev.currentRound,
        prev.totalRounds
      )

      if (nextPhase === 'complete') {
        return {
          ...prev,
          phase: 'complete',
          timeRemaining: 0,
          isRunning: false,
        }
      }

      // Determine next duration
      let nextDuration: number
      if (nextPhase === 'work') {
        nextDuration = prev.config.workDuration
      } else {
        nextDuration = prev.config.restDuration
      }

      previousPhaseRef.current = nextPhase

      return {
        ...prev,
        phase: nextPhase,
        currentRound: nextRound,
        timeRemaining: nextDuration,
      }
    })
  }, [])

  const addRound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      totalRounds: prev.totalRounds + 1,
    }))
  }, [])

  const removeRound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      totalRounds: Math.max(prev.currentRound, prev.totalRounds - 1),
    }))
  }, [])

  const reset = useCallback(() => {
    setState(createInitialState(config))
  }, [config])

  return {
    state,
    start,
    pause,
    resume,
    stop,
    skip,
    addRound,
    removeRound,
    reset,
  }
}
