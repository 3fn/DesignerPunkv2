/**
 * Package Coordination Types
 * 
 * Extended type definitions for multi-package version coordination.
 * These types extend the base types from ReleaseTypes with coordination-specific properties.
 */

import type { PackageUpdate as BasePackageUpdate, DependencyUpdate as BaseDependencyUpdate } from '../types/ReleaseTypes';

/**
 * Package version information (coordination-specific)
 */
export interface PackageVersion {
  name: string;
  currentVersion: string;
  path: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/**
 * Package update information (coordination-specific)
 * Extends base PackageUpdate with coordination-specific fields
 */
export interface PackageUpdate {
  name: string;
  currentVersion: string;
  newVersion: string;
  path: string;
  bumpType: 'major' | 'minor' | 'patch' | 'none';
  reason: string;
}

/**
 * Dependency update information (coordination-specific)
 */
export interface DependencyUpdate {
  package: string;
  dependency: string;
  currentVersion: string;
  newVersion: string;
  type: 'dependencies' | 'devDependencies' | 'peerDependencies';
}

/**
 * Version conflict information
 */
export interface VersionConflict {
  package: string;
  conflictType: 'circular' | 'incompatible' | 'missing';
  description: string;
  affectedPackages: string[];
  suggestedResolution?: string;
}

/**
 * Coordination strategy configuration
 */
export interface CoordinationStrategy {
  /** Keep core packages synchronized */
  corePackageSync: boolean;
  /** Allow component packages independent versioning */
  componentIndependence: boolean;
  /** Dependency update strategy */
  dependencyUpdates: 'automatic' | 'manual' | 'prompt';
  /** List of core packages to synchronize */
  corePackages?: string[];
  /** List of independent packages */
  independentPackages?: string[];
}

/**
 * Coordination plan result
 */
export interface CoordinationPlan {
  /** Package updates to apply */
  packages: PackageUpdate[];
  /** Dependency updates to apply */
  dependencyUpdates: DependencyUpdate[];
  /** Publishing order for packages */
  publishingOrder: string[];
  /** Detected conflicts */
  conflicts: VersionConflict[];
  /** Coordination strategy used */
  strategy: CoordinationStrategy;
}

/**
 * Compatibility report
 */
export interface CompatibilityReport {
  compatible: boolean;
  issues: CompatibilityIssue[];
  warnings: CompatibilityWarning[];
}

/**
 * Compatibility issue
 */
export interface CompatibilityIssue {
  severity: 'error' | 'warning';
  package: string;
  dependency: string;
  description: string;
  suggestedFix?: string;
}

/**
 * Compatibility warning
 */
export interface CompatibilityWarning {
  package: string;
  message: string;
  recommendation?: string;
}

/**
 * Publishing plan (coordination-specific)
 */
export interface PublishingPlan {
  /** Publishing order (packages grouped by dependency level) */
  order: string[][];
  /** Total packages to publish */
  totalPackages: number;
  /** Estimated duration in seconds */
  estimatedDuration: number;
}
