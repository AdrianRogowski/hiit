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
 * Responsive: smaller on mobile, larger on tablet/desktop
 */
export function TimerDisplay({ timeRemaining, phase }: TimerDisplayProps) {
  const style = phaseStyles[phase]
  const displayTime = formatTime(timeRemaining)

  return (
    <div className="flex flex-col items-center gap-3 md:gap-6">
      {/* Phase indicator */}
      <div className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full border-2 ${
        phase === 'ready' ? 'border-warning/50 bg-warning/10' :
        phase === 'work' ? 'border-work/50 bg-work/10' :
        phase === 'rest' ? 'border-rest/50 bg-rest/10' :
        phase === 'paused' ? 'border-paused/50 bg-paused/10' :
        'border-success/50 bg-success/10'
      }`}>
        <span className={`font-body font-bold text-lg md:text-xl lg:text-2xl tracking-widest ${style.text}`}>
          {style.label}
        </span>
      </div>

      {/* Timer display - responsive sizing: mobile -> tablet -> desktop */}
      <div
        data-testid="timer-display"
        className={`
          font-display font-bold leading-none
          text-7xl md:text-[10rem] lg:text-[14rem]
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
