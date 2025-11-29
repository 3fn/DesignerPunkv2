# Tutorial: Your First Release

**Difficulty**: Beginner  
**Time**: 15-20 minutes  
**Prerequisites**: Node.js 16+, Git configured

---

## Overview

This tutorial walks you through setting up and executing your first release using the Release Management System. By the end, you'll have:

- Configured the release system
- Created your first completion document
- Executed your first release
- Verified the release on GitHub

## Prerequisites

Before starting, ensure you have:

1. **Node.js**: Version 16 or higher
   ```bash
   node --version  # Should be v16.0.0 or higher
   ```

2. **Git**: Configured with your credentials
   ```bash
   git config --global user.name
   git config --global user.email
   ```

3. **GitHub Account**: With repository access

4. **npm Account**: If publishing to npm (optional)

## Step 1: Generate GitHub Token

### 1.1 Navigate to GitHub Settings

1. Go to GitHub.com
2. Click your profile picture → Settings
3. Scroll down to "Developer settings"
4. Click "Personal access tokens" → "Tokens (classic)"

### 1.2 Generate New Token

1. Click "Generate new token" → "Generate new token (classic)"
2. Name: "Release Management System"
3. Expiration: 90 days (recommended)
4. Select scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `write:packages` - Upload packages to GitHub Package Registry
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)

### 1.3 Save Token Securely

```bash
# Create .env file (add to .gitignore)
echo "GITHUB_TOKEN=ghp_your_token_here" >> .env

# Or export in your shell
export GITHUB_TOKEN=ghp_your_token_here
```

## Step 2: Generate npm Token (Optional)

If you plan to publish to npm:

### 2.1 Login to npm

```bash
npm login
```

### 2.2 Generate Token

```bash
npm token create
```

### 2.3 Save Token

```bash
# Add to .env file
echo "NPM_TOKEN=npm_your_token_here" >> .env

# Or export in your shell
export NPM_TOKEN=npm_your_token_here
```

## Step 3: Create Configuration File

### 3.1 Choose Configuration Template

For your first release, use the single package configuration:

```bash
# Copy example configuration
cp docs/examples/configurations/single-package.json .kiro/release-config.json
```

### 3.2 Update Configuration

Edit `.kiro/release-config.json`:

```json
{
  "github": {
    "owner": "your-username",
    "repo": "your-repo-name",
    "token": "${GITHUB_TOKEN}"
  },
  "npm": {
    "token": "${NPM_TOKEN}",
    "publish": true
  }
}
```

**Note**: Change `owner` to your GitHub username and `repo` to your repository name. Set `publish` to `false` if not publishing to npm.

### 3.3 Validate Configuration

```bash
npm run release:cli config validate
```

**Expected output:**
```
✓ Configuration is valid
✓ GitHub token is set
✓ npm token is set
✓ All required fields present
```

## Step 4: Create Your First Completion Document

### 4.1 Create Spec Directory

```bash
mkdir -p .kiro/specs/my-first-feature/completion
```

### 4.2 Create Completion Document

Create `.kiro/specs/my-first-feature/completion/task-1-completion.md`:

```markdown
# Task 1 Completion: Initial Release

**Date**: 2025-11-28
**Task**: 1. Initial project setup
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- Initial project structure
- Configuration files
- Basic documentation

## Implementation Details

Set up the initial project structure with:
- Package.json configuration
- TypeScript setup
- Basic build system
- Initial documentation

## Changes

### New Features
- Initial project setup
- Basic build configuration
- Documentation structure

### Improvements
- Established project conventions
- Set up development workflow

## Breaking Changes

None - this is the initial release.

## Validation (Tier 2: Standard)

### Syntax Validation
✅ All files compile without errors
✅ TypeScript configuration valid

### Functional Validation
✅ Build system works correctly
✅ All scripts execute successfully

### Requirements Compliance
✅ Project structure established
✅ Build system functional
✅ Documentation created
```

## Step 5: Preview Release Plan

### 5.1 Run Analysis

```bash
npm run release:analyze
```

**Expected output:**
```
📊 Release Analysis Results

Current Version: 0.0.0
Recommended Version: 0.1.0
Bump Type: minor

Changes Detected:
  - New Features: 3
  - Improvements: 2
  - Bug Fixes: 0
  - Breaking Changes: 0

Confidence: High (95%)
```

### 5.2 Preview Release Plan

```bash
npm run release:cli plan
```

