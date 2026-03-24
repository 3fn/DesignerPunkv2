---
layout: deep-dive
title: Component Catalog
description: Stemma component families, behavioral contracts, inheritance architecture, and cross-platform parity.
---

# Component Catalog

DesignerPunk's component system — Stemma — is an inheritance-based architecture where 30 components across 9 families share contracts, tokens, and behaviors through a formal schema system. Every component ships native implementations for Web, iOS, and Android.

## The 9 Stemma Families

| Family | Components | Description |
|--------|-----------|-------------|
| **FormInput** | 8 | Text inputs, checkboxes, radio buttons — the most complex family with float labels, validation states, and input masking |
| **ProgressIndicator** | 6 | Steppers, pagination, nodes, connectors, labels — heavily composed components |
| **Button** | 4 | CTA, icon, vertical list item, vertical list set — deepest variant architecture |
| **Chip** | 3 | Base, filter, input — inheritance-driven variants with shared interaction contracts |
| **Badge** | 3 | Count base, count notification, label — clean inheritance example |
| **Navigation** | 2 | Tab bar, segmented choice — highest contract counts (42 and 48 contracts respectively) |
| **Container** | 2 | Base container and card variant — composition with child components |
| **Icon** | 1 | SVG icon system with size tokens derived from typography scale |
| **Avatar** | 1 | Image/initials display with hexagonal clip path and fallback states |

## Contract-First Development

Every component starts with a `contracts.yaml` — a behavioral specification that defines what the component must do before any platform code is written. Platform implementations satisfy the contracts; they don't define them.

A contract specifies the behavior, the WCAG criterion it addresses, which platforms must implement it, and how to validate it. Here's a real contract from `Input-Text-Base`:

```yaml
content_float_label:
  category: content
  description: Label animates from placeholder to floated position
  behavior: |
    Label smoothly transitions from placeholder position inside input
    to floated position above input when focused or filled.
    Animation uses motion.floatLabel token (250ms, standard easing).
  wcag: "2.3.3 Animation from Interactions"
  platforms: [web, ios, android]
  validation:
    - Label animates from inside to above input on focus
    - Label stays floated when input has content
    - Animation respects prefers-reduced-motion
    - Animation timing matches motion.floatLabel token
  required: true
```

The system has **454 behavioral contracts** across 30 components. Each contract is categorized (interaction, content, accessibility, visual) and references specific WCAG criteria where applicable.

## Inheritance Architecture

Stemma uses schema-level inheritance. A variant component declares `inherits: ParentComponent` and automatically receives the parent's contracts, tokens, and props — then adds or overrides what's specific to the variant.

**Badge family example:**

```
Badge-Count-Base (base)
  ├── contracts: 18 behavioral contracts
  ├── tokens: count display, overflow, sizing
  └── Badge-Count-Notification (semantic variant)
        ├── inherits: all 18 contracts + tokens
        ├── adds: notification color semantics
        └── adds: live region announcements (accessibility)
```

The platform dimension is orthogonal to inheritance. `Badge-Count-Base` has Web, iOS, and Android implementations. `Badge-Count-Notification` also has all three. Each platform implements against the same contracts independently — there's no shared runtime code between platforms.

**Other inheritance chains:**
- `Input-Text-Base` → `Input-Text-Email`, `Input-Text-Password`, `Input-Text-PhoneNumber`
- `Chip-Base` → `Chip-Filter`, `Chip-Input`
- `Input-Checkbox-Base` → `Input-Checkbox-Legal`

## Composition Model

Some components compose other components, and the schema system tracks these relationships. When a parent composes children, the schema resolves tokens from the full composition tree — the parent's own tokens plus all composed children's tokens.

**7 components use composition:**
- `Progress-Stepper-Base` composes nodes, connectors, and labels
- `Progress-Stepper-Detailed` composes the same set with additional detail slots
- `Button-VerticalList-Set` composes `Button-VerticalList-Item` instances
- `Input-Radio-Set` composes `Input-Radio-Base` instances
- `Nav-TabBar-Base` composes tab items with icons and labels
- `Container-Card-Base` composes content within a card surface
- `Progress-Pagination-Base` composes page indicators

## Showcase Components

### Button Family — Inheritance Depth

The Button family demonstrates the variant architecture most clearly. `Button-CTA` is a standalone component with three visual variants (primary, secondary, tertiary) handled via a `variant` prop — not separate components. `Button-Icon` provides icon-only actions. `Button-VerticalList-Item` and `Button-VerticalList-Set` show the composition pattern within the same family.

### Badge Family — Clean Inheritance

`Badge-Count-Notification` inherits from `Badge-Count-Base`, adding notification-specific color semantics and live region announcements for screen readers. The inheritance is visible in the schema: `inherits: Badge-Count-Base`. All base contracts and tokens flow through automatically.

### Input-Text — Accessibility Contracts

`Input-Text-Base` has 17 behavioral contracts covering float label animation, validation states, helper text, character counting, and comprehensive keyboard navigation. Its three variants (`Email`, `Password`, `PhoneNumber`) inherit all 17 contracts and add input-specific behaviors like masking and format validation.

## Cross-Platform Parity

Every component has three native implementations:

| Platform | Technology | File Pattern |
|----------|-----------|-------------|
| **Web** | Custom Elements + Shadow DOM | `*.web.ts` |
| **iOS** | SwiftUI | `*.ios.swift` |
| **Android** | Jetpack Compose | `*.android.kt` |

All platforms share the same design tokens (unitless values translated to platform-native units at build time) and satisfy the same behavioral contracts. There is no shared runtime code — each platform is fully native.

**90 platform implementations** total: 30 Web, 30 iOS, 30 Android.
