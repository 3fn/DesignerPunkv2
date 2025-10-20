#!/usr/bin/env node

/**
 * Release Analysis CLI
 * 
 * Command-line interface for the release analysis system.
 * Provides on-demand analysis of changes between releases with version bump recommendations.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { releaseAnalysisErrorHandler, withErrorHandling, ErrorContext } from '../errors/ErrorHandler';
import { createRecoveryUtilities } from '../errors/ErrorRecovery';
import { 
  AnalysisResult as SharedAnalysisResult,
  AnalysisScope as SharedAnalysisScope,
  ExtractedChanges as SharedExtractedChanges,
  VersionRecommendation as SharedVersionRecommendation,
  ConfidenceMetrics as SharedConfidenceMetrics,
  CompletionDocument as SharedCompletionDocument,
  AnalysisOptions as SharedAnalysisOptions
} from '../types/AnalysisTypes';

// Type aliases for CLI interface
export type AnalysisOptions = SharedAnalysisOptions;
export type AnalysisResult = SharedAnalysisResult;
export type AnalysisScope = SharedAnalysisScope;
export type ExtractedChanges = SharedExtractedChanges;
export type VersionRecommendation = SharedVersionRecommendation;
export type ConfidenceMetrics = SharedConfidenceMetrics;
export type CompletionDocument = SharedCompletionDocument;

/**
 * Main CLI class for Release Analysis System
 */
export class ReleaseCLI {
  private configPath: string;
  private workingDirectory: string;

  constructor(workingDirectory: string = process.cwd()) {
    this.workingDirectory = workingDirectory;
    this.configPath = path.join(this.workingDirectory, '.kiro/release-config.json');
  }

