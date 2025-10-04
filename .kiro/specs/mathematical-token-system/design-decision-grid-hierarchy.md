# Design Decision: Grid Hierarchy and Strategic Flexibility

**Date**: October 3, 2025  
**Decision**: Define clear grid hierarchy with typography-exclusive sub-grid  
**Status**: Implemented  
**Organization**: spec-validation  
**Scope**: mathematical-token-system

---

## Decision

**Grid Hierarchy:**
- **8-unit primary grid**: For spacing and radius tokens
- **4-unit sub-grid**: Exclusively for typography (line height, font size alignment)
- **Strategic flexibility**: Exceptional values (2, 6, 10, 20) for specific design needs

**Specifically:**
- `space025` (2) → **Strategic Flexibility** (fine-grain spacing)
- `space050` (4) → **DEPRECATED** for spacing (typography only)
- `space075` (6) → **Strategic Flexibility** (component-level)
- `space100` (8) → **Primary Grid** (base)
- `space150` (12) → **DEPRECATED** for spacing (typography only)
- `space200+` → **Primary Grid** (8, 16, 24, 32, 48, 64...)

---

## Rationale

### Problem
With an 8-unit base, mathematical progressions create values that don't align to the 8-unit grid:
- `base × 0.25 = 2` (not divisible by 8)
- `base × 0.5 = 4` (not divisible by 8)
- `base × 0.75 = 6` (not divisible by 8)
- `base × 1.5 = 12` (not divisible by 8)

### Why Not Allow 4-Unit Sub-Grid for Spacing?

**Principle**: **Separation of concerns between layout and typography**

1. **Visual Rhythm**: 8-unit grid creates strong visual rhythm for layout
2. **Typography Needs**: Typography requires finer control (4-unit) for line height alignment
3. **Clear Boundaries**: Prevents "grid creep" where sub-grid becomes overused
4. **Strategic Flexibility**: Forces intentional decisions for exceptional spacing needs

### Why Make 2 a Strategic Flexibility Token?

**Rationale**: 2 is genuinely exceptional for spacing

1. **Rare Usage**: Fine-grain 2px spacing is needed infrequently
2. **Component-Internal**: Typically used within component boundaries, not layout
3. **Intentional Exception**: Should be used deliberately, not as default
4. **Monitoring**: Can track usage to ensure it stays exceptional (≤20% threshold)

---

## Implementation

### Constants Updated

**`src/constants/BaselineGrid.ts`:**
```typescript
export const BASELINE_GRID_UNIT = 8; // Primary grid
export const TYPOGRAPHY_SUB_GRID_UNIT = 4; // Typography only

export function isBaselineGridAligned(value: number): boolean {
  return value % BASELINE_GRID_UNIT === 0; // 8-unit grid
}

export function isTypographySubGridAligned(value: number): boolean {
  return value % TYPOGRAPHY_SUB_GRID_UNIT === 0; // 4-unit sub-grid
}
```

**`src/constants/StrategicFlexibilityTokens.ts`:**
```typescript
export const STRATEGIC_FLEXIBILITY_VALUES = [2, 6, 10, 20] as const;

export const STRATEGIC_FLEXIBILITY_TOKENS = {
  space025: { value: 2, ... },  // NEW: Fine-grain spacing
  space075: { value: 6, ... },  // Component-level spacing
  space125: { value: 10, ... }, // Specific design requirements
  space250: { value: 20, ... }  // Larger spacing needs
};
```

**`src/constants/SpacingTokens.ts`:**
```typescript
export const SPACING_MULTIPLIERS = {
  SPACE_025: 0.25,  // space025 = 2 (strategic flexibility)
  SPACE_050: 0.5,   // space050 = 4 (DEPRECATED: typography only)
  SPACE_075: 0.75,  // space075 = 6 (strategic flexibility)
  SPACE_100: 1,     // space100 = 8 (base, 8-unit grid)
  SPACE_150: 1.5,   // space150 = 12 (DEPRECATED: typography only)
  SPACE_200: 2,     // space200 = 16 (8-unit grid)
  // ... all other values are 8-unit grid aligned
};
```

### Validation Logic

**`src/validators/ErrorValidator.ts`:**
```typescript
// For spacing and radius tokens:
// 1. Check if strategic flexibility → PASS (exempt)
// 2. Check if 8-unit grid aligned → PASS
// 3. Otherwise → ERROR

if (isStrategicFlexibility || isStrategicFlexibilityValue(baseValue)) {
  return null; // Strategic flexibility exempt
}

const isAligned = baseValue % 8 === 0;
if (!isAligned) {
  return ERROR; // Must align to 8-unit grid
}
```

---

## Token Classification

### Primary Grid (8-unit) - PREFERRED
```
space100 = 8
space200 = 16
space300 = 24
space400 = 32
space600 = 48
space800 = 64
```
**Usage**: Standard spacing and radius tokens  
**Validation**: PASS

### Strategic Flexibility - EXCEPTIONAL
```
space025 = 2   (fine-grain, component-internal)
space075 = 6   (component-level, breaks grid)
space125 = 10  (specific design requirements)
space250 = 20  (larger spacing needs)
```
**Usage**: Exceptional design needs, must maintain ≥80% appropriate usage  
**Validation**: PASS (exempt from grid)

