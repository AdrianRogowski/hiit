import type { TimerPhase } from '@/types/timer'

export interface ProgressBarProps {
  /** Progress value from 0 to 1 */
  progress: number
  /** Current timer phase for theming */
  phase: TimerPhase
}

const phaseColors: Record<TimerPhase, string> = {
  work: 'bg-work',
  rest: 'bg-rest',
  paused: 'bg-paused',
  complete: 'bg-success',
}

/**
 * Session progress bar showing overall completion
 */
export function ProgressBar({ progress, phase }: ProgressBarProps) {
  const percentage = Math.round(progress * 100)
  const fillColor = phaseColors[phase]

  return (
    <div
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Session progress"
      className="w-full h-2 bg-surface rounded-full overflow-hidden"
    >
      <div
        data-testid="progress-fill"
        className={`h-full ${fillColor} transition-all duration-300 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
