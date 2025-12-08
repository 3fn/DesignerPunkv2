#!/usr/bin/env ts-node
/**
 * Generate Platform-Specific Token Files
 * 
 * This script generates DesignTokens files for web, iOS, and Android platforms.
 */

import { TokenFileGenerator } from '../src/generators/TokenFileGenerator';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🚀 Generating platform-specific token files...\n');

  const generator = new TokenFileGenerator();
  const outputDir = path.join(process.cwd(), 'dist');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Generate all platform files
    const results = generator.generateAll({
      outputDir,
      version: '1.0.0',
      includeComments: true,
      groupByCategory: true
    });

    // Write files to disk
    for (const result of results) {
      if (result.valid) {
        fs.writeFileSync(result.filePath, result.content, 'utf-8');
      }
    }

    // Report results
    console.log('📊 Generation Results:\n');
    for (const result of results) {
      const status = result.valid ? '✅' : '❌';
      console.log(`${status} ${result.platform.toUpperCase()}`);
      console.log(`   File: ${result.filePath}`);
      console.log(`   Tokens: ${result.tokenCount} primitive, ${result.semanticTokenCount} semantic`);
      
      if (result.warnings && result.warnings.length > 0) {
        console.log(`   ⚠️  Warnings: ${result.warnings.length}`);
        result.warnings.forEach((w: string) => console.log(`      - ${w}`));
      }
      
      if (result.errors && result.errors.length > 0) {
        console.log(`   ❌ Errors: ${result.errors.length}`);
        result.errors.forEach((e: string) => console.log(`      - ${e}`));
      }
      
      console.log('');
    }

    const allValid = results.every((r: any) => r.valid);
    if (allValid) {
      console.log('✨ All platform files generated successfully!');
      process.exit(0);
    } else {
      console.error('❌ Some platform files failed to generate');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error generating platform files:', error);
    process.exit(1);
  }
}

main();
