# Academic Heritage Design System for BhodBasha

## Brand & Style
The design system is rooted in the "Academic Heritage" aesthetic, prioritizing intellectual clarity and the tactile feel of physical scholarship. It is designed for BhodBasha—a premium STEM education platform that values depth over speed and substance over hype.

The visual language follows **Modern Editorial** and **Classic Publishing** principles with a sophisticated "Parchment and Ink" palette. A warm, non-white background reduces eye strain during long offline study sessions. The visual hierarchy is structured, grounded, and authoritative, using precision line work and intentional whitespace rather than decorative effects or floating drop shadows.

---

## Design Tokens

### 1. Colors
- **Background / Canvas**: `#FCF9F8` (Warm Ivory / Parchment)
- **Surface Dim**: `#DCD9D9`
- **Surface Bright**: `#FCF9F8`
- **Surface Container Lowest**: `#FFFFFF`
- **Surface Container Low**: `#F6F3F2`
- **Surface Container**: `#F0EDED`
- **Surface Container High**: `#EAE7E7`
- **Surface Container Highest**: `#E5E2E1`
- **On Surface / Primary Text**: `#1C1B1B` (Deep Charcoal, WCAG 4.5:1+ contrast)
- **On Surface Variant / Muted Text**: `#57423A` (Meets WCAG 4.5:1 against Ivory surfaces)
- **Outline / Subtle Border**: `rgba(28, 27, 27, 0.12)` (`#8A7268` / `#DEC0B5` variant)
- **Primary (Terracotta)**: `#9F3E07` / `#C05621` (Signifies foundational knowledge & critical CTAs)
- **On Primary**: `#FFFFFF`
- **Primary Container**: `#C05621`
- **On Primary Container**: `#FFFEFF`
- **Secondary (Muted Indigo)**: `#475F83` / `#2A4365` (Signifies structure, navigation, and technical metadata)
- **On Secondary**: `#FFFFFF`
- **Secondary Container**: `#BDD6FF`
- **On Secondary Container**: `#445D80`
- **Tertiary (Saffron / Ochre)**: `#894F00` / `#AC6500` (Signifies key insights, aha moments, and warnings)
- **On Tertiary**: `#FFFFFF`
- **Error**: `#BA1A1A`
- **Error Container**: `#FFDAD6`
- **On Error**: `#FFFFFF`

### 2. Typography
- **Display & Headlines**: `Source Serif 4`, serif (textbook and journal prestige)
  - `display-lg`: 48px / 56px, Bold (700), -0.02em letter spacing
  - `display-lg-mobile`: 32px / 40px, Bold (700)
  - `headline-md`: 32px / 40px, Semi-bold (600)
  - `headline-sm`: 24px / 32px, Semi-bold (600)
- **Body**: `IBM Plex Sans`, sans-serif (neutral, high-legibility STEM reading)
  - `body-lg`: 18px / 28px, Regular (400)
  - `body-md`: 16px / 24px, Regular (400)
  - `caption`: 14px / 20px, Regular (400)
- **Metadata & Technicals**: `IBM Plex Mono`, monospace (labels, timestamps, equations, offline flags)
  - `label-mono`: 13px / 16px, Medium (500), 0.05em letter spacing

### 3. Spacing (4px Baseline)
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 48px
- `container-max`: 1120px
- `gutter`: 24px
- `margin-mobile`: 16px

### 4. Elevation & Depth
- **Zero Elevation Principle**: No drop shadows. Hierarchy is achieved strictly through tonal layering and 1px precision borders (`border: 1px solid rgba(28, 27, 27, 0.12)`).
- Active/Hover Border: `rgba(28, 27, 27, 0.28)`.

### 5. Shapes & Radii
- Small inputs, buttons, chips: `8px` (`rounded-md` / `rounded`)
- Cards, modules, media containers: `14px` (`rounded-xl` / `rounded-lg`)
- Full round / pill: `9999px` (tags/chips only)

---

## Component Guidelines
- **Buttons**:
  - Primary: Solid Terracotta (`#9F3E07`), text `#FFFFFF`, 8px radius, medium weight.
  - Secondary: 1px Muted Indigo (`#475F83`) border, text `#475F83`, background transparent.
  - Ghost / Tertiary: Clean text with underline on hover.
- **Cards**:
  - Defined by 1px solid border (`#1C1B1B` at 12% opacity) on `#FCF9F8` or `#FFFFFF` container.
  - Left accent border (3px solid Saffron or Indigo) for categorizing insight types.
- **Offline & Sync Badges**:
  - Always rendered with `IBM Plex Mono`, 4px radius, clear high-contrast status colors.
  - States: `Online` (Indigo), `Offline` (Charcoal/Muted), `Saved offline` (Terracotta/Green), `Waiting to sync` (Saffron), `Synced` (Terracotta), `Sync failed` (Error).
