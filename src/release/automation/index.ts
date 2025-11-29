/**
 * Release Automation Layer
 * 
 * Provides automation for:
 * - Package.json version updates
 * - CHANGELOG.md management
 * - Git operations (commit, tag, push)
 * 
 * All components support atomic updates with rollback on failure.
 */

export { PackageUpdater } from './PackageUpdater';
export type {
  PackageJsonData,
  PackageUpdateResult,
  PackageUpdateError,
  PackageBackup
} from './PackageUpdater';

export { ChangelogManager } from './ChangelogManager';
export type {
  ChangelogEntry,
  ChangelogUpdateResult,
  ChangelogError
} from './ChangelogManager';

export { GitOperations } from './GitOperations';
export type {
  GitCommitOptions,
  GitTagOptions,
  GitPushOptions,
  GitOperationResult,
  GitError,
  GitRollbackState
} from './GitOperations';
