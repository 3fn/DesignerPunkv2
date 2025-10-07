1. Check today's actual date

2. **CRITICAL: This project uses Jest, NOT Vitest**
   
   **WHEN running tests THEN you MUST use Jest commands (NOT Vitest commands)**
   
   ✅ **CORRECT Jest commands:**
   - `npm test` - Run all tests
   - `npm test -- <test-file-path>` - Run specific test file
   - `npm run test:watch` - Run tests in watch mode
   - `npm run test:coverage` - Run tests with coverage
   
   ❌ **WRONG - These are Vitest commands that will FAIL:**
   - `npm test -- --run` - Jest doesn't have a `--run` flag
   - `vitest` - This project doesn't use Vitest
   
   **Key difference:** Jest runs tests once by default. Vitest uses `--run` for single execution, but Jest doesn't need or support this flag.