/**
 * Security Integration Tests
 * 
 * Tests for integrated security system functionality including
 * AI restrictions, contamination prevention, documentation guard,
 * and human approval workflow
 */

import { AIAgentRestrictions } from '../AIAgentRestrictions';
import { ContaminationPrevention } from '../ContaminationPrevention';
import { ContaminationAuditor } from '../ContaminationAuditor';
import { DocumentationGuard } from '../DocumentationGuard';
import { FlexibilityTokenGuard } from '../FlexibilityTokenGuard';
import { HumanApprovalWorkflow, ApprovalStatus } from '../HumanApprovalWorkflow';
import type { PrimitiveToken } from '../../types/PrimitiveToken';
import type { RestrictionContext } from '../AIAgentRestrictions';
import type { AuditTarget } from '../ContaminationAuditor';
import { TokenCategory } from '../../types/PrimitiveToken';

describe('Security Integration', () => {
  describe('FlexibilityTokenGuard Integration', () => {
    let guard: FlexibilityTokenGuard;
    let aiContext: RestrictionContext;

    beforeEach(() => {
      guard = new FlexibilityTokenGuard();
      aiContext = {
        source: 'ai-agent',
        identifier: 'test-agent',
        timestamp: new Date()
      };
    });

    it('should integrate AI restrictions with approval workflow', () => {
      const token: PrimitiveToken = {
        name: 'space085',
        category: TokenCategory.SPACING,
        baseValue: 7,
        familyBaseValue: 8,
        description: 'New strategic flexibility',
        mathematicalRelationship: 'base × 0.875',
        baselineGridAlignment: false,
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 7, unit: 'px' },
          ios: { value: 7, unit: 'pt' },
          android: { value: 7, unit: 'dp' }
        }
      };

      const result = guard.guard(token, aiContext);

      expect(result.allowed).toBe(false);
      expect(result.approvalRequest).toBeDefined();
      expect(result.approvalRequest!.token).toBe(token);
      expect(result.approvalRequest!.status).toBe(ApprovalStatus.PENDING);
    });

    it('should allow approval of pending requests', () => {
      const token: PrimitiveToken = {
        name: 'space085',
        category: TokenCategory.SPACING,
        baseValue: 7,
        familyBaseValue: 8,
        description: 'New strategic flexibility',
        mathematicalRelationship: 'base × 0.875',
        baselineGridAlignment: false,
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 7, unit: 'px' },
          ios: { value: 7, unit: 'pt' },
          android: { value: 7, unit: 'dp' }
        }
      };

      const guardResult = guard.guard(token, aiContext);
      const requestId = guardResult.approvalRequest!.id;

      const approved = guard.approve(requestId, 'human-reviewer', 'Approved for specific use case');

      expect(approved).toBeDefined();
      expect(approved!.status).toBe(ApprovalStatus.APPROVED);
      expect(approved!.resolvedBy).toBe('human-reviewer');
    });

    it('should allow rejection of pending requests', () => {
      const token: PrimitiveToken = {
        name: 'space085',
        category: TokenCategory.SPACING,
        baseValue: 7,
        familyBaseValue: 8,
        description: 'New strategic flexibility',
        mathematicalRelationship: 'base × 0.875',
        baselineGridAlignment: false,
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 7, unit: 'px' },
          ios: { value: 7, unit: 'pt' },
          android: { value: 7, unit: 'dp' }
        }
      };

      const guardResult = guard.guard(token, aiContext);
      const requestId = guardResult.approvalRequest!.id;

      const rejected = guard.reject(requestId, 'human-reviewer', 'Use existing alternatives');

      expect(rejected).toBeDefined();
      expect(rejected!.status).toBe(ApprovalStatus.REJECTED);
      expect(rejected!.resolvedBy).toBe('human-reviewer');
    });

    it('should track pending approvals', () => {
      const token: PrimitiveToken = {
        name: 'space085',
        category: TokenCategory.SPACING,
        baseValue: 7,
        familyBaseValue: 8,
        description: 'New strategic flexibility',
        mathematicalRelationship: 'base × 0.875',
        baselineGridAlignment: false,
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 7, unit: 'px' },
          ios: { value: 7, unit: 'pt' },
          android: { value: 7, unit: 'dp' }
        }
      };

      guard.guard(token, aiContext);

      const pending = guard.getPendingApprovals();
      expect(pending.length).toBe(1);
      expect(pending[0].token).toBe(token);
    });

    it('should provide integrated statistics', () => {
      const token: PrimitiveToken = {
        name: 'space085',
        category: TokenCategory.SPACING,
        baseValue: 7,
        familyBaseValue: 8,
        description: 'New strategic flexibility',
        mathematicalRelationship: 'base × 0.875',
        baselineGridAlignment: false,
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 7, unit: 'px' },
          ios: { value: 7, unit: 'pt' },
          android: { value: 7, unit: 'dp' }
        }
      };

      guard.guard(token, aiContext);

      const stats = guard.getStats();
      expect(stats.restrictions).toBeDefined();
      expect(stats.approvals).toBeDefined();
      expect(stats.restrictions.blockedActions).toBe(1);
      expect(stats.approvals.pending).toBe(1);
    });
  });

  describe('ContaminationAuditor Integration', () => {
    let auditor: ContaminationAuditor;

    beforeEach(() => {
      auditor = new ContaminationAuditor();
    });

    it('should audit documentation targets', () => {
      const target: AuditTarget = {
        path: 'docs/tokens.md',
        type: 'documentation',
        content: `
          # Token System
          
          The token system uses mathematical relationships.
        `
      };

      const result = auditor.auditTarget(target);

      expect(result.passed).toBe(true);
      expect(result.severity).toBe('clean');
    });

    it('should detect contamination in documentation', () => {
      const target: AuditTarget = {
        path: 'docs/implementation.md',
        type: 'documentation',
        content: `
          \`\`\`typescript
          const token = space100;
          \`\`\`
        `
      };

      const result = auditor.auditTarget(target);

      expect(result.passed).toBe(false);
      expect(result.vectors.length).toBeGreaterThan(0);
      expect(result.severity).not.toBe('clean');
    });

    it('should audit multiple targets', () => {
      const targets: AuditTarget[] = [
        {
          path: 'docs/clean.md',
          type: 'documentation',
          content: 'Mathematical relationships ensure consistency.'
        },
        {
          path: 'docs/contaminated.md',
          type: 'documentation',
          content: '```typescript\nconst x = 1;\n```'
        }
      ];

      const report = auditor.auditTargets(targets);

      expect(report.totalTargets).toBe(2);
      expect(report.passedTargets).toBe(1);
      expect(report.failedTargets).toBe(1);
    });

    it('should generate comprehensive audit report', () => {
      const targets: AuditTarget[] = [
        {
          path: 'docs/tokens.md',
          type: 'documentation',
          content: 'Token system documentation.'
        }
      ];

      const report = auditor.auditTargets(targets);

      expect(report.timestamp).toBeInstanceOf(Date);
      expect(report.summary).toBeDefined();
      expect(report.summary.overallStatus).toBe('clean');
    });

    it('should identify critical issues', () => {
      const targets: AuditTarget[] = [
        {
          path: 'docs/bad.md',
          type: 'documentation',
          content: '```typescript\nfunction bad() {}\n```'
        }
      ];

      const report = auditor.auditTargets(targets);

      expect(report.criticalIssues.length).toBeGreaterThan(0);
    });

    it('should format audit report as text', () => {
      const targets: AuditTarget[] = [
        {
          path: 'docs/test.md',
          type: 'documentation',
          content: 'Clean content.'
        }
      ];

      const report = auditor.auditTargets(targets);
      const formatted = auditor.formatReport(report);

      expect(formatted).toContain('CONTAMINATION AUDIT REPORT');
      expect(formatted).toContain('SUMMARY');
      expect(formatted).toContain('Total Targets');
    });

    it('should determine if audit passed', () => {
      const cleanTargets: AuditTarget[] = [
        {
          path: 'docs/clean.md',
          type: 'documentation',
          content: 'Clean documentation.'
        }
      ];

      const report = auditor.auditTargets(cleanTargets);
      expect(auditor.auditPassed(report)).toBe(true);
    });

    it('should fail audit with critical issues', () => {
      const contaminated: AuditTarget[] = [
        {
          path: 'docs/bad.md',
          type: 'documentation',
          content: '```typescript\nconst bad = true;\n```'
        }
      ];

      const report = auditor.auditTargets(contaminated);
      expect(auditor.auditPassed(report)).toBe(false);
    });
  });

  describe('DocumentationGuard Integration', () => {
    let guard: DocumentationGuard;

    beforeEach(() => {
      guard = new DocumentationGuard();
    });

    it('should validate concept-based documentation', () => {
      const content = `
        The mathematical token system ensures cross-platform consistency
        through baseline grid alignment and modular scale progression.
      `;

      const result = guard.validateDocumentation(content);

      expect(result.isValid).toBe(true);
      expect(result.approach).toBe('concept-based');
    });

    it('should reject code-based documentation', () => {
      const content = `
        \`\`\`typescript
        const token = space100;
        \`\`\`
      `;

      const result = guard.validateDocumentation(content);

      expect(result.isValid).toBe(false);
      expect(result.approach).toBe('code-based');
    });

    it('should block code example generation', () => {
      const block = guard.blockCodeExampleGeneration('token-usage');

      expect(block.blocked).toBe(true);
      expect(block.reason).toContain('contamination vectors');
      expect(block.alternative).toContain('concept-based');
    });

    it('should suggest concept-based alternatives', () => {
      const codeExample = 'const spacing = space100;';
      const suggestion = guard.suggestConceptBasedAlternative(codeExample);

      expect(suggestion).toContain('token');
      expect(suggestion.length).toBeGreaterThan(0);
    });

    it('should validate token documentation', () => {
      const documentation = `
        space100 represents the base spacing value with 8-unit baseline grid alignment.
        It follows the mathematical relationship: base × 1.
      `;

      const result = guard.validateTokenDocumentation('space100', documentation);

      expect(result.isValid).toBe(true);
      expect(result.feedback.some(f => f.includes('✅'))).toBe(true);
    });

    it('should warn about missing token context', () => {
      const documentation = `
        This is a spacing token.
      `;

      const result = guard.validateTokenDocumentation('space100', documentation);

      expect(result.feedback.some(f => f.includes('mathematical'))).toBe(true);
    });
  });

  describe('End-to-End Security Workflow', () => {
    it('should enforce complete security workflow', () => {
      const guard = new FlexibilityTokenGuard();
      const docGuard = new DocumentationGuard();
      const prevention = new ContaminationPrevention();

      // Step 1: AI agent attempts to create new flexibility token
      const token: PrimitiveToken = {
        name: 'space085',
        category: TokenCategory.SPACING,
        baseValue: 7,
        familyBaseValue: 8,
        description: 'New strategic flexibility',
        mathematicalRelationship: 'base × 0.875',
        baselineGridAlignment: false,
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 7, unit: 'px' },
          ios: { value: 7, unit: 'pt' },
          android: { value: 7, unit: 'dp' }
        }
      };

      const aiContext: RestrictionContext = {
        source: 'ai-agent',
        identifier: 'test-agent',
        timestamp: new Date()
      };

      const guardResult = guard.guard(token, aiContext);

      // Verify token creation is blocked
      expect(guardResult.allowed).toBe(false);
      expect(guardResult.approvalRequest).toBeDefined();

      // Step 2: Validate documentation doesn't contain code examples
      const documentation = `
        The space085 token provides strategic flexibility for specific design requirements.
        It maintains mathematical relationships while allowing for exceptional cases.
      `;

      const docResult = docGuard.validateDocumentation(documentation);
      expect(docResult.isValid).toBe(true);

      // Step 3: Check for contamination vectors
      const contaminationCheck = prevention.checkContent(documentation);
      expect(contaminationCheck.isClean).toBe(true);

      // Step 4: Human approves the token
      const requestId = guardResult.approvalRequest!.id;
      const approved = guard.approve(requestId, 'human-reviewer', 'Approved after review');

      expect(approved!.status).toBe(ApprovalStatus.APPROVED);
    });

    it('should prevent contamination through multiple layers', () => {
      const auditor = new ContaminationAuditor();

      // Create targets with various contamination levels
      const targets: AuditTarget[] = [
        {
          path: 'docs/clean.md',
          type: 'documentation',
          content: 'Mathematical relationships ensure consistency.'
        },
        {
          path: 'docs/code-example.md',
          type: 'documentation',
          content: '```typescript\nconst x = 1;\n```'
        },
        {
          path: 'docs/implementation.md',
          type: 'documentation',
          content: 'How to implement the system step by step.'
        }
      ];

      const report = auditor.auditTargets(targets);

      // Verify contamination is detected
      expect(report.failedTargets).toBeGreaterThan(0);
      expect(report.summary.totalVectors).toBeGreaterThan(0);
      expect(report.criticalIssues.length).toBeGreaterThan(0);

      // Verify recommendations are provided
      expect(report.summary.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Configuration Integration', () => {
    it('should coordinate configuration across security systems', () => {
      const guard = new FlexibilityTokenGuard({
        enabled: true,
        restrictions: {
          enabled: true,
          allowSuggestions: true,
          logRestrictions: true
        },
        approval: {
          enableExpiration: true,
          expirationTime: 1000,
          requireResolutionNotes: true
        }
      });

      const stats = guard.getStats();
      expect(stats.restrictions.config.enabled).toBe(true);
      expect(stats.approvals.config.enableExpiration).toBe(true);
    });

    it('should allow dynamic configuration updates', () => {
      const auditor = new ContaminationAuditor();

      auditor.updateConfig({
        strictMode: true,
        failOnCritical: true
      });

      const config = auditor.getConfig();
      expect(config.strictMode).toBe(true);
      expect(config.failOnCritical).toBe(true);
    });
  });
});
