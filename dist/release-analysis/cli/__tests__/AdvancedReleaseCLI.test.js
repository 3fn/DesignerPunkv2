"use strict";
/**
 * Tests for Advanced Release Analysis CLI
 *
 * Tests the enhanced CLI features including interactive mode, configuration management,
 * analysis history, and dry-run capabilities.
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
const AdvancedReleaseCLI_1 = require("../AdvancedReleaseCLI");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const os = __importStar(require("os"));
// Mock readline for testing
jest.mock('readline', () => ({
    createInterface: jest.fn(() => ({
        question: jest.fn(),
        close: jest.fn()
    }))
}));
// Mock fs operations
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
        mkdir: jest.fn(),
        access: jest.fn(),
        unlink: jest.fn(),
        mkdtemp: jest.fn(),
        rmdir: jest.fn()
    }
}));
// Mock glob
jest.mock('glob', () => ({
    glob: jest.fn()
}));
describe('AdvancedReleaseCLI', () => {
    let cli;
    let tempDir;
    let mockReadFile;
    let mockWriteFile;
    let mockMkdir;
    let mockMkdtemp;
    beforeEach(async () => {
        mockMkdtemp = fs_1.promises.mkdtemp;
        mockMkdtemp.mockResolvedValue('/tmp/test-dir');
        tempDir = await fs_1.promises.mkdtemp(path.join(os.tmpdir(), 'release-cli-test-'));
        cli = new AdvancedReleaseCLI_1.AdvancedReleaseCLI(tempDir);
        mockReadFile = fs_1.promises.readFile;
        mockWriteFile = fs_1.promises.writeFile;
        mockMkdir = fs_1.promises.mkdir;
        // Reset mocks
        jest.clearAllMocks();
    });
    afterEach(async () => {
        // No cleanup needed for mocked fs
    });
    describe('Configuration Management', () => {
        it('should show current configuration', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            await cli.manageConfiguration({ show: true });
            expect(consoleSpy).toHaveBeenCalledWith('📋 Current Configuration');
            expect(consoleSpy).toHaveBeenCalledWith('='.repeat(40));
            consoleSpy.mockRestore();
        });
        it('should validate configuration successfully', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            await cli.manageConfiguration({ validate: true });
            expect(consoleSpy).toHaveBeenCalledWith('🔍 Validating configuration...');
            expect(consoleSpy).toHaveBeenCalledWith('✅ Configuration is valid');
            consoleSpy.mockRestore();
        });
        it('should detect configuration errors', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            // Modify CLI to have invalid configuration for testing
            cli.config = {
                extraction: {
                    confidenceThresholds: {
                        minimumConfidence: 1.5, // Invalid: > 1
                        uncertaintyThreshold: -0.1, // Invalid: < 0
                        reviewThreshold: 0.5,
                        deduplicationThreshold: 0.8,
                        semanticSimilarityThreshold: 0.7
                    },
                    completionPatterns: [] // Invalid: empty array
                },
                reporting: {
                    outputFiles: {
                        outputDirectory: '/nonexistent/path'
                    }
                }
            };
            await cli.manageConfiguration({ validate: true });
            expect(consoleSpy).toHaveBeenCalledWith('❌ Configuration errors:');
            expect(consoleSpy).toHaveBeenCalledWith('⚠️  Configuration warnings:');
            consoleSpy.mockRestore();
        });
        it('should set configuration values', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            mockMkdir.mockResolvedValue(undefined);
            mockWriteFile.mockResolvedValue(undefined);
            await cli.manageConfiguration({
                set: {
                    key: 'extraction.confidenceThresholds.minimumConfidence',
                    value: '0.7'
                }
            });
            expect(consoleSpy).toHaveBeenCalledWith('✅ Configuration updated: extraction.confidenceThresholds.minimumConfidence = 0.7');
            expect(mockWriteFile).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
        it('should handle invalid configuration keys', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            await cli.manageConfiguration({
                set: {
                    key: 'invalid.key.path',
                    value: 'test'
                }
            });
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ Error setting configuration'));
            consoleSpy.mockRestore();
        });
    });
    describe('Analysis History', () => {
        it('should show empty history message', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            mockReadFile.mockRejectedValue(new Error('File not found'));
            await cli.manageHistory({ list: true });
            expect(consoleSpy).toHaveBeenCalledWith('📋 No analysis history found');
            consoleSpy.mockRestore();
        });
        it('should list analysis history', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const mockHistory = [
                {
                    id: 'analysis-123',
                    timestamp: new Date('2023-01-01'),
                    result: {
                        versionRecommendation: { recommendedVersion: '1.1.0' },
                        changes: {
                            breakingChanges: [],
                            newFeatures: [{ id: '1' }],
                            bugFixes: [],
                            improvements: []
                        }
                    },
                    duration: 1000
                }
            ];
            mockReadFile.mockResolvedValue(JSON.stringify(mockHistory));
            await cli.manageHistory({ list: true });
            expect(consoleSpy).toHaveBeenCalledWith('📋 Analysis History');
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('analysis-123'));
            consoleSpy.mockRestore();
        });
        it('should show history entry details', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const mockHistory = [
                {
                    id: 'analysis-123',
                    timestamp: new Date('2023-01-01'),
                    result: {
                        versionRecommendation: { recommendedVersion: '1.1.0' },
                        changes: {
                            breakingChanges: [],
                            newFeatures: [{ id: '1' }],
                            bugFixes: [],
                            improvements: []
                        },
                        confidence: { overall: 0.9 }
                    },
                    duration: 1000
                }
            ];
            mockReadFile.mockResolvedValue(JSON.stringify(mockHistory));
            await cli.manageHistory({ show: 'analysis-123' });
            expect(consoleSpy).toHaveBeenCalledWith('📋 Analysis Details: analysis-123');
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Version: 1.1.0'));
            consoleSpy.mockRestore();
        });
        it('should handle missing history entry', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            mockReadFile.mockResolvedValue('[]');
            await cli.manageHistory({ show: 'nonexistent' });
            expect(consoleSpy).toHaveBeenCalledWith('❌ History entry not found: nonexistent');
            consoleSpy.mockRestore();
        });
    });
    describe('Dry-run and Preview', () => {
        it('should show analysis preview in dry-run mode', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            // Mock the preview analysis to return a simple scope
            const mockScope = {
                fromTag: 'v1.0.0',
                toCommit: 'HEAD',
                completionDocuments: [
                    {
                        path: 'test-completion.md',
                        metadata: { type: 'task-completion' }
                    }
                ],
                analysisDate: new Date()
            };
            // Mock the CLI methods
            jest.spyOn(cli, 'previewAnalysis').mockResolvedValue(mockScope);
            jest.spyOn(cli, 'promptUser').mockResolvedValue('n');
            const result = await cli.analyzeChanges({ dryRun: true });
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🔍 Dry-run mode: Previewing analysis scope...'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('📋 Analysis Preview'));
            expect(result.versionRecommendation.rationale).toContain('cancelled by user');
            consoleSpy.mockRestore();
        });
    });
    describe('Interactive Mode', () => {
        it('should handle interactive review of ambiguous items', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            // Mock user input for interactive review
            const mockPromptUser = jest.spyOn(cli, 'promptUser')
                .mockResolvedValueOnce('k') // Keep first item
                .mockResolvedValueOnce('r'); // Remove second item
            const mockChanges = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.8,
                    ambiguousItems: ['Ambiguous item 1', 'Ambiguous item 2'],
                    filteredItems: []
                }
            };
            await cli.interactiveReview(mockChanges, { interactive: true });
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('📋 Interactive Review Mode'));
            expect(mockPromptUser).toHaveBeenCalledTimes(2);
            expect(mockChanges.metadata.ambiguousItems).toHaveLength(1); // One item removed
            consoleSpy.mockRestore();
        });
        it('should auto-approve items when autoApprove is enabled', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const mockChanges = {
                breakingChanges: [],
                newFeatures: [],
                bugFixes: [],
                improvements: [],
                documentation: [],
                metadata: {
                    documentsAnalyzed: 1,
                    extractionConfidence: 0.8,
                    ambiguousItems: ['Ambiguous item 1'],
                    filteredItems: []
                }
            };
            await cli.interactiveReview(mockChanges, {
                interactive: true,
                autoApprove: true
            });
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('📋 Interactive Review Mode'));
            // Should not prompt for user input when auto-approve is enabled
            consoleSpy.mockRestore();
        });
    });
    describe('Argument Parsing', () => {
        it('should parse basic analysis arguments', () => {
            const args = ['--since', 'v1.0.0', '--format', 'detailed', '--dry-run'];
            const result = cli.parseAdvancedArguments(args);
            expect(result.command).toBe('analyze');
            expect(result.options.since).toBe('v1.0.0');
            expect(result.options.outputFormat).toBe('detailed');
            expect(result.options.dryRun).toBe(true);
        });
        it('should parse interactive options', () => {
            const args = ['--interactive', '--auto-approve', '--review-threshold', '0.8'];
            const result = cli.parseAdvancedArguments(args);
            expect(result.options.interactive).toBe(true);
            expect(result.options.autoApprove).toBe(true);
            expect(result.options.reviewThreshold).toBe(0.8);
        });
        it('should parse configuration options', () => {
            const args = ['config', '--config-show', '--config-set', 'key=value'];
            const result = cli.parseAdvancedArguments(args);
            expect(result.command).toBe('config');
            expect(result.configOptions.show).toBe(true);
            expect(result.configOptions.set).toEqual({ key: 'key', value: 'value' });
        });
        it('should parse history options', () => {
            const args = ['history', '--history-list', '--history-compare', 'analysis-123'];
            const result = cli.parseAdvancedArguments(args);
            expect(result.command).toBe('history');
            expect(result.historyOptions.list).toBe(true);
            expect(result.historyOptions.compare).toBe('analysis-123');
        });
    });
    describe('Version Override', () => {
        it('should allow version override from major to minor', async () => {
            const mockPromptUser = jest.spyOn(cli, 'promptUser')
                .mockResolvedValue('1'); // Choose minor version
            const currentRecommendation = {
                currentVersion: '1.0.0',
                recommendedVersion: '2.0.0',
                bumpType: 'major',
                rationale: 'Breaking changes detected',
                confidence: 0.9,
                evidence: []
            };
            const override = await cli.promptVersionOverride(currentRecommendation);
            expect(override).toEqual({
                recommendedVersion: '1.1.0',
                bumpType: 'minor',
                rationale: 'User override: Changed from major to minor bump'
            });
            mockPromptUser.mockRestore();
        });
        it('should allow version override from major to patch', async () => {
            const mockPromptUser = jest.spyOn(cli, 'promptUser')
                .mockResolvedValue('2'); // Choose patch version
            const currentRecommendation = {
                currentVersion: '1.0.0',
                recommendedVersion: '2.0.0',
                bumpType: 'major',
                rationale: 'Breaking changes detected',
                confidence: 0.9,
                evidence: []
            };
            const override = await cli.promptVersionOverride(currentRecommendation);
            expect(override).toEqual({
                recommendedVersion: '1.0.1',
                bumpType: 'patch',
                rationale: 'User override: Changed from major to patch bump'
            });
            mockPromptUser.mockRestore();
        });
        it('should return null when keeping current recommendation', async () => {
            const mockPromptUser = jest.spyOn(cli, 'promptUser')
                .mockResolvedValue('3'); // Keep current
            const currentRecommendation = {
                currentVersion: '1.0.0',
                recommendedVersion: '2.0.0',
                bumpType: 'major',
                rationale: 'Breaking changes detected',
                confidence: 0.9,
                evidence: []
            };
            const override = await cli.promptVersionOverride(currentRecommendation);
            expect(override).toBeNull();
            mockPromptUser.mockRestore();
        });
    });
    describe('Error Handling', () => {
        it('should handle configuration loading errors gracefully', async () => {
            mockReadFile.mockRejectedValue(new Error('Config file not found'));
            // Should not throw and should use default configuration
            await cli.loadConfiguration();
            expect(cli.config).toBeDefined();
            expect(cli.config.extraction).toBeDefined();
        });
        it('should handle history loading errors gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            mockReadFile.mockRejectedValue(new Error('History file not found'));
            await cli.manageHistory({ show: 'test-id' });
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('❌ History entry not found'));
            consoleSpy.mockRestore();
        });
    });
    describe('Report Display', () => {
        let mockResult;
        beforeEach(() => {
            mockResult = {
                scope: {
                    fromTag: 'v1.0.0',
                    toCommit: 'HEAD',
                    completionDocuments: [],
                    analysisDate: new Date('2023-01-01')
                },
                changes: {
                    breakingChanges: [{ id: '1', title: 'Breaking change', description: 'Test', affectedAPIs: [], source: 'test', severity: 'high' }],
                    newFeatures: [{ id: '2', title: 'New feature', description: 'Test', benefits: [], requirements: [], artifacts: [], source: 'test', category: 'enhancement' }],
                    bugFixes: [],
                    improvements: [],
                    documentation: [],
                    metadata: {
                        documentsAnalyzed: 1,
                        extractionConfidence: 0.9,
                        ambiguousItems: ['Ambiguous item'],
                        filteredItems: []
                    }
                },
                versionRecommendation: {
                    currentVersion: '1.0.0',
                    recommendedVersion: '2.0.0',
                    bumpType: 'major',
                    rationale: 'Breaking changes detected',
                    confidence: 0.9,
                    evidence: [
                        {
                            type: 'breaking',
                            description: 'API change detected',
                            source: 'test-completion.md',
                            impact: 'high'
                        }
                    ]
                },
                releaseNotes: '# Release 2.0.0\n\nBreaking changes included.',
                confidence: {
                    overall: 0.9,
                    extraction: 0.9,
                    categorization: 0.8,
                    deduplication: 0.95,
                    versionCalculation: 0.9
                }
            };
        });
        it('should display detailed report correctly', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            cli.showDetailedReport(mockResult);
            expect(consoleSpy).toHaveBeenCalledWith('📊 Detailed Analysis Report');
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Version Recommendation:'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Changes Summary:'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Confidence Metrics:'));
            consoleSpy.mockRestore();
        });
        it('should display summary report correctly', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            cli.showSummaryReport(mockResult);
            expect(consoleSpy).toHaveBeenCalledWith('📊 Release Analysis Summary');
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Version: 1.0.0 → 2.0.0'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Bump type: major'));
            consoleSpy.mockRestore();
        });
        it('should display JSON report correctly', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            cli.showJSONReport(mockResult);
            expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(mockResult, null, 2));
            consoleSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=AdvancedReleaseCLI.test.js.map