/**
 * Error reporting utilities for Figma token sync.
 *
 * Provides formatted, human-readable error messages for drift detection,
 * partial failures, and Desktop Bridge issues. Each formatter returns
 * a string suitable for console output.
 *
 * @see Design: .kiro/specs/054a-figma-token-push/design.md (Error Handling)
 * @requirements Req 5 (Drift Detection), Req 9 (Error Handling)
 */

import type { DriftReport } from './TokenSyncWorkflow';

// ---------------------------------------------------------------------------
// Drift error reporting — Task 6.1
// ---------------------------------------------------------------------------

/**
 * Format a drift report into a human-readable error message.
 *
 * Includes:
 * - Summary count of drifted variables
 * - Per-variable details (name, expected, actual)
 * - Resolution options (revert, force override, create token)
 *
 * @param report - Drift report from TokenSyncWorkflow.detectDrift()
 * @returns Formatted multi-line string for console output
 *
 * @requirements Req 5 (Drift Detection), Req 9 (Error Handling)
 */
export function formatDriftReport(report: DriftReport): string {
  if (!report.hasDrift || report.driftedVariables.length === 0) {
    return '✅ No drift detected — Figma matches expected state.';
  }

  const count = report.driftedVariables.length;
  const lines: string[] = [];

  lines.push(
    `Drift detected: ${count} variable${count === 1 ? ' has' : 's have'} been edited in Figma since last push`,
  );
  lines.push('');
  lines.push('Drifted variables:');

  for (const dv of report.driftedVariables) {
    const expected = formatValue(dv.expectedValue);
    const actual = formatValue(dv.actualValue);
    lines.push(`  - ${dv.name}: Expected ${expected}, found ${actual} (edited in Figma)`);
  }

  lines.push('');
  lines.push('Resolution options:');
  lines.push('  1. Revert changes in Figma, then re-run: npm run figma:push');
  lines.push('  2. Force override (Figma changes will be lost): npm run figma:push -- --force');
  lines.push('  3. If these values should be tokens, create them through the spec process first');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Partial failure error reporting — Task 6.2
// ---------------------------------------------------------------------------

/**
 * Options describing a partial sync failure for formatting.
 */
export interface PartialFailureInfo {
  /** Number of variables/styles successfully created before the failure. */
  createdCount: number;
  /** The 1-indexed batch number that failed. */
  failedBatch: number;
  /** Total number of batches in the sync operation. */
  totalBatches: number;
  /** Human-readable error message from the failed batch. */
  errorMessage: string;
  /** Number of variables/styles remaining after the failed batch. */
  remainingCount: number;
}

/**
 * Format a partial sync failure into a human-readable error report.
 *
 * Includes:
 * - What succeeded (created count, completed batch range)
 * - What failed (batch number, error message)
 * - What remains (remaining count, remaining batch range)
 * - Recovery command (--resume flag with failed batch number)
 *
 * @param info - Details of the partial failure
 * @returns Formatted multi-line string for console output
 *
 * @requirements Req 9 (Error Handling and Recovery)
 */
export function formatPartialFailure(info: PartialFailureInfo): string {
  const lines: string[] = [];

  lines.push('Sync completed with errors:');
  lines.push('');

  // What succeeded
  if (info.failedBatch > 1) {
    const completedRange = `batch${info.failedBatch - 1 === 1 ? '' : 'es'} 1${info.failedBatch - 1 > 1 ? `-${info.failedBatch - 1}` : ''}`;
    lines.push(`✅ Created: ${info.createdCount} variables (${completedRange})`);
  } else {
    lines.push(`✅ Created: ${info.createdCount} variables`);
  }

  // What failed
  lines.push(`❌ Failed: Batch ${info.failedBatch} of ${info.totalBatches}`);
  lines.push(`   - Error: ${info.errorMessage}`);
  lines.push(`   - Recommendation: Wait 60 seconds, then run:`);
  lines.push(`     npm run figma:push -- --resume ${info.failedBatch}`);

  // What remains
  if (info.failedBatch < info.totalBatches) {
    const remainStart = info.failedBatch + 1;
    const remainRange = remainStart === info.totalBatches
      ? `batch ${remainStart}`
      : `batches ${remainStart}-${info.totalBatches}`;
    lines.push('');
    lines.push(`⏸️  Remaining: ${info.remainingCount} variables (${remainRange})`);
  }

  lines.push('');
  lines.push('To resume sync after resolving the error, use the --resume flag with the failed batch number.');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Desktop Bridge error reporting — Task 6.3
// ---------------------------------------------------------------------------

/** Path to the Desktop Bridge plugin manifest (installed via figma-console-mcp). */
const DESKTOP_BRIDGE_MANIFEST =
  'node_modules/figma-console-mcp/figma-desktop-bridge/manifest.json';

/** Troubleshooting link for Desktop Bridge issues. */
const TROUBLESHOOTING_LINK = 'docs/dtcg-integration-guide.md#desktop-bridge-setup';

/**
 * Options describing a Desktop Bridge error for formatting.
 */
export interface DesktopBridgeErrorInfo {
  /** The type of failure: bridge not running, or connection error. */
  type: 'unavailable' | 'connection_error';
  /** Underlying error message (for connection_error type). */
  errorMessage?: string;
}

/**
 * Format a Desktop Bridge error into a human-readable message with
 * setup instructions and a troubleshooting link.
 *
 * Produces two variants:
 * - **unavailable**: Bridge is not running (WebSocket check failed)
 * - **connection_error**: Status check threw an exception
 *
 * @param info - Details of the Desktop Bridge error
 * @returns Formatted multi-line string for console output
 *
 * @requirements Req 8 (Desktop Bridge Dependency), Req 9 (Error Handling)
 */
export function formatDesktopBridgeError(info: DesktopBridgeErrorInfo): string {
  const lines: string[] = [];

  if (info.type === 'connection_error' && info.errorMessage) {
    lines.push('❌ Desktop Bridge connection failed');
    lines.push('');
    lines.push(`Error: ${info.errorMessage}`);
  } else {
    lines.push('❌ Desktop Bridge not available');
  }

  lines.push('');
  lines.push('Desktop Bridge is required for style creation (shadow and typography tokens).');
  lines.push('');
  lines.push('Setup:');
  lines.push('1. Install Desktop Bridge plugin in Figma Desktop');
  lines.push(`   Plugin manifest: ${DESKTOP_BRIDGE_MANIFEST}`);
  lines.push('2. Run the plugin (Plugins → Development → Desktop Bridge)');
  lines.push('3. Verify WebSocket connection on port 9223');
  lines.push('4. Re-run: npm run figma:push');
  lines.push('');
  lines.push(`Troubleshooting: See ${TROUBLESHOOTING_LINK}`);

  return lines.join('\n');
}



// ---------------------------------------------------------------------------
// Value formatting helpers
// ---------------------------------------------------------------------------

/**
 * Format a token value for display in error messages.
 *
 * Handles:
 * - Numbers (displayed as-is)
 * - Color objects ({ r, g, b, a }) → hex string
 * - Strings (displayed as-is)
 * - Other values → JSON stringified
 */
export function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return String(value);
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    return value;
  }

  if (isColorObject(value)) {
    return rgbaToHex(value.r, value.g, value.b, value.a);
  }

  return JSON.stringify(value);
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

function isColorObject(value: unknown): value is RGBAColor {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.r === 'number' &&
    typeof obj.g === 'number' &&
    typeof obj.b === 'number' &&
    typeof obj.a === 'number'
  );
}

/**
 * Convert Figma RGBA (0-1 range) to hex string.
 * Returns #RRGGBB when fully opaque, #RRGGBBAA otherwise.
 */
function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();

  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a < 1 ? `${hex}${toHex(a)}` : hex;
}
