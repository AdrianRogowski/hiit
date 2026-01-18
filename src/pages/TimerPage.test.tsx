import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimerPage } from './TimerPage'
import type { TimerConfig } from '@/types/timer'

const testConfig: TimerConfig = {
  workDuration: 30 * 60,
  restDuration: 30 * 60,
  totalRounds: 5,
}

describe('TimerPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Scenario: Get ready countdown', () => {
    it('shows get ready countdown initially', async () => {
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      await waitFor(() => {
        expect(screen.getByText('00:10')).toBeInTheDocument()
      })
    })

    it('shows GET READY indicator', async () => {
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      await waitFor(() => {
        expect(screen.getByText('GET READY')).toBeInTheDocument()
      })
    })

    it('shows round indicator during get ready', async () => {
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      await waitFor(() => {
        expect(screen.getByText(/Round 1 of 5/i)).toBeInTheDocument()
      })
    })

    it('shows progress bar', async () => {
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
      })
    })
  })

  describe('Timer controls', () => {
    it('shows pause button', async () => {
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
      })
    })

    it('shows skip button', async () => {
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
      })
    })

    it('shows stop button', async () => {
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
      })
    })
  })

  describe('Scenario: Pause timer', () => {
    it('pauses and shows resume button', async () => {
      vi.useRealTimers() // Use real timers for user events
      const user = userEvent.setup()
      
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
      })
      
      // Click pause
      await user.click(screen.getByRole('button', { name: /pause/i }))
      
      // Should show resume button and PAUSED state
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
      })
      expect(screen.getByText('PAUSED')).toBeInTheDocument()
    })
  })

  describe('Scenario: Stop timer early', () => {
    it('calls onStop when stop confirmed', async () => {
      vi.useRealTimers() // Use real timers for user events
      const user = userEvent.setup()
      const onStop = vi.fn()
      
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={onStop} />)
      
      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
      })
      
      // Click stop
      await user.click(screen.getByRole('button', { name: /stop/i }))
      
      // Should show confirmation dialog
      await waitFor(() => {
        expect(screen.getByText(/End Session Early/i)).toBeInTheDocument()
      })
      
      // Click confirm
      await user.click(screen.getByRole('button', { name: /yes/i }))
      
      expect(onStop).toHaveBeenCalled()
    })
  })

  describe('Sound/mute', () => {
    it('shows sound toggle', async () => {
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sound|mute/i })).toBeInTheDocument()
      })
    })
  })

  describe('Regression: Progress bar updates when rounds change', () => {
    it('updates progress bar when adding a round while paused', async () => {
      vi.useRealTimers()
      const user = userEvent.setup()
      
      // Use short durations to make progress calculation clearer
      const shortConfig: TimerConfig = {
        workDuration: 20,
        restDuration: 10,
        totalRounds: 2, // Total: 20 + 10 + 20 = 50s
      }
      
      render(<TimerPage config={shortConfig} onComplete={() => {}} onStop={() => {}} />)
      
      // Wait for initial render and pause
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
      })
      await user.click(screen.getByRole('button', { name: /pause/i }))
      
      // Wait for pause state and get initial progress
      await waitFor(() => {
        expect(screen.getByText('PAUSED')).toBeInTheDocument()
      })
      
      const progressBar = screen.getByRole('progressbar')
      const initialWidth = progressBar.querySelector('div')?.style.width
      
      // Add a round (increases total time, so progress % should decrease)
      await user.click(screen.getByRole('button', { name: /add round/i }))
      
      // Verify round indicator updated
      await waitFor(() => {
        expect(screen.getByText(/Round 1 of 3/i)).toBeInTheDocument()
      })
      
      // Progress bar width should have changed (decreased since total time increased)
      const newWidth = progressBar.querySelector('div')?.style.width
      expect(newWidth).not.toBe(initialWidth)
    })

    it('updates progress bar when removing a round while paused', async () => {
      vi.useRealTimers()
      const user = userEvent.setup()
      
      const shortConfig: TimerConfig = {
        workDuration: 20,
        restDuration: 10,
        totalRounds: 4,
      }
      
      render(<TimerPage config={shortConfig} onComplete={() => {}} onStop={() => {}} />)
      
      // Wait for initial render and pause
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
      })
      await user.click(screen.getByRole('button', { name: /pause/i }))
      
      await waitFor(() => {
        expect(screen.getByText('PAUSED')).toBeInTheDocument()
      })
      
      const progressBar = screen.getByRole('progressbar')
      const initialWidth = progressBar.querySelector('div')?.style.width
      
      // Remove a round (decreases total time, so progress % should increase)
      await user.click(screen.getByRole('button', { name: /remove round/i }))
      
      // Verify round indicator updated
      await waitFor(() => {
        expect(screen.getByText(/Round 1 of 3/i)).toBeInTheDocument()
      })
      
      // Progress bar width should have changed (increased since total time decreased)
      const newWidth = progressBar.querySelector('div')?.style.width
      expect(newWidth).not.toBe(initialWidth)
    })
  })
})
