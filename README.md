# NextStep

> **Small steps. Clear days.**

A polished React Native day-planning app built with Expo, TypeScript, NativeWind, and Expo Router. NextStep helps users stay grounded with one daily focus, up to three tasks, an energy check-in, and a short reflection — all persisted locally with no account needed.

---

## Product Idea

Most planning apps are either too heavy (project management tools) or too shallow (simple to-do lists). NextStep sits in between: it encourages intentional, minimal daily planning. The constraint of one focus and three tasks is a feature, not a limitation — it forces prioritization and reduces decision fatigue.

**Core loop:**
1. Start the day — set a focus and up to three tasks
2. Check in during the day — mark tasks done, note energy
3. Close the day — write a brief reflection
4. Review the week — see a lightweight seven-day overview

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 55 |
| Navigation | Expo Router (file-based, tab layout) |
| Language | TypeScript |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| Persistence | `@react-native-async-storage/async-storage` |
| Icons | `expo-symbols` (SF Symbols / Material Icons) |
| State | React Context (`DayPlanProvider`) |
| i18n | i18next + react-i18next + expo-localization |

---

## Architecture

```
src/
  types/
    DayPlan.ts               # Core data types (DayPlan, Task, EnergyLevel)
  utils/
    date.ts                  # Pure date helpers (locale-aware formatting)
    plan.ts                  # Pure plan mutations — fully unit-testable
  storage/
    DayPlanContext.tsx        # DayPlanProvider + useTodayPlan + useWeekPlans
  locales/
    en/translation.json      # English strings
    de/translation.json      # German strings
  i18n.ts                    # i18next initialisation (auto-detects device language)
  app/
    _layout.tsx              # Tab navigator, ThemeProvider, DayPlanProvider
    index.tsx                # Home screen: focus, tasks, energy, progress
    reflect.tsx              # Reflect screen: energy selector + reflection
    overview.tsx             # Overview screen: 7-day summary
  components/
    AnimatedIcon.tsx         # Animated splash overlay (native)
    AnimatedIcon.web.tsx     # No-op stub for web
    EnergySelector.tsx       # 5-level energy picker
    FocusCard.tsx            # Inline-editable daily focus card
    Logo.tsx                 # Geometric step logo (pure Views, no SVG dep)
    ScreenContainer.tsx      # Safe-area wrapper used by all screens
    SectionDivider.tsx       # Thin divider between Home screen sections
    TaskItem.tsx             # Task row: toggle, inline edit, delete
    ThemedText.tsx           # Brand-aware text component
    ThemedView.tsx           # Brand-aware view component
    WeekDayRow.tsx           # Single row in the weekly overview
  constants/
    theme.ts                 # Brand colors, light/dark themes
  hooks/
    useColorScheme.ts        # Native color scheme hook
    useColorScheme.web.ts    # Web color scheme hook
    useTheme.ts              # Returns current color scheme's theme object
```

### Key design decisions

**DayPlanProvider** — all three screens share one React Context instance, so editing tasks on Home is immediately visible on the Reflect screen without re-fetching from storage.

**Pure utilities** — `src/utils/date.ts` and `src/utils/plan.ts` contain zero React dependencies. They are plain TypeScript functions that take data and return data, making them trivially testable with Jest.

**One plan per day** — stored in AsyncStorage under `nextstep:plan:YYYY-MM-DD`. The overview screen loads the last seven days independently.

**NativeWind v4** — all styling uses `className` props with Tailwind utility classes. No `StyleSheet.create()` in the codebase. Custom brand colors are defined in `tailwind.config.js` under the `brand.*` namespace.

**i18n** — i18next is initialised in `src/i18n.ts` and auto-detects the device language via `expo-localization`. All UI strings live in `src/locales/{en,de}/translation.json` — no hard-coded text in components. Date and weekday formatting (`formatDateLabel`, `shortWeekday`) also use the active locale, so day names and month abbreviations render in the correct language.

