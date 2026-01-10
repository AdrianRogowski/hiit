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

  describe('Scenario: Work period display', () => {
    it('shows large countdown timer', async () => {
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      await waitFor(() => {
        expect(screen.getByText('30:00')).toBeInTheDocument()
      })
    })

    it('shows work indicator', async () => {
      render(<TimerPage config={testConfig} onComplete={() => {}} onStop={() => {}} />)
      
      await waitFor(() => {
        expect(screen.getByText('WORK')).toBeInTheDocument()
      })
    })

    it('shows round indicator', async () => {
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
})
