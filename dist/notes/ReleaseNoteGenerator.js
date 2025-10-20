"use strict";
/**
 * Release Note Generator
 *
 * Formats extracted changes into comprehensive, readable release notes
 * following markdown standards with structured sections for different change types.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseNoteGenerator = void 0;
var ReleaseNoteGenerator = /** @class */ (function () {
    function ReleaseNoteGenerator() {
        this.defaultTemplate = {
            format: 'markdown',
            sections: [
                { type: 'breaking', title: '🚨 Breaking Changes', enabled: true, priority: 1, includeSource: true },
                { type: 'features', title: '✨ New Features', enabled: true, priority: 2, includeSource: false },
                { type: 'fixes', title: '🐛 Bug Fixes', enabled: true, priority: 3, includeSource: false },
                { type: 'improvements', title: '⚡ Improvements', enabled: true, priority: 4, includeSource: false },
                { type: 'documentation', title: '📚 Documentation', enabled: false, priority: 5, includeSource: false }
            ],
            styling: {
                headerLevel: 2,
                bulletStyle: '-',
                includeMetadata: false,
                includeSummary: true
            }
        };
    }
    /**
     * Generate complete release notes from extracted changes
     */
    ReleaseNoteGenerator.prototype.generateReleaseNotes = function (changes, version, template) {
        return __awaiter(this, void 0, void 0, function () {
            var releaseTemplate, releaseContent;
            return __generator(this, function (_a) {
                releaseTemplate = template || this.defaultTemplate;
                releaseContent = this.buildReleaseContent(changes, version);
                return [2 /*return*/, this.applyTemplate(releaseContent, releaseTemplate)];
            });
        });
    };
    /**
     * Format breaking changes with prominent highlighting and migration guidance
     */
    ReleaseNoteGenerator.prototype.formatBreakingChanges = function (changes) {
        if (changes.length === 0) {
            return '';
        }
        var sections = [];
        changes.forEach(function (change) {
            var section = "- **".concat(change.title, "**");
            if (change.description) {
                section += "\n  ".concat(change.description);
            }
            if (change.affectedAPIs.length > 0) {
                section += "\n  - **Affected APIs:** ".concat(change.affectedAPIs.join(', '));
            }
            if (change.migrationGuidance) {
                section += "\n  - **Migration:** ".concat(change.migrationGuidance);
            }
            if (change.severity && change.severity !== 'low') {
                section += "\n  - **Severity:** ".concat(change.severity.toUpperCase());
            }
            sections.push(section);
        });
        return sections.join('\n\n');
    };
    /**
     * Format new features with descriptions and benefits
     */
    ReleaseNoteGenerator.prototype.formatNewFeatures = function (features) {
        if (features.length === 0) {
            return '';
        }
        var sections = [];
        features.forEach(function (feature) {
            var section = "- **".concat(feature.title, "**");
            if (feature.description) {
                section += "\n  ".concat(feature.description);
            }
            if (feature.benefits.length > 0) {
                section += "\n  - **Benefits:** ".concat(feature.benefits.join(', '));
            }
            if (feature.category) {
                section += "\n  - **Category:** ".concat(feature.category);
            }
            sections.push(section);
        });
        return sections.join('\n\n');
    };
    /**
     * Format bug fixes with clear descriptions
     */
    ReleaseNoteGenerator.prototype.formatBugFixes = function (fixes) {
        if (fixes.length === 0) {
            return '';
        }
        var sections = [];
        fixes.forEach(function (fix) {
            var section = "- **".concat(fix.title, "**");
            if (fix.description) {
                section += "\n  ".concat(fix.description);
            }
            if (fix.issueNumber) {
                section += "\n  - **Issue:** #".concat(fix.issueNumber);
            }
            if (fix.affectedComponents.length > 0) {
                section += "\n  - **Components:** ".concat(fix.affectedComponents.join(', '));
            }
            sections.push(section);
        });
        return sections.join('\n\n');
    };
    /**
     * Format improvements with type and impact information
     */
    ReleaseNoteGenerator.prototype.formatImprovements = function (improvements) {
        if (improvements.length === 0) {
            return '';
        }
        var sections = [];
        improvements.forEach(function (improvement) {
            var section = "- **".concat(improvement.title, "**");
            if (improvement.description) {
                section += "\n  ".concat(improvement.description);
            }
            if (improvement.type) {
                section += "\n  - **Type:** ".concat(improvement.type);
            }
            if (improvement.impact && improvement.impact !== 'low') {
                section += "\n  - **Impact:** ".concat(improvement.impact);
            }
            sections.push(section);
        });
        return sections.join('\n\n');
    };
    /**
     * Format documentation changes
     */
    ReleaseNoteGenerator.prototype.formatDocumentationChanges = function (docs) {
        if (docs.length === 0) {
            return '';
        }
        var sections = [];
        docs.forEach(function (doc) {
            var section = "- **".concat(doc.title, "**");
            if (doc.description) {
                section += "\n  ".concat(doc.description);
            }
            if (doc.type) {
                section += "\n  - **Type:** ".concat(doc.type);
            }
            sections.push(section);
        });
        return sections.join('\n\n');
    };
    /**
     * Apply template formatting to release content
     */
    ReleaseNoteGenerator.prototype.applyTemplate = function (content, template) {
        var sections = [];
        // Add version header
        var headerPrefix = '#'.repeat(template.styling.headerLevel - 1);
        sections.push("".concat(headerPrefix, "# ").concat(content.version));
        // Add date
        sections.push("*Released: ".concat(content.date, "*"));
        // Add summary if enabled
        if (template.styling.includeSummary && content.summary) {
            sections.push('');
            sections.push(content.summary);
        }
        // Add sections in priority order
        var enabledSections = template.sections
            .filter(function (section) { return section.enabled; })
            .sort(function (a, b) { return a.priority - b.priority; });
        enabledSections.forEach(function (sectionConfig) {
            var releaseSection = content.sections.find(function (s) {
                return s.title.toLowerCase().includes(sectionConfig.type);
            });
            if (releaseSection && releaseSection.items.length > 0) {
                sections.push('');
                sections.push("".concat(headerPrefix, "## ").concat(sectionConfig.title));
                sections.push('');
                releaseSection.items.forEach(function (item) {
                    var itemText = "".concat(template.styling.bulletStyle, " **").concat(item.title, "**");
                    if (item.description) {
                        itemText += "\n  ".concat(item.description);
                    }
                    if (sectionConfig.includeSource && item.source) {
                        itemText += "\n  - **Source:** ".concat(item.source);
                    }
                    sections.push(itemText);
                });
            }
        });
        // Add metadata if enabled
        if (template.styling.includeMetadata) {
            sections.push('');
            sections.push("".concat(headerPrefix, "## Metadata"));
            sections.push('');
            sections.push("".concat(template.styling.bulletStyle, " **Generated:** ").concat(new Date().toISOString()));
            sections.push("".concat(template.styling.bulletStyle, " **Total Changes:** ").concat(content.sections.reduce(function (sum, s) { return sum + s.items.length; }, 0)));
        }
        return sections.join('\n');
    };
    /**
     * Build release content structure from extracted changes
     */
    ReleaseNoteGenerator.prototype.buildReleaseContent = function (changes, version) {
        var _this = this;
        var sections = [];
        // Breaking changes section
        if (changes.breakingChanges.length > 0) {
            sections.push({
                title: 'Breaking Changes',
                priority: 1,
                items: changes.breakingChanges.map(function (change) { return ({
                    title: change.title,
                    description: _this.buildBreakingChangeDescription(change),
                    source: change.source,
                    metadata: { severity: change.severity, affectedAPIs: change.affectedAPIs }
                }); })
            });
        }
        // New features section
        if (changes.newFeatures.length > 0) {
            sections.push({
                title: 'New Features',
                priority: 2,
                items: changes.newFeatures.map(function (feature) { return ({
                    title: feature.title,
                    description: _this.buildFeatureDescription(feature),
                    source: feature.source,
                    metadata: { category: feature.category, benefits: feature.benefits }
                }); })
            });
        }
        // Bug fixes section
        if (changes.bugFixes.length > 0) {
            sections.push({
                title: 'Bug Fixes',
                priority: 3,
                items: changes.bugFixes.map(function (fix) { return ({
                    title: fix.title,
                    description: _this.buildBugFixDescription(fix),
                    source: fix.source,
                    metadata: { severity: fix.severity, components: fix.affectedComponents }
                }); })
            });
        }
        // Improvements section
        if (changes.improvements.length > 0) {
            sections.push({
                title: 'Improvements',
                priority: 4,
                items: changes.improvements.map(function (improvement) { return ({
                    title: improvement.title,
                    description: improvement.description,
                    source: improvement.source,
                    metadata: { type: improvement.type, impact: improvement.impact }
                }); })
            });
        }
        // Documentation section
        if (changes.documentation.length > 0) {
            sections.push({
                title: 'Documentation',
                priority: 5,
                items: changes.documentation.map(function (doc) { return ({
                    title: doc.title,
                    description: doc.description,
                    source: doc.source,
                    metadata: { type: doc.type }
                }); })
            });
        }
        return {
            version: version,
            date: new Date().toISOString().split('T')[0],
            summary: this.generateSummary(changes),
            sections: sections
        };
    };
    /**
     * Build detailed description for breaking changes
     */
    ReleaseNoteGenerator.prototype.buildBreakingChangeDescription = function (change) {
        var parts = [];
        if (change.description) {
            parts.push(change.description);
        }
        if (change.affectedAPIs.length > 0) {
            parts.push("Affected APIs: ".concat(change.affectedAPIs.join(', ')));
        }
        if (change.migrationGuidance) {
            parts.push("Migration: ".concat(change.migrationGuidance));
        }
        return parts.join('\n  ');
    };
    /**
     * Build detailed description for features
     */
    ReleaseNoteGenerator.prototype.buildFeatureDescription = function (feature) {
        var parts = [];
        if (feature.description) {
            parts.push(feature.description);
        }
        if (feature.benefits.length > 0) {
            parts.push("Benefits: ".concat(feature.benefits.join(', ')));
        }
        return parts.join('\n  ');
    };
    /**
     * Build detailed description for bug fixes
     */
    ReleaseNoteGenerator.prototype.buildBugFixDescription = function (fix) {
        var parts = [];
        if (fix.description) {
            parts.push(fix.description);
        }
        if (fix.issueNumber) {
            parts.push("Issue: #".concat(fix.issueNumber));
        }
        if (fix.affectedComponents.length > 0) {
            parts.push("Components: ".concat(fix.affectedComponents.join(', ')));
        }
        return parts.join('\n  ');
    };
    /**
     * Generate summary of all changes
     */
    ReleaseNoteGenerator.prototype.generateSummary = function (changes) {
        var parts = [];
        var totalChanges = changes.breakingChanges.length +
            changes.newFeatures.length +
            changes.bugFixes.length +
            changes.improvements.length;
        if (totalChanges === 0) {
            return 'No significant changes in this release.';
        }
        if (changes.breakingChanges.length > 0) {
            parts.push("".concat(changes.breakingChanges.length, " breaking change").concat(changes.breakingChanges.length > 1 ? 's' : ''));
        }
        if (changes.newFeatures.length > 0) {
            parts.push("".concat(changes.newFeatures.length, " new feature").concat(changes.newFeatures.length > 1 ? 's' : ''));
        }
        if (changes.bugFixes.length > 0) {
            parts.push("".concat(changes.bugFixes.length, " bug fix").concat(changes.bugFixes.length > 1 ? 'es' : ''));
        }
        if (changes.improvements.length > 0) {
            parts.push("".concat(changes.improvements.length, " improvement").concat(changes.improvements.length > 1 ? 's' : ''));
        }
        return "This release includes ".concat(parts.join(', '), ".");
    };
    return ReleaseNoteGenerator;
}());
exports.ReleaseNoteGenerator = ReleaseNoteGenerator;
