---
inclusion: always
---

# Start Up Tasks

**Date**: 2025-10-20
**Last Reviewed**: 2025-12-15
**Purpose**: Essential checklist for every task (date check, Jest commands, test selection)
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 1
**Relevant Tasks**: all-tasks

1. Check the **CURRENT** date

2. **CRITICAL: Wait for User Authorization Before Starting New Tasks**
   
   **WHEN reporting the completion of a task THEN you MUST:**
   - **STOP and WAIT for user authorization before starting the next task**
   - Do NOT automatically proceed to the next task in the task list
   - Do NOT assume the user wants you to continue
   
   **User Authorization Required:**
   - User must explicitly request the next task
   - User may want to review your work first
   - User may want to provide additional context
   - User may want to change direction
   
   **Example Completion Pattern:**
   ```
   ✅ Task 2.2 Complete: Implemented Icon iOS confirmed actions
   
   Summary:
   - Added token-only sizing approach
   - Added testID support via accessibilityIdentifier
   - Updated preview to use token references
   
   [STOP HERE - WAIT FOR USER TO REQUEST NEXT TASK]
   ```
   
   **NEVER do this:**
   - ❌ "Task 2.2 complete. Now starting Task 2.3..."
   - ❌ Automatically reading files for the next task
   - ❌ Beginning implementation without explicit user request

3. **CRITICAL: This project uses Jest, NOT Vitest**
   
   **WHEN running tests THEN you MUST use Jest commands (NOT Vitest commands)**
   
   ✅ **CORRECT Jest commands:**
   - `npm test` - Run unit/integration tests (fast, ~10 min)
   - `npm run test:all` - Run ALL tests including performance (~28 min)
   - `npm run test:performance` - Run only performance tests (~20 min)
   - `npm test -- <test-file-path>` - Run specific test file
   - `npm run test:watch` - Run tests in watch mode
   - `npm run test:coverage` - Run tests with coverage
   
   ❌ **WRONG - These are Vitest commands that will FAIL:**
   - `npm test -- --run` - Jest doesn't have a `--run` flag
   - `vitest` - This project doesn't use Vitest
   
   **Key difference:** Jest runs tests once by default. Vitest uses `--run` for single execution, but Jest doesn't need or support this flag.

4. **Test Command Selection Guidelines**
   
   **WHEN validating regular task completion THEN:**
   - Use `npm test` (default - excludes performance tests)
   - Fast feedback loop (~10 minutes)
   - Sufficient for most development validation
   
   **WHEN validating parent task completion THEN:**
   - **Default**: Use `npm test` (comprehensive functional validation, ~10 min)
   - **If task modifies release-analysis or release-detection systems**: Use `npm run test:all` (~28 min)
   - **If task is performance-critical**: Use `npm run test:all` (~28 min)
   
   **WHEN task involves performance changes THEN:**
   - Use `npm run test:performance` (performance validation only)
   - Validates performance characteristics (~20 minutes)
   - Use for performance optimization tasks
   
   **Decision tree:**
   ```
   Is this a parent task completion?
   ├─ YES → Does task modify release-analysis or release-detection systems?
   │   ├─ YES → npm run test:all (includes performance regression tests)
   │   └─ NO → npm test (comprehensive functional validation)
   └─ NO → Does task involve performance changes?
       ├─ YES → npm run test:performance
       └─ NO → npm test (default)
   ```
   
   **Key distinction:**
   - `npm test` validates all functionality including release analysis (functional tests only)
   - `npm run test:all` adds 20 minutes of performance regression tests for release analysis
   - Most parent tasks only need functional validation
   
   **Default assumption**: Use `npm test` for parent tasks unless working on release-analysis/release-detection systems.