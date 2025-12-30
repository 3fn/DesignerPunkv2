# Migration Guide: Integrating Release Management System

**Difficulty**: Intermediate  
**Time**: 30-45 minutes  
**Prerequisites**: Existing project with version control  
**Last Reviewed**: 2025-12-30

---

## Overview

This guide helps you migrate from your existing release process to the automated Release Management System. Whether you're using manual releases, semantic-release, or another existing system, this guide provides a smooth migration path.

## Pre-Migration Checklist

Before starting migration, ensure you have:

- ✅ **Backup**: Full backup of your repository
- ✅ **Clean State**: No uncommitted changes
- ✅ **Tests Passing**: All tests pass
- ✅ **Documentation**: Current release process documented
- ✅ **Team Alignment**: Team aware of migration plan

## Migration Strategies

### Strategy 1: Gradual Migration (Recommended)

Migrate incrementally over several releases:

**Phase 1: Analysis Only** (1-2 weeks)
- Install release management system
- Use for analysis only
- Compare with existing process
- Build confidence

**Phase 2: Parallel Running** (2-4 weeks)
- Run both old and new systems
- Use new system for dry runs
- Verify consistency
- Train team

**Phase 3: Full Migration** (1 week)
- Switch to new system
- Deprecate old process
- Monitor closely
- Keep rollback plan ready

### Strategy 2: Direct Migration

Migrate in a single release:

**Best for:**
- Small teams
- Simple release processes
- High confidence in new system
- Urgent need for automation

## Step-by-Step Migration

### Step 1: Install and Configure

#### 1.1 Install Dependencies

```bash
# No additional dependencies needed
# System uses existing Node.js and Git
```

#### 1.2 Create Directory Structure

```bash
mkdir -p .kiro/specs
mkdir -p .kiro/logs
mkdir -p .kiro/release-triggers
mkdir -p .kiro/release-state
```

#### 1.3 Create Configuration

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

#### 1.4 Add Scripts to package.json

```json
{
  "scripts": {
    "release:analyze": "ts-node src/release-analysis/cli/AdvancedReleaseCLI.ts",
    "release:cli": "ts-node src/release/cli/ReleaseCLI.ts",
    "release:old": "your-existing-release-command"
  }
}
```

### Step 2: Preserve Existing Release History

#### 2.1 Keep Existing CHANGELOG.md

The system will append to your existing CHANGELOG:

```markdown
# Changelog

## [1.5.0] - 2025-11-28 (NEW - Automated)
- Integrated release management system
- Automated version bumping

## [1.4.0] - 2025-11-15 (OLD - Manual)
- Added feature X
- Fixed bug Y

## [1.3.0] - 2025-11-01 (OLD - Manual)
- Initial release
```

#### 2.2 Keep Existing Git Tags

Existing tags remain unchanged:

```bash
# Existing tags
v1.0.0
v1.1.0
v1.2.0

# New tags (after migration)
v1.3.0  # First automated release
v1.4.0
```

#### 2.3 Keep Existing GitHub Releases

Previous releases remain intact. New releases created by automation.

### Step 3: Create Migration Completion Document

Document the migration itself:

Create `.kiro/specs/release-system-migration/completion/task-1-completion.md`:

```markdown
# Task 1 Completion: Release Management System Migration

**Date**: 2025-11-28
**Task**: 1. Migrate to automated release management
**Type**: Implementation
**Status**: Complete

---

## Changes

### New Features
- Integrated automated release management system
- Added release analysis capabilities
- Configured GitHub and npm publishing
- Set up completion document workflow

### Improvements
- Automated version bumping
- Automated release note generation
- Streamlined release process
- Improved release consistency

### Migration Details
- Previous release process: [describe old process]
- New release process: Automated via completion documents
- Preserved release history: All previous releases intact
- Team training: [date] training session completed

## Breaking Changes

None - migration is additive, doesn't affect existing functionality

## Validation (Tier 2: Standard)

✅ Configuration validated
✅ Scripts added to package.json
✅ Environment variables configured
✅ Directory structure created
✅ Existing release history preserved
✅ Team trained on new process
```

### Step 4: Test Migration

#### 4.1 Validate Configuration

```bash
npm run release:cli config validate
```

#### 4.2 Run Analysis

```bash
npm run release:analyze
```

**Expected output:**
```
📊 Release Analysis

Current Version: 1.4.0
Recommended Version: 1.5.0
Bump Type: minor

Changes Detected:
  - New Features: 4 (migration features)
  - Improvements: 4
```

#### 4.3 Preview Release Plan

```bash
npm run release:cli plan
```

#### 4.4 Dry Run

```bash
npm run release:cli release auto --dry-run
```

### Step 5: Execute First Automated Release

```bash
# Execute first automated release
npm run release:cli release auto
```

**This release will:**
- Bump version (1.4.0 → 1.5.0)
- Update CHANGELOG.md (append to existing)
- Create git tag (v1.5.0)
- Create GitHub release
- Publish to npm

