# Component Development Guide Opportunities - Refined

**Date**: December 19, 2025
**Spec**: 023 - Component Token Compliance Audit
**Status**: Task 9.REVIEW - Checkpoint Complete
**Purpose**: Refined opportunities list based on human-AI collaboration review

---

## Review Process

This document represents the consensus reached during Task 9.REVIEW checkpoint between Peter (human) and AI agent. The original opportunities document was reviewed, discussed, and refined to focus on:

1. **Enhanced collaboration practices** - Teaching AI agents when to pause and ask for clarification
2. **Strategic over tactical guidance** - Holistic patterns applicable to multiple use cases
3. **Tooling and process improvements** - Preventing issues through better systems
4. **MCP discoverability** - Surfacing existing guidance more effectively

---

## Key Insights from Review

### Root Cause Analysis

Many identified "documentation gaps" were actually:
- **Collaboration issues** - AI agents making assumptions instead of asking for clarification
- **Discoverability issues** - Guidance exists but wasn't found when needed
- **Tooling gaps** - Problems better solved with code generation than documentation
- **Process gaps** - Issues preventable through better design phase practices

### Strategic Approach

Rather than adding tactical guidance for each specific issue, we're focusing on:
- **Clear policies** that eliminate judgment calls
- **Collaboration patterns** that encourage pausing to ask questions
- **Tooling recommendations** that codify patterns in the build system
- **Strategic frameworks** that teach how to think about problems

---

## Approved Updates

### 1. Rename and Restructure Component Development Guide

**Action:** Rename to "Component Development and Practices Guide"

**Rationale:** Better signals to AI agents that this document covers both implementation guidance and collaboration practices.

**New Section: "Collaboration Practices and FAQs"**

#### When to Pause and Ask

AI agents should pause implementation and ask Peter for clarification when:

- **Token gaps:** "I need [semantic token] but it doesn't exist. Should I use [primitive token] as fallback, or should we create the semantic token first?"
- **Design ambiguity:** "Design doc specifies fixed heights but calculated sizing seems more appropriate. Which approach should I use?"
- **Platform idioms:** "Platform-native animation pattern conflicts with motion token usage. Should I prioritize platform UX or token compliance?"
- **Judgment calls:** "I'm about to make a judgment call about [decision]. Should I proceed or get clarification first?"

**Key Principle:** Pausing to ask is the correct behavior, not a failure. We lose more time correcting assumptive solutions than calling a timeout for clarity.

#### Clear Policies

**Icon Usage Policy:**
- Always use the Icon component when displaying icons
- Never reference icon assets directly
- Rationale: Ensures consistent sizing via icon.size tokens, proper accessibility attributes, platform-appropriate rendering, and centralized icon management

**Sizing Strategy Policy:**
- Default to calculated sizing (padding + content) unless explicitly told otherwise
- If design doc specifies fixed heights, clarify whether calculated heights would work better
- Document sizing strategy in component design docs

**Token Gap Policy:**
- When semantic tokens don't exist, pause and ask for guidance
- Never assume primitive tokens are acceptable fallbacks
- Document token gaps in design docs for tracking

**Placeholder Policy:**
- Never use placeholder implementations in production code
- Tooling will enforce this through TypeScript types and tests
- If placeholders are needed during development, pause and ask for guidance

---

### 2. Create New Steering Doc: "Cross-Platform vs Platform-Specific Decision Framework"

**Purpose:** Strategic guidance on when to use cross-platform patterns vs platform-specific idioms

**Location:** `.kiro/steering/Cross-Platform vs Platform-Specific Decision Framework.md`

**Organization:** `process-standard`

**Scope:** `cross-project`

**Content Structure:**

#### Overview
- Tension between cross-platform consistency and platform-appropriate UX
- When to prioritize each approach
- How to make informed decisions

#### Decision Framework

**When to Use Cross-Platform Patterns:**
- Core functionality that should work identically across platforms
- Token-based styling that maintains design system consistency
- Component APIs that need platform-agnostic interfaces
- Behavior that users expect to be consistent

**When to Use Platform-Specific Idioms:**
- Platform-native animations (iOS springs, Android ripples)
- Platform-specific interaction patterns (iOS swipe gestures, Android FABs)
- Accessibility features that leverage platform capabilities
- Performance optimizations that use platform-specific APIs

**Decision Criteria:**
- Does this affect user-facing behavior or just implementation?
- Is there a platform convention that users expect?
- Does the platform provide superior UX through native patterns?
- Can we maintain design system consistency while respecting platform idioms?

