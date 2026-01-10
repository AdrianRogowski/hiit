import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PresetCard } from './PresetCard'
import type { TimerPreset } from '@/types/timer'

const pomodoroPreset: TimerPreset = {
  id: 'pomodoro',
  name: 'Classic Pomodoro',
  workDuration: 25 * 60,
  restDuration: 5 * 60,
  rounds: 4,
}

describe('PresetCard', () => {
  describe('Scenario: Quick preset selection', () => {
    it('displays preset name', () => {
      render(<PresetCard preset={pomodoroPreset} onSelect={() => {}} />)
      
      expect(screen.getByText('Classic Pomodoro')).toBeInTheDocument()
    })

    it('displays work/rest duration summary', () => {
      render(<PresetCard preset={pomodoroPreset} onSelect={() => {}} />)
      
      // Should show something like "25/5" or "25 min / 5 min"
      expect(screen.getByText(/25/)).toBeInTheDocument()
      expect(screen.getByText(/5/)).toBeInTheDocument()
    })

    it('calls onSelect when clicked', async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      
      render(<PresetCard preset={pomodoroPreset} onSelect={onSelect} />)
      
      await user.click(screen.getByRole('button'))
      
      expect(onSelect).toHaveBeenCalledWith(pomodoroPreset)
    })

    it('shows selected state', () => {
      render(<PresetCard preset={pomodoroPreset} onSelect={() => {}} selected />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-pressed', 'true')
    })

    it('is keyboard accessible', async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      
      render(<PresetCard preset={pomodoroPreset} onSelect={onSelect} />)
      
      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard('{Enter}')
      
      expect(onSelect).toHaveBeenCalledWith(pomodoroPreset)
    })
  })
})
