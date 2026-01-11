import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SetupPage } from './SetupPage'

describe('SetupPage', () => {
  describe('Scenario: Configure timer with explicit inputs', () => {
    it('shows work duration input', () => {
      render(<SetupPage onStart={() => {}} />)
      
      expect(screen.getByText('WORK')).toBeInTheDocument()
    })

    it('shows rest duration input', () => {
      render(<SetupPage onStart={() => {}} />)
      
      expect(screen.getByText('REST')).toBeInTheDocument()
    })

    it('shows rounds input', () => {
      render(<SetupPage onStart={() => {}} />)
      
      expect(screen.getByText('ROUNDS')).toBeInTheDocument()
    })

    it('shows calculated total time', () => {
      render(<SetupPage onStart={() => {}} />)
      
      // Should show total time in the display
      expect(screen.getByText(/total/i)).toBeInTheDocument()
    })

    it('shows calculated work time', () => {
      render(<SetupPage onStart={() => {}} />)
      
      // Should show work time in addition to total time
      // Default: 30min work × 5 rounds = 2h 30m work
      expect(screen.getByText(/2h 30m work/i)).toBeInTheDocument()
    })

    it('allows typing duration minutes', async () => {
      const user = userEvent.setup()
      
      render(<SetupPage onStart={() => {}} />)
      
      // Find the work duration minutes input and type a value
      const workInput = screen.getByLabelText(/work minutes/i)
      await user.clear(workInput)
      await user.type(workInput, '45')
      await user.tab()
      
      expect(workInput).toHaveValue('45')
    })

    it('allows typing duration seconds', async () => {
      const user = userEvent.setup()
      
      render(<SetupPage onStart={() => {}} />)
      
      const secInput = screen.getByLabelText(/work seconds/i)
      await user.clear(secInput)
      await user.type(secInput, '30')
      await user.tab()
      
      expect(secInput).toHaveValue('30')
    })
  })

  describe('Scenario: Quick preset selection', () => {
    it('shows preset options', () => {
      render(<SetupPage onStart={() => {}} />)
      
      expect(screen.getByText('PRESETS')).toBeInTheDocument()
      expect(screen.getByText('Pomodoro')).toBeInTheDocument()
    })

    it('shows HIIT preset for short intervals', () => {
      render(<SetupPage onStart={() => {}} />)
      
      expect(screen.getByText('HIIT')).toBeInTheDocument()
      expect(screen.getByText('Tabata')).toBeInTheDocument()
    })

    it('selects preset and updates configuration', async () => {
      const user = userEvent.setup()
      
      render(<SetupPage onStart={() => {}} />)
      
      await user.click(screen.getByText('Pomodoro'))
      
      // Should update to Pomodoro values (25/5)
      expect(screen.getByLabelText(/work minutes/i)).toHaveValue('25')
    })
  })

  describe('Start button', () => {
    it('shows start timer button', () => {
      render(<SetupPage onStart={() => {}} />)
      
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    })

    it('calls onStart with config when clicked', async () => {
      const user = userEvent.setup()
      const onStart = vi.fn()
      
      render(<SetupPage onStart={onStart} />)
      
      await user.click(screen.getByRole('button', { name: /start/i }))
      
      expect(onStart).toHaveBeenCalledWith(
        expect.objectContaining({
          workDuration: expect.any(Number),
          restDuration: expect.any(Number),
          totalRounds: expect.any(Number),
        })
      )
    })

    it('start button is enabled with valid config', () => {
      render(<SetupPage onStart={() => {}} />)
      
      const startButton = screen.getByRole('button', { name: /start/i })
      expect(startButton).not.toBeDisabled()
    })
  })

})
