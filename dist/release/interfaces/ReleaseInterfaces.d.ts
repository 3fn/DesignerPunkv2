/**
 * Release Management Interfaces
 *
 * Defines the core interfaces for all release management components
 */
import { ReleaseSignal, ReleaseAnalysis, VersionBump, PackageVersion, ReleaseNotes, ValidationResult, ReleasePlan, ReleaseResult, ReleaseTrigger, PublishingPlan, CoordinationPlan, CoordinationStrategy, CompatibilityReport, DependencyUpdate, VersionConflict, GitHubRelease, GitTag, Artifact, PackagePublish, TagResult, UploadResult, PublishResult, RollbackResult } from '../types/ReleaseTypes';
/**
 * Release Detection Interface
 *
 * Monitors workflow events and analyzes completion documentation
 * to detect when releases should occur
 */
export interface ReleaseDetector {
    /**
     * Detect release signal from task completion
     */
    detectReleaseFromTaskCompletion(taskPath: string, taskName: string): Promise<ReleaseSignal | null>;
    /**
     * Detect release signal from spec completion
     */
    detectReleaseFromSpecCompletion(specPath: string): Promise<ReleaseSignal | null>;
    /**
     * Analyze completion documents for release-relevant information
     */
    analyzeCompletionDocuments(documentsPath: string): Promise<ReleaseAnalysis>;
    /**
     * Validate that a release signal is ready for processing
     */
    validateReleaseReadiness(signal: ReleaseSignal): Promise<ValidationResult>;
    /**
     * Get confidence score for a potential release
     */
    calculateConfidence(analysis: ReleaseAnalysis): number;
}
/**
 * Version Calculator Interface
 *
 * Calculates semantic version bumps based on release signals
 * and maintains version consistency across packages
 */
export interface VersionCalculator {
    /**
     * Calculate version bump based on release signal
     */
    calculateVersionBump(signal: ReleaseSignal, currentVersion: string): Promise<VersionBump>;
    /**
     * Validate semantic versioning compliance
     */
    validateSemanticVersioning(bump: VersionBump): Promise<ValidationResult>;
    /**
     * Resolve version conflicts between packages
     */
    resolveVersionConflicts(packages: PackageVersion[]): Promise<ResolutionStrategy>;
    /**
     * Generate pre-release version
     */
    generatePreReleaseVersion(baseVersion: string, type: PreReleaseType): string;
    /**
     * Get next version based on current version and bump type
     */
    getNextVersion(currentVersion: string, bumpType: 'major' | 'minor' | 'patch'): string;
    /**
     * Validate version format
     */
    validateVersionFormat(version: string): boolean;
}
/**
 * Release Note Generator Interface
 *
 * Extracts content from completion documentation and generates
 * comprehensive, formatted release notes
 */
export interface ReleaseNoteGenerator {
    /**
     * Generate release notes from completion documents
     */
    generateFromCompletionDocs(documentsPath: string, analysis: ReleaseAnalysis): Promise<ReleaseNotes>;
    /**
     * Extract feature descriptions from completion document
     */
    extractFeatureDescriptions(completionDoc: string): Promise<Feature[]>;
    /**
     * Extract breaking changes from completion document
     */
    extractBreakingChanges(completionDoc: string): Promise<BreakingChange[]>;
    /**
     * Format release notes using template
     */
    formatReleaseNotes(notes: ReleaseNotes, template: ReleaseTemplate): Promise<string>;
    /**
     * Generate migration guide for breaking changes
     */
    generateMigrationGuide(breakingChanges: BreakingChange[]): Promise<MigrationGuide>;
    /**
     * Validate release notes content
     */
    validateReleaseNotes(notes: ReleaseNotes): Promise<ValidationResult>;
}
/**
 * Package Coordinator Interface
 *
 * Manages versioning and dependency relationships across
 * multiple packages in the DesignerPunk ecosystem
 */
export interface PackageCoordinator {
    /**
     * Coordinate versions across packages
     */
    coordinateVersions(packages: PackageVersion[], strategy: CoordinationStrategy): Promise<CoordinationPlan>;
    /**
     * Update dependencies based on coordination plan
     */
    updateDependencies(plan: CoordinationPlan): Promise<DependencyUpdate[]>;
    /**
     * Validate package compatibility
     */
    validatePackageCompatibility(packages: PackageVersion[]): Promise<CompatibilityReport>;
    /**
     * Generate publishing order based on dependencies
     */
    generatePublishingOrder(packages: PackageVersion[]): Promise<PublishingPlan>;
    /**
     * Detect dependency conflicts
     */
    detectDependencyConflicts(packages: PackageVersion[]): Promise<VersionConflict[]>;
    /**
     * Resolve dependency conflicts
     */
    resolveDependencyConflicts(conflicts: VersionConflict[]): Promise<ResolutionStrategy>;
}
/**
 * GitHub Publisher Interface
 *
 * Handles all GitHub API interactions for creating releases,
 * tags, and publishing artifacts
 */
