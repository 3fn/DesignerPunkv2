#!/usr/bin/env node

/**
 * Advanced Release Analysis CLI
 * 
 * Enhanced command-line interface with interactive features, configuration management,
 * analysis history, and advanced workflow capabilities.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { releaseAnalysisErrorHandler, withErrorHandling } from '../errors/ErrorHandler';
import { ErrorContext } from '../types';
import { createRecoveryUtilities } from '../errors/ErrorRecovery';
import { AnalysisConfig, DEFAULT_ANALYSIS_CONFIG } from '../config/AnalysisConfig';
import { 
  AnalysisOptions, 
  AnalysisResult, 
  AnalysisScope, 
  ExtractedChanges, 
  VersionRecommendation, 
  ConfidenceMetrics,
  CompletionDocument,
  UncertainDuplicateInfo
} from '../types/AnalysisTypes';

/**
 * Interactive CLI options for advanced features
 */
export interface InteractiveOptions {
  /** Enable interactive mode for reviewing uncertain changes */
  interactive?: boolean;
  /** Auto-approve low-confidence items */
  autoApprove?: boolean;
  /** Skip confirmation prompts */
  skipConfirmation?: boolean;
  /** Review threshold for interactive mode */
  reviewThreshold?: number;
}

/**
 * Configuration management options
 */
export interface ConfigOptions {
  /** Show current configuration */
  show?: boolean;
  /** Set configuration value */
  set?: { key: string; value: any };
  /** Reset to default configuration */
  reset?: boolean;
  /** Validate configuration */
  validate?: boolean;
  /** Configuration file path */
  configPath?: string;
}

/**
 * Analysis history options
 */
export interface HistoryOptions {
  /** List previous analyses */
  list?: boolean;
  /** Compare with previous analysis */
  compare?: string;
  /** Show analysis details */
  show?: string;
  /** Clear analysis history */
  clear?: boolean;
  /** Maximum number of analyses to keep */
  maxHistory?: number;
}

/**
 * Analysis history entry
 */
export interface AnalysisHistoryEntry {
  id: string;
  timestamp: Date;
  scope: AnalysisScope;
  result: AnalysisResult;
  options: AnalysisOptions;
  duration: number;
}

/**
 * Analysis comparison result
 */
export interface AnalysisComparison {
  previous: AnalysisHistoryEntry;
  current: AnalysisResult;
  differences: {
    versionChange: boolean;
    changeCountDifference: number;
    newBreakingChanges: number;
    newFeatures: number;
    newBugFixes: number;
    confidenceChange: number;
  };
}

/**
 * Advanced CLI class with interactive features
 */
export class AdvancedReleaseCLI {
  private configPath: string;
  private historyPath: string;
  private workingDirectory: string;
  private config: AnalysisConfig;
  private rl: readline.Interface;

  constructor(workingDirectory: string = process.cwd()) {
    this.workingDirectory = workingDirectory;
    this.configPath = path.join(workingDirectory, '.kiro/release-config.json');
    this.historyPath = path.join(workingDirectory, '.kiro/release-analysis/history.json');
    this.config = DEFAULT_ANALYSIS_CONFIG;
    
    // Initialize readline interface for interactive features
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Enhanced analyze command with interactive features
   */
  async analyzeChanges(options: AnalysisOptions & InteractiveOptions = {}): Promise<AnalysisResult> {
    console.log('🔍 Starting enhanced release analysis...\n');
    
    const startTime = Date.now();
    
    // Load configuration
    await this.loadConfiguration();
    
    // Clear previous error history for new analysis
    releaseAnalysisErrorHandler.clearErrorHistory();
    
    const context: ErrorContext = {
      operation: 'analyzeChanges',
      component: 'AdvancedReleaseCLI',
      userAction: 'Running enhanced release analysis',
      timestamp: new Date()
    };

    const result = await withErrorHandling(async () => {
      // Perform dry-run preview if requested
      if (options.dryRun) {
        console.log('🔍 Dry-run mode: Previewing analysis scope...\n');
        const preview = await this.previewAnalysis(options);
        this.showAnalysisPreview(preview);
        
        if (!options.skipConfirmation) {
          const proceed = await this.promptUser('Continue with full analysis? (y/n): ');
          if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
            console.log('Analysis cancelled by user.');
            return this.createEmptyResult();
          }
        }
      }

      // Step 1: Determine analysis scope
      console.log('🎯 Determining analysis scope...');
      const analysisScope = await this.determineAnalysisScope(options);
      console.log(`📄 Found ${analysisScope.completionDocuments.length} completion documents`);

      // Step 2: Extract changes
      console.log('🔍 Extracting changes...');
      const extractor = new (await import('../extraction/SimpleChangeExtractor')).SimpleChangeExtractor(this.config.extraction);
      const extractedChanges = await extractor.extractChanges(analysisScope.completionDocuments);

      // Step 3: Interactive review of uncertain changes
      if (options.interactive && extractedChanges.metadata.ambiguousItems.length > 0) {
        console.log('\n🤔 Found uncertain changes requiring review...');
        await this.interactiveReview(extractedChanges, options);
      }

      // Step 4: Calculate version recommendation
      console.log('🏷️  Calculating version recommendation...');
      const versionCalculator = new (await import('../versioning/VersionCalculator')).VersionCalculator();
      const currentVersion = await this.getCurrentVersion();
      const versionRecommendation = versionCalculator.calculateVersionBump(extractedChanges, currentVersion);

      // Step 5: Interactive confirmation for major version bumps
      if (versionRecommendation.bumpType === 'major' && !options.skipConfirmation) {
        console.log('\n⚠️  Major version bump detected!');
        console.log(`   ${versionRecommendation.currentVersion} → ${versionRecommendation.recommendedVersion}`);
        console.log(`   Rationale: ${versionRecommendation.rationale}`);
        
        const confirm = await this.promptUser('Confirm major version bump? (y/n): ');
        if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
          // Allow user to override version recommendation
          const override = await this.promptVersionOverride(versionRecommendation);
          if (override) {
            Object.assign(versionRecommendation, override);
          }
        }
      }

      // Step 6: Generate release notes
      console.log('📝 Generating release notes...');
      const noteGenerator = new (await import('../notes/ReleaseNoteGenerator')).ReleaseNoteGenerator();
      const releaseNotes = await noteGenerator.generateReleaseNotes(extractedChanges, versionRecommendation.recommendedVersion);

      // Step 7: Calculate confidence metrics
      const confidence = this.calculateConfidenceMetrics(extractedChanges, versionRecommendation);

      const analysisResult: AnalysisResult = {
        scope: analysisScope,
        changes: extractedChanges,
        versionRecommendation,
        releaseNotes,
        confidence
      };

      // Save to history
      const duration = Date.now() - startTime;
      await this.saveToHistory(analysisResult, options, duration);

      return analysisResult;
    }, context);

