# Translation Provider Narrative

**Date**: September 30, 2025  
**Purpose**: The story of Translation Providers and their role in the token ecosystem  
**Cross-Reference**: [Token Journey Narrative](token-journey-narrative.md)

---

## The Translation Provider's Story

*"I'm a Translation Provider - a language translator who helps remote workers (tokens) communicate effectively in local markets. I receive expertise from remote workers and convert that knowledge into formats that local market systems can understand and use.*

*Different Translation Providers do different translation work for different Tokens. We're specialists - each of us understands how to speak to specific platforms in their native languages.*

*Popular Translation Providers are Unit Providers - who pair units of measure with space, font size, and other token set values for the platform components and systems that will leverage them.*

*Some Tokens don't even require Translation Providers. Z-Index tokens, for example, only require a simple numerical value, so our translation services are not required.*

*But when I am needed, I have a very specific job to do..."*

---

## Where Am I Needed?

*"I'm needed wherever Tokens hold values that platforms interpret differently:*

**Unit Provider (my most common colleague)**:
- *Space tokens: `8` needs to become `0.5rem`, `8.0pt`, or `8.dp`*
- *Font size tokens: `1.125` needs to become `1.125rem`, `18.0pt`, or `18.sp`*
- *Border radius tokens: `4` needs to become `0.25rem`, `4.0pt`, or `4.dp`*

**Format Provider (my color specialist colleague)**:
- *Color tokens: `#B80F0A` needs to become `UIColor(red: 0.72...)` or `Color(0xFFB80F0A)`*
- *Gradient tokens: CSS gradients vs iOS CAGradientLayer vs Android GradientDrawable*

**Path Provider (my asset specialist colleague)**:
- *Icon tokens: SVG paths vs iOS SF Symbols vs Android Vector Drawables*
- *Image tokens: Web URLs vs iOS bundle paths vs Android resource IDs*

**Animation Provider (my motion specialist colleague)**:
- *Duration tokens: `300` milliseconds vs iOS TimeInterval vs Android duration*
- *Easing tokens: CSS cubic-bezier vs iOS CAMediaTimingFunction vs Android Interpolator*

*I'm NOT needed for:*
- *Z-index tokens: `10` works everywhere*
- *Boolean tokens: `true` works everywhere*
- *String tokens: `"DesignerPunk"` works everywhere*
- *Simple numeric tokens without units: `2` (for multipliers) works everywhere*"

---

## When Am I Needed There?

*"I don't meet with remote workers (tokens) until Build Time - well after business employees (developers) have requested their expertise for specific market operations. It's at this Build Time that the appropriate Translation Provider type translates a remote worker's expertise into that market's local format and conventions.*

*This is that crucial moment when we know the target market (platform) but before the business operations go live.*

**Too Early (Development Time)**:
- *Tokens are still pure and platform-agnostic*
- *Developers work with semantic names and mathematical values*
- *I don't know which platform I'm serving yet*

**Just Right (Build Time)**:
- *Platform target is known (`npm run build:web` vs `xcodebuild` vs `gradle build`)*
- *Token values are finalized and ready for translation*
- *Components are being compiled and need platform-specific values*
- *I can do my translation work efficiently in batch*

**Too Late (Runtime)**:
- *Performance overhead - the whole reason we exist is to avoid this*
- *Components expect platform-native values, not raw token values*
- *Users are waiting for the interface to render*"

---

## When Do I Interact with Tokens?

*"My interaction with Tokens happens in a very specific sequence:*

**1. Token Preparation Phase**:
- *Tokens have resolved their mathematical relationships*
- *Baseline calculations are complete (`space200 = space100 * 2`)*
- *Token community is finalized (no more additions during build)*

**2. Platform Detection Phase**:
- *Build system tells me which platform I'm serving*
- *I activate the appropriate translation rules for that platform*
- *I prepare my platform-specific knowledge (REM base, density factors, color formats)*

