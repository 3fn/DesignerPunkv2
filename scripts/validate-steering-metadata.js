#!/usr/bin/env node

/**
 * Steering Document Metadata Validation Script
 * 
 * Validates metadata headers in steering documents against the schema defined in
 * .kiro/specs/020-steering-documentation-refinement/metadata-template.md
 * 
 * Usage: node scripts/validate-steering-metadata.js
 */

const fs = require('fs');
const path = require('path');

// Standardized task vocabulary (core 14 types)
const CORE_TASK_TYPES = [
  'spec-creation',
  'general-task-execution',
  'architecture',
  'coding',
  'accessibility-development',
  'validation',
  'debugging',
  'documentation',
  'maintenance',
  'performance-optimization',
  'file-organization',
  'refactoring',
  'migration',
  'hook-setup'
];

// Additional task types for conditional triggers
const ADDITIONAL_TASK_TYPES = [
  'component-development',
  'token-selection',
  'cross-platform-components',
  'build-issues',
  'typescript-errors',
  'testing-output'
];

const ALL_TASK_TYPES = [...CORE_TASK_TYPES, ...ADDITIONAL_TASK_TYPES];

// Valid values for controlled vocabulary fields
const VALID_ORGANIZATION = ['process-standard'];
const VALID_SCOPE = ['cross-project'];
const VALID_LAYERS = [0, 1, 2, 3];
const VALID_INCLUSION = ['always', 'conditional'];

// ISO 8601 date format regex (YYYY-MM-DD)
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse metadata from a markdown file
 */
function parseMetadata(content, filename) {
  const metadata = {
    filename,
    errors: [],
    warnings: [],
    fields: {}
  };

  // Extract metadata fields using regex
  const dateMatch = content.match(/\*\*Date\*\*:\s*(.+)/);
  const lastReviewedMatch = content.match(/\*\*Last Reviewed\*\*:\s*(.+)/);
  const purposeMatch = content.match(/\*\*Purpose\*\*:\s*(.+)/);
  const organizationMatch = content.match(/\*\*Organization\*\*:\s*(.+)/);
  const scopeMatch = content.match(/\*\*Scope\*\*:\s*(.+)/);
  const layerMatch = content.match(/\*\*Layer\*\*:\s*(.+)/);
  const relevantTasksMatch = content.match(/\*\*Relevant Tasks\*\*:\s*(.+)/);

  // Extract YAML front matter
  const yamlMatch = content.match(/---\n([\s\S]*?)\n---/);
  let yamlContent = '';
  if (yamlMatch) {
    yamlContent = yamlMatch[1];
  }

  const inclusionMatch = yamlContent.match(/inclusion:\s*(.+)/);
  const triggerMatch = yamlContent.match(/trigger:\s*(.+)/);

  // Store extracted values
  if (dateMatch) metadata.fields.date = dateMatch[1].trim();
  if (lastReviewedMatch) metadata.fields.lastReviewed = lastReviewedMatch[1].trim();
  if (purposeMatch) metadata.fields.purpose = purposeMatch[1].trim();
  if (organizationMatch) metadata.fields.organization = organizationMatch[1].trim();
  if (scopeMatch) metadata.fields.scope = scopeMatch[1].trim();
  if (layerMatch) metadata.fields.layer = layerMatch[1].trim();
  if (relevantTasksMatch) metadata.fields.relevantTasks = relevantTasksMatch[1].trim();
  if (inclusionMatch) metadata.fields.inclusion = inclusionMatch[1].trim();
  if (triggerMatch) metadata.fields.trigger = triggerMatch[1].trim();

  return metadata;
}

/**
 * Validate required fields presence
 */
function validateRequiredFields(metadata) {
  const requiredFields = [
    'date',
    'lastReviewed',
    'purpose',
    'organization',
    'scope',
    'layer',
    'relevantTasks',
    'inclusion'
  ];

  for (const field of requiredFields) {
    if (!metadata.fields[field]) {
      metadata.errors.push(`Missing required field: ${field}`);
    }
  }

  // Trigger is required if inclusion is conditional
  if (metadata.fields.inclusion === 'conditional' && !metadata.fields.trigger) {
    metadata.errors.push('Missing required field: trigger (required when inclusion is conditional)');
  }
}

/**
 * Validate date format (ISO 8601: YYYY-MM-DD)
 */
function validateDateFormat(metadata) {
  if (metadata.fields.date && !ISO_DATE_REGEX.test(metadata.fields.date)) {
    metadata.errors.push(`Invalid date format: "${metadata.fields.date}" (expected YYYY-MM-DD)`);
  }

  if (metadata.fields.lastReviewed && !ISO_DATE_REGEX.test(metadata.fields.lastReviewed)) {
    metadata.errors.push(`Invalid lastReviewed format: "${metadata.fields.lastReviewed}" (expected YYYY-MM-DD)`);
  }
}

/**
 * Validate layer number (0-3)
 */
function validateLayer(metadata) {
  if (metadata.fields.layer) {
    const layer = parseInt(metadata.fields.layer, 10);
    if (isNaN(layer) || !VALID_LAYERS.includes(layer)) {
      metadata.errors.push(`Invalid layer: "${metadata.fields.layer}" (expected 0, 1, 2, or 3)`);
    }
  }
}

/**
 * Validate organization field
 */
function validateOrganization(metadata) {
  if (metadata.fields.organization && !VALID_ORGANIZATION.includes(metadata.fields.organization)) {
    metadata.errors.push(`Invalid organization: "${metadata.fields.organization}" (expected: ${VALID_ORGANIZATION.join(', ')})`);
  }
}

