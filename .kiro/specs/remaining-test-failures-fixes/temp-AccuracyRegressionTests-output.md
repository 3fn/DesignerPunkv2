> designer-punk-v2@1.0.0 test:performance
> jest --testPathPattern='performance/__tests__|__tests__/performance' AccuracyRegressionTests
Determining test suites to run...
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        0 s, estimated 3304 s
████████████████████████████████████████












 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        0 s, estimated 3304 s
████████████████████████████████████████


























 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 3304 s
████████████████████████████████████████

























 PASS  src/__tests__/performance/OptimizationValidation.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 3304 s
████████████████████████████████████████


























 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 3304 s
████████████████████████████████████████

























 PASS  src/release-analysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 3304 s
████████████████████████████████████████

























 PASS  src/release-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 3304 s
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
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 3304 s
████████████████████████████████████████

























 PASS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
 RUNS  src/__tests__/performance/GenerationPerformance.test.ts
 RUNS  ...-analysis/performance/__tests__/DocumentParsingCache.test.ts
 RUNS  ...alysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 RUNS  src/__tests__/performance/OptimizationValidation.test.ts
Test Suites: 0 of 7 total
Tests:       0 total
Snapshots:   0 total
Time:        1 s, estimated 3304 s
████████████████████████████████████████


























 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       73 passed, 73 total
Snapshots:   0 total
Time:        1 s, estimated 3304 s
████████████████████████████████████████


















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       73 passed, 73 total
Snapshots:   0 total
Time:        2 s, estimated 3304 s
████████████████████████████████████████


















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       80 passed, 80 total
Snapshots:   0 total
Time:        2 s, estimated 3304 s
████████████████████████████████████████


















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       82 passed, 82 total
Snapshots:   0 total
Time:        2 s, estimated 3304 s
████████████████████████████████████████


















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       84 passed, 84 total
Snapshots:   0 total
Time:        2 s, estimated 3304 s
████████████████████████████████████████


















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       87 passed, 87 total
Snapshots:   0 total
Time:        2 s, estimated 3304 s
████████████████████████████████████████


















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       88 passed, 88 total
Snapshots:   0 total
Time:        2 s, estimated 3304 s
████████████████████████████████████████


















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       92 passed, 92 total
Snapshots:   0 total
Time:        3 s, estimated 3304 s
████████████████████████████████████████

















 PASS  src/release-analysis/validation/__tests__/AccuracyRegressionTests.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
 RUNS  ...nalysis/validation/__tests__/AccuracyRegressionTests.test.ts
Test Suites: 4 passed, 4 of 7 total
Tests:       92 passed, 92 total
Snapshots:   0 total
Time:        3 s, estimated 3304 s
████████████████████████████████████████


















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       93 passed, 93 total
Snapshots:   0 total
Time:        3 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       93 passed, 93 total
Snapshots:   0 total
Time:        4 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       93 passed, 93 total
Snapshots:   0 total
Time:        5 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       94 passed, 94 total
Snapshots:   0 total
Time:        5 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       94 passed, 94 total
Snapshots:   0 total
Time:        6 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       94 passed, 94 total
Snapshots:   0 total
Time:        7 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       94 passed, 94 total
Snapshots:   0 total
Time:        8 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       94 passed, 94 total
Snapshots:   0 total
Time:        9 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       94 passed, 94 total
Snapshots:   0 total
Time:        10 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       94 passed, 94 total
Snapshots:   0 total
Time:        11 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       95 passed, 95 total
Snapshots:   0 total
Time:        11 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       95 passed, 95 total
Snapshots:   0 total
Time:        12 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       1 failed, 95 passed, 96 total
Snapshots:   0 total
Time:        12 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       1 failed, 95 passed, 96 total
Snapshots:   0 total
Time:        13 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 95 passed, 97 total
Snapshots:   0 total
Time:        13 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 95 passed, 97 total
Snapshots:   0 total
Time:        14 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 95 passed, 97 total
Snapshots:   0 total
Time:        15 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 96 passed, 98 total
Snapshots:   0 total
Time:        16 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 96 passed, 98 total
Snapshots:   0 total
Time:        17 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 96 passed, 98 total
Snapshots:   0 total
Time:        18 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 97 passed, 99 total
Snapshots:   0 total
Time:        18 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 97 passed, 99 total
Snapshots:   0 total
Time:        19 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 97 passed, 99 total
Snapshots:   0 total
Time:        20 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 97 passed, 99 total
Snapshots:   0 total
Time:        21 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 97 passed, 99 total
Snapshots:   0 total
Time:        22 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 98 passed, 100 total
Snapshots:   0 total
Time:        23 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 98 passed, 100 total
Snapshots:   0 total
Time:        24 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       2 failed, 98 passed, 100 total
Snapshots:   0 total
Time:        25 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       3 failed, 98 passed, 101 total
Snapshots:   0 total
Time:        25 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       3 failed, 98 passed, 101 total
Snapshots:   0 total
Time:        26 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       3 failed, 99 passed, 102 total
Snapshots:   0 total
Time:        27 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        27 s, estimated 3304 s
████████████████████████████████████████















 FAIL  src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts (27.04 s)
 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
 RUNS  ...analysis/performance/__tests__/PerformanceBenchmarks.test.ts
