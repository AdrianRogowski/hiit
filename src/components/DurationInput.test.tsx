import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DurationInput } from './DurationInput'

describe('DurationInput', () => {
  it('displays the label', () => {
    render(
      <DurationInput
        label="WORK"
        value={30 * 60}
        onChange={() => {}}
      />
    )
    
    expect(screen.getByText('WORK')).toBeInTheDocument()
  })

  it('displays minutes and seconds separately', () => {
    render(
      <DurationInput
        label="WORK"
        value={30 * 60 + 15} // 30:15
        onChange={() => {}}
      />
    )
    
    expect(screen.getByLabelText(/work minutes/i)).toHaveValue('30')
    expect(screen.getByLabelText(/work seconds/i)).toHaveValue('15')
  })

  it('allows typing minutes directly', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    
    render(
      <DurationInput
        label="WORK"
        value={30 * 60}
        onChange={onChange}
      />
    )
    
    const input = screen.getByLabelText(/work minutes/i)
    await user.clear(input)
    await user.type(input, '45')
    await user.tab() // blur to trigger onChange
    
    expect(onChange).toHaveBeenCalledWith(45 * 60)
  })

  it('allows typing seconds directly', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    
    render(
      <DurationInput
        label="WORK"
        value={60} // 1:00
        onChange={onChange}
      />
    )
    
    const input = screen.getByLabelText(/work seconds/i)
    await user.clear(input)
    await user.type(input, '30')
    await user.tab()
    
    expect(onChange).toHaveBeenCalledWith(90) // 1:30 = 90 seconds
  })

  it('increments value when + is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    
    render(
      <DurationInput
        label="WORK"
        value={30 * 60}
        onChange={onChange}
      />
    )
    
    await user.click(screen.getByRole('button', { name: /increase/i }))
    
    // Should increment by 1 minute when >= 1 min
    expect(onChange).toHaveBeenCalledWith(31 * 60)
  })

  it('increments by 5 seconds when under 1 minute', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    
    render(
      <DurationInput
        label="WORK"
        value={45} // 45 seconds
        onChange={onChange}
      />
    )
    
    await user.click(screen.getByRole('button', { name: /increase/i }))
    
    expect(onChange).toHaveBeenCalledWith(50) // +5 seconds
  })

  it('decrements value when - is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    
    render(
      <DurationInput
        label="WORK"
        value={30 * 60}
        onChange={onChange}
      />
    )
    
    await user.click(screen.getByRole('button', { name: /decrease/i }))
    
    expect(onChange).toHaveBeenCalledWith(29 * 60)
  })

  it('respects minimum value on buttons', async () => {
    const onChange = vi.fn()
    
    render(
      <DurationInput
        label="WORK"
        value={5} // 5 seconds
        onChange={onChange}
        min={5}
      />
    )
    
    const decreaseBtn = screen.getByRole('button', { name: /decrease/i })
    expect(decreaseBtn).toBeDisabled()
  })

  it('respects maximum value on buttons', async () => {
    const onChange = vi.fn()
    
    render(
      <DurationInput
        label="WORK"
        value={60 * 60}
        onChange={onChange}
        max={60 * 60}
      />
    )
    
    const increaseBtn = screen.getByRole('button', { name: /increase/i })
    expect(increaseBtn).toBeDisabled()
  })

  it('clamps seconds to 59 max', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    
    render(
      <DurationInput
        label="WORK"
        value={60}
        onChange={onChange}
      />
    )
    
    const input = screen.getByLabelText(/work seconds/i)
    await user.clear(input)
    await user.type(input, '99')
    await user.tab()
    
    // Should clamp to 59
    expect(onChange).toHaveBeenCalledWith(1 * 60 + 59) // 1:59
  })
})
