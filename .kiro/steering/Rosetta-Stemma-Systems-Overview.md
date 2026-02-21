---
inclusion: always
name: Rosetta-Stemma-Systems-Overview
description: Visual architecture overview of DesignerPunk's dual foundation — Rosetta (mathematical token system) and Stemma (relational component system). Mermaid diagrams showing token hierarchy, component families, pipeline flow, and platform integration. Load for high-level system understanding.
---

# Rosetta and Stemma Systems — Visual Overview

**Date**: 2026-02-21
**Last Reviewed**: 2026-02-21
**Purpose**: Visual architecture overview of DesignerPunk's dual foundation systems
**Organization**: architecture-overview
**Scope**: cross-project
**Layer**: 1
**Relevant Tasks**: all-tasks

---

## Overview

DesignerPunk is built on two complementary foundation systems:

- **Rosetta System** — Mathematical foundation for visual consistency (tokens, scales, relationships)
- **Stemma System** — Relational foundation for behavioral consistency (components, contracts, inheritance)

This document provides visual diagrams showing how these systems work individually and how they integrate to create the complete design system.

---

## High-Level: DesignerPunk Dual Foundation

This diagram shows the relationship between Rosetta (mathematical) and Stemma (relational) systems, and how they work together to provide both visual and behavioral consistency.

```mermaid
flowchart TB
    subgraph DesignerPunk["DesignerPunk Design System"]
        subgraph Rosetta["Rosetta System — Mathematical Foundation"]
            direction TB
            R_Desc["How things look and scale<br/>Token values, scales, relationships"]
            R_Prim["Primitive Tokens"]
            R_Sem["Semantic Tokens"]
            R_CompTok["Component Tokens"]
            R_Prim --> R_Sem --> R_CompTok
        end

        subgraph Stemma["Stemma System — Relational Foundation"]
            direction TB
            S_Desc["How things behave and relate<br/>Component contracts, inheritance"]
            S_Fam["Component Families"]
            S_Base["Primitive (Base) components"]
            S_Sem["Semantic components"]
            S_Contracts["Behavioral Contracts"]
            S_Fam --> S_Base --> S_Sem
            S_Base --> S_Contracts
            S_Sem --> S_Contracts
        end
    end

    R_CompTok --> Stemma
    Rosetta -.->|"Visual consistency"| R_Desc
    Stemma -.->|"Behavioral consistency"| S_Desc
```

---

## Rosetta System: Token Pipeline and Layers

This diagram shows the Rosetta token pipeline (definition → validation → registry → generation → output) and the three-layer token hierarchy (primitive → semantic → component).

```mermaid
flowchart LR
    subgraph Pipeline["Rosetta token pipeline"]
        D["Definition<br/>Token files"]
        V["Validation<br/>Mathematical rules"]
        R["Registry<br/>Global store"]
        G["Generation<br/>Platform formats"]
        O["Platform output<br/>CSS / Swift / Kotlin"]
        D --> V --> R --> G --> O
    end

    subgraph Layers["Token definition layers"]
        direction TB
        L1["Layer 1: Primitive<br/>spacing, color, typography, motion, radius"]
        L2["Layer 2: Semantic<br/>button.*, input.*, card.*, color.primary"]
        L3["Layer 3: Component<br/>defineComponentTokens() per component"]
        L1 --> L2 --> L3
    end

    Layers --> Pipeline
```

---

## Stemma System: Families and Inheritance

This diagram shows the 11 component families, the family inheritance pattern (primitive base → semantic variants), and how behavioral contracts apply to components.

```mermaid
flowchart TB
    subgraph Families["11 component families"]
        F1["Buttons"]
        F2["Form Inputs"]
        F3["Containers"]
        F4["Icons"]
        F5["Modals"]
        F6["Avatars"]
        F7["Badges & Tags"]
        F8["Data Displays"]
        F9["Dividers"]
        F10["Loading"]
        F11["Navigation"]
    end

    subgraph Inheritance["Family inheritance pattern"]
        Base["[Family]-[Type]-Base<br/>Primitive — foundational behaviors"]
        Sem1["[Family]-[Type]-Variant1<br/>Semantic"]
        Sem2["[Family]-[Type]-Variant2<br/>Semantic"]
        Base --> Sem1
        Base --> Sem2
    end

    subgraph Contracts["Behavioral contracts (examples)"]
        C1["focusable"]
        C2["validatable"]
        C3["float-label"]
        C4["error-state"]
    end

    Families --> Inheritance
    Base --> Contracts
    Sem1 --> Contracts
    Sem2 --> Contracts
```

