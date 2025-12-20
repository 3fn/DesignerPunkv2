#!/usr/bin/env ts-node

/**
 * Test Categorization Script
 * 
 * Adds categorization metadata to all test files in the DesignerPunk test suite.
 * All tests are categorized as evergreen (permanent behavior verification).
 * 
 * Usage: ts-node scripts/categorize-tests.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestCategorization {
  filePath: string;
  category: 'evergreen' | 'temporary';
  purpose: string;
  retirementCriteria?: string;
  createdInSpec?: string;
}

/**
 * Generate purpose statement based on file path and name
 */
function generatePurpose(filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  const dirName = path.dirname(filePath);
  
  // Component tests
  if (dirName.includes('/components/')) {
    const componentName = fileName.replace('.test', '').replace('.lifecycle', '').replace('.icon-integration', '').replace('.integration', '');
    
    if (fileName.includes('lifecycle')) {
      return `Verify ${componentName} component lifecycle behavior and rendering`;
    }
    if (fileName.includes('icon-integration')) {
      return `Verify ${componentName} component integrates correctly with Icon component`;
    }
    if (fileName.includes('integration')) {
      return `Verify ${componentName} component integration behavior`;
    }
    return `Verify ${componentName} component renders correctly and behaves as expected`;
  }
  
  // Token tests
  if (dirName.includes('/tokens/')) {
    if (fileName.includes('TokenCompliance')) {
      return 'Verify components use design tokens correctly without hard-coded values';
    }
    if (fileName.includes('Validator')) {
      return 'Verify token references are valid and resolvable';
    }
    if (fileName.includes('Generation')) {
      return 'Verify token generation produces valid tokens with correct structure';
    }
    const tokenType = fileName.replace('Tokens.test', '').replace('.test', '');
    return `Verify ${tokenType} tokens are correctly defined and structured`;
  }
  
  // Build system tests
  if (dirName.includes('/build/') || fileName.includes('Build')) {
    if (fileName.includes('Orchestrator')) {
      return 'Verify build orchestration coordinates token generation and platform builds';
    }
    if (fileName.includes('Integration')) {
      return 'Verify build system integration produces correct outputs for all platforms';
    }
    if (fileName.includes('Generator')) {
      return 'Verify build generators produce correct file formats for target platforms';
    }
    return 'Verify build system generates required outputs with correct structure';
  }
  
  // Generator tests
  if (dirName.includes('/generators/')) {
    if (fileName.includes('TokenFileGenerator')) {
      return 'Verify token file generation produces valid output files for all platforms';
    }
    const generatorType = fileName.replace('Generator.test', '').replace('.test', '');
    return `Verify ${generatorType} generator produces correct output format`;
  }
  
  // Provider tests
  if (dirName.includes('/providers/')) {
    if (fileName.includes('FormatGenerator')) {
      const platform = fileName.includes('iOS') ? 'iOS' : fileName.includes('Android') ? 'Android' : 'Web';
      return `Verify ${platform} format generator produces correct platform-specific output`;
    }
    if (fileName.includes('Providers')) {
      return 'Verify provider system supplies correct values for token generation';
    }
    return 'Verify provider functionality works correctly';
  }
  
  // Validator tests
  if (dirName.includes('/validators/')) {
    const validatorType = fileName.replace('Validator.test', '').replace('.test', '');
    return `Verify ${validatorType} validation catches invalid patterns and enforces rules`;
  }
  
  // Registry tests
  if (dirName.includes('/registries/')) {
    const registryType = fileName.replace('Registry.test', '').replace('.test', '');
    return `Verify ${registryType} registry provides correct token lookup and management`;
  }
  
  // Security tests
  if (dirName.includes('/security/')) {
    if (fileName.includes('Contamination')) {
      return 'Verify contamination prevention system blocks unsafe operations';
    }
    if (fileName.includes('AIAgent')) {
      return 'Verify AI agent restrictions enforce safety constraints';
    }
    return 'Verify security system enforces required constraints';
  }
  
  // Integration tests
  if (dirName.includes('/integration/') || fileName.includes('Integration')) {
    if (fileName.includes('Validation')) {
      return 'Verify validation coordinator integrates validation systems correctly';
    }
    if (fileName.includes('Semantic')) {
      return 'Verify semantic token generation integrates correctly across systems';
    }
    return 'Verify system integration works correctly across components';
  }
  
  // Performance tests
  if (fileName.includes('Performance')) {
    return 'Verify system performance meets requirements and thresholds';
  }
  
  // Release/Publishing tests
  if (dirName.includes('/release/') || dirName.includes('/publishing/')) {
    if (fileName.includes('Publisher')) {
      const platform = fileName.includes('GitHub') ? 'GitHub' : fileName.includes('Npm') ? 'NPM' : '';
      return `Verify ${platform} publisher handles package publishing correctly`;
    }
    if (fileName.includes('Workflow')) {
      return 'Verify publishing workflow coordinates release process correctly';
    }
    return 'Verify release system functionality works correctly';
  }
  
  // Type tests
  if (dirName.includes('/types/')) {
    return 'Verify type definitions are correct and complete';
  }
  
  // Default fallback
  const testName = fileName.replace('.test', '');
  return `Verify ${testName} functionality works correctly`;
}

