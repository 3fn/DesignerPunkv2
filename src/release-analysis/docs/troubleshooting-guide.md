# Troubleshooting Guide

**Date**: October 20, 2025  
**Purpose**: Comprehensive troubleshooting guide for Release Analysis System  
**Organization**: spec-completion  
**Scope**: release-analysis-system  
**Status**: Complete Documentation  

---

## Overview

This guide provides systematic troubleshooting approaches for common issues encountered when using the Release Analysis System. Issues are organized by category with symptoms, causes, and step-by-step solutions.

## Quick Diagnostic Commands

Before diving into specific issues, run these diagnostic commands to gather system information:

```bash
# Check system status
npm run release:analyze -- --validate-config --validate-git --dry-run

# Enable debug logging
DEBUG=release-analysis npm run release:analyze -- --dry-run

# Check configuration
npm run release:analyze config --show

# Verify Git repository state
git status && git log --oneline -10 && git tag -l | tail -5
```

---

## Issue Categories

### 1. No Completion Documents Found

#### Symptoms
```
⚠️  No completion documents found since last release
   Analysis scope: v1.0.0..HEAD (15 commits)
   Searched patterns: *-completion.md, spec-completion-summary.md
   Files found: 0
```

#### Diagnostic Steps

1. **Check file patterns**
   ```bash
   # View current patterns
   npm run release:analyze config --show extraction.completionPatterns
   
   # List actual files in repository
   find . -name "*completion*" -type f
   find . -name "*.md" | grep -i completion
   ```

2. **Verify Git tracking**
   ```bash
   # Check if completion files are committed
   git status
   git ls-files | grep completion
   ```

3. **Check search paths**
   ```bash
   # View Git completion paths
   npm run release:analyze config --show git.completionPaths
   
   # Verify paths exist
   ls -la .kiro/specs/*/completion/ 2>/dev/null || echo "Path not found"
   ```

#### Common Causes and Solutions

##### Cause 1: Incorrect File Patterns

**Problem**: Default patterns don't match your file naming convention

**Solution**:
```bash
# Check your actual file names
find . -name "*.md" | grep -E "(completion|task|spec)" | head -10

# Update patterns to match your files
npm run release:analyze config --set extraction.completionPatterns='["*completion*.md","task-*.md","spec-summary.md"]'

# Test the new patterns
npm run release:analyze -- --dry-run
```

##### Cause 2: Files Not in Git History

**Problem**: Completion documents exist but aren't committed to Git

**Solution**:
```bash
# Check Git status
git status

# Add completion files
git add .kiro/specs/*/completion/
git add docs/completion/

# Commit the files
git commit -m "Add completion documentation"

# Verify files are tracked
git ls-files | grep completion
```

##### Cause 3: Wrong Search Paths

**Problem**: System is looking in wrong directories

**Solution**:
```bash
# Check current search paths
npm run release:analyze config --show git.completionPaths

# Update paths to match your structure
npm run release:analyze config --set git.completionPaths='[".kiro/specs/*/completion/","docs/releases/","CHANGELOG.md"]'

# Verify paths exist
for path in .kiro/specs/*/completion/ docs/releases/; do
  echo "Checking $path:"
  ls -la "$path" 2>/dev/null || echo "  Path not found"
done
```

##### Cause 4: Files Excluded by Patterns

**Problem**: Files are being excluded by exclude patterns

**Solution**:
```bash
# Check exclude patterns
npm run release:analyze config --show git.excludePaths

# Remove problematic exclusions
npm run release:analyze config --set git.excludePaths='["**/node_modules/**","**/dist/**"]'

# Test with specific inclusion
npm run release:analyze -- --include "**/*completion*.md"
```

#### Advanced Diagnostics

