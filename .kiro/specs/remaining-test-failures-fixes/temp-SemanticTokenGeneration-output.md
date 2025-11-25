3fn@Peters-MacBook-Pro DesignerPunk-v2 % npm run test:performance -- SemanticTokenGenera
tion.test.ts

> designer-punk-v2@1.0.0 test:performance
> jest --testPathPattern='performance/__tests__|__tests__/performance' SemanticTokenGeneration.test.ts

 PASS  src/__tests__/performance/OptimizationValidation.test.ts
 PASS  src/__tests__/performance/GenerationPerformance.test.ts
 PASS  src/release-analysis/performance/__tests__/DocumentParsingCache.test.ts
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

 PASS  src/release-analysis/performance/__tests__/GitPerformanceOptimizer.test.ts
 PASS  src/__tests__/integration/SemanticTokenGeneration.test.ts
 FAIL  src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts (23.806 s)
  ● Console

    console.log
      Large Repository Benchmark Results: {
        totalTime: '3181ms',
        averageTime: '1060.3333333333333ms',
        peakMemory: '221.8MB',
        throughput: '94.3 docs/sec',
        cacheEfficiency: '80.0%'
      }

      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:153:21)

    console.log
      Extra Large Repository Benchmark Results: {
        totalTime: '5548ms',
        peakMemory: '214.2MB',
        throughput: '90.1 docs/sec'
      }

      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:189:21)

    console.log
      Memory Leak Test Results: {
        initialMemory: '212.3MB',
        finalMemory: '217.7MB',
        growth: '5.4MB',
        iterations: 10
      }

      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:347:21)

    console.log
      Scalability Test Results: {
        scalingFactor: '1.03',
        optimalConcurrency: 4,
        performanceByDocCount: [
          {
            documents: 5,
            time: '51ms',
            throughput: '98.0 docs/sec',
            memory: '0.0MB'
          },
          {
            documents: 10,
            time: '102ms',
            throughput: '98.0 docs/sec',
            memory: '0.0MB'
          },
          {
            documents: 25,
            time: '252.99999999999997ms',
            throughput: '98.8 docs/sec',
            memory: '219.0MB'
          },
          {
            documents: 50,
            time: '509ms',
            throughput: '98.2 docs/sec',
            memory: '219.7MB'
          },
          {
            documents: 100,
            time: '1105ms',
            throughput: '90.5 docs/sec',
            memory: '219.8MB'
          }
        ]
      }

      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:373:21)

    console.log
      Storing baseline for medium repository: 512.3333333333334ms

      at storePerformanceBaseline (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:859:17)

    console.log
      Stored new performance baseline: 512.3333333333334ms

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

  ● Performance Benchmarks › Extraction Speed Benchmarks › should achieve target extraction speed with caching

    expect(received).toBeGreaterThan(expected)

    Expected: > 2
    Received:   1.105058365758755

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
    Received:   1.0147420147420148

      247 |             // Parallel should be faster (accounting for overhead)
      248 |             const parallelEfficiency = sequentialResult.totalTime / parallelResult.totalTime;
    > 249 |             expect(parallelEfficiency).toBeGreaterThan(1.5); // At least 1.5x speedup
          |                                        ^
      250 |
      251 |             // Verify parallel efficiency is reasonable (not perfect due to overhead)
      252 |             expect(parallelResult.parallelEfficiency).toBeGreaterThan(0.6); // 60% efficiency

      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:249:40)

  ● Performance Benchmarks › Memory Usage Benchmarks › should maintain reasonable memory usage under load

    expect(received).toBeLessThan(expected)

    Expected: < 2
    Received:   Infinity

      297 |
      298 |             // Memory growth should be reasonable (not exponential)
    > 299 |             expect(memoryGrowthRate).toBeLessThan(2.0); // Less than quadratic growth
          |                                      ^
      300 |
      301 |             console.log('Memory Usage Benchmark Results:', {
      302 |                 results: memoryResults.map(r => ({

      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:299:38)

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
    Received:   -52.38095238095239

      485 |             // Optimizations should provide measurable improvement
      486 |             const improvement = (unoptimizedResult.averageTime - optimizedResult.averageTime) / unoptimizedResult.averageTime * 100;
    > 487 |             expect(improvement).toBeGreaterThan(10); // At least 10% improvement
          |                                 ^
      488 |
      489 |             console.log('Optimization Impact Results:', {
      490 |                 unoptimized: {

      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceBenchmarks.test.ts:487:33)

 FAIL  src/release-analysis/performance/__tests__/PerformanceRegression.test.ts (1681.272 s)
  ● Performance Regression Tests › Performance Target Validation › should meet performance targets for small-repository-regression

    thrown: "Exceeded timeout of 60000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      110 |      * Requirement: Validate performance targets are maintained
      111 |      */
    > 112 |     test.each(REGRESSION_TESTS)(
          |                                ^
      113 |       'should meet performance targets for $name',
      114 |       async (config) => {
      115 |         const testConfig = {

      at node_modules/jest-each/build/bind.js:47:15
          at Array.forEach (<anonymous>)
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:112:32
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:107:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Performance Target Validation › should meet performance targets for medium-repository-regression

    thrown: "Exceeded timeout of 60000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      110 |      * Requirement: Validate performance targets are maintained
      111 |      */
    > 112 |     test.each(REGRESSION_TESTS)(
          |                                ^
      113 |       'should meet performance targets for $name',
      114 |       async (config) => {
      115 |         const testConfig = {

      at node_modules/jest-each/build/bind.js:47:15
          at Array.forEach (<anonymous>)
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:112:32
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:107:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Performance Target Validation › should meet performance targets for large-repository-regression

    thrown: "Exceeded timeout of 60000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      110 |      * Requirement: Validate performance targets are maintained
      111 |      */
    > 112 |     test.each(REGRESSION_TESTS)(
          |                                ^
      113 |       'should meet performance targets for $name',
      114 |       async (config) => {
      115 |         const testConfig = {

      at node_modules/jest-each/build/bind.js:47:15
          at Array.forEach (<anonymous>)
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:112:32
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:107:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Regression Detection › should not regress from baseline for small-repository-regression

    thrown: "Exceeded timeout of 60000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      152 |      * Requirement: Detect performance degradation in CI/CD pipeline
      153 |      */
    > 154 |     test.each(REGRESSION_TESTS)(
          |                                ^
      155 |       'should not regress from baseline for $name',
      156 |       async (config) => {
      157 |         const testConfig = {

      at node_modules/jest-each/build/bind.js:47:15
          at Array.forEach (<anonymous>)
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:154:32
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:149:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Regression Detection › should not regress from baseline for medium-repository-regression

    thrown: "Exceeded timeout of 60000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      152 |      * Requirement: Detect performance degradation in CI/CD pipeline
      153 |      */
    > 154 |     test.each(REGRESSION_TESTS)(
          |                                ^
      155 |       'should not regress from baseline for $name',
      156 |       async (config) => {
      157 |         const testConfig = {

      at node_modules/jest-each/build/bind.js:47:15
          at Array.forEach (<anonymous>)
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:154:32
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:149:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Regression Detection › should not regress from baseline for large-repository-regression

    thrown: "Exceeded timeout of 60000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      152 |      * Requirement: Detect performance degradation in CI/CD pipeline
      153 |      */
    > 154 |     test.each(REGRESSION_TESTS)(
          |                                ^
      155 |       'should not regress from baseline for $name',
      156 |       async (config) => {
      157 |         const testConfig = {

      at node_modules/jest-each/build/bind.js:47:15
          at Array.forEach (<anonymous>)
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:154:32
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:149:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Optimization Impact Validation › should show significant improvement with optimizations enabled

    thrown: "Exceeded timeout of 120000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      195 |      * Requirement: Validate performance optimizations effectiveness
      196 |      */
    > 197 |     it('should show significant improvement with optimizations enabled', async () => {
          |     ^
      198 |       const baseConfig = {
      199 |         name: 'optimization-comparison',
      200 |         description: 'Compare optimized vs unoptimized performance',

      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:197:5
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:192:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Optimization Impact Validation › should demonstrate effective caching performance

    thrown: "Exceeded timeout of 120000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      235 |      * Requirement: Validate caching optimizations
      236 |      */
    > 237 |     it('should demonstrate effective caching performance', async () => {
          |     ^
      238 |       const cacheConfig = {
      239 |         name: 'cache-effectiveness',
      240 |         description: 'Test cache performance impact',

      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:237:5
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:192:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Optimization Impact Validation › should achieve reasonable parallel processing efficiency

    thrown: "Exceeded timeout of 180000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      272 |      * Requirement: Validate parallel processing optimizations
      273 |      */
    > 274 |     it('should achieve reasonable parallel processing efficiency', async () => {
          |     ^
      275 |       const parallelConfig = {
      276 |         name: 'parallel-efficiency',
      277 |         description: 'Test parallel processing efficiency',

      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:274:5
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:192:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Scalability Validation › should scale reasonably with increasing document count

    thrown: "Exceeded timeout of 240000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      331 |      * Requirement: Ensure scalability characteristics remain stable
      332 |      */
    > 333 |     it('should scale reasonably with increasing document count', async () => {
          |     ^
      334 |       const documentCounts = [10, 25, 50];
      335 |       const scalabilityResults: Array<{ count: number; time: number; throughput: number }> = [];
      336 |

      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:333:5
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:328:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Scalability Validation › should maintain reasonable memory usage at scale

    thrown: "Exceeded timeout of 300000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      385 |      * Requirement: Validate memory usage remains reasonable with scale
      386 |      */
    > 387 |     it('should maintain reasonable memory usage at scale', async () => {
          |     ^
      388 |       const documentCounts = [20, 50, 100];
      389 |       const memoryResults: Array<{ count: number; peakMemoryMB: number; memoryPerDoc: number }> = [];
      390 |

      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:387:5
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:328:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

  ● Performance Regression Tests › Stress Testing › should handle stress conditions gracefully

    thrown: "Exceeded timeout of 360000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      439 |      * Requirement: Validate system stability under load
      440 |      */
    > 441 |     it('should handle stress conditions gracefully', async () => {
          |     ^
      442 |       const stressConfig = {
      443 |         name: 'stress-test',
      444 |         description: 'High-load stress test',

      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:441:5
      at src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:436:3
      at Object.<anonymous> (src/release-analysis/performance/__tests__/PerformanceRegression.test.ts:32:1)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 2 failed, 5 passed, 7 total
Tests:       17 failed, 97 passed, 114 total
Snapshots:   0 total
Time:        1682.044 s, estimated 3875 s
Ran all test suites matching /performance\/__tests__|__tests__\/performance|SemanticTokenGeneration.test.ts/i.