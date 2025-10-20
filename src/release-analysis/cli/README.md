# Advanced Release Analysis CLI

Enhanced command-line interface for the Release Analysis System with interactive features, configuration management, analysis history, and advanced workflow capabilities.

## Features

### 🔍 Interactive Analysis Mode
- Review uncertain changes with human oversight
- Interactive confirmation for major version bumps
- Auto-approval options for streamlined workflows
- Configurable confidence thresholds for review triggers

### 🔧 Configuration Management
- View and modify analysis configuration
- Validate configuration settings
- Reset to default configuration
- Support for nested configuration keys

### 📊 Analysis History
- Track previous analyses with timestamps
- Compare current analysis with historical results
- View detailed information about past analyses
- Clear analysis history when needed

### 🎯 Dry-run and Preview
- Preview analysis scope before full extraction
- Validate Git repository state and document availability
- Confirm analysis parameters before execution
- Skip time-consuming operations during exploration

## Installation

The Advanced CLI is part of the Release Analysis System. Ensure all dependencies are installed:

```bash
npm install
```

## Usage

### Basic Analysis

```bash
# Standard analysis
npm run release:analyze

# Analysis with detailed output
npm run release:analyze --format detailed

# Analysis since specific version
npm run release:analyze --since v1.0.0
```

### Interactive Mode

```bash
# Enable interactive review of uncertain changes
npm run release:analyze --interactive

# Interactive mode with auto-approval for low-confidence items
npm run release:analyze --interactive --auto-approve

# Interactive mode with custom review threshold
npm run release:analyze --interactive --review-threshold 0.8
```

### Dry-run and Preview

```bash
# Preview analysis scope without full extraction
npm run release:analyze --dry-run

# Dry-run with specific parameters
npm run release:analyze --dry-run --since v1.0.0 --format summary

# Skip confirmation prompts (use with caution)
npm run release:analyze --dry-run --skip-confirmation
```

### Configuration Management

```bash
# Show current configuration
npm run release:analyze config --config-show

# Set configuration value
npm run release:analyze config --config-set extraction.confidenceThresholds.minimumConfidence=0.7

# Validate configuration
npm run release:analyze config --config-validate

# Reset to default configuration
npm run release:analyze config --config-reset
```

### Analysis History

```bash
# List previous analyses
npm run release:analyze history --history-list

# Show details of specific analysis
npm run release:analyze history --history-show analysis-1640995200000

# Compare current analysis with historical entry
npm run release:analyze history --history-compare analysis-1640995200000

# Clear all analysis history
npm run release:analyze history --history-clear
```

## Command Reference

### Commands

| Command | Description |
|---------|-------------|
| `analyze` | Analyze changes since last release (default) |
| `config` | Manage configuration settings |
| `history` | Manage analysis history |
| `help` | Show help information |
| `version` | Show CLI version |

### Analysis Options

| Option | Description | Example |
|--------|-------------|---------|
| `--since <tag\|commit>` | Analyze changes since specific reference | `--since v1.0.0` |
| `--format <type>` | Output format: summary, detailed, json | `--format detailed` |
| `--dry-run` | Preview analysis without full extraction | `--dry-run` |
| `--include <patterns>` | File patterns to include | `--include "**/*completion*.md"` |
| `--exclude <patterns>` | File patterns to exclude | `--exclude "**/draft*"` |

### Interactive Options

| Option | Description | Example |
|--------|-------------|---------|
| `--interactive`, `-i` | Enable interactive review mode | `--interactive` |
| `--auto-approve` | Auto-approve low-confidence items | `--auto-approve` |
| `--skip-confirmation` | Skip confirmation prompts | `--skip-confirmation` |
| `--review-threshold <n>` | Confidence threshold for review (0-1) | `--review-threshold 0.8` |

### Configuration Options

| Option | Description | Example |
|--------|-------------|---------|
| `--config-show` | Show current configuration | `--config-show` |
| `--config-set <key=value>` | Set configuration value | `--config-set key=value` |
| `--config-reset` | Reset to default configuration | `--config-reset` |
| `--config-validate` | Validate configuration | `--config-validate` |

### History Options

| Option | Description | Example |
|--------|-------------|---------|
| `--history-list` | List previous analyses | `--history-list` |
| `--history-show <id>` | Show analysis details | `--history-show analysis-123` |
| `--history-compare <id>` | Compare with historical analysis | `--history-compare analysis-123` |
| `--history-clear` | Clear analysis history | `--history-clear` |

## Configuration

The CLI uses a configuration file at `.kiro/release-config.json`. Key configuration sections:

### Extraction Configuration

```json
{
  "extraction": {
    "confidenceThresholds": {
      "minimumConfidence": 0.6,
      "uncertaintyThreshold": 0.8,
      "reviewThreshold": 0.7
    },
    "completionPatterns": [
      "*-completion.md",
      "spec-completion-summary.md"
    ]
  }
}
```

