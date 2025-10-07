/**
 * ValidationReporter Usage Examples
 * 
 * This file demonstrates how to use the ValidationReporter to generate
 * detailed validation reports with platform differences, actionable suggestions,
 * and multiple output formats.
 */

import { InterfaceValidator } from './InterfaceValidator';
import { ValidationReporter } from './ValidationReporter';
import { InterfaceDefinition } from './types/InterfaceDefinition';

// Example 1: Basic validation report generation
function basicValidationReport() {
  const validator = new InterfaceValidator();
  const reporter = new ValidationReporter();

  // Define component interfaces for different platforms
  const interfaces: InterfaceDefinition[] = [
    {
      name: 'Button',
      platform: 'ios',
      properties: [
        {
          name: 'title',
          type: 'String',
          required: true,
          description: 'Button title text',
        },
        {
          name: 'disabled',
          type: 'Bool',
          required: false,
          description: 'Whether button is disabled',
        },
      ],
      methods: [
        {
          name: 'onClick',
          parameters: [],
          returnType: 'Void',
          description: 'Called when button is tapped',
        },
      ],
      events: [],
      states: [],
    },
    {
      name: 'Button',
      platform: 'android',
      properties: [
        {
          name: 'title',
          type: 'String',
          required: true,
          description: 'Button title text',
        },
        // Missing 'disabled' property - will cause validation error
      ],
      methods: [
        {
          name: 'onClick',
          parameters: [],
          returnType: 'Unit',
          description: 'Called when button is clicked',
        },
      ],
      events: [],
      states: [],
    },
  ];

  // Validate interfaces
  const validationReport = validator.validateInterfaces(interfaces);

  // Generate detailed report
  const detailedReport = reporter.generateReport(validationReport);

  console.log('Validation Status:', detailedReport.valid ? 'PASS' : 'FAIL');
  console.log('Total Errors:', detailedReport.summary.totalErrors);
  console.log('Total Warnings:', detailedReport.summary.totalWarnings);
  console.log('Platforms:', detailedReport.summary.platforms.join(', '));
}

// Example 2: Generate text report for console output
function generateTextReport() {
  const validator = new InterfaceValidator();
  const reporter = new ValidationReporter();

  const interfaces: InterfaceDefinition[] = [
    // ... interface definitions
  ];

  const validationReport = validator.validateInterfaces(interfaces);
  const detailedReport = reporter.generateReport(validationReport);

  // Format as text for console or log files
  const textReport = reporter.formatAsText(detailedReport);
  console.log(textReport);

  // Output includes:
  // - Header with component name and status
  // - Summary with error/warning counts
  // - Platform-specific results with file paths
  // - Platform differences
  // - Actionable suggestions with steps
}

// Example 3: Generate Markdown report for documentation
function generateMarkdownReport() {
  const validator = new InterfaceValidator();
  const reporter = new ValidationReporter();

  const interfaces: InterfaceDefinition[] = [
    // ... interface definitions
  ];

  const validationReport = validator.validateInterfaces(interfaces);
  const detailedReport = reporter.generateReport(validationReport);

  // Format as Markdown for documentation
  const markdownReport = reporter.formatAsMarkdown(detailedReport);

  // Save to file or include in documentation
  // fs.writeFileSync('validation-report.md', markdownReport);

  // Markdown includes:
  // - Formatted headers and sections
  // - Code blocks for file paths and types
  // - Bullet lists for suggestions
  // - Bold text for emphasis
}

// Example 4: Generate JSON report for CI/CD integration
function generateJSONReport() {
  const validator = new InterfaceValidator();
  const reporter = new ValidationReporter();

  const interfaces: InterfaceDefinition[] = [
    // ... interface definitions
  ];

  const validationReport = validator.validateInterfaces(interfaces);
  const detailedReport = reporter.generateReport(validationReport);

  // Format as JSON for machine processing
  const jsonReport = reporter.formatAsJSON(detailedReport);

  // Parse and use in CI/CD pipelines
  const parsed = JSON.parse(jsonReport);
  
  if (!parsed.valid) {
    console.error('Validation failed!');
    process.exit(1);
  }
}

