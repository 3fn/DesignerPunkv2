---
inclusion: always
---
# Technology Stack

**Date**: November 26, 2025  
**Purpose**: Define technology choices for DesignerPunk cross-platform implementation  
**Organization**: process-standard  
**Scope**: cross-project

---

## Platform Technologies

### iOS
- **Language**: Swift (native)
- **UI Framework**: SwiftUI

### Android
- **Language**: Kotlin (native)
- **UI Framework**: Jetpack Compose

### Web
- **Component Model**: Web Components (Custom Elements)
- **Styling**: CSS with logical properties

## Web CSS Standards

**Use logical properties for layout spacing**:

```css
/* ✅ CORRECT - Logical properties */
padding-inline: var(--space-inset-normal);
padding-block: var(--space-inset-tight);
margin-inline-start: var(--space-100);

/* ❌ WRONG - Physical properties */
padding-left: var(--space-inset-normal);
padding-right: var(--space-inset-normal);
margin-left: var(--space-100);
```

**Rationale**: Logical properties facilitate creation of adaptable, maintainable experiences that support multiple languages and writing modes (LTR, RTL, vertical text).

**Exception**: Use physical properties only when design explicitly requires physical positioning regardless of writing mode (e.g., decorative elements).

## True Native Architecture

Components follow True Native Architecture with separate platform implementations:

```
ComponentName/
  platforms/
    web/ComponentName.web.tsx
    ios/ComponentName.ios.swift
    android/ComponentName.android.kt
```

Build-time platform separation (not runtime detection) enables platform-specific optimizations while maintaining cross-platform consistency through shared design tokens.

---

*This technology stack supports True Native Architecture while maintaining cross-platform consistency through the mathematical token system.*
