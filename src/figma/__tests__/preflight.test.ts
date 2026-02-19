/**
 * Pre-flight check — Unit Tests
 *
 * Tests for Desktop Bridge availability detection before token sync.
 *
 * @requirements Req 8 (Desktop Bridge Dependency)
 */

import type { ConsoleMCPClient, ConsoleMCPStatus } from '../ConsoleMCPClient';
import { checkDesktopBridge } from '../preflight';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a minimal mock ConsoleMCPClient with a controllable getStatus. */
function makeMockClient(
  getStatusImpl: () => Promise<ConsoleMCPStatus>,
): ConsoleMCPClient {
  return {
    batchCreateVariables: jest.fn(),
    batchUpdateVariables: jest.fn(),
    getVariables: jest.fn(),
    execute: jest.fn(),
    setupDesignTokens: jest.fn(),
    getStatus: jest.fn().mockImplementation(getStatusImpl),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('checkDesktopBridge', () => {
  it('returns ready when Desktop Bridge is available', async () => {
    const client = makeMockClient(async () => ({
      transport: { websocket: { available: true, port: 9223 } },
    }));

    const result = await checkDesktopBridge(client);

    expect(result.ready).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns not ready when websocket.available is false', async () => {
    const client = makeMockClient(async () => ({
      transport: { websocket: { available: false } },
    }));

    const result = await checkDesktopBridge(client);

    expect(result.ready).toBe(false);
    expect(result.error).toContain('Desktop Bridge not available');
    expect(result.error).toContain('npm run figma:push');
  });

  it('returns not ready when transport is missing', async () => {
    const client = makeMockClient(async () => ({}));

    const result = await checkDesktopBridge(client);

    expect(result.ready).toBe(false);
    expect(result.error).toContain('Desktop Bridge not available');
  });

  it('returns not ready with error details when getStatus throws', async () => {
    const client = makeMockClient(async () => {
      throw new Error('WebSocket connection refused on port 9223');
    });

    const result = await checkDesktopBridge(client);

    expect(result.ready).toBe(false);
    expect(result.error).toContain('Desktop Bridge connection failed');
    expect(result.error).toContain('WebSocket connection refused on port 9223');
  });

  it('includes setup instructions in error messages', async () => {
    const client = makeMockClient(async () => ({
      transport: { websocket: { available: false } },
    }));

    const result = await checkDesktopBridge(client);

    expect(result.error).toContain('figma-desktop-bridge/manifest.json');
    expect(result.error).toContain('port 9223');
    expect(result.error).toContain('Troubleshooting');
  });
});
