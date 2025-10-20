# Configuration Reference

**Date**: October 20, 2025  
**Purpose**: Complete configuration reference for Release Analysis System  
**Organization**: spec-completion  
**Scope**: release-analysis-system  
**Status**: Complete Documentation  

---

## Overview

The Release Analysis System uses a hierarchical configuration system that allows for flexible customization while providing sensible defaults. Configuration files are loaded in order of precedence, allowing project-specific overrides of global settings.

## Configuration File Locations

### Precedence Order

1. **Project-specific configuration**: `.kiro/release-analysis-config.json`
2. **Legacy configuration**: `.kiro/release-config.json`  
3. **Built-in defaults**: Embedded in the system

### File Format

All configuration files use JSON format with the following structure:

```json
{
  "extraction": { /* ... */ },
  "versioning": { /* ... */ },
  "reporting": { /* ... */ },
  "git": { /* ... */ },
  "performance": { /* ... */ },
  "validation": { /* ... */ }
}
```

---

## Complete Configuration Schema

### Root Configuration Object

```typescript
interface AnalysisConfig {
  extraction: ExtractionConfig;
  versioning: VersioningConfig;
  reporting: ReportingConfig;
  git: GitConfig;
  performance: PerformanceConfig;
  validation: ValidationConfig;
}
```

---

## Extraction Configuration

Controls how completion documents are discovered, parsed, and analyzed for changes.

### Schema

```typescript
interface ExtractionConfig {
  completionPatterns: string[];
  breakingChangeKeywords: string[];
  featureKeywords: string[];
  bugFixKeywords: string[];
  improvementKeywords: string[];
  documentationKeywords: string[];
  confidenceThresholds: ConfidenceThresholds;
  deduplication: DeduplicationConfig;
  sectionParsing: SectionParsingConfig;
}
```

### Properties

#### completionPatterns
**Type**: `string[]`  
**Default**: `["*-completion.md", "spec-completion-summary.md", "task-*-completion.md"]`  
**Description**: Glob patterns for identifying completion documents

**Examples**:
```json
{
  "completionPatterns": [
    "*-completion.md",
    "spec-completion-summary.md",
    "docs/releases/*.md",
    "CHANGELOG.md"
  ]
}
```

**Pattern Syntax**:
- `*`: Matches any characters except path separators
- `**`: Matches any characters including path separators
- `?`: Matches single character
- `[abc]`: Matches any character in brackets
- `{a,b}`: Matches any of the comma-separated patterns

#### breakingChangeKeywords
**Type**: `string[]`  
**Default**: `["breaking change", "breaking", "incompatible", "removes", "deprecated", "migration required"]`  
**Description**: Keywords that indicate breaking changes

**Usage**: Case-insensitive matching against document content. Supports partial word matching.

**Examples**:
```json
{
  "breakingChangeKeywords": [
    "breaking change",
    "breaking",
    "incompatible",
    "removes",
    "deprecated",
    "migration required",
    "API change",
    "interface change"
  ]
}
```

#### featureKeywords
**Type**: `string[]`  
**Default**: `["new feature", "adds functionality", "enhancement", "implements", "introduces"]`  
**Description**: Keywords that indicate new features

#### bugFixKeywords
**Type**: `string[]`  
**Default**: `["bug fix", "fixes", "resolves", "corrects", "repairs"]`  
**Description**: Keywords that indicate bug fixes

#### improvementKeywords
**Type**: `string[]`  
**Default**: `["improvement", "optimizes", "enhances", "refactors", "updates"]`  
**Description**: Keywords that indicate improvements

#### documentationKeywords
**Type**: `string[]`  
**Default**: `["documentation", "docs", "readme", "comments", "examples"]`  
**Description**: Keywords that indicate documentation-only changes

#### confidenceThresholds
**Type**: `ConfidenceThresholds`  
**Description**: Thresholds for confidence scoring and review triggers

