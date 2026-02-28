#!/usr/bin/env node

/**
 * Release Tool CLI
 *
 * Commands:
 *   analyze  — scan changes and display version recommendation
 *   notes    — generate release notes without releasing
 *   release  — generate notes, tag, and publish (with --dry-run option)
 */

import { ReleasePipeline } from './ReleasePipeline';

const COMMANDS = ['analyze', 'notes', 'release'] as const;
type Command = (typeof COMMANDS)[number];

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] as Command;
  const dryRun = args.includes('--dry-run');

  if (!command || !COMMANDS.includes(command)) {
    console.log('Usage: release-tool <command> [options]\n');
    console.log('Commands:');
    console.log('  analyze    Scan changes and display version recommendation');
    console.log('  notes      Generate release notes without releasing');
    console.log('  release    Generate notes, create tag, and publish GitHub release');
    console.log('\nOptions:');
    console.log('  --dry-run  Preview release without creating tag or publishing');
    process.exit(1);
  }

  const pipeline = new ReleasePipeline();

  // Check accumulation warning
  const warning = pipeline.checkAccumulation();
  if (warning) console.log(warning + '\n');

  try {
    switch (command) {
      case 'analyze':
        return await runAnalyze(pipeline);
      case 'notes':
        return await runNotes(pipeline);
      case 'release':
        return await runRelease(pipeline, dryRun);
    }
  } catch (err) {
    console.error(`\n❌ ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

async function runAnalyze(pipeline: ReleasePipeline): Promise<void> {
  console.log('🔍 Analyzing changes since last tag...\n');
  const rec = await pipeline.analyze();

  console.log(`Current version:     ${rec.currentVersion}`);
  console.log(`Recommended version: ${rec.recommendedVersion}`);
  console.log(`Bump type:           ${rec.bumpType}`);
  console.log(`Confidence:          ${Math.round(rec.confidence * 100)}%`);
  console.log(`Rationale:           ${rec.rationale}`);

  if (rec.changes.length > 0) {
    console.log(`\nChanges (${rec.changes.length}):`);
    for (const c of rec.changes) {
      const icon = c.priority === 'breaking' ? '🔴' : c.priority === 'prominent' ? '🟡' : '🔵';
      console.log(`  ${icon} ${c.change.taskTitle} (${c.deliverableType})`);
    }
  }
}

async function runNotes(pipeline: ReleasePipeline): Promise<void> {
  console.log('📝 Generating release notes...\n');
  const notes = await pipeline.generateNotes();
  console.log(`Version: ${notes.json.version}`);
  console.log(`Changes: ${notes.json.changes.length}`);
  console.log(`\nFiles written to docs/releases/`);
  console.log('\n--- Public Notes Preview ---\n');
  console.log(notes.public);
}

async function runRelease(pipeline: ReleasePipeline, dryRun: boolean): Promise<void> {
  if (dryRun) console.log('🏃 Dry run — no tag or publish will occur\n');
  console.log('🚀 Running release pipeline...\n');

  const result = await pipeline.release(dryRun);
  const version = result.notes.json.version;

  if (dryRun) {
    console.log(`Would release: v${version}`);
    console.log(`Changes: ${result.notes.json.changes.length}`);
    console.log('\n--- Public Notes Preview ---\n');
    console.log(result.notes.public);
    return;
  }

  if (result.published) {
    console.log(`✅ Released v${version}`);
    if (result.releaseUrl) console.log(`   ${result.releaseUrl}`);
  } else {
    console.log(`⚠️  v${version} tagged but not published`);
    if (result.error) console.log(`   ${result.error}`);
  }
}

main();
