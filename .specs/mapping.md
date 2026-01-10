# Spec ↔ Test ↔ Code Mapping

**Last Updated**: 2026-01-10
**Last Drift Check**: 2026-01-10 ✅

## Features

### Timer Configuration

| Spec | Tests | Components |
|------|-------|------------|
| `features/timer/interval-timer.feature.md` | `src/pages/SetupPage.test.tsx` | `src/pages/SetupPage.tsx` |
| (Timer Configuration section) | `src/components/DurationInput.test.tsx` | `src/components/DurationInput.tsx` |
| | `src/components/PresetCard.test.tsx` | `src/components/PresetCard.tsx` |
| | `src/utils/parseTimerInput.test.ts` | `src/utils/parseTimerInput.ts` |
| | `src/utils/formatTime.test.ts` | `src/utils/formatTime.ts` |

### Active Timer Display

| Spec | Tests | Components |
|------|-------|------------|
| `features/timer/interval-timer.feature.md` | `src/pages/TimerPage.test.tsx` | `src/pages/TimerPage.tsx` |
| (Active Timer Display section) | `src/components/TimerDisplay.test.tsx` | `src/components/TimerDisplay.tsx` |
| | `src/components/ProgressBar.test.tsx` | `src/components/ProgressBar.tsx` |
| | `src/components/RoundIndicator.test.tsx` | `src/components/RoundIndicator.tsx` |

### Timer Controls

| Spec | Tests | Components |
|------|-------|------------|
| `features/timer/interval-timer.feature.md` | `src/pages/TimerPage.test.tsx` | `src/pages/TimerPage.tsx` |
| (Timer Controls section) | `src/components/TimerControls.test.tsx` | `src/components/TimerControls.tsx` |
| | `src/hooks/useTimer.test.ts` | `src/hooks/useTimer.ts` |

### Sound Alerts & Notifications

| Spec | Tests | Components |
|------|-------|------------|
| `features/timer/interval-timer.feature.md` | `src/hooks/useSound.test.ts` | `src/hooks/useSound.ts` |
| (Sound Alerts section) | `src/hooks/useNotifications.test.ts` | `src/hooks/useNotifications.ts` |

### Multi-Device Sync

| Spec | Tests | Components |
|------|-------|------------|
| `features/timer/interval-timer.feature.md` | `src/hooks/useSync.test.ts` | `src/hooks/useSync.ts` |
| (Multi-Device Sync section) | | `src/components/ShareModal.tsx` |

### Session Completion

| Spec | Tests | Components |
|------|-------|------------|
| `features/timer/interval-timer.feature.md` | | `src/pages/CompletePage.tsx` |
| (Session completion scenario) | | |

---

## Components

| Component | Spec Reference | Test File | Status |
|-----------|----------------|-----------|--------|
| `SetupPage` | Timer Configuration | `SetupPage.test.tsx` | ✅ |
| `TimerPage` | Active Timer Display, Timer Controls | `TimerPage.test.tsx` | ✅ |
| `CompletePage` | Session completion | - | ✅ (needs tests) |
| `DurationInput` | Timer Configuration | `DurationInput.test.tsx` | ✅ |
| `PresetCard` | Quick preset selection | `PresetCard.test.tsx` | ✅ |
| `TimerDisplay` | Work/Rest period display | `TimerDisplay.test.tsx` | ✅ |
| `ProgressBar` | Session progress bar | `ProgressBar.test.tsx` | ✅ |
| `RoundIndicator` | Round progression | `RoundIndicator.test.tsx` | ✅ |
| `TimerControls` | Timer Controls | `TimerControls.test.tsx` | ✅ |
| `Button` | (shared component) | - | ✅ |
| `Modal` | Stop confirmation | - | ✅ |
| `ShareModal` | Multi-Device Sync | - | ✅ |

---

## Hooks

| Hook | Spec Reference | Test File | Status |
|------|----------------|-----------|--------|
| `useTimer` | Timer Controls, Round progression | `useTimer.test.ts` | ✅ |
| `useSound` | Sound Alerts | `useSound.test.ts` | ✅ |
| `useNotifications` | Notifications | `useNotifications.test.ts` | ✅ |
| `useSync` | Multi-Device Sync | `useSync.test.ts` | ✅ |

---

## Utilities

| Utility | Spec Reference | Test File | Status |
|---------|----------------|-----------|--------|
| `parseTimerInput` | Timer Configuration | `parseTimerInput.test.ts` | ✅ |
| `formatTime` | Timer countdown display | `formatTime.test.ts` | ✅ |

---

## Test Coverage Summary

| Category | Tests | Passing |
|----------|-------|---------|
| Pages | 24 | ✅ |
| Components | 51 | ✅ |
| Hooks | 54 | ✅ |
| Utilities | 35 | ✅ |
| **Total** | **164** | ✅ |

---

## Recent Changes Log

### 2026-01-10 - Drift Reconciliation
- **Removed**: Natural language input scenario (intentional UX simplification)
- **Updated**: Minimum duration changed from 1 minute to 5 seconds
- **Updated**: Duration input now shows minutes:seconds format
- **Updated**: Presets changed from [Pomodoro, Chores, Workout] to [Pomodoro, Chores, HIIT, Tabata]
- **Added**: Seconds support throughout timer configuration
- **Added**: `formatPresetDuration()` utility for compact preset display
- **Deferred**: Session History, Save Favorite, Transition warning overlay

---

## Future Work (Deferred)

| Feature | Spec Section | Priority |
|---------|--------------|----------|
| Save as Favorite | Future Enhancements | Medium |
| Session History | Future Enhancements | Medium |
| Quick Restart | Future Enhancements | Medium |
| Transition Warning Overlay | Future Enhancements | Low |
| Host vs Guest Permissions | Future Enhancements | Low |
