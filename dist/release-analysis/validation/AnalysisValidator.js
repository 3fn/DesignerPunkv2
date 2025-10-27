"use strict";
/**
 * Analysis Validator
 *
 * Comprehensive validation system for release analysis results,
 * including version bump validation, release note quality checks,
 * and confidence threshold enforcement.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisValidator = void 0;
class AnalysisValidator {
    constructor(config) {
        const defaultConfig = {
            confidenceThresholds: {
                minimum: 0.6,
                warning: 0.7,
                good: 0.8,
                extraction: 0.65,
                version: 0.7
            },
            qualityGates: [
                { name: 'extraction_confidence', threshold: 0.65, critical: true, enabled: true },
                { name: 'version_confidence', threshold: 0.7, critical: true, enabled: true },
                { name: 'release_note_completeness', threshold: 0.8, critical: false, enabled: true },
                { name: 'overall_quality', threshold: 0.75, critical: false, enabled: true }
            ],
            releaseNoteRequirements: {
                minimumSections: 1,
                requireBreakingChangeDetails: true,
                requireMigrationGuidance: true,
                minimumDescriptionLength: 10,
                requireSummary: true
            },
            versionValidationRules: {
                enforceSemanticVersioning: true,
                allowPreReleaseVersions: true,
                requireEvidenceForBumps: true,
                minimumConfidenceForMajor: 0.8
            }
        };
        this.config = {
            confidenceThresholds: {
                ...defaultConfig.confidenceThresholds,
                ...config?.confidenceThresholds
            },
            qualityGates: config?.qualityGates || defaultConfig.qualityGates,
            releaseNoteRequirements: {
                ...defaultConfig.releaseNoteRequirements,
                ...config?.releaseNoteRequirements
            },
            versionValidationRules: {
                ...defaultConfig.versionValidationRules,
                ...config?.versionValidationRules
            }
        };
    }
    /**
     * Validate complete analysis results
     */
    validateAnalysis(changes, versionRecommendation, releaseNotes) {
        const versionValidation = this.validateVersionRecommendation(versionRecommendation, changes);
        const releaseNoteValidation = this.validateReleaseNotes(releaseNotes, changes);
        const confidenceValidation = this.validateConfidence(changes, versionRecommendation);
        const qualityGates = this.evaluateQualityGates(versionValidation, releaseNoteValidation, confidenceValidation);
        const overallScore = this.calculateOverallScore(versionValidation, releaseNoteValidation, confidenceValidation, qualityGates);
        const status = this.determineOverallStatus(qualityGates, overallScore);
        const allErrors = [
            ...versionValidation.errors,
            ...releaseNoteValidation.errors,
            ...confidenceValidation.errors
        ];
        const allWarnings = [
            ...versionValidation.warnings,
            ...releaseNoteValidation.warnings,
            ...confidenceValidation.warnings
        ];
        return {
            valid: status !== 'fail',
            score: overallScore,
            status,
            errors: allErrors,
            warnings: allWarnings,
            details: {
                versionValidation,
                releaseNoteValidation,
                confidenceValidation,
                qualityGates
            }
        };
    }
    /**
     * Validate version recommendation against semantic versioning rules
     */
    validateVersionRecommendation(recommendation, changes) {
        const errors = [];
        const warnings = [];
        let semanticCompliance = true;
        let progressionValid = true;
        let bumpTypeCorrect = true;
        // Validate semantic version format
        if (this.config.versionValidationRules.enforceSemanticVersioning) {
            if (!this.isValidSemanticVersion(recommendation.currentVersion)) {
                errors.push(`Current version "${recommendation.currentVersion}" is not a valid semantic version`);
                semanticCompliance = false;
            }
            if (!this.isValidSemanticVersion(recommendation.recommendedVersion)) {
                errors.push(`Recommended version "${recommendation.recommendedVersion}" is not a valid semantic version`);
                semanticCompliance = false;
            }
        }
        // Validate version progression
        if (semanticCompliance) {
            const currentParsed = this.parseVersion(recommendation.currentVersion);
            const recommendedParsed = this.parseVersion(recommendation.recommendedVersion);
            if (!this.isValidVersionProgression(currentParsed, recommendedParsed, recommendation.bumpType)) {
                errors.push(`Version progression from ${recommendation.currentVersion} to ${recommendation.recommendedVersion} is invalid for ${recommendation.bumpType} bump`);
                progressionValid = false;
            }
        }
        // Validate bump type matches evidence
        const expectedBumpType = this.determineExpectedBumpType(changes);
        if (recommendation.bumpType !== expectedBumpType) {
            if (recommendation.bumpType === 'none' && expectedBumpType !== 'none') {
                errors.push(`No version bump recommended but changes suggest ${expectedBumpType} bump`);
                bumpTypeCorrect = false;
            }
            else if (expectedBumpType !== 'none' && this.getBumpTypePriority(recommendation.bumpType) < this.getBumpTypePriority(expectedBumpType)) {
                errors.push(`Recommended ${recommendation.bumpType} bump is insufficient for detected changes (expected ${expectedBumpType})`);
                bumpTypeCorrect = false;
            }
            else if (expectedBumpType !== 'none' && this.getBumpTypePriority(recommendation.bumpType) > this.getBumpTypePriority(expectedBumpType)) {
                warnings.push(`Recommended ${recommendation.bumpType} bump may be higher than necessary (detected changes suggest ${expectedBumpType})`);
            }
        }
        // Validate confidence for major version bumps
        if (recommendation.bumpType === 'major' &&
            recommendation.confidence < this.config.versionValidationRules.minimumConfidenceForMajor) {
            warnings.push(`Low confidence (${recommendation.confidence.toFixed(2)}) for major version bump - manual review recommended`);
        }
        // Validate evidence exists for version bumps
        if (this.config.versionValidationRules.requireEvidenceForBumps &&
            recommendation.bumpType !== 'none' &&
            recommendation.evidence.length === 0) {
            errors.push(`No evidence provided for ${recommendation.bumpType} version bump`);
        }
        const score = this.calculateVersionValidationScore(semanticCompliance, progressionValid, bumpTypeCorrect, errors.length, warnings.length);
        return {
            valid: errors.length === 0,
            semanticCompliance,
            progressionValid,
            bumpTypeCorrect,
            errors,
            warnings,
            score
        };
    }
    /**
     * Validate release notes quality and completeness
     */
    validateReleaseNotes(releaseNotes, changes) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
        // Check basic formatting
        const formatting = this.validateReleaseNoteFormatting(releaseNotes);
        if (formatting.errors.length > 0) {
            errors.push(...formatting.errors);
            // If release notes are empty, return early with zero scores
            if (formatting.errors.some(error => error === 'Release notes are empty')) {
                return {
                    valid: false,
                    completeness: 0,
                    formatting: 0,
                    clarity: 0,
                    errors,
                    warnings,
                    suggestions,
                    score: 0
                };
            }
        }
        if (formatting.warnings.length > 0) {
            warnings.push(...formatting.warnings);
        }
        // Check completeness
        const completeness = this.validateReleaseNoteCompleteness(releaseNotes, changes);
        if (completeness.errors.length > 0) {
            errors.push(...completeness.errors);
        }
        if (completeness.warnings.length > 0) {
            warnings.push(...completeness.warnings);
        }
        if (completeness.suggestions.length > 0) {
            suggestions.push(...completeness.suggestions);
        }
        // Check clarity and quality
        const clarity = this.validateReleaseNoteClarity(releaseNotes);
        if (clarity.warnings.length > 0) {
            warnings.push(...clarity.warnings);
        }
        if (clarity.suggestions.length > 0) {
            suggestions.push(...clarity.suggestions);
        }
        const score = this.calculateReleaseNoteScore(formatting.score, completeness.score, clarity.score, errors.length, warnings.length);
        return {
            valid: errors.length === 0,
            completeness: completeness.score,
            formatting: formatting.score,
            clarity: clarity.score,
            errors,
            warnings,
            suggestions,
            score
        };
    }
    /**
     * Validate confidence levels and thresholds
     */
    validateConfidence(changes, versionRecommendation) {
        const errors = [];
        const warnings = [];
        const extractionConfidence = changes.metadata.extractionConfidence;
        const versionConfidence = versionRecommendation.confidence;
        const overallConfidence = (extractionConfidence + versionConfidence) / 2;
        // Check minimum thresholds
        if (overallConfidence < this.config.confidenceThresholds.minimum) {
            errors.push(`Overall confidence (${overallConfidence.toFixed(2)}) below minimum threshold (${this.config.confidenceThresholds.minimum})`);
        }
        if (extractionConfidence < this.config.confidenceThresholds.extraction) {
            errors.push(`Extraction confidence (${extractionConfidence.toFixed(2)}) below threshold (${this.config.confidenceThresholds.extraction})`);
        }
        if (versionConfidence < this.config.confidenceThresholds.version) {
            errors.push(`Version confidence (${versionConfidence.toFixed(2)}) below threshold (${this.config.confidenceThresholds.version})`);
        }
        // Check warning thresholds
        if (overallConfidence < this.config.confidenceThresholds.warning) {
            warnings.push(`Overall confidence (${overallConfidence.toFixed(2)}) below warning threshold - manual review recommended`);
        }
        // Check for ambiguous items
        if (changes.metadata.ambiguousItems.length > 0) {
            warnings.push(`${changes.metadata.ambiguousItems.length} ambiguous items detected - may affect confidence`);
        }
        const thresholdsMet = errors.length === 0;
        const score = this.calculateConfidenceScore(overallConfidence, extractionConfidence, versionConfidence);
        return {
            valid: thresholdsMet,
            overallConfidence,
            extractionConfidence,
            versionConfidence,
            thresholdsMet,
            errors,
            warnings,
            score
        };
    }
    /**
     * Evaluate quality gates
     */
    evaluateQualityGates(versionValidation, releaseNoteValidation, confidenceValidation) {
        const results = [];
        this.config.qualityGates.forEach(gate => {
            if (!gate.enabled)
                return;
            let score = 0;
            let message = '';
            switch (gate.name) {
                case 'extraction_confidence':
                    score = confidenceValidation.extractionConfidence;
                    message = `Extraction confidence: ${score.toFixed(2)}`;
                    break;
                case 'version_confidence':
                    score = confidenceValidation.versionConfidence;
                    message = `Version confidence: ${score.toFixed(2)}`;
                    break;
                case 'release_note_completeness':
                    score = releaseNoteValidation.completeness;
                    message = `Release note completeness: ${score.toFixed(2)}`;
                    break;
                case 'overall_quality':
                    score = (versionValidation.score + releaseNoteValidation.score + confidenceValidation.score) / 3;
                    message = `Overall quality score: ${score.toFixed(2)}`;
                    break;
                default:
                    score = 0;
                    message = `Unknown quality gate: ${gate.name}`;
            }
            results.push({
                name: gate.name,
                passed: score >= gate.threshold,
                score,
                threshold: gate.threshold,
                message,
                critical: gate.critical
            });
        });
        return results;
    }
    /**
     * Calculate overall validation score
     */
    calculateOverallScore(versionValidation, releaseNoteValidation, confidenceValidation, qualityGates) {
        const weights = {
            version: 0.3,
            releaseNote: 0.25,
            confidence: 0.3,
            qualityGates: 0.15
        };
        const qualityGateScore = qualityGates.length > 0
            ? qualityGates.reduce((sum, gate) => sum + (gate.passed ? 1 : 0), 0) / qualityGates.length
            : 1;
        return (versionValidation.score * weights.version +
            releaseNoteValidation.score * weights.releaseNote +
            confidenceValidation.score * weights.confidence +
            qualityGateScore * weights.qualityGates);
    }
    /**
     * Determine overall validation status
     */
    determineOverallStatus(qualityGates, overallScore) {
        // Check for critical quality gate failures
        const criticalFailures = qualityGates.filter(gate => gate.critical && !gate.passed);
        if (criticalFailures.length > 0) {
            return 'fail';
        }
        // Check overall score thresholds
        if (overallScore < this.config.confidenceThresholds.minimum) {
            return 'fail';
        }
        if (overallScore < this.config.confidenceThresholds.warning) {
            return 'warning';
        }
        return 'pass';
    }
    // Helper methods for validation logic
    isValidSemanticVersion(version) {
        const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
        return semverRegex.test(version);
    }
    parseVersion(version) {
        const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
        const match = version.match(semverRegex);
        if (!match) {
            throw new Error(`Invalid semantic version: ${version}`);
        }
        return {
            major: parseInt(match[1]),
            minor: parseInt(match[2]),
            patch: parseInt(match[3]),
            preRelease: match[4] || null,
            build: match[5] || null
        };
    }
    isValidVersionProgression(current, recommended, bumpType) {
        switch (bumpType) {
            case 'major':
                return recommended.major === current.major + 1 &&
                    recommended.minor === 0 &&
                    recommended.patch === 0;
            case 'minor':
                return recommended.major === current.major &&
                    recommended.minor === current.minor + 1 &&
                    recommended.patch === 0;
            case 'patch':
                return recommended.major === current.major &&
                    recommended.minor === current.minor &&
                    recommended.patch === current.patch + 1;
            case 'none':
                return recommended.major === current.major &&
                    recommended.minor === current.minor &&
                    recommended.patch === current.patch;
            default:
                return false;
        }
    }
    determineExpectedBumpType(changes) {
        if (changes.breakingChanges.length > 0)
            return 'major';
        if (changes.newFeatures.length > 0)
            return 'minor';
        if (changes.bugFixes.length > 0 || changes.improvements.length > 0)
            return 'patch';
        return 'none';
    }
    getBumpTypePriority(bumpType) {
        switch (bumpType) {
            case 'major': return 3;
            case 'minor': return 2;
            case 'patch': return 1;
            case 'none': return 0;
            default: return 0;
        }
    }
    calculateVersionValidationScore(semanticCompliance, progressionValid, bumpTypeCorrect, errorCount, warningCount) {
        let score = 1.0;
        if (!semanticCompliance)
            score -= 0.3;
        if (!progressionValid)
            score -= 0.3;
        if (!bumpTypeCorrect)
            score -= 0.2;
        score -= errorCount * 0.1;
        score -= warningCount * 0.05;
        return Math.max(0, Math.min(1, score));
    }
    validateReleaseNoteFormatting(releaseNotes) {
        const errors = [];
        const warnings = [];
        let score = 1.0;
        if (!releaseNotes || releaseNotes.trim().length === 0) {
            errors.push('Release notes are empty');
            return { errors, warnings, score: 0 };
        }
        // Check for basic markdown structure
        if (!releaseNotes.includes('#')) {
            warnings.push('Release notes should include markdown headers');
            score -= 0.1;
        }
        // Check for version header
        if (!releaseNotes.match(/^#+ \d+\.\d+\.\d+/m)) {
            warnings.push('Release notes should start with a version header');
            score -= 0.1;
        }
        // Check for proper list formatting
        if (releaseNotes.includes('- ') || releaseNotes.includes('* ')) {
            // Good - has bullet points
        }
        else {
            warnings.push('Release notes should use bullet points for change lists');
            score -= 0.1;
        }
        return { errors, warnings, score: Math.max(0, score) };
    }
    validateReleaseNoteCompleteness(releaseNotes, changes) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
        let score = 1.0;
        // Check for breaking changes documentation
        if (changes.breakingChanges.length > 0) {
            if (!releaseNotes.toLowerCase().includes('breaking')) {
                errors.push('Breaking changes detected but not documented in release notes');
                score -= 0.3;
            }
            if (this.config.releaseNoteRequirements.requireMigrationGuidance) {
                const hasMigrationInfo = releaseNotes.toLowerCase().includes('migration') ||
                    releaseNotes.toLowerCase().includes('upgrade');
                if (!hasMigrationInfo) {
                    warnings.push('Breaking changes should include migration guidance');
                    score -= 0.1;
                }
            }
        }
        // Check for feature documentation
        if (changes.newFeatures.length > 0) {
            if (!releaseNotes.toLowerCase().includes('feature')) {
                warnings.push('New features detected but not clearly documented');
                score -= 0.1;
            }
        }
        // Check minimum description lengths
        const lines = releaseNotes.split('\n').filter(line => line.trim().length > 0);
        const shortLines = lines.filter(line => line.includes('- ') &&
            line.length < this.config.releaseNoteRequirements.minimumDescriptionLength);
        if (shortLines.length > 0) {
            suggestions.push(`${shortLines.length} change descriptions are very short - consider adding more detail`);
            score -= shortLines.length * 0.02;
        }
        // Check for summary
        if (this.config.releaseNoteRequirements.requireSummary) {
            const hasIntro = releaseNotes.split('\n').slice(0, 5).some(line => line.length > 50 && !line.startsWith('#') && !line.startsWith('-'));
            if (!hasIntro) {
                suggestions.push('Consider adding a summary paragraph describing the overall changes');
                score -= 0.05;
            }
        }
        return { errors, warnings, suggestions, score: Math.max(0, score) };
    }
    validateReleaseNoteClarity(releaseNotes) {
        const warnings = [];
        const suggestions = [];
        let score = 1.0;
        // Check for vague language
        const vagueTerms = ['various', 'some', 'multiple', 'several', 'misc', 'other'];
        const hasVagueTerms = vagueTerms.some(term => releaseNotes.toLowerCase().includes(term));
        if (hasVagueTerms) {
            suggestions.push('Consider replacing vague terms with specific descriptions');
            score -= 0.05;
        }
        // Check for technical jargon without explanation
        const technicalTerms = ['API', 'SDK', 'CLI', 'JSON', 'HTTP'];
        const hasTechnicalTerms = technicalTerms.some(term => releaseNotes.includes(term));
        if (hasTechnicalTerms) {
            suggestions.push('Consider explaining technical terms for broader audience');
            score -= 0.02;
        }
        return { warnings, suggestions, score: Math.max(0, score) };
    }
    calculateReleaseNoteScore(formatting, completeness, clarity, errorCount, warningCount) {
        const baseScore = (formatting + completeness + clarity) / 3;
        let finalScore = baseScore;
        finalScore -= errorCount * 0.15;
        finalScore -= warningCount * 0.05;
        return Math.max(0, Math.min(1, finalScore));
    }
    calculateConfidenceScore(overall, extraction, version) {
        // Weighted average with emphasis on overall confidence
        return (overall * 0.5 + extraction * 0.25 + version * 0.25);
    }
}
exports.AnalysisValidator = AnalysisValidator;
//# sourceMappingURL=AnalysisValidator.js.map