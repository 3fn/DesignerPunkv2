"use strict";
/**
 * Release Signal Detection Engine
 *
 * Monitors workflow events and analyzes completion documentation to detect
 * when releases should occur. Implements intelligent confidence scoring
 * and evidence collection for release decisions.
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
exports.ReleaseDetector = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
class ReleaseDetector {
    constructor(config) {
        this.config = config;
    }
    /**
     * Detect release signal from task completion
     * Analyzes task completion to determine if a patch release is warranted
     */
    async detectReleaseFromTaskCompletion(taskPath, taskName) {
        if (!this.config.taskCompletionTrigger) {
            return null;
        }
        try {
            // Read the tasks.md file to understand task context
            const tasksContent = await fs_1.promises.readFile(taskPath, 'utf-8');
            // Look for completion documentation
            const completionDocPath = this.findCompletionDocumentPath(taskPath, taskName);
            let completionContent = '';
            if (completionDocPath) {
                try {
                    completionContent = await fs_1.promises.readFile(completionDocPath, 'utf-8');
                }
                catch (error) {
                    // Completion document might not exist yet
                }
            }
            // Analyze task significance
            const analysis = await this.analyzeTaskSignificance(taskName, tasksContent, completionContent);
            if (analysis.confidence < this.config.confidenceThreshold) {
                return null;
            }
            return {
                type: analysis.suggestedBump,
                trigger: 'task-completion',
                confidence: analysis.confidence,
                evidence: analysis.evidence,
                affectedPackages: this.determineAffectedPackages(taskPath),
                timestamp: new Date(),
                source: taskPath
            };
        }
        catch (error) {
            console.error('Error detecting release from task completion:', error);
            return null;
        }
    }
    /**
     * Detect release signal from spec completion
     * Spec completion typically triggers a minor version bump
     */
    async detectReleaseFromSpecCompletion(specPath) {
        if (!this.config.specCompletionTrigger) {
            return null;
        }
        try {
            // Look for spec completion documentation
            const completionDir = path.join(specPath, 'completion');
            const completionSummaryPath = path.join(completionDir, 'spec-completion-summary.md');
            let completionContent = '';
            try {
                completionContent = await fs_1.promises.readFile(completionSummaryPath, 'utf-8');
            }
            catch (error) {
                // Check for other completion documents
                try {
                    const completionFiles = await fs_1.promises.readdir(completionDir);
                    const completionFile = completionFiles.find(file => this.config.completionPatterns.some(pattern => this.matchesPattern(file, pattern)));
                    if (completionFile) {
                        completionContent = await fs_1.promises.readFile(path.join(completionDir, completionFile), 'utf-8');
                    }
                }
                catch (dirError) {
                    // No completion directory or files
                    return null;
                }
            }
            if (!completionContent) {
                return null;
            }
            // First check the completion content directly for breaking changes
            const hasBreakingChanges = this.config.breakingChangeKeywords.some(keyword => completionContent.toLowerCase().includes(keyword.toLowerCase()));
            // Analyze spec completion for breaking changes and features
            const analysis = await this.analyzeCompletionDocuments(completionDir);
            // Determine version bump type based on analysis
            let bumpType = 'minor'; // Default for spec completion
            let confidence = 0.9; // High confidence for spec completion
            if (hasBreakingChanges || analysis.breakingChanges.length > 0) {
                bumpType = 'major';
                confidence = 0.95;
            }
            const evidence = [
                'Spec completion detected',
                `Found ${analysis.newFeatures.length} new features`,
                `Found ${analysis.breakingChanges.length} breaking changes`,
                `Found ${analysis.improvements.length} improvements`
            ];
            return {
                type: bumpType,
                trigger: 'spec-completion',
                confidence,
                evidence,
                affectedPackages: this.determineAffectedPackages(specPath),
                timestamp: new Date(),
                source: specPath
            };
        }
        catch (error) {
            console.error('Error detecting release from spec completion:', error);
            return null;
        }
    }
    /**
     * Analyze completion documents for release-relevant information
     */
    async analyzeCompletionDocuments(documentsPath) {
        const analysis = {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [],
            improvements: [],
            suggestedVersionBump: 'patch',
            confidence: 0,
            analyzedAt: new Date()
        };
        try {
            const files = await fs_1.promises.readdir(documentsPath);
            const completionFiles = (files || []).filter(file => this.config.completionPatterns.some(pattern => this.matchesPattern(file, pattern)));
            for (const file of completionFiles) {
                const filePath = path.join(documentsPath, file);
                const content = await fs_1.promises.readFile(filePath, 'utf-8');
                // Extract different types of changes
                analysis.breakingChanges.push(...await this.extractBreakingChanges(content, filePath));
                analysis.newFeatures.push(...await this.extractFeatures(content, filePath));
                analysis.bugFixes.push(...await this.extractBugFixes(content, filePath));
                analysis.improvements.push(...await this.extractImprovements(content, filePath));
            }
            // Determine suggested version bump
            if (analysis.breakingChanges.length > 0) {
                analysis.suggestedVersionBump = 'major';
            }
            else if (analysis.newFeatures.length > 0) {
                analysis.suggestedVersionBump = 'minor';
            }
            else {
                analysis.suggestedVersionBump = 'patch';
            }
            // Calculate confidence based on analysis quality
            analysis.confidence = this.calculateAnalysisConfidence(analysis);
        }
        catch (error) {
            console.error('Error analyzing completion documents:', error);
        }
        return analysis;
    }
    /**
     * Validate that a release signal is ready for processing
     */
    async validateReleaseReadiness(signal) {
        const errors = [];
        const warnings = [];
        // Validate confidence threshold
        if (signal.confidence < this.config.confidenceThreshold) {
            errors.push({
                code: 'LOW_CONFIDENCE',
                message: `Release confidence ${signal.confidence} is below threshold ${this.config.confidenceThreshold}`,
                severity: 'error',
                source: signal.source
            });
        }
        // Validate evidence exists
        if (signal.evidence.length === 0) {
            warnings.push({
                code: 'NO_EVIDENCE',
                message: 'No evidence provided for release decision',
                source: signal.source
            });
        }
        // Validate affected packages
        if (signal.affectedPackages.length === 0) {
            warnings.push({
                code: 'NO_AFFECTED_PACKAGES',
                message: 'No affected packages identified',
                source: signal.source
            });
        }
        // Validate source exists
        try {
            await fs_1.promises.access(signal.source);
        }
        catch (error) {
            errors.push({
                code: 'INVALID_SOURCE',
                message: `Source file does not exist: ${signal.source}`,
                severity: 'error',
                source: signal.source
            });
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            validatedAt: new Date(),
            context: 'release-readiness'
        };
    }
    /**
     * Calculate confidence score for release analysis
     */
    calculateConfidence(analysis) {
        return this.calculateAnalysisConfidence(analysis);
    }
    // Private helper methods
    async analyzeTaskSignificance(taskName, tasksContent, completionContent) {
        const evidence = [];
        let confidence = 0.5; // Base confidence for task completion
        let suggestedBump = 'patch';
        // Analyze task name for significance indicators
        const taskNameLower = taskName.toLowerCase();
        // Check for breaking change indicators
        if (this.config.breakingChangeKeywords.some(keyword => taskNameLower.includes(keyword.toLowerCase()))) {
            suggestedBump = 'major';
            confidence = 0.9;
            evidence.push('Breaking change keywords detected in task name');
        }
        // Check for feature indicators - but be more specific about what constitutes a minor release
        const minorFeatureKeywords = ['create new', 'add new', 'new feature', 'implement new'];
        const basicImplementationKeywords = ['implement', 'create', 'add', 'build'];
        if (minorFeatureKeywords.some(keyword => taskNameLower.includes(keyword))) {
            if (suggestedBump === 'patch') {
                suggestedBump = 'minor';
            }
            confidence = Math.max(confidence, 0.7);
            evidence.push('New feature implementation keywords detected');
        }
        else if (basicImplementationKeywords.some(keyword => taskNameLower.includes(keyword))) {
            // Basic implementation might be patch-level unless it's clearly a new feature
            confidence = Math.max(confidence, 0.6);
            evidence.push('Implementation keywords detected');
        }
        // Analyze completion content if available
        if (completionContent) {
            const completionAnalysis = await this.analyzeCompletionContent(completionContent);
            if (completionAnalysis.hasBreakingChanges) {
                suggestedBump = 'major';
                confidence = 0.95;
                evidence.push('Breaking changes detected in completion documentation');
            }
            else if (completionAnalysis.hasNewFeatures) {
                if (suggestedBump === 'patch') {
                    suggestedBump = 'minor';
                }
                confidence = Math.max(confidence, 0.8);
                evidence.push('New features detected in completion documentation');
            }
            confidence = Math.max(confidence, completionAnalysis.confidence);
            evidence.push(...completionAnalysis.evidence);
        }
        // Analyze task context in tasks.md
        const taskContext = this.extractTaskContext(taskName, tasksContent);
        if (taskContext.isMainTask) {
            confidence += 0.2;
            evidence.push('Main task completion detected');
        }
        if (taskContext.hasSuccessCriteria) {
            confidence += 0.1;
            evidence.push('Task has defined success criteria');
        }
        return {
            confidence: Math.min(confidence, 1.0),
            suggestedBump,
            evidence
        };
    }
    async analyzeCompletionContent(content) {
        const evidence = [];
        let confidence = 0.6;
        // Check for breaking changes
        const hasBreakingChanges = this.config.breakingChangeKeywords.some(keyword => content.toLowerCase().includes(keyword.toLowerCase()));
        // Check for new features
        const featureIndicators = ['new feature', 'implements', 'adds functionality', 'introduces'];
        const hasNewFeatures = featureIndicators.some(indicator => content.toLowerCase().includes(indicator.toLowerCase()));
        // Check for structured completion documentation
        const hasStructuredSections = [
            'summary',
            'implementation',
            'approach',
            'decisions',
            'artifacts'
        ].some(section => content.toLowerCase().includes(`## ${section}`) ||
            content.toLowerCase().includes(`# ${section}`));
        if (hasStructuredSections) {
            confidence += 0.2;
            evidence.push('Structured completion documentation found');
        }
        if (hasBreakingChanges) {
            evidence.push('Breaking change indicators found in completion content');
        }
        if (hasNewFeatures) {
            evidence.push('New feature indicators found in completion content');
        }
        return {
            hasBreakingChanges,
            hasNewFeatures,
            confidence,
            evidence
        };
    }
    extractTaskContext(taskName, tasksContent) {
        const lines = tasksContent.split('\n');
        let isMainTask = false;
        let hasSuccessCriteria = false;
        // Find the task in the content
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes(taskName)) {
                // Check if it's a main task (not a sub-task)
                isMainTask = /^- \[ \] \d+\./.test(line.trim());
                // Look for success criteria in following lines
                for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
                    if (lines[j].includes('Success Criteria:') || lines[j].includes('**Success Criteria**')) {
                        hasSuccessCriteria = true;
                        break;
                    }
                    // Stop if we hit another task
                    if (lines[j].trim().startsWith('- [ ]')) {
                        break;
                    }
                }
                break;
            }
        }
        return { isMainTask, hasSuccessCriteria };
    }
    findCompletionDocumentPath(taskPath, taskName) {
        // Extract spec name from task path
        const specMatch = taskPath.match(/\.kiro\/specs\/([^\/]+)\/tasks\.md$/);
        if (!specMatch) {
            return null;
        }
        const specName = specMatch[1];
        // Extract task number from task name
        const taskNumberMatch = taskName.match(/^(\d+(?:\.\d+)?)/);
        if (!taskNumberMatch) {
            return null;
        }
        const taskNumber = taskNumberMatch[1];
        // Construct completion document path
        return path.join(path.dirname(taskPath), 'completion', `task-${taskNumber}-completion.md`);
    }
    determineAffectedPackages(sourcePath) {
        // Default packages that are typically affected
        const defaultPackages = ['@designerpunk/tokens', '@designerpunk/build-system'];
        // Analyze source path to determine specific packages
        if (sourcePath.includes('components')) {
            return [...defaultPackages, '@designerpunk/components'];
        }
        if (sourcePath.includes('tokens')) {
            return ['@designerpunk/tokens'];
        }
        if (sourcePath.includes('build')) {
            return ['@designerpunk/build-system'];
        }
        return defaultPackages;
    }
    async extractBreakingChanges(content, source) {
        const breakingChanges = [];
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            // Check if line contains breaking change indicators
            if (this.config.breakingChangeKeywords.some(keyword => line.includes(keyword.toLowerCase()))) {
                const id = `breaking-${Date.now()}-${i}`;
                const title = lines[i].trim();
                // Try to extract description from following lines
                let description = title;
                for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                    if (lines[j].trim() && !lines[j].startsWith('#')) {
                        description += ' ' + lines[j].trim();
                    }
                    else {
                        break;
                    }
                }
                breakingChanges.push({
                    id,
                    title,
                    description,
                    affectedAPIs: this.extractAffectedAPIs(content),
                    source,
                    severity: 'medium'
                });
            }
        }
        return breakingChanges;
    }
    async extractFeatures(content, source) {
        const features = [];
        const lines = content.split('\n');
        const featureKeywords = ['implement', 'create', 'add', 'build', 'new feature', 'introduces'];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            if (featureKeywords.some(keyword => line.includes(keyword))) {
                const id = `feature-${Date.now()}-${i}`;
                const title = lines[i].trim();
                // Extract description
                let description = title;
                for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
                    if (lines[j].trim() && !lines[j].startsWith('#')) {
                        description += ' ' + lines[j].trim();
                    }
                    else {
                        break;
                    }
                }
                features.push({
                    id,
                    title,
                    description,
                    requirements: this.extractRequirements(content),
                    artifacts: this.extractArtifacts(content),
                    source,
                    category: 'new-functionality'
                });
            }
        }
        return features;
    }
    async extractBugFixes(content, source) {
        const bugFixes = [];
        const lines = content.split('\n');
        const bugFixKeywords = ['fix', 'bug', 'issue', 'problem', 'error', 'resolve'];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            if (bugFixKeywords.some(keyword => line.includes(keyword))) {
                const id = `bugfix-${Date.now()}-${i}`;
                const title = lines[i].trim();
                let description = title;
                for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
                    if (lines[j].trim() && !lines[j].startsWith('#')) {
                        description += ' ' + lines[j].trim();
                    }
                    else {
                        break;
                    }
                }
                bugFixes.push({
                    id,
                    title,
                    description,
                    source,
                    severity: 'medium'
                });
            }
        }
        return bugFixes;
    }
    async extractImprovements(content, source) {
        const improvements = [];
        const lines = content.split('\n');
        const improvementKeywords = ['improve', 'enhance', 'optimize', 'refactor', 'update'];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            if (improvementKeywords.some(keyword => line.includes(keyword))) {
                const id = `improvement-${Date.now()}-${i}`;
                const title = lines[i].trim();
                let description = title;
                for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
                    if (lines[j].trim() && !lines[j].startsWith('#')) {
                        description += ' ' + lines[j].trim();
                    }
                    else {
                        break;
                    }
                }
                improvements.push({
                    id,
                    title,
                    description,
                    type: 'maintainability',
                    source
                });
            }
        }
        return improvements;
    }
    extractAffectedAPIs(content) {
        const apis = [];
        const apiPatterns = [
            /interface\s+(\w+)/gi,
            /class\s+(\w+)/gi,
            /function\s+(\w+)/gi,
            /export\s+\{([^}]+)\}/gi
        ];
        for (const pattern of apiPatterns) {
            const matches = content.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) {
                    apis.push(match[1].trim());
                }
            }
        }
        return [...new Set(apis)];
    }
    extractRequirements(content) {
        const requirements = [];
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.includes('_Requirements:') || line.includes('Requirements:')) {
                const reqMatch = line.match(/Requirements?:\s*([^_]+)/);
                if (reqMatch) {
                    const reqs = reqMatch[1].split(',').map(r => r.trim());
                    requirements.push(...reqs);
                }
            }
        }
        return requirements;
    }
    extractArtifacts(content) {
        const artifacts = [];
        const lines = content.split('\n');
        for (const line of lines) {
            // Look for file paths or artifact mentions
            const fileMatches = line.match(/`([^`]+\.(ts|js|md|json))`/g);
            if (fileMatches) {
                artifacts.push(...fileMatches.map(match => match.replace(/`/g, '')));
            }
        }
        return [...new Set(artifacts)];
    }
    calculateAnalysisConfidence(analysis) {
        let confidence = 0.5; // Base confidence
        // Increase confidence based on content found
        if (analysis.breakingChanges.length > 0) {
            confidence += 0.3;
        }
        if (analysis.newFeatures.length > 0) {
            confidence += 0.2;
        }
        if (analysis.bugFixes.length > 0) {
            confidence += 0.1;
        }
        if (analysis.improvements.length > 0) {
            confidence += 0.1;
        }
        // Bonus for having multiple types of changes
        const changeTypes = [
            analysis.breakingChanges.length > 0,
            analysis.newFeatures.length > 0,
            analysis.bugFixes.length > 0,
            analysis.improvements.length > 0
        ].filter(Boolean).length;
        if (changeTypes > 1) {
            confidence += 0.1;
        }
        return Math.min(confidence, 1.0);
    }
    matchesPattern(filename, pattern) {
        // Simple glob pattern matching
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        return new RegExp(`^${regexPattern}$`).test(filename);
    }
}
exports.ReleaseDetector = ReleaseDetector;
//# sourceMappingURL=ReleaseDetector.js.map