import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerControls } from './TimerControls'

const defaultProps = {
  isRunning: true,
  isPaused: false,
  onPause: vi.fn(),
  onResume: vi.fn(),
  onStop: vi.fn(),
  onSkip: vi.fn(),
  onAddRound: vi.fn(),
  onRemoveRound: vi.fn(),
}

describe('TimerControls', () => {
  describe('Scenario: Pause timer', () => {
    it('shows pause button when running', () => {
      render(<TimerControls {...defaultProps} isRunning={true} isPaused={false} />)
      
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    })

    it('calls onPause when pause clicked', async () => {
      const user = userEvent.setup()
      const onPause = vi.fn()
      
      render(<TimerControls {...defaultProps} onPause={onPause} isRunning={true} isPaused={false} />)
      
      await user.click(screen.getByRole('button', { name: /pause/i }))
      
      expect(onPause).toHaveBeenCalled()
    })
  })

  describe('Scenario: Resume timer', () => {
    it('shows resume button when paused', () => {
      render(<TimerControls {...defaultProps} isRunning={false} isPaused={true} />)
      
      expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
    })

    it('calls onResume when resume clicked', async () => {
      const user = userEvent.setup()
      const onResume = vi.fn()
      
      render(<TimerControls {...defaultProps} onResume={onResume} isRunning={false} isPaused={true} />)
      
      await user.click(screen.getByRole('button', { name: /resume/i }))
      
      expect(onResume).toHaveBeenCalled()
    })
  })

  describe('Scenario: Stop timer early', () => {
    it('shows stop button', () => {
      render(<TimerControls {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
    })

    it('calls onStop when stop clicked', async () => {
      const user = userEvent.setup()
      const onStop = vi.fn()
      
      render(<TimerControls {...defaultProps} onStop={onStop} />)
      
      await user.click(screen.getByRole('button', { name: /stop/i }))
      
      expect(onStop).toHaveBeenCalled()
    })
  })

  describe('Scenario: Skip current interval', () => {
    it('shows skip button when running', () => {
      render(<TimerControls {...defaultProps} isRunning={true} />)
      
      expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
    })

    it('calls onSkip when skip clicked', async () => {
      const user = userEvent.setup()
      const onSkip = vi.fn()
      
      render(<TimerControls {...defaultProps} onSkip={onSkip} isRunning={true} />)
      
      await user.click(screen.getByRole('button', { name: /skip/i }))
      
      expect(onSkip).toHaveBeenCalled()
    })
  })

  describe('Scenario: Add/remove rounds when paused', () => {
    it('shows add/remove round buttons when paused', () => {
      render(<TimerControls {...defaultProps} isRunning={false} isPaused={true} />)
      
      expect(screen.getByRole('button', { name: /add.*round|\+.*round/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /remove.*round|-.*round/i })).toBeInTheDocument()
    })

    it('calls onAddRound when add clicked', async () => {
      const user = userEvent.setup()
      const onAddRound = vi.fn()
      
      render(<TimerControls {...defaultProps} onAddRound={onAddRound} isRunning={false} isPaused={true} />)
      
      await user.click(screen.getByRole('button', { name: /add.*round|\+.*round/i }))
      
      expect(onAddRound).toHaveBeenCalled()
    })

    it('calls onRemoveRound when remove clicked', async () => {
      const user = userEvent.setup()
      const onRemoveRound = vi.fn()
      
      render(<TimerControls {...defaultProps} onRemoveRound={onRemoveRound} isRunning={false} isPaused={true} />)
      
      await user.click(screen.getByRole('button', { name: /remove.*round|-.*round/i }))
      
      expect(onRemoveRound).toHaveBeenCalled()
    })
  })
})
