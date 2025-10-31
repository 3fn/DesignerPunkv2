"use strict";
/**
 * Workflow Event Monitor
 *
 * Monitors workflow events and file system changes to detect release triggers.
 * Integrates with existing hook system to detect completion events and
 * provides event queuing and processing for release triggers.
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
exports.WorkflowMonitor = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const events_1 = require("events");
const child_process_1 = require("child_process");
class WorkflowMonitor extends events_1.EventEmitter {
    constructor(config, options = {}) {
        super();
        this.isMonitoring = false;
        this.lastCheckedFiles = new Map();
        this.config = config;
        this.options = {
            pollInterval: 5000, // 5 seconds
            enableFileWatching: true,
            enableHookIntegration: true,
            ...options
        };
        // Initialize event queue
        this.eventQueue = {
            events: [],
            processing: false,
            maxSize: 100,
            processingDelay: 1000 // 1 second delay between processing events
        };
        // Note: Event queue processing timer is started in startMonitoring(), not here
    }
    /**
     * Start monitoring for workflow events
     */
    async startMonitoring() {
        if (this.isMonitoring) {
            return;
        }
        this.isMonitoring = true;
        // Initialize file tracking
        await this.initializeFileTracking();
        // Start event queue processing timer
        this.setupEventQueueProcessing();
        // Start polling for changes
        if (this.options.enableFileWatching) {
            this.startFilePolling();
        }
        // Set up hook integration
        if (this.options.enableHookIntegration) {
            await this.setupHookIntegration();
        }
        this.emit('monitoring-started');
    }
    /**
     * Stop monitoring for workflow events
     */
    async stopMonitoring() {
        if (!this.isMonitoring) {
            return;
        }
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
        if (this.processingTimer) {
            clearInterval(this.processingTimer);
            this.processingTimer = undefined;
        }
        // Clear any remaining events in the queue
        this.clearQueue();
        // Remove all listeners to prevent memory leaks
        this.removeAllListeners();
        this.emit('monitoring-stopped');
    }
    /**
     * Check for new completion events
     */
    async checkForCompletionEvents() {
        const events = [];
        // Check each monitored path
        for (const monitorPath of this.config.monitorPaths) {
            const pathEvents = await this.checkPath(monitorPath);
            events.push(...pathEvents);
        }
        return events;
    }
    /**
     * Process a workflow event and determine if it should trigger a release
     */
    async processWorkflowEvent(event) {
        switch (event.type) {
            case 'task-completion':
                return await this.processTaskCompletion(event);
            case 'spec-completion':
                return await this.processSpecCompletion(event);
            case 'file-change':
                return await this.processFileChange(event);
            case 'hook-trigger':
                return await this.processHookTrigger(event);
            default:
                return null;
        }
    }
    /**
     * Manually trigger a workflow event (for testing or manual triggers)
     */
    async triggerEvent(type, source, metadata = {}) {
        const event = {
            type,
            source,
            timestamp: new Date(),
            metadata
        };
        this.queueEvent(event);
    }
    /**
     * Add event to processing queue
     */
    queueEvent(event) {
        // Check if queue is full
        if (this.eventQueue.events.length >= this.eventQueue.maxSize) {
            // Remove oldest event to make room
            this.eventQueue.events.shift();
            console.warn('Event queue full, removing oldest event');
        }
        // Add event to queue
        this.eventQueue.events.push(event);
        // Emit queued event for immediate listeners
        this.emit('workflow-event', event);
        // Start processing if not already processing
        if (!this.eventQueue.processing) {
            this.startEventProcessing();
        }
    }
    /**
     * Set up event queue processing system
     */
    setupEventQueueProcessing() {
        // Process events periodically
        this.processingTimer = setInterval(() => {
            if (!this.eventQueue.processing && this.eventQueue.events.length > 0) {
                this.startEventProcessing();
            }
        }, this.eventQueue.processingDelay);
    }
    /**
     * Start processing events from the queue
     */
    async startEventProcessing() {
        if (this.eventQueue.processing) {
            return;
        }
        this.eventQueue.processing = true;
        while (this.eventQueue.events.length > 0) {
            const event = this.eventQueue.events.shift();
            if (event) {
                try {
                    await this.processQueuedEvent(event);
                    // Small delay between processing events to prevent overwhelming
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                catch (error) {
                    console.error('Error processing queued event:', error);
                    this.emit('error', error);
                }
            }
        }
        this.eventQueue.processing = false;
    }
    /**
     * Process a single event from the queue
     */
    async processQueuedEvent(event) {
        // Emit processed event for listeners who want to handle processed events
        this.emit('event-processed', event);
        // Process the event to determine if it should trigger a release
        const releaseSignal = await this.processWorkflowEvent(event);
        if (releaseSignal) {
            this.emit('release-signal', releaseSignal);
        }
    }
    /**
     * Get current queue status
     */
    getQueueStatus() {
        return {
            queueLength: this.eventQueue.events.length,
            processing: this.eventQueue.processing,
            maxSize: this.eventQueue.maxSize,
            processingDelay: this.eventQueue.processingDelay
        };
    }
    /**
     * Clear the event queue
     */
    clearQueue() {
        this.eventQueue.events = [];
        this.eventQueue.processing = false;
    }
    // Private methods
    async initializeFileTracking() {
        this.lastCheckedFiles.clear();
        for (const monitorPath of this.config.monitorPaths) {
            try {
                const expandedPaths = await this.expandGlobPath(monitorPath);
                for (const expandedPath of expandedPaths) {
                    try {
                        const stats = await fs_1.promises.stat(expandedPath);
                        this.lastCheckedFiles.set(expandedPath, stats.mtime.getTime());
                    }
                    catch (error) {
                        // File doesn't exist yet, that's okay
                    }
                }
            }
            catch (error) {
                // Path doesn't exist or can't be accessed
            }
        }
    }
    startFilePolling() {
        this.monitoringInterval = setInterval(async () => {
            try {
                const events = await this.checkForCompletionEvents();
                for (const event of events) {
                    this.queueEvent(event);
                }
            }
            catch (error) {
                this.emit('error', error);
            }
        }, this.options.pollInterval);
    }
    async setupHookIntegration() {
        // Set up integration with existing hook system
        // Integrate with the existing release-manager.sh hook and trigger system
        const hookIntegrationPath = '.kiro/release-triggers';
        const releaseIntegrationPath = '.kiro/hooks/release-integration';
        try {
            // Ensure both directories exist
            await fs_1.promises.mkdir(hookIntegrationPath, { recursive: true });
            await fs_1.promises.mkdir(releaseIntegrationPath, { recursive: true });
            // Watch the release triggers directory created by release-manager.sh
            this.watchTriggersDirectory(hookIntegrationPath);
            // Also watch the integration directory for direct hook communication
            const triggerFile = path.join(releaseIntegrationPath, 'trigger.json');
            this.watchTriggerFile(triggerFile);
            // Set up monitoring for existing hook integration points
            await this.setupExistingHookIntegration();
        }
        catch (error) {
            console.warn('Could not set up hook integration:', error);
        }
    }
    async watchTriggerFile(triggerFile) {
        // Poll the trigger file for changes
        let lastModified = 0;
        const checkTriggerFile = async () => {
            try {
                const stats = await fs_1.promises.stat(triggerFile);
                const modified = stats.mtime.getTime();
                if (modified > lastModified) {
                    lastModified = modified;
                    // Read trigger data
                    const triggerData = await fs_1.promises.readFile(triggerFile, 'utf-8');
                    const trigger = JSON.parse(triggerData);
                    const event = {
                        type: 'hook-trigger',
                        source: trigger.source || triggerFile,
                        timestamp: new Date(),
                        metadata: trigger
                    };
                    this.queueEvent(event);
                    // Clear the trigger file
                    await fs_1.promises.writeFile(triggerFile, '{}');
                }
            }
            catch (error) {
                // File doesn't exist or can't be read, that's okay
            }
        };
        // Check every second for trigger file changes
        setInterval(checkTriggerFile, 1000);
    }
    async watchTriggersDirectory(triggersPath) {
        // Monitor the .kiro/release-triggers directory for new trigger files
        // This integrates with the release-manager.sh hook system
        const processedTriggers = new Set();
        const checkTriggersDirectory = async () => {
            try {
                const files = await fs_1.promises.readdir(triggersPath);
                const triggerFiles = files.filter(file => file.endsWith('.json'));
                for (const file of triggerFiles) {
                    const filePath = path.join(triggersPath, file);
                    // Skip if already processed
                    if (processedTriggers.has(filePath)) {
                        continue;
                    }
                    try {
                        const triggerData = await fs_1.promises.readFile(filePath, 'utf-8');
                        const trigger = JSON.parse(triggerData);
                        // Only process pending triggers
                        if (trigger.status === 'pending') {
                            const event = {
                                type: this.mapTriggerTypeToEventType(trigger.type),
                                source: trigger.source || filePath,
                                timestamp: new Date(trigger.triggeredAt || Date.now()),
                                metadata: {
                                    ...trigger,
                                    triggerFile: filePath
                                }
                            };
                            this.queueEvent(event);
                            // Mark trigger as processed
                            trigger.status = 'processed';
                            trigger.processedAt = new Date().toISOString();
                            await fs_1.promises.writeFile(filePath, JSON.stringify(trigger, null, 2));
                            processedTriggers.add(filePath);
                        }
                    }
                    catch (error) {
                        console.warn(`Error processing trigger file ${filePath}:`, error);
                    }
                }
            }
            catch (error) {
                // Directory doesn't exist or can't be read
            }
        };
        // Check every 2 seconds for new trigger files
        setInterval(checkTriggersDirectory, 2000);
    }
    async setupExistingHookIntegration() {
        // Set up integration with existing hooks like commit-task.sh and organize-after-completion
        // Monitor git commits for task completion patterns
        await this.setupGitCommitMonitoring();
        // Monitor for file organization events that might indicate completion
        await this.setupFileOrganizationMonitoring();
    }
    async setupGitCommitMonitoring() {
        // Monitor git log for task completion commits
        let lastCommitHash = '';
        const checkGitCommits = async () => {
            try {
                // Get the latest commit hash
                const currentCommit = (0, child_process_1.execSync)('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
                if (currentCommit !== lastCommitHash && lastCommitHash !== '') {
                    // Get the commit message
                    const commitMessage = (0, child_process_1.execSync)('git log -1 --pretty=format:"%s"', { encoding: 'utf-8' });
                    // Check if this is a task completion commit
                    const taskCompletionMatch = commitMessage.match(/Task\s+([0-9.]+)\s+Complete:\s*(.+)/i);
                    if (taskCompletionMatch) {
                        const taskNumber = taskCompletionMatch[1];
                        const taskDescription = taskCompletionMatch[2];
                        const event = {
                            type: 'task-completion',
                            source: `git-commit:${currentCommit}`,
                            timestamp: new Date(),
                            metadata: {
                                commitHash: currentCommit,
                                commitMessage,
                                taskNumber,
                                taskDescription,
                                triggerSource: 'git-commit-monitor'
                            }
                        };
                        this.queueEvent(event);
                    }
                }
                lastCommitHash = currentCommit;
            }
            catch (error) {
                // Git not available or not in a git repository
            }
        };
        // Check every 10 seconds for new commits
        setInterval(checkGitCommits, 10000);
    }
    async setupFileOrganizationMonitoring() {
        // Monitor for file organization events that might indicate task completion
        // This integrates with the organize-after-completion hook
        const organizationLogPath = '.kiro/logs/organization.log';
        let lastLogSize = 0;
        const checkOrganizationLog = async () => {
            try {
                const stats = await fs_1.promises.stat(organizationLogPath);
                const currentSize = stats.size;
                if (currentSize > lastLogSize) {
                    // Read new log entries
                    const logContent = await fs_1.promises.readFile(organizationLogPath, 'utf-8');
                    const newContent = logContent.slice(lastLogSize);
                    // Look for completion document organization events
                    const completionOrgPattern = /Organized.*completion.*\.md/i;
                    const lines = newContent.split('\n');
                    for (const line of lines) {
                        if (completionOrgPattern.test(line)) {
                            const event = {
                                type: 'file-change',
                                source: organizationLogPath,
                                timestamp: new Date(),
                                metadata: {
                                    logEntry: line.trim(),
                                    triggerSource: 'file-organization-monitor'
                                }
                            };
                            this.queueEvent(event);
                        }
                    }
                    lastLogSize = currentSize;
                }
            }
            catch (error) {
                // Log file doesn't exist yet
            }
        };
        // Check every 5 seconds for organization log changes
        setInterval(checkOrganizationLog, 5000);
    }
    async checkPath(monitorPath) {
        const events = [];
        try {
            const expandedPaths = await this.expandGlobPath(monitorPath);
            for (const expandedPath of expandedPaths) {
                const pathEvents = await this.checkSinglePath(expandedPath);
                events.push(...pathEvents);
            }
        }
        catch (error) {
            // Path doesn't exist or can't be accessed
        }
        return events;
    }
    async checkSinglePath(filePath) {
        const events = [];
        try {
            const stats = await fs_1.promises.stat(filePath);
            const currentModified = stats.mtime.getTime();
            const lastModified = this.lastCheckedFiles.get(filePath) || 0;
            if (currentModified > lastModified) {
                this.lastCheckedFiles.set(filePath, currentModified);
                // Determine event type based on file path and content
                const eventType = this.determineEventType(filePath);
                if (eventType) {
                    events.push({
                        type: eventType,
                        source: filePath,
                        timestamp: new Date(),
                        metadata: {
                            lastModified: new Date(lastModified),
                            currentModified: new Date(currentModified)
                        }
                    });
                }
            }
        }
        catch (error) {
            // File was deleted or can't be accessed
            if (this.lastCheckedFiles.has(filePath)) {
                this.lastCheckedFiles.delete(filePath);
            }
        }
        return events;
    }
    async expandGlobPath(globPath) {
        const paths = [];
        // Simple glob expansion - handle * wildcards
        if (globPath.includes('*')) {
            const parts = globPath.split('/');
            const expandedParts = await this.expandGlobParts(parts, '');
            paths.push(...expandedParts);
        }
        else {
            paths.push(globPath);
        }
        return paths;
    }
    async expandGlobParts(parts, currentPath) {
        if (parts.length === 0) {
            return [currentPath];
        }
        const [firstPart, ...remainingParts] = parts;
        const paths = [];
        if (firstPart.includes('*')) {
            // Handle wildcard expansion
            const basePath = currentPath || '.';
            try {
                const entries = await fs_1.promises.readdir(basePath, { withFileTypes: true });
                for (const entry of entries) {
                    if (this.matchesGlobPattern(entry.name, firstPart)) {
                        const newPath = path.join(currentPath, entry.name);
                        if (remainingParts.length === 0) {
                            // This is the final part
                            if (entry.isFile()) {
                                paths.push(newPath);
                            }
                        }
                        else {
                            // Continue expanding
                            if (entry.isDirectory()) {
                                const subPaths = await this.expandGlobParts(remainingParts, newPath);
                                paths.push(...subPaths);
                            }
                        }
                    }
                }
            }
            catch (error) {
                // Directory doesn't exist or can't be read
            }
        }
        else {
            // No wildcard, just continue with the literal path
            const newPath = path.join(currentPath, firstPart);
            if (remainingParts.length === 0) {
                paths.push(newPath);
            }
            else {
                const subPaths = await this.expandGlobParts(remainingParts, newPath);
                paths.push(...subPaths);
            }
        }
        return paths;
    }
    matchesGlobPattern(filename, pattern) {
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        return new RegExp(`^${regexPattern}$`).test(filename);
    }
    mapTriggerTypeToEventType(triggerType) {
        switch (triggerType) {
            case 'spec-completion':
                return 'spec-completion';
            case 'task-completion':
                return 'task-completion';
            default:
                return 'hook-trigger';
        }
    }
    determineEventType(filePath) {
        // Determine event type based on file path patterns
        if (filePath.includes('/completion/') && filePath.endsWith('.md')) {
            if (filePath.includes('task-') && filePath.includes('-completion.md')) {
                return 'task-completion';
            }
            if (filePath.includes('spec-completion-summary.md')) {
                return 'spec-completion';
            }
            // Other completion documents might indicate spec completion
            if (this.config.completionPatterns.some(pattern => this.matchesGlobPattern(path.basename(filePath), pattern))) {
                return 'spec-completion';
            }
        }
        if (filePath.endsWith('tasks.md')) {
            return 'file-change';
        }
        return null;
    }
    async processTaskCompletion(event) {
        // Extract task information from the file path
        const taskMatch = event.source.match(/task-([^-]+)-completion\.md$/);
        if (!taskMatch) {
            return null;
        }
        const taskNumber = taskMatch[1];
        // Find the corresponding tasks.md file
        const tasksPath = event.source.replace(/\/completion\/task-[^-]+-completion\.md$/, '/tasks.md');
        try {
            const tasksContent = await fs_1.promises.readFile(tasksPath, 'utf-8');
            // Find the task name from the tasks.md file
            const taskName = this.extractTaskName(tasksContent, taskNumber);
            if (taskName) {
                // This would typically call the ReleaseDetector
                // For now, we'll emit an event that can be handled by the release system
                this.emit('task-completion-detected', {
                    taskPath: tasksPath,
                    taskName,
                    taskNumber,
                    completionPath: event.source
                });
            }
        }
        catch (error) {
            console.error('Error processing task completion:', error);
        }
        return null;
    }
    async processSpecCompletion(event) {
        // Extract spec information from the file path
        const specMatch = event.source.match(/\.kiro\/specs\/([^\/]+)\//);
        if (!specMatch) {
            return null;
        }
        const specName = specMatch[1];
        const specPath = path.dirname(path.dirname(event.source)); // Go up from completion/ to spec root
        this.emit('spec-completion-detected', {
            specName,
            specPath,
            completionPath: event.source
        });
        return null;
    }
    async processFileChange(event) {
        // Handle general file changes that might indicate completion
        if (event.source.endsWith('tasks.md')) {
            // Check if any tasks were marked as completed
            const completedTasks = await this.checkForCompletedTasks(event.source);
            for (const task of completedTasks) {
                this.emit('task-status-changed', {
                    taskPath: event.source,
                    taskName: task.name,
                    taskNumber: task.number,
                    status: 'completed'
                });
            }
        }
        return null;
    }
    async processHookTrigger(event) {
        // Process triggers from the hook system
        const { triggerType, source, taskName } = event.metadata;
        if (triggerType === 'task-completion' && source && taskName) {
            this.emit('task-completion-detected', {
                taskPath: source,
                taskName,
                completionPath: event.source
            });
        }
        return null;
    }
    extractTaskName(tasksContent, taskNumber) {
        const lines = tasksContent.split('\n');
        for (const line of lines) {
            // Look for task with matching number
            const taskMatch = line.match(new RegExp(`^- \\[ \\] ${taskNumber}(?:\\.\\d+)?\\s+(.+)$`));
            if (taskMatch) {
                return taskMatch[1].trim();
            }
        }
        return null;
    }
    async checkForCompletedTasks(tasksPath) {
        const completedTasks = [];
        try {
            const content = await fs_1.promises.readFile(tasksPath, 'utf-8');
            const lines = content.split('\n');
            for (const line of lines) {
                // Look for completed tasks (marked with [x])
                const completedMatch = line.match(/^- \[x\] (\d+(?:\.\d+)?)\s+(.+)$/);
                if (completedMatch) {
                    completedTasks.push({
                        number: completedMatch[1],
                        name: completedMatch[2].trim()
                    });
                }
            }
        }
        catch (error) {
            console.error('Error checking for completed tasks:', error);
        }
        return completedTasks;
    }
}
exports.WorkflowMonitor = WorkflowMonitor;
//# sourceMappingURL=WorkflowMonitor.js.map