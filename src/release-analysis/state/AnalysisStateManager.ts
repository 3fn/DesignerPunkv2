/**
 * AnalysisStateManager - Manages persistent analysis state
 * 
 * Handles loading, saving, and validating analysis state from disk.
 * State is persisted to `.kiro/release-state/analysis-state.json` to enable
 * append-only analysis optimization.
 * 
 * Requirements:
 * - 2.1: Persist current git commit hash to state file
 * - 2.2: Persist accumulated analysis results to state file
 * - 2.3: Load last analyzed commit hash from state file
 * - 2.4: Handle missing/corrupted state file gracefully
 * - 2.5: Use last analyzed commit as baseline for detecting new documents
 * - 10.2: Handle corrupted state file (log warning, return null)
 * - 10.3: Handle state read failures (log error, proceed with full analysis)
 * - 10.4: Handle state write failures (log error, don't throw)
 */

import * as fs from 'fs';
import * as path from 'path';
import { AnalysisState } from './types';

export class AnalysisStateManager {
  private readonly stateFilePath = '.kiro/release-state/analysis-state.json';
  
  /**
   * Load analysis state from disk
   * 
   * Returns null if state doesn't exist or is invalid, triggering full analysis.
   * Handles missing files, corrupted JSON, and invalid state structure gracefully.
   * 
   * @returns AnalysisState if valid state exists, null otherwise
   */
  async loadState(): Promise<AnalysisState | null> {
    try {
      // Check if state file exists
      if (!fs.existsSync(this.stateFilePath)) {
        return null;
      }
      
      // Read state file content
      const content = await fs.promises.readFile(this.stateFilePath, 'utf-8');
      const state = JSON.parse(content) as AnalysisState;
      
      // Validate state structure
      if (!this.isValidState(state)) {
        console.warn('Invalid state file, will perform full analysis');
        return null;
      }
      
      return state;
    } catch (error) {
      // Handle corrupted JSON or read failures
      console.error('Failed to load analysis state:', error);
      return null;
    }
  }
  
  /**
   * Save analysis state to disk
   * 
   * Persists state to `.kiro/release-state/analysis-state.json`.
   * Creates directory if it doesn't exist.
   * Logs error but doesn't throw on failure - analysis can continue without persisting state.
   * 
   * @param state - Analysis state to persist
   */
  async saveState(state: AnalysisState): Promise<void> {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.stateFilePath);
      await fs.promises.mkdir(dir, { recursive: true });
      
      // Write state file with pretty formatting
      await fs.promises.writeFile(
        this.stateFilePath,
        JSON.stringify(state, null, 2),
        'utf-8'
      );
    } catch (error) {
      // Log error but don't throw - analysis results are still valid
      console.error('Failed to save analysis state:', error);
      // Don't throw - analysis can continue without persisting state
    }
  }
  
  /**
   * Delete state file (forces full analysis on next run)
   * 
   * Used for manual state reset or when state is corrupted beyond recovery.
   * Logs error but doesn't throw if deletion fails.
   */
  async resetState(): Promise<void> {
    try {
      if (fs.existsSync(this.stateFilePath)) {
        await fs.promises.unlink(this.stateFilePath);
      }
    } catch (error) {
      console.error('Failed to reset analysis state:', error);
    }
  }
  
  /**
   * Validate state structure
   * 
   * Checks that state has all required fields with correct types.
   * Used to detect corrupted or outdated state files.
   * 
   * @param state - Object to validate as AnalysisState
   * @returns true if state is valid, false otherwise
   */
  private isValidState(state: any): state is AnalysisState {
    return (
      typeof state === 'object' &&
      state !== null &&
      typeof state.lastAnalyzedCommit === 'string' &&
      Array.isArray(state.accumulatedResults) &&
      typeof state.lastAnalyzedAt === 'string' &&
      typeof state.version === 'string'
    );
  }
}
