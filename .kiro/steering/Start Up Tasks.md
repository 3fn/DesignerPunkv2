---
inclusion: always
---
1. Check today's actual date

2. **CRITICAL: This project uses Jest, NOT Vitest**
   
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

3. **Test Command Selection Guidelines**
   
   **WHEN validating regular task completion THEN:**
   - Use `npm test` (default - excludes performance tests)
   - Fast feedback loop (~10 minutes)
   - Sufficient for most development validation
   
   **WHEN validating parent task completion THEN:**
   - Use `npm run test:all` (comprehensive validation)
   - Includes performance tests (~28 minutes)
   - Required for Tier 3 comprehensive validation
   
   **WHEN task involves performance changes THEN:**
   - Use `npm run test:performance` (performance validation only)
   - Validates performance characteristics (~20 minutes)
   - Use for performance optimization tasks
   
   **Decision tree:**
   ```
   Is this a parent task completion?
   ├─ YES → npm run test:all (comprehensive)
   └─ NO → Does task involve performance changes?
       ├─ YES → npm run test:performance
       └─ NO → npm test (default)
   ```
   
   **Default assumption**: Use `npm test` unless task explicitly requires comprehensive or performance validation.