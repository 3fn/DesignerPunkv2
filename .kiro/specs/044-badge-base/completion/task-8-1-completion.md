# Task 8.1 Completion: Audit Current Component Token Generation

**Date**: January 23, 2026
**Task**: 8.1 Audit current component token generation
**Type**: Investigation
**Validation**: Tier 1 - Minimal
**Status**: Complete
**Organization**: spec-completion
**Scope**: 044-badge-base

---

## Summary

Audited the component token generation pipeline to identify components with hyphenated names that produce invalid platform identifiers. Found one component (`Badge-Label-Base`) with invalid generated identifiers in iOS Swift and Android Kotlin output.

**Key Discovery**: The issue is NOT in the generator — it's in the **Badge-Label-Base token definition**. The component is registered with a hyphenated name (`'Badge-Label-Base'`) instead of PascalCase (`'BadgeLabelBase'`), which is inconsistent with how all other components register their tokens.

---

## Findings

### 1. Established Pattern: PascalCase Component Registration

Other components with hyphenated directory names use **PascalCase** when registering with `defineComponentTokens()`:

| Directory Name | Registered Component Name | Pattern |
|----------------|---------------------------|---------|
| `Button-Icon` | `ButtonIcon` | ✅ PascalCase |
| `Button-VerticalList-Item` | `VerticalListItem` | ✅ PascalCase |
| `Avatar` | `Avatar` | ✅ PascalCase |
| `Badge-Label-Base` | `Badge-Label-Base` | ❌ **Hyphenated** |

### 2. The Actual Issue: Badge-Label-Base Token Definition

**File**: `src/components/core/Badge-Label-Base/tokens.ts` (line 43)

```typescript
export const BadgeLabelBaseTokens = defineComponentTokens({
  component: 'Badge-Label-Base',  // ❌ WRONG: Hyphenated
  family: 'spacing',
  ...
});
```

**Should be**:
```typescript
export const BadgeLabelBaseTokens = defineComponentTokens({
  component: 'BadgeLabelBase',  // ✅ CORRECT: PascalCase
  family: 'spacing',
  ...
});
```

### 3. Evidence from Other Components

**Button-VerticalList-Item** (`src/components/core/Button-VerticalList-Item/Button-VerticalList-Item.tokens.ts`):
```typescript
export const VerticalListItemTokens = defineComponentTokens({
  component: 'VerticalListItem',  // ✅ PascalCase
  ...
});
```

**Button-Icon** (`src/components/core/Button-Icon/buttonIcon.tokens.ts`):
```typescript
export const ButtonIconTokens = defineComponentTokens({
  component: 'ButtonIcon',  // ✅ PascalCase
  ...
});
```

### 4. Generated Tokens with Invalid Identifiers

#### iOS Swift (`dist/ComponentTokens.ios.swift`)

```swift
/// Badge-Label-Base Component Tokens
public enum Badge-Label-BaseTokens {  // ❌ INVALID: Hyphens not allowed in Swift identifiers
    public static let maxWidth: CGFloat = 120
}
```

#### Android Kotlin (`dist/ComponentTokens.android.kt`)

```kotlin
/** Badge-Label-Base Component Tokens */
object Badge-Label-BaseTokens {  // ❌ INVALID: Hyphens not allowed in Kotlin identifiers
    val maxWidth = 120
}
```

#### Web CSS (`dist/ComponentTokens.web.css`)

```css
/* Badge-Label-Base Component Tokens */
--badge-label-base-max-width: 120;  // ✅ VALID: CSS custom properties allow hyphens
```

---

## Root Cause Analysis

### This is a Data Issue, NOT a Generator Issue

The generator is working correctly. It simply outputs the component name as registered. The problem is that `Badge-Label-Base` was registered with a hyphenated name, breaking the established convention.

**Why the generator doesn't need fixing**:
- All other components use PascalCase registration
- The generator correctly produces valid output for PascalCase names
- Adding hyphen-to-PascalCase conversion would be defensive coding for a pattern that shouldn't exist

### The Simple Fix

Change one line in `src/components/core/Badge-Label-Base/tokens.ts`:

```diff
export const BadgeLabelBaseTokens = defineComponentTokens({
-  component: 'Badge-Label-Base',
+  component: 'BadgeLabelBase',
  family: 'spacing',
  ...
});
```

