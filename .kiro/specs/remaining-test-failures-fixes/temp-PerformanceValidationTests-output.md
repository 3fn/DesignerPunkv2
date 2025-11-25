> designer-punk-v2@1.0.0 test:performance
> jest --testPathPattern='performance/__tests__|__tests__/performance' PerformanceValidation
Determining test suites to run...
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        0 s, estimated 2116 s
████████████████████████████████████████












 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        0 s, estimated 2116 s
████████████████████████████████████████


























 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 2116 s
████████████████████████████████████████

























 PASS  src/__tests__/performance/OptimizationValidation.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 2116 s
████████████████████████████████████████


























 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 2116 s
████████████████████████████████████████

























 PASS  src/release-analysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 2116 s
████████████████████████████████████████

























 PASS  src/release-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 2116 s
████████████████████████████████████████

























  ● Console
    console.warn
      Failed to parse .kiro/specs/test2/completion/task-2-completion.md: Failed to parse document .kiro/specs/test2/completion/task-2-completion.md: Failed to parse document .kiro/specs/test2/completion/task-2-completion.md: File error
      196 |             return await this.parseDocumentIncremental(filePath);
      197 |           } catch (error) {
    > 198 |             console.warn(`Failed to parse ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
          |                     ^
      199 |             return null;

      200 |           }
      201 |         });
      at src/release-analysis/performance/DocumentParsingCache.ts:198:21
          at async Promise.all (index 1)
      at DocumentParsingCache.parseDocumentsParallel (src/release-analysis/performance/DocumentParsingCache.ts:203:30)
      at Object.<anonymous> (src/release-analysis/performance/__tests__/DocumentParsingCache.test.ts:172:23)
    console.log
      Preloaded 2 documents into cache
      at DocumentParsingCache.preloadDocuments (src/release-analysis/performance/DocumentParsingCache.ts:527:13)
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 2116 s
████████████████████████████████████████


























 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
Test Suites: 3 passed, 3 of 7 total
Tests:       71 passed, 71 total
Snapshots:   0 total
Time:        1 s, estimated 2116 s
████████████████████████████████████████



















 PASS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
Test Suites: 3 passed, 3 of 7 total
Tests:       71 passed, 71 total
Snapshots:   0 total
Time:        1 s, estimated 2116 s
████████████████████████████████████████




















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       73 passed, 73 total
Snapshots:   0 total
Time:        1 s, estimated 2116 s
████████████████████████████████████████


















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       80 passed, 80 total
Snapshots:   0 total
Time:        2 s, estimated 2116 s
████████████████████████████████████████

















 PASS  src/__tests__/integration/PerformanceValidation.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  src/__tests__/integration/PerformanceValidation.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       80 passed, 80 total
Snapshots:   0 total
Time:        2 s, estimated 2116 s
████████████████████████████████████████


















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       105 passed, 105 total
Snapshots:   0 total
Time:        2 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       105 passed, 105 total
Snapshots:   0 total
Time:        3 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       105 passed, 105 total
Snapshots:   0 total
Time:        4 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       105 passed, 105 total
Snapshots:   0 total
Time:        5 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       106 passed, 106 total
Snapshots:   0 total
Time:        5 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       106 passed, 106 total
Snapshots:   0 total
Time:        6 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       106 passed, 106 total
Snapshots:   0 total
Time:        7 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       106 passed, 106 total
Snapshots:   0 total
Time:        8 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       106 passed, 106 total
Snapshots:   0 total
Time:        9 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       106 passed, 106 total
Snapshots:   0 total
Time:        10 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       106 passed, 106 total
Snapshots:   0 total
Time:        11 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       107 passed, 107 total
Snapshots:   0 total
Time:        11 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       107 passed, 107 total
Snapshots:   0 total
Time:        12 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       1 failed, 107 passed, 108 total
Snapshots:   0 total
Time:        12 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       1 failed, 107 passed, 108 total
Snapshots:   0 total
Time:        13 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 107 passed, 109 total
Snapshots:   0 total
Time:        13 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 107 passed, 109 total
Snapshots:   0 total
Time:        14 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 107 passed, 109 total
Snapshots:   0 total
Time:        15 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 108 passed, 110 total
Snapshots:   0 total
Time:        15 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 108 passed, 110 total
Snapshots:   0 total
Time:        16 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 108 passed, 110 total
Snapshots:   0 total
Time:        17 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 108 passed, 110 total
Snapshots:   0 total
Time:        18 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 109 passed, 111 total
Snapshots:   0 total
Time:        18 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 109 passed, 111 total
Snapshots:   0 total
Time:        19 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 109 passed, 111 total
Snapshots:   0 total
Time:        20 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 109 passed, 111 total
Snapshots:   0 total
Time:        21 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 109 passed, 111 total
Snapshots:   0 total
Time:        22 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 110 passed, 112 total
Snapshots:   0 total
Time:        22 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 110 passed, 112 total
Snapshots:   0 total
Time:        23 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 110 passed, 112 total
Snapshots:   0 total
Time:        24 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       3 failed, 110 passed, 113 total
Snapshots:   0 total
Time:        25 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       3 failed, 110 passed, 113 total
Snapshots:   0 total
Time:        26 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        26 s, estimated 2116 s
████████████████████████████████████████















 FAIL  src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts (26.8 s)
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        26 s, estimated 2116 s
████████████████████████████████████████















  ● Console
    console.log
      Large Repository Benchmark Results: {
        totalTime: '3677ms',
        averageTime: '1225.6666666666667ms',
        peakMemory: '220.9MB',
        throughput: '81.6 docs/sec',
        cacheEfficiency: '80.0%'
      }
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:153:21)
    console.log
      Extra Large Repository Benchmark Results: {
        totalTime: '6101ms',
        peakMemory: '214.5MB',
        throughput: '82.0 docs/sec'
      }
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:189:21)
    console.log
      Memory Usage Benchmark Results: {
        results: [
          { documents: 10, peakMemory: '217.9MB', avgMemory: '217.9MB' },
          { documents: 25, peakMemory: '219.3MB', avgMemory: '218.5MB' },
          { documents: 50, peakMemory: '220.8MB', avgMemory: '219.3MB' },
          { documents: 100, peakMemory: '223.0MB', avgMemory: '221.1MB' }
        ],
        growthRate: '0.01'
      }
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:301:21)
    console.log
      Memory Leak Test Results: {
        initialMemory: '223.0MB',
        finalMemory: '223.4MB',
        growth: '0.4MB',
        iterations: 10
      }
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:347:21)
    console.log
      Scalability Test Results: {
        scalingFactor: '1.00',
        optimalConcurrency: 4,
        performanceByDocCount: [
          {
            documents: 5,
            time: '60ms',
            throughput: '83.3 docs/sec',
            memory: '0.0MB'
          },
          {
            documents: 10,
            time: '143ms',
            throughput: '69.9 docs/sec',
            memory: '226.0MB'
          },
          {
            documents: 25,
            time: '314ms',
            throughput: '79.6 docs/sec',
            memory: '208.8MB'
          },
          {
            documents: 50,
            time: '583ms',
            throughput: '85.8 docs/sec',
            memory: '217.9MB'
          },
          {
            documents: 100,
            time: '1173ms',
            throughput: '85.3 docs/sec',
            memory: '218.8MB'
          }
        ]
      }
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:373:21)
    console.log
      Storing baseline for medium repository: 592.3333333333334ms
      at storePerformanceBaseline (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:859:17)
    console.log
      Stored new performance baseline: 592.3333333333334ms
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:463:25)
    console.log
      📍 Milestone: phase-start-git-analysis (git-analysis, 0%)
      at ProgressReporter.addMilestone (src/release-analysis/performance/ProgressReporter.ts:479:15)
    console.warn
      [VALIDATION] Validation failed: Not a Git repository
      348 |                     error.severity === 'medium' ? 'warn' : 'info';
      349 |     
    > 350 |     console[logLevel](`[${error.category.toUpperCase()}] ${error.message}`);
          |                      ^
      351 |     if (error.technicalDetails && error.technicalDetails !== error.message) {
      352 |       console.debug(`Technical details: ${error.technicalDetails}`);
      353 |     }
      at ReleaseAnalysisErrorHandler.logError (src/release-analysis/errors/ErrorHandler.ts:350:22)
      at ReleaseAnalysisErrorHandler.handleValidationError (src/release-analysis/errors/ErrorHandler.ts:134:10)
      at withErrorHandling (src/release-analysis/errors/ErrorHandler.ts:664:29)
      at GitHistoryAnalyzer.findLastRelease (src/release-analysis/git/GitHistoryAnalyzer.ts:83:20)
      at PerformanceOptimizedAnalyzer.performGitAnalysisOptimized (src/release-analysis/performance/PerformanceOptimizedAnalyzer.ts:253:29)
      at src/release-analysis/performance/PerformanceOptimizedAnalyzer.ts:170:44
      at withErrorHandling (src/release-analysis/errors/ErrorHandler.ts:646:20)
      at PerformanceOptimizedAnalyzer.analyzeReleaseOptimized (src/release-analysis/performance/PerformanceOptimizedAnalyzer.ts:146:22)
      at benchmarkAnalyzerPerformance (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:714:13)
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:480:39)
    console.debug
      Technical details: Not a Git repository
      at ReleaseAnalysisErrorHandler.logError (src/release-analysis/errors/ErrorHandler.ts:352:15)
    console.log
      📍 Milestone: phase-complete-git-analysis (git-analysis, 100%)
      at ProgressReporter.addMilestone (src/release-analysis/performance/ProgressReporter.ts:479:15)
    console.log
      📍 Milestone: phase-start-document-collection (document-collection, 0%)
      at ProgressReporter.addMilestone (src/release-analysis/performance/ProgressReporter.ts:479:15)
    console.log
      📍 Milestone: phase-complete-document-collection (document-collection, 100%)
      at ProgressReporter.addMilestone (src/release-analysis/performance/ProgressReporter.ts:479:15)
    console.log
      📍 Milestone: phase-start-finalization (finalization, 0%)
      at ProgressReporter.addMilestone (src/release-analysis/performance/ProgressReporter.ts:479:15)
    console.log
      📍 Milestone: phase-complete-finalization (finalization, 100%)
      at ProgressReporter.addMilestone (src/release-analysis/performance/ProgressReporter.ts:479:15)
    console.log
      📍 Milestone: analysis-complete (complete, 100%)
      at ProgressReporter.addMilestone (src/release-analysis/performance/ProgressReporter.ts:479:15)
    console.log
      📍 Milestone: phase-start-git-analysis (git-analysis, 0%)
      at ProgressReporter.addMilestone (src/release-analysis/performance/ProgressReporter.ts:479:15)
    console.warn
      Optimized Git analysis failed, falling back to basic analysis: Git command failed: git tag -l --sort=-version:refname
      299 |     } catch (error) {
      300 |       if (this.config.fallbackToBasicAnalysis) {
    > 301 |         console.warn(`Optimized Git analysis failed, falling back to basic analysis: ${error instanceof Error ? error.message : String(error)}`);
          |                 ^
      302 |         
      303 |         // Fallback to basic analysis
      304 |         const lastRelease = await this.gitAnalyzer.findLastRelease();
      at PerformanceOptimizedAnalyzer.performGitAnalysisOptimized (src/release-analysis/performance/PerformanceOptimizedAnalyzer.ts:301:17)
      at src/release-analysis/performance/PerformanceOptimizedAnalyzer.ts:170:44
      at withErrorHandling (src/release-analysis/errors/ErrorHandler.ts:646:20)
      at PerformanceOptimizedAnalyzer.analyzeReleaseOptimized (src/release-analysis/performance/PerformanceOptimizedAnalyzer.ts:146:22)
      at benchmarkAnalyzerPerformance (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:714:13)
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:483:37)
    console.warn
      [VALIDATION] Validation failed: Not a Git repository
      348 |                     error.severity === 'medium' ? 'warn' : 'info';
      349 |     
    > 350 |     console[logLevel](`[${error.category.toUpperCase()}] ${error.message}`);
          |                      ^
      351 |     if (error.technicalDetails && error.technicalDetails !== error.message) {
      352 |       console.debug(`Technical details: ${error.technicalDetails}`);
      353 |     }
      at ReleaseAnalysisErrorHandler.logError (src/release-analysis/errors/ErrorHandler.ts:350:22)
      at ReleaseAnalysisErrorHandler.handleValidationError (src/release-analysis/errors/ErrorHandler.ts:134:10)
      at withErrorHandling (src/release-analysis/errors/ErrorHandler.ts:664:29)
      at GitHistoryAnalyzer.findLastRelease (src/release-analysis/git/GitHistoryAnalyzer.ts:83:20)
      at PerformanceOptimizedAnalyzer.performGitAnalysisOptimized (src/release-analysis/performance/PerformanceOptimizedAnalyzer.ts:304:29)
      at src/release-analysis/performance/PerformanceOptimizedAnalyzer.ts:170:44
      at withErrorHandling (src/release-analysis/errors/ErrorHandler.ts:646:20)
      at PerformanceOptimizedAnalyzer.analyzeReleaseOptimized (src/release-analysis/performance/PerformanceOptimizedAnalyzer.ts:146:22)
      at benchmarkAnalyzerPerformance (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:714:13)
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:483:37)
    console.debug
      Technical details: Not a Git repository
      at ReleaseAnalysisErrorHandler.logError (src/release-analysis/errors/ErrorHandler.ts:352:15)
    console.info
      [GIT] Git operation failed: Git command failed: git rev-parse HEAD
      at ReleaseAnalysisErrorHandler.logError (src/release-analysis/errors/ErrorHandler.ts:350:22)
    console.debug
      Technical details: Git command failed: git rev-parse HEAD
      at ReleaseAnalysisErrorHandler.logError (src/release-analysis/errors/ErrorHandler.ts:352:15)
    console.info
      [GIT] Git operation failed: Failed to get changes since undefined: Git operation failed: Git command failed: git rev-parse HEAD
      at ReleaseAnalysisErrorHandler.logError (src/release-analysis/errors/ErrorHandler.ts:350:22)
    console.debug
      Technical details: Failed to get changes since undefined: Git operation failed: Git command failed: git rev-parse HEAD
      at ReleaseAnalysisErrorHandler.logError (src/release-analysis/errors/ErrorHandler.ts:352:15)
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        26 s, estimated 2116 s
████████████████████████████████████████















  ● Performance Benchmarks › Extraction Speed Benchmarks › should achieve target extraction speed with caching
    expect(received).toBeGreaterThan(expected)
    Expected: > 2
    Received:   0.9782971619365609
      212 |             // Cache should provide significant speedup
      213 |             const speedupFactor = coldResult.averageTime / warmResult.averageTime;
    > 214 |             expect(speedupFactor).toBeGreaterThan(2); // At least 2x speedup with cache
          |                                   ^
      215 |
      216 |             // Verify extraction speed targets
      217 |             expect(coldResult.throughput).toBeGreaterThan(5); // 5 docs/sec cold
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:214:35)
  ● Performance Benchmarks › Extraction Speed Benchmarks › should achieve efficient parallel processing
    expect(received).toBeGreaterThan(expected)
    Expected: > 1.5
    Received:   0.9812108559498957
      247 |             // Parallel should be faster (accounting for overhead)
      248 |             const parallelEfficiency = sequentialResult.totalTime / parallelResult.totalTime;
    > 249 |             expect(parallelEfficiency).toBeGreaterThan(1.5); // At least 1.5x speedup
          |                                        ^
      250 |
      251 |             // Verify parallel efficiency is reasonable (not perfect due to overhead)
      252 |             expect(parallelResult.parallelEfficiency).toBeGreaterThan(0.6); // 60% efficiency
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:249:40)
  ● Performance Benchmarks › Scalability Testing › should identify optimal concurrency level
    expect(received).toBeGreaterThan(expected)
    Expected: > 1
    Received:   1
      407 |
      408 |             // Optimal concurrency should be reasonable for typical systems
    > 409 |             expect(optimalResult.level).toBeGreaterThan(1);
          |                                         ^
      410 |             expect(optimalResult.level).toBeLessThan(8);
      411 |             expect(optimalResult.efficiency).toBeGreaterThan(0.5);
      412 |
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:409:41)
  ● Performance Benchmarks › Regression Testing › should show improvement with optimizations enabled
    expect(received).toBeGreaterThan(expected)
    Expected: > 10
    Received:   -76.1904761904762
      485 |             // Optimizations should provide measurable improvement
      486 |             const improvement = (unoptimizedResult.averageTime - optimizedResult.averageTime) / unoptimizedResult.averageTime * 100;
    > 487 |             expect(improvement).toBeGreaterThan(10); // At least 10% improvement
          |                                 ^
      488 |
      489 |             console.log('Optimization Impact Results:', {
      490 |                 unoptimized: {
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:487:33)
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        26 s, estimated 2116 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        27 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        28 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        29 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        30 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        31 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        32 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        33 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        34 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        35 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        36 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        37 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        38 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        39 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        40 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        41 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        42 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        43 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        44 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        45 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        46 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        47 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        48 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        49 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        50 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        51 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        52 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        53 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        54 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        55 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        56 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        57 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        58 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        59 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        60 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 111 passed, 115 total
Snapshots:   0 total
Time:        61 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        61 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        62 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        63 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        64 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        65 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        66 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        67 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        68 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        69 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        70 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        71 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        72 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        73 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        74 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        75 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        76 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        77 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        78 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        79 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        80 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        81 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        82 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        83 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        84 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        85 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        86 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        87 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        88 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        89 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        90 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        91 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        92 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        93 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        94 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        95 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        96 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        97 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        98 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        99 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        100 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        101 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        102 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        103 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        104 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        105 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        106 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        107 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        108 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        109 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        110 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        111 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        112 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        113 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        114 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        115 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        116 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        117 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        118 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        119 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        120 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 111 passed, 116 total
Snapshots:   0 total
Time:        121 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        121 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        122 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        123 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        124 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        125 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        126 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        127 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        128 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        129 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        130 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        131 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        132 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        133 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        134 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        135 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        136 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        137 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        138 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        139 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        140 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        141 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        142 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        143 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        144 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        145 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        146 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        147 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        148 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        149 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        150 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        151 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        152 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        153 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        154 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        155 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        156 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        157 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        158 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        159 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        160 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        161 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        162 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        163 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        164 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        165 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        166 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        167 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        168 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        169 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        170 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        171 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        172 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        173 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        174 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        175 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        176 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        177 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        178 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        179 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        180 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 111 passed, 117 total
Snapshots:   0 total
Time:        181 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        181 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        182 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        183 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        184 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        185 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        186 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        187 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        188 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        189 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        190 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        191 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        192 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        193 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        194 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        195 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        196 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        197 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        198 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        199 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        200 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        201 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        202 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        203 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        204 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        205 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        206 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        207 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        208 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        209 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        210 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        211 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        212 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        213 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        214 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        215 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        216 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        217 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        218 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        219 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        220 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        221 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        222 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        223 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        224 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        225 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        226 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        227 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        228 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        229 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        230 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        231 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        232 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        233 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        234 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        235 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        236 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        237 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        238 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        239 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        240 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 111 passed, 118 total
Snapshots:   0 total
Time:        241 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        241 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        242 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        243 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        244 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        245 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        246 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        247 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        248 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        249 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        250 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        251 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        252 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        253 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        254 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        255 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        256 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        257 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        258 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        259 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        260 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        261 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        262 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        263 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        264 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        265 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        266 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        267 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        268 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        269 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        270 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        271 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        272 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        273 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        274 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        275 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        276 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        277 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        278 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        279 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        280 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        281 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        282 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        283 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        284 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        285 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        286 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        287 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        288 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        289 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        290 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        291 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        292 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        293 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        294 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        295 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        296 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        297 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        298 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        299 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        300 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 111 passed, 119 total
Snapshots:   0 total
Time:        301 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        301 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        302 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        303 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        304 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        305 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        306 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        307 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        308 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        309 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        310 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        311 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        312 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        313 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        314 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        315 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        316 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        317 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        318 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        319 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        320 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        321 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        322 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        323 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        324 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        325 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        326 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        327 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        328 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        329 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        330 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        331 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        332 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        333 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        334 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        335 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        336 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        337 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        338 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        339 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        340 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        341 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        342 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        343 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        344 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        345 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        346 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        347 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        348 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        349 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        350 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        351 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        352 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        353 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        354 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        355 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        356 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        357 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        358 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        359 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        360 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 111 passed, 120 total
Snapshots:   0 total
Time:        361 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        361 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        362 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        363 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        364 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        365 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        366 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        367 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        368 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        369 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        370 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        371 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        372 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        373 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        374 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        375 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        376 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        377 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        378 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        379 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        380 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        381 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        382 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        383 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        384 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        385 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        386 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        387 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        388 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        389 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        390 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        391 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        392 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        393 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        394 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        395 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        396 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        397 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        398 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        399 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        400 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        401 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        402 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        403 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        404 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        405 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        406 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        407 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        408 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        409 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        410 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        411 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        412 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        413 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        414 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        415 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        416 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        417 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        418 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        419 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        420 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        421 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        422 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        423 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        424 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        425 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        426 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        427 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        428 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        429 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        430 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        431 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        432 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        433 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        434 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        435 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        436 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        437 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        438 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        439 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        440 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        441 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        442 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        443 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        444 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        445 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        446 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        447 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        448 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        449 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        450 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        451 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        452 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        453 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        454 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        455 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        456 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        457 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        458 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        459 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        460 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        461 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        462 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        463 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        464 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        465 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        466 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        467 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        468 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        469 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        470 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        471 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        472 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        473 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        474 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        475 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        476 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        477 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        478 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        479 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 111 passed, 121 total
Snapshots:   0 total
Time:        480 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        481 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        482 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        483 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        484 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        485 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        486 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        487 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        488 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        489 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        490 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        491 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        492 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        493 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        494 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        495 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        496 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        497 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        498 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        499 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        500 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        501 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        502 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        503 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        504 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        505 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        506 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        507 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        508 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        509 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        510 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        511 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        512 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        513 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        514 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        515 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        516 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        517 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        518 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        519 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        520 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        521 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        522 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        523 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        524 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        525 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        526 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        527 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        528 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        529 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        530 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        531 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        532 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        533 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        534 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        535 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        536 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        537 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        538 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        539 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        540 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        541 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        542 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        543 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        544 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        545 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        546 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        547 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        548 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        549 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        550 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        551 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        552 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        553 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        554 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        555 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        556 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        557 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        558 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        559 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        560 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        561 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        562 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        563 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        564 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        565 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        566 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        567 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        568 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        569 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        570 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        571 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        572 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        573 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        574 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        575 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        576 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        577 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        578 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        579 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        580 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        581 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        582 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        583 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        584 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        585 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        586 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        587 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        588 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        589 s, estimated 2116 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 111 passed, 122 total
Snapshots:   0 total
Time:        590 s, estimated 2116 s
████████████████████████████████████████

[Command timed out after 600000ms. The command may still be running in the background. Latest output shown above.]