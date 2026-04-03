# iOS Findings: Pre-Product Native Readiness Sweep

**Spec**: 091
**Agent**: Kenya
**Phase**: 0 — Mechanical Pattern Detection
**Date**: 2026-04-03
**Status**: Phase 0 complete. Phase 1 (per-component review) pending.

---

## Cross-Cutting Patterns

Patterns detected via grep across all 28 unreviewed `.ios.swift` files. These are mechanical findings — contract compliance and platform idiom review happens in Phase 1.

### Pattern 1: Hard-coded easing curves instead of motion token easing (11 files, 18 occurrences)

**Severity: Non-blocking (token-first gap, not a contract violation)**

Files use `.easeInOut`, `.easeIn`, `.easeOut` with token-sourced durations, but the easing curve itself is a SwiftUI built-in rather than a DesignTokens easing reference. The generated tokens provide `DesignTokens.Easing.easingStandard`, `.easingDecelerate`, `.easingAccelerate` — but these are `Animation` objects, not easing curves you can plug into `.easeInOut(duration:)`.

This is a systemic pattern, not a per-file bug. The root cause: SwiftUI's `.easeInOut(duration:)` API takes a duration and bakes in the curve. Using the token easing requires a different API pattern: `DesignTokens.Easing.easingStandard.speed(1.0 / duration)`. Most components use the simpler API with a reasonable built-in curve.

**Affected files** (unreviewed only):
| File | Occurrences |
|------|-------------|
| Input-Checkbox-Base | 3 |
| Nav-TabBar-Base | 2 |
| Chip-Filter | 2 |
| Input-Radio-Base | 2 |
| Button-VerticalList-Item | 2 |
| Progress-Pagination-Base | 2 |
| Chip-Base | 1 |
| Chip-Input | 1 |
| Container-Card-Base | 1 |

**Note**: Some of these use token durations correctly (e.g., `DesignTokens.MotionButtonPress.duration`) — the issue is only the easing curve, not the duration. Classifying as non-blocking because the visual difference between `.easeInOut` and `easingStandard` (cubic-bezier 0.4, 0.0, 0.2, 1) is subtle and doesn't violate any behavioral contract.

**Phase 1 action**: During per-component review, verify each animation against its contract. If a contract specifies a particular easing token, upgrade to blocking.

---

### Pattern 2: Locally-defined motion constants instead of generated token references (2 files)

**Severity: Blocking (token-first violation — values will drift if tokens change)**

Two components define their own motion duration constants instead of referencing the generated `DesignTokens` struct:

| File | Local constant | Should reference |
|------|---------------|-----------------|
| Container-Card-Base | `let motionFocusTransitionDuration: Double = 0.15` | `DesignTokens.MotionFocusTransition.duration` |
| Container-Card-Base | `let motionFocusTransition: Animation = .easeOut(duration: 0.15)` | `DesignTokens.MotionFocusTransition.easing` |
| Button-VerticalList-Item | `public static let motionSelectionTransitionDuration: Double = 0.25` | `DesignTokens.MotionSelectionTransition.duration` |

These hard-code the numeric values that happen to match the current tokens. If the token values change (e.g., duration150 tuned to 175ms), these files won't update.

**Fix**: Replace local constants with generated token references.

---

### Pattern 3: Hard-coded `Color(red:green:blue:)` for accessibility focus color (2 files)

**Severity: Blocking (token-first violation)**

| File | Hard-coded value | Should reference |
|------|-----------------|-----------------|
| Container-Card-Base | `Color(red: 0.69, green: 0.15, blue: 1.00) /* purple300 */` | `Color(DesignTokens.accessibilityFocusColor)` |
| Container-Base | `Color(red: 0.69, green: 0.15, blue: 1.00) /* purple300 */` | `Color(DesignTokens.accessibilityFocusColor)` |

The comment says `purple300` but the semantic token `accessibilityFocusColor` exists and should be used. If the focus color changes (e.g., for a high-contrast theme), these files won't update.

