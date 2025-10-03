# Cyberpunk Palette Design Guide

## Overview

This comprehensive guide covers the color theory, usage guidelines, and pairing strategies for both the Original and WCAG 2.2 compliant Cyberpunk palettes. Each palette contains 45 carefully crafted colors organized into 9 families with 5 variants each (100, 300, 500, 700, 900).

---

## Color Theory Foundation

### Core Color Relationships

**Split-Complementary Triad**
The palette is built on a split-complementary color scheme using three primary accents:
- **Yellow (#F9F002)** - High energy, attention-grabbing
- **Purple (#B026FF)** - Brand identity, sophistication  
- **Cyan (#00F0FF)** - Technology, contrast

These three colors sit at strategic points on the color wheel, creating vibrant contrast while maintaining visual harmony. This is the foundation of the cyberpunk aesthetic.

**Analogous Extensions**
Each primary accent has an analogous partner that shares similar characteristics but with modified temperature:
- **Yellow → Amber** - Shifts toward red, adds warmth
- **Purple → Violet** - Deepens toward blue, adds mystery
- **Cyan → Teal** - Adds green, grounds the palette

### Tints, Shades, and Intensity Scale

Each color family follows a consistent intensity progression:

- **100 (Lightest Tint)** - Color + significant white, 20-30% opacity feel
- **300 (Light Tint)** - Color + moderate white, 50-60% opacity feel  
- **500 (Base)** - Pure saturated color, 100% intensity
- **700 (Dark Shade)** - Color + moderate black, maintains vibrancy
- **900 (Darkest Shade)** - Color + significant black, anchoring tone

This creates a predictable, scalable system where higher numbers = darker, lower numbers = lighter.

---

## Family-by-Family Breakdown

### Electric Yellow Family
**Character**: Aggressive, energetic, urgent  
**Color Theory**: Yellow is the most visible color to the human eye, demanding immediate attention

**Usage Guidelines**:
- **100-300**: Subtle highlights, warning backgrounds, hover states on dark UI
- **500**: Primary CTAs, urgent notifications, high-stakes actions
- **700-900**: Active states, selected items, warning text on light backgrounds

**Pairings**:
- Yellow 500 + Black 500 = Maximum impact, emergency actions
- Yellow 300 + Gray 500 = Approachable warnings
- Yellow 700 + White 100 = Accessible text on light backgrounds

**Avoid**: Never pair light yellows (100-300) with whites or light backgrounds—readability fails catastrophically.

---

### Burnt Amber Family
**Character**: Warm, approachable, less aggressive than yellow  
**Color Theory**: Analogous to yellow (yellow + red), maintains energy while reducing intensity

**Usage Guidelines**:
- **100-300**: Warm backgrounds, friendly notifications, soft accents
- **500**: Secondary CTAs, less urgent actions, warm brand moments
- **700-900**: Text on light backgrounds, grounded elements, borders

**Pairings**:
- Amber 500 + Violet 700 = Balanced, sophisticated warmth
- Amber 300 + Gray 700 = Subtle, approachable UI elements
- Amber 700 + White 500 = Readable, warm body text (light mode)

**Best Use**: When you need yellow's energy but purple's elegance—amber bridges both.

---

### Deep Neon Purple Family
**Character**: Brand authority, luxury, electric sophistication  
**Color Theory**: Purple occupies a unique psychological space—simultaneously energetic and refined

**Usage Guidelines**:
- **100-300**: Subtle brand touches, glass effects, elevated backgrounds
- **500**: Primary brand color, hero CTAs, key UI moments
- **700-900**: Text on light backgrounds, pressed states, deep accents

**Pairings**:
- Purple 500 + Yellow 500 = Maximum cyberpunk energy, hero moments
- Purple 500 + Black 500 = Sophisticated, mysterious
- Purple 300 + Gray 500 = Elegant, understated brand presence
- Purple 700 + White 100 = Accessible brand text (light mode)

**Psychology**: Purple conveys innovation, creativity, and futurism—perfect for tech brands.

---

### Shadow Violet Family
**Character**: Mysterious, deep, sophisticated depth  
**Color Theory**: Monochromatic relationship with purple, shifted toward blue

**Usage Guidelines**:
- **100-300**: Hover states over purple elements, layered UI depth
- **500**: Secondary brand color, less intense than purple but related
- **700-900**: Dark mode surfaces, rich backgrounds, text on light

**Pairings**:
- Violet 500 + Purple 500 = Monochromatic depth, layered UI
- Violet 700 + Gray 300 = Sophisticated, muted elegance  
- Violet 300 + Black 300 = Subtle elevation, cards on dark
- Violet 900 + White 500 = Deep, readable text (light mode)

**Best Use**: When purple feels too intense—violet maintains the brand family while dialing down energy.

---

### Cyber Cyan Family
**Character**: Tech, digital, sharp contrast  
**Color Theory**: Complementary to warm tones, creates maximum visual pop

**Usage Guidelines**:
- **100-300**: Links, interactive elements, glass effects
- **500**: Tech features, data visualizations, secondary CTAs
- **700-900**: Active links, selected items, tech text on light

**Pairings**:
- Cyan 500 + Black 500 = Classic cyberpunk, maximum contrast
- Cyan 300 + Violet 500 = Cool, sophisticated tech
- Cyan 500 + Purple 500 = Electric, high-energy (use sparingly)
- Cyan 700 + White 100 = Accessible link text (light mode)

**Psychology**: Cyan reads as "digital native"—perfect for AI, data, and tech features.

---

### Deep Teal Family
**Character**: Grounded, professional, approachable tech  
**Color Theory**: Cyan + green = more natural, less artificial than pure cyan

**Usage Guidelines**:
- **100-300**: Secondary backgrounds, subtle borders, muted highlights
- **500**: Professional UI elements, less critical actions, borders
- **700-900**: Text, icons, grounded elements on light backgrounds

**Pairings**:
- Teal 500 + Gray 500 = Professional, corporate-friendly
- Teal 300 + Black 300 = Subtle UI depth
- Teal 700 + White 500 = Business-appropriate text
- Teal 500 + Violet 700 = Sophisticated, mature palette

**Best Use**: When cyan feels too electric—teal maintains the cool tech vibe with more professionalism.

---

### Void Black Family
**Character**: Deep, mysterious, foundational  
**Color Theory**: Not true black—slightly blue-tinted for digital screens

**Usage Guidelines**:
- **100**: Elevated cards and surfaces (darkest "light" element)
- **300**: Card backgrounds, secondary surfaces
- **500**: Primary background (base layer)
- **700**: Deep shadows, layering
- **900**: Pure black, maximum depth

**Pairings**:
- Black 500 + Any 500 accent = Maximum color pop
- Black 300 + Black 500 = Subtle surface elevation
- Black 100 + Gray 500 = Card on surface contrast
- All neon colors (500s) designed to shine on Black 500

**Critical**: Black 500 (#0A0A0F) is your primary dark mode background—all contrast ratios calculated against this.

---

### Ghost Gray Family
**Character**: Purple-tinted neutral, sophisticated surfaces  
**Color Theory**: Neutral gray with subtle purple undertone ties back to brand

**Usage Guidelines**:
- **100**: Light text on dark, secondary information
- **300**: Body text on dark, icons, less critical content
- **500**: Surfaces and cards, neutral UI elements
- **700-900**: Borders, dividers, deep surfaces

**Pairings**:
- Gray 500 + Black 500 = Card on background
- Gray 300 + Black 500 = Body text (dark mode)
- Gray 100 + Gray 700 = Subtle borders and dividers
- Gray 500 + Purple 500 = Brand-tinted surfaces

**Special Note**: The purple tint makes grays feel cohesive with the brand rather than cold and lifeless.

---

### Neon White Family
**Character**: Bright, clean, slightly warm  
**Color Theory**: Off-white with warmth prevents harsh blue-white digital fatigue

**Usage Guidelines**:
- **100**: Pure white, maximum contrast moments
- **300**: Bright highlights, glass effects, shine
- **500**: Primary text on dark backgrounds
- **700**: Secondary text, de-emphasized content
- **900**: Muted text, least important information

**Pairings**:
- White 500 + Black 500 = Primary body text (dark mode)
- White 300 + Black 300 = Highlighted cards
- White 700 + Black 500 = Secondary text
- White 100 + Any dark shade = Maximum contrast

**Critical**: White 500 (#E8E8F0) is your primary dark mode text color—all dark mode contrast ratios use this.

---

## Strategic Color Pairings

### High-Contrast Combos (Maximum Impact)
Use these for critical actions, hero moments, and attention-grabbing elements:

- **Yellow 500 + Black 500** - Emergency actions, critical warnings
- **Purple 500 + Yellow 500** - Hero CTAs, brand moments (use sparingly)
- **Cyan 500 + Black 500** - Tech features, data highlights
- **White 100 + Purple 700** - Maximum readable brand text

### Balanced Combos (Everyday UI)
Use these for standard interface elements:

- **Purple 500 + Black 500** - Primary actions
- **Violet 500 + Gray 300** - Secondary actions
- **Amber 500 + Black 500** - Warm CTAs
- **Cyan 700 + White 500** - Links and interactive text
- **White 500 + Black 500** - Body text

### Subtle Combos (Supporting Elements)
Use these for backgrounds, borders, and non-critical UI:

- **Gray 500 + Black 500** - Cards and surfaces
- **Violet 300 + Black 300** - Elevated surfaces
- **Teal 300 + Gray 700** - Borders and dividers
- **Gray 100 + Black 500** - Subtle text and icons

### Monochromatic Hierarchies
Create depth using single color families:

**Purple Family Depth**:
- Purple 100 (subtle background) → Purple 300 (hover) → Purple 500 (active) → Purple 700 (pressed)

**Gray Family Layers**:
- Black 500 (base) → Gray 900 (surface 1) → Gray 700 (surface 2) → Gray 500 (surface 3)

---

## Dark Mode Guidelines

### Background Strategy
**Layering system from back to front**:
1. **Black 500** - Base application background
2. **Gray 900 or Black 300** - Primary surface layer (cards, panels)
3. **Gray 700 or Gray 500** - Secondary surface layer (nested cards)
4. **Gray 500 + border** - Tertiary elevation (modals, dropdowns)

### Text Hierarchy
**Predictable contrast levels**:
1. **White 500** - Primary text, headings (13:1 ratio)
2. **White 700** - Secondary text, body copy (8:1 ratio)
3. **White 900** - Tertiary text, captions (4:1 ratio)
4. **Gray 300** - De-emphasized text, metadata (3:1 ratio)

### Accent Usage
- Use 500-level colors for primary accents (buttons, links, highlights)
- Use 300-level colors for hover states and secondary accents
- Use 700-level colors for active/pressed states
- Reserve 100-level colors for very subtle backgrounds and glows

---

## Light Mode Guidelines

### Background Strategy
**Inverted layering from dark mode**:
1. **White 100** - Base application background
2. **White 300** - Primary surface layer (cards, panels)
3. **Gray 100** - Secondary surface layer (nested cards)
4. **White 500 + shadow** - Tertiary elevation (modals, dropdowns)

### Text Hierarchy
**Darker shades for readability**:
1. **Black 500** - Primary text, headings (21:1 ratio)
2. **Gray 700** - Secondary text, body copy (14:1 ratio)
3. **Gray 500** - Tertiary text, captions (8:1 ratio)
4. **Gray 300** - De-emphasized text, metadata (3.7:1 ratio)

### Accent Usage
- Use 700-900 level colors for text and primary actions
- Use 500-level colors for borders and secondary elements
- Use 300-level colors for backgrounds and very subtle accents
- Light mode requires darker shades to maintain contrast

---

## Original vs WCAG Themes

### Original Theme
**Purpose**: Maximum aesthetic impact, pure cyberpunk energy  
**Best For**:
- Marketing websites and landing pages
- Hero sections and splash screens
- Branding and identity materials
- Creative portfolios
- Gaming interfaces
- Non-critical decorative elements

**Characteristics**:
- True neon intensity (#F9F002 yellow, #00F0FF cyan)
- Some colors fail WCAG for text use
- Prioritizes visual impact over accessibility
- "Glow in the dark" aesthetic

**Usage Strategy**: Use for attention-grabbing moments, combine with WCAG theme for practical UI elements.

---

### WCAG 2.2 Theme
**Purpose**: Accessibility compliance while maintaining cyberpunk spirit  
**Best For**:
- Applications and dashboards
- E-commerce and transactional interfaces
- SaaS products
- Content-heavy sites
- Any product requiring legal compliance
- Enterprise software

**Characteristics**:
- All colors meet 4.5:1 minimum for normal text (AA standard)
- Adjusted saturation and brightness for readability
- Colors marked with AA (4.5:1+) or AAA (7:1+) badges
- Maintains cyberpunk aesthetic while prioritizing legibility

**Key Adjustments**:
- Yellows: More saturated/amber for better contrast
- Purples: Slightly deepened for visibility
- Cyans: Richer and more saturated
- Light tints: Significantly brightened for dark mode
- Dark shades: Ensured readability on light backgrounds

**Usage Strategy**: Default to this theme for all text, interactive elements, and UI components.

---

## Practical Usage Patterns

### Buttons

**Primary CTA (Dark Mode)**:
```
Background: Purple 500
Text: White 100
Hover: Purple 300
Active: Purple 700
Disabled: Gray 500 + Gray 300 text
```

**Secondary CTA (Dark Mode)**:
```
Background: Transparent
Border: Cyan 500 (2px)
Text: Cyan 500
Hover: Cyan 300 border + text
Active: Cyan 700 border + text
```

**Danger/Warning (Dark Mode)**:
```
Background: Amber 500
Text: Black 500
Hover: Amber 300
Active: Amber 700
```

### Links

**Dark Mode**:
```
Default: Cyan 500
Hover: Cyan 300 + underline
Visited: Violet 500
Active: Cyan 700
```

**Light Mode**:
```
Default: Cyan 700
Hover: Cyan 500 + underline
Visited: Violet 700
Active: Cyan 900
```

### Form Inputs

**Dark Mode**:
```
Background: Gray 900
Border: Gray 700
Text: White 500
Placeholder: Gray 300
Focus Border: Purple 500
Error Border: Amber 500
Success Border: Cyan 500
```

**Light Mode**:
```
Background: White 100
Border: Gray 300
Text: Black 500
Placeholder: Gray 500
Focus Border: Purple 500
Error Border: Amber 700
Success Border: Teal 700
```

### Status Indicators

**Success**:
- Dark: Cyan 500 or Teal 500
- Light: Teal 700 or Cyan 700

**Warning**:
- Dark: Yellow 500 or Amber 500
- Light: Amber 700 or Yellow 900

**Error**:
- Dark: Amber 700
- Light: Amber 900

**Info**:
- Dark: Violet 300 or Purple 300
- Light: Violet 700 or Purple 700

### Data Visualization

**6-Color Sequence** (for charts, graphs):
1. Purple 500
2. Cyan 500
3. Yellow 500
4. Amber 500
5. Violet 500
6. Teal 500

**Heatmap** (low to high intensity):
- Teal 300 → Cyan 500 → Purple 500 → Amber 500 → Yellow 500

**Diverging** (negative to positive):
- Amber 700 ← Gray 500 → Cyan 500

---

## Accessibility Best Practices

### Contrast Requirements
- **Normal text**: 4.5:1 minimum (AA) or 7:1 (AAA)
- **Large text** (18pt+): 3:1 minimum (AA) or 4.5:1 (AAA)
- **UI components**: 3:1 minimum for interactive elements

### Testing Your Pairings
When choosing color combinations:
1. Check the contrast badge (AA/AAA/Fail)
2. Verify against your background color
3. Test with actual text at your intended size
4. Consider colorblind users (avoid red-green reliance)

### Safe Default Pairings (WCAG Theme)

**Dark Mode Text**:
- White 500 + Black 500 = 13.2:1 (AAA) ✓
- White 700 + Black 500 = 7.8:1 (AAA) ✓
- Gray 300 + Black 500 = 5.8:1 (AA) ✓

**Light Mode Text**:
- Black 500 + White 100 = 21:1 (AAA) ✓
- Gray 700 + White 100 = 14.2:1 (AAA) ✓
- Gray 500 + White 100 = 8.5:1 (AAA) ✓

**Accent Text (Dark Mode)**:
- Yellow 500 + Black 500 = 8.5:1 (AAA) ✓
- Cyan 500 + Black 500 = 6.1:1 (AA) ✓
- Purple 500 + Black 500 = 4.9:1 (AA) ✓

**Accent Text (Light Mode)**:
- Yellow 900 + White 100 = 7.6:1 (AAA) ✓
- Purple 900 + White 100 = 11.8:1 (AAA) ✓
- Teal 700 + White 100 = 10.6:1 (AAA) ✓

---

## Common Mistakes to Avoid

### 1. Using Neon on Neon
❌ **Don't**: Yellow 500 text on Purple 500 background  
✓ **Do**: Yellow 500 text on Black 500 background

**Why**: Two high-intensity colors vibrate visually, causing eye strain.

### 2. Light Tints on Light Backgrounds
❌ **Don't**: Purple 100 on White 100  
✓ **Do**: Purple 700 on White 100

**Why**: Light tints (100-300) lack sufficient contrast for light mode.

### 3. Overusing High-Intensity Accents
❌ **Don't**: Every button in Yellow 500  
✓ **Do**: Reserve Yellow 500 for 1-2 critical actions per screen

**Why**: When everything screams, nothing stands out.

### 4. Ignoring the 500-Level Base
❌ **Don't**: Jump from 300 directly to 700  
✓ **Do**: Use 500 as your primary, 300/700 as variations

**Why**: 500-level colors are calibrated as the "true" color—others are derivatives.

### 5. Mixing Warm and Cool Randomly
❌ **Don't**: Cyan 500 button next to Amber 500 button (same hierarchy)  
✓ **Do**: Use temperature to signal different types (Cyan = info, Amber = warning)

**Why**: Temperature consistency helps users build mental models.

---

## Advanced Techniques

### Glass Morphism
Create modern glass effects:
```
Background: Gray 700 at 40% opacity
Backdrop blur: 20px
Border: 1px White 300 at 20% opacity
Shadow: Black 900 at 30% opacity
```

### Neon Glow Effects
Simulate glowing neon (use sparingly):
```
Text: Cyan 500
Text shadow: 
  0 0 10px Cyan 500 at 60%,
  0 0 20px Cyan 700 at 40%,
  0 0 30px Cyan 900 at 20%
```

### Gradient Overlays
Create depth and atmosphere:
```
Linear gradient:
  Black 500 (top)
  → Purple 900 at 30% opacity (middle)
  → Black 700 (bottom)
```

### Progressive Disclosure
Reveal complexity gradually using opacity:
- Inactive state: Gray 500 at 40% opacity
- Hover: Gray 500 at 70% opacity
- Active: Gray 300 at 100% opacity

---

## Implementation Tips

### CSS Custom Properties
```css
:root {
  --color-purple-500: #B026FF;
  --color-black-500: #0A0A0F;
  --color-white-500: #E8E8F0;
  /* ... */
}

.button-primary {
  background: var(--color-purple-500);
  color: var(--color-white-100);
}
```

### Theme Switching
```javascript
// Toggle between original and WCAG
document.documentElement.setAttribute('data-theme', 'wcag');

[data-theme="wcag"] {
  --color-yellow-500: #E6D200; /* WCAG yellow */
}

[data-theme="original"] {
  --color-yellow-500: #F9F002; /* Original yellow */
}
```

### Dark/Light Mode
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: var(--color-black-500);
    --text: var(--color-white-500);
  }
}

@media (prefers-color-scheme: light) {
  :root {
    --bg: var(--color-white-100);
    --text: var(--color-black-500);
  }
}
```

---

## Final Recommendations

### Starting Point
1. **Choose your theme**: Original for marketing, WCAG for applications
2. **Set your mode**: Dark for cyberpunk aesthetic, light for broad accessibility
3. **Establish hierarchy**: Black/White families for structure, accents for emphasis
4. **Test at scale**: What works on one button may overwhelm when repeated

### The 60-30-10 Rule
- **60%** - Neutrals (Black, Gray, White families)
- **30%** - Primary accent (usually Purple)
- **10%** - Secondary accents (Yellow, Cyan, others)

### Evolution Strategy
- Start with WCAG theme for everything
- Introduce Original theme selectively for hero moments
- A/B test which resonates with your audience
- Let brand personality guide the balance

---

## Conclusion

This cyberpunk palette system gives you the tools to create visually striking, accessible, and systematically consistent interfaces. The key is understanding when to prioritize aesthetic impact (Original theme) versus accessibility (WCAG theme), and using the intensity scale (100-900) to create sophisticated hierarchies.

Remember: the best design systems are living documents. Use these guidelines as a foundation, but don't be afraid to experiment and discover new pairings that work for your specific use case.

**When in doubt**: Use 500-level colors for primary elements, stay within color families for monochromatic depth, and always test your contrast ratios.