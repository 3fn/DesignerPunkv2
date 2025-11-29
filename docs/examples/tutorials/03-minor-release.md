# Tutorial: Minor Release (New Features)

**Difficulty**: Beginner  
**Time**: 15 minutes  
**Prerequisites**: Completed [Patch Release](./02-patch-release.md)

---

## Overview

Learn how to release a minor version (0.1.0 → 0.2.0) for new features and enhancements that maintain backward compatibility.

## When to Use Minor Releases

Use minor releases for:
- New features
- New functionality
- Enhancements to existing features
- Deprecations (with backward compatibility)
- No breaking changes

## Step-by-Step Guide

### Step 1: Complete Feature Implementation

Implement your new feature:

```bash
# Implement feature
# Add tests
# Update documentation
npm test
```

### Step 2: Create Completion Document

Create `.kiro/specs/new-feature-xyz/completion/task-1-completion.md`:

```markdown
# Task 1 Completion: Add Dark Mode Support

**Date**: 2025-11-28
**Task**: 1. Implement dark mode feature
**Type**: Implementation
**Status**: Complete

---

## Changes

### New Features
- Added dark mode support with automatic theme detection
- Implemented theme toggle component
- Added dark mode color tokens
- Integrated with system preferences

### Improvements
- Enhanced color contrast for accessibility
- Optimized theme switching performance
- Added smooth transitions between themes

### Documentation
- Added dark mode usage guide
- Updated component documentation
- Added theme customization examples

## Breaking Changes

None - feature is fully backward compatible

## Validation (Tier 2: Standard)

✅ All tests passing
✅ Feature works across all platforms
✅ Accessibility requirements met
✅ Documentation complete
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
Next Version: 0.2.0
Bump Type: minor

Changes:
  - New Features: 4
  - Improvements: 3
  - Documentation: 3
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
# Should show: "version": "0.2.0"

# Check GitHub release
# Visit: https://github.com/owner/repo/releases/tag/v0.2.0

# Check npm
npm view your-package version
# Should show: 0.2.0
```

## Best Practices

### 1. Clear Feature Descriptions

**Good:**
```markdown
### New Features
- Added dark mode support
  - Automatic theme detection based on system preferences
  - Manual theme toggle with persistent user preference
  - Smooth transitions between light and dark themes
  - Full accessibility support (WCAG 2.1 AA compliant)
```

**Bad:**
```markdown
### New Features
- Dark mode
```

### 2. Document Backward Compatibility

Explicitly state that changes are backward compatible:

```markdown
## Backward Compatibility

This feature is fully backward compatible:
- Existing light mode behavior unchanged
- No configuration changes required
- Opt-in feature (dark mode disabled by default)
- No breaking changes to existing APIs
```

### 3. Include Migration Guide (if needed)

Even for minor releases, provide guidance:

```markdown
## Usage

To enable dark mode in your application:

\`\`\`typescript
import { ThemeProvider } from 'your-package';

<ThemeProvider theme="auto">
  <App />
</ThemeProvider>
\`\`\`

No changes required for existing applications.
```

## Common Scenarios

### Scenario 1: Multiple New Features

Release multiple features together:

```markdown
### New Features
- Added dark mode support
- Implemented keyboard shortcuts
- Added export to PDF functionality
```

Result: Single minor release (0.1.0 → 0.2.0)

### Scenario 2: Feature with Deprecation

Deprecate old API while maintaining compatibility:

```markdown
### New Features
- Added new `useTheme()` hook with enhanced functionality

### Deprecations
- `getTheme()` function deprecated (still works, will be removed in v1.0.0)
- Use `useTheme()` hook instead
- Migration guide: [link to docs]
```

Result: Minor release with deprecation notice

### Scenario 3: Enhancement to Existing Feature

Improve existing functionality:

```markdown
### Improvements
- Enhanced search with fuzzy matching
- Improved performance of data filtering
- Added sorting options to table component
```

Result: Minor release (enhancements count as new functionality)

## Release Notes Best Practices

### Include Examples

Show users how to use new features:

```markdown
### New Features

#### Dark Mode Support

Enable dark mode in your application:

\`\`\`typescript
import { ThemeProvider } from 'your-package';

// Automatic (follows system preference)
<ThemeProvider theme="auto">
  <App />
</ThemeProvider>

// Manual
<ThemeProvider theme="dark">
  <App />
</ThemeProvider>
\`\`\`
```

### Highlight Benefits

Explain why users should care:

```markdown
### New Features
- **Dark Mode Support**: Reduces eye strain in low-light environments and saves battery on OLED screens
- **Keyboard Shortcuts**: Improves productivity with quick access to common actions
```

### Link to Documentation

Provide detailed documentation links:

```markdown
### New Features
- Added dark mode support
  - [Usage Guide](./docs/dark-mode.md)
  - [Customization Options](./docs/theme-customization.md)
  - [Migration Guide](./docs/migration/dark-mode.md)
```

## Troubleshooting

### Issue: System Suggests Patch Instead of Minor

**Cause:** Completion document doesn't clearly indicate new features

**Solution:** Use "New Features" heading and describe functionality:
```markdown
### New Features (not "Changes" or "Improvements")
- Added [specific new functionality]
```

### Issue: Want to Release Multiple Features Separately

**Cause:** Features are independent and could be released separately

**Solution:** Create separate completion documents and release incrementally:
- Feature A: 0.1.0 → 0.2.0
- Feature B: 0.2.0 → 0.3.0

## Next Steps

- **Learn about breaking changes**: [Major Release](./04-major-release.md)
- **Coordinate multiple packages**: [Multi-Package](./05-multi-package.md)
- **Automate releases**: [CI/CD Integration](./06-ci-cd-integration.md)

---

**Previous**: [Patch Release](./02-patch-release.md) | **Next**: [Major Release](./04-major-release.md)

