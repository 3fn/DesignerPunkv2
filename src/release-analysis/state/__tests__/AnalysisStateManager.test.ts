/**
 * @category evergreen
 * @purpose Verify AnalysisStateManager functionality works correctly
 */
/**
 * Unit tests for AnalysisStateManager
 * 
 * Tests state loading, saving, validation, and error handling.
 * Validates requirements 2.1-2.5 for state persistence and management.
 */

import * as fs from 'fs';
import * as path from 'path';
import { AnalysisStateManager } from '../AnalysisStateManager';
import { AnalysisState } from '../types';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn(),
    unlink: jest.fn()
  }
}));

describe('AnalysisStateManager', () => {
  let stateManager: AnalysisStateManager;
  const testStateFilePath = '.kiro/release-state/analysis-state.json';
  
  // Valid test state
  const validState: AnalysisState = {
    lastAnalyzedCommit: 'abc123def456',
    accumulatedResults: [
      {
        filePath: '.kiro/specs/001-test/completion/task-1-completion.md',
        specName: '001-test',
        taskNumber: '1',
        impactLevel: 'patch',
        releaseNoteContent: 'Test completion',
        analyzedAtCommit: 'abc123def456'
      }
    ],
    lastAnalyzedAt: '2025-12-09T10:00:00.000Z',
    version: '1.0'
  };
  
  beforeEach(() => {
    stateManager = new AnalysisStateManager();
    jest.clearAllMocks();
    
    // Reset console mocks
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('loadState', () => {
    it('should load valid state file successfully', async () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(validState));
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toEqual(validState);
      expect(fs.existsSync).toHaveBeenCalledWith(testStateFilePath);
      expect(fs.promises.readFile).toHaveBeenCalledWith(testStateFilePath, 'utf-8');
    });
    
    it('should return null when state file does not exist', async () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toBeNull();
      expect(fs.existsSync).toHaveBeenCalledWith(testStateFilePath);
      expect(fs.promises.readFile).not.toHaveBeenCalled();
    });
    
    it('should return null and log warning for corrupted JSON', async () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue('{ invalid json }');
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to load analysis state:',
        expect.any(Error)
      );
    });
    
    it('should return null and log warning for invalid state structure (missing lastAnalyzedCommit)', async () => {
      // Arrange
      const invalidState = {
        accumulatedResults: [],
        lastAnalyzedAt: '2025-12-09T10:00:00.000Z',
        version: '1.0'
      };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(invalidState));
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith('Invalid state file, will perform full analysis');
    });
    
    it('should return null and log warning for invalid state structure (missing accumulatedResults)', async () => {
      // Arrange
      const invalidState = {
        lastAnalyzedCommit: 'abc123',
        lastAnalyzedAt: '2025-12-09T10:00:00.000Z',
        version: '1.0'
      };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(invalidState));
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith('Invalid state file, will perform full analysis');
    });
    
    it('should return null and log warning for invalid state structure (accumulatedResults not array)', async () => {
      // Arrange
      const invalidState = {
        lastAnalyzedCommit: 'abc123',
        accumulatedResults: 'not an array',
        lastAnalyzedAt: '2025-12-09T10:00:00.000Z',
        version: '1.0'
      };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(invalidState));
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith('Invalid state file, will perform full analysis');
    });
    
    it('should return null and log warning for invalid state structure (missing lastAnalyzedAt)', async () => {
      // Arrange
      const invalidState = {
        lastAnalyzedCommit: 'abc123',
        accumulatedResults: [],
        version: '1.0'
      };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(invalidState));
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith('Invalid state file, will perform full analysis');
    });
    
    it('should return null and log warning for invalid state structure (missing version)', async () => {
      // Arrange
      const invalidState = {
        lastAnalyzedCommit: 'abc123',
        accumulatedResults: [],
        lastAnalyzedAt: '2025-12-09T10:00:00.000Z'
      };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(invalidState));
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith('Invalid state file, will perform full analysis');
    });
    
    it('should return null and log error for file read failures', async () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockRejectedValue(new Error('Permission denied'));
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to load analysis state:',
        expect.any(Error)
      );
    });
  });
  
  describe('saveState', () => {
    it('should save state successfully', async () => {
      // Arrange
      (fs.promises.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
      
      // Act
      await stateManager.saveState(validState);
      
      // Assert
      expect(fs.promises.mkdir).toHaveBeenCalledWith(
        path.dirname(testStateFilePath),
        { recursive: true }
      );
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        testStateFilePath,
        JSON.stringify(validState, null, 2),
        'utf-8'
      );
    });
    
    it('should create directory if it does not exist', async () => {
      // Arrange
      (fs.promises.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(undefined);
      
      // Act
      await stateManager.saveState(validState);
      
      // Assert
      expect(fs.promises.mkdir).toHaveBeenCalledWith(
        '.kiro/release-state',
        { recursive: true }
      );
    });
    
    it('should log error but not throw on save failure', async () => {
      // Arrange
      (fs.promises.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.promises.writeFile as jest.Mock).mockRejectedValue(new Error('Disk full'));
      
      // Act & Assert - should not throw
      await expect(stateManager.saveState(validState)).resolves.toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save analysis state:',
        expect.any(Error)
      );
    });
    
    it('should log error but not throw on mkdir failure', async () => {
      // Arrange
      (fs.promises.mkdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));
      
      // Act & Assert - should not throw
      await expect(stateManager.saveState(validState)).resolves.toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save analysis state:',
        expect.any(Error)
      );
    });
  });
  
  describe('resetState', () => {
    it('should delete state file when it exists', async () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);
      
      // Act
      await stateManager.resetState();
      
      // Assert
      expect(fs.existsSync).toHaveBeenCalledWith(testStateFilePath);
      expect(fs.promises.unlink).toHaveBeenCalledWith(testStateFilePath);
    });
    
    it('should not attempt to delete when state file does not exist', async () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      // Act
      await stateManager.resetState();
      
      // Assert
      expect(fs.existsSync).toHaveBeenCalledWith(testStateFilePath);
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });
    
    it('should log error but not throw on deletion failure', async () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockRejectedValue(new Error('Permission denied'));
      
      // Act & Assert - should not throw
      await expect(stateManager.resetState()).resolves.toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to reset analysis state:',
        expect.any(Error)
      );
    });
  });
  
  describe('state validation', () => {
    it('should validate state with all required fields', async () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(validState));
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toEqual(validState);
      expect(console.warn).not.toHaveBeenCalled();
    });
    
    it('should reject state with null value', async () => {
      // Arrange
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue('null');
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith('Invalid state file, will perform full analysis');
    });
    
    it('should reject state with wrong type for lastAnalyzedCommit', async () => {
      // Arrange
      const invalidState = {
        lastAnalyzedCommit: 123, // Should be string
        accumulatedResults: [],
        lastAnalyzedAt: '2025-12-09T10:00:00.000Z',
        version: '1.0'
      };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(invalidState));
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith('Invalid state file, will perform full analysis');
    });
    
    it('should accept state with empty accumulatedResults array', async () => {
      // Arrange
      const stateWithEmptyResults = {
        ...validState,
        accumulatedResults: []
      };
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.readFile as jest.Mock).mockResolvedValue(JSON.stringify(stateWithEmptyResults));
      
      // Act
      const result = await stateManager.loadState();
      
      // Assert
      expect(result).toEqual(stateWithEmptyResults);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });
});
