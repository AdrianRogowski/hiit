import { useState, useCallback, useRef, useEffect } from 'react'
import type { TimerPhase } from '@/types/timer'

export interface UseSoundReturn {
  playWorkComplete: () => void
  playRestComplete: () => void
  playWarning: () => void
  playSessionComplete: () => void
  setMuted: (muted: boolean) => void
  isMuted: boolean
  unlockAudio: () => void
}

/**
 * Get the appropriate sound for a phase transition
 */
export function getTransitionSound(
  fromPhase: TimerPhase,
  toPhase: TimerPhase
): 'work-complete' | 'rest-complete' | 'session-complete' | null {
  // Ignore pause/resume transitions
  if (fromPhase === 'paused' || toPhase === 'paused') {
    return null
  }

  if (fromPhase === 'work' && toPhase === 'rest') {
    return 'work-complete'
  }

  if (fromPhase === 'rest' && toPhase === 'work') {
    return 'rest-complete'
  }

  if (toPhase === 'complete') {
    return 'session-complete'
  }

  return null
}

/**
 * Check if we should play warning sound (10 seconds before transition)
 */
export function shouldPlayWarning(timeRemaining: number): boolean {
  return timeRemaining >= 1 && timeRemaining <= 10
}

// Sound frequencies
const SOUND_FREQUENCIES = {
  'work-complete': 880, // A5 - higher, energetic
  'rest-complete': 523, // C5 - medium, alerting
  'warning': 440, // A4 - standard beep
  'session-complete': 1047, // C6 - celebration
}

// Singleton AudioContext for better mobile support
let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  
  if (!audioContext) {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioContext = new AudioContextClass()
    } catch {
      return null
    }
  }
  
  // Resume if suspended (common on mobile after tab switch)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }
  
  return audioContext
}

function playTone(frequency: number, duration: number = 200, type: OscillatorType = 'sine') {
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type
    
    const now = ctx.currentTime
    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000)

    oscillator.start(now)
    oscillator.stop(now + duration / 1000)
  } catch {
    // Audio not available
  }
}

/**
 * Hook for managing timer sounds and alerts
 */
export function useSound(): UseSoundReturn {
  const [isMuted, setIsMuted] = useState(false)
  const mutedRef = useRef(isMuted)

  useEffect(() => {
    mutedRef.current = isMuted
  }, [isMuted])

  // Unlock audio on mobile - call this on first user interaction
  const unlockAudio = useCallback(() => {
    const ctx = getAudioContext()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    // Play a silent tone to fully unlock
    if (ctx) {
      try {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        gainNode.gain.value = 0 // Silent
        oscillator.start()
        oscillator.stop(ctx.currentTime + 0.001)
      } catch {
        // Ignore
      }
    }
  }, [])

  const playWorkComplete = useCallback(() => {
    if (mutedRef.current) return
    // Play 5 descending beeps (work ending - time to rest!)
    const baseFreq = SOUND_FREQUENCIES['work-complete']
    for (let i = 0; i < 5; i++) {
      setTimeout(() => playTone(baseFreq * (1 - i * 0.05), 120), i * 150)
    }
  }, [])

  const playRestComplete = useCallback(() => {
    if (mutedRef.current) return
    // Play 5 ascending beeps (rest ending - back to work!)
    const baseFreq = SOUND_FREQUENCIES['rest-complete']
    for (let i = 0; i < 5; i++) {
      setTimeout(() => playTone(baseFreq * (1 + i * 0.08), 120, 'triangle'), i * 150)
    }
  }, [])

  const playWarning = useCallback(() => {
    if (mutedRef.current) return
    playTone(SOUND_FREQUENCIES['warning'], 100)
  }, [])

  const playSessionComplete = useCallback(() => {
    if (mutedRef.current) return
    // Play celebratory sequence
    playTone(523, 150) // C
    setTimeout(() => playTone(659, 150), 180) // E
    setTimeout(() => playTone(784, 150), 360) // G
    setTimeout(() => playTone(1047, 300), 540) // C (high)
  }, [])

  const handleSetMuted = useCallback((muted: boolean) => {
    setIsMuted(muted)
  }, [])

  return {
    playWorkComplete,
    playRestComplete,
    playWarning,
    playSessionComplete,
    setMuted: handleSetMuted,
    isMuted,
    unlockAudio,
  }
}
