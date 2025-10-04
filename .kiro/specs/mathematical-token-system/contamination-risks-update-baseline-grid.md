# Contamination Risk Update: Baseline Grid Validation Logic

**Date**: October 3, 2025  
**Related Risk**: Risk #1 - Skipped Baseline Grid Validation Test  
**Issue**: Baseline grid validation logic conflicts with mathematical token design  
**Organization**: spec-validation  
**Scope**: mathematical-token-system  
**Status**: Root cause identified, design decision required

---

## Root Cause Analysis

The skipped baseline grid validation test revealed a fundamental design question about what "baseline grid alignment" means in the mathematical token system.

### Current Implementation
```typescript
// ErrorValidator checks:
const isAligned = baseValue % 8 === 0;
```

### The Problem

**Existing Tokens That Fail This Check:**
```
space025 = 2   (base × 0.25)  ✗ Not divisible by 8
space050 = 4   (base × 0.5)   ✗ Not divisible by 8  
space075 = 6   (base × 0.75)  ✗ Not divisible by 8 (marked as strategic flexibility)
space150 = 12  (base × 1.5)   ✗ Not divisible by 8
```

**Only These Pass:**
```
space100 = 8   (base × 1)     ✓ Divisible by 8
space200 = 16  (base × 2)     ✓ Divisible by 8
space300 = 24  (base × 3)     ✓ Divisible by 8
```

### Mathematical Reality

With an 8-unit base, we have a **hierarchical grid system**:

| Value | 8-grid | 4-grid | 2-grid | Type |
|-------|--------|--------|--------|------|
| 2     | ✗      | ✗      | ✓      | Sub-grid (2-unit) |
| 4     | ✗      | ✓      | ✓      | Sub-grid (4-unit) |
| 6     | ✗      | ✗      | ✓      | Strategic Flex |
| 8     | ✓      | ✓      | ✓      | Primary grid |
| 12    | ✗      | ✓      | ✓      | Sub-grid (4-unit) |
| 16    | ✓      | ✓      | ✓      | Primary grid |

---

## Design Question

**What should "baseline grid alignment" mean?**

### Option 1: Strict 8-Unit Grid (Current)
```typescript
isAligned = value % 8 === 0
```

**Pros:**
- Simple, clear rule
- Enforces primary grid discipline
- Matches "8-unit baseline grid" literally

**Cons:**
- ❌ Rejects mathematically valid tokens (space050, space150)
- ❌ Forces everything to be strategic flexibility
- ❌ Doesn't match actual design system usage
- ❌ Overly restrictive for sub-grid values

### Option 2: Hierarchical Grid (4-Unit)
```typescript
isAligned = value % 4 === 0
```

**Pros:**
- ✓ Allows space050 (4) and space150 (12)
- ✓ Maintains grid discipline
- ✓ Matches common design system patterns
- ✓ Still rejects odd values (except strategic flexibility)

**Cons:**
- Allows more values (is this actually a con?)
- Less strict than "8-unit" name implies

### Option 3: Hierarchical Grid (2-Unit)
```typescript
isAligned = value % 2 === 0
```

**Pros:**
- ✓ Allows all even values
- ✓ Maintains visual rhythm
- ✓ Matches mathematical progressions

**Cons:**
- Very permissive
- Allows space025 (2) without strategic flexibility designation

### Option 4: Context-Aware Validation
```typescript
// Different rules for different value ranges
if (value >= 8) {
  isAligned = value % 8 === 0 || value % 4 === 0;
} else {
  isAligned = value % 2 === 0;
}
```

**Pros:**
- ✓ Flexible based on scale
- ✓ Allows sub-grid for small values
- ✓ Enforces stricter grid for larger values

**Cons:**
- More complex logic
- Harder to explain

### Option 5: Redefine Strategic Flexibility
Mark sub-grid values as strategic flexibility:
- space025 (2) → Strategic flexibility
- space050 (4) → Strategic flexibility  
- space150 (12) → Strategic flexibility

**Pros:**
- ✓ Keeps strict 8-unit validation
- ✓ Explicitly marks exceptions

**Cons:**
- ❌ Misuses "strategic flexibility" concept
- ❌ These are mathematically systematic, not exceptional
- ❌ Would exceed 20% strategic flexibility threshold

---

## Recommendation

### Adopt Option 2: Hierarchical 4-Unit Grid

**Rationale:**
1. **Mathematical Consistency**: Values like 4 and 12 are mathematically derived (base × 0.5, base × 1.5)
2. **Design System Reality**: These tokens are already in use and needed
3. **Grid Discipline**: Still maintains grid alignment, just at 4-unit level
4. **Strategic Flexibility Clarity**: Reserves SF for truly exceptional values (6, 10, 20)

