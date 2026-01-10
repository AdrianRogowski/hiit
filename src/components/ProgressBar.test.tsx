import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('displays progress visually', () => {
    render(<ProgressBar progress={0.5} phase="work" />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '50')
  })

  it('shows 0% progress at start', () => {
    render(<ProgressBar progress={0} phase="work" />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
  })

  it('shows 100% progress at completion', () => {
    render(<ProgressBar progress={1} phase="complete" />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  })

  it('applies work theme color', () => {
    render(<ProgressBar progress={0.5} phase="work" />)
    
    const fill = screen.getByTestId('progress-fill')
    expect(fill).toHaveClass('bg-work')
  })

  it('applies rest theme color', () => {
    render(<ProgressBar progress={0.5} phase="rest" />)
    
    const fill = screen.getByTestId('progress-fill')
    expect(fill).toHaveClass('bg-rest')
  })
})