```bash
# Enable verbose Git logging
DEBUG=release-analysis:git npm run release:analyze -- --dry-run

# Check file discovery process
DEBUG=release-analysis:collection npm run release:analyze -- --dry-run

# Manual file discovery test
node -e "
const glob = require('glob');
const patterns = ['*-completion.md', 'spec-completion-summary.md'];
patterns.forEach(pattern => {
  console.log(\`Pattern: \${pattern}\`);
  console.log(glob.sync(pattern, { cwd: process.cwd() }));
});
"
```

---

### 2. Low Confidence Scores

#### Symptoms
```
⚠️  Low confidence extraction results
   Average confidence: 45.2%
   Items flagged for review: 8/12
   Uncertain extractions: 5
   
Recommended actions:
- Review flagged items in interactive mode
- Consider adjusting confidence thresholds
- Improve completion document structure
```

#### Diagnostic Steps

1. **Analyze confidence breakdown**
   ```bash
   # Get detailed confidence metrics
   npm run release:analyze -- --format detailed | grep -A 10 "Confidence"
   
   # Check specific low-confidence items
   npm run release:analyze -- --interactive --review-threshold 0.5
   ```

2. **Examine document structure**
   ```bash
   # Look at actual completion documents
   find .kiro/specs/*/completion/ -name "*.md" -exec echo "=== {} ===" \; -exec head -20 {} \;
   ```

3. **Test keyword matching**
   ```bash
   # Check current keywords
   npm run release:analyze config --show extraction
   
   # Test keyword presence in documents
   grep -r "breaking\|feature\|fix" .kiro/specs/*/completion/
   ```

#### Common Causes and Solutions

##### Cause 1: Unstructured Completion Documents

**Problem**: Documents lack clear structure or standard keywords

**Example problematic document**:
```markdown
# Task Completion

I worked on the validation system and made some changes.
The error handling is better now.
Updated some tests too.
```

**Solution**:
```bash
# Use interactive mode to review and categorize
npm run release:analyze -- --interactive

# Lower confidence thresholds temporarily
npm run release:analyze config --set extraction.confidenceThresholds.minimumConfidence=0.4

# Add project-specific keywords
npm run release:analyze config --set extraction.featureKeywords='["implements","creates","builds","adds"]'
```

**Better document structure**:
```markdown
# Task Completion

## New Features
- Implemented enhanced validation system
- Added comprehensive error handling

## Bug Fixes  
- Fixed validation edge cases
- Corrected error message formatting

## Improvements
- Updated test coverage
- Optimized validation performance
```

##### Cause 2: Missing Keywords in Documents

**Problem**: Documents describe changes but don't use recognized keywords

**Solution**:
```bash
# Analyze what words are actually used
grep -r -o -h '\b[a-z]*\(ed\|ing\|s\)\b' .kiro/specs/*/completion/ | sort | uniq -c | sort -nr | head -20

# Add commonly used words as keywords
npm run release:analyze config --set extraction.featureKeywords='["enhanced","improved","updated","created","built"]'

# Add domain-specific keywords
npm run release:analyze config --set extraction.breakingChangeKeywords='["refactored API","changed interface","removed method"]'
```

##### Cause 3: Complex or Ambiguous Language

**Problem**: Documents use complex language that's hard to categorize

**Example**:
```markdown
Refactored the internal architecture to improve maintainability 
while ensuring backward compatibility through adapter patterns.
```

**Solution**:
```bash
# Use interactive mode for manual classification
npm run release:analyze -- --interactive --review-threshold 0.6

# Enable section-based parsing for better structure
npm run release:analyze config --set extraction.sectionParsing.enabled=true

# Adjust confidence thresholds for your content style
npm run release:analyze config --set extraction.confidenceThresholds.uncertaintyThreshold=0.7
```

##### Cause 4: Inconsistent Document Formats

**Problem**: Different completion documents use different formats

**Solution**:
```bash
# Create document template for consistency
cat > .kiro/templates/completion-template.md << 'EOF'
# Task Completion: [Task Name]

## Summary
Brief description of what was accomplished.

## Breaking Changes
- List any breaking changes

## New Features  
- List new features added

## Bug Fixes
- List bugs fixed

## Improvements
- List improvements made

## Documentation
- List documentation changes
EOF

# Enable fallback to pattern matching
npm run release:analyze config --set extraction.sectionParsing.fallbackToPatterns=true
```