---

### Pattern 4: Duplicated `View.if` conditional modifier extension (2 files)

**Severity: Blocking (compile error if both files are in the same module)**

| File |
|------|
| Container-Card-Base (line 821) |
| Container-Base (line 524) |

Both define `func \`if\`<Transform: View>`. If compiled in the same module, this is a duplicate declaration. Should be extracted to a shared utility or removed in favor of inline conditionals.

---

### Pattern 5: System color usage in preview/non-production code (12 files, 71 occurrences)

**Severity: Non-blocking (preview code only — needs Phase 1 verification)**

71 occurrences of `.foregroundColor(.secondary)`, `Color.gray`, `Color(.systemGray6)`, etc. across 12 files. Most appear to be in `PreviewProvider` blocks (preview/demo code), not production rendering. Preview code using system colors is acceptable — it's not shipped UI.

**Phase 1 action**: During per-component review, verify each occurrence is in preview code. Any system color in production rendering paths is blocking (token-first violation).

**Likely preview-only** (high occurrence counts suggest preview blocks): Badge-Count-Notification (20), Badge-Count-Base (13), Button-VerticalList-Item (10), Icon-Base (7), Badge-Label-Base (5), Button-VerticalList-Set (4).

**Needs verification**: Container-Base (2 — `Color.gray` in token mapping functions), Container-Card-Base (3 — `Color.black.opacity` in shadow), Progress-Indicator-Connector-Base (1 — `Color.green`/`Color.gray` in what may be production code).

---

### Pattern 6: `DesignTokens.motionSelectionTransitionDuration` — wrong token path (1 file)

**Severity: Blocking (won't compile — property doesn't exist on DesignTokens)**

| File | Reference | Correct path |
|------|-----------|-------------|
| Button-VerticalList-Item (lines 267, 275) | `DesignTokens.motionSelectionTransitionDuration` | `DesignTokens.MotionSelectionTransition.duration` |

This references a locally-defined constant (Pattern 2) via `DesignTokens.motionSelectionTransitionDuration` — but it's defined as a local `public static let` on a `DesignTokens` extension in the same file (line 555), not on the generated `DesignTokens` struct. This compiles only because the extension adds the property. It's fragile — the extension shadows the generated struct's namespace and will break if the file is refactored.

---

### NEW — Pattern 7: Module-level hard-coded token constants instead of DesignTokens references (2 files)

