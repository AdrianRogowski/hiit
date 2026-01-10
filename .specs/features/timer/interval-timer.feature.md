# Interval Timer (HIIT / Pomodoro Style)

**Source Files**: `src/pages/SetupPage.tsx`, `src/pages/TimerPage.tsx`, `src/pages/CompletePage.tsx`
**Design System**: `.specs/design-system/tokens.md`
**Created**: 2026-01-10
**Updated**: 2026-01-10

## Overview

A simple interval timer for alternating work/rest periods. Users can configure custom durations (minutes and seconds) and total rounds, then track progress with a large, room-visible countdown display. Includes sound alerts and browser notifications to alert you when intervals change.

---

## Feature: Timer Configuration

Users can set up their interval timer with custom work/rest durations and total rounds.

### Scenario: Configure timer with explicit inputs
Given I am on the timer setup screen
When I set work duration to 30 minutes 0 seconds
And I set rest duration to 30 minutes 0 seconds
And I set total rounds to 5
Then I should see the calculated total time of "5h"
And I should see a "Start Timer" button

### Scenario: Configure timer with seconds (for HIIT workouts)
Given I am on the timer setup screen
When I set work duration to 0 minutes 45 seconds
And I set rest duration to 0 minutes 15 seconds
And I set total rounds to 10
Then I should see the calculated total time of "10m"
And I should see a "Start Timer" button

### Scenario: Quick preset selection
Given I am on the timer setup screen
When I select the "Pomodoro" preset
Then the configuration should be set to:
  | Work Duration | 25 minutes |
  | Rest Duration | 5 minutes  |
  | Total Rounds  | 4          |

### Scenario: HIIT preset selection
Given I am on the timer setup screen
When I select the "HIIT" preset
Then the configuration should be set to:
  | Work Duration | 45 seconds |
  | Rest Duration | 15 seconds |
  | Total Rounds  | 10         |

### Scenario: Tabata preset selection
Given I am on the timer setup screen
When I select the "Tabata" preset
Then the configuration should be set to:
  | Work Duration | 20 seconds |
  | Rest Duration | 10 seconds |
  | Total Rounds  | 8          |

### Scenario: Validation - minimum durations
Given I am on the timer setup screen
When I try to set work duration below 5 seconds
Then I should see an error "Work duration must be at least 5 seconds"

When I try to set rest duration below 5 seconds
Then I should see an error "Rest duration must be at least 5 seconds"

### Scenario: Validation - reasonable limits
Given I am on the timer setup screen
When I configure a session totaling 12+ hours
Then I should see a warning "That's a long session! Are you sure?"

---

## Feature: Active Timer Display

The main timer screen shows a large countdown visible from across a room.

### Scenario: Get ready countdown before workout starts
Given I have pressed "Start Timer" on the setup screen
When the timer page loads
Then I should see a 10 second "GET READY" countdown
And the display should show the countdown (10, 9, 8... 1)
And I should see "GET READY" indicator
And I should see "Round 1 of X" (showing upcoming round)
And warning beeps should play each second during the countdown
When the countdown reaches 0
Then the ascending "back to work" chime should play
And the first work period should begin automatically

### Scenario: Work period display
Given the get ready countdown has completed
When the first work period begins
Then I should see the countdown in large text (readable from 10+ feet)
And the screen should have a work-state color theme (coral-orange)
And I should see "WORK" indicator
And I should see "Round 1 of 5" progress indicator
And I should see overall session progress bar

### Scenario: Rest period display
Given I am in an active timer session
When a rest period begins
Then I should see the countdown in large text
And the screen should have a rest-state color theme (mint-teal)
And I should see "REST" indicator
And the round counter should remain the same until next work period

### Scenario: Timer countdown updates
Given I am viewing an active timer
When each second passes
Then the displayed time should decrement by 1 second
And the display should show MM:SS format for times under 1 hour
And the display should show H:MM:SS format for times 1 hour or more

### Scenario: Round progression
Given I am on work round 2 of 5
When the work period ends
Then the rest period for round 2 should begin
And when rest ends, round 3 work period should begin
And the round indicator should update to "Round 3 of 5"

