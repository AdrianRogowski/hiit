import type { ParsedTimerInput } from '@/types/timer'

/**
 * Parses natural language input like "30 minutes on, 30 minutes off for 5 hours"
 * into a structured timer configuration.
 * 
 * @param input - Natural language string describing timer configuration
 * @returns Parsed timer configuration or error
 */
export function parseTimerInput(input: string): ParsedTimerInput {
  const normalized = input.toLowerCase().trim()
  
  // Pattern for "X min/minutes/hour on, Y min/minutes/hour off for Z hours/rounds"
  const fullPattern = /(\d+)\s*(min(?:utes?)?|hours?|sec(?:onds?)?)\s*(?:on|work)[,\s]+(\d+)\s*(min(?:utes?)?|hours?|sec(?:onds?)?)\s*(?:off|rest)\s*(?:for\s*)?(\d+)\s*(hours?|rounds?)/i
  
  // Pattern for "X/Y for Z rounds" shorthand
  const shortPattern = /(\d+)\/(\d+)\s*(?:for\s*)?(\d+)\s*rounds?/i
  
  // Pattern for "X min work, Y min rest x Z"
  const altPattern = /(\d+)\s*(min(?:utes?)?|hours?|sec(?:onds?)?)\s*work[,\s]+(\d+)\s*(min(?:utes?)?|hours?|sec(?:onds?)?)\s*rest\s*x\s*(\d+)/i

  let workDuration: number | null = null
  let restDuration: number | null = null
  let totalTime: number | null = null
  let totalRounds: number | null = null

  const toSeconds = (value: number, unit: string): number => {
    if (unit.startsWith('hour')) {
      return value * 3600
    }
    if (unit.startsWith('sec')) {
      return value
    }
    return value * 60 // minutes
  }

  // Try full pattern first
  let match = normalized.match(fullPattern)
  if (match) {
    workDuration = toSeconds(parseInt(match[1]), match[2])
    restDuration = toSeconds(parseInt(match[3]), match[4])
    const timeValue = parseInt(match[5])
    const timeUnit = match[6]
    
    if (timeUnit.startsWith('hour')) {
      totalTime = timeValue * 3600
      // Calculate rounds from total time
      const roundDuration = workDuration + restDuration
      totalRounds = Math.floor(totalTime / roundDuration)
    } else {
      totalRounds = timeValue
      totalTime = (workDuration + restDuration) * totalRounds
    }
    
    return { workDuration, restDuration, totalTime, totalRounds }
  }

  // Try short pattern
  match = normalized.match(shortPattern)
  if (match) {
    workDuration = parseInt(match[1]) * 60
    restDuration = parseInt(match[2]) * 60
    totalRounds = parseInt(match[3])
    totalTime = (workDuration + restDuration) * totalRounds
    
    return { workDuration, restDuration, totalTime, totalRounds }
  }

  // Try alternative pattern
  match = normalized.match(altPattern)
  if (match) {
    workDuration = toSeconds(parseInt(match[1]), match[2])
    restDuration = toSeconds(parseInt(match[3]), match[4])
    totalRounds = parseInt(match[5])
    totalTime = (workDuration + restDuration) * totalRounds
    
    return { workDuration, restDuration, totalTime, totalRounds }
  }

  // Could not parse
  return {
    workDuration: null,
    restDuration: null,
    totalTime: null,
    totalRounds: null,
    error: 'Could not parse timer configuration. Try: "30 min on, 30 min off for 5 hours"',
  }
}

/**
 * Calculates total rounds from work/rest duration and total time
 */
export function calculateRounds(
  workDuration: number,
  restDuration: number,
  totalTime: number
): number {
  const roundDuration = workDuration + restDuration
  if (roundDuration <= 0) return 0
  return Math.floor(totalTime / roundDuration)
}

/**
 * Calculates total session time from work/rest duration and rounds
 * Note: Final round has no rest period, so rest is (rounds - 1)
 */
export function calculateTotalTime(
  workDuration: number,
  restDuration: number,
  rounds: number
): number {
  // Work time for all rounds + rest time for all but the last round
  return (workDuration * rounds) + (restDuration * Math.max(0, rounds - 1))
}

/**
 * Validates timer configuration
 */
export function validateConfig(
  workDuration: number,
  restDuration: number,
  rounds: number
): { valid: boolean; error?: string; warning?: string } {
  // Check minimum durations (5 seconds minimum)
  if (workDuration < 5) {
    return { valid: false, error: 'Work duration must be at least 5 seconds' }
  }
  
  if (restDuration < 5) {
    return { valid: false, error: 'Rest duration must be at least 5 seconds' }
  }
  
  if (rounds < 1) {
    return { valid: false, error: 'Must have at least 1 round' }
  }

  // Check for very long sessions (warning, not error)
  const totalTime = calculateTotalTime(workDuration, restDuration, rounds)
  const twelveHours = 12 * 60 * 60
  
  if (totalTime >= twelveHours) {
    return { valid: true, warning: "That's a long session! Are you sure?" }
  }

  return { valid: true }
}
