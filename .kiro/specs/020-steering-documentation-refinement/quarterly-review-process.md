# Quarterly Review Process for Steering Documentation Metadata

**Date**: December 15, 2025
**Purpose**: Document the quarterly review process for maintaining steering documentation metadata accuracy
**Organization**: spec-guide
**Scope**: 020-steering-documentation-refinement

---

## Overview

This document defines the quarterly review process for maintaining steering documentation metadata. The process ensures that task-relevant metadata, layer assignments, and "Last Reviewed" dates remain accurate as the project evolves.

**Frequency**: Quarterly (every 3 months)

**Purpose**: Verify metadata accuracy and update as needed to maintain trust in the steering documentation system

---

## Review Process Steps

### Step 1: Run Staleness Detection

**Action**: Execute the staleness detection script to identify documents needing review

```bash
node scripts/detect-stale-metadata.js
```

**Output**: Staleness report showing:
- Documents > 6 months old (warning)
- Documents > 12 months old (error)
- Age of each document's metadata

**Decision Point**: Prioritize documents flagged as errors (> 12 months) first, then warnings (> 6 months)

---

### Step 2: Review Flagged Documents

**Action**: For each flagged document, review metadata header (first 30 lines only)

**What to Check**:
1. **Layer Assignment**: Is the document still in the correct layer?
2. **Task Type Assignments**: Are the relevant task types still accurate?
3. **Inclusion Strategy**: Should the document still be always-loaded or conditional?
4. **Trigger Conditions**: Are the conditional loading triggers still appropriate?
5. **Purpose Statement**: Does the purpose still accurately describe the document?

**How to Review**:
```bash
# Read just the metadata header (first 30 lines)
head -30 ".kiro/steering/[document-name].md"
```

**Avoid**: Reading the full document content - focus only on metadata accuracy

---

### Step 3: Determine Update Type

**Decision Framework**: Decide whether to update metadata only or both metadata and content

#### Update Metadata Only

**When**: Metadata is incorrect but document content is still accurate

**Examples**:
- Layer assignment changed (document moved to different layer)
- Task type assignments changed (new task types added to vocabulary)
- Inclusion strategy changed (always → conditional or vice versa)
- Purpose statement needs clarification

**Action**: Update metadata fields only, update "Last Reviewed" date

#### Update Both Metadata and Content

**When**: Document content is outdated or incorrect

**Examples**:
- Process has changed (workflow steps updated)
- New features added (additional guidance needed)
- Deprecated features removed (guidance no longer relevant)
- Cross-references broken (links need updating)

**Action**: Update content first, then update metadata and "Last Reviewed" date

#### No Update Needed

**When**: Metadata and content are both accurate

**Action**: Update "Last Reviewed" date only to indicate review was conducted

---

### Step 4: Update Metadata

**Action**: Update metadata fields as determined in Step 3

#### Metadata Update Examples

**Example 1: Layer Reassignment**

**Before**:
```markdown
**Layer**: 2
**Relevant Tasks**: all-tasks
```

**After**:
```markdown
**Layer**: 3
**Relevant Tasks**: coding, debugging
```

**Rationale**: Document became more specialized, moved from framework (Layer 2) to specific implementation (Layer 3)

---

**Example 2: Task Type Addition**

**Before**:
```markdown
**Relevant Tasks**: coding
```

**After**:
```markdown
**Relevant Tasks**: coding, accessibility-development
```

**Rationale**: Document now includes accessibility guidance, relevant to accessibility-development tasks

---

**Example 3: Inclusion Strategy Change**

**Before**:
```markdown
**Relevant Tasks**: all-tasks
---
inclusion: always
---
```

**After**:
```markdown
**Relevant Tasks**: debugging, validation
---
inclusion: conditional
trigger: debugging, validation
---
```

**Rationale**: Document content became specialized, no longer relevant to all tasks

---

**Example 4: Purpose Clarification**

**Before**:
```markdown
**Purpose**: Build system documentation
```

**After**:
```markdown
**Purpose**: Build system configuration and troubleshooting for TypeScript compilation
```

**Rationale**: Purpose statement was too vague, clarified to indicate specific focus

---

### Step 5: Update "Last Reviewed" Date

**Action**: Update the "Last Reviewed" date to current date for all reviewed documents

**Format**: ISO 8601 date format (YYYY-MM-DD)

**Example**:
```markdown
**Last Reviewed**: 2025-12-15
```