```typescript
interface ConfidenceThresholds {
  minimumConfidence: number;    // 0-1, minimum confidence to include changes
  uncertaintyThreshold: number; // 0-1, threshold for flagging uncertain items
  reviewThreshold: number;      // 0-1, threshold for requiring human review
}
```

**Default**:
```json
{
  "confidenceThresholds": {
    "minimumConfidence": 0.7,
    "uncertaintyThreshold": 0.8,
    "reviewThreshold": 0.75
  }
}
```

**Guidelines**:
- `minimumConfidence`: Set lower (0.5-0.6) for inclusive analysis, higher (0.8-0.9) for strict analysis
- `uncertaintyThreshold`: Items above this threshold are flagged as uncertain
- `reviewThreshold`: Items below this threshold require human review in interactive mode

#### deduplication
**Type**: `DeduplicationConfig`  
**Description**: Configuration for duplicate change detection

```typescript
interface DeduplicationConfig {
  enabled: boolean;
  similarityThreshold: number;  // 0-1, similarity threshold for duplicates
  titleWeight: number;          // 0-1, weight for title similarity
  descriptionWeight: number;    // 0-1, weight for description similarity
  mergeStrategy: 'automatic' | 'manual' | 'disabled';
}
```

**Default**:
```json
{
  "deduplication": {
    "enabled": true,
    "similarityThreshold": 0.85,
    "titleWeight": 0.6,
    "descriptionWeight": 0.4,
    "mergeStrategy": "automatic"
  }
}
```

#### sectionParsing
**Type**: `SectionParsingConfig`  
**Description**: Configuration for structured document parsing

```typescript
interface SectionParsingConfig {
  enabled: boolean;
  sectionHeaders: string[];
  fallbackToPatterns: boolean;
  strictSectionMatching: boolean;
}
```

**Default**:
```json
{
  "sectionParsing": {
    "enabled": true,
    "sectionHeaders": [
      "Breaking Changes",
      "New Features", 
      "Bug Fixes",
      "Improvements",
      "Documentation"
    ],
    "fallbackToPatterns": true,
    "strictSectionMatching": false
  }
}
```

---

## Versioning Configuration

Controls semantic version calculation and version bump behavior.

### Schema

```typescript
interface VersioningConfig {
  semanticVersioning: boolean;
  preReleaseHandling: PreReleaseHandling;
  versionBumpRules: VersionBumpRules;
  versionPatterns: VersionPatterns;
  customBumpLogic: CustomBumpLogic;
}
```

### Properties

#### semanticVersioning
**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable strict semantic versioning compliance

**When `true`**:
- Breaking changes → major version bump
- New features → minor version bump  
- Bug fixes → patch version bump
- Strict validation of version format

**When `false`**:
- Flexible version bumping based on custom rules
- Allows non-standard version formats

#### preReleaseHandling
**Type**: `'increment' | 'promote' | 'ignore'`  
**Default**: `'increment'`  
**Description**: How to handle pre-release versions

**Options**:
- `'increment'`: Increment pre-release number (1.0.0-alpha.1 → 1.0.0-alpha.2)
- `'promote'`: Promote to stable release (1.0.0-alpha.1 → 1.0.0)
- `'ignore'`: Treat as stable version for bump calculation

#### versionBumpRules
**Type**: `VersionBumpRules`  
**Description**: Rules for version bump calculation

```typescript
interface VersionBumpRules {
  defaultBumpType: 'major' | 'minor' | 'patch' | 'none';
  requireMajorConfirmation: boolean;
  allowDowngrade: boolean;
  customRules: CustomBumpRule[];
}
```

**Default**:
```json
{
  "versionBumpRules": {
    "defaultBumpType": "patch",
    "requireMajorConfirmation": true,
    "allowDowngrade": false,
    "customRules": []
  }
}
```

**Custom Rules Example**:
```json
{
  "customRules": [
    {
      "condition": "breakingChanges.length > 0 && newFeatures.length > 5",
      "bumpType": "major",
      "rationale": "Major version for significant breaking changes with many features"
    }
  ]
}
```

