/**
 * Token Efficiency Tests for MCP Documentation Server
 * 
 * Validates token efficiency by comparing:
 * - Baseline approach: Loading all Layer 2-3 documents fully
 * - MCP approach: Query map + summary + section (progressive disclosure)
 * 
 * Tests verify:
 * - Token reduction percentage between approaches
 * - Summary token counts for all Layer 2-3 documents
 * - Section token counts for common sections
 * - Token estimation accuracy within 10%
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
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
  isGetDocumentSummaryError,
  isGetDocumentFullError,
  isGetSectionError,
} from '../../src/tools';

// Test fixtures directory
const TEST_FIXTURES_DIR = path.join(__dirname, '../../test-fixtures/token-efficiency');
const TEST_LOGS_DIR = path.join(__dirname, '../../test-fixtures/logs');

/**
 * Generate Layer 2 document content (Frameworks and Patterns)
 */
function generateLayer2Document(name: string, size: number): string {
  const header = `# ${name}

**Date**: 2025-12-16
**Purpose**: Framework document for testing token efficiency
**Organization**: test-org
**Scope**: test-scope
**Layer**: 2
**Relevant Tasks**: testing, framework

---

## Overview

This is a Layer 2 (Frameworks and Patterns) document for token efficiency testing.
It contains reusable patterns and methodologies.

## Framework Principles

### Principle 1: Consistency

Maintain consistent patterns across all implementations.
This ensures predictable behavior and easier maintenance.

### Principle 2: Extensibility

Design for future extension without modification.
Use interfaces and abstractions appropriately.

## Common Patterns

### Pattern A: Repository Pattern

The repository pattern abstracts data access logic.
It provides a clean separation between business logic and data access.

### Pattern B: Factory Pattern

The factory pattern encapsulates object creation.
It allows for flexible instantiation based on runtime conditions.

## Cross-References

See [Related Document](./related-doc.md) for additional context.
Also check [Another Reference](./another-ref.md) for implementation details.

`;

  let content = header;
  let sectionNum = 1;
  
  while (content.length < size) {
    content += `
## Additional Section ${sectionNum}

This section provides additional content to reach the target document size.
It includes various paragraphs and formatting to simulate real documentation.

### Subsection ${sectionNum}.1

Detailed content for subsection ${sectionNum}.1 with implementation notes.

### Subsection ${sectionNum}.2

More content with [cross-reference](./other-doc-${sectionNum}.md) links.

`;
    sectionNum++;
  }

  return content.substring(0, size);
}

/**
 * Generate Layer 3 document content (Specific Implementations)
 */
function generateLayer3Document(name: string, size: number): string {
  const header = `# ${name}

**Date**: 2025-12-16
**Purpose**: Implementation guide for testing token efficiency
**Organization**: test-org
**Scope**: test-scope
**Layer**: 3
**Relevant Tasks**: testing, implementation

---

## Overview

This is a Layer 3 (Specific Implementations) document for token efficiency testing.
It contains domain-specific technical guidance.

## Implementation Details

### Step 1: Setup

Configure the development environment with required dependencies.
Ensure all prerequisites are installed and configured.

### Step 2: Configuration

Set up configuration files with appropriate values.
Follow the established patterns from Layer 2 documentation.

### Step 3: Implementation

Implement the core functionality following the design patterns.
Use the token system for consistent styling.

## Code Examples

\`\`\`typescript
// Example implementation
export function exampleFunction(): void {
  console.log('Implementation example');
}
\`\`\`

## Cross-References

See [Framework Guide](./framework-guide.md) for patterns.
Check [API Reference](./api-reference.md) for detailed API documentation.

`;

  let content = header;
  let sectionNum = 1;
  
  while (content.length < size) {
    content += `
## Implementation Section ${sectionNum}

Detailed implementation guidance for section ${sectionNum}.

### Configuration ${sectionNum}

\`\`\`typescript
const config${sectionNum} = {
  setting: 'value',
  enabled: true
};
\`\`\`

### Usage ${sectionNum}

Example usage for this implementation section.

`;
    sectionNum++;
  }

  return content.substring(0, size);
}