// Example 5: Access specific report sections
function accessReportSections() {
  const validator = new InterfaceValidator();
  const reporter = new ValidationReporter();

  const interfaces: InterfaceDefinition[] = [
    // ... interface definitions
  ];

  const validationReport = validator.validateInterfaces(interfaces);
  const detailedReport = reporter.generateReport(validationReport);

  // Access summary
  console.log('Summary:', detailedReport.summary);
  console.log('Platform Status:', detailedReport.summary.platformStatus);
  console.log('Errors by Type:', detailedReport.summary.errorsByType);

  // Access platform-specific results
  for (const platformResult of detailedReport.platformResults) {
    console.log(`\n${platformResult.platform}:`);
    console.log(`  Status: ${platformResult.status}`);
    console.log(`  Errors: ${platformResult.errorCount}`);
    
    // Access detailed errors with file paths
    for (const error of platformResult.errors) {
      console.log(`  - ${error.message}`);
      console.log(`    File: ${error.filePath}`);
      console.log(`    Suggestion: ${error.suggestion}`);
    }
  }

  // Access platform differences
  for (const diff of detailedReport.differences) {
    console.log(`\nDifference in ${diff.name}:`);
    console.log(`  Type: ${diff.type}`);
    console.log(`  Platforms: ${diff.platforms.join(', ')}`);
    console.log(`  Values:`, diff.values);
    console.log(`  Suggestion: ${diff.suggestion}`);
  }

  // Access actionable suggestions
  for (const suggestion of detailedReport.suggestions) {
    console.log(`\n[${suggestion.priority.toUpperCase()}] ${suggestion.title}`);
    console.log(`  ${suggestion.description}`);
    console.log('  Steps:');
    suggestion.steps.forEach((step, i) => {
      console.log(`    ${i + 1}. ${step}`);
    });
  }
}

// Example 6: Filter errors by type
function filterErrorsByType() {
  const validator = new InterfaceValidator();
  const reporter = new ValidationReporter();

  const interfaces: InterfaceDefinition[] = [
    // ... interface definitions
  ];

  const validationReport = validator.validateInterfaces(interfaces);
  const detailedReport = reporter.generateReport(validationReport);

  // Get all property mismatch errors
  const propertyErrors = detailedReport.platformResults
    .flatMap(r => r.errors)
    .filter(e => e.type === 'property_mismatch');

  console.log('Property Mismatch Errors:', propertyErrors.length);

  // Get all method mismatch errors
  const methodErrors = detailedReport.platformResults
    .flatMap(r => r.errors)
    .filter(e => e.type === 'method_mismatch');

  console.log('Method Mismatch Errors:', methodErrors.length);
}

// Example 7: Check validation status for specific platform
function checkPlatformStatus() {
  const validator = new InterfaceValidator();
  const reporter = new ValidationReporter();

  const interfaces: InterfaceDefinition[] = [
    // ... interface definitions
  ];

  const validationReport = validator.validateInterfaces(interfaces);
  const detailedReport = reporter.generateReport(validationReport);

  // Check iOS validation status
  const iosStatus = detailedReport.summary.platformStatus['ios'];
  console.log('iOS Validation:', iosStatus);

  // Get iOS-specific errors
  const iosResult = detailedReport.platformResults.find(r => r.platform === 'ios');
  if (iosResult && iosResult.status === 'fail') {
    console.log('iOS Errors:');
    iosResult.errors.forEach(error => {
      console.log(`  - ${error.message}`);
      console.log(`    Location: ${error.location}`);
      console.log(`    File: ${error.filePath}`);
    });
  }
}

// Example 8: Generate report for CI/CD with exit code
function cicdValidation() {
  const validator = new InterfaceValidator();
  const reporter = new ValidationReporter();

  const interfaces: InterfaceDefinition[] = [
    // ... interface definitions
  ];

  try {
    const validationReport = validator.validateInterfaces(interfaces);
    const detailedReport = reporter.generateReport(validationReport);

    // Generate reports in multiple formats
    const textReport = reporter.formatAsText(detailedReport);
    const jsonReport = reporter.formatAsJSON(detailedReport);

    // Save reports
    // fs.writeFileSync('validation-report.txt', textReport);
    // fs.writeFileSync('validation-report.json', jsonReport);

    // Exit with appropriate code
    if (!detailedReport.valid) {
      console.error('Validation failed!');
      console.error(`Found ${detailedReport.summary.totalErrors} errors`);
      process.exit(1);
    }

    console.log('Validation passed!');
    process.exit(0);
  } catch (error) {
    console.error('Validation error:', error);
    process.exit(2);
  }
}

// Export examples for documentation
export {
  basicValidationReport,
  generateTextReport,
  generateMarkdownReport,
  generateJSONReport,
  accessReportSections,
  filterErrorsByType,
  checkPlatformStatus,
  cicdValidation,
};