#### versionPatterns
**Type**: `VersionPatterns`  
**Description**: Regex patterns for version parsing

```typescript
interface VersionPatterns {
  major: string;
  minor: string;
  patch: string;
  preRelease: string;
  build: string;
}
```

**Default**:
```json
{
  "versionPatterns": {
    "major": "^(\\d+)\\.\\d+\\.\\d+",
    "minor": "^\\d+\\.(\\d+)\\.\\d+", 
    "patch": "^\\d+\\.\\d+\\.(\\d+)",
    "preRelease": "^\\d+\\.\\d+\\.\\d+-([^+]+)",
    "build": "^\\d+\\.\\d+\\.\\d+(?:-[^+]+)?\\+(.+)"
  }
}
```

---

## Reporting Configuration

Controls output formatting, file generation, and report templates.

### Schema

```typescript
interface ReportingConfig {
  defaultFormat: ReportFormat;
  includeConfidence: boolean;
  includeMetadata: boolean;
  includeEvidence: boolean;
  outputFiles: OutputFilesConfig;
  templates: TemplateConfig;
  formatting: FormattingConfig;
}
```

### Properties

#### defaultFormat
**Type**: `'summary' | 'detailed' | 'json'`  
**Default**: `'summary'`  
**Description**: Default output format when not specified

**Formats**:
- `'summary'`: Brief overview with key information
- `'detailed'`: Complete breakdown with evidence and metadata
- `'json'`: Machine-readable format for programmatic use

#### includeConfidence
**Type**: `boolean`  
**Default**: `true`  
**Description**: Include confidence scores in output

#### includeMetadata
**Type**: `boolean`  
**Default**: `true`  
**Description**: Include extraction metadata (document count, processing time, etc.)

#### includeEvidence
**Type**: `boolean`  
**Default**: `true`  
**Description**: Include supporting evidence for changes

#### outputFiles
**Type**: `OutputFilesConfig`  
**Description**: Configuration for saving analysis results to files

```typescript
interface OutputFilesConfig {
  saveResults: boolean;
  outputDirectory: string;
  filenamePattern: string;
  formats: ReportFormat[];
  overwriteExisting: boolean;
}
```

**Default**:
```json
{
  "outputFiles": {
    "saveResults": true,
    "outputDirectory": "./.kiro/release-analysis",
    "filenamePattern": "analysis-{timestamp}.{format}",
    "formats": ["json"],
    "overwriteExisting": false
  }
}
```

**Filename Pattern Variables**:
- `{timestamp}`: Unix timestamp
- `{date}`: ISO date (YYYY-MM-DD)
- `{version}`: Recommended version
- `{format}`: File format extension

#### templates
**Type**: `TemplateConfig`  
**Description**: Template configuration for different output formats

```typescript
interface TemplateConfig {
  releaseNotes: string;
  summary: string;
  detailed: string;
  customTemplates: Record<string, string>;
}
```

**Default**:
```json
{
  "templates": {
    "releaseNotes": "default",
    "summary": "default", 
    "detailed": "default",
    "customTemplates": {}
  }
}
```

**Custom Template Example**:
```json
{
  "customTemplates": {
    "slack": "🚀 Release {version}\n\n{summary}\n\n📋 Changes:\n{changeList}"
  }
}
```

---

## Git Configuration

Controls Git repository interaction, file discovery, and history analysis.

### Schema

```typescript
interface GitConfig {
  defaultBranch: string;
  releaseTagPattern: string;
  completionPaths: string[];
  excludePaths: string[];
  maxCommits: number;
  maxFileSize: string;
  gitOptions: GitOptions;
}
```

### Properties

#### defaultBranch
**Type**: `string`  
**Default**: `'main'`  
**Description**: Default branch for analysis when not specified

#### releaseTagPattern
**Type**: `string`  
**Default**: `'^v?\\d+\\.\\d+\\.\\d+'`  
**Description**: Regex pattern for identifying release tags

