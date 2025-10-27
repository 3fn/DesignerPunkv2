"use strict";
/**
 * Release Integration Module
 *
 * Exports all integration interfaces and implementations for
 * workflow, hook system, file organization, and AI collaboration
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
exports.WorkflowMonitor = exports.WorkflowEventDetector = exports.FileOrganizationManager = exports.AICollaborationManager = exports.HookIntegrationManager = void 0;
// Interfaces
__exportStar(require("./WorkflowIntegration"), exports);
// Implementations
var HookIntegration_1 = require("./HookIntegration");
Object.defineProperty(exports, "HookIntegrationManager", { enumerable: true, get: function () { return HookIntegration_1.HookIntegrationManager; } });
var AICollaborationIntegration_1 = require("./AICollaborationIntegration");
Object.defineProperty(exports, "AICollaborationManager", { enumerable: true, get: function () { return AICollaborationIntegration_1.AICollaborationManager; } });
var FileOrganizationIntegration_1 = require("./FileOrganizationIntegration");
Object.defineProperty(exports, "FileOrganizationManager", { enumerable: true, get: function () { return FileOrganizationIntegration_1.FileOrganizationManager; } });
var WorkflowEventDetector_1 = require("./WorkflowEventDetector");
Object.defineProperty(exports, "WorkflowEventDetector", { enumerable: true, get: function () { return WorkflowEventDetector_1.WorkflowEventDetector; } });
var WorkflowMonitor_1 = require("../detection/WorkflowMonitor");
Object.defineProperty(exports, "WorkflowMonitor", { enumerable: true, get: function () { return WorkflowMonitor_1.WorkflowMonitor; } });
//# sourceMappingURL=index.js.map