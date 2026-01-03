# Impact Prioritization Analysis

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Status**: Analysis Phase - Task 6.1 (REVISED)
**Purpose**: Prioritize documents by optimization potential using impact score

---

## Impact Score Methodology

### Simplified Model

**Impact Score = Token Count × Load Frequency Multiplier**

### Load Frequency Multipliers (REVISED)

| Load Behavior | Multiplier | Rationale |
|---------------|------------|-----------|
| Always Loaded | 10 | Loaded every session, highest optimization value |
| On-Demand (Manual or Conditional) | 1 | Loaded when needed, same cost either way |

**Why this simplification?**

Manual and conditional are both "on-demand" loading mechanisms:
- **Manual**: Agent explicitly queries via MCP
- **Conditional**: Auto-loads based on trigger keywords

Neither is inherently cheaper - both load the full document when triggered. The difference is *how* they're triggered, not *how much* they cost when loaded.

### Actual Inclusion Mode Distribution

| Inclusion Mode | Doc Count | Total Tokens | % of Total |
|----------------|-----------|--------------|------------|
| **always** | 6 | 39,124 | 13.9% |
| **on-demand** (manual + conditional) | 49 | 242,555 | 86.1% |
| **TOTAL** | **55** | **281,679** | **100%** |

---

## Prioritized Document Rankings

### Tier 1: Critical Priority (Always-Loaded Documents)

These documents load every session. **This is where optimization has the highest ROI.**

| Rank | Document | Tokens | Impact Score | % of Session Start |
|------|----------|--------|--------------|-------------------|
| 1 | File Organization Standards.md | 16,680 | **166,800** | 42.6% |
| 2 | Development Workflow.md | 16,093 | **160,930** | 41.1% |
| 3 | 00-Steering Documentation Directional Priorities.md | 3,711 | **37,110** | 9.5% |
| 4 | Start Up Tasks.md | 1,459 | **14,590** | 3.7% |
| 5 | Personal Note.md | 624 | **6,240** | 1.6% |
| 6 | Core Goals.md | 557 | **5,570** | 1.4% |

**Tier 1 Total**: 39,124 tokens | Combined Impact: **391,240**

**Key Insight**: File Organization Standards + Development Workflow = **83.7% of session start load**. These two documents are the primary optimization targets.

---

### Tier 2: On-Demand Documents (Ranked by Token Count)

Since all on-demand docs have the same multiplier (1), ranking is simply by token count. Larger docs = more context consumed when loaded.

#### Large On-Demand Documents (10,000+ tokens)

| Rank | Document | Tokens | Impact Score |
|------|----------|--------|--------------|
| 7 | Spec Planning Standards.md | 27,135 | **27,135** |
| 8 | Test Development Standards.md | 16,485 | **16,485** |
| 9 | Test Failure Audit Methodology.md | 14,845 | **14,845** |
| 10 | Component Development and Practices Guide.md | 11,208 | **11,208** |

**Subtotal**: 69,673 tokens

#### Medium On-Demand Documents (5,000-10,000 tokens)

| Rank | Document | Tokens | Impact Score |
|------|----------|--------|--------------|
| 11 | component-family-development-standards.md | 9,446 | **9,446** |
| 12 | semantic-token-structure.md | 8,871 | **8,871** |
| 13 | A Vision of the Future.md | 8,856 | **8,856** |
| 14 | component-schema-format.md | 8,517 | **8,517** |
| 15 | stemma-system-principles.md | 8,389 | **8,389** |
| 16 | component-family-templates.md | 8,101 | **8,101** |
| 17 | component-family-inheritance-structures.md | 6,437 | **6,437** |
| 18 | shadow-tokens.md | 6,378 | **6,378** |
| 19 | platform-implementation-guidelines.md | 5,956 | **5,956** |
| 20 | spacing-tokens.md | 5,489 | **5,489** |
| 21 | motion-tokens.md | 5,360 | **5,360** |
| 22 | responsive-tokens.md | 5,311 | **5,311** |
| 23 | color-tokens.md | 5,279 | **5,279** |
| 24 | form-inputs-components.md | 5,183 | **5,183** |
| 25 | layering-tokens.md | 5,007 | **5,007** |
| 26 | accessibility-tokens.md | 4,973 | **4,973** |

**Subtotal**: 107,553 tokens

#### Smaller On-Demand Documents (3,000-5,000 tokens)

| Rank | Document | Tokens | Impact Score |
|------|----------|--------|--------------|
| 27 | typography-tokens.md | 4,858 | **4,858** |
| 28 | behavioral-contract-validation-framework.md | 4,811 | **4,811** |
| 29 | component-readiness-status-system.md | 4,730 | **4,730** |
| 30 | opacity-tokens.md | 4,523 | **4,523** |
| 31 | Browser Distribution Guide.md | 4,220 | **4,220** |
| 32 | mcp-component-family-document-template.md | 4,155 | **4,155** |
| 33 | glow-tokens.md | 4,058 | **4,058** |
| 34 | blend-tokens.md | 4,014 | **4,014** |
| 35 | Token Resolution Patterns.md | 3,832 | **3,832** |
| 36 | Task-Type-Definitions.md | 3,793 | **3,793** |
| 37 | border-tokens.md | 3,628 | **3,628** |
| 38 | radius-tokens.md | 3,523 | **3,523** |
| 39 | container-components.md | 3,143 | **3,143** |
| 40 | button-components.md | 3,094 | **3,094** |
| 41 | icon-components.md | 3,015 | **3,015** |

**Subtotal**: 63,397 tokens

