# BREAKING CHANGE: Variant Attribute Standardization

**Date**: November 25, 2025
**Spec**: 009 - Variant Attribute Standardization
**Status**: Complete
**Severity**: Breaking Change

---

## Summary

The ButtonCTA component now uses the `variant` attribute instead of `style` for component variations. This is a **breaking change** with no backward compatibility.

**Old API** (no longer supported):
```html
<button-cta style="primary" label="Submit"></button-cta>
```

**New API** (required):
```html
<button-cta variant="primary" label="Submit"></button-cta>
```

---

## Migration Guide

### Find-Replace Patterns

Use these patterns to migrate your code:

#### HTML Attributes

```bash
# Find and replace in HTML files
Find:    style="primary"
Replace: variant="primary"

Find:    style="secondary"
Replace: variant="secondary"

Find:    style="danger"
Replace: variant="danger"
```

#### TypeScript Interfaces

```bash
# Find and replace in TypeScript files
Find:    style?: 'primary' | 'secondary' | 'danger'
Replace: variant?: 'primary' | 'secondary' | 'danger'

Find:    style: 'primary' | 'secondary' | 'danger'
Replace: variant: 'primary' | 'secondary' | 'danger'
```

#### Web Component Implementation

```bash
# Find and replace in component implementation
Find:    getAttribute('style')
Replace: getAttribute('variant')

Find:    const style =
Replace: const variant =
```

#### Test Code

```bash
# Find and replace in test files
Find:    setAttribute('style',
Replace: setAttribute('variant',

Find:    .style
Replace: .variant
```

### Verification Steps

After migration, verify all changes are complete:

```bash
# 1. Search for any remaining style attribute usage
grep -r 'style="primary"' src/components/core/ButtonCTA/
grep -r 'style="secondary"' src/components/core/ButtonCTA/
grep -r 'style="danger"' src/components/core/ButtonCTA/

# 2. Search for getAttribute('style') in component code
grep -r "getAttribute('style')" src/components/core/ButtonCTA/

# 3. Search for style property in TypeScript types
grep -r "style:" src/components/core/ButtonCTA/types.ts

# 4. Run tests to verify behavior unchanged
npm test

# 5. Verify TypeScript compilation
npm run build
```

All grep commands should return no results. Tests should pass with same assertions as before.

---

## Rationale

### IDE Warnings

The `style` attribute conflicts with the standard HTML `style` attribute, causing:
- IDE warnings and error highlighting
- Confusion between CSS styles and component variants
- Potential for developer errors

**Example IDE Warning**:
```
⚠️ Attribute 'style' should contain CSS, not component variant values
```

### Industry Standards

Leading design systems use `variant` for component variations:

**Material Design**:
```html
<Button variant="contained">Submit</Button>
```

**Shoelace**:
```html
<sl-button variant="primary">Submit</sl-button>
```

**Adobe Spectrum**:
```html
<sp-button variant="accent">Submit</sp-button>
```

Using `variant` aligns DesignerPunk with established industry conventions.

### Web Component Best Practices

Custom elements should avoid attribute names that conflict with standard HTML attributes:
- Improves code clarity and maintainability
- Reduces developer confusion
- Future-proofs against HTML standard changes
- Better IDE support and autocomplete

### Developer Experience

Clear, unambiguous attribute names improve:
- Code readability
- IDE autocomplete accuracy
- Error message clarity
- Onboarding for new developers

---

## Clean Break Policy

### No Backward Compatibility

The old `style` attribute is **not supported**. This is an intentional clean break:

**Why No Backward Compatibility?**

1. **No External Users**: Only two components in early development phase
2. **Simpler Implementation**: No dual attribute support code needed
3. **Cleaner Codebase**: No deprecation management or technical debt
4. **Easy Internal Migration**: Internal prototypes can be updated immediately

**Trade-offs**:
- ✅ **Gained**: Simpler code, clean API, no deprecation overhead
- ❌ **Lost**: No graceful migration period (not needed - no external users)
- ⚠️ **Risk**: Internal prototypes break immediately (acceptable - easy to fix)

### Migration Timeline

**Immediate**: All code must be updated to use `variant` attribute
**No Grace Period**: Old `style` attribute will not work

---

## Examples

### Before (No Longer Works)

```html
<!-- ❌ WRONG - This will not work -->
<button-cta style="primary" label="Submit"></button-cta>
<button-cta style="secondary" label="Cancel"></button-cta>
<button-cta style="danger" label="Delete"></button-cta>
```

```typescript
// ❌ WRONG - This will cause type errors
export interface ButtonCTAProps {
  label: string;
  style?: 'primary' | 'secondary' | 'danger';
}
```

```typescript
// ❌ WRONG - This will not read the correct attribute
const style = this.getAttribute('style') || 'primary';
```

### After (Correct Usage)

```html
<!-- ✅ CORRECT - Use variant attribute -->
<button-cta variant="primary" label="Submit"></button-cta>
<button-cta variant="secondary" label="Cancel"></button-cta>
<button-cta variant="danger" label="Delete"></button-cta>
```

```typescript
// ✅ CORRECT - Use variant property
export interface ButtonCTAProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}
```

```typescript
// ✅ CORRECT - Read variant attribute
const variant = this.getAttribute('variant') || 'primary';
```

---

## Impact Assessment

### Affected Components

- **ButtonCTA**: Primary component affected by this change
- **Future Components**: All future components will use `variant` attribute

### Affected Code

- Web component implementation
- TypeScript type definitions
- Component documentation
- HTML examples
- Test suites

### Migration Effort

**Estimated Time**: 15-30 minutes for typical usage

**Steps**:
1. Find-replace in HTML files (5 minutes)
2. Find-replace in TypeScript files (5 minutes)
3. Find-replace in test files (5 minutes)
4. Run verification commands (5 minutes)
5. Run tests to confirm (5 minutes)

---

## Support

### Questions or Issues?

If you encounter issues during migration:

1. **Verify all find-replace patterns applied**: Use grep commands above
2. **Check TypeScript compilation**: Run `npm run build`
3. **Run test suite**: Run `npm test`
4. **Review examples**: See `src/components/core/ButtonCTA/examples/`

### Related Documentation

- [Requirements Document](./requirements.md) - Requirements 6.1, 6.2, 6.3, 6.4
- [Design Document](./design.md) - Design Decision 1: Clean Break
- [Component Development Guide](../../.kiro/steering/Component Development Guide.md) - Variant attribute standard
- [ButtonCTA README](../../src/components/core/ButtonCTA/README.md) - Updated component documentation

---

## Changelog

### Version 2.0.0 (Breaking Change)

**Changed**:
- ButtonCTA now uses `variant` attribute instead of `style`
- TypeScript interfaces use `variant` property instead of `style`
- All documentation updated to reflect new attribute name

**Removed**:
- Support for `style` attribute (breaking change)

**Rationale**:
- Avoid IDE warnings from HTML `style` attribute conflict
- Align with industry standards (Material, Shoelace, Spectrum)
- Improve developer experience and code clarity

---

**Organization**: spec-completion
**Scope**: 009-variant-attribute-standardization
