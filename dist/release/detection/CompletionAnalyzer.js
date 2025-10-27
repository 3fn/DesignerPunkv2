"use strict";
/**
 * Completion Document Analyzer
 *
 * Specialized analyzer for parsing and extracting release-relevant information
 * from spec and task completion documents. Provides detailed analysis of
 * breaking changes, features, and other release indicators.
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
exports.CompletionAnalyzer = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
class CompletionAnalyzer {
    constructor(config) {
        this.config = config;
    }
    /**
     * Analyze all completion documents in a directory
     */
    async analyzeCompletionDirectory(documentsPath) {
        const context = await this.buildAnalysisContext(documentsPath);
        const documents = await this.loadCompletionDocuments(documentsPath);
        const analysis = {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [],
            improvements: [],
            suggestedVersionBump: 'patch',
            confidence: 0,
            analyzedAt: new Date()
        };
        // Analyze each document
        for (const document of documents) {
            const documentAnalysis = await this.analyzeDocument(document, context);
            analysis.breakingChanges.push(...documentAnalysis.breakingChanges);
            analysis.newFeatures.push(...documentAnalysis.newFeatures);
            analysis.bugFixes.push(...documentAnalysis.bugFixes);
            analysis.improvements.push(...documentAnalysis.improvements);
        }
        // Determine overall version bump and confidence
        analysis.suggestedVersionBump = this.determineSuggestedVersionBump(analysis);
        analysis.confidence = this.calculateOverallConfidence(analysis, documents);
        return analysis;
    }
    /**
     * Analyze a single completion document
     */
    async analyzeDocument(document, context) {
        const analysis = {
            breakingChanges: await this.extractBreakingChanges(document),
            newFeatures: await this.extractFeatures(document),
            bugFixes: await this.extractBugFixes(document),
            improvements: await this.extractImprovements(document),
            suggestedVersionBump: 'patch',
            confidence: 0,
            analyzedAt: new Date()
        };
        analysis.suggestedVersionBump = this.determineSuggestedVersionBump(analysis);
        analysis.confidence = this.calculateDocumentConfidence(document, analysis);
        return analysis;
    }
    /**
     * Parse spec completion document to extract release-relevant information
     */
    async parseSpecCompletionDocument(documentPath) {
        try {
            const content = await fs_1.promises.readFile(documentPath, 'utf-8');
            const document = {
                path: documentPath,
                content,
                metadata: this.extractDocumentMetadata(content)
            };
            const context = {
                specName: this.extractSpecNameFromPath(documentPath),
                completionType: 'spec',
                documentPaths: [documentPath]
            };
            return await this.analyzeDocument(document, context);
        }
        catch (error) {
            throw new Error(`Failed to parse spec completion document: ${error}`);
        }
    }
    /**
     * Parse task completion document to determine patch release necessity
     */
    async parseTaskCompletionDocument(documentPath) {
        try {
            const content = await fs_1.promises.readFile(documentPath, 'utf-8');
            const document = {
                path: documentPath,
                content,
                metadata: this.extractDocumentMetadata(content)
            };
            const context = {
                specName: this.extractSpecNameFromPath(documentPath),
                taskNumber: this.extractTaskNumberFromPath(documentPath),
                completionType: 'task',
                documentPaths: [documentPath]
            };
            const analysis = await this.analyzeDocument(document, context);
            // Determine if patch release is needed
            const needsPatchRelease = this.determineTaskPatchReleaseNecessity(analysis, document);
            const patchReleaseReason = this.generatePatchReleaseReason(analysis, document);
            return {
                needsPatchRelease,
                analysis,
                patchReleaseReason
            };
        }
        catch (error) {
            throw new Error(`Failed to parse task completion document: ${error}`);
        }
    }
    /**
     * Detect breaking changes using keywords and document structure analysis
     */
    async detectBreakingChangesWithStructure(document) {
        const breakingChanges = [];
        const content = document.content;
        // 1. Keyword-based detection
        const keywordBasedChanges = await this.detectBreakingChangesByKeywords(document);
        breakingChanges.push(...keywordBasedChanges);
        // 2. Structure-based detection
        const structureBasedChanges = await this.detectBreakingChangesByStructure(document);
        breakingChanges.push(...structureBasedChanges);
        // 3. API signature analysis
        const apiChanges = await this.detectAPISignatureChanges(document);
        breakingChanges.push(...apiChanges);
        // 4. Dependency changes analysis
        const dependencyChanges = await this.detectDependencyBreakingChanges(document);
        breakingChanges.push(...dependencyChanges);
        return this.deduplicateBreakingChanges(breakingChanges);
    }
    /**
     * Extract breaking changes from completion document
     */
    async extractBreakingChanges(document) {
        const breakingChanges = [];
        const content = document.content;
        // Prioritized extraction strategy: structured sections first
        const breakingChangeSections = this.findSections(content, [
            'breaking changes',
            'breaking change',
            'incompatible changes',
            'migration required',
            'api changes'
        ]);
        if (breakingChangeSections.length > 0) {
            // If structured sections exist, only extract from them
            for (const section of breakingChangeSections) {
                const changes = await this.parseBreakingChangeSection(section, document.path);
                breakingChanges.push(...changes);
            }
        }
        else {
            // Only fall back to keyword scanning if no structured sections exist
            const lines = content.split('\n');
            const processedSections = new Set();
            for (let i = 0; i < lines.length; i++) {
                if (processedSections.has(i))
                    continue;
                const line = lines[i];
                const lineContent = line.toLowerCase();
                if (this.config.breakingChangeKeywords.some(keyword => lineContent.includes(keyword.toLowerCase()))) {
                    const change = await this.createBreakingChangeFromLine(line, lines, i, document.path);
                    if (change) {
                        breakingChanges.push(change);
                        // Mark this line as processed to avoid re-extraction
                        processedSections.add(i);
                    }
                }
            }
        }
        // Apply semantic deduplication
        return this.semanticDeduplicateBreakingChanges(breakingChanges);
    }
    /**
     * Extract new features from completion document
     */
    async extractFeatures(document) {
        const features = [];
        const content = document.content;
        // Prioritized extraction strategy: structured sections first
        const featureSections = this.findSections(content, [
            'new features',
            'features implemented',
            'functionality added'
        ]);
        if (featureSections.length > 0) {
            // If structured sections exist, only extract from them
            for (const section of featureSections) {
                const sectionFeatures = await this.parseFeaturesSection(section, document.path);
                features.push(...sectionFeatures);
            }
        }
        else {
            // Only fall back to pattern matching if no structured sections exist
            // and not in a bug fix context
            const hasBugFixSection = this.findSections(content, ['bug fixes', 'fixes']).length > 0;
            if (!hasBugFixSection) {
                const implementationPatterns = [
                    /implemented?\s+new\s+([^.\n]+)/gi,
                    /created?\s+new\s+([^.\n]+)/gi,
                    /added?\s+new\s+([^.\n]+)/gi,
                    /built?\s+new\s+([^.\n]+)/gi
                ];
                for (const pattern of implementationPatterns) {
                    const matches = content.matchAll(pattern);
                    for (const match of matches) {
                        const feature = await this.createFeatureFromMatch(match, document.path);
                        if (feature) {
                            features.push(feature);
                        }
                    }
                }
            }
        }
        return this.semanticDeduplicateFeatures(features);
    }
    /**
     * Extract bug fixes from completion document
     */
    async extractBugFixes(document) {
        const bugFixes = [];
        const content = document.content;
        // Check for documentation sections to avoid extracting documentation fixes as bug fixes
        const documentationSections = this.findSections(content, [
            'documentation updates',
            'documentation changes',
            'readme updates',
            'documentation fixes'
        ]);
        // Prioritized extraction strategy: structured sections first
        const bugFixSections = this.findSections(content, [
            'bug fixes',
            'fixes',
            'issues resolved',
            'problems solved'
        ]);
        if (bugFixSections.length > 0) {
            // If structured sections exist, only extract from them
            for (const section of bugFixSections) {
                const fixes = await this.parseBugFixSection(section, document.path);
                bugFixes.push(...fixes);
            }
        }
        else {
            // Only fall back to pattern matching if no structured sections exist
            // and no documentation sections exist (to avoid false positives)
            if (documentationSections.length === 0) {
                const fixPatterns = [
                    /fixed?\s+([^.\n]+)/gi,
                    /resolved?\s+([^.\n]+)/gi,
                    /corrected?\s+([^.\n]+)/gi
                ];
                for (const pattern of fixPatterns) {
                    const matches = content.matchAll(pattern);
                    for (const match of matches) {
                        const bugFix = await this.createBugFixFromMatch(match, document.path);
                        if (bugFix) {
                            bugFixes.push(bugFix);
                        }
                    }
                }
            }
        }
        return this.semanticDeduplicateBugFixes(bugFixes);
    }
    /**
     * Extract improvements from completion document
     */
    async extractImprovements(document) {
        const improvements = [];
        const content = document.content;
        // Prioritized extraction strategy: structured sections first
        const improvementSections = this.findSections(content, [
            'improvements',
            'enhancements',
            'optimizations',
            'refactoring'
        ]);
        if (improvementSections.length > 0) {
            // If structured sections exist, only extract from them
            for (const section of improvementSections) {
                const sectionImprovements = await this.parseImprovementSection(section, document.path);
                improvements.push(...sectionImprovements);
            }
        }
        else {
            // Only fall back to pattern matching if no structured sections exist
            const improvementPatterns = [
                /improved?\s+([^.\n]+)/gi,
                /enhanced?\s+([^.\n]+)/gi,
                /optimized?\s+([^.\n]+)/gi,
                /refactored?\s+([^.\n]+)/gi
            ];
            for (const pattern of improvementPatterns) {
                const matches = content.matchAll(pattern);
                for (const match of matches) {
                    const improvement = await this.createImprovementFromMatch(match, document.path);
                    if (improvement) {
                        improvements.push(improvement);
                    }
                }
            }
        }
        return this.semanticDeduplicateImprovements(improvements);
    }
    // Private helper methods
    async buildAnalysisContext(documentsPath) {
        // Extract spec name from path
        const specMatch = documentsPath.match(/\.kiro\/specs\/([^\/]+)/);
        const specName = specMatch ? specMatch[1] : 'unknown';
        // Determine completion type
        const completionType = documentsPath.includes('task-') ? 'task' : 'spec';
        // Get all document paths
        const documentPaths = [];
        try {
            const files = await fs_1.promises.readdir(documentsPath);
            for (const file of files) {
                if (this.config.completionPatterns.some(pattern => this.matchesPattern(file, pattern))) {
                    documentPaths.push(path.join(documentsPath, file));
                }
            }
        }
        catch (error) {
            // Directory might not exist
        }
        return {
            specName,
            completionType,
            documentPaths
        };
    }
    async loadCompletionDocuments(documentsPath) {
        const documents = [];
        try {
            const files = await fs_1.promises.readdir(documentsPath);
            for (const file of files) {
                if (this.config.completionPatterns.some(pattern => this.matchesPattern(file, pattern))) {
                    const filePath = path.join(documentsPath, file);
                    const content = await fs_1.promises.readFile(filePath, 'utf-8');
                    const metadata = this.extractDocumentMetadata(content);
                    documents.push({
                        path: filePath,
                        content,
                        metadata
                    });
                }
            }
        }
        catch (error) {
            // Directory might not exist or be empty
        }
        return documents;
    }
    extractDocumentMetadata(content) {
        const lines = content.split('\n');
        const metadata = {
            title: 'Untitled'
        };
        // Extract title from first heading
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            metadata.title = titleMatch[1].trim();
        }
        // Extract metadata from document header
        for (const line of lines.slice(0, 20)) { // Check first 20 lines
            const dateMatch = line.match(/\*\*Date\*\*:\s*(.+)/);
            if (dateMatch) {
                metadata.date = dateMatch[1].trim();
            }
            const taskMatch = line.match(/\*\*Task\*\*:\s*(.+)/);
            if (taskMatch) {
                metadata.task = taskMatch[1].trim();
            }
            const specMatch = line.match(/\*\*Spec\*\*:\s*(.+)/);
            if (specMatch) {
                metadata.spec = specMatch[1].trim();
            }
            const statusMatch = line.match(/\*\*Status\*\*:\s*(.+)/);
            if (statusMatch) {
                metadata.status = statusMatch[1].trim();
            }
        }
        return metadata;
    }
    findSections(content, sectionNames) {
        const sections = [];
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase().trim();
            if (sectionNames.some(name => line.includes(`## ${name}`) ||
                line.includes(`# ${name}`) ||
                line.includes(`**${name}`))) {
                // Extract section content without the header
                let sectionContent = '';
                for (let j = i + 1; j < lines.length; j++) {
                    const nextLine = lines[j];
                    // Stop at next section header (more precise detection)
                    if (nextLine.match(/^#{1,6}\s/) ||
                        nextLine.match(/^\*\*[^*]+\*\*\s*:/) ||
                        nextLine.trim() === '') {
                        // Skip empty lines at section boundaries
                        if (nextLine.trim() !== '') {
                            break;
                        }
                    }
                    else {
                        sectionContent += nextLine + '\n';
                    }
                }
                // Only add non-empty sections
                if (sectionContent.trim()) {
                    sections.push(sectionContent.trim());
                }
            }
        }
        return sections;
    }
    async parseBreakingChangeSection(section, source) {
        const changes = [];
        const lines = section.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Only process list items or clear content lines
            if (trimmedLine &&
                !trimmedLine.match(/^#+/) &&
                !trimmedLine.match(/^\*\*/) &&
                (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•'))) {
                const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
                if (cleanLine) {
                    const change = await this.createBreakingChangeFromCleanLine(cleanLine, source);
                    if (change) {
                        changes.push(change);
                    }
                }
            }
        }
        return changes;
    }
    async createBreakingChangeFromLine(line, allLines, lineIndex, source) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('**')) {
            return null;
        }
        const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
        return this.createBreakingChangeFromCleanLine(cleanLine, source);
    }
    async createBreakingChangeFromCleanLine(cleanLine, source) {
        if (!cleanLine) {
            return null;
        }
        const id = `breaking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Use the clean line as both title and description to prevent contamination
        const title = cleanLine;
        const description = cleanLine;
        return {
            id,
            title,
            description,
            affectedAPIs: this.extractAffectedAPIs(description),
            source,
            severity: this.determineBreakingChangeSeverity(description)
        };
    }
    async parseFeaturesSection(section, source) {
        const features = [];
        const lines = section.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Only process list items or clear content lines
            if (trimmedLine &&
                !trimmedLine.match(/^#+/) &&
                !trimmedLine.match(/^\*\*/) &&
                (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•'))) {
                const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
                if (cleanLine) {
                    const feature = await this.createFeatureFromCleanLine(cleanLine, source);
                    if (feature) {
                        features.push(feature);
                    }
                }
            }
        }
        return features;
    }
    async createFeatureFromMatch(match, source) {
        if (!match[1])
            return null;
        const id = `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const title = match[1].trim();
        const description = title;
        return {
            id,
            title,
            description,
            requirements: [],
            artifacts: [],
            source,
            category: 'new-functionality'
        };
    }
    async createFeatureFromLine(line, source) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('**')) {
            return null;
        }
        const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
        return this.createFeatureFromCleanLine(cleanLine, source);
    }
    async createFeatureFromCleanLine(cleanLine, source) {
        if (!cleanLine) {
            return null;
        }
        const id = `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
            id,
            title: cleanLine,
            description: cleanLine,
            requirements: [],
            artifacts: [],
            source,
            category: 'new-functionality'
        };
    }
    async parseBugFixSection(section, source) {
        const bugFixes = [];
        const lines = section.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Only process list items
            if (trimmedLine &&
                !trimmedLine.match(/^#+/) &&
                !trimmedLine.match(/^\*\*/) &&
                (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•'))) {
                const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
                if (cleanLine) {
                    const bugFix = await this.createBugFixFromCleanLine(cleanLine, source);
                    if (bugFix) {
                        bugFixes.push(bugFix);
                    }
                }
            }
        }
        return bugFixes;
    }
    async createBugFixFromMatch(match, source) {
        if (!match[1])
            return null;
        const id = `bugfix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const title = match[1].trim();
        return {
            id,
            title,
            description: title,
            source,
            severity: 'medium'
        };
    }
    async createBugFixFromLine(line, source) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('**')) {
            return null;
        }
        const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
        return this.createBugFixFromCleanLine(cleanLine, source);
    }
    async createBugFixFromCleanLine(cleanLine, source) {
        if (!cleanLine) {
            return null;
        }
        // Filter out documentation-related fixes (be more specific to avoid false positives)
        const lowerLine = cleanLine.toLowerCase();
        const isDocumentationFix = lowerLine.includes('typos') ||
            lowerLine.includes('documentation formatting') ||
            lowerLine.includes('readme formatting') ||
            lowerLine.includes('documentation') ||
            lowerLine.includes('readme') ||
            lowerLine.includes('code examples') ||
            lowerLine.includes('screenshots') ||
            lowerLine.includes('diagrams') ||
            lowerLine.includes('api documentation') ||
            lowerLine.includes('tutorials') ||
            lowerLine.includes('getting started') ||
            lowerLine.includes('installation instructions') ||
            lowerLine.includes('documentation structure') ||
            lowerLine.includes('documentation updates');
        if (isDocumentationFix) {
            return null;
        }
        const id = `bugfix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
            id,
            title: cleanLine,
            description: cleanLine,
            source,
            severity: 'medium'
        };
    }
    async parseImprovementSection(section, source) {
        const improvements = [];
        const lines = section.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Only process list items or clear content lines
            if (trimmedLine &&
                !trimmedLine.match(/^#+/) &&
                !trimmedLine.match(/^\*\*/) &&
                (trimmedLine.startsWith('-') || trimmedLine.startsWith('*') || trimmedLine.startsWith('•'))) {
                const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
                if (cleanLine) {
                    const improvement = await this.createImprovementFromCleanLine(cleanLine, source);
                    if (improvement) {
                        improvements.push(improvement);
                    }
                }
            }
        }
        return improvements;
    }
    async createImprovementFromMatch(match, source) {
        if (!match[1])
            return null;
        const id = `improvement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const title = match[1].trim();
        return {
            id,
            title,
            description: title,
            type: 'maintainability',
            source
        };
    }
    async createImprovementFromLine(line, source) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('**')) {
            return null;
        }
        const cleanLine = trimmedLine.replace(/^[-*•]\s*/, '').trim();
        return this.createImprovementFromCleanLine(cleanLine, source);
    }
    async createImprovementFromCleanLine(cleanLine, source) {
        if (!cleanLine) {
            return null;
        }
        const id = `improvement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
            id,
            title: cleanLine,
            description: cleanLine,
            type: 'maintainability',
            source
        };
    }
    extractAffectedAPIs(content) {
        const apis = [];
        const apiPatterns = [
            // Direct API references
            /interface\s+(\w+)/gi,
            /class\s+(\w+)/gi,
            /function\s+(\w+)/gi,
            /method\s+(\w+)/gi,
            /API\s+(\w+)/gi,
            // Removal/modification patterns
            /removed?\s+interface\s+(\w+)/gi,
            /updated?\s+class\s+(\w+)/gi,
            /modified?\s+function\s+(\w+)/gi,
            /changed?\s+method\s+(\w+)/gi,
            /deleted?\s+(\w+)\s+method/gi,
            /removed?\s+(\w+)\s+function/gi,
            // Method/function call patterns
            /(\w+)\(\)/gi,
            // Interface/class usage patterns
            /(\w+Interface)/gi,
            /(\w+Engine)/gi,
            /(\w+Validator)/gi,
            /(\w+Manager)/gi,
            /(\w+Service)/gi,
            /(\w+Controller)/gi
        ];
        for (const pattern of apiPatterns) {
            const matches = content.matchAll(pattern);
            for (const match of matches) {
                if (match[1] && match[1].length > 2) {
                    // Filter out common words that aren't APIs
                    const candidate = match[1];
                    if (!this.isCommonWord(candidate)) {
                        apis.push(candidate);
                    }
                }
            }
        }
        return [...new Set(apis)];
    }
    isCommonWord(word) {
        const commonWords = [
            'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
        ];
        return commonWords.includes(word.toLowerCase()) || word.length < 3;
    }
    determineBreakingChangeSeverity(description) {
        const desc = description.toLowerCase();
        if (desc.includes('critical') || desc.includes('removes') || desc.includes('deletes')) {
            return 'critical';
        }
        if (desc.includes('incompatible') || desc.includes('breaking')) {
            return 'high';
        }
        if (desc.includes('changes') || desc.includes('modifies')) {
            return 'medium';
        }
        return 'low';
    }
    determineSuggestedVersionBump(analysis) {
        if (analysis.breakingChanges.length > 0) {
            return 'major';
        }
        if (analysis.newFeatures.length > 0) {
            return 'minor';
        }
        if (analysis.bugFixes.length > 0 || analysis.improvements.length > 0) {
            return 'patch';
        }
        return 'patch';
    }
    calculateDocumentConfidence(document, analysis) {
        let confidence = 0.5;
        // Increase confidence based on document structure
        if (document.metadata.title && document.metadata.title !== 'Untitled') {
            confidence += 0.1;
        }
        if (document.metadata.date) {
            confidence += 0.05;
        }
        if (document.metadata.task || document.metadata.spec) {
            confidence += 0.1;
        }
        // Increase confidence based on content quality
        const contentLength = document.content.length;
        if (contentLength > 500) {
            confidence += 0.1;
        }
        if (contentLength > 1000) {
            confidence += 0.1;
        }
        // Increase confidence based on structured sections
        const structuredSections = ['summary', 'implementation', 'approach', 'decisions', 'artifacts'];
        const foundSections = structuredSections.filter(section => document.content.toLowerCase().includes(`## ${section}`) ||
            document.content.toLowerCase().includes(`# ${section}`));
        confidence += foundSections.length * 0.05;
        // Increase confidence based on analysis results
        const totalChanges = analysis.breakingChanges.length +
            analysis.newFeatures.length +
            analysis.bugFixes.length +
            analysis.improvements.length;
        if (totalChanges > 0) {
            confidence += 0.2;
        }
        return Math.min(confidence, 1.0);
    }
    calculateOverallConfidence(analysis, documents) {
        if (documents.length === 0) {
            return 0;
        }
        // Calculate average document confidence
        let totalConfidence = 0;
        for (const document of documents) {
            totalConfidence += this.calculateDocumentConfidence(document, analysis);
        }
        const averageConfidence = totalConfidence / documents.length;
        // Adjust based on analysis completeness
        const totalChanges = analysis.breakingChanges.length +
            analysis.newFeatures.length +
            analysis.bugFixes.length +
            analysis.improvements.length;
        let completenessBonus = 0;
        if (totalChanges > 0) {
            completenessBonus = Math.min(totalChanges * 0.05, 0.2);
        }
        return Math.min(averageConfidence + completenessBonus, 1.0);
    }
    // Semantic deduplication methods
    semanticDeduplicateBreakingChanges(changes) {
        return this.semanticDeduplicate(changes, (change) => change.title);
    }
    semanticDeduplicateFeatures(features) {
        return this.semanticDeduplicate(features, (feature) => feature.title);
    }
    semanticDeduplicateBugFixes(bugFixes) {
        return this.semanticDeduplicate(bugFixes, (bugFix) => bugFix.title);
    }
    semanticDeduplicateImprovements(improvements) {
        return this.semanticDeduplicate(improvements, (improvement) => improvement.title);
    }
    semanticDeduplicate(items, getTitleFn) {
        const result = [];
        const normalizedTitles = new Set();
        for (const item of items) {
            const title = getTitleFn(item);
            const normalizedTitle = this.normalizeTitle(title);
            // Check for semantic similarity with existing items
            let isDuplicate = false;
            for (const existingTitle of normalizedTitles) {
                if (this.areSemanticallyEquivalent(normalizedTitle, existingTitle)) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                result.push(item);
                normalizedTitles.add(normalizedTitle);
            }
        }
        return result;
    }
    normalizeTitle(title) {
        return title
            .toLowerCase()
            .trim()
            // Remove common prefixes
            .replace(/^(fixed?|resolved?|corrected?|implemented?|created?|added?|built?|improved?|enhanced?|optimized?|refactored?)\s+/i, '')
            // Remove articles and common words
            .replace(/\b(the|a|an|in|on|at|to|for|of|with|by)\b/g, '')
            // Remove extra whitespace
            .replace(/\s+/g, ' ')
            .trim();
    }
    areSemanticallyEquivalent(title1, title2) {
        // Exact match after normalization
        if (title1 === title2) {
            return true;
        }
        // Check if one title is contained within another (with word boundaries)
        const words1 = title1.split(/\s+/).filter(w => w.length > 2);
        const words2 = title2.split(/\s+/).filter(w => w.length > 2);
        // If 80% or more of the significant words overlap, consider them equivalent
        const commonWords = words1.filter(word => words2.includes(word));
        const minWords = Math.min(words1.length, words2.length);
        if (minWords > 0 && commonWords.length / minWords >= 0.8) {
            return true;
        }
        // Check for substring containment (for cases like "memory leak" vs "memory leak in token parser")
        if (title1.length > 10 && title2.length > 10) {
            const shorter = title1.length < title2.length ? title1 : title2;
            const longer = title1.length < title2.length ? title2 : title1;
            if (longer.includes(shorter)) {
                return true;
            }
        }
        return false;
    }
    // Legacy deduplication methods (kept for backward compatibility)
    deduplicateBreakingChanges(changes) {
        return this.semanticDeduplicateBreakingChanges(changes);
    }
    deduplicateFeatures(features) {
        return this.semanticDeduplicateFeatures(features);
    }
    deduplicateBugFixes(bugFixes) {
        return this.semanticDeduplicateBugFixes(bugFixes);
    }
    deduplicateImprovements(improvements) {
        return this.semanticDeduplicateImprovements(improvements);
    }
    matchesPattern(filename, pattern) {
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        return new RegExp(`^${regexPattern}$`).test(filename);
    }
    // Additional parsing helper methods
    extractSpecNameFromPath(documentPath) {
        const specMatch = documentPath.match(/\.kiro\/specs\/([^\/]+)/);
        return specMatch ? specMatch[1] : 'unknown';
    }
    extractTaskNumberFromPath(documentPath) {
        const taskMatch = documentPath.match(/task-([^-]+)-completion\.md/);
        return taskMatch ? taskMatch[1] : undefined;
    }
    determineTaskPatchReleaseNecessity(analysis, document) {
        // Task completion warrants patch release if:
        // 1. Bug fixes are present
        // 2. Improvements that affect functionality
        // 3. Implementation changes that could affect behavior
        // 4. Configuration or validation changes
        // Filter out documentation-related bug fixes
        const functionalBugFixes = analysis.bugFixes.filter(bugFix => {
            const description = bugFix.description.toLowerCase();
            const isDocumentationFix = description.includes('typos') ||
                description.includes('formatting') ||
                description.includes('documentation') ||
                description.includes('readme') ||
                description.includes('examples') ||
                description.includes('screenshots') ||
                description.includes('diagrams');
            return !isDocumentationFix;
        });
        if (functionalBugFixes.length > 0) {
            return true;
        }
        // Check if improvements suggest functional changes (not documentation improvements)
        const functionalImprovements = analysis.improvements.filter(imp => imp.type === 'performance' ||
            imp.type === 'usability' ||
            imp.description.toLowerCase().includes('behavior') ||
            (imp.description.toLowerCase().includes('optimization') &&
                !imp.description.toLowerCase().includes('documentation')));
        if (functionalImprovements.length > 0) {
            return true;
        }
        // Check for implementation artifacts that suggest functional changes
        const content = document.content.toLowerCase();
        // Check if this is primarily documentation work
        const documentationSections = this.findSections(document.content, [
            'documentation updates',
            'documentation changes',
            'readme updates'
        ]);
        // Documentation-only patterns (more comprehensive)
        const documentationPatterns = [
            /updated?\s+readme/i,
            /added?\s+.*\s+documentation/i,
            /fixed?\s+typos/i,
            /updated?\s+screenshots/i,
            /created?\s+.*\s+tutorials/i,
            /reorganized?\s+documentation/i,
            /added?\s+.*\s+examples/i,
            /updated?\s+.*\s+documentation/i,
            /documentation\s+structure/i,
            /code\s+examples/i,
            /comprehensive\s+api\s+documentation/i,
            /usage\s+examples/i,
            /installation\s+instructions/i,
            /formatting\s+issues/i
        ];
        // Implementation patterns that suggest functional changes
        const implementationPatterns = [
            /implementation\s+approach/i,
            /created?\s+.*\.ts/i,
            /implemented?\s+.*\s+(system|engine|interface|class)/i,
            /added?\s+.*\s+(functionality|behavior|algorithm)/i,
            /built?\s+.*\s+(system|engine|component)/i,
            /performance\s+optimization/i,
            /validation\s+(system|engine|rules)/i,
            /artifacts\s+created/i,
            /key\s+decisions/i
        ];
        const hasDocumentationPatterns = documentationPatterns.some(pattern => pattern.test(document.content)) || documentationSections.length > 0;
        const hasImplementationPatterns = implementationPatterns.some(pattern => pattern.test(document.content));
        // Check task title for documentation indicators
        const taskTitle = document.metadata.task?.toLowerCase() || '';
        const isDocumentationTask = taskTitle.includes('documentation') ||
            taskTitle.includes('readme') ||
            taskTitle.includes('update documentation') ||
            taskTitle.includes('doc ');
        // Check summary for documentation indicators
        const summaryMatch = document.content.match(/## Summary\s*\n([^#]*)/i);
        const summary = summaryMatch ? summaryMatch[1].toLowerCase() : '';
        const summaryIsDocumentation = summary.includes('documentation') ||
            summary.includes('examples') ||
            summary.includes('readme');
        // If documentation patterns/sections/task/summary and no implementation patterns, it's documentation-only
        if ((hasDocumentationPatterns || isDocumentationTask || summaryIsDocumentation) && !hasImplementationPatterns) {
            return false;
        }
        // Functional change indicators (more specific)
        const functionalChangeIndicators = [
            'implementation approach',
            'functionality',
            'algorithm',
            'logic',
            'validation system',
            'configuration',
            'error handling',
            'performance optimization'
        ];
        const hasFunctionalChanges = functionalChangeIndicators.some(indicator => content.includes(indicator));
        return hasFunctionalChanges;
    }
    generatePatchReleaseReason(analysis, document) {
        const reasons = [];
        if (analysis.bugFixes.length > 0) {
            reasons.push(`${analysis.bugFixes.length} bug fix(es)`);
        }
        if (analysis.improvements.length > 0) {
            const functionalImprovements = analysis.improvements.filter(imp => imp.type === 'performance' || imp.type === 'usability');
            if (functionalImprovements.length > 0) {
                reasons.push(`${functionalImprovements.length} functional improvement(s)`);
            }
        }
        // Check for specific improvement types in the content
        const content = document.content.toLowerCase();
        if (content.includes('performance') && content.includes('optimization')) {
            reasons.push('performance optimization');
        }
        if (reasons.length === 0) {
            reasons.push('Task completion with implementation changes');
        }
        return `Task completion: ${reasons.join(', ')}`;
    }
    async detectBreakingChangesByKeywords(document) {
        const breakingChanges = [];
        const content = document.content;
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineContent = line.toLowerCase();
            for (const keyword of this.config.breakingChangeKeywords) {
                if (lineContent.includes(keyword.toLowerCase())) {
                    const change = await this.createBreakingChangeFromLine(line, lines, i, document.path);
                    if (change) {
                        change.severity = this.determineBreakingChangeSeverityFromKeyword(keyword);
                        breakingChanges.push(change);
                    }
                }
            }
        }
        return breakingChanges;
    }
    async detectBreakingChangesByStructure(document) {
        const breakingChanges = [];
        const content = document.content;
        // Look for structured breaking change sections
        const breakingChangeSections = this.findSections(content, [
            'breaking changes',
            'incompatible changes',
            'migration required',
            'api changes'
        ]);
        for (const section of breakingChangeSections) {
            const sectionChanges = await this.parseBreakingChangeSection(section, document.path);
            breakingChanges.push(...sectionChanges);
        }
        // Look for removal patterns in implementation sections
        const implementationSections = this.findSections(content, [
            'implementation approach',
            'key decisions',
            'artifacts created'
        ]);
        for (const section of implementationSections) {
            const removalChanges = await this.detectRemovalPatterns(section, document.path);
            breakingChanges.push(...removalChanges);
        }
        return breakingChanges;
    }
    async detectAPISignatureChanges(document) {
        const breakingChanges = [];
        const content = document.content;
        // Patterns that indicate API signature changes
        const signatureChangePatterns = [
            /changed?\s+signature\s+of\s+([^.]+)/gi,
            /modified?\s+interface\s+([^.]+)/gi,
            /updated?\s+method\s+([^.]+)/gi,
            /removed?\s+parameter\s+from\s+([^.]+)/gi,
            /added?\s+required\s+parameter\s+to\s+([^.]+)/gi
        ];
        for (const pattern of signatureChangePatterns) {
            const matches = content.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) {
                    const id = `api-change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    const title = `API signature change: ${match[1].trim()}`;
                    const description = match[0];
                    breakingChanges.push({
                        id,
                        title,
                        description,
                        affectedAPIs: [match[1].trim()],
                        source: document.path,
                        severity: 'high'
                    });
                }
            }
        }
        return breakingChanges;
    }
    async detectDependencyBreakingChanges(document) {
        const breakingChanges = [];
        const content = document.content;
        // Patterns that indicate dependency breaking changes
        const dependencyChangePatterns = [
            /removed?\s+dependency\s+([^.]+)/gi,
            /updated?\s+major\s+version\s+of\s+([^.]+)/gi,
            /changed?\s+peer\s+dependency\s+([^.]+)/gi,
            /incompatible\s+with\s+([^.]+)/gi
        ];
        for (const pattern of dependencyChangePatterns) {
            const matches = content.matchAll(pattern);
            for (const match of matches) {
                if (match[1]) {
                    const id = `dependency-change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    const title = `Dependency breaking change: ${match[1].trim()}`;
                    const description = match[0];
                    breakingChanges.push({
                        id,
                        title,
                        description,
                        affectedAPIs: [],
                        source: document.path,
                        severity: 'medium'
                    });
                }
            }
        }
        return breakingChanges;
    }
    async detectRemovalPatterns(section, source) {
        const breakingChanges = [];
        const lines = section.split('\n');
        const removalPatterns = [
            /removed?\s+([^.]+)/gi,
            /deleted?\s+([^.]+)/gi,
            /dropped?\s+([^.]+)/gi,
            /eliminated?\s+([^.]+)/gi
        ];
        for (const line of lines) {
            for (const pattern of removalPatterns) {
                const matches = line.matchAll(pattern);
                for (const match of matches) {
                    if (match[1]) {
                        const id = `removal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        const title = `Removed: ${match[1].trim()}`;
                        const description = line.trim();
                        breakingChanges.push({
                            id,
                            title,
                            description,
                            affectedAPIs: this.extractAffectedAPIs(match[1]),
                            source,
                            severity: 'high'
                        });
                    }
                }
            }
        }
        return breakingChanges;
    }
    determineBreakingChangeSeverityFromKeyword(keyword) {
        const keywordLower = keyword.toLowerCase();
        if (keywordLower.includes('removes') || keywordLower.includes('deleted')) {
            return 'critical';
        }
        if (keywordLower.includes('breaking') || keywordLower.includes('incompatible')) {
            return 'high';
        }
        if (keywordLower.includes('deprecated') || keywordLower.includes('migration')) {
            return 'medium';
        }
        return 'low';
    }
}
exports.CompletionAnalyzer = CompletionAnalyzer;
//# sourceMappingURL=CompletionAnalyzer.js.map