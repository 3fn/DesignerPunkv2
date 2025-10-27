/**
 * Hook Integration Manager for Release Analysis System
 *
 * Manages automatic triggering of release analysis via Git hooks or Kiro agent hooks.
 * Provides quick feedback for AI agents after task completion commits.
 */
import { AnalysisConfig } from '../config/AnalysisConfig';
export interface HookConfig {
    /** Enable/disable hook integration */
    enabled: boolean;
    /** Type of hook to use */
    hookType: 'git' | 'agent' | 'both';
    /** Use quick mode for faster analysis */
    quickMode: boolean;
    /** Maximum time before giving up (seconds) */
    timeoutSeconds: number;
    /** Don't block commit on failure */
    failSilently: boolean;
    /** Cache results for later CLI access */
    cacheResults: boolean;
}
export interface QuickAnalysisResult {
    /** Version bump recommendation */
    versionBump: 'major' | 'minor' | 'patch' | 'none';
    /** Count of changes by type */
    changeCount: {
        breaking: number;
        features: number;
        fixes: number;
        improvements: number;
    };
    /** Confidence in the analysis (0-1) */
    confidence: number;
    /** Concise one-line summary for AI feedback */
    summary: string;
    /** Whether full result was cached */
    fullResultCached: boolean;
}
export interface HookInstallationResult {
    /** Whether installation was successful */
    success: boolean;
    /** Hook type that was installed */
    hookType: 'git' | 'agent';
    /** Path to installed hook */
    hookPath: string;
    /** Any warnings or messages */
    messages: string[];
}
export interface HookValidationResult {
    /** Whether hook is properly installed */
    valid: boolean;
    /** Hook type being validated */
    hookType: 'git' | 'agent';
    /** Validation errors */
    errors: string[];
    /** Validation warnings */
    warnings: string[];
    /** Hook file permissions */
    permissions?: string;
    /** Whether hook is executable */
    executable?: boolean;
}
export declare class HookIntegrationManager {
    private config;
    private projectRoot;
    private hookConfig;
    constructor(config: AnalysisConfig, hookConfig: HookConfig, projectRoot?: string);
    /**
     * Install Git post-commit hook for automatic analysis
     */
    installGitHook(): Promise<HookInstallationResult>;
    /**
     * Install Kiro agent hook for automatic analysis
     */
    installAgentHook(): Promise<HookInstallationResult>;
    /**
     * Install hook based on configuration
     */
    installHook(hookType: 'git' | 'agent'): Promise<HookInstallationResult>;
    /**
     * Uninstall Git hook
     */
    uninstallGitHook(): Promise<boolean>;
    /**
     * Uninstall agent hook
     */
    uninstallAgentHook(): Promise<boolean>;
    /**
     * Uninstall hook based on type
     */
    uninstallHook(hookType: 'git' | 'agent'): Promise<boolean>;
    /**
     * Validate Git hook installation
     */
    validateGitHook(): Promise<HookValidationResult>;
    /**
     * Validate agent hook installation
     */
    validateAgentHook(): Promise<HookValidationResult>;
    /**
     * Validate hook installation
     */
    validateHookIntegration(): Promise<HookValidationResult>;
    /**
     * Run quick analysis mode
     * Requirement 9.2: Quick analysis completes in <10 seconds
     */
    runQuickAnalysis(): Promise<QuickAnalysisResult>;
    /**
     * Cache analysis result
     * Requirement 9.7: Cache results for later CLI access
     */
    cacheResult(result: any): Promise<void>;
    /**
     * Get cached analysis result
     * Requirement 9.7: Retrieve cached results
     */
    getCachedResult(): Promise<any | null>;
    /**
     * Get current hook configuration
     */
    getHookConfig(): HookConfig;
    /**
     * Update hook configuration
     */
    updateHookConfig(updates: Partial<HookConfig>): void;
    private fileExists;
    private ensureDirectoryExists;
    private generateGitHookScript;
    private generateAgentHookScript;
    private generateAgentHookConfig;
    private integrateWithCommitHook;
    private removeCommitHookIntegration;
}
//# sourceMappingURL=HookIntegrationManager.d.ts.map