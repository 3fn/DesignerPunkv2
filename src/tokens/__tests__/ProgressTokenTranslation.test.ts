/**
 * @category evergreen
 * @purpose Verify Progress Indicator tokens translate correctly to web/iOS/Android
 */
/**
 * Progress Token Cross-Platform Translation Tests
 *
 * Validates that progress indicator component tokens generate correct
 * platform-specific output for web (CSS custom properties), iOS (Swift constants),
 * and Android (Kotlin constants).
 *
 * Uses the real TokenFileGenerator pipeline and ComponentTokenRegistry to verify
 * actual translation output — no mocks.
 *
 * @see .kiro/specs/048-progress-family/requirements.md (Requirements 6.1-6.5, 15.5-15.7)
 * @see .kiro/specs/048-progress-family/design.md (Platform Considerations)
 */

import { TokenFileGenerator } from '../../generators/TokenFileGenerator';
import { ComponentTokenRegistry } from '../../registries/ComponentTokenRegistry';

// Import progress tokens to trigger registration
import '../../tokens/component/progress';

describe('Progress Token Cross-Platform Translation', () => {
  let generator: TokenFileGenerator;
  let webContent: string;
  let iosContent: string;
  let androidContent: string;

  beforeAll(() => {
    generator = new TokenFileGenerator();
    const results = generator.generateComponentTokens();

    const webResult = results.find(r => r.platform === 'web');
    const iosResult = results.find(r => r.platform === 'ios');
    const androidResult = results.find(r => r.platform === 'android');

    webContent = webResult?.content ?? '';
    iosContent = iosResult?.content ?? '';
    androidContent = androidResult?.content ?? '';
  });

  // ==========================================================================
  // Web CSS Output (Requirement 6.1, 15.5)
  // ==========================================================================

  describe('Web CSS output includes progress current size tokens', () => {
    it('should reference space200 for sm current size', () => {
      expect(webContent).toContain('--progress-node-size-sm-current');
      expect(webContent).toMatch(/--progress-node-size-sm-current:\s*var\(--space-200\)/);
    });

    it('should reference space250 for md current size', () => {
      expect(webContent).toContain('--progress-node-size-md-current');
      expect(webContent).toMatch(/--progress-node-size-md-current:\s*var\(--space-250\)/);
    });

    it('should reference space300 for lg current size', () => {
      expect(webContent).toContain('--progress-node-size-lg-current');
      expect(webContent).toMatch(/--progress-node-size-lg-current:\s*var\(--space-300\)/);
    });

    it('should reference spacing primitives for base size tokens', () => {
      expect(webContent).toContain('--progress-node-size-sm');
      expect(webContent).toContain('var(--space-150)');
      expect(webContent).toContain('--progress-node-size-md');
      expect(webContent).toContain('var(--space-200)');
      expect(webContent).toContain('--progress-node-size-lg');
      expect(webContent).toContain('var(--space-250)');
    });
  });

  // ==========================================================================
  // iOS Swift Output (Requirement 6.2, 15.6)
  // ==========================================================================

  describe('iOS Swift output includes progress current size tokens', () => {
    it('should reference space200 for sm current size', () => {
      expect(iosContent).toContain('nodeSizeSmCurrent');
      expect(iosContent).toMatch(/nodeSizeSmCurrent.*SpacingTokens\.space200/);
    });

    it('should reference space250 for md current size', () => {
      expect(iosContent).toContain('nodeSizeMdCurrent');
      expect(iosContent).toMatch(/nodeSizeMdCurrent.*SpacingTokens\.space250/);
    });

    it('should reference space300 for lg current size', () => {
      expect(iosContent).toContain('nodeSizeLgCurrent');
      expect(iosContent).toMatch(/nodeSizeLgCurrent.*SpacingTokens\.space300/);
    });

    it('should use CGFloat type for spacing tokens', () => {
      expect(iosContent).toMatch(/nodeSizeSmCurrent:\s*CGFloat/);
    });

    it('should reference SpacingTokens for base size tokens', () => {
      expect(iosContent).toContain('SpacingTokens.space150');
      expect(iosContent).toContain('SpacingTokens.space200');
      expect(iosContent).toContain('SpacingTokens.space250');
    });
  });

  // ==========================================================================
  // Android Kotlin Output (Requirement 6.3, 15.7)
  // ==========================================================================

  describe('Android Kotlin output includes progress current size tokens', () => {
    it('should reference space200 for sm current size', () => {
      expect(androidContent).toContain('nodeSizeSmCurrent');
      expect(androidContent).toMatch(/nodeSizeSmCurrent\s*=\s*SpacingTokens\.space200/);
    });

    it('should reference space250 for md current size', () => {
      expect(androidContent).toContain('nodeSizeMdCurrent');
      expect(androidContent).toMatch(/nodeSizeMdCurrent\s*=\s*SpacingTokens\.space250/);
    });

    it('should reference space300 for lg current size', () => {
      expect(androidContent).toContain('nodeSizeLgCurrent');
      expect(androidContent).toMatch(/nodeSizeLgCurrent\s*=\s*SpacingTokens\.space300/);
    });

    it('should reference SpacingTokens for base size tokens', () => {
      expect(androidContent).toContain('SpacingTokens.space150');
      expect(androidContent).toContain('SpacingTokens.space200');
      expect(androidContent).toContain('SpacingTokens.space250');
    });
  });

  // ==========================================================================
  // Cross-Platform Value Consistency (Requirement 6.4-6.5)
  // ==========================================================================

  describe('Cross-platform value consistency', () => {
    it('should reference same spacing primitives for current sizes across all platforms', () => {
      const currentSizes = [
        { cssRef: 'space-200', swiftRef: 'SpacingTokens.space200', kotlinRef: 'SpacingTokens.space200', cssName: 'sm-current', camelName: 'nodeSizeSmCurrent' },
        { cssRef: 'space-250', swiftRef: 'SpacingTokens.space250', kotlinRef: 'SpacingTokens.space250', cssName: 'md-current', camelName: 'nodeSizeMdCurrent' },
        { cssRef: 'space-300', swiftRef: 'SpacingTokens.space300', kotlinRef: 'SpacingTokens.space300', cssName: 'lg-current', camelName: 'nodeSizeLgCurrent' },
      ];

      for (const { cssRef, swiftRef, kotlinRef, cssName, camelName } of currentSizes) {
        expect(webContent).toMatch(new RegExp(`--progress-node-size-${cssName}:\\s*var\\(--${cssRef}\\)`));
        expect(iosContent).toMatch(new RegExp(`${camelName}.*${swiftRef.replace('.', '\\.')}`));
        expect(androidContent).toMatch(new RegExp(`${camelName}\\s*=\\s*${kotlinRef.replace('.', '\\.')}`));
      }
    });

    it('should include Progress tokens in all three platform outputs', () => {
      expect(webContent).toContain('Progress Component Tokens');
      expect(iosContent).toContain('ProgressTokens');
      expect(androidContent).toContain('ProgressTokens');
    });
  });
});
