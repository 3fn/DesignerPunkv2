#!/usr/bin/env ts-node
/**
 * Generate Platform-Specific Token Files
 * 
 * This script generates DesignTokens files for web, iOS, and Android platforms,
 * as well as ComponentTokens files for component-specific tokens registered
 * via the Rosetta System's ComponentTokenRegistry.
 * 
 * Output files:
 * - dist/DesignTokens.web.css (primitive + semantic tokens)
 * - dist/DesignTokens.ios.swift
 * - dist/DesignTokens.android.kt
 * - dist/ComponentTokens.web.css (component tokens from registry)
 * - dist/ComponentTokens.ios.swift
 * - dist/ComponentTokens.android.kt
 */

import { TokenFileGenerator } from '../src/generators/TokenFileGenerator';
import * as fs from 'fs';
import * as path from 'path';

// Import component token files to trigger registration with ComponentTokenRegistry
// These imports cause defineComponentTokens() to execute, which registers tokens
import '../src/components/core/Button-Icon/buttonIcon.tokens';
import '../src/components/core/Button-VerticalList-Item/Button-VerticalList-Item.tokens';
import '../src/components/core/Avatar/avatar.tokens';
import '../src/components/core/Badge-Label-Base/tokens';
// Note: Chip-Base tokens import removed - file doesn't exist at expected location

async function main() {
  console.log('🚀 Generating platform-specific token files...\n');

  const generator = new TokenFileGenerator();
  const outputDir = path.join(process.cwd(), 'dist');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Generate all platform files (primitive + semantic tokens)
    const results = generator.generateAll({
      outputDir,
      version: '1.0.0',
      includeComments: true,
      groupByCategory: true
    });

    // Write design token files to disk
    for (const result of results) {
      if (result.valid) {
        fs.writeFileSync(result.filePath, result.content, 'utf-8');
      }
    }

    // Report design token results
    console.log('📊 Design Token Generation Results:\n');
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

    // Generate component tokens (from ComponentTokenRegistry)
    console.log('📊 Component Token Generation Results:\n');
    const componentResults = generator.generateComponentTokens({
      outputDir,
      version: '1.0.0',
      includeComments: true
    });

    // Write component token files to disk
    for (const result of componentResults) {
      if (result.valid) {
        fs.writeFileSync(result.filePath, result.content, 'utf-8');
      }
    }

    // Report component token results
    for (const result of componentResults) {
      const status = result.valid ? '✅' : '❌';
      console.log(`${status} ${result.platform.toUpperCase()} Component Tokens`);
      console.log(`   File: ${result.filePath}`);
      console.log(`   Tokens: ${result.tokenCount} component tokens`);
      
      if (result.errors && result.errors.length > 0) {
        console.log(`   ❌ Errors: ${result.errors.length}`);
        result.errors.forEach((e: string) => console.log(`      - ${e}`));
      }
      
      console.log('');
    }

    const allDesignValid = results.every((r: any) => r.valid);
    const allComponentValid = componentResults.every((r: any) => r.valid);
    
    if (allDesignValid && allComponentValid) {
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
