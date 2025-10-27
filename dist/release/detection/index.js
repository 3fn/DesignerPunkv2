"use strict";
/**
 * Release Detection Module
 *
 * Exports all release detection components including the main ReleaseDetector,
 * CompletionAnalyzer for document parsing, and WorkflowMonitor for event detection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowMonitor = exports.CompletionAnalyzer = exports.ReleaseDetector = void 0;
var ReleaseDetector_1 = require("./ReleaseDetector");
Object.defineProperty(exports, "ReleaseDetector", { enumerable: true, get: function () { return ReleaseDetector_1.ReleaseDetector; } });
var CompletionAnalyzer_1 = require("./CompletionAnalyzer");
Object.defineProperty(exports, "CompletionAnalyzer", { enumerable: true, get: function () { return CompletionAnalyzer_1.CompletionAnalyzer; } });
var WorkflowMonitor_1 = require("./WorkflowMonitor");
Object.defineProperty(exports, "WorkflowMonitor", { enumerable: true, get: function () { return WorkflowMonitor_1.WorkflowMonitor; } });
//# sourceMappingURL=index.js.map