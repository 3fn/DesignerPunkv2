/**
 * @category evergreen
 * @purpose Verify release system functionality works correctly
 */
/**
 * NpmMockHelper Unit Tests
 * 
 * Tests the NpmMockHelper utility to ensure it correctly mocks npm command sequences.
 * Validates that each helper method sets up the expected mock sequence.
 * 
 * Mock Strategy:
 * - jest.mock('child_process'): Mock execSync for npm command testing
 * - Tests the helper itself: Validates NpmMockHelper creates correct mock sequences
 * - No shared mocks: Each test creates fresh helper instance
 * 
 * Requirements: 5.5, 8.1
 */

import { execSync } from 'child_process';
import { NpmMockHelper } from './NpmMockHelper';

// Mock child_process
jest.mock('child_process');

describe('NpmMockHelper', () => {
  let mockExecSync: jest.MockedFunction<typeof execSync>;
  let helper: NpmMockHelper;

  beforeEach(() => {
    mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
    mockExecSync.mockClear();
    mockExecSync.mockReset();
    helper = new NpmMockHelper(mockExecSync);
  });

  afterEach(() => {
    helper.cleanup();
  });

  describe('mockAuthentication', () => {
    it('should mock successful authentication', () => {
      helper.mockAuthentication(true, 'testuser', 'test@example.com');

      // Verify whoami mock
      const whoamiResult = mockExecSync('npm whoami');
      expect(whoamiResult).toBe('testuser\n');

      // Verify profile mock
      const profileResult = mockExecSync('npm profile get --json');
      expect(profileResult).toBe(JSON.stringify({ email: 'test@example.com' }));
    });

    it('should mock authentication failure', () => {
      helper.mockAuthentication(false);

      // Verify whoami throws error
      expect(() => mockExecSync('npm whoami')).toThrow('Not logged in');
    });

    it('should use default username and email', () => {
      helper.mockAuthentication(true);

      const whoamiResult = mockExecSync('npm whoami');
      expect(whoamiResult).toBe('testuser\n');

      const profileResult = mockExecSync('npm profile get --json');
      expect(profileResult).toBe(JSON.stringify({ email: 'test@example.com' }));
    });
  });

  describe('mockPublishSuccess', () => {
    it('should mock complete publish workflow', () => {
      helper.mockPublishSuccess('@test/package', '1.0.0', 'myuser', 'myuser@example.com');

      // Verify authentication mocks
      expect(mockExecSync('npm whoami')).toBe('myuser\n'); // whoami
      expect(mockExecSync('npm profile get --json')).toBe(JSON.stringify({ email: 'myuser@example.com' })); // profile

      // Verify version check mock
      expect(mockExecSync('npm view')).toBe(''); // view (doesn't exist)

      // Verify publish mock
      expect(mockExecSync('npm publish')).toBe('+ @test/package@1.0.0\n'); // publish
    });

    it('should use default values', () => {
      helper.mockPublishSuccess('@test/package');

      expect(mockExecSync('npm whoami')).toBe('testuser\n');
      expect(mockExecSync('npm profile get --json')).toBe(JSON.stringify({ email: 'test@example.com' }));
      expect(mockExecSync('npm view')).toBe('');
      expect(mockExecSync('npm publish')).toBe('+ @test/package@1.0.0\n');
    });
  });

  describe('mockPackageExists', () => {
    it('should mock package version exists scenario', () => {
      helper.mockPackageExists('@test/package', '1.0.0', 'testuser', 'test@example.com');

      // Verify authentication mocks
      expect(mockExecSync('npm whoami')).toBe('testuser\n');
      expect(mockExecSync('npm profile get --json')).toBe(JSON.stringify({ email: 'test@example.com' }));

      // Verify version exists
      expect(mockExecSync('npm view')).toBe('"1.0.0"\n');
    });
  });

  describe('mockUnpublish', () => {
    it('should mock successful unpublish', () => {
      helper.mockUnpublish('@test/package', '1.0.0');

      // Verify version check
      expect(mockExecSync('npm view')).toBe('"1.0.0"\n');

      // Verify unpublish
      expect(mockExecSync('npm unpublish')).toBe('');
    });
  });

  describe('mockAuthenticationFailure', () => {
    it('should mock authentication failure', () => {
      helper.mockAuthenticationFailure();

      // Verify whoami throws error
      expect(() => mockExecSync('npm whoami')).toThrow('Not logged in');
    });
  });

  describe('mockPublishFailure', () => {
    it('should mock publish failure with custom error', () => {
      helper.mockPublishFailure('Network error', '@test/package', '1.0.0');

      // Verify authentication passes
      expect(mockExecSync('npm whoami')).toBe('testuser\n');
      expect(mockExecSync('npm profile get --json')).toBe(JSON.stringify({ email: 'test@example.com' }));

      // Verify version check passes
      expect(mockExecSync('npm view')).toBe('');

      // Verify publish fails
      expect(() => mockExecSync('npm publish')).toThrow('Network error');
    });

    it('should use default error message', () => {
      helper.mockPublishFailure();

      mockExecSync('npm whoami'); // whoami
      mockExecSync('npm profile get --json'); // profile
      mockExecSync('npm view'); // view

      expect(() => mockExecSync('npm publish')).toThrow('Publish failed');
    });
  });

  describe('mockPublishWithRetry', () => {
    it('should mock multiple failures then success', () => {
      helper.mockPublishWithRetry('@test/package', '1.0.0', 2);

      // First attempt - fails
      expect(mockExecSync('npm whoami')).toBe('testuser\n'); // whoami
      expect(mockExecSync('npm profile get --json')).toBe(JSON.stringify({ email: 'test@example.com' })); // profile
      expect(mockExecSync('npm view')).toBe(''); // view
      expect(() => mockExecSync('npm publish')).toThrow('Temporary network error'); // publish fails

      // Second attempt - fails
      expect(mockExecSync('npm whoami')).toBe('testuser\n');
      expect(mockExecSync('npm profile get --json')).toBe(JSON.stringify({ email: 'test@example.com' }));
      expect(mockExecSync('npm view')).toBe('');
      expect(() => mockExecSync('npm publish')).toThrow('Temporary network error');

      // Third attempt - succeeds
      expect(mockExecSync('npm whoami')).toBe('testuser\n');
      expect(mockExecSync('npm profile get --json')).toBe(JSON.stringify({ email: 'test@example.com' }));
      expect(mockExecSync('npm view')).toBe('');
      expect(mockExecSync('npm publish')).toBe('+ @test/package@1.0.0\n'); // publish succeeds
    });

    it('should handle single retry', () => {
      helper.mockPublishWithRetry('@test/package', '1.0.0', 1);

      // First attempt - fails
      mockExecSync('npm whoami'); // whoami
      mockExecSync('npm profile get --json'); // profile
      mockExecSync('npm view'); // view
      expect(() => mockExecSync('npm publish')).toThrow('Temporary network error');

      // Second attempt - succeeds
      mockExecSync('npm whoami'); // whoami
      mockExecSync('npm profile get --json'); // profile
      mockExecSync('npm view'); // view
      expect(mockExecSync('npm publish')).toBe('+ @test/package@1.0.0\n');
    });
  });

  describe('mockUnpublishFailure', () => {
    it('should mock unpublish failure with custom error', () => {
      helper.mockUnpublishFailure('Permission denied', '@test/package', '1.0.0');

      // Verify version check passes
      expect(mockExecSync('npm view')).toBe('"1.0.0"\n');

      // Verify unpublish fails
      expect(() => mockExecSync('npm unpublish')).toThrow('Permission denied');
    });

    it('should use default error message', () => {
      helper.mockUnpublishFailure();

      mockExecSync('npm view'); // view

      expect(() => mockExecSync('npm unpublish')).toThrow('Unpublish failed');
    });
  });

  describe('cleanup', () => {
    it('should clear all mocks', () => {
      helper.mockAuthentication(true);
      
      // Execute some mocks
      mockExecSync('npm whoami');
      mockExecSync('npm profile get --json');

      // Verify mocks were called
      expect(mockExecSync).toHaveBeenCalledTimes(2);

      // Cleanup
      helper.cleanup();

      // Verify mocks are cleared
      expect(mockExecSync).toHaveBeenCalledTimes(0);
    });

    it('should reset mock implementations', () => {
      helper.mockAuthenticationFailure();

      // Cleanup
      helper.cleanup();

      // Mock should no longer throw
      mockExecSync.mockReturnValue('success' as any);
      expect(mockExecSync('npm test')).toBe('success');
    });
  });

  describe('getMock', () => {
    it('should return the mock function', () => {
      const mock = helper.getMock();
      expect(mock).toBe(mockExecSync);
    });

    it('should allow direct manipulation', () => {
      const mock = helper.getMock();
      mock.mockReturnValue('custom value' as any);
      
      expect(mockExecSync('npm test')).toBe('custom value');
    });
  });

  describe('integration scenarios', () => {
    it('should support chaining multiple mock setups', () => {
      // Setup authentication
      helper.mockAuthentication(true, 'user1', 'user1@example.com');
      
      // Execute authentication
      expect(mockExecSync('npm whoami')).toBe('user1\n');
      expect(mockExecSync('npm profile get --json')).toBe(JSON.stringify({ email: 'user1@example.com' }));

      // Setup publish
      helper.mockPublishSuccess('@test/package', '1.0.0', 'user1', 'user1@example.com');
      
      // Execute publish
      expect(mockExecSync('npm whoami')).toBe('user1\n');
      expect(mockExecSync('npm profile get --json')).toBe(JSON.stringify({ email: 'user1@example.com' }));
      expect(mockExecSync('npm view')).toBe('');
      expect(mockExecSync('npm publish')).toBe('+ @test/package@1.0.0\n');
    });

    it('should support publish then unpublish workflow', () => {
      // Publish
      helper.mockPublishSuccess('@test/package', '1.0.0');
      mockExecSync('npm whoami'); // whoami
      mockExecSync('npm profile get --json'); // profile
      mockExecSync('npm view'); // view
      mockExecSync('npm publish'); // publish

      // Unpublish
      helper.mockUnpublish('@test/package', '1.0.0');
      expect(mockExecSync('npm view')).toBe('"1.0.0"\n'); // view
      expect(mockExecSync('npm unpublish')).toBe(''); // unpublish
    });
  });
});
