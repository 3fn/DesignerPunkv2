# Structure Map: Development Workflow

**Date**: 2025-12-15
**Purpose**: Extracted heading structure from Development Workflow.md

## Development Workflow.md

- # Development Workflow and Task Completion Practices
- ## AI Agent Reading Priorities
- ## Task Completion Workflow
- ## Spec Planning
- ## Hook System Usage
- # Standard task completion commit
- # For different specs or custom task files
- ## Agent Hook Dependency Chains (Conditional Loading)
- # Check both logs to verify successful execution chain
- # Compare timestamps to confirm execution order
- # No entries after the prerequisite failure time
- # Run the dependent hook manually
- # Verify it executed
- # No entries - dependent hook was not triggered due to timeout
- # Run the dependent hook manually
- # Verify it executed
- # Likely no entry if cancellation is treated as failure
- # Option 1: Re-trigger the entire workflow
- # Mark task complete again to re-trigger hooks
- # This time, approve the prerequisite hook confirmation
- # Option 2: Run dependent hook manually
- # Verify it executed
- # Check if hooks triggered after task completion
- # View recent activity
- # Look for errors or warnings
- # Option 1: Run organization script directly
- # Option 2: Manual organization
- # 1. Add Organization metadata to file header
- # 2. Move file to appropriate directory
- # 3. Update cross-references manually
- # 4. Commit changes
- # Option 1: Run release manager script
- # Option 2: Use manual release detection hook in IDE
- # 1. Open Agent Hooks panel
- # 2. Find "Manual Release Detection"
- # 3. Click "Run" button
- # 4. Confirm execution
- # Create a test file with organization metadata
- # Run organization script directly
- # Verify file moved correctly
- # Clean up test file
- # Create a test summary document
- # Run release detection manually
- # Check if trigger files created
- # Clean up test files
- # Validate JSON syntax
- # Check hook script permissions
- # Verify dependencies are available
- # Validate JSON syntax (should return nothing if valid)
- # Check for common configuration issues
- ## Quality Standards
- ## Workflow Improvements
- ## Troubleshooting (Conditional Loading)
- # Check file organization hook log
- # Check release detection hook log
- # Compare timestamps in both log files
- # Check file organization hook config
- # Check release detection hook config
- # Validate JSON syntax (should return nothing if valid)
- # File organization requires IDE event - no manual trigger available
- # Workaround: Use organize-by-metadata.sh directly
- # Manual trigger for release detection
- # Check results
- # Verify summary document exists
- # Check if summary document was created
- # Should see: task-1-summary.md, task-2-summary.md, etc.
- # WRONG - This won't trigger hooks (.kiro/ directory is filtered)
- # CORRECT - This triggers hooks
- # If you created it in the wrong location
- # Correct format (triggers hook)
- # Wrong format (doesn't trigger hook)
- # Check hook configuration
- # Verify hook is enabled
- # Trigger release detection manually
- # Verify it ran
- # Detailed doc exists (internal documentation)
- # Summary doc needed (triggers hook)
- # Check if hooks were triggered
- # View recent log entries
- # Validate hook configurations
- # Check hook script permissions
- # Manual trigger commands
- # Check for trigger files
- # Verify dependencies
- ## Integration with Strategic Framework
- ## Kiro Agent Hook Integration (Conditional Loading)
- # Run organization script directly (scans root only by default)
- # For subdirectory files, move to root first, then run script
- # ❌ WRONG - This won't trigger hooks (.kiro/ directory is filtered)
- # ✅ CORRECT - This triggers hooks (docs/ directory is watched)

**Total H2 sections**: 10

**Has 'AI Agent Reading Priorities' section**: Yes

---

