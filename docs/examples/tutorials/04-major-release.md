# Tutorial: Major Release (Breaking Changes)

**Difficulty**: Intermediate  
**Time**: 30 minutes  
**Prerequisites**: Completed [Minor Release](./03-minor-release.md)  
**Last Reviewed**: 2025-12-30

---

## Overview

Learn how to release a major version (0.9.0 → 1.0.0 or 1.5.0 → 2.0.0) for breaking changes that require user action.

## When to Use Major Releases

Use major releases for:
- Breaking API changes
- Removed functionality
- Changed behavior that breaks existing code
- Major architectural changes
- Incompatible dependency updates

## Step-by-Step Guide

### Step 1: Plan Breaking Changes

Document what will break and why:

```markdown
## Breaking Changes Plan

### 1. Remove Deprecated API
- Remove `getTheme()` function (deprecated in v0.8.0)
- Users must migrate to `useTheme()` hook

### 2. Change Default Behavior
- Change default theme from 'light' to 'auto'
- Users relying on default must explicitly set theme='light'

### 3. Update Dependencies
- Upgrade React from 17 to 18
- Users must upgrade React in their projects
```

### Step 2: Implement Changes

Complete your breaking changes:

```bash
# Implement breaking changes
# Update tests
# Update documentation
npm test
```

### Step 3: Create Comprehensive Completion Document

Create `.kiro/specs/v2-breaking-changes/completion/task-1-completion.md`:

```markdown
# Task 1 Completion: Version 2.0 Breaking Changes

**Date**: 2025-11-28
**Task**: 1. Implement v2.0 breaking changes
**Type**: Implementation
**Status**: Complete

---

## Changes

### Breaking Changes

#### 1. Removed Deprecated `getTheme()` Function

**What Changed:**
- Removed `getTheme()` function (deprecated since v0.8.0)

**Migration:**
```typescript
// Before (v1.x)
import { getTheme } from 'your-package';
const theme = getTheme();

// After (v2.x)
import { useTheme } from 'your-package';
const { theme } = useTheme();
```

**Why:** The hook-based API provides better React integration and performance.

#### 2. Changed Default Theme Behavior

**What Changed:**
- Default theme changed from 'light' to 'auto' (follows system preference)

**Migration:**
```typescript
// Before (v1.x) - default was 'light'
<ThemeProvider>
  <App />
</ThemeProvider>

// After (v2.x) - default is 'auto', explicitly set if needed
<ThemeProvider theme="light">
  <App />
</ThemeProvider>
```

**Why:** Auto theme detection provides better user experience.

#### 3. Updated React Peer Dependency

**What Changed:**
- Minimum React version: 17.0.0 → 18.0.0

**Migration:**
```bash
npm install react@18 react-dom@18
```

**Why:** React 18 features improve performance and enable concurrent rendering.

### New Features
- Added concurrent rendering support
- Improved theme switching performance
- Enhanced TypeScript types

### Improvements
- Better error messages
- Improved documentation
- Performance optimizations

## Migration Guide

See [MIGRATION.md](./MIGRATION-v2.md) for complete migration guide.

## Validation (Tier 2: Standard)

✅ All tests passing with React 18
✅ Breaking changes documented
✅ Migration guide complete
✅ Examples updated
```

### Step 4: Create Migration Guide

Create `MIGRATION-v2.md` in your docs:

```markdown
# Migration Guide: v1.x → v2.0

## Overview

Version 2.0 includes breaking changes that require code updates. This guide helps you migrate.

## Breaking Changes

### 1. Removed `getTheme()` Function

**Impact:** High - affects all users of `getTheme()`

**Before:**
\`\`\`typescript
import { getTheme } from 'your-package';
const theme = getTheme();
\`\`\`

**After:**
\`\`\`typescript
import { useTheme } from 'your-package';
const { theme } = useTheme();
\`\`\`

**Automated Migration:**
\`\`\`bash
# Use codemod to automate migration
npx your-package-codemod v1-to-v2
\`\`\`

### 2. Default Theme Changed

**Impact:** Medium - affects users relying on default theme

**Before:** Default theme was 'light'

**After:** Default theme is 'auto' (system preference)

**Fix:** Explicitly set theme if you need 'light':
\`\`\`typescript
<ThemeProvider theme="light">
  <App />
</ThemeProvider>
\`\`\`

### 3. React 18 Required

**Impact:** High - all users must upgrade React

**Before:** React 17.0.0+

**After:** React 18.0.0+

**Migration:**
\`\`\`bash
npm install react@18 react-dom@18
\`\`\`

## Step-by-Step Migration

### Step 1: Update Dependencies

\`\`\`bash
# Update React
npm install react@18 react-dom@18

# Update your-package
npm install your-package@2.0.0
\`\`\`

### Step 2: Run Codemod

\`\`\`bash
npx your-package-codemod v1-to-v2
\`\`\`

### Step 3: Fix Remaining Issues

Review and fix any issues the codemod couldn't handle automatically.

### Step 4: Test Thoroughly

\`\`\`bash
npm test
\`\`\`

### Step 5: Update Documentation

Update your project's documentation to reflect v2.0 usage.

## Troubleshooting

### Issue: "getTheme is not a function"

**Cause:** Using removed `getTheme()` function

**Fix:** Replace with `useTheme()` hook

### Issue: Theme looks different

**Cause:** Default theme changed to 'auto'

**Fix:** Explicitly set `theme="light"` if needed

## Need Help?

- [GitHub Issues](https://github.com/owner/repo/issues)
- [Discord Community](https://discord.gg/your-server)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/your-package)
```

