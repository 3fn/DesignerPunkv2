#!/usr/bin/env ts-node

/**
 * Performance profiling script for incremental analysis
 * 
 * Measures time spent in different operations:
 * - Git operations (detecting new documents)
 * - State I/O (loading/saving state)
 * - Document parsing
 * - Analysis operations
 */

import * as fs from 'fs';
import * as path from 'path';
import { AnalysisStateManager } from '../src/release-analysis/state/AnalysisStateManager';
import { NewDocumentDetector } from '../src/release-analysis/detection/NewDocumentDetector';
import { AppendOnlyAnalyzer } from '../src/release-analysis/analyzer/AppendOnlyAnalyzer';
import { DEFAULT_ANALYSIS_CONFIG } from '../src/release-analysis/config/AnalysisConfig';

interface TimingData {
  operation: string;
  duration: number;
  details?: string;
}

class PerformanceProfiler {
  private timings: TimingData[] = [];

  async time<T>(operation: string, fn: () => Promise<T>, details?: string): Promise<T> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    
    this.timings.push({ operation, duration, details });
    return result;
  }

  getTimings(): TimingData[] {
    return this.timings;
  }

  getTotalTime(): number {
    return this.timings.reduce((sum, t) => sum + t.duration, 0);
  }

  printReport(): void {
    console.log('\n=== Performance Profile Report ===\n');
    
    const totalTime = this.getTotalTime();
    
    this.timings.forEach(timing => {
      const percentage = ((timing.duration / totalTime) * 100).toFixed(1);
      const details = timing.details ? ` (${timing.details})` : '';
      console.log(`${timing.operation}${details}: ${timing.duration}ms (${percentage}%)`);
    });
    
    console.log(`\nTotal Time: ${totalTime}ms`);
    console.log('================================\n');
  }
}

async function profileIncrementalAnalysis() {
  const profiler = new PerformanceProfiler();
  
  console.log('Starting incremental analysis performance profiling...\n');
  
  // Initialize components
  const stateManager = new AnalysisStateManager();
  const detector = new NewDocumentDetector();
  const config = DEFAULT_ANALYSIS_CONFIG;
  const analyzer = new AppendOnlyAnalyzer(config);
  
  // 1. Load state
  const state = await profiler.time(
    'Load State',
    async () => stateManager.loadState(),
    'Reading analysis-state.json'
  );
  
  console.log(`State loaded: ${state ? 'Found existing state' : 'No existing state'}`);
  if (state) {
    console.log(`  - Last analyzed commit: ${state.lastAnalyzedCommit.substring(0, 8)}`);
    console.log(`  - Accumulated results: ${state.accumulatedResults.length} documents`);
  }
  
  // 2. Get current commit
  const currentCommit = await profiler.time(
    'Get Current Commit',
    async () => detector.getCurrentCommit(),
    'git rev-parse HEAD'
  );
  
  console.log(`Current commit: ${currentCommit.substring(0, 8)}`);
  
  // 3. Detect new documents
  const newDocuments = await profiler.time(
    'Detect New Documents',
    async () => detector.detectNewDocuments(state?.lastAnalyzedCommit || null),
    state ? 'git diff --name-only' : 'glob scan'
  );
  
  console.log(`New documents detected: ${newDocuments.length}`);
  newDocuments.slice(0, 5).forEach(doc => console.log(`  - ${doc}`));
  if (newDocuments.length > 5) {
    console.log(`  ... and ${newDocuments.length - 5} more`);
  }
  
  // 4. Analyze documents (includes parsing)
  const updatedResults = await profiler.time(
    'Analyze and Append',
    async () => analyzer.analyzeAndAppend(
      newDocuments,
      state?.accumulatedResults || []
    ),
    `${newDocuments.length} new + ${state?.accumulatedResults?.length || 0} existing`
  );
  
  console.log(`Total results after analysis: ${updatedResults.length}`);
  
  // 6. Save state
  await profiler.time(
    'Save State',
    async () => stateManager.saveState({
      lastAnalyzedCommit: currentCommit,
      accumulatedResults: updatedResults,
      lastAnalyzedAt: new Date().toISOString(),
      version: '1.0'
    }),
    'Writing analysis-state.json'
  );
  
  console.log('State saved successfully');
  
  // Print performance report
  profiler.printReport();
  
  // Analyze bottlenecks
  analyzeBottlenecks(profiler.getTimings(), profiler.getTotalTime());
}

function analyzeBottlenecks(timings: TimingData[], totalTime: number): void {
  console.log('=== Bottleneck Analysis ===\n');
  
  // Find operations taking >20% of total time
  const bottlenecks = timings.filter(t => (t.duration / totalTime) > 0.2);
  
  if (bottlenecks.length === 0) {
    console.log('No significant bottlenecks detected (no operation >20% of total time)');
  } else {
    console.log('Significant bottlenecks (>20% of total time):');
    bottlenecks.forEach(b => {
      const percentage = ((b.duration / totalTime) * 100).toFixed(1);
      console.log(`  - ${b.operation}: ${b.duration}ms (${percentage}%)`);
    });
  }
  
  console.log('\n=== Performance Assessment ===\n');
  
  if (totalTime < 5000) {
    console.log(`✅ PASS: Total time ${totalTime}ms is under 5 second target`);
  } else {
    console.log(`❌ FAIL: Total time ${totalTime}ms exceeds 5 second target`);
    console.log(`   Needs improvement: ${totalTime - 5000}ms over target`);
  }
  
  // Check if optimization is working
  const parseTime = timings.find(t => t.operation === 'Parse Documents')?.duration || 0;
  const analyzeTime = timings.find(t => t.operation === 'Analyze and Append')?.duration || 0;
  const gitTime = timings.find(t => t.operation === 'Detect New Documents')?.duration || 0;
  
  console.log('\n=== Optimization Effectiveness ===\n');
  console.log(`Git operations: ${gitTime}ms`);
  console.log(`Document parsing: ${parseTime}ms`);
  console.log(`Analysis: ${analyzeTime}ms`);
  
  const processingTime = parseTime + analyzeTime;
  console.log(`\nTotal processing time: ${processingTime}ms`);
  
  if (processingTime < 1000) {
    console.log('✅ Processing time is efficient (<1s)');
  } else if (processingTime < 3000) {
    console.log('⚠️  Processing time is acceptable but could be improved');
  } else {
    console.log('❌ Processing time is too high (>3s)');
  }
  
  console.log('\n===========================\n');
}

// Run profiling
profileIncrementalAnalysis().catch(error => {
  console.error('Profiling failed:', error);
  process.exit(1);
});
