# Inset Token Renaming Migration Guide

**Date**: November 26, 2025
**Spec**: 011 - Inset Token Renaming
**Breaking Change**: Yes - All inset token names have changed
**Organization**: spec-guide
**Scope**: 011-inset-token-renaming

---

## Overview

This guide provides a complete migration path for the inset token renaming from subjective synonyms (tight, normal, comfortable, spacious, expansive, generous) to a numeric scale (050, 100, 150, 200, 300, 400) with "inset" prefix in component props.

**This is a breaking change** that affects all components using inset spacing tokens.

---

## Why This Change?

### Problem with Subjective Names

The previous naming system used subjective synonyms that:
- **Obscured mathematical relationships**: "comfortable" being 1.5× "normal" wasn't obvious
- **Required memorization**: Developers had to memorize which synonym meant which pixel value
- **Hindered AI collaboration**: AI agents struggled with subjective terminology
- **Lacked proportion reasoning**: No way to calculate relationships between values

### Benefits of Numeric Names

The new numeric naming system:
- **Exposes mathematical relationships**: 300 is clearly 2× 150, 3× 100
- **Enables proportion reasoning**: Developers can calculate relationships without memorization
- **Improves AI collaboration**: Numeric names are unambiguous for AI agents
- **Aligns with token system**: Matches the mathematical foundation of DesignerPunk
- **Self-documenting**: Token names indicate their mathematical relationship to the base

---

## Complete Token Mapping

### Token Definition Changes

| Old Token Name | New Token Name | Prop Value | Primitive Value | Pixel Value | Mathematical Relationship |
|----------------|----------------|------------|-----------------|-------------|---------------------------|
| `tight` | `'050'` | `inset050` | `space050` | 4px | 0.5 × base (space100) |
| `normal` | `'100'` | `inset100` | `space100` | 8px | 1 × base (space100) |
| `comfortable` | `'150'` | `inset150` | `space150` | 12px | 1.5 × base (space100) |
| `spacious` | `'200'` | `inset200` | `space200` | 16px | 2 × base (space100) |
| `expansive` | `'300'` | `inset300` | `space300` | 24px | 3 × base (space100) |
| `generous` | `'400'` | `inset400` | `space400` | 32px | 4 × base (space100) |

### Token Path Changes

| Old Token Path | New Token Path |
|----------------|----------------|
| `space.inset.tight` | `space.inset.050` |
| `space.inset.normal` | `space.inset.100` |
| `space.inset.comfortable` | `space.inset.150` |
| `space.inset.spacious` | `space.inset.200` |
| `space.inset.expansive` | `space.inset.300` |
| `space.inset.generous` | `space.inset.400` |

### Component Prop Value Changes

| Old Prop Value | New Prop Value |
|----------------|----------------|
| `padding="tight"` | `padding="inset050"` |
| `padding="normal"` | `padding="inset100"` |
| `padding="comfortable"` | `padding="inset150"` |
| `padding="spacious"` | `padding="inset200"` |
| `padding="expansive"` | `padding="inset300"` |
| `padding="generous"` | `padding="inset400"` |

---

## Migration Examples

### Example 1: ButtonCTA Component

**Before (Old Syntax)**:
```typescript
// Component usage
<ButtonCTA 
  label="Submit"
  padding="comfortable"
  variant="primary"
/>

// TypeScript interface
interface ButtonCTAProps {
  label: string;
  padding?: 'tight' | 'normal' | 'comfortable' | 'spacious' | 'expansive' | 'generous';
  variant?: 'primary' | 'secondary' | 'danger';
}

// Token reference in component
const paddingValue = getSemanticToken(`space.inset.${padding}`);
```

**After (New Syntax)**:
```typescript
// Component usage
<ButtonCTA 
  label="Submit"
  padding="inset150"
  variant="primary"
/>

// TypeScript interface
interface ButtonCTAProps {
  label: string;
  padding?: InsetPadding; // 'inset050' | 'inset100' | 'inset150' | 'inset200' | 'inset300' | 'inset400'
  variant?: 'primary' | 'secondary' | 'danger';
}

// Token reference in component (strip "inset" prefix)
const tokenPath = `space.inset.${padding.replace('inset', '')}`;
const paddingValue = getSemanticToken(tokenPath);
```

### Example 2: Icon Component

**Before (Old Syntax)**:
```typescript
// Component usage
<Icon 
  name="check"
  size={24}
  padding="tight"
/>

// TypeScript interface
interface IconProps {
  name: IconName;
  size: number;
  padding?: 'tight' | 'normal' | 'comfortable';
}
```

**After (New Syntax)**:
```typescript
// Component usage
<Icon 
  name="check"
  size={24}
  padding="inset050"
/>

// TypeScript interface
interface IconProps {
  name: IconName;
  size: number;
  padding?: InsetPadding;
}
```