**Common Patterns**:
```json
{
  "releaseTagPattern": "^v?\\d+\\.\\d+\\.\\d+"        // v1.0.0 or 1.0.0
}
{
  "releaseTagPattern": "^release-\\d+\\.\\d+\\.\\d+"  // release-1.0.0
}
{
  "releaseTagPattern": "^\\d{4}-\\d{2}-\\d{2}"       // 2023-12-01
}
```

#### completionPaths
**Type**: `string[]`  
**Default**: `[".kiro/specs/*/completion/", ".kiro/specs/*/tasks.md"]`  
**Description**: Paths to search for completion documents

**Supports**:
- Glob patterns
- Relative paths from repository root
- Multiple path specifications

#### excludePaths
**Type**: `string[]`  
**Default**: `["**/node_modules/**", "**/dist/**", "**/.git/**"]`  
**Description**: Paths to exclude from analysis

**Common Exclusions**:
```json
{
  "excludePaths": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.git/**",
    "**/temp/**",
    "**/*.log"
  ]
}
```

#### maxCommits
**Type**: `number`  
**Default**: `1000`  
**Description**: Maximum number of commits to analyze

**Guidelines**:
- Lower values (100-500) for faster analysis
- Higher values (1000+) for comprehensive analysis
- Very high values may impact performance

#### maxFileSize
**Type**: `string`  
**Default**: `'1MB'`  
**Description**: Maximum file size to process

**Formats**:
- `'500KB'`: 500 kilobytes
- `'1MB'`: 1 megabyte  
- `'10MB'`: 10 megabytes
- `1048576`: Bytes (1MB)

#### gitOptions
**Type**: `GitOptions`  
**Description**: Advanced Git operation options

```typescript
interface GitOptions {
  timeout: number;          // Git operation timeout in ms
  maxBuffer: number;        // Maximum buffer size for Git output
  followRenames: boolean;   // Follow file renames in history
  ignoreWhitespace: boolean; // Ignore whitespace changes
}
```

**Default**:
```json
{
  "gitOptions": {
    "timeout": 30000,
    "maxBuffer": 10485760,
    "followRenames": true,
    "ignoreWhitespace": false
  }
}
```

---

## Performance Configuration

Controls system performance, caching, and resource usage.

### Schema

```typescript
interface PerformanceConfig {
  enableCaching: boolean;
  cacheDirectory: string;
  parallelProcessing: boolean;
  maxConcurrency: number;
  progressReporting: boolean;
  memoryLimits: MemoryLimits;
}
```

### Properties

#### enableCaching
**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable document parsing and analysis caching

**Benefits**:
- Faster repeated analyses
- Reduced file I/O
- Better performance for large repositories

**Cache Invalidation**:
- File modification time changes
- Configuration changes
- Git history changes

#### cacheDirectory
**Type**: `string`  
**Default**: `'./.kiro/cache/release-analysis'`  
**Description**: Directory for cache files

#### parallelProcessing
**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable parallel processing of documents

#### maxConcurrency
**Type**: `number`  
**Default**: `4`  
**Description**: Maximum concurrent operations

**Guidelines**:
- CPU cores: Set to number of CPU cores
- I/O bound: Can exceed CPU cores (8-16)
- Memory constrained: Reduce to 2-4

#### progressReporting
**Type**: `boolean`  
**Default**: `true`  
**Description**: Show progress during long operations

#### memoryLimits
**Type**: `MemoryLimits`  
**Description**: Memory usage limits

```typescript
interface MemoryLimits {
  maxDocumentSize: string;
  maxTotalMemory: string;
  gcThreshold: number;
}
```

**Default**:
```json
{
  "memoryLimits": {
    "maxDocumentSize": "10MB",
    "maxTotalMemory": "512MB", 
    "gcThreshold": 0.8
  }
}
```

---

## Validation Configuration

Controls validation behavior, error handling, and quality checks.

### Schema

