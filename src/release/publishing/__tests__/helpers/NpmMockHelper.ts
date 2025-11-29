/**
 * NpmMockHelper - Utility for mocking npm operations in tests
 * 
 * This helper provides reusable mock configurations for npm commands,
 * ensuring tests correctly mock the exact sequence of npm commands executed
 * by the NpmPublisher implementation.
 * 
 * Each method documents the npm command sequence it mocks, making it easy
 * to understand what's being tested and maintain tests as implementation changes.
 * 
 * Pattern: Follows GitMockHelper pattern for consistent mock management
 * 
 * Requirements: 5.5, 8.1
 */

import { execSync } from 'child_process';

export class NpmMockHelper {
  private mockExecSync: jest.MockedFunction<typeof execSync>;

  /**
   * Create a new NpmMockHelper
   * 
   * @param mockExecSync - Mocked execSync function from jest.mock('child_process')
   */
  constructor(mockExecSync: jest.MockedFunction<typeof execSync>) {
    this.mockExecSync = mockExecSync;
  }

  /**
   * Mock successful npm authentication
   * 
   * npm Command Sequence:
   * 1. npm whoami --registry <registry>     → Get authenticated username
   * 2. npm profile get --json --registry <registry> → Get user profile with email
   * 
   * @param authenticated - Whether user should be authenticated
   * @param username - Username to return (default: 'testuser')
   * @param email - Email to return (default: 'test@example.com')
   * 
   * @example
   * ```typescript
   * const helper = new NpmMockHelper(mockExecSync);
   * helper.mockAuthentication(true, 'myuser', 'myuser@example.com');
   * // Now validateAuthentication() will succeed
   * ```
   */
  mockAuthentication(
    authenticated: boolean,
    username: string = 'testuser',
    email: string = 'test@example.com'
  ): void {
    if (authenticated) {
      // 1. npm whoami - return username
      this.mockExecSync.mockReturnValueOnce(`${username}\n`);
      
      // 2. npm profile get --json - return profile with email
      this.mockExecSync.mockReturnValueOnce(
        JSON.stringify({ email }) as any
      );
    } else {
      // 1. npm whoami - throw error (not authenticated)
      this.mockExecSync.mockImplementationOnce(() => {
        throw new Error('Not logged in');
      });
    }
  }

  /**
   * Mock successful package publish workflow
   * 
   * npm Command Sequence:
   * 1. npm whoami --registry <registry>                    → Validate authentication
   * 2. npm profile get --json --registry <registry>        → Get user profile
   * 3. npm view <package>@<version> version --json --registry <registry> → Check if version exists
   * 4. npm publish <path> --access <access> --registry <registry> → Publish package
   * 
   * @param packageName - Name of the package being published
   * @param version - Version being published (default: '1.0.0')
   * @param username - Authenticated username (default: 'testuser')
   * @param email - User email (default: 'test@example.com')
   * 
   * @example
   * ```typescript
   * const helper = new NpmMockHelper(mockExecSync);
   * helper.mockPublishSuccess('@test/package', '1.0.0');
   * // Now publishPackage() will succeed
   * ```
   */
  mockPublishSuccess(
    packageName: string,
    version: string = '1.0.0',
    username: string = 'testuser',
    email: string = 'test@example.com'
  ): void {
    // 1. npm whoami - validate authentication
    this.mockExecSync.mockReturnValueOnce(`${username}\n`);
    
    // 2. npm profile get --json - get user profile
    this.mockExecSync.mockReturnValueOnce(
      JSON.stringify({ email }) as any
    );
    
    // 3. npm view - check if version exists (should return empty - doesn't exist)
    this.mockExecSync.mockReturnValueOnce('');
    
    // 4. npm publish - publish package
    this.mockExecSync.mockReturnValueOnce(
      `+ ${packageName}@${version}\n` as any
    );
  }

  /**
   * Mock package version already exists scenario
   * 
   * npm Command Sequence:
   * 1. npm whoami --registry <registry>                    → Validate authentication
   * 2. npm profile get --json --registry <registry>        → Get user profile
   * 3. npm view <package>@<version> version --json --registry <registry> → Version exists
   * 
   * This causes publishPackage() to fail with "already exists" error.
   * 
   * @param packageName - Name of the package
   * @param version - Version that already exists
   * @param username - Authenticated username (default: 'testuser')
   * @param email - User email (default: 'test@example.com')
   * 
   * @example
   * ```typescript
   * const helper = new NpmMockHelper(mockExecSync);
   * helper.mockPackageExists('@test/package', '1.0.0');
   * // Now publishPackage() will fail with "already exists" error
   * ```
   */
  mockPackageExists(
    packageName: string,
    version: string = '1.0.0',
    username: string = 'testuser',
    email: string = 'test@example.com'
  ): void {
    // 1. npm whoami - validate authentication
    this.mockExecSync.mockReturnValueOnce(`${username}\n`);
    
    // 2. npm profile get --json - get user profile
    this.mockExecSync.mockReturnValueOnce(
      JSON.stringify({ email }) as any
    );
    
    // 3. npm view - version exists (return version string)
    this.mockExecSync.mockReturnValueOnce(`"${version}"\n` as any);
  }

  /**
   * Mock successful package unpublish (for rollback)
   * 
   * npm Command Sequence:
   * 1. npm view <package>@<version> version --json --registry <registry> → Check if version exists
   * 2. npm unpublish <package>@<version> --force --registry <registry>   → Unpublish version
   * 
   * @param packageName - Name of the package to unpublish
   * @param version - Version to unpublish
   * 
   * @example
   * ```typescript
   * const helper = new NpmMockHelper(mockExecSync);
   * helper.mockUnpublish('@test/package', '1.0.0');
   * // Now unpublishPackage() will succeed
   * ```
   */
  mockUnpublish(
    packageName: string,
    version: string = '1.0.0'
  ): void {
    // 1. npm view - check if version exists (return version string)
    this.mockExecSync.mockReturnValueOnce(`"${version}"\n` as any);
    
    // 2. npm unpublish - unpublish the version
    this.mockExecSync.mockReturnValueOnce('');
  }

