/**
 * Build Workflow Module
 * 
 * Provides development workflow integration including source maps,
 * build modes, CI/CD integration, and configuration helpers.
 * 
 * @module build/workflow
 */

export {
  SourceMapGenerator,
  type SourceMapOptions,
  type PlatformSourceMapConfig,
  type SourceMapResult,
} from './SourceMapGenerator';

export {
  BuildModeManager,
  type BuildModeConfig,
  type PlatformOptimizations,
  type iOSOptimizations,
  type AndroidOptimizations,
  type WebOptimizations,
} from './BuildMode';

export {
  CICDIntegration,
  CICDExitCode,
  createDefaultCICDConfig,
  detectCICDEnvironment,
  type CICDConfig,
  type CICDBuildReport,
  type CICDPlatformResult,
  type CICDError,
} from './CICDIntegration';

export {
  ConfigHelpers,
  type ConfigTemplate,
  type MigrationResult,
  type ConfigDocEntry,
} from './ConfigHelpers';
