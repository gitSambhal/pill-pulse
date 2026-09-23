# Changelog

All notable changes to **PillPulse** are documented in this file.
The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.5.0] - 2026-09-23

### Added
- **Visual Timing Icons Across Cards & Schedule UI**:
  - **Slot-Specific Timing Icons**: Integrated distinct icons for each daily time period: 🌅 `Sunrise` (Morning), ☀️ `Sun` (Afternoon), 🌆 `Sunset` (Evening), 🌙 `Moon` (Night), and ⏰ `Clock` (Custom).
  - **Dose Card Timing Badges**: Added `SlotTimingBadge` on every medication card with color-coded styling (warm amber, golden orange, evening rose, bedtime indigo).
  - **Next-Up Banner Timing Display**: Next scheduled dose banner and live cascading countdown now feature the corresponding slot icon and badge.
  - **Routine Card Enhancements**: Routine management cards display the slot timing icon and color badge alongside medicine counts and start time adjustment.
  - **Visual Slot Filter Bar**: Today's slot filter tabs now include slot icons for fast, visual 1-tap navigation across morning, afternoon, evening, and night regimens.
  - **Slot Card Icons in Routine Creator**: Routine creation slot selection cards display the slot's respective timing icon.
- **Custom Morning, Afternoon, Evening & Night Time Configuration**:
  - **Global Schedule Times in Settings**: Configure personalized daily hours for Morning (Wakeup), Afternoon (Lunch), Evening (Dinner), and Night (Bedtime) in Settings, saved persistently in local storage.
  - **Inline Slot Time Pickers in Routine Setup**: Each slot card (Morning, Afternoon, Evening, Night) in the Routine Setup Wizard features a direct, native time selector allowing custom time assignments per slot.
  - **1-Tap Sync**: Routines and doses automatically inherit your preferred schedule hours with fallback to sensible defaults.

---

## [v1.4.0] - 2026-09-23

### Fixed
- **Dark Mode Toggle**: Fixed Tailwind CSS v4 class variant synchronization by configuring `@custom-variant dark (&:where(.dark, .dark *));` in `index.css` and setting `document.documentElement.style.colorScheme`, making the dark/light mode toggle switch styles instantly.

### Added
- **Direct Start Time Selection & Editing**:
  - Prominent "1. Choose Starting Time" section in the routine setup wizard with native time picker, 12h display, and fast preset chips (`07:00 AM`, `08:00 AM`, `09:00 AM`, `12:30 PM`, `06:30 PM`, `08:00 PM`).
  - Inline "Change Start Time" badge on routine cards in the Routines tab to update sequence starting times and automatically adjust pending doses.
  - "Edit Time" inline picker on pending doses in the Today Dashboard to reschedule doses on the fly.
- **Escape Key Shortcut & Backdrop Dismiss**: All modals (`QuickRoutineModal`, `AddMedicineModal`, `ConfirmModal`, `SettingsModal`, `WhatIsNewModal`, `ActiveAlarmModal`) now instantly dismiss on `Escape` key press and backdrop tap.
- **Relaxed, Calm Aesthetic & Mobile Polish**: Softer palette (calming teal, warm slate, muted borders), gentle rounded corners (`rounded-3xl`), unhurried typography, and touch-friendly mobile targets (`min-h-[42px]`).

---

## [v1.3.0] - 2026-09-23

### Fixed
- **Calendar Icon Picker Error**: Replaced restricted JavaScript `showPicker()` API with native HTML5 label-wrapped date input, eliminating all iframe `SecurityError` and `DOMException` issues across all mobile and desktop browsers.

### Added
- **Dashboard Upcoming & Taken Today Cards**: Two prominent, interactive dashboard cards displaying pending medication counts, next due medicine name and time, completed dose counts, and live adherence progress bar.
- **Dashboard Status Filters**: 1-tap toggling between `All`, `Upcoming & Due`, and `Taken Today` views.
- **Grouped Dashboard Sections**: Clean visual separation between Upcoming & Due medicines (with "Take Now" and "Take Early" actions) and Taken Today medicines (with completion timestamps and "Undo" buttons).

---

## [v1.2.0] - 2026-09-23

### Added
- **No Gap (0-Min) / Take Together Mode**: Option to configure 0-minute intervals between medicines so pills are scheduled together at the exact same time without artificial waiting.
- **Custom Per-Medicine Intervals**: Set independent gaps for the 2nd, 3rd, and subsequent pills (e.g. Pill 1 & 2 together with 0m gap, then 15m or 30m gap before Pill 3).
- **Preset Regimens with Mixed Intervals**: Added 1-click templates for Staggered Fasting Routines (0m + 30m), Simultaneous Combos (0m + 0m), and Custom 3-Times Daily (5m + 15m).
- **Interactive Regimen Flowchart**: Live visual pipeline showing step-by-step offsets (`Step 1` -> `+15m` -> `Step 2` -> `+30m` -> `Step 3`) during setup.
- **Dynamic Interval UI & Smart Take-Together**: When taking a pill followed by a 0m gap medicine, the app marks the next pill ready immediately without starting a waiting timer.

---

## [v1.1.0] - 2026-09-23

### Added
- **Immediate Early Take During 5-Min Gaps**: You can now mark any medicine as taken at any time, even while a 5-minute gap countdown is actively ticking. It automatically clears or smoothly advances to the next step.
- **Date Navigation & Calendar Selector**: Interactive day-by-day navigator and 7-day strip allowing seamless checking of **previous days' intake logs** and **future projected medication routines**.
- **Take Entire Stack Shortcut**: 1-tap "Mark Entire Stack Taken" button on multi-pill cascading routines when you take all medicines together.
- **Undo / Revert to Pending**: Reversible dose status so accidental clicks can be corrected instantly with stock inventory restoration.
- **Past Days Quick-Inspector in History**: Dedicated past days card in the Adherence tab to inspect and audit previous records with 1 click.

---

## [v1.0.0] - 2026-09-23

### Added
- **Cascading 5-Minute Routine Engine**: Seamless multi-pill sequence scheduler solving staggered medication routines.
- **Web Audio Sound Synthesizer**: 5 high-fidelity melodic alarm tones.
- **System Notification & Haptic Feedback**: Browser push notifications with vibration cues.
- **Time Slots Categorization**: Dedicated slots for Morning, Afternoon, Evening, and Night routines.
- **Pill Inventory & Refill Warnings**: Track remaining capsule counts.
- **PWA & Offline Capability**: Service Worker caching, web manifest, install button.
- **Developer Attribution**: Attribution to Suhail Akhtar (https://suhail.top).
