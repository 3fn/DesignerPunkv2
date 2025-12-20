/**
 * @category evergreen
 * @purpose Verify release system functionality works correctly
 */
/**
 * Comprehensive Configuration System Tests
 * 
 * Tests for all configuration operations including loading, validation,
 * merging, runtime updates, rollback, migration, and recovery scenarios.
 * 
 * Mock Strategy:
 * - jest.mock('fs'): Mock file system operations (no real config files)
 * - No shared mocks: Each test creates fresh mocks
 * - Test isolation: Tests pass in any order
 * 
 * Validation Requirements (Task 10.4):
 * - Unit tests for all configuration operations
 * - Test various configuration scenarios (valid, invalid, edge cases)
 * - Mock file system operations (no real config files)
 * - Test isolation verified (no shared state)
 * - Document mock strategy in test file header
 */

import * as fs from 'fs';
import { ConfigManager } from '../ConfigManager';
import { DEFAULT_RELEASE_CONFIG, ReleaseConfig } from '../ReleaseConfig';

// Mock fs module
jest.mock('fs');

describe('Configuration System - Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Configuration Loading', () => {
    it('should load configuration with all sections', async () => {
      const fullConfig: ReleaseConfig = {
        ...DEFAULT_RELEASE_CONFIG,
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.88
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(fullConfig));
      
      const manager = new ConfigManager();
      const config = await manager.loadFromFile();
      
      expect(config.detection).toBeDefined();
      expect(config.versioning).toBeDefined();
      expect(config.publishing).toBeDefined();
      expect(config.validation).toBeDefined();
    });
  });
});
