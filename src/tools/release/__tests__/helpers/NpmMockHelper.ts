/**
 * NpmMockHelper - Utility for mocking npm operations in tests
 *
 * Extracted from src/release/publishing/__tests__/helpers/NpmMockHelper.ts
 */

import { execSync } from 'child_process';

export class NpmMockHelper {
  private mockExecSync: jest.MockedFunction<typeof execSync>;

  constructor(mockExecSync: jest.MockedFunction<typeof execSync>) {
    this.mockExecSync = mockExecSync;
  }

  mockAuthentication(authenticated: boolean, username: string = 'testuser', email: string = 'test@example.com'): void {
    if (authenticated) {
      this.mockExecSync.mockReturnValueOnce(`${username}\n`);
      this.mockExecSync.mockReturnValueOnce(JSON.stringify({ email }) as any);
    } else {
      this.mockExecSync.mockImplementationOnce(() => { throw new Error('Not logged in'); });
    }
  }

  mockPublishSuccess(packageName: string, version: string = '1.0.0', username: string = 'testuser', email: string = 'test@example.com'): void {
    this.mockExecSync.mockReturnValueOnce(`${username}\n`);
    this.mockExecSync.mockReturnValueOnce(JSON.stringify({ email }) as any);
    this.mockExecSync.mockReturnValueOnce('');
    this.mockExecSync.mockReturnValueOnce(`+ ${packageName}@${version}\n` as any);
  }

  mockPackageExists(packageName: string, version: string = '1.0.0', username: string = 'testuser', email: string = 'test@example.com'): void {
    this.mockExecSync.mockReturnValueOnce(`${username}\n`);
    this.mockExecSync.mockReturnValueOnce(JSON.stringify({ email }) as any);
    this.mockExecSync.mockReturnValueOnce(`"${version}"\n` as any);
  }

  mockUnpublish(packageName: string, version: string = '1.0.0'): void {
    this.mockExecSync.mockReturnValueOnce(`"${version}"\n` as any);
    this.mockExecSync.mockReturnValueOnce('');
  }

  mockAuthenticationFailure(): void {
    this.mockExecSync.mockImplementationOnce(() => { throw new Error('Not logged in'); });
  }

  mockPublishFailure(errorMessage: string = 'Publish failed', packageName: string = '@test/package', version: string = '1.0.0', username: string = 'testuser', email: string = 'test@example.com'): void {
    this.mockExecSync.mockReturnValueOnce(`${username}\n`);
    this.mockExecSync.mockReturnValueOnce(JSON.stringify({ email }) as any);
    this.mockExecSync.mockReturnValueOnce('');
    this.mockExecSync.mockImplementationOnce(() => { throw new Error(errorMessage); });
  }

  mockPublishWithRetry(packageName: string, version: string = '1.0.0', failureCount: number = 2, username: string = 'testuser', email: string = 'test@example.com'): void {
    for (let i = 0; i < failureCount; i++) {
      this.mockExecSync.mockReturnValueOnce(`${username}\n`);
      this.mockExecSync.mockReturnValueOnce(JSON.stringify({ email }) as any);
      this.mockExecSync.mockReturnValueOnce('');
      this.mockExecSync.mockImplementationOnce(() => { throw new Error('Temporary network error'); });
    }
    this.mockExecSync.mockReturnValueOnce(`${username}\n`);
    this.mockExecSync.mockReturnValueOnce(JSON.stringify({ email }) as any);
    this.mockExecSync.mockReturnValueOnce('');
    this.mockExecSync.mockReturnValueOnce(`+ ${packageName}@${version}\n` as any);
  }

  mockUnpublishFailure(errorMessage: string = 'Unpublish failed', packageName: string = '@test/package', version: string = '1.0.0'): void {
    this.mockExecSync.mockReturnValueOnce(`"${version}"\n` as any);
    this.mockExecSync.mockImplementationOnce(() => { throw new Error(errorMessage); });
  }

  cleanup(): void {
    this.mockExecSync.mockClear();
    this.mockExecSync.mockReset();
  }

  getMock(): jest.MockedFunction<typeof execSync> {
    return this.mockExecSync;
  }
}
