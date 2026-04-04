# Release Analysis: Inaccurate Change Classification and Generic Summary Docs

**Date**: 2026-04-03
**Severity**: Medium
**Agent**: Thurgood
**Found by**: Peter (v11.0.0 release analysis)

## Problem

The release analysis tool (`npm run release:analyze`) produced output that didn't reflect the actual scope of work since v10.1.0. It reported "6 changes: 1 breaking, 5 context" for a release that included a new component (Progress-Bar-Base), iOS/Android fixes across 10+ component families, a new sizing token family, native implementation modernization, and an Application MCP tool addition.

Two root causes:

### 1. ChangeClassifier Uses Coarse Keyword Heuristics

`src/tools/release/pipeline/ChangeClassifier.ts` classifies changes by scanning for keywords in task titles and "What Was Done" text. The keyword rules are too broad:

- Any mention of "token" → `breaking` / "Token"
- Any mention of "component" → `breaking` / "Component"  
- Any mention of "documentation" → `context` / "Documentation"

This collapses distinct work into generic buckets. The "Component Token Migration" summary (Spec 092 Task 2) hit "token" and became the sole breaking change. The iOS easing modernization, Android ripple fixes, and Progress-Bar creation all fell through to "Documentation" or "Other."

The classifier does support structured `## Deliverables` sections with explicit priority markers (🔴/🟡/🔵), but falls back to keywords when summaries don't include them.

### 2. Parent Task Summary Titles Are Too Generic

The summary docs that feed the release tool are parent task summaries. Parent tasks tend to be documentation/verification wrap-ups, so their titles are generic:

- "Documentation and Verification" (Spec 093)
- "Readiness Updates and Verification" (Spec 091)
- "Documentation and Integration" (Spec 090)

The substantive work (iOS easing modernization, Android ripple fixes, component creation) happened in subtasks that don't produce summary docs per the two-document workflow.

## Evidence

```
Recommended version: 11.0.0
Bump type:           major
Confidence:          70%

Changes (6):
  🔴 Component Token Migration (Token)
  🔵 Documentation and Verification (Documentation)
  🔵 Readiness Updates and Verification (Other)
  🔵 Documentation and Integration (Documentation)
  🔵 Sizing Documentation (Documentation)
  🔵 Sizing Primitives and Pipeline (Other)
```

Actual work since v10.1.0 (74 commits) included:
- New Progress-Bar-Base component (web, iOS, Android) with behavioral contracts
- iOS/Android fixes across Container, Button, Icon, Chip, Badge, FormInput, Avatar, Navigation, ProgressIndicator families
- size900 token creation + sizing token family documentation
- Component token migration (sizing tokens across 6+ components)
- iOS easing modernization (spring animations replacing cubic bezier)
- Android modernization (Ripple vs Blend documentation)
- Application MCP rebuild_index tool
- Schema readiness flag updates across 31 components

## Fix

### Classifier Improvement (Option A)

Enhance `ChangeClassifier.classifyByKeywords` to look deeper into summary doc content — specifically the "Key Changes" and "Impact" sections — rather than relying primarily on titles. Consider:

1. Weight "Key Changes" list items more heavily than titles for classification
2. Detect platform-specific work (iOS, Android, web) as distinct change types
3. Distinguish new component creation from component maintenance
4. Recognize MCP/tooling changes as their own category

Alternatively, encourage or require the structured `## Deliverables` format in summaries, since the classifier already handles those well.

### Summary Doc Guidance (Option B)

Update completion documentation standards so parent task summaries better reflect the full scope of their subtasks' work:

1. Parent task summary titles should describe the spec's overall deliverable, not just the parent task's wrap-up activity
2. The "What Was Done" section should summarize all subtask work, not just the parent task
3. Consider requiring the `## Deliverables` section with explicit priority markers, since the classifier handles these accurately

Both fixes are complementary — better summaries AND a smarter classifier would produce the most accurate release analysis.

## Priority

Before next release. The current output is misleading enough that manual review of commit history is needed to produce accurate release notes.