```typescript
interface ValidationConfig {
  strictMode: boolean;
  requireCompletionDocuments: boolean;
  validateGitHistory: boolean;
  validateConfiguration: boolean;
  errorHandling: ErrorHandlingConfig;
  qualityGates: QualityGateConfig;
}
```

### Properties

#### strictMode
**Type**: `boolean`  
**Default**: `false`  
**Description**: Enable strict validation mode

**When `true`**:
- Fails analysis on any validation errors
- Requires all quality gates to pass
- Useful for CI/CD environments

**When `false`**:
- Continues analysis with warnings
- Provides partial results when possible
- Better for interactive use

#### requireCompletionDocuments
**Type**: `boolean`  
**Default**: `true`  
**Description**: Require at least one completion document

#### validateGitHistory
**Type**: `boolean`  
**Default**: `true`  
**Description**: Validate Git repository state and history

#### validateConfiguration
**Type**: `boolean`  
**Default**: `true`  
**Description**: Validate configuration on startup

#### errorHandling
**Type**: `ErrorHandlingConfig`  
**Description**: Error handling and recovery configuration

```typescript
interface ErrorHandlingConfig {
  continueOnError: boolean;
  maxErrors: number;
  retryAttempts: number;
  fallbackStrategies: string[];
}
```

**Default**:
```json
{
  "errorHandling": {
    "continueOnError": true,
    "maxErrors": 10,
    "retryAttempts": 3,
    "fallbackStrategies": ["skip-document", "use-cache", "manual-review"]
  }
}
```

#### qualityGates
**Type**: `QualityGateConfig`  
**Description**: Quality gate thresholds

```typescript
interface QualityGateConfig {
  minimumConfidence: number;
  maximumUncertainty: number;
  requiredDocuments: number;
  maximumProcessingTime: number;
}
```

**Default**:
```json
{
  "qualityGates": {
    "minimumConfidence": 0.6,
    "maximumUncertainty": 0.3,
    "requiredDocuments": 1,
    "maximumProcessingTime": 300000
  }
}
```

---

## Configuration Management

### Command-Line Configuration

```bash
# View configuration
npm run release:analyze config --show
npm run release:analyze config --show extraction
npm run release:analyze config --show extraction.confidenceThresholds

# Set configuration
npm run release:analyze config --set extraction.confidenceThresholds.minimumConfidence=0.8
npm run release:analyze config --set reporting.defaultFormat=detailed

# Validate configuration
npm run release:analyze config --validate

# Reset configuration
npm run release:analyze config --reset
npm run release:analyze config --reset extraction
```

### Programmatic Configuration

```typescript
import { AnalysisConfigManager } from './config/AnalysisConfigManager';

const configManager = new AnalysisConfigManager();

// Load configuration
const config = await configManager.loadConfig();

// Modify configuration
config.extraction.confidenceThresholds.minimumConfidence = 0.8;

// Save configuration
await configManager.saveConfig(config);

// Validate configuration
const validation = configManager.validateConfig(config);
if (!validation.isValid) {
    console.error('Configuration errors:', validation.errors);
}
```

### Environment Variable Overrides

Certain configuration values can be overridden with environment variables:

```bash
# Override cache directory
RELEASE_ANALYSIS_CACHE_DIR=/tmp/cache npm run release:analyze

# Override output directory  
RELEASE_ANALYSIS_OUTPUT_DIR=./reports npm run release:analyze

# Override Git timeout
RELEASE_ANALYSIS_GIT_TIMEOUT=60000 npm run release:analyze

# Enable debug mode
DEBUG=release-analysis npm run release:analyze
```

### Configuration Validation

The system validates configuration on startup and provides detailed error messages:

```json
{
  "isValid": false,
  "errors": [
    {
      "path": "extraction.confidenceThresholds.minimumConfidence",
      "message": "Must be a number between 0 and 1",
      "value": "high"
    },
    {
      "path": "git.maxCommits", 
      "message": "Must be a positive integer",
      "value": -1
    }
  ],
  "warnings": [
    {
      "path": "performance.maxConcurrency",
      "message": "High concurrency may impact performance",
      "value": 32
    }
  ]
}
```

