---
layout: default
title: DesignerPunk Design System
---

<section id="hero" class="showcase-section showcase-hero">

# DesignerPunk

*A True Native cross-platform design system with mathematical foundations, built for Human-AI collaboration.*

What began as an experiment in developing my AI skillset evolved into a reflection of my theories, principles, and practices for a sustainable, enterprise-tier design system.

Now, it's a mission to discover what's possible in the era of AI development to better enable Human-AI, and Designer-Engineer, collaboration.
</section>

<section id="architecture" class="showcase-section">

## Architecture

Most design systems are collections of hand-picked values — someone chose `16px` for body text and `24px` for spacing because it "looked right." DesignerPunk takes a different approach: every value in the system is mathematically derived from a small set of base constants.

The **Rosetta token system** starts with base values like `8` (spacing), `16` (font size), and `1.125` (modular scale ratio), then generates 614 design tokens across 16 families through mathematical relationships — not arbitrary choices. These tokens are unitless internally: the same token outputs `px` for web, `pt` for iOS, and `dp` for Android at build time.

This is the **True Native** philosophy. Rather than wrapping a web view or detecting platforms at runtime, DesignerPunk generates genuinely native code for each platform — CSS custom properties, Swift constants, and Kotlin constants — from a single token source.

- **Primitive → Semantic → Component** token hierarchy separates mathematical values from design intent from component-specific usage
- **3 platform outputs** from one source: Web CSS, iOS Swift, Android Kotlin
- **Build-time separation** — no runtime detection, no abstraction layers, no performance cost

[Learn more →]({{ '/architecture' | relative_url }})

</section>

<section id="components" class="showcase-section">

## Component Catalog

30 components organized into 9 Stemma families — not a flat list of parts, but an inheritance-based architecture where components share contracts, tokens, and behaviors through a formal schema system.

- **Contract-first development** — Every component's behavior is specified in a `contracts.yaml` before any platform code is written. 454 behavioral contracts define interaction states, accessibility requirements, and visual behaviors that all three platform implementations must satisfy.
- **Inheritance architecture** — Variants inherit from base components. `Badge-Count-Notification` inherits from `Badge-Count-Base`, gaining all its contracts and tokens while adding notification-specific semantics. The platform dimension is orthogonal — each level gets independent Web, iOS, and Android implementations.
- **Composition model** — Components compose other components with schema-tracked relationships. A `Progress-Stepper-Base` composes nodes, connectors, and labels — the schema system resolves tokens across the full composition tree.
- **Full cross-platform parity** — 90 platform implementations: every component ships native Web (Custom Elements), iOS (SwiftUI), and Android (Jetpack Compose). Same contracts, same tokens, different native code.
- **Accessibility-first** — WCAG 2.1 AA compliance is a contract requirement, not an afterthought. Contracts reference specific WCAG criteria and require validation.

[Learn more →]({{ '/components' | relative_url }})

</section>

<section id="mathematics" class="showcase-section">

## Mathematical Foundation

Design tokens in most systems are arbitrary — someone picked `4px`, `8px`, `12px`, `16px` because the progression "felt right." DesignerPunk's values are calculated.

Every token family starts with a base constant and a mathematical rule. Spacing and radius use an 8-unit baseline grid. Typography uses a modular scale — the same concept musicians use to derive harmonious intervals. The result is a system where values have predictable relationships: if you know the base and the rule, you can derive any token in the family.

This isn't academic rigor for its own sake. Mathematically derived values produce visual consistency that hand-picked values can't match, and they make the system extensible — adding a new token means applying the formula, not guessing a number.

[Learn more →]({{ '/mathematics' | relative_url }})

</section>

<section id="collaboration" class="showcase-section">

## Human-AI Collaboration

DesignerPunk is built through a structured partnership between a human lead and three specialized AI agents. Each agent owns a domain — tokens, components, or governance — and all operate under a collaboration framework that requires mandatory skepticism, counter-arguments, and candid communication. The agents don't just execute; they challenge, review each other's work, and flag when they might be wrong.

This isn't AI-assisted development. It's a governance model for Human-AI co-creation.

[Learn more →]({{ '/collaboration' | relative_url }})

</section>

<section id="quality" class="showcase-section">

## Quality & Governance

DesignerPunk's test suite runs **7,965 tests across 306 suites** to ensure the execution of craft and governance — all passing. But test count alone doesn't tell the story. What matters is *what* gets tested and *how* quality is enforced.

- **Three-tier validation**: Every task is classified as Setup, Implementation, or Architecture, with validation depth scaled to match — minimal checks for directory creation, comprehensive design review for architectural decisions
- **Behavioral contract validation**: Components are tested against their behavioral contracts — not just "does it render" but "does it meet its accessibility, interaction, and state management promises"
- **Token compliance enforcement**: Validators ensure components consume tokens correctly — semantic tokens first, primitive only when no semantic exists, no arbitrary hard-coded values
- **Contamination prevention**: A security layer prevents documentation drift and ensures concept-based knowledge stays consistent across the system

</section>

<section id="stats" class="showcase-section">

## At a Glance

<div class="showcase-stats-grid">
  <div class="showcase-stat">
    <span class="showcase-stat-number">30</span>
    <span class="showcase-stat-label">Components</span>
  </div>
  <div class="showcase-stat">
    <span class="showcase-stat-number">9</span>
    <span class="showcase-stat-label">Stemma Families</span>
  </div>
  <div class="showcase-stat">
    <span class="showcase-stat-number">614</span>
    <span class="showcase-stat-label">Design Tokens</span>
  </div>
  <div class="showcase-stat">
    <span class="showcase-stat-number">7,965</span>
    <span class="showcase-stat-label">Tests Passing</span>
  </div>
  <div class="showcase-stat">
    <span class="showcase-stat-number">3</span>
    <span class="showcase-stat-label">Platforms</span>
  </div>
  <div class="showcase-stat">
    <span class="showcase-stat-number">454</span>
    <span class="showcase-stat-label">Behavioral Contracts</span>
  </div>
</div>

<!-- Stats gathered from codebase by agents during Task 2. -->
<!-- Ada: token count ✅ (614), platform coverage ✅ (3) -->
<!-- Lina: component count, family count, behavioral contract count, composition count -->
<!-- Thurgood: test count, suite count -->

</section>
