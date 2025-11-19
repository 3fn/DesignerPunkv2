# Color Override Feature - Spec Updates Summary

**Date**: November 18, 2025
**Purpose**: Document all spec updates for adding optional color override feature
**Context**: Added to support optical weight compensation when pairing icons with text

---

## Overview

Added optional color override feature to Icon component to enable optical weight compensation. Icons have more visual weight than text at the same color due to stroke density. This feature allows designers to use lighter colors for icons paired with text labels.

---

## Documents Updated

### 1. Requirements Document (requirements.md)

**Changes:**
- Added new **Requirement 7: Color Override for Optical Weight Compensation**
- Renumbered existing requirements:
  - Old Requirement 7 (Accessibility) → New Requirement 8
  - Old Requirement 8 (Cross-Platform Consistency) → New Requirement 9
  - Old Requirement 9 (Feather Icons Integration) → New Requirement 10

**New Requirement 7 Details:**

**User Story**: As a designer, I want to specify a lighter color for icons paired with text labels, so that I can compensate for the optical illusion where icons appear heavier than text at the same color.

**Acceptance Criteria:**
1. Icon System SHALL support optional color parameter for explicit color control
2. When color parameter not provided, SHALL default to color inheritance
3. When color parameter is 'inherit', SHALL use color inheritance mechanism
4. When color parameter is token reference, SHALL apply specified token color
5. When icon paired with text label, SHALL enable lighter icon color for optical balance
6. When color override used, SHALL maintain cross-platform consistency

---

### 2. Design Document (design.md)

**Changes:**
- Added new section: **"Color Override for Optical Weight Compensation"**
- Location: After platform implementations, before Data Models section

**New Section Includes:**
- **Problem statement**: Optical illusion where icons appear heavier than text
- **Solution**: Optional color parameter with 'inherit' default
- **API Design**: `color?: 'inherit' | string`
- **Rationale**: Optical balance, backward compatibility, token integration
- **Trade-offs**: Gained flexibility vs. slightly more complex API
- **Implementation examples** for all three platforms:
  - Web: `stroke="${strokeColor}"` with `var(--token)` support
  - iOS: `color: Color?` parameter with nil default
  - Android: `color: Color?` parameter with null default
- **Usage guidance**: When to use override vs. inheritance
- **Example**: Optical weight compensation in button with icon + text

---

### 3. Tasks Document (tasks.md)

**Changes:**
- Updated **Task 6 parent task** success criteria to include color override
- Added new **Task 6.3: Implement optional color override**
- Renumbered existing tasks:
  - Old Task 6.3 (Test accessibility) → New Task 6.4
  - Old Task 6.4 (Validate size variants) → New Task 6.5
- Updated requirement references in renumbered tasks

**New Task 6.3 Details:**

```markdown
- [ ] 6.3 Implement optional color override
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Add `color?: 'inherit' | string` to IconProps interface
  - Web: Support 'inherit' (currentColor) or token reference (var(--token))
  - iOS: Support Color? parameter with nil default
  - Android: Support Color? parameter with null default
  - Update tests to verify color override with tokens
  - Update README with optical weight compensation guidance
  - Document when to use override vs inheritance
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
```

**Updated Task 6 Success Criteria:**
- Icons render consistently across all platforms
- Color inheritance works on all platforms
- **Color override enables optical weight compensation** ← NEW
- Size variants render correctly on all platforms
- Accessibility features work on all platforms
- Visual regression tests pass

**Updated Task 6 Primary Artifacts:**
- Integration test files for each platform
- Visual regression test screenshots
- Cross-platform consistency validation report
- **Color override implementation across all platforms** ← NEW

---

## Implementation Scope

### Estimated Effort: 45 minutes

**Breakdown:**
- Web implementation: 15 minutes (~5 lines of code)
- iOS implementation: 10 minutes (~2 lines of code)
- Android implementation: 10 minutes (~2 lines of code)
- Testing: 10 minutes (~10 lines of test code)

### Risk Level: Very Low

**Why:**
- Backward compatible (optional parameter)
- Simple logic (ternary operator per platform)
- No breaking changes
- Easy to test
- Isolated change

---

## API Design

### TypeScript Interface

```typescript
export interface IconProps {
  name: IconName;
  size: IconSize;
  color?: 'inherit' | string; // NEW: Optional color override
  className?: string;
  style?: Record<string, any>;
  testID?: string;
}
```

### Platform Implementations

**Web:**
```typescript
const strokeColor = color === 'inherit' 
  ? 'currentColor' 
  : `var(--${color})`;
```

**iOS:**
```swift
.foregroundColor(color ?? .primary)
```

**Android:**
```kotlin
tint = color ?: LocalContentColor.current
```

---

## Usage Examples

### Default Behavior (Inheritance)

```typescript
// Web
<Icon name="arrow-right" size={24} />
// Uses currentColor (inherits from parent)

// iOS
Icon(name: "arrow-right", size: 24)
// Uses .primary (inherits from environment)

// Android
Icon(name = "arrow-right", size = 24.dp)
// Uses LocalContentColor.current
```

### Optical Weight Compensation

```typescript
// Web - Button with icon and text
<button style={{ color: 'var(--color-text-default)' }}>
  <Icon 
    name="arrow-right" 
    size={24} 
    color="color-text-secondary" // Lighter for optical balance
  />
  <span>Continue</span> // Darker (parent color)
</button>

// iOS
Button(action: action) {
  HStack {
    Icon(name: "arrow-right", size: 24, color: .secondary) // Lighter
    Text("Continue") // Darker (.primary)
  }
}

// Android
Button(onClick = onClick) {
  Row {
    Icon(name = "arrow-right", size = 24.dp, color = MaterialTheme.colorScheme.secondary) // Lighter
    Text("Continue") // Darker (LocalContentColor)
  }
}
```

---

## Design Rationale

### Why This Feature is Needed

**Optical Illusion**: Icons with stroke-based designs appear heavier/darker than text at the same color due to:
- Stroke density (2px stroke vs. text rendering)
- Visual weight of geometric shapes
- Contrast perception differences

**Design Best Practice**: Use lighter color for icons paired with text to achieve optical balance.

**Real-World Use Cases**:
- Buttons with icon + text label
- List items with icon + text
- Navigation items with icon + label
- Form fields with icon + placeholder text

### Why Optional Parameter

**Backward Compatible**: Existing code continues to work without changes.

**Sensible Default**: Inheritance is correct for 90% of cases (icon-only buttons, simple contexts).

**Explicit Override**: When optical compensation needed, explicit color makes intent clear.

**Token Integration**: When overriding, uses design system tokens (not arbitrary colors).

---

## Next Steps

1. **Implement Task 6.3** following the spec updates
2. **Test color override** with different token references
3. **Update README** with optical weight compensation guidance
4. **Document usage patterns** for when to use override vs. inheritance

---

**Organization**: spec-completion
**Scope**: 004-icon-system
