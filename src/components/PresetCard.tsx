import type { TimerPreset } from '@/types/timer'
import { formatPresetDuration } from '@/utils/formatTime'

export interface PresetCardProps {
  preset: TimerPreset
  onSelect: (preset: TimerPreset) => void
  selected?: boolean
}

/**
 * Clickable preset timer configuration card
 */
export function PresetCard({ preset, onSelect, selected = false }: PresetCardProps) {
  const workDisplay = formatPresetDuration(preset.workDuration)
  const restDisplay = formatPresetDuration(preset.restDuration)

  return (
    <button
      type="button"
      onClick={() => onSelect(preset)}
      aria-pressed={selected}
      className={`
        flex flex-col items-center gap-1 p-4 rounded-xl min-w-[100px]
        transition-all duration-200
        ${selected
          ? 'bg-work/20 border-2 border-work shadow-glow-work'
          : 'bg-surface border-2 border-transparent hover:bg-surface-elevated hover:border-text-secondary/30'
        }
      `}
    >
      <span className="font-body font-semibold text-text-primary">
        {preset.name}
      </span>
      <span className="font-display text-lg text-text-secondary">
        {workDisplay}/{restDisplay}
      </span>
    </button>
  )
}
