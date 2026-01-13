# Spec 040 Visual Verification Findings

**Date**: 2026-01-13
**Spec**: 040 - Component Alignment
**Task**: 7.2 Visual Verification
**Organization**: audit-findings
**Scope**: cross-project

---

## Summary

During visual verification of spec 040 component alignment work, several issues were identified. Analysis determined that most issues are **pre-existing architectural problems** not caused by spec 040 changes.

## Issues Found

### Issue 1: Float Label Animation Not Working (Input-Text Components)

**Severity**: Medium
**Components Affected**: Input-Text-Base, Input-Text-Email, Input-Text-PhoneNumber
**Exception**: Input-Text-Password (works when toggling show/hide)

**Symptoms**:
- Float labels don't animate when focusing input fields
- Labels don't reposition from inside to above the input

**Root Cause Analysis**:
The `InputTextBase.web.ts` component has a fundamental architecture problem. The `render()` method completely replaces the shadow DOM content (`this._shadowRoot.innerHTML = ''`) on every render. While `updateLabelPosition()` tries to toggle classes incrementally, the initial render and any attribute changes trigger a full re-render that destroys the DOM elements.

The float label animation works in Input-Text-Password because the show/hide toggle likely doesn't trigger a full re-render - it just toggles the input type attribute.

**Spec 040 Impact**: None. Spec 040 only extracted CSS to external file (Task 4.1) - rendering logic unchanged.

**Recommendation**: Create new spec to implement incremental DOM pattern for Input-Text-Base (similar to what was done for Button-CTA and ButtonIcon in spec 040).

---

### Issue 2: Container Border Styles Not Displaying

**Severity**: Low
**Components Affected**: Container-Base

**Symptoms**:
- Border styles specified via `border` attribute don't render

**Root Cause Analysis**:
Requires further investigation. Could be:
- CSS token reference issue
- Attribute parsing issue
- Rendering problem

**Spec 040 Impact**: None. Container-Base was not modified in spec 040.

**Recommendation**: Investigate and create separate bug fix or spec.

---

### Issue 3: Tab Navigation Not Working for Buttons

**Severity**: High (Accessibility)
**Components Affected**: Button-CTA, ButtonIcon, Button-VerticalListItem

**Symptoms**:
- Tab key doesn't focus button components
- Tab navigation works for Input-Text components

**Root Cause Analysis**:
The button components use Shadow DOM without `delegatesFocus: true`. When tabbing to a web component with shadow DOM, focus goes to the host element, not the inner button. Without `delegatesFocus: true`, the inner button doesn't receive focus.

```typescript
// Current (broken):
this._shadowRoot = this.attachShadow({ mode: 'open' });

// Should be:
this._shadowRoot = this.attachShadow({ mode: 'open', delegatesFocus: true });
```

**Spec 040 Impact**: None. Spec 040 didn't change shadow DOM attachment.

**Recommendation**: Create new spec to add `delegatesFocus: true` to all interactive components.

---

### Issue 4: Button-VerticalListItems Not Displaying (FIXED)

**Severity**: High
**Components Affected**: Button-VerticalListItem demo page

**Symptoms**:
- No vertical list button items rendered on demo page
- Button containers visible but no content (labels, icons, descriptions)

**Root Cause Analysis**:
Two issues were found:

1. **Tag name mismatch**: The demo used `<button-vertical-list>` but the component is registered as `vertical-list-button-item`.

2. **Demo architecture mismatch**: The demo was written expecting a **container component** (`ButtonVerticalList`) that accepts an `items` array and renders multiple buttons. However, only the **single-item component** (`ButtonVerticalListItem`) exists in the browser bundle. The demo was trying to set `items` property on a component that doesn't support it.

**Resolution**: 
- Fixed tag name to `vertical-list-button-item`
- Rewrote demo to use individual `<vertical-list-button-item>` elements with proper attributes (`label`, `description`, `leading-icon`, `visual-state`)
- Added JavaScript click handlers to manage selection state changes

---

## Verification Results

### Components Verified (Spec 040 Changes)

| Component | Renders | Blend Colors | Motion Tokens | CSS External | Notes |
|-----------|---------|--------------|---------------|--------------|-------|
| ButtonIcon | ✅ | ✅ | ✅ | ✅ | All spec 040 changes working |
| Button-CTA | ✅ | ✅ | ✅ | N/A | Incremental DOM working |
| Button-VerticalListItem | ✅ | ✅ | N/A | N/A | Demo fixed; multi-select needs debounce |
| Input-Text-Base | ✅ | ✅ | N/A | ✅ | CSS extraction working |

### Pre-existing Issues (Not Spec 040)

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| Float label animation | Medium | New spec for incremental DOM |
| Container borders | Low | Bug investigation |
| Tab navigation (buttons) | High | New spec for delegatesFocus |
| Double click event dispatch | Medium | New spec for event architecture |

---

### Issue 5: Button-VerticalListItem Double Click Event Dispatch

**Severity**: Medium
**Components Affected**: Button-VerticalListItem

**Symptoms**:
- Multi-select toggle appears not to work (clicking doesn't change state)
- Single-select works correctly

**Root Cause Analysis**:
The `ButtonVerticalListItem.web.ts` component dispatches a custom `click` event in its `_handleClick` method:

```typescript
private _handleClick = (): void => {
  // ...
  this.dispatchEvent(new CustomEvent('click', {
    bubbles: true,
    composed: true
  }));
};
```

However, the native click event from the internal `<button>` element ALSO bubbles through the shadow DOM with `composed: true`. This results in **two click events** reaching external listeners.

For idempotent handlers (like single-select which sets a specific state), this is harmless. But for toggle handlers (like multi-select which flips between checked/unchecked), the double-fire causes the state to toggle twice, returning to the original state.

**Demo Workaround**:
Added debounce flag in demo JavaScript to prevent double-toggle:
```javascript
let isProcessing = false;
button.addEventListener('click', (event) => {
  if (isProcessing) return;
  isProcessing = true;
  // ... toggle logic ...
  requestAnimationFrame(() => { isProcessing = false; });
});
```

**Spec 040 Impact**: None. This is pre-existing component architecture.

**Recommendation**: Fix the component to not dispatch a redundant click event, OR use `event.stopPropagation()` on the internal button's native click to prevent it from bubbling. This should be addressed in a future spec.

---

## Conclusion

Spec 040 component alignment changes are working correctly. The issues found during visual verification are pre-existing architectural problems that should be addressed in future specs.

**Recommended Follow-up Specs**:
1. **Spec 041**: Input-Text-Base Incremental DOM Migration (float label fix)
2. **Spec 042**: Shadow DOM Focus Delegation (tab navigation fix)
3. **Spec 043**: Button-VerticalListItem Event Architecture (double-click fix)
4. **Bug**: Container-Base border rendering investigation
