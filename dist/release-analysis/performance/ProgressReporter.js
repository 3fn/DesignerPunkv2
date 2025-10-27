"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressReporter = void 0;
const events_1 = require("events");
/**
 * Progress Reporter for long-running release analysis operations
 *
 * Provides comprehensive progress reporting with console output, detailed logging,
 * and performance metrics for large repository analysis operations.
 *
 * Requirements addressed:
 * - 5.4: Add progress reporting for long-running analysis
 */
class ProgressReporter extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.phases = [];
        this.currentPhaseIndex = 0;
        this.startTime = 0;
        this.lastUpdateTime = 0;
        this.milestones = [];
        this.phaseStartTimes = new Map();
        this.phaseProgress = new Map();
        this.config = {
            enableConsoleOutput: true,
            enableDetailedLogging: false,
            updateInterval: 1000, // 1 second
            showEstimatedTime: true,
            showProcessingRate: true,
            showMemoryUsage: false,
            enableProgressBar: true,
            progressBarWidth: 40,
            ...config
        };
    }
    /**
     * Initialize progress reporting with analysis phases
     * Requirement 5.4: Progress reporting for long-running analysis
     */
    initializePhases(phases) {
        this.phases = phases;
        this.currentPhaseIndex = 0;
        this.startTime = Date.now();
        this.lastUpdateTime = this.startTime;
        this.milestones = [];
        this.phaseStartTimes.clear();
        this.phaseProgress.clear();
        // Initialize phase progress
        for (const phase of phases) {
            this.phaseProgress.set(phase.name, 0);
        }
        if (this.config.enableConsoleOutput) {
            console.log('\n🚀 Starting Release Analysis');
            console.log(`📋 Analysis phases: ${phases.map(p => p.name).join(' → ')}`);
            console.log('─'.repeat(60));
        }
        this.emit('initialized', { phases, startTime: this.startTime });
    }
    /**
     * Start a new analysis phase
     * Requirement 5.4: Progress reporting with phase tracking
     */
    startPhase(phaseName, description) {
        const phaseIndex = this.phases.findIndex(p => p.name === phaseName);
        if (phaseIndex === -1) {
            throw new Error(`Unknown phase: ${phaseName}`);
        }
        this.currentPhaseIndex = phaseIndex;
        const phase = this.phases[phaseIndex];
        const now = Date.now();
        this.phaseStartTimes.set(phaseName, now);
        this.phaseProgress.set(phaseName, 0);
        if (this.config.enableConsoleOutput) {
            console.log(`\n📍 Phase ${phaseIndex + 1}/${this.phases.length}: ${phase.name}`);
            if (description || phase.description) {
                console.log(`   ${description || phase.description}`);
            }
        }
        this.addMilestone(`phase-start-${phaseName}`, phaseName, 0, {
            phaseIndex,
            description: description || phase.description
        });
        this.emit('phaseStarted', { phase, phaseIndex, startTime: now });
    }
    /**
     * Update progress for current phase
     * Requirement 5.4: Real-time progress updates
     */
    updateProgress(itemsProcessed, totalItems, currentOperation, metadata) {
        const now = Date.now();
        // Throttle updates based on configured interval
        if (now - this.lastUpdateTime < this.config.updateInterval) {
            return;
        }
        const currentPhase = this.phases[this.currentPhaseIndex];
        if (!currentPhase) {
            return;
        }
        const phaseProgress = totalItems > 0 ? (itemsProcessed / totalItems) * 100 : 0;
        this.phaseProgress.set(currentPhase.name, phaseProgress);
        const overallProgress = this.calculateOverallProgress();
        const elapsedTime = now - this.startTime;
        const phaseElapsed = now - (this.phaseStartTimes.get(currentPhase.name) || now);
        // Calculate processing rate
        const processingRate = phaseElapsed > 0 ? itemsProcessed / (phaseElapsed / 1000) : 0;
        // Estimate remaining time
        const estimatedTimeRemaining = this.estimateRemainingTime(overallProgress, elapsedTime, processingRate, totalItems - itemsProcessed);
        const progress = {
            phase: currentPhase,
            phaseProgress,
            overallProgress,
            currentOperation: currentOperation || 'Processing...',
            itemsProcessed,
            totalItems,
            processingRate,
            estimatedTimeRemaining,
            errors: 0, // Will be updated by error handlers
            warnings: 0, // Will be updated by warning handlers
            startTime: this.startTime,
            elapsedTime
        };
        // Add memory usage if enabled
        if (this.config.showMemoryUsage) {
            const memUsage = process.memoryUsage();
            progress.memoryUsage = {
                used: memUsage.heapUsed,
                total: memUsage.heapTotal,
                percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100
            };
        }
        // Update console output
        if (this.config.enableConsoleOutput) {
            this.updateConsoleOutput(progress);
        }
        // Emit progress event
        this.emit('progress', progress);
        this.lastUpdateTime = now;
    }
    /**
     * Complete current phase
     * Requirement 5.4: Phase completion tracking
     */
    completePhase(phaseName, summary) {
        const phase = phaseName
            ? this.phases.find(p => p.name === phaseName)
            : this.phases[this.currentPhaseIndex];
        if (!phase) {
            return;
        }
        this.phaseProgress.set(phase.name, 100);
        const now = Date.now();
        const phaseStartTime = this.phaseStartTimes.get(phase.name) || now;
        const phaseDuration = now - phaseStartTime;
        if (this.config.enableConsoleOutput) {
            console.log(`\n✅ Completed: ${phase.name} (${this.formatDuration(phaseDuration)})`);
            if (summary) {
                console.log(`   ${summary}`);
            }
        }
        this.addMilestone(`phase-complete-${phase.name}`, phase.name, 100, {
            duration: phaseDuration,
            summary
        });
        this.emit('phaseCompleted', {
            phase,
            duration: phaseDuration,
            completedAt: now,
            summary
        });
        // Move to next phase if not manually specified
        if (!phaseName && this.currentPhaseIndex < this.phases.length - 1) {
            this.currentPhaseIndex++;
        }
    }
    /**
     * Complete entire analysis
     * Requirement 5.4: Analysis completion reporting
     */
    completeAnalysis(summary) {
        const now = Date.now();
        const totalDuration = now - this.startTime;
        const overallProgress = 100;
        if (this.config.enableConsoleOutput) {
            console.log('\n🎉 Release Analysis Complete!');
            console.log(`⏱️  Total time: ${this.formatDuration(totalDuration)}`);
            if (summary) {
                console.log(`📊 ${summary}`);
            }
            console.log('─'.repeat(60));
        }
        this.addMilestone('analysis-complete', 'complete', 100, {
            totalDuration,
            summary,
            phases: this.phases.length,
            milestones: this.milestones.length
        });
        this.emit('completed', {
            totalDuration,
            completedAt: now,
            overallProgress,
            summary,
            milestones: this.milestones
        });
    }
    /**
     * Report error during analysis
     * Requirement 5.4: Error reporting in progress updates
     */
    reportError(error, phase, operation) {
        const currentPhase = phase || this.phases[this.currentPhaseIndex]?.name || 'unknown';
        if (this.config.enableConsoleOutput) {
            console.error(`\n❌ Error in ${currentPhase}: ${error.message}`);
            if (operation) {
                console.error(`   Operation: ${operation}`);
            }
        }
        this.addMilestone(`error-${Date.now()}`, currentPhase, -1, {
            error: error.message,
            operation,
            stack: error.stack
        });
        this.emit('error', { error, phase: currentPhase, operation });
    }
    /**
     * Report warning during analysis
     * Requirement 5.4: Warning reporting in progress updates
     */
    reportWarning(message, phase, operation) {
        const currentPhase = phase || this.phases[this.currentPhaseIndex]?.name || 'unknown';
        if (this.config.enableConsoleOutput) {
            console.warn(`\n⚠️  Warning in ${currentPhase}: ${message}`);
            if (operation) {
                console.warn(`   Operation: ${operation}`);
            }
        }
        this.addMilestone(`warning-${Date.now()}`, currentPhase, -1, {
            warning: message,
            operation
        });
        this.emit('warning', { message, phase: currentPhase, operation });
    }
    /**
     * Update console output with progress information
     */
    updateConsoleOutput(progress) {
        if (!this.config.enableConsoleOutput) {
            return;
        }
        // Clear previous line and move cursor up
        process.stdout.write('\r\x1b[K');
        let output = '';
        // Progress bar
        if (this.config.enableProgressBar) {
            const progressBar = this.createProgressBar(progress.phaseProgress);
            output += `${progressBar} `;
        }
        // Phase progress
        output += `${progress.phaseProgress.toFixed(1)}% `;
        // Current operation
        if (progress.currentOperation) {
            const maxOpLength = 30;
            const operation = progress.currentOperation.length > maxOpLength
                ? progress.currentOperation.substring(0, maxOpLength - 3) + '...'
                : progress.currentOperation;
            output += `${operation} `;
        }
        // Items processed
        output += `(${progress.itemsProcessed}/${progress.totalItems}) `;
        // Processing rate
        if (this.config.showProcessingRate && progress.processingRate > 0) {
            output += `${progress.processingRate.toFixed(1)}/s `;
        }
        // Estimated time remaining
        if (this.config.showEstimatedTime && progress.estimatedTimeRemaining > 0) {
            output += `ETA: ${this.formatDuration(progress.estimatedTimeRemaining)} `;
        }
        // Memory usage
        if (this.config.showMemoryUsage && progress.memoryUsage) {
            const memMB = (progress.memoryUsage.used / 1024 / 1024).toFixed(1);
            output += `Mem: ${memMB}MB `;
        }
        process.stdout.write(output);
    }
    /**
     * Create ASCII progress bar
     */
    createProgressBar(percentage) {
        const width = this.config.progressBarWidth;
        const filled = Math.round((percentage / 100) * width);
        const empty = width - filled;
        return `[${'█'.repeat(filled)}${' '.repeat(empty)}]`;
    }
    /**
     * Calculate overall progress across all phases
     */
    calculateOverallProgress() {
        const totalWeight = this.phases.reduce((sum, phase) => sum + phase.weight, 0);
        if (totalWeight === 0) {
            return 0;
        }
        let weightedProgress = 0;
        for (const phase of this.phases) {
            const phaseProgress = this.phaseProgress.get(phase.name) || 0;
            weightedProgress += (phaseProgress / 100) * phase.weight;
        }
        return (weightedProgress / totalWeight) * 100;
    }
    /**
     * Estimate remaining time based on current progress
     */
    estimateRemainingTime(overallProgress, elapsedTime, processingRate, remainingItems) {
        if (overallProgress <= 0 || processingRate <= 0) {
            return 0;
        }
        // Use processing rate for current phase
        if (remainingItems > 0 && processingRate > 0) {
            return (remainingItems / processingRate) * 1000;
        }
        // Fallback to overall progress estimation
        const progressRate = overallProgress / elapsedTime; // percent per ms
        const remainingProgress = 100 - overallProgress;
        return remainingProgress / progressRate;
    }
    /**
     * Add milestone to tracking
     */
    addMilestone(name, phase, progress, metadata) {
        const milestone = {
            name,
            timestamp: Date.now(),
            phase,
            progress,
            metadata
        };
        this.milestones.push(milestone);
        if (this.config.enableDetailedLogging) {
            console.log(`📍 Milestone: ${name} (${phase}, ${progress}%)`);
        }
    }
    /**
     * Format duration in human-readable format
     */
    formatDuration(ms) {
        if (ms < 1000) {
            return `${ms}ms`;
        }
        const seconds = Math.floor(ms / 1000);
        if (seconds < 60) {
            return `${seconds}s`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes < 60) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    }
    /**
     * Get progress summary
     */
    getProgressSummary() {
        const overallProgress = this.calculateOverallProgress();
        const currentPhase = this.phases[this.currentPhaseIndex]?.name || 'unknown';
        const elapsedTime = Date.now() - this.startTime;
        const estimatedTimeRemaining = this.estimateRemainingTime(overallProgress, elapsedTime, 0, 0);
        const phasesCompleted = Array.from(this.phaseProgress.values()).filter(p => p >= 100).length;
        return {
            overallProgress,
            currentPhase,
            elapsedTime,
            estimatedTimeRemaining,
            milestonesCount: this.milestones.length,
            phasesCompleted
        };
    }
    /**
     * Get all milestones
     */
    getMilestones() {
        return [...this.milestones];
    }
    /**
     * Reset progress reporter
     */
    reset() {
        this.phases = [];
        this.currentPhaseIndex = 0;
        this.startTime = 0;
        this.lastUpdateTime = 0;
        this.milestones = [];
        this.phaseStartTimes.clear();
        this.phaseProgress.clear();
    }
}
exports.ProgressReporter = ProgressReporter;
//# sourceMappingURL=ProgressReporter.js.map