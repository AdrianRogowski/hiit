/**
 * Formats seconds into display time string
 * - Under 1 hour: MM:SS
 * - 1 hour or more: H:MM:SS
 * 
 * @param seconds - Total seconds to format
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (hours >= 1) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`
  }
  
  return `${pad(minutes)}:${pad(secs)}`
}

/**
 * Formats duration in seconds to human readable string
 * e.g., 3600 -> "1 hour", 1800 -> "30 minutes", 45 -> "45 seconds"
 * 
 * @param seconds - Duration in seconds
 * @returns Human readable duration string
 */
export function formatDuration(seconds: number): string {
  if (seconds === 0) {
    return '0 seconds'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []

  if (hours > 0) {
    parts.push(`${hours}h`)
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`)
  }

  if (secs > 0 && hours === 0) {
    // Only show seconds if under 1 hour
    parts.push(`${secs}s`)
  }

  return parts.join(' ') || '0s'
}

/**
 * Formats duration for preset display (compact)
 * e.g., 45 seconds -> "0:45", 30 minutes -> "30:00"
 */
export function formatPresetDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  if (minutes === 0) {
    return `0:${secs.toString().padStart(2, '0')}`
  }
  
  if (secs === 0) {
    return `${minutes}`
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
