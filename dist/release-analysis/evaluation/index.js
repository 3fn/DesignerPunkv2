"use strict";
/**
 * Release Analysis Evaluation Module
 *
 * Exports evaluation framework components for systematic testing
 * and comparison of extraction approaches.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQuickComparison = exports.runArtifactEvaluation = exports.EvaluationCLI = exports.ArtifactEvaluator = void 0;
var ArtifactEvaluator_1 = require("./ArtifactEvaluator");
Object.defineProperty(exports, "ArtifactEvaluator", { enumerable: true, get: function () { return ArtifactEvaluator_1.ArtifactEvaluator; } });
var EvaluationCLI_1 = require("./EvaluationCLI");
Object.defineProperty(exports, "EvaluationCLI", { enumerable: true, get: function () { return EvaluationCLI_1.EvaluationCLI; } });
Object.defineProperty(exports, "runArtifactEvaluation", { enumerable: true, get: function () { return EvaluationCLI_1.runArtifactEvaluation; } });
Object.defineProperty(exports, "runQuickComparison", { enumerable: true, get: function () { return EvaluationCLI_1.runQuickComparison; } });
//# sourceMappingURL=index.js.map