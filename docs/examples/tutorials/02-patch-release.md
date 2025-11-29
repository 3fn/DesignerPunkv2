# Tutorial: Patch Release (Bug Fix)

**Difficulty**: Beginner  
**Time**: 10 minutes  
**Prerequisites**: Completed [First Release](./01-first-release.md)

---

## Overview

Learn how to release a patch version (0.1.0 → 0.1.1) for bug fixes and minor improvements.

## When to Use Patch Releases

Use patch releases for:
- Bug fixes
- Security patches
- Documentation fixes
- Minor performance improvements
- No new features or breaking changes

## Step-by-Step Guide

### Step 1: Fix the Bug

Complete your bug fix implementation:

```bash
# Make your changes
# Test thoroughly
# Ensure all tests pass
npm test
```

### Step 2: Create Completion Document

Create `.kiro/specs/bug-fix-xyz/completion/task-1-completion.md`:

```markdown
# Task 1 Completion: Fix Button Click Handler

**Date**: 2025-11-28
**Task**: 1. Fix button click handler bug
**Type**: Implementation
**Status**: Complete

---

## Changes

### Bug Fixes
- Fixed button click handler not firing on mobile devices
- Resolved event propagation issue in Safari
- Fixed memory leak in event listener cleanup

### Testing
- Added regression tests for mobile click events
- Verified fix across all supported browsers
- Confirmed no performance impact

## Breaking Changes

None

## Validation (Tier 2: Standard)

✅ All tests passing
✅ Bug verified fixed
✅ No regressions introduced
```

### Step 3: Preview Release

```bash
# Analyze changes
npm run release:analyze

# Preview release plan
npm run release:cli plan
```

**Expected output:**
```
Current Version: 0.1.0
Next Version: 0.1.1
Bump Type: patch

Changes:
  - Bug Fixes: 3
```

### Step 4: Execute Release

```bash
# Dry run first
npm run release:cli release auto --dry-run

# Execute actual release
npm run release:cli release auto
```

### Step 5: Verify

```bash
# Check version
cat package.json | grep version
# Should show: "version": "0.1.1"

# Check GitHub release
# Visit: https://github.com/owner/repo/releases/tag/v0.1.1

# Check npm
npm view your-package version
# Should show: 0.1.1
```

## Best Practices

### 1. Clear Bug Descriptions

**Good:**
```markdown
### Bug Fixes
- Fixed button click handler not firing on mobile devices
  - Issue: Touch events not properly handled
  - Solution: Added touch event listeners
  - Impact: Mobile users can now click buttons
```

**Bad:**
```markdown
### Bug Fixes
- Fixed button
```

### 2. Include Regression Tests

Always add tests to prevent the bug from returning:

```markdown
### Testing
- Added regression test: `button-click-mobile.test.ts`
- Verified fix across iOS Safari, Chrome, Firefox
- Confirmed no performance impact
```

### 3. Document Impact

Explain who is affected and how:

```markdown
### Impact
- Affects: Mobile users on iOS and Android
- Severity: High (buttons were non-functional)
- Workaround: None (required fix)
```

## Common Scenarios

### Scenario 1: Multiple Bug Fixes

Release multiple fixes together:

```markdown
### Bug Fixes
- Fixed button click handler on mobile
- Resolved icon rendering in Safari
- Fixed memory leak in event listeners
```

Result: Single patch release (0.1.0 → 0.1.1)

### Scenario 2: Security Patch

Mark security fixes clearly:

```markdown
### Security Fixes
- **SECURITY**: Fixed XSS vulnerability in input validation
- Updated dependencies with security patches
```

Result: Patch release with security notes

### Scenario 3: Documentation Fix

Documentation-only changes:

```markdown
### Documentation
- Fixed incorrect API examples
- Updated installation instructions
- Corrected TypeScript types in docs
```

Result: Patch release (documentation fixes warrant patch bump)

## Troubleshooting

### Issue: System Suggests Minor Instead of Patch

**Cause:** Completion document contains feature-like language

**Solution:** Ensure completion document clearly indicates bug fix:
```markdown
### Bug Fixes (not "New Features")
- Fixed [specific issue]
```

### Issue: Want to Skip Release

**Cause:** Bug fix doesn't warrant immediate release

**Solution:** Accumulate fixes and release together later

## Next Steps

- **Learn about feature releases**: [Minor Release](./03-minor-release.md)
- **Learn about breaking changes**: [Major Release](./04-major-release.md)
- **Automate releases**: [CI/CD Integration](./06-ci-cd-integration.md)

---

**Previous**: [First Release](./01-first-release.md) | **Next**: [Minor Release](./03-minor-release.md)
