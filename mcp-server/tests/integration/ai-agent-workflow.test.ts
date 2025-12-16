/**
 * End-to-End AI Agent Workflow Tests for MCP Documentation Server
 * 
 * Simulates AI agent completing complex tasks using MCP server.
 * Tests progressive disclosure workflow (map → summary → section).
 * 
 * Validates:
 * - AI agent doesn't exhaust context during complex tasks
 * - Progressive disclosure workflow works correctly
 * - Conditional filtering returns only relevant sections
 * - Error handling provides clear guidance
 * - Total token usage for complete workflows
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4
 */

import * as fs from 'fs';
import * as path from 'path';
import { DocumentIndexer } from '../../src/indexer/DocumentIndexer';
import { QueryEngine } from '../../src/query/QueryEngine';
import { estimateTokenCount } from '../../src/utils/token-estimator';
import {
  handleGetDocumentationMap,
  handleGetDocumentSummary,
  handleGetDocumentFull,
  handleGetSection,
  handleListCrossReferences,
  handleValidateMetadata,
  isGetDocumentSummaryError,
  isGetDocumentFullError,
  isGetSectionError,
  isListCrossReferencesError,
  isValidateMetadataError,
} from '../../src/tools';

// Test fixtures directory
const TEST_FIXTURES_DIR = path.join(__dirname, '../../test-fixtures/ai-workflow');
const TEST_LOGS_DIR = path.join(__dirname, '../../test-fixtures/logs');

// Context budget simulation (typical AI agent context window)
const CONTEXT_BUDGET_TOKENS = 8000; // Simulated context budget for testing

/**
 * Generate a steering document with conditional sections
 */
function generateSteeringDocument(name: string, layer: number): string {
  return `# ${name}

**Date**: 2025-12-16
**Purpose**: ${name} for AI agent workflow testing
**Organization**: test-org
**Scope**: test-scope
**Layer**: ${layer}
**Relevant Tasks**: component-development, spec-creation, debugging

---

## AI Agent Reading Priorities

**Layer Context**: This is a Layer ${layer} document for testing AI agent workflows.

**WHEN building components THEN Read:**
- Component Patterns section
- Token Usage section

**WHEN creating specs THEN Read:**
- Spec Planning section
- Requirements Format section

**WHEN debugging THEN Read:**
- Troubleshooting section
- Error Handling section

**SKIP when:**
- Working on unrelated tasks
- Following established patterns

---

## Overview

This document provides guidance for ${name.toLowerCase()}.
It contains multiple sections with conditional loading markers.

## Component Patterns (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Building new components
- Modifying existing components
- Need component architecture guidance

**Skip when**: 
- Working on non-component tasks
- Following established component patterns

---

### Pattern 1: Container Pattern

Use containers for grouping related content.
Apply consistent spacing and padding tokens.

### Pattern 2: Button Pattern

Buttons should follow the CTA component guidelines.
Use semantic color tokens for variants.

## Token Usage (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Selecting tokens for components
- Need token hierarchy guidance
- Working with semantic tokens

**Skip when**: 
- Not working with tokens
- Using established token patterns

---

### Semantic Tokens

Always prefer semantic tokens over primitives.
Check the token system overview for available tokens.

### Primitive Tokens

Use primitives only when semantic tokens don't exist.
Document the rationale for primitive usage.

## Spec Planning (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Creating new specifications
- Updating existing specs
- Need EARS format guidance

**Skip when**: 
- Executing implementation tasks
- Not working on specs

---

### Requirements Format

Use EARS format for acceptance criteria.
Include user stories for context.

### Design Document

Document architecture decisions with rationale.
Include trade-offs and counter-arguments.

## Troubleshooting (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Debugging issues
- Investigating errors
- Need diagnostic guidance

**Skip when**: 
- Normal development without issues
- No errors or problems

---

### Common Issues

Check logs for error messages.
Verify configuration is correct.

### Error Recovery

Follow the recovery procedures.
Document lessons learned.

## Cross-References

See [Related Guide](./related-guide.md) for additional patterns.
Check [Token Overview](./token-overview.md) for token details.
Reference [Spec Standards](./spec-standards.md) for spec guidance.

`;
}

/**
 * Simulate AI agent workflow step
 */
interface WorkflowStep {
  action: string;
  tokensUsed: number;
  result: 'success' | 'error';
  details: string;
}