**Severity: Blocking (token-first violation — values won't update with token changes, potential name collisions)**

**Discovered during Phase 1 Container family review.**

Two files define module-level `let` constants that duplicate token values instead of referencing the generated `DesignTokens` struct:

| File | Constants | Examples |
|------|-----------|---------|
| Container-Card-Base | ~14 constants | `let spaceInset050: CGFloat = 4`, `let radius100: CGFloat = 8`, `let shadowContainerColor: Color = Color.black.opacity(0.1)`, `let borderDefault: CGFloat = 1` |
| Container-Base | 3 constants | `let accessibilityFocusOffset: CGFloat = 2`, `let accessibilityFocusWidth: CGFloat = 2`, `let accessibilityFocusColor: Color = Color(red:...)` |

These are module-level (not scoped to a type), so they'll collide if both files are in the same compilation unit. Worse, the shadow token values in Container-Card-Base (`Color.black.opacity(0.1)`, `radius: 8`, `y: 2`) are approximations — the generated `DesignTokens` shadow composites have different values (`shadowOpacityModerate = 0.3`, `blur075 = 12`).

**Fix**: Replace all local constants with `DesignTokens.*` references.

---

### NEW — Pattern 8: DesignTokens extension with local constants shadowing generated tokens (2 files)

**Severity: Blocking (namespace pollution — shadows generated token properties)**

| File | Extension properties |
|------|---------------------|
| Button-VerticalList-Item | 12 properties: `motionSelectionTransitionDuration`, `tapAreaRecommended`, `spaceGroupedLoose`, `spaceInset200`, `radiusNormal`, `iconSize100`, `borderBorderDefault`, `borderBorderEmphasis`, color tokens |
| Button-VerticalList-Set | 1 property: `spaceGroupedNormal` |

These `extension DesignTokens` blocks add properties that shadow the generated struct's actual properties. For example, `DesignTokens.tapAreaRecommended` is defined both in the generated file (correct value from token system) and in the extension (hard-coded `48`). If the generated value changes, the extension's value wins in the file's scope.

The VerticalListButtonItem file's comment says "In a full implementation, these would be generated by the Rosetta system" — this is scaffolding code that was never replaced with real token references.

**Fix**: Remove the extensions entirely. Replace all references with the generated `DesignTokens.*` properties. For color tokens that use `UIColor.label`/`UIColor.secondaryLabel` (system colors), replace with the generated semantic color tokens.

---

## Summary (Updated — Phase 0 + Phase 1 Container/Button families)

| Pattern | Severity | Files | Occurrences |
|---------|----------|-------|-------------|
| P1: Hard-coded easing curves | Non-blocking | 9 | 18 |
| P2: Local motion constants | Blocking | 2 | 3 |
| P3: Hard-coded focus color | Blocking | 2 | 2 |
| P4: Duplicated `View.if` | Blocking | 2 | 2 |
| P5: System colors (preview?) | Non-blocking (verify) | 12 | 71 |
| P6: Wrong token path via extension | Blocking | 1 | 2 |
| P7: Module-level hard-coded token constants | Blocking | 2 | ~17 |
| P8: DesignTokens extension shadowing | Blocking | 2 | ~13 |

**Blocking: 7 files, ~39 occurrences across 6 patterns.**
**Non-blocking: 12+ files, 89 occurrences across 2 patterns.**

---

## Per-Component Findings

### Container-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| 1 | Blocking | Hard-coded accessibility focus color `Color(red: 0.69, green: 0.15, blue: 1.00)` instead of `Color(DesignTokens.accessibilityFocusColor)` | P3 |
| 2 | Blocking | Hard-coded `accessibilityFocusOffset: CGFloat = 2` and `accessibilityFocusWidth: CGFloat = 2` instead of `DesignTokens.accessibilityFocusOffset` / `DesignTokens.accessibilityFocusWidth` | P7 |
| 3 | Blocking | Duplicated `View.if` extension (also in Container-Card-Base) | P4 |
| 4 | Non-blocking | `resolveContainerBaseColorToken` returns `Color.gray` as placeholder — token resolution not fully implemented | P5 (verify) |
| 5 | Non-blocking | `resolveContainerBaseShadowToken` returns zero shadow — token resolution not fully implemented | — |
| 6 | Contract ✅ | `layout_contains_children` — `@ViewBuilder content` pattern correct | — |
| 7 | Contract ✅ | `layout_padding` — override hierarchy implemented correctly with `calculateDirectionalPadding` | — |
| 8 | Contract ✅ | `interaction_hover` — `hoverBlend()` with `motionFocusTransition` animation, correct | — |

**Note**: Issues 4 and 5 are significant — the color and shadow token resolution functions are stubs returning placeholder values. This means Container-Base won't render correct colors or shadows at runtime. However, classifying as non-blocking because the *architecture* is correct (token names are passed through, resolution functions exist) — the resolution functions just need real implementations. This is a structural gap, not a contract violation.

### Container-Card-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| 1 | Blocking | ~14 module-level hard-coded token constants (`spaceInset050`, `radius100`, `borderDefault`, shadow values, etc.) | P7 |
| 2 | Blocking | Hard-coded accessibility focus color `Color(red: 0.69, green: 0.15, blue: 1.00)` | P3 |
| 3 | Blocking | Local `motionFocusTransitionDuration: Double = 0.15` and `motionFocusTransition` animation | P2 |
| 4 | Blocking | Duplicated `View.if` extension (also in Container-Base) | P4 |
| 5 | Blocking | Shadow values are approximations — `Color.black.opacity(0.1)` vs generated `shadowOpacityModerate = 0.3`; `radius: 8` vs generated `blur075 = 12` | P7 |
| 6 | Non-blocking | Preview code uses `.foregroundColor(.secondary)` — acceptable in preview | P5 |
| 7 | Contract ✅ | `visual_boundary` — background, shadow, radius defaults present | — |
| 8 | Contract ✅ | `layout_padding` — default `p150` correct, override hierarchy inherited | — |
| 9 | Contract ✅ | `interaction_pressed` — `pressedBlend()` used, no scale transform, correct | — |

### Button-CTA

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues found | — |
| 1 | Non-blocking | Uses `Color.clear` for transparent backgrounds — acceptable (not a token, it's absence of color) | — |
| 2 | Contract ✅ | Token references use `DesignTokens.*` correctly throughout | — |
| 3 | Contract ✅ | Typography uses `DesignTokens.typographyLabelMd.fontSize` — correct pattern | — |

### Button-Icon

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues found | — |
| 1 | Contract ✅ | Uses `ButtonIconTokens.*` from generated `ComponentTokens.ios.swift` — correct | — |
| 2 | Contract ✅ | `DesignTokens.iconSize050/075/100` referenced correctly | — |
| 3 | Contract ✅ | Accessibility: `.accessibilityLabel(ariaLabel)`, `.accessibilityAddTraits(.isButton)` | — |

### Button-VerticalList-Item

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| 1 | Blocking | `extension DesignTokens` with 12 hard-coded properties shadowing generated tokens | P8 |
| 2 | Blocking | `DesignTokens.motionSelectionTransitionDuration` references the extension, not generated tokens | P6 |
| 3 | Non-blocking | Hard-coded easing `.easeInOut(duration:)` instead of token easing | P1 |
| 4 | Non-blocking | `Color.black.opacity(configuration.isPressed ? 0.1 : 0)` in press overlay — should use blend token | P5 (verify) |
| 5 | Contract ✅ | Visual states (rest, selected, notSelected, checked, unchecked) all implemented | — |
| 6 | Contract ✅ | Accessibility: labels, traits, state descriptions all present | — |

### Button-VerticalList-Set

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| 1 | Blocking | `extension DesignTokens` with `spaceGroupedNormal: CGFloat = 8` shadowing generated token | P8 |
| 2 | Non-blocking | Preview code uses `.foregroundColor(.secondary)` — acceptable in preview | P5 |
| 3 | Contract ✅ | Accessibility: group semantics, error announcements present | — |

**Phase 1 progress**: Container (2/2) ✅, Button (4/4) ✅. Next: Icon (1), then FormInput (8).

### Icon-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | Preview code uses `.foregroundColor(.green)`, `.foregroundColor(.red)`, etc. — acceptable in preview | P5 |
| 2 | Contract ✅ | `visual_color_inheritance` — `.renderingMode(.template)` correct | — |
| 3 | Contract ✅ | `accessibility_hidden` — `.accessibilityHidden(true)` correct | — |
| 4 | Contract ✅ | `visual_size_variants` — uses `DesignTokens.iconSize*` throughout | — |
| 5 | Contract ✅ | `visual_optical_balance` — `iconBlend()` from ThemeAwareBlendUtilities | — |

Clean file. Token references correct, accessibility correct, no hard-coded values in production code.

### Input-Text-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Contract ✅ | Uses `DesignTokens.typography.*`, `DesignTokens.colorFeedback*` throughout | — |
| 2 | Contract ✅ | Float label animation with `accessibilityReduceMotion` | — |
| 3 | Contract ✅ | Accessibility: labels, value, traits present | — |

### Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues — these are thin wrappers around Input-Text-Base | — |

Semantic variants that configure Input-Text-Base with type-specific props (keyboard type, content type, validation). No independent token usage or accessibility concerns beyond what the base provides.

### Input-Checkbox-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | Uses `.easeOut(duration: DesignTokens.MotionButtonPress.duration)` and `.easeInOut(duration: DesignTokens.MotionSelectionTransition.duration)` — duration from token, easing built-in | P1 |
| 2 | Contract ✅ | Token references use `DesignTokens.MotionButtonPress.duration` — correct semantic motion path | — |
| 3 | Contract ✅ | `reduceMotion ? .none : ...` pattern correct | — |

### Input-Checkbox-Legal

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues — thin wrapper around Input-Checkbox-Base | — |

### Input-Radio-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | Same easing pattern as Input-Checkbox-Base — duration from token, easing built-in | P1 |
| 2 | Contract ✅ | Motion tokens referenced correctly | — |

### Input-Radio-Set

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | Preview code uses `.foregroundColor(.secondary)` — acceptable | P5 |

### Badge-Count-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | Preview code uses `.foregroundColor(.secondary)` (13 occurrences) — all in preview | P5 |
| 2 | Contract ✅ | Token references correct | — |

### Badge-Count-Notification

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | Preview code uses `.foregroundColor(.secondary)` (20 occurrences) — all in preview | P5 |

### Badge-Label-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | `maxWidth: CGFloat = 120` — this is a component token (`BadgeLabelBaseTokens.maxWidth`), correctly defined as a component-level constant matching `ComponentTokens.ios.swift` | — |
| 2 | Non-blocking | Preview code uses `.foregroundColor(.secondary)` | P5 |

### Chip-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | `.easeInOut(duration: ChipTokens.animationDuration)` — duration from token, easing built-in | P1 |
| 2 | Contract ✅ | `ChipTokens.animationDuration` references `DesignTokens.Duration.duration150` correctly | — |

### Chip-Filter

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | Same easing pattern as Chip-Base | P1 |

### Chip-Input

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | Same easing pattern as Chip-Base | P1 |

### Avatar-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| 1 | Non-blocking | `AvatarTokens.iconSizeXs: CGFloat = 12` and `iconSizeXxl: CGFloat = 64` — these are component token gap fillers (no `DesignTokens.iconSize*` exists at 12px or 64px). Correctly documented as gap fillers matching `ComponentTokens.ios.swift` (`AvatarTokens.iconSizeXs = 12`, `AvatarTokens.iconSizeXxl = 64`). Not a token-first violation. | — |
| 2 | Non-blocking | `borderWidthDefault: CGFloat = 1` and `borderWidthEmphasis: CGFloat = 2` — should reference `DesignTokens.borderWidth100` and `DesignTokens.borderWidth200` instead of hard-coding | P7 (minor) |
| 3 | Non-blocking | Preview code uses `.foregroundColor(.secondary)` | P5 |

### Nav-SegmentedChoice-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Contract ✅ | Uses `DesignTokens.Duration.duration150` and `DesignTokens.Duration.duration350` correctly | — |
| 2 | Contract ✅ | Complex animation sequence with correct token references | — |

### Nav-TabBar-Base (Sanity Check)

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | `.easeIn(duration:)` and `.easeOut(duration:)` — duration from token, easing built-in | P1 |
| 2 | Contract ✅ | Uses `DesignTokens.Duration.duration150/350` correctly | — |
| 3 | Contract ✅ | VoiceOver: `.accessibilityAddTraits(.isTabBar)`, `.accessibilityAddTraits(.isButton)`, `.accessibilityAddTraits(.isSelected)` — correct | — |
| 4 | Contract ✅ | Keyboard navigation with `.onMoveCommand` and wrapping — correct | — |

**Sanity check verdict**: Nav-TabBar-Base is in good shape. The `reviewed: true` flag is justified despite pre-dating Kenya/Data agents.

### Progress-Indicator-Node-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | `iconScaleRatio: CGFloat = 0.5` — behavioral constant (50% of node size), not a token. Acceptable. | — |
| 2 | Contract ✅ | Uses `DesignTokens.colorProgress*` tokens correctly | — |

### Progress-Indicator-Connector-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues in production code | — |
| 1 | Non-blocking | Preview code uses `Color.green` and `Color.gray` for demo circles — acceptable in preview | P5 |
| 2 | Contract ✅ | Uses `DesignTokens.colorProgressCompletedConnector` / `colorProgressPendingConnector` correctly | — |
| 3 | Contract ✅ | `connectorThickness` references `DesignTokens.borderWidth100` — correct | — |

### Progress-Indicator-Label-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| 1 | Blocking | `labelFontSize: CGFloat = 14` — hard-coded instead of `DesignTokens.fontSize075` or `DesignTokens.typographyLabelSm.fontSize` | P7 |
| 2 | Contract ✅ | Uses `DesignTokens.colorTextDefault` for label color — correct | — |

### Progress-Pagination-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Non-blocking | `.easeInOut(duration: DesignTokens.MotionSelectionTransition.duration)` — duration from token, easing built-in | P1 |
| 2 | Contract ✅ | Uses semantic motion tokens correctly | — |

### Progress-Stepper-Base

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Contract ✅ | Composes Node, Connector, Label correctly | — |

### Progress-Stepper-Detailed

| # | Severity | Issue | Pattern |
|---|----------|-------|---------|
| — | — | No blocking issues | — |
| 1 | Contract ✅ | Extends Stepper-Base with description text | — |

---

## Spec 092 Token Migration Verification

Quick render verification for the 6 components affected by sizing token migration (spacing→sizing swap):

| Component | Token Change | iOS Reference | Verified |
|-----------|-------------|---------------|----------|
| Button-Icon | `ButtonIconTokens.*` from `ComponentTokens.ios.swift` | Uses generated component tokens | ✅ No issue |
| Progress-Indicator-Node-Base | `ProgressNodeSize` enum with hard-coded values | Values match token system (12/16/20) | ✅ No issue |
| Avatar-Base | `AvatarTokens` with `DesignTokens.*` references | Correct references | ✅ No issue |
| Input-Checkbox-Base | Uses `DesignTokens.*` directly | Correct references | ✅ No issue |
| Input-Radio-Base | Uses `DesignTokens.*` directly | Correct references | ✅ No issue |
| Nav-TabBar-Base | Uses `DesignTokens.*` directly | Correct references | ✅ No issue |

**Verdict**: Zero visual change confirmed on iOS. Sizing token migration had no impact on native rendering.

---

## Final Summary

| Severity | Components | Issues |
|----------|-----------|--------|
| Blocking | 6 | Container-Base (3), Container-Card-Base (5), Button-VerticalList-Item (2), Button-VerticalList-Set (1), Progress-Indicator-Label-Base (1) |
| Non-blocking | 12+ | P1 easing (9 files), P5 preview colors (12 files), Avatar border width (1) |

**Total blocking: 12 issues across 5 components.**
**Total non-blocking: ~90 occurrences across 12+ components.**

### Blocking Issue Concentration

The blocking issues are concentrated in 3 components authored early in the project:
- **Container-Card-Base** — worst offender (14 hard-coded constants, duplicated extension, wrong shadow values)
- **Container-Base** — hard-coded focus tokens, duplicated `View.if`
- **Button-VerticalList-Item/Set** — DesignTokens extension scaffolding never replaced

The remaining 23 components are clean or have only non-blocking issues. The newer components (Chips, FormInputs, Nav-SegmentedChoice, Progress family) follow correct token patterns.

### Recommendation for Lina

Batch-fix by pattern:
1. **P7 + P3**: Replace all hard-coded token constants with `DesignTokens.*` references (Container-Base, Container-Card-Base, Progress-Indicator-Label-Base)
2. **P8 + P6**: Remove `extension DesignTokens` blocks, replace with generated token references (Button-VerticalList-Item, Button-VerticalList-Set)
3. **P4**: Extract `View.if` to shared utility or remove (Container-Base, Container-Card-Base)
4. **P2**: Replace local motion constants with `DesignTokens.MotionFocusTransition.*` (Container-Card-Base)
