# Usage Guide

**Date**: October 20, 2025  
**Purpose**: Complete usage guide with practical examples  
**Organization**: spec-completion  
**Scope**: release-analysis-system  
**Status**: Complete Documentation  

---

## Overview

This guide provides step-by-step instructions for using the Release Analysis System effectively. It covers everything from basic usage to advanced workflows, with practical examples and best practices.

## Getting Started

### Prerequisites

- Node.js 16 or higher
- Git repository with commit history
- Completion documents following the project's documentation standards

### Basic Setup

1. **Verify Installation**
   ```bash
   # Check if the system is available
   npm run release:analyze help
   
   # Verify configuration
   npm run release:analyze config --show
   ```

2. **First Analysis**
   ```bash
   # Run basic analysis
   npm run release:analyze
   
   # Preview without full processing
   npm run release:analyze -- --dry-run
   ```

3. **Check Results**
   ```bash
   # Get detailed output
   npm run release:analyze -- --format detailed
   
   # Save results to file
   npm run release:analyze -- --format detailed --output analysis-report.md
   ```

## Basic Usage Patterns

### Daily Development Workflow

#### 1. Complete Development Work
```bash
# After completing a task, create completion documentation
cat > .kiro/specs/user-auth/completion/task-1-completion.md << 'EOF'
# Task 1 Completion: User Authentication System

## New Features
- Implemented JWT-based authentication
- Added user registration and login endpoints
- Created password hashing with bcrypt

## Bug Fixes
- Fixed session timeout handling
- Corrected password validation regex

## Improvements
- Enhanced error messages for authentication failures
- Optimized token refresh mechanism
EOF

# Commit the completion documentation
git add .kiro/specs/user-auth/completion/
git commit -m "Add user authentication completion documentation"
```

#### 2. Preview Changes
```bash
# Quick preview of what would be analyzed
npm run release:analyze -- --dry-run

# Expected output:
# ✅ Analysis Preview
#    Scope: v1.0.0..HEAD (5 commits)
#    Documents found: 1
#    Estimated changes: 3 features, 2 fixes, 1 improvement
```

#### 3. Analyze for Release
```bash
# Full analysis with detailed output
npm run release:analyze -- --format detailed

# Expected output:
# 📊 Release Analysis Results
# ========================================
# 
# 🎯 Version Recommendation: 1.1.0 (minor)
# 📅 Analysis Date: 2025-10-20
# 🔍 Confidence: 85.2%
# 
# 📋 Changes Detected:
# 
# ## New Features (3)
# - Implemented JWT-based authentication
# - Added user registration and login endpoints  
# - Created password hashing with bcrypt
# 
# ## Bug Fixes (2)
# - Fixed session timeout handling
# - Corrected password validation regex
# 
# ## Improvements (1)
# - Enhanced error messages for authentication failures
```### We
ekly Release Preparation

#### 1. Comprehensive Analysis
```bash
# Analyze all changes since last release
npm run release:analyze -- --format detailed --include-evidence

# Review uncertain items interactively
npm run release:analyze -- --interactive --review-threshold 0.7
```

#### 2. Generate Release Notes
```bash
# Create formatted release notes
npm run release:analyze -- --format detailed --output RELEASE_NOTES.md

# Generate JSON for programmatic use
npm run release:analyze -- --format json --output release-data.json
```

#### 3. Validate Release
```bash
# Ensure all quality gates pass
npm run release:analyze -- --validate-config --validate-git

# Check for any issues
npm run release:analyze -- --format summary | grep -E "(warning|error)"
```

## Advanced Usage Patterns

### Interactive Review Workflow

When you need to review and refine the analysis results:

```bash
# Start interactive mode
npm run release:analyze -- --interactive --format detailed

# Interactive prompts will guide you through:
# 1. Reviewing uncertain changes
# 2. Resolving duplicate detections  
# 3. Confirming version bump recommendations
```

#### Example Interactive Session
```
🔍 Analyzing changes since v1.0.0...

⚠️  Found 2 ambiguous items requiring review:

1. "Updated error handling" - unclear if breaking change
   Source: .kiro/specs/validation/completion/task-2-completion.md:15
   Confidence: 65%
   
   Current classification: Improvement
   Suggested alternatives:
   - Bug Fix (if fixing existing errors)
   - Breaking Change (if changing error format)
   
   Action: (k)eep current, (c)hange to bug fix, (b)reaking change, (s)kip: c

2. "Refactored internal API" - potential breaking change
   Source: .kiro/specs/api/completion/task-3-completion.md:8
   Confidence: 58%
   
   Current classification: Improvement  
   Suggested alternatives:
   - Breaking Change (if public API affected)
   - Improvement (if internal only)
   
   Action: (k)eep current, (b)reaking change, (s)kip: k

🔄 Found 1 potential duplicate:

Items with 87% similarity:
- "Enhanced validation system" 
- "Improved validation logic"

Action: (m)erge items, (s)eparate, (r)eview details: m
Merged description: "Enhanced validation system with improved logic"

✅ Review complete! 

📊 Final Results:
Version Recommendation: 1.1.0 (minor)
- 3 new features
- 3 bug fixes (1 reclassified)
- 2 improvements (1 merged)
- 0 breaking changes

Proceed with this analysis? (y/n): y
```

