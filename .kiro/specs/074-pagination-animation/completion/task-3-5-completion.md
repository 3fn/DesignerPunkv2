# Task 3.5 Completion: Update Design Outline for Render-All-Dots

**Date**: 2026-03-07
**Spec**: 074 — Pagination Animation
**Task**: 3.5 — Update design outline for render-all-dots
**Agent**: Lina (component implementation)
**Type**: Documentation
**Validation Tier**: Tier 1 — Minimal

---

## Summary

Rewrote `design-outline-task3.md` to replace the obsolete windowed buffer model (Issue 2) with the render-all-dots + translateX track centering architecture. Issue 1 (scale-based sizing) was unchanged. This document is the source of truth that unblocks tasks 3.7 (contract update), 3.10 (iOS), and 3.11 (Android).

---

## Changes

### design-outline-task3.md

- **Status**: Updated to reflect both issues implemented with architectural pivot note
- **Issue 2 section**: Fully replaced. Now documents:
  - Render-all-dots approach with architectural pivot callout
  - DOM structure (`.pagination` > `.pagination__track` > nodes)
  - Centering math formula with clamp
  - Viewport sizing table (sm/md/lg with stride, gap, padding, total)
  - Clip-path pill masking with 2px inset
  - Padding split (block vs inline) with token references
  - Animation behavior (first render, subsequent, reduced motion)
  - Counter-arguments (DOM count, hardcoded pixel values)
- **Platform Considerations**: Replaced speculative notes with concrete implementation approaches:
  - Web: marked as implemented
  - iOS: `ScrollViewReader` + `scrollTo(anchor: .center)` with code example
  - Android: `LazyRow` + `animateScrollToItem()` with code example
  - Both native platforms include reduced motion handling
- **Resolved Questions**: Added item 4 (rendering architecture decision)
- **Lina's Concerns**: Updated from "evaluate after" to "evaluated — acceptable"
- **Scope**: Split into Completed (web) and Remaining (with task references)

### What Was Preserved

- Problem Statement (both issues) — unchanged, still accurate
- Issue 1 approach (scale-based sizing) — unchanged
- Cross-Component Scoping decision — unchanged
- Ada's token decision — unchanged

---

## Unblocked Tasks

- **3.7**: Thurgood can now audit `performance_virtualization` contract against accurate design outline
- **3.10**: iOS implementation has concrete approach documented
- **3.11**: Android implementation has concrete approach documented

---

## Verification

- Document reads coherently end-to-end ✅
- All cross-references to findings docs are valid ✅
- Task references in Remaining scope match tasks.md numbering ✅
