#!/usr/bin/env node

/**
 * Release Detection CLI
 * 
 * Command-line interface for the release detection system.
 * Can be called from shell hooks or used manually for release management.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { WorkflowEventDetector } from '../integration/WorkflowEventDetector';
import { DetectionConfig } from '../config/ReleaseConfig';

async function loadConfig(): Promise<DetectionConfig> {
  const configPath = path.join(process.cwd(), '.kiro/release-config.json');
  
  try {
    const configContent = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    return config.detection;
  } catch (error) {
    console.error('Error loading release configuration:', error);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  try {
    const config = await loadConfig();
    const detector = new WorkflowEventDetector(config);
    
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
        await new Promise(() => {}); // Run indefinitely
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
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

async function processSpecificFile(detector: WorkflowEventDetector, filePath: string): Promise<void> {
  console.log(`Processing file: ${filePath}`);
  
  try {
    // Determine event type based on file path
    let eventType: 'task-completion' | 'spec-completion' | 'file-change' = 'file-change';
    
    if (filePath.includes('completion') && filePath.endsWith('.md')) {
      if (filePath.includes('task-') && filePath.includes('-completion.md')) {
        eventType = 'task-completion';
      } else {
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
    } else {
      console.log('  Release Signal: None');
    }
    
    if (result.error) {
      console.log(`  Error: ${result.error.message}`);
    }
    
  } catch (error) {
    console.error('Error processing file:', error);
    process.exit(1);
  }
}

function showHelp(): void {
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

export { main as runCli };