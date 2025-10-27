"use strict";
/**
 * Configuration Helpers Usage Examples
 *
 * This file demonstrates how to use the ConfigHelpers utility
 * for creating, validating, and migrating build configurations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigHelpers_1 = require("./ConfigHelpers");
// ============================================================================
// Example 1: Create configuration from template
// ============================================================================
// Create a minimal configuration for quick testing
const minimalConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('minimal');
console.log('Minimal config:', minimalConfig);
// Create a development configuration with sensible defaults
const devConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('development');
console.log('Development config:', devConfig);
// Create a production configuration optimized for deployment
const prodConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('production');
console.log('Production config:', prodConfig);
// Create configuration for all platforms
const allPlatformsConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('all-platforms');
console.log('All platforms config:', allPlatformsConfig);
// Create iOS-only configuration
const iosConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('ios-only');
console.log('iOS config:', iosConfig);
// Create Android-only configuration
const androidConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('android-only');
console.log('Android config:', androidConfig);
// Create Web-only configuration
const webConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('web-only');
console.log('Web config:', webConfig);
// Create mobile (iOS + Android) configuration
const mobileConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('mobile');
console.log('Mobile config:', mobileConfig);
// Create CI/CD configuration for automated builds
const cicdConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('ci-cd');
console.log('CI/CD config:', cicdConfig);
// ============================================================================
// Example 2: Create configuration with overrides
// ============================================================================
// Start with development template and customize
const customDevConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('development', {
    outputDir: './custom-output',
    parallel: true,
    validation: {
        interfaces: true,
        tokens: false, // Disable token validation for faster builds
        mathematical: true,
    },
});
console.log('Custom development config:', customDevConfig);
// Start with production template and customize for specific platform
const customProdConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('production', {
    platforms: ['web'],
    web: {
        target: 'esnext',
        formats: ['esm'],
        externals: ['react', 'react-dom'],
    },
});
console.log('Custom production config:', customProdConfig);
// ============================================================================
// Example 3: Validate configuration
// ============================================================================
// Validate a complete configuration
const validConfig = {
    platforms: ['web'],
    mode: 'development',
    outputDir: './dist',
    parallel: false,
    incremental: true,
    sourceMaps: true,
    minify: false,
    validation: {
        interfaces: true,
        tokens: true,
        mathematical: true,
    },
    web: {
        target: 'es2021',
        formats: ['esm', 'cjs'],
        externals: [],
    },
};
const validationResult = ConfigHelpers_1.ConfigHelpers.validateConfiguration(validConfig);
console.log('Validation result:', validationResult);
if (validationResult.valid) {
    console.log('✓ Configuration is valid');
}
else {
    console.error('✗ Configuration has errors:');
    validationResult.errors.forEach(error => console.error(`  - ${error}`));
}
if (validationResult.warnings.length > 0) {
    console.warn('⚠ Configuration warnings:');
    validationResult.warnings.forEach(warning => console.warn(`  - ${warning}`));
}
// Validate an incomplete configuration
const incompleteConfig = {
    platforms: ['ios'],
    mode: 'development',
    // Missing outputDir
    // Missing iOS options
};
const incompleteValidation = ConfigHelpers_1.ConfigHelpers.validateConfiguration(incompleteConfig);
console.log('Incomplete validation:', incompleteValidation);
// ============================================================================
// Example 4: Migrate old configuration
// ============================================================================
// Migrate from old configuration format
const oldConfig = {
    platform: 'web', // Old: single platform
    env: 'production', // Old: env instead of mode
    output: './build', // Old: output instead of outputDir
    sourceMap: true, // Old: sourceMap instead of sourceMaps
    minimize: true, // Old: minimize instead of minify
    validate: true, // Old: boolean instead of object
};
const migrationResult = ConfigHelpers_1.ConfigHelpers.migrateConfiguration(oldConfig);
console.log('Migration result:', migrationResult);
if (migrationResult.success) {
    console.log('✓ Migration successful');
    console.log('Migrated config:', migrationResult.config);
    if (migrationResult.changes.length > 0) {
        console.log('Changes made:');
        migrationResult.changes.forEach(change => console.log(`  - ${change}`));
    }
}
else {
    console.error('✗ Migration failed:');
    migrationResult.errors.forEach(error => console.error(`  - ${error}`));
}
if (migrationResult.warnings.length > 0) {
    console.warn('⚠ Migration warnings:');
    migrationResult.warnings.forEach(warning => console.warn(`  - ${warning}`));
}
// ============================================================================
// Example 5: Get configuration documentation
// ============================================================================
// Get documentation for all configuration fields
const docs = ConfigHelpers_1.ConfigHelpers.getDocumentation();
console.log('Configuration documentation:', docs);
// Find documentation for specific field
const platformsDoc = docs.find(d => d.field === 'platforms');
if (platformsDoc) {
    console.log('Platforms field documentation:');
    console.log(`  Description: ${platformsDoc.description}`);
    console.log(`  Type: ${platformsDoc.type}`);
    console.log(`  Default: ${platformsDoc.default}`);
    console.log(`  Required: ${platformsDoc.required}`);
    if (platformsDoc.constraints) {
        console.log(`  Constraints: ${platformsDoc.constraints}`);
    }
    if (platformsDoc.examples) {
        console.log('  Examples:');
        platformsDoc.examples.forEach(example => console.log(`    ${example}`));
    }
}
// ============================================================================
// Example 6: Generate markdown documentation
// ============================================================================
// Generate complete markdown documentation
const markdown = ConfigHelpers_1.ConfigHelpers.generateMarkdownDocs();
console.log('Markdown documentation:');
console.log(markdown);
// Save to file (in real usage)
// import * as fs from 'fs';
// fs.writeFileSync('./BUILD_CONFIG.md', markdown);
// ============================================================================
// Example 7: Common configuration patterns
// ============================================================================
// Pattern 1: Quick local development
const quickDevConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('minimal', {
    platforms: ['web'],
    incremental: true,
});
// Pattern 2: Full-featured development with all validations
const fullDevConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('development', {
    platforms: ['ios', 'android', 'web'],
    parallel: true,
});
// Pattern 3: Production build for single platform
const prodWebConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('production', {
    platforms: ['web'],
    web: {
        target: 'es2021',
        formats: ['esm'],
        externals: [],
    },
});
// Pattern 4: CI/CD build with all platforms
const ciBuildConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('ci-cd', {
    outputDir: process.env.BUILD_OUTPUT || './dist',
});
// Pattern 5: Mobile-only development
const mobileDevConfig = ConfigHelpers_1.ConfigHelpers.createFromTemplate('mobile', {
    mode: 'development',
    parallel: true,
    incremental: true,
});
console.log('Common patterns created successfully');
// ============================================================================
// Example 8: Configuration validation workflow
// ============================================================================
function validateAndBuild(config) {
    // Step 1: Validate configuration
    const validation = ConfigHelpers_1.ConfigHelpers.validateConfiguration(config);
    // Step 2: Check for errors
    if (!validation.valid) {
        console.error('Configuration validation failed:');
        validation.errors.forEach(error => console.error(`  ✗ ${error}`));
        throw new Error('Invalid configuration');
    }
    // Step 3: Show warnings
    if (validation.warnings.length > 0) {
        console.warn('Configuration warnings:');
        validation.warnings.forEach(warning => console.warn(`  ⚠ ${warning}`));
    }
    // Step 4: Proceed with build
    console.log('✓ Configuration valid, proceeding with build...');
    // Build logic here
}
// Example usage
try {
    validateAndBuild(devConfig);
}
catch (error) {
    console.error('Build failed:', error);
}
// ============================================================================
// Example 9: Configuration migration workflow
// ============================================================================
function migrateAndValidate(oldConfig) {
    // Step 1: Migrate configuration
    const migration = ConfigHelpers_1.ConfigHelpers.migrateConfiguration(oldConfig);
    // Step 2: Check migration success
    if (!migration.success) {
        console.error('Configuration migration failed:');
        migration.errors.forEach(error => console.error(`  ✗ ${error}`));
        throw new Error('Migration failed');
    }
    // Step 3: Show migration changes
    if (migration.changes.length > 0) {
        console.log('Configuration migrated successfully:');
        migration.changes.forEach(change => console.log(`  ✓ ${change}`));
    }
    // Step 4: Show warnings
    if (migration.warnings.length > 0) {
        console.warn('Migration warnings:');
        migration.warnings.forEach(warning => console.warn(`  ⚠ ${warning}`));
    }
    return migration.config;
}
// Example usage
const legacyConfig = {
    platform: 'web',
    env: 'production',
    output: './build',
};
try {
    const migratedConfig = migrateAndValidate(legacyConfig);
    console.log('Migrated configuration:', migratedConfig);
}
catch (error) {
    console.error('Migration failed:', error);
}
//# sourceMappingURL=ConfigHelpers.example.js.map