**Expected output:**
```
📋 Release Plan

Current Version: 0.0.0
Next Version: 0.1.0
Bump Type: minor

Packages to Update:
  - your-package (0.0.0 → 0.1.0)

Release Notes Preview:
  ## Changes
  - Initial project setup
  - Basic build configuration
  - Documentation structure

GitHub Release: Will be created
npm Publish: Will be published
```

## Step 6: Execute First Release (Dry Run)

### 6.1 Test with Dry Run

```bash
npm run release:cli release auto --dry-run
```

**Expected output:**
```
🚀 Release Process (DRY RUN)

✓ Configuration validated
✓ Completion documents found
✓ Version calculated: 0.1.0
✓ Release notes generated

[DRY RUN] Would update package.json: 0.0.0 → 0.1.0
[DRY RUN] Would create CHANGELOG.md
[DRY RUN] Would create git tag: v0.1.0
[DRY RUN] Would create GitHub release
[DRY RUN] Would publish to npm

✓ Dry run complete - no changes made
```

### 6.2 Review Output

Verify:
- ✅ Version bump is correct (0.0.0 → 0.1.0)
- ✅ Release notes look good
- ✅ All steps would execute successfully

## Step 7: Execute Actual Release

### 7.1 Run Release Command

```bash
npm run release:cli release auto
```

### 7.2 Confirm Execution

When prompted:
```
Execute release? (y/N): y
```

### 7.3 Monitor Progress

**Expected output:**
```
🚀 Release Process

✓ Configuration validated
✓ Completion documents analyzed
✓ Version calculated: 0.1.0
✓ Release notes generated

Updating package.json...
✓ package.json updated: 0.0.0 → 0.1.0

Creating CHANGELOG.md...
✓ CHANGELOG.md created

Creating git tag...
✓ Git tag created: v0.1.0

Creating GitHub release...
✓ GitHub release created: v0.1.0

Publishing to npm...
✓ Published to npm: your-package@0.1.0

✅ Release complete!

Release URL: https://github.com/your-username/your-repo/releases/tag/v0.1.0
npm URL: https://www.npmjs.com/package/your-package/v/0.1.0
```

## Step 8: Verify Release

### 8.1 Check GitHub Release

1. Go to your repository on GitHub
2. Click "Releases" (right sidebar)
3. Verify your release appears:
   - Tag: v0.1.0
   - Title: v0.1.0
   - Release notes present

### 8.2 Check npm Package (if published)

```bash
npm view your-package
```

**Expected output:**
```
your-package@0.1.0 | Public | Published 1 minute ago
```

### 8.3 Check Local Changes

```bash
# Check package.json version
cat package.json | grep version

# Check CHANGELOG.md
head -20 CHANGELOG.md

# Check git tag
git tag -l
```

## Step 9: Commit and Push

### 9.1 Commit Changes

```bash
git add .
git commit -m "Release v0.1.0"
```

### 9.2 Push to GitHub

```bash
git push origin main
git push origin v0.1.0
```

## Troubleshooting

### Issue: "GitHub token is required"

**Solution:**
```bash
# Verify token is set
echo $GITHUB_TOKEN

# If not set, export it
export GITHUB_TOKEN=ghp_your_token_here
```

### Issue: "No completion documents found"

**Solution:**
```bash
# Verify document exists
ls -la .kiro/specs/my-first-feature/completion/

# Check document format
cat .kiro/specs/my-first-feature/completion/task-1-completion.md
```

### Issue: "Configuration validation failed"

**Solution:**
```bash
# Show current configuration
npm run release:cli config show

# Validate configuration
npm run release:cli config validate

# Fix any reported issues
```

## Next Steps

Congratulations! You've completed your first release. Next:

1. **Learn about different release types:**
   - [Patch Release](./02-patch-release.md) - Bug fixes
   - [Minor Release](./03-minor-release.md) - New features
   - [Major Release](./04-major-release.md) - Breaking changes

2. **Explore advanced features:**
   - [Multi-Package Coordination](./05-multi-package.md)
   - [CI/CD Integration](./06-ci-cd-integration.md)

3. **Read documentation:**
   - [Usage Guide](../../release-management-guide.md)
   - [Configuration Reference](../../configuration-reference.md)
   - [Troubleshooting Guide](../../troubleshooting-guide.md)

## Summary

You've learned how to:

- ✅ Generate and configure GitHub/npm tokens
- ✅ Create release configuration
- ✅ Write completion documents
- ✅ Preview release plans
- ✅ Execute releases with dry run
- ✅ Verify releases on GitHub and npm

---

**Next Tutorial**: [Patch Release](./02-patch-release.md)
