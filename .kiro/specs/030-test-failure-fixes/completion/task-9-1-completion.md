# Task 9.1 Completion: Create Acknowledged Differences Registry

**Date**: December 28, 2025
**Task**: 9.1 Create acknowledged differences registry
**Type**: Architecture
**Status**: Complete
**Organization**: spec-completion
**Scope**: 030-test-failure-fixes

---

## Summary

Created the acknowledged differences registry at `src/__tests__/fixtures/acknowledged-differences.json` to document intentional platform-specific differences in the design token system. This registry enables cross-platform consistency tests to distinguish between bugs (unintentional differences) and authorized platform affordances (intentional differences).

---

## Artifacts Created

### 1. Acknowledged Differences Registry
**File**: `src/__tests__/fixtures/acknowledged-differences.json`

Contains 12 documented platform-specific differences covering:
- Typography units (REM vs pt vs sp)
- Spacing units (px vs pt vs dp)
- Elevation/layering systems (z-index vs elevation dp)
- Shadow implementations (primitives vs Material elevation)
- Motion duration units (ms vs seconds)
- Motion easing syntax (cubic-bezier variations)
- Accessibility tap area minimums (44pt vs 48dp)
- Font family system defaults
- Naming conventions (kebab-case vs camelCase vs snake_case)
- Color format representations
- Border radius units
- Line height handling

### 2. JSON Schema
**File**: `src/__tests__/fixtures/acknowledged-differences.schema.json`

Defines the schema for validating registry entries:
- Required fields: token, platforms, difference, rationale, authorizedBy, date
- Platform enum: web, ios, android
- Difference categories: unit, syntax, naming, scale, format, value, behavior
- Validation rules configuration

### 3. TypeScript Types
**File**: `src/__tests__/fixtures/acknowledged-differences.types.ts`

Provides type-safe access to the registry:
- `AcknowledgedDifference` interface
- `AcknowledgedDifferencesRegistry` interface
- `Platform` and `DifferenceCategory` types
- Helper functions:
  - `tokenMatchesPattern()` - Supports wildcard patterns (e.g., `typography.fontSize.*`)
  - `findAcknowledgedDifference()` - Finds matching registry entry
  - `isDifferenceAcknowledged()` - Boolean check for acknowledged differences

---

## Schema Definition

The registry follows the schema defined in the design document:

```typescript
interface AcknowledgedDifference {
  token: string;           // Token path (e.g., "spacing.inset.100" or "typography.fontSize.*")
  platforms: Platform[];   // Affected platforms
  difference: string;      // Description of the difference
  rationale: string;       // Why this difference is intentional
  authorizedBy: string;    // Who approved this difference
  date: string;            // When it was authorized (ISO 8601)
}
```

---

## Validation

- ✅ JSON file loads successfully in Node.js
- ✅ TypeScript types compile without errors
- ✅ Schema validates required fields
- ✅ All 12 differences have complete documentation
- ✅ All differences authorized by Peter Michaels Allen

---

## Requirements Traceability

**Validates**: Requirements 11.1
- ✅ Created `src/__tests__/fixtures/acknowledged-differences.json`
- ✅ Defined schema: token, platforms, difference, rationale, authorizedBy, date
- ✅ Documented each authorized platform-specific affordance

---

## Next Steps

Task 9.2 will update the cross-platform consistency tests to:
1. Import the acknowledged differences registry
2. Update test logic to allow documented differences
3. Ensure undocumented differences still fail

---

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `src/__tests__/fixtures/acknowledged-differences.json` | Created | Main registry with 12 documented differences |
| `src/__tests__/fixtures/acknowledged-differences.schema.json` | Created | JSON Schema for validation |
| `src/__tests__/fixtures/acknowledged-differences.types.ts` | Created | TypeScript types and helper functions |
