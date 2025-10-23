# Typography Token Migration Guide

**Date**: October 22, 2025
**Spec**: typography-token-expansion
**Purpose**: Guide for migrating from old typography token names to new consistent naming
**Organization**: spec-completion
**Scope**: typography-token-expansion

---

## Overview

This guide helps you migrate from the old typography token naming convention to the new consistent size-based naming system. The changes improve naming consistency across all typography token families by using a uniform size scale (Xs, Sm, Md, Lg).

### Why These Changes?

The naming changes establish consistency with the size scale used throughout the DesignerPunk system:
- **Xs** (Extra Small) - fontSize050 (13px)
- **Sm** (Small) - fontSize075 (14px)
- **Md** (Medium) - fontSize100 (16px)
- **Lg** (Large) - fontSize125 (18px)

Old names like `bodySmall`, `body`, and `bodyLarge` mixed full words with abbreviated forms. The new names (`bodySm`, `bodyMd`, `bodyLg`) use consistent abbreviations that match the size scale pattern used across spacing, sizing, and other token families.

---

## Token Name Changes

### Quick Reference Table

| Old Token Name | New Token Name | Size | Notes |
|----------------|----------------|------|-------|
| `typography.bodySmall` | `typography.bodySm` | 14px | Renamed for consistency |
| `typography.body` | `typography.bodyMd` | 16px | Renamed for consistency |
| `typography.bodyLarge` | `typography.bodyLg` | 18px | Renamed for consistency |
| `typography.button` | `typography.buttonMd` | 16px | Renamed for consistency |

### New Tokens Added

These tokens are new additions to the system:

**Label Variants:**
- `typography.labelXs` - 13px (floating labels)
- `typography.labelSm` - 14px (compact labels)
- `typography.labelMd` - 16px (standard labels)
- `typography.labelLg` - 18px (prominent labels)

**Code Variants:**
- `typography.codeSm` - 14px (inline code)
- `typography.codeMd` - 16px (code blocks)
- `typography.codeLg` - 18px (prominent code)

**Button Variants:**
- `typography.buttonSm` - 14px (compact buttons)
- `typography.buttonLg` - 18px (prominent buttons)

---

## Migration by Platform

### Web (CSS/JavaScript)

#### Search and Replace Patterns

```bash
# Body text tokens
typography.bodySmall → typography.bodySm
typography.body → typography.bodyMd
typography.bodyLarge → typography.bodyLg

# Button text token
typography.button → typography.buttonMd
```

#### Before/After Examples

**CSS Custom Properties:**

```css
/* BEFORE */
.text-small {
  font-size: var(--typography-bodySmall-fontSize);
  line-height: var(--typography-bodySmall-lineHeight);
}

.text-default {
  font-size: var(--typography-body-fontSize);
  line-height: var(--typography-body-lineHeight);
}

.button-text {
  font-size: var(--typography-button-fontSize);
  font-weight: var(--typography-button-fontWeight);
}

/* AFTER */
.text-small {
  font-size: var(--typography-bodySm-fontSize);
  line-height: var(--typography-bodySm-lineHeight);
}

.text-default {
  font-size: var(--typography-bodyMd-fontSize);
  line-height: var(--typography-bodyMd-lineHeight);
}

.button-text {
  font-size: var(--typography-buttonMd-fontSize);
  font-weight: var(--typography-buttonMd-fontWeight);
}
```

**JavaScript/TypeScript:**

```typescript
// BEFORE
import { typography } from '@designerpunk/tokens';

const styles = {
  smallText: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
  defaultText: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  buttonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  }
};

// AFTER
import { typography } from '@designerpunk/tokens';

const styles = {
  smallText: {
    fontSize: typography.bodySm.fontSize,
    lineHeight: typography.bodySm.lineHeight,
  },
  defaultText: {
    fontSize: typography.bodyMd.fontSize,
    lineHeight: typography.bodyMd.lineHeight,
  },
  buttonText: {
    fontSize: typography.buttonMd.fontSize,
    fontWeight: typography.buttonMd.fontWeight,
  }
};
```

