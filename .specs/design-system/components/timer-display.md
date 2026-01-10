# TimerDisplay Component

**Status**: 📝 Stub (pending implementation)
**Created**: 2026-01-10

## Purpose

The main countdown timer display showing the remaining time in the current interval. Must be highly visible from across a room (10+ feet on a tablet).

## Visual States

- **Work**: `color-work` text with `shadow-glow-work`
- **Rest**: `color-rest` text with `shadow-glow-rest`
- **Paused**: `color-paused` text with pulsing animation

## Props

_To be documented after implementation_

## Tokens Used

- `font-display` - Monospace font for numbers
- `text-timer-giant` - 8rem font size
- `color-work`, `color-rest`, `color-paused`
- `shadow-glow-work`, `shadow-glow-rest`
- `transition-state` - For color transitions

## Accessibility

- Large text inherently accessible
- High contrast against dark background
- Consider reduced motion for animations
