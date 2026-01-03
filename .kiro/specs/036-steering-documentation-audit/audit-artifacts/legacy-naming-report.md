# Legacy Naming Audit Report

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Status**: Discovery Phase - Task 2.3 Complete
**Total Instances**: 39 (dp-icon: 6, dp-container: 9, TextInputField: 7, DPIcon: 15, "Legacy Icon": 2)

---

## By Pattern

| Pattern | Replacement | Instance Count |
|---------|-------------|----------------|
| `<dp-icon>` | `<icon-base>` | 6 |
| `<dp-container>` | `<container-base>` | 9 |
| `TextInputField` | `Input-Text-Base` | 7 |
| "Legacy Icon" | [remove/replace with Stemma equivalent] | 2 |
| `DPIcon` | `IconBaseElement` | 15 |

---

## By Document

| Document | Patterns Found | Line Numbers |
|----------|----------------|--------------|
| Browser Distribution Guide.md | `<dp-icon>`, `<dp-container>`, `TextInputField` | 54, 55, 215, 369, 378, 396, 407, 512 |
| Spec Planning Standards.md | `<dp-icon>` | 3111 |
| icon-components.md | `<dp-icon>`, "Legacy Icon" | 315, 326, 334 |
| container-components.md | `<dp-container>` | 343 |
| Component Development and Practices Guide.md | `<dp-icon>`, `<dp-container>`, `TextInputField` | 558, 604, 607, 1066, 1067, 1073, 1074 |
| component-readiness-status-system.md | `TextInputField` | 198, 481, 482 |
| blend-tokens.md | `TextInputField` | 351 |
| Test Development Standards.md | `DPIcon` | 366, 372, 382, 422, 456, 730, 751, 783, 784, 791, 801, 811, 812, 1084, 1093 |

---

## Detailed Findings

### `<dp-icon>` Instances

**Total: 6 instances across 4 documents**

#### Browser Distribution Guide.md

**Line 54** - Component listing (documentation context)
```markdown
- `<icon-base>` / `<dp-icon>` - Icon component with size and color variants
```
*Context*: Listing available components with legacy alias

**Line 369** - Section header (documentation context)
```markdown
### Icon (`<icon-base>` / `<dp-icon>`)
```
*Context*: Section header showing both current and legacy names

**Line 378** - Code example (backward compatibility example)
```html
<!-- Legacy tag (backward compatibility) -->
<dp-icon name="arrow-right" size="24"></dp-icon>
```
*Context*: Intentional legacy example for backward compatibility documentation

#### Spec Planning Standards.md

**Line 3111** - API documentation
```markdown
- **API**: `<dp-icon name="..." size="..." color="..."></dp-icon>`
```
*Context*: Component API reference using legacy naming

#### icon-components.md

**Line 315** - Component registration note
```markdown
- Custom element registration: `<icon-base>` (legacy: `<dp-icon>`)
```
*Context*: Documentation noting legacy name for reference

#### Component Development and Practices Guide.md

**Line 604** - Code example
```html
<!-- Web component API (recommended) -->
<dp-icon name="arrow-right" size="24"></dp-icon>
```
*Context*: Example marked as "recommended" but using legacy naming

**Line 607** - Code example
```html
<!-- With color override -->
<dp-icon name="check" size="24" color="color-success"></dp-icon>
```
*Context*: Example showing color override with legacy naming

---

### `<dp-container>` Instances

**Total: 9 instances across 3 documents**

#### Browser Distribution Guide.md

**Line 55** - Component listing (documentation context)
```markdown
- `<container-base>` / `<dp-container>` - Layout container with padding, background, and shadow options
```
*Context*: Listing available components with legacy alias

**Line 396** - Section header (documentation context)
```markdown
### Container (`<container-base>` / `<dp-container>`)
```
*Context*: Section header showing both current and legacy names

**Line 407** - Code example (backward compatibility example)
```html
<!-- Legacy tag (backward compatibility) -->
<dp-container padding="200" background="color-surface" border-radius="normal">
```
*Context*: Intentional legacy example for backward compatibility documentation

#### container-components.md

**Line 343** - Component registration note
```markdown
- Custom element registration: `<container-base>` (legacy: `<dp-container>`)
```
*Context*: Documentation noting legacy name for reference

#### Component Development and Practices Guide.md

