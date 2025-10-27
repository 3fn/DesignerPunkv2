#!/usr/bin/env node
"use strict";
/**
 * Hook Management CLI
 *
 * Command-line interface for installing, uninstalling, and validating
 * release analysis hooks.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.manageHooks = manageHooks;
const HookIntegrationManager_1 = require("../hooks/HookIntegrationManager");
const AnalysisConfigManager_1 = require("../config/AnalysisConfigManager");
async function manageHooks(options) {
    try {
        // Load configuration
        const configManager = AnalysisConfigManager_1.AnalysisConfigManager.getInstance();
        const configResult = await configManager.loadConfig();
        const config = configResult.config;
        // Create hook configuration
        const hookConfig = {
            enabled: true,
            hookType: options.hookType || 'git',
            quickMode: options.quickMode ?? true,
            timeoutSeconds: options.timeout ?? 10,
            failSilently: options.failSilently ?? true,
            cacheResults: options.cacheResults ?? true
        };
        // Create hook manager
        const hookManager = new HookIntegrationManager_1.HookIntegrationManager(config, hookConfig);
        // Execute action
        switch (options.action) {
            case 'install':
                await installHooks(hookManager, hookConfig);
                break;
            case 'uninstall':
                await uninstallHooks(hookManager, hookConfig);
                break;
            case 'validate':
                await validateHooks(hookManager);
                break;
            case 'status':
                await showStatus(hookManager);
                break;
            default:
                console.error(`Unknown action: ${options.action}`);
                process.exit(1);
        }
    }
    catch (error) {
        console.error('Hook management failed:', error);
        process.exit(1);
    }
}
async function installHooks(manager, config) {
    console.log('📦 Installing release analysis hooks...\n');
    const hookTypes = config.hookType === 'both' ? ['git', 'agent'] : [config.hookType];
    for (const hookType of hookTypes) {
        console.log(`Installing ${hookType} hook...`);
        const result = await manager.installHook(hookType);
        if (result.success) {
            console.log(`✅ ${hookType} hook installed successfully`);
            console.log(`   Path: ${result.hookPath}`);
            if (result.messages.length > 0) {
                result.messages.forEach(msg => console.log(`   ℹ️  ${msg}`));
            }
        }
        else {
            console.error(`❌ ${hookType} hook installation failed`);
            result.messages.forEach(msg => console.error(`   ${msg}`));
        }
        console.log();
    }
    console.log('Hook installation complete!');
    console.log('\nConfiguration:');
    console.log(`  Quick Mode: ${config.quickMode ? 'enabled' : 'disabled'}`);
    console.log(`  Timeout: ${config.timeoutSeconds} seconds`);
    console.log(`  Fail Silently: ${config.failSilently ? 'yes' : 'no'}`);
    console.log(`  Cache Results: ${config.cacheResults ? 'yes' : 'no'}`);
}
async function uninstallHooks(manager, config) {
    console.log('🗑️  Uninstalling release analysis hooks...\n');
    const hookTypes = config.hookType === 'both' ? ['git', 'agent'] : [config.hookType];
    for (const hookType of hookTypes) {
        console.log(`Uninstalling ${hookType} hook...`);
        const success = await manager.uninstallHook(hookType);
        if (success) {
            console.log(`✅ ${hookType} hook uninstalled successfully`);
        }
        else {
            console.log(`ℹ️  ${hookType} hook was not installed`);
        }
        console.log();
    }
    console.log('Hook uninstallation complete!');
}
async function validateHooks(manager) {
    console.log('🔍 Validating release analysis hooks...\n');
    const result = await manager.validateHookIntegration();
    console.log(`Hook Type: ${result.hookType}`);
    console.log(`Status: ${result.valid ? '✅ Valid' : '❌ Invalid'}\n`);
    if (result.permissions) {
        console.log(`Permissions: ${result.permissions}`);
        console.log(`Executable: ${result.executable ? 'yes' : 'no'}\n`);
    }
    if (result.errors.length > 0) {
        console.log('Errors:');
        result.errors.forEach(error => console.log(`  ❌ ${error}`));
        console.log();
    }
    if (result.warnings.length > 0) {
        console.log('Warnings:');
        result.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
        console.log();
    }
    if (result.valid && result.errors.length === 0 && result.warnings.length === 0) {
        console.log('✅ All hooks are properly configured!');
    }
    process.exit(result.valid ? 0 : 1);
}
async function showStatus(manager) {
    console.log('📊 Release Analysis Hook Status\n');
    const config = manager.getHookConfig();
    console.log('Configuration:');
    console.log(`  Enabled: ${config.enabled ? 'yes' : 'no'}`);
    console.log(`  Hook Type: ${config.hookType}`);
    console.log(`  Quick Mode: ${config.quickMode ? 'enabled' : 'disabled'}`);
    console.log(`  Timeout: ${config.timeoutSeconds} seconds`);
    console.log(`  Fail Silently: ${config.failSilently ? 'yes' : 'no'}`);
    console.log(`  Cache Results: ${config.cacheResults ? 'yes' : 'no'}`);
    console.log();
    // Validate to show installation status
    const result = await manager.validateHookIntegration();
    console.log('Installation Status:');
    console.log(`  ${result.valid ? '✅ Installed and valid' : '❌ Not installed or invalid'}`);
    if (result.errors.length > 0) {
        console.log('\nIssues:');
        result.errors.forEach(error => console.log(`  ❌ ${error}`));
    }
    if (result.warnings.length > 0) {
        console.log('\nWarnings:');
        result.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
    }
}
// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('Usage: manage-hooks <action> [options]');
        console.log('');
        console.log('Actions:');
        console.log('  install    Install release analysis hooks');
        console.log('  uninstall  Uninstall release analysis hooks');
        console.log('  validate   Validate hook installation');
        console.log('  status     Show hook status and configuration');
        console.log('');
        console.log('Options:');
        console.log('  --type <git|agent|both>  Hook type to manage (default: git)');
        console.log('  --quick                  Enable quick mode (default: true)');
        console.log('  --no-quick               Disable quick mode');
        console.log('  --timeout <seconds>      Analysis timeout (default: 10)');
        console.log('  --fail-silently          Don\'t block on failure (default: true)');
        console.log('  --no-fail-silently       Block on failure');
        console.log('  --cache                  Cache results (default: true)');
        console.log('  --no-cache               Don\'t cache results');
        process.exit(0);
    }
    const action = args[0];
    const options = { action };
    for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--type':
                options.hookType = args[++i];
                break;
            case '--quick':
                options.quickMode = true;
                break;
            case '--no-quick':
                options.quickMode = false;
                break;
            case '--timeout':
                options.timeout = parseInt(args[++i], 10);
                break;
            case '--fail-silently':
                options.failSilently = true;
                break;
            case '--no-fail-silently':
                options.failSilently = false;
                break;
            case '--cache':
                options.cacheResults = true;
                break;
            case '--no-cache':
                options.cacheResults = false;
                break;
            default:
                console.error(`Unknown option: ${arg}`);
                process.exit(1);
        }
    }
    return options;
}
// Run if called directly
if (require.main === module) {
    const options = parseArgs();
    manageHooks(options).catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=manage-hooks.js.map