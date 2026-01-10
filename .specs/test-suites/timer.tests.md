# Timer Test Suite Documentation

**Test Runner**: Vitest
**Testing Library**: React Testing Library
**Last Updated**: 2026-01-10

## Overview

This test suite covers the HIIT Timer application with tests organized by feature area as defined in the Gherkin specifications.

---

## Test Files

| File | Category | Tests | Description |
|------|----------|-------|-------------|
| `src/utils/parseTimerInput.test.ts` | UT | 13 | Natural language parsing & validation |
| `src/utils/formatTime.test.ts` | UT | 10 | Time formatting utilities |
| `src/hooks/useTimer.test.ts` | HK | 15 | Timer state management |
| `src/hooks/useSound.test.ts` | HK | 11 | Sound playback & mute control |
| `src/hooks/useNotifications.test.ts` | HK | 4 | Browser notification handling |
| `src/hooks/useSync.test.ts` | HK | 10 | Multi-device synchronization |
| `src/components/TimerDisplay.test.tsx` | CMP | 10 | Timer countdown display |
| `src/components/ProgressBar.test.tsx` | CMP | 5 | Session progress bar |
| `src/components/RoundIndicator.test.tsx` | CMP | 7 | Round progress indicator |
| `src/components/DurationInput.test.tsx` | CMP | 7 | Duration input controls |
| `src/components/PresetCard.test.tsx` | CMP | 5 | Preset timer cards |
| `src/components/TimerControls.test.tsx` | CMP | 10 | Timer control buttons |
| `src/pages/SetupPage.test.tsx` | PG | 12 | Setup/configuration page |
| `src/pages/TimerPage.test.tsx` | PG | 10 | Active timer page |

**Total**: ~119 test cases

---

## Test Coverage by Scenario

### Timer Configuration

| Scenario | Test File | Status |
|----------|-----------|--------|
| Natural language input parsing | `parseTimerInput.test.ts` | ⏳ Failing |
| Explicit input configuration | `SetupPage.test.tsx` | ⏳ Failing |
| Quick preset selection | `PresetCard.test.tsx`, `SetupPage.test.tsx` | ⏳ Failing |
| Validation - minimum durations | `parseTimerInput.test.ts` | ⏳ Failing |
| Validation - reasonable limits | `parseTimerInput.test.ts` | ⏳ Failing |

### Active Timer Display

| Scenario | Test File | Status |
|----------|-----------|--------|
| Work period display | `TimerDisplay.test.tsx`, `TimerPage.test.tsx` | ⏳ Failing |
| Rest period display | `TimerDisplay.test.tsx` | ⏳ Failing |
| Timer countdown updates | `useTimer.test.ts`, `formatTime.test.ts` | ⏳ Failing |
| Round progression | `useTimer.test.ts`, `RoundIndicator.test.tsx` | ⏳ Failing |
| Session completion | `useTimer.test.ts` | ⏳ Failing |

### Timer Controls

| Scenario | Test File | Status |
|----------|-----------|--------|
| Pause timer | `useTimer.test.ts`, `TimerControls.test.tsx` | ⏳ Failing |
| Resume timer | `useTimer.test.ts`, `TimerControls.test.tsx` | ⏳ Failing |
| Stop timer early | `useTimer.test.ts`, `TimerControls.test.tsx`, `TimerPage.test.tsx` | ⏳ Failing |
| Skip current interval | `useTimer.test.ts`, `TimerControls.test.tsx` | ⏳ Failing |
| Add extra round | `useTimer.test.ts`, `TimerControls.test.tsx` | ⏳ Failing |
| Remove a round | `useTimer.test.ts`, `TimerControls.test.tsx` | ⏳ Failing |

### Sound Alerts & Notifications

| Scenario | Test File | Status |
|----------|-----------|--------|
| Work-to-rest transition sound | `useSound.test.ts` | ⏳ Failing |
| Rest-to-work transition sound | `useSound.test.ts` | ⏳ Failing |
| Warning before transition | `useSound.test.ts` | ⏳ Failing |
| Mute sounds | `useSound.test.ts` | ⏳ Failing |
| Sound in background | `useNotifications.test.ts` | ⏳ Failing |
| Request notification permission | `useNotifications.test.ts` | ⏳ Failing |

### Multi-Device Sync

| Scenario | Test File | Status |
|----------|-----------|--------|
| Generate shareable link | `useSync.test.ts` | ⏳ Failing |
| Join existing session | `useSync.test.ts` | ⏳ Failing |
| Real-time sync | `useSync.test.ts` | ⏳ Failing |
| Handle network latency | `useSync.test.ts` | ⏳ Failing |
| Device count indicator | `useSync.test.ts`, `TimerPage.test.tsx` | ⏳ Failing |
| Host vs guest permissions | `useSync.test.ts` | ⏳ Failing |

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/utils/parseTimerInput.test.ts

# Run tests with coverage
npm test -- --coverage
```

---

## Test IDs

| Prefix | Module |
|--------|--------|
| UT | Utilities (parseTimerInput, formatTime) |
| HK | Hooks (useTimer, useSound, useNotifications, useSync) |
| CMP | Components (TimerDisplay, ProgressBar, etc.) |
| PG | Pages (SetupPage, TimerPage) |