**Line 1066** - Code example (DON'T pattern)
```html
<!-- DON'T: Same radius creates awkward visual overlap -->
<dp-container borderRadius="normal" padding="200">
```
*Context*: Anti-pattern example using legacy naming

**Line 1067** - Code example (nested DON'T pattern)
```html
  <dp-container borderRadius="normal">
```
*Context*: Nested container in anti-pattern example

**Line 1073** - Code example (DO pattern)
```html
<!-- DO: Reduce inner radius by padding amount -->
<dp-container borderRadius="normal" padding="200">
```
*Context*: Best practice example using legacy naming

**Line 1074** - Code example (nested DO pattern)
```html
  <dp-container borderRadius="none">
```
*Context*: Nested container in best practice example

### `TextInputField` Instances

**Total: 7 instances across 4 documents**

#### Browser Distribution Guide.md

**Line 215** - Console output example (documentation context)
```javascript
// Output: ['InputTextBase', 'ButtonCTA', 'IconBaseElement', 'ContainerBaseWeb', 'Icon', 'IconBase', 'Container', 'ContainerBase', 'TextInputField']
```
*Context*: Example showing available components via window.DesignerPunk - includes legacy name

**Line 512** - Event names documentation
```markdown
- TextInputField: `change`, `focus`, `blur`
```
*Context*: Documentation of event names for TextInputField component

#### Component Development and Practices Guide.md

**Line 558** - Example header
```markdown
**Example - TextInputField Status Icons**:
```
*Context*: Section header for example showing internal icon usage in TextInputField

#### blend-tokens.md

**Line 351** - Section header
```markdown
### TextInputField Component
```
*Context*: Section header for blend token usage example in TextInputField

#### component-readiness-status-system.md

**Line 198** - Visual indicator example
```markdown
## TextInputField ⚠️
```
*Context*: Example showing deprecated component visual indicator

**Line 481** - YAML schema example
```yaml
TextInputField:
```
*Context*: Example YAML schema for deprecated component

**Line 482** - YAML schema name field
```yaml
  name: TextInputField
```
*Context*: Name field in deprecated component schema example

---

### `DPIcon` Instances

**Total: 15 instances across 1 document**

#### Test Development Standards.md

**Line 366** - Import statement (code example)
```typescript
import { DPIcon } from '../Icon.web';
```
*Context*: Import statement in test example showing legacy class name

**Line 372** - Custom element registration (code example)
```typescript
customElements.define('dp-icon', DPIcon);
```
*Context*: Custom element registration using legacy class name

**Line 382** - Type assertion (code example)
```typescript
const element = document.createElement('dp-icon') as DPIcon;
```
*Context*: Type assertion in test example using legacy class name

**Line 422** - Type assertion (code example)
```typescript
const element = document.createElement('dp-icon') as DPIcon;
```
*Context*: Type assertion in shadow DOM test example

**Line 456** - Type assertion (code example)
```typescript
const element = document.createElement('dp-icon') as DPIcon;
```
*Context*: Type assertion in attribute change test example

**Line 730** - Type assertion (bad example)
```typescript
const element = document.createElement('dp-icon') as DPIcon;
```
*Context*: Type assertion in "bad" test example showing anti-pattern

**Line 751** - Type assertion (good example)
```typescript
const element = document.createElement('dp-icon') as DPIcon;
```
*Context*: Type assertion in "good" test example showing correct pattern

**Line 783** - Type assertion (bad example)
```typescript
const element = document.createElement('dp-icon') as DPIcon;
```
*Context*: Type assertion in registration anti-pattern example

**Line 784** - Comment (bad example)
```typescript
// Test fails because element isn't actually a DPIcon instance
```
*Context*: Comment explaining why test fails with legacy class name

**Line 791** - Explanation text
```markdown
- `document.createElement('dp-icon')` returns `HTMLElement`, not `DPIcon`
```
*Context*: Explanation of why createElement doesn't return DPIcon type

**Line 801** - Custom element registration (good example)
```typescript
customElements.define('dp-icon', DPIcon);
```
*Context*: Custom element registration in correct pattern example

**Line 811** - Type assertion (good example)
```typescript
const element = document.createElement('dp-icon') as DPIcon;
```
*Context*: Type assertion in correct pattern example

**Line 812** - Comment (good example)
```typescript
// Now element is actually a DPIcon instance
```
*Context*: Comment explaining element is now DPIcon instance

**Line 1084** - Custom element registration (complete example)
```typescript
customElements.define('dp-icon', DPIcon);
```
*Context*: Custom element registration in complete lifecycle test example

**Line 1093** - Type assertion (complete example)
```typescript
const element = document.createElement('dp-icon') as DPIcon;
```
*Context*: Type assertion in complete lifecycle test example

### "Legacy Icon" References

**Total: 2 instances across 1 document**

#### icon-components.md

**Line 326** - iOS platform notes (documentation context)
```markdown
- Legacy Icon typealias for backward compatibility
```
*Context*: Documentation noting that iOS platform has a "Legacy Icon" typealias for backward compatibility. This refers to maintaining the old `Icon` name as a typealias to the new `IconBase` implementation.

**Line 334** - Android platform notes (documentation context)
```markdown
- Legacy Icon composable wrapper for backward compatibility
```
*Context*: Documentation noting that Android platform has a "Legacy Icon" composable wrapper for backward compatibility. This refers to maintaining the old `Icon` composable as a wrapper around the new `IconBase` implementation.

**Assessment**: These "Legacy Icon" references are intentional documentation of backward compatibility mechanisms in the native platforms (iOS and Android). They describe actual code artifacts (typealias and wrapper) that exist to support migration from old naming to Stemma System naming. These may be acceptable to keep as documentation of the backward compatibility layer, or could be updated to use more specific Stemma terminology like "Icon typealias" or "Icon wrapper" without the word "Legacy".

---

## Related Legacy Phrases Found

The following related phrases were also found during the scan:

### "Legacy tag" Comments

**Total: 2 instances in Browser Distribution Guide.md**

**Line 377** - HTML comment (code example)
```html
<!-- Legacy tag (backward compatibility) -->
```
*Context*: Comment preceding `<dp-icon>` example showing backward compatibility usage

**Line 406** - HTML comment (code example)
```html
<!-- Legacy tag (backward compatibility) -->
```
*Context*: Comment preceding `<dp-container>` example showing backward compatibility usage

**Assessment**: These are intentional documentation comments showing backward compatibility examples. They are paired with the legacy `<dp-icon>` and `<dp-container>` tags already documented above.

### "(legacy: ...)" Notation

**Total: 2 instances**

**icon-components.md Line 315**:
```markdown
- Custom element registration: `<icon-base>` (legacy: `<dp-icon>`)
```
*Context*: Documentation noting legacy name for reference

**container-components.md Line 343**:
```markdown
- Custom element registration: `<container-base>` (legacy: `<dp-container>`)
```
*Context*: Documentation noting legacy name for reference

**Assessment**: These are intentional documentation of the legacy-to-current name mapping. They help developers understand the naming transition.

---

## Notes

- Legacy naming instances will be populated during Tasks 2.1-2.3
- Each instance includes file, line number, and surrounding context
- Replacements follow Stemma System naming conventions