### Example 3: Custom Container Component

**Before (Old Syntax)**:
```typescript
// Component definition
function Container({ children, padding = 'normal' }: ContainerProps) {
  const paddingToken = getSemanticToken(`space.inset.${padding}`);
  
  return (
    <div style={{ padding: paddingToken }}>
      {children}
    </div>
  );
}

// Usage
<Container padding="spacious">
  <p>Content with spacious padding</p>
</Container>
```

**After (New Syntax)**:
```typescript
// Component definition
function Container({ children, padding = 'inset100' }: ContainerProps) {
  // Strip "inset" prefix to get token path
  const tokenPath = `space.inset.${padding.replace('inset', '')}`;
  const paddingToken = getSemanticToken(tokenPath);
  
  return (
    <div style={{ padding: paddingToken }}>
      {children}
    </div>
  );
}

// Usage
<Container padding="inset200">
  <p>Content with 16px padding (2× base)</p>
</Container>
```

### Example 4: Platform-Specific Generated Code

**Before (Old Syntax)**:

**Web CSS**:
```css
:root {
  --space-inset-tight: 4px;
  --space-inset-normal: 8px;
  --space-inset-comfortable: 12px;
  --space-inset-spacious: 16px;
  --space-inset-expansive: 24px;
  --space-inset-generous: 32px;
}
```

**iOS Swift**:
```swift
let spaceInsetTight: CGFloat = 4
let spaceInsetNormal: CGFloat = 8
let spaceInsetComfortable: CGFloat = 12
let spaceInsetSpacious: CGFloat = 16
let spaceInsetExpansive: CGFloat = 24
let spaceInsetGenerous: CGFloat = 32
```

**Android Kotlin**:
```kotlin
val spaceInsetTight = 4.dp
val spaceInsetNormal = 8.dp
val spaceInsetComfortable = 12.dp
val spaceInsetSpacious = 16.dp
val spaceInsetExpansive = 24.dp
val spaceInsetGenerous = 32.dp
```

**After (New Syntax)**:

**Web CSS**:
```css
:root {
  --space-inset-050: 4px;
  --space-inset-100: 8px;
  --space-inset-150: 12px;
  --space-inset-200: 16px;
  --space-inset-300: 24px;
  --space-inset-400: 32px;
}
```

**iOS Swift**:
```swift
let spaceInset050: CGFloat = 4
let spaceInset100: CGFloat = 8
let spaceInset150: CGFloat = 12
let spaceInset200: CGFloat = 16
let spaceInset300: CGFloat = 24
let spaceInset400: CGFloat = 32
```

**Android Kotlin**:
```kotlin
val spaceInset050 = 4.dp
val spaceInset100 = 8.dp
val spaceInset150 = 12.dp
val spaceInset200 = 16.dp
val spaceInset300 = 24.dp
val spaceInset400 = 32.dp
```

---

## Migration Steps

### Step 1: Update Component Interfaces

Replace old padding type definitions with `InsetPadding` type:

```typescript
// Before
interface MyComponentProps {
  padding?: 'tight' | 'normal' | 'comfortable' | 'spacious' | 'expansive' | 'generous';
}

// After
import { InsetPadding } from '@/types/ComponentTypes';

interface MyComponentProps {
  padding?: InsetPadding;
}
```

### Step 2: Update Component Usage

Replace old prop values with new "inset" prefixed values:

```typescript
// Before
<MyComponent padding="comfortable" />

// After
<MyComponent padding="inset150" />
```

### Step 3: Update Token Resolution Logic

If your component resolves tokens manually, update the logic to strip the "inset" prefix:

```typescript
// Before
const tokenPath = `space.inset.${padding}`;

// After
const tokenPath = `space.inset.${padding.replace('inset', '')}`;
```

### Step 4: Update Default Values

Update any default padding values in component definitions:

```typescript
// Before
function MyComponent({ padding = 'normal' }: MyComponentProps) {
  // ...
}

// After
function MyComponent({ padding = 'inset100' }: MyComponentProps) {
  // ...
}
```

### Step 5: Update Tests

Update test files to use new prop values:

```typescript
// Before
it('should render with comfortable padding', () => {
  render(<MyComponent padding="comfortable" />);
  // assertions
});

// After
it('should render with 12px padding (inset150)', () => {
  render(<MyComponent padding="inset150" />);
  // assertions
});
```

### Step 6: Rebuild Platform Outputs

After updating all components, rebuild platform-specific files:

```bash
npm run build
```

This regenerates CSS, Swift, and Kotlin files with new token names.

---

## Common Migration Patterns

### Pattern 1: Find and Replace

Use your IDE's find and replace to update prop values:

1. Find: `padding="tight"`
2. Replace: `padding="inset050"`

Repeat for all old token names.

### Pattern 2: TypeScript Compilation Errors

