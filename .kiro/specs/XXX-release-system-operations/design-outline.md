# Release System Operations

**Date**: 2026-01-18
**Purpose**: Audit, document, and operationalize the release management system
**Organization**: spec-guide
**Scope**: XXX-release-system-operations
**Status**: Draft - Ready for spec development

---

## Problem Statement

The release system has sophisticated TypeScript infrastructure (~30+ files across 12 subsystems) but:

1. **TypeScript integration is disabled** — The shell hook explicitly disables it due to "architectural issues" (WorkflowMonitor timer hangs)
2. **No operational runbook** — Nobody knows how to actually publish a release
3. **State accumulation** — 27,000+ state files accumulated because cleanup code exists but is never called
4. **Unclear what works** — Extensive code, unclear what's production-ready vs. aspirational

### Evidence

From `release-manager.sh`:
```bash
# NOTE: TypeScript release system integration disabled due to architectural issues
# The WorkflowMonitor creates multiple unclearable setInterval timers causing hangs
log "Trigger queued for manual processing (TypeScript integration disabled)"
```

From `WorkflowStateManager.ts`:
```typescript
// cleanupOldStates() method exists but is never called
async cleanupOldStates(olderThan: Date): Promise<number> { ... }
```

---

## Current State Assessment

### What Exists (Infrastructure)

| Subsystem | Files | Purpose | Status |
|-----------|-------|---------|--------|
| `orchestration/` | 5 | Pipeline, state, recovery | Unknown |
| `automation/` | 4 | Changelog, git, package updates | Unknown |
| `publishing/` | 3 | GitHub, npm publishing | Unknown |
| `detection/` | 3 | Completion analysis | Partially used |
| `coordination/` | 5 | Multi-package versioning | Unknown |
| `validation/` | 5 | Release readiness checks | Unknown |
| `integration/` | 10 | Hook/CLI bridges | Partially used |
| `cli/` | 2 | Command-line interface | Unknown |
| `config/` | 4 | Configuration management | Used |
| `ai/` | 2 | AI collaboration interface | Unknown |

### What's Actually Used

1. **`release-manager.sh`** — Shell hook that creates trigger files
2. **`release-config.json`** — Configuration (detection enabled)
3. **`AnalysisStateManager`** — Tracks analyzed completion docs
4. **Trigger file creation** — Works, but nothing processes them

### What's Broken/Disabled

1. **TypeScript workflow execution** — Disabled due to timer issues
2. **State cleanup** — Code exists, never called
3. **Actual release publishing** — No evidence it's ever been used

### What Was Fixed (2026-01-18)

1. **State file accumulation** — Cleaned up 27,029 state files in `.kiro/release-state/` and 368 trigger files in `.kiro/release-triggers/`
2. **Display bug in summary report** — Fixed `convertOrchestratorResult()` in `AdvancedReleaseCLI.ts` which was doing a simple type cast instead of properly converting `ReleaseAnalysisResult` to `AnalysisResult`
3. **Analysis state corruption** — Running `--reset` flag now properly forces full re-scan and finds all documents

### Current Working State (Verified 2026-01-18)

Running `npm run release:analyze -- --reset` now:
- ✅ Detects all 322 summary documents
- ✅ Analyzes 273 unique documents (after deduplication)
- ✅ Shows summary report without crashing
- ✅ Recommends version bump (4.2.0 → 5.0.0 based on 20 major, 21 minor, 232 patch changes)
- ⚠️ Takes ~12 seconds (target: <5 seconds) — performance warning but functional

---

## Proposed Approach

### Phase 1: Audit & Document (Discovery)

**Goal**: Understand what works, what's broken, what's over-engineered

Tasks:
1. Run the TypeScript release system in isolation to identify specific failures
2. Document which components are production-ready vs. aspirational
3. Create decision matrix: keep / fix / remove for each subsystem

### Phase 2: Operational Runbook (Documentation)

**Goal**: Document how to actually publish a release today

Tasks:
1. Document current manual release process (if any exists)
2. Create step-by-step runbook for publishing
3. Document what automation assists vs. what's manual

### Phase 3: Essential Fixes (Minimal Automation)

**Goal**: Fix obvious operational issues without over-engineering

Tasks:
1. **State cleanup**: Wire up existing `cleanupOldStates()` method
2. **Status command**: Fix `release-manager.sh status` to not list 27K files
3. **Trigger processing**: Either fix TypeScript integration or remove dead code

### Phase 4: Simplification Decision (Optional)

**Goal**: Decide whether to fix or remove unused infrastructure

Options:
- **Option A**: Fix TypeScript integration (WorkflowMonitor timer issue)
- **Option B**: Remove unused TypeScript code, keep shell-based workflow
- **Option C**: Hybrid — keep useful parts, remove over-engineering