Test Suites: 5 passed, 5 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        27 s, estimated 3304 s
████████████████████████████████████████















  ● Console
    console.log
      Large Repository Benchmark Results: {
        totalTime: '3766ms',
        averageTime: '1255.3333333333333ms',
        peakMemory: '224.1MB',
        throughput: '79.7 docs/sec',
        cacheEfficiency: '80.0%'
      }
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:153:21)
    console.log
      Extra Large Repository Benchmark Results: {
        totalTime: '6140ms',
        peakMemory: '215.0MB',
        throughput: '81.4 docs/sec'
      }
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:189:21)
    console.log
      Memory Usage Benchmark Results: {
        results: [
          { documents: 10, peakMemory: '218.3MB', avgMemory: '218.3MB' },
          { documents: 25, peakMemory: '218.1MB', avgMemory: '217.7MB' },
          { documents: 50, peakMemory: '221.3MB', avgMemory: '219.8MB' },
          { documents: 100, peakMemory: '223.3MB', avgMemory: '221.3MB' }
        ],
        growthRate: '0.01'
      }
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:301:21)
    console.log
      Memory Leak Test Results: {
        initialMemory: '223.2MB',
        finalMemory: '223.6MB',
        growth: '0.4MB',
        iterations: 10
      }
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:347:21)
    console.log
      Scalability Test Results: {
        scalingFactor: '1.01',
        optimalConcurrency: 4,
        performanceByDocCount: [
          {
            documents: 5,
            time: '59ms',
            throughput: '84.7 docs/sec',
            memory: '0.0MB'
          },
          {
            documents: 10,
            time: '140ms',
            throughput: '71.4 docs/sec',
            memory: '226.3MB'
          },
          {
            documents: 25,
            time: '311ms',
            throughput: '80.4 docs/sec',
            memory: '209.1MB'
          },
          {
            documents: 50,
            time: '584ms',
            throughput: '85.6 docs/sec',
            memory: '218.1MB'
          },
          {
            documents: 100,
            time: '1185ms',
            throughput: '84.4 docs/sec',
            memory: '218.8MB'
          }
        ]
      }
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:373:21)
    console.log
      Storing baseline for medium repository: 605.3333333333334ms
      at storePerformanceBaseline (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:859:17)
    console.log
      Stored new performance baseline: 605.3333333333334ms
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
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        27 s, estimated 3304 s
████████████████████████████████████████















  ● Performance Benchmarks › Extraction Speed Benchmarks › should achieve target extraction speed with caching
    expect(received).toBeGreaterThan(expected)
    Expected: > 2
    Received:   1.018363939899833
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
    Received:   1.0084033613445378
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
    Received:   -72.72727272727273
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
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        27 s, estimated 3304 s
████████████████████████████████████████
















 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        27 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        28 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        29 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        30 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        31 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        32 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        33 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        34 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        35 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        36 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        37 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        38 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        39 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        40 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        41 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        42 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        43 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        44 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        45 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        46 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        47 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        48 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        49 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        50 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        51 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        52 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        53 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        54 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        55 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        56 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        57 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        58 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        59 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        60 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       4 failed, 99 passed, 103 total
