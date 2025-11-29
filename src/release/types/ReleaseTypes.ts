/**
 * Core Release Management Types
 * 
 * Defines all data models and type definitions for the release management system
 */

export interface ReleaseSignal {
  /** Type of version bump required */
  type: 'major' | 'minor' | 'patch';
  
  /** What triggered this release signal */
  trigger: 'spec-completion' | 'task-completion' | 'breaking-change' | 'manual';
  
  /** Confidence level in the release decision (0-1) */
  confidence: number;
  
  /** Evidence supporting this release decision */
  evidence: string[];
  
  /** Packages affected by this release */
  affectedPackages: string[];
  
  /** Timestamp when signal was generated */
  timestamp: Date;
  
  /** Source document or event that triggered the signal */
  source: string;
}

export interface ReleaseAnalysis {
  /** Breaking changes detected */
  breakingChanges: BreakingChange[];
  
  /** New features identified */
  newFeatures: Feature[];
  
  /** Bug fixes included */
  bugFixes: BugFix[];
  
  /** General improvements */
  improvements: Improvement[];
  
  /** Suggested version bump based on analysis */
  suggestedVersionBump: 'major' | 'minor' | 'patch';
  
  /** Overall confidence in the analysis */
  confidence: number;
  
  /** Analysis timestamp */
  analyzedAt: Date;
}

export interface BreakingChange {
  /** Breaking change identifier */
  id: string;
  
  /** Title or summary of the breaking change */
  title: string;
  
  /** Detailed description */
  description: string;
  
  /** Migration guidance for users */
  migrationGuidance?: string;
  
  /** Affected APIs or interfaces */
  affectedAPIs: string[];
  
  /** Source document where breaking change was detected */
  source: string;
  
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Feature {
  /** Feature identifier */
  id: string;
  
  /** Feature title */
  title: string;
  
  /** Feature description */
  description: string;
  
  /** Requirements this feature addresses */
  requirements: string[];
  
  /** Artifacts created for this feature */
  artifacts: string[];
  
  /** Source document */
  source: string;
  
  /** Feature category */
  category: 'enhancement' | 'new-functionality' | 'improvement';
}

export interface BugFix {
  /** Bug fix identifier */
  id: string;
  
  /** Bug fix title */
  title: string;
  
  /** Description of what was fixed */
  description: string;
  
  /** Issue or ticket reference */
  issueReference?: string;
  
  /** Source document */
  source: string;
  
  /** Severity of the bug that was fixed */
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Improvement {
  /** Improvement identifier */
  id: string;
  
  /** Improvement title */
  title: string;
  
  /** Description of the improvement */
  description: string;
  
  /** Type of improvement */
  type: 'performance' | 'usability' | 'maintainability' | 'documentation' | 'other';
  
  /** Source document */
  source: string;
}

export interface VersionBump {
  /** Current version */
  from: string;
  
  /** New version */
  to: string;
  
  /** Type of version bump */
  type: 'major' | 'minor' | 'patch';
  
  /** Pre-release information if applicable */
  preRelease?: PreReleaseInfo;
  
  /** Rationale for this version bump */
  rationale: string;
  
  /** Timestamp of version bump calculation */
  calculatedAt: Date;
}

export interface PreReleaseInfo {
  /** Pre-release type */
  type: 'alpha' | 'beta' | 'rc';
  
  /** Pre-release number */
  number: number;
  
  /** Full pre-release identifier */
  identifier: string;
}

export interface PackageVersion {
  /** Package name */
  name: string;
  
  /** Current version */
  currentVersion: string;
  
  /** Proposed new version */
  proposedVersion: string;
  
  /** Package dependencies */
  dependencies: Dependency[];
  
  /** Package path in the repository */
  path: string;
  
  /** Whether this package needs to be published */
  needsPublishing: boolean;
}

export interface Dependency {
  /** Dependency package name */
  name: string;
  
  /** Current version requirement */
  currentVersion: string;
  
