#!/usr/bin/env node
/**
 * Verify Build Output
 * Tests that compiled JavaScript in dist/ works correctly
 */

const { TokenFileGenerator } = require('./dist/generators/TokenFileGenerator');
const { iOSFormatGenerator } = require('./dist/providers/iOSFormatGenerator');
const { getAllSemanticTokens } = require('./dist/tokens/semantic');

console.log('🔍 Verifying build output...\n');

// Test 1: Check that classes can be instantiated
try {
  const generator = new TokenFileGenerator();
  const iosFormatter = new iOSFormatGenerator();
  console.log('✅ Classes instantiate correctly');
} catch (error) {
  console.error('❌ Failed to instantiate classes:', error.message);
  process.exit(1);
}

// Test 2: Check that semantic tokens can be retrieved
try {
  const semantics = getAllSemanticTokens();
  if (semantics.length === 0) {
    throw new Error('No semantic tokens found');
  }
  console.log(`✅ Semantic tokens retrieved (${semantics.length} tokens)`);
} catch (error) {
  console.error('❌ Failed to retrieve semantic tokens:', error.message);
  process.exit(1);
}

// Test 3: Check that iOS formatter has semantic methods
try {
  const iosFormatter = new iOSFormatGenerator();
  if (typeof iosFormatter.formatSingleReferenceToken !== 'function') {
    throw new Error('formatSingleReferenceToken method missing');
  }
  if (typeof iosFormatter.formatMultiReferenceToken !== 'function') {
    throw new Error('formatMultiReferenceToken method missing');
  }
  if (typeof iosFormatter.generateSectionComment !== 'function') {
    throw new Error('generateSectionComment method missing');
  }
  console.log('✅ iOS formatter has all semantic methods');
} catch (error) {
  console.error('❌ iOS formatter missing methods:', error.message);
  process.exit(1);
}

// Test 4: Check that iOS generation includes semantic tokens
try {
  const generator = new TokenFileGenerator();
  const result = generator.generateiOSTokens({ outputDir: 'output' });
  
  if (!result.content.includes('SEMANTIC TOKENS')) {
    throw new Error('Generated iOS file missing SEMANTIC TOKENS section');
  }
  if (!result.content.includes('PRIMITIVE TOKENS')) {
    throw new Error('Generated iOS file missing PRIMITIVE TOKENS section');
  }
  
  const primitiveIndex = result.content.indexOf('PRIMITIVE TOKENS');
  const semanticIndex = result.content.indexOf('SEMANTIC TOKENS');
  
  if (semanticIndex <= primitiveIndex) {
    throw new Error('Semantic tokens not after primitive tokens');
  }
  
  console.log('✅ iOS generation includes semantic tokens correctly');
} catch (error) {
  console.error('❌ iOS generation failed:', error.message);
  process.exit(1);
}

console.log('\n✨ All build verification checks passed!');
console.log('\n📝 Summary:');
console.log('  - Compiled JavaScript works correctly');
console.log('  - Semantic token methods are present');
console.log('  - iOS generation includes semantic tokens');
console.log('  - File structure is correct (primitives → semantics)');
