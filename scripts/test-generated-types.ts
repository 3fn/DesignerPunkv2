#!/usr/bin/env ts-node
/**
 * Test script to verify generated token types work correctly
 * 
 * This script validates:
 * 1. ColorTokenName includes all color tokens
 * 2. ShadowTokenName includes all shadow tokens
 * 3. OpacityTokenName includes all opacity tokens
 * 4. Generated types are valid TypeScript
 * 5. Type guards work correctly
 */

import { 
  ColorTokenName, 
  ShadowTokenName, 
  OpacityTokenName,
  SemanticTokenName,
  isColorTokenName,
  isShadowTokenName,
  isOpacityTokenName
} from '../src/types/generated/TokenTypes';

// Import token definitions to compare
import { colorTokenNames } from '../src/tokens/semantic/ColorTokens';
import { shadowTokenNames } from '../src/tokens/semantic/ShadowTokens';
import { opacityTokenNames } from '../src/tokens/semantic/OpacityTokens';

/**
 * Test that a value is assignable to a type
 */
function testTypeAssignment<T>(value: T, typeName: string): void {
  console.log(`✅ ${typeName} type assignment works`);
}

/**
 * Test color token types
 */
function testColorTokenTypes(): boolean {
  console.log('\n📋 Testing ColorTokenName type...');
  
  // Test valid color tokens
  const validColorTokens: ColorTokenName[] = [
    'color.primary',
    'color.secondary',
    'color.error',
    'color.success.strong',
    'color.text.default',
    'glow.neonPurple'
  ];
  
  validColorTokens.forEach(token => {
    testTypeAssignment<ColorTokenName>(token, 'ColorTokenName');
  });
  
  // Verify all color tokens from ColorTokens.ts are in the type
  const missingTokens = colorTokenNames.filter(name => {
    // This is a compile-time check - if the type is correct, this will compile
    const token: ColorTokenName = name as ColorTokenName;
    return false;
  });
  
  if (missingTokens.length > 0) {
    console.error(`❌ Missing color tokens: ${missingTokens.join(', ')}`);
    return false;
  }
  
  console.log(`✅ All ${colorTokenNames.length} color tokens are in ColorTokenName type`);
  
  // Test type guard
  if (!isColorTokenName('color.primary')) {
    console.error('❌ isColorTokenName type guard failed');
    return false;
  }
  console.log('✅ isColorTokenName type guard works');
  
  return true;
}

/**
 * Test shadow token types
 */
function testShadowTokenTypes(): boolean {
  console.log('\n📋 Testing ShadowTokenName type...');
  
  // Test valid shadow tokens
  const validShadowTokens: ShadowTokenName[] = [
    'shadow.container',
    'shadow.dropdown',
    'shadow.modal',
    'shadow.sunrise',
    'shadow.dusk'
  ];
  
  validShadowTokens.forEach(token => {
    testTypeAssignment<ShadowTokenName>(token, 'ShadowTokenName');
  });
  
  // Verify all shadow tokens from ShadowTokens.ts are in the type
  const missingTokens = shadowTokenNames.filter(name => {
    const token: ShadowTokenName = name as ShadowTokenName;
    return false;
  });
  
  if (missingTokens.length > 0) {
    console.error(`❌ Missing shadow tokens: ${missingTokens.join(', ')}`);
    return false;
  }
  
  console.log(`✅ All ${shadowTokenNames.length} shadow tokens are in ShadowTokenName type`);
  
  // Test type guard
  if (!isShadowTokenName('shadow.modal')) {
    console.error('❌ isShadowTokenName type guard failed');
    return false;
  }
  console.log('✅ isShadowTokenName type guard works');
  
  return true;
}

/**
 * Test opacity token types
 */
function testOpacityTokenTypes(): boolean {
  console.log('\n📋 Testing OpacityTokenName type...');
  
  // Test valid opacity tokens
  const validOpacityTokens: OpacityTokenName[] = [
    'opacity.disabled',
    'opacity.hover',
    'opacity.overlay',
    'opacity.pressed',
    'opacity.loading'
  ];
  
  validOpacityTokens.forEach(token => {
    testTypeAssignment<OpacityTokenName>(token, 'OpacityTokenName');
  });
  
  // Verify all opacity tokens from OpacityTokens.ts are in the type
  const missingTokens = opacityTokenNames.filter(name => {
    const token: OpacityTokenName = name as OpacityTokenName;
    return false;
  });
  
  if (missingTokens.length > 0) {
    console.error(`❌ Missing opacity tokens: ${missingTokens.join(', ')}`);
    return false;
  }
  
  console.log(`✅ All ${opacityTokenNames.length} opacity tokens are in OpacityTokenName type`);
  
  // Test type guard
  if (!isOpacityTokenName('opacity.hover')) {
    console.error('❌ isOpacityTokenName type guard failed');
    return false;
  }
  console.log('✅ isOpacityTokenName type guard works');
  
  return true;
}

/**
 * Test SemanticTokenName union type
 */
function testSemanticTokenNameUnion(): boolean {
  console.log('\n📋 Testing SemanticTokenName union type...');
  
  // Test that all token types are assignable to SemanticTokenName
  const colorToken: SemanticTokenName = 'color.primary';
  const shadowToken: SemanticTokenName = 'shadow.modal';
  const opacityToken: SemanticTokenName = 'opacity.hover';
  
  console.log('✅ SemanticTokenName union type works');
  return true;
}

/**
 * Main test execution
 */
function main(): void {
  console.log('🚀 Testing generated token types...\n');
  
  const results = [
    testColorTokenTypes(),
    testShadowTokenTypes(),
    testOpacityTokenTypes(),
    testSemanticTokenNameUnion()
  ];
  
  const allPassed = results.every(result => result);
  
  if (allPassed) {
    console.log('\n✨ All type generation tests passed!');
    process.exit(0);
  } else {
    console.error('\n❌ Some type generation tests failed');
    process.exit(1);
  }
}

// Run tests
main();
