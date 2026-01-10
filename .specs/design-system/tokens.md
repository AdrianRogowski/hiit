# HIIT Timer Design Tokens

A bold, high-contrast design system optimized for readability from across a room. Inspired by sports scoreboards and digital gym timers.

## Philosophy

- **High Contrast**: Must be readable from 10+ feet away on a tablet
- **Clear States**: Instantly distinguish between work and rest modes
- **Bold Typography**: Large, chunky numbers that command attention
- **Energetic**: Work state feels active; rest state feels calm

---

## Colors

### Core Palette

| Token | Value | Usage |
|-------|-------|-------|
| `color-background` | `#0D0D0D` | App background (near black) |
| `color-surface` | `#1A1A1A` | Cards, panels |
| `color-surface-elevated` | `#262626` | Elevated surfaces, modals |

### State Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color-work` | `#FF6B35` | Active/work state (vibrant coral-orange) |
| `color-work-glow` | `rgba(255, 107, 53, 0.3)` | Work state glow effects |
| `color-rest` | `#00D9A5` | Rest state (fresh mint-teal) |
| `color-rest-glow` | `rgba(0, 217, 165, 0.3)` | Rest state glow effects |
| `color-paused` | `#FFD166` | Paused state (warm yellow) |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color-text` | `#FFFFFF` | Primary text |
| `color-text-secondary` | `#A0A0A0` | Secondary/muted text |
| `color-text-on-work` | `#FFFFFF` | Text on work-colored backgrounds |
| `color-text-on-rest` | `#0D0D0D` | Text on rest-colored backgrounds |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color-error` | `#EF4444` | Error states |
| `color-success` | `#22C55E` | Success confirmations |
| `color-warning` | `#F59E0B` | Warnings |

---

## Typography

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `font-display` | `'JetBrains Mono', 'SF Mono', monospace` | Timer numbers, big displays |
| `font-body` | `'Outfit', 'DM Sans', sans-serif` | Body text, labels |

### Font Sizes

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-timer-giant` | `8rem` / `128px` | 1 | Main countdown timer |
| `text-timer-large` | `4rem` / `64px` | 1.1 | Secondary timer displays |
| `text-5xl` | `3rem` / `48px` | 1.1 | Large headings |
| `text-4xl` | `2.25rem` / `36px` | 1.2 | Section headings |
| `text-3xl` | `1.875rem` / `30px` | 1.2 | Subsection headings |
| `text-2xl` | `1.5rem` / `24px` | 1.3 | Card titles |
| `text-xl` | `1.25rem` / `20px` | 1.4 | Large body |
| `text-lg` | `1.125rem` / `18px` | 1.5 | Medium body |
| `text-base` | `1rem` / `16px` | 1.5 | Default body |
| `text-sm` | `0.875rem` / `14px` | 1.5 | Small text |
| `text-xs` | `0.75rem` / `12px` | 1.5 | Tiny labels |

### Font Weights

| Token | Value |
|-------|-------|
| `font-normal` | `400` |
| `font-medium` | `500` |
| `font-semibold` | `600` |
| `font-bold` | `700` |
| `font-black` | `900` |

---

## Spacing

| Token | Value |
|-------|-------|
| `spacing-1` | `0.25rem` / `4px` |
| `spacing-2` | `0.5rem` / `8px` |
| `spacing-3` | `0.75rem` / `12px` |
| `spacing-4` | `1rem` / `16px` |
| `spacing-5` | `1.25rem` / `20px` |
| `spacing-6` | `1.5rem` / `24px` |
| `spacing-8` | `2rem` / `32px` |
| `spacing-10` | `2.5rem` / `40px` |
| `spacing-12` | `3rem` / `48px` |
| `spacing-16` | `4rem` / `64px` |
| `spacing-20` | `5rem` / `80px` |
| `spacing-24` | `6rem` / `96px` |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `0.25rem` / `4px` | Small elements |
| `radius-md` | `0.5rem` / `8px` | Buttons, inputs |
| `radius-lg` | `0.75rem` / `12px` | Cards |
| `radius-xl` | `1rem` / `16px` | Large cards, modals |
| `radius-2xl` | `1.5rem` / `24px` | Hero sections |
| `radius-full` | `9999px` | Pills, avatars |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle depth |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.4)` | Cards |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.5)` | Elevated elements |
| `shadow-glow-work` | `0 0 40px var(--color-work-glow)` | Work state glow |
| `shadow-glow-rest` | `0 0 40px var(--color-rest-glow)` | Rest state glow |

---

## Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `transition-fast` | `150ms ease` | Micro-interactions |
| `transition-normal` | `250ms ease` | Standard transitions |
| `transition-slow` | `400ms ease` | State changes |
| `transition-state` | `800ms ease-in-out` | Work/rest state transitions |

---

## Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `screen-sm` | `640px` | Small tablets |
| `screen-md` | `768px` | Tablets |
| `screen-lg` | `1024px` | Small laptops |
| `screen-xl` | `1280px` | Desktops |

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `z-base` | `0` | Default |
| `z-dropdown` | `10` | Dropdowns |
| `z-sticky` | `20` | Sticky headers |
| `z-modal` | `50` | Modals |
| `z-toast` | `100` | Toast notifications |

---

## Animation Keyframes

### Pulse (for active timer)
```css
@keyframes pulse-work {
  0%, 100% { box-shadow: 0 0 20px var(--color-work-glow); }
  50% { box-shadow: 0 0 60px var(--color-work-glow); }
}

@keyframes pulse-rest {
  0%, 100% { box-shadow: 0 0 20px var(--color-rest-glow); }
  50% { box-shadow: 0 0 60px var(--color-rest-glow); }
}
```

### Countdown tick
```css
@keyframes tick {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
```
