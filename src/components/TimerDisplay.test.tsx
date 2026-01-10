import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimerDisplay } from './TimerDisplay'

describe('TimerDisplay', () => {
  describe('Scenario: Get ready countdown', () => {
    it('shows GET READY indicator', () => {
      render(<TimerDisplay timeRemaining={10} phase="ready" />)
      
      expect(screen.getByText(/get ready/i)).toBeInTheDocument()
    })

    it('applies warning color theme', () => {
      render(<TimerDisplay timeRemaining={10} phase="ready" />)
      
      const timer = screen.getByTestId('timer-display')
      expect(timer).toHaveClass('text-warning')
    })

    it('displays countdown time', () => {
      render(<TimerDisplay timeRemaining={10} phase="ready" />)
      
      expect(screen.getByText('00:10')).toBeInTheDocument()
    })
  })

  describe('Scenario: Work period display', () => {
    it('displays time in large text', () => {
      render(<TimerDisplay timeRemaining={23 * 60 + 45} phase="work" />)
      
      expect(screen.getByText('23:45')).toBeInTheDocument()
    })

    it('applies work state color theme', () => {
      render(<TimerDisplay timeRemaining={30 * 60} phase="work" />)
      
      const timer = screen.getByTestId('timer-display')
      expect(timer).toHaveClass('text-work')
    })

    it('shows WORK indicator', () => {
      render(<TimerDisplay timeRemaining={30 * 60} phase="work" />)
      
      expect(screen.getByText(/work/i)).toBeInTheDocument()
    })
  })

  describe('Scenario: Rest period display', () => {
    it('displays time correctly', () => {
      render(<TimerDisplay timeRemaining={18 * 60 + 32} phase="rest" />)
      
      expect(screen.getByText('18:32')).toBeInTheDocument()
    })

    it('applies rest state color theme', () => {
      render(<TimerDisplay timeRemaining={30 * 60} phase="rest" />)
      
      const timer = screen.getByTestId('timer-display')
      expect(timer).toHaveClass('text-rest')
    })

    it('shows REST indicator', () => {
      render(<TimerDisplay timeRemaining={30 * 60} phase="rest" />)
      
      expect(screen.getByText(/rest/i)).toBeInTheDocument()
    })
  })

  describe('Scenario: Paused state', () => {
    it('shows PAUSED indicator', () => {
      render(<TimerDisplay timeRemaining={23 * 60 + 45} phase="paused" />)
      
      expect(screen.getByText(/paused/i)).toBeInTheDocument()
    })

    it('applies paused color theme', () => {
      render(<TimerDisplay timeRemaining={30 * 60} phase="paused" />)
      
      const timer = screen.getByTestId('timer-display')
      expect(timer).toHaveClass('text-paused')
    })
  })

  describe('Time formatting', () => {
    it('shows MM:SS for times under 1 hour', () => {
      render(<TimerDisplay timeRemaining={5 * 60 + 30} phase="work" />)
      
      expect(screen.getByText('05:30')).toBeInTheDocument()
    })

    it('shows H:MM:SS for times 1 hour or more', () => {
      render(<TimerDisplay timeRemaining={60 * 60 + 30 * 60 + 45} phase="work" />)
      
      expect(screen.getByText('1:30:45')).toBeInTheDocument()
    })

    it('shows 00:00 when time is up', () => {
      render(<TimerDisplay timeRemaining={0} phase="work" />)
      
      expect(screen.getByText('00:00')).toBeInTheDocument()
    })
  })
})
