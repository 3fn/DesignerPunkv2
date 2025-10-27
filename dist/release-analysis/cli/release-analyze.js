#!/usr/bin/env node
"use strict";
/**
 * Release Analysis CLI Entry Point
 *
 * Main entry point for the enhanced release analysis CLI with advanced features.
 * This script provides the npm run release:analyze command functionality.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AdvancedReleaseCLI_1 = require("./AdvancedReleaseCLI");
/**
 * Main CLI entry point
 */
async function main() {
    const cli = new AdvancedReleaseCLI_1.AdvancedReleaseCLI();
    await cli.run();
}
// Run the CLI
main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=release-analyze.js.map