### Custom Scope Analysis

#### Analyze Specific Time Periods
```bash
# Analyze changes since specific date
npm run release:analyze -- --since $(git log --since="2023-10-01" --format="%H" | tail -1)

# Analyze changes between specific versions
npm run release:analyze -- --since v1.0.0 --until v1.1.0

# Analyze specific commit range
npm run release:analyze -- --since abc123f --until def456g
```

#### Analyze Specific File Patterns
```bash
# Include only specific completion patterns
npm run release:analyze -- --include "**/*auth*completion*.md"

# Exclude draft or temporary documents
npm run release:analyze -- --exclude "**/draft*" --exclude "**/temp*"

# Analyze specific directories
npm run release:analyze -- --include ".kiro/specs/core-features/completion/*.md"
```

### Configuration Management Workflow

#### View and Modify Configuration
```bash
# Show complete configuration
npm run release:analyze config --show

# Show specific section
npm run release:analyze config --show extraction.confidenceThresholds

# Modify confidence thresholds
npm run release:analyze config --set extraction.confidenceThresholds.minimumConfidence=0.8

# Add custom keywords
npm run release:analyze config --set extraction.featureKeywords='["implements","creates","builds","adds","introduces"]'
```

#### Project-Specific Configuration
```bash
# Create project-specific configuration
cat > .kiro/release-analysis-config.json << 'EOF'
{
  "extraction": {
    "completionPatterns": [
      ".kiro/specs/*/completion/*-completion.md",
      "docs/releases/*.md"
    ],
    "confidenceThresholds": {
      "minimumConfidence": 0.75,
      "reviewThreshold": 0.8
    }
  },
  "reporting": {
    "defaultFormat": "detailed",
    "includeEvidence": true
  }
}
EOF

# Validate new configuration
npm run release:analyze config --validate
```

## Output Format Examples

### Summary Format
```bash
npm run release:analyze -- --format summary
```

**Output:**
```
📊 Release Analysis Summary
========================================
Version Recommendation: 1.2.0 (minor)
Analysis Date: 2025-10-20T14:30:00Z
Confidence: 82.5%

Changes Summary:
- 4 new features
- 2 bug fixes  
- 1 improvement
- 0 breaking changes

Recommendation: Proceed with minor version release
```

### Detailed Format
```bash
npm run release:analyze -- --format detailed
```

**Output:**
```
📊 Release Analysis Results
========================================

🎯 Version Recommendation: 1.2.0 (minor)
📅 Analysis Date: 2025-10-20T14:30:00Z
🔍 Overall Confidence: 82.5%
📁 Documents Analyzed: 3
⏱️  Processing Time: 2.3 seconds

📋 Changes Detected:

## 🆕 New Features (4)
1. **User Authentication System** (Confidence: 95%)
   - Implemented JWT-based authentication
   - Added user registration and login endpoints
   - Source: .kiro/specs/auth/completion/task-1-completion.md

2. **Password Security Enhancement** (Confidence: 88%)
   - Created password hashing with bcrypt
   - Added password strength validation
   - Source: .kiro/specs/auth/completion/task-1-completion.md

3. **API Rate Limiting** (Confidence: 92%)
   - Implemented request rate limiting
   - Added configurable rate limit thresholds
   - Source: .kiro/specs/api/completion/task-2-completion.md

4. **User Profile Management** (Confidence: 85%)
   - Added user profile CRUD operations
   - Implemented profile image upload
   - Source: .kiro/specs/profiles/completion/task-3-completion.md

## 🐛 Bug Fixes (2)
1. **Session Timeout Handling** (Confidence: 90%)
   - Fixed session timeout handling
   - Corrected token refresh mechanism
   - Source: .kiro/specs/auth/completion/task-1-completion.md

2. **Validation Error Messages** (Confidence: 87%)
   - Corrected password validation regex
   - Fixed error message formatting
   - Source: .kiro/specs/auth/completion/task-1-completion.md

## ⚡ Improvements (1)
1. **Error Message Enhancement** (Confidence: 78%)
   - Enhanced error messages for authentication failures
   - Improved user experience for validation errors
   - Source: .kiro/specs/auth/completion/task-1-completion.md

📈 Version Bump Rationale:
- New features detected → Minor version bump required
- No breaking changes → Major version bump not needed
- Bug fixes present → Patch would be insufficient

🎯 Confidence Breakdown:
- Feature detection: 90.0%
- Bug fix detection: 88.5%
- Breaking change detection: 95.0%
- Overall extraction: 82.5%

✅ Quality Gates:
- Minimum confidence (70%): ✅ PASS (82.5%)
- Required documents (1): ✅ PASS (3 found)
- Processing time (300s): ✅ PASS (2.3s)
```#
## JSON Format
```bash
npm run release:analyze -- --format json
```

