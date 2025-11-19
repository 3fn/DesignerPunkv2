/**
 * Test Android Icon Size Token Generation
 * 
 * Verifies that icon size tokens are correctly generated for Android platform
 * with Kotlin Dp constants, formula comments, and typography pairing.
 */

const { TokenFileGenerator } = require('./dist/generators/TokenFileGenerator');
const { getAllPrimitiveTokens } = require('./dist/tokens');
const { getAllSemanticTokens } = require('./dist/tokens/semantic');

console.log('🧪 Testing Android Icon Size Token Generation\n');

// Initialize generator
const generator = new TokenFileGenerator();

// Get all tokens
const primitives = getAllPrimitiveTokens();
const semantics = getAllSemanticTokens();

console.log(`📊 Token counts:`);
console.log(`   Primitives: ${primitives.length}`);
console.log(`   Semantics: ${semantics.length}`);

// Filter icon tokens
const iconTokens = semantics.filter(t => t.category === 'icon');
console.log(`   Icon tokens: ${iconTokens.length}\n`);

// Generate Android tokens
const result = generator.generateAndroidTokens(primitives, semantics, './test-output');

console.log('📝 Generation Result:');
console.log(`   Platform: ${result.platform}`);
console.log(`   File: ${result.filePath}`);
console.log(`   Valid: ${result.valid}`);
console.log(`   Token count: ${result.tokenCount}`);
console.log(`   Semantic count: ${result.semanticTokenCount}`);

if (result.errors && result.errors.length > 0) {
  console.log(`   ❌ Errors: ${result.errors.join(', ')}`);
}

console.log('\n🔍 Checking Icon Size Tokens in Generated File:\n');

// Expected icon sizes (from design document)
// Note: Android uses snake_case naming (icon_size_050) not camelCase
const expectedSizes = {
  'icon_size_050': 13,
  'icon_size_075': 18,
  'icon_size_100': 24,
  'icon_size_125': 32,
  'icon_size_150': 28,
  'icon_size_200': 32,
  'icon_size_300': 32,
  'icon_size_400': 36,
  'icon_size_500': 40,
  'icon_size_600': 44,
  'icon_size_700': 48
};

let allTestsPassed = true;

// Check each expected icon size
for (const [tokenName, expectedValue] of Object.entries(expectedSizes)) {
  // Look for the token in generated content
  const regex = new RegExp(`val ${tokenName} = (\\d+)\\.dp`, 'i');
  const match = result.content.match(regex);
  
  if (match) {
    const actualValue = parseInt(match[1]);
    const passed = actualValue === expectedValue;
    
    console.log(`${passed ? '✅' : '❌'} ${tokenName}: ${actualValue}.dp ${passed ? '(correct)' : `(expected ${expectedValue})`}`);
    
    if (!passed) {
      allTestsPassed = false;
    }
    
    // Check for formula in comment
    const lineRegex = new RegExp(`val ${tokenName} = \\d+\\.dp // (.+)`, 'i');
    const lineMatch = result.content.match(lineRegex);
    
    if (lineMatch) {
      const comment = lineMatch[1];
      const hasFormula = comment.includes('×') || comment.includes('*');
      const hasPairing = comment.includes('Pairs with:') || comment.includes('Icon size for');
      
      if (hasFormula && hasPairing) {
        console.log(`   ✅ Comment includes formula and typography pairing`);
      } else {
        console.log(`   ⚠️  Comment missing: ${!hasFormula ? 'formula' : ''} ${!hasPairing ? 'typography pairing' : ''}`);
      }
    }
  } else {
    console.log(`❌ ${tokenName}: NOT FOUND in generated file`);
    allTestsPassed = false;
  }
}

console.log('\n📋 Sample Generated Output:\n');

// Extract a few icon size tokens to show format (Android uses snake_case)
const iconSizeRegex = /val icon_size_\d+ = \d+\.dp.*$/gm;
const matches = result.content.match(iconSizeRegex);

if (matches && matches.length > 0) {
  matches.slice(0, 3).forEach(line => {
    console.log(`   ${line}`);
  });
  console.log(`   ... (${matches.length} total icon size tokens)`);
} else {
  console.log('   ⚠️  No icon size tokens found in generated output');
}

console.log('\n🎯 Kotlin Syntax Validation:\n');

// Check for proper Kotlin syntax
const hasObjectDeclaration = result.content.includes('object DesignTokens');
const hasPackageDeclaration = result.content.includes('package com.designerpunk.tokens');
const hasBalancedBraces = (result.content.match(/{/g) || []).length === (result.content.match(/}/g) || []).length;
const hasDpSuffix = result.content.includes('.dp');

console.log(`   ${hasObjectDeclaration ? '✅' : '❌'} Has object DesignTokens declaration`);
console.log(`   ${hasPackageDeclaration ? '✅' : '❌'} Has package declaration`);
console.log(`   ${hasBalancedBraces ? '✅' : '❌'} Balanced braces`);
console.log(`   ${hasDpSuffix ? '✅' : '❌'} Uses .dp suffix for dimensions`);

console.log('\n' + '='.repeat(60));
console.log(allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
console.log('='.repeat(60));

process.exit(allTestsPassed ? 0 : 1);
