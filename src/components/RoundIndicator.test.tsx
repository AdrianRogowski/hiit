import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RoundIndicator } from './RoundIndicator'

describe('RoundIndicator', () => {
  it('displays current round and total', () => {
    render(<RoundIndicator currentRound={2} totalRounds={5} />)
    
    expect(screen.getByText(/Round 2 of 5/i)).toBeInTheDocument()
  })

  it('shows visual dots for rounds', () => {
    render(<RoundIndicator currentRound={3} totalRounds={5} />)
    
    const dots = screen.getAllByTestId(/round-dot/)
    expect(dots).toHaveLength(5)
  })

  it('highlights completed rounds', () => {
    render(<RoundIndicator currentRound={3} totalRounds={5} />)
    
    const completedDots = screen.getAllByTestId('round-dot-completed')
    // Rounds 1 and 2 should be marked as completed (before current)
    expect(completedDots.length).toBe(2)
  })

  it('highlights current round', () => {
    render(<RoundIndicator currentRound={3} totalRounds={5} />)
    
    const currentDot = screen.getByTestId('round-dot-current')
    expect(currentDot).toBeInTheDocument()
  })

  it('shows upcoming rounds as empty', () => {
    render(<RoundIndicator currentRound={2} totalRounds={5} />)
    
    const upcomingDots = screen.getAllByTestId('round-dot-upcoming')
    // Rounds 3, 4, 5 should be upcoming
    expect(upcomingDots.length).toBe(3)
  })

  it('updates when round changes', () => {
    const { rerender } = render(<RoundIndicator currentRound={1} totalRounds={5} />)
    
    expect(screen.getByText(/Round 1 of 5/i)).toBeInTheDocument()
    
    rerender(<RoundIndicator currentRound={2} totalRounds={5} />)
    
    expect(screen.getByText(/Round 2 of 5/i)).toBeInTheDocument()
  })

  it('handles single round', () => {
    render(<RoundIndicator currentRound={1} totalRounds={1} />)
    
    expect(screen.getByText(/Round 1 of 1/i)).toBeInTheDocument()
  })
})