  /**
   * Mock authentication failure
   * 
   * npm Command Sequence:
   * 1. npm whoami --registry <registry> → Throw error (not authenticated)
   * 
   * @example
   * ```typescript
   * const helper = new NpmMockHelper(mockExecSync);
   * helper.mockAuthenticationFailure();
   * // Now validateAuthentication() will return authenticated: false
   * ```
   */
  mockAuthenticationFailure(): void {
    // npm whoami - throw error (not authenticated)
    this.mockExecSync.mockImplementationOnce(() => {
      throw new Error('Not logged in');
    });
  }

  /**
   * Mock publish failure
   * 
   * This mocks authentication and validation passing but publish command failing.
   * Useful for testing error handling and retry logic.
   * 
   * @param errorMessage - Error message to throw on publish (default: 'Publish failed')
   * @param packageName - Name of the package
   * @param version - Version being published
   * @param username - Authenticated username (default: 'testuser')
   * @param email - User email (default: 'test@example.com')
   * 
   * @example
   * ```typescript
   * const helper = new NpmMockHelper(mockExecSync);
   * helper.mockPublishFailure('Network error', '@test/package', '1.0.0');
   * // Now publishPackage() will fail with "Network error"
   * ```
   */
  mockPublishFailure(
    errorMessage: string = 'Publish failed',
    packageName: string = '@test/package',
    version: string = '1.0.0',
    username: string = 'testuser',
    email: string = 'test@example.com'
  ): void {
    // 1. npm whoami - validate authentication (passes)
    this.mockExecSync.mockReturnValueOnce(`${username}\n`);
    
    // 2. npm profile get --json - get user profile (passes)
    this.mockExecSync.mockReturnValueOnce(
      JSON.stringify({ email }) as any
    );
    
    // 3. npm view - check if version exists (passes - doesn't exist)
    this.mockExecSync.mockReturnValueOnce('');
    
    // 4. npm publish - fails
    this.mockExecSync.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
  }

  /**
   * Mock publish with retry (for testing retry logic)
   * 
   * This mocks the first N attempts failing and the final attempt succeeding.
   * 
   * @param packageName - Name of the package
   * @param version - Version being published
   * @param failureCount - Number of times to fail before succeeding (default: 2)
   * @param username - Authenticated username (default: 'testuser')
   * @param email - User email (default: 'test@example.com')
   * 
   * @example
   * ```typescript
   * const helper = new NpmMockHelper(mockExecSync);
   * helper.mockPublishWithRetry('@test/package', '1.0.0', 2);
   * // First 2 publish attempts fail, 3rd succeeds
   * ```
   */
  mockPublishWithRetry(
    packageName: string,
    version: string = '1.0.0',
    failureCount: number = 2,
    username: string = 'testuser',
    email: string = 'test@example.com'
  ): void {
    // For each retry attempt
    for (let i = 0; i < failureCount; i++) {
      // Authentication and validation for this attempt
      this.mockExecSync.mockReturnValueOnce(`${username}\n`); // whoami
      this.mockExecSync.mockReturnValueOnce(JSON.stringify({ email }) as any); // profile
      this.mockExecSync.mockReturnValueOnce(''); // view (doesn't exist)
      
      // Publish fails
      this.mockExecSync.mockImplementationOnce(() => {
        throw new Error('Temporary network error');
      });
    }
    
    // Final successful attempt
    this.mockExecSync.mockReturnValueOnce(`${username}\n`); // whoami
    this.mockExecSync.mockReturnValueOnce(JSON.stringify({ email }) as any); // profile
    this.mockExecSync.mockReturnValueOnce(''); // view (doesn't exist)
    this.mockExecSync.mockReturnValueOnce(`+ ${packageName}@${version}\n` as any); // publish succeeds
  }

  /**
   * Mock unpublish failure
   * 
   * This mocks version check passing but unpublish command failing.
   * 
   * @param errorMessage - Error message to throw on unpublish (default: 'Unpublish failed')
   * @param packageName - Name of the package
   * @param version - Version to unpublish
   * 
   * @example
   * ```typescript
   * const helper = new NpmMockHelper(mockExecSync);
   * helper.mockUnpublishFailure('Permission denied', '@test/package', '1.0.0');
   * // Now unpublishPackage() will fail with "Permission denied"
   * ```
   */
  mockUnpublishFailure(
    errorMessage: string = 'Unpublish failed',
    packageName: string = '@test/package',
    version: string = '1.0.0'
  ): void {
    // 1. npm view - check if version exists (passes)
    this.mockExecSync.mockReturnValueOnce(`"${version}"\n` as any);
    
    // 2. npm unpublish - fails
    this.mockExecSync.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });
  }

  /**
   * Clear all mock configurations
   * 
   * This resets both the call history AND all mock implementations,
   * ensuring a completely clean slate for the next test.
   * 
   * @example
   * ```typescript
   * afterEach(() => {
   *   helper.cleanup();
   * });
   * ```
   */
  cleanup(): void {
    this.mockExecSync.mockClear();
    this.mockExecSync.mockReset();
  }

  /**
   * Get the mock function for direct manipulation if needed
   * 
   * @returns The mocked execSync function
   */
  getMock(): jest.MockedFunction<typeof execSync> {
    return this.mockExecSync;
  }
}