### Typography Sub-Grid (4-unit) - TYPOGRAPHY ONLY
```
space050 = 4   (DEPRECATED for spacing)
space150 = 12  (DEPRECATED for spacing)
```
**Usage**: Typography tokens only (line height, font size alignment)  
**Validation**: ERROR if used for spacing/radius

---

## Migration Guide

### For Existing Code Using space050 (4) or space150 (12)

**If used for spacing/radius:**
```typescript
// Before
padding: space050 // 4px - ERROR

// After - Option 1: Use strategic flexibility
padding: space025 // 2px - if truly needed

// After - Option 2: Use primary grid
padding: space100 // 8px - preferred
```

**If used for typography:**
```typescript
// Before
lineHeight: space150 // 12px - OK for typography

// After - Keep as is, but clarify usage
lineHeight: lineHeight150 // 12px - typography token
```

### For New Code

**Spacing/Radius:**
- ✅ Use 8-unit grid: `space100`, `space200`, `space300`, etc.
- ✅ Use strategic flexibility when needed: `space025`, `space075`
- ❌ Don't use 4-unit values: `space050`, `space150`

**Typography:**
- ✅ Use typography tokens: `lineHeight050`, `lineHeight100`, `lineHeight150`
- ✅ Can use 4-unit sub-grid for typography
- ❌ Don't use spacing tokens for typography

---

## Benefits

### 1. Clear Separation of Concerns
- Layout uses 8-unit grid
- Typography uses 4-unit sub-grid
- No confusion about which grid to use

### 2. Strong Visual Rhythm
- 8-unit grid creates consistent visual rhythm
- Prevents "grid creep" from sub-grid overuse
- Maintains design system discipline

### 3. Intentional Exceptions
- Strategic flexibility tokens are clearly marked
- Usage can be monitored (≤20% threshold)
- Forces deliberate decisions for exceptions

### 4. Mathematical Consistency
- All spacing tokens either:
  - Align to 8-unit grid, OR
  - Are strategic flexibility (tracked and monitored)
- No ambiguous "sometimes OK" values

### 5. AI Collaboration
- Clear rules for AI agents to follow
- Unambiguous validation (PASS or ERROR)
- Strategic flexibility usage can be tracked

---

## Trade-offs

### Pros
- ✅ Clear, unambiguous rules
- ✅ Strong visual rhythm
- ✅ Separation of layout and typography
- ✅ Trackable exceptions

### Cons
- ⚠️ Less flexibility than 4-unit sub-grid for spacing
- ⚠️ May need more strategic flexibility tokens
- ⚠️ Requires migration of existing space050/space150 usage

### Mitigation
- Strategic flexibility provides escape hatch when needed
- Usage tracking ensures exceptions stay exceptional
- Clear migration path for existing code

---

## Validation Examples

### PASS: Primary Grid
```typescript
const token = {
  name: 'space200',
  baseValue: 16, // 16 % 8 === 0 ✓
  isStrategicFlexibility: false
};
// Result: PASS (8-unit grid aligned)
```

### PASS: Strategic Flexibility
```typescript
const token = {
  name: 'space025',
  baseValue: 2, // 2 % 8 !== 0, but SF
  isStrategicFlexibility: true
};
// Result: PASS (strategic flexibility exempt)
```

### ERROR: 4-Unit Sub-Grid for Spacing
```typescript
const token = {
  name: 'space050',
  baseValue: 4, // 4 % 8 !== 0
  category: 'spacing', // Not typography
  isStrategicFlexibility: false
};
// Result: ERROR (4-unit sub-grid reserved for typography)
```

### ERROR: Non-Grid-Aligned
```typescript
const token = {
  name: 'space125',
  baseValue: 10, // 10 % 8 !== 0
  isStrategicFlexibility: false // Not marked as SF
};
// Result: ERROR (must align to 8-unit grid or be SF)
```

---

## Future Considerations

### Monitoring Strategic Flexibility Usage
- Track usage of space025 (2) to ensure it stays exceptional
- If usage exceeds 20%, may need to reconsider grid hierarchy
- Monitor for patterns that suggest need for new tokens

### Typography Token Family
- Create dedicated typography token family
- Use 4-unit sub-grid for line height, font size alignment
- Keep separate from spacing/radius tokens

### Cross-Platform Validation
- Ensure 8-unit grid translates consistently across platforms
- Validate that strategic flexibility values render correctly
- Monitor for platform-specific constraints

---

## Conclusion

This design decision provides:
- ✅ Clear grid hierarchy (8-unit primary, 4-unit typography only)
- ✅ Intentional exceptions (strategic flexibility)
- ✅ Strong visual rhythm (8-unit grid for layout)
- ✅ Separation of concerns (layout vs typography)
- ✅ Trackable usage (strategic flexibility monitoring)

**Result**: Mathematical consistency with intentional flexibility where needed.

---

**Approved**: October 3, 2025  
**Implemented**: October 3, 2025  
**Status**: Active