### Versioning Configuration

```json
{
  "versioning": {
    "semanticVersioning": true,
    "versionBumpRules": {
      "requireMajorConfirmation": true,
      "defaultBumpType": "patch"
    }
  }
}
```

### Reporting Configuration

```json
{
  "reporting": {
    "defaultFormat": "summary",
    "includeConfidence": true,
    "outputFiles": {
      "saveResults": true,
      "outputDirectory": "./.kiro/release-analysis"
    }
  }
}
```

## Interactive Mode

When `--interactive` is enabled, the CLI provides human oversight for:

### Uncertain Changes Review

```
⚠️  Found 2 ambiguous items:

1. Updated error handling - unclear if breaking change
   Action (k)eep, (r)emove, (e)dit, (s)kip: k

2. Refactored internal API - potential breaking change
   Action (k)eep, (r)emove, (e)dit, (s)kip: e
   New description: Internal refactoring - no API changes
```

### Duplicate Detection

```
🔄 Found 1 uncertain duplicate:

📝 feature - Similarity: 85.2%
   Items: Enhanced validation, Improved validation system
   Suggested: merge
   Action (m)erge, (s)eparate, (r)eview later: m
```

### Major Version Confirmation

```
⚠️  Major version bump detected!
   1.0.0 → 2.0.0
   Rationale: Breaking changes in API interface

Confirm major version bump? (y/n): n

Version Override Options:
1. Minor version bump
2. Patch version bump  
3. Keep current recommendation
Choose option (1-3): 1
```

## Analysis History

The CLI maintains a history of analyses in `.kiro/release-analysis/history.json`:

```json
[
  {
    "id": "analysis-1640995200000",
    "timestamp": "2023-01-01T12:00:00.000Z",
    "result": {
      "versionRecommendation": {
        "recommendedVersion": "1.1.0"
      }
    },
    "duration": 2500
  }
]
```

### History Comparison

When comparing analyses, the CLI shows:

- Version recommendation changes
- Change count differences
- New breaking changes, features, or fixes
- Confidence score changes

```
📊 Analysis Comparison
========================================
Previous: 1.0.0 (12/31/2022)
Current:  1.1.0

✅ Version recommendation unchanged

Change count difference: +2
Breaking changes: +0
New features: +1
Bug fixes: +1
Confidence change: +5.2%
```

## Error Handling

The CLI provides comprehensive error handling with recovery strategies:

### Git Repository Issues
- Fallback to manual scope specification
- Clear error messages with resolution guidance
- Graceful handling of missing release tags

### Configuration Errors
- Validation with specific error messages
- Automatic fallback to default configuration
- Interactive configuration repair

### Analysis Failures
- Partial results when possible
- Clear indication of what failed
- Suggestions for resolution

## Integration

### With Existing Workflows

The CLI integrates seamlessly with existing development workflows:

```bash
# In package.json scripts
{
  "scripts": {
    "release:analyze": "node src/release-analysis/cli/release-analyze.ts",
    "release:preview": "npm run release:analyze -- --dry-run --format detailed",
    "release:interactive": "npm run release:analyze -- --interactive --format detailed"
  }
}
```

### With CI/CD Pipelines

```yaml
# GitHub Actions example
- name: Analyze Release Changes
  run: |
    npm run release:analyze -- --format json --skip-confirmation > analysis.json
    
- name: Validate Version Bump
  run: |
    npm run release:analyze -- --dry-run --since ${{ github.event.before }}
```

## Examples

See `example-usage.ts` for comprehensive examples of all CLI features including:

- Interactive analysis workflows
- Configuration management scenarios
- History comparison examples
- Advanced command-line usage patterns

## Troubleshooting

### Common Issues

**No completion documents found:**
```bash
# Check patterns and paths
npm run release:analyze config --config-show
```

**Low confidence scores:**
```bash
# Review and adjust thresholds
npm run release:analyze config --config-set extraction.confidenceThresholds.minimumConfidence=0.5
```

**Interactive mode not working:**
```bash
# Ensure terminal supports interactive input
npm run release:analyze --interactive --auto-approve
```

### Debug Mode

Enable verbose logging by setting environment variable:
```bash
DEBUG=release-analysis npm run release:analyze
```

## Development

### Running Tests

```bash
# Run CLI tests
npm test -- src/release-analysis/cli/__tests__/

# Run specific test
npm test -- --testNamePattern="interactive mode"
```

### Adding New Features

1. Update `AdvancedReleaseCLI.ts` with new functionality
2. Add corresponding command-line options in `parseAdvancedArguments`
3. Update help text in `showAdvancedHelp`
4. Add tests in `__tests__/AdvancedReleaseCLI.test.ts`
5. Update this README with new features

The Advanced Release Analysis CLI provides a comprehensive, human-friendly interface for release analysis with the flexibility to handle complex scenarios while maintaining simplicity for common use cases.