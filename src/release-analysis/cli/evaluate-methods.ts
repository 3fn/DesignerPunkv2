#!/usr/bin/env node

/**
 * CLI Script for CompletionAnalyzer Method Evaluation (Task 4.2)
 * 
 * Runs systematic evaluation of CompletionAnalyzer extraction methods
 * against simple pattern-based approach to determine integration value.
 */

import { runMethodEvaluation } from '../evaluation/EvaluationCLI';

async function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const options: any = {
    format: 'markdown',
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--format':
        options.format = args[++i];
        break;
      case '--output':
        options.outputPath = args[++i];
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--help':
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        printHelp();
        process.exit(1);
    }
  }

  console.log('🔍 CompletionAnalyzer Method Evaluation (Task 4.2)');
  console.log('==================================================');
  console.log('');
  console.log('This evaluation systematically compares:');
  console.log('• Simple pattern-based extraction vs complex extraction logic');
  console.log('• Simple deduplication vs semantic deduplication');
  console.log('• Pattern matching vs structured section parsing');
  console.log('• Documentation filtering effectiveness');
  console.log('');

  try {
    await runMethodEvaluation(options);
  } catch (error) {
    console.error('❌ Method evaluation failed:', error);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
CompletionAnalyzer Method Evaluation (Task 4.2)

USAGE:
  npm run evaluate:methods [options]

OPTIONS:
  --format <type>     Output format: markdown, json, console (default: markdown)
  --output <path>     Custom output file path
  --verbose           Enable verbose logging
  --help              Show this help message

EXAMPLES:
  npm run evaluate:methods
  npm run evaluate:methods --format json --output ./evaluation-results.json
  npm run evaluate:methods --verbose

DESCRIPTION:
  Systematically evaluates CompletionAnalyzer extraction methods against
  simple pattern-based approaches to determine integration value for the
  CLI-driven release analysis system.

  The evaluation tests:
  • Extraction accuracy improvements
  • Semantic deduplication effectiveness  
  • Structured section parsing vs pattern matching
  • Documentation filtering false positive reduction

  Results inform data-driven decisions about artifact integration based
  on value vs complexity tradeoffs.
`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}