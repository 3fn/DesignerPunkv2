"use strict";
/**
 * Generate Token Files Script
 *
 * Generates platform-specific token constant files and writes them to the output directory.
 * Run this script to create DesignTokens.web.js, DesignTokens.ios.swift, and DesignTokens.android.kt
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenFiles = generateTokenFiles;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const TokenFileGenerator_1 = require("./TokenFileGenerator");
/**
 * Main generation function
 */
function generateTokenFiles(outputDir = 'output') {
    console.log('🚀 Starting token file generation...\n');
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`📁 Created output directory: ${outputDir}\n`);
    }
    // Initialize generator
    const generator = new TokenFileGenerator_1.TokenFileGenerator();
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
            }
            else {
                console.log(`❌ ${result.platform.toUpperCase()}: ${path.basename(filePath)} - VALIDATION FAILED`);
                console.log(`   Errors: ${result.errors?.join(', ')}\n`);
            }
        }
        catch (error) {
            console.error(`❌ Failed to write ${result.platform} file:`, error);
        }
    }
    // Validate cross-platform consistency
    console.log('🔍 Validating cross-platform consistency...\n');
    const validation = generator.validateCrossPlatformConsistency(results);
    if (validation.consistent) {
        console.log('✅ All platforms are mathematically consistent!\n');
    }
    else {
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
//# sourceMappingURL=generateTokenFiles.js.map