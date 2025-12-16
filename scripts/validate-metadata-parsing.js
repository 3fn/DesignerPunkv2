#!/usr/bin/env node

/**
 * Metadata Parsing Validation Script
 * 
 * Purpose: Validate that steering document metadata is machine-readable and parseable
 * Approach: Parse metadata from metadata-analysis.md artifact (not source documents)
 * Validates: TypeScript interface compatibility, required fields, data types
 */

const fs = require('fs');
const path = require('path');

// TypeScript interface definition (for validation reference)
const METADATA_SCHEMA = {
  required: ['date', 'lastReviewed', 'purpose', 'organization', 'scope', 'layer', 'relevantTasks', 'inclusion'],
  optional: ['trigger', 'updated', 'context', 'approach'],
  types: {
    date: 'string',
    lastReviewed: 'string',
    purpose: 'string',
    organization: 'string',
    scope: 'string',
    layer: 'number',
    relevantTasks: 'array-or-string',
    inclusion: 'string',
    trigger: 'array'
  },
  enums: {
    organization: ['process-standard'],
    scope: ['cross-project'],
    layer: [0, 1, 2, 3],
    inclusion: ['always', 'conditional']
  }
};

const VALID_TASK_TYPES = [
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
  'hook-setup',
  'all-tasks'
];

/**
 * Parse metadata from metadata-analysis.md artifact
 */
function parseMetadataAnalysis() {
  const analysisPath = path.join(__dirname, '..', '.kiro', 'specs', '020-steering-documentation-refinement', 'metadata-analysis.md');
  
  if (!fs.existsSync(analysisPath)) {
    throw new Error(`Metadata analysis file not found: ${analysisPath}`);
  }
  
  const content = fs.readFileSync(analysisPath, 'utf-8');
  const documents = [];
  
  // Parse document sections
  const docSections = content.split('### ').slice(1); // Skip header
  
  for (const section of docSections) {
    const lines = section.split('\n');
    const docName = lines[0].trim();
    
    // Skip summary section and subsections (they don't have .md extension)
    if (!docName.endsWith('.md')) continue;
    
    const hasMetadata = section.includes('**Has metadata header**: Yes');
    
    if (hasMetadata) {
      const metadata = {};
      const fieldLines = section.split('**Metadata fields found:**')[1];
      
      if (fieldLines) {
        const fields = fieldLines.split('\n').filter(line => line.trim().startsWith('- '));
        
        for (const field of fields) {
          // Parse field: "- Date**: October 20, 2025" or "- inclusion: conditional"
          let match = field.match(/- (.+?)\*\*:\s*(.+)/);
          if (match) {
            const [, key, value] = match;
            metadata[key.trim()] = value.trim();
          } else {
            // Try YAML frontmatter format: "- key: value"
            match = field.match(/- ([^:]+):\s*(.+)/);
            if (match) {
              const [, key, value] = match;
              metadata[key.trim()] = value.trim();
            }
          }
        }
      }
      
      documents.push({
        name: docName,
        hasMetadata: true,
        metadata
      });
    } else {
      documents.push({
        name: docName,
        hasMetadata: false,
        metadata: {}
      });
    }
  }
  
  return documents;
}

/**
 * Validate metadata field types and values
 */
