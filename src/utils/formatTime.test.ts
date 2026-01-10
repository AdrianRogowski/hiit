import { describe, it, expect } from 'vitest'
import { formatTime, formatDuration, formatPresetDuration } from './formatTime'

describe('formatTime', () => {
  describe('Scenario: Display countdown timer', () => {
    it('formats seconds under 10 with leading zero', () => {
      expect(formatTime(5)).toBe('00:05')
    })

    it('formats minutes and seconds', () => {
      expect(formatTime(125)).toBe('02:05')
    })

    it('formats exactly one minute', () => {
      expect(formatTime(60)).toBe('01:00')
    })

    it('formats under one hour without hour display', () => {
      expect(formatTime(3599)).toBe('59:59')
    })

    it('formats one hour or more with hour display', () => {
      expect(formatTime(3600)).toBe('1:00:00')
    })

    it('formats multiple hours', () => {
      expect(formatTime(7325)).toBe('2:02:05')
    })

    it('handles zero', () => {
      expect(formatTime(0)).toBe('00:00')
    })
  })
})

describe('formatDuration', () => {
  describe('Scenario: Display human-readable duration', () => {
    it('formats zero as 0 seconds', () => {
      expect(formatDuration(0)).toBe('0 seconds')
    })

    it('formats seconds only', () => {
      expect(formatDuration(45)).toBe('45s')
    })

    it('formats minutes only', () => {
      expect(formatDuration(30 * 60)).toBe('30m')
    })

    it('formats minutes and seconds', () => {
      expect(formatDuration(90)).toBe('1m 30s')
    })

    it('formats hours only', () => {
      expect(formatDuration(3600)).toBe('1h')
    })

    it('formats hours and minutes', () => {
      expect(formatDuration(5400)).toBe('1h 30m')
    })

    it('does not show seconds when hours present', () => {
      expect(formatDuration(3665)).toBe('1h 1m')
    })
  })
})

describe('formatPresetDuration', () => {
  describe('Scenario: Display compact preset duration', () => {
    it('formats seconds only with leading zero for minutes', () => {
      expect(formatPresetDuration(45)).toBe('0:45')
    })

    it('formats whole minutes without seconds', () => {
      expect(formatPresetDuration(30 * 60)).toBe('30')
    })

    it('formats minutes and seconds', () => {
      expect(formatPresetDuration(90)).toBe('1:30')
    })
  })
})
