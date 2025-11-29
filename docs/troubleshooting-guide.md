# Release Management System - Troubleshooting Guide

**Date**: November 28, 2025  
**Purpose**: Solutions for common issues and problems  
**Organization**: process-standard  
**Scope**: cross-project

---

## Table of Contents

1. [Quick Start: Diagnostic Tools](#quick-start-diagnostic-tools)
2. [Authentication Issues](#authentication-issues)
3. [Configuration Issues](#configuration-issues)
4. [Analysis Issues](#analysis-issues)
5. [Publishing Issues](#publishing-issues)
6. [Pipeline Issues](#pipeline-issues)
7. [Recovery Procedures](#recovery-procedures)
8. [Diagnostic Commands](#diagnostic-commands)

---

## Quick Start: Diagnostic Tools

Before diving into specific issues, use these automated diagnostic tools to identify problems:

### Validate Release Setup

Run this command to validate your complete release management setup:

```bash
npm run validate:release-setup
```

This checks:
- ✓ Node.js and npm versions
- ✓ Git installation and configuration
- ✓ GitHub token authentication
- ✓ npm token authentication (if configured)
- ✓ Configuration file validity
- ✓ Directory structure
- ✓ Package dependencies
- ✓ Git repository state

**Example output:**

```
=============================================================
Release Management System - Setup Validation
=============================================================

=============================================================
Environment Validation
=============================================================
✓ Node.js version: v18.17.0
✓ npm version: 9.6.7
✓ git installed: git version 2.39.0

=============================================================
Authentication Validation
=============================================================
✓ GitHub token valid for user: 3fn
✓ GitHub token has required repo scope
⚠ NPM_TOKEN not set
  Required for npm publishing. Set via: export NPM_TOKEN=npm_xxx

=============================================================
Validation Summary
=============================================================

Total checks: 15
✓ Passed: 13
⚠ Warnings: 2
✗ Failed: 0
```

### Diagnose Current Issues

If you're experiencing problems, run this command to diagnose the issue:

```bash
npm run diagnose:release-issues
```

This analyzes:
- 📋 Recent log files for errors
- 🔄 Pipeline state (stuck or failed releases)
- 🎯 Release triggers
- 📝 Completion document formatting
- 🌳 Git state (uncommitted changes, unpushed commits)
- 📦 Package configuration

**Example output:**

```
=============================================================
Release Management System - Issue Diagnostics
=============================================================

=============================================================
Log File Analysis
=============================================================

Analyzing release-manager.log...
✗ Found 2 error(s)
  [2025-11-28 10:30:00] ERROR: GitHub API authentication failed (401)
  [2025-11-28 10:30:05] ERROR: Release creation failed

=============================================================
Recommendations
=============================================================

Found 1 issue(s):
  High priority: 1

🔴 High Priority Issues:

authentication:
  Check GitHub and npm tokens: npm run validate:release-setup
```

### When to Use Each Tool

**Use `validate:release-setup` when:**
- Setting up the release system for the first time
- After changing authentication tokens
- After modifying configuration
- Before attempting your first release

**Use `diagnose:release-issues` when:**
- A release failed or got stuck
- Seeing errors in logs
- Unsure what's causing a problem
- Need to identify the root cause quickly

---

## Authentication Issues

### Issue: "GitHub token is required"

**Symptom:**
```
Error: GitHub token is required
```

**Cause:** GitHub token not configured

**Solutions:**

1. **Set environment variable:**
   ```bash
   export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Pass via CLI:**
   ```bash
   npm run release:cli release auto --github-token ghp_xxx
   ```

3. **Configure in .env file:**
   ```bash
   echo "GITHUB_TOKEN=ghp_xxx" >> .env
   ```

4. **Verify token is set:**
   ```bash
   echo $GITHUB_TOKEN
   ```

**Prevention:**
- Add token to `.env` file (add `.env` to `.gitignore`)
- Use CI/CD secret management for automated releases

---

### Issue: "GitHub API authentication failed"

**Symptom:**
```
Error: GitHub API authentication failed (401 Unauthorized)
```

**Cause:** Invalid or expired GitHub token

**Solutions:**

1. **Verify token is valid:**
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
   ```

2. **Check token permissions:**
   - Required: `repo` (full control of private repositories)
   - Required: `write:packages` (upload packages)

3. **Generate new token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with required permissions
   - Update `GITHUB_TOKEN` environment variable

4. **Verify token format:**
   - Classic tokens: `ghp_` prefix
   - Fine-grained tokens: `github_pat_` prefix

**Prevention:**
- Set token expiration reminders
- Rotate tokens regularly (every 90 days)
- Use fine-grained tokens with minimal permissions

---

### Issue: "npm token is required for publishing"

**Symptom:**
```
Error: npm token is required for publishing
```

**Cause:** npm token not configured

**Solutions:**

1. **Set environment variable:**
   ```bash
   export NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Pass via CLI:**
   ```bash
   npm run release:cli release auto --npm-token npm_xxx
   ```

3. **Configure in .env file:**
   ```bash
   echo "NPM_TOKEN=npm_xxx" >> .env
   ```

4. **Verify token is set:**
   ```bash
   echo $NPM_TOKEN
   ```

**Prevention:**
- Add token to `.env` file
- Use CI/CD secret management for automated releases

---

### Issue: "npm authentication failed"

**Symptom:**
```
Error: npm authentication failed (401 Unauthorized)
```

**Cause:** Invalid or expired npm token

**Solutions:**

1. **Verify token is valid:**
   ```bash
   npm whoami --registry https://registry.npmjs.org
   ```

2. **Generate new token:**
   ```bash
   npm login
   npm token create
   ```

3. **Update token:**
   ```bash
   export NPM_TOKEN=npm_new_token
   ```

4. **Verify token format:**
   - Legacy tokens: `npm_` prefix
   - Granular tokens: `npm_` prefix with specific permissions

**Prevention:**
- Set token expiration reminders
- Rotate tokens regularly
- Use granular tokens with minimal permissions

---

## Configuration Issues

### Issue: "Configuration validation failed"

**Symptom:**
```
Error: Configuration validation failed
  - GitHub owner is required
  - GitHub repo is required
```

**Cause:** Missing required configuration

**Solutions:**

1. **Check current configuration:**
   ```bash
   npm run release:cli config show
   ```

2. **Validate configuration:**
   ```bash
   npm run release:cli config validate
   ```

3. **Set missing values:**
   ```bash
   export GITHUB_OWNER=3fn
   export GITHUB_REPO=DesignerPunkv2
   ```

4. **Create configuration file:**
   ```json
   {
     "github": {
       "owner": "3fn",
       "repo": "DesignerPunkv2",
       "token": "${GITHUB_TOKEN}"
     }
   }
   ```

**Prevention:**
- Validate configuration before first release
- Use configuration file for consistent settings

---

### Issue: "Invalid package configuration"

**Symptom:**
```
Error: Invalid package configuration
  - Package name is required
  - Package path is required
```

**Cause:** Malformed package configuration

**Solutions:**

1. **Check package configuration:**
   ```json
   {
     "packages": {
       "packages": [
         {
           "name": "@designerpunk/tokens",
           "path": "./packages/tokens"
         }
       ]
     }
   }
   ```

2. **Verify package paths exist:**
   ```bash
   ls -la ./packages/tokens/package.json
   ```

3. **Validate package.json files:**
   ```bash
   cat ./packages/tokens/package.json | jq .name
   ```

**Prevention:**
- Validate package configuration after changes
- Use absolute paths if relative paths cause issues

---

## Analysis Issues

### Issue: "No completion documents found"

**Symptom:**
```
Error: No completion documents found
```

**Cause:** Missing completion documents

**Solutions:**

1. **Check completion documents exist:**
   ```bash
   ls -la .kiro/specs/*/completion/*.md
   ```

2. **Verify document location:**
   - Expected: `.kiro/specs/[spec-name]/completion/`
   - Format: `task-N-completion.md` or `task-N-parent-completion.md`

3. **Create completion document:**
   ```markdown
   # Task 1 Completion: Feature Name
   
   ## Changes
   - Implemented feature X
   - Added tests
   
   ## Breaking Changes
   None
   ```

4. **Run analysis:**
   ```bash
   npm run release:analyze
   ```

**Prevention:**
- Always create completion documents for completed work
- Follow completion document format standards

---

### Issue: "Version bump calculation failed"

**Symptom:**
```
Error: Version bump calculation failed
Unable to determine version bump from changes
```

**Cause:** Unclear or missing change information

**Solutions:**

1. **Review completion documents:**
   - Ensure changes are clearly described
   - Mark breaking changes explicitly
   - Include feature descriptions

2. **Use manual override:**
   ```bash
   npm run release:cli release manual
   # Follow prompts to specify version bump
   ```

3. **Check analysis output:**
   ```bash
   npm run release:analyze --verbose
   ```

4. **Verify document format:**
   ```markdown
   ## Changes
   - Clear description of changes
   
   ## Breaking Changes
   - BREAKING: Description of breaking change
   ```

**Prevention:**
- Write clear, structured completion documents
- Explicitly mark breaking changes
- Use consistent formatting

---

### Issue: "Extraction accuracy issues"

**Symptom:**
```
Warning: Low confidence in extracted changes
```

**Cause:** Ambiguous or poorly formatted completion documents

**Solutions:**

1. **Improve document structure:**
   ```markdown
   ## Changes
   
   ### New Features
   - Feature 1: Description
   - Feature 2: Description
   
   ### Bug Fixes
   - Fix 1: Description
   - Fix 2: Description
   
   ### Breaking Changes
   - BREAKING: Change description
   - Migration: How to migrate
   ```

2. **Use clear section headers:**
   - Use standard headers: Changes, Breaking Changes, Bug Fixes
   - Avoid ambiguous headers

3. **Provide context:**
   - Explain what changed and why
   - Include before/after examples for breaking changes

**Prevention:**
- Follow completion document templates
- Use clear, descriptive language
- Include migration guidance for breaking changes

---

## Publishing Issues

### Issue: "GitHub release creation failed"

**Symptom:**
```
Error: GitHub release creation failed
API error: 422 Unprocessable Entity
```

**Cause:** Invalid release data or duplicate release

**Solutions:**

1. **Check if release already exists:**
   ```bash
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/owner/repo/releases/tags/v1.0.0
   ```

2. **Delete existing release if needed:**
   ```bash
   # Get release ID
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/owner/repo/releases/tags/v1.0.0 | jq .id
   
   # Delete release
   curl -X DELETE -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/owner/repo/releases/RELEASE_ID
   ```

3. **Verify tag doesn't exist:**
   ```bash
   git tag -l v1.0.0
   ```

4. **Retry release:**
   ```bash
   npm run release:cli release auto
   ```

**Prevention:**
- Check for existing releases before creating
- Use unique version numbers
- System automatically handles duplicates with rollback

---

### Issue: "npm publishing failed"

**Symptom:**
```
Error: npm publishing failed
403 Forbidden - You do not have permission to publish
```

**Cause:** Insufficient npm permissions

**Solutions:**

1. **Verify package ownership:**
   ```bash
   npm owner ls @designerpunk/tokens
   ```

2. **Request publish access:**
   - Contact package owner
   - Request collaborator access

3. **Check package name availability:**
   ```bash
   npm view @designerpunk/tokens
   ```

4. **Verify token permissions:**
   - Token must have publish permission
   - Check token scope matches package scope

**Prevention:**
- Verify permissions before first publish
- Use organization tokens for scoped packages
- Test with dry run first

---

### Issue: "Artifact upload failed"

**Symptom:**
```
Error: Artifact upload failed
File not found: dist/bundle.js
```

**Cause:** Build artifacts missing

**Solutions:**

1. **Verify artifacts exist:**
   ```bash
   ls -la dist/
   ```

2. **Build artifacts:**
   ```bash
   npm run build
   ```

3. **Check artifact paths in configuration:**
   ```json
   {
     "github": {
       "artifacts": [
         "dist/bundle.js",
         "dist/bundle.min.js"
       ]
     }
   }
   ```

4. **Retry release:**
   ```bash
   npm run release:cli release auto
   ```

**Prevention:**
- Build artifacts before release
- Verify artifact paths in configuration
- Add build step to release pipeline

---

## Pipeline Issues

### Issue: "Pipeline stuck in 'in-progress' state"

**Symptom:**
```
Status: in-progress
Current Stage: publishing
```

**Cause:** Process interrupted or hung

**Solutions:**

1. **Check pipeline status:**
   ```bash
   npm run release:cli status
   ```

2. **Review logs:**
   ```bash
   cat .kiro/logs/release-manager.log
   ```

3. **Check for hung processes:**
   ```bash
   ps aux | grep release
   ```

4. **Manual recovery:**
   ```bash
   # Remove state file
   rm -rf .kiro/release-state/
   
   # Retry release
   npm run release:cli release auto
   ```

**Prevention:**
- Monitor release progress
- Use timeouts for long-running operations
- System automatically recovers on next release

---

### Issue: "Rollback failed"

**Symptom:**
```
Error: Rollback failed
Unable to revert git tag
```

**Cause:** Partial rollback failure

**Solutions:**

1. **Check what was rolled back:**
   ```bash
   npm run release:cli status
   ```

2. **Manual rollback steps:**
   ```bash
   # Revert git tag
   git tag -d v1.0.0
   git push origin :refs/tags/v1.0.0
   
   # Revert package.json
   git checkout HEAD -- package.json
   
   # Revert CHANGELOG.md
   git checkout HEAD -- CHANGELOG.md
   ```

3. **Delete GitHub release:**
   ```bash
   # Get release ID
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/owner/repo/releases/tags/v1.0.0 | jq .id
   
   # Delete release
   curl -X DELETE -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/owner/repo/releases/RELEASE_ID
   ```

4. **Unpublish npm package (if possible):**
   ```bash
   npm unpublish @designerpunk/tokens@1.0.0
   ```

**Prevention:**
- Test releases with dry run first
- Verify all prerequisites before release
- System provides automatic rollback for most failures

---

### Issue: "Multi-package coordination conflict"

**Symptom:**
```
Error: Package version conflict detected
@designerpunk/tokens requires @designerpunk/build-system@^1.0.0
but @designerpunk/build-system is at 0.9.0
```

**Cause:** Dependency version mismatch

**Solutions:**

1. **Review dependency relationships:**
   ```bash
   npm run release:cli plan
   ```

2. **Update dependencies:**
   ```bash
   # Update package.json dependencies
   npm install @designerpunk/build-system@latest
   ```

3. **Use synchronized versioning:**
   ```json
   {
     "packages": {
       "coordination": "synchronized"
     }
   }
   ```

4. **Retry release:**
   ```bash
   npm run release:cli release auto
   ```

**Prevention:**
- Use synchronized versioning for tightly coupled packages
- Keep dependencies up to date
- System automatically updates inter-package dependencies

---

## Recovery Procedures

### Procedure 1: Recover from Failed Release

**Scenario:** Release failed mid-process

**Steps:**

1. **Check release status:**
   ```bash
   npm run release:cli status
   ```

2. **Review errors:**
   ```bash
   cat .kiro/logs/release-manager.log
   ```

3. **Fix underlying issue:**
   - Authentication: Update tokens
   - Network: Check connectivity
   - Configuration: Fix invalid settings

4. **System automatically rolls back:**
   - Reverts git tags
   - Reverts package.json changes
   - Reverts CHANGELOG.md changes
   - Deletes GitHub release (if created)

5. **Retry release:**
   ```bash
   npm run release:cli release auto
   ```

---

### Procedure 2: Recover from Interrupted Process

**Scenario:** Process killed or interrupted

**Steps:**

1. **Check pipeline state:**
   ```bash
   npm run release:cli status
   ```

2. **Review what was completed:**
   - Check git tags: `git tag -l`
   - Check package.json version
   - Check CHANGELOG.md
   - Check GitHub releases

3. **Clean up partial state:**
   ```bash
   # Remove state file
   rm -rf .kiro/release-state/
   ```

4. **Retry release:**
   ```bash
   npm run release:cli release auto
   ```

5. **System recovers automatically:**
   - Detects previous failure
   - Rolls back incomplete changes
   - Starts fresh release

---

### Procedure 3: Manual Rollback

**Scenario:** Need to manually rollback a release

**Steps:**

1. **Revert git tag:**
   ```bash
   git tag -d v1.0.0
   git push origin :refs/tags/v1.0.0
   ```

2. **Revert package.json:**
   ```bash
   git checkout HEAD~1 -- package.json
   git commit -m "Revert version bump"
   ```

3. **Revert CHANGELOG.md:**
   ```bash
   git checkout HEAD~1 -- CHANGELOG.md
   git commit -m "Revert changelog update"
   ```

4. **Delete GitHub release:**
   ```bash
   # Via GitHub UI or API
   curl -X DELETE -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/owner/repo/releases/RELEASE_ID
   ```

5. **Unpublish npm package (if within 72 hours):**
   ```bash
   npm unpublish @designerpunk/tokens@1.0.0
   ```

---

## Diagnostic Commands

### Automated Diagnostic Tools

```bash
# Validate complete release setup
npm run validate:release-setup

# Diagnose current issues
npm run diagnose:release-issues
```

These automated tools check:
- Authentication (GitHub and npm tokens)
- Configuration (required settings)
- Environment (Node version, dependencies)
- File structure (completion documents, state directories)
- Git state (uncommitted changes, unpushed commits)
- Log files (recent errors and warnings)
- Pipeline state (stuck or failed releases)

### Check System Status

```bash
# Release pipeline status
npm run release:cli status

# Configuration validation
npm run release:cli config validate

# Show current configuration
npm run release:cli config show
```

### Check Authentication

```bash
# Verify GitHub token
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# Verify npm token
npm whoami --registry https://registry.npmjs.org

# Check token environment variables
echo $GITHUB_TOKEN
echo $NPM_TOKEN
```

### Check Release State

```bash
# Show release plan
npm run release:cli plan

# Run analysis
npm run release:analyze

# Check completion documents
ls -la .kiro/specs/*/completion/*.md

# Check release triggers
ls -la .kiro/release-triggers/
```

### Check Git State

```bash
# Check current version
git describe --tags --abbrev=0

# List all tags
git tag -l

# Check for uncommitted changes
git status

# Check remote
git remote -v
```

### Check Package State

```bash
# Check package.json version
cat package.json | jq .version

# Check CHANGELOG.md
head -20 CHANGELOG.md

# Check build artifacts
ls -la dist/
```

### Check Logs

```bash
# Release manager logs
cat .kiro/logs/release-manager.log

# File organization logs
cat .kiro/logs/file-organization.log

# Recent log entries
tail -50 .kiro/logs/release-manager.log
```

---

## Getting Help

### Resources

- **Usage Guide**: `docs/release-management-guide.md`
- **Configuration Reference**: `docs/configuration-reference.md`
- **GitHub Issues**: https://github.com/3fn/DesignerPunkv2/issues
- **Spec Documents**: `.kiro/specs/release-management-system/`

### Reporting Issues

When reporting issues, include:

1. **Error message**: Full error output
2. **Command used**: Exact command that failed
3. **Configuration**: Sanitized configuration (remove tokens)
4. **Logs**: Relevant log entries
5. **Environment**: Node version, OS, etc.

**Example:**

```
Error: GitHub release creation failed

Command: npm run release:cli release auto

Configuration:
{
  "github": {
    "owner": "3fn",
    "repo": "DesignerPunkv2"
  }
}

Logs:
[2025-11-28 10:30:00] Starting release process
[2025-11-28 10:30:05] Analysis complete
[2025-11-28 10:30:10] Error: GitHub API error 422

Environment:
- Node: v18.17.0
- OS: macOS 14.0
- npm: 9.6.7
```

---

*This guide provides comprehensive troubleshooting information for the Release Management System.*