Snapshots:   0 total
Time:        61 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        61 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        62 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        63 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        64 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        65 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        66 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        67 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        68 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        69 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        70 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        71 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        72 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        73 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        74 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        75 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        76 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        77 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        78 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        79 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        80 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        81 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        82 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        83 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        84 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        85 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        86 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        87 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        88 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        89 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        90 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        91 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        92 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        93 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        94 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        95 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        96 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        97 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        98 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        99 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        100 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        101 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        102 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        103 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        104 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        105 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        106 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        107 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        108 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        109 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        110 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        111 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        112 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        113 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        114 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        115 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        116 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        117 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        118 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        119 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       5 failed, 99 passed, 104 total
Snapshots:   0 total
Time:        276 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        276 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        277 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        278 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        279 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        280 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        281 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        282 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        283 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        284 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        285 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        286 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        287 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        288 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        289 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        290 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        291 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        292 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        293 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        294 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        295 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        296 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        297 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        298 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        299 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        300 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        301 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        302 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        303 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        304 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        305 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        306 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        307 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        308 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        309 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        310 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        311 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        312 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        313 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        314 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        315 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        316 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        317 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        318 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        319 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        320 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        321 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        322 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        323 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        324 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        325 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        326 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        327 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        328 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        329 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        330 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        331 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        332 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        333 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        334 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       6 failed, 99 passed, 105 total
Snapshots:   0 total
Time:        335 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        336 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        337 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        338 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        339 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        340 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        341 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        342 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        343 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        344 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        345 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        346 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        347 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        348 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        349 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        350 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        351 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        352 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        353 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        354 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        355 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        356 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        357 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        358 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        359 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        360 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        361 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        362 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        363 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        364 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        365 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        366 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        367 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        368 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        369 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        370 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        371 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        372 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        373 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        374 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        375 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        376 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        377 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        378 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        379 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        380 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        381 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        382 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        383 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        384 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        385 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        386 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        387 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        388 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        389 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        390 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        391 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        392 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        393 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        394 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       7 failed, 99 passed, 106 total
Snapshots:   0 total
Time:        395 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        396 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        396 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        397 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        398 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        399 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        400 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        401 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        402 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        403 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        404 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        405 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        406 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        407 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        408 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        409 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        410 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        411 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        412 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        413 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        414 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       8 failed, 99 passed, 107 total
Snapshots:   0 total
Time:        415 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        550 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        551 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        552 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        553 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        554 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        555 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        556 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        557 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        558 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        559 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        560 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        561 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        562 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        563 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        564 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        565 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        566 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        567 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        568 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        569 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        570 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        571 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        572 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        573 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        574 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        575 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        576 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        577 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        578 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        579 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        580 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        581 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        582 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        583 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        584 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        585 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        586 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        587 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        588 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        589 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        590 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        591 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        592 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        593 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        594 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        595 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       9 failed, 99 passed, 108 total
Snapshots:   0 total
Time:        596 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        795 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        796 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        797 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        798 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        799 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        800 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        801 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        802 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        803 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        804 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        805 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        806 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        807 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        808 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        809 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        810 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        811 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        812 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        813 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        814 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        815 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        816 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        817 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        818 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        819 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        820 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        821 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        822 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        823 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        824 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        825 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        826 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        827 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        828 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        829 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        830 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        831 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        832 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        833 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        834 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        835 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        836 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        837 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        838 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        839 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        840 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        841 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        842 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        843 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        844 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        845 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        846 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        847 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        848 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        849 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        850 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        851 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        852 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        853 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        854 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        855 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        856 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        857 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        858 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        859 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        860 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        861 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        862 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        863 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        864 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        865 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        866 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        867 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        868 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        869 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        870 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        871 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        872 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        873 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        874 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        875 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        876 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        877 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        878 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        879 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        880 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        881 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        882 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        883 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        884 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        885 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        886 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        887 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        888 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        889 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        890 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        891 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        892 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        893 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        894 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        895 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        896 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        897 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        898 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        899 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        900 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        901 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        902 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        903 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        904 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        905 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        906 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        907 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        908 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        909 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        910 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        911 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        912 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        913 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       10 failed, 99 passed, 109 total
Snapshots:   0 total
Time:        914 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        915 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        915 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        916 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        917 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        918 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        919 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        920 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        921 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        922 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        923 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        924 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        925 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        926 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        927 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        928 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        929 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        930 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        931 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        932 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        933 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        934 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        935 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        936 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        937 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        938 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        939 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        940 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        941 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        942 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        943 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        944 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        945 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        946 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        947 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        948 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        949 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        950 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        951 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        952 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        953 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        954 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        955 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        956 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        957 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        958 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        959 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        960 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        961 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        962 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        963 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        964 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        965 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        966 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        967 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        968 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        969 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        970 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        971 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        972 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        973 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        974 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        975 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        976 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        977 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        978 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        979 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        980 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        981 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        982 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        983 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        984 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        985 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        986 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        987 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        988 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        989 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        990 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        991 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        992 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        993 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        994 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        995 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        996 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        997 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        998 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        999 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1000 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1001 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1002 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1003 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1004 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1005 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1006 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1007 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1008 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1009 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1010 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1011 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1012 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1013 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1014 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1015 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1016 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1017 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1018 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1019 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1020 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1021 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1022 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1023 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1024 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1025 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1026 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1027 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1028 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1029 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1030 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1031 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1032 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1033 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       11 failed, 99 passed, 110 total
Snapshots:   0 total
Time:        1034 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1035 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1035 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1036 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1037 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1038 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1039 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1040 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1041 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1042 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1043 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1044 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1045 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1046 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1047 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1048 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1049 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1050 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1051 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1052 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1053 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1054 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1055 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1056 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1057 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1058 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1059 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1060 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1061 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1062 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1063 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1064 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1065 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1066 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1067 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1068 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1069 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1070 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1071 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1072 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1073 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1074 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1075 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1076 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1077 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1078 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1079 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1080 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1081 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1082 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1083 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1084 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1085 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1086 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1087 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1088 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1089 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1090 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1091 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1092 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1093 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1094 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1095 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1096 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1097 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1098 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1099 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1100 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1101 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1102 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1103 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1104 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1105 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1106 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1107 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1108 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1109 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1110 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1111 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1112 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1113 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1114 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1115 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1116 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1117 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1118 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1119 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1120 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1121 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1122 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1123 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1124 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1125 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1126 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1127 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1128 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1129 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1130 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1131 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1132 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1133 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1134 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1135 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1136 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1137 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1138 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1139 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1140 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1141 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1142 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1143 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1144 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1145 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1146 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1147 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1148 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1149 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1150 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1151 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1152 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1153 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1154 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1155 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1156 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1157 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1158 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1159 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1160 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1161 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1162 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1163 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1164 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1165 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1166 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1167 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1168 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1169 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1170 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1171 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1172 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1173 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1174 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1175 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1176 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1177 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1178 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1179 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1180 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1181 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1182 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1183 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1184 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1185 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1186 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1187 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1188 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1189 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1190 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1191 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1192 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1193 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1194 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1195 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1196 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1197 s, estimated 3304 s
████████████████████████████████████████














 RUNS  ...analysis/performance/__tests__/PerformanceRegression.test.ts
Test Suites: 1 failed, 5 passed, 6 of 7 total
Tests:       12 failed, 99 passed, 111 total
Snapshots:   0 total
Time:        1198 s, estimated 3304 s
████████████████████████████████████████

[Command timed out after 1200000ms. The command may still be running in the background. Latest output shown above.]