**Implementation:**
```typescript
// BaselineGrid.ts
export const BASELINE_GRID_UNIT = 8;
export const SUB_GRID_UNIT = 4;

export function isBaselineGridAligned(value: number): boolean {
  // Primary grid (8) or sub-grid (4) alignment
  return value % SUB_GRID_UNIT === 0;
}

export function isPrimaryGridAligned(value: number): boolean {
  // Strict 8-unit grid
  return value % BASELINE_GRID_UNIT === 0;
}
```

**Validation Logic:**
```typescript
// ErrorValidator
// For spacing/radius tokens:
// - Must align to 4-unit sub-grid (unless strategic flexibility)
// - Warn if not on primary 8-unit grid (but don't error)

const isSubGridAligned = value % 4 === 0;
const isPrimaryGridAligned = value % 8 === 0;

if (!isStrategicFlexibility && !isSubGridAligned) {
  return ERROR; // Must at least align to 4-unit sub-grid
}

if (!isPrimaryGridAligned && !isStrategicFlexibility) {
  return WARNING; // Suggest using primary grid when possible
}
```

---

## Alternative: Option 4 (Context-Aware)

If we want to be more nuanced:

```typescript
export function validateBaselineGridAlignment(value: number, isStrategicFlexibility: boolean): {
  level: 'Pass' | 'Warning' | 'Error';
  message: string;
} {
  // Strategic flexibility tokens are exempt
  if (isStrategicFlexibility) {
    return { level: 'Pass', message: 'Strategic flexibility token' };
  }

  // For values >= 8: prefer 8-unit grid, allow 4-unit
  if (value >= 8) {
    if (value % 8 === 0) {
      return { level: 'Pass', message: 'Primary grid aligned (8-unit)' };
    }
    if (value % 4 === 0) {
      return { level: 'Warning', message: 'Sub-grid aligned (4-unit), consider 8-unit primary grid' };
    }
    return { level: 'Error', message: 'Must align to 4-unit sub-grid minimum' };
  }

  // For values < 8: allow 2-unit sub-grid
  if (value % 2 === 0) {
    return { level: 'Pass', message: 'Fine-grain sub-grid aligned (2-unit)' };
  }

  return { level: 'Error', message: 'Must align to 2-unit sub-grid minimum' };
}
```

---

## Impact Analysis

### On Existing Tokens

**Option 2 (4-unit grid):**
- space025 (2): ❌ ERROR (not 4-unit aligned)
- space050 (4): ✓ PASS (4-unit aligned)
- space075 (6): ✓ PASS (strategic flexibility)
- space100 (8): ✓ PASS (4-unit aligned)
- space150 (12): ✓ PASS (4-unit aligned)
- space200 (16): ✓ PASS (4-unit aligned)

**Decision needed**: Should space025 (2) be:
1. Marked as strategic flexibility?
2. Allowed as fine-grain sub-grid?
3. Removed from the system?

### On Tests

**Current skipped test:**
```typescript
// Token with baseValue: 10
// 10 % 4 = 2 (not aligned)
// 10 % 8 = 2 (not aligned)
// Should ERROR ✓
```

**With 4-unit grid, test would correctly ERROR** because 10 is not divisible by 4.

---

## Proposed Action

### Immediate (This Week)
1. **Update baseline grid validation** to use 4-unit sub-grid
2. **Re-enable skipped test** - should now pass
3. **Update documentation** to explain hierarchical grid
4. **Decide on space025 (2)** - strategic flexibility or remove?

### Short-Term (This Month)
1. **Add Warning level** for non-primary-grid values (4, 12, etc.)
2. **Update test fixtures** to reflect new validation logic
3. **Document grid hierarchy** in design system

### Long-Term (This Quarter)
1. **Monitor usage patterns** of sub-grid values
2. **Validate cross-platform** rendering of sub-grid values
3. **Consider context-aware** validation if needed

---

## Contamination Prevention

This issue demonstrates how **unclear requirements** can lead to **implementation conflicts**:

1. **Requirement says**: "align with 8-unit grid system"
2. **Design includes**: tokens with values 4 and 12
3. **Validation rejects**: mathematically valid tokens
4. **Result**: Tests skipped, validation bypassed

**Prevention:**
- ✅ Clarify what "baseline grid" means (primary vs sub-grid)
- ✅ Document hierarchical grid system explicitly
- ✅ Align validation logic with design intent
- ✅ Test against actual token usage patterns

---

## Decision Required

**Question for stakeholder**: Which option should we adopt?

1. **Option 2 (Recommended)**: 4-unit sub-grid validation
2. **Option 4**: Context-aware validation (more complex but more nuanced)
3. **Other**: Different approach?

**Follow-up question**: What should we do with space025 (2)?
- Mark as strategic flexibility?
- Allow as fine-grain sub-grid?
- Remove from system?

---

**Next Steps:**
- [ ] Stakeholder decision on validation approach
- [ ] Implement chosen validation logic
- [ ] Update tests to match new logic
- [ ] Re-enable skipped baseline grid test
- [ ] Update contamination risks register

**Priority**: HIGH - Blocks validation system integrity