  /**
   * Analyze changes since last release or specified point
   */
  async analyzeChanges(options: AnalysisOptions = {}): Promise<AnalysisResult> {
    console.log('🔍 Starting release analysis...\n');

    // Clear previous error history for new analysis
    releaseAnalysisErrorHandler.clearErrorHistory();

    const context: ErrorContext = {
      operation: 'analyzeChanges',
      component: 'ReleaseCLI',
      userAction: 'Running release analysis',
      timestamp: new Date()
    };

    const recoveryUtils = createRecoveryUtilities(this.workingDirectory);

    const result = await withErrorHandling(async () => {
      // Step 1: Load and validate configuration with error boundaries
      console.log('📋 Loading configuration...');
      let config;
      try {
        config = await this.loadConfiguration();
        if (!config || !config.extraction || !config.extraction.confidenceThresholds) {
          console.warn('⚠️  Invalid configuration structure, using fallback');
          config = this.createMinimalFallbackConfig();
        }
      } catch (configError) {
        console.warn('⚠️  Configuration loading failed, using fallback:', configError instanceof Error ? configError.message : 'Unknown error');
        config = this.createMinimalFallbackConfig();
      }

      // Step 2: Initialize Git analyzer with error recovery
      console.log('🔧 Initializing Git analysis...');
      const gitAnalyzer = new (await import('../git/GitHistoryAnalyzer')).GitHistoryAnalyzer(this.workingDirectory);

      // Step 3: Determine analysis scope with fallback strategies
      console.log('🎯 Determining analysis scope...');
      let analysisScope: AnalysisScope;

      if (options.since) {
        // User specified a reference point
        try {
          const changes = await gitAnalyzer.getChangesSince(options.since);
          const documents = await gitAnalyzer.findCompletionDocuments(changes);
          analysisScope = {
            fromTag: options.since,
            toCommit: 'HEAD',
            completionDocuments: documents,
            analysisDate: new Date()
          };
        } catch (error) {
          console.warn(`⚠️  Could not analyze from ${options.since}, falling back to all documents`);
          const allDocuments = await this.findAllCompletionDocuments();
          analysisScope = {
            toCommit: 'HEAD',
            completionDocuments: allDocuments,
            analysisDate: new Date()
          };
        }
      } else {
        // Try to find last release automatically with error recovery
        let lastRelease;
        try {
          lastRelease = await gitAnalyzer.findLastRelease();
        } catch (gitError) {
          console.warn(`⚠️  Git repository access failed: ${gitError instanceof Error ? gitError.message : 'Unknown error'}`);
          lastRelease = null;
        }
        
        if (lastRelease) {
          console.log(`📍 Found last release: ${lastRelease.name}`);
          try {
            const changes = await gitAnalyzer.getChangesSince(lastRelease.name);
            const documents = await gitAnalyzer.findCompletionDocuments(changes);
            analysisScope = {
              fromTag: lastRelease.name,
              toCommit: 'HEAD',
              completionDocuments: documents,
              analysisDate: new Date()
            };
          } catch (gitError) {
            console.warn(`⚠️  Git history analysis failed, falling back to all documents: ${gitError instanceof Error ? gitError.message : 'Unknown error'}`);
            const allDocuments = await this.findAllCompletionDocuments();
            analysisScope = {
              toCommit: 'HEAD',
              completionDocuments: allDocuments,
              analysisDate: new Date()
            };
          }
        } else {
          console.log('📍 No previous release found, analyzing all documents');
          const allDocuments = await this.findAllCompletionDocuments();
          analysisScope = {
            toCommit: 'HEAD',
            completionDocuments: allDocuments,
            analysisDate: new Date()
          };
        }
      }

      console.log(`📄 Found ${analysisScope.completionDocuments.length} completion documents`);

      // Step 4: Extract changes with error handling and configuration validation
      console.log('🔍 Extracting changes...');
      let extractedChanges;
      try {
        // Validate extraction configuration before creating extractor
        if (!config.extraction || !config.extraction.confidenceThresholds) {
          throw new Error('Invalid extraction configuration: missing confidenceThresholds');
        }
        
        const extractor = new (await import('../extraction/SimpleChangeExtractor')).SimpleChangeExtractor(config.extraction);
        extractedChanges = await extractor.extractChanges(analysisScope.completionDocuments);
      } catch (extractionError) {
        console.warn('⚠️  Change extraction failed, using fallback extraction:', extractionError instanceof Error ? extractionError.message : 'Unknown error');
        
        // Create fallback extracted changes with proper types
        extractedChanges = {
          breakingChanges: [] as any[],
          newFeatures: [] as any[],
          bugFixes: [] as any[],
          improvements: [] as any[],
          documentation: [] as any[],
          metadata: {
            documentsAnalyzed: analysisScope.completionDocuments.length,
            extractionConfidence: 0.3, // Low confidence due to fallback
            ambiguousItems: ['Extraction failed - using fallback processing'],
            filteredItems: []
          }
        };
        
        // Try basic pattern matching as fallback
        try {
          const basicChanges = await this.performBasicExtraction(analysisScope.completionDocuments);
          extractedChanges.newFeatures.push(...basicChanges.features);
          extractedChanges.bugFixes.push(...basicChanges.bugFixes);
          extractedChanges.improvements.push(...basicChanges.improvements);
          extractedChanges.metadata.extractionConfidence = 0.5; // Slightly higher confidence
        } catch (fallbackError) {
          console.warn('⚠️  Fallback extraction also failed, continuing with empty results');
        }
      }

      // Step 5: Calculate version recommendation with error handling
      console.log('🏷️  Calculating version recommendation...');
      let versionRecommendation;
      try {
        const versionCalculator = new (await import('../versioning/VersionCalculator')).VersionCalculator();
        const currentVersion = await this.getCurrentVersion();
        versionRecommendation = versionCalculator.calculateVersionBump(extractedChanges, currentVersion);
      } catch (versionError) {
        console.warn('⚠️  Version calculation failed, using fallback:', versionError instanceof Error ? versionError.message : 'Unknown error');
        
        const currentVersion = await this.getCurrentVersion();
        versionRecommendation = {
          currentVersion,
          recommendedVersion: currentVersion,
          bumpType: 'none' as const,
          rationale: `Version calculation failed: ${versionError instanceof Error ? versionError.message : 'Unknown error'}`,
          confidence: 0.1,
          evidence: []
        };
      }

      // Step 6: Generate release notes with error handling
      console.log('📝 Generating release notes...');
      let releaseNotes;
      try {
        const noteGenerator = new (await import('../notes/ReleaseNoteGenerator')).ReleaseNoteGenerator();
        releaseNotes = await noteGenerator.generateReleaseNotes(extractedChanges, versionRecommendation.recommendedVersion);
      } catch (notesError) {
        console.warn('⚠️  Release note generation failed, using fallback:', notesError instanceof Error ? notesError.message : 'Unknown error');
        
        releaseNotes = `# Release ${versionRecommendation.recommendedVersion}

## Analysis Summary

Release note generation encountered an error: ${notesError instanceof Error ? notesError.message : 'Unknown error'}

### Changes Detected
- ${extractedChanges.breakingChanges.length} breaking changes
- ${extractedChanges.newFeatures.length} new features  
- ${extractedChanges.bugFixes.length} bug fixes
- ${extractedChanges.improvements.length} improvements

Please review the detailed analysis for more information.
`;
      }

      // Step 7: Calculate confidence metrics
      const confidence = this.calculateConfidenceMetrics(extractedChanges, versionRecommendation);

      return {
        scope: analysisScope,
        changes: extractedChanges,
        versionRecommendation,
        releaseNotes,
        confidence
      };
    }, context);

    if (result.success && result.data) {
      console.log('✅ Analysis complete!\n');

      // Display error summary if there were any issues
      const errorReport = releaseAnalysisErrorHandler.getFormattedErrorReport();
      if (errorReport !== '✅ No errors encountered during analysis') {
        console.log(errorReport);
      }

      return result.data;
    } else {
      console.error('❌ Analysis failed with critical errors:');
      console.error(releaseAnalysisErrorHandler.getFormattedErrorReport());

      // Return a minimal result to allow CLI to continue
      return this.createFallbackResult(result.error?.message || 'Analysis failed');
    }
  }

