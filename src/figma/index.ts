/**
 * Figma integration module.
 *
 * Provides token sync workflow, Console MCP client interface,
 * and pre-flight checks for pushing tokens to Figma.
 */

export { TokenSyncWorkflow, BATCH_SIZE } from './TokenSyncWorkflow';
export type {
  SyncOptions,
  SyncResult,
  SyncError,
  DriftReport,
  DriftedVariable,
  VariableSyncResult,
  StyleSyncResult,
} from './TokenSyncWorkflow';

export type { ConsoleMCPClient, ConsoleMCPStatus, DesignTokenSetupPayload, FigmaStyleData, FigmaComponentData } from './ConsoleMCPClient';
export { ConsoleMCPClientImpl } from './ConsoleMCPClientImpl';
export type { ConsoleMCPClientOptions } from './ConsoleMCPClientImpl';

export { checkDesktopBridge } from './preflight';
export type { PreflightResult } from './preflight';

export { formatDriftReport, formatPartialFailure, formatValue } from './error-reporting';
export type { PartialFailureInfo } from './error-reporting';

export { TokenTranslator, figmaNameToTokenPath } from './TokenTranslator';
export type { TranslationResult, TokenCategory, ClassificationSummary } from './TokenTranslator';
export { parseRgba, parseHex, rgbToLab, deltaE } from './TokenTranslator';

export { VariantAnalyzer } from './VariantAnalyzer';
export type {
  FigmaVariant,
  FigmaComponent,
  FamilyPattern,
  ComponentStatus,
  ExtractionContext,
  MappingRecommendation,
  MappingConflict,
  VariantMapping,
  MCPDocClient,
} from './VariantAnalyzer';

export { DesignExtractor } from './DesignExtractor';
export type {
  BoundVariableEntry,
  TokenReference,
  TokenUsage,
  TokenBinding,
  FigmaStyle,
  VariantDefinition,
  StateDefinition,
  PropertyDefinition,
  InheritancePattern,
  BehavioralContractStatus,
  PlatformParityCheck,
  PlatformInteraction,
  ComponentTokenDecision,
  ModeValidationResult,
  ModeDiscrepancy,
  ConfidenceReport,
  DesignOutline,
  ConfidenceLevel,
  MatchMethod,
  KiroFigmaPowerClient,
  DesignContextResponse,
  MetadataResponse,
  FigmaComponentResponse,
  ExtractedComponent,
  ExtractedLayout,
} from './DesignExtractor';

export type {
  ClassificationTier,
  ClassifiedToken,
  UnidentifiedReason,
  UnidentifiedValue,
  FigmaNodeType,
  NodeWithClassifications,
  CompositionPattern,
  UnresolvedBindingReason,
  UnresolvedBinding,
  ScreenshotMetadata,
  ComponentAnalysis,
} from './ComponentAnalysis';