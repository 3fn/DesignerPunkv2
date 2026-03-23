# Task 1.4 Completion: Produce Template Authoring Guidance

**Date**: 2026-03-23
**Spec**: 069 — Layout Templates
**Validation Tier**: 1 — Minimal
**Agents**: Leonardo (synthesis) + Lina (review)

---

## What Was Done

Synthesized insights from Tasks 1.1–1.3 into authoring guidance covering: what makes a good template, what to encode vs leave to screen specs, the composition model, an authoring checklist, and common pitfalls. Also captured the page layout templates future section with the composition decision.

### Guidance Structure

| Section | Source |
|---------|--------|
| What makes a good template (5 criteria) | Peter interview (reusability, mobile-first), design system study (all breakpoints required) |
| Encode vs screen spec dividing line | Peter interview (stacking order as default, content constraints as screen-spec-level) |
| Template composition model (primitive → specialized) | Peter interview (inheritance mental model, deferred in schema) |
| Authoring checklist (9 items) | All three tasks — token naming, breakpoint completeness, region naming |
| Common pitfalls (5 items) | Design system study (web-centric thinking), Peter interview (responsive vs reactive confusion) |
| Page layout templates future | Lina R2 scope discussion, Peter-approved composition decision |

### Key Dividing Line

"If the decision depends on what's *in* the region, it belongs in the screen spec. If the decision depends on the region's *spatial relationship* to other regions, it belongs in the template."

## Artifacts

- `learning-foundation.md` § "Authoring Guidance" — full guidance section, source material for steering doc Section 8