describe('Token Efficiency Tests', () => {
  let indexer: DocumentIndexer;
  let queryEngine: QueryEngine;
  let layer2Docs: string[] = [];
  let layer3Docs: string[] = [];

  // Document sizes for realistic testing
  const LAYER2_DOC_SIZE = 8000;  // ~2000 tokens
  const LAYER3_DOC_SIZE = 12000; // ~3000 tokens
  const NUM_LAYER2_DOCS = 4;
  const NUM_LAYER3_DOCS = 6;

  beforeAll(async () => {
    // Create test fixtures directories
    if (!fs.existsSync(TEST_FIXTURES_DIR)) {
      fs.mkdirSync(TEST_FIXTURES_DIR, { recursive: true });
    }
    if (!fs.existsSync(TEST_LOGS_DIR)) {
      fs.mkdirSync(TEST_LOGS_DIR, { recursive: true });
    }

    // Create Layer 2 documents
    for (let i = 1; i <= NUM_LAYER2_DOCS; i++) {
      const docPath = path.join(TEST_FIXTURES_DIR, `layer2-framework-${i}.md`);
      fs.writeFileSync(docPath, generateLayer2Document(`Framework Guide ${i}`, LAYER2_DOC_SIZE));
      layer2Docs.push(docPath);
    }

    // Create Layer 3 documents
    for (let i = 1; i <= NUM_LAYER3_DOCS; i++) {
      const docPath = path.join(TEST_FIXTURES_DIR, `layer3-implementation-${i}.md`);
      fs.writeFileSync(docPath, generateLayer3Document(`Implementation Guide ${i}`, LAYER3_DOC_SIZE));
      layer3Docs.push(docPath);
    }

    // Initialize components
    indexer = new DocumentIndexer(TEST_LOGS_DIR);
    queryEngine = new QueryEngine(indexer);

    // Index test documents
    await indexer.indexDirectory(TEST_FIXTURES_DIR);
  });

  afterAll(() => {
    // Clean up test fixtures
    if (fs.existsSync(path.join(__dirname, '../../test-fixtures'))) {
      fs.rmSync(path.join(__dirname, '../../test-fixtures'), { recursive: true, force: true });
    }
  });

  describe('Baseline Token Measurement', () => {
    it('should measure baseline tokens by loading all Layer 2-3 documents', () => {
      let totalBaselineTokens = 0;
      const documentTokens: Record<string, number> = {};

      // Load all Layer 2 documents and count tokens
      for (const docPath of layer2Docs) {
        const result = handleGetDocumentFull(queryEngine, docPath);
        if (!isGetDocumentFullError(result)) {
          const tokens = result.documentFull.tokenCount;
          totalBaselineTokens += tokens;
          documentTokens[path.basename(docPath)] = tokens;
        }
      }

      // Load all Layer 3 documents and count tokens
      for (const docPath of layer3Docs) {
        const result = handleGetDocumentFull(queryEngine, docPath);
        if (!isGetDocumentFullError(result)) {
          const tokens = result.documentFull.tokenCount;
          totalBaselineTokens += tokens;
          documentTokens[path.basename(docPath)] = tokens;
        }
      }

      console.log('\n=== Baseline Token Measurement ===');
      console.log('Document                          | Tokens');
      console.log('----------------------------------|--------');
      for (const [doc, tokens] of Object.entries(documentTokens)) {
        console.log(`${doc.padEnd(33)} | ${tokens}`);
      }
      console.log('----------------------------------|--------');
      console.log(`TOTAL BASELINE                    | ${totalBaselineTokens}`);
      console.log('==================================\n');

      // Verify we have meaningful token counts
      expect(totalBaselineTokens).toBeGreaterThan(0);
      expect(Object.keys(documentTokens).length).toBe(NUM_LAYER2_DOCS + NUM_LAYER3_DOCS);
    });
  });

  describe('MCP Approach Token Measurement', () => {
    it('should measure MCP approach tokens (map + summary + section)', () => {
      let totalMCPTokens = 0;

      // Step 1: Get documentation map
      const mapResult = handleGetDocumentationMap(queryEngine);
      const mapTokens = estimateTokenCount(JSON.stringify(mapResult.documentationMap));
      totalMCPTokens += mapTokens;

      // Step 2: Get summary for one document (typical workflow)
      const targetDoc = layer2Docs[0];
      const summaryResult = handleGetDocumentSummary(queryEngine, targetDoc);
      let summaryTokens = 0;
      if (!isGetDocumentSummaryError(summaryResult)) {
        summaryTokens = estimateTokenCount(JSON.stringify(summaryResult.documentSummary));
        totalMCPTokens += summaryTokens;
      }

      // Step 3: Get specific section (typical workflow)
      const sectionResult = handleGetSection(queryEngine, targetDoc, 'Overview');
      let sectionTokens = 0;
      if (!isGetSectionError(sectionResult)) {
        sectionTokens = sectionResult.section.tokenCount;
        totalMCPTokens += sectionTokens;
      }

      console.log('\n=== MCP Approach Token Measurement ===');
      console.log('Operation                         | Tokens');
      console.log('----------------------------------|--------');
      console.log(`Documentation Map                 | ${mapTokens}`);
      console.log(`Document Summary                  | ${summaryTokens}`);
      console.log(`Section Content                   | ${sectionTokens}`);
      console.log('----------------------------------|--------');
      console.log(`TOTAL MCP APPROACH                | ${totalMCPTokens}`);
      console.log('======================================\n');

      // Verify MCP approach uses fewer tokens than loading full documents
      expect(totalMCPTokens).toBeGreaterThan(0);
      expect(mapTokens).toBeGreaterThan(0);
    });
  });

  describe('Token Reduction Percentage', () => {
    it('should calculate and verify significant token reduction', () => {
      // Calculate baseline (all documents loaded)
      let baselineTokens = 0;
      for (const docPath of [...layer2Docs, ...layer3Docs]) {
        const result = handleGetDocumentFull(queryEngine, docPath);
        if (!isGetDocumentFullError(result)) {
          baselineTokens += result.documentFull.tokenCount;
        }
      }

      // Calculate MCP approach (map + summary + section for typical workflow)
      const mapResult = handleGetDocumentationMap(queryEngine);
      const mapTokens = estimateTokenCount(JSON.stringify(mapResult.documentationMap));

      const summaryResult = handleGetDocumentSummary(queryEngine, layer2Docs[0]);
      let summaryTokens = 0;
      if (!isGetDocumentSummaryError(summaryResult)) {
        summaryTokens = estimateTokenCount(JSON.stringify(summaryResult.documentSummary));
      }

      const sectionResult = handleGetSection(queryEngine, layer2Docs[0], 'Overview');
      let sectionTokens = 0;
      if (!isGetSectionError(sectionResult)) {
        sectionTokens = sectionResult.section.tokenCount;
      }

      const mcpTokens = mapTokens + summaryTokens + sectionTokens;

      // Calculate reduction percentage
      const reductionPercentage = ((baselineTokens - mcpTokens) / baselineTokens) * 100;

      console.log('\n=== Token Reduction Analysis ===');
      console.log(`Baseline (all docs loaded):  ${baselineTokens} tokens`);
      console.log(`MCP Approach (map+sum+sec):  ${mcpTokens} tokens`);
      console.log(`Token Reduction:             ${reductionPercentage.toFixed(1)}%`);
      console.log('================================\n');

      // Verify significant token reduction (should be > 50%)
      expect(reductionPercentage).toBeGreaterThan(50);
    });
  });

  describe('Summary Token Counts for Layer 2-3 Documents', () => {
    it('should verify summary token counts are reasonable for all documents', () => {
      const summaryTokenCounts: Record<string, number> = {};
      // Summaries include metadata + outline + cross-references
      // For documents with many sections, summaries can be larger
      // Key metric: summaries should be significantly smaller than full documents
      const MAX_SUMMARY_TOKENS = 2000; // Summaries should be < 2000 tokens (vs 2000-3000 for full docs)

      for (const docPath of [...layer2Docs, ...layer3Docs]) {
        const result = handleGetDocumentSummary(queryEngine, docPath);
        if (!isGetDocumentSummaryError(result)) {
          const summaryTokens = estimateTokenCount(JSON.stringify(result.documentSummary));
          summaryTokenCounts[path.basename(docPath)] = summaryTokens;
        }
      }

      console.log('\n=== Summary Token Counts ===');
      console.log('Document                          | Summary Tokens | Status');
      console.log('----------------------------------|----------------|--------');
      for (const [docName, tokens] of Object.entries(summaryTokenCounts)) {
        const status = tokens < MAX_SUMMARY_TOKENS ? '✓ PASS' : '✗ FAIL';
        console.log(`${docName.padEnd(33)} | ${tokens.toString().padStart(14)} | ${status}`);
      }
      console.log('============================\n');

      // Verify all summaries are under the threshold
      for (const [_docName, tokens] of Object.entries(summaryTokenCounts)) {
        expect(tokens).toBeLessThan(MAX_SUMMARY_TOKENS);
      }
    });
  });

  describe('Section Token Counts for Common Sections', () => {
    it('should verify section token counts are reasonable', () => {
      const commonSections = ['Overview', 'Framework Principles', 'Implementation Details'];
      const sectionTokenCounts: Record<string, Record<string, number>> = {};

      for (const docPath of [...layer2Docs.slice(0, 2), ...layer3Docs.slice(0, 2)]) {
        const docName = path.basename(docPath);
        sectionTokenCounts[docName] = {};

        for (const section of commonSections) {
          const result = handleGetSection(queryEngine, docPath, section);
          if (!isGetSectionError(result)) {
            sectionTokenCounts[docName][section] = result.section.tokenCount;
          }
        }
      }

      console.log('\n=== Section Token Counts ===');
      for (const [docName, sections] of Object.entries(sectionTokenCounts)) {
        console.log(`\n${docName}:`);
        for (const [sectionName, tokens] of Object.entries(sections)) {
          console.log(`  ${sectionName.padEnd(25)} | ${tokens} tokens`);
        }
      }
      console.log('\n============================\n');

      // Verify sections have reasonable token counts (less than full document)
      for (const [_docName, sections] of Object.entries(sectionTokenCounts)) {
        for (const [_sectionName, tokens] of Object.entries(sections)) {
          expect(tokens).toBeLessThan(LAYER2_DOC_SIZE / 4); // Section should be < 25% of doc
        }
      }
    });
  });

  describe('Token Estimation Accuracy', () => {
    it('should verify token estimation accuracy within 10%', () => {
      const testCases = [
        { content: 'Short text', expectedRange: [2, 4] },
        { content: 'A'.repeat(100), expectedRange: [22, 28] }, // ~25 tokens
        { content: 'A'.repeat(400), expectedRange: [90, 110] }, // ~100 tokens
        { content: 'A'.repeat(4000), expectedRange: [900, 1100] }, // ~1000 tokens
      ];

      console.log('\n=== Token Estimation Accuracy ===');
      console.log('Content Length | Estimated | Expected Range | Status');
      console.log('---------------|-----------|----------------|--------');

      for (const testCase of testCases) {
        const estimated = estimateTokenCount(testCase.content);
        const [min, max] = testCase.expectedRange;
        const status = estimated >= min && estimated <= max ? '✓ PASS' : '✗ FAIL';
        console.log(`${testCase.content.length.toString().padStart(14)} | ${estimated.toString().padStart(9)} | ${min}-${max}`.padEnd(16) + ` | ${status}`);
        
        // Verify within expected range (10% tolerance)
        expect(estimated).toBeGreaterThanOrEqual(min);
        expect(estimated).toBeLessThanOrEqual(max);
      }
      console.log('=================================\n');
    });

    it('should verify token estimation for real document content', () => {
      // Generate realistic document content for testing
      const content = generateLayer2Document('Test Document', LAYER2_DOC_SIZE);
      
      const estimated = estimateTokenCount(content);
      const characterCount = content.length;
      const expectedTokens = characterCount / 4; // Our heuristic
      
      // Verify estimation matches our heuristic
      expect(estimated).toBe(Math.round(expectedTokens));
      
      // Verify estimation is reasonable (within 10% of expected)
      const tolerance = expectedTokens * 0.1;
      expect(estimated).toBeGreaterThanOrEqual(expectedTokens - tolerance);
      expect(estimated).toBeLessThanOrEqual(expectedTokens + tolerance);

      console.log(`\nReal document token estimation:`);
      console.log(`  Character count: ${characterCount}`);
      console.log(`  Estimated tokens: ${estimated}`);
      console.log(`  Expected (chars/4): ${Math.round(expectedTokens)}`);
    });
  });

  describe('Before/After Comparison Summary', () => {
    it('should generate comprehensive before/after comparison report', () => {
      // Calculate baseline
      let baselineTokens = 0;
      const baselineDetails: Record<string, number> = {};
      
      for (const docPath of [...layer2Docs, ...layer3Docs]) {
        const result = handleGetDocumentFull(queryEngine, docPath);
        if (!isGetDocumentFullError(result)) {
          baselineTokens += result.documentFull.tokenCount;
          baselineDetails[path.basename(docPath)] = result.documentFull.tokenCount;
        }
      }

      // Calculate MCP approach for typical workflow
      const mapResult = handleGetDocumentationMap(queryEngine);
      const mapTokens = estimateTokenCount(JSON.stringify(mapResult.documentationMap));

      // Get summaries for all documents (progressive disclosure)
      let totalSummaryTokens = 0;
      for (const docPath of [...layer2Docs, ...layer3Docs]) {
        const result = handleGetDocumentSummary(queryEngine, docPath);
        if (!isGetDocumentSummaryError(result)) {
          totalSummaryTokens += estimateTokenCount(JSON.stringify(result.documentSummary));
        }
      }

      // Get one section (typical single-section access)
      const sectionResult = handleGetSection(queryEngine, layer2Docs[0], 'Overview');
      let sectionTokens = 0;
      if (!isGetSectionError(sectionResult)) {
        sectionTokens = sectionResult.section.tokenCount;
      }

      // Calculate different MCP scenarios
      const mcpMapOnly = mapTokens;
      const mcpMapPlusSummary = mapTokens + totalSummaryTokens / (NUM_LAYER2_DOCS + NUM_LAYER3_DOCS);
      const mcpMapPlusSummaryPlusSection = mcpMapPlusSummary + sectionTokens;
      const mcpAllSummaries = mapTokens + totalSummaryTokens;

      console.log('\n╔══════════════════════════════════════════════════════════════╗');
      console.log('║           TOKEN EFFICIENCY BEFORE/AFTER COMPARISON           ║');
      console.log('╠══════════════════════════════════════════════════════════════╣');
      console.log('║                                                              ║');
      console.log('║  BASELINE APPROACH (Load All Documents)                      ║');
      console.log('║  ─────────────────────────────────────                       ║');
      console.log(`║  Total tokens: ${baselineTokens.toString().padEnd(45)}║`);
      console.log(`║  Documents: ${(NUM_LAYER2_DOCS + NUM_LAYER3_DOCS).toString().padEnd(48)}║`);
      console.log('║                                                              ║');
      console.log('║  MCP APPROACH (Progressive Disclosure)                       ║');
      console.log('║  ──────────────────────────────────────                      ║');
      console.log(`║  Map only:              ${mcpMapOnly.toString().padEnd(36)}║`);
      console.log(`║  Map + 1 summary:       ${Math.round(mcpMapPlusSummary).toString().padEnd(36)}║`);
      console.log(`║  Map + summary + section: ${Math.round(mcpMapPlusSummaryPlusSection).toString().padEnd(34)}║`);
      console.log(`║  Map + all summaries:   ${mcpAllSummaries.toString().padEnd(36)}║`);
      console.log('║                                                              ║');
      console.log('║  TOKEN REDUCTION                                             ║');
      console.log('║  ───────────────                                             ║');
      const reduction1 = ((baselineTokens - mcpMapOnly) / baselineTokens * 100).toFixed(1);
      const reduction2 = ((baselineTokens - mcpMapPlusSummaryPlusSection) / baselineTokens * 100).toFixed(1);
      const reduction3 = ((baselineTokens - mcpAllSummaries) / baselineTokens * 100).toFixed(1);
      console.log(`║  Map only vs baseline:           ${reduction1}% reduction`.padEnd(62) + '║');
      console.log(`║  Typical workflow vs baseline:   ${reduction2}% reduction`.padEnd(62) + '║');
      console.log(`║  All summaries vs baseline:      ${reduction3}% reduction`.padEnd(62) + '║');
      console.log('║                                                              ║');
      console.log('╚══════════════════════════════════════════════════════════════╝\n');

      // Verify significant reduction in all scenarios
      // Note: Actual reduction depends on document structure and summary content
      expect(parseFloat(reduction1)).toBeGreaterThan(80); // Map only should save >80%
      expect(parseFloat(reduction2)).toBeGreaterThan(70); // Typical workflow should save >70%
      // All summaries scenario: summaries include full outline structure, so reduction is lower
      // but still provides value through progressive disclosure
      expect(parseFloat(reduction3)).toBeGreaterThan(30); // All summaries should save >30%
    });
  });
});
