"use strict";
/**
 * Release Analysis Performance Optimization Components
 *
 * This module provides performance optimization components for large repository analysis:
 * - GitPerformanceOptimizer: Efficient Git history analysis with caching and batching
 * - DocumentParsingCache: Incremental document parsing with intelligent caching
 * - ParallelProcessor: Parallel processing with progress reporting and error recovery
 * - ProgressReporter: Comprehensive progress reporting for long-running operations
 *
 * Requirements addressed:
 * - 5.1: Efficient Git history analysis for large repos
 * - 5.2: Create incremental document parsing and caching
 * - 5.3: Build parallel processing for multiple completion documents
 * - 5.4: Add progress reporting for long-running analysis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressReporter = exports.ParallelProcessor = exports.DocumentParsingCache = exports.GitPerformanceOptimizer = void 0;
// Git Performance Optimization
var GitPerformanceOptimizer_1 = require("./GitPerformanceOptimizer");
Object.defineProperty(exports, "GitPerformanceOptimizer", { enumerable: true, get: function () { return GitPerformanceOptimizer_1.GitPerformanceOptimizer; } });
// Document Parsing Cache
var DocumentParsingCache_1 = require("./DocumentParsingCache");
Object.defineProperty(exports, "DocumentParsingCache", { enumerable: true, get: function () { return DocumentParsingCache_1.DocumentParsingCache; } });
// Parallel Processing
var ParallelProcessor_1 = require("./ParallelProcessor");
Object.defineProperty(exports, "ParallelProcessor", { enumerable: true, get: function () { return ParallelProcessor_1.ParallelProcessor; } });
// Progress Reporting
var ProgressReporter_1 = require("./ProgressReporter");
Object.defineProperty(exports, "ProgressReporter", { enumerable: true, get: function () { return ProgressReporter_1.ProgressReporter; } });
//# sourceMappingURL=index.js.map