### Scenario: Session completion
Given I am on the final rest period
When the timer reaches 00:00
Then I should see a "Session Complete!" celebration screen
And I should hear a distinct completion sound
And I should see a summary of the completed session
And I should see options to "Start Again" or "New Timer"

---

## Feature: Timer Controls

Users can pause, resume, stop, and adjust the timer during a session.

### Scenario: Pause timer
Given an active timer is running
When I tap the pause button
Then the countdown should stop
And the screen should show a "PAUSED" state with yellow theme
And I should see "Resume" and "Stop" buttons
And I should see round adjustment controls (+/- round)

### Scenario: Resume timer
Given the timer is paused
When I tap the resume button
Then the countdown should continue from where it paused
And the work/rest theme should restore

### Scenario: Stop timer early
Given an active timer is running
When I tap the stop button
Then I should see a confirmation dialog "End Session Early?"
And if I confirm, I should return to the setup screen

### Scenario: Skip current interval
Given I am in a work period with 15 minutes remaining
When I tap the "Skip" button
Then the current interval should end
And the next interval should begin immediately

### Scenario: Add extra round mid-session
Given I am on round 3 of 5 and timer is paused
When I tap "+Round"
Then the total rounds should increase to 6
And the display should update to "Round 3 of 6"

### Scenario: Remove a round mid-session
Given I am on round 3 of 5 and timer is paused
When I tap "-Round"
Then the total rounds should decrease to 4
And the display should update to "Round 3 of 4"

---

## Feature: Sound Alerts & Notifications

Alert users when intervals change, especially important when away from the screen.

### Scenario: Work-to-rest transition sound
Given I am in a work period
When the work period ends
Then a distinct "work complete" sound should play
And a browser notification should appear saying "Rest Time!"

### Scenario: Rest-to-work transition sound  
Given I am in a rest period
When the rest period ends
Then a distinct "back to work" sound should play
And a browser notification should appear saying "Work Time!"

### Scenario: Warning before transition
Given I am 10 seconds before an interval ends
Then I should hear warning countdown beeps

### Scenario: Mute sounds
Given sounds are enabled
When I tap the sound/mute button
Then all sounds should be muted
And a visual indicator should show "Sound Off"

### Scenario: Sound persists in background
Given a timer is running
When I switch to another browser tab or app
Then sounds should still play when intervals change
And a browser notification should appear (if permitted)

### Scenario: Request notification permission
Given I start a timer for the first time
When the timer begins
Then I should be prompted to allow browser notifications
And if allowed, I will receive notifications even when tab is inactive

---

## Future Enhancements (Not Yet Implemented)

The following features are planned but not yet implemented:

### Multi-Device Sync
- [ ] Sync timer across multiple devices via shareable URL
- [ ] Generate QR code for easy mobile scanning
- [ ] Real-time sync of timer state (pause, skip, complete)
- [ ] Device count indicator showing connected devices
- [ ] Sounds play on ALL connected devices

### Session History & Quick Restart
- [ ] Save favorite configuration with custom name
- [ ] Quick restart last session from home screen
- [ ] Persist favorites to localStorage

### Transition Warning Overlay
- [ ] Show "GET READY FOR REST!" text overlay at 10 seconds
- [ ] Pulsing animation on timer display

---

## UI Mockup

### Setup Screen (Mobile/Tablet)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                        HIIT TIMER                           │
│                Interval timer for work & rest               │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  │
│  │         WORK            │  │         REST            │  │
│  │  [-]  30m : 00s   [+]   │  │  [-]  30m : 00s   [+]   │  │
│  └─────────────────────────┘  └─────────────────────────┘  │
│                                                             │
│           ┌─────────────────────────────────┐               │
│           │            ROUNDS               │               │
│           │       [-]    5    [+]           │               │
│           │         5h total                │               │
│           └─────────────────────────────────┘               │
│                                                             │
│                        PRESETS                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Pomodoro  │ │ Chores   │ │  HIIT    │ │ Tabata   │       │
│  │  25/5    │ │  30/30   │ │ 0:45/0:15│ │ 0:20/0:10│       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
│         ┌─────────────────────────────────────┐            │
│         │          START TIMER                │            │
│         └─────────────────────────────────────┘            │
│                                                             │
│  📱 Multi-Device Sync                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Active Timer - Work State

