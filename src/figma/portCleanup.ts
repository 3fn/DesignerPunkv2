/**
 * Port cleanup utility for stale figma-console-mcp processes.
 *
 * Before spawning a new figma-console-mcp instance, we need to ensure
 * no stale processes are holding ports 9223-9232. If a previous run
 * crashed, the old process may still be listening, causing the Desktop
 * Bridge plugin to connect to the wrong server.
 *
 * @see Bugfix: .kiro/specs/054c-figma-token-push-fixes/bugfix.md (Req 2.4)
 */

import { execSync } from 'child_process';

/** Port range used by figma-console-mcp */
const PORT_RANGE_START = 9223;
const PORT_RANGE_END = 9232;

/**
 * Find and kill stale figma-console-mcp processes on ports 9223-9232.
 *
 * Uses `lsof` to discover PIDs bound to the port range, then kills them.
 * Handles gracefully on platforms where `lsof` is unavailable (Windows, etc.)
 * by logging a warning and continuing.
 *
 * @returns Array of port numbers that were cleaned up
 */
export function cleanupStalePorts(): number[] {
  const cleanedPorts: number[] = [];

  try {
    // lsof -ti:9223-9232 returns PIDs (one per line) of processes on those ports
    const portRange = `${PORT_RANGE_START}-${PORT_RANGE_END}`;
    const output = execSync(`lsof -ti:${portRange}`, {
      encoding: 'utf-8',
      timeout: 5000,
    }).trim();

    if (!output) {
      return cleanedPorts;
    }

    const pids = output
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => parseInt(line, 10))
      .filter((pid) => !isNaN(pid));

    // Deduplicate PIDs (a process may appear on multiple ports)
    const uniquePids = [...new Set(pids)];

    for (const pid of uniquePids) {
      try {
        execSync(`kill ${pid}`, { timeout: 3000 });
        cleanedPorts.push(pid);
        console.log(`🧹 Killed stale figma-console-mcp process (PID ${pid})`);
      } catch {
        // Process may have already exited — not an error
      }
    }

    if (cleanedPorts.length > 0) {
      console.log(
        `🧹 Cleaned up ${cleanedPorts.length} stale process(es) on ports ${PORT_RANGE_START}-${PORT_RANGE_END}`,
      );
    }
  } catch (error: unknown) {
    // lsof exits with status 1 when no matching processes are found — that's fine
    if (isExecError(error) && error.status === 1) {
      return cleanedPorts;
    }

    // lsof not available (Windows, minimal containers, etc.)
    console.log(
      '⚠️  Port cleanup skipped: lsof not available on this platform. ' +
        'If you experience connection issues, manually kill processes on ports 9223-9232.',
    );
  }

  return cleanedPorts;
}

/** Type guard for exec errors with a status code */
function isExecError(error: unknown): error is Error & { status: number } {
  return error instanceof Error && 'status' in error;
}