#### Small On-Demand Documents (under 3,000 tokens)

| Rank | Document | Tokens | Impact Score |
|------|----------|--------|--------------|
| 42 | Cross-Platform vs Platform-Specific Decision Framework.md | 2,914 | **2,914** |
| 43 | primitive-vs-semantic-usage-philosophy.md | 2,841 | **2,841** |
| 44 | Release Management System.md | 2,408 | **2,408** |
| 45 | Component Quick Reference.md | 2,366 | **2,366** |
| 46 | BUILD-SYSTEM-SETUP.md | 1,975 | **1,975** |
| 47 | Token Quick Reference.md | 1,665 | **1,665** |
| 48 | avatar-components.md | 1,133 | **1,133** |
| 49 | data-display-components.md | 1,131 | **1,131** |
| 50 | badge-components.md | 1,130 | **1,130** |
| 51 | modal-components.md | 1,226 | **1,226** |
| 52 | navigation-components.md | 1,112 | **1,112** |
| 53 | loading-components.md | 1,067 | **1,067** |
| 54 | divider-components.md | 1,002 | **1,002** |
| 55 | Technology Stack.md | 762 | **762** |

**Subtotal**: 21,732 tokens

**Tier 2 Total**: 242,555 tokens | Combined Impact: **242,555**

---

## Impact Score Summary

| Tier | Doc Count | Total Tokens | Combined Impact | % of Total Impact |
|------|-----------|--------------|-----------------|-------------------|
| Always-Loaded | 6 | 39,124 | 391,240 | **61.7%** |
| On-Demand | 49 | 242,555 | 242,555 | **38.3%** |
| **TOTAL** | **55** | **281,679** | **633,795** | **100%** |

**Key Insight**: Always-loaded documents represent only 13.9% of total tokens but **61.7% of total impact** due to the 10× multiplier.

---

## Optimization Recommendations

### Priority 1: Always-Loaded Documents (Highest ROI)

**Target**: Reduce session start load from 39,124 tokens

| Document | Tokens | Optimization Potential |
|----------|--------|----------------------|
| File Organization Standards.md | 16,680 | **HIGH** - Contains extensive conditional sections that could be extracted |
| Development Workflow.md | 16,093 | **HIGH** - Contains extensive conditional sections (troubleshooting, hook details) |
| 00-Steering Documentation Directional Priorities.md | 3,711 | **MEDIUM** - Meta-guide, could potentially be streamlined |
| Start Up Tasks.md | 1,459 | **LOW** - Already concise, essential checklist |
| Personal Note.md | 624 | **NONE** - Personal document, should not be modified |
| Core Goals.md | 557 | **LOW** - Already concise, foundational |

**Recommended Actions**:
1. **Split File Organization Standards**: Extract conditional sections to on-demand document
2. **Split Development Workflow**: Extract troubleshooting and hook details to on-demand document
3. **Review meta-guide**: Identify any content that could be moved to on-demand

**Potential Savings**: If 50% of File Organization + Development Workflow content moved to on-demand:
- Current: 32,773 tokens (always loaded)
- Target: ~16,400 tokens (always loaded)
- Impact reduction: ~163,730 (from 327,730 to ~164,000)

### Priority 2: Large On-Demand Documents

For on-demand docs, optimization is about **reducing size** so they consume less context when loaded.

| Document | Tokens | Optimization Potential |
|----------|--------|----------------------|
| Spec Planning Standards.md | 27,135 | **HIGH** - Largest on-demand doc, may have redundant content |
| Test Development Standards.md | 16,485 | **MEDIUM** - Large but specialized |
| Test Failure Audit Methodology.md | 14,845 | **MEDIUM** - Large but specialized |

### Priority 3: No Action Needed

Small on-demand documents (under 3,000 tokens) are already efficient. No optimization needed.

---

## Key Findings

### Finding 1: Always-Loaded Docs Are the Primary Target

6 documents (13.9% of total) account for **61.7% of total impact**. Optimizing these has 10× the ROI of optimizing on-demand docs.

### Finding 2: Two Documents Dominate

File Organization Standards + Development Workflow = **83.7% of session start load** and **51.7% of total impact**.

### Finding 3: On-Demand Loading is Working

49 documents (86.1% of total) are on-demand, meaning they only consume context when actually needed. This is the correct architecture.

### Finding 4: Manual vs Conditional is About Reliability, Not Cost

Both manual and conditional are on-demand mechanisms with the same token cost. The choice between them is about:
- **Manual**: More precise (agent queries exactly what it needs)
- **Conditional**: More reliable (agent automatically gets relevant guidance)

Neither is inherently cheaper.

---

## Optimization Priority Matrix

| Priority | Action | Documents | Impact Reduction | Effort | ROI |
|----------|--------|-----------|------------------|--------|-----|
| **P1** | Split always-loaded docs | File Organization, Development Workflow | ~163,730 | Medium | **Highest** |
| **P2** | Streamline meta-guide | 00-Steering Documentation Directional Priorities | ~18,555 | Low | High |
| **P3** | Reduce large on-demand docs | Spec Planning Standards | ~13,500 | Medium | Medium |
| **P4** | Review testing redundancy | Test Development, Test Failure Audit | ~15,665 | Low | Medium |
| **P5** | No action | Small on-demand docs | N/A | N/A | N/A |

---

## Notes

- Impact scores use simplified model: Always=10×, On-Demand=1×
- Manual and conditional treated identically (both are on-demand)
- Primary optimization target: Always-loaded documents
- On-demand architecture is working correctly - no structural changes needed