#### Advanced Confidence Tuning

```bash
# Analyze confidence distribution
npm run release:analyze -- --format json | jq '.confidence | to_entries[]'

# Test different threshold combinations
for threshold in 0.5 0.6 0.7 0.8; do
  echo "Testing threshold: $threshold"
  npm run release:analyze config --set extraction.confidenceThresholds.minimumConfidence=$threshold
  npm run release:analyze -- --dry-run --format summary | grep "confidence"
done

# Reset to optimal threshold
npm run release:analyze config --set extraction.confidenceThresholds.minimumConfidence=0.65
```

---

### 3. Git Repository Issues

#### Symptoms
```
❌ Git repository error: No release tags found
   Repository: /path/to/project
   Branch: main
   Tags: 0 total, 0 matching pattern
   
❌ Git history analysis failed
   Error: fatal: ambiguous argument 'v1.0.0..HEAD'
```

#### Diagnostic Steps

1. **Check Git repository state**
   ```bash
   # Verify Git repository
   git status
   git remote -v
   git branch -a
   
   # Check tags
   git tag -l
   git tag -l | wc -l
   ```

2. **Verify tag patterns**
   ```bash
   # Check current tag pattern
   npm run release:analyze config --show git.releaseTagPattern
   
   # Test pattern against existing tags
   git tag -l | grep -E "^v?[0-9]+\.[0-9]+\.[0-9]+"
   ```

3. **Check Git history**
   ```bash
   # Verify commit history
   git log --oneline -10
   git rev-list --count HEAD
   ```

#### Common Causes and Solutions

##### Cause 1: No Release Tags Exist

**Problem**: Repository has no release tags

**Solution**:
```bash
# Check if any tags exist
git tag -l

# Create initial release tag
git tag v0.1.0
git push origin v0.1.0

# Or analyze all history
npm run release:analyze -- --since $(git rev-list --max-parents=0 HEAD)

# Or specify a commit manually
npm run release:analyze -- --since abc123f
```

##### Cause 2: Wrong Tag Pattern

**Problem**: Existing tags don't match the expected pattern

**Solution**:
```bash
# Check existing tag formats
git tag -l | head -10

# Common tag formats and their patterns:
# v1.0.0, v2.1.3 → "^v\\d+\\.\\d+\\.\\d+"
# 1.0.0, 2.1.3 → "^\\d+\\.\\d+\\.\\d+"  
# release-1.0.0 → "^release-\\d+\\.\\d+\\.\\d+"
# 2023-12-01 → "^\\d{4}-\\d{2}-\\d{2}"

# Update pattern to match your tags
npm run release:analyze config --set git.releaseTagPattern='"^release-\\d+\\.\\d+\\.\\d+"'

# Test the new pattern
git tag -l | grep -E "^release-[0-9]+\.[0-9]+\.[0-9]+"
```

##### Cause 3: Corrupted Git Repository

**Problem**: Git repository is in an inconsistent state

**Solution**:
```bash
# Check repository integrity
git fsck --full

# Repair common issues
git gc --prune=now
git repack -ad

# If severely corrupted, re-clone
git clone <repository-url> fresh-clone
cd fresh-clone
npm install
npm run release:analyze
```

##### Cause 4: Insufficient Git History

**Problem**: Shallow clone or missing history

**Solution**:
```bash
# Check if repository is shallow
git rev-parse --is-shallow-repository

# Unshallow the repository
git fetch --unshallow

# Or fetch more history
git fetch --depth=1000

# Verify history depth
git rev-list --count HEAD
```

##### Cause 5: Branch Issues

**Problem**: Wrong branch or branch doesn't exist

