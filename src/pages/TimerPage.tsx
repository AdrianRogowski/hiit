import { useState, useEffect, useCallback } from 'react'
import type { TimerConfig } from '@/types/timer'
import { useTimer } from '@/hooks/useTimer'
import { useSound, getTransitionSound, shouldPlayWarning } from '@/hooks/useSound'
import { useNotifications } from '@/hooks/useNotifications'
import { calculateTotalTime } from '@/utils/parseTimerInput'
import {
  TimerDisplay,
  ProgressBar,
  RoundIndicator,
  TimerControls,
  Button,
  Modal,
} from '@/components'

export interface TimerPageProps {
  config: TimerConfig
  onComplete: () => void
  onStop: () => void
}

/**
 * Active timer page showing countdown and controls
 */
export function TimerPage({ config, onComplete, onStop }: TimerPageProps) {
  const timer = useTimer(config)
  const sound = useSound()
  const notifications = useNotifications()

  const [showStopConfirm, setShowStopConfirm] = useState(false)
  const [prevPhase, setPrevPhase] = useState(timer.state.phase)
  const [prevTimeRemaining, setPrevTimeRemaining] = useState(timer.state.timeRemaining)

  // Auto-start timer on mount
  useEffect(() => {
    // Unlock audio for mobile browsers (must happen after user interaction)
    sound.unlockAudio()
    
    timer.start()
    
    // Request notification permission
    if (notifications.permission === 'default') {
      notifications.requestPermission()
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle phase transitions - play sounds
  useEffect(() => {
    if (prevPhase !== timer.state.phase) {
      const transitionSound = getTransitionSound(prevPhase, timer.state.phase)
      
      if (transitionSound === 'work-complete') {
        sound.playWorkComplete()
        notifications.sendNotification('Rest Time!', 'Great work! Take a break.')
      } else if (transitionSound === 'rest-complete') {
        sound.playRestComplete()
        notifications.sendNotification('Work Time!', 'Break is over. Let\'s go!')
      } else if (transitionSound === 'session-complete') {
        sound.playSessionComplete()
        notifications.sendNotification('Session Complete!', 'You did it! 🎉')
      }

      setPrevPhase(timer.state.phase)
    }
  }, [timer.state.phase, prevPhase, sound, notifications])

  // Handle warning sounds
  useEffect(() => {
    if (
      timer.state.isRunning &&
      shouldPlayWarning(timer.state.timeRemaining) &&
      timer.state.timeRemaining !== prevTimeRemaining
    ) {
      sound.playWarning()
    }
    setPrevTimeRemaining(timer.state.timeRemaining)
  }, [timer.state.timeRemaining, timer.state.isRunning, prevTimeRemaining, sound])

  // Handle session complete
  useEffect(() => {
    if (timer.state.phase === 'complete') {
      onComplete()
    }
  }, [timer.state.phase, onComplete])

  // Calculate progress (continuous update every second)
  const totalSessionTime = calculateTotalTime(
    config.workDuration,
    config.restDuration,
    config.totalRounds
  )
  const elapsedTime = (() => {
    // Ready phase doesn't count toward session progress
    if (timer.state.phase === 'ready') {
      return 0
    }
    
    const completedRounds = timer.state.currentRound - 1
    // Completed rounds include work + rest, except the final completed round has no rest
    // But since we're calculating for completed rounds (before current), all have rest
    const completedTime = completedRounds * (config.workDuration + config.restDuration)
    
    let currentIntervalElapsed = 0
    if (timer.state.phase === 'work') {
      currentIntervalElapsed = config.workDuration - timer.state.timeRemaining
    } else if (timer.state.phase === 'rest') {
      currentIntervalElapsed = config.workDuration + (config.restDuration - timer.state.timeRemaining)
    } else if (timer.state.phase === 'paused') {
      // When paused, we don't know if we were in work or rest, but timeRemaining tells us
      // If timeRemaining > workDuration, we haven't started work yet (shouldn't happen)
      // Otherwise, assume we're partway through work
      currentIntervalElapsed = config.workDuration - timer.state.timeRemaining
    }
    
    return completedTime + Math.max(0, currentIntervalElapsed)
  })()
  const progress = Math.min(elapsedTime / totalSessionTime, 1)

  const handleStop = useCallback(() => {
    setShowStopConfirm(true)
  }, [])

  const confirmStop = useCallback(() => {
    setShowStopConfirm(false)
    onStop()
  }, [onStop])

  const handlePause = useCallback(() => {
    timer.pause()
  }, [timer])

  const handleResume = useCallback(() => {
    timer.resume()
  }, [timer])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar at top */}
      <div className="p-4">
        <ProgressBar progress={progress} phase={timer.state.phase} />
      </div>

      {/* Main timer area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4">
        <TimerDisplay
          timeRemaining={timer.state.timeRemaining}
          phase={timer.state.phase}
        />

        <RoundIndicator
          currentRound={timer.state.currentRound}
          totalRounds={timer.state.totalRounds}
        />

        <TimerControls
          isRunning={timer.state.isRunning}
          isPaused={timer.state.phase === 'paused'}
          phase={timer.state.phase}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          onSkip={timer.skip}
          onAddRound={timer.addRound}
          onRemoveRound={timer.removeRound}
        />
      </div>

      {/* Bottom bar - sound toggle */}
      <div className="flex items-center justify-center p-4 border-t border-text-secondary/10">
        <button
          type="button"
          onClick={() => sound.setMuted(!sound.isMuted)}
          aria-label={sound.isMuted ? 'Unmute sound' : 'Mute sound'}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     text-text-secondary hover:text-text-primary hover:bg-surface
                     transition-colors"
        >
          <span>{sound.isMuted ? '🔇' : '🔊'}</span>
          <span className="font-body text-sm">
            Sound {sound.isMuted ? 'Off' : 'On'}
          </span>
        </button>
      </div>

      {/* Stop confirmation modal */}
      <Modal
        isOpen={showStopConfirm}
        onClose={() => setShowStopConfirm(false)}
        title="End Session Early?"
      >
        <div className="flex flex-col gap-4">
          <p className="font-body text-text-secondary text-center">
            Are you sure you want to end this session?
            You've completed {timer.state.currentRound - 1} of {timer.state.totalRounds} rounds.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => setShowStopConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmStop}
            >
              Yes, End Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
