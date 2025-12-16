import * as fs from 'fs';
import * as path from 'path';
import { DocumentIndexer } from '../indexer/DocumentIndexer';

/**
 * FileWatcher - Monitors documentation directory for changes
 * 
 * Responsibilities:
 * - Monitor `.kiro/steering/` directory for file changes
 * - Detect file modifications, additions, and deletions
 * - Trigger re-indexing on changes via DocumentIndexer.reindexFile()
 * 
 * Uses Node.js fs.watch() for file system monitoring.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */
export class FileWatcher {
  private watcher: fs.FSWatcher | null = null;
  private indexer: DocumentIndexer;
  private watchDirectory: string;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private debounceMs: number;

  /**
   * Create a new FileWatcher
   * 
   * @param indexer - DocumentIndexer instance to notify of changes
   * @param watchDirectory - Directory to monitor for changes
   * @param debounceMs - Debounce delay in milliseconds (default: 100ms)
   */
  constructor(
    indexer: DocumentIndexer,
    watchDirectory: string,
    debounceMs: number = 100
  ) {
    this.indexer = indexer;
    this.watchDirectory = watchDirectory;
    this.debounceMs = debounceMs;
  }

  /**
   * Start watching the directory for changes
   * 
   * Monitors for:
   * - File modifications (Requirement 10.1)
   * - File additions (Requirement 10.2)
   * - File deletions (Requirement 10.3)
   * 
   * Triggers reindexFile() on changes (Requirement 10.4)
   */
  start(): void {
    // Verify directory exists
    if (!fs.existsSync(this.watchDirectory)) {
      throw new Error(`Watch directory not found: ${this.watchDirectory}`);
    }

    // Stop any existing watcher
    this.stop();

    // Start watching with recursive option for subdirectories
    this.watcher = fs.watch(
      this.watchDirectory,
      { recursive: true },
      (eventType, filename) => {
        this.handleFileChange(eventType, filename);
      }
    );

    // Handle watcher errors
    this.watcher.on('error', (error) => {
      console.error(`FileWatcher error: ${error.message}`);
    });
  }

  /**
   * Stop watching the directory
   */
  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }

    // Clear any pending debounce timers
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }

  /**
   * Check if the watcher is currently active
   */
  isWatching(): boolean {
    return this.watcher !== null;
  }

  /**
   * Handle file change events from fs.watch()
   * 
   * @param _eventType - Type of event ('rename' or 'change') - unused but required by fs.watch callback
   * @param filename - Name of the file that changed (may be null)
   */
  private handleFileChange(_eventType: string, filename: string | null): void {
    // Ignore if no filename provided
    if (!filename) {
      return;
    }

    // Only process markdown files
    if (!filename.endsWith('.md')) {
      return;
    }

    // Build full path
    const fullPath = path.join(this.watchDirectory, filename);

    // Debounce rapid changes to the same file
    this.debounceReindex(fullPath);
  }

  /**
   * Debounce re-indexing to handle rapid file changes
   * 
   * @param filePath - Path to file that changed
   */
  private debounceReindex(filePath: string): void {
    // Clear any existing timer for this file
    const existingTimer = this.debounceTimers.get(filePath);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.triggerReindex(filePath);
      this.debounceTimers.delete(filePath);
    }, this.debounceMs);

    this.debounceTimers.set(filePath, timer);
  }

  /**
   * Trigger re-indexing for a file
   * 
   * @param filePath - Path to file to re-index
   */
  private async triggerReindex(filePath: string): Promise<void> {
    try {
      await this.indexer.reindexFile(filePath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Failed to reindex ${filePath}: ${errorMessage}`);
    }
  }
}