**Solution**:
```bash
# Check current branch
git branch --show-current

# Switch to correct branch
git checkout main
# or
git checkout master

# Update default branch in config
npm run release:analyze config --set git.defaultBranch='"master"'

# Check remote branches
git branch -r
```

#### Advanced Git Diagnostics

```bash
# Enable Git debug logging
DEBUG=release-analysis:git npm run release:analyze -- --dry-run

# Test Git operations manually
git log --oneline --since="2023-01-01" --until="2023-12-31"
git diff --name-only v1.0.0..HEAD

# Check Git configuration
git config --list | grep -E "(user|remote|branch)"

# Verify Git version compatibility
git --version
```

---

### 4. Version Calculation Errors

#### Symptoms
```
❌ Version calculation failed
   Current version: 1.0.0
   Error: Conflicting change types detected
   
❌ Invalid version format
   Current version: "1.0"
   Expected format: semantic version (x.y.z)
```

#### Diagnostic Steps

1. **Check current version**
   ```bash
   # Check package.json version
   cat package.json | jq '.version'
   
   # Check Git tags
   git describe --tags --abbrev=0
   
   # Check version format
   npm run release:analyze -- --validate-config
   ```

2. **Analyze detected changes**
   ```bash
   # Get detailed change breakdown
   npm run release:analyze -- --format detailed | grep -A 20 "Changes Detected"
   
   # Check for conflicting classifications
   npm run release:analyze -- --interactive
   ```

#### Common Causes and Solutions

##### Cause 1: Conflicting Change Classifications

**Problem**: Same change classified as both breaking and feature

**Solution**:
```bash
# Use interactive mode to resolve conflicts
npm run release:analyze -- --interactive

# Review and reclassify changes manually
# When prompted, choose the most appropriate classification

# Adjust keyword specificity
npm run release:analyze config --set extraction.breakingChangeKeywords='["BREAKING CHANGE","removes API","incompatible change"]'
```

##### Cause 2: Invalid Current Version Format

**Problem**: package.json version doesn't follow semantic versioning

**Solution**:
```bash
# Check current version
cat package.json | jq '.version'

# Fix version format in package.json
npm version 1.0.0 --no-git-tag-version

# Or manually edit package.json
jq '.version = "1.0.0"' package.json > tmp.json && mv tmp.json package.json

# Verify version format
npm run release:analyze -- --validate-config
```

##### Cause 3: Pre-release Version Handling

**Problem**: Current version is pre-release but system doesn't handle it correctly

**Solution**:
```bash
# Check pre-release handling configuration
npm run release:analyze config --show versioning.preReleaseHandling

# Configure pre-release handling
npm run release:analyze config --set versioning.preReleaseHandling='"promote"'
# Options: "increment", "promote", "ignore"

# Test with current pre-release version
npm run release:analyze -- --dry-run
```

##### Cause 4: Custom Version Bump Rules Conflict

**Problem**: Custom rules produce conflicting recommendations

**Solution**:
```bash
# Check custom rules
npm run release:analyze config --show versioning.versionBumpRules

# Disable custom rules temporarily
npm run release:analyze config --set versioning.versionBumpRules.customRules='[]'

# Test with standard rules
npm run release:analyze -- --dry-run

# Fix custom rules logic
npm run release:analyze config --set versioning.versionBumpRules.customRules='[{"condition":"breakingChanges.length > 0","bumpType":"major"}]'
```

#### Version Calculation Debugging

```bash
# Enable version calculation debugging
DEBUG=release-analysis:versioning npm run release:analyze -- --dry-run

# Test version calculation manually
node -e "
const semver = require('semver');
const current = '1.0.0';
console.log('Current:', current);
console.log('Major:', semver.inc(current, 'major'));
console.log('Minor:', semver.inc(current, 'minor'));
console.log('Patch:', semver.inc(current, 'patch'));
"

# Validate semantic versioning
npm run release:analyze config --show versioning.semanticVersioning
```

---

### 5. Configuration Errors

