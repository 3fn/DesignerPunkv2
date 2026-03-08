# Contract Review: performance_virtualization Update

**Date**: 2026-03-07
**Reviewer**: Thurgood (Governance)
**Task**: 2.5 — Update contract and documentation
**File**: `src/components/core/Progress-Pagination-Base/contracts.yaml`

---

## Current State

The `performance_virtualization` contract has been partially updated. The `behavior` field now references `motion.selectionTransition` and `prefers-reduced-motion`, replacing the old "Window shifts immediately (no animation)" statement. The `description`, `validation`, `test_approach`, and `wcag` fields are unchanged from the pre-animation version.

---

## Issues Found

### 1. Validation section incomplete (Medium)

The `validation` list only covers positional logic. It does not validate animation behavior.

**Missing validation items:**
- Nodes animate state transitions (size/color) on `currentItem` change
- Animation disabled when platform reduced-motion preference is active
- ARIA announcements not delayed by animation

### 2. Test approach stale (Medium)

The `test_approach` only describes the positional test. No animation verification steps.

### 3. WCAG field is null (Low-Medium)

Animation is now part of the contract. The `prefers-reduced-motion` behavior ties to WCAG 2.3.3 (Animation from Interactions). The `wcag` field should reference this.

### 4. Reduced motion is web-only in behavior text (Medium)

The behavior text specifies `prefers-reduced-motion: reduce` (web only), but the contract applies to all three platforms. iOS (`UIAccessibility.isReduceMotionEnabled`) and Android (`ANIMATOR_DURATION_SCALE == 0`) equivalents are specified in the requirements and design doc but not in the contract.

---

## Proposed Contract

```yaml
  performance_virtualization:
    category: performance
    description: Renders max 5 visible nodes using animated sliding window
    behavior: |
      When totalItems > 5, only 5 nodes are rendered:
      - Pages 1-3: show nodes 1-5
      - Pages 4 to (totalItems-3): center current at position 3
      - Last 3 pages: show last 5 nodes
      When the visible window changes, nodes animate to their new states
      (size and color) using motion.selectionTransition timing (250ms,
      easingStandard). All visible nodes animate simultaneously.
      Animation is disabled when the platform's reduced-motion preference
      is active (web: prefers-reduced-motion: reduce, iOS:
      isReduceMotionEnabled, Android: ANIMATOR_DURATION_SCALE == 0).
    wcag: "2.3.3 Animation from Interactions"
    platforms: [web, ios, android]
    validation:
      - totalItems ≤ 5 renders all nodes
      - totalItems > 5 renders exactly 5 nodes
      - Current node centered when possible
      - Nodes animate state transitions on currentItem change
      - Animation disabled when platform reduced-motion preference is active
      - ARIA announcements not delayed by animation
    test_approach: |
      Render with totalItems=10, currentItem=5. Verify exactly 5 nodes
      rendered with current centered. Verify transition CSS applied to
      node elements. Change currentItem and verify state animation fires.
      Enable prefers-reduced-motion and verify animation is disabled.
      Verify aria-label updates immediately regardless of animation state.
    required: true
```

---

## Changes from Current

| Field | Current | Proposed | Rationale |
|-------|---------|----------|-----------|
| `description` | "Renders max 5 visible nodes using sliding window" | "...using animated sliding window" | Reflects animation addition |
| `behavior` | References `prefers-reduced-motion` only | Adds all 3 platform reduced-motion mechanisms, adds "simultaneously" | Complete platform coverage |
| `wcag` | `null` | `"2.3.3 Animation from Interactions"` | Animation is now a contract behavior |
| `validation` | 3 positional items | 3 positional + 3 animation items | Animation behavior must be validated |
| `test_approach` | Positional test only | Positional + animation + reduced motion + ARIA timing | Complete test coverage |

---

## Recommendation

Lina applies the proposed contract update as part of Task 2.5. Thurgood re-audits after application to confirm all fields are consistent.
