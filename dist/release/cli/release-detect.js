#!/usr/bin/env node
"use strict";
/**
 * Release Detection CLI
 *
 * Command-line interface for the release detection system.
 * Can be called from shell hooks or used manually for release management.
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
exports.runCli = main;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const WorkflowEventDetector_1 = require("../integration/WorkflowEventDetector");
async function loadConfig() {
    const configPath = path.join(process.cwd(), '.kiro/release-config.json');
    try {
        const configContent = await fs_1.promises.readFile(configPath, 'utf-8');
        const config = JSON.parse(configContent);
        return config.detection;
    }
    catch (error) {
        console.error('Error loading release configuration:', error);
        process.exit(1);
    }
}
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    try {
        const config = await loadConfig();
        // Disable auto-processing for one-off CLI commands (except 'monitor')
        const enableAutoProcessing = command === 'monitor';
        const detector = new WorkflowEventDetector_1.WorkflowEventDetector(config, { enableAutoProcessing });
        switch (command) {
            case 'help':
            case '--help':
            case '-h':
                showHelp();
                break;
            case 'status':
                await detector.start();
                await detector.processCliCommand('status', args.slice(1));
                await detector.stop();
                break;
            case 'process-triggers':
                await detector.start();
                await detector.processCliCommand('process-triggers', args.slice(1));
                await detector.stop();
                break;
            case 'monitor':
                console.log('Starting continuous monitoring...');
                console.log('Press Ctrl+C to stop');
                await detector.start();
                // Handle graceful shutdown
                process.on('SIGINT', async () => {
                    console.log('\nShutting down...');
                    await detector.stop();
                    process.exit(0);
                });
                // Keep the process running
                await new Promise(() => { }); // Run indefinitely
                break;
            case 'process-file':
                const filePath = args[1];
                if (!filePath) {
                    console.error('Error: File path required for process-file command');
                    process.exit(1);
                }
                await processSpecificFile(detector, filePath);
                break;
            default:
                console.error(`Unknown command: ${command}`);
                showHelp();
                process.exit(1);
        }
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
async function processSpecificFile(detector, filePath) {
    console.log(`Processing file: ${filePath}`);
    try {
        // Determine event type based on file path
        let eventType = 'file-change';
        if (filePath.includes('completion') && filePath.endsWith('.md')) {
            if (filePath.includes('task-') && filePath.includes('-completion.md')) {
                eventType = 'task-completion';
            }
            else {
                eventType = 'spec-completion';
            }
        }
        // Create workflow event
        const event = {
            type: eventType,
            source: filePath,
            timestamp: new Date(),
            metadata: {
                processedBy: 'cli',
                filePath
            }
        };
        await detector.start();
        const result = await detector.processEvent(event);
        await detector.stop();
        console.log('Processing result:');
        console.log(`  Event Type: ${result.event.type}`);
        console.log(`  Processed: ${result.processed ? '✅' : '❌'}`);
        if (result.releaseSignal) {
            console.log(`  Release Signal: ${result.releaseSignal.type} (confidence: ${result.releaseSignal.confidence})`);
            console.log(`  Affected Packages: ${result.releaseSignal.affectedPackages.join(', ')}`);
            console.log(`  Evidence: ${result.releaseSignal.evidence.join(', ')}`);
        }
        else {
            console.log('  Release Signal: None');
        }
        if (result.error) {
            console.log(`  Error: ${result.error.message}`);
        }
    }
    catch (error) {
        console.error('Error processing file:', error);
        process.exit(1);
    }
}
function showHelp() {
    console.log(`
Release Detection CLI

Usage:
  npm run release:detect <command> [options]

Commands:
  help                    - Show this help message
  status                  - Show current system status
  process-triggers        - Process pending hook triggers
  monitor                 - Start continuous monitoring (Ctrl+C to stop)
  process-file <path>     - Process a specific file for release detection

Examples:
  npm run release:detect status
  npm run release:detect process-triggers
  npm run release:detect monitor
  npm run release:detect process-file .kiro/specs/release-management-system/completion/task-2-completion.md

Integration with Hooks:
  The CLI can be called from shell hooks to process release triggers:
  
  # From release-manager.sh
  npm run release:detect process-triggers
  
  # Process specific completion document
  npm run release:detect process-file "$completion_document_path"

Configuration:
  Configuration is loaded from .kiro/release-config.json
  Ensure the detection section is properly configured.

Output:
  The CLI provides detailed output about detected release signals,
  including version bump type, confidence level, and affected packages.
`);
}
// Run the CLI
if (require.main === module) {
    main().catch(error => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=release-detect.js.map