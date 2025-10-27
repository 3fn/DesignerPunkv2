"use strict";
/**
 * Security Module
 *
 * Provides AI agent restrictions and human approval workflows for protecting
 * the mathematical token system from unauthorized modifications.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContaminationAuditor = exports.DocumentationGuard = exports.ContaminationPrevention = exports.FlexibilityTokenGuard = exports.ApprovalStatus = exports.HumanApprovalWorkflow = exports.AIAgentRestrictions = void 0;
var AIAgentRestrictions_1 = require("./AIAgentRestrictions");
Object.defineProperty(exports, "AIAgentRestrictions", { enumerable: true, get: function () { return AIAgentRestrictions_1.AIAgentRestrictions; } });
var HumanApprovalWorkflow_1 = require("./HumanApprovalWorkflow");
Object.defineProperty(exports, "HumanApprovalWorkflow", { enumerable: true, get: function () { return HumanApprovalWorkflow_1.HumanApprovalWorkflow; } });
Object.defineProperty(exports, "ApprovalStatus", { enumerable: true, get: function () { return HumanApprovalWorkflow_1.ApprovalStatus; } });
var FlexibilityTokenGuard_1 = require("./FlexibilityTokenGuard");
Object.defineProperty(exports, "FlexibilityTokenGuard", { enumerable: true, get: function () { return FlexibilityTokenGuard_1.FlexibilityTokenGuard; } });
var ContaminationPrevention_1 = require("./ContaminationPrevention");
Object.defineProperty(exports, "ContaminationPrevention", { enumerable: true, get: function () { return ContaminationPrevention_1.ContaminationPrevention; } });
var DocumentationGuard_1 = require("./DocumentationGuard");
Object.defineProperty(exports, "DocumentationGuard", { enumerable: true, get: function () { return DocumentationGuard_1.DocumentationGuard; } });
var ContaminationAuditor_1 = require("./ContaminationAuditor");
Object.defineProperty(exports, "ContaminationAuditor", { enumerable: true, get: function () { return ContaminationAuditor_1.ContaminationAuditor; } });
//# sourceMappingURL=index.js.map