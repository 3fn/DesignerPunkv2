"use strict";
/**
 * Workflow Event Detector
 *
 * Integrates the WorkflowMonitor with the existing hook system and provides
 * a bridge between shell-based hooks and TypeScript release detection system.
 * Handles event detection, queuing, and processing coordination.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowEventDetector = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const WorkflowMonitor_1 = require("../detection/WorkflowMonitor");
const ReleaseDetector_1 = require("../detection/ReleaseDetector");
class WorkflowEventDetector {
    constructor(config, options = {}) {
        this.processingResults = new Map();
        this.isProcessing = false;
        this.config = config;
        this.options = {
            enableAutoProcessing: true,
            processingDelay: 2000, // 2 seconds
            maxRetries: 3,
            retryDelay: 5000, // 5 seconds
            ...options
        };
        // Initialize components
        this.monitor = new WorkflowMonitor_1.WorkflowMonitor(config);
        this.detector = new ExtendedReleaseDetector(config);
        // Set up event handling
        this.setupEventHandling();
    }
    /**
     * Start the workflow event detection system
     */
    async start() {
        await this.monitor.startMonitoring();
        if (this.options.enableAutoProcessing) {
            this.startAutoProcessing();
        }
    }
    /**
     * Stop the workflow event detection system
     */
    async stop() {
        this.isProcessing = false;
        await this.monitor.stopMonitoring();
        // Clear processing results to free memory
        this.processingResults.clear();
    }
    /**
     * Manually process a specific event
     */
    async processEvent(event) {
        const eventId = this.generateEventId(event);
        try {
            const releaseSignal = await this.detector.detectReleaseFromEvent(event);
            const result = {
                event,
                releaseSignal,
                processed: true,
                retryCount: 0
            };
            this.processingResults.set(eventId, result);
            return result;
        }
        catch (error) {
            const result = {
                event,
                releaseSignal: null,
                processed: false,
                error: error,
                retryCount: 0
            };
            this.processingResults.set(eventId, result);
            return result;
        }
    }
    /**
     * Get processing results for analysis
     */
    getProcessingResults() {
        return Array.from(this.processingResults.values());
    }
    /**
     * Manually trigger a workflow event (delegates to WorkflowMonitor)
     */
    async triggerEvent(type, source, metadata = {}) {
        await this.monitor.triggerEvent(type, source, metadata);
    }
    /**
     * Get current system status
     */
    getStatus() {
        const recentResults = Array.from(this.processingResults.values())
            .sort((a, b) => b.event.timestamp.getTime() - a.event.timestamp.getTime())
            .slice(0, 5);
        return {
            monitoring: this.monitor['isMonitoring'],
            processing: this.isProcessing,
            queueStatus: this.monitor.getQueueStatus(),
            resultsCount: this.processingResults.size,
            recentEvents: recentResults.map(r => r.event)
        };
    }
    /**
     * Integrate with existing hook system by processing trigger files
     */
    async processHookTriggers(triggersPath = '.kiro/release-triggers') {
        const results = [];
        try {
            const files = await fs_1.promises.readdir(triggersPath);
            const triggerFiles = files.filter(file => file.endsWith('.json'));
            for (const file of triggerFiles) {
                const filePath = path.join(triggersPath, file);
                try {
                    const triggerData = await fs_1.promises.readFile(filePath, 'utf-8');
                    const trigger = JSON.parse(triggerData);
                    // Only process pending triggers
                    if (trigger.status === 'pending') {
                        const event = {
                            type: this.mapTriggerType(trigger.type),
                            source: trigger.source || filePath,
                            timestamp: new Date(trigger.triggeredAt || Date.now()),
                            metadata: {
                                ...trigger,
                                triggerFile: filePath
                            }
                        };
                        const result = await this.processEvent(event);
                        results.push(result);
                        // Update trigger status
                        trigger.status = result.processed ? 'processed' : 'failed';
                        trigger.processedAt = new Date().toISOString();
                        trigger.releaseSignal = result.releaseSignal;
                        if (result.error) {
                            trigger.error = result.error.message;
                        }
                        await fs_1.promises.writeFile(filePath, JSON.stringify(trigger, null, 2));
                    }
                }
                catch (error) {
                    console.error(`Error processing trigger file ${filePath}:`, error);
                }
            }
        }
        catch (error) {
            // Directory doesn't exist - this is normal for tests or new installations
            if (error.code !== 'ENOENT') {
                console.error('Error reading triggers directory:', error);
            }
        }
        return results;
    }
    /**
     * Create a CLI interface for manual event processing
     */
    async processCliCommand(command, args) {
        switch (command) {
            case 'status':
                await this.showStatus();
                break;
            case 'process-triggers':
                await this.processTriggersCommand();
                break;
            case 'monitor':
                await this.startMonitoringCommand();
                break;
            case 'stop':
                await this.stopMonitoringCommand();
                break;
            default:
                console.log('Unknown command:', command);
                this.showHelp();
        }
    }
    // Private methods
    setupEventHandling() {
        // Handle workflow events from the monitor
        this.monitor.on('workflow-event', (event) => {
            if (this.options.enableAutoProcessing) {
                // Queue for processing
                setTimeout(() => {
                    this.processEvent(event).catch(error => {
                        console.error('Error processing workflow event:', error);
                    });
                }, this.options.processingDelay);
            }
        });
        // Handle release signals
        this.monitor.on('release-signal', (signal) => {
            console.log('Release signal detected:', signal);
            // This could trigger the release process
        });
        // Handle errors
        this.monitor.on('error', (error) => {
            console.error('Workflow monitor error:', error);
        });
    }
    startAutoProcessing() {
        this.isProcessing = true;
        // Periodically process hook triggers
        const processHookTriggers = async () => {
            if (this.isProcessing) {
                try {
                    await this.processHookTriggers();
                }
                catch (error) {
                    console.error('Error processing hook triggers:', error);
                }
                // Schedule next processing
                setTimeout(processHookTriggers, this.options.processingDelay);
            }
        };
        // Start processing after initial delay
        setTimeout(processHookTriggers, this.options.processingDelay);
    }
    generateEventId(event) {
        return `${event.type}-${event.timestamp.getTime()}-${event.source.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
    mapTriggerType(triggerType) {
        switch (triggerType) {
            case 'spec-completion':
                return 'spec-completion';
            case 'task-completion':
                return 'task-completion';
            default:
                return 'hook-trigger';
        }
    }
    // CLI command implementations
    async showStatus() {
        const status = this.getStatus();
        console.log('\n=== Workflow Event Detector Status ===');
        console.log(`Monitoring: ${status.monitoring ? '✅ Active' : '❌ Inactive'}`);
        console.log(`Processing: ${status.processing ? '✅ Active' : '❌ Inactive'}`);
        console.log(`Queue Length: ${status.queueStatus.queueLength}`);
        console.log(`Results Count: ${status.resultsCount}`);
        if (status.recentEvents.length > 0) {
            console.log('\nRecent Events:');
            status.recentEvents.forEach((event, index) => {
                console.log(`  ${index + 1}. ${event.type} - ${event.source} (${event.timestamp.toISOString()})`);
            });
        }
        console.log('');
    }
    async processTriggersCommand() {
        console.log('Processing hook triggers...');
        const results = await this.processHookTriggers();
        console.log(`Processed ${results.length} triggers:`);
        results.forEach((result, index) => {
            const status = result.processed ? '✅' : '❌';
            const signal = result.releaseSignal ? ` -> ${result.releaseSignal.type} release` : '';
            console.log(`  ${index + 1}. ${status} ${result.event.type}${signal}`);
            if (result.error) {
                console.log(`     Error: ${result.error.message}`);
            }
        });
    }
    async startMonitoringCommand() {
        console.log('Starting workflow monitoring...');
        await this.start();
        console.log('✅ Monitoring started');
    }
    async stopMonitoringCommand() {
        console.log('Stopping workflow monitoring...');
        await this.stop();
        console.log('✅ Monitoring stopped');
    }
    showHelp() {
        console.log(`
Workflow Event Detector CLI

Commands:
  status           - Show current system status
  process-triggers - Process pending hook triggers
  monitor          - Start workflow monitoring
  stop             - Stop workflow monitoring

Examples:
  npm run release:detect status
  npm run release:detect process-triggers
  npm run release:detect monitor
`);
    }
}
exports.WorkflowEventDetector = WorkflowEventDetector;
/**
 * Extended Release Detector that can handle WorkflowEvents
 */
class ExtendedReleaseDetector extends ReleaseDetector_1.ReleaseDetector {
    async detectReleaseFromEvent(event) {
        try {
            switch (event.type) {
                case 'task-completion':
                    if (event.metadata.taskNumber && event.metadata.taskDescription) {
                        // Extract task path from metadata or construct it
                        const taskPath = event.metadata.taskPath || this.findTasksFileFromEvent(event);
                        const taskName = `${event.metadata.taskNumber} ${event.metadata.taskDescription}`;
                        // Check if task file exists before processing
                        try {
                            await fs_1.promises.access(taskPath);
                            return await this.detectReleaseFromTaskCompletion(taskPath, taskName);
                        }
                        catch (error) {
                            // File doesn't exist - return null instead of throwing
                            return null;
                        }
                    }
                    break;
                case 'spec-completion':
                    // Extract spec path from source
                    const specPath = this.extractSpecPathFromSource(event.source);
                    if (specPath) {
                        try {
                            await fs_1.promises.access(specPath);
                            return await this.detectReleaseFromSpecCompletion(specPath);
                        }
                        catch (error) {
                            // Path doesn't exist - return null instead of throwing
                            return null;
                        }
                    }
                    break;
                case 'hook-trigger':
                    // Process based on trigger metadata
                    if (event.metadata.type === 'task-completion' && event.metadata.source) {
                        try {
                            await fs_1.promises.access(event.metadata.source);
                            return await this.detectReleaseFromTaskCompletion(event.metadata.source, event.metadata.taskName || 'Unknown Task');
                        }
                        catch (error) {
                            return null;
                        }
                    }
                    if (event.metadata.type === 'spec-completion' && event.metadata.source) {
                        try {
                            await fs_1.promises.access(event.metadata.source);
                            return await this.detectReleaseFromSpecCompletion(event.metadata.source);
                        }
                        catch (error) {
                            return null;
                        }
                    }
                    break;
            }
            return null;
        }
        catch (error) {
            // Log error but don't throw - return null to indicate no release signal
            console.warn('Error detecting release from event:', error);
            return null;
        }
    }
    findTasksFileFromEvent(event) {
        // Try to extract spec name from source and construct tasks.md path
        if (event.source.includes('git-commit:')) {
            // For git commits, we need to find the relevant tasks.md file
            // This is a simplified approach - in practice, you might need more sophisticated logic
            return '.kiro/specs/release-management-system/tasks.md'; // Default fallback
        }
        return event.source;
    }
    extractSpecPathFromSource(source) {
        // Extract spec path from completion document path
        const specMatch = source.match(/\.kiro\/specs\/([^\/]+)/);
        if (specMatch) {
            return `.kiro/specs/${specMatch[1]}`;
        }
        return null;
    }
}
//# sourceMappingURL=WorkflowEventDetector.js.map