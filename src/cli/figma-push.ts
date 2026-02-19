#!/usr/bin/env node

/**
 * CLI command for pushing DesignerPunk tokens to Figma.
 *
 * Orchestrates the full token push workflow:
 * 1. Load DTCG tokens from dist/DesignTokens.dtcg.json
 * 2. Transform to Figma format via FigmaTransformer
 * 3. Write intermediate artifact (dist/DesignTokens.figma.json)
 * 4. Run pre-flight check (Desktop Bridge availability)
 * 5. Sync to Figma via TokenSyncWorkflow
 * 6. Report results and exit with appropriate code
 *
 * Usage:
 *   npm run figma:push                  # Normal sync
 *   npm run figma:push -- --force       # Override drift detection
 *   npm run figma:push -- --resume 3    # Resume from batch 3
 *   npm run figma:push -- --dry-run     # Transform only, no sync
 *
 * @see Design: .kiro/specs/054a-figma-token-push/design.md
 * @requirements Req 7 (CLI Command)
 */

import * as fs from 'fs';
import * as path from 'path';
import { FigmaTransformer } from '../generators/transformers/FigmaTransformer';
import type { FigmaTokenFile } from '../generators/transformers/FigmaTransformer';
import { TokenSyncWorkflow } from '../figma/TokenSyncWorkflow';
import { ConsoleMCPClientImpl } from '../figma/ConsoleMCPClientImpl';
import { checkDesktopBridge } from '../figma/preflight';
import type { DTCGTokenFile } from '../generators/types/DTCGTypes';

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

/** Parsed CLI arguments. */
export interface FigmaPushArgs {
  force: boolean;
  resume: number | undefined;
  dryRun: boolean;
}

/**
 * Parse process.argv into structured arguments.
 *
 * Supports:
 *   --force      Override drift detection
 *   --resume N   Resume from batch N
 *   --dry-run    Transform only, skip sync
 */
export function parseArgs(argv: string[]): FigmaPushArgs {
  const args: FigmaPushArgs = {
    force: false,
    resume: undefined,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--force') {
      args.force = true;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--resume') {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        console.error('❌ --resume requires a batch number (e.g., --resume 3)');
        process.exit(1);
      }
      const batchNum = parseInt(next, 10);
      if (isNaN(batchNum) || batchNum < 1) {
        console.error(`❌ Invalid batch number: ${next}. Must be a positive integer.`);
        process.exit(1);
      }
      args.resume = batchNum;
      i++; // skip the number argument
    }
  }

  return args;
}

// ---------------------------------------------------------------------------
// Token loading
// ---------------------------------------------------------------------------

/** Default path to the DTCG token file. */
const DTCG_INPUT_PATH = path.resolve('dist', 'DesignTokens.dtcg.json');

/** Default path for the Figma format output. */
const FIGMA_OUTPUT_PATH = path.resolve('dist', 'DesignTokens.figma.json');

/**
 * Load and parse the DTCG token file.
 * Exits with code 1 if the file is missing or invalid.
 */
export function loadDTCGTokens(filePath: string): DTCGTokenFile {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ DTCG token file not found: ${filePath}`);
    console.error('   Run the DTCG generator first to produce this file.');
    process.exit(1);
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as DTCGTokenFile;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to parse DTCG token file: ${message}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Main workflow
// ---------------------------------------------------------------------------

/**
 * Run the Figma token push workflow.
 *
 * Exported for testing — the default invocation calls this via the
 * bottom-of-file bootstrap.
 */
export async function run(argv: string[] = process.argv.slice(2)): Promise<void> {
  const args = parseArgs(argv);

  // 1. Load DTCG tokens
  console.log('📦 Loading DTCG tokens…');
  const dtcgTokens = loadDTCGTokens(DTCG_INPUT_PATH);

  // 2. Transform to Figma format
  console.log('🔄 Transforming to Figma format…');
  const transformer = new FigmaTransformer();

  if (!transformer.canTransform(dtcgTokens)) {
    console.error('❌ DTCG token file is not valid for Figma transformation.');
    process.exit(1);
  }

  const result = transformer.transform(dtcgTokens);

  if (result.warnings.length > 0) {
    console.log('⚠️  Transformation warnings:');
    for (const warning of result.warnings) {
      console.log(`   - ${warning}`);
    }
  }

  // 3. Write intermediate artifact
  fs.writeFileSync(FIGMA_OUTPUT_PATH, result.content, 'utf-8');
  console.log(`✅ Wrote ${FIGMA_OUTPUT_PATH}`);

  // 4. Dry-run stops here
  if (args.dryRun) {
    console.log('');
    console.log('🏁 Dry run complete. Review dist/DesignTokens.figma.json before syncing.');
    process.exit(0);
  }

  // 5. Pre-flight check
  console.log('🔍 Running pre-flight checks…');
  const mcpClient = new ConsoleMCPClientImpl();
  await mcpClient.connect();

  try {
    const preflight = await checkDesktopBridge(mcpClient);
    if (!preflight.ready) {
      console.error(preflight.error);
      process.exit(1);
    }
    console.log('✅ Desktop Bridge is available');

    // 6. Sync to Figma
    console.log('🚀 Syncing tokens to Figma…');
    const figmaTokens: FigmaTokenFile = JSON.parse(result.content);
    const workflow = new TokenSyncWorkflow(mcpClient, process.env.FIGMA_FILE_KEY ?? '');

    const syncResult = await workflow.sync(figmaTokens, {
      forceOverride: args.force,
      resume: args.resume,
    });

    // 7. Report results
    console.log('');
    if (syncResult.success) {
      console.log('✅ Sync complete');
      console.log(`   Created: ${syncResult.created}`);
      console.log(`   Updated: ${syncResult.updated}`);
      if (syncResult.deleted > 0) {
        console.log(`   Deleted: ${syncResult.deleted}`);
      }
      process.exit(0);
    } else {
      if (syncResult.driftDetected?.hasDrift) {
        console.error('❌ Drift detected — sync blocked');
        for (const dv of syncResult.driftDetected.driftedVariables) {
          console.error(`   - ${dv.name}: expected ${JSON.stringify(dv.expectedValue)}, found ${JSON.stringify(dv.actualValue)}`);
        }
        console.error('');
        console.error('Resolution:');
        console.error('  1. Revert changes in Figma, then re-run: npm run figma:push');
        console.error('  2. Force override: npm run figma:push -- --force');
      }

      if (syncResult.errors.length > 0) {
        console.error(`❌ Sync failed with ${syncResult.errors.length} error(s):`);
        for (const err of syncResult.errors) {
          console.error(`   - ${err.message}`);
        }
      }

      process.exit(1);
    }
  } finally {
    await mcpClient.disconnect();
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

/* istanbul ignore next — CLI entry point */
if (require.main === module) {
  run().catch((error) => {
    console.error('❌ Unhandled error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
