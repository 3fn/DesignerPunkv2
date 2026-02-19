/**
 * Error Reporting — Drift Error Formatting Tests
 *
 * Tests for formatDriftReport() and formatValue(): verifying that
 * drift reports produce clear, actionable console output.
 *
 * @requirements Req 5 (Drift Detection), Req 9 (Error Handling)
 */

import { formatDriftReport, formatPartialFailure, formatDesktopBridgeError, formatValue } from '../error-reporting';
import type { PartialFailureInfo, DesktopBridgeErrorInfo } from '../error-reporting';
import type { DriftReport } from '../TokenSyncWorkflow';

describe('formatDriftReport', () => {
  it('returns no-drift message when report has no drift', () => {
    const report: DriftReport = { hasDrift: false, driftedVariables: [] };
    const output = formatDriftReport(report);
    expect(output).toContain('No drift detected');
  });

  it('formats a single drifted variable with expected and actual values', () => {
    const report: DriftReport = {
      hasDrift: true,
      driftedVariables: [
        { name: 'space/300', expectedValue: 24, actualValue: 25 },
      ],
    };

    const output = formatDriftReport(report);

    expect(output).toContain('1 variable has been edited');
    expect(output).toContain('space/300: Expected 24, found 25');
    expect(output).toContain('edited in Figma');
  });

  it('formats multiple drifted variables with plural wording', () => {
    const report: DriftReport = {
      hasDrift: true,
      driftedVariables: [
        { name: 'space/100', expectedValue: 8, actualValue: 9 },
        { name: 'fontSize/200', expectedValue: 16, actualValue: 18 },
        { name: 'space/300', expectedValue: 24, actualValue: 25 },
      ],
    };

    const output = formatDriftReport(report);

    expect(output).toContain('3 variables have been edited');
    expect(output).toContain('space/100');
    expect(output).toContain('fontSize/200');
    expect(output).toContain('space/300');
  });

  it('includes all three resolution options', () => {
    const report: DriftReport = {
      hasDrift: true,
      driftedVariables: [
        { name: 'space/100', expectedValue: 8, actualValue: 10 },
      ],
    };

    const output = formatDriftReport(report);

    expect(output).toContain('Resolution options:');
    expect(output).toContain('Revert changes in Figma');
    expect(output).toContain('npm run figma:push');
    expect(output).toContain('Force override');
    expect(output).toContain('--force');
    expect(output).toContain('create them through the spec process');
  });

  it('formats color values as hex strings', () => {
    const report: DriftReport = {
      hasDrift: true,
      driftedVariables: [
        {
          name: 'color/primary',
          expectedValue: { r: 0.69, g: 0.15, b: 1, a: 1 },
          actualValue: { r: 0.63, g: 0.13, b: 0.88, a: 1 },
        },
      ],
    };

    const output = formatDriftReport(report);

    // Hex values from RGBA 0-1 range
    expect(output).toContain('color/primary');
    expect(output).toContain('Expected #');
    expect(output).toContain('found #');
  });
});

describe('formatValue', () => {
  it('formats numbers as strings', () => {
    expect(formatValue(24)).toBe('24');
    expect(formatValue(0)).toBe('0');
    expect(formatValue(3.14)).toBe('3.14');
  });

  it('formats strings as-is', () => {
    expect(formatValue('hello')).toBe('hello');
  });

  it('formats null and undefined', () => {
    expect(formatValue(null)).toBe('null');
    expect(formatValue(undefined)).toBe('undefined');
  });

  it('formats color objects as hex', () => {
    expect(formatValue({ r: 1, g: 0, b: 0, a: 1 })).toBe('#FF0000');
    expect(formatValue({ r: 0, g: 0, b: 0, a: 1 })).toBe('#000000');
    expect(formatValue({ r: 1, g: 1, b: 1, a: 1 })).toBe('#FFFFFF');
  });

  it('includes alpha channel when not fully opaque', () => {
    const result = formatValue({ r: 1, g: 0, b: 0, a: 0.5 });
    expect(result).toBe('#FF000080');
  });

  it('falls back to JSON for other objects', () => {
    expect(formatValue({ foo: 'bar' })).toBe('{"foo":"bar"}');
    expect(formatValue([1, 2, 3])).toBe('[1,2,3]');
  });
});

// ---------------------------------------------------------------------------
// Partial failure error reporting — Task 6.2
// ---------------------------------------------------------------------------

