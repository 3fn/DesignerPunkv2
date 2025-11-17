/**
 * Generate Token Files Script
 * 
 * Generates platform-specific token constant files and writes them to the output directory.
 * Run this script to create DesignTokens.web.css, DesignTokens.ios.swift, and DesignTokens.android.kt
 */

import * as fs from 'fs';
import * as path from 'path';
import { TokenFileGenerator } from './TokenFileGenerator';
import { SemanticTokenValidator } from '../validators/SemanticTokenValidator';
import { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
import { getAllPrimitiveTokens } from '../tokens';
import { getAllSemanticTokens } from '../tokens/semantic';

/**
 * Main generation function
 */
export function generateTokenFiles(outputDir: string = 'output'): void {
  console.log('🚀 Starting token file generation...\n');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}\n`);
  }

  // Validate semantic token references before generation
  console.log('🔍 Validating semantic token references...\n');
  
  const primitiveRegistry = new PrimitiveTokenRegistry();
  const semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);
  const validator = new SemanticTokenValidator(primitiveRegistry, semanticRegistry);
  
  const primitiveTokens = getAllPrimitiveTokens();
  const semanticTokens = getAllSemanticTokens();
  
  const validationResult = validator.validateSemanticReferences(semanticTokens, primitiveTokens);
  
  if (validationResult.level === 'Error') {
    console.error('❌ Semantic token validation failed:\n');
    console.error(`   ${validationResult.message}`);
    console.error(`   ${validationResult.rationale}\n`);
    
    if (validationResult.suggestions) {
      console.error('💡 Suggestions:');
      validationResult.suggestions.forEach(suggestion => {
        console.error(`   - ${suggestion}`);
      });
      console.error('');
    }
    
    console.error('⚠️  Token generation aborted due to validation errors.\n');
    return;
  }
  
  if (validationResult.level === 'Warning') {
    console.warn('⚠️  Semantic token validation passed with warnings:\n');
    console.warn(`   ${validationResult.message}`);
    console.warn(`   ${validationResult.rationale}\n`);
  } else {
    console.log('✅ Semantic token validation passed\n');
  }

  // Initialize generator
  const generator = new TokenFileGenerator();

  // Generate all platform files
  const results = generator.generateAll({
    outputDir,
    version: '1.0.0',
    includeComments: true,
    groupByCategory: true
  });

  // Write files to disk
  console.log('📝 Writing token files...\n');
  
  for (const result of results) {
    const filePath = path.join(result.filePath);
    
    try {
      fs.writeFileSync(filePath, result.content, 'utf-8');
      
      if (result.valid) {
        console.log(`✅ ${result.platform.toUpperCase()}: ${path.basename(filePath)}`);
        console.log(`   Tokens: ${result.tokenCount}`);
        console.log(`   Path: ${filePath}\n`);
      } else {
        console.log(`❌ ${result.platform.toUpperCase()}: ${path.basename(filePath)} - VALIDATION FAILED`);
        console.log(`   Errors: ${result.errors?.join(', ')}\n`);
      }
    } catch (error) {
      console.error(`❌ Failed to write ${result.platform} file:`, error);
    }
  }

  // Validate cross-platform consistency
  console.log('🔍 Validating cross-platform consistency...\n');
  const validation = generator.validateCrossPlatformConsistency(results);

  if (validation.consistent) {
    console.log('✅ All platforms are mathematically consistent!\n');
  } else {
    console.log('⚠️  Cross-platform consistency issues detected:\n');
    validation.issues.forEach(issue => {
      console.log(`   - ${issue}`);
    });
    console.log('');
  }

  // Summary
  console.log('📊 Generation Summary:');
  console.log(`   Total platforms: ${results.length}`);
  console.log(`   Successful: ${results.filter(r => r.valid).length}`);
  console.log(`   Failed: ${results.filter(r => !r.valid).length}`);
  console.log(`   Total tokens per platform: ${results[0]?.tokenCount || 0}`);
  console.log('\n✨ Token file generation complete!');
}

// Run if executed directly
if (require.main === module) {
  const outputDir = process.argv[2] || 'output';
  generateTokenFiles(outputDir);
}