**React Components:**

```tsx
// BEFORE
<Text style={tokens.typography.body}>
  Default body text
</Text>

<Button textStyle={tokens.typography.button}>
  Click Me
</Button>

// AFTER
<Text style={tokens.typography.bodyMd}>
  Default body text
</Text>

<Button textStyle={tokens.typography.buttonMd}>
  Click Me
</Button>
```

---

### iOS (Swift/SwiftUI)

#### Search and Replace Patterns

```bash
# Body text tokens
Typography.bodySmall → Typography.bodySm
Typography.body → Typography.bodyMd
Typography.bodyLarge → Typography.bodyLg

# Button text token
Typography.button → Typography.buttonMd
```

#### Before/After Examples

**SwiftUI:**

```swift
// BEFORE
Text("Small text")
    .font(Typography.bodySmall.font)
    .lineSpacing(Typography.bodySmall.lineHeight)

Text("Default text")
    .font(Typography.body.font)
    .lineSpacing(Typography.body.lineHeight)

Button("Click Me") { }
    .font(Typography.button.font)
    .fontWeight(Typography.button.fontWeight)

// AFTER
Text("Small text")
    .font(Typography.bodySm.font)
    .lineSpacing(Typography.bodySm.lineHeight)

Text("Default text")
    .font(Typography.bodyMd.font)
    .lineSpacing(Typography.bodyMd.lineHeight)

Button("Click Me") { }
    .font(Typography.buttonMd.font)
    .fontWeight(Typography.buttonMd.fontWeight)
```

**UIKit:**

```swift
// BEFORE
label.font = Typography.bodySmall.uiFont
label.lineHeight = Typography.bodySmall.lineHeight

titleLabel.font = Typography.body.uiFont
titleLabel.lineHeight = Typography.body.lineHeight

button.titleLabel?.font = Typography.button.uiFont

// AFTER
label.font = Typography.bodySm.uiFont
label.lineHeight = Typography.bodySm.lineHeight

titleLabel.font = Typography.bodyMd.uiFont
titleLabel.lineHeight = Typography.bodyMd.lineHeight

button.titleLabel?.font = Typography.buttonMd.uiFont
```

---

### Android (Kotlin/Compose)

#### Search and Replace Patterns

```bash
# Body text tokens
Typography.bodySmall → Typography.bodySm
Typography.body → Typography.bodyMd
Typography.bodyLarge → Typography.bodyLg

# Button text token
Typography.button → Typography.buttonMd
```

#### Before/After Examples

**Jetpack Compose:**

```kotlin
// BEFORE
Text(
    text = "Small text",
    style = Typography.bodySmall
)

Text(
    text = "Default text",
    style = Typography.body
)

Button(
    onClick = { },
    textStyle = Typography.button
) {
    Text("Click Me")
}

// AFTER
Text(
    text = "Small text",
    style = Typography.bodySm
)

Text(
    text = "Default text",
    style = Typography.bodyMd
)

Button(
    onClick = { },
    textStyle = Typography.buttonMd
) {
    Text("Click Me")
}
```

**Android Views:**

```kotlin
// BEFORE
textView.setTextAppearance(Typography.bodySmall.textAppearance)
textView.lineHeight = Typography.bodySmall.lineHeight

titleView.setTextAppearance(Typography.body.textAppearance)
titleView.lineHeight = Typography.body.lineHeight

button.setTextAppearance(Typography.button.textAppearance)

// AFTER
textView.setTextAppearance(Typography.bodySm.textAppearance)
textView.lineHeight = Typography.bodySm.lineHeight

titleView.setTextAppearance(Typography.bodyMd.textAppearance)
titleView.lineHeight = Typography.bodyMd.lineHeight

button.setTextAppearance(Typography.buttonMd.textAppearance)
```

---

## Migration Strategy

### Recommended Approach

1. **Audit Current Usage**
   - Search your codebase for all instances of old token names
   - Document where each token is used
   - Identify any custom abstractions or wrappers

