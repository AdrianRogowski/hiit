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
        flex flex-col items-center justify-center gap-0.5 p-3 rounded-xl
        transition-all duration-200
        ${selected
          ? 'bg-work/20 border-2 border-work'
          : 'bg-surface border-2 border-transparent hover:bg-surface-elevated hover:border-text-secondary/30'
        }
      `}
    >
      <span className="font-body font-semibold text-sm text-text-primary">
        {preset.name}
      </span>
      <span className="font-display text-xs text-text-secondary">
        {workDisplay}/{restDisplay}
      </span>
    </button>
  )
}
