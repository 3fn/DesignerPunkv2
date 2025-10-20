#!/usr/bin/env node

/**
 * Release Analysis CLI Entry Point
 * 
 * Main entry point for the enhanced release analysis CLI with advanced features.
 * This script provides the npm run release:analyze command functionality.
 */

import { AdvancedReleaseCLI } from './AdvancedReleaseCLI';

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const cli = new AdvancedReleaseCLI();
  await cli.run();
}

// Run the CLI
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});