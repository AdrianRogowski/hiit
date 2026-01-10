import { useState, useEffect } from 'react'
import type { TimerConfig, TimerPreset } from '@/types/timer'
import { validateConfig, calculateTotalTime } from '@/utils/parseTimerInput'
import { formatDuration } from '@/utils/formatTime'
import { DurationInput, PresetCard, Button } from '@/components'

export interface SetupPageProps {
  onStart: (config: TimerConfig) => void
}

const PRESETS: TimerPreset[] = [
  { id: 'pomodoro', name: 'Pomodoro', workDuration: 25 * 60, restDuration: 5 * 60, rounds: 4 },
  { id: 'chores', name: 'Chores', workDuration: 30 * 60, restDuration: 30 * 60, rounds: 5 },
  { id: 'hiit', name: 'HIIT', workDuration: 45, restDuration: 15, rounds: 10 },
  { id: 'tabata', name: 'Tabata', workDuration: 20, restDuration: 10, rounds: 8 },
]

/**
 * Timer setup/configuration page
 */
export function SetupPage({ onStart }: SetupPageProps) {
  const [workDuration, setWorkDuration] = useState(30 * 60)
  const [restDuration, setRestDuration] = useState(30 * 60)
  const [rounds, setRounds] = useState(5)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  // Calculate total time
  const totalTime = calculateTotalTime(workDuration, restDuration, rounds)

  // Validate on change
  useEffect(() => {
    const result = validateConfig(workDuration, restDuration, rounds)
    setError(result.error || null)
    setWarning(result.warning || null)
  }, [workDuration, restDuration, rounds])

  const handlePresetSelect = (preset: TimerPreset) => {
    setWorkDuration(preset.workDuration)
    setRestDuration(preset.restDuration)
    setRounds(preset.rounds)
    setSelectedPreset(preset.id)
    setError(null)
  }

  const handleStart = () => {
    const validation = validateConfig(workDuration, restDuration, rounds)
    if (!validation.valid) {
      setError(validation.error || 'Invalid configuration')
      return
    }

    onStart({
      workDuration,
      restDuration,
      totalRounds: rounds,
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-4xl text-text-primary mb-2">
          HIIT TIMER
        </h1>
        <p className="font-body text-text-secondary">
          Interval timer for work & rest
        </p>
      </div>

      {/* Main content - constrained width */}
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Duration inputs row */}
        <div className="grid grid-cols-2 gap-3">
          <DurationInput
            label="WORK"
            value={workDuration}
            onChange={(v) => { setWorkDuration(v); setSelectedPreset(null); }}
            min={5}
            max={120 * 60}
          />
          <DurationInput
            label="REST"
            value={restDuration}
            onChange={(v) => { setRestDuration(v); setSelectedPreset(null); }}
            min={5}
            max={120 * 60}
          />
        </div>

        {/* Rounds input */}
        <div className="flex flex-col items-center gap-2 p-4 bg-surface rounded-xl">
          <label className="font-body font-bold text-lg text-text-secondary tracking-wide">
            ROUNDS
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => { setRounds(Math.max(1, rounds - 1)); setSelectedPreset(null); }}
              disabled={rounds <= 1}
              aria-label="Decrease rounds"
              className="w-11 h-11 rounded-lg bg-surface-elevated text-text-primary font-bold text-2xl
                         hover:bg-work/20 active:bg-work/30 disabled:opacity-30 disabled:cursor-not-allowed
                         transition-colors flex-shrink-0"
            >
              −
            </button>
            <div className="flex flex-col items-center min-w-[100px]">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={rounds}
                onChange={(e) => {
                  const val = e.target.value
                  if (val === '' || /^\d+$/.test(val)) {
                    const num = parseInt(val) || 1
                    setRounds(Math.max(1, Math.min(99, num)))
                    setSelectedPreset(null)
                  }
                }}
                aria-label="Number of rounds"
                className="w-16 font-display font-bold text-4xl text-text-primary text-center
                           bg-transparent border-b-2 border-transparent
                           focus:border-work focus:outline-none
                           transition-colors"
              />
              <span className="font-body text-sm text-text-secondary text-center">
                {formatDuration(totalTime)} total
              </span>
            </div>
            <button
              type="button"
              onClick={() => { setRounds(rounds + 1); setSelectedPreset(null); }}
              disabled={rounds >= 99}
              aria-label="Increase rounds"
              className="w-11 h-11 rounded-lg bg-surface-elevated text-text-primary font-bold text-2xl
                         hover:bg-work/20 active:bg-work/30 disabled:opacity-30 disabled:cursor-not-allowed
                         transition-colors flex-shrink-0"
            >
              +
            </button>
          </div>
        </div>

        {/* Presets */}
        <div>
          <h2 className="font-body font-semibold text-text-secondary text-center mb-3">
            PRESETS
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onSelect={handlePresetSelect}
                selected={selectedPreset === preset.id}
              />
            ))}
          </div>
        </div>

        {/* Error/Warning messages */}
        {error && (
          <div className="p-4 bg-error/20 border border-error rounded-xl">
            <p className="font-body text-error text-center">{error}</p>
          </div>
        )}
        {warning && !error && (
          <div className="p-4 bg-warning/20 border border-warning rounded-xl">
            <p className="font-body text-warning text-center">{warning}</p>
          </div>
        )}

        {/* Start button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleStart}
          disabled={!!error}
          className="w-full text-xl py-5"
        >
          START TIMER
        </Button>
      </div>
    </div>
  )
}
