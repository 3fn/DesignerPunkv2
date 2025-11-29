# Tutorial: Multi-Package Coordination

**Difficulty**: Advanced  
**Time**: 45 minutes  
**Prerequisites**: Completed [Major Release](./04-major-release.md)

---

## Overview

Learn how to coordinate releases across multiple packages in a monorepo, managing dependencies and versioning strategies.

## When to Use Multi-Package Coordination

Use multi-package coordination for:
- Monorepo with multiple npm packages
- Packages with interdependencies
- Synchronized version releases
- Independent package versioning

## Coordination Strategies

### Strategy 1: Synchronized Versioning

All packages share the same version number:

```json
{
  "coordination": {
    "strategy": "synchronized",
    "packages": [
      "@your-org/core",
      "@your-org/ui",
      "@your-org/utils"
    ]
  }
}
```

**When to use:**
- Tightly coupled packages
- Packages released together
- Simplified version management

### Strategy 2: Independent Versioning

Each package has its own version:

```json
{
  "coordination": {
    "strategy": "independent",
    "packages": [
      {
        "name": "@your-org/core",
        "path": "./packages/core"
      },
      {
        "name": "@your-org/ui",
        "path": "./packages/ui"
      }
    ]
  }
}
```

**When to use:**
- Loosely coupled packages
- Different release cadences
- Independent feature development

## Step-by-Step Guide: Synchronized Versioning

### Step 1: Configure Multi-Package Coordination

Create `.kiro/release-config.json`:

```json
{
  "workingDirectory": ".",
  "github": {
    "owner": "your-org",
    "repo": "your-monorepo",
    "token": "${GITHUB_TOKEN}"
  },
  "npm": {
    "token": "${NPM_TOKEN}",
    "publish": true
  },
  "packages": {
    "coordination": "synchronized",
    "packages": [
      {
        "name": "@your-org/core",
        "path": "./packages/core"
      },
      {
        "name": "@your-org/ui",
        "path": "./packages/ui"
      },
      {
        "name": "@your-org/utils",
        "path": "./packages/utils"
      }
    ]
  }
}
```

### Step 2: Create Completion Document

Create `.kiro/specs/multi-package-feature/completion/task-1-completion.md`:

```markdown
# Task 1 Completion: Add Theme System

**Date**: 2025-11-28
**Task**: 1. Implement theme system across packages
**Type**: Implementation
**Status**: Complete

---

## Changes

### Packages Affected
- @your-org/core: Theme engine and types
- @your-org/ui: Theme-aware components
- @your-org/utils: Theme utilities

### New Features

#### @your-org/core
- Added ThemeEngine class
- Implemented theme types and interfaces
- Added theme validation

#### @your-org/ui
- Updated all components to use theme system
- Added ThemeProvider component
- Implemented theme-aware styling

#### @your-org/utils
- Added theme color utilities
- Implemented theme conversion helpers
- Added theme testing utilities

## Breaking Changes

None - feature is additive

## Validation (Tier 2: Standard)

✅ All packages build successfully
✅ Cross-package dependencies resolved
✅ All tests passing
✅ Documentation updated for all packages
```

### Step 3: Preview Coordinated Release

```bash
# Analyze changes across all packages
npm run release:analyze

# Preview coordinated release plan
npm run release:cli plan
```

**Expected output:**
```
📦 Multi-Package Release Plan

Current Version: 1.0.0
Next Version: 1.1.0
Bump Type: minor

Packages to Update:
  - @your-org/core (1.0.0 → 1.1.0)
  - @your-org/ui (1.0.0 → 1.1.0)
  - @your-org/utils (1.0.0 → 1.1.0)

Dependency Updates:
  - @your-org/ui depends on @your-org/core@^1.1.0
  - @your-org/utils depends on @your-org/core@^1.1.0

Publishing Order:
  1. @your-org/core (no dependencies)
  2. @your-org/ui (depends on core)
  3. @your-org/utils (depends on core)
```

### Step 4: Execute Coordinated Release

```bash
# Dry run first
npm run release:cli release auto --dry-run

# Execute actual release
npm run release:cli release auto
```

**Expected output:**
```
🚀 Multi-Package Release

Updating package versions...
✓ @your-org/core: 1.0.0 → 1.1.0
✓ @your-org/ui: 1.0.0 → 1.1.0
✓ @your-org/utils: 1.0.0 → 1.1.0

Updating cross-package dependencies...
✓ @your-org/ui: Updated core dependency to ^1.1.0
✓ @your-org/utils: Updated core dependency to ^1.1.0

Creating git tags...
✓ @your-org/core@1.1.0
✓ @your-org/ui@1.1.0
✓ @your-org/utils@1.1.0

Publishing to npm...
✓ Published @your-org/core@1.1.0
✓ Published @your-org/ui@1.1.0
✓ Published @your-org/utils@1.1.0

Creating GitHub release...
✓ Release created: v1.1.0

✅ Multi-package release complete!
```

## Step-by-Step Guide: Independent Versioning

### Step 1: Configure Independent Versioning

