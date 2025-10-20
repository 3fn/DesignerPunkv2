#!/usr/bin/env node

/**
 * Artifact Evaluation CLI Script
 * 
 * Command-line script for running the artifact evaluation framework.
 * Provides systematic comparison between simple and complex extraction approaches.
 */

import { runArtifactEvaluation, runQuickComparison } from '../evaluation/EvaluationCLI';

interface CLIArgs {
  command: 'full' | 'quick' | 'help';
  outputPath?: string;
  format?: 'markdown' | 'json' | 'console';
  verbose?: boolean;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const result: CLIArgs = { command: 'full' };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case 'quick':
      case 'q':
        result.command = 'quick';
        break;
      case 'full':
      case 'f':
        result.command = 'full';
        break;
      case 'help':
      case '--help':
      case '-h':
        result.command = 'help';
        break;
      case '--output':
      case '-o':
        result.outputPath = args[++i];
        break;
      case '--format':
        const format = args[++i] as 'markdown' | 'json' | 'console';
        if (['markdown', 'json', 'console'].includes(format)) {
          result.format = format;
        }
        break;
      case '--verbose':
      case '-v':
        result.verbose = true;
        break;
    }
  }

  return result;
}

function printHelp(): void {
  console.log(`
🔍 Artifact Evaluation Framework

USAGE:
  npm run evaluate:artifacts [command] [options]

COMMANDS:
  full, f     Run complete artifact evaluation (default)
  quick, q    Run quick comparison only
  help        Show this help message

OPTIONS:
  --output, -o <path>     Output file path
  --format <type>         Output format: markdown, json, console (default: markdown)
  --verbose, -v           Enable verbose output

EXAMPLES:
  npm run evaluate:artifacts                    # Full evaluation with markdown report
  npm run evaluate:artifacts quick             # Quick comparison only
  npm run evaluate:artifacts --format json     # Full evaluation with JSON output
  npm run evaluate:artifacts -o ./report.md    # Custom output path

DESCRIPTION:
  This tool systematically evaluates existing CompletionAnalyzer artifacts
  against the simple extraction approach to determine integration value.
  
  The evaluation measures:
  - Extraction accuracy on real completion documents
  - Performance impact (processing time and memory usage)
  - Code complexity and maintainability metrics
  - Overall value proposition for CLI-driven workflow
  
  Results include data-driven recommendations for artifact integration
  with specific conditions and mitigation strategies.
`);
}

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.command === 'help') {
    printHelp();
    return;
  }

  try {
    switch (args.command) {
      case 'quick':
        await runQuickComparison();
        break;
      case 'full':
        await runArtifactEvaluation({
          outputPath: args.outputPath,
          format: args.format,
          verbose: args.verbose
        });
        break;
    }
  } catch (error) {
    console.error('❌ Evaluation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

export { main as evaluateArtifacts };