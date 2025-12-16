# Implementation Plan: MCP Documentation Server

**Date**: 2025-12-16
**Spec**: 021 - MCP Documentation Server
**Status**: Implementation Planning
**Dependencies**: 
- Spec 020 (Steering Documentation Refinement) - Complete

---

## Implementation Plan

This implementation plan follows a bottom-up approach: build parsing foundation → indexing layer → query engine → MCP tools → testing → integration. Each task builds on previous tasks to create a complete, working MCP server.

---

## Task List

- [x] 1. Project Setup and Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Project structure established with TypeScript configuration
  - Core data models defined with complete TypeScript interfaces
  - Development environment ready for implementation
  
  **Primary Artifacts:**
  - `mcp-server/package.json`
  - `mcp-server/tsconfig.json`
  - `mcp-server/src/models/`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/021-mcp-documentation-server/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/021-mcp-documentation-server/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Project Setup and Foundation"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create project structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `mcp-server/` directory
    - Create `src/`, `tests/`, `logs/` subdirectories
    - Create subdirectories: `src/tools/`, `src/indexer/`, `src/query/`, `src/watcher/`, `src/models/`, `src/utils/`
    - _Requirements: 1.1, 12.1_

  - [x] 1.2 Initialize TypeScript project
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `package.json` with dependencies (@modelcontextprotocol/sdk, typescript, jest, fast-check)
    - Create `tsconfig.json` with strict type checking
    - Install dependencies with `npm install`
    - _Requirements: 1.1_

  - [x] 1.3 Define core data models
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/models/DocumentationMap.ts` with DocumentationMap and DocumentMetadata interfaces
    - Create `src/models/DocumentSummary.ts` with DocumentSummary, SectionOutline, CrossReferenceInfo interfaces
    - Create `src/models/DocumentFull.ts` with DocumentFull interface
    - Create `src/models/Section.ts` with Section interface
    - Create `src/models/CrossReference.ts` with CrossReference interface
    - Create `src/models/MetadataValidation.ts` with MetadataValidation and ValidationIssue interfaces
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_

- [x] 2. Mechanical Parsing Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Mechanical parsing extracts structure without interpreting content
  - Metadata, headings, sections, and cross-references parsed correctly
  - No context load loops (parser doesn't follow instructions)
  
  **Primary Artifacts:**
  - `mcp-server/src/indexer/metadata-parser.ts`
  - `mcp-server/src/indexer/heading-parser.ts`
  - `mcp-server/src/indexer/section-parser.ts`
  - `mcp-server/src/indexer/cross-ref-parser.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/021-mcp-documentation-server/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/021-mcp-documentation-server/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Mechanical Parsing Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Implement metadata parser
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/indexer/metadata-parser.ts`
    - Implement `extractMetadata(content: string)` using regex to extract metadata block
    - Parse Date, Purpose, Organization, Scope, Layer, Relevant Tasks fields
    - Return structured metadata object
    - Do NOT interpret content or follow instructions
    - _Requirements: 2.2, 7.1_

  - [x] 2.2 Implement heading structure parser
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/indexer/heading-parser.ts`
    - Implement `extractHeadingStructure(content: string)` using regex for H2/H3 headings
    - Build outline with H2 headings and H3 subsections
    - Return SectionOutline array
    - Do NOT interpret content or follow instructions
    - _Requirements: 2.3, 7.1_

  - [x] 2.3 Implement section boundary parser
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/indexer/section-parser.ts`
    - Implement `extractSection(content: string, targetHeading: string)` using heading boundaries
    - Identify section start by matching target heading
    - Identify section end by next heading at same or higher level
    - Return section content with parent context
    - Do NOT interpret content or follow instructions
    - _Requirements: 4.1, 4.4, 7.1_

  - [x] 2.4 Implement cross-reference parser
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/indexer/cross-ref-parser.ts`
    - Implement `extractCrossReferences(content: string, filePath: string)` using regex for markdown links
    - Extract link text (context) and target path
    - Track source section for each reference
    - Do NOT follow links or load referenced documents
    - _Requirements: 5.1, 5.3, 7.2_

  - [x] 2.5 Implement token count estimator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/utils/token-estimator.ts`
    - Implement `estimateTokenCount(content: string)` using character count / 4 heuristic
    - Return estimated token count
    - _Requirements: 2.4, 8.1, 8.2_

- [x] 3. Document Indexer Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Document indexer builds complete index from markdown files
  - Index includes documentation map, summaries, cross-references, and conditional markers
  - File watching triggers automatic re-indexing
  - Conditional section filtering working with Spec 020 format
  - Index health check and validation working
  
  **Primary Artifacts:**
  - `mcp-server/src/indexer/DocumentIndexer.ts`
  - `mcp-server/src/watcher/FileWatcher.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/021-mcp-documentation-server/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/021-mcp-documentation-server/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Document Indexer Implementation"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Implement DocumentIndexer class
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/indexer/DocumentIndexer.ts`
    - Implement `indexDirectory(directoryPath: string)` to scan and index all markdown files
    - Implement `reindexFile(filePath: string)` to update index for single file
    - Store index in memory (Map structures for fast lookup)
    - Use mechanical parsers from Task 2
    - _Requirements: 1.1, 1.3, 2.1, 10.1_

  - [x] 3.2 Implement documentation map generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `getDocumentationMap()` in DocumentIndexer
    - Group documents by layer (0-3)
    - Include metadata for each document
    - Return DocumentationMap structure
    - _Requirements: 1.1, 1.2, 12.1, 12.2, 12.3_

  - [x] 3.3 Implement document summary generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `getDocumentSummary(path: string)` in DocumentIndexer
    - Extract metadata using metadata parser
    - Extract outline using heading parser
    - Extract cross-references using cross-ref parser
    - Estimate token count for full document
    - Return DocumentSummary structure
    - Verify summary uses < 500 tokens
    - _Requirements: 2.1, 2.2, 2.3, 2.6, 8.1_

  - [x] 3.4 Implement file watcher
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/watcher/FileWatcher.ts`
    - Use Node.js `fs.watch()` to monitor `.kiro/steering/` directory
    - Detect file modifications, additions, deletions
    - Trigger `reindexFile()` on changes
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [x] 3.5 Implement conditional section filtering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/indexer/conditional-filter.ts`
    - Implement `extractConditionalMarkers(content: string)` using regex for Spec 020 format
    - Implement `shouldIncludeSection(section, taskType)` filtering logic
    - Implement `matchesTaskType(criterion, taskType)` keyword matching
    - Store conditional markers in section index
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 3.6 Implement index health check
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/indexer/index-health.ts`
    - Implement `determineIndexHealth()` with status determination
    - Check for missing documents, stale index, malformed metadata
    - Return IndexHealth structure with errors, warnings, metrics
    - _Requirements: 9.1, 9.2, 9.5_

  - [x] 3.7 Implement index validation and recovery
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `validateIndexOnStartup()` in DocumentIndexer
    - Implement `rebuildIndex()` for manual recovery
    - Implement `logIndexStateChange()` for state tracking
    - Write state changes to `logs/index-state.log`
    - _Requirements: 9.1, 9.2, 9.5_