function validateMetadata(docName, metadata) {
  const errors = [];
  const warnings = [];
  
  // Check required fields (with flexible field name matching)
  for (const field of METADATA_SCHEMA.required) {
    // Try multiple variations of field names
    const variations = [
      field,
      field.charAt(0).toUpperCase() + field.slice(1),
      field.replace(/([A-Z])/g, ' $1').trim(), // camelCase to "Camel Case"
      field.replace(/([A-Z])/g, ' $1').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') // "Camel Case"
    ];
    
    const found = variations.some(v => metadata[v] !== undefined);
    
    if (!found) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate field values (case-insensitive key matching)
  const metadataLower = {};
  for (const [key, value] of Object.entries(metadata)) {
    metadataLower[key.toLowerCase()] = value;
  }
  
  // Validate organization
  if (metadataLower.organization) {
    if (!METADATA_SCHEMA.enums.organization.includes(metadataLower.organization)) {
      errors.push(`Invalid organization value: "${metadataLower.organization}". Must be one of: ${METADATA_SCHEMA.enums.organization.join(', ')}`);
    }
  }
  
  // Validate scope
  if (metadataLower.scope) {
    if (!METADATA_SCHEMA.enums.scope.includes(metadataLower.scope)) {
      errors.push(`Invalid scope value: "${metadataLower.scope}". Must be one of: ${METADATA_SCHEMA.enums.scope.join(', ')}`);
    }
  }
  
  // Validate layer (if present)
  if (metadataLower.layer !== undefined) {
    const layer = parseInt(metadataLower.layer);
    if (isNaN(layer) || !METADATA_SCHEMA.enums.layer.includes(layer)) {
      errors.push(`Invalid layer value: "${metadataLower.layer}". Must be one of: ${METADATA_SCHEMA.enums.layer.join(', ')}`);
    }
  }
  
  // Validate inclusion
  if (metadataLower.inclusion) {
    if (!METADATA_SCHEMA.enums.inclusion.includes(metadataLower.inclusion)) {
      errors.push(`Invalid inclusion value: "${metadataLower.inclusion}". Must be one of: ${METADATA_SCHEMA.enums.inclusion.join(', ')}`);
    }
  }
  
  // Validate relevantTasks
  if (metadataLower.relevanttasks || metadataLower['relevant tasks']) {
    const relevantTasks = metadataLower.relevanttasks || metadataLower['relevant tasks'];
    if (relevantTasks !== 'all-tasks') {
      // Check if it's a comma-separated list
      const tasks = relevantTasks.split(',').map(t => t.trim());
      for (const task of tasks) {
        if (!VALID_TASK_TYPES.includes(task)) {
          errors.push(`Invalid task type in relevantTasks: "${task}". Must be one of: ${VALID_TASK_TYPES.join(', ')}`);
        }
      }
    }
  }
  
  // Validate date format (should be ISO 8601: YYYY-MM-DD)
  if (metadataLower.date) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(metadataLower.date)) {
      warnings.push(`Date format should be ISO 8601 (YYYY-MM-DD), found: "${metadataLower.date}"`);
    }
  }
  
  // Validate lastReviewed format
  if (metadataLower.lastreviewed || metadataLower['last reviewed']) {
    const lastReviewed = metadataLower.lastreviewed || metadataLower['last reviewed'];
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(lastReviewed)) {
      warnings.push(`Last Reviewed format should be ISO 8601 (YYYY-MM-DD), found: "${lastReviewed}"`);
    }
  }
  
  return { errors, warnings };
}

/**
 * Generate validation report
 */
function generateReport(documents) {
  console.log('\n=== Metadata Parsing Validation Report ===\n');
  console.log(`Total documents analyzed: ${documents.length}`);
  console.log(`Documents with metadata: ${documents.filter(d => d.hasMetadata).length}`);
  console.log(`Documents without metadata: ${documents.filter(d => !d.hasMetadata).length}\n`);
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  // Validate each document with metadata
  for (const doc of documents) {
    if (doc.hasMetadata) {
      const { errors, warnings } = validateMetadata(doc.name, doc.metadata);
      
      if (errors.length > 0 || warnings.length > 0) {
        console.log(`\n📄 ${doc.name}`);
        
        if (errors.length > 0) {
          console.log('  ❌ Errors:');
          errors.forEach(err => console.log(`     - ${err}`));
          totalErrors += errors.length;
        }
        
        if (warnings.length > 0) {
          console.log('  ⚠️  Warnings:');
          warnings.forEach(warn => console.log(`     - ${warn}`));
          totalWarnings += warnings.length;
        }
      } else {
        console.log(`\n📄 ${doc.name}`);
        console.log('  ✅ Valid metadata');
      }
    } else {
      console.log(`\n📄 ${doc.name}`);
      console.log('  ⚠️  No metadata header');
      totalWarnings++;
    }
  }
  
  // Summary
  console.log('\n=== Summary ===\n');
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n✅ All metadata is valid and machine-readable!');
  } else if (totalErrors === 0) {
    console.log('\n⚠️  Metadata is parseable but has warnings (non-blocking)');
  } else {
    console.log('\n❌ Metadata has errors that must be fixed');
  }
  
  // Machine-readable summary
  console.log('\n=== Machine-Readable Summary ===\n');
  console.log(JSON.stringify({
    totalDocuments: documents.length,
    documentsWithMetadata: documents.filter(d => d.hasMetadata).length,
    documentsWithoutMetadata: documents.filter(d => !d.hasMetadata).length,
    totalErrors,
    totalWarnings,
    valid: totalErrors === 0
  }, null, 2));
  
  return totalErrors === 0;
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('Parsing metadata from metadata-analysis.md...');
    const documents = parseMetadataAnalysis();
    
    console.log(`Found ${documents.length} documents in analysis`);
    
    const isValid = generateReport(documents);
    
    process.exit(isValid ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