**Output:**
```json
{
  "analysisId": "analysis-1640995200000",
  "timestamp": "2025-10-20T14:30:00.000Z",
  "scope": {
    "fromTag": "v1.0.0",
    "toCommit": "abc123f",
    "completionDocuments": [
      ".kiro/specs/auth/completion/task-1-completion.md",
      ".kiro/specs/api/completion/task-2-completion.md",
      ".kiro/specs/profiles/completion/task-3-completion.md"
    ],
    "analysisDate": "2025-10-20T14:30:00.000Z"
  },
  "versionRecommendation": {
    "currentVersion": "1.0.0",
    "recommendedVersion": "1.2.0",
    "bumpType": "minor",
    "rationale": "New features detected require minor version bump. No breaking changes found.",
    "confidence": 0.825,
    "evidence": [
      {
        "type": "feature",
        "description": "User Authentication System",
        "source": ".kiro/specs/auth/completion/task-1-completion.md",
        "impact": "high"
      }
    ]
  },
  "changes": {
    "newFeatures": [
      {
        "id": "feature-1",
        "title": "User Authentication System",
        "description": "Implemented JWT-based authentication with user registration and login endpoints",
        "source": ".kiro/specs/auth/completion/task-1-completion.md",
        "confidence": 0.95,
        "category": "authentication"
      }
    ],
    "bugFixes": [
      {
        "id": "fix-1", 
        "title": "Session Timeout Handling",
        "description": "Fixed session timeout handling and token refresh mechanism",
        "source": ".kiro/specs/auth/completion/task-1-completion.md",
        "confidence": 0.90,
        "severity": "medium"
      }
    ],
    "improvements": [
      {
        "id": "improvement-1",
        "title": "Error Message Enhancement", 
        "description": "Enhanced error messages for authentication failures",
        "source": ".kiro/specs/auth/completion/task-1-completion.md",
        "confidence": 0.78,
        "impact": "low"
      }
    ],
    "breakingChanges": [],
    "documentation": []
  },
  "confidence": {
    "overall": 0.825,
    "featureDetection": 0.90,
    "bugFixDetection": 0.885,
    "breakingChangeDetection": 0.95,
    "extraction": 0.825
  },
  "metadata": {
    "documentsAnalyzed": 3,
    "processingTime": 2300,
    "extractionMethod": "pattern-based",
    "deduplicationApplied": true,
    "uncertainItems": 1,
    "filteredItems": 0
  },
  "releaseNotes": "## Release 1.2.0\n\n### New Features\n- User Authentication System\n- Password Security Enhancement\n- API Rate Limiting\n- User Profile Management\n\n### Bug Fixes\n- Session Timeout Handling\n- Validation Error Messages\n\n### Improvements\n- Error Message Enhancement"
}
```

## Common Workflows

### Pre-Release Checklist

1. **Validate Repository State**
   ```bash
   # Ensure all completion documents are committed
   git status | grep -E "(completion|tasks\.md)" || echo "All completion docs committed"
   
   # Verify Git history is clean
   git log --oneline -5
   ```

2. **Run Comprehensive Analysis**
   ```bash
   # Full analysis with validation
   npm run release:analyze -- --format detailed --validate-config --validate-git
   ```

3. **Review Results**
   ```bash
   # Interactive review if needed
   npm run release:analyze -- --interactive --review-threshold 0.75
   
   # Generate final release notes
   npm run release:analyze -- --format detailed --output RELEASE_NOTES.md
   ```

4. **Create Release**
   ```bash
   # Update package.json version
   npm version 1.2.0 --no-git-tag-version
   
   # Create and push release tag
   git add package.json RELEASE_NOTES.md
   git commit -m "Release 1.2.0"
   git tag v1.2.0
   git push origin main --tags
   ```

### Hotfix Release Workflow

