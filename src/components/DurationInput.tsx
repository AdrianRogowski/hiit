import { useState, useEffect } from 'react'

export interface DurationInputProps {
  label: string
  value: number // in seconds
  onChange: (value: number) => void
  min?: number
  max?: number
}

/**
 * Duration input with minutes and seconds fields
 * Compact layout with +/- buttons stacked vertically
 */
export function DurationInput({
  label,
  value,
  onChange,
  min = 5,
  max = 7200,
}: DurationInputProps) {
  const minutes = Math.floor(value / 60)
  const seconds = value % 60
  
  const [minInput, setMinInput] = useState(minutes.toString())
  const [secInput, setSecInput] = useState(seconds.toString().padStart(2, '0'))
  const [isFocused, setIsFocused] = useState(false)

  // Sync input values with prop when not focused
  useEffect(() => {
    if (!isFocused) {
      setMinInput(minutes.toString())
      setSecInput(seconds.toString().padStart(2, '0'))
    }
  }, [minutes, seconds, isFocused])

  const updateValue = (newMinutes: number, newSeconds: number) => {
    const totalSeconds = Math.max(min, Math.min(max, newMinutes * 60 + newSeconds))
    onChange(totalSeconds)
  }

  const handleIncrement = () => {
    // Increment by 1 minute if >= 1 min, otherwise by 5 seconds
    const increment = value >= 60 ? 60 : 5
    const newValue = value + increment
    if (newValue <= max) {
      onChange(newValue)
    }
  }

  const handleDecrement = () => {
    // Decrement by 1 minute if > 1 min, otherwise by 5 seconds
    const decrement = value > 60 ? 60 : 5
    const newValue = value - decrement
    if (newValue >= min) {
      onChange(newValue)
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '' || /^\d{0,3}$/.test(val)) {
      setMinInput(val)
    }
  }

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '' || /^\d{0,2}$/.test(val)) {
      setSecInput(val)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    const mins = parseInt(minInput) || 0
    const secs = Math.min(59, parseInt(secInput) || 0)
    updateValue(mins, secs)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-surface rounded-xl">
      <label className="font-body font-bold text-sm text-text-secondary tracking-wide">
        {label}
      </label>
      
      {/* Time display */}
      <div className="flex items-baseline justify-center">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={minInput}
          onChange={handleMinutesChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-label={`${label} minutes`}
          className="w-8 font-display font-bold text-2xl text-text-primary text-center
                     bg-transparent border-b-2 border-transparent
                     focus:border-work focus:outline-none
                     transition-colors"
        />
        <span className="font-display text-xl text-text-secondary">:</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={secInput}
          onChange={handleSecondsChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-label={`${label} seconds`}
          className="w-8 font-display font-bold text-2xl text-text-primary text-center
                     bg-transparent border-b-2 border-transparent
                     focus:border-work focus:outline-none
                     transition-colors"
        />
      </div>

      {/* +/- buttons row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Decrease duration"
          className="w-10 h-8 rounded-lg bg-surface-elevated text-text-primary font-bold text-xl
                     hover:bg-work/20 active:bg-work/30 disabled:opacity-30 disabled:cursor-not-allowed
                     transition-colors"
        >
          −
        </button>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Increase duration"
          className="w-10 h-8 rounded-lg bg-surface-elevated text-text-primary font-bold text-xl
                     hover:bg-work/20 active:bg-work/30 disabled:opacity-30 disabled:cursor-not-allowed
                     transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
