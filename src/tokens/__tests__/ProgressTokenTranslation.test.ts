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
    it('should include sm current size token with raw value 16', () => {
      expect(webContent).toContain('--progress-node-size-sm-current');
      expect(webContent).toMatch(/--progress-node-size-sm-current:\s*16/);
    });

    it('should include md current size token with raw value 20', () => {
      expect(webContent).toContain('--progress-node-size-md-current');
      expect(webContent).toMatch(/--progress-node-size-md-current:\s*20/);
    });

    it('should include lg current size token with raw value 28', () => {
      expect(webContent).toContain('--progress-node-size-lg-current');
      expect(webContent).toMatch(/--progress-node-size-lg-current:\s*28/);
    });

    it('should reference spacing primitives for base size tokens', () => {
      expect(webContent).toContain('--progress-node-size-sm');
      expect(webContent).toContain('var(--space-150)');
      expect(webContent).toContain('--progress-node-size-md');
      expect(webContent).toContain('var(--space-200)');
      expect(webContent).toContain('--progress-node-size-lg');
      expect(webContent).toContain('var(--space-300)');
    });
  });

  // ==========================================================================
  // iOS Swift Output (Requirement 6.2, 15.6)
  // ==========================================================================

  describe('iOS Swift output includes progress current size tokens', () => {
    it('should include sm current size token with value 16', () => {
      expect(iosContent).toContain('nodeSizeSmCurrent');
      expect(iosContent).toMatch(/nodeSizeSmCurrent.*16/);
    });

    it('should include md current size token with value 20', () => {
      expect(iosContent).toContain('nodeSizeMdCurrent');
      expect(iosContent).toMatch(/nodeSizeMdCurrent.*20/);
    });

    it('should include lg current size token with value 28', () => {
      expect(iosContent).toContain('nodeSizeLgCurrent');
      expect(iosContent).toMatch(/nodeSizeLgCurrent.*28/);
    });

    it('should use CGFloat type for spacing tokens', () => {
      expect(iosContent).toMatch(/nodeSizeSmCurrent:\s*CGFloat/);
    });

    it('should reference SpacingTokens for base size tokens', () => {
      expect(iosContent).toContain('SpacingTokens.space150');
      expect(iosContent).toContain('SpacingTokens.space200');
      expect(iosContent).toContain('SpacingTokens.space300');
    });
  });

  // ==========================================================================
  // Android Kotlin Output (Requirement 6.3, 15.7)
  // ==========================================================================

  describe('Android Kotlin output includes progress current size tokens', () => {
    it('should include sm current size token with value 16', () => {
      expect(androidContent).toContain('nodeSizeSmCurrent');
      expect(androidContent).toMatch(/nodeSizeSmCurrent\s*=\s*16/);
    });

    it('should include md current size token with value 20', () => {
      expect(androidContent).toContain('nodeSizeMdCurrent');
      expect(androidContent).toMatch(/nodeSizeMdCurrent\s*=\s*20/);
    });

    it('should include lg current size token with value 28', () => {
      expect(androidContent).toContain('nodeSizeLgCurrent');
      expect(androidContent).toMatch(/nodeSizeLgCurrent\s*=\s*28/);
    });

    it('should reference SpacingTokens for base size tokens', () => {
      expect(androidContent).toContain('SpacingTokens.space150');
      expect(androidContent).toContain('SpacingTokens.space200');
      expect(androidContent).toContain('SpacingTokens.space300');
    });
  });

  // ==========================================================================
  // Cross-Platform Value Consistency (Requirement 6.4-6.5)
  // ==========================================================================

  describe('Cross-platform value consistency', () => {
    it('should produce numerically equivalent current size values across all platforms', () => {
      // All platforms should contain the same numeric values for formula-based tokens
      const currentSizes = [
        { cssName: 'sm-current', camelName: 'nodeSizeSmCurrent', value: 16 },
        { cssName: 'md-current', camelName: 'nodeSizeMdCurrent', value: 20 },
        { cssName: 'lg-current', camelName: 'nodeSizeLgCurrent', value: 28 },
      ];

      for (const { cssName, camelName, value } of currentSizes) {
        expect(webContent).toMatch(new RegExp(`--progress-node-size-${cssName}:\\s*${value}`));
        expect(iosContent).toMatch(new RegExp(`${camelName}.*${value}`));
        expect(androidContent).toMatch(new RegExp(`${camelName}\\s*=\\s*${value}`));
      }
    });

    it('should include Progress tokens in all three platform outputs', () => {
      expect(webContent).toContain('Progress Component Tokens');
      expect(iosContent).toContain('ProgressTokens');
      expect(androidContent).toContain('ProgressTokens');
    });
  });
});
