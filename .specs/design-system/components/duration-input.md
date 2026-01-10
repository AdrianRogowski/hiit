# DurationInput Component

**Status**: ✅ Documented
**Source**: `src/components/DurationInput.tsx`
**Test**: `src/components/DurationInput.test.tsx`

## Purpose

Input control for setting time durations with separate minutes and seconds fields. Supports both direct typing and increment/decrement buttons.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Label displayed above the input (e.g., "WORK", "REST") |
| `value` | `number` | required | Duration in seconds |
| `onChange` | `(value: number) => void` | required | Callback when value changes |
| `min` | `number` | `5` | Minimum duration in seconds |
| `max` | `number` | `7200` | Maximum duration in seconds (2 hours) |

## Behavior

### Input Fields
- **Minutes field**: Accepts 0-999 minutes
- **Seconds field**: Accepts 0-59 seconds (auto-clamped)
- Both fields support direct typing with numeric keyboard

### Increment/Decrement Buttons
- When value ≥ 60 seconds: +/- buttons change by 1 minute
- When value < 60 seconds: +/- buttons change by 5 seconds
- Buttons are disabled at min/max boundaries

### Focus States
- Fields show orange underline when focused
- Values update on blur or Enter key

## Visual Design

```
┌─────────────────────────────────────────┐
│               WORK                       │
│                                         │
│   [-]    30 m  :  00 s    [+]           │
│                                         │
└─────────────────────────────────────────┘
```

## Usage

```tsx
<DurationInput
  label="WORK"
  value={workDuration}
  onChange={setWorkDuration}
  min={5}
  max={120 * 60}
/>
```

## Variants

### Long Duration (Minutes Only)
For durations ≥ 1 minute, users typically only adjust minutes:
- 30m : 00s → 31m : 00s (button click)

### Short Duration (Seconds Focus)
For HIIT-style intervals, seconds matter more:
- 0m : 45s → 0m : 50s (button click)
- 0m : 45s → 0m : 30s (direct typing)

## Accessibility

- Each field has descriptive `aria-label`: "{label} minutes", "{label} seconds"
- Buttons have `aria-label`: "Increase duration", "Decrease duration"
- Disabled buttons have `aria-disabled` styling
- Supports keyboard navigation (Tab, Enter, Arrow keys)

## Related Components

- `PresetCard` - Shows preset durations in compact format
- `SetupPage` - Uses DurationInput for work/rest configuration