### Step 5: Preview Release

```bash
# Analyze changes
npm run release:analyze

# Preview release plan
npm run release:cli plan
```

**Expected output:**
```
Current Version: 1.5.0
Next Version: 2.0.0
Bump Type: major

Changes:
  - Breaking Changes: 3
  - New Features: 3
  - Improvements: 3

⚠️  WARNING: This is a MAJOR release with breaking changes
```

### Step 6: Execute Release

```bash
# Dry run first (IMPORTANT for major releases)
npm run release:cli release auto --dry-run

# Review output carefully
# Verify breaking changes are documented

# Execute actual release
npm run release:cli release auto
```

### Step 7: Communicate Changes

After release, communicate to users:

1. **GitHub Release**: Highlight breaking changes
2. **Blog Post**: Explain changes and benefits
3. **Email/Newsletter**: Notify users
4. **Social Media**: Announce release
5. **Documentation**: Update all docs

## Best Practices

### 1. Comprehensive Breaking Change Documentation

**Good:**
```markdown
### Breaking Changes

#### Removed `getTheme()` Function

**What Changed:** Removed `getTheme()` function

**Why:** Hook-based API provides better React integration

**Migration:**
\`\`\`typescript
// Before
const theme = getTheme();

// After
const { theme } = useTheme();
\`\`\`

**Impact:** High - affects all users of `getTheme()`

**Automated Fix:** Run `npx your-package-codemod v1-to-v2`
```

**Bad:**
```markdown
### Breaking Changes
- Removed getTheme()
```

### 2. Provide Migration Tools

Help users migrate:

```bash
# Codemod for automated migration
npx your-package-codemod v1-to-v2

# Deprecation warnings in previous version
# v1.9.0 warns about upcoming changes in v2.0.0
```

### 3. Gradual Migration Path

Allow gradual migration:

```markdown
## Gradual Migration

### Phase 1: Update Dependencies (v1.9.0)
- Update to latest v1.x
- Fix deprecation warnings
- Test thoroughly

### Phase 2: Upgrade to v2.0.0
- Update to v2.0.0
- Run codemod
- Fix remaining issues

### Phase 3: Adopt New Features
- Use new v2.0 features
- Remove compatibility code
```

## Common Scenarios

### Scenario 1: Multiple Breaking Changes

Group related breaking changes:

```markdown
### Breaking Changes

#### API Changes
- Removed `getTheme()` function
- Renamed `setTheme()` to `updateTheme()`
- Changed `ThemeConfig` interface

#### Behavior Changes
- Default theme changed to 'auto'
- Theme persistence now opt-in

#### Dependency Changes
- React 18 required
- Dropped IE11 support
```

### Scenario 2: Major Version with Few Breaking Changes

Even small breaking changes require major version:

```markdown
### Breaking Changes

#### Changed Default Export

**What Changed:** Package now uses named exports only

**Migration:**
\`\`\`typescript
// Before
import Theme from 'your-package';

// After
import { Theme } from 'your-package';
\`\`\`

This is the only breaking change, but requires major version bump.
```

### Scenario 3: Pre-1.0 Breaking Changes

Before 1.0, breaking changes can use minor versions:

```markdown
## Version 0.9.0 (Breaking Changes)

Note: This project follows semantic versioning. Before 1.0.0, breaking changes may occur in minor versions.

### Breaking Changes
- [List changes]

### Migration to 1.0.0
This is the last breaking change before 1.0.0 stable release.
```

## Troubleshooting

### Issue: Users Complaining About Breaking Changes

**Prevention:**
- Deprecate features in advance (v1.8.0 deprecates, v2.0.0 removes)
- Provide migration tools
- Communicate early and often
- Maintain v1.x with security fixes

### Issue: Want to Avoid Major Version

**Solution:** Consider if changes are truly breaking:
- Can you maintain backward compatibility?
- Can you provide compatibility layer?
- Can you deprecate instead of remove?

### Issue: Need to Release Multiple Major Versions

**Solution:** Plan carefully:
- v1.0 → v2.0: First set of breaking changes
- v2.0 → v3.0: Second set (wait for user adoption)
- Don't rush major versions

## Next Steps

- **Coordinate multiple packages**: [Multi-Package](./05-multi-package.md)
- **Automate releases**: [CI/CD Integration](./06-ci-cd-integration.md)
- **Learn about pre-releases**: [Pre-release Versions](./07-prerelease.md)

---

**Previous**: [Minor Release](./03-minor-release.md) | **Next**: [Multi-Package](./05-multi-package.md)