```json
{
  "packages": {
    "coordination": "independent",
    "packages": [
      {
        "name": "@your-org/core",
        "path": "./packages/core",
        "versionStrategy": "independent"
      },
      {
        "name": "@your-org/ui",
        "path": "./packages/ui",
        "versionStrategy": "independent"
      }
    ]
  }
}
```

### Step 2: Create Package-Specific Completion Document

Create `.kiro/specs/ui-feature/completion/task-1-completion.md`:

```markdown
# Task 1 Completion: Add Button Component

**Date**: 2025-11-28
**Task**: 1. Add button component to UI package
**Type**: Implementation
**Status**: Complete

---

## Changes

### Package: @your-org/ui

### New Features
- Added Button component
- Implemented button variants
- Added button accessibility features

### Dependencies
- No changes to @your-org/core dependency

## Breaking Changes

None

## Validation (Tier 2: Standard)

✅ UI package builds successfully
✅ Button component tests passing
✅ No impact on other packages
```

### Step 3: Preview Independent Release

```bash
npm run release:analyze
```

**Expected output:**
```
📦 Independent Package Release

Package: @your-org/ui
Current Version: 1.2.0
Next Version: 1.3.0
Bump Type: minor

Other Packages:
  - @your-org/core: No changes (stays at 2.0.0)
  - @your-org/utils: No changes (stays at 1.5.0)
```

## Best Practices

### 1. Clear Package Boundaries

Define clear responsibilities:

```markdown
## Package Responsibilities

### @your-org/core
- Core functionality
- Type definitions
- Base classes

### @your-org/ui
- UI components
- Theme system
- Component library

### @your-org/utils
- Utility functions
- Helpers
- Common tools
```

### 2. Document Cross-Package Changes

```markdown
## Cross-Package Impact

### Changes in @your-org/core
- Added new ThemeEngine API
- **Impact on @your-org/ui**: Must update to use new API
- **Impact on @your-org/utils**: No impact

### Migration
- @your-org/ui updated to use new ThemeEngine
- Dependency updated: @your-org/core@^2.0.0
```

### 3. Test Cross-Package Integration

```bash
# Test all packages together
npm run test:all

# Test specific package
npm run test --workspace=@your-org/ui

# Test cross-package integration
npm run test:integration
```

## Common Scenarios

### Scenario 1: Core Package Breaking Change

Core package has breaking change, affects dependent packages:

```markdown
## Breaking Changes

### @your-org/core (1.0.0 → 2.0.0)
- Changed ThemeEngine API

### Dependent Packages
- @your-org/ui (1.5.0 → 2.0.0): Updated to use new API
- @your-org/utils (1.3.0 → 2.0.0): Updated to use new API

All packages bumped to v2.0.0 due to breaking change in core.
```

### Scenario 2: UI Package Independent Feature

UI package adds feature, no impact on other packages:

```markdown
## Changes

### @your-org/ui (1.5.0 → 1.6.0)
- Added new Button component

### Other Packages
- @your-org/core: No changes (stays at 2.0.0)
- @your-org/utils: No changes (stays at 1.8.0)

Only UI package version bumped.
```

### Scenario 3: Synchronized Major Release

All packages release major version together:

```markdown
## v3.0.0 Release (All Packages)

### Breaking Changes Across Packages

#### @your-org/core
- Removed deprecated APIs
- Changed configuration format

#### @your-org/ui
- Updated to use new core APIs
- Removed deprecated components

#### @your-org/utils
- Updated to use new core APIs
- Changed utility function signatures

All packages synchronized to v3.0.0.
```

## Dependency Management

### Update Dependency Ranges

```json
{
  "dependencies": {
    "@your-org/core": "^2.0.0"
  }
}
```

**Strategies:**
- `^2.0.0`: Compatible with 2.x.x (recommended)
- `~2.0.0`: Compatible with 2.0.x (strict)
- `2.0.0`: Exact version (very strict)
- `*`: Any version (not recommended)

### Workspace Dependencies

For monorepos using workspaces:

```json
{
  "dependencies": {
    "@your-org/core": "workspace:*"
  }
}
```

## Troubleshooting

### Issue: Dependency Version Mismatch

**Cause:** Packages have incompatible dependency versions

**Solution:**
```bash
# Update all package dependencies
npm run release:cli update-deps

# Or manually update package.json files
```

### Issue: Publishing Order Fails

**Cause:** Dependent package published before dependency

**Solution:** System automatically determines publishing order based on dependencies

### Issue: Want to Release Only One Package

**Cause:** Using synchronized versioning but only one package changed

**Solution:** Switch to independent versioning or accept that all packages will be bumped

## Next Steps

- **Automate releases**: [CI/CD Integration](./06-ci-cd-integration.md)
- **Learn about pre-releases**: [Pre-release Versions](./07-prerelease.md)
- **Advanced configuration**: [Configuration Reference](../../configuration-reference.md)

---

**Previous**: [Major Release](./04-major-release.md) | **Next**: [CI/CD Integration](./06-ci-cd-integration.md)

