#!/usr/bin/env node
/**
 * Advanced Release Analysis CLI
 *
 * Enhanced command-line interface with interactive features, configuration management,
 * analysis history, and advanced workflow capabilities.
 */
import { AnalysisOptions, AnalysisResult, AnalysisScope } from '../types/AnalysisTypes';
/**
 * Interactive CLI options for advanced features
 */
export interface InteractiveOptions {
    /** Enable interactive mode for reviewing uncertain changes */
    interactive?: boolean;
    /** Auto-approve low-confidence items */
    autoApprove?: boolean;
    /** Skip confirmation prompts */
    skipConfirmation?: boolean;
    /** Review threshold for interactive mode */
    reviewThreshold?: number;
}
/**
 * Configuration management options
 */
export interface ConfigOptions {
    /** Show current configuration */
    show?: boolean;
    /** Set configuration value */
    set?: {
        key: string;
        value: any;
    };
    /** Reset to default configuration */
    reset?: boolean;
    /** Validate configuration */
    validate?: boolean;
    /** Configuration file path */
    configPath?: string;
}
/**
 * Analysis history options
 */
export interface HistoryOptions {
    /** List previous analyses */
    list?: boolean;
    /** Compare with previous analysis */
    compare?: string;
    /** Show analysis details */
    show?: string;
    /** Clear analysis history */
    clear?: boolean;
    /** Maximum number of analyses to keep */
    maxHistory?: number;
}
/**
 * Analysis history entry
 */
export interface AnalysisHistoryEntry {
    id: string;
    timestamp: Date;
    scope: AnalysisScope;
    result: AnalysisResult;
    options: AnalysisOptions;
    duration: number;
}
/**
 * Analysis comparison result
 */
export interface AnalysisComparison {
    previous: AnalysisHistoryEntry;
    current: AnalysisResult;
    differences: {
        versionChange: boolean;
        changeCountDifference: number;
        newBreakingChanges: number;
        newFeatures: number;
        newBugFixes: number;
        confidenceChange: number;
    };
}
/**
 * Advanced CLI class with interactive features
 */
export declare class AdvancedReleaseCLI {
    private configPath;
    private historyPath;
    private workingDirectory;
    private config;
    private rl;
    constructor(workingDirectory?: string);
    /**
     * Enhanced analyze command with interactive features
     */
    analyzeChanges(options?: AnalysisOptions & InteractiveOptions): Promise<AnalysisResult>;
    /**
     * Interactive review of uncertain changes
     */
    private interactiveReview;
    /**
     * Preview analysis scope without full extraction
     */
    private previewAnalysis;
    /**
     * Show analysis preview
     */
    private showAnalysisPreview;
    /**
     * Configuration management commands
     */
    manageConfiguration(options: ConfigOptions): Promise<void>;
    /**
     * Show current configuration
     */
    private showConfiguration;
    /**
     * Set configuration value
     */
    private setConfigurationValue;
    /**
     * Reset configuration to defaults
     */
    private resetConfiguration;
    /**
     * Validate configuration
     */
    private validateConfiguration;
    /**
     * Analysis history management
     */
    manageHistory(options: HistoryOptions): Promise<void>;
    /**
     * List analysis history
     */
    private listAnalysisHistory;
    /**
     * Compare current analysis with historical entry
     */
    private compareWithHistory;
    /**
     * Show detailed history entry
     */
    private showHistoryEntry;
    /**
     * Clear analysis history
     */
    private clearAnalysisHistory;
    /**
     * Enhanced argument parsing with advanced options
     */
    private parseAdvancedArguments;
    /**
     * Enhanced main CLI entry point
     */
    run(args?: string[]): Promise<void>;
    private determineAnalysisScope;
    private findAllCompletionDocuments;
    private getCurrentVersion;
    private calculateConfidenceMetrics;
    private loadConfiguration;
    private saveConfiguration;
    private loadAnalysisHistory;
    private saveToHistory;
    private createComparison;
    private showComparison;
    private promptUser;
    private promptVersionOverride;
    private calculateMinorBump;
    private calculatePatchBump;
    private createEmptyResult;
    private createFallbackResult;
    showDetailedReport(result: AnalysisResult): void;
    showSummaryReport(result: AnalysisResult): void;
    showJSONReport(result: AnalysisResult): void;
    showAdvancedHelp(): void;
}
declare function main(): Promise<void>;
export { main as runAdvancedAnalysisCli };
//# sourceMappingURL=AdvancedReleaseCLI.d.ts.map