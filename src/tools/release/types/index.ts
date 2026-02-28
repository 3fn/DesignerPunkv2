/**
 * Shared types for the release tool pipeline.
 *
 * Organized into three sections:
 * 1. Pipeline types — the new system's domain model (design.md interfaces)
 * 2. Calculator types — shapes consumed by the extracted VersionCalculator
 * 3. Publisher types — shapes consumed by the extracted publishers
 */

// ============================================================
// 1. PIPELINE TYPES — new release tool domain model
// ============================================================

/** Git tag information from TagResolver */
export interface TagInfo {
  tag: string;
  commit: string;
  date: string;
}

/** Parsed summary document from SummaryScanner */
export interface SummaryDoc {
  path: string;
  specName: string;
  taskNumber: number;
  raw: string;
}

/** Extracted change from a single summary doc (ChangeExtractor output) */
export interface ExtractedChange {
  specName: string;
  taskTitle: string;
  taskType: string;
  whatWasDone: string;
  whyItMatters: string;
  keyChanges: string[];
  impact: string[];
  deliverables?: DeliverableEntry[];
}

/** Structured deliverable from optional ## Deliverables section */
export interface DeliverableEntry {
  priority: '🔴' | '🟡' | '🔵';
  type: string;
  description: string;
}

/** Priority tier for change classification */
export type Priority = 'breaking' | 'prominent' | 'context';

/** Classified change (ChangeClassifier output) */
export interface ClassifiedChange {
  change: ExtractedChange;
  priority: Priority;
  deliverableType: string;
}

/** Pipeline-level version recommendation */
export interface PipelineRecommendation {
  currentVersion: string;
  recommendedVersion: string;
  bumpType: 'major' | 'minor' | 'patch' | 'none';
  rationale: string;
  confidence: number;
  changes: ClassifiedChange[];
}

/** Rendered release notes (NotesRenderer output) */
export interface RenderedNotes {
  public: string;
  internal: string;
  json: ReleaseData;
}

/** Structured intermediate for testability */
export interface ReleaseData {
  version: string;
  previousVersion: string;
  date: string;
  changes: ClassifiedChange[];
  recommendation: PipelineRecommendation;
}

/** Release tool configuration */
export interface ReleaseConfig {
  npmPublishEnabled: boolean;
  repoUrl: string;
  outputDir: string;
}

// ============================================================
// 2. CALCULATOR TYPES — extracted VersionCalculator shapes
// ============================================================

export interface BreakingChange {
  id: string;
  title: string;
  description: string;
  affectedAPIs: string[];
  migrationGuidance?: string;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  requirements: string[];
  artifacts: string[];
  source: string;
  category: string;
}

export interface BugFix {
  id: string;
  title: string;
  description: string;
  issueReference?: string;
  affectedComponents: string[];
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Improvement {
  id: string;
  title: string;
  description: string;
  type: 'performance' | 'usability' | 'maintainability' | 'security' | 'accessibility' | 'other';
  impact: 'low' | 'medium' | 'high';
  source: string;
}

export interface DocumentationChange {
  id: string;
  title: string;
  description: string;
  type: 'readme' | 'api-docs' | 'examples' | 'comments' | 'other';
  source: string;
}

export interface ExtractedChanges {
  breakingChanges: BreakingChange[];
  newFeatures: Feature[];
  bugFixes: BugFix[];
  improvements: Improvement[];
  documentation: DocumentationChange[];
  metadata: ExtractionMetadata;
}

export interface ExtractionMetadata {
  documentsAnalyzed: number;
  extractionConfidence: number;
  ambiguousItems: string[];
  filteredItems: string[];
}

export interface VersionRecommendation {
  currentVersion: string;
  recommendedVersion: string;
  bumpType: 'major' | 'minor' | 'patch' | 'none';
  rationale: string;
  confidence: number;
  evidence: ChangeEvidence[];
  preReleaseInfo?: PreReleaseInfo;
}

export interface ChangeEvidence {
  type: 'breaking' | 'feature' | 'fix' | 'improvement';
  description: string;
  source: string;
  impact: 'high' | 'medium' | 'low';
  count?: number;
}

export interface PreReleaseInfo {
  isPreRelease: boolean;
  preReleaseType?: 'alpha' | 'beta' | 'rc';
  preReleaseNumber?: number;
  canPromote?: boolean;
  nextPreRelease?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  preRelease: string | null;
  build: string | null;
  raw: string;
}

// ============================================================
// 3. PUBLISHER TYPES — extracted publisher shapes
// ============================================================

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

export interface ReleaseResult {
  success: boolean;
  version: string;
  releasedPackages: string[];
  githubReleaseUrl?: string;
  npmPackageUrls: string[];
  duration: number;
  errors: ReleaseError[];
  releasedAt: Date;
}

export interface ReleaseError {
  code: string;
  message: string;
  severity: 'error' | 'warning';
  package?: string;
  step?: string;
  stackTrace?: string;
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

export interface RepositoryInfo {
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  private: boolean;
  url: string;
}

export interface PackagePublish {
  name: string;
  version: string;
  path: string;
  registry: string;
  access: 'public' | 'restricted';
}

export interface PublishResult {
  success: boolean;
  packageName: string;
  version: string;
  url?: string;
  error?: string;
}
