/**
 * Timer configuration type
 */
export interface TimerConfig {
  workDuration: number // in seconds
  restDuration: number // in seconds
  totalRounds: number
}

/**
 * Timer state during active session
 */
export type TimerPhase = 'work' | 'rest' | 'paused' | 'complete'

export interface TimerState {
  phase: TimerPhase
  currentRound: number
  timeRemaining: number // in seconds
  totalRounds: number
  isRunning: boolean
  config: TimerConfig
}

/**
 * Preset timer configuration
 */
export interface TimerPreset {
  id: string
  name: string
  workDuration: number
  restDuration: number
  rounds: number
}

/**
 * Session sync state for multi-device
 */
export interface SyncSession {
  sessionId: string
  hostId: string
  connectedDevices: number
  state: TimerState
  lastUpdated: number
}

/**
 * Parse result from natural language input
 */
export interface ParsedTimerInput {
  workDuration: number | null
  restDuration: number | null
  totalTime: number | null
  totalRounds: number | null
  error?: string
}
