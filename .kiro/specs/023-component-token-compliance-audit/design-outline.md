# Spec 023: Component Token Compliance Audit - Design Outline

**Date**: December 17, 2025
**Status**: Design Planning
**Supersedes**: Spec 017 Tasks 11, 13-15 (incomplete/redundant work)

---

## Background & Motivation

### Why This Spec Exists

Spec 017 (Component Code Quality Sweep) accomplished significant cleanup work (Tasks 1-10, 12), but the remaining tasks (11, 13-15) suffered from:

1. **Scope creep**: Spec 017 absorbed Spec 019, creating a Frankenstein of mixed concerns
2. **Stale assumptions**: Tasks written based on assumptions that proved incorrect during execution
3. **Redundant work**: Task 11.1 proposed creating "Touch Target tokens" when `TapAreaTokens.ts` already exists
4. **Missing confirmation step**: No human checkpoint between audit findings and implementation

### Lessons Learned from Spec 017

- Audit findings are not automatically action items
- Platform implementations may have intentional differences vs. bugs
- Some "violations" reveal token system gaps, not component issues
- Human confirmation prevents wasted effort on incorrect assumptions

---

## Strategy: Three-Phase Approach

### Phase Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     PER COMPONENT                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. AUDIT (AI-driven, comprehensive)                            │
│     ├── Holistic Review (cross-platform)                        │
│     │   → Component spec issues                                 │
│     │   → Missing tokens                                        │
│     │   → Architectural decisions                               │
│     │   → Cross-platform consistency                            │
│     │                                                           │
│     ├── iOS Platform Audit                                      │
│     │   → Implementation-specific issues                        │
│     │                                                           │
│     ├── Android Platform Audit                                  │
│     │   → Implementation-specific issues                        │
│     │                                                           │
│     └── Web Platform Audit                                      │
│         → Implementation-specific issues                        │
│                                                                  │
│                         ↓                                        │
│                                                                  │
│  2. CONFIRMATION (Human-AI collaborative)                       │
│     ├── Review each finding                                     │
│     ├── Categorize:                                             │
│     │   • Accept - implement as recommended                     │
│     │   • Reject - intentional, document rationale              │
│     │   • Modify - different approach needed                    │
│     │   • Escalate - reveals token system gap                   │
│     └── Produce: Approved action items with rationale           │
│                                                                  │
│              ⚠️ HUMAN CHECKPOINT - NO AUTO-PROCEED              │
│                                                                  │
│                         ↓                                        │
│                                                                  │
│  3. IMPLEMENTATION (AI-driven with oversight)                   │
│     ├── Execute approved actions only                           │
│     ├── Create new tokens if approved                           │
│     ├── Update platform implementations                         │
│     ├── Update component README                                 │
│     └── Verify changes                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Three Levels of Issues

The audit must distinguish between these issue types:

### Level 1: Component Spec Issues (Holistic)

Issues that affect the component's design across all platforms:

- **Missing tokens**: Component needs tokens that don't exist yet
- **Architectural decisions**: e.g., "Should buttons have explicit heights?"
- **Cross-platform inconsistency**: iOS uses local constants, Android uses DesignTokens
- **API inconsistencies**: Different prop names or behaviors between platforms

**Example**: ButtonCTA needs `button.minWidth.small/medium/large` component tokens

### Level 2: Platform Implementation Issues

Issues specific to how a platform implements the component spec:

- **Hard-coded values**: Values that should reference existing tokens
- **Incorrect token usage**: Using wrong token for the context
- **Pattern violations**: Not following platform patterns (e.g., Rosetta on Android)
- **Local constants**: Duplicating token values instead of importing

**Example**: iOS ButtonCTA defines local `tapAreaMinimum = 44` instead of importing from DesignTokens

### Level 3: Platform-Specific Considerations (Intentional)

Differences that are correct and intentional:

- **Icon systems**: iOS uses SF Symbols, Android uses Material Icons
- **Token consumption**: Web uses CSS custom properties, native uses generated constants
- **Accessibility APIs**: Platform-specific reduced motion, Dynamic Type, etc.
- **Interaction patterns**: iOS scale transform, Android ripple effect

