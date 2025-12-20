/**
 * @category evergreen
 * @purpose Verify NewDocumentDetector functionality works correctly
 */
import { NewDocumentDetector } from '../NewDocumentDetector';
import { execSync } from 'child_process';
import * as globModule from 'glob';

// Mock child_process and glob
jest.mock('child_process');
jest.mock('glob');

describe('NewDocumentDetector', () => {
  let detector: NewDocumentDetector;
  let mockExecSync: jest.MockedFunction<typeof execSync>;
  let mockGlob: jest.MockedFunction<typeof globModule.glob>;
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    detector = new NewDocumentDetector();
    mockExecSync = jest.mocked(execSync);
    mockGlob = jest.mocked(globModule.glob);
    
    // Spy on console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('detectNewDocuments', () => {
    it('should detect new documents with valid git history', async () => {
      const sinceCommit = 'abc123';
      const gitOutput = `.kiro/specs/spec-001/completion/task-1-completion.md
.kiro/specs/spec-002/completion/task-2-completion.md
src/some-other-file.ts
.kiro/specs/spec-003/completion/task-3-completion.md`;

      mockExecSync.mockReturnValue(gitOutput);

      const result = await detector.detectNewDocuments(sinceCommit);

      expect(mockExecSync).toHaveBeenCalledWith(
        `git diff --name-only --diff-filter=A ${sinceCommit} HEAD`,
        { encoding: 'utf-8' }
      );
      expect(result).toEqual([
        '.kiro/specs/spec-001/completion/task-1-completion.md',
        '.kiro/specs/spec-002/completion/task-2-completion.md',
        '.kiro/specs/spec-003/completion/task-3-completion.md'
      ]);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Found 3 new completion documents since ${sinceCommit}`
      );
    });

    it('should filter out non-completion documents', async () => {
      const sinceCommit = 'abc123';
      const gitOutput = `.kiro/specs/spec-001/completion/task-1-completion.md
.kiro/specs/spec-001/requirements.md
.kiro/specs/spec-001/design.md
src/components/Button.tsx
.kiro/specs/spec-002/completion/task-2-completion.md`;

      mockExecSync.mockReturnValue(gitOutput);

      const result = await detector.detectNewDocuments(sinceCommit);

      expect(result).toEqual([
        '.kiro/specs/spec-001/completion/task-1-completion.md',
        '.kiro/specs/spec-002/completion/task-2-completion.md'
      ]);
    });

    it('should fall back to full scan when sinceCommit is null', async () => {
      const allDocs = [
        '.kiro/specs/spec-001/completion/task-1-completion.md',
        '.kiro/specs/spec-002/completion/task-2-completion.md'
      ];
      
      // Mock glob to call callback with results
      mockGlob.mockImplementation(((pattern: string, optionsOrCallback: any, callback?: any) => {
        const cb = typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
        cb(null, allDocs);
      }) as any);

      const result = await detector.detectNewDocuments(null);

      expect(mockExecSync).not.toHaveBeenCalled();
      expect(mockGlob).toHaveBeenCalled();
      expect(result).toEqual(allDocs);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'No previous analysis found, performing full scan'
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Full scan found ${allDocs.length} total completion documents`
      );
    });

    it('should fall back to full scan when git command fails', async () => {
      const sinceCommit = 'abc123';
      const allDocs = [
        '.kiro/specs/spec-001/completion/task-1-completion.md',
        '.kiro/specs/spec-002/completion/task-2-completion.md'
      ];
      
      mockExecSync.mockImplementation(() => {
        throw new Error('Git command failed');
      });
      
      // Mock glob to call callback with results
      mockGlob.mockImplementation(((pattern: string, optionsOrCallback: any, callback?: any) => {
        const cb = typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
        cb(null, allDocs);
      }) as any);

      const result = await detector.detectNewDocuments(sinceCommit);

      expect(mockGlob).toHaveBeenCalled();
      expect(result).toEqual(allDocs);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Git command failed, falling back to full scan:',
        expect.any(Error)
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Full scan found ${allDocs.length} total completion documents`
      );
    });

    it('should handle empty git output', async () => {
      const sinceCommit = 'abc123';
      mockExecSync.mockReturnValue('');

      const result = await detector.detectNewDocuments(sinceCommit);

      expect(result).toEqual([]);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Found 0 new completion documents since ${sinceCommit}`
      );
    });

    it('should handle git output with only non-completion files', async () => {
      const sinceCommit = 'abc123';
      const gitOutput = `src/components/Button.tsx
README.md
package.json`;

      mockExecSync.mockReturnValue(gitOutput);

      const result = await detector.detectNewDocuments(sinceCommit);

      expect(result).toEqual([]);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Found 0 new completion documents since ${sinceCommit}`
      );
    });
  });

  describe('getCurrentCommit', () => {
    it('should get current commit hash', async () => {
      const commitHash = 'abc123def456';
      mockExecSync.mockReturnValue(`${commitHash}\n`);

      const result = await detector.getCurrentCommit();

      expect(mockExecSync).toHaveBeenCalledWith('git rev-parse HEAD', {
        encoding: 'utf-8'
      });
      expect(result).toBe(commitHash);
    });

    it('should return "unknown" when git command fails', async () => {
      mockExecSync.mockImplementation(() => {
        throw new Error('Git command failed');
      });

      const result = await detector.getCurrentCommit();

      expect(result).toBe('unknown');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to get current commit hash:',
        expect.any(Error)
      );
    });

    it('should trim whitespace from commit hash', async () => {
      const commitHash = 'abc123def456';
      mockExecSync.mockReturnValue(`  ${commitHash}  \n`);

      const result = await detector.getCurrentCommit();

      expect(result).toBe(commitHash);
    });
  });
});
