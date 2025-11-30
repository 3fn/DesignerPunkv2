#!/usr/bin/env ts-node
/**
 * Verify opacity types work in Container component context
 * 
 * This script validates that OpacityTokenName can be used
 * in Container component props as specified in requirements.
 */

import { OpacityTokenName } from '../src/types/generated/TokenTypes';

/**
 * Mock Container props interface to test opacity type usage
 */
interface ContainerProps {
  opacity?: OpacityTokenName;
  children?: any;
}

/**
 * Test that opacity tokens work in Container props
 */
function testOpacityInContainerProps(): boolean {
  console.log('🧪 Testing opacity types in Container props...\n');
  
  // Test all valid opacity tokens
  const validProps: ContainerProps[] = [
    { opacity: 'opacity.subtle' },
    { opacity: 'opacity.medium' },
    { opacity: 'opacity.heavy' },
    { opacity: 'opacity.ghost' },
    { opacity: undefined } // Optional prop
  ];
  
  validProps.forEach((props, index) => {
    console.log(`✅ Test ${index + 1}: opacity="${props.opacity || 'undefined'}" - Valid`);
  });
  
  console.log('\n✨ All opacity type tests passed!');
  console.log('   OpacityTokenName type works correctly in Container props');
  
  return true;
}

/**
 * Main execution
 */
function main(): void {
  const success = testOpacityInContainerProps();
  process.exit(success ? 0 : 1);
}

// Run verification
main();
