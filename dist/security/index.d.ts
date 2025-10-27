/**
 * Security Module
 *
 * Provides AI agent restrictions and human approval workflows for protecting
 * the mathematical token system from unauthorized modifications.
 */
export { AIAgentRestrictions } from './AIAgentRestrictions';
export type { RestrictionContext, RestrictionResult, AIAgentRestrictionsConfig } from './AIAgentRestrictions';
export { HumanApprovalWorkflow, ApprovalStatus } from './HumanApprovalWorkflow';
export type { ApprovalRequest, ApprovalDecision, HumanApprovalWorkflowConfig } from './HumanApprovalWorkflow';
export { FlexibilityTokenGuard } from './FlexibilityTokenGuard';
export type { FlexibilityTokenGuardConfig, GuardResult } from './FlexibilityTokenGuard';
export { ContaminationPrevention } from './ContaminationPrevention';
export type { ContaminationVector, ContaminationCheckResult, ContaminationPreventionConfig } from './ContaminationPrevention';
export { DocumentationGuard } from './DocumentationGuard';
export type { DocumentationValidationResult, DocumentationGuardConfig } from './DocumentationGuard';
export { ContaminationAuditor } from './ContaminationAuditor';
export type { AuditTarget, AuditResult, AuditReport, AuditSummary, ContaminationAuditorConfig } from './ContaminationAuditor';
//# sourceMappingURL=index.d.ts.map