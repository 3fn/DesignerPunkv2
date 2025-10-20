"use strict";
/**
 * Version Calculator for Release Analysis System
 *
 * Implements semantic version calculation based on extracted changes,
 * providing version bump recommendations with rationale and evidence.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionCalculator = void 0;
var VersionCalculator = /** @class */ (function () {
    function VersionCalculator() {
    }
    /**
     * Calculate semantic version bump based on extracted changes
     */
    VersionCalculator.prototype.calculateVersionBump = function (changes, currentVersion) {
        var parsedVersion = this.parseVersion(currentVersion);
        var evidence = this.generateEvidence(changes);
        var bumpType = this.determineBumpType(changes);
        var recommendedVersion = this.calculateNewVersion(parsedVersion, bumpType);
        var rationale = this.generateVersionRationale(changes);
        var confidence = this.calculateConfidence(changes, bumpType);
        return {
            currentVersion: currentVersion,
            recommendedVersion: recommendedVersion,
            bumpType: bumpType,
            rationale: rationale,
            confidence: confidence,
            evidence: evidence,
            preReleaseInfo: this.analyzePreReleaseInfo(parsedVersion, bumpType)
        };
    };
    /**
     * Validate semantic versioning compliance
     */
    VersionCalculator.prototype.validateSemanticVersioning = function (recommendation) {
        var errors = [];
        var warnings = [];
        // Validate version format
        if (!this.isValidSemanticVersion(recommendation.currentVersion)) {
            errors.push("Current version \"".concat(recommendation.currentVersion, "\" is not a valid semantic version"));
        }
        if (!this.isValidSemanticVersion(recommendation.recommendedVersion)) {
            errors.push("Recommended version \"".concat(recommendation.recommendedVersion, "\" is not a valid semantic version"));
        }
        // Only proceed with parsing if versions are valid
        if (errors.length > 0) {
            return { valid: false, errors: errors, warnings: warnings };
        }
        // Validate version progression
        var currentParsed = this.parseVersion(recommendation.currentVersion);
        var recommendedParsed = this.parseVersion(recommendation.recommendedVersion);
        if (!this.isValidVersionProgression(currentParsed, recommendedParsed, recommendation.bumpType)) {
            errors.push("Version progression from ".concat(recommendation.currentVersion, " to ").concat(recommendation.recommendedVersion, " is invalid for ").concat(recommendation.bumpType, " bump"));
        }
        // Validate bump type matches evidence
        var hasBreaking = recommendation.evidence.some(function (e) { return e.type === 'breaking'; });
        var hasFeatures = recommendation.evidence.some(function (e) { return e.type === 'feature'; });
        var hasFixes = recommendation.evidence.some(function (e) { return e.type === 'fix' || e.type === 'improvement'; });
        var expectedBumpType = 'none';
        if (hasBreaking) {
            expectedBumpType = 'major';
        }
        else if (hasFeatures) {
            expectedBumpType = 'minor';
        }
        else if (hasFixes) {
            expectedBumpType = 'patch';
        }
        if (recommendation.bumpType !== expectedBumpType && expectedBumpType !== 'none') {
            warnings.push("Recommended bump type \"".concat(recommendation.bumpType, "\" may not match evidence (expected \"").concat(expectedBumpType, "\")"));
        }
        // Validate confidence thresholds
        if (recommendation.confidence < 0.7) {
            warnings.push("Low confidence score (".concat(recommendation.confidence.toFixed(2), ") - manual review recommended"));
        }
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    };
    /**
     * Generate detailed rationale for version recommendation
     */
    VersionCalculator.prototype.generateVersionRationale = function (changes) {
        var rationale = [];
        if (changes.breakingChanges.length > 0) {
            rationale.push("Major version bump required due to ".concat(changes.breakingChanges.length, " breaking change(s):"));
            changes.breakingChanges.slice(0, 3).forEach(function (change) {
                rationale.push("  \u2022 ".concat(change.title, " (").concat(change.severity, " severity)"));
            });
            if (changes.breakingChanges.length > 3) {
                rationale.push("  \u2022 ... and ".concat(changes.breakingChanges.length - 3, " more breaking changes"));
            }
        }
        else if (changes.newFeatures.length > 0) {
            rationale.push("Minor version bump recommended due to ".concat(changes.newFeatures.length, " new feature(s):"));
            changes.newFeatures.slice(0, 3).forEach(function (feature) {
                rationale.push("  \u2022 ".concat(feature.title));
            });
            if (changes.newFeatures.length > 3) {
                rationale.push("  \u2022 ... and ".concat(changes.newFeatures.length - 3, " more features"));
            }
        }
        else if (changes.bugFixes.length > 0 || changes.improvements.length > 0) {
            var totalFixes = changes.bugFixes.length + changes.improvements.length;
            rationale.push("Patch version bump recommended due to ".concat(totalFixes, " fix(es) and improvement(s):"));
            changes.bugFixes.slice(0, 2).forEach(function (fix) {
                rationale.push("  \u2022 ".concat(fix.title, " (bug fix)"));
            });
            changes.improvements.slice(0, 2).forEach(function (improvement) {
                rationale.push("  \u2022 ".concat(improvement.title, " (").concat(improvement.type, ")"));
            });
            if (totalFixes > 4) {
                rationale.push("  \u2022 ... and ".concat(totalFixes - 4, " more fixes/improvements"));
            }
        }
        else {
            rationale.push('No version bump required - only documentation or non-functional changes detected');
        }
        return rationale.join('\n');
    };
    /**
     * Handle pre-release version progression
     */
    VersionCalculator.prototype.handlePreReleaseVersions = function (currentVersion, bumpType) {
        var parsed = this.parseVersion(currentVersion);
        if (parsed.preRelease) {
            // If current is pre-release, increment pre-release number
            var preReleaseMatch = parsed.preRelease.match(/^(alpha|beta|rc)\.?(\d+)?$/);
            if (preReleaseMatch) {
                var type = preReleaseMatch[1], num = preReleaseMatch[2];
                var nextNum = num ? parseInt(num) + 1 : 1;
                return "".concat(parsed.major, ".").concat(parsed.minor, ".").concat(parsed.patch, "-").concat(type, ".").concat(nextNum);
            }
        }
        // For normal version bumps, calculate new version
        return this.calculateNewVersion(parsed, bumpType);
    };
    /**
     * Parse semantic version string into components
     */
    VersionCalculator.prototype.parseVersion = function (version) {
        var semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
        var match = version.match(semverRegex);
        if (!match) {
            throw new Error("Invalid semantic version: ".concat(version));
        }
        return {
            major: parseInt(match[1]),
            minor: parseInt(match[2]),
            patch: parseInt(match[3]),
            preRelease: match[4] || null,
            build: match[5] || null,
            raw: version
        };
    };
    /**
     * Determine appropriate bump type based on changes
     */
    VersionCalculator.prototype.determineBumpType = function (changes) {
        if (changes.breakingChanges.length > 0) {
            return 'major';
        }
        if (changes.newFeatures.length > 0) {
            return 'minor';
        }
        if (changes.bugFixes.length > 0 || changes.improvements.length > 0) {
            return 'patch';
        }
        return 'none';
    };
    /**
     * Calculate new version based on bump type
     */
    VersionCalculator.prototype.calculateNewVersion = function (parsed, bumpType) {
        switch (bumpType) {
            case 'major':
                return "".concat(parsed.major + 1, ".0.0");
            case 'minor':
                return "".concat(parsed.major, ".").concat(parsed.minor + 1, ".0");
            case 'patch':
                return "".concat(parsed.major, ".").concat(parsed.minor, ".").concat(parsed.patch + 1);
            case 'none':
                return parsed.raw;
            default:
                throw new Error("Invalid bump type: ".concat(bumpType));
        }
    };
    /**
     * Generate evidence array from extracted changes
     */
    VersionCalculator.prototype.generateEvidence = function (changes) {
        var evidence = [];
        if (changes.breakingChanges.length > 0) {
            evidence.push({
                type: 'breaking',
                description: "".concat(changes.breakingChanges.length, " breaking change(s) detected"),
                source: 'completion documents',
                impact: this.determineBreakingChangeImpact(changes.breakingChanges),
                count: changes.breakingChanges.length
            });
        }
        if (changes.newFeatures.length > 0) {
            evidence.push({
                type: 'feature',
                description: "".concat(changes.newFeatures.length, " new feature(s) added"),
                source: 'completion documents',
                impact: this.determineFeatureImpact(changes.newFeatures),
                count: changes.newFeatures.length
            });
        }
        if (changes.bugFixes.length > 0) {
            evidence.push({
                type: 'fix',
                description: "".concat(changes.bugFixes.length, " bug fix(es) implemented"),
                source: 'completion documents',
                impact: this.determineBugFixImpact(changes.bugFixes),
                count: changes.bugFixes.length
            });
        }
        if (changes.improvements.length > 0) {
            evidence.push({
                type: 'improvement',
                description: "".concat(changes.improvements.length, " improvement(s) made"),
                source: 'completion documents',
                impact: this.determineImprovementImpact(changes.improvements),
                count: changes.improvements.length
            });
        }
        return evidence;
    };
    /**
     * Calculate confidence score for version recommendation
     */
    VersionCalculator.prototype.calculateConfidence = function (changes, bumpType) {
        var confidence = changes.metadata.extractionConfidence;
        // Reduce confidence for ambiguous items
        if (changes.metadata.ambiguousItems.length > 0) {
            var ambiguityPenalty = Math.min(0.2, changes.metadata.ambiguousItems.length * 0.05);
            confidence -= ambiguityPenalty;
        }
        // Increase confidence for clear change patterns
        if (bumpType === 'major' && changes.breakingChanges.length > 0) {
            confidence += 0.1;
        }
        else if (bumpType === 'minor' && changes.newFeatures.length > 0 && changes.breakingChanges.length === 0) {
            confidence += 0.1;
        }
        else if (bumpType === 'patch' && (changes.bugFixes.length > 0 || changes.improvements.length > 0) &&
            changes.breakingChanges.length === 0 && changes.newFeatures.length === 0) {
            confidence += 0.1;
        }
        return Math.max(0, Math.min(1, confidence));
    };
    /**
     * Analyze pre-release information
     */
    VersionCalculator.prototype.analyzePreReleaseInfo = function (parsed, bumpType) {
        if (!parsed.preRelease) {
            return undefined;
        }
        var preReleaseMatch = parsed.preRelease.match(/^(alpha|beta|rc)\.?(\d+)?$/);
        if (!preReleaseMatch) {
            return {
                isPreRelease: true,
                canPromote: false
            };
        }
        var type = preReleaseMatch[1], num = preReleaseMatch[2];
        var preReleaseNumber = num ? parseInt(num) : 0;
        return {
            isPreRelease: true,
            preReleaseType: type,
            preReleaseNumber: preReleaseNumber,
            canPromote: type === 'rc' && bumpType !== 'none',
            nextPreRelease: "".concat(type, ".").concat(preReleaseNumber + 1)
        };
    };
    /**
     * Validate semantic version format
     */
    VersionCalculator.prototype.isValidSemanticVersion = function (version) {
        var semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
        return semverRegex.test(version);
    };
    /**
     * Validate version progression logic
     */
    VersionCalculator.prototype.isValidVersionProgression = function (current, recommended, bumpType) {
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
    };
    /**
     * Determine impact level for breaking changes
     */
    VersionCalculator.prototype.determineBreakingChangeImpact = function (breakingChanges) {
        var criticalCount = breakingChanges.filter(function (c) { return c.severity === 'critical'; }).length;
        var highCount = breakingChanges.filter(function (c) { return c.severity === 'high'; }).length;
        if (criticalCount > 0)
            return 'high';
        if (highCount > 0 || breakingChanges.length > 3)
            return 'high';
        if (breakingChanges.length > 1)
            return 'medium';
        return 'low';
    };
    /**
     * Determine impact level for features
     */
    VersionCalculator.prototype.determineFeatureImpact = function (features) {
        if (features.length > 5)
            return 'high';
        if (features.length > 2)
            return 'medium';
        return 'low';
    };
    /**
     * Determine impact level for bug fixes
     */
    VersionCalculator.prototype.determineBugFixImpact = function (bugFixes) {
        var criticalCount = bugFixes.filter(function (f) { return f.severity === 'critical'; }).length;
        var highCount = bugFixes.filter(function (f) { return f.severity === 'high'; }).length;
        if (criticalCount > 0)
            return 'high';
        if (highCount > 0 || bugFixes.length > 5)
            return 'medium';
        return 'low';
    };
    /**
     * Determine impact level for improvements
     */
    VersionCalculator.prototype.determineImprovementImpact = function (improvements) {
        var highImpactCount = improvements.filter(function (i) { return i.impact === 'high'; }).length;
        if (highImpactCount > 0)
            return 'high';
        if (improvements.length > 3)
            return 'medium';
        return 'low';
    };
    return VersionCalculator;
}());
exports.VersionCalculator = VersionCalculator;
