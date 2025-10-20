/**
 * Example Usage of Advanced Release Analysis CLI
 * 
 * Demonstrates the enhanced CLI features including interactive mode,
 * configuration management, and analysis history.
 */

import { AdvancedReleaseCLI } from './AdvancedReleaseCLI';

/**
 * Example: Basic analysis with interactive mode
 */
async function exampleInteractiveAnalysis(): Promise<void> {
  console.log('=== Example: Interactive Analysis ===\n');
  
  const cli = new AdvancedReleaseCLI();
  
  try {
    // Run analysis with interactive mode enabled
    const result = await cli.analyzeChanges({
      interactive: true,
      outputFormat: 'detailed',
      reviewThreshold: 0.8
    });
    
    console.log('Analysis completed successfully!');
    console.log(`Version recommendation: ${result.versionRecommendation.recommendedVersion}`);
    console.log(`Confidence: ${(result.confidence.overall * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}

/**
 * Example: Dry-run preview
 */
async function exampleDryRunPreview(): Promise<void> {
  console.log('=== Example: Dry-run Preview ===\n');
  
  const cli = new AdvancedReleaseCLI();
  
  try {
    // Preview analysis scope without full extraction
    const result = await cli.analyzeChanges({
      dryRun: true,
      since: 'v1.0.0',
      skipConfirmation: true
    });
    
    console.log('Dry-run completed successfully!');
    console.log(`Documents found: ${result.scope.completionDocuments.length}`);
    
  } catch (error) {
    console.error('Dry-run failed:', error);
  }
}

/**
 * Example: Configuration management
 */
async function exampleConfigurationManagement(): Promise<void> {
  console.log('=== Example: Configuration Management ===\n');
  
  const cli = new AdvancedReleaseCLI();
  
  try {
    // Show current configuration
    console.log('Current configuration:');
    await cli.manageConfiguration({ show: true });
    
    // Validate configuration
    console.log('\nValidating configuration:');
    await cli.manageConfiguration({ validate: true });
    
    // Set a configuration value
    console.log('\nUpdating confidence threshold:');
    await cli.manageConfiguration({
      set: {
        key: 'extraction.confidenceThresholds.minimumConfidence',
        value: '0.7'
      }
    });
    
  } catch (error) {
    console.error('Configuration management failed:', error);
  }
}

/**
 * Example: Analysis history management
 */
async function exampleHistoryManagement(): Promise<void> {
  console.log('=== Example: History Management ===\n');
  
  const cli = new AdvancedReleaseCLI();
  
  try {
    // List analysis history
    console.log('Analysis history:');
    await cli.manageHistory({ list: true });
    
    // Note: In a real scenario, you would have actual history entries
    // and could compare with them using:
    // await cli.manageHistory({ compare: 'analysis-123456789' });
    
  } catch (error) {
    console.error('History management failed:', error);
  }
}

/**
 * Example: Advanced workflow with all features
 */
async function exampleAdvancedWorkflow(): Promise<void> {
  console.log('=== Example: Advanced Workflow ===\n');
  
  const cli = new AdvancedReleaseCLI();
  
  try {
    // Step 1: Validate configuration
    console.log('Step 1: Validating configuration...');
    await cli.manageConfiguration({ validate: true });
    
    // Step 2: Preview analysis
    console.log('\nStep 2: Previewing analysis...');
    await cli.analyzeChanges({
      dryRun: true,
      outputFormat: 'summary'
    });
    
    // Step 3: Run full analysis with interactive mode
    console.log('\nStep 3: Running full analysis...');
    const result = await cli.analyzeChanges({
      interactive: true,
      outputFormat: 'detailed',
      autoApprove: false,
      reviewThreshold: 0.8
    });
    
    // Step 4: Display results
    console.log('\nStep 4: Analysis results:');
    cli.showSummaryReport(result);
    
    // Step 5: Check history
    console.log('\nStep 5: Updated history:');
    await cli.manageHistory({ list: true });
    
  } catch (error) {
    console.error('Advanced workflow failed:', error);
  }
}

/**
 * Example: Command-line argument simulation
 */
async function exampleCommandLineUsage(): Promise<void> {
  console.log('=== Example: Command-line Usage Simulation ===\n');
  
  const cli = new AdvancedReleaseCLI();
  
  // Simulate different command-line scenarios
  const scenarios = [
    // Basic analysis
    ['analyze', '--format', 'summary'],
    
    // Interactive analysis with dry-run
    ['analyze', '--interactive', '--dry-run', '--format', 'detailed'],
    
    // Configuration management
    ['config', '--config-show'],
    
    // History management
    ['history', '--history-list'],
    
    // Advanced options
    ['analyze', '--since', 'v1.0.0', '--interactive', '--review-threshold', '0.8']
  ];
  
  for (const args of scenarios) {
    console.log(`\nSimulating: npm run release:analyze ${args.join(' ')}`);
    
    try {
      // Parse arguments (would normally come from process.argv)
      const parsed = (cli as any).parseAdvancedArguments(args);
      console.log(`  Command: ${parsed.command}`);
      console.log(`  Options: ${JSON.stringify(parsed.options, null, 2)}`);
      
      // Note: In a real scenario, you would call cli.run(args)
      // but that would actually execute the commands
      
    } catch (error) {
      console.error(`  Error: ${error}`);
    }
  }
}

/**
 * Run all examples
 */
async function runAllExamples(): Promise<void> {
  console.log('🚀 Advanced Release Analysis CLI Examples\n');
  console.log('This demonstrates the enhanced CLI features.\n');
  
  // Note: These examples are for demonstration purposes
  // In a real environment, they would interact with actual Git repositories
  // and completion documents
  
  try {
    await exampleCommandLineUsage();
    
    // Uncomment to run interactive examples (requires actual setup):
    // await exampleConfigurationManagement();
    // await exampleHistoryManagement();
    // await exampleDryRunPreview();
    // await exampleInteractiveAnalysis();
    // await exampleAdvancedWorkflow();
    
    console.log('\n✅ All examples completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Examples failed:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

export {
  exampleInteractiveAnalysis,
  exampleDryRunPreview,
  exampleConfigurationManagement,
  exampleHistoryManagement,
  exampleAdvancedWorkflow,
  exampleCommandLineUsage,
  runAllExamples
};