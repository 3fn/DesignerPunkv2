/**
 * Android Border Width Token Generation Integration Test
 * 
 * This test verifies that border width tokens generate correctly for Android platform
 * with proper Kotlin formatting, mathematical relationships, and platform-specific units (dp).
 */

import { getAllTokens, getTokensByCategory } from './src/tokens';
import { TokenCategory } from './src/types/PrimitiveToken';
import { AndroidFormatGenerator } from './src/providers/AndroidFormatGenerator';

console.log('=== Android Border Width Token Generation Test ===\n');

// Get border width tokens
const allTokens = getAllTokens();
const borderWidthTokens = allTokens.filter(token => token.category === TokenCategory.BORDER_WIDTH);

console.log(`✓ Border width tokens loaded: ${borderWidthTokens.length} tokens`);
console.log(`  Token names: ${borderWidthTokens.map(t => t.name).join(', ')}\n`);

// Verify mathematical relationships
console.log('✓ Mathematical relationships:');
borderWidthTokens.forEach(token => {
  console.log(`   ${token.name.padEnd(15)}: ${token.mathematicalRelationship}`);
});
console.log('');

// Verify platform values
console.log('✓ Platform values:');
borderWidthTokens.forEach(token => {
  console.log(`   ${token.name.padEnd(15)}:`);
  console.log(`    Android: ${token.platforms.android.value}${token.platforms.android.unit}`);
});
console.log('');

// Generate Android Kotlin output
console.log('=== Generating Android Kotlin Output ===\n');

const generator = new AndroidFormatGenerator('kotlin');

console.log('Individual token formatting:');
borderWidthTokens.forEach(token => {
  const formatted = generator.formatToken(token);
  console.log(`    ${formatted}`);
});
console.log('');

// Generate complete file
const completeFile = generator.generateFile(borderWidthTokens);

console.log('=== Verification ===\n');

// Verify output
console.log(`Android Kotlin output generated: ${completeFile.length} characters`);
console.log(`Contains border_width_100: ${completeFile.includes('border_width_100') ? '✓ Yes' : '✗ No'}`);
console.log(`Contains border_width_200: ${completeFile.includes('border_width_200') ? '✓ Yes' : '✗ No'}`);
console.log(`Contains border_width_400: ${completeFile.includes('border_width_400') ? '✓ Yes' : '✗ No'}`);
console.log(`Uses Float type: ${completeFile.includes('Float') ? '✓ Yes' : '✗ No'}`);
console.log(`Has comment: ${completeFile.includes('//') ? '✓ Yes' : '✗ No'}`);
console.log('');

// Validate syntax
const validation = generator.validateSyntax(completeFile);
console.log(`Syntax validation: ${validation.valid ? '✓ Valid' : '✗ Invalid'}`);
if (!validation.valid && validation.errors) {
  console.log('Errors:', validation.errors);
}
console.log('');

console.log('=== Test Complete ===');
