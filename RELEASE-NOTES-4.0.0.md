# Release Notes v4.0.0

**Release Date**: January 6, 2026

This release introduces the Component Token Generation Pipeline, a significant architectural enhancement to the Rosetta token system, along with Input-Text component improvements and typography fixes.

---

## 🚀 Headline Feature: Component Token Generation Pipeline (Spec 037)

Introduces a new architectural layer for component-specific tokens in the Rosetta System.

### What's New

**New Token Layer**: The Rosetta pipeline now supports component tokens as a third tier:
- Before: `Primitive → Semantic → Platform Output`
- After: `Primitive → Semantic → Component → Platform Output`

**New Developer API**: `defineComponentTokens()`
- Lightweight authoring with explicit metadata
- Automatic registration with global ComponentTokenRegistry
- Returns usable token values for immediate consumption
- Enforces reasoning documentation for each token

**Cross-Platform Generation**:
- CSS custom properties: `--button-icon-inset-large: var(--space-150)`
- iOS Swift constants: `ButtonIconTokens.insetLarge`
- Android Kotlin constants: `ButtonIconTokens.insetLarge`
- Maintains token chain references (not inline values)

**Family-Aware Validation**:
- Formula-based validation for spacing and radius families
- Modular scale validation for fontSize family
- Discrete value rejection for color family (must use references)
- Imports base values from actual token files (no hardcoded magic numbers)

**New Infrastructure Files**:
- `src/build/tokens/defineComponentTokens.ts` - Token authoring API
- `src/registries/ComponentTokenRegistry.ts` - Global token registry
- `src/integration/ValidationCoordinator.ts` - Enhanced with component token validation
- `src/generators/TokenFileGenerator.ts` - Extended for component token generation

**Documentation**:
- New `.kiro/steering/Rosetta-System-Architecture.md` steering document
- Updated `docs/token-system-overview.md` with component token section

**Reference Implementation**: Button-Icon component now uses the new system as the QA validation case.

---

## ✨ Improvements

### Input-Text Component Enhancements

**Increased Touch Target Height**:
- Changed min-height from `tapAreaRecommended` (48px) to `tapAreaComfortable` (56px)
- Provides more comfortable touch targets for mobile users
- Applied to all Input-Text variants (Base, Email, Password, PhoneNumber)

**Asymmetric Vertical Padding**:
- Top padding: `space.inset.200` (16px) - provides visual breathing room
- Bottom padding: `space.inset.none` (0px) - allows text to sit lower
- Horizontal padding: `space.inset.100` (8px) - maintains consistent side spacing
- Creates better visual balance for floating label pattern

### Typography Token Fix

**labelMdFloat Line Height**:
- Fixed `typography.labelMdFloat` to use `lineHeight075` instead of `lineHeight100`
- Regenerated token CSS to reflect the correct value
- Ensures floating labels render with proper compact line height

---

## 🔧 Technical Changes

### Deprecations

The old component token infrastructure files have been marked as deprecated with JSDoc `@deprecated` tags:
- `src/build/tokens/ComponentToken.ts`
- `src/build/tokens/ComponentTokenGenerator.ts`

Migration guidance points developers to the new `defineComponentTokens()` API.

### Files Modified

**Input-Text Components** (all variants):
- `InputTextBase.web.ts`, `InputTextBase.browser.ts`
- `InputTextEmail.web.ts`, `InputTextEmail.browser.ts`
- `InputTextPassword.web.ts`, `InputTextPassword.browser.ts`
- `InputTextPhoneNumber.web.ts`, `InputTextPhoneNumber.browser.ts`
- `touchTargetSizing.test.ts` - Updated to expect new token
- `tokens.ts` - Updated documentation

**Typography**:
- `TypographyTokens.ts` - lineHeight correction
- `output/DesignTokens.web.css` - Regenerated
- `dist/browser/tokens.css` - Updated

---

## 📊 Test Coverage

- 6,403 tests passing across 268 test suites
- New test files for component token infrastructure
- TokenCompliance tests verify Button-Icon uses new system correctly
- Performance tests confirm NFR 3 compliance (50 tokens validated in <1 second)

---

## Migration Guide

### For Component Token Authors

Replace manual token definitions with the new API:

```typescript
// Before (deprecated)
export const buttonIconTokens = {
  insetLarge: 12,
  insetMedium: 10,
  insetSmall: 8,
};

// After (recommended)
import { defineComponentTokens } from '@/build/tokens/defineComponentTokens';
import { spacingTokens } from '@/tokens/SpacingTokens';

export const ButtonIconTokens = defineComponentTokens({
  component: 'buttonicon',
  family: 'spacing',
  tokens: {
    insetLarge: {
      reference: spacingTokens.space150,
      reasoning: 'Large size uses space150 for comfortable touch targets',
    },
    insetMedium: {
      reference: spacingTokens.space125,
      reasoning: 'Medium size uses space125 for balanced proportions',
    },
    insetSmall: {
      reference: spacingTokens.space100,
      reasoning: 'Small size uses space100 for compact layouts',
    },
  },
});
```

---

*This release represents a significant step forward in the Rosetta token system's maturity, enabling component-level token governance while maintaining mathematical consistency across the design system.*
