# Task 6.4 Completion: Implement iOS Shape Rendering

**Date**: January 17, 2026
**Task**: 6.4 Implement iOS shape rendering
**Status**: Complete
**Organization**: spec-completion
**Scope**: 042-avatar-component

---

## Summary

Implemented iOS shape rendering for the Avatar component, ensuring correct clip shapes are applied based on avatar type (human = Circle, agent = RoundedPointyTopHexagon) with proper frame sizing.

---

## Implementation Details

### Shape Rendering Approach

The original implementation used `@ViewBuilder` with `some Shape` return type, which is incorrect because `@ViewBuilder` is designed for `View` types, not `Shape` types. SwiftUI's opaque return types (`some Shape`) require the same concrete type to be returned from all code paths.

**Solution**: Created a generic helper function `applyClipShape(to:)` that conditionally applies the correct clip shape:

```swift
@ViewBuilder
private func applyClipShape<Content: View>(to content: Content) -> some View {
    if type == .human {
        content.clipShape(Circle())
    } else {
        content.clipShape(RoundedPointyTopHexagon())
    }
}
```

This approach:
- Uses `@ViewBuilder` correctly (returns `View`, not `Shape`)
- Applies `Circle()` for human type (Requirement 1.1)
- Applies `RoundedPointyTopHexagon()` for agent type (Requirements 1.2, 12.1-12.3)
- Works with SwiftUI's type system

### Frame Sizing

Frame size is correctly applied based on avatar type:

```swift
private var avatarWidth: CGFloat {
    switch type {
    case .human:
        return size.dimension  // Circle: width = height
    case .agent:
        return size.dimension * RoundedPointyTopHexagon.aspectRatio  // Hexagon: width = height × 0.866
    }
}
```

The `avatarContainer` applies the frame before clipping:
```swift
applyClipShape(
    to: ZStack { ... }
    .frame(width: avatarWidth, height: size.dimension)
)
```

---

## Requirements Validation

| Requirement | Description | Status |
|-------------|-------------|--------|
| 1.1 | Circle shape for human type | ✅ Implemented via `content.clipShape(Circle())` |
| 1.2 | Hexagon shape for agent type | ✅ Implemented via `content.clipShape(RoundedPointyTopHexagon())` |
| 12.1 | Custom RoundedPointyTopHexagon Shape | ✅ Already implemented in Task 6.2 |
| 12.2 | Use addArc for rounded vertices | ✅ Already implemented in Task 6.2 |
| 12.3 | Apply .clipShape() modifier | ✅ Implemented via `applyClipShape(to:)` function |

---

## Files Modified

- `src/components/core/Avatar/platforms/ios/Avatar.swift`
  - Replaced `avatarShape` computed property with `applyClipShape(to:)` function
  - Updated `avatarContainer` to use the new function
  - Fixed SwiftUI type system compatibility issue

---

## Technical Notes

### Why Not Use `some Shape`?

SwiftUI's opaque return types require all code paths to return the same concrete type. This code would NOT compile:

```swift
// ❌ WRONG - Different concrete types
private var avatarShape: some Shape {
    if type == .human {
        Circle()  // Returns Circle
    } else {
        RoundedPointyTopHexagon()  // Returns RoundedPointyTopHexagon
    }
}
```

### Alternative Approaches Considered

1. **AnyShape (iOS 16+)**: Would work but limits iOS version support
2. **Type-erased wrapper**: More complex, unnecessary for this use case
3. **Conditional View application**: ✅ Chosen - simple, works with all iOS versions

---

## Verification

- Swift syntax validation: ✅ No diagnostics
- Shape rendering logic: ✅ Correct shapes applied per type
- Frame sizing: ✅ Correct dimensions per type and size
