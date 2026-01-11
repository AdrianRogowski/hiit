import type { TimerConfig } from '@/types/timer'
import { formatDuration } from '@/utils/formatTime'
import { calculateTotalTime } from '@/utils/parseTimerInput'
import { Button } from '@/components'

export interface CompletePageProps {
  config: TimerConfig
  onStartAgain: () => void
  onNewTimer: () => void
}

/**
 * Session complete celebration page
 */
export function CompletePage({ config, onStartAgain, onNewTimer }: CompletePageProps) {
  const totalTime = calculateTotalTime(
    config.workDuration,
    config.restDuration,
    config.totalRounds
  )
  const workTime = config.workDuration * config.totalRounds
  // Final round has no rest, so rest time is (rounds - 1)
  const restTime = config.restDuration * Math.max(0, config.totalRounds - 1)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Celebration emoji */}
      <div className="text-8xl mb-6 animate-bounce">
        🎉
      </div>

      {/* Heading */}
      <h1 className="font-display font-bold text-4xl text-success mb-8">
        SESSION COMPLETE!
      </h1>

      {/* Stats card */}
      <div className="w-full max-w-sm bg-surface rounded-2xl p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="font-body text-text-secondary">Rounds</span>
            <span className="font-display font-bold text-2xl text-text-primary">
              {config.totalRounds}
            </span>
          </div>
          
          <div className="h-px bg-text-secondary/10" />
          
          <div className="flex justify-between items-center">
            <span className="font-body text-text-secondary">Work Time</span>
            <span className="font-display font-semibold text-lg text-work">
              {formatDuration(workTime)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-body text-text-secondary">Rest Time</span>
            <span className="font-display font-semibold text-lg text-rest">
              {formatDuration(restTime)}
            </span>
          </div>
          
          <div className="h-px bg-text-secondary/10" />
          
          <div className="flex justify-between items-center">
            <span className="font-body text-text-secondary">Total</span>
            <span className="font-display font-bold text-xl text-text-primary">
              {formatDuration(totalTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Button
          variant="primary"
          size="lg"
          onClick={onStartAgain}
          className="w-full"
        >
          Start Again
        </Button>
        
        <Button
          variant="secondary"
          size="lg"
          onClick={onNewTimer}
          className="w-full"
        >
          New Timer
        </Button>
      </div>
    </div>
  )
}
