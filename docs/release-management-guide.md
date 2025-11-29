# Release Management System - Usage Guide

**Date**: November 28, 2025  
**Purpose**: Comprehensive guide for using the DesignerPunk Release Management System  
**Organization**: process-standard  
**Scope**: cross-project

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [CLI Commands](#cli-commands)
5. [Workflow Integration](#workflow-integration)
6. [Best Practices](#best-practices)
7. [Common Scenarios](#common-scenarios)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Release Management System provides automated, intelligent versioning and release management for the DesignerPunk design system. It follows semantic versioning standards and integrates seamlessly with your existing development workflow.

### Key Features

- **Automatic Version Calculation**: Analyzes completion documents to determine semantic version bumps
- **Release Note Generation**: Extracts changes and generates comprehensive release notes
- **Multi-Package Coordination**: Manages versioning across multiple packages in the ecosystem
- **GitHub Integration**: Creates releases and publishes artifacts automatically
- **npm Publishing**: Publishes packages to npm registry with proper authentication
- **Rollback Capabilities**: Provides safety mechanisms to recover from failed releases

### System Architecture

```
Completion Documents → Release Detection → Analysis → Version Calculation
                                                    ↓
                                            Release Notes Generation
                                                    ↓
                                            Package Coordination
                                                    ↓
                                            Automation Layer
                                                    ↓
                                            Publishing (GitHub + npm)
```

---

## Quick Start

### Prerequisites

1. **Node.js**: Version 16 or higher
2. **Git**: Configured with proper credentials
3. **GitHub Token**: Personal access token with repo and packages permissions
4. **npm Token**: Authentication token for npm registry (if publishing)

### Installation

The Release Management System is included in the DesignerPunk repository. No additional installation is required.

### Basic Usage

#### 1. Automatic Release (Recommended)

The system automatically detects releases when you complete tasks:

```bash
# Complete your work
# Mark task as complete using taskStatus tool
# System automatically:
#   - Detects completion
#   - Analyzes changes
#   - Calculates version
#   - Generates release notes
#   - Creates release trigger
```

#### 2. Manual Release via CLI

Execute a release manually using the CLI:

```bash
# Execute automatic release
npm run release:cli release auto

# Execute manual release with prompts
npm run release:cli release manual

# Preview release plan without executing
npm run release:cli plan

# Check release status
npm run release:cli status
```

#### 3. Release Analysis Only

Run analysis without executing the release:

```bash
# Analyze changes and show recommendations
npm run release:analyze

# Output in JSON format
npm run release:analyze --format json

# Analyze specific directory
npm run release:analyze --dir .kiro/specs/my-spec
```

---

## Core Concepts

### Semantic Versioning

The system follows [Semantic Versioning 2.0.0](https://semver.org/):

- **Major (X.0.0)**: Breaking changes that require user action
- **Minor (0.X.0)**: New features that are backward compatible
- **Patch (0.0.X)**: Bug fixes and minor improvements

### Release Triggers

Releases are triggered by:

1. **Spec Completion**: Completing a spec triggers a minor version bump
2. **Task Completion**: Completing significant tasks may trigger a patch version bump
3. **Breaking Changes**: Detected breaking changes trigger a major version bump
4. **Manual Trigger**: Explicit release command via CLI

### Completion Documents

The system analyzes completion documents to determine release content:

- **Location**: `.kiro/specs/[spec-name]/completion/`
- **Format**: Markdown files with structured sections
- **Content**: Implementation details, changes, breaking changes, requirements

### Release Notes

Generated release notes include:

- **Summary**: High-level overview of changes
- **Breaking Changes**: Highlighted with migration guidance
- **New Features**: Features added in this release
- **Bug Fixes**: Issues resolved
- **Improvements**: Enhancements and optimizations

---

## CLI Commands

### `release` - Execute a Release

Execute a release with automatic or manual configuration.

```bash
# Automatic release (recommended)
npm run release:cli release auto

# Manual release with prompts
npm run release:cli release manual

# Dry run (preview without publishing)
npm run release:cli release auto --dry-run

# Skip confirmation prompts
npm run release:cli release auto --skip-confirmation
```

**Options:**
- `--dry-run`: Preview release without actually publishing
- `--skip-confirmation`: Skip interactive confirmation prompts
- `--verbose`: Show detailed output
- `--github-token <token>`: Override GitHub token
- `--npm-token <token>`: Override npm token
- `--working-dir <path>`: Set working directory

**Examples:**

```bash
# Execute release with dry run
npm run release:cli release auto --dry-run

# Execute release with custom tokens
npm run release:cli release auto --github-token ghp_xxx --npm-token npm_xxx

# Execute release from specific directory
npm run release:cli release auto --working-dir /path/to/project
```

### `status` - Show Release Status

Display the current state of the release pipeline.

```bash
npm run release:cli status
```

**Output:**
- Pipeline status (pending, in-progress, completed, failed)
- Current stage being executed
- Completed stages
- Any errors encountered

### `plan` - Show Release Plan

Preview what would be released without executing.

```bash
npm run release:cli plan
```

**Output:**
- Current version
- Next version
- Bump type (major, minor, patch)
- Packages to update
- Release notes preview

### `config` - Manage Configuration

Manage release configuration settings.

```bash
# Show current configuration
npm run release:cli config show

# Set configuration value
npm run release:cli config set <key> <value>

# Validate configuration
npm run release:cli config validate
```

**Examples:**

```bash
# Show configuration
npm run release:cli config show

# Validate configuration
npm run release:cli config validate
```

### `help` - Show Help Information

Display help information for commands.

```bash
# General help
npm run release:cli help

# Command-specific help
npm run release:cli help release
npm run release:cli help status
npm run release:cli help plan
npm run release:cli help config
```

---

## Workflow Integration

### Automatic Release Detection

The system integrates with your existing workflow through agent hooks:

1. **Task Completion**: When you mark a task complete using `taskStatus` tool
2. **File Organization**: After files are organized
3. **Release Detection**: System detects completion documents
4. **Analysis**: Analyzes changes and calculates version
5. **Trigger Creation**: Creates release trigger file

### Manual Workflow

For manual control over releases:

1. **Complete Work**: Finish your implementation
2. **Create Completion Document**: Document your changes
3. **Run Analysis**: `npm run release:analyze`
4. **Review Plan**: `npm run release:cli plan`
5. **Execute Release**: `npm run release:cli release auto`

### CI/CD Integration

Integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run release:cli release auto --skip-confirmation
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Best Practices

### 1. Write Clear Completion Documents

**Good:**
```markdown
## Changes

- Implemented new button component with variants
- Added accessibility support (WCAG 2.1 AA)
- Created comprehensive test suite

## Breaking Changes

- Renamed `Button` to `ButtonCTA` for clarity
- Migration: Update all imports from `Button` to `ButtonCTA`
```

**Bad:**
```markdown
## Changes

- Fixed stuff
- Made it better
```

### 2. Use Semantic Commit Messages

While the system analyzes completion documents, good commit messages help:

```bash
# Good
git commit -m "feat: Add button component with accessibility support"
git commit -m "fix: Resolve icon rendering issue in Safari"
git commit -m "BREAKING: Rename Button to ButtonCTA"

# Bad
git commit -m "updates"
git commit -m "wip"
```

### 3. Test Before Releasing

Always preview the release plan before executing:

```bash
# Preview release
npm run release:cli plan

# Dry run
npm run release:cli release auto --dry-run

# Execute release
npm run release:cli release auto
```

### 4. Document Breaking Changes

Always document breaking changes with migration guidance:

```markdown
## Breaking Changes

### Renamed Button Component

**Before:**
```typescript
import { Button } from '@designerpunk/components';
```

**After:**
```typescript
import { ButtonCTA } from '@designerpunk/components';
```

**Migration:** Update all imports and component usage.
```

### 5. Use Dry Run for Testing

Test the release process without publishing:

```bash
# Test release process
npm run release:cli release auto --dry-run

# Review output
# Fix any issues
# Execute actual release
npm run release:cli release auto
```

---

## Common Scenarios

### Scenario 1: First Release

Setting up the first release for a new project:

```bash
# 1. Ensure configuration is valid
npm run release:cli config validate

# 2. Preview release plan
npm run release:cli plan

# 3. Execute first release
npm run release:cli release auto

# 4. Verify release on GitHub
# Check: https://github.com/owner/repo/releases
```

### Scenario 2: Patch Release

Releasing a bug fix:

```bash
# 1. Complete bug fix work
# 2. Create completion document documenting the fix
# 3. System automatically detects and analyzes

# 4. Preview release
npm run release:cli plan
# Expected: Patch version bump (0.1.0 → 0.1.1)

# 5. Execute release
npm run release:cli release auto
```

### Scenario 3: Minor Release

Releasing a new feature:

```bash
# 1. Complete feature implementation
# 2. Create spec completion document
# 3. System automatically detects and analyzes

# 4. Preview release
npm run release:cli plan
# Expected: Minor version bump (0.1.0 → 0.2.0)

# 5. Execute release
npm run release:cli release auto
```

### Scenario 4: Major Release (Breaking Changes)

Releasing breaking changes:

```bash
# 1. Complete breaking change implementation
# 2. Document breaking changes in completion document
# 3. Include migration guidance

# 4. Preview release
npm run release:cli plan
# Expected: Major version bump (0.1.0 → 1.0.0)

# 5. Review breaking changes carefully
# 6. Execute release
npm run release:cli release auto

# 7. Communicate breaking changes to users
```

### Scenario 5: Manual Version Override

Overriding automatic version calculation:

```bash
# Execute manual release with prompts
npm run release:cli release manual

# Follow prompts:
# - Override automatic version bump? (y/N): y
# - Version bump type (major/minor/patch): minor
# - Custom version number (leave empty for automatic): 1.5.0
# - Override automatic release notes? (y/N): n

# System executes release with specified version
```

### Scenario 6: Multi-Package Release

Releasing multiple packages simultaneously:

```bash
# 1. Complete work affecting multiple packages
# 2. System automatically coordinates versions

# 3. Preview release plan
npm run release:cli plan
# Shows: All packages to be updated with coordinated versions

# 4. Execute release
npm run release:cli release auto
# System publishes packages in correct order
```

### Scenario 7: Failed Release Recovery

Recovering from a failed release:

```bash
# 1. Check release status
npm run release:cli status
# Shows: Failed status with error details

# 2. Review errors
# Fix underlying issues (authentication, network, etc.)

# 3. Retry release
npm run release:cli release auto

# System automatically:
# - Detects previous failure
# - Rolls back incomplete changes
# - Retries release from clean state
```

---

## Troubleshooting

### Issue: "GitHub token is required"

**Symptom**: Release fails with authentication error

**Solution**:
```bash
# Set GitHub token in environment
export GITHUB_TOKEN=ghp_your_token_here

# Or pass via CLI
npm run release:cli release auto --github-token ghp_your_token_here

# Or configure in .env file
echo "GITHUB_TOKEN=ghp_your_token_here" >> .env
```

### Issue: "npm token is required for publishing"

**Symptom**: npm publishing fails with authentication error

**Solution**:
```bash
# Set npm token in environment
export NPM_TOKEN=npm_your_token_here

# Or pass via CLI
npm run release:cli release auto --npm-token npm_your_token_here

# Or configure in .env file
echo "NPM_TOKEN=npm_your_token_here" >> .env
```

### Issue: "No completion documents found"

**Symptom**: Analysis fails to find changes

**Solution**:
1. Ensure completion documents exist in `.kiro/specs/[spec-name]/completion/`
2. Check document format and structure
3. Verify documents contain required sections (Changes, Breaking Changes, etc.)

### Issue: "Version bump calculation failed"

**Symptom**: System cannot determine version bump

**Solution**:
1. Review completion documents for clarity
2. Ensure breaking changes are clearly marked
3. Use manual override if automatic calculation is incorrect:
   ```bash
   npm run release:cli release manual
   ```

### Issue: "Publishing failed - rollback initiated"

**Symptom**: Release fails during publishing

**Solution**:
1. Check release status: `npm run release:cli status`
2. Review error messages
3. Fix underlying issue (network, authentication, etc.)
4. System automatically rolls back incomplete changes
5. Retry release: `npm run release:cli release auto`

### Issue: "Pipeline stuck in 'in-progress' state"

**Symptom**: Release pipeline doesn't complete

**Solution**:
1. Check status: `npm run release:cli status`
2. Review logs for errors
3. If process was interrupted, system will recover on next release
4. Manual recovery: Delete `.kiro/release-state/` directory and retry

### Issue: "Dry run shows unexpected version bump"

**Symptom**: Preview shows wrong version bump type

**Solution**:
1. Review completion documents for accuracy
2. Check for unintended breaking change markers
3. Use manual override if needed:
   ```bash
   npm run release:cli release manual
   ```

### Issue: "Multi-package coordination conflict"

**Symptom**: Package version conflicts detected

**Solution**:
1. Review dependency relationships
2. Ensure all packages are up to date
3. System will suggest resolution strategy
4. Follow prompts to resolve conflicts

---

## Additional Resources

- **Configuration Reference**: See `docs/configuration-reference.md`
- **Troubleshooting Guide**: See `docs/troubleshooting-guide.md`
- **API Documentation**: See `docs/api-reference.md`
- **GitHub Repository**: https://github.com/3fn/DesignerPunkv2

---

## Support

For issues, questions, or contributions:

1. **GitHub Issues**: https://github.com/3fn/DesignerPunkv2/issues
2. **Documentation**: https://github.com/3fn/DesignerPunkv2/tree/main/docs
3. **Spec Documents**: `.kiro/specs/release-management-system/`

---

*This guide provides comprehensive usage information for the Release Management System. For configuration details, see the Configuration Reference.*