#### Symptoms
```
❌ Configuration validation failed
   Invalid value for extraction.confidenceThresholds.minimumConfidence: "high"
   Expected: number between 0 and 1
   
❌ Configuration file not found or corrupted
   Path: .kiro/release-analysis-config.json
   Error: Unexpected token in JSON
```

#### Diagnostic Steps

1. **Validate configuration syntax**
   ```bash
   # Check JSON syntax
   cat .kiro/release-analysis-config.json | jq . 2>&1 || echo "Invalid JSON"
   
   # Validate configuration
   npm run release:analyze config --validate
   ```

2. **Check configuration file locations**
   ```bash
   # Check configuration file precedence
   ls -la .kiro/release-analysis-config.json 2>/dev/null || echo "Project config not found"
   ls -la .kiro/release-config.json 2>/dev/null || echo "Legacy config not found"
   
   # Show effective configuration
   npm run release:analyze config --show
   ```

#### Common Causes and Solutions

##### Cause 1: Invalid JSON Syntax

**Problem**: Configuration file has syntax errors

**Solution**:
```bash
# Check JSON syntax
cat .kiro/release-analysis-config.json | jq .

# Common JSON errors and fixes:
# Trailing commas → Remove trailing commas
# Unquoted keys → Add quotes around keys
# Single quotes → Use double quotes
# Comments → Remove comments (JSON doesn't support them)

# Backup and fix
cp .kiro/release-analysis-config.json .kiro/release-analysis-config.json.backup
jq . .kiro/release-analysis-config.json.backup > .kiro/release-analysis-config.json

# If unfixable, reset to defaults
npm run release:analyze config --reset
```

##### Cause 2: Invalid Configuration Values

**Problem**: Configuration values are wrong type or out of range

**Solution**:
```bash
# Get detailed validation errors
npm run release:analyze config --validate

# Common fixes:
# String instead of number → "0.7" should be 0.7
# Number out of range → confidence values must be 0-1
# Invalid enum value → check allowed values

# Fix specific values
npm run release:analyze config --set extraction.confidenceThresholds.minimumConfidence=0.7
npm run release:analyze config --set versioning.preReleaseHandling='"increment"'

# Validate after fixes
npm run release:analyze config --validate
```

##### Cause 3: Missing Configuration File

**Problem**: No configuration file exists

**Solution**:
```bash
# Create default configuration
npm run release:analyze config --create-default

# Or create minimal configuration
cat > .kiro/release-analysis-config.json << 'EOF'
{
  "extraction": {
    "confidenceThresholds": {
      "minimumConfidence": 0.7
    }
  },
  "reporting": {
    "defaultFormat": "summary"
  }
}
EOF

# Validate new configuration
npm run release:analyze config --validate
```

##### Cause 4: Configuration Merge Conflicts

**Problem**: Multiple configuration files with conflicting values

**Solution**:
```bash
# Check configuration precedence
echo "Project config:"
cat .kiro/release-analysis-config.json 2>/dev/null || echo "Not found"
echo "Legacy config:"
cat .kiro/release-config.json 2>/dev/null || echo "Not found"

# Show effective merged configuration
npm run release:analyze config --show

# Remove conflicting configuration
mv .kiro/release-config.json .kiro/release-config.json.backup

# Test with single configuration
npm run release:analyze config --validate
```

#### Configuration Recovery

```bash
# Complete configuration reset
npm run release:analyze config --reset

# Backup current configuration
cp .kiro/release-analysis-config.json config-backup-$(date +%Y%m%d).json

# Restore from backup
cp config-backup-20231201.json .kiro/release-analysis-config.json

# Create minimal working configuration
cat > .kiro/release-analysis-config.json << 'EOF'
{
  "extraction": {
    "completionPatterns": ["*-completion.md"],
    "confidenceThresholds": {
      "minimumConfidence": 0.6
    }
  }
}
EOF
```

---

### 6. Performance Issues

