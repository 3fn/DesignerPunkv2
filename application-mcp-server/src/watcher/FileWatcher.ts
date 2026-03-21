/**
 * Component File Watcher
 *
 * Monitors src/components/core/ for schema.yaml, contracts.yaml, and
 * component-meta.yaml changes. On change, identifies the affected component
 * directory and triggers reindexComponent().
 *
 * Same debounce pattern as docs MCP FileWatcher.
 *
 * @see .kiro/specs/064-component-metadata-schema/design.md — Requirement 1.2
 */

import * as fs from 'fs';
import * as path from 'path';
import { ComponentIndexer } from '../indexer/ComponentIndexer';

const WATCHED_FILES = new Set(['contracts.yaml', 'component-meta.yaml']);

export class FileWatcher {
  private watcher: fs.FSWatcher | null = null;
  private debounceTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private indexer: ComponentIndexer,
    private watchDirectory: string,
    private debounceMs: number = 100,
  ) {}

  start(): void {
    if (!fs.existsSync(this.watchDirectory)) {
      throw new Error(`Watch directory not found: ${this.watchDirectory}`);
    }
    this.stop();
    this.watcher = fs.watch(this.watchDirectory, { recursive: true }, (_event, filename) => {
      if (filename) this.handleChange(filename);
    });
    this.watcher.on('error', (err) => console.error(`FileWatcher error: ${err.message}`));
  }

  stop(): void {
    this.watcher?.close();
    this.watcher = null;
    for (const timer of this.debounceTimers.values()) clearTimeout(timer);
    this.debounceTimers.clear();
  }

  isWatching(): boolean {
    return this.watcher !== null;
  }

  private handleChange(filename: string): void {
    const base = path.basename(filename);
    if (!base.endsWith('.schema.yaml') && !WATCHED_FILES.has(base)) return;

    // Derive component directory: filename is relative to watchDirectory
    // e.g., "Badge-Count-Base/contracts.yaml" → "Badge-Count-Base"
    const componentDir = path.join(this.watchDirectory, path.dirname(filename));
    this.debounceReindex(componentDir);
  }

  private debounceReindex(componentDir: string): void {
    const existing = this.debounceTimers.get(componentDir);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(async () => {
      this.debounceTimers.delete(componentDir);
      try {
        await this.indexer.reindexComponent(componentDir);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Failed to reindex ${componentDir}: ${msg}`);
      }
    }, this.debounceMs);

    this.debounceTimers.set(componentDir, timer);
  }
}
