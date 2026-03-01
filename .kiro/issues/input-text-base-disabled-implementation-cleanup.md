# Input-Text-Base: Remove Disabled Implementation from Web Platform

**Date**: 2026-03-01
**Source**: Spec 066, Task 3.3
**Priority**: Low
**Component**: Input-Text-Base

## Issue

Input-Text-Base's web implementation (`InputTextBase.web.ts`) contains disabled state behavior — observes `disabled` attribute, calculates `_disabledColor` via `blend.disabledDesaturate`, applies disabled CSS class — despite the component having no `disabled` prop in types.ts. The types.ts explicitly offers `readOnly` as the "alternative to disabled."

The `state_disabled` contract was removed and replaced with a standardized exclusion in Spec 066. The web implementation's disabled handling is now undocumented legacy behavior that should be cleaned up.

## Scope

- Remove `disabled` from `observedAttributes` in `InputTextBase.web.ts`
- Remove `_disabledColor` calculation and blend utility usage for disabled state
- Remove `.disabled` CSS class handling from render method
- Remove disabled styles from `InputTextBase.web.css` (if present)
- Verify `blend.disabledDesaturate` can be removed from Input-Text-Base schema tokens
- Check if Input-Text-Email/Password/PhoneNumber inherit any disabled behavior that also needs cleanup