#### Symptoms
```
⏳ Analysis taking longer than expected...
   Processed: 45/200 documents
   Estimated time remaining: 5 minutes
   Memory usage: 512MB
   
⚠️  Performance warning: Large repository detected
   Files to process: 1,247
   Estimated processing time: 15+ minutes
```

#### Diagnostic Steps

1. **Check repository size**
   ```bash
   # Count files to be processed
   find . -name "*completion*.md" | wc -l
   find . -name "*.md" | wc -l
   
   # Check file sizes
   find . -name "*completion*.md" -exec ls -lh {} \; | sort -k5 -hr | head -10
   ```

2. **Monitor resource usage**
   ```bash
   # Monitor during analysis
   top -p $(pgrep -f "release-analyze")
   
   # Check disk I/O
   iostat -x 1 5
   ```

3. **Check performance configuration**
   ```bash
   npm run release:analyze config --show performance
   ```

#### Common Causes and Solutions

##### Cause 1: Large Repository with Many Files

**Problem**: Repository contains thousands of files to process

**Solution**:
```bash
# Enable caching
npm run release:analyze config --set performance.enableCaching=true

# Increase concurrency (if you have CPU cores available)
npm run release:analyze config --set performance.maxConcurrency=8

# Exclude large directories
npm run release:analyze config --set git.excludePaths='["**/node_modules/**","**/dist/**","**/coverage/**","**/build/**"]'

# Set file size limits
npm run release:analyze config --set git.maxFileSize='"1MB"'

# Limit commit history
npm run release:analyze config --set git.maxCommits=500
```

##### Cause 2: Large Completion Documents

**Problem**: Individual completion documents are very large

**Solution**:
```bash
# Check largest files
find . -name "*completion*.md" -exec ls -lh {} \; | sort -k5 -hr | head -5

# Set smaller file size limit
npm run release:analyze config --set git.maxFileSize='"500KB"'

# Process files sequentially instead of parallel
npm run release:analyze config --set performance.parallelProcessing=false

# Enable progress reporting to monitor
npm run release:analyze config --set performance.progressReporting=true
```

##### Cause 3: Network or Disk I/O Issues

**Problem**: Slow disk or network affecting Git operations

**Solution**:
```bash
# Increase Git timeout
npm run release:analyze config --set git.gitOptions.timeout=60000

# Disable parallel processing
npm run release:analyze config --set performance.parallelProcessing=false

# Use local cache directory on faster disk
npm run release:analyze config --set performance.cacheDirectory='"/tmp/release-analysis-cache"'

# Test with dry-run mode
npm run release:analyze -- --dry-run
```

##### Cause 4: Memory Issues

**Problem**: System running out of memory during processing

**Solution**:
```bash
# Set memory limits
npm run release:analyze config --set performance.memoryLimits.maxTotalMemory='"256MB"'
npm run release:analyze config --set performance.memoryLimits.maxDocumentSize='"5MB"'

# Reduce concurrency
npm run release:analyze config --set performance.maxConcurrency=2

# Enable garbage collection
npm run release:analyze config --set performance.memoryLimits.gcThreshold=0.7

# Run with Node.js memory limit
node --max-old-space-size=1024 src/release-analysis/cli/release-analyze.ts
```

#### Performance Optimization

```bash
# Benchmark current performance
time npm run release:analyze -- --dry-run

# Test different concurrency levels
for concurrency in 1 2 4 8; do
  echo "Testing concurrency: $concurrency"
  npm run release:analyze config --set performance.maxConcurrency=$concurrency
  time npm run release:analyze -- --dry-run
done

# Optimal configuration for large repositories
npm run release:analyze config --set performance.enableCaching=true
npm run release:analyze config --set performance.parallelProcessing=true
npm run release:analyze config --set performance.maxConcurrency=4
npm run release:analyze config --set git.maxCommits=1000
npm run release:analyze config --set git.maxFileSize='"2MB"'
```

---

### 7. Interactive Mode Issues

#### Symptoms
```
❌ Interactive mode failed to start
   Error: stdin is not a TTY
   
⚠️  Interactive prompts not responding
   Waiting for user input...
   (No response to prompts)
```

