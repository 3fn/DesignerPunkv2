---
inclusion: conditional
trigger: architecture, coding
---

# Technology Stack

**Date**: 2025-11-26
**Last Reviewed**: 2025-12-15
**Purpose**: Define technology choices for DesignerPunk cross-platform implementation  
**Organization**: process-standard  
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: architecture, coding

## AI Agent Reading Priorities

**Note**: This section intentionally uses the same heading as other steering documents because each document provides reading priorities specific to its content. This structural pattern enables progressive disclosure and helps AI agents navigate to relevant sections efficiently.

**Layer Context**: This is a Layer 3 (Specific Implementations) document that defines technology choices for cross-platform implementation. It's conditionally loaded when working on architecture or coding tasks that require platform-specific technology knowledge.

**WHEN implementing cross-platform components THEN Read:**
- Platform Technologies section (iOS, Android, Web)
- True Native Architecture section (file organization)

**WHEN working with web components THEN Read:**
- Web CSS Standards section (logical properties)
- Platform Technologies: Web section

**WHEN making architectural decisions THEN Read:**
- All sections to understand technology constraints and choices

**SKIP when:**
- Working on non-platform-specific code
- Following established component patterns
- Not making technology stack decisions

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
