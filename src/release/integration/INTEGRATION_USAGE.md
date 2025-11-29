# Release Analysis Integration Usage Guide

This guide demonstrates how to use the `ReleaseAnalysisIntegration` interface to consume release analysis results in the automation layer.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Querying Results](#querying-results)
- [Error Handling](#error-handling)
- [Advanced Usage](#advanced-usage)
- [Integration Patterns](#integration-patterns)

## Quick Start

```typescript
import { ReleaseAnalysisIntegration } from './release/integration';

// Create integration instance
const integration = new ReleaseAnalysisIntegration();

// Execute analysis
const result = await integration.analyze();

// Check for breaking changes
if (result.hasBreakingChanges()) {
  console.log('⚠️  Breaking changes detected!');
  console.log(result.getBreakingChanges());
}

// Get version recommendation
console.log(`Recommended version: ${result.getRecommendedVersion()}`);
```

## Basic Usage

### Creating an Integration Instance

```typescript
import { ReleaseAnalysisIntegration } from './release/integration';

// Default configuration
const integration = new ReleaseAnalysisIntegration();

// Custom configuration
const integration = new ReleaseAnalysisIntegration({
  workingDirectory: '/path/to/project',
  timeout: 10 * 60 * 1000, // 10 minutes
  validateResults: true,
  retryStrategy: {
    maxAttempts: 3,
    initialDelay: 1000,
    backoffMultiplier: 2,
    maxDelay: 10000
  }
});
```

### Executing Analysis

```typescript
// Basic analysis
const result = await integration.analyze();

// Analysis with options
const result = await integration.analyze({
  since: 'v1.0.0',
  skipConfirmation: true
});

// Dry-run mode (no side effects)
const result = await integration.analyzeDryRun();

// Analyze since specific tag
const result = await integration.analyzeSince('v1.0.0');
```

### Pre-flight Checks

```typescript
// Check if CLI is available
const available = await integration.isAvailable();
if (!available) {
  console.error('Release analysis CLI is not available');
  process.exit(1);
}

// Get CLI version
const version = await integration.getVersion();
console.log(`Using CLI version: ${version}`);
```

## Querying Results

### Version Information

```typescript
const result = await integration.analyze();

// Get version information
console.log(`Current: ${result.getCurrentVersion()}`);
console.log(`Recommended: ${result.getRecommendedVersion()}`);
console.log(`Bump type: ${result.getBumpType()}`);
console.log(`Rationale: ${result.getVersionRationale()}`);

// Check bump type
if (result.isMajorBump()) {
  console.log('Major version bump required');
} else if (result.isMinorBump()) {
  console.log('Minor version bump required');
} else if (result.isPatchBump()) {
  console.log('Patch version bump required');
}

// Check if any bump is needed
if (result.shouldBumpVersion()) {
  console.log('Version bump recommended');
}
```

### Change Queries

```typescript
const result = await integration.analyze();

// Get all changes
const breakingChanges = result.getBreakingChanges();
const features = result.getFeatures();
const bugFixes = result.getBugFixes();
const improvements = result.getImprovements();

// Check for specific change types
if (result.hasBreakingChanges()) {
  console.log('Breaking changes detected');
}

if (result.hasFeatures()) {
  console.log('New features added');
}

// Get total change count
const totalChanges = result.getChangeCount();
console.log(`Total changes: ${totalChanges}`);
```

### Filtering Changes

```typescript
const result = await integration.analyze();

// Filter breaking changes by severity
const criticalChanges = result.getCriticalBreakingChanges();
const highSeverity = result.getBreakingChangesBySeverity('high');

// Filter features by category
const uiFeatures = result.getFeaturesByCategory('ui');
const apiFeatures = result.getFeaturesByCategory('api');

// Filter bug fixes by severity
const criticalFixes = result.getBugFixesBySeverity('critical');

// Search changes by keyword
const searchResults = result.searchChanges('authentication');
console.log(`Found ${searchResults.features.length} features matching "authentication"`);
```

### Release Notes

```typescript
const result = await integration.analyze();

// Get formatted release notes
const notes = result.getReleaseNotes();
console.log(notes);

// Check if notes are available
if (result.hasReleaseNotes()) {
  // Write to CHANGELOG.md
  await fs.writeFile('CHANGELOG.md', notes);
}
```

### Confidence Metrics

```typescript
const result = await integration.analyze();

// Get overall confidence
const confidence = result.getOverallConfidence();
console.log(`Confidence: ${(confidence * 100).toFixed(1)}%`);

// Get confidence level
const level = result.getConfidenceLevel(); // 'high' | 'medium' | 'low'
console.log(`Confidence level: ${level}`);

// Check confidence threshold
if (result.isConfident(0.8)) {
  console.log('High confidence in analysis results');
} else {
  console.log('⚠️  Low confidence - manual review recommended');
}

// Get detailed confidence metrics
const metrics = result.getConfidenceMetrics();
console.log(`Extraction: ${metrics.extraction}`);
console.log(`Categorization: ${metrics.categorization}`);
console.log(`Version calculation: ${metrics.versionCalculation}`);
```

### Summary Information

```typescript
const result = await integration.analyze();

// Get structured summary
const summary = result.getSummary();
console.log(JSON.stringify(summary, null, 2));

// Get human-readable summary
const summaryString = result.getSummaryString();
console.log(summaryString);
```

## Error Handling

### Basic Error Handling

```typescript
import { CLIError, CLIErrorCategory } from './release/integration';

try {
  const result = await integration.analyze();
  // Process result
} catch (error) {
  if (error instanceof CLIError) {
    console.error(`CLI Error: ${error.getUserMessage()}`);
    console.error(`Category: ${error.category}`);
    
    // Get recovery suggestions
    error.recoverySuggestions.forEach(suggestion => {
      console.log(`  - ${suggestion}`);
    });
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Handling Specific Error Categories

```typescript
try {
  const result = await integration.analyze();
} catch (error) {
  if (error instanceof CLIError) {
    switch (error.category) {
      case CLIErrorCategory.CLI_UNAVAILABLE:
        console.error('CLI is not available. Please install dependencies.');
        break;
      
      case CLIErrorCategory.TIMEOUT:
        console.error('Analysis timed out. Try increasing timeout or using --skip-confirmation.');
        break;
      
      case CLIErrorCategory.PARSE_ERROR:
        console.error('Failed to parse CLI output. Check CLI version.');
        break;
      
      case CLIErrorCategory.TRANSIENT:
        console.error('Transient error. Retrying...');
        // Retry logic handled automatically by integration
        break;
      
      default:
        console.error('Unknown error:', error.message);
    }
  }
}
```

### Retry Logic

```typescript
// Configure retry strategy
const integration = new ReleaseAnalysisIntegration({
  retryStrategy: {
    maxAttempts: 5,
    initialDelay: 2000,
    backoffMultiplier: 2,
    maxDelay: 30000,
    shouldRetry: (category) => {
      // Retry transient errors and timeouts
      return category === CLIErrorCategory.TRANSIENT ||
             category === CLIErrorCategory.TIMEOUT;
    }
  }
});

// Retry logic is automatic
const result = await integration.analyze();
```

### Fallback Mechanisms

```typescript
const integration = new ReleaseAnalysisIntegration({
  fallbackOptions: {
    enabled: true,
    promptManualAnalysis: true,
    useCachedResults: false
  }
});

try {
  const result = await integration.analyze();
} catch (error) {
  if (error instanceof CLIError) {
    // Fallback handling is automatic
    // Error handler will log suggestions and prompt for manual analysis
    await integration.handleError(error);
  }
}
```

## Advanced Usage

### Custom Validation

```typescript
const integration = new ReleaseAnalysisIntegration({
  validateResults: true
});

const result = await integration.analyze();

// Additional custom validation
if (result.hasBreakingChanges() && !result.isMajorBump()) {
  console.warn('⚠️  Breaking changes detected but not recommending major bump');
}

if (result.getChangeCount() === 0 && result.shouldBumpVersion()) {
  console.warn('⚠️  No changes detected but version bump recommended');
}
```

### Accessing Raw Results

```typescript
const result = await integration.analyze();

// Get raw AnalysisResult for advanced processing
const rawResult = result.getRawResult();

// Access scope information
const scope = result.getScope();
console.log(`Analyzed from ${scope.fromTag} to ${scope.toCommit}`);

// Access metadata
const metadata = result.getMetadata();
console.log(`Analysis took ${metadata.duration}ms`);
console.log(`CLI version: ${metadata.cliVersion}`);
```

### Conditional Analysis

```typescript
// Only analyze if CLI is available
if (await integration.isAvailable()) {
  const result = await integration.analyze();
  // Process result
} else {
  console.log('CLI not available, skipping analysis');
}

// Check version compatibility
const version = await integration.getVersion();
if (version && version >= '1.0.0') {
  const result = await integration.analyze();
} else {
  console.warn('CLI version too old, please update');
}
```

## Integration Patterns

### Automation Layer Integration

```typescript
import { ReleaseAnalysisIntegration } from './release/integration';

class ReleaseAutomation {
  private integration: ReleaseAnalysisIntegration;

  constructor() {
    this.integration = new ReleaseAnalysisIntegration({
      timeout: 10 * 60 * 1000,
      validateResults: true
    });
  }

  async executeRelease(): Promise<void> {
    // Step 1: Analyze changes
    console.log('Analyzing changes...');
    const result = await this.integration.analyze();

    // Step 2: Validate analysis
    if (!result.isConfident(0.7)) {
      throw new Error('Low confidence in analysis - manual review required');
    }

    // Step 3: Check for breaking changes
    if (result.hasBreakingChanges()) {
      console.log('⚠️  Breaking changes detected');
      await this.handleBreakingChanges(result);
    }

    // Step 4: Update version
    const newVersion = result.getRecommendedVersion();
    await this.updatePackageVersion(newVersion);

    // Step 5: Generate changelog
    const notes = result.getReleaseNotes();
    await this.updateChangelog(notes);

    // Step 6: Create git tag
    await this.createGitTag(newVersion);

    // Step 7: Publish release
    await this.publishRelease(newVersion, notes);
  }

  private async handleBreakingChanges(result: AnalysisResultWrapper): Promise<void> {
    const breakingChanges = result.getBreakingChanges();
    
    for (const change of breakingChanges) {
      console.log(`Breaking: ${change.title}`);
      if (change.migrationGuidance) {
        console.log(`Migration: ${change.migrationGuidance}`);
      }
    }

    // Require confirmation for breaking changes
    const confirmed = await this.confirmBreakingChanges();
    if (!confirmed) {
      throw new Error('Breaking changes not confirmed');
    }
  }

  // ... other methods
}
```

### CI/CD Integration

```typescript
import { ReleaseAnalysisIntegration } from './release/integration';

async function cicdReleaseCheck(): Promise<void> {
  const integration = new ReleaseAnalysisIntegration();

  try {
    // Check if CLI is available
    if (!await integration.isAvailable()) {
      console.error('Release analysis CLI not available');
      process.exit(1);
    }

    // Execute analysis
    const result = await integration.analyze({
      skipConfirmation: true // No user interaction in CI/CD
    });

    // Check confidence
    if (!result.isConfident(0.8)) {
      console.warn('⚠️  Low confidence in analysis');
      process.exit(1);
    }

    // Output results for CI/CD
    console.log(result.getSummaryString());

    // Set environment variables for downstream jobs
    process.env.RELEASE_VERSION = result.getRecommendedVersion();
    process.env.RELEASE_BUMP_TYPE = result.getBumpType();
    process.env.HAS_BREAKING_CHANGES = result.hasBreakingChanges().toString();

  } catch (error) {
    console.error('Release analysis failed:', error);
    process.exit(1);
  }
}
```

### Manual Release Workflow

```typescript
import { ReleaseAnalysisIntegration } from './release/integration';
import * as readline from 'readline';

async function manualRelease(): Promise<void> {
  const integration = new ReleaseAnalysisIntegration();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Execute analysis
  const result = await integration.analyze();

  // Display summary
  console.log(result.getSummaryString());

  // Prompt for confirmation
  const confirmed = await new Promise<boolean>((resolve) => {
    rl.question('\nProceed with release? (y/n): ', (answer) => {
      resolve(answer.toLowerCase() === 'y');
      rl.close();
    });
  });

  if (!confirmed) {
    console.log('Release cancelled');
    return;
  }

  // Proceed with release
  console.log('Proceeding with release...');
  // ... release logic
}
```

## Best Practices

1. **Always check CLI availability** before executing analysis in production environments
2. **Use appropriate timeouts** based on your project size and complexity
3. **Enable result validation** to catch parsing errors early
4. **Configure retry logic** for transient failures in CI/CD environments
5. **Check confidence metrics** before proceeding with automated releases
6. **Handle breaking changes explicitly** with user confirmation or additional validation
7. **Use dry-run mode** for testing without side effects
8. **Log detailed error information** for troubleshooting
9. **Provide fallback mechanisms** when CLI is unavailable
10. **Document integration patterns** specific to your automation workflow

## Troubleshooting

### CLI Not Available

```typescript
if (!await integration.isAvailable()) {
  console.error('CLI not available. Try:');
  console.error('  - npm install');
  console.error('  - Verify release:analyze script in package.json');
  console.error('  - Check npm is in PATH');
}
```

### Timeout Issues

```typescript
const integration = new ReleaseAnalysisIntegration({
  timeout: 15 * 60 * 1000, // Increase to 15 minutes
  retryStrategy: {
    maxAttempts: 1 // Disable retries for timeout debugging
  }
});
```

### Parsing Errors

```typescript
try {
  const result = await integration.analyze();
} catch (error) {
  if (error instanceof CLIError && error.category === CLIErrorCategory.PARSE_ERROR) {
    console.error('Parse error. Try:');
    console.error('  - Run CLI manually: npm run release:analyze');
    console.error('  - Check CLI output format');
    console.error('  - Update CLI to latest version');
  }
}
```

## API Reference

See TypeScript definitions in `ReleaseAnalysisIntegration.ts` for complete API documentation.

### Main Classes

- `ReleaseAnalysisIntegration` - Main integration interface
- `AnalysisResultWrapper` - Wrapped result with convenience methods

### Key Methods

- `analyze()` - Execute analysis and return wrapped result
- `isAvailable()` - Check if CLI is available
- `getVersion()` - Get CLI version
- `analyzeDryRun()` - Execute in dry-run mode
- `analyzeSince()` - Analyze changes since specific tag

### Result Methods

- Version: `getCurrentVersion()`, `getRecommendedVersion()`, `getBumpType()`
- Changes: `getBreakingChanges()`, `getFeatures()`, `getBugFixes()`
- Queries: `hasBreakingChanges()`, `hasFeatures()`, `getChangeCount()`
- Filtering: `getBreakingChangesBySeverity()`, `getFeaturesByCategory()`
- Summary: `getSummary()`, `getSummaryString()`
- Confidence: `getOverallConfidence()`, `isConfident()`
