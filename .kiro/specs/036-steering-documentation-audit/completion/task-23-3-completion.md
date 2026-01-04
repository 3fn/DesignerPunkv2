# Task 23.3 Completion: Move Troubleshooting Section

**Date**: 2026-01-04
**Task**: 23.3 Move Troubleshooting section (~4,000 tokens)
**Status**: Complete
**Spec**: 036 - Steering Documentation Audit

## Summary

Moved the entire "Troubleshooting (Conditional Loading)" section from `Process-Development-Workflow.md` to `Process-Hook-Operations.md`, replacing it with priming + MCP query directions.

## Changes Made

### 1. Removed from Process-Development-Workflow.md

The following content was removed (~460 lines, ~4,000 tokens):
- **Troubleshooting (Conditional Loading)** section header and conditional loading metadata
- **Common Issues** subsection
- **Error Recovery** subsection
- **Hook Troubleshooting** section with all subsections:
  - Verifying Hook Execution (Steps 1-3)
  - Manual Trigger Commands
  - Common Issues and Solutions (Issues 1-5)
  - Best Practices for Hook Reliability (6 practices)
  - Release Detection Not Triggering (4 checks + fallback options)
  - Quick Reference: Diagnostic Commands

### 2. Added Priming + MCP Query Directions

Replaced the removed content with:
- Brief priming paragraph explaining what troubleshooting guidance is available
- MCP query examples for accessing detailed content
- Quick reference sections for most common issues and error recovery (retained for immediate access)

### 3. Updated AI Agent Reading Priorities

Updated the following sections to reflect new content location:
- **WHEN Debugging Hook Issues**: Updated to reference MCP queries for detailed troubleshooting
- **WHEN Setting Up or Modifying Hooks**: Updated to reference MCP queries for troubleshooting and hook integration

## Content Already in Process-Hook-Operations.md

The Troubleshooting content was already added to Process-Hook-Operations.md in Task 23.2, including:
- Verifying Hook Execution
- Manual Trigger Commands
- Common Issues and Solutions (Issues 1-5)
- Release Detection Not Triggering
- Quick Reference: Diagnostic Commands

## Token Savings

- **Before**: Process-Development-Workflow.md was ~924 lines
- **After**: Process-Development-Workflow.md is ~464 lines
- **Reduction**: ~460 lines (~50% reduction)
- **Estimated token savings**: ~4,000 tokens

## Validation

- ✅ Troubleshooting section removed from Process-Development-Workflow.md
- ✅ Priming + MCP query directions added in place
- ✅ AI Agent Reading Priorities updated with correct MCP query paths
- ✅ Content already exists in Process-Hook-Operations.md (from Task 23.2)
- ✅ Quick reference for common issues retained for immediate access

## Requirements Addressed

- **Requirement 3.3**: Harmful redundancy addressed - detailed troubleshooting content consolidated in Process-Hook-Operations.md
- **Requirement 3.4**: Priming + MCP query directions added for moved content