```
┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░  │ <- Progress
│                                                             │
│                     ╔═══════════════╗                       │
│                     ║     WORK      ║                       │
│                     ╚═══════════════╝                       │
│                                                             │
│                                                             │
│            ┌─────────────────────────────────┐              │
│            │                                 │              │
│            │           23:45                 │  <- Giant    │
│            │                                 │     timer    │
│            │      (color: work-orange)       │     text     │
│            │      (glow: work-glow)          │              │
│            └─────────────────────────────────┘              │
│                                                             │
│                                                             │
│                    Round  2  of  5                          │
│                    ●  ●  ○  ○  ○                            │
│                                                             │
│                                                             │
│   ┌─────────┐    ┌─────────────┐    ┌─────────┐            │
│   │  SKIP   │    │   ⏸ PAUSE   │    │  STOP   │            │
│   │   ▶▶    │    │             │    │   ◼     │            │
│   └─────────┘    └─────────────┘    └─────────┘            │
│                                                             │
│   🔊 Sound On        📱 3 devices connected                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Active Timer - Rest State

```
┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░  │
│                                                             │
│                     ╔═══════════════╗                       │
│                     ║     REST      ║                       │
│                     ╚═══════════════╝                       │
│                                                             │
│                                                             │
│            ┌─────────────────────────────────┐              │
│            │                                 │              │
│            │           18:32                 │              │
│            │                                 │              │
│            │      (color: rest-teal)         │              │
│            │      (glow: rest-glow)          │              │
│            └─────────────────────────────────┘              │
│                                                             │
│                                                             │
│                    Round  2  of  5                          │
│                    ●  ●  ○  ○  ○                            │
│                                                             │
│                                                             │
│   ┌─────────┐    ┌─────────────┐    ┌─────────┐            │
│   │  SKIP   │    │   ⏸ PAUSE   │    │  STOP   │            │
│   │   ▶▶    │    │             │    │   ◼     │            │
│   └─────────┘    └─────────────┘    └─────────┘            │
│                                                             │
│   🔊 Sound On        📱 3 devices connected                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Active Timer - Paused State