---

## Integration: Tokens → Components → Platforms

This diagram shows how Rosetta tokens flow into Stemma components, which then generate platform-specific implementations (Web, iOS, Android).

```mermaid
flowchart TB
    subgraph Rosetta["Rosetta System"]
        PT["Primitive tokens<br/>space100, purple-300, fontSize200"]
        ST["Semantic tokens<br/>color.primary, typography.bodyMd"]
        CT["Component token files<br/>tokens.ts per component"]
        PT --> ST --> CT
    end

    subgraph Stemma["Stemma System"]
        Fam["Component families<br/>Buttons, Form Inputs, …"]
        Comp["Stemma components<br/>[Family]-[Type]-[Variant]"]
        Fam --> Comp
    end

    subgraph Platforms["Platform implementations"]
        Web["Web<br/>CSS custom properties<br/>Web Components"]
        iOS["iOS<br/>Swift extensions<br/>SwiftUI"]
        And["Android<br/>Kotlin extensions<br/>Jetpack Compose"]
    end

    CT --> Comp
    Comp --> Web
    Comp --> iOS
    Comp --> And
```

---

## Combined Overview (Single Diagram)

This diagram provides a simplified single-view of the complete system: Rosetta foundation → Stemma foundation → Platform output.

```mermaid
flowchart TB
    subgraph Foundation["DesignerPunk foundation"]
        subgraph Rosetta["Rosetta — Mathematical"]
            R1["Primitive tokens"]
            R2["Semantic tokens"]
            R3["Component tokens"]
            R1 --> R2 --> R3
        end

        subgraph Stemma["Stemma — Relational"]
            S1["Component families (11)"]
            S2["Primitive (Base) components"]
            S3["Semantic components"]
            S4["Behavioral contracts"]
            S1 --> S2 --> S3
            S2 --> S4
            S3 --> S4
        end
    end

    subgraph Output["Platform output"]
        Web["Web"]
        iOS["iOS"]
        And["Android"]
    end

    R3 --> S3
    S3 --> Web
    S3 --> iOS
    S3 --> And
```

---

## Related Documentation

**Rosetta System:**
- [Rosetta System Principles](./rosetta-system-principles.md) — Mathematical foundation and token philosophy
- [Rosetta System Architecture](./Rosetta-System-Architecture.md) — Detailed pipeline, generation subsystem, validation

**Stemma System:**
- [Stemma System Principles](./stemma-system-principles.md) — Component philosophy and inheritance patterns
- [Component Quick Reference](./Component-Quick-Reference.md) — Routing table for component family docs

**Component Families:**
- [Component-Family-Button.md](./Component-Family-Button.md)
- [Component-Family-Form-Inputs.md](./Component-Family-Form-Inputs.md)
- [Component-Family-Icon.md](./Component-Family-Icon.md)
- [Component-Family-Container.md](./Component-Family-Container.md)
- [Component-Family-Avatar.md](./Component-Family-Avatar.md)
- [Component-Family-Badge.md](./Component-Family-Badge.md)
- [Component-Family-Chip.md](./Component-Family-Chip.md)
- [Component-Family-Progress.md](./Component-Family-Progress.md)
- [Component-Family-Divider.md](./Component-Family-Divider.md) (placeholder)
- [Component-Family-Loading.md](./Component-Family-Loading.md) (placeholder)
- [Component-Family-Modal.md](./Component-Family-Modal.md) (placeholder)
- [Component-Family-Navigation.md](./Component-Family-Navigation.md) (placeholder)
- [Component-Family-Data-Display.md](./Component-Family-Data-Display.md) (placeholder)

---

**Organization**: architecture-overview
**Scope**: cross-project