#### Common Causes and Solutions

##### Cause 1: Non-Interactive Environment

**Problem**: Running in CI/CD or non-TTY environment

**Solution**:
```bash
# Use non-interactive mode
npm run release:analyze -- --skip-confirmation

# Use auto-approve for uncertain items
npm run release:analyze -- --auto-approve

# Pre-configure for CI/CD
npm run release:analyze config --set validation.strictMode=false
```

##### Cause 2: Terminal Compatibility Issues

**Problem**: Terminal doesn't support interactive features

**Solution**:
```bash
# Test terminal capabilities
echo $TERM
tty

# Use basic terminal mode
TERM=xterm npm run release:analyze -- --interactive

# Disable interactive features
npm run release:analyze -- --format json --skip-confirmation
```

---

## System-Level Troubleshooting

### Environment Validation

```bash
# Check Node.js version (requires 16+)
node --version

# Check npm version
npm --version

# Check Git version (requires 2.0+)
git --version

# Check available memory
free -h

# Check disk space
df -h .
```

### Dependency Issues

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for missing dependencies
npm ls

# Update dependencies
npm update

# Check for security issues
npm audit
```

### Permission Issues

```bash
# Check file permissions
ls -la .kiro/
ls -la .kiro/specs/

# Fix permissions
chmod -R 755 .kiro/
chmod 644 .kiro/release-analysis-config.json

# Check Git permissions
git config --list | grep -E "(user|core)"
```

---

## Debug Mode and Logging

### Enable Debug Logging

```bash
# Enable all debug logging
DEBUG=release-analysis* npm run release:analyze

# Enable specific component logging
DEBUG=release-analysis:git npm run release:analyze
DEBUG=release-analysis:extraction npm run release:analyze
DEBUG=release-analysis:versioning npm run release:analyze

# Save debug output to file
DEBUG=release-analysis* npm run release:analyze 2> debug.log

# Enable verbose output
npm run release:analyze -- --verbose
```

### Log Analysis

```bash
# Search for specific errors
grep -i error debug.log
grep -i warning debug.log

# Check timing information
grep -i "took\|duration\|time" debug.log

# Check file processing
grep -i "processing\|analyzing" debug.log
```

---

## Getting Additional Help

### Create Minimal Reproduction

1. **Isolate the issue**
   ```bash
   # Create minimal test case
   mkdir test-release-analysis
   cd test-release-analysis
   git init
   echo '{"version": "1.0.0"}' > package.json
   mkdir -p .kiro/specs/test/completion
   echo "# Test completion" > .kiro/specs/test/completion/task-1-completion.md
   git add . && git commit -m "Initial commit"
   git tag v1.0.0
   ```

2. **Document the issue**
   - Exact command that fails
   - Complete error message
   - System information (OS, Node.js version, Git version)
   - Configuration file contents
   - Debug log output

3. **Test with defaults**
   ```bash
   # Reset configuration
   npm run release:analyze config --reset
   
   # Test with minimal configuration
   echo '{}' > .kiro/release-analysis-config.json
   npm run release:analyze -- --dry-run
   ```

### System Information Collection

```bash
# Collect system information
cat > system-info.txt << EOF
System Information:
OS: $(uname -a)
Node.js: $(node --version)
npm: $(npm --version)
Git: $(git --version)
PWD: $(pwd)
Date: $(date)

Repository Information:
Branch: $(git branch --show-current)
Commits: $(git rev-list --count HEAD)
Tags: $(git tag -l | wc -l)
Status: $(git status --porcelain | wc -l) files changed

Configuration:
$(npm run release:analyze config --show 2>/dev/null || echo "Configuration error")
EOF

cat system-info.txt
```

This troubleshooting guide provides systematic approaches to diagnosing and resolving common issues with the Release Analysis System. Most problems can be resolved by following the diagnostic steps and applying the appropriate solutions based on the specific symptoms and causes identified.