This will produce:
- iOS: `public enum BadgeLabelBaseTokens` ✅
- Android: `object BadgeLabelBaseTokens` ✅
- Web: `--badgelabelbase-max-width` (or similar) ✅

---

## Impact Assessment

### Current Impact

1. **iOS Build Failure**: The generated `ComponentTokens.ios.swift` file will fail to compile
2. **Android Build Failure**: The generated `ComponentTokens.android.kt` file will fail to compile
3. **Web Unaffected**: CSS custom properties support hyphens

### Affected Components

Only `Badge-Label-Base` is affected. This is an isolated issue from when the component tokens were created.

### Workaround in Place

The iOS and Android Badge-Label-Base implementations currently use hardcoded values:

**iOS** (`BadgeLabelBase.ios.swift`):
```swift
private let maxWidth: CGFloat = 120  // Hardcoded
```

**Android** (`BadgeLabelBase.android.kt`):
```kotlin
val maxWidth = DesignTokens.space_150 * 10  // Workaround calculation
```

---

## Revised Recommendations for Remaining Subtasks

Based on this finding, the remaining subtasks need to be **significantly simplified**:

### Task 8.2: Fix Badge-Label-Base Token Registration (SIMPLIFIED)

**Original**: Fix TokenFileGenerator identifier conversion
**Revised**: Fix the component name in `tokens.ts`

**Single Change Required**:
```diff
// src/components/core/Badge-Label-Base/tokens.ts (line 43)
export const BadgeLabelBaseTokens = defineComponentTokens({
-  component: 'Badge-Label-Base',
+  component: 'BadgeLabelBase',
  family: 'spacing',
  ...
});
```

**No generator changes needed.**

### Task 8.3: Regenerate and Verify (UNCHANGED)

After fixing the token registration:
- Run `npx ts-node scripts/generate-platform-tokens.ts`
- Verify `dist/ComponentTokens.ios.swift` has `public enum BadgeLabelBaseTokens`
- Verify `dist/ComponentTokens.android.kt` has `object BadgeLabelBaseTokens`

### Tasks 8.4 & 8.5: Update Badge Implementations (UNCHANGED)

Update iOS and Android Badge-Label-Base implementations to reference the generated tokens:
- iOS: `BadgeLabelBaseTokens.maxWidth`
- Android: `BadgeLabelBaseTokens.maxWidth`

### Task 8.6: Run Tests (UNCHANGED)

Verify all tests pass and Stemma validators confirm token usage.

---

## Optional: Defensive Validation (Future Enhancement)

While not required for this fix, we could add validation to `ComponentTokenRegistry.register()` to warn when component names contain hyphens:

```typescript
register(token: RegisteredComponentToken, options: ComponentTokenRegistrationOptions = {}): void {
  // Warn about hyphenated component names
  if (token.component.includes('-')) {
    console.warn(
      `Warning: Component "${token.component}" uses hyphenated name. ` +
      `Consider using PascalCase (e.g., "${token.component.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')}") ` +
      `to ensure valid iOS/Android identifiers.`
    );
  }
  // ... rest of registration
}
```

This would prevent future occurrences of this issue.

---

## Questions for Peter

1. **Proceed with Simple Fix?** The fix is just changing one line in `tokens.ts`. Should we proceed with this approach?

2. **Update tasks.md?** Should we update the remaining subtasks in `tasks.md` to reflect the simplified scope (no generator changes needed)?

3. **Add Defensive Validation?** Should we add a warning in `ComponentTokenRegistry` for hyphenated component names as a future enhancement?

---

## Related Documentation

- **Badge-Label-Base tokens.ts**: `src/components/core/Badge-Label-Base/tokens.ts` (the file to fix)
- **Button-VerticalList-Item tokens.ts**: `src/components/core/Button-VerticalList-Item/Button-VerticalList-Item.tokens.ts` (correct pattern)
- **Button-Icon tokens.ts**: `src/components/core/Button-Icon/buttonIcon.tokens.ts` (correct pattern)
- **Generated iOS tokens**: `dist/ComponentTokens.ios.swift`
- **Generated Android tokens**: `dist/ComponentTokens.android.kt`
- **Requirements**: 9.3, 9.4 in `.kiro/specs/044-badge-base/requirements.md`

---

**Organization**: spec-completion
**Scope**: 044-badge-base