/**
 * Check if file already has categorization metadata
 */
function hasCategorizationMetadata(content: string): boolean {
  return content.includes('@category');
}

/**
 * Add categorization metadata to test file
 */
function addCategorizationMetadata(filePath: string, categorization: TestCategorization): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already has categorization
  if (hasCategorizationMetadata(content)) {
    console.log(`⏭️  Skipping ${filePath} (already categorized)`);
    return;
  }
  
  // Build JSDoc comment
  const jsdoc = [
    '/**',
    ` * @category ${categorization.category}`,
    ` * @purpose ${categorization.purpose}`,
  ];
  
  if (categorization.retirementCriteria) {
    jsdoc.push(` * @retirementCriteria ${categorization.retirementCriteria}`);
  }
  
  if (categorization.createdInSpec) {
    jsdoc.push(` * @createdInSpec ${categorization.createdInSpec}`);
  }
  
  jsdoc.push(' */');
  jsdoc.push('');
  
  const metadataBlock = jsdoc.join('\n');
  
  // Add metadata at the top of the file
  const updatedContent = metadataBlock + content;
  
  fs.writeFileSync(filePath, updatedContent, 'utf-8');
  console.log(`✅ Categorized ${filePath}`);
}

/**
 * Recursively find all test files
 */
function findTestFiles(dir: string): string[] {
  const results: string[] = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        results.push(...findTestFiles(filePath));
      }
    } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
      results.push(filePath);
    }
  }
  
  return results;
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Finding test files...\n');
  
  // Find all test files
  const testFiles = findTestFiles('src');
  
  console.log(`📊 Found ${testFiles.length} test files\n`);
  
  let categorizedCount = 0;
  let skippedCount = 0;
  
  // Categorize each test file
  for (const filePath of testFiles) {
    const purpose = generatePurpose(filePath);
    
    const categorization: TestCategorization = {
      filePath,
      category: 'evergreen', // All tests are evergreen based on confirmed actions review
      purpose,
    };
    
    const content = fs.readFileSync(filePath, 'utf-8');
    if (hasCategorizationMetadata(content)) {
      skippedCount++;
    } else {
      addCategorizationMetadata(filePath, categorization);
      categorizedCount++;
    }
  }
  
  console.log('\n📈 Categorization Summary:');
  console.log(`   Total test files: ${testFiles.length}`);
  console.log(`   Categorized: ${categorizedCount}`);
  console.log(`   Skipped (already categorized): ${skippedCount}`);
  console.log(`   Evergreen: ${testFiles.length}`);
  console.log(`   Temporary: 0`);
  
  console.log('\n✅ Test categorization complete!');
}

main();