```
┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░  │
│                                                             │
│                     ╔═══════════════╗                       │
│                     ║    PAUSED     ║                       │
│                     ╚═══════════════╝                       │
│                                                             │
│                                                             │
│            ┌─────────────────────────────────┐              │
│            │                                 │              │
│            │           23:45                 │              │
│            │                                 │              │
│            │      (color: paused-yellow)     │              │
│            │      (pulsing animation)        │              │
│            └─────────────────────────────────┘              │
│                                                             │
│                                                             │
│                    Round  2  of  5                          │
│                    ●  ●  ○  ○  ○                            │
│                                                             │
│                                                             │
│   ┌─────────┐    ┌─────────────┐    ┌─────────┐            │
│   │ -ROUND  │    │  ▶ RESUME   │    │ +ROUND  │            │
│   │         │    │             │    │         │            │
│   └─────────┘    └─────────────┘    └─────────┘            │
│                                                             │
│                   ┌─────────────┐                           │
│                   │  ◼  STOP    │                           │
│                   └─────────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Device Share Modal

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           ┌─────────────────────────────────────┐           │
│           │                                     │           │
│           │      SYNC ACROSS DEVICES            │           │
│           │                                     │           │
│           │   ┌───────────────────────────┐     │           │
│           │   │                           │     │           │
│           │   │        [QR CODE]          │     │           │
│           │   │                           │     │           │
│           │   │    Scan with phone        │     │           │
│           │   │                           │     │           │
│           │   └───────────────────────────┘     │           │
│           │                                     │           │
│           │   ─────────── OR ───────────        │           │
│           │                                     │           │
│           │   [shareable URL]                   │           │
│           │   ┌──────────┐                      │           │
│           │   │   COPY   │                      │           │
│           │   └──────────┘                      │           │
│           │                                     │           │
│           │   📱 2 devices connected            │           │
│           │                                     │           │
│           │           [ CLOSE ]                 │           │
│           │                                     │           │
│           └─────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Session Complete Screen

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                         🎉                                  │
│                                                             │
│                   SESSION COMPLETE!                         │
│                                                             │
│            ┌─────────────────────────────────┐              │
│            │                                 │              │
│            │     5 rounds completed          │              │
│            │     2h 30m work time            │              │
│            │     2h 30m rest time            │              │
│            │     5h 00m total                │              │
│            │                                 │              │
│            └─────────────────────────────────┘              │
│                                                             │
│                                                             │
│        ┌─────────────────────────────────────┐              │
│        │          START AGAIN                │              │
│        │     (same configuration)            │              │
│        └─────────────────────────────────────┘              │
│                                                             │
│        ┌─────────────────────────────────────┐              │
│        │          NEW TIMER                  │              │
│        └─────────────────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component References

| Component | Status | File |
|-----------|--------|------|
| TimerDisplay | ✅ Implemented | `src/components/TimerDisplay.tsx` |
| ProgressBar | ✅ Implemented | `src/components/ProgressBar.tsx` |
| DurationInput | ✅ Implemented | `src/components/DurationInput.tsx` |
| Button | ✅ Implemented | `src/components/Button.tsx` |
| PresetCard | ✅ Implemented | `src/components/PresetCard.tsx` |
| Modal | ✅ Implemented | `src/components/Modal.tsx` |
| ShareModal | ✅ Implemented | `src/components/ShareModal.tsx` |
| RoundIndicator | ✅ Implemented | `src/components/RoundIndicator.tsx` |
| TimerControls | ✅ Implemented | `src/components/TimerControls.tsx` |

---

## Design Tokens Used

### Colors
- `color-background` - Main app background
- `color-surface` - Card backgrounds
- `color-work` - Work state theme (#FF6B35)
- `color-work-glow` - Work state glow
- `color-rest` - Rest state theme (#00D9A5)
- `color-rest-glow` - Rest state glow
- `color-paused` - Paused state (#FFD166)
- `color-text` - Primary text
- `color-text-secondary` - Labels, secondary info

### Typography
- `font-display` - Timer countdown numbers
- `font-body` - All other text
- `text-timer-giant` - Main countdown (8rem)
- `text-2xl` - State labels (WORK/REST)
- `text-lg` - Round indicators

### Spacing
- `spacing-4` - Button padding
- `spacing-6` - Card padding
- `spacing-8` - Section gaps

### Effects
- `shadow-glow-work` - Work state glow
- `shadow-glow-rest` - Rest state glow
- `transition-state` - Work/rest state change (800ms)

---

## Technical Implementation

### Duration Input
- Supports both minutes and seconds for fine-grained control
- Minimum duration: 5 seconds (for quick HIIT intervals)
- Maximum duration: 120 minutes
- +/- buttons increment by 1 minute when ≥60s, or 5 seconds when under 1 minute

### Presets
| Preset | Work | Rest | Rounds | Use Case |
|--------|------|------|--------|----------|
| Pomodoro | 25m | 5m | 4 | Focus work sessions |
| Chores | 30m | 30m | 5 | Household tasks |
| HIIT | 45s | 15s | 10 | High-intensity workout |
| Tabata | 20s | 10s | 8 | Classic Tabata protocol |

### Multi-Device Sync
- Uses BroadcastChannel API for same-origin tab sync
- Shareable URL encodes session config
- QR code for easy mobile scanning
- Device count updates in real-time

### Sound System
- Web Audio API for reliable playback
- Distinct sounds for work/rest/complete transitions
- Warning beeps at 10 seconds before transition
- Mute toggle persists during session

---

## Open Questions

- [ ] Should there be a "long rest" option (e.g., every 4 rounds)?
- [ ] Do you want saved favorites persisted to localStorage?
- [ ] What specific sounds/audio would you prefer for alerts?
- [ ] Do you want keyboard shortcuts (space for pause, etc.)?
- [ ] Should the app work offline (PWA)?