**When to Update**:
- ✅ After reviewing metadata (even if no changes needed)
- ✅ After updating metadata fields
- ✅ After updating document content
- ❌ Do NOT update if document was not reviewed

**Rationale**: "Last Reviewed" date indicates when metadata accuracy was last verified, not when content was last changed

---

### Step 6: Run Validation

**Action**: Run metadata validation script to verify all updates are correct

```bash
node scripts/validate-steering-metadata.js
```

**What to Check**:
- ✅ All required fields present
- ✅ Task type names match standardized vocabulary
- ✅ Layer numbers valid (0-3)
- ✅ Date formats valid (ISO 8601)
- ✅ No validation errors

**If Validation Fails**: Fix errors and re-run validation until all documents pass

---

## Validation Checklist

Use this checklist to ensure quarterly review is complete:

### Pre-Review
- [ ] Staleness detection script executed
- [ ] Staleness report reviewed
- [ ] Documents prioritized (errors first, then warnings)

### During Review (Per Document)
- [ ] Metadata header reviewed (first 30 lines only)
- [ ] Layer assignment verified
- [ ] Task type assignments verified
- [ ] Inclusion strategy verified
- [ ] Trigger conditions verified (if conditional)
- [ ] Purpose statement verified
- [ ] Update type determined (metadata only, both, or none)

### Post-Review (Per Document)
- [ ] Metadata updated (if needed)
- [ ] Content updated (if needed)
- [ ] "Last Reviewed" date updated to current date
- [ ] Changes documented (if significant)

### Final Validation
- [ ] Metadata validation script executed
- [ ] All validation errors fixed
- [ ] All documents pass validation
- [ ] Review completion documented

---

## When to Update Metadata vs Content

### Update Metadata Only

**Indicators**:
- Document content is accurate and current
- Metadata fields are incorrect or outdated
- Layer assignment changed due to reorganization
- Task type vocabulary expanded (new types added)
- Inclusion strategy changed due to usage patterns

**Process**:
1. Update metadata fields
2. Update "Last Reviewed" date
3. Run validation
4. Document changes (if significant)

---

### Update Both Metadata and Content

**Indicators**:
- Document content is outdated or incorrect
- Process described has changed
- New features or guidance needed
- Deprecated features need removal
- Cross-references broken or outdated

**Process**:
1. Update document content first
2. Update metadata fields (if needed)
3. Update "Last Reviewed" date
4. Run validation
5. Document changes (if significant)
6. Consider creating completion document for major updates

---

### No Update Needed

**Indicators**:
- Metadata is accurate
- Content is current
- No changes to process or guidance
- Cross-references still valid

**Process**:
1. Update "Last Reviewed" date only
2. Document that review was conducted (no changes needed)

---

## Common Metadata Update Scenarios

### Scenario 1: New Task Type Added to Vocabulary

**Situation**: Standardized task vocabulary expanded with new task type

**Example**: "performance-optimization" added to vocabulary

**Action**:
1. Review all documents for relevance to new task type
2. Add new task type to "Relevant Tasks" where appropriate
3. Update "Last Reviewed" date
4. Run validation

**Metadata Change**:
```markdown
# Before
**Relevant Tasks**: coding, debugging

# After
**Relevant Tasks**: coding, debugging, performance-optimization
```

---

### Scenario 2: Document Specialization

**Situation**: Document content became more specialized over time

**Example**: General development guide became component-specific

**Action**:
1. Reassign to more specific layer (Layer 2 → Layer 3)
2. Update task type assignments to reflect specialization
3. Change inclusion strategy (always → conditional)
4. Update "Last Reviewed" date
5. Run validation

**Metadata Change**:
```markdown
# Before
**Layer**: 2
**Relevant Tasks**: all-tasks
---
inclusion: always
---

# After
**Layer**: 3
**Relevant Tasks**: coding, accessibility-development
---
inclusion: conditional
trigger: coding, accessibility-development
---
```

---

### Scenario 3: Document Generalization

**Situation**: Document content became more general and foundational

**Example**: Specific implementation guide became framework pattern

**Action**:
1. Reassign to more general layer (Layer 3 → Layer 2)
2. Update task type assignments to reflect broader applicability
3. Change inclusion strategy (conditional → always)
4. Update "Last Reviewed" date
5. Run validation