**3. Token Translation Phase**:
- *I receive each Token that needs my services*
- *I examine the Token's type and value*
- *I apply the appropriate transformation for the target platform*
- *I output the platform-native format*

**4. Component Handoff Phase**:
- *I provide translated values to the component compilation process*
- *Components receive platform-optimized values*
- *My job is done - I don't interact with runtime*

**Example Interaction Sequence**:
```
Token says: "I'm space100 with value 8"
I ask: "What platform?"
Build system says: "Web"
I respond: "Here's 0.5rem for web components"

Token says: "I'm colorRed100 with value #B80F0A"  
I ask: "What platform?"
Build system says: "iOS"
I respond: "Here's UIColor(red: 0.72, green: 0.06, blue: 0.04, alpha: 1.0)"
```"

---

## My Relationship with the Build System

*"The Build System is my coordinator, but I'm not part of it - I'm a service it uses:*

**Build System's Role**:
- *Tells me which platform we're targeting*
- *Coordinates the timing of when I translate tokens*
- *Manages the overall build process*
- *Packages my translated output with components*

**My Role**:
- *Focus solely on token value translation*
- *Maintain platform-specific translation knowledge*
- *Ensure mathematical relationships are preserved during translation*
- *Provide consistent, optimized output*

*I'm like a specialized translator at the United Nations - the Build System coordinates the meeting, but I do the actual translation work.*"

---

## My Specialized Knowledge

*"Each type of Translation Provider has deep platform knowledge:*

**Unit Provider Knowledge**:
- *Web: REM calculations, viewport units, CSS pixel ratios*
- *iOS: Point system, display density scaling, Dynamic Type*
- *Android: Density-independent pixels, density buckets, accessibility scaling*

**Format Provider Knowledge**:
- *Web: Hex colors, RGB functions, CSS color spaces*
- *iOS: UIColor initializers, color spaces, accessibility contrast*
- *Android: Color resources, ARGB format, material color systems*

*This specialized knowledge is why Tokens don't carry platform information - they focus on mathematical relationships, and we focus on platform translation.*"

---

## Error Handling & Validation

*"When things go wrong, I fail fast and clearly:*

**Token Value Issues**:
- *"Token space999 doesn't exist - did you mean space300?"*
- *"Color value #GGGGGG is invalid hex format"*

**Platform Translation Issues**:
- *"Cannot convert percentage value to iOS points - use fixed value"*
- *"Color space not supported on target platform - using sRGB fallback"*

**Build Integration Issues**:
- *"Platform target not specified - cannot determine translation rules"*
- *"Token baseline changed during build - rebuild required"*

*I catch these issues at build time so they never reach users.*"

---

## Key Principles from the Translation Provider Narrative

### Translation Provider Identity
- **Specialized services**: Each provider handles specific token types and platforms
- **Build-time operation**: Translation happens when platform is known but before runtime
- **Platform expertise**: Deep knowledge of platform-specific formats and conventions

### Translation Provider Types
- **Unit Provider**: Dimensional tokens (spacing, sizing, typography)
- **Format Provider**: Color tokens, gradients, complex data structures  
- **Path Provider**: Assets, icons, images
- **Animation Provider**: Motion, timing, easing
- **Future providers**: Extensible for new token types

### Translation Provider Coordination
- **Build system coordination**: Build system manages timing and platform detection
- **Token interaction**: Receives finalized token values for translation
- **Component handoff**: Provides translated values to component compilation
- **Error handling**: Fails fast at build time with clear error messages

### Translation Provider Efficiency
- **Batch processing**: Translates all tokens of a type together
- **Platform optimization**: Creates platform-native formats for best performance
- **Mathematical preservation**: Maintains token relationships during translation
- **Zero runtime overhead**: All translation work completed before deployment

---

*This narrative complements the Token story by showing how platform-specific translation happens while preserving the Token's platform-agnostic mathematical purity.*