---

## Configuration Examples

### Minimal Configuration

```json
{
  "extraction": {
    "confidenceThresholds": {
      "minimumConfidence": 0.6
    }
  },
  "reporting": {
    "defaultFormat": "detailed"
  }
}
```

### Comprehensive Configuration

```json
{
  "extraction": {
    "completionPatterns": [
      ".kiro/specs/*/completion/*-completion.md",
      "docs/releases/*.md",
      "CHANGELOG.md"
    ],
    "breakingChangeKeywords": [
      "breaking change",
      "breaking",
      "incompatible",
      "removes",
      "deprecated",
      "migration required",
      "API change"
    ],
    "featureKeywords": [
      "new feature",
      "adds functionality", 
      "enhancement",
      "implements",
      "introduces",
      "creates"
    ],
    "confidenceThresholds": {
      "minimumConfidence": 0.7,
      "uncertaintyThreshold": 0.8,
      "reviewThreshold": 0.75
    },
    "deduplication": {
      "enabled": true,
      "similarityThreshold": 0.85,
      "titleWeight": 0.6,
      "descriptionWeight": 0.4
    }
  },
  "versioning": {
    "semanticVersioning": true,
    "preReleaseHandling": "increment",
    "versionBumpRules": {
      "defaultBumpType": "patch",
      "requireMajorConfirmation": true,
      "allowDowngrade": false
    }
  },
  "reporting": {
    "defaultFormat": "detailed",
    "includeConfidence": true,
    "includeMetadata": true,
    "includeEvidence": true,
    "outputFiles": {
      "saveResults": true,
      "outputDirectory": "./release-analysis",
      "filenamePattern": "analysis-{date}-{version}.{format}",
      "formats": ["json", "md"]
    }
  },
  "git": {
    "defaultBranch": "main",
    "releaseTagPattern": "^v?\\d+\\.\\d+\\.\\d+",
    "completionPaths": [
      ".kiro/specs/*/completion/",
      "docs/completion/"
    ],
    "excludePaths": [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**"
    ],
    "maxCommits": 1000,
    "maxFileSize": "2MB"
  },
  "performance": {
    "enableCaching": true,
    "parallelProcessing": true,
    "maxConcurrency": 6,
    "progressReporting": true
  },
  "validation": {
    "strictMode": false,
    "requireCompletionDocuments": true,
    "validateGitHistory": true,
    "validateConfiguration": true
  }
}
```

### Project-Specific Configurations

#### Monorepo Configuration

```json
{
  "extraction": {
    "completionPatterns": [
      "packages/*/CHANGELOG.md",
      ".kiro/specs/*/completion/*.md"
    ]
  },
  "git": {
    "completionPaths": [
      "packages/*/docs/completion/",
      ".kiro/specs/*/completion/"
    ]
  },
  "reporting": {
    "templates": {
      "releaseNotes": "monorepo"
    }
  }
}
```

#### Documentation Project Configuration

```json
{
  "extraction": {
    "documentationKeywords": [
      "documentation update",
      "guide added",
      "tutorial created",
      "API documentation",
      "examples added"
    ]
  },
  "versioning": {
    "versionBumpRules": {
      "defaultBumpType": "minor"
    }
  }
}
```

#### CI/CD Configuration

```json
{
  "validation": {
    "strictMode": true,
    "qualityGates": {
      "minimumConfidence": 0.8,
      "maximumUncertainty": 0.2
    }
  },
  "reporting": {
    "defaultFormat": "json",
    "outputFiles": {
      "saveResults": true,
      "formats": ["json"]
    }
  },
  "performance": {
    "progressReporting": false
  }
}
```

This configuration reference provides complete documentation for all available configuration options, enabling users to customize the Release Analysis System for their specific needs and workflows.