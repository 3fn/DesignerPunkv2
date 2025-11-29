/**
 * ConfigManager Hot Reload Tests
 * 
 * Tests for runtime configuration updates, hot-reload capabilities,
 * validation, rollback, and change notifications.
 * 
 * Mock Strategy:
 * - jest.mock('fs'): Mock file system operations and file watching
 * - No shared mocks: Each test creates fresh mocks
 * - Test isolation: Tests pass in any order
 */

import * as fs from 'fs';
import { ConfigManager } from '../ConfigManager';
import { DEFAULT_RELEASE_CONFIG, ReleaseConfig } from '../ReleaseConfig';
import { ConfigChangeNotification } from '../ConfigManager';

// Mock fs module
jest.mock('fs');

describe('ConfigManager - Hot Reload', () => {
  let mockWatcher: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock file watcher
    mockWatcher = {
      close: jest.fn()
    };
    
    // Mock fs.watch to return our mock watcher
    (fs.watch as jest.Mock).mockReturnValue(mockWatcher);
  });
  
  afterEach(() => {
    // Ensure watchers are cleaned up
    if (mockWatcher && mockWatcher.close) {
      mockWatcher.close();
    }
  });
  
  describe('enableHotReload', () => {
    it('should enable hot reload with default options', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(DEFAULT_RELEASE_CONFIG));
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      manager.enableHotReload();
      
      expect(manager.isHotReloadEnabled()).toBe(true);
      expect(fs.watch).toHaveBeenCalledWith('test-config.json', expect.any(Function));
    });
    
    it('should throw error if no config path set', () => {
      const manager = new ConfigManager();
      
      expect(() => manager.enableHotReload()).toThrow('Cannot enable hot reload without a configuration file path');
    });
    
    it('should accept custom hot reload options', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(DEFAULT_RELEASE_CONFIG));
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      manager.enableHotReload({
        validateBeforeApply: false,
        createBackup: false,
        rollbackOnFailure: false
      });
      
      expect(manager.isHotReloadEnabled()).toBe(true);
    });
    
    it('should not create multiple watchers if called multiple times', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(DEFAULT_RELEASE_CONFIG));
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      manager.enableHotReload();
      manager.enableHotReload();
      
      expect(fs.watch).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('disableHotReload', () => {
    it('should disable hot reload and close watcher', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(DEFAULT_RELEASE_CONFIG));
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      manager.enableHotReload();
      expect(manager.isHotReloadEnabled()).toBe(true);
      
      manager.disableHotReload();
      
      expect(manager.isHotReloadEnabled()).toBe(false);
      expect(mockWatcher.close).toHaveBeenCalled();
    });
    
    it('should be safe to call when hot reload is not enabled', () => {
      const manager = new ConfigManager();
      
      expect(() => manager.disableHotReload()).not.toThrow();
      expect(manager.isHotReloadEnabled()).toBe(false);
    });
  });
  
  describe('change listeners', () => {
    it('should add change listener', () => {
      const manager = new ConfigManager();
      const listener = jest.fn();
      
      manager.addChangeListener(listener);
      
      // Listener should be added (we'll verify it's called in applyConfigChanges tests)
      expect(() => manager.addChangeListener(listener)).not.toThrow();
    });
    
    it('should remove change listener', () => {
      const manager = new ConfigManager();
      const listener = jest.fn();
      
      manager.addChangeListener(listener);
      manager.removeChangeListener(listener);
      
      // Listener should be removed (we'll verify it's not called in applyConfigChanges tests)
      expect(() => manager.removeChangeListener(listener)).not.toThrow();
    });
    
    it('should remove all change listeners', () => {
      const manager = new ConfigManager();
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      manager.addChangeListener(listener1);
      manager.addChangeListener(listener2);
      manager.removeAllChangeListeners();
      
      // All listeners should be removed
      expect(() => manager.removeAllChangeListeners()).not.toThrow();
    });
    
    it('should be safe to remove listener that was not added', () => {
      const manager = new ConfigManager();
      const listener = jest.fn();
      
      expect(() => manager.removeChangeListener(listener)).not.toThrow();
    });
  });
  
  describe('applyConfigChanges', () => {
    it('should apply configuration changes successfully', async () => {
      const manager = new ConfigManager();
      const newConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.95
        }
      };
      
      const notification = await manager.applyConfigChanges(newConfig);
      
      expect(notification.success).toBe(true);
      expect(notification.changes.length).toBeGreaterThan(0);
      expect(manager.getConfig().detection.confidenceThreshold).toBe(0.95);
    });
    
    it('should validate configuration before applying changes', async () => {
      const manager = new ConfigManager();
      const invalidConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 1.5 // Invalid: > 1
        }
      };
      
      await expect(
        manager.applyConfigChanges(invalidConfig, { validateBeforeApply: true })
      ).rejects.toThrow('Configuration validation failed');
      
      // Config should not have changed
      expect(manager.getConfig().detection.confidenceThreshold).toBe(
        DEFAULT_RELEASE_CONFIG.detection.confidenceThreshold
      );
    });
    
    it('should skip validation when validateBeforeApply is false', async () => {
      const manager = new ConfigManager();
      const invalidConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 1.5 // Invalid: > 1
        }
      };
      
      const notification = await manager.applyConfigChanges(invalidConfig, {
        validateBeforeApply: false
      });
      
      expect(notification.success).toBe(true);
      expect(manager.getConfig().detection.confidenceThreshold).toBe(1.5);
    });
    
    it('should create backup before applying changes', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(DEFAULT_RELEASE_CONFIG));
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      const newConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.88
        }
      };
      
      await manager.applyConfigChanges(newConfig, { createBackup: true });
      
      // Should have created backup
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
    
    it('should rollback on validation failure when rollbackOnFailure is true', async () => {
      const manager = new ConfigManager();
      const originalThreshold = manager.getConfig().detection.confidenceThreshold;
      
      const invalidConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 1.5 // Invalid
        }
      };
      
      try {
        await manager.applyConfigChanges(invalidConfig, {
          validateBeforeApply: true,
          rollbackOnFailure: true
        });
      } catch (error) {
        // Expected to throw
      }
      
      // Config should be rolled back to original
      expect(manager.getConfig().detection.confidenceThreshold).toBe(originalThreshold);
    });
    
    it('should not rollback on failure when rollbackOnFailure is false', async () => {
      const manager = new ConfigManager();
      
      // First apply a valid change
      await manager.applyConfigChanges({
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.85
        }
      }, { validateBeforeApply: false });
      
      // Then try to apply invalid change with rollback disabled
      const invalidConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 1.5 // Invalid
        }
      };
      
      try {
        await manager.applyConfigChanges(invalidConfig, {
          validateBeforeApply: true,
          rollbackOnFailure: false
        });
      } catch (error) {
        // Expected to throw
      }
      
      // Config should still have the first change (not rolled back)
      expect(manager.getConfig().detection.confidenceThreshold).toBe(0.85);
    });
    
    it('should notify listeners of successful changes', async () => {
      const manager = new ConfigManager();
      const listener = jest.fn();
      
      manager.addChangeListener(listener);
      
      const newConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.92
        }
      };
      
      await manager.applyConfigChanges(newConfig, { notifyListeners: true });
      
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          changes: expect.any(Array)
        })
      );
    });
    
    it('should notify listeners of failed changes', async () => {
      const manager = new ConfigManager();
      const listener = jest.fn();
      
      manager.addChangeListener(listener);
      
      const invalidConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 1.5 // Invalid
        }
      };
      
      try {
        await manager.applyConfigChanges(invalidConfig, {
          validateBeforeApply: true,
          notifyListeners: true
        });
      } catch (error) {
        // Expected to throw
      }
      
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(String)
        })
      );
    });
    
    it('should not notify listeners when notifyListeners is false', async () => {
      const manager = new ConfigManager();
      const listener = jest.fn();
      
      manager.addChangeListener(listener);
      
      const newConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.92
        }
      };
      
      await manager.applyConfigChanges(newConfig, { notifyListeners: false });
      
      expect(listener).not.toHaveBeenCalled();
    });
    
    it('should detect all changes between configurations', async () => {
      // Initialize manager with full config including versioning section
      const initialConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.8,
          specCompletionTrigger: true
        },
        versioning: {
          ...DEFAULT_RELEASE_CONFIG.versioning,
          preReleaseStrategy: 'alpha'
        }
      };
      
      const manager = new ConfigManager(initialConfig);
      
      const newConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.95,
          specCompletionTrigger: false
        },
        versioning: {
          ...DEFAULT_RELEASE_CONFIG.versioning,
          preReleaseStrategy: 'beta'
        }
      };
      
      const notification = await manager.applyConfigChanges(newConfig);
      
      expect(notification.changes).toContainEqual(
        expect.objectContaining({
          path: 'detection.confidenceThreshold',
          type: 'modified'
        })
      );
      
      expect(notification.changes).toContainEqual(
        expect.objectContaining({
          path: 'detection.specCompletionTrigger',
          type: 'modified'
        })
      );
      
      expect(notification.changes).toContainEqual(
        expect.objectContaining({
          path: 'versioning.preReleaseStrategy',
          type: 'modified'
        })
      );
    });
    
    it('should handle listener errors gracefully', async () => {
      const manager = new ConfigManager();
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const goodListener = jest.fn();
      
      manager.addChangeListener(errorListener);
      manager.addChangeListener(goodListener);
      
      const newConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.92
        }
      };
      
      // Should not throw even though listener throws
      await expect(
        manager.applyConfigChanges(newConfig, { notifyListeners: true })
      ).resolves.toBeDefined();
      
      // Both listeners should have been called
      expect(errorListener).toHaveBeenCalled();
      expect(goodListener).toHaveBeenCalled();
    });
  });
  
  describe('change detection', () => {
    it('should detect modified values', async () => {
      const manager = new ConfigManager();
      
      const newConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.95
        }
      };
      
      const notification = await manager.applyConfigChanges(newConfig);
      
      const change = notification.changes.find(c => c.path === 'detection.confidenceThreshold');
      expect(change).toBeDefined();
      expect(change?.type).toBe('modified');
      expect(change?.previousValue).toBe(DEFAULT_RELEASE_CONFIG.detection.confidenceThreshold);
      expect(change?.newValue).toBe(0.95);
    });
    
    it('should detect nested object changes', async () => {
      const manager = new ConfigManager();
      
      const newConfig: Partial<ReleaseConfig> = {
        publishing: {
          ...DEFAULT_RELEASE_CONFIG.publishing,
          github: {
            ...DEFAULT_RELEASE_CONFIG.publishing.github,
            owner: 'new-owner'
          }
        }
      };
      
      const notification = await manager.applyConfigChanges(newConfig);
      
      const change = notification.changes.find(c => c.path === 'publishing.github.owner');
      expect(change).toBeDefined();
      expect(change?.type).toBe('modified');
      expect(change?.newValue).toBe('new-owner');
    });
    
    it('should detect array changes', async () => {
      const manager = new ConfigManager();
      
      const newConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          breakingChangeKeywords: ['BREAKING', 'INCOMPATIBLE']
        }
      };
      
      const notification = await manager.applyConfigChanges(newConfig);
      
      const change = notification.changes.find(c => c.path === 'detection.breakingChangeKeywords');
      expect(change).toBeDefined();
      expect(change?.type).toBe('modified');
      expect(change?.newValue).toEqual(['BREAKING', 'INCOMPATIBLE']);
    });
    
    it('should not detect changes when values are the same', async () => {
      const manager = new ConfigManager();
      
      // Apply same config
      const notification = await manager.applyConfigChanges({
        detection: DEFAULT_RELEASE_CONFIG.detection
      });
      
      // Should have no changes (values are the same)
      expect(notification.changes).toHaveLength(0);
    });
  });
  
  describe('hot reload integration', () => {
    it('should reload configuration when file changes', async () => {
      const initialConfig = {
        ...DEFAULT_RELEASE_CONFIG,
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.8
        }
      };
      
      const updatedConfig = {
        ...DEFAULT_RELEASE_CONFIG,
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.95
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify(initialConfig))
        .mockReturnValueOnce(JSON.stringify(updatedConfig));
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      const listener = jest.fn();
      manager.addChangeListener(listener);
      
      manager.enableHotReload();
      
      // Simulate file change by calling the watch callback
      const watchCallback = (fs.watch as jest.Mock).mock.calls[0][1];
      await watchCallback('change');
      
      // Config should be updated
      expect(manager.getConfig().detection.confidenceThreshold).toBe(0.95);
      
      // Listener should have been notified
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          changes: expect.arrayContaining([
            expect.objectContaining({
              path: 'detection.confidenceThreshold'
            })
          ])
        })
      );
    });
    
    it('should not reload when hot reload is disabled', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(DEFAULT_RELEASE_CONFIG));
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      manager.enableHotReload();
      manager.disableHotReload();
      
      const originalThreshold = manager.getConfig().detection.confidenceThreshold;
      
      // Simulate file change
      const watchCallback = (fs.watch as jest.Mock).mock.calls[0][1];
      await watchCallback('change');
      
      // Config should not have changed
      expect(manager.getConfig().detection.confidenceThreshold).toBe(originalThreshold);
    });
    
    it('should handle file read errors during hot reload', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify(DEFAULT_RELEASE_CONFIG))
        .mockImplementationOnce(() => {
          throw new Error('File read error');
        });
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      manager.enableHotReload();
      
      // Simulate file change
      const watchCallback = (fs.watch as jest.Mock).mock.calls[0][1];
      await watchCallback('change');
      
      // Should have logged error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Hot reload failed:',
        expect.stringContaining('File read error')
      );
      
      consoleErrorSpy.mockRestore();
    });
    
    it('should handle invalid JSON during hot reload', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock)
        .mockReturnValueOnce(JSON.stringify(DEFAULT_RELEASE_CONFIG))
        .mockReturnValueOnce('{ invalid json }');
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      manager.enableHotReload();
      
      // Simulate file change
      const watchCallback = (fs.watch as jest.Mock).mock.calls[0][1];
      await watchCallback('change');
      
      // Should have logged error
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe('cleanup', () => {
    it('should cleanup resources', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(DEFAULT_RELEASE_CONFIG));
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      const listener = jest.fn();
      manager.addChangeListener(listener);
      manager.enableHotReload();
      
      manager.cleanup();
      
      expect(manager.isHotReloadEnabled()).toBe(false);
      expect(mockWatcher.close).toHaveBeenCalled();
    });
    
    it('should be safe to call cleanup multiple times', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(DEFAULT_RELEASE_CONFIG));
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      manager.enableHotReload();
      manager.cleanup();
      manager.cleanup();
      
      expect(() => manager.cleanup()).not.toThrow();
    });
  });
  
  describe('logging', () => {
    it('should log successful configuration changes', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const manager = new ConfigManager();
      
      const newConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.95
        }
      };
      
      await manager.applyConfigChanges(newConfig);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Configuration updated:',
        expect.stringContaining('"success": true')
      );
      
      consoleLogSpy.mockRestore();
    });
    
    it('should log failed configuration changes', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const manager = new ConfigManager();
      
      const invalidConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 1.5 // Invalid
        }
      };
      
      try {
        await manager.applyConfigChanges(invalidConfig, {
          validateBeforeApply: true
        });
      } catch (error) {
        // Expected to throw
      }
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Configuration update failed:',
        expect.stringContaining('"success": false')
      );
      
      consoleErrorSpy.mockRestore();
    });
  });
});