#### Motion Token Usage

**Strategic Guidance:**
- Motion tokens define timing, easing, and duration values
- Platform-native animations (scale transforms, ripples) may use hard-coded values when they provide superior UX
- Document rationale when choosing platform idioms over tokens

**When to Pause and Ask:**
- Unclear whether platform animation should use tokens or native values
- Motion token doesn't exist for the needed animation
- Platform idiom conflicts with design system consistency

#### Token Mapping Patterns

**Strategic Guidance:**
- Use platform-appropriate idioms for token consumption (CSS custom properties, Swift switch statements, Kotlin when expressions)
- Maintain cross-platform token equivalence (same token → same visual result)
- Document platform-specific mapping approaches in component READMEs

**Cross-References:**
- Link from Component Development and Practices Guide
- Reference from platform-specific implementation sections
- Consolidates existing cross-platform guidance from multiple docs

---

### 3. Create New Steering Doc: "Token Resolution Patterns"

**Purpose:** Strategic guidance on handling flexible token types with validation and type safety

**Location:** `.kiro/steering/Token Resolution Patterns.md`

**Organization:** `process-standard`

**Scope:** `cross-project`

**Content Structure:**

#### Overview
- Difference between fixed token types (enums) and flexible token types (strings)
- Challenges with string-based token references
- Validation and type safety strategies

#### Token Type Selection

**Fixed Token Types (Use TypeScript Enums/Unions):**
- Small, stable set of values (padding: '100' | '200' | '300' | 'none')
- Values unlikely to change frequently
- Component API benefits from limited choices
- Examples: padding, border, borderRadius, layering

**Flexible Token Types (Use String Types with Validation):**
- Large set of values (hundreds of color tokens)
- Values may expand as design system grows
- Component API needs flexibility
- Examples: color, shadow, opacity

#### Validation Strategies

**Type Generation (Recommended):**
- Auto-generate TypeScript types from token system
- Provides autocomplete and compile-time validation
- Example: `type ColorTokenName = 'color.primary' | 'color.secondary' | ...`

**Resolution Functions (Recommended):**
- Auto-generate token resolution functions
- Validates token names at runtime
- Provides fallback behavior for invalid tokens
- Example: `resolveColorToken(name: ColorTokenName): string`

**Build-Time Validation:**
- Fail build if components reference non-existent tokens
- Catch typos and invalid references early
- Prevents runtime errors

#### Implementation Patterns

**Component API Design:**
```typescript
// Fixed token type - use enum
type PaddingValue = '100' | '200' | '300' | 'none';

// Flexible token type - use generated type
type ColorTokenName = string; // Generated from token system

interface ContainerProps {
  padding?: PaddingValue;
  background?: ColorTokenName;
}
```

**Token Resolution:**
```typescript
// Auto-generated by build system
export function resolveColorToken(name: ColorTokenName): string {
  const tokens: Record<string, string> = {
    'color.primary': DesignTokens.color.primary,
    'color.secondary': DesignTokens.color.secondary,
    // ... all color tokens
  };
  
  if (!tokens[name]) {
    console.warn(`Invalid color token: ${name}`);
    return DesignTokens.color.primary; // fallback
  }
  
  return tokens[name];
}
```

#### Tooling Recommendations

**Build System Enhancements (Out of Scope for This Spec):**
1. Generate TypeScript types for flexible token types
2. Generate token resolution functions
3. Add build-time validation for token references
4. Add TypeScript guards against placeholder implementations

**When to Pause and Ask:**
- Unclear whether to use fixed or flexible token type
- Token resolution pattern doesn't exist for your use case
- Need to create new token type category

**Cross-References:**
- Link from Component Development and Practices Guide
- Reference from build system documentation
- Link from Container component implementation

---

### 4. Improve MCP Discoverability

**Action:** Enhance existing Component Development and Practices Guide for better MCP queries

**Section Heading Improvements:**

**Current (Topic-Oriented):**
- "Token Selection Decision Framework"
- "Platform-Specific Patterns"
- "Component Structure"

**Improved (Problem-Oriented):**
- "Token Selection Decision Framework" → Keep (already problem-oriented)
- "Platform-Specific Patterns" → "When to Use Platform-Specific vs Cross-Platform Patterns"
- Add: "What If Tokens Don't Exist?"
- Add: "What If Design Doc Is Unclear?"
- Add: "What If Platform Idioms Conflict with Tokens?"