  /**
   * Display detailed analysis report
   */
  showDetailedReport(result: AnalysisResult): void {
    console.log('📊 Detailed Analysis Report');
    console.log('='.repeat(50));

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

  /**
   * Display summary analysis report
   */
  showSummaryReport(result: AnalysisResult): void {
    console.log('📊 Release Analysis Summary');
    console.log('='.repeat(30));

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

  /**
   * Display JSON analysis report
   */
  showJSONReport(result: AnalysisResult): void {
    console.log(JSON.stringify(result, null, 2));
  }

  /**
   * Confirm version bump with user
   */
  async confirmVersionBump(recommendation: VersionRecommendation): Promise<boolean> {
    // For now, just return true - interactive confirmation will be implemented later
    console.log(`\n❓ Confirm version bump: ${recommendation.currentVersion} → ${recommendation.recommendedVersion} (${recommendation.bumpType})`);
    console.log('   (Interactive confirmation not yet implemented - proceeding)');
    return true;
  }

  /**
   * Save analysis results to file
   */
  async saveAnalysis(result: AnalysisResult, filePath: string): Promise<void> {
    try {
      const analysisData = {
        timestamp: new Date().toISOString(),
        analysis: result
      };

      await fs.writeFile(filePath, JSON.stringify(analysisData, null, 2), 'utf-8');
      console.log(`💾 Analysis saved to: ${filePath}`);
    } catch (error) {
      console.error(`❌ Error saving analysis: ${error}`);
      throw error;
    }
  }

  /**
   * Load configuration using the proper configuration manager with fallback
   */
  private async loadConfiguration(): Promise<any> {
    const context: ErrorContext = {
      operation: 'loadConfiguration',
      component: 'ReleaseCLI',
      timestamp: new Date()
    };

    const result = await withErrorHandling(async () => {
      // Try to use the proper configuration manager
      const { AnalysisConfigManager } = await import('../config/AnalysisConfigManager');
      const configManager = AnalysisConfigManager.getInstance();
      
      try {
        const config = await configManager.getConfig(this.workingDirectory);
        return config;
      } catch (configError) {
        // If configuration manager fails, fall back to default configuration
        console.warn('⚠️  Configuration loading failed, using defaults:', configError instanceof Error ? configError.message : 'Unknown error');
        
        const { DEFAULT_ANALYSIS_CONFIG } = await import('../config/AnalysisConfig');
        return DEFAULT_ANALYSIS_CONFIG;
      }
    }, context);

    if (result.success) {
      return result.data;
    } else {
      // Final fallback - create a minimal working configuration
      console.warn('⚠️  All configuration loading failed, using minimal fallback');
      return this.createMinimalFallbackConfig();
    }
  }

  /**
   * Create a minimal fallback configuration when all else fails
   */
  private createMinimalFallbackConfig(): any {
    return {
      extraction: {
        completionPatterns: ['**/*completion*.md', '.kiro/specs/*/completion/*.md'],
        breakingChangeKeywords: ['breaking', 'breaking change', 'incompatible'],
        featureKeywords: ['feature', 'new', 'add', 'implement'],
        bugFixKeywords: ['fix', 'bug', 'issue', 'resolve'],
        improvementKeywords: ['improve', 'enhance', 'optimize', 'refactor'],
        documentationKeywords: ['documentation', 'docs', 'readme', 'comment'],
        confidenceThresholds: {
          minimumConfidence: 0.6,
          uncertaintyThreshold: 0.8,
          reviewThreshold: 0.7,
          deduplicationThreshold: 0.8,
          semanticSimilarityThreshold: 0.7
        },
        sectionHeaders: {
          breakingChanges: ['Breaking Changes', 'BREAKING CHANGES'],
          features: ['New Features', 'Features'],
          bugFixes: ['Bug Fixes', 'Fixes'],
          improvements: ['Improvements', 'Optimizations'],
          summary: ['Summary', 'Overview']
        },
        excludePatterns: ['README.md', '*.test.ts', '*.spec.ts']
      },
      versioning: {
        semanticVersioning: true,
        preReleaseHandling: 'increment',
        versionBumpRules: {
          majorBumpTriggers: ['breaking change'],
          minorBumpTriggers: ['new feature'],
          patchBumpTriggers: ['bug fix'],
          defaultBumpType: 'patch',
          requireMajorConfirmation: true
        },
        preRelease: {
          identifier: 'beta',
          startingNumber: 1,
          format: '{version}-{identifier}.{number}'
        }
      },
      reporting: {
        defaultFormat: 'summary',
        includeConfidence: true,
        includeMetadata: false,
        includeEvidence: true,
        templates: {
          summary: {
            format: 'markdown',
            sections: [],
            includeTableOfContents: false
          },
          detailed: {
            format: 'markdown',
            sections: [],
            includeTableOfContents: true
          },
          releaseNotes: {
            format: 'markdown',
            header: '# Release {version}\n\n',
            sections: {
              breakingChanges: '## Breaking Changes\n\n{items}\n\n',
              features: '## New Features\n\n{items}\n\n',
              bugFixes: '## Bug Fixes\n\n{items}\n\n',
              improvements: '## Improvements\n\n{items}\n\n'
            },
            footer: ''
          }
        },
        outputFiles: {
          saveResults: false,
          outputDirectory: './.kiro/release-analysis',
          analysisFilename: 'analysis-{timestamp}.md',
          releaseNotesFilename: 'release-notes-{version}.md',
          overwriteExisting: false
        }
      },
      git: {
        defaultBranch: 'main',
        releaseTagPattern: '^v?\\d+\\.\\d+\\.\\d+',
        completionPaths: ['.kiro/specs/*/completion/'],
        includePatterns: ['**/*-completion.md'],
        excludePatterns: ['node_modules/**', '.git/**'],
        maxCommits: 1000
      }
    };
  }

  /**
   * Parse command line arguments
   */
  private parseArguments(args: string[]): { command: string; options: AnalysisOptions } {
    let command = 'analyze'; // Default command
    const options: AnalysisOptions = {};
    let i = 0;

    // Check for help/version flags first
    if (args.includes('--help') || args.includes('-h')) {
      return { command: 'help', options };
    }
    if (args.includes('--version') || args.includes('-v')) {
      return { command: 'version', options };
    }

    // Check if first argument is a command (not an option)
    if (args.length > 0 && !args[0].startsWith('--')) {
      const possibleCommand = args[0];
      if (['analyze', 'help', 'version'].includes(possibleCommand)) {
        command = possibleCommand;
        i = 1; // Start parsing options from next argument
      }
    }

    // Parse options
    while (i < args.length) {
      const arg = args[i];

      switch (arg) {
        case '--since':
          if (i + 1 < args.length) {
            options.since = args[++i];
          }
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
          if (i + 1 < args.length) {
            options.includePatterns = args[++i].split(',');
          }
          break;
        case '--exclude':
          if (i + 1 < args.length) {
            options.excludePatterns = args[++i].split(',');
          }
          break;
      }
      i++;
    }

    return { command, options };
  }

  /**
   * Main CLI entry point
   */
  async run(args: string[] = process.argv.slice(2)): Promise<void> {
    try {
      const { command, options } = this.parseArguments(args);

      switch (command) {
        case 'help':
        case '--help':
        case '-h':
          this.showHelp();
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

        case 'version':
        case '--version':
        case '-v':
          console.log('Release Analysis CLI v1.0.0');
          break;

        default:
          console.error(`❌ Unknown command: ${command}`);
          this.showHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }
  }

  /**
   * Find all completion documents in the repository with robust fallback
   */
  private async findAllCompletionDocuments(): Promise<CompletionDocument[]> {
    const context: ErrorContext = {
      operation: 'findAllCompletionDocuments',
      component: 'ReleaseCLI',
      timestamp: new Date()
    };

    const result = await withErrorHandling(async () => {
      // Try using the CompletionDocumentCollector first
      try {
        const collector = new (await import('../collection/CompletionDocumentCollector')).CompletionDocumentCollector(
          this.workingDirectory,
          await this.loadConfiguration()
        );

        const completionPaths: string[] = [];

        // Look in common completion document locations
        const searchPaths = [
          '.kiro/specs/*/completion/*.md',
          'completion/*.md',
          '*-completion.md'
        ];

        for (const searchPath of searchPaths) {
          try {
            const { glob } = await import('glob');
            const matches = await new Promise<string[]>((resolve, reject) => {
              glob(searchPath, { cwd: this.workingDirectory }, (err, files) => {
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
      } catch (collectorError) {
        console.warn(`⚠️  CompletionDocumentCollector failed, using simple file scanning: ${collectorError instanceof Error ? collectorError.message : 'Unknown error'}`);
        
        // Fallback to simple file scanning
        return await this.performSimpleDocumentScan();
      }
    }, context);

    if (result.success) {
      return result.data || [];
    } else {
      console.warn(`⚠️  Could not find completion documents: ${result.error?.message}`);
      // Final fallback - try simple scan
      try {
        return await this.performSimpleDocumentScan();
      } catch (finalError) {
        console.warn(`⚠️  All document scanning methods failed: ${finalError instanceof Error ? finalError.message : 'Unknown error'}`);
        return [];
      }
    }
  }

  /**
   * Perform simple document scanning as fallback
   */
  private async performSimpleDocumentScan(): Promise<CompletionDocument[]> {
    const documents: CompletionDocument[] = [];
    const fs = await import('fs/promises');
    const path = await import('path');

    // Simple patterns to search for
    const searchPaths = [
      '.kiro/specs/*/completion/*.md',
      '*-completion.md'
    ];

    for (const searchPath of searchPaths) {
      try {
        const { glob } = await import('glob');
        const matches = await new Promise<string[]>((resolve, reject) => {
          glob(searchPath, { cwd: this.workingDirectory }, (err, files) => {
            if (err) reject(err);
            else resolve(files);
          });
        });

        for (const filePath of matches) {
          try {
            const fullPath = path.join(this.workingDirectory, filePath);
            const content = await fs.readFile(fullPath, 'utf-8');
            const stats = await fs.stat(fullPath);

            documents.push({
              path: filePath,
              content,
              lastModified: stats.mtime,
              gitCommit: 'unknown', // Can't get Git info in fallback mode
              metadata: {
                title: path.basename(filePath, '.md'),
                type: 'task-completion'
              }
            });
          } catch (fileError) {
            console.warn(`⚠️  Could not read file ${filePath}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
            // Continue with other files
          }
        }
      } catch (globError) {
        console.warn(`⚠️  Pattern ${searchPath} failed: ${globError instanceof Error ? globError.message : 'Unknown error'}`);
        // Continue with other patterns
      }
    }

    return documents;
  }

  /**
   * Get current version from package.json or Git tags with robust fallback
   */
  private async getCurrentVersion(): Promise<string> {
    const context: ErrorContext = {
      operation: 'getCurrentVersion',
      component: 'ReleaseCLI',
      timestamp: new Date()
    };

    const result = await withErrorHandling(async () => {
      // Try to read version from package.json first
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const packagePath = path.join(this.workingDirectory, 'package.json');
        const packageContent = await fs.readFile(packagePath, 'utf-8');
        const packageJson = JSON.parse(packageContent);
        if (packageJson.version && typeof packageJson.version === 'string') {
          return packageJson.version;
        }
      } catch (packageError) {
        console.warn(`⚠️  Could not read package.json: ${packageError instanceof Error ? packageError.message : 'Unknown error'}`);
      }

      // Fallback to Git tags (with error handling)
      try {
        const gitAnalyzer = new (await import('../git/GitHistoryAnalyzer')).GitHistoryAnalyzer(this.workingDirectory);
        const lastRelease = await gitAnalyzer.findLastRelease();
        if (lastRelease && lastRelease.name && typeof lastRelease.name === 'string') {
          const version = lastRelease.name.replace(/^v/, ''); // Remove 'v' prefix if present
          if (version && version !== lastRelease.name) {
            return version;
          }
          return lastRelease.name;
        }
      } catch (gitError) {
        console.warn(`⚠️  Could not get version from Git: ${gitError instanceof Error ? gitError.message : 'Unknown error'}`);
      }

      // Final fallback - default version
      return '0.0.0';
    }, context);

    // Ensure we always return a valid string
    const version = result.success && result.data ? result.data : '0.0.0';
    return typeof version === 'string' ? version : '0.0.0';
  }

  /**
   * Calculate confidence metrics for the analysis
   */
  private calculateConfidenceMetrics(changes: ExtractedChanges, versionRec: VersionRecommendation): ConfidenceMetrics {
    const extractionConfidence = changes.metadata.extractionConfidence || 0.8;
    const versioningConfidence = versionRec.confidence || 0.9;

    // Calculate overall confidence based on various factors
    let overall = (extractionConfidence + versioningConfidence) / 2;

    // Reduce confidence if there are ambiguous items
    if (changes.metadata.ambiguousItems.length > 0) {
      overall *= 0.9;
    }

    // Reduce confidence if no documents were analyzed
    if (changes.metadata.documentsAnalyzed === 0) {
      overall *= 0.5;
    }

    return {
      overall: Math.max(0, Math.min(1, overall)),
      extraction: extractionConfidence,
      categorization: extractionConfidence,
      deduplication: 0.95, // Assume high deduplication confidence
      versionCalculation: versioningConfidence
    };
  }

  /**
   * Perform basic extraction as fallback when main extraction fails
   */
  private async performBasicExtraction(documents: CompletionDocument[]): Promise<{
    features: any[];
    bugFixes: any[];
    improvements: any[];
  }> {
    const features: any[] = [];
    const bugFixes: any[] = [];
    const improvements: any[] = [];

    for (const document of documents) {
      const content = document.content.toLowerCase();
      
      // Simple pattern matching for features
      if (content.includes('feature') || content.includes('new') || content.includes('add')) {
        features.push({
          id: Math.random().toString(36).substring(2),
          title: `Feature from ${document.path}`,
          description: 'Feature detected through basic pattern matching',
          benefits: [],
          requirements: [],
          artifacts: [],
          source: document.path,
          category: 'general'
        });
      }
      
      // Simple pattern matching for bug fixes
      if (content.includes('fix') || content.includes('bug') || content.includes('issue')) {
        bugFixes.push({
          id: Math.random().toString(36).substring(2),
          title: `Bug fix from ${document.path}`,
          description: 'Bug fix detected through basic pattern matching',
          issueNumber: null,
          affectedComponents: [],
          source: document.path,
          severity: 'medium'
        });
      }
      
      // Simple pattern matching for improvements
      if (content.includes('improve') || content.includes('enhance') || content.includes('optimize')) {
        improvements.push({
          id: Math.random().toString(36).substring(2),
          title: `Improvement from ${document.path}`,
          description: 'Improvement detected through basic pattern matching',
          type: 'general',
          impact: 'medium',
          source: document.path
        });
      }
    }

    return { features, bugFixes, improvements };
  }

  /**
   * Create a fallback result when analysis fails
   */
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

  /**
   * Display help information
   */
  showHelp(): void {
    console.log(`
🚀 Release Analysis CLI

Analyze changes between releases and generate version bump recommendations.

Usage:
  npm run release:analyze [command] [options]

Commands:
  analyze                 - Analyze changes since last release (default)
  help                    - Show this help message
  version                 - Show CLI version

Options:
  --since <tag|commit>    - Analyze changes since specific tag or commit
  --format <type>         - Output format: summary, detailed, json (default: summary)
  --dry-run              - Perform analysis without making changes
  --include <patterns>    - Comma-separated file patterns to include
  --exclude <patterns>    - Comma-separated file patterns to exclude

Examples:
  npm run release:analyze
  npm run release:analyze --format detailed
  npm run release:analyze --since v1.0.0
  npm run release:analyze --format json --since HEAD~10
  npm run release:analyze --include "**/*completion*.md" --exclude "**/draft*"

Output Formats:
  summary    - Concise overview of changes and recommendations
  detailed   - Comprehensive analysis with confidence metrics
  json       - Machine-readable JSON output for automation

Configuration:
  Configuration is loaded from .kiro/release-config.json
  Default patterns and settings are used if configuration is not found.

Integration:
  The CLI integrates with Git to automatically determine analysis scope
  and processes completion documents to extract meaningful changes.
`);
  }
}

// CLI entry point when run directly
async function main(): Promise<void> {
  const cli = new ReleaseCLI(process.cwd());
  await cli.run();
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main as runAnalysisCli };