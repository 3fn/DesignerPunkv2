"use strict";
/**
 * Release Analysis System
 *
 * Main entry point for the release analysis system providing CLI-driven
 * analysis of changes between releases with version bump recommendations.
 *
 * Includes performance optimizations for large repositories:
 * - Efficient Git history analysis with caching and batching
 * - Incremental document parsing with intelligent caching
 * - Parallel processing for multiple completion documents
 * - Comprehensive progress reporting for long-running operations
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAnalysisCli = exports.ReleaseCLI = void 0;
// CLI Interface
var ReleaseCLI_1 = require("./cli/ReleaseCLI");
Object.defineProperty(exports, "ReleaseCLI", { enumerable: true, get: function () { return ReleaseCLI_1.ReleaseCLI; } });
Object.defineProperty(exports, "runAnalysisCli", { enumerable: true, get: function () { return ReleaseCLI_1.runAnalysisCli; } });
// Core Analysis Components
__exportStar(require("./git"), exports);
__exportStar(require("./collection"), exports);
__exportStar(require("./extraction"), exports);
__exportStar(require("./versioning"), exports);
__exportStar(require("./notes"), exports);
__exportStar(require("./reporting"), exports);
__exportStar(require("./validation"), exports);
// Performance Optimizations
__exportStar(require("./performance"), exports);
// Configuration
__exportStar(require("./config"), exports);
// Error Handling
__exportStar(require("./errors"), exports);
// Types
__exportStar(require("./types/AnalysisTypes"), exports);
//# sourceMappingURL=index.js.map