  /** New version requirement */
  newVersion?: string;
  
  /** Dependency type */
  type: 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies';
}

export interface ReleaseNotes {
  /** Release version */
  version: string;
  
  /** Release date */
  date: string;
  
  /** Release summary */
  summary: string;
  
  /** Breaking changes in this release */
  breakingChanges: BreakingChange[];
  
  /** New features in this release */
  newFeatures: Feature[];
  
  /** Improvements in this release */
  improvements: Improvement[];
  
  /** Bug fixes in this release */
  bugFixes: BugFix[];
  
  /** Migration guide for breaking changes */
  migrationGuide?: MigrationGuide;
  
  /** Release notes format */
  format: 'markdown' | 'html' | 'text';
  
  /** Generated release notes content */
  content: string;
}

export interface MigrationGuide {
  /** Migration guide version */
  version: string;
  
  /** Migration steps */
  steps: MigrationStep[];
  
  /** Code examples */
  examples: CodeExample[];
  
  /** Additional resources */
  resources: string[];
}

export interface MigrationStep {
  /** Step number */
  step: number;
  
  /** Step title */
  title: string;
  
  /** Step description */
  description: string;
  
  /** Code changes required */
  codeChanges?: string[];
  
  /** Configuration changes required */
  configChanges?: string[];
}

export interface CodeExample {
  /** Example title */
  title: string;
  
  /** Before code */
  before: string;
  
  /** After code */
  after: string;
  
  /** Programming language */
  language: string;
  
  /** Example description */
  description?: string;
}

export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  
  /** Validation errors */
  errors: ValidationError[];
  
  /** Validation warnings */
  warnings: ValidationWarning[];
  
  /** Validation timestamp */
  validatedAt: Date;
  
  /** Validation context */
  context: string;
}

export interface ValidationError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Error severity */
  severity: 'error' | 'warning' | 'info';
  
  /** Source of the error */
  source?: string;
  
  /** Suggested fix */
  suggestion?: string;
}

export interface ValidationWarning {
  /** Warning code */
  code: string;
  
  /** Warning message */
  message: string;
  
  /** Source of the warning */
  source?: string;
  
  /** Suggested action */
  suggestion?: string;
}

export interface ReleasePlan {
  /** Version bump information */
  version: VersionBump;
  
  /** Package updates required */
  packages: PackageUpdate[];
  
  /** Generated release notes */
  releaseNotes: ReleaseNotes;
  
  /** Publishing plan */
  publishingPlan: PublishingPlan;
  
  /** Validation results */
  validationResults: ValidationResult[];
  
  /** Plan creation timestamp */
  createdAt: Date;
  
  /** Plan identifier */
  id: string;
}

export interface PackageUpdate {
  /** Package name */
  name: string;
  
  /** Version bump for this package */
  versionBump: VersionBump;
  
  /** Dependency updates required */
  dependencyUpdates: DependencyUpdate[];
  
  /** Whether this package needs publishing */
  needsPublishing: boolean;
  
  /** Publishing order priority */
  publishingPriority: number;
}

export interface DependencyUpdate {
  /** Dependency name */
  name: string;
  
  /** Current version requirement */
  from: string;
  
  /** New version requirement */
  to: string;
  
  /** Update type */
  type: 'major' | 'minor' | 'patch' | 'exact';
  
  /** Update rationale */
  rationale: string;
}

export interface PublishingPlan {
  /** Publishing order */
  order: string[];
  
  /** Parallel publishing groups */
  parallelGroups: string[][];
  
  /** Estimated publishing duration */
  estimatedDuration: number;
  
  /** Publishing steps */
  steps: PublishingStep[];
}

export interface PublishingStep {
  /** Step number */
  step: number;
  
  /** Step type */
  type: 'build' | 'test' | 'tag' | 'npm-publish' | 'github-release' | 'artifact-upload';
  
  /** Packages involved in this step */
  packages: string[];
  