2. **Update Token Imports**
   - Update your design token package to the latest version
   - Verify new tokens are available in generated files

3. **Perform Search and Replace**
   - Use your IDE's find-and-replace feature
   - Replace old token names with new names
   - Be careful with partial matches (e.g., `body` might match `bodySmall`)

4. **Test Thoroughly**
   - Visual regression testing for typography changes
   - Verify no broken references or missing tokens
   - Check that text rendering is identical before/after

5. **Update Documentation**
   - Update component documentation with new token names
   - Update design guidelines and style guides
   - Inform team members of the changes

### Automated Migration Script

For large codebases, consider creating a migration script:

```bash
#!/bin/bash
# typography-migration.sh

# Body text tokens
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -exec sed -i '' 's/typography\.bodySmall/typography.bodySm/g' {} +

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -exec sed -i '' 's/typography\.body\([^S]\)/typography.bodyMd\1/g' {} +

find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -exec sed -i '' 's/typography\.bodyLarge/typography.bodyLg/g' {} +

# Button text token
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -exec sed -i '' 's/typography\.button\([^M]\)/typography.buttonMd\1/g' {} +

echo "Migration complete! Please review changes and test thoroughly."
```

**Note:** Test this script on a small subset of files first, and always use version control to track changes.

---

## Backward Compatibility

### Deprecation Timeline

- **Phase 1 (Current)**: Old token names deprecated but still available
- **Phase 2 (3 months)**: Console warnings when old tokens are used
- **Phase 3 (6 months)**: Old token names removed from system

### Temporary Aliases

During the migration period, you can create temporary aliases in your codebase:

```typescript
// tokens-aliases.ts
import { typography } from '@designerpunk/tokens';

// Temporary aliases for backward compatibility
export const legacyTypography = {
  bodySmall: typography.bodySm,
  body: typography.bodyMd,
  bodyLarge: typography.bodyLg,
  button: typography.buttonMd,
};

// Use this during migration, then remove once complete
```

---

## Common Migration Issues

### Issue 1: Partial String Matches

**Problem:** Search-and-replace might match partial strings incorrectly.

```typescript
// Incorrect replacement
const bodyStyle = typography.body; // Becomes typography.bodyMd ✓
const bodySmallStyle = typography.bodySmall; // Becomes typography.bodyMdSmall ✗
```

**Solution:** Use word boundary matching in your search pattern or replace in order from longest to shortest name.

### Issue 2: CSS Custom Property Names

**Problem:** CSS custom property names use hyphens instead of camelCase.

```css
/* Old */
--typography-body-fontSize

/* New */
--typography-bodyMd-fontSize
```

**Solution:** Update CSS custom property references separately from JavaScript references.

### Issue 3: Type Definitions

**Problem:** TypeScript types might reference old token names.

```typescript
// Old type definition
type BodyTextToken = 'bodySmall' | 'body' | 'bodyLarge';

// New type definition
type BodyTextToken = 'bodySm' | 'bodyMd' | 'bodyLg';
```

**Solution:** Update type definitions along with token references.

---

## Verification Checklist

After migration, verify:

- [ ] All old token references replaced with new names
- [ ] No broken imports or undefined token references
- [ ] Visual regression tests pass
- [ ] Typography rendering is identical before/after
- [ ] CSS custom properties updated
- [ ] Type definitions updated
- [ ] Documentation updated
- [ ] Team members informed of changes

---

## Support and Questions

If you encounter issues during migration:

1. Check this guide for common issues and solutions
2. Review the design document for token specifications
3. Consult the requirements document for rationale
4. Reach out to the design system team for assistance

---

## Related Documentation

- **Requirements**: `.kiro/specs/typography-token-expansion/requirements.md`
- **Design**: `.kiro/specs/typography-token-expansion/design.md`
- **Tasks**: `.kiro/specs/typography-token-expansion/tasks.md`

---

*This migration guide ensures smooth transition to the new typography token naming system while maintaining consistency with the DesignerPunk size scale conventions.*
