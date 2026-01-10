# HIIT Timer 🏃‍♂️⏱️

A beautiful, high-contrast interval timer for Pomodoro-style work/rest sessions. Perfect for chores, workouts, or any activity that benefits from timed intervals.

![Timer Work State](docs/timer-work.png)

## Features

✅ **Natural Language Input** - Type "30 min on, 30 min off for 5 hours" and go  
✅ **Visual States** - Clear color-coded phases (orange=work, teal=rest, yellow=paused)  
✅ **Large, Readable Display** - Giant timer visible from across the room  
✅ **Sound Alerts** - Audio notifications for transitions (with mute option)  
✅ **Multi-Device Sync** - Share a URL to sync the timer across multiple devices  
✅ **Round Management** - Add/remove rounds mid-session  
✅ **Preset Configurations** - Quick-start with Pomodoro, Chores, or Workout presets  

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Usage

### Setup Your Timer

1. **Natural Language**: Type something like:
   - "30 minutes on, 30 minutes off for 5 hours"
   - "25 min on, 5 min off for 2 hours"
   - "45/15 for 4 rounds"

2. **Manual Input**: Use the +/- buttons to set:
   - Work duration (minutes)
   - Rest duration (minutes)
   - Number of rounds

3. **Presets**: Click a preset card:
   - **Pomodoro**: 25 min work / 5 min rest
   - **Chores**: 30 min work / 30 min rest
   - **Workout**: 45 min work / 15 min rest

### During Your Session

- **Skip**: Jump to the next interval
- **Pause/Resume**: Temporarily stop the timer
- **+/- Round**: Adjust total rounds while paused
- **Stop**: End the session early

### Multi-Device Sync

Click the "📱 devices connected" button to:
- Generate a shareable URL
- Scan the QR code with another device
- Hear alerts on ALL connected devices

## Tech Stack

- **React 19** + TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Vitest** + React Testing Library for tests
- **Web Audio API** for sounds
- **BroadcastChannel API** for local multi-tab sync

## Project Structure

```
src/
├── components/       # UI components
│   ├── TimerDisplay  # Main countdown display
│   ├── ProgressBar   # Session progress
│   ├── RoundIndicator# Round dots
│   └── ...
├── hooks/            # React hooks
│   ├── useTimer      # Timer state management
│   ├── useSound      # Audio playback
│   ├── useSync       # Multi-device sync
│   └── useNotifications
├── pages/            # Page components
│   ├── SetupPage     # Configuration
│   ├── TimerPage     # Active timer
│   └── CompletePage  # Session complete
├── utils/            # Utilities
│   ├── parseTimerInput # Natural language parsing
│   └── formatTime    # Time formatting
└── types/            # TypeScript types
```

## Design System

The app uses a bold, high-contrast design optimized for readability from 10+ feet away:

- **Background**: Near-black (#0D0D0D)
- **Work State**: Coral-orange (#FF6B35) with glow
- **Rest State**: Mint-teal (#00D9A5) with glow
- **Paused State**: Warm yellow (#FFD166)
- **Typography**: JetBrains Mono for timer, Outfit for UI text

See `.specs/design-system/tokens.md` for the full token reference.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

**151 tests** covering:
- Timer configuration parsing
- Timer state management
- Sound playback
- Multi-device sync
- All UI components

## Specs-Driven Development

This project uses a specs-driven workflow. See:
- `.specs/features/` - Gherkin feature specs
- `.specs/design-system/` - Design tokens and component docs
- `.specs/test-suites/` - Test documentation
- `.specs/mapping.md` - Feature ↔ Test ↔ Component mapping

## License

MIT
