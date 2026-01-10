export interface TimerControlsProps {
  isRunning: boolean
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onSkip: () => void
  onAddRound: () => void
  onRemoveRound: () => void
}

/**
 * Timer control buttons (pause, resume, stop, skip, adjust rounds)
 */
export function TimerControls({
  isRunning,
  isPaused,
  onPause,
  onResume,
  onStop,
  onSkip,
  onAddRound,
  onRemoveRound,
}: TimerControlsProps) {
  if (isPaused) {
    // Paused state: show resume, add/remove round, stop
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onRemoveRound}
            aria-label="Remove round"
            className="px-6 py-3 rounded-xl bg-surface text-text-primary font-body font-semibold
                       hover:bg-surface-elevated active:bg-error/20 transition-colors"
          >
            − Round
          </button>
          
          <button
            type="button"
            onClick={onResume}
            aria-label="Resume timer"
            className="px-8 py-4 rounded-xl bg-work text-white font-body font-bold text-lg
                       hover:bg-work/80 active:bg-work/60 shadow-glow-work transition-all"
          >
            ▶ Resume
          </button>
          
          <button
            type="button"
            onClick={onAddRound}
            aria-label="Add round"
            className="px-6 py-3 rounded-xl bg-surface text-text-primary font-body font-semibold
                       hover:bg-surface-elevated active:bg-success/20 transition-colors"
          >
            + Round
          </button>
        </div>
        
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop timer"
          className="px-6 py-3 rounded-xl bg-error/20 text-error font-body font-semibold
                     hover:bg-error/30 active:bg-error/40 transition-colors"
        >
          ◼ Stop
        </button>
      </div>
    )
  }

  // Running state: show skip, pause, stop
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onSkip}
        aria-label="Skip interval"
        className="px-6 py-3 rounded-xl bg-surface text-text-primary font-body font-semibold
                   hover:bg-surface-elevated active:bg-work/20 transition-colors"
      >
        Skip ▶▶
      </button>
      
      <button
        type="button"
        onClick={onPause}
        aria-label="Pause timer"
        className="px-8 py-4 rounded-xl bg-paused text-background font-body font-bold text-lg
                   hover:bg-paused/80 active:bg-paused/60 transition-colors"
      >
        ⏸ Pause
      </button>
      
      <button
        type="button"
        onClick={onStop}
        aria-label="Stop timer"
        className="px-6 py-3 rounded-xl bg-surface text-error font-body font-semibold
                   hover:bg-error/20 active:bg-error/30 transition-colors"
      >
        Stop ◼
      </button>
    </div>
  )
}
