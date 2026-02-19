/**
 * Pre-flight checks for Figma token push workflow.
 *
 * Verifies that the Desktop Bridge plugin is running and reachable
 * before attempting to sync tokens. This prevents confusing errors
 * during the sync process when the bridge is unavailable.
 *
 * @see Design: .kiro/specs/054a-figma-token-push/design.md
 * @requirements Req 8 (Desktop Bridge Dependency)
 */

import type { ConsoleMCPClient } from './ConsoleMCPClient';

/** Path to the Desktop Bridge plugin manifest (installed via figma-console-mcp). */
const DESKTOP_BRIDGE_MANIFEST =
  'node_modules/figma-console-mcp/figma-desktop-bridge/manifest.json';

/** Result of a pre-flight check. */
export interface PreflightResult {
  /** Whether the environment is ready for token sync. */
  ready: boolean;
  /** Error message with setup instructions when not ready. */
  error?: string;
}

/**
 * Check whether the Figma Desktop Bridge is available.
 *
 * Calls `figma_get_status` via the Console MCP client and inspects
 * `transport.websocket.available` in the response. When the bridge
 * is not reachable the returned result includes actionable setup
 * instructions.
 *
 * @param client - A connected ConsoleMCPClient instance.
 * @returns PreflightResult indicating readiness.
 */
export async function checkDesktopBridge(
  client: ConsoleMCPClient,
): Promise<PreflightResult> {
  try {
    const status = await client.getStatus();

    const wsAvailable = status?.transport?.websocket?.available === true;

    if (!wsAvailable) {
      return {
        ready: false,
        error: buildBridgeUnavailableMessage(),
      };
    }

    return { ready: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ready: false,
      error: buildBridgeErrorMessage(message),
    };
  }
}

/**
 * Build the error message shown when Desktop Bridge is not available.
 */
function buildBridgeUnavailableMessage(): string {
  return [
    '❌ Desktop Bridge not available',
    '',
    'Desktop Bridge is required for style creation (shadow and typography tokens).',
    '',
    'Setup:',
    '1. Install Desktop Bridge plugin in Figma Desktop',
    `   Plugin manifest: ${DESKTOP_BRIDGE_MANIFEST}`,
    '2. Run the plugin (Plugins → Development → Desktop Bridge)',
    '3. Verify WebSocket connection on port 9223',
    '4. Re-run: npm run figma:push',
    '',
    'Troubleshooting: See docs/dtcg-integration-guide.md#desktop-bridge-setup',
  ].join('\n');
}

/**
 * Build the error message shown when the status check itself fails.
 */
function buildBridgeErrorMessage(detail: string): string {
  return [
    '❌ Desktop Bridge connection failed',
    '',
    `Error: ${detail}`,
    '',
    'Desktop Bridge is required for style creation (shadow and typography tokens).',
    '',
    'Setup:',
    '1. Install Desktop Bridge plugin in Figma Desktop',
    `   Plugin manifest: ${DESKTOP_BRIDGE_MANIFEST}`,
    '2. Run the plugin (Plugins → Development → Desktop Bridge)',
    '3. Verify WebSocket connection on port 9223',
    '4. Re-run: npm run figma:push',
    '',
    'Troubleshooting: See docs/dtcg-integration-guide.md#desktop-bridge-setup',
  ].join('\n');
}