---

## Key Questions to Answer

1. **Has a release ever been published using this system?** (Check git tags, GitHub releases)
2. **What's the actual timer issue in WorkflowMonitor?** (Investigate, may be simple fix)
3. **Is multi-package coordination needed?** (Config references 3 packages that may not exist)
4. **What's the minimum viable release process?** (May be simpler than current infrastructure)

---

## Files to Investigate

### High Priority
- `src/release/orchestration/WorkflowStateManager.ts` — State management, has cleanup
- `src/release/integration/WorkflowPreservation.ts` — References timer issues
- `.kiro/hooks/release-manager.sh` — Current entry point

### Medium Priority  
- `src/release/ReleaseManager.ts` — Main orchestrator (500+ lines)
- `src/release/cli/ReleaseCLI.ts` — CLI interface
- `src/release/detection/ReleaseDetector.ts` — Trigger detection

### Low Priority (Likely Over-Engineered)
- `src/release/ai/` — AI collaboration interface
- `src/release/coordination/` — Multi-package coordination
- `src/release/publishing/` — GitHub/npm publishers (may never have been used)

---

## Fixes Applied (2026-01-18)

### Fix 1: State File Cleanup

**Problem**: 27,029 state files accumulated in `.kiro/release-state/` and 368 trigger files in `.kiro/release-triggers/`, causing context overflow when AI agents investigated the release system.

**Root Cause**: `cleanupOldStates()` method in `WorkflowStateManager.ts` exists but is never called.

**Fix Applied**: Manual cleanup using:
```bash
find .kiro/release-state -type f -name "*.json" ! -name "analysis-state.json" ! -name "workflow-state.json" | xargs rm -f
find .kiro/release-triggers -type f -name "*.json" | xargs rm -f
```

**Permanent Fix Needed**: Wire up `cleanupOldStates()` to be called automatically.

### Fix 2: Display Bug in Summary Report

**Problem**: `npm run release:analyze -- --reset` crashed with `TypeError: Cannot read properties of undefined (reading 'currentVersion')` at line 1350.

**Root Cause**: `convertOrchestratorResult()` method in `AdvancedReleaseCLI.ts` was doing a simple type cast (`as AnalysisResult`) without actually converting the data structure.

**Technical Details**:
- `ReleaseAnalysisOrchestrator.analyzeFullReset()` returns `ReleaseAnalysisResult` with `results[]`, `performanceMetrics`, `metadata`
- `showSummaryReport()` expects `AnalysisResult` with `versionRecommendation`, `changes`, `scope`, etc.
- The type cast didn't transform the data, so `versionRecommendation` was undefined

**Fix Applied**: Rewrote `convertOrchestratorResult()` to properly build `AnalysisResult` from orchestrator output:
- Added `ChangeEvidence` to imports
- Made method async
- Built proper `AnalysisResult` structure with:
  - `scope` from metadata
  - `changes` from results array (categorized by impact level)
  - `versionRecommendation` calculated from highest impact
  - `releaseNotes` generated from results
  - `confidence` metrics

**File Modified**: `src/release-analysis/cli/AdvancedReleaseCLI.ts` (lines ~250-370)

---

## Success Criteria

1. **Runbook exists**: Clear documentation of how to publish a release
2. **Status works**: `release-manager.sh status` completes in <5 seconds
3. **Cleanup automated**: State files don't accumulate indefinitely
4. **Clear ownership**: Decision made on what to keep vs. remove
5. **No context overflow**: AI agents can investigate release system without hitting limits

---

## Risk Assessment

**Scope Creep Risk**: HIGH
- The release system is large and complex
- Easy to get lost in "fixing everything"
- Mitigation: Phase 1 audit must produce clear keep/fix/remove decisions before Phase 3

**Breaking Changes Risk**: LOW
- TypeScript integration already disabled
- Shell hook is the only active component
- Cleanup changes are additive

---

## Counter-Arguments to Consider

1. **"Just delete it all"** — The infrastructure may have value we don't see yet. Audit first.
2. **"Fix the TypeScript integration"** — May be a rabbit hole. Understand the issue before committing.
3. **"This is over-scoped"** — Fair. Could split into: (a) Runbook spec, (b) Cleanup spec, (c) Architecture decision spec.

---

## Related Documentation

- `.kiro/steering/Release Management System.md` — Steering doc (may be outdated)
- `src/release/integration/INTEGRATION_USAGE.md` — Integration guide
- `.kiro/release-config.json` — Current configuration

---

*This design outline captures findings from investigating context overflow caused by release system state accumulation. The broader scope addresses the root cause: an under-documented, partially-disabled release system that needs operational clarity.*
