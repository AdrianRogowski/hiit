import { describe, it, expect } from 'vitest'
import {
  parseTimerInput,
  calculateRounds,
  calculateTotalTime,
  validateConfig,
} from './parseTimerInput'

describe('parseTimerInput', () => {
  describe('Scenario: Configure timer with natural language input', () => {
    it('parses "30 minutes on, 30 minutes off for 5 hours"', () => {
      const result = parseTimerInput('30 minutes on, 30 minutes off for 5 hours')
      
      expect(result.workDuration).toBe(30 * 60) // 30 minutes in seconds
      expect(result.restDuration).toBe(30 * 60) // 30 minutes in seconds
      expect(result.totalTime).toBe(5 * 60 * 60) // 5 hours in seconds
      expect(result.totalRounds).toBe(5) // 5 complete work+rest cycles
      expect(result.error).toBeUndefined()
    })

    it('parses "25 min on, 5 min off for 2 hours"', () => {
      const result = parseTimerInput('25 min on, 5 min off for 2 hours')
      
      expect(result.workDuration).toBe(25 * 60)
      expect(result.restDuration).toBe(5 * 60)
      expect(result.totalTime).toBe(2 * 60 * 60)
      expect(result.totalRounds).toBe(4) // 2 hours / 30 min per round = 4
    })

    it('parses "1 hour work, 30 minutes rest x 3"', () => {
      const result = parseTimerInput('1 hour work, 30 minutes rest x 3')
      
      expect(result.workDuration).toBe(60 * 60) // 1 hour
      expect(result.restDuration).toBe(30 * 60) // 30 min
      expect(result.totalRounds).toBe(3)
    })

    it('parses "45/15 for 4 rounds"', () => {
      const result = parseTimerInput('45/15 for 4 rounds')
      
      expect(result.workDuration).toBe(45 * 60)
      expect(result.restDuration).toBe(15 * 60)
      expect(result.totalRounds).toBe(4)
    })

    it('handles case insensitivity', () => {
      const result = parseTimerInput('30 MINUTES ON, 30 MINUTES OFF FOR 5 HOURS')
      
      expect(result.workDuration).toBe(30 * 60)
      expect(result.restDuration).toBe(30 * 60)
    })

    it('returns error for unparseable input', () => {
      const result = parseTimerInput('gobbledygook')
      
      expect(result.error).toBeDefined()
      expect(result.workDuration).toBeNull()
    })
  })
})

describe('calculateRounds', () => {
  it('calculates rounds from duration and total time', () => {
    // 30 min work + 30 min rest = 60 min per round
    // 5 hours = 300 minutes
    // 300 / 60 = 5 rounds
    const rounds = calculateRounds(30 * 60, 30 * 60, 5 * 60 * 60)
    expect(rounds).toBe(5)
  })

  it('calculates rounds with different durations', () => {
    // 25 min work + 5 min rest = 30 min per round
    // 2 hours = 120 minutes
    // 120 / 30 = 4 rounds
    const rounds = calculateRounds(25 * 60, 5 * 60, 2 * 60 * 60)
    expect(rounds).toBe(4)
  })

  it('rounds down partial rounds', () => {
    // 25 min work + 5 min rest = 30 min per round
    // 70 minutes total / 30 = 2.33 rounds -> 2
    const rounds = calculateRounds(25 * 60, 5 * 60, 70 * 60)
    expect(rounds).toBe(2)
  })
})

describe('calculateTotalTime', () => {
  it('calculates total time from duration and rounds', () => {
    // 30 min work + 30 min rest = 60 min per round
    // 5 rounds = 300 minutes = 5 hours
    const totalTime = calculateTotalTime(30 * 60, 30 * 60, 5)
    expect(totalTime).toBe(5 * 60 * 60)
  })

  it('calculates with different durations', () => {
    // 25 min work + 5 min rest = 30 min per round
    // 8 rounds = 240 minutes = 4 hours
    const totalTime = calculateTotalTime(25 * 60, 5 * 60, 8)
    expect(totalTime).toBe(4 * 60 * 60)
  })
})

describe('validateConfig', () => {
  describe('Scenario: Validation - minimum durations', () => {
    it('returns error for work duration below 5 seconds', () => {
      const result = validateConfig(3, 15, 4)
      
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Work duration must be at least 5 seconds')
    })

    it('returns error for 0 work duration', () => {
      const result = validateConfig(0, 15, 4)
      
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Work duration must be at least 5 seconds')
    })

    it('returns error for rest duration below 5 seconds', () => {
      const result = validateConfig(45, 3, 4)
      
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Rest duration must be at least 5 seconds')
    })

    it('returns error for 0 rounds', () => {
      const result = validateConfig(45, 15, 0)
      
      expect(result.valid).toBe(false)
      expect(result.error).toContain('at least 1')
    })

    it('accepts minimum valid configuration (5 seconds each)', () => {
      const result = validateConfig(5, 5, 1)
      
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('accepts standard HIIT timing (45s work, 15s rest)', () => {
      const result = validateConfig(45, 15, 10)
      
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('Scenario: Validation - reasonable limits', () => {
    it('returns warning for 24 hour total session', () => {
      // 6 hours work + 6 hours rest x 2 = 24 hours
      const result = validateConfig(6 * 60 * 60, 6 * 60 * 60, 2)
      
      expect(result.valid).toBe(true) // Still valid, just warning
      expect(result.warning).toBe("That's a long session! Are you sure?")
    })

    it('returns warning for sessions over 12 hours', () => {
      // 30 min + 30 min x 15 = 15 hours
      const result = validateConfig(30 * 60, 30 * 60, 15)
      
      expect(result.valid).toBe(true)
      expect(result.warning).toBeDefined()
    })

    it('no warning for reasonable session length', () => {
      const result = validateConfig(30 * 60, 30 * 60, 5) // 5 hours
      
      expect(result.valid).toBe(true)
      expect(result.warning).toBeUndefined()
    })
  })
})