describe('formatPartialFailure', () => {
  it('formats a mid-batch failure with completed range and remaining batches', () => {
    const info: PartialFailureInfo = {
      createdCount: 200,
      failedBatch: 3,
      totalBatches: 5,
      errorMessage: 'Rate limit exceeded (429)',
      remainingCount: 200,
    };

    const output = formatPartialFailure(info);

    expect(output).toContain('Sync completed with errors:');
    expect(output).toContain('✅ Created: 200 variables (batches 1-2)');
    expect(output).toContain('❌ Failed: Batch 3 of 5');
    expect(output).toContain('Rate limit exceeded (429)');
    expect(output).toContain('npm run figma:push -- --resume 3');
    expect(output).toContain('⏸️  Remaining: 200 variables (batches 4-5)');
  });

  it('formats a first-batch failure with no completed range', () => {
    const info: PartialFailureInfo = {
      createdCount: 0,
      failedBatch: 1,
      totalBatches: 5,
      errorMessage: 'Connection refused',
      remainingCount: 400,
    };

    const output = formatPartialFailure(info);

    expect(output).toContain('✅ Created: 0 variables');
    expect(output).not.toContain('batches 1-0');
    expect(output).toContain('❌ Failed: Batch 1 of 5');
    expect(output).toContain('npm run figma:push -- --resume 1');
    expect(output).toContain('⏸️  Remaining: 400 variables (batches 2-5)');
  });

  it('formats a last-batch failure with no remaining section', () => {
    const info: PartialFailureInfo = {
      createdCount: 400,
      failedBatch: 5,
      totalBatches: 5,
      errorMessage: 'Timeout',
      remainingCount: 0,
    };

    const output = formatPartialFailure(info);

    expect(output).toContain('✅ Created: 400 variables (batches 1-4)');
    expect(output).toContain('❌ Failed: Batch 5 of 5');
    expect(output).not.toContain('Remaining');
  });

  it('includes the resume instruction footer', () => {
    const info: PartialFailureInfo = {
      createdCount: 100,
      failedBatch: 2,
      totalBatches: 3,
      errorMessage: 'Server error',
      remainingCount: 100,
    };

    const output = formatPartialFailure(info);

    expect(output).toContain('To resume sync after resolving the error');
    expect(output).toContain('--resume flag');
  });

  it('uses singular batch wording when only one batch completed', () => {
    const info: PartialFailureInfo = {
      createdCount: 100,
      failedBatch: 2,
      totalBatches: 4,
      errorMessage: 'Rate limit',
      remainingCount: 200,
    };

    const output = formatPartialFailure(info);

    expect(output).toContain('✅ Created: 100 variables (batch 1)');
  });
});

// ---------------------------------------------------------------------------
// Desktop Bridge error reporting — Task 6.3
// ---------------------------------------------------------------------------

describe('formatDesktopBridgeError', () => {
  it('formats an unavailable bridge with setup instructions', () => {
    const info: DesktopBridgeErrorInfo = { type: 'unavailable' };
    const output = formatDesktopBridgeError(info);

    expect(output).toContain('❌ Desktop Bridge not available');
    expect(output).toContain('Desktop Bridge is required for style creation');
    expect(output).toContain('Setup:');
    expect(output).toContain('Plugin manifest:');
    expect(output).toContain('figma-desktop-bridge/manifest.json');
    expect(output).toContain('Verify WebSocket connection on port 9223');
    expect(output).toContain('npm run figma:push');
    expect(output).toContain('Troubleshooting:');
    expect(output).toContain('dtcg-integration-guide.md#desktop-bridge-setup');
  });

  it('formats a connection error with the underlying error message', () => {
    const info: DesktopBridgeErrorInfo = {
      type: 'connection_error',
      errorMessage: 'ECONNREFUSED 127.0.0.1:9223',
    };
    const output = formatDesktopBridgeError(info);

    expect(output).toContain('❌ Desktop Bridge connection failed');
    expect(output).toContain('Error: ECONNREFUSED 127.0.0.1:9223');
    expect(output).toContain('Setup:');
    expect(output).toContain('Troubleshooting:');
  });

  it('falls back to unavailable heading when connection_error has no message', () => {
    const info: DesktopBridgeErrorInfo = { type: 'connection_error' };
    const output = formatDesktopBridgeError(info);

    expect(output).toContain('❌ Desktop Bridge not available');
    expect(output).not.toContain('Error:');
  });
});
