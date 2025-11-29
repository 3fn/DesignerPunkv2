# Integrating with an Existing Project

**Difficulty**: Intermediate  
**Time**: 20 minutes  
**Prerequisites**: Existing Node.js project

---

## Overview

Learn how to add the Release Management System to an existing project without disrupting your current workflow.

## Prerequisites

Your project should have:
- ✅ package.json file
- ✅ Git repository
- ✅ Existing version number
- ✅ Node.js 16+ installed

## Step-by-Step Integration

### Step 1: Installation and Dependencies

The Release Management System is included in DesignerPunk. For installation in an existing project:

```bash
# No additional dependencies needed
# System uses existing Node.js and Git
```

**Installation**: The release management system is already included if you're using DesignerPunk. For standalone installation, copy the `src/release/` and `src/release-analysis/` directories to your project.

### Step 2: Create Directory Structure

```bash
# Create required directories
mkdir -p .kiro/specs
mkdir -p .kiro/logs
mkdir -p .kiro/release-triggers
mkdir -p .kiro/release-state
```

### Step 3: Create Configuration

Create `.kiro/release-config.json`:

```json
{
  "workingDirectory": ".",
  "github": {
    "owner": "your-org",
    "repo": "your-repo",
    "token": "${GITHUB_TOKEN}"
  },
  "npm": {
    "token": "${NPM_TOKEN}",
    "publish": true
  },
  "validation": {
    "requireCompletionDocs": true,
    "requireBreakingChangeDoc": true,
    "validateSemanticVersioning": true
  }
}
```

### Step 4: Add Scripts to package.json

Add release scripts to your existing package.json:

```json
{
  "scripts": {
    "release:analyze": "ts-node src/release-analysis/cli/AdvancedReleaseCLI.ts",
    "release:cli": "ts-node src/release/cli/ReleaseCLI.ts"
  }
}
```

### Step 5: Set Up Environment Variables

Create `.env` file (add to `.gitignore`):

```bash
GITHUB_TOKEN=ghp_your_token_here
NPM_TOKEN=npm_your_token_here
```

Update `.gitignore`:

```bash
echo ".env" >> .gitignore
echo ".kiro/release-state/" >> .gitignore
echo ".kiro/logs/" >> .gitignore
```

### Step 6: Create First Completion Document

Document your current state:

```bash
mkdir -p .kiro/specs/integration/completion
```

Create `.kiro/specs/integration/completion/task-1-completion.md`:

```markdown
# Task 1 Completion: Release Management Integration

**Date**: 2025-11-28
**Task**: 1. Integrate release management system
**Type**: Implementation
**Status**: Complete

---

## Changes

### New Features
- Integrated automated release management
- Added release analysis capabilities
- Configured GitHub and npm publishing

### Improvements
- Automated version bumping
- Automated release note generation
- Streamlined release process

## Breaking Changes

None - this is an integration change that doesn't affect existing functionality.

## Validation

✅ Configuration validated
✅ Scripts added to package.json
✅ Environment variables configured
✅ Directory structure created
```

### Step 7: Test Integration

```bash
# Validate configuration
npm run release:cli config validate

# Run analysis (should detect integration completion)
npm run release:analyze

# Preview release plan
npm run release:cli plan
```

### Step 8: Execute First Release (Optional)

If you want to create a release immediately:

```bash
# Dry run first
npm run release:cli release auto --dry-run

# Execute actual release
npm run release:cli release auto
```

## Preserving Existing Workflow

### Keep Existing Release Process

You can use the Release Management System alongside your existing process:

```json
{
  "scripts": {
    "release:old": "your-existing-release-command",
    "release:new": "npm run release:cli release auto",
    "release": "npm run release:new"
  }
}
```

### Gradual Migration

Migrate gradually:

1. **Phase 1**: Use for analysis only
   ```bash
   npm run release:analyze  # Just analyze, don't release
   ```

2. **Phase 2**: Use for version calculation
   ```bash
   npm run release:cli plan  # Preview versions
   ```

3. **Phase 3**: Use for full releases
   ```bash
   npm run release:cli release auto
   ```

### Hybrid Approach

Use for some releases, not others:

```bash
# Automated releases for patches
npm run release:cli release auto

# Manual releases for major versions
npm run release:old
```

## Migrating Existing Releases

### Import Release History

If you want to preserve release history:

1. **Keep existing CHANGELOG.md**:
   - System will append to existing CHANGELOG
   - Previous releases remain intact

2. **Keep existing git tags**:
   - System respects existing tags
   - New tags follow existing pattern

3. **Keep existing GitHub releases**:
   - System creates new releases
   - Previous releases unchanged

### Example: Existing CHANGELOG.md

Your existing CHANGELOG.md:

```markdown
# Changelog

## [0.5.0] - 2025-01-15
- Added feature X
- Fixed bug Y

## [0.4.0] - 2025-01-01
- Initial release
```

After first automated release:

```markdown
# Changelog

## [0.6.0] - 2025-11-28
- Integrated release management system
- Automated version bumping

## [0.5.0] - 2025-01-15
- Added feature X
- Fixed bug Y

## [0.4.0] - 2025-01-01
- Initial release
```

## Common Integration Scenarios

### Scenario 1: Monorepo Integration

Existing monorepo with multiple packages:

```json
{
  "packages": {
    "coordination": "synchronized",
    "packages": [
      {
        "name": "@your-org/existing-package-1",
        "path": "./packages/package-1"
      },
      {
        "name": "@your-org/existing-package-2",
        "path": "./packages/package-2"
      }
    ]
  }
}
```

### Scenario 2: Private Package Integration

Private npm packages:

```json
{
  "npm": {
    "registry": "https://registry.npmjs.org",
    "access": "restricted",
    "publish": true
  }
}
```

### Scenario 3: GitHub Enterprise Integration

GitHub Enterprise instance:

```json
{
  "github": {
    "baseUrl": "https://github.your-company.com/api/v3",
    "owner": "your-org",
    "repo": "your-repo",
    "token": "${GITHUB_TOKEN}"
  }
}
```

## Troubleshooting Integration

### Issue: "Cannot find release scripts"

**Solution:** Ensure scripts are added to package.json:
```json
{
  "scripts": {
    "release:analyze": "ts-node src/release-analysis/cli/AdvancedReleaseCLI.ts",
    "release:cli": "ts-node src/release/cli/ReleaseCLI.ts"
  }
}
```

### Issue: "Configuration validation failed"

**Solution:** Check configuration file exists and is valid:
```bash
cat .kiro/release-config.json
npm run release:cli config validate
```

### Issue: "No completion documents found"

**Solution:** Create initial completion document as shown in Step 6

### Issue: "Existing tags conflict"

**Solution:** System respects existing tags. New releases will continue from current version.

## Rollback Plan

If integration causes issues:

1. **Remove configuration**:
   ```bash
   rm .kiro/release-config.json
   ```

2. **Remove scripts**:
   - Delete release scripts from package.json

3. **Keep existing workflow**:
   - Your existing release process remains unchanged

4. **No data loss**:
   - Existing releases, tags, and CHANGELOG preserved

## Next Steps

After successful integration:

1. **Create completion documents** for future work
2. **Test with dry run** before actual releases
3. **Integrate with CI/CD** for automation
4. **Train team** on new workflow

## Additional Resources

- [First Release Tutorial](../tutorials/01-first-release.md)
- [Configuration Reference](../../configuration-reference.md)
- [CI/CD Integration](../tutorials/06-ci-cd-integration.md)

---

**Back to Examples**: [README](../README.md)