### Step 6: Verify Migration

#### 6.1 Check Version

```bash
cat package.json | grep version
# Should show new version
```

#### 6.2 Check CHANGELOG

```bash
head -30 CHANGELOG.md
# Should show new release appended to existing
```

#### 6.3 Check GitHub

Visit: `https://github.com/your-org/your-repo/releases`
- Verify new release created
- Verify old releases still present

#### 6.4 Check npm

```bash
npm view your-package versions
# Should show all versions including new one
```

## Migrating from Specific Tools

### From semantic-release

**Differences:**
- semantic-release: Analyzes commit messages
- Release Management: Analyzes completion documents

**Migration:**
1. Keep semantic-release config for reference
2. Create completion documents for future work
3. Run both systems in parallel initially
4. Switch to Release Management when confident

**Configuration comparison:**
```json
// semantic-release (.releaserc.json)
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator"
  ]
}

// Release Management (.kiro/release-config.json)
{
  "github": { "owner": "...", "repo": "..." },
  "validation": { "requireCompletionDocs": true }
}
```

### From Lerna

**Differences:**
- Lerna: Monorepo version management
- Release Management: Monorepo + automated analysis

**Migration:**
1. Keep lerna.json for reference
2. Configure multi-package coordination
3. Create completion documents per package
4. Test with independent versioning

**Configuration:**
```json
// lerna.json
{
  "version": "independent",
  "packages": ["packages/*"]
}

// .kiro/release-config.json
{
  "packages": {
    "coordination": "independent",
    "packages": [
      { "name": "@org/pkg1", "path": "./packages/pkg1" },
      { "name": "@org/pkg2", "path": "./packages/pkg2" }
    ]
  }
}
```

### From Manual Releases

**Differences:**
- Manual: Human decides version, writes notes
- Automated: System analyzes completion docs

**Migration:**
1. Document current manual process
2. Create completion document template
3. Train team on completion documents
4. Start with dry runs
5. Gradually automate

**Process comparison:**
```markdown
// Manual Process
1. Decide version bump
2. Update package.json manually
3. Write CHANGELOG manually
4. Create git tag manually
5. Create GitHub release manually
6. Publish to npm manually

// Automated Process
1. Create completion document
2. Run: npm run release:cli release auto
   (Everything else automated)
```

## Common Migration Issues

### Issue 1: Existing CHANGELOG Format Different

**Problem:** Your CHANGELOG uses different format

**Solution:** System appends in standard format. Old entries remain unchanged:

```markdown
# Changelog

## [1.5.0] - 2025-11-28 (NEW FORMAT)
### New Features
- Feature A

## 1.4.0 (2025-11-15) (OLD FORMAT)
* Feature B
* Feature C
```

### Issue 2: Version Number Conflicts

**Problem:** System suggests version that conflicts with existing

**Solution:** System respects existing tags and continues from current version

### Issue 3: Team Not Familiar with Completion Documents

**Problem:** Team doesn't know how to write completion documents

**Solution:**
1. Provide training session
2. Create completion document template
3. Review first few documents together
4. Build confidence gradually

### Issue 4: Want to Keep Old Process for Some Releases

**Problem:** Need flexibility to use old process sometimes

**Solution:** Keep both scripts:

```json
{
  "scripts": {
    "release": "npm run release:cli release auto",
    "release:old": "your-old-release-command"
  }
}
```

## Rollback Plan

If migration causes issues:

### Immediate Rollback

```bash
# 1. Revert to previous version
git reset --hard HEAD~1

# 2. Delete new tag
git tag -d v1.5.0
git push origin :refs/tags/v1.5.0

# 3. Delete GitHub release (manual)
# Visit GitHub releases page and delete

# 4. Unpublish from npm (if needed)
npm unpublish your-package@1.5.0
```

### Long-term Rollback

```bash
# 1. Remove configuration
rm .kiro/release-config.json

# 2. Remove scripts from package.json
# Delete release:analyze and release:cli scripts

# 3. Return to old process
# Use your previous release workflow
```

## Post-Migration

### Week 1: Monitor Closely

- Watch for issues
- Gather team feedback
- Document learnings
- Adjust process as needed

### Week 2-4: Optimize

- Refine completion document templates
- Improve team workflow
- Automate more steps
- Integrate with CI/CD

### Month 2+: Full Adoption

- Deprecate old process
- Remove old scripts
- Update team documentation
- Share learnings with team

## Getting Help

### Resources

- [First Release Tutorial](../tutorials/01-first-release.md)
- [Configuration Reference](../../configuration-reference.md)
- [Troubleshooting Guide](../../troubleshooting-guide.md)

### Support

- GitHub Issues: Report bugs or request features
- Documentation: Comprehensive guides and examples
- Community: Share experiences with other users

---

**Back to Examples**: [README](../README.md)

