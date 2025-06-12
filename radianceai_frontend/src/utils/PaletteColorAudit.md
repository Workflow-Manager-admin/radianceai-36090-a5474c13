# RadianceAI Palette Color Audit (Non-homepage Components)

## Approved Palette (as per subtask & context)
- Blue: #2050aa, #266fd6, #2e6ff2, #77a6ed, #417ddc, #27275e, #1663b7, #23155f
- Light Blue: #eaf5ff, #e7b3ff, #dbe9fe, #a2c5e8, #ebf4ff, #87bcfa, #edf3fc, #90c4fa, #bcdcfd
- White: #ffffff, #fff, #fbfcff
- Beige/Creamy White: #FFF8EB, #fbfcff, #e9f6fb, #fafdfe, #ffafd, #fffafd
- Primary should emphasize blues and neutrals, accent with creamy whites.

## NON-COMPLIANT/LEGACY COLOR USAGE — Detailed Audit

### 1. Chatbot (`src/features/chatbot/Chatbot.js`)
- **Non-palette pinks/violets:**
  - #fadadd, #e7b3ff, #f339db, #e7b3ff28, "linear-gradient(115deg,#19155e 50%,#fadadd24 120%)", #fadadd26, #fadadd12, #e7b3ff19, #fadadd19 etc.
  - Buttons and input backgrounds: "linear-gradient(90deg,#fadadd 60%,#e7b3ff 100%)" — PINK.
  - Suggestion and user message backgrounds: gradients using #fadadd and #e7b3ff (violet/pink).
  - Bottom info/links use #f339db & #e7b3ff for emphasized text.

- **Action needed:**  
  All *#fadadd*, *#f339db*, and most *#e7b3ff* in Chatbot should be replaced with blues or creamy white tones per new palette.

---

### 2. EmailFeatures (`src/features/email/EmailFeatures.js`)
- **Non-palette colors:**
  - #fadadd, #e7b3ff, #f339db in buttons, gradients, and status banners.
  - Notice backgrounds: #1c3b65, #93c7ff, #358fff.
  - Opt-in forms, test send, result banners: multiple pink/violet backgrounds and shadows (e.g., "linear-gradient(90deg, #fadadd 60%, #e7b3ff 100%)")

- **Action needed:**  
  Gradients using *#fadadd* and *#e7b3ff* must be adjusted; all pink & violet shades replaced by blue, light blue, creamy white.

---

### 3. ProgressTracker (`src/features/progress/ProgressTracker.js`)
- **Non-palette colors:**
  - #fadadd, #f339db, #e7b3ff in heading color, progress/streak highlights, and checkboxes (`accentColor: "#f339db"`).
  - Badges and grid borders: use both *#fadadd* and *#e7b3ff*. 
  - Buttons: "linear-gradient(90deg,#fadadd 60%,#e7b3ff 100%)", "background: rgba(234,179,255,0.16)"

- **Action needed:**  
  Convert all *#fadadd*, *#f339db*, and *#e7b3ff* to blues or creamy whites—accentColor for checkboxes should be a theme blue.

---

### 4. ProductList (`src/features/products/ProductList.js`)
- **Non-palette colors:**
  - #fadadd, #e7b3ff in various card, chip, and button backgrounds.
  - #f339db is used for borders, stars, and accent, especially for rating or "India" badge color.
  - Multiple gradients with *#fadadd*/*#e7b3ff* in All/Clear buttons and brand selectors.

- **Action needed:**  
  Refactor all card, button, and label backgrounds to blue or creamy white-based; *#f339db*, *#fadadd* out.

---

### 5. Recommendations (`src/features/recommendations/Recommendations.js`)
- **Non-palette colors:**
  - #fadadd, #e7b3ff, #f339db in background, card, link, and rating badge.
  - Buttons: pink gradients ("linear-gradient(92deg, #f339db 60%, #e7b3ff 100%)").

- **Action needed:**  
  Eliminate non-palette pinks and violets in all card elements and actions.

---

### 6. Quiz (`src/features/quiz/Quiz.js`)
- **Non-palette colors:**
  - #fadadd, #e7b3ff, #f339db in modal backgrounds, step dots, and button backgrounds/gradients.
  - Modal: "linear-gradient(101deg, #fff 0%, #fadadd 60%, #e7b3ff 100%)" (mixes white, pink, violet).

- **Action needed:**  
  Replace non-compliant linear gradients/buttons; use only blues, creamy whites, or approved palette in the modal and navigator bar.

---

### 7. Geolocation (`src/features/geolocation/Geolocation.js`)
- **Mostly compliant:**
  - Uses #fadadd for main heading (should use blue), some backgrounds use soft violets.
  - Minor #f339db in region info.

- **Action needed:**  
  Migrate all heading/highlight pink or violet to blue or creamy white.

---

### 8. WeatherSuggestions, RoutineBuilder, TopNavBar, VideoSlideshow (not full code, but inferred from style patterns)
- **Suspected:**
  - WeatherSuggestions: #fadadd (pink highlight) and minor pastel pinks may remain.
  - RoutineBuilder: violet/pink step highlights.
  - TopNavBar: mostly blue, verify all pop menu or highlight states do not use pink.
  - VideoSlideshow: Gradient overlays/backgrounds—audit for legacy violet or pink as needed.

---

### 9. Color utility (`src/utils/colors.js`)
- **Needs full audit:**  
  If any color objects, constants, or palette arrays contain *#fadadd*, *#f339db*, *#e7b3ff*, or their RGBA/HSLA variants—refactor to blue/white/beige/creamy white.

---

## SUMMARY

**Key non-compliant colors (to be replaced everywhere outside homepage):**
- `#fadadd` (primary pink)
- `#f339db` (accent pink/violet)
- `#e7b3ff` (light violet)
- *Other RGBA/gradient versions of above*

**Replace with:**
- Primary: `#2050aa`, `#1663b7`, `#266fd6`, `#2e6ff2`, `#23155f` (blue)
- Light blue: `#eaf5ff`, `#dbe9fe`, `#77a6ed`, `#edf3fc`, `#bcdcfd`
- White: `#fff`, `#fbfcff`
- Creamy white: `#FFF8EB`, `#e9f6fb`

---

## Next Steps for Refactor

1. Define an explicit palette object/utility for consistent color reuse.
2. Replace all RGB/HEX/gradient values not in palette across all non-homepage JS and CSS-in-JS.
3. For dynamic/inline styles, ensure variable-style referencing (from palette util, or CSS variables).
4. Standardize gradients — all gradients should draw only from primary + blue + creamy white.
5. Remove/deprecate usages of *#fadadd*, *#f339db*, *#e7b3ff*.
6. Perform a sweep for RGBA/HSLA/opacity versions of these colors (e.g., #fadadd1a).

---

## Appendix

For diff-oriented refactor, main files to update:
- `src/features/chatbot/Chatbot.js`
- `src/features/email/EmailFeatures.js`
- `src/features/progress/ProgressTracker.js`
- `src/features/products/ProductList.js`
- `src/features/quiz/Quiz.js`
- `src/features/recommendations/Recommendations.js`
- `src/features/geolocation/Geolocation.js`
- `src/utils/colors.js` (and any other utils/theme files)
- Any code defining gradients/buttons/labels outside homepage

**End of Audit (pre-refactor sweep)**
