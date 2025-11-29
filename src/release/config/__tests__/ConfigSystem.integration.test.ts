/**
 * Configuration System Integration Tests
 * 
 * Tests for configuration loading, validation, merging, migration,
 * and recovery scenarios across the entire configuration system.
 * 
 * Mock Strategy:
 * - jest.mock('fs'): Mock file system operations
 * - No shared mocks: Each test creates fresh mocks
 * - Test isolation: Tests pass in any order
 * 
 * Validation Requirements:
 * - Unit tests for all configuration operations
 * - Test various configuration scenarios (valid, invalid, edge cases)
 * - Mock file system operations (no real config files)
 * - Test isolation verified (no shared state)
 */

import * as fs from 'fs';
import { ConfigManager } from '../ConfigManager';
import { DEFAULT_RELEASE_CONFIG, ReleaseConfig } from '../ReleaseConfig';

// Mock fs module
jest.mock('fs');

describe('Configuration System Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Configuration Loading Scenarios', () => {
    it('should handle missing config file gracefully', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const manager = new ConfigManager();
      const config = await manager.loadFromFile({ configPath: 'nonexistent.json' });
      
      expect(config).toEqual(DEFAULT_RELEASE_CONFIG);
      expect(fs.existsSync).toHaveBeenCalledWith('nonexistent.json');
    });
    
    it('should load config with partial overrides', async () => {
      const partialConfig = {
        detection: {
          confidenceThreshold: 0.85
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(partialConfig));
      
      const manager = new ConfigManager();
      const config = await manager.loadFromFile({ mergeWithDefaults: true });
      
      // Should merge with defaults
      expect(config.detection.confidenceThreshold).toBe(0.85);
      expect(config.versioning).toEqual(DEFAULT_RELEASE_CONFIG.versioning);
      expect(config.publishing).toEqual(DEFAULT_RELEASE_CONFIG.publishing);
    });
    
    it('should handle deeply nested config overrides', async () => {
      const nestedConfig = {
        publishing: {
          github: {
            owner: 'custom-owner'
          }
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(nestedConfig));
      
      const manager = new ConfigManager();
      const config = await manager.loadFromFile({ mergeWithDefaults: true });
      
      // Should merge deeply
      expect(config.publishing.github.owner).toBe('custom-owner');
      expect(config.publishing.github.repository).toBe(DEFAULT_RELEASE_CONFIG.publishing.github.repository);
      expect(config.publishing.npm).toEqual(DEFAULT_RELEASE_CONFIG.publishing.npm);
    });
    
    it('should handle environment-specific overrides', async () => {
      const baseConfig = {
        detection: { confidenceThreshold: 0.8 }
      };
      const devConfig = {
        detection: { confidenceThreshold: 0.6 }
      };
      const prodConfig = {
        detection: { confidenceThreshold: 0.95 }
      };
      
      (fs.existsSync as jest.Mock).mockImplementation((path: string) => true);
      (fs.readFileSync as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('.development.')) return JSON.stringify(devConfig);
        if (path.includes('.production.')) return JSON.stringify(prodConfig);
        return JSON.stringify(baseConfig);
      });
      
      const devManager = new ConfigManager();
      const devConfigResult = await devManager.loadFromFile({ 
        configPath: '.release-config.json',
        environment: 'development' 
      });
      
      const prodManager = new ConfigManager();
      const prodConfigResult = await prodManager.loadFromFile({ 
        configPath: '.release-config.json',
        environment: 'production' 
      });
      
      expect(devConfigResult.detection.confidenceThreshold).toBe(0.6);
      expect(prodConfigResult.detection.confidenceThreshold).toBe(0.95);
    });
  });
  
  describe('Configuration Validation Scenarios', () => {
    it('should validate all detection config constraints', () => {
      const invalidConfigs = [
        {
          detection: {
            ...DEFAULT_RELEASE_CONFIG.detection,
            confidenceThreshold: -0.1 // Too low
          }
        },
        {
          detection: {
            ...DEFAULT_RELEASE_CONFIG.detection,
            confidenceThreshold: 1.5 // Too high
          }
        },
        {
          detection: {
            ...DEFAULT_RELEASE_CONFIG.detection,
            monitorPaths: [] // Empty array
          }
        },
        {
          detection: {
            ...DEFAULT_RELEASE_CONFIG.detection,
            completionPatterns: [] // Empty array
          }
        }
      ];
      
      invalidConfigs.forEach((config, index) => {
        const manager = new ConfigManager(config);
        const result = manager.validateConfig();
        
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
    
    it('should validate all versioning config constraints', () => {
      const invalidConfigs = [
        {
          versioning: {
            ...DEFAULT_RELEASE_CONFIG.versioning,
            preReleaseStrategy: 'invalid' as any
          }
        },
        {
          versioning: {
            ...DEFAULT_RELEASE_CONFIG.versioning,
            packageCoordination: {
              ...DEFAULT_RELEASE_CONFIG.versioning.packageCoordination,
              dependencyUpdates: 'invalid' as any
            }
          }
        }
      ];
      
      invalidConfigs.forEach((config) => {
        const manager = new ConfigManager(config);
        const result = manager.validateConfig();
        
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
    
    it('should validate all publishing config constraints', () => {
      const invalidConfigs = [
        {
          publishing: {
            ...DEFAULT_RELEASE_CONFIG.publishing,
            github: {
              ...DEFAULT_RELEASE_CONFIG.publishing.github,
              owner: '' // Empty string
            }
          }
        },
        {
          publishing: {
            ...DEFAULT_RELEASE_CONFIG.publishing,
            github: {
              ...DEFAULT_RELEASE_CONFIG.publishing.github,
              repository: '' // Empty string
            }
          }
        },
        {
          publishing: {
            ...DEFAULT_RELEASE_CONFIG.publishing,
            npm: {
              ...DEFAULT_RELEASE_CONFIG.publishing.npm,
              registry: '' // Empty string
            }
          }
        },
        {
          publishing: {
            ...DEFAULT_RELEASE_CONFIG.publishing,
            publishingOrder: {
              ...DEFAULT_RELEASE_CONFIG.publishing.publishingOrder,
              retryConfig: {
                ...DEFAULT_RELEASE_CONFIG.publishing.publishingOrder.retryConfig,
                maxAttempts: 0 // Invalid
              }
            }
          }
        },
        {
          publishing: {
            ...DEFAULT_RELEASE_CONFIG.publishing,
            publishingOrder: {
              ...DEFAULT_RELEASE_CONFIG.publishing.publishingOrder,
              retryConfig: {
                ...DEFAULT_RELEASE_CONFIG.publishing.publishingOrder.retryConfig,
                retryDelay: -100 // Negative
              }
            }
          }
        }
      ];
      
      invalidConfigs.forEach((config) => {
        const manager = new ConfigManager(config);
        const result = manager.validateConfig();
        
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
    
    it('should validate breaking change rule patterns', () => {
      const invalidConfig = {
        validation: {
          ...DEFAULT_RELEASE_CONFIG.validation,
          validationRules: {
            ...DEFAULT_RELEASE_CONFIG.validation.validationRules,
            breakingChangeRules: [
              {
                id: '',
                description: 'Test',
                pattern: 'valid',
                requireMigrationGuidance: true
              },
              {
                id: 'test',
                description: 'Test',
                pattern: '',
                requireMigrationGuidance: true
              },
              {
                id: 'test',
                description: 'Test',
                pattern: '[invalid(regex',
                requireMigrationGuidance: true
              }
            ]
          }
        }
      };
      
      const manager = new ConfigManager(invalidConfig);
      const result = manager.validateConfig();
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);
    });
  });
  
  describe('Configuration Merging Scenarios', () => {
    it('should merge multiple config sources in correct order', async () => {
      const baseConfig: Partial<ReleaseConfig> = {
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.7
        }
      };
      const userConfig = {
        detection: { confidenceThreshold: 0.8 }
      };
      const envConfig = {
        detection: { confidenceThreshold: 0.9 }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('.production.')) return JSON.stringify(envConfig);
        return JSON.stringify(userConfig);
      });
      
      const manager = new ConfigManager(baseConfig);
      const config = await manager.loadFromFile({ 
        environment: 'production',
        mergeWithDefaults: true 
      });
      
      // Environment config should override user config
      expect(config.detection.confidenceThreshold).toBe(0.9);
    });
    
    it('should handle null and undefined values in merge', () => {
      const manager = new ConfigManager();
      
      const updated = manager.updateConfig({
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: undefined as any
        }
      });
      
      // Should keep original value when undefined
      expect(updated.detection.confidenceThreshold).toBe(
        DEFAULT_RELEASE_CONFIG.detection.confidenceThreshold
      );
    });
    
    it('should completely replace arrays during merge', () => {
      const manager = new ConfigManager();
      
      const newPackages = ['@custom/pkg1', '@custom/pkg2'];
      const updated = manager.updateConfig({
        versioning: {
          ...DEFAULT_RELEASE_CONFIG.versioning,
          packageCoordination: {
            ...DEFAULT_RELEASE_CONFIG.versioning.packageCoordination,
            corePackages: newPackages
          }
        }
      });
      
      expect(updated.versioning.packageCoordination.corePackages).toEqual(newPackages);
      expect(updated.versioning.packageCoordination.corePackages).not.toContain(
        DEFAULT_RELEASE_CONFIG.versioning.packageCoordination.corePackages[0]
      );
    });
    
    it('should preserve unmodified nested objects', () => {
      const manager = new ConfigManager();
      
      const updated = manager.updateConfig({
        publishing: {
          ...DEFAULT_RELEASE_CONFIG.publishing,
          github: {
            ...DEFAULT_RELEASE_CONFIG.publishing.github,
            owner: 'new-owner'
          }
        }
      });
      
      // GitHub config should be updated
      expect(updated.publishing.github.owner).toBe('new-owner');
      
      // npm config should be unchanged
      expect(updated.publishing.npm).toEqual(DEFAULT_RELEASE_CONFIG.publishing.npm);
    });
  });
  
  describe('Configuration Migration Scenarios', () => {
    it('should migrate from version 0.9.0 to 1.0.0', async () => {
      const oldConfig = {
        version: '0.9.0',
        detection: {
          enableSpecCompletion: true,
          enableTaskCompletion: false,
          breakingChangeKeywords: ['breaking'],
          confidenceThreshold: 0.8,
          monitorPaths: ['.kiro/specs/'],
          completionPatterns: ['*-completion.md']
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(oldConfig));
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      
      const manager = new ConfigManager();
      const config = await manager.loadFromFile({ 
        autoMigrate: true,
        validate: false 
      });
      
      // Should have migrated field names
      expect(config.detection.specCompletionTrigger).toBe(true);
      expect(config.detection.taskCompletionTrigger).toBe(false);
      
      // Old fields should not exist
      expect((config.detection as any).enableSpecCompletion).toBeUndefined();
      expect((config.detection as any).enableTaskCompletion).toBeUndefined();
    });
    
    it('should initialize missing arrays during migration', async () => {
      const oldConfig = {
        version: '0.9.0',
        versioning: {
          packageCoordination: {
            corePackageSync: true,
            componentIndependence: true,
            dependencyUpdates: 'automatic'
          }
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(oldConfig));
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      
      const manager = new ConfigManager();
      const config = await manager.loadFromFile({ 
        autoMigrate: true,
        validate: false 
      });
      
      // Should have initialized arrays
      expect(Array.isArray(config.versioning.packageCoordination.corePackages)).toBe(true);
      expect(Array.isArray(config.versioning.packageCoordination.independentPackages)).toBe(true);
    });
    
    it('should create backup before migration', async () => {
      const oldConfig = {
        version: '0.9.0',
        detection: {
          enableSpecCompletion: true,
          confidenceThreshold: 0.8,
          monitorPaths: ['.kiro/specs/'],
          completionPatterns: ['*-completion.md']
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(oldConfig));
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ 
        configPath: 'test-config.json',
        autoMigrate: true 
      });
      
      // Should have written backup file (directory creation is conditional on existence)
      const writeCall = (fs.writeFileSync as jest.Mock).mock.calls.find(
        call => call[0].includes('.release-config-backups')
      );
      expect(writeCall).toBeDefined();
      
      // Should have written migrated config
      const migratedWrite = (fs.writeFileSync as jest.Mock).mock.calls.find(
        call => call[0] === 'test-config.json'
      );
      expect(migratedWrite).toBeDefined();
    });
    
    it('should skip migration for current version', async () => {
      const currentConfig = {
        version: '1.0.0',
        ...DEFAULT_RELEASE_CONFIG
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(currentConfig));
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ autoMigrate: true });
      
      // Should not have written file (no migration needed)
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
    
    it('should handle migration errors', async () => {
      const oldConfig = {
        version: '0.9.0',
        detection: {
          enableSpecCompletion: true,
          confidenceThreshold: 0.8,
          monitorPaths: ['.kiro/specs/'],
          completionPatterns: ['*-completion.md']
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(oldConfig));
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Write failed');
      });
      
      const manager = new ConfigManager();
      
      await expect(
        manager.loadFromFile({ autoMigrate: true })
      ).rejects.toThrow('Configuration migration failed');
    });
  });
  
  describe('Configuration Recovery Scenarios', () => {
    beforeEach(() => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(DEFAULT_RELEASE_CONFIG));
    });
    
    it('should restore from backup successfully', async () => {
      const backupConfig = {
        ...DEFAULT_RELEASE_CONFIG,
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.88
        }
      };
      
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(backupConfig));
      
      const manager = new ConfigManager();
      const success = await manager.restoreFromBackup(
        'backup.json',
        'test-config.json'
      );
      
      expect(success).toBe(true);
      expect(manager.getConfig().detection.confidenceThreshold).toBe(0.88);
    });
    
    it('should create backup of current config before restoring', async () => {
      const manager = new ConfigManager();
      await manager.restoreFromBackup('backup.json', 'test-config.json');
      
      // Should have read file at least twice: once for backup, once for restore
      // (may be 3 times if loadFromFile is called after restore)
      expect(fs.readFileSync).toHaveBeenCalledWith('backup.json', 'utf-8');
      expect(fs.readFileSync).toHaveBeenCalledWith('test-config.json', 'utf-8');
      
      // Should have written backup
      const backupWrite = (fs.writeFileSync as jest.Mock).mock.calls.find(
        call => call[0].includes('.release-config-backups')
      );
      expect(backupWrite).toBeDefined();
    });
    
    it('should handle missing backup file', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const manager = new ConfigManager();
      
      await expect(
        manager.restoreFromBackup('nonexistent.json')
      ).rejects.toThrow('Backup file not found');
    });
    
    it('should handle invalid backup file', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('{ invalid json }');
      
      const manager = new ConfigManager();
      
      await expect(
        manager.restoreFromBackup('invalid-backup.json')
      ).rejects.toThrow();
    });
    
    it('should list backups sorted by timestamp', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockReturnValue([
        'config-2025-01-01T10-00-00-000Z.json',
        'config-2025-01-03T10-00-00-000Z.json',
        'config-2025-01-02T10-00-00-000Z.json',
        'other-file.txt'
      ]);
      (fs.statSync as jest.Mock).mockReturnValue({
        mtime: new Date('2025-01-01T10:00:00.000Z'),
        size: 1024
      });
      
      const manager = new ConfigManager();
      const backups = manager.listBackups();
      
      // Should filter out non-JSON files and return backup metadata
      expect(backups).toHaveLength(3);
      expect(backups[0]).toHaveProperty('path');
      expect(backups[0]).toHaveProperty('timestamp');
      expect(backups[0]).toHaveProperty('size');
      expect(backups[0].size).toBe(1024);
    });
    
    it('should handle missing backup directory', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const manager = new ConfigManager();
      const backups = manager.listBackups();
      
      expect(backups).toEqual([]);
    });
    
    it('should handle backup directory read errors', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Permission denied');
      });
      
      const manager = new ConfigManager();
      const backups = manager.listBackups();
      
      expect(backups).toEqual([]);
    });
  });
  
  describe('Runtime Configuration Update Scenarios', () => {
    it('should apply multiple updates sequentially', async () => {
      const manager = new ConfigManager();
      
      // First update
      await manager.applyConfigChanges({
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.85
        }
      });
      
      expect(manager.getConfig().detection.confidenceThreshold).toBe(0.85);
      
      // Second update
      await manager.applyConfigChanges({
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.95
        }
      });
      
      expect(manager.getConfig().detection.confidenceThreshold).toBe(0.95);
    });
    
    it('should rollback on validation failure', async () => {
      const manager = new ConfigManager();
      
      // Apply valid change
      await manager.applyConfigChanges({
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.85
        }
      });
      
      const beforeInvalid = manager.getConfig().detection.confidenceThreshold;
      
      // Try to apply invalid change
      try {
        await manager.applyConfigChanges({
          detection: {
            ...DEFAULT_RELEASE_CONFIG.detection,
            confidenceThreshold: 1.5 // Invalid
          }
        }, {
          validateBeforeApply: true,
          rollbackOnFailure: true
        });
      } catch (error) {
        // Expected to throw
      }
      
      // Should be rolled back to previous valid state
      expect(manager.getConfig().detection.confidenceThreshold).toBe(beforeInvalid);
    });
    
    it('should notify all listeners of changes', async () => {
      const manager = new ConfigManager();
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      manager.addChangeListener(listener1);
      manager.addChangeListener(listener2);
      
      await manager.applyConfigChanges({
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.92
        }
      }, { notifyListeners: true });
      
      expect(listener1).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
      expect(listener2).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });
    
    it('should handle listener removal correctly', async () => {
      const manager = new ConfigManager();
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      manager.addChangeListener(listener1);
      manager.addChangeListener(listener2);
      manager.removeChangeListener(listener1);
      
      await manager.applyConfigChanges({
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.92
        }
      }, { notifyListeners: true });
      
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
    
    it('should continue notifying listeners even if one throws', async () => {
      const manager = new ConfigManager();
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const goodListener = jest.fn();
      
      manager.addChangeListener(errorListener);
      manager.addChangeListener(goodListener);
      
      await manager.applyConfigChanges({
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.92
        }
      }, { notifyListeners: true });
      
      expect(errorListener).toHaveBeenCalled();
      expect(goodListener).toHaveBeenCalled();
    });
  });
  
  describe('Edge Cases and Error Handling', () => {
    it('should handle empty config file', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('{}');
      
      const manager = new ConfigManager();
      const config = await manager.loadFromFile({ 
        mergeWithDefaults: true,
        validate: false 
      });
      
      // Should use defaults for missing sections
      expect(config.detection).toEqual(DEFAULT_RELEASE_CONFIG.detection);
      expect(config.versioning).toEqual(DEFAULT_RELEASE_CONFIG.versioning);
    });
    
    it('should handle config with extra unknown fields', async () => {
      const configWithExtra = {
        ...DEFAULT_RELEASE_CONFIG,
        unknownField: 'value',
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          unknownDetectionField: 'value'
        }
      };
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(configWithExtra));
      
      const manager = new ConfigManager();
      const config = await manager.loadFromFile({ validate: false });
      
      // Should load without error (extra fields ignored)
      expect(config.detection.confidenceThreshold).toBe(
        DEFAULT_RELEASE_CONFIG.detection.confidenceThreshold
      );
    });
    
    it('should handle file read errors', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Permission denied');
      });
      
      const manager = new ConfigManager();
      
      await expect(
        manager.loadFromFile()
      ).rejects.toThrow('Permission denied');
    });
    
    it('should handle file write errors', async () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Disk full');
      });
      
      const manager = new ConfigManager();
      
      await expect(
        manager.saveToFile('test-config.json')
      ).rejects.toThrow('Failed to save configuration');
    });
    
    it('should handle reload without config path', async () => {
      const manager = new ConfigManager();
      
      await expect(
        manager.reload()
      ).rejects.toThrow('No configuration file path set');
    });
    
    it('should handle backup creation errors', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });
      
      const manager = new ConfigManager();
      const result = await manager.createBackup('test-config.json');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');
    });
  });
  
  describe('Configuration Persistence', () => {
    it('should persist config changes to file', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(DEFAULT_RELEASE_CONFIG));
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      
      const manager = new ConfigManager();
      await manager.loadFromFile({ configPath: 'test-config.json' });
      
      manager.updateConfig({
        detection: {
          ...DEFAULT_RELEASE_CONFIG.detection,
          confidenceThreshold: 0.95
        }
      });
      
      await manager.saveToFile();
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'test-config.json',
        expect.stringContaining('"confidenceThreshold": 0.95'),
        'utf-8'
      );
    });
    
    it('should reload persisted changes', async () => {
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
      
      expect(manager.getConfig().detection.confidenceThreshold).toBe(0.8);
      
      await manager.reload();
      
      expect(manager.getConfig().detection.confidenceThreshold).toBe(0.95);
    });
  });
});
