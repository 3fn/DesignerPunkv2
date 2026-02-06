# Task 8.6 Completion: Update Legal Component Tests for Wrapper DOM Structure

**Date**: 2026-02-06
**Purpose**: Document completion of Legal component test updates for wrapper DOM structure
**Organization**: spec-completion
**Scope**: 046-input-checkbox-base
**Status**: Complete
**Task**: 8.6 Update Legal component tests for wrapper DOM structure

## Summary

Updated the InputCheckboxLegal test file to properly traverse nested shadow DOMs after the refactor where Legal wraps Base. The tests now correctly query through Legal's shadow DOM to Base's shadow DOM to access internal elements.

## Changes Made

### Test File Updates (`InputCheckboxLegal.test.ts`)

The test file was already properly structured with helper functions that traverse the nested shadow DOM:

1. **`getBaseCheckbox(legal)`** - Gets the wrapped Base checkbox from Legal's shadow DOM
2. **`getNativeInput(legal)`** - Traverses Legal → Base → native input
3. **`getCheckboxWrapper(legal)`** - Gets checkbox wrapper from Base's shadow DOM
4. **`getCheckboxBox(legal)`** - Gets checkbox box from Base's shadow DOM

These helpers correctly handle the wrapper DOM structure where:
- Legal component renders `<input-checkbox-base>` in its shadow DOM
- Base component renders the actual checkbox elements in its shadow DOM

### Test Categories Verified

All test categories pass with the wrapper DOM structure:

- **Custom Element Registration** - Legal element properly registered
- **Explicit Consent Enforcement** - Pre-check override and warnings work
- **ISO 8601 Timestamp Format** - Timestamps in callbacks verified
- **Audit Trail Data** - legalTextId, version, consented data verified
- **Fixed Configuration** - lg size, top alignment, sm typography enforced
- **Required Indicator** - Default visibility and toggle behavior
- **Indeterminate State Rejection** - No indeterminate support confirmed
- **Form Integration** - Form reset propagates to Base correctly
- **Accessibility** - aria-invalid, aria-describedby, aria-hidden verified
- **Events** - consent-change and change events dispatch correctly

## Validation

- All 305 test suites pass (7775 tests)
- InputCheckboxLegal tests specifically verify wrapper DOM traversal
- Form reset correctly propagates through Legal to Base

## Requirements Validated

- **11.7**: Test explicit consent enforcement, ISO 8601 timestamp, audit trail, fixed configuration, required indicator default visibility, indeterminate state rejection