---

## Branding

| Element | Value |
|---|---|
| App name | NextStep |
| Tagline | Small steps. Clear days. |
| Tone | Calm, friendly, clear, dependable |

### Colour palette

| Name | Hex | Tailwind token | Usage |
|---|---|---|---|
| Orange | `#C8742A` | `brand-orange` | Accent, CTAs, active states |
| Orange light | `#D4894A` | `brand-orange-light` | Hover / pressed variants |
| Gold | `#C9A500` | `brand-gold` | Highlights |
| Light green | `#B8C99D` | `brand-light-green` | Selected states, dark-mode secondary text |
| Sand | `#E7D8C9` | `brand-sand` | Card backgrounds, input fields |
| Off-white | `#FAF8F3` | `brand-off-white` | App background (light mode) |
| Dark olive | `#4B4A3F` | `brand-dark-olive` | Primary text (light mode), dark-mode background |
| Olive mid | `#7A7869` | `brand-olive-mid` | Secondary text |
| Olive dark | `#2A2923` | `brand-olive-dark` | Deepest dark background |

The palette is earthy and warm — avoids the cold blue-grey typical of productivity apps. Orange provides clear contrast for interactive elements (4.6:1+ against off-white for large text, meeting WCAG AA).

### Logo

The logo is a set of three ascending rectangles rendered with pure React Native `View` components — no image or SVG library required. The bars increase in height from left to right, symbolising progress and forward motion. The design is legible at small sizes (e.g. tab bar) and scales with a `scale` prop.

---

## Accessibility

- All interactive elements have `accessibilityLabel` and `accessibilityRole`
- Checkboxes use `accessibilityState={{ checked }}` for screen-reader state
- Energy selector uses `accessibilityRole="radiogroup"` / `"radio"`
- Touch targets are minimum 44×44 points (via `minHeight`, `hitSlop`)
- Information is never conveyed by colour alone (text + emoji + colour)
- `TextInput` fields have explicit `accessibilityLabel`
- Logical tab/focus order follows visual layout
- Splash animation is brief and uses `Easing` (no infinite loops in UI)

---

## Internationalisation

Supported languages: **English** (`en`) and **German** (`de`). The app picks the device language automatically and falls back to English. Date and weekday formatting adapts to the active locale (e.g. "Di., 13. Mai" in German, "Tue, May 13" in English). To add a new language, copy `src/locales/en/translation.json` to `src/locales/{code}/translation.json` and translate the values.

---

## Jest Testing Strategy

Testing is not wired up yet due to a local dependency conflict with the test runner. Once resolved, the following tests should be added:

### Unit tests (no React needed)

```
src/utils/__tests__/date.test.ts
  - toDateKey returns YYYY-MM-DD in local time
  - todayKey matches new Date()
  - lastNDays(7) returns exactly 7 entries, oldest first
  - isToday returns true for today's key
  - formatDateLabel formats correctly

src/utils/__tests__/plan.test.ts
  - addTask adds a task; respects MAX_TASKS limit
  - toggleTask flips completed state
  - removeTask removes by id
  - updateTaskText trims whitespace; removes task if text is empty
  - completedCount counts only completed tasks
  - planProgress returns 0 with no tasks; correct fraction otherwise
  - createEmptyPlan returns sensible defaults
```

### Integration tests (with React Testing Library)

```
src/components/__tests__/TaskItem.test.tsx
  - renders task text
  - pressing circle calls onToggle
  - pressing × calls onDelete
  - completed task has strikethrough style

src/components/__tests__/EnergySelector.test.tsx
  - renders all 5 levels
  - pressing a level calls onChange with correct EnergyLevel
  - selected level has correct accessibilityState

src/storage/__tests__/DayPlanContext.test.tsx
  - useTodayPlan returns loading:true initially
  - updatePlan updates state and calls AsyncStorage.setItem
```

---

## Author

Nadine Pommerening
