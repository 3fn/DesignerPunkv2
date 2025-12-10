/**
 * Release Analysis Orchestrator
 * 
 * Coordinates the release analysis process with append-only optimization.
 * Manages state, detects new documents, analyzes changes, and generates results.
 */

import { AnalysisStateManager } from './state/AnalysisStateManager';
import { NewDocumentDetector } from './detection/NewDocumentDetector';
import { AppendOnlyAnalyzer } from './analyzer/AppendOnlyAnalyzer';
import { DocumentAnalysisResult, PerformanceMetrics } from './state/types';

/**
 * Release analysis result with performance metrics
 */
export interface ReleaseAnalysisResult {
  /** Accumulated analysis results from all documents */
  results: DocumentAnalysisResult[];
  
  /** Performance metrics for this analysis run */
  performanceMetrics: PerformanceMetrics;
  
  /** Analysis metadata */
  metadata: {
    /** Total number of documents in accumulated results */
    totalDocuments: number;
    
    /** Number of new documents analyzed in this run */
    newDocuments: number;
    
    /** Number of documents skipped (already analyzed) */
    skippedDocuments: number;
    
    /** Commit hash at time of analysis */
    currentCommit: string;
    
    /** Timestamp of analysis */
    analyzedAt: Date;
  };
}

/**
 * Main release analysis orchestrator with append-only optimization
 */
export class ReleaseAnalysisOrchestrator {
  constructor(
    private stateManager: AnalysisStateManager,
    private documentDetector: NewDocumentDetector,
    private analyzer: AppendOnlyAnalyzer
  ) {}

  /**
   * Run release analysis with append-only optimization
   * 
   * This method:
   * 1. Loads previous analysis state
   * 2. Detects new documents since last analysis
   * 3. Analyzes only new documents
   * 4. Appends results to accumulated state
   * 5. Saves updated state
   * 6. Returns results with performance metrics
   * 
   * Error Handling:
   * - If analysis fails, state is NOT updated (preserves last successful state)
   * - Logs warning if analysis exceeds 5 second target
   */
  async analyze(): Promise<ReleaseAnalysisResult> {
    const startTime = Date.now();
    const phaseTimings = {
      stateLoad: 0,
      documentDetection: 0,
      parsing: 0,
      analysis: 0,
      generation: 0,
      stateSave: 0
    };
    
    console.log('🔍 Starting release analysis with append-only optimization...');
    
    try {
      // Step 1: Load previous state
      console.log('📋 Loading previous analysis state...');
      const stateLoadStart = Date.now();
      const state = await this.stateManager.loadState();
      const lastCommit = state?.lastAnalyzedCommit || null;
      const accumulatedResults = state?.accumulatedResults || [];
      phaseTimings.stateLoad = Date.now() - stateLoadStart;
      
      if (lastCommit) {
        console.log(`   Last analyzed commit: ${lastCommit}`);
        console.log(`   Previously analyzed documents: ${accumulatedResults.length}`);
      } else {
        console.log('   No previous state found - performing full analysis');
      }
      
      // Step 2: Detect new documents
      console.log('🔎 Detecting new completion documents...');
      const detectionStart = Date.now();
      const newDocumentPaths = await this.documentDetector.detectNewDocuments(lastCommit);
      phaseTimings.documentDetection = Date.now() - detectionStart;
      console.log(`   Found ${newDocumentPaths.length} new documents`);
      
      // Step 3: Analyze new documents and append results
      // Note: parsing and analysis phases are combined in AppendOnlyAnalyzer
      console.log('📊 Analyzing new documents...');
      const analysisStart = Date.now();
      const updatedResults = await this.analyzer.analyzeAndAppend(
        newDocumentPaths,
        accumulatedResults
      );
      const analysisDuration = Date.now() - analysisStart;
      // Split analysis time between parsing and analysis phases (rough estimate)
      phaseTimings.parsing = Math.floor(analysisDuration * 0.4);
      phaseTimings.analysis = Math.floor(analysisDuration * 0.6);
      // Generation phase is 0 for orchestrator (handled by separate generator)
      phaseTimings.generation = 0;
      
      // Step 4: Get current commit hash
      const currentCommit = await this.documentDetector.getCurrentCommit();
      
      // Step 5: Save updated state (only if analysis succeeded)
      console.log('💾 Saving updated analysis state...');
      const saveStart = Date.now();
      await this.stateManager.saveState({
        lastAnalyzedCommit: currentCommit,
        accumulatedResults: updatedResults,
        lastAnalyzedAt: new Date().toISOString(),
        version: '1.0'
      });
      phaseTimings.stateSave = Date.now() - saveStart;
      
      // Step 6: Calculate performance metrics
      const duration = Date.now() - startTime;
      const performanceMetrics: PerformanceMetrics = {
        totalDuration: duration,
        documentsAnalyzed: newDocumentPaths.length,
        documentsSkipped: accumulatedResults.length,
        totalDocuments: updatedResults.length,
        phaseTimings
      };
      
      // Log completion summary
      console.log('✅ Analysis complete!');
      console.log(`   Duration: ${duration}ms`);
      console.log(`   Analyzed: ${newDocumentPaths.length} new documents`);
      console.log(`   Skipped: ${accumulatedResults.length} existing documents`);
      console.log(`   Total: ${updatedResults.length} documents`);
      
      // Warn if analysis exceeded 5 second target (Requirement 8.5)
      if (duration > 5000) {
        console.warn(`⚠️  Performance warning: Analysis took ${duration}ms (target: <5000ms)`);
      }
      
      return {
        results: updatedResults,
        performanceMetrics,
        metadata: {
          totalDocuments: updatedResults.length,
          newDocuments: newDocumentPaths.length,
          skippedDocuments: accumulatedResults.length,
          currentCommit,
          analyzedAt: new Date()
        }
      };
    } catch (error) {
      // If analysis fails, do NOT update state (Requirement 6.2)
      console.error('❌ Analysis failed - state not updated:', error);
      throw error;
    }
  }

  /**
   * Force full analysis by resetting state and analyzing all documents
   * 
   * This method:
   * 1. Resets the analysis state
   * 2. Runs analysis (which will detect all documents as "new")
   * 3. Returns results with performance metrics
   */
  async analyzeFullReset(): Promise<ReleaseAnalysisResult> {
    console.log('🔄 Forcing full analysis (resetting state)...');
    
    // Reset state to force full analysis
    await this.stateManager.resetState();
    console.log('   State reset complete');
    
    // Run normal analysis (will analyze all documents)
    return this.analyze();
  }
}
