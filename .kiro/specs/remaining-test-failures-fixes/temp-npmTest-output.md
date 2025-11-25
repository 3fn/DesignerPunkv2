          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at ErrorHandler.recover (src/build/errors/ErrorHandler.ts:130:27)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:184:41)

    console.error
      Suggestions:

      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {
    > 373 |         console.error('Suggestions:');
          |                 ^
      374 |         error.suggestions.slice(0, 3).forEach(suggestion => console.error(`  • ${suggestion}`));
      375 |         if (error.suggestions.length > 3) {
      376 |           console.error(`  ... and ${error.suggestions.length - 3} more (use --verbose for details)`);

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:373:17)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at ErrorHandler.recover (src/build/errors/ErrorHandler.ts:130:27)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:184:41)

    console.error
        • Verify the token name is correct

      372 |       if (error.suggestions.length > 0) {
      373 |         console.error('Suggestions:');
    > 374 |         error.suggestions.slice(0, 3).forEach(suggestion => console.error(`  • ${suggestion}`));
          |                                                                     ^
      375 |         if (error.suggestions.length > 3) {
      376 |           console.error(`  ... and ${error.suggestions.length - 3} more (use --verbose for details)`);
      377 |         }

      at src/build/errors/ErrorHandler.ts:374:69
          at Array.forEach (<anonymous>)
      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:374:39)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at ErrorHandler.recover (src/build/errors/ErrorHandler.ts:130:27)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:184:41)

    console.error
        • Check that the token exists in F1 token system

      372 |       if (error.suggestions.length > 0) {
      373 |         console.error('Suggestions:');
    > 374 |         error.suggestions.slice(0, 3).forEach(suggestion => console.error(`  • ${suggestion}`));
          |                                                                     ^
      375 |         if (error.suggestions.length > 3) {
      376 |           console.error(`  ... and ${error.suggestions.length - 3} more (use --verbose for details)`);
      377 |         }

      at src/build/errors/ErrorHandler.ts:374:69
          at Array.forEach (<anonymous>)
      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:374:39)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at ErrorHandler.recover (src/build/errors/ErrorHandler.ts:130:27)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:184:41)

    console.error
        • Ensure token is properly registered in primitive or semantic registry

      372 |       if (error.suggestions.length > 0) {
      373 |         console.error('Suggestions:');
    > 374 |         error.suggestions.slice(0, 3).forEach(suggestion => console.error(`  • ${suggestion}`));
          |                                                                     ^
      375 |         if (error.suggestions.length > 3) {
      376 |           console.error(`  ... and ${error.suggestions.length - 3} more (use --verbose for details)`);
      377 |         }

      at src/build/errors/ErrorHandler.ts:374:69
          at Array.forEach (<anonymous>)
      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:374:39)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at ErrorHandler.recover (src/build/errors/ErrorHandler.ts:130:27)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:184:41)

    console.error
        ... and 2 more (use --verbose for details)

      374 |         error.suggestions.slice(0, 3).forEach(suggestion => console.error(`  • ${suggestion}`));
      375 |         if (error.suggestions.length > 3) {
    > 376 |           console.error(`  ... and ${error.suggestions.length - 3} more (use --verbose for details)`);
          |                   ^
      377 |         }
      378 |       }
      379 |     }

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:376:19)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at ErrorHandler.recover (src/build/errors/ErrorHandler.ts:130:27)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:184:41)

    console.error
      [ERROR] [build] TEST_ERROR: Test error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:270:20)

    console.error
      [ERROR] [build] ERROR_1: First error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:292:20)

    console.error
      [WARNING] [token] ERROR_2: Second error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:293:20)

    console.error
      [ERROR] [build] TEST_ERROR: Test error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:307:20)

    console.error
      [ERROR] [config] CONFIG_ERROR: Config error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:317:20)

    console.error
      [ERROR] [build] [ios] BUILD_ERROR: Build error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:324:20)

    console.error
      [WARNING] [token] [android] TOKEN_WARNING: Token warning

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:332:20)

    console.error
      [ERROR] [config] CONFIG_ERROR: Config error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:317:20)

    console.error
      [ERROR] [build] [ios] BUILD_ERROR: Build error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:324:20)

    console.error
      [WARNING] [token] [android] TOKEN_WARNING: Token warning

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:332:20)

    console.error
      [ERROR] [config] CONFIG_ERROR: Config error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:317:20)

    console.error
      [ERROR] [build] [ios] BUILD_ERROR: Build error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:324:20)

    console.error
      [WARNING] [token] [android] TOKEN_WARNING: Token warning

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:332:20)

    console.error
      [ERROR] [build] CRITICAL_ERROR: Critical error

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:381:20)

    console.error
      [WARNING] [build] WARNING: Warning

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:392:20)

    console.error
      [ERROR] [build] [ios] BUILD_ERROR: iOS build failed

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:471:32)

    console.error
      [ERROR] [build] [ios] BUILD_ERROR: iOS build failed

      367 |       const componentInfo = error.component ? ` [${error.component}]` : '';
      368 |       
    > 369 |       console.error(`${prefix}${platformInfo}${componentInfo} ${error.code}: ${error.message}`);
          |               ^
      370 |       
      371 |       // Show top 3 suggestions even in non-verbose mode
      372 |       if (error.suggestions.length > 0) {

      at ErrorHandler.defaultLogger (src/build/errors/ErrorHandler.ts:369:15)
      at ErrorHandler.logError (src/build/errors/ErrorHandler.ts:356:18)
      at ErrorHandler.handleError (src/build/errors/ErrorHandler.ts:110:10)
      at Object.<anonymous> (src/build/errors/__tests__/ErrorHandler.test.ts:488:32)

 PASS  src/build/orchestration/__tests__/SequentialExecutor.integration.test.ts
 PASS  src/build/errors/__tests__/RecoveryStrategy.test.ts (6.951 s)
 PASS  src/release-analysis/cli/__tests__/ReleaseCLI.test.ts (13.78 s)
  ● Console

    console.log
      🔍 Starting release analysis...

      at ReleaseCLI.analyzeChanges (src/release-analysis/cli/ReleaseCLI.ts:50:13)

    console.log
      📋 Loading configuration...

      at src/release-analysis/cli/ReleaseCLI.ts:66:15

    console.log
      🔧 Initializing Git analysis...

      at src/release-analysis/cli/ReleaseCLI.ts:80:15

    console.log
      🎯 Determining analysis scope...

      at src/release-analysis/cli/ReleaseCLI.ts:84:15

    console.log
      📍 No previous release found, analyzing all documents

      at src/release-analysis/cli/ReleaseCLI.ts:138:19

    console.log
      📄 Found 565 completion documents

      at src/release-analysis/cli/ReleaseCLI.ts:148:15

    console.log
      🔍 Extracting changes...

      at src/release-analysis/cli/ReleaseCLI.ts:151:15

    console.log
      🏷️  Calculating version recommendation...

      at src/release-analysis/cli/ReleaseCLI.ts:192:15

    console.log
      📝 Generating release notes...

      at src/release-analysis/cli/ReleaseCLI.ts:213:15

    console.log
      ✅ Analysis complete!

      at ReleaseCLI.analyzeChanges (src/release-analysis/cli/ReleaseCLI.ts:250:15)

    console.log
      🔍 Starting release analysis...

      at ReleaseCLI.analyzeChanges (src/release-analysis/cli/ReleaseCLI.ts:50:13)

    console.log
      📋 Loading configuration...

      at src/release-analysis/cli/ReleaseCLI.ts:66:15

    console.log
      🔧 Initializing Git analysis...

      at src/release-analysis/cli/ReleaseCLI.ts:80:15

    console.log
      🎯 Determining analysis scope...

      at src/release-analysis/cli/ReleaseCLI.ts:84:15

    console.log
      📄 Found 0 completion documents

      at src/release-analysis/cli/ReleaseCLI.ts:148:15

    console.log
      🔍 Extracting changes...

      at src/release-analysis/cli/ReleaseCLI.ts:151:15

    console.log
      🏷️  Calculating version recommendation...

      at src/release-analysis/cli/ReleaseCLI.ts:192:15

    console.log
      📝 Generating release notes...

      at src/release-analysis/cli/ReleaseCLI.ts:213:15

    console.log
      ✅ Analysis complete!

      at ReleaseCLI.analyzeChanges (src/release-analysis/cli/ReleaseCLI.ts:250:15)


Summary of all failing tests
 FAIL  src/__tests__/integration/TokenSystemIntegration.test.ts
  ● Token System Integration › Error Handling › should handle duplicate token registration

    expect(received).toContain(expected) // indexOf

    Expected substring: "already exists"
    Received string:    "Token space100 is already registered. Use allowOverwrite option to replace."

      603 |
      604 |       expect(result.level).toBe('Error');
    > 605 |       expect(result.message).toContain('already exists');
          |                              ^
      606 |     });
      607 |
      608 |     it('should handle invalid state import', () => {

      at Object.<anonymous> (src/__tests__/integration/TokenSystemIntegration.test.ts:605:30)

 FAIL  src/release/detection/__tests__/WorkflowMonitor.test.ts
  ● WorkflowMonitor › Event Detection › should detect task completion events

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      78 |       const events = await monitor.checkForCompletionEvents();
      79 |
    > 80 |       expect(events).toHaveLength(1);
         |                      ^
      81 |       expect(events[0].type).toBe('task-completion');
      82 |       expect(events[0].source).toContain('task-1-completion.md');
      83 |     });

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:80:22)

  ● WorkflowMonitor › Event Detection › should detect spec completion events

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

       95 |       const events = await monitor.checkForCompletionEvents();
       96 |
    >  97 |       expect(events).toHaveLength(1);
          |                      ^
       98 |       expect(events[0].type).toBe('spec-completion');
       99 |       expect(events[0].source).toContain('spec-completion-summary.md');
      100 |     });

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:97:22)

  ● WorkflowMonitor › Event Detection › should detect file changes in tasks.md

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      119 |       const events = await monitor.checkForCompletionEvents();
      120 |
    > 121 |       expect(events.some(e => e.type === 'file-change' && e.source.includes('tasks.md'))).toBe(true);
          |                                                                                           ^
      122 |     });
      123 |   });
      124 |

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:121:91)

  ● WorkflowMonitor › Event Queue Management › should queue events and process them in order

    expect(received).toHaveLength(expected)

    Expected length: 3
    Received length: 2
    Received array:  [{"metadata": {}, "source": "test-source-1", "timestamp": 2025-11-24T18:45:33.935Z, "type": "task-completion"}, {"metadata": {}, "source": "test-source-2", "timestamp": 2025-11-24T18:45:33.935Z, "type": "spec-completion"}]

      152 |       await Promise.resolve();
      153 |
    > 154 |       expect(processedEvents).toHaveLength(3);
          |                               ^
      155 |       expect(processedEvents[0].source).toBe('test-source-1');
      156 |       expect(processedEvents[1].source).toBe('test-source-2');
      157 |       expect(processedEvents[2].source).toBe('test-source-3');

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:154:31)

  ● WorkflowMonitor › Event Queue Management › should clear queue when requested

    expect(received).toBe(expected) // Object.is equality

    Expected: 1
    Received: 0

      186 |       
      187 |       let queueStatus = monitor.getQueueStatus();
    > 188 |       expect(queueStatus.queueLength).toBe(1);
          |                                       ^
      189 |
      190 |       monitor.clearQueue();
      191 |

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:188:39)

  ● WorkflowMonitor › Hook Integration › should detect git commit events for task completion

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      223 |         e.metadata.taskNumber === '1.1' &&
      224 |         e.metadata.commitHash === commitHash
    > 225 |       )).toBe(true);
          |          ^
      226 |     });
      227 |
      228 |     it('should process trigger files from hook system', async () => {

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:225:10)

  ● WorkflowMonitor › Hook Integration › should process trigger files from hook system

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      256 |         e.type === 'task-completion' && 
      257 |         e.metadata.taskName === '1.1 Test task'
    > 258 |       )).toBe(true);
          |          ^
      259 |     });
      260 |
      261 |     it('should monitor file organization events', async () => {

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:258:10)

  ● WorkflowMonitor › Hook Integration › should monitor file organization events

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      287 |         e.type === 'file-change' && 
      288 |         e.metadata.logEntry?.includes('completion.md')
    > 289 |       )).toBe(true);
          |          ^
      290 |     });
      291 |   });
      292 |

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:289:10)

  ● WorkflowMonitor › Event Processing › should process task completion events

    expect(received).toBe(expected) // Object.is equality

    Expected: "Implement validation system"
    Received: "Main Task"

      319 |
      320 |       expect(emittedEvents).toHaveLength(1);
    > 321 |       expect(emittedEvents[0].taskName).toBe('Implement validation system');
          |                                         ^
      322 |       expect(emittedEvents[0].taskNumber).toBe('1');
      323 |     });
      324 |

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:321:41)

  ● WorkflowMonitor › Event Processing › should process file change events for tasks.md

    expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 0
    Received array:  []

      368 |       await monitor.processWorkflowEvent(event);
      369 |
    > 370 |       expect(emittedEvents).toHaveLength(2);
          |                             ^
      371 |       expect(emittedEvents[0].taskName).toBe('Completed Task');
      372 |       expect(emittedEvents[0].status).toBe('completed');
      373 |       expect(emittedEvents[1].taskName).toBe('Another Completed Task');

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:370:29)

  ● WorkflowMonitor › Monitoring Lifecycle › should emit monitoring events

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Array [
        "started",
    -   "stopped",
      ]

      436 |       await monitor.stopMonitoring();
      437 |
    > 438 |       expect(events).toEqual(['started', 'stopped']);
          |                      ^
      439 |     });
      440 |   });
      441 |

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:438:22)

  ● WorkflowMonitor › Path Expansion and Matching › should expand glob paths correctly

    expect(received).toContain(expected) // indexOf

    Expected value: ".kiro/specs/test-spec/completion/task-1-completion.md"
    Received array: [".kiro/specs/another-spec/completion/task-1-completion.md"]

      464 |       const expandedPaths = await (monitor as any).expandGlobPath(globPath);
      465 |
    > 466 |       expect(expandedPaths).toContain('.kiro/specs/test-spec/completion/task-1-completion.md');
          |                             ^
      467 |       expect(expandedPaths).toContain('.kiro/specs/another-spec/completion/spec-completion-summary.md');
      468 |     });
      469 |

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:466:29)

  ● WorkflowMonitor › Path Expansion and Matching › should match glob patterns correctly

    TypeError: Cannot read properties of undefined (reading 'bind')

      469 |
      470 |     it('should match glob patterns correctly', async () => {
    > 471 |       const matchesPattern = (monitor as any).matchesPattern.bind(monitor);
          |                                                              ^
      472 |
      473 |       expect(matchesPattern('task-1-completion.md', '*-completion.md')).toBe(true);
      474 |       expect(matchesPattern('spec-completion-summary.md', '*-completion*.md')).toBe(true);

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:471:62)

  ● WorkflowMonitor › Error Handling › should emit error events for processing failures

    expect(received).toBeGreaterThan(expected)

    Expected: > 0
    Received:   0

      550 |       await Promise.resolve();
      551 |
    > 552 |       expect(errors.length).toBeGreaterThan(0);
          |                             ^
      553 |     });
      554 |   });
      555 |

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:552:29)

  ● WorkflowMonitor › Tasks.md Format Tests › Edge Cases › should handle malformed task entries gracefully

    expect(received).toBeNull()

    Received: "Missing period after number"

      1284 |         
      1285 |         // Should handle malformed entries
    > 1286 |         expect(extractTaskName(tasksContent, '3')).toBeNull();
           |                                                    ^
      1287 |       });
      1288 |
      1289 |       it('should handle empty task names', async () => {

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:1286:52)

  ● WorkflowMonitor › Commit Message Format Tests › Commit Message Format Compatibility › should handle real-world commit message format

    expect(received).toBe(expected) // Object.is equality

    Expected: "Fix Task Name Extraction Regex Bug"
    Received: "1. Fix Task Name Extraction Regex Bug"

      1694 |
      1695 |         expect(matches.length).toBeGreaterThan(0);
    > 1696 |         expect(matches[0]).toBe('Fix Task Name Extraction Regex Bug');
           |                            ^
      1697 |       });
      1698 |     });
      1699 |

      at Object.<anonymous> (src/release/detection/__tests__/WorkflowMonitor.test.ts:1696:28)

 FAIL  src/release/detection/__tests__/DetectionSystemIntegration.test.ts
  ● Detection System Integration › End-to-End Release Detection Scenarios › should not trigger release for documentation-only changes

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

      359 |
      360 |       // With improved filtering, documentation-only changes should not need patch release
    > 361 |       expect(taskAnalysis.needsPatchRelease).toBe(false);
          |                                              ^
      362 |       expect(taskAnalysis.analysis.newFeatures).toHaveLength(0);
      363 |       expect(taskAnalysis.analysis.bugFixes).toHaveLength(0);
      364 |     });

      at Object.<anonymous> (src/release/detection/__tests__/DetectionSystemIntegration.test.ts:361:46)


Test Suites: 3 failed, 166 passed, 169 total
Tests:       18 failed, 13 skipped, 3948 passed, 3979 total
Snapshots:   0 total
Time:        14.25 s
Ran all test suites.