  /** Step description */
  description: string;
  
  /** Estimated duration for this step */
  estimatedDuration: number;
  
  /** Whether this step can run in parallel with others */
  canRunInParallel: boolean;
}

export interface ReleaseResult {
  /** Whether the release was successful */
  success: boolean;
  
  /** Release version */
  version: string;
  
  /** Packages that were released */
  releasedPackages: string[];
  
  /** GitHub release URL */
  githubReleaseUrl?: string;
  
  /** npm package URLs */
  npmPackageUrls: string[];
  
  /** Release duration in milliseconds */
  duration: number;
  
  /** Release errors if any */
  errors: ReleaseError[];
  
  /** Release timestamp */
  releasedAt: Date;
}

export interface ReleaseError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Error severity */
  severity: 'error' | 'warning';
  
  /** Package that caused the error */
  package?: string;
  
  /** Step where error occurred */
  step?: string;
  
  /** Stack trace if available */
  stackTrace?: string;
}

export interface ReleaseTrigger {
  /** Trigger type */
  type: 'automatic' | 'manual';
  
  /** Source of the trigger */
  source: string;
  
  /** Trigger timestamp */
  triggeredAt: Date;
  
  /** User who triggered (for manual triggers) */
  triggeredBy?: string;
  
  /** Configuration overrides */
  overrides?: ReleaseOverrides;
}

export interface ReleaseOverrides {
  /** Force specific version bump type */
  forceBumpType?: 'major' | 'minor' | 'patch';
  
  /** Force specific version */
  forceVersion?: string;
  
  /** Skip validation steps */
  skipValidation?: boolean;
  
  /** Skip specific packages */
  skipPackages?: string[];
  
  /** Custom release notes */
  customReleaseNotes?: string;
  
  /** Dry run mode */
  dryRun?: boolean;
  
  /** Resume from specific stage (for crash recovery) */
  resumeFromStage?: string;
  
  /** Workflow ID to resume (for crash recovery) */
  workflowId?: string;
  
  /** Analyze changes since specific commit/tag */
  since?: string;
}

export interface CoordinationPlan {
  packages: PackageUpdate[];
  dependencyUpdates: DependencyUpdate[];
  publishingOrder: string[];
  conflicts: VersionConflict[];
  strategy: CoordinationStrategy;
}

export interface CoordinationStrategy {
  corePackageSync: boolean;
  componentIndependence: boolean;
  dependencyUpdates: 'automatic' | 'manual' | 'prompt';
  corePackages: string[];
  independentPackages: string[];
}

export interface CompatibilityReport {
  compatible: boolean;
  issues: CompatibilityIssue[];
  warnings: CompatibilityWarning[];
  recommendations: string[];
}

export interface CompatibilityIssue {
  package: string;
  dependency: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

export interface CompatibilityWarning {
  package: string;
  message: string;
  impact: 'low' | 'medium' | 'high';
}

export interface VersionConflict {
  package: string;
  dependency: string;
  currentVersion: string;
  requiredVersion: string;
  conflictType: 'major' | 'minor' | 'patch' | 'incompatible';
}

export interface GitHubRelease {
  tagName: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  artifacts: Artifact[];
}

export interface GitTag {
  name: string;
  message: string;
  commit: string;
}

export interface Artifact {
  name: string;
  path: string;
  contentType: string;
  size: number;
}

export interface PackagePublish {
  name: string;
  version: string;
  path: string;
  registry: string;
  access: 'public' | 'restricted';
}

export interface TagResult {
  success: boolean;
  tagName: string;
  error?: string;
}

export interface UploadResult {
  success: boolean;
  artifactName: string;
  url?: string;
  error?: string;
}

export interface PublishResult {
  success: boolean;
  packageName: string;
  version: string;
  url?: string;
  error?: string;
}

export interface RollbackResult {
  success: boolean;
  rolledBackComponents: string[];
  errors: ReleaseError[];
  duration: number;
}