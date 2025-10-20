# Release Analysis Configuration System

This directory contains the configuration system for the Release Analysis CLI tool. The configuration system is adapted from the previous Release Management System but simplified for the CLI-driven workflow.

## Overview

The configuration system provides:

- **Extraction Configuration**: Patterns and keywords for analyzing completion documents
- **Versioning Configuration**: Rules for semantic version bump calculation
- **Reporting Configuration**: Output formats and templates for analysis results
- **Git Configuration**: Repository analysis settings and file patterns

## Key Changes from Release Management System

### Removed (Detection-Specific)
- Automatic detection triggers (`specCompletionTrigger`, `taskCompletionTrigger`)
- Confidence thresholds for automatic release detection
- Background monitoring and event processing
- Publishing configuration (GitHub, npm, artifacts)
- Complex validation rules for automatic workflows

### Added (Analysis-Specific)
- Extraction patterns for completion documents
- Section headers for structured document parsing
- Confidence thresholds for extraction quality
- Template configuration for different output formats
- Output file management for analysis results

## Configuration Files

The system looks for configuration files in this order:

1. `.kiro/analysis-config.json` (recommended)
2. `analysis-config.json` (project root)
3. `.analysis-config.json` (hidden file in project root)

## Environment Variable Overrides

You can override configuration values using environment variables:

- `ANALYSIS_DEFAULT_BRANCH` - Git default branch
- `ANALYSIS_RELEASE_TAG_PATTERN` - Pattern for release tags
- `ANALYSIS_MAX_COMMITS` - Maximum commits to analyze
- `ANALYSIS_MINIMUM_CONFIDENCE` - Minimum extraction confidence
- `ANALYSIS_DEFAULT_FORMAT` - Default output format (summary/detailed/json)
- `ANALYSIS_OUTPUT_DIRECTORY` - Output directory for results
- `ANALYSIS_DEFAULT_BUMP_TYPE` - Default version bump type
- `ANALYSIS_PRERELEASE_IDENTIFIER` - Pre-release identifier

## Usage Examples

### Basic Usage

```typescript
import { AnalysisConfigManager } from './AnalysisConfigManager';

const configManager = AnalysisConfigManager.getInstance();
const config = await configManager.getConfig();

console.log('Default format:', config.reporting.defaultFormat);
console.log('Breaking change keywords:', config.extraction.breakingChangeKeywords);
```

### Creating Default Configuration

```typescript
const configPath = await configManager.createDefaultConfigFile();
console.log('Created config at:', configPath);
```

### Validating Configuration

```typescript
const validation = configManager.validateConfiguration(config);
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
}
```

## Configuration Structure

See `AnalysisConfig.ts` for the complete interface definitions and `example-config.json` for a sample configuration file.

### Key Sections

- **extraction**: Controls how completion documents are parsed and analyzed
- **versioning**: Rules for calculating semantic version bumps
- **reporting**: Output formatting and file management
- **git**: Repository analysis settings and file patterns

## Default Values

The system provides comprehensive defaults in `DEFAULT_ANALYSIS_CONFIG` that work out of the box for most DesignerPunk projects. User configuration files only need to override specific values.

## Validation

The configuration system includes comprehensive validation:

- Type checking for all configuration values
- Range validation for numeric values (e.g., confidence thresholds 0-1)
- Enum validation for string values (e.g., output formats)
- Path validation for file system paths
- Regex validation for patterns

## Integration with CLI

The CLI tool automatically loads configuration on startup and uses it throughout the analysis workflow. Configuration errors are reported clearly with actionable guidance for resolution.