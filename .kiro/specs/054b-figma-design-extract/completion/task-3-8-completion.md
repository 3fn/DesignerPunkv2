# Task 3.8 Completion: Implement Behavioral Contract Detection

**Date**: February 20, 2026
**Spec**: 054b - Figma Design Extraction
**Task**: 3.8 Implement behavioral contract detection
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 054b-figma-design-extract

---

## Summary

Implemented `detectBehavioralContracts()` on the `DesignExtractor` class, along with two private helper methods (`classifyComponent` and `extractVisualStates`). The method classifies components as interactive or static using keyword heuristics, extracts known visual states, and returns a `BehavioralContractStatus` with appropriate confidence flags.

## Implementation Details

### Methods Added to DesignExtractor

1. **`detectBehavioralContracts(component: ExtractedComponent): BehavioralContractStatus`** — Public method that orchestrates classification, state extraction, and contract status generation.

2. **`classifyComponent(componentName: string): 'interactive' | 'static'`** — Private method that matches component names against keyword lists. Interactive keywords take precedence. Unknown components default to interactive (safer — forces review).

3. **`extractVisualStates(states: StateDefinition[]): string[]`** — Private method that filters component states against known interaction states (hover, focus, disabled, pressed, active, selected, error, loading).

### Keyword Lists

- **Interactive**: button, input, toggle, switch, checkbox, radio, select, dropdown, slider, tab, link, menu, dialog, modal, tooltip, popover, accordion
- **Static**: badge, divider, icon, avatar, label, tag, separator, spacer, image, logo, progress

### Design Decisions

- **Unknown components default to interactive**: Safer to require behavioral contract review than to skip it. Missing contracts on an interactive component is a higher-risk outcome than unnecessary review on a static one.
- **Interactive takes precedence**: If a component name matches both keyword lists (e.g., "ButtonBadgeCombo"), interactive classification wins for the same safety reason.
- **Interactive components always have `contractsDefined: false`**: Figma designs don't encode interaction behavior — only visual states. Actual behavioral contracts must be defined during spec review, so we always flag them as missing with ❌ confidence.

## Artifacts

- `src/figma/DesignExtractor.ts` — Added `detectBehavioralContracts`, `classifyComponent`, `extractVisualStates`, and keyword constants
- `src/figma/__tests__/DesignExtractor.detectBehavioralContracts.test.ts` — 35 tests covering all classification paths, state extraction, case insensitivity, precedence, and edge cases

## Test Results

All 35 tests pass. Full suite (347/348 suites pass; 1 pre-existing performance timeout unrelated to this change).

## Requirements Coverage

- **Req 6**: Behavioral Contract Detection — fully addressed
  - ✅ Interactive vs static classification via keyword heuristics
  - ✅ Visual state extraction from Figma component
  - ✅ Missing behavioral contracts flagged as ❌ for interactive components
  - ✅ Auto-generated "no interaction" contract for static components