/**
 * Track workflow execution
 */
interface WorkflowExecution {
  taskType: string;
  steps: WorkflowStep[];
  totalTokens: number;
  contextExhausted: boolean;
  success: boolean;
}

describe('End-to-End AI Agent Workflow Tests', () => {
  let indexer: DocumentIndexer;
  let queryEngine: QueryEngine;
  let testDocs: string[] = [];

  beforeAll(async () => {
    // Create test fixtures directories
    if (!fs.existsSync(TEST_FIXTURES_DIR)) {
      fs.mkdirSync(TEST_FIXTURES_DIR, { recursive: true });
    }
    if (!fs.existsSync(TEST_LOGS_DIR)) {
      fs.mkdirSync(TEST_LOGS_DIR, { recursive: true });
    }

    // Create test documents
    const docs = [
      { name: 'Component Development Guide', layer: 3 },
      { name: 'Spec Planning Standards', layer: 2 },
      { name: 'File Organization Standards', layer: 2 },
      { name: 'Development Workflow', layer: 2 },
      { name: 'Token System Overview', layer: 2 },
    ];

    for (const doc of docs) {
      const docPath = path.join(TEST_FIXTURES_DIR, `${doc.name.replace(/\s+/g, '-').toLowerCase()}.md`);
      fs.writeFileSync(docPath, generateSteeringDocument(doc.name, doc.layer));
      testDocs.push(docPath);
    }

    // Initialize components
    indexer = new DocumentIndexer(TEST_LOGS_DIR);
    queryEngine = new QueryEngine(indexer);

    // Index test documents
    await indexer.indexDirectory(TEST_FIXTURES_DIR);
  });

  afterAll(() => {
    // Clean up test fixtures
    const fixturesRoot = path.join(__dirname, '../../test-fixtures');
    if (fs.existsSync(fixturesRoot)) {
      fs.rmSync(fixturesRoot, { recursive: true, force: true });
    }
  });

  describe('Progressive Disclosure Workflow (map → summary → section)', () => {
    it('should complete component development task using progressive disclosure', () => {
      const execution: WorkflowExecution = {
        taskType: 'component-development',
        steps: [],
        totalTokens: 0,
        contextExhausted: false,
        success: false,
      };

      // Step 1: Get documentation map to discover available docs
      const mapResult = handleGetDocumentationMap(queryEngine);
      const mapTokens = estimateTokenCount(JSON.stringify(mapResult.documentationMap));
      execution.steps.push({
        action: 'get_documentation_map',
        tokensUsed: mapTokens,
        result: 'success',
        details: `Found ${Object.keys(mapResult.documentationMap.layers).length} layers with documents`,
      });
      execution.totalTokens += mapTokens;

      // Step 2: Get summary of Component Development Guide
      const componentGuide = testDocs.find(d => d.includes('component-development'));
      expect(componentGuide).toBeDefined();
      
      const summaryResult = handleGetDocumentSummary(queryEngine, componentGuide!);
      if (!isGetDocumentSummaryError(summaryResult)) {
        const summaryTokens = estimateTokenCount(JSON.stringify(summaryResult.documentSummary));
        execution.steps.push({
          action: 'get_document_summary',
          tokensUsed: summaryTokens,
          result: 'success',
          details: `Got summary with ${summaryResult.documentSummary.outline.length} sections`,
        });
        execution.totalTokens += summaryTokens;
      }

      // Step 3: Get specific section for component patterns
      const sectionResult = handleGetSection(queryEngine, componentGuide!, 'Component Patterns (Conditional Loading)');
      if (!isGetSectionError(sectionResult)) {
        execution.steps.push({
          action: 'get_section',
          tokensUsed: sectionResult.section.tokenCount,
          result: 'success',
          details: `Got section "${sectionResult.section.heading}" with ${sectionResult.section.tokenCount} tokens`,
        });
        execution.totalTokens += sectionResult.section.tokenCount;
      }

      // Step 4: Get token usage section
      const tokenSectionResult = handleGetSection(queryEngine, componentGuide!, 'Token Usage (Conditional Loading)');
      if (!isGetSectionError(tokenSectionResult)) {
        execution.steps.push({
          action: 'get_section',
          tokensUsed: tokenSectionResult.section.tokenCount,
          result: 'success',
          details: `Got section "${tokenSectionResult.section.heading}" with ${tokenSectionResult.section.tokenCount} tokens`,
        });
        execution.totalTokens += tokenSectionResult.section.tokenCount;
      }

      // Check if context was exhausted
      execution.contextExhausted = execution.totalTokens > CONTEXT_BUDGET_TOKENS;
      execution.success = !execution.contextExhausted && execution.steps.every(s => s.result === 'success');

      // Log workflow execution
      console.log('\n=== Component Development Workflow ===');
      console.log('Step | Action                  | Tokens | Result');
      console.log('-----|-------------------------|--------|--------');
      execution.steps.forEach((step, i) => {
        console.log(`${(i + 1).toString().padStart(4)} | ${step.action.padEnd(23)} | ${step.tokensUsed.toString().padStart(6)} | ${step.result}`);
      });
      console.log('-----|-------------------------|--------|--------');
      console.log(`     | TOTAL                   | ${execution.totalTokens.toString().padStart(6)} | ${execution.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`     | Context Budget          | ${CONTEXT_BUDGET_TOKENS.toString().padStart(6)} | ${execution.contextExhausted ? 'EXHAUSTED' : 'OK'}`);
      console.log('=====================================\n');

      // Verify workflow completed successfully
      expect(execution.success).toBe(true);
      expect(execution.contextExhausted).toBe(false);
      expect(execution.totalTokens).toBeLessThan(CONTEXT_BUDGET_TOKENS);
    });

    it('should complete spec creation task using progressive disclosure', () => {
      const execution: WorkflowExecution = {
        taskType: 'spec-creation',
        steps: [],
        totalTokens: 0,
        contextExhausted: false,
        success: false,
      };

      // Step 1: Get documentation map
      const mapResult = handleGetDocumentationMap(queryEngine);
      const mapTokens = estimateTokenCount(JSON.stringify(mapResult.documentationMap));
      execution.steps.push({
        action: 'get_documentation_map',
        tokensUsed: mapTokens,
        result: 'success',
        details: 'Discovered available documentation',
      });
      execution.totalTokens += mapTokens;

      // Step 2: Get summary of Spec Planning Standards
      const specStandards = testDocs.find(d => d.includes('spec-planning'));
      expect(specStandards).toBeDefined();

      const summaryResult = handleGetDocumentSummary(queryEngine, specStandards!);
      if (!isGetDocumentSummaryError(summaryResult)) {
        const summaryTokens = estimateTokenCount(JSON.stringify(summaryResult.documentSummary));
        execution.steps.push({
          action: 'get_document_summary',
          tokensUsed: summaryTokens,
          result: 'success',
          details: `Got summary for spec planning`,
        });
        execution.totalTokens += summaryTokens;
      }

      // Step 3: Get spec planning section
      const sectionResult = handleGetSection(queryEngine, specStandards!, 'Spec Planning (Conditional Loading)');
      if (!isGetSectionError(sectionResult)) {
        execution.steps.push({
          action: 'get_section',
          tokensUsed: sectionResult.section.tokenCount,
          result: 'success',
          details: `Got spec planning guidance`,
        });
        execution.totalTokens += sectionResult.section.tokenCount;
      }

      // Step 4: Get cross-references for related docs
      const crossRefResult = handleListCrossReferences(queryEngine, specStandards!);
      if (!isListCrossReferencesError(crossRefResult)) {
        const crossRefTokens = estimateTokenCount(JSON.stringify(crossRefResult.crossReferences));
        execution.steps.push({
          action: 'list_cross_references',
          tokensUsed: crossRefTokens,
          result: 'success',
          details: `Found ${crossRefResult.crossReferences.length} cross-references`,
        });
        execution.totalTokens += crossRefTokens;
      }

      execution.contextExhausted = execution.totalTokens > CONTEXT_BUDGET_TOKENS;
      execution.success = !execution.contextExhausted && execution.steps.every(s => s.result === 'success');

      console.log('\n=== Spec Creation Workflow ===');
      console.log('Step | Action                  | Tokens | Result');
      console.log('-----|-------------------------|--------|--------');
      execution.steps.forEach((step, i) => {
        console.log(`${(i + 1).toString().padStart(4)} | ${step.action.padEnd(23)} | ${step.tokensUsed.toString().padStart(6)} | ${step.result}`);
      });
      console.log('-----|-------------------------|--------|--------');
      console.log(`     | TOTAL                   | ${execution.totalTokens.toString().padStart(6)} | ${execution.success ? 'SUCCESS' : 'FAILED'}`);
      console.log('==============================\n');

      expect(execution.success).toBe(true);
      expect(execution.contextExhausted).toBe(false);
    });
  });

  describe('Context Exhaustion Prevention', () => {
    it('should not exhaust context when accessing multiple documents', () => {
      let totalTokens = 0;
      const accessedDocs: string[] = [];

      // Simulate accessing all documents via summaries (not full content)
      for (const docPath of testDocs) {
        const summaryResult = handleGetDocumentSummary(queryEngine, docPath);
        if (!isGetDocumentSummaryError(summaryResult)) {
          const tokens = estimateTokenCount(JSON.stringify(summaryResult.documentSummary));
          totalTokens += tokens;
          accessedDocs.push(path.basename(docPath));
        }
      }

      console.log('\n=== Context Exhaustion Test (Summaries Only) ===');
      console.log(`Documents accessed: ${accessedDocs.length}`);
      console.log(`Total tokens used: ${totalTokens}`);
      console.log(`Context budget: ${CONTEXT_BUDGET_TOKENS}`);
      console.log(`Remaining budget: ${CONTEXT_BUDGET_TOKENS - totalTokens}`);
      console.log('================================================\n');

      // Verify we can access all summaries without exhausting context
      expect(totalTokens).toBeLessThan(CONTEXT_BUDGET_TOKENS);
      expect(accessedDocs.length).toBe(testDocs.length);
    });

    it('should demonstrate context savings vs loading full documents', () => {
      let summaryTokens = 0;
      let fullDocTokens = 0;

      for (const docPath of testDocs) {
        // Get summary tokens
        const summaryResult = handleGetDocumentSummary(queryEngine, docPath);
        if (!isGetDocumentSummaryError(summaryResult)) {
          summaryTokens += estimateTokenCount(JSON.stringify(summaryResult.documentSummary));
        }

        // Get full document tokens
        const fullResult = handleGetDocumentFull(queryEngine, docPath);
        if (!isGetDocumentFullError(fullResult)) {
          fullDocTokens += fullResult.documentFull.tokenCount;
        }
      }

      const savings = ((fullDocTokens - summaryTokens) / fullDocTokens) * 100;

      console.log('\n=== Context Savings Analysis ===');
      console.log(`Full documents: ${fullDocTokens} tokens`);
      console.log(`Summaries only: ${summaryTokens} tokens`);
      console.log(`Token savings: ${savings.toFixed(1)}%`);
      console.log('================================\n');

      // Verify significant savings
      expect(summaryTokens).toBeLessThan(fullDocTokens);
      expect(savings).toBeGreaterThan(30); // At least 30% savings
    });
  });

  describe('Conditional Filtering', () => {
    it('should return relevant sections for component-development task type', () => {
      const componentGuide = testDocs.find(d => d.includes('component-development'));
      expect(componentGuide).toBeDefined();

      // Get summary to see available sections
      const summaryResult = handleGetDocumentSummary(queryEngine, componentGuide!);
      expect(isGetDocumentSummaryError(summaryResult)).toBe(false);

      if (!isGetDocumentSummaryError(summaryResult)) {
        const sections = summaryResult.documentSummary.outline.map(s => s.heading);
        
        // Verify component-related sections are available
        expect(sections.some(s => s.includes('Component'))).toBe(true);
        expect(sections.some(s => s.includes('Token'))).toBe(true);

        console.log('\n=== Available Sections for Component Development ===');
        sections.forEach(s => console.log(`  - ${s}`));
        console.log('====================================================\n');
      }
    });

    it('should return relevant sections for debugging task type', () => {
      const workflowDoc = testDocs.find(d => d.includes('development-workflow'));
      expect(workflowDoc).toBeDefined();

      const summaryResult = handleGetDocumentSummary(queryEngine, workflowDoc!);
      expect(isGetDocumentSummaryError(summaryResult)).toBe(false);

      if (!isGetDocumentSummaryError(summaryResult)) {
        const sections = summaryResult.documentSummary.outline.map(s => s.heading);
        
        // Verify troubleshooting section is available
        expect(sections.some(s => s.includes('Troubleshooting'))).toBe(true);

        console.log('\n=== Available Sections for Debugging ===');
        sections.forEach(s => console.log(`  - ${s}`));
        console.log('========================================\n');
      }
    });
  });

  describe('Error Handling Provides Clear Guidance', () => {
    it('should provide clear error for non-existent document', () => {
      const result = handleGetDocumentSummary(queryEngine, '/non/existent/path.md');
      
      expect(isGetDocumentSummaryError(result)).toBe(true);
      if (isGetDocumentSummaryError(result)) {
        expect(result.error).toBeDefined();
        expect(result.error.message).toBeTruthy();
        
        console.log('\n=== Error Handling: Non-existent Document ===');
        console.log(`Error: ${result.error.error}`);
        console.log(`Message: ${result.error.message}`);
        console.log('=============================================\n');
      }
    });

    it('should provide clear error for non-existent section', () => {
      const componentGuide = testDocs.find(d => d.includes('component-development'));
      expect(componentGuide).toBeDefined();

      const result = handleGetSection(queryEngine, componentGuide!, 'Non-Existent Section');
      
      expect(isGetSectionError(result)).toBe(true);
      if (isGetSectionError(result)) {
        expect(result.error).toBeDefined();
        expect(result.error.message).toBeTruthy();
        
        // Should suggest available sections
        if (result.error.suggestions) {
          expect(result.error.suggestions.length).toBeGreaterThan(0);
        }

        console.log('\n=== Error Handling: Non-existent Section ===');
        console.log(`Error: ${result.error.error}`);
        console.log(`Message: ${result.error.message}`);
        if (result.error.suggestions) {
          console.log(`Suggestions: ${result.error.suggestions.join(', ')}`);
        }
        console.log('============================================\n');
      }
    });

    it('should validate metadata and report issues clearly', () => {
      // Ensure test fixtures directory exists
      if (!fs.existsSync(TEST_FIXTURES_DIR)) {
        fs.mkdirSync(TEST_FIXTURES_DIR, { recursive: true });
      }
      
      // Create a document with incomplete metadata
      const badDocPath = path.join(TEST_FIXTURES_DIR, 'bad-metadata.md');
      fs.writeFileSync(badDocPath, `# Bad Metadata Document

**Date**: 2025-12-16

## Content

This document has incomplete metadata.
`);

      // Re-index to include the new document
      indexer.reindexFile(badDocPath);

      const result = handleValidateMetadata(queryEngine, badDocPath);
      
      if (!isValidateMetadataError(result)) {
        console.log('\n=== Metadata Validation Results ===');
        console.log(`Valid: ${result.validation.valid}`);
        console.log(`Issues: ${result.validation.issues.length}`);
        result.validation.issues.forEach((issue: { field: string; issue: string; severity: string }) => {
          console.log(`  - ${issue.field}: ${issue.issue} (${issue.severity})`);
        });
        console.log('===================================\n');

        // Should report missing required fields
        expect(result.validation.issues.length).toBeGreaterThan(0);
      }

      // Clean up
      fs.unlinkSync(badDocPath);
    });
  });

  describe('Total Token Usage for Complete Workflows', () => {
    it('should measure total token usage for complex multi-document workflow', () => {
      const workflow: WorkflowStep[] = [];
      let totalTokens = 0;

      // Step 1: Discover documentation
      const mapResult = handleGetDocumentationMap(queryEngine);
      const mapTokens = estimateTokenCount(JSON.stringify(mapResult.documentationMap));
      workflow.push({ action: 'discover_docs', tokensUsed: mapTokens, result: 'success', details: 'Got documentation map' });
      totalTokens += mapTokens;

      // Step 2: Get summaries for relevant docs
      const relevantDocs = testDocs.slice(0, 3); // First 3 docs
      for (const docPath of relevantDocs) {
        const summaryResult = handleGetDocumentSummary(queryEngine, docPath);
        if (!isGetDocumentSummaryError(summaryResult)) {
          const tokens = estimateTokenCount(JSON.stringify(summaryResult.documentSummary));
          workflow.push({ 
            action: `summary_${path.basename(docPath).slice(0, 15)}`, 
            tokensUsed: tokens, 
            result: 'success', 
            details: 'Got document summary' 
          });
          totalTokens += tokens;
        }
      }

      // Step 3: Get specific sections from each doc
      for (const docPath of relevantDocs) {
        const sectionResult = handleGetSection(queryEngine, docPath, 'Overview');
        if (!isGetSectionError(sectionResult)) {
          workflow.push({ 
            action: `section_${path.basename(docPath).slice(0, 15)}`, 
            tokensUsed: sectionResult.section.tokenCount, 
            result: 'success', 
            details: 'Got Overview section' 
          });
          totalTokens += sectionResult.section.tokenCount;
        }
      }

      // Step 4: Check cross-references
      const crossRefResult = handleListCrossReferences(queryEngine, relevantDocs[0]);
      if (!isListCrossReferencesError(crossRefResult)) {
        const tokens = estimateTokenCount(JSON.stringify(crossRefResult.crossReferences));
        workflow.push({ action: 'cross_references', tokensUsed: tokens, result: 'success', details: 'Listed cross-refs' });
        totalTokens += tokens;
      }

      console.log('\n╔══════════════════════════════════════════════════════════════╗');
      console.log('║         COMPLEX MULTI-DOCUMENT WORKFLOW ANALYSIS             ║');
      console.log('╠══════════════════════════════════════════════════════════════╣');
      console.log('║ Step | Action                        | Tokens | Status       ║');
      console.log('║------|-------------------------------|--------|--------------|');
      workflow.forEach((step, i) => {
        const line = `║ ${(i + 1).toString().padStart(4)} | ${step.action.padEnd(29)} | ${step.tokensUsed.toString().padStart(6)} | ${step.result.padEnd(12)} ║`;
        console.log(line);
      });
      console.log('║------|-------------------------------|--------|--------------|');
      console.log(`║      | TOTAL                         | ${totalTokens.toString().padStart(6)} |              ║`);
      console.log(`║      | Context Budget                | ${CONTEXT_BUDGET_TOKENS.toString().padStart(6)} |              ║`);
      console.log(`║      | Budget Used                   | ${((totalTokens / CONTEXT_BUDGET_TOKENS) * 100).toFixed(1).padStart(5)}% |              ║`);
      console.log('╚══════════════════════════════════════════════════════════════╝\n');

      // Verify workflow completed within budget
      expect(totalTokens).toBeLessThan(CONTEXT_BUDGET_TOKENS);
      expect(workflow.every(s => s.result === 'success')).toBe(true);
    });

    it('should compare token usage: MCP workflow vs loading all documents', () => {
      // MCP Workflow approach
      let mcpTokens = 0;
      
      // Map + 2 summaries + 2 sections (typical workflow)
      const mapResult = handleGetDocumentationMap(queryEngine);
      mcpTokens += estimateTokenCount(JSON.stringify(mapResult.documentationMap));

      for (const docPath of testDocs.slice(0, 2)) {
        const summaryResult = handleGetDocumentSummary(queryEngine, docPath);
        if (!isGetDocumentSummaryError(summaryResult)) {
          mcpTokens += estimateTokenCount(JSON.stringify(summaryResult.documentSummary));
        }

        const sectionResult = handleGetSection(queryEngine, docPath, 'Overview');
        if (!isGetSectionError(sectionResult)) {
          mcpTokens += sectionResult.section.tokenCount;
        }
      }

      // Baseline approach: load all documents fully
      let baselineTokens = 0;
      for (const docPath of testDocs) {
        const fullResult = handleGetDocumentFull(queryEngine, docPath);
        if (!isGetDocumentFullError(fullResult)) {
          baselineTokens += fullResult.documentFull.tokenCount;
        }
      }

      const reduction = ((baselineTokens - mcpTokens) / baselineTokens) * 100;

      console.log('\n=== MCP vs Baseline Token Comparison ===');
      console.log(`Baseline (all docs): ${baselineTokens} tokens`);
      console.log(`MCP workflow:        ${mcpTokens} tokens`);
      console.log(`Token reduction:     ${reduction.toFixed(1)}%`);
      console.log(`Context budget:      ${CONTEXT_BUDGET_TOKENS} tokens`);
      console.log(`MCP fits in budget:  ${mcpTokens < CONTEXT_BUDGET_TOKENS ? 'YES' : 'NO'}`);
      console.log(`Baseline fits:       ${baselineTokens < CONTEXT_BUDGET_TOKENS ? 'YES' : 'NO'}`);
      console.log('========================================\n');

      // Verify MCP approach is more efficient
      expect(mcpTokens).toBeLessThan(baselineTokens);
      expect(mcpTokens).toBeLessThan(CONTEXT_BUDGET_TOKENS);
      expect(reduction).toBeGreaterThan(50); // At least 50% reduction
    });
  });
});