After updating interfaces, TypeScript will show errors for old prop values:

```typescript
// TypeScript error: Type '"comfortable"' is not assignable to type 'InsetPadding'
<MyComponent padding="comfortable" />
```

Fix by replacing with new value:

```typescript
<MyComponent padding="inset150" />
```

### Pattern 3: Token Resolution Updates

If you have custom token resolution logic, update it to handle the "inset" prefix:

```typescript
// Before
function resolveInsetToken(padding: string): string {
  return getSemanticToken(`space.inset.${padding}`);
}

// After
function resolveInsetToken(padding: InsetPadding): string {
  const tokenName = padding.replace('inset', '');
  return getSemanticToken(`space.inset.${tokenName}`);
}
```

---

## Breaking Change Details

### What's Breaking

1. **Token Names**: All inset token keys changed from synonyms to numbers
2. **Prop Values**: All component prop values now require "inset" prefix
3. **TypeScript Types**: Old string literal types no longer valid
4. **Generated Code**: Platform-specific files use new token names

### What's NOT Breaking

1. **Pixel Values**: All tokens maintain the same pixel values (4px, 8px, 12px, etc.)
2. **Visual Appearance**: No visual changes to components
3. **Primitive Tokens**: Primitive token references unchanged (space050, space100, etc.)
4. **Layout Tokens**: Layout spacing tokens (grouped, related, separated, sectioned) unchanged

### Migration Timeline

This is a **clean cutover** with no deprecation period:
- Old token names are removed immediately
- No dual support for old and new names
- All components must be updated at once

**Rationale**: Early in project with minimal usage (only ButtonCTA and Icon). Clean cutover prevents confusion about which names to use.

---

## Validation Checklist

After migration, verify:

- [ ] All component interfaces use `InsetPadding` type
- [ ] All component prop values use "inset" prefix (inset050, inset100, etc.)
- [ ] All token resolution logic strips "inset" prefix correctly
- [ ] All tests updated with new prop values
- [ ] TypeScript compilation succeeds with no errors
- [ ] Platform outputs regenerated with new token names
- [ ] Visual appearance unchanged (compare before/after screenshots)
- [ ] No references to old token names in codebase (except this migration guide)

---

## Troubleshooting

### Issue: TypeScript Errors After Migration

**Symptom**: TypeScript shows errors for old prop values

**Solution**: Replace old prop values with new "inset" prefixed values using the mapping table above

### Issue: Token Resolution Fails

**Symptom**: Component can't resolve token path

**Solution**: Ensure token resolution logic strips "inset" prefix:
```typescript
const tokenPath = `space.inset.${padding.replace('inset', '')}`;
```

### Issue: Visual Appearance Changed

**Symptom**: Component spacing looks different after migration

**Solution**: Verify you used the correct mapping from the table above. Pixel values should be identical.

### Issue: Platform-Specific Files Not Updated

**Symptom**: Generated CSS/Swift/Kotlin still uses old token names

**Solution**: Run `npm run build` to regenerate platform-specific files

---

## FAQ

### Q: Why not keep both old and new names during a transition period?

**A**: Clean cutover prevents confusion about which names to use and simplifies implementation. With only 2 components affected (ButtonCTA and Icon), the migration scope is manageable.

### Q: Will layout tokens also be renamed?

**A**: No. Layout tokens (grouped, related, separated, sectioned) intentionally keep their density modifiers (tight, normal, loose) because they work well with the two-level semantic structure.

### Q: Can I still use primitive tokens directly?

**A**: Yes, but it's not recommended. Semantic tokens provide better design intent and are easier to maintain.

### Q: What if I need a spacing value not in the scale?

**A**: Use component-level tokens that reference semantic or primitive tokens. Avoid hard-coded values.

### Q: How do I remember which number corresponds to which pixel value?

**A**: The numbers follow a mathematical pattern based on space100 (8px):
- 050 = 0.5 × 8 = 4px
- 100 = 1 × 8 = 8px
- 150 = 1.5 × 8 = 12px
- 200 = 2 × 8 = 16px
- 300 = 3 × 8 = 24px
- 400 = 4 × 8 = 32px

---

## Additional Resources

- **Requirements Document**: `.kiro/specs/011-inset-token-renaming/requirements.md`
- **Design Document**: `.kiro/specs/011-inset-token-renaming/design.md`
- **Token System Overview**: `docs/token-system-overview.md`
- **Component Development Guide**: `.kiro/steering/Component Development Guide.md`

---

## Support

If you encounter issues during migration:

1. Review this migration guide thoroughly
2. Check the validation checklist above
3. Consult the design document for architectural details
4. Review component README files for updated usage examples

---

**Last Updated**: November 26, 2025
**Spec**: 011 - Inset Token Renaming
**Status**: Active Migration Guide