/**
 * Validate scope field
 */
function validateScope(metadata) {
  if (metadata.fields.scope && !VALID_SCOPE.includes(metadata.fields.scope)) {
    metadata.errors.push(`Invalid scope: "${metadata.fields.scope}" (expected: ${VALID_SCOPE.join(', ')})`);
  }
}

/**
 * Validate inclusion field
 */
function validateInclusion(metadata) {
  if (metadata.fields.inclusion && !VALID_INCLUSION.includes(metadata.fields.inclusion)) {
    metadata.errors.push(`Invalid inclusion: "${metadata.fields.inclusion}" (expected: ${VALID_INCLUSION.join(', ')})`);
  }
}

/**
 * Validate task type names against standardized vocabulary
 */
function validateTaskTypes(metadata) {
  // Validate relevantTasks
  if (metadata.fields.relevantTasks) {
    const relevantTasks = metadata.fields.relevantTasks;
    
    // Special case: "all-tasks" is valid
    if (relevantTasks === 'all-tasks') {
      return;
    }

    // Parse comma-separated list
    const taskTypes = relevantTasks.split(',').map(t => t.trim());
    
    for (const taskType of taskTypes) {
      if (!CORE_TASK_TYPES.includes(taskType)) {
        metadata.errors.push(`Invalid task type in relevantTasks: "${taskType}" (must be from core 14 types or "all-tasks")`);
      }
    }
  }

  // Validate trigger task types
  if (metadata.fields.trigger) {
    const triggerTypes = metadata.fields.trigger.split(',').map(t => t.trim());
    
    for (const taskType of triggerTypes) {
      if (!ALL_TASK_TYPES.includes(taskType)) {
        metadata.errors.push(`Invalid task type in trigger: "${taskType}" (not in standardized vocabulary)`);
      }
    }
  }
}

/**
 * Check for staleness warnings
 */
function checkStaleness(metadata) {
  if (!metadata.fields.lastReviewed) {
    return;
  }

  // Only check staleness if date format is valid
  if (!ISO_DATE_REGEX.test(metadata.fields.lastReviewed)) {
    return; // Invalid date format, already caught by validateDateFormat
  }

  const lastReviewed = new Date(metadata.fields.lastReviewed);
  const now = new Date();
  const monthsDiff = (now - lastReviewed) / (1000 * 60 * 60 * 24 * 30);

  if (monthsDiff > 12) {
    metadata.errors.push(`Document is stale: Last reviewed ${Math.floor(monthsDiff)} months ago (> 12 months)`);
  } else if (monthsDiff > 6) {
    metadata.warnings.push(`Document may be stale: Last reviewed ${Math.floor(monthsDiff)} months ago (> 6 months)`);
  }
}

/**
 * Validate a single steering document
 */
function validateDocument(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const filename = path.basename(filepath);
  
  const metadata = parseMetadata(content, filename);
  
  // Run all validations
  validateRequiredFields(metadata);
  validateDateFormat(metadata);
  validateLayer(metadata);
  validateOrganization(metadata);
  validateScope(metadata);
  validateInclusion(metadata);
  validateTaskTypes(metadata);
  checkStaleness(metadata);
  
  return metadata;
}

/**
 * Generate validation report
 */
function generateReport(results) {
  console.log('\n=== Steering Document Metadata Validation Report ===\n');
  
  let totalErrors = 0;
  let totalWarnings = 0;
  let validDocuments = 0;
  
  for (const result of results) {
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
    
    if (result.errors.length === 0 && result.warnings.length === 0) {
      validDocuments++;
      console.log(`✅ ${result.filename} - Valid metadata`);
    } else {
      console.log(`\n📄 ${result.filename}`);
      
      if (result.errors.length > 0) {
        console.log('  ❌ Errors:');
        result.errors.forEach(error => console.log(`     - ${error}`));
      }
      
      if (result.warnings.length > 0) {
        console.log('  ⚠️  Warnings:');
        result.warnings.forEach(warning => console.log(`     - ${warning}`));
      }
    }
  }
  
  console.log('\n=== Summary ===\n');
  console.log(`Total documents: ${results.length}`);
  console.log(`Valid documents: ${validDocuments}`);
  console.log(`Documents with errors: ${results.filter(r => r.errors.length > 0).length}`);
  console.log(`Documents with warnings: ${results.filter(r => r.warnings.length > 0).length}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n✅ All steering documents have valid metadata!\n');
    return 0;
  } else if (totalErrors === 0) {
    console.log('\n⚠️  All documents valid but some have warnings\n');
    return 0;
  } else {
    console.log('\n❌ Some documents have metadata errors that need to be fixed\n');
    return 1;
  }
}

/**
 * Main execution
 */
function main() {
  const steeringDir = path.join(process.cwd(), '.kiro', 'steering');
  
  if (!fs.existsSync(steeringDir)) {
    console.error(`Error: Steering directory not found at ${steeringDir}`);
    process.exit(1);
  }
  
  // Get all markdown files in steering directory
  const files = fs.readdirSync(steeringDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(steeringDir, file));
  
  if (files.length === 0) {
    console.log('No markdown files found in steering directory');
    process.exit(0);
  }
  
  console.log(`Found ${files.length} steering documents to validate\n`);
  
  // Validate all documents
  const results = files.map(validateDocument);
  
  // Generate and display report
  const exitCode = generateReport(results);
  process.exit(exitCode);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  parseMetadata,
  validateDocument,
  CORE_TASK_TYPES,
  ALL_TASK_TYPES
};
