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
 * Icon-focused circular design matching the app's aesthetic
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
    // Paused state: show resume (primary), add/remove round, stop
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          {/* Remove round */}
          <button
            type="button"
            onClick={onRemoveRound}
            aria-label="Remove round"
            className="w-14 h-14 rounded-full border-2 border-text-secondary/30 
                       flex items-center justify-center
                       text-text-secondary hover:text-text-primary hover:border-text-primary/50
                       active:scale-95 transition-all"
          >
            <span className="text-2xl font-light">−</span>
          </button>
          
          {/* Resume (primary) */}
          <button
            type="button"
            onClick={onResume}
            aria-label="Resume timer"
            className={`w-20 h-20 rounded-full ${phaseColor} ${phaseGlow}
                       flex items-center justify-center
                       active:scale-95 transition-all`}
          >
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          
          {/* Add round */}
          <button
            type="button"
            onClick={onAddRound}
            aria-label="Add round"
            className="w-14 h-14 rounded-full border-2 border-text-secondary/30 
                       flex items-center justify-center
                       text-text-secondary hover:text-text-primary hover:border-text-primary/50
                       active:scale-95 transition-all"
          >
            <span className="text-2xl font-light">+</span>
          </button>
        </div>
        
        {/* Stop */}
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop timer"
          className="w-12 h-12 rounded-full border-2 border-error/50 
                     flex items-center justify-center
                     text-error hover:bg-error/10 hover:border-error
                     active:scale-95 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="1"/>
          </svg>
        </button>
      </div>
    )
  }

  // Running state: show skip, pause (primary), stop
  return (
    <div className="flex items-center gap-6">
      {/* Skip */}
      <button
        type="button"
        onClick={onSkip}
        aria-label="Skip interval"
        className="w-14 h-14 rounded-full border-2 border-text-secondary/30 
                   flex items-center justify-center
                   text-text-secondary hover:text-text-primary hover:border-text-primary/50
                   active:scale-95 transition-all"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 18l8.5-6L6 6v12zm8.5 0V6l8.5 6-8.5 6z"/>
        </svg>
      </button>
      
      {/* Pause (primary) */}
      <button
        type="button"
        onClick={onPause}
        aria-label="Pause timer"
        className={`w-20 h-20 rounded-full ${phaseColor} ${phaseGlow}
                   flex items-center justify-center
                   active:scale-95 transition-all`}
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      </button>
      
      {/* Stop */}
      <button
        type="button"
        onClick={onStop}
        aria-label="Stop timer"
        className="w-14 h-14 rounded-full border-2 border-text-secondary/30 
                   flex items-center justify-center
                   text-text-secondary hover:text-error hover:border-error/50
                   active:scale-95 transition-all"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="1"/>
        </svg>
      </button>
    </div>
  )
}