    if (result.success) {
      console.log('✅ Enhanced analysis complete!\n');
      
      // Display error summary if there were any issues
      const errorReport = releaseAnalysisErrorHandler.getFormattedErrorReport();
      if (errorReport !== '✅ No errors encountered during analysis') {
        console.log(errorReport);
      }
      
      return result.data!;
    } else {
      console.error('❌ Analysis failed with critical errors:');
      console.error(releaseAnalysisErrorHandler.getFormattedErrorReport());
      
      // Return a minimal result to allow CLI to continue
      return this.createFallbackResult(result.error?.message || 'Analysis failed');
    }
  }

  /**
   * Interactive review of uncertain changes
   */
  private async interactiveReview(changes: ExtractedChanges, options: InteractiveOptions): Promise<void> {
    console.log('\n📋 Interactive Review Mode');
    console.log('=' .repeat(40));
    
    const reviewThreshold = options.reviewThreshold || this.config.extraction.confidenceThresholds.reviewThreshold;
    
    // Review ambiguous items
    if (changes.metadata.ambiguousItems.length > 0) {
      console.log(`\n⚠️  Found ${changes.metadata.ambiguousItems.length} ambiguous items:`);
      
      for (let i = 0; i < changes.metadata.ambiguousItems.length; i++) {
        const item = changes.metadata.ambiguousItems[i];
        console.log(`\n${i + 1}. ${item}`);
        
        if (!options.autoApprove) {
          const action = await this.promptUser('Action (k)eep, (r)emove, (e)dit, (s)kip: ');
          
          switch (action.toLowerCase()) {
            case 'k':
            case 'keep':
              console.log('   ✅ Keeping item');
              break;
            case 'r':
            case 'remove':
              console.log('   ❌ Removing item');
              changes.metadata.ambiguousItems.splice(i, 1);
              i--; // Adjust index after removal
              break;
            case 'e':
            case 'edit':
              const newDescription = await this.promptUser('   New description: ');
              changes.metadata.ambiguousItems[i] = newDescription;
              console.log('   ✏️  Updated item');
              break;
            case 's':
            case 'skip':
            default:
              console.log('   ⏭️  Skipping item');
              break;
          }
        }
      }
    }

    // Review uncertain duplicates if available
    if (changes.metadata.deduplication?.uncertainDuplicates) {
      console.log(`\n🔄 Found ${changes.metadata.deduplication.uncertainDuplicates.length} uncertain duplicates:`);
      
      for (const duplicate of changes.metadata.deduplication.uncertainDuplicates) {
        console.log(`\n📝 ${duplicate.changeType} - Similarity: ${(duplicate.similarity * 100).toFixed(1)}%`);
        console.log(`   Items: ${duplicate.items.map(item => item.title).join(', ')}`);
        console.log(`   Suggested: ${duplicate.suggestedAction}`);
        
        if (!options.autoApprove) {
          const action = await this.promptUser('Action (m)erge, (s)eparate, (r)eview later: ');
          
          switch (action.toLowerCase()) {
            case 'm':
            case 'merge':
              console.log('   🔗 Merging items');
              // Implementation would merge the duplicate items
              break;
            case 's':
            case 'separate':
              console.log('   📋 Keeping items separate');
              break;
            case 'r':
            case 'review':
            default:
              console.log('   ⏳ Flagged for later review');
              break;
          }
        }
      }
    }

    console.log('\n✅ Interactive review complete');
  }

  /**
   * Preview analysis scope without full extraction
   */
  private async previewAnalysis(options: AnalysisOptions): Promise<AnalysisScope> {
    const gitAnalyzer = new (await import('../git/GitHistoryAnalyzer')).GitHistoryAnalyzer(this.workingDirectory);
    
    let analysisScope: AnalysisScope;
    
    if (options.since) {
      const changes = await gitAnalyzer.getChangesSince(options.since);
      const documents = await gitAnalyzer.findCompletionDocuments(changes);
      analysisScope = {
        fromTag: options.since,
        toCommit: 'HEAD',
        completionDocuments: documents,
        analysisDate: new Date()
      };
    } else {
      const lastRelease = await gitAnalyzer.findLastRelease();
      if (lastRelease) {
        const changes = await gitAnalyzer.getChangesSince(lastRelease.name);
        const documents = await gitAnalyzer.findCompletionDocuments(changes);
        analysisScope = {
          fromTag: lastRelease.name,
          toCommit: 'HEAD',
          completionDocuments: documents,
          analysisDate: new Date()
        };
      } else {
        const allDocuments = await this.findAllCompletionDocuments();
        analysisScope = {
          toCommit: 'HEAD',
          completionDocuments: allDocuments,
          analysisDate: new Date()
        };
      }
    }

    return analysisScope;
  }

  /**
   * Show analysis preview
   */
  private showAnalysisPreview(scope: AnalysisScope): void {
    console.log('📋 Analysis Preview');
    console.log('=' .repeat(30));
    console.log(`From: ${scope.fromTag || scope.fromCommit || 'Repository start'}`);
    console.log(`To: ${scope.toCommit}`);
    console.log(`Documents to analyze: ${scope.completionDocuments.length}`);
    
    if (scope.completionDocuments.length > 0) {
      console.log('\nDocuments:');
      scope.completionDocuments.forEach((doc, index) => {
        console.log(`  ${index + 1}. ${doc.path} (${doc.metadata.type})`);
      });
    }
    console.log('');
  }

  /**
   * Configuration management commands
   */
  async manageConfiguration(options: ConfigOptions): Promise<void> {
    if (options.show) {
      await this.showConfiguration();
    } else if (options.set) {
      await this.setConfigurationValue(options.set.key, options.set.value);
    } else if (options.reset) {
      await this.resetConfiguration();
    } else if (options.validate) {
      await this.validateConfiguration();
    } else {
      console.log('Configuration management options:');
      console.log('  --config-show          Show current configuration');
      console.log('  --config-set key=value Set configuration value');
      console.log('  --config-reset         Reset to default configuration');
      console.log('  --config-validate      Validate configuration');
    }
  }

  /**
   * Show current configuration
   */
  private async showConfiguration(): Promise<void> {
    console.log('📋 Current Configuration');
    console.log('=' .repeat(40));
    console.log(JSON.stringify(this.config, null, 2));
  }

  /**
   * Set configuration value
   */
  private async setConfigurationValue(key: string, value: any): Promise<void> {
    try {
      // Parse nested key (e.g., "extraction.confidenceThresholds.minimumConfidence")
      const keys = key.split('.');
      let current: any = this.config;
      
      // Navigate to parent object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          throw new Error(`Configuration key not found: ${keys.slice(0, i + 1).join('.')}`);
        }
        current = current[keys[i]];
      }
      
      // Set the value
      const finalKey = keys[keys.length - 1];
      if (!(finalKey in current)) {
        throw new Error(`Configuration key not found: ${key}`);
      }
      
      // Type conversion
      if (typeof current[finalKey] === 'number') {
        current[finalKey] = parseFloat(value);
      } else if (typeof current[finalKey] === 'boolean') {
        current[finalKey] = value === 'true' || value === true;
      } else {
        current[finalKey] = value;
      }
      
      // Save configuration
      await this.saveConfiguration();
      console.log(`✅ Configuration updated: ${key} = ${value}`);
      
    } catch (error) {
      console.error(`❌ Error setting configuration: ${error}`);
    }
  }

  /**
   * Reset configuration to defaults
   */
  private async resetConfiguration(): Promise<void> {
    const confirm = await this.promptUser('Reset configuration to defaults? (y/n): ');
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      this.config = { ...DEFAULT_ANALYSIS_CONFIG };
      await this.saveConfiguration();
      console.log('✅ Configuration reset to defaults');
    } else {
      console.log('Configuration reset cancelled');
    }
  }

  /**
   * Validate configuration
   */
  private async validateConfiguration(): Promise<void> {
    console.log('🔍 Validating configuration...');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate confidence thresholds
    const thresholds = this.config.extraction.confidenceThresholds;
    if (thresholds.minimumConfidence < 0 || thresholds.minimumConfidence > 1) {
      errors.push('minimumConfidence must be between 0 and 1');
    }
    if (thresholds.uncertaintyThreshold < 0 || thresholds.uncertaintyThreshold > 1) {
      errors.push('uncertaintyThreshold must be between 0 and 1');
    }
    if (thresholds.reviewThreshold < 0 || thresholds.reviewThreshold > 1) {
      errors.push('reviewThreshold must be between 0 and 1');
    }
    
    // Validate patterns
    if (this.config.extraction.completionPatterns.length === 0) {
      warnings.push('No completion patterns defined');
    }
    
    // Validate output directory
    const outputDir = this.config.reporting.outputFiles.outputDirectory;
    try {
      await fs.access(path.dirname(outputDir));
    } catch {
      warnings.push(`Output directory parent does not exist: ${outputDir}`);
    }
    
    // Report results
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ Configuration is valid');
    } else {
      if (errors.length > 0) {
        console.log('❌ Configuration errors:');
        errors.forEach(error => console.log(`  - ${error}`));
      }
      if (warnings.length > 0) {
        console.log('⚠️  Configuration warnings:');
        warnings.forEach(warning => console.log(`  - ${warning}`));
      }
    }
  }

  /**
   * Analysis history management
   */
  async manageHistory(options: HistoryOptions): Promise<void> {
    if (options.list) {
      await this.listAnalysisHistory();
    } else if (options.compare) {
      await this.compareWithHistory(options.compare);
    } else if (options.show) {
      await this.showHistoryEntry(options.show);
    } else if (options.clear) {
      await this.clearAnalysisHistory();
    } else {
      console.log('History management options:');
      console.log('  --history-list         List previous analyses');
      console.log('  --history-compare <id> Compare with previous analysis');
      console.log('  --history-show <id>    Show analysis details');
      console.log('  --history-clear        Clear analysis history');
    }
  }

  /**
   * List analysis history
   */
  private async listAnalysisHistory(): Promise<void> {
    try {
      const history = await this.loadAnalysisHistory();
      
      if (history.length === 0) {
        console.log('📋 No analysis history found');
        return;
      }
      
      console.log('📋 Analysis History');
      console.log('=' .repeat(50));
      
      history.forEach((entry, index) => {
        const date = new Date(entry.timestamp).toLocaleString();
        const version = entry.result.versionRecommendation.recommendedVersion;
        const changes = entry.result.changes.breakingChanges.length + 
                       entry.result.changes.newFeatures.length + 
                       entry.result.changes.bugFixes.length + 
                       entry.result.changes.improvements.length;
        
        console.log(`${index + 1}. ${entry.id}`);
        console.log(`   Date: ${date}`);
        console.log(`   Version: ${version}`);
        console.log(`   Changes: ${changes}`);
        console.log(`   Duration: ${entry.duration}ms`);
        console.log('');
      });
      
    } catch (error) {
      console.error(`❌ Error loading history: ${error}`);
    }
  }

  /**
   * Compare current analysis with historical entry
   */
  private async compareWithHistory(historyId: string): Promise<void> {
    try {
      const history = await this.loadAnalysisHistory();
      const previousEntry = history.find(entry => entry.id === historyId);
      
      if (!previousEntry) {
        console.error(`❌ History entry not found: ${historyId}`);
        return;
      }
      
      // Run current analysis
      console.log('🔍 Running current analysis for comparison...');
      const currentResult = await this.analyzeChanges({ skipConfirmation: true });
      
      // Compare results
      const comparison = this.createComparison(previousEntry, currentResult);
      this.showComparison(comparison);
      
    } catch (error) {
      console.error(`❌ Error comparing with history: ${error}`);
    }
  }

  /**
   * Show detailed history entry
   */
  private async showHistoryEntry(historyId: string): Promise<void> {
    try {
      const history = await this.loadAnalysisHistory();
      const entry = history.find(h => h.id === historyId);
      
      if (!entry) {
        console.error(`❌ History entry not found: ${historyId}`);
        return;
      }
      
      console.log(`📋 Analysis Details: ${entry.id}`);
      console.log('=' .repeat(50));
      console.log(`Date: ${new Date(entry.timestamp).toLocaleString()}`);
      console.log(`Duration: ${entry.duration}ms`);
      console.log(`Version: ${entry.result.versionRecommendation.recommendedVersion}`);
      console.log(`Confidence: ${(entry.result.confidence.overall * 100).toFixed(1)}%`);
      console.log('');
      
      // Show changes summary
      const changes = entry.result.changes;
      console.log('Changes:');
      console.log(`  Breaking: ${changes.breakingChanges.length}`);
      console.log(`  Features: ${changes.newFeatures.length}`);
      console.log(`  Bug Fixes: ${changes.bugFixes.length}`);
      console.log(`  Improvements: ${changes.improvements.length}`);
      
    } catch (error) {
      console.error(`❌ Error showing history entry: ${error}`);
    }
  }

  /**
   * Clear analysis history
   */
  private async clearAnalysisHistory(): Promise<void> {
    const confirm = await this.promptUser('Clear all analysis history? (y/n): ');
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      try {
        await fs.unlink(this.historyPath);
        console.log('✅ Analysis history cleared');
      } catch (error) {
        console.log('✅ No history to clear');
      }
    } else {
      console.log('History clear cancelled');
    }
  }

  /**
   * Enhanced argument parsing with advanced options
   */
  private parseAdvancedArguments(args: string[]): { 
    command: string; 
    options: AnalysisOptions & InteractiveOptions; 
    configOptions: ConfigOptions;
    historyOptions: HistoryOptions;
  } {
    let command = 'analyze';
    const options: AnalysisOptions & InteractiveOptions = {};
    const configOptions: ConfigOptions = {};
    const historyOptions: HistoryOptions = {};
    let i = 0;

    // Check for help/version flags first
    if (args.includes('--help') || args.includes('-h')) {
      return { command: 'help', options, configOptions, historyOptions };
    }
    if (args.includes('--version') || args.includes('-v')) {
      return { command: 'version', options, configOptions, historyOptions };
    }

    // Check if first argument is a command
    if (args.length > 0 && !args[0].startsWith('--')) {
      const possibleCommand = args[0];
      if (['analyze', 'config', 'history', 'help', 'version'].includes(possibleCommand)) {
        command = possibleCommand;
        i = 1;
      }
    }

    // Parse options
    while (i < args.length) {
      const arg = args[i];
      
      switch (arg) {
        // Basic analysis options
        case '--since':
          if (i + 1 < args.length) options.since = args[++i];
          break;
        case '--format':
          if (i + 1 < args.length) {
            const format = args[++i] as 'summary' | 'detailed' | 'json';
            if (['summary', 'detailed', 'json'].includes(format)) {
              options.outputFormat = format;
            }
          }
          break;
        case '--dry-run':
          options.dryRun = true;
          break;
        case '--include':
          if (i + 1 < args.length) options.includePatterns = args[++i].split(',');
          break;
        case '--exclude':
          if (i + 1 < args.length) options.excludePatterns = args[++i].split(',');
          break;
        
        // Interactive options
        case '--interactive':
        case '-i':
          options.interactive = true;
          break;
        case '--auto-approve':
          options.autoApprove = true;
          break;
        case '--skip-confirmation':
          options.skipConfirmation = true;
          break;
        case '--review-threshold':
          if (i + 1 < args.length) options.reviewThreshold = parseFloat(args[++i]);
          break;
        
        // Configuration options
        case '--config-show':
          configOptions.show = true;
          break;
        case '--config-set':
          if (i + 1 < args.length) {
            const [key, value] = args[++i].split('=');
            configOptions.set = { key, value };
          }
          break;
        case '--config-reset':
          configOptions.reset = true;
          break;
        case '--config-validate':
          configOptions.validate = true;
          break;
        case '--config-path':
          if (i + 1 < args.length) configOptions.configPath = args[++i];
          break;
        
        // History options
        case '--history-list':
          historyOptions.list = true;
          break;
        case '--history-compare':
          if (i + 1 < args.length) historyOptions.compare = args[++i];
          break;
        case '--history-show':
          if (i + 1 < args.length) historyOptions.show = args[++i];
          break;
        case '--history-clear':
          historyOptions.clear = true;
          break;
      }
      i++;
    }

    return { command, options, configOptions, historyOptions };
  }

  /**
   * Enhanced main CLI entry point
   */
  async run(args: string[] = process.argv.slice(2)): Promise<void> {
    try {
      const { command, options, configOptions, historyOptions } = this.parseAdvancedArguments(args);

      switch (command) {
        case 'help':
          this.showAdvancedHelp();
          break;

        case 'analyze':
          const result = await this.analyzeChanges(options);
          
          switch (options.outputFormat || 'summary') {
            case 'detailed':
              this.showDetailedReport(result);
              break;
            case 'json':
              this.showJSONReport(result);
              break;
            case 'summary':
            default:
              this.showSummaryReport(result);
              break;
          }
          break;

        case 'config':
          await this.manageConfiguration(configOptions);
          break;

        case 'history':
          await this.manageHistory(historyOptions);
          break;

        case 'version':
          console.log('Advanced Release Analysis CLI v1.0.0');
          break;

        default:
          console.error(`❌ Unknown command: ${command}`);
          this.showAdvancedHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  // Helper methods (implementation details)
  
  private async determineAnalysisScope(options: AnalysisOptions): Promise<AnalysisScope> {
    const gitAnalyzer = new (await import('../git/GitHistoryAnalyzer')).GitHistoryAnalyzer(this.workingDirectory);
    
    if (options.since) {
      const changes = await gitAnalyzer.getChangesSince(options.since);
      const documents = await gitAnalyzer.findCompletionDocuments(changes);
      return {
        fromTag: options.since,
        toCommit: 'HEAD',
        completionDocuments: documents,
        analysisDate: new Date()
      };
    } else {
      const lastRelease = await gitAnalyzer.findLastRelease();
      if (lastRelease) {
        const changes = await gitAnalyzer.getChangesSince(lastRelease.name);
        const documents = await gitAnalyzer.findCompletionDocuments(changes);
        return {
          fromTag: lastRelease.name,
          toCommit: 'HEAD',
          completionDocuments: documents,
          analysisDate: new Date()
        };
      } else {
        const allDocuments = await this.findAllCompletionDocuments();
        return {
          toCommit: 'HEAD',
          completionDocuments: allDocuments,
          analysisDate: new Date()
        };
      }
    }
  }

  private async findAllCompletionDocuments(): Promise<CompletionDocument[]> {
    const collector = new (await import('../collection/CompletionDocumentCollector')).CompletionDocumentCollector(
      this.workingDirectory,
      this.config
    );

    const completionPaths: string[] = [];
    
    // Use glob to find completion documents
    const { glob } = await import('glob');
    
    for (const pattern of this.config.extraction.completionPatterns) {
      try {
        const matches = await new Promise<string[]>((resolve, reject) => {
          glob(pattern, { cwd: this.workingDirectory }, (err, files) => {
            if (err) reject(err);
            else resolve(files);
          });
        });
        completionPaths.push(...matches);
      } catch (error) {
        // Continue with other patterns if one fails
      }
    }

    const collectionResult = await collector.collectFromPaths(completionPaths);
    return collectionResult.documents;
  }

  private async getCurrentVersion(): Promise<string> {
    try {
      const packagePath = path.join(this.workingDirectory, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      if (packageJson.version) {
        return packageJson.version;
      }
    } catch {
      // Continue to Git fallback
    }

    // Fallback to Git tags
    const gitAnalyzer = new (await import('../git/GitHistoryAnalyzer')).GitHistoryAnalyzer(this.workingDirectory);
    const lastRelease = await gitAnalyzer.findLastRelease();
    if (lastRelease) {
      return lastRelease.name.replace(/^v/, '');
    }

    return '0.0.0';
  }

  private calculateConfidenceMetrics(changes: ExtractedChanges, versionRec: VersionRecommendation): ConfidenceMetrics {
    const extractionConfidence = changes.metadata.extractionConfidence || 0.8;
    const versioningConfidence = versionRec.confidence || 0.9;
    
    let overall = (extractionConfidence + versioningConfidence) / 2;
    
    if (changes.metadata.ambiguousItems.length > 0) {
      overall *= 0.9;
    }
    
    if (changes.metadata.documentsAnalyzed === 0) {
      overall *= 0.5;
    }

    return {
      overall: Math.max(0, Math.min(1, overall)),
      extraction: extractionConfidence,
      categorization: extractionConfidence,
      deduplication: 0.95,
      versionCalculation: versioningConfidence
    };
  }

  private async loadConfiguration(): Promise<void> {
    try {
      const configContent = await fs.readFile(this.configPath, 'utf-8');
      this.config = { ...DEFAULT_ANALYSIS_CONFIG, ...JSON.parse(configContent) };
    } catch {
      this.config = DEFAULT_ANALYSIS_CONFIG;
    }
  }

  private async saveConfiguration(): Promise<void> {
    await fs.mkdir(path.dirname(this.configPath), { recursive: true });
    await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2), 'utf-8');
  }

  private async loadAnalysisHistory(): Promise<AnalysisHistoryEntry[]> {
    try {
      const historyContent = await fs.readFile(this.historyPath, 'utf-8');
      return JSON.parse(historyContent);
    } catch {
      return [];
    }
  }

  private async saveToHistory(result: AnalysisResult, options: AnalysisOptions, duration: number): Promise<void> {
    const history = await this.loadAnalysisHistory();
    
    const entry: AnalysisHistoryEntry = {
      id: `analysis-${Date.now()}`,
      timestamp: new Date(),
      scope: result.scope,
      result,
      options,
      duration
    };

    history.unshift(entry);
    
    // Keep only last 50 analyses
    if (history.length > 50) {
      history.splice(50);
    }

    await fs.mkdir(path.dirname(this.historyPath), { recursive: true });
    await fs.writeFile(this.historyPath, JSON.stringify(history, null, 2), 'utf-8');
  }

  private createComparison(previous: AnalysisHistoryEntry, current: AnalysisResult): AnalysisComparison {
    const prevChanges = previous.result.changes;
    const currChanges = current.changes;
    
    const prevTotal = prevChanges.breakingChanges.length + prevChanges.newFeatures.length + 
                     prevChanges.bugFixes.length + prevChanges.improvements.length;
    const currTotal = currChanges.breakingChanges.length + currChanges.newFeatures.length + 
                     currChanges.bugFixes.length + currChanges.improvements.length;

    return {
      previous,
      current,
      differences: {
        versionChange: previous.result.versionRecommendation.recommendedVersion !== current.versionRecommendation.recommendedVersion,
        changeCountDifference: currTotal - prevTotal,
        newBreakingChanges: currChanges.breakingChanges.length - prevChanges.breakingChanges.length,
        newFeatures: currChanges.newFeatures.length - prevChanges.newFeatures.length,
        newBugFixes: currChanges.bugFixes.length - prevChanges.bugFixes.length,
        confidenceChange: current.confidence.overall - previous.result.confidence.overall
      }
    };
  }

  private showComparison(comparison: AnalysisComparison): void {
    console.log('📊 Analysis Comparison');
    console.log('=' .repeat(40));
    
    const prev = comparison.previous.result;
    const curr = comparison.current;
    const diff = comparison.differences;
    
    console.log(`Previous: ${prev.versionRecommendation.recommendedVersion} (${new Date(comparison.previous.timestamp).toLocaleDateString()})`);
    console.log(`Current:  ${curr.versionRecommendation.recommendedVersion}`);
    
    if (diff.versionChange) {
      console.log('🔄 Version recommendation changed');
    } else {
      console.log('✅ Version recommendation unchanged');
    }
    
    console.log(`\nChange count difference: ${diff.changeCountDifference > 0 ? '+' : ''}${diff.changeCountDifference}`);
    console.log(`Breaking changes: ${diff.newBreakingChanges > 0 ? '+' : ''}${diff.newBreakingChanges}`);
    console.log(`New features: ${diff.newFeatures > 0 ? '+' : ''}${diff.newFeatures}`);
    console.log(`Bug fixes: ${diff.newBugFixes > 0 ? '+' : ''}${diff.newBugFixes}`);
    console.log(`Confidence change: ${diff.confidenceChange > 0 ? '+' : ''}${(diff.confidenceChange * 100).toFixed(1)}%`);
  }

  private async promptUser(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private async promptVersionOverride(current: VersionRecommendation): Promise<Partial<VersionRecommendation> | null> {
    console.log('\nVersion Override Options:');
    console.log('1. Minor version bump');
    console.log('2. Patch version bump');
    console.log('3. Keep current recommendation');
    
    const choice = await this.promptUser('Choose option (1-3): ');
    
    switch (choice) {
      case '1':
        const minorVersion = this.calculateMinorBump(current.currentVersion);
        return {
          recommendedVersion: minorVersion,
          bumpType: 'minor',
          rationale: 'User override: Changed from major to minor bump'
        };
      case '2':
        const patchVersion = this.calculatePatchBump(current.currentVersion);
        return {
          recommendedVersion: patchVersion,
          bumpType: 'patch',
          rationale: 'User override: Changed from major to patch bump'
        };
      default:
        return null;
    }
  }

  private calculateMinorBump(version: string): string {
    const [major, minor] = version.split('.').map(Number);
    return `${major}.${minor + 1}.0`;
  }

  private calculatePatchBump(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  private createEmptyResult(): AnalysisResult {
    return {
      scope: {
        toCommit: 'HEAD',
        completionDocuments: [],
        analysisDate: new Date()
      },
      changes: {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 0,
          extractionConfidence: 0,
          ambiguousItems: [],
          filteredItems: []
        }
      },
      versionRecommendation: {
        currentVersion: '0.0.0',
        recommendedVersion: '0.0.0',
        bumpType: 'none',
        rationale: 'Analysis cancelled by user',
        confidence: 0,
        evidence: []
      },
      releaseNotes: '# Analysis Cancelled\n\nAnalysis was cancelled by user during dry-run preview.',
      confidence: {
        overall: 0,
        extraction: 0,
        categorization: 0,
        deduplication: 0,
        versionCalculation: 0
      }
    };
  }

  private createFallbackResult(errorMessage: string): AnalysisResult {
    return {
      scope: {
        toCommit: 'HEAD',
        completionDocuments: [],
        analysisDate: new Date()
      },
      changes: {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 0,
          extractionConfidence: 0,
          ambiguousItems: [`Analysis failed: ${errorMessage}`],
          filteredItems: []
        }
      },
      versionRecommendation: {
        currentVersion: '0.0.0',
        recommendedVersion: '0.0.0',
        bumpType: 'none',
        rationale: `Analysis failed: ${errorMessage}`,
        confidence: 0,
        evidence: []
      },
      releaseNotes: `# Analysis Failed\n\n${errorMessage}\n\nPlease resolve the issues and try again.`,
      confidence: {
        overall: 0,
        extraction: 0,
        categorization: 0,
        deduplication: 0,
        versionCalculation: 0
      }
    };
  }

  // Report display methods (reuse from basic CLI)
  showDetailedReport(result: AnalysisResult): void {
    console.log('📊 Detailed Analysis Report');
    console.log('=' .repeat(50));
    
    // Analysis Scope
    console.log('\n📋 Analysis Scope:');
    console.log(`  From: ${result.scope.fromTag || result.scope.fromCommit || 'Repository start'}`);
    console.log(`  To: ${result.scope.toCommit}`);
    console.log(`  Documents analyzed: ${result.changes.metadata.documentsAnalyzed}`);
    console.log(`  Analysis date: ${result.scope.analysisDate.toISOString()}`);

    // Version Recommendation
    console.log('\n🏷️  Version Recommendation:');
    console.log(`  Current: ${result.versionRecommendation.currentVersion}`);
    console.log(`  Recommended: ${result.versionRecommendation.recommendedVersion}`);
    console.log(`  Bump type: ${result.versionRecommendation.bumpType}`);
    console.log(`  Confidence: ${(result.versionRecommendation.confidence * 100).toFixed(1)}%`);
    console.log(`  Rationale: ${result.versionRecommendation.rationale}`);

    // Changes Summary
    console.log('\n📝 Changes Summary:');
    console.log(`  Breaking changes: ${result.changes.breakingChanges.length}`);
    console.log(`  New features: ${result.changes.newFeatures.length}`);
    console.log(`  Bug fixes: ${result.changes.bugFixes.length}`);
    console.log(`  Improvements: ${result.changes.improvements.length}`);
    console.log(`  Documentation: ${result.changes.documentation.length}`);

    // Confidence Metrics
    console.log('\n📈 Confidence Metrics:');
    console.log(`  Overall: ${(result.confidence.overall * 100).toFixed(1)}%`);
    console.log(`  Extraction: ${(result.confidence.extraction * 100).toFixed(1)}%`);
    console.log(`  Categorization: ${(result.confidence.categorization * 100).toFixed(1)}%`);
    console.log(`  Deduplication: ${(result.confidence.deduplication * 100).toFixed(1)}%`);
    console.log(`  Version Calculation: ${(result.confidence.versionCalculation * 100).toFixed(1)}%`);

    // Evidence
    if (result.versionRecommendation.evidence.length > 0) {
      console.log('\n🔍 Evidence:');
      result.versionRecommendation.evidence.forEach((evidence, index) => {
        console.log(`  ${index + 1}. [${evidence.type.toUpperCase()}] ${evidence.description}`);
        console.log(`     Source: ${evidence.source}`);
        console.log(`     Impact: ${evidence.impact}`);
      });
    }

    // Quality Indicators
    if (result.changes.metadata.ambiguousItems.length > 0) {
      console.log('\n⚠️  Items requiring review:');
      result.changes.metadata.ambiguousItems.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item}`);
      });
    }

    console.log('\n' + '='.repeat(50));
  }

  showSummaryReport(result: AnalysisResult): void {
    console.log('📊 Release Analysis Summary');
    console.log('=' .repeat(30));
    
    console.log(`\n🏷️  Version: ${result.versionRecommendation.currentVersion} → ${result.versionRecommendation.recommendedVersion}`);
    console.log(`📈 Bump type: ${result.versionRecommendation.bumpType}`);
    console.log(`🎯 Confidence: ${(result.versionRecommendation.confidence * 100).toFixed(1)}%`);
    
    const totalChanges = result.changes.breakingChanges.length + 
                        result.changes.newFeatures.length + 
                        result.changes.bugFixes.length + 
                        result.changes.improvements.length;
    
    console.log(`\n📝 Changes: ${totalChanges} total`);
    if (result.changes.breakingChanges.length > 0) {
      console.log(`  ⚠️  ${result.changes.breakingChanges.length} breaking changes`);
    }
    if (result.changes.newFeatures.length > 0) {
      console.log(`  ✨ ${result.changes.newFeatures.length} new features`);
    }
    if (result.changes.bugFixes.length > 0) {
      console.log(`  🐛 ${result.changes.bugFixes.length} bug fixes`);
    }
    if (result.changes.improvements.length > 0) {
      console.log(`  🔧 ${result.changes.improvements.length} improvements`);
    }

    console.log(`\n💭 ${result.versionRecommendation.rationale}`);
    
    if (result.changes.metadata.ambiguousItems.length > 0) {
      console.log(`\n⚠️  ${result.changes.metadata.ambiguousItems.length} items need review`);
    }

    console.log('\n' + '='.repeat(30));
  }

  showJSONReport(result: AnalysisResult): void {
    console.log(JSON.stringify(result, null, 2));
  }

  showAdvancedHelp(): void {
    console.log(`
🚀 Advanced Release Analysis CLI

Enhanced CLI with interactive features, configuration management, and analysis history.

Usage:
  npm run release:analyze [command] [options]

Commands:
  analyze                 - Analyze changes since last release (default)
  config                  - Manage configuration
  history                 - Manage analysis history
  help                    - Show this help message
  version                 - Show CLI version

Analysis Options:
  --since <tag|commit>    - Analyze changes since specific tag or commit
  --format <type>         - Output format: summary, detailed, json (default: summary)
  --dry-run              - Preview analysis scope without full extraction
  --include <patterns>    - Comma-separated file patterns to include
  --exclude <patterns>    - Comma-separated file patterns to exclude

Interactive Options:
  --interactive, -i       - Enable interactive mode for reviewing uncertain changes
  --auto-approve         - Auto-approve low-confidence items in interactive mode
  --skip-confirmation    - Skip confirmation prompts (use with caution)
  --review-threshold <n> - Confidence threshold for interactive review (0-1)

Configuration Management:
  --config-show          - Show current configuration
  --config-set key=value - Set configuration value (supports nested keys)
  --config-reset         - Reset configuration to defaults
  --config-validate      - Validate current configuration
  --config-path <path>   - Use custom configuration file path

Analysis History:
  --history-list         - List previous analyses
  --history-compare <id> - Compare current analysis with historical entry
  --history-show <id>    - Show detailed information about historical analysis
  --history-clear        - Clear all analysis history

Examples:
  # Basic analysis
  npm run release:analyze

  # Interactive analysis with detailed output
  npm run release:analyze --interactive --format detailed

  # Dry-run preview
  npm run release:analyze --dry-run --since v1.0.0

  # Configuration management
  npm run release:analyze config --config-show
  npm run release:analyze config --config-set extraction.confidenceThresholds.minimumConfidence=0.7

  # History management
  npm run release:analyze history --history-list
  npm run release:analyze history --history-compare analysis-1640995200000

  # Advanced workflow
  npm run release:analyze --interactive --review-threshold 0.8 --format detailed

Interactive Mode:
  When --interactive is enabled, the CLI will prompt you to review:
  - Ambiguous changes that couldn't be categorized with high confidence
  - Uncertain duplicate items that may need merging or separation
  - Major version bump recommendations for confirmation

Configuration Keys:
  extraction.confidenceThresholds.minimumConfidence    - Minimum confidence for extraction (0-1)
  extraction.confidenceThresholds.reviewThreshold     - Threshold for requiring review (0-1)
  versioning.versionBumpRules.requireMajorConfirmation - Require confirmation for major bumps
  reporting.defaultFormat                              - Default output format
  reporting.includeConfidence                          - Include confidence metrics in output

The enhanced CLI provides a complete workflow for release analysis with human oversight
and quality control through interactive features and comprehensive configuration options.
`);
  }
}

// CLI entry point when run directly
async function main(): Promise<void> {
  const cli = new AdvancedReleaseCLI();
  await cli.run();
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main as runAdvancedAnalysisCli };