export interface GitHubPublisher {
    /**
     * Create GitHub release
     */
    createRelease(release: GitHubRelease): Promise<ReleaseResult>;
    /**
     * Create Git tags
     */
    createTags(tags: GitTag[]): Promise<TagResult[]>;
    /**
     * Upload artifacts to GitHub release
     */
    uploadArtifacts(releaseId: string, artifacts: Artifact[]): Promise<UploadResult[]>;
    /**
     * Publish packages to npm
     */
    publishToNpm(packages: PackagePublish[]): Promise<PublishResult[]>;
    /**
     * Validate GitHub authentication
     */
    validateAuthentication(): Promise<boolean>;
    /**
     * Get repository information
     */
    getRepositoryInfo(): Promise<RepositoryInfo>;
    /**
     * Check if release already exists
     */
    releaseExists(tagName: string): Promise<boolean>;
}
/**
 * Release Manager Interface
 *
 * Orchestrates the entire release process and coordinates
 * between all components
 */
export interface ReleaseManager {
    /**
     * Execute complete release process
     */
    executeRelease(trigger: ReleaseTrigger): Promise<ReleaseResult>;
    /**
     * Validate release plan before execution
     */
    validateRelease(plan: ReleasePlan): Promise<ValidationResult>;
    /**
     * Rollback release if something goes wrong
     */
    rollbackRelease(releaseId: string): Promise<RollbackResult>;
    /**
     * Get release plan without executing
     */
    getReleasePlan(signal: ReleaseSignal): Promise<ReleasePlan>;
    /**
     * Get release status
     */
    getReleaseStatus(releaseId: string): Promise<ReleaseStatus>;
    /**
     * Cancel ongoing release
     */
    cancelRelease(releaseId: string): Promise<boolean>;
}
export interface PreReleaseType {
    type: 'alpha' | 'beta' | 'rc';
}
export interface ResolutionStrategy {
    strategy: 'automatic' | 'manual' | 'skip';
    resolutions: Resolution[];
    conflicts: VersionConflict[];
}
export interface Resolution {
    package: string;
    conflict: string;
    resolution: string;
    rationale: string;
}
export interface ReleaseTemplate {
    name: string;
    format: 'markdown' | 'html' | 'text';
    sections: TemplateSection[];
    variables: TemplateVariable[];
}
export interface TemplateSection {
    name: string;
    title: string;
    content: string;
    required: boolean;
    order: number;
}
export interface TemplateVariable {
    name: string;
    description: string;
    defaultValue?: string;
    required: boolean;
}
export interface RepositoryInfo {
    owner: string;
    name: string;
    fullName: string;
    defaultBranch: string;
    private: boolean;
    url: string;
}
export interface ReleaseStatus {
    id: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    currentStep: string;
    startedAt: Date;
    completedAt?: Date;
    errors: ReleaseError[];
}
export interface PackageUpdate {
    name: string;
    versionBump: VersionBump;
    dependencyUpdates: DependencyUpdate[];
    needsPublishing: boolean;
    publishingPriority: number;
}
export interface MigrationGuide {
    version: string;
    steps: MigrationStep[];
    examples: CodeExample[];
    resources: string[];
}
export interface MigrationStep {
    step: number;
    title: string;
    description: string;
    codeChanges?: string[];
    configChanges?: string[];
}
export interface CodeExample {
    title: string;
    before: string;
    after: string;
    language: string;
    description?: string;
}
export interface Feature {
    id: string;
    title: string;
    description: string;
    requirements: string[];
    artifacts: string[];
    source: string;
    category: 'enhancement' | 'new-functionality' | 'improvement';
}
export interface BreakingChange {
    id: string;
    title: string;
    description: string;
    migrationGuidance?: string;
    affectedAPIs: string[];
    source: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}
export interface ReleaseError {
    code: string;
    message: string;
    severity: 'error' | 'warning';
    package?: string;
    step?: string;
    stackTrace?: string;
}
//# sourceMappingURL=ReleaseInterfaces.d.ts.map