**Decision Trees:**
- Add visual decision trees for common scenarios
- Help AI agents navigate judgment calls
- Example: "Should I use motion tokens or platform-native animations?"

**Cross-References:**
- Link to new "Cross-Platform vs Platform-Specific Decision Framework" steering doc
- Link to new "Token Resolution Patterns" steering doc
- Update references throughout documentation

---

## Implementation Priority

### High Priority (Must Do in Task 9.2)

1. **Rename Component Development Guide**
   - New name: "Component Development and Practices Guide"
   - Update all cross-references

2. **Add "Collaboration Practices and FAQs" Section**
   - When to pause and ask
   - Clear policies (Icon usage, sizing strategy, token gaps, placeholders)

3. **Create "Cross-Platform vs Platform-Specific Decision Framework"**
   - New steering doc
   - Strategic guidance on motion tokens and token mapping
   - Decision criteria and frameworks

4. **Create "Token Resolution Patterns"**
   - New steering doc
   - Strategic guidance on token type selection
   - Validation strategies and tooling recommendations

### Medium Priority (Should Do in Task 9.2)

5. **Improve Section Headings**
   - Make headings problem-oriented
   - Add "What If" sections

6. **Add Decision Trees**
   - Visual frameworks for common decisions
   - Help navigate judgment calls

7. **Update Cross-References**
   - Link to new steering docs
   - Consolidate scattered guidance

### Low Priority (Nice to Have)

8. **Add More Examples**
   - Only if strategic, not tactical
   - Focus on decision-making patterns

---

## Out of Scope (Future Work)

These improvements require separate specs and are not part of Task 9.2:

### Tooling Enhancements

1. **Generate TypeScript Types for Flexible Tokens**
   - Auto-generate `ColorTokenName`, `ShadowTokenName`, `OpacityTokenName`
   - Provide autocomplete and type safety

2. **Generate Token Resolution Functions**
   - Auto-generate validation and resolution functions
   - Eliminate placeholder implementations

3. **Add Build-Time Validation**
   - Fail build if components reference non-existent tokens
   - Validate semantic token completeness

4. **Add TypeScript Guards Against Placeholders**
   - Prevent placeholder implementations from compiling
   - Force completion of token resolution

### Process Improvements

1. **Component Design Template Updates**
   - Add required "Sizing Strategy" section
   - Add required "Motion Strategy" section
   - Add required "Token Gaps" section

2. **Design Phase Checkpoints**
   - Add token gap identification to design phase
   - Add platform idiom vs token compliance discussion
   - Add sizing strategy clarification

---

## Dropped Opportunities

These opportunities were reviewed and determined to be out of scope or not valuable:

### Icon Token Integration Pattern (Opportunity G1)
**Reason:** Too tactical, limited utility outside Icon component use case

### Cross-Platform Naming Convention Handling (Opportunity G2)
**Reason:** Already well-implemented in Icon component, no additional guidance needed

### Typography Token Naming for Animated States (TextInputField Opportunity 2)
**Reason:** Too specific, better handled through code comments in TextInputField

### Motion Token Easing Curves in Jetpack Compose (TextInputField Opportunity 3)
**Reason:** Platform-specific implementation detail, better handled through code comments

### Component-Specific Spacing Tokens (TextInputField Opportunity 4)
**Reason:** Too specific, covered by general token selection guidance

---

## Success Criteria

Task 9.2 implementation will be considered successful when:

1. ✅ Component Development Guide renamed to "Component Development and Practices Guide"
2. ✅ "Collaboration Practices and FAQs" section added with clear policies
3. ✅ "Cross-Platform vs Platform-Specific Decision Framework" steering doc created
4. ✅ "Token Resolution Patterns" steering doc created
5. ✅ Section headings improved for problem-oriented queries
6. ✅ Cross-references updated throughout documentation
7. ✅ MCP server can parse all updated documents (verified in Task 9.3)

---

## Validation (Task 9.3)

After implementing updates in Task 9.2, Task 9.3 will verify:

1. **MCP Server Parsing**
   - All updated documents parse correctly
   - Section headings are discoverable via MCP queries
   - Cross-references resolve correctly

2. **Cross-Reference Integrity**
   - All links to new steering docs work
   - All references from new docs to existing docs work
   - No broken links

3. **Documentation Quality**
   - Strategic guidance is clear and actionable
   - Decision frameworks are easy to follow
   - Policies are explicit and unambiguous

---

*Refined opportunities document approved on December 19, 2025. Ready for Task 9.2 implementation.*