**Example**: iOS uses `@Environment(\.accessibilityReduceMotion)` - this is correct, not a violation

---

## Confirmation Categories

During the confirmation phase, each finding is categorized:

### Accept
The finding is valid and should be implemented as recommended.
```
Finding: iOS ButtonCTA uses local tapAreaMinimum constant
Decision: ACCEPT - Replace with DesignTokens.tapAreaMinimum import
```

### Reject
The finding identifies something intentional, not a bug.
```
Finding: iOS uses SF Symbols instead of Icon component
Decision: REJECT - Intentional platform-specific pattern, document rationale
```

### Modify
The finding is valid but the recommended fix is wrong.
```
Finding: Hard-coded height = 48 should be a token
Decision: MODIFY - Remove explicit height entirely; let padding + typography compose to target
```

### Escalate
The finding reveals a gap in the token system itself.
```
Finding: No token exists for button minimum widths
Decision: ESCALATE - Create button.minWidth.* component tokens before fixing implementations
```

---

## Components in Scope

Current core components (4 total):

| Component | Platforms | Complexity |
|-----------|-----------|------------|
| ButtonCTA | iOS, Android, Web | High - multiple size/style variants |
| TextInputField | iOS, Android, Web | High - complex state management |
| Icon | iOS, Android, Web | Medium - size variants, color handling |
| Container | iOS, Android, Web | Medium - layout/styling tokens |

---

## Task Structure Per Component

Each component follows this task pattern:

### Task N: [Component] Holistic Audit & Confirmation

**Type**: Parent (Audit + Confirmation)
**Validation**: Tier 3 - Comprehensive

**Subtasks**:
- N.1 Conduct holistic cross-platform review
- N.2 Audit iOS implementation
- N.3 Audit Android implementation  
- N.4 Audit Web implementation
- N.5 Compile findings report
- N.6 **CHECKPOINT**: Review findings with human, confirm actions

**Output**: Confirmed action items document

### Task N+1: [Component] Platform Implementation & Verification

**Type**: Parent (Implementation)
**Validation**: Tier 3 - Comprehensive

**Subtasks**:
- (N+1).1 Create new tokens (if escalated items approved)
- (N+1).2 Implement iOS approved changes
- (N+1).3 Implement Android approved changes
- (N+1).4 Implement Web approved changes
- (N+1).5 Update component README
- (N+1).6 Verify cross-platform consistency
- (N+1).7 Run tests

**Prerequisite**: Task N confirmation checkpoint completed

---

## Spec Structure Overview

```
Phase 1: ButtonCTA
├── Task 1: ButtonCTA Holistic Audit & Confirmation
└── Task 2: ButtonCTA Platform Implementation & Verification

Phase 2: TextInputField
├── Task 3: TextInputField Holistic Audit & Confirmation
└── Task 4: TextInputField Platform Implementation & Verification

Phase 3: Icon
├── Task 5: Icon Holistic Audit & Confirmation
└── Task 6: Icon Platform Implementation & Verification

Phase 4: Container
├── Task 7: Container Holistic Audit & Confirmation
└── Task 8: Container Platform Implementation & Verification

Phase 5: Final Verification
└── Task 9: Cross-Component Consistency Check & Spec Closure
```

---

## Success Criteria

### Per Component
- [ ] All three platforms audited
- [ ] Findings reviewed and categorized with human
- [ ] Only approved changes implemented
- [ ] Component README updated with accurate token consumption
- [ ] Tests pass

### Overall Spec
- [ ] All 4 components completed through full cycle
- [ ] No hard-coded values that should be tokens (per confirmed findings)
- [ ] Cross-platform consistency verified
- [ ] Token system gaps addressed (escalated items resolved)
- [ ] Spec 017 formally closed with reference to this spec

---

## Relationship to Spec 017