**Metadata Change**:
```markdown
# Before
**Layer**: 3
**Relevant Tasks**: coding
---
inclusion: conditional
trigger: coding
---

# After
**Layer**: 2
**Relevant Tasks**: all-tasks
---
inclusion: always
---
```

---

### Scenario 4: Purpose Clarification

**Situation**: Purpose statement is vague or outdated

**Example**: "Build system documentation" → "Build system configuration and troubleshooting"

**Action**:
1. Update purpose statement to be more specific
2. Update "Last Reviewed" date
3. Run validation

**Metadata Change**:
```markdown
# Before
**Purpose**: Build system documentation

# After
**Purpose**: Build system configuration and troubleshooting for TypeScript compilation
```

---

### Scenario 5: Conditional Trigger Update

**Situation**: Conditional loading triggers need refinement

**Example**: Document relevant to more task types than originally specified

**Action**:
1. Update trigger conditions to include additional task types
2. Update "Relevant Tasks" to match triggers
3. Update "Last Reviewed" date
4. Run validation

**Metadata Change**:
```markdown
# Before
**Relevant Tasks**: debugging
---
inclusion: conditional
trigger: debugging
---

# After
**Relevant Tasks**: debugging, validation
---
inclusion: conditional
trigger: debugging, validation
---
```

---

## Documentation of Review Results

### Review Summary Template

Create a review summary document after each quarterly review:

```markdown
# Quarterly Review Summary - [Quarter] [Year]

**Date**: [Review Date]
**Reviewer**: [Name]
**Documents Reviewed**: [Count]

## Summary

- **Total Documents**: [Count]
- **Documents Flagged**: [Count]
- **Metadata Updated**: [Count]
- **Content Updated**: [Count]
- **No Changes Needed**: [Count]

## Significant Changes

### [Document Name]
- **Change Type**: [Metadata Only / Both / None]
- **Changes Made**: [Description]
- **Rationale**: [Why changes were needed]

[Repeat for each significant change]

## Validation Results

- ✅ All documents pass validation
- ✅ All "Last Reviewed" dates updated
- ✅ No validation errors

## Next Review

**Scheduled Date**: [Date 3 months from now]
```

---

## Best Practices

### Do's

✅ **Review metadata headers only** (first 30 lines) - avoid reading full documents
✅ **Use artifacts** (metadata-analysis.md, staleness report) for context
✅ **Update "Last Reviewed" date** for all reviewed documents (even if no changes)
✅ **Run validation** after all updates to catch errors
✅ **Document significant changes** for future reference
✅ **Prioritize errors** (> 12 months) before warnings (> 6 months)

### Don'ts

❌ **Don't read full documents** - focus on metadata accuracy only
❌ **Don't skip validation** - always verify updates are correct
❌ **Don't update "Last Reviewed" date** without actually reviewing
❌ **Don't change metadata** without understanding rationale
❌ **Don't ignore warnings** - address them before they become errors

---

## Troubleshooting

### Issue: Validation Fails After Updates

**Symptom**: Metadata validation script reports errors

**Solution**:
1. Review error messages for specific issues
2. Check task type names against standardized vocabulary
3. Verify layer numbers are 0-3
4. Verify date formats are ISO 8601 (YYYY-MM-DD)
5. Fix errors and re-run validation

---

### Issue: Unclear Whether to Update Metadata or Content

**Symptom**: Uncertain whether document needs content updates

**Solution**:
1. Review document purpose statement
2. Check if content matches purpose
3. If content matches purpose but metadata doesn't, update metadata only
4. If content doesn't match purpose, update both
5. When in doubt, consult with team or document maintainer

---

### Issue: Many Documents Flagged as Stale

**Symptom**: Large number of documents > 6 months old

**Solution**:
1. Prioritize errors (> 12 months) first
2. Batch review similar documents together
3. Consider if review frequency should increase
4. Document patterns in staleness (e.g., Layer 3 docs age faster)
5. Adjust review schedule if needed

---

## Related Documentation

- **Staleness Detection Script**: `scripts/detect-stale-metadata.js`
- **Metadata Validation Script**: `scripts/validate-steering-metadata.js`
- **Metadata Template**: `.kiro/specs/020-steering-documentation-refinement/metadata-template.md`
- **Metadata Analysis**: `.kiro/specs/020-steering-documentation-refinement/metadata-analysis.md`

---

**Organization**: spec-guide
**Scope**: 020-steering-documentation-refinement
