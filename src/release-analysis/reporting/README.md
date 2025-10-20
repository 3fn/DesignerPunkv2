# Release Analysis Reporting

This module provides comprehensive reporting functionality for the release analysis system, supporting multiple output formats and persistence options.

## Features

- **Multiple Report Formats**: Summary, detailed, and JSON outputs
- **Configurable Content**: Control what information is included in reports
- **File Persistence**: Save reports to disk in various formats
- **CLI Integration**: Seamless integration with the CLI interface

## Report Types

### Summary Report
Concise overview perfect for quick decision-making:
- Version recommendation with confidence
- Change counts by type
- Quality indicators
- Key warnings or issues

### Detailed Report
Comprehensive analysis for thorough review:
- Full analysis scope information
- Detailed change breakdown with descriptions
- Evidence and rationale for recommendations
- Complete confidence metrics
- Quality analysis with specific items needing review

### JSON Report
Machine-readable format for automation:
- Structured data for programmatic consumption
- All analysis results in standardized format
- Configurable content inclusion
- Integration-friendly output

## Usage

```typescript
import { AnalysisReporter } from './AnalysisReporter';

const reporter = new AnalysisReporter();

// Generate summary report
const summary = reporter.generateSummaryReport(analysisResult);
console.log(summary);

// Generate detailed report
const detailed = reporter.generateDetailedReport(analysisResult, {
  format: {
    type: 'detailed',
    includeMetadata: true,
    includeConfidence: true,
    includeEvidence: true,
    includeReleaseNotes: true
  }
});

// Save JSON report to file
await reporter.saveReport(
  analysisResult,
  { type: 'json', includeMetadata: true, includeConfidence: true, includeEvidence: true },
  './reports/analysis-result.json'
);
```

## Configuration Options

### ReportFormat
- `type`: 'summary' | 'detailed' | 'json'
- `includeMetadata`: Include generation metadata
- `includeConfidence`: Include confidence metrics
- `includeEvidence`: Include supporting evidence
- `includeReleaseNotes`: Include generated release notes

### ReportOptions
- `format`: ReportFormat configuration
- `colorOutput`: Enable colored console output (future)
- `maxWidth`: Maximum line width for formatting
- `includeTimestamp`: Add generation timestamp

## Integration Points

### CLI Integration
The reporter integrates seamlessly with the ReleaseCLI:
- `showSummaryReport()` uses `generateSummaryReport()`
- `showDetailedReport()` uses `generateDetailedReport()`
- `showJSONReport()` uses `generateJSONReport()`

### File Persistence
Reports can be saved to disk with automatic directory creation:
- Supports all report formats
- Configurable content inclusion
- Error handling with clear messages
- Timestamp options for audit trails

## Quality Features

### Confidence Indicators
- Overall confidence scoring
- Component-specific confidence (extraction, versioning, completeness)
- Visual indicators for low confidence areas
- Recommendations for manual review

### Quality Analysis
- Ambiguous items requiring review
- Filtered documentation-only changes
- Version recommendation confidence assessment
- Processing quality metrics

### Error Handling
- Graceful handling of missing data
- Clear error messages for file operations
- Fallback formatting for malformed data
- Validation of report format options

## Future Enhancements

- **Colored Output**: Terminal color support for better readability
- **Template System**: Customizable report templates
- **Export Formats**: Additional formats like HTML, PDF
- **Interactive Reports**: Web-based interactive analysis views
- **Comparison Reports**: Side-by-side analysis comparisons