- [x] 4. Query Engine and MCP Tools

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Query engine routes requests to appropriate handlers
  - All 8 MVP MCP tools implemented and working (6 core + 2 health/recovery)
  - Error handling provides clear messages and logging
  - Index health check and recovery tools working
  
  **Primary Artifacts:**
  - `mcp-server/src/query/QueryEngine.ts`
  - `mcp-server/src/tools/` (6 tool files)
  - `mcp-server/src/utils/error-handler.ts`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/021-mcp-documentation-server/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/021-mcp-documentation-server/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Query Engine and MCP Tools"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Implement QueryEngine class
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/query/QueryEngine.ts`
    - Implement request routing to appropriate handlers
    - Implement parameter validation
    - Implement response formatting
    - Integrate with DocumentIndexer
    - _Requirements: 1.1, 11.1, 11.2, 11.3, 11.4_

  - [x] 4.2 Implement error handling utilities
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/utils/error-handler.ts`
    - Implement error formatting for FileNotFound, SectionNotFound, MalformedMetadata, InvalidCrossReference
    - Implement error logging with timestamp, file path, error type, message
    - Write logs to `logs/errors.log`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 4.3 Implement get_documentation_map tool
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tools/get-documentation-map.ts`
    - Register tool with MCP SDK
    - Call `queryEngine.getDocumentationMap()`
    - Return DocumentationMap structure
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 4.4 Implement get_document_summary tool
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tools/get-document-summary.ts`
    - Register tool with MCP SDK
    - Validate path parameter
    - Call `queryEngine.getDocumentSummary(path)`
    - Return DocumentSummary structure
    - Handle FileNotFound errors
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 4.5 Implement get_document_full tool
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tools/get-document-full.ts`
    - Register tool with MCP SDK
    - Validate path parameter
    - Call `queryEngine.getDocumentFull(path)`
    - Return DocumentFull structure
    - Handle FileNotFound errors
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 4.6 Implement get_section tool
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tools/get-section.ts`
    - Register tool with MCP SDK
    - Validate path and heading parameters
    - Call `queryEngine.getSection(path, heading)`
    - Return Section structure
    - Handle SectionNotFound errors with suggestions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 4.7 Implement list_cross_references tool
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tools/list-cross-references.ts`
    - Register tool with MCP SDK
    - Validate path parameter
    - Call `queryEngine.listCrossReferences(path)`
    - Return CrossReference array
    - Handle FileNotFound errors
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 4.8 Implement validate_metadata tool
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tools/validate-metadata.ts`
    - Register tool with MCP SDK
    - Validate path parameter
    - Call `queryEngine.validateMetadata(path)`
    - Check for required fields (Date, Purpose, Organization, Scope, Layer, Relevant Tasks)
    - Return MetadataValidation structure with issues
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 4.9 Implement get_index_health tool
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tools/get-index-health.ts`
    - Register tool with MCP SDK
    - Call `queryEngine.getIndexHealth()`
    - Return IndexHealth structure with status, errors, warnings, metrics
    - _Requirements: 9.1, 9.2, 9.5_

  - [x] 4.10 Implement rebuild_index tool
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tools/rebuild-index.ts`
    - Register tool with MCP SDK
    - Call `queryEngine.rebuildIndex()`
    - Return rebuild status and new index health
    - _Requirements: 9.1, 9.2, 9.5_
    - Check index exists and is not empty
    - Validate each indexed document still exists
    - Check metadata completeness for each document
    - Return IndexHealth structure with issues
    - Implement automatic re-indexing on corruption detection
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 4.11 Implement health status tool
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tools/get-health-status.ts`
    - Register tool with MCP SDK
    - Call `indexer.validateIndexHealth()`
    - Return health status, index metrics, issues, uptime, memory usage
    - _Requirements: 16.5_

- [ ] 5. MCP Server Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - MCP server starts and registers all tools
  - Server responds to MCP protocol requests
  - Integration with Kiro IDE working
  
  **Primary Artifacts:**
  - `mcp-server/src/index.ts`
  - `mcp-server/README.md`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/021-mcp-documentation-server/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/021-mcp-documentation-server/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: MCP Server Integration"`
  - Verify: Check GitHub for committed changes

  - [ ] 5.1 Implement MCP server entry point
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/index.ts`
    - Initialize MCP server using @modelcontextprotocol/sdk
    - Initialize DocumentIndexer with `.kiro/steering/` directory
    - Initialize QueryEngine with DocumentIndexer
    - Register all 6 MCP tools
    - Start file watcher
    - Handle server lifecycle (startup, shutdown)
    - _Requirements: 1.1, 10.5, 15.1_

  - [ ] 5.2 Create server documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `mcp-server/README.md`
    - Document server purpose and architecture
    - Document all 6 MCP tools with examples
    - Document installation and setup
    - Document configuration options
    - _Requirements: 15.2, 15.3_

  - [ ] 5.3 Test MCP server integration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Start MCP server locally
    - Test each MCP tool with sample queries
    - Verify responses match expected format
    - Verify error handling works correctly
    - Verify file watching triggers re-indexing
    - _Requirements: 1.5, 10.1, 10.4, 11.1, 11.2, 11.3, 11.4_

- [ ] 6. Testing and Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All unit tests passing
  - All integration tests passing
  - Property-based tests validate parsing safety
  - Performance benchmarks establish baseline metrics
  - Before/after testing demonstrates token reduction
  - End-to-end AI agent workflow tests passing
  
  **Primary Artifacts:**
  - `mcp-server/tests/unit/`
  - `mcp-server/tests/integration/`
  - `mcp-server/tests/property/`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/021-mcp-documentation-server/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/021-mcp-documentation-server/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Testing and Validation"`
  - Verify: Check GitHub for committed changes

  - [ ] 6.1 Write unit tests for mechanical parsing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `tests/unit/metadata-parser.test.ts` - test metadata extraction without content interpretation
    - Create `tests/unit/heading-parser.test.ts` - test heading structure extraction
    - Create `tests/unit/section-parser.test.ts` - test section boundary identification
    - Create `tests/unit/cross-ref-parser.test.ts` - test cross-reference extraction without following
    - Verify parsers use regex/parsing, not AI interpretation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 6.2 Write integration tests for MCP tools
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `tests/integration/mcp-tools.test.ts`
    - Test all 6 MCP tools with valid inputs
    - Test error responses for invalid inputs
    - Test response format compliance with MCP protocol
    - Verify query performance < 500ms
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ] 6.3 Write property-based tests for parsing safety
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `tests/property/parsing-properties.test.ts`
    - Use fast-check to generate random markdown structures
    - Test Property 1: Metadata extraction doesn't interpret content
    - Test Property 2: Section boundaries correctly identified for any heading structure
    - Test Property 3: Cross-references listed without following
    - Test Property 4: Summary token count < 500 tokens for any document
    - Test Property 5: Section token count < 3,000 tokens for any section
    - _Requirements: 7.1, 7.2, 7.3, 8.1, 8.2_

  - [ ] 6.4 Write performance benchmarking tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `tests/integration/performance.test.ts`
    - Measure response time for all MCP tools
    - Log performance metrics (response time, parsing time, token estimation time)
    - Test with various document sizes
    - Measure re-indexing time for single file changes
    - Establish performance baseline for future optimization
    - _Requirements: 1.4, 2.7, 3.3, 4.5, 5.4, 10.5, 11.5_

  - [ ] 6.5 Validate token efficiency with before/after testing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Measure baseline: Load all Layer 2-3 documents, count tokens
    - Measure MCP approach: Query map + summary + section, count tokens
    - Calculate token reduction percentage
    - Test summary token counts for all Layer 2-3 documents
    - Test section token counts for common sections
    - Verify token estimation accuracy within 10%
    - Document before/after comparison in test results
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 6.6 Test conditional section filtering
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `tests/integration/conditional-filtering.test.ts`
    - Test filtering with various task types
    - Verify "Load when" conditions work correctly
    - Verify "Skip when" conditions work correctly
    - Test sections without markers are always included
    - Verify Spec 020 marker format is parsed correctly
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ] 6.7 Test index health and recovery
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `tests/integration/index-health.test.ts`
    - Test index validation on startup
    - Test corruption detection (missing files, invalid metadata)
    - Test automatic re-indexing on corruption
    - Test health check endpoint returns correct status
    - Verify error logging for health issues
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [ ] 6.8 Test end-to-end AI agent workflow
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `tests/integration/ai-agent-workflow.test.ts`
    - Simulate AI agent completing complex task using MCP
    - Test progressive disclosure workflow (map → summary → section)
    - Verify AI agent doesn't exhaust context
    - Test conditional filtering returns only relevant sections
    - Test error handling provides clear guidance
    - Measure total token usage for complete workflow
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [ ] 7. Final Checkpoint

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All tests passing
  - MCP server working end-to-end
  - Documentation complete
  - Ready for deployment
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/021-mcp-documentation-server/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/021-mcp-documentation-server/task-7-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: MCP Documentation Server MVP"`
  - Verify: Check GitHub for committed changes

  - [ ] 7.1 Run full test suite
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` to execute all tests
    - Verify all unit tests passing
    - Verify all integration tests passing
    - Verify all property-based tests passing
    - Verify all performance tests passing
    - Fix any failing tests
    - _Requirements: All requirements_

  - [ ] 7.2 Validate success criteria with empirical testing
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run before/after token usage comparison (baseline vs MCP approach)
    - Verify token reduction is significant (document actual percentage)
    - Review performance metrics logs to identify any bottlenecks
    - Verify conditional filtering returns only relevant sections
    - Test AI agent completing complex task without context exhaustion
    - Document actual performance characteristics (no arbitrary targets)
    - _Requirements: All requirements_

  - [ ] 7.3 Update meta-guide with MCP usage
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add section to `.kiro/steering/00-Steering Documentation Directional Priorities.md`
    - Document how to use MCP server for documentation queries
    - Provide query examples for common scenarios
    - Explain progressive disclosure workflow (map → summary → section)
    - _Requirements: 15.4_

---

**Organization**: spec-validation
**Scope**: 021-mcp-documentation-server
