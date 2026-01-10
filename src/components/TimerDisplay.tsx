import type { TimerPhase } from '@/types/timer'
import { formatTime } from '@/utils/formatTime'

export interface TimerDisplayProps {
  timeRemaining: number
  phase: TimerPhase
}

const phaseStyles: Record<TimerPhase, { text: string; label: string; glow: string }> = {
  work: {
    text: 'text-work',
    label: 'WORK',
    glow: 'shadow-glow-work',
  },
  rest: {
    text: 'text-rest',
    label: 'REST',
    glow: 'shadow-glow-rest',
  },
  paused: {
    text: 'text-paused',
    label: 'PAUSED',
    glow: '',
  },
  complete: {
    text: 'text-success',
    label: 'COMPLETE',
    glow: '',
  },
}

/**
 * Main countdown timer display component
 * Shows large, readable time in the appropriate color for current phase
 */
export function TimerDisplay({ timeRemaining, phase }: TimerDisplayProps) {
  const style = phaseStyles[phase]
  const displayTime = formatTime(timeRemaining)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Phase indicator */}
      <div className={`px-6 py-2 rounded-lg border-2 ${
        phase === 'work' ? 'border-work bg-work/10' :
        phase === 'rest' ? 'border-rest bg-rest/10' :
        phase === 'paused' ? 'border-paused bg-paused/10' :
        'border-success bg-success/10'
      }`}>
        <span className={`font-body font-bold text-xl tracking-widest ${style.text}`}>
          {style.label}
        </span>
      </div>

      {/* Timer display */}
      <div
        data-testid="timer-display"
        className={`
          font-display font-bold text-timer-giant
          ${style.text} ${style.glow}
          transition-all duration-500
          ${phase === 'paused' ? 'animate-pulse' : ''}
        `}
      >
        {displayTime}
      </div>
    </div>
  )
}
