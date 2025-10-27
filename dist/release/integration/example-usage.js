"use strict";
/**
 * Example Usage of Workflow Event Monitoring System
 *
 * This file demonstrates how to use the workflow event monitoring system
 * to integrate release detection with existing hooks and workflows.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicEventProcessing = basicEventProcessing;
exports.hookIntegrationExample = hookIntegrationExample;
exports.continuousMonitoringExample = continuousMonitoringExample;
exports.cliIntegrationExample = cliIntegrationExample;
exports.runExamples = runExamples;
const WorkflowEventDetector_1 = require("./WorkflowEventDetector");
// Example configuration
const exampleConfig = {
    specCompletionTrigger: true,
    taskCompletionTrigger: true,
    breakingChangeKeywords: [
        'breaking change',
        'breaking',
        'incompatible',
        'removes',
        'deprecated',
        'migration required'
    ],
    confidenceThreshold: 0.8,
    monitorPaths: [
        '.kiro/specs/*/completion/',
        '.kiro/specs/*/tasks.md'
    ],
    completionPatterns: [
        '*-completion.md',
        'spec-completion-summary.md'
    ]
};
/**
 * Example 1: Basic Event Processing
 */
async function basicEventProcessing() {
    console.log('=== Basic Event Processing Example ===');
    const detector = new WorkflowEventDetector_1.WorkflowEventDetector(exampleConfig, {
        enableAutoProcessing: false // Manual processing for this example
    });
    // Create a sample task completion event
    const taskEvent = {
        type: 'task-completion',
        source: '.kiro/specs/release-management-system/tasks.md',
        timestamp: new Date(),
        metadata: {
            taskNumber: '2.3',
            taskDescription: 'Build workflow event monitoring',
            commitHash: 'abc123',
            triggerSource: 'example'
        }
    };
    try {
        await detector.start();
        console.log('Processing task completion event...');
        const result = await detector.processEvent(taskEvent);
        console.log('Result:', {
            processed: result.processed,
            hasReleaseSignal: !!result.releaseSignal,
            releaseType: result.releaseSignal?.type,
            confidence: result.releaseSignal?.confidence
        });
    }
    finally {
        await detector.stop();
    }
}
/**
 * Example 2: Hook Integration
 */
async function hookIntegrationExample() {
    console.log('\n=== Hook Integration Example ===');
    const detector = new WorkflowEventDetector_1.WorkflowEventDetector(exampleConfig);
    try {
        await detector.start();
        console.log('Processing hook triggers...');
        const results = await detector.processHookTriggers();
        console.log(`Processed ${results.length} hook triggers`);
        results.forEach((result, index) => {
            console.log(`  ${index + 1}. ${result.event.type} - ${result.processed ? '✅' : '❌'}`);
        });
    }
    finally {
        await detector.stop();
    }
}
/**
 * Example 3: Continuous Monitoring
 */
async function continuousMonitoringExample() {
    console.log('\n=== Continuous Monitoring Example ===');
    const detector = new WorkflowEventDetector_1.WorkflowEventDetector(exampleConfig, {
        enableAutoProcessing: true,
        processingDelay: 1000 // 1 second delay
    });
    // Set up event listeners
    detector['monitor'].on('workflow-event', (event) => {
        console.log(`📥 Event detected: ${event.type} from ${event.source}`);
    });
    detector['monitor'].on('release-signal', (signal) => {
        console.log(`🚀 Release signal: ${signal.type} release (confidence: ${signal.confidence})`);
    });
    try {
        console.log('Starting continuous monitoring...');
        await detector.start();
        // Simulate some events
        await detector.triggerEvent('task-completion', 'example-task.md', {
            taskNumber: '1.1',
            taskDescription: 'Example task'
        });
        // Let it run for a short time
        await new Promise(resolve => setTimeout(resolve, 2000));
        const status = detector.getStatus();
        console.log('Status:', {
            monitoring: status.monitoring,
            processing: status.processing,
            queueLength: status.queueStatus.queueLength,
            resultsCount: status.resultsCount
        });
    }
    finally {
        await detector.stop();
        console.log('Monitoring stopped');
    }
}
/**
 * Example 4: CLI Integration
 */
async function cliIntegrationExample() {
    console.log('\n=== CLI Integration Example ===');
    const detector = new WorkflowEventDetector_1.WorkflowEventDetector(exampleConfig);
    try {
        console.log('Simulating CLI commands...');
        // Show status
        await detector.processCliCommand('status', []);
        // Process triggers
        await detector.processCliCommand('process-triggers', []);
    }
    finally {
        await detector.stop();
    }
}
/**
 * Run all examples
 */
async function runExamples() {
    try {
        await basicEventProcessing();
        await hookIntegrationExample();
        await continuousMonitoringExample();
        await cliIntegrationExample();
        console.log('\n✅ All examples completed successfully!');
    }
    catch (error) {
        console.error('❌ Error running examples:', error);
    }
}
// Run examples if this file is executed directly
if (require.main === module) {
    runExamples();
}
//# sourceMappingURL=example-usage.js.map