### Spec 017 Status
- **Tasks 1-10, 12**: ✅ Complete - valuable work accomplished
- **Task 11**: ❌ Superseded - redundant/confused (TapAreaTokens already exist)
- **Tasks 13-15**: ❌ Superseded - absorbed from Spec 019, partially stale

### Closure Plan
1. Complete Spec 023
2. Create Spec 017 closure document noting:
   - Tasks 1-10, 12 completed successfully
   - Tasks 11, 13-15 superseded by Spec 023
   - Lessons learned about spec scope management

---

## Resolved Design Decisions

### 1. Component Priority Order

**Decision**: Dependency-based ordering

```
Phase 1: Icon (dependency for ButtonCTA, TextInputField)
Phase 2: ButtonCTA (depends on Icon)
Phase 3: TextInputField (depends on Icon)
Phase 4: Container (standalone)
Phase 5: Component Development Guide Updates
Phase 6: Final Verification & Spec 017 Closure
```

**Rationale**: Icon is a dependency for other components. Fixing Icon first ensures downstream components can reference correct Icon token usage.

### 2. Component-Specific Tokens vs. Primitive Composition

**Decision**: Case-by-case, defaulting to component tokens with graduation path

**Approach**:
- When audit finds hard-coded values (e.g., `minWidth = 56`), default to creating component-specific tokens (e.g., `buttonCTA.minWidth.small`)
- Component tokens can graduate to semantic tokens if patterns emerge across multiple components
- Not every number needs to be a token - some values are intentional design decisions

**Rationale**: Component tokens provide flexibility for different interactive elements with different visual presentations but consistent accessibility. A small icon button might visually appear 32px but have a 44px tap area. Starting at component level lets us discover patterns before over-generalizing.

**Graduation Path**:
```
Component Token → Semantic Token (if patterns emerge) → Primitive Token (if mathematically foundational)
```

### 3. Component Development Guide Updates

**Decision**: Accumulate findings, update at end

**Approach**:
- Maintain a "Component Development Guide Opportunities" document throughout audit phases
- Each audit phase adds findings and improvement opportunities to this doc
- Dedicated parent task at end to synthesize and update the guide
- Updates must align with MCP documentation formatting requirements

**Rationale**: Avoids context-switching during audits while ensuring insights aren't lost. Batch update is more efficient than incremental changes.

### 4. Token System Gaps

**Decision**: Parallel work within same spec

**Approach**:
- If audit reveals "we need `buttonCTA.minWidth.*` tokens," create them as subtask before implementation subtasks
- Token creation and component implementation can proceed in parallel within the same spec
- Only create separate spec if it's a major token system overhaul

**Rationale**: Most token gaps will be small (a few component tokens). Keeping them in the same spec maintains context and reduces overhead.

---

## Updated Spec Structure

```
Phase 1: Icon
├── Task 1: Icon Holistic Audit & Confirmation
└── Task 2: Icon Platform Implementation & Verification

Phase 2: ButtonCTA
├── Task 3: ButtonCTA Holistic Audit & Confirmation
└── Task 4: ButtonCTA Platform Implementation & Verification

Phase 3: TextInputField
├── Task 5: TextInputField Holistic Audit & Confirmation
└── Task 6: TextInputField Platform Implementation & Verification

Phase 4: Container
├── Task 7: Container Holistic Audit & Confirmation
└── Task 8: Container Platform Implementation & Verification

Phase 5: Documentation
└── Task 9: Component Development Guide Updates

Phase 6: Closure
└── Task 10: Final Verification & Spec 017 Closure
```

---

## Artifacts

### Running Documents (maintained throughout spec)
- `findings/component-dev-guide-opportunities.md` - Accumulated findings for guide updates
- `findings/[component]-audit-findings.md` - Per-component audit results
- `findings/[component]-confirmed-actions.md` - Per-component approved action items

### Final Artifacts
- Updated component implementations (iOS, Android, Web)
- Updated component READMEs
- New component tokens (if created)
- Updated Component Development Guide
- Spec 017 closure document

---

*Design decisions finalized December 17, 2025. Ready for requirements document development.*