1. **Create Hotfix Branch**
   ```bash
   git checkout -b hotfix/critical-security-fix
   ```

2. **Implement Fix and Document**
   ```bash
   # After implementing the fix
   cat > .kiro/specs/security/completion/hotfix-completion.md << 'EOF'
   # Hotfix Completion: Critical Security Fix
   
   ## Bug Fixes
   - Fixed SQL injection vulnerability in user search
   - Added input sanitization for all user inputs
   
   ## Security Improvements
   - Enhanced parameter validation
   - Added security audit logging
   EOF
   
   git add .
   git commit -m "Fix critical security vulnerability"
   ```

3. **Analyze Hotfix**
   ```bash
   # Analyze changes since last release
   npm run release:analyze -- --format detailed
   
   # Should recommend patch version (1.2.1)
   ```

4. **Release Hotfix**
   ```bash
   # Merge to main and release
   git checkout main
   git merge hotfix/critical-security-fix
   npm version patch
   git push origin main --tags
   ```

### Feature Branch Analysis

1. **Analyze Feature Branch**
   ```bash
   # Switch to feature branch
   git checkout feature/user-profiles
   
   # Analyze changes compared to main
   npm run release:analyze -- --since main --format detailed
   ```

2. **Preview Impact**
   ```bash
   # See what the impact would be when merged
   npm run release:analyze -- --dry-run --format summary
   ```

3. **Prepare for Merge**
   ```bash
   # Ensure completion documentation is ready
   npm run release:analyze -- --validate-config
   
   # Generate preview release notes
   npm run release:analyze -- --format detailed --output feature-impact.md
   ```

## Best Practices

### Completion Document Quality

1. **Use Clear Structure**
   ```markdown
   # Task Completion: [Descriptive Title]
   
   ## Breaking Changes
   - List any breaking changes with migration guidance
   
   ## New Features
   - Describe new functionality and benefits
   
   ## Bug Fixes
   - List bugs fixed with brief descriptions
   
   ## Improvements
   - List enhancements and optimizations
   
   ## Documentation
   - List documentation updates
   ```

2. **Include Context**
   ```markdown
   ## New Features
   - **User Authentication System**: Implemented JWT-based authentication 
     with secure token handling and automatic refresh capabilities.
     Supports both email/password and OAuth providers.
   ```

3. **Be Specific About Impact**
   ```markdown
   ## Breaking Changes
   - **API Response Format Change**: Modified user profile API response 
     structure. The `user_name` field is now `username`. 
     Migration: Update client code to use new field name.
   ```

### Configuration Optimization

1. **Adjust Confidence Thresholds**
   ```bash
   # For strict analysis (fewer false positives)
   npm run release:analyze config --set extraction.confidenceThresholds.minimumConfidence=0.8
   
   # For inclusive analysis (catch more changes)
   npm run release:analyze config --set extraction.confidenceThresholds.minimumConfidence=0.6
   ```

2. **Customize Keywords for Your Domain**
   ```bash
   # Add domain-specific feature keywords
   npm run release:analyze config --set extraction.featureKeywords='["implements","creates","adds","introduces","enables","supports"]'
   
   # Add project-specific breaking change indicators
   npm run release:analyze config --set extraction.breakingChangeKeywords='["BREAKING","API change","removes support","incompatible"]'
   ```

3. **Optimize Performance**
   ```bash
   # Enable caching for large repositories
   npm run release:analyze config --set performance.enableCaching=true
   
   # Adjust concurrency based on system
   npm run release:analyze config --set performance.maxConcurrency=6
   ```

### Troubleshooting Common Issues

1. **No Changes Detected**
   ```bash
   # Check if completion documents exist and are committed
   find . -name "*completion*.md" -newer .git/refs/tags/$(git describe --tags --abbrev=0)
   
   # Verify file patterns match your documents
   npm run release:analyze config --show extraction.completionPatterns
   ```

2. **Low Confidence Scores**
   ```bash
   # Use interactive mode to review and improve
   npm run release:analyze -- --interactive --review-threshold 0.6
   
   # Add project-specific keywords
   npm run release:analyze config --set extraction.featureKeywords='["your","custom","keywords"]'
   ```

3. **Performance Issues**
   ```bash
   # Enable debug logging to identify bottlenecks
   DEBUG=release-analysis npm run release:analyze -- --dry-run
   
   # Exclude large directories
   npm run release:analyze config --set git.excludePaths='["**/node_modules/**","**/dist/**","**/coverage/**"]'
   ```

This usage guide provides comprehensive examples and workflows for effectively using the Release Analysis System in various development scenarios. The examples demonstrate both basic and advanced usage patterns to help users get the most value from the system.