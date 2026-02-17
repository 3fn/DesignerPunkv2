# Web Component Demo Rendering Issues

**Date**: February 17, 2026
**Discovered During**: Spec 061 - Component Demo System, manual browser testing
**Severity**: High — multiple components fail to render or render incorrectly in browser
**Status**: Open

---

## Root Cause Summary

Most issues trace back to component source code referencing CSS custom property names that don't exist in the generated `tokens.css`. These are component-level bugs, not demo-level bugs. The demos are correctly structured and are surfacing pre-existing issues in the web component implementations.

---

## Issue 1: ButtonVerticalListItem — Missing `--color-background` token

**Symptom**: Button-VerticalList components don't display at all.
**Console Error**: `Error: Button-VerticalList-Item: Missing required CSS variables: --color-background. Ensure Rosetta-generated tokens are loaded before using this component.`

**Root Cause**: `ButtonVerticalListItem.web.ts` line 65 lists `--color-background` in `REQUIRED_CSS_VARIABLES` and line 370 reads it for hover calculation. This token does not exist in `tokens.css`. The closest match is `--color-background-primary-subtle`.

**File**: `src/components/core/Button-VerticalList-Item/platforms/web/ButtonVerticalListItem.web.ts`
**Lines**: 65, 370-374

**Fix Required**: Update the token reference to the correct CSS custom property name that exists in `tokens.css`.

**Affected Demos**: `button-vertical-list-demo.html`

---

## Issue 2: InputTextBase — Missing `--color-primary` token

**Symptom**: Extensive console warnings flooding the page. Labels for input active state render as gray. Blend color calculations fail.
**Console Warning**: `InputTextBase: Could not calculate blend colors, using CSS fallbacks`
**Console Error**: `Error: InputTextBase: Required token --color-primary is missing from CSS custom properties`

**Root Cause**: `InputTextBase.web.ts` line 172 reads `--color-primary` for blend color calculations. This token was renamed to `--color-action-primary` in the token system. The component still references the old name.

**File**: `src/components/core/Input-Text-Base/platforms/web/InputTextBase.web.ts`
**Lines**: 172-176

**Fix Required**: Update `--color-primary` reference to `--color-action-primary`.

**Affected Demos**: `input-text-demo.html`, and any demo composing InputTextBase (e.g., `container-base-demo.html`, `container-card-demo.html`)

---

## Issue 3: ContainerBase — Silent fallback chain for hover colors

**Symptom**: Container Base and Container Card components don't display hover effects. Warning about fallbacks in console.
**Console Warning**: Fallback-related warnings when hoverable containers attempt blend calculations.

**Root Cause**: `ContainerBase.web.ts` `_calculateBlendColors()` (line 213) has a cascading fallback chain: background token → `--color-surface` → `--color-canvas` → `--color-background`. The final fallback `--color-background` doesn't exist. When all fallbacks fail, hover color silently becomes empty string.

**Concern**: The current behavior silently degrades rather than failing loudly. Per project philosophy, components should surface issues visibly during development rather than silently degrading.

**File**: `src/components/core/Container-Base/platforms/web/ContainerBase.web.ts`
**Lines**: 213-258

**Fix Required**: 
1. Review whether the fallback chain references correct token names
2. Consider adding a console warning when all fallbacks fail (fail loudly)
3. Verify `--color-surface` and `--color-canvas` exist in `tokens.css` and resolve correctly

**Affected Demos**: `container-base-demo.html`, `container-card-demo.html`

---

## Issue 4: ProgressIndicatorNodeBase — Invalid icon size 18

**Symptom**: Console flooded with errors on Progress Indicator and Progress Stepper demos.
**Console Error**: `Error: Invalid icon size: 18. Valid sizes are: 13, 20, 24, 28, 32, 36, 40, 44, 48. Ensure you're using a valid IconBaseSize value.`

**Root Cause**: `ProgressIndicatorNodeBase.web.ts` render method (approx. line 190) passes `size="18"` to `<icon-base>` when the node size is `lg`:
```typescript
innerHTML = `<span class="node__content"><icon-base name="..." size="${size === 'md' ? 13 : 18}" color="inherit"></icon-base></span>`;
```
18 is not a valid IconBase size. Valid sizes are `[13, 20, 24, 28, 32, 36, 40, 44, 48]`.

**File**: `src/components/core/Progress-Indicator-Node-Base/platforms/web/ProgressIndicatorNodeBase.web.ts`
**Line**: ~190 (render method, icon content branch)

**Fix Required**: Change `18` to `20` (next valid size up).

**Affected Demos**: `progress-indicator-demo.html`, `progress-stepper-demo.html`

**Note**: The `size` getter error message (line ~325) also incorrectly lists 18 as valid: `"Valid sizes are: 13, 18, 24..."` while the actual validation array uses `[13, 20, 24...]`. The error message should be corrected too.

---

## Issue 5: Checkbox — White checkbox color and Legal pre-check warning

**Symptom**: Checkbox renders with white/cyan fill instead of expected design system colors. Legal checkbox shows console warning about pre-checked state.
**Console Warning**: `Input-Checkbox-Legal: Pre-checked state not allowed with requiresExplicitConsent. Overriding to unchecked. Legal consent must be explicitly given by the user.`

**Root Cause (warning)**: The demo intentionally demonstrates the pre-check blocking behavior with `<input-checkbox-legal ... checked>` in the "Explicit Consent Enforcement" section. The warning is expected and documented in the demo. This is not a bug.

**Root Cause (white color)**: Likely related to the same missing token pattern as Issues 1-3. The checkbox may reference a color token that doesn't exist or has been renamed, causing it to fall back to browser defaults (white/cyan).

**File**: Needs investigation — check `InputCheckboxBase.web.ts` and `InputCheckboxLegal.web.ts` for token references
**Fix Required**: Investigate which color tokens the checkbox components reference and verify they exist in `tokens.css`.

**Affected Demos**: `checkbox-demo.html`

---

## Issue 6: Hover states not working on most demos

**Symptom**: Hover effects work on Button-CTA and Button-Icon demos but not on other components (Container, Checkbox, VerticalList, etc.).

**Root Cause**: Hover state implementations on most components depend on blend color calculations that require tokens like `--color-primary` or `--color-background`. Since those tokens are missing/renamed (Issues 1-3), the blend calculations fail and hover effects don't apply. Button-CTA and Button-Icon likely use a different hover mechanism that doesn't depend on those specific tokens.

**Fix Required**: Resolving Issues 1-3 should fix most hover state problems. After those fixes, verify hover behavior across all interactive demos.

**Affected Demos**: Most demos except `button-cta-demo.html` and `button-icon-demo.html`

---

## Recommended Fix Order

1. **Issue 2** (InputTextBase `--color-primary`) — highest impact, affects multiple demos and floods console
2. **Issue 1** (ButtonVerticalListItem `--color-background`) — component completely fails to render
3. **Issue 4** (ProgressIndicatorNodeBase icon size) — straightforward fix, affects two demos
4. **Issue 3** (ContainerBase fallback chain) — review fail-loud philosophy compliance
5. **Issue 5** (Checkbox colors) — investigate after 1-3 are fixed, may resolve itself
6. **Issue 6** (Hover states) — verify after 1-3 are fixed, likely resolves itself

---

## Cross-References

- Spec 061: Component Demo System (`.kiro/specs/061-component-demo-system/`)
- Token generation: Rosetta System (`src/build/tokens/`)
- Browser bundle: `src/browser-entry.ts`
- Generated tokens: `dist/browser/tokens.css`
