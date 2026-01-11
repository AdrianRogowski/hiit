import type { TimerPhase } from '@/types/timer'

export interface TimerControlsProps {
  isRunning: boolean
  isPaused: boolean
  phase: TimerPhase
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onSkip: () => void
  onAddRound: () => void
  onRemoveRound: () => void
}

/**
 * Timer control buttons (pause, resume, stop, skip, adjust rounds)
 * Icon-focused circular design with labels
 */
export function TimerControls({
  isRunning: _isRunning,
  isPaused,
  phase,
  onPause,
  onResume,
  onStop,
  onSkip,
  onAddRound,
  onRemoveRound,
}: TimerControlsProps) {
  // Get the phase color for the primary button
  const phaseColor = phase === 'work' || phase === 'ready' 
    ? 'bg-work hover:bg-work/80' 
    : phase === 'rest' 
    ? 'bg-rest hover:bg-rest/80' 
    : 'bg-paused hover:bg-paused/80'
  
  const phaseGlow = phase === 'work' || phase === 'ready'
    ? 'shadow-[0_0_20px_rgba(255,107,53,0.4)]'
    : phase === 'rest'
    ? 'shadow-[0_0_20px_rgba(0,217,165,0.4)]'
    : 'shadow-[0_0_20px_rgba(255,209,102,0.3)]'

  if (isPaused) {
    // Paused state: same layout as running but with resume instead of pause
    // Plus round adjustment buttons below
    return (
      <div className="flex flex-col items-center gap-6">
        {/* Main controls row */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Skip */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onSkip}
              aria-label="Skip interval"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full border-2 border-text-secondary/30 
                         flex items-center justify-center
                         text-text-secondary hover:text-text-primary hover:border-text-primary/50
                         active:scale-95 transition-all"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zm8.5 0V6l8.5 6-8.5 6z"/>
              </svg>
            </button>
            <span className="text-xs text-text-secondary font-body">Skip</span>
          </div>
          
          {/* Resume (primary) */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onResume}
              aria-label="Resume timer"
              className={`w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full ${phaseColor} ${phaseGlow}
                         flex items-center justify-center
                         active:scale-95 transition-all`}
            >
              <svg className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <span className="text-sm text-text-primary font-body font-medium">Resume</span>
          </div>
          
          {/* Stop */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop timer"
              className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full border-2 border-text-secondary/30 
                         flex items-center justify-center
                         text-text-secondary hover:text-error hover:border-error/50
                         active:scale-95 transition-all"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1"/>
              </svg>
            </button>
            <span className="text-xs text-text-secondary font-body">Stop</span>
          </div>
        </div>
        
        {/* Round adjustment row */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onRemoveRound}
            aria-label="Remove round"
            className="px-4 py-2 rounded-lg border border-text-secondary/30 
                       flex items-center gap-2
                       text-text-secondary hover:text-text-primary hover:border-text-primary/50
                       active:scale-95 transition-all"
          >
            <span className="text-lg">−</span>
            <span className="text-sm font-body">Round</span>
          </button>
          
          <button
            type="button"
            onClick={onAddRound}
            aria-label="Add round"
            className="px-4 py-2 rounded-lg border border-text-secondary/30 
                       flex items-center gap-2
                       text-text-secondary hover:text-text-primary hover:border-text-primary/50
                       active:scale-95 transition-all"
          >
            <span className="text-lg">+</span>
            <span className="text-sm font-body">Round</span>
          </button>
        </div>
      </div>
    )
  }

  // Running state: skip, pause (primary), stop - all with labels
  return (
    <div className="flex items-center gap-6 md:gap-8">
      {/* Skip */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onSkip}
          aria-label="Skip interval"
          className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full border-2 border-text-secondary/30 
                     flex items-center justify-center
                     text-text-secondary hover:text-text-primary hover:border-text-primary/50
                     active:scale-95 transition-all"
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zm8.5 0V6l8.5 6-8.5 6z"/>
          </svg>
        </button>
        <span className="text-xs text-text-secondary font-body">Skip</span>
      </div>
      
      {/* Pause (primary) */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onPause}
          aria-label="Pause timer"
          className={`w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full ${phaseColor} ${phaseGlow}
                     flex items-center justify-center
                     active:scale-95 transition-all`}
        >
          <svg className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
        <span className="text-sm text-text-primary font-body font-medium">Pause</span>
      </div>
      
      {/* Stop */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop timer"
          className="w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-full border-2 border-text-secondary/30 
                     flex items-center justify-center
                     text-text-secondary hover:text-error hover:border-error/50
                     active:scale-95 transition-all"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="1"/>
          </svg>
        </button>
        <span className="text-xs text-text-secondary font-body">Stop</span>
      </div>
    </div>
  )
}
