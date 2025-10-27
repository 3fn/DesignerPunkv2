"use strict";
/**
 * Tests for HookIntegrationManager
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const HookIntegrationManager_1 = require("../HookIntegrationManager");
const AnalysisConfig_1 = require("../../config/AnalysisConfig");
const fs = __importStar(require("fs"));
// Mock fs module
jest.mock('fs', () => ({
    promises: {
        access: jest.fn(),
        mkdir: jest.fn(),
        writeFile: jest.fn(),
        readFile: jest.fn(),
        stat: jest.fn(),
        chmod: jest.fn(),
        unlink: jest.fn()
    }
}));
const mockFs = fs.promises;
describe('HookIntegrationManager', () => {
    let manager;
    let hookConfig;
    const testProjectRoot = '/test/project';
    beforeEach(() => {
        jest.clearAllMocks();
        hookConfig = {
            enabled: true,
            hookType: 'git',
            quickMode: true,
            timeoutSeconds: 10,
            failSilently: true,
            cacheResults: true
        };
        manager = new HookIntegrationManager_1.HookIntegrationManager(AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG, hookConfig, testProjectRoot);
    });
    describe('installGitHook', () => {
        it('should install Git hook successfully', async () => {
            // Mock directory exists
            mockFs.access.mockResolvedValue(undefined);
            mockFs.mkdir.mockResolvedValue(undefined);
            mockFs.writeFile.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            mockFs.readFile.mockResolvedValue('#!/bin/bash\necho "test"');
            const result = await manager.installGitHook();
            expect(result.success).toBe(true);
            expect(result.hookType).toBe('git');
            expect(result.hookPath).toContain('analyze-after-commit.sh');
            expect(mockFs.writeFile).toHaveBeenCalled();
        });
        it('should handle installation failure gracefully', async () => {
            mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));
            const result = await manager.installGitHook();
            expect(result.success).toBe(false);
            expect(result.messages.length).toBeGreaterThan(0);
            expect(result.messages.some(m => m.includes('failed'))).toBe(true);
        });
        it('should make hook executable', async () => {
            mockFs.access.mockResolvedValue(undefined);
            mockFs.mkdir.mockResolvedValue(undefined);
            mockFs.writeFile.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o644 // Not executable
            });
            mockFs.chmod.mockResolvedValue(undefined);
            mockFs.readFile.mockResolvedValue('#!/bin/bash\necho "test"');
            const result = await manager.installGitHook();
            expect(result.success).toBe(true);
            expect(mockFs.chmod).toHaveBeenCalledWith(expect.stringContaining('analyze-after-commit.sh'), 0o755);
        });
    });
    describe('installAgentHook', () => {
        it('should install agent hook successfully', async () => {
            mockFs.access.mockResolvedValue(undefined);
            mockFs.mkdir.mockResolvedValue(undefined);
            mockFs.writeFile.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            const result = await manager.installAgentHook();
            expect(result.success).toBe(true);
            expect(result.hookType).toBe('agent');
            expect(result.hookPath).toContain('analyze-after-commit.sh');
            expect(mockFs.writeFile).toHaveBeenCalledTimes(2); // Script + config
        });
        it('should create hook configuration file', async () => {
            mockFs.access.mockResolvedValue(undefined);
            mockFs.mkdir.mockResolvedValue(undefined);
            mockFs.writeFile.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            await manager.installAgentHook();
            const configCall = mockFs.writeFile.mock.calls.find(call => call[0].includes('.json'));
            expect(configCall).toBeDefined();
            const configContent = JSON.parse(configCall[1]);
            expect(configContent.name).toBe('release-analysis-on-task-completion');
            expect(configContent.events).toContain('task.completed');
        });
    });
    describe('uninstallGitHook', () => {
        it('should uninstall Git hook successfully', async () => {
            mockFs.access.mockResolvedValue(undefined);
            mockFs.unlink.mockResolvedValue(undefined);
            mockFs.readFile.mockResolvedValue('#!/bin/bash\necho "test"');
            mockFs.writeFile.mockResolvedValue(undefined);
            const result = await manager.uninstallGitHook();
            expect(result).toBe(true);
            expect(mockFs.unlink).toHaveBeenCalled();
        });
        it('should return false if hook does not exist', async () => {
            mockFs.access.mockRejectedValue(new Error('File not found'));
            const result = await manager.uninstallGitHook();
            expect(result).toBe(false);
            expect(mockFs.unlink).not.toHaveBeenCalled();
        });
    });
    describe('validateGitHook', () => {
        it('should validate installed hook successfully', async () => {
            mockFs.access.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            mockFs.readFile.mockResolvedValue('#!/bin/bash\nnpm run release:analyze\necho "done"');
            const result = await manager.validateGitHook();
            expect(result.valid).toBe(true);
            expect(result.hookType).toBe('git');
            expect(result.executable).toBe(true);
            expect(result.permissions).toBe('755');
        });
        it('should detect missing hook', async () => {
            mockFs.access.mockRejectedValue(new Error('File not found'));
            const result = await manager.validateGitHook();
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Hook file does not exist');
        });
        it('should detect non-executable hook', async () => {
            mockFs.access.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o644 // Not executable
            });
            mockFs.readFile.mockResolvedValue('#!/bin/bash\necho "test"');
            const result = await manager.validateGitHook();
            expect(result.valid).toBe(false);
            expect(result.executable).toBe(false);
            expect(result.errors).toContain('Hook file is not executable');
        });
        it('should warn if hook does not call release analysis', async () => {
            mockFs.access.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            mockFs.readFile.mockResolvedValue('#!/bin/bash\necho "test"');
            const result = await manager.validateGitHook();
            expect(result.warnings.length).toBeGreaterThan(0);
            expect(result.warnings.some(w => w.includes('does not appear to call release analysis'))).toBe(true);
        });
    });
    describe('validateAgentHook', () => {
        it('should validate installed agent hook successfully', async () => {
            // Mock both hook and config file exist (fileExists calls access twice)
            mockFs.access.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            mockFs.readFile.mockResolvedValue(JSON.stringify({
                name: 'test-hook',
                events: ['task.completed'],
                command: './test.sh'
            }));
            const result = await manager.validateAgentHook();
            expect(result.valid).toBe(true);
            expect(result.hookType).toBe('agent');
            expect(result.executable).toBe(true);
        });
        it('should detect missing configuration', async () => {
            mockFs.access
                .mockResolvedValueOnce(undefined) // Hook exists
                .mockRejectedValueOnce(new Error('Config not found')); // Config missing
            const result = await manager.validateAgentHook();
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Hook configuration does not exist');
        });
        it('should detect invalid JSON configuration', async () => {
            // Mock both hook and config file exist (fileExists calls access twice)
            mockFs.access.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            mockFs.readFile.mockResolvedValue('invalid json{');
            const result = await manager.validateAgentHook();
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('not valid JSON'))).toBe(true);
        });
    });
    describe('getHookConfig', () => {
        it('should return current hook configuration', () => {
            const config = manager.getHookConfig();
            expect(config).toEqual(hookConfig);
            expect(config.enabled).toBe(true);
            expect(config.hookType).toBe('git');
            expect(config.quickMode).toBe(true);
        });
        it('should return a copy of configuration', () => {
            const config1 = manager.getHookConfig();
            const config2 = manager.getHookConfig();
            expect(config1).toEqual(config2);
            expect(config1).not.toBe(config2); // Different objects
        });
    });
    describe('updateHookConfig', () => {
        it('should update hook configuration', () => {
            manager.updateHookConfig({
                quickMode: false,
                timeoutSeconds: 30
            });
            const config = manager.getHookConfig();
            expect(config.quickMode).toBe(false);
            expect(config.timeoutSeconds).toBe(30);
            expect(config.enabled).toBe(true); // Unchanged
        });
        it('should merge updates with existing configuration', () => {
            const originalConfig = manager.getHookConfig();
            manager.updateHookConfig({
                hookType: 'agent'
            });
            const updatedConfig = manager.getHookConfig();
            expect(updatedConfig.hookType).toBe('agent');
            expect(updatedConfig.enabled).toBe(originalConfig.enabled);
            expect(updatedConfig.quickMode).toBe(originalConfig.quickMode);
        });
    });
    describe('hook script generation', () => {
        it('should generate Git hook script with correct configuration', async () => {
            mockFs.access.mockResolvedValue(undefined);
            mockFs.mkdir.mockResolvedValue(undefined);
            mockFs.writeFile.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            mockFs.readFile.mockResolvedValue('#!/bin/bash\necho "test"');
            await manager.installGitHook();
            const writeCall = mockFs.writeFile.mock.calls[0];
            const scriptContent = writeCall[1];
            expect(scriptContent).toContain('#!/bin/bash');
            expect(scriptContent).toContain('npm run release:analyze');
            expect(scriptContent).toContain('TIMEOUT=10');
            expect(scriptContent).toContain('FAIL_SILENTLY=true');
        });
        it('should generate agent hook script with correct configuration', async () => {
            mockFs.access.mockResolvedValue(undefined);
            mockFs.mkdir.mockResolvedValue(undefined);
            mockFs.writeFile.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            await manager.installAgentHook();
            const scriptCall = mockFs.writeFile.mock.calls.find(call => call[0].includes('.sh'));
            const scriptContent = scriptCall[1];
            expect(scriptContent).toContain('#!/bin/bash');
            expect(scriptContent).toContain('npm run release:analyze');
            expect(scriptContent).toContain('TIMEOUT=10');
        });
        it('should include quick mode flag when enabled', async () => {
            manager.updateHookConfig({ quickMode: true });
            mockFs.access.mockResolvedValue(undefined);
            mockFs.mkdir.mockResolvedValue(undefined);
            mockFs.writeFile.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            mockFs.readFile.mockResolvedValue('#!/bin/bash\necho "test"');
            await manager.installGitHook();
            const writeCall = mockFs.writeFile.mock.calls[0];
            const scriptContent = writeCall[1];
            expect(scriptContent).toContain('QUICK_MODE="--quick"');
        });
        it('should not include quick mode flag when disabled', async () => {
            manager.updateHookConfig({ quickMode: false });
            mockFs.access.mockResolvedValue(undefined);
            mockFs.mkdir.mockResolvedValue(undefined);
            mockFs.writeFile.mockResolvedValue(undefined);
            mockFs.stat.mockResolvedValue({
                mode: 0o755
            });
            mockFs.readFile.mockResolvedValue('#!/bin/bash\necho "test"');
            await manager.installGitHook();
            const writeCall = mockFs.writeFile.mock.calls[0];
            const scriptContent = writeCall[1];
            expect(scriptContent).toContain('QUICK_MODE=""');
        });
    });
});
//# sourceMappingURL=HookIntegrationManager.test.js.map