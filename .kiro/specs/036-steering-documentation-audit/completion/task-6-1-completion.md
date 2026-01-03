# Task 6.1 Completion: Prioritize Documents by Impact

**Date**: 2026-01-03
**Task**: 6.1 Prioritize documents by impact
**Type**: Documentation
**Status**: Complete (REVISED)
**Validation**: Tier 2 - Standard

---

## What Was Done

Created comprehensive impact prioritization analysis for all 55 steering documents using a simplified model:

**Impact Score = Token Count × Load Frequency Multiplier**

**Simplified Multipliers:**
- Always Loaded: 10 (loaded every session)
- On-Demand (Manual or Conditional): 1 (loaded when needed)

**Why simplified?** Manual and conditional are both on-demand mechanisms - neither is inherently cheaper. The difference is *how* they're triggered (explicit query vs keyword match), not *how much* they cost when loaded.

---

## Key Findings

### Finding 1: Always-Loaded Docs Are the Primary Target

| Category | Doc Count | Tokens | % of Tokens | Impact | % of Impact |
|----------|-----------|--------|-------------|--------|-------------|
| Always-Loaded | 6 | 39,124 | 13.9% | 391,240 | **61.7%** |
| On-Demand | 49 | 242,555 | 86.1% | 242,555 | 38.3% |

6 documents (13.9% of total) account for **61.7% of total impact** due to the 10× multiplier.

### Finding 2: Two Documents Dominate

File Organization Standards + Development Workflow = **83.7% of session start load** and **51.7% of total impact**.

### Finding 3: On-Demand Architecture is Working

49 documents are on-demand, meaning they only consume context when actually needed. This is the correct architecture - no structural changes needed.

### Finding 4: Manual vs Conditional is About Reliability, Not Cost

Both are on-demand with the same token cost. The choice is about:
- **Manual**: More precise (agent queries exactly what it needs)
- **Conditional**: More reliable (agent automatically gets relevant guidance)

---

## Optimization Priority Matrix

| Priority | Action | Documents | Impact Reduction | ROI |
|----------|--------|-----------|------------------|-----|
| **P1** | Split always-loaded docs | File Organization, Development Workflow | ~163,730 | **Highest** |
| **P2** | Streamline meta-guide | 00-Steering Documentation Directional Priorities | ~18,555 | High |
| **P3** | Reduce large on-demand docs | Spec Planning Standards | ~13,500 | Medium |
| **P4** | No action | Small on-demand docs | N/A | N/A |

---

## Artifacts Updated

- `.kiro/specs/036-steering-documentation-audit/audit-artifacts/impact-prioritization.md` - Revised with simplified model
- `.kiro/specs/036-steering-documentation-audit/audit-artifacts/token-tracking.md` - Updated Context Load Categories

---

## Requirements Validated

- **Requirement 2.5**: ✅ Optimization opportunities identified and documented as candidates for evaluation
  - Impact scores calculated using simplified, accurate model
  - Documents ranked by optimization potential
  - Primary target identified: Always-loaded documents

