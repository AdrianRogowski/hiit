export interface RoundIndicatorProps {
  currentRound: number
  totalRounds: number
}

/**
 * Shows current round progress with text and dots
 */
export function RoundIndicator({ currentRound, totalRounds }: RoundIndicatorProps) {
  const dots = Array.from({ length: totalRounds }, (_, i) => {
    const roundNum = i + 1
    const isCompleted = roundNum < currentRound
    const isCurrent = roundNum === currentRound
    const isUpcoming = roundNum > currentRound

    let testId = 'round-dot-'
    if (isCompleted) testId += 'completed'
    else if (isCurrent) testId += 'current'
    else testId += 'upcoming'

    return (
      <div
        key={i}
        data-testid={testId}
        className={`
          w-3 h-3 rounded-full transition-all duration-300
          ${isCompleted ? 'bg-text-primary' : ''}
          ${isCurrent ? 'bg-text-primary ring-2 ring-text-primary ring-offset-2 ring-offset-background' : ''}
          ${isUpcoming ? 'bg-text-secondary/30' : ''}
        `}
      />
    )
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-body text-lg text-text-secondary">
        Round {currentRound} of {totalRounds}
      </p>
      <div className="flex gap-2">
        {dots}
      </div>
    </div>
  )
}
