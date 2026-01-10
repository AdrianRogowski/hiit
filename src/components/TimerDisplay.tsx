import type { TimerPhase } from '@/types/timer'
import { formatTime } from '@/utils/formatTime'

export interface TimerDisplayProps {
  timeRemaining: number
  phase: TimerPhase
}

const phaseStyles: Record<TimerPhase, { text: string; label: string; glow: string }> = {
  ready: {
    text: 'text-warning',
    label: 'GET READY',
    glow: 'text-glow-ready',
  },
  work: {
    text: 'text-work',
    label: 'WORK',
    glow: 'text-glow-work',
  },
  rest: {
    text: 'text-rest',
    label: 'REST',
    glow: 'text-glow-rest',
  },
  paused: {
    text: 'text-paused',
    label: 'PAUSED',
    glow: 'text-glow-paused',
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
    <div className="flex flex-col items-center gap-6">
      {/* Phase indicator */}
      <div className={`px-6 py-2 rounded-full border-2 ${
        phase === 'ready' ? 'border-warning/50 bg-warning/10' :
        phase === 'work' ? 'border-work/50 bg-work/10' :
        phase === 'rest' ? 'border-rest/50 bg-rest/10' :
        phase === 'paused' ? 'border-paused/50 bg-paused/10' :
        'border-success/50 bg-success/10'
      }`}>
        <span className={`font-body font-bold text-xl tracking-widest ${style.text}`}>
          {style.label}
        </span>
      </div>

      {/* Timer display - just the glowing numbers */}
      <div
        data-testid="timer-display"
        className={`
          font-display font-bold text-timer-giant leading-none
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
