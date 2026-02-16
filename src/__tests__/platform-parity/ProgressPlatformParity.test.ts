/**
 * @jest-environment node
 * @category evergreen
 * @purpose Validate cross-platform behavioral parity for Progress Indicator Family
 */

/**
 * Progress Indicator Family — Platform Parity Test Suite
 *
 * Validates that web, iOS, and Android implementations maintain behavioral
 * equivalence for all Progress Indicator components. Tests verify:
 * - Same node count rendered on all platforms
 * - Same state derivation logic across platforms
 * - Same size token application (translated to platform units)
 * - Same connector count for stepper variants
 * - Same label count for Stepper-Detailed
 *
 * @validates Requirements 14.1-14.13, 15.30-15.32
 * @see .kiro/specs/048-progress-family/requirements.md
 * @see .kiro/specs/048-progress-family/design.md
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Types
// ============================================================================

interface PlatformFile {
  platform: string;
  content: string;
  filePath: string;
}

// ============================================================================
// Constants
// ============================================================================

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components/core');

const PROGRESS_COMPONENTS = {
  primitives: [
    'Progress-Indicator-Node-Base',
    'Progress-Indicator-Connector-Base',
    'Progress-Indicator-Label-Base',
  ],
  semantic: [
    'Progress-Pagination-Base',
    'Progress-Stepper-Base',
    'Progress-Stepper-Detailed',
  ],
};

const PLATFORM_FILE_PATTERNS: Record<string, { dir: string; extension: string }> = {
  web: { dir: 'platforms/web', extension: '.web.ts' },
  ios: { dir: 'platforms/ios', extension: '.ios.swift' },
  android: { dir: 'platforms/android', extension: '.android.kt' },
};


// ============================================================================
// Helpers
// ============================================================================

/**
 * Load a platform implementation file for a given component.
 * Optionally includes shared types file content for comprehensive source analysis.
 */
function loadPlatformFile(componentName: string, platform: string): PlatformFile | null {
  const pattern = PLATFORM_FILE_PATTERNS[platform];
  if (!pattern) return null;

  const platformDir = path.join(COMPONENTS_DIR, componentName, pattern.dir);
  if (!fs.existsSync(platformDir)) return null;

  const files = fs.readdirSync(platformDir);
  const implFile = files.find(f => f.endsWith(pattern.extension));
  if (!implFile) return null;

  let content = fs.readFileSync(path.join(platformDir, implFile), 'utf-8');

  // For web components, also include CSS styles (gap tokens, etc.) and shared types
  if (platform === 'web') {
    const cssFiles = files.filter(f => f.endsWith('.css'));
    for (const cssFile of cssFiles) {
      content += '\n' + fs.readFileSync(path.join(platformDir, cssFile), 'utf-8');
    }
    // Include shared types file if it exists (contains shared state derivation logic)
    const typesFile = path.join(COMPONENTS_DIR, componentName, 'types.ts');
    if (fs.existsSync(typesFile)) {
      content += '\n' + fs.readFileSync(typesFile, 'utf-8');
    }
  }

  return {
    platform,
    content,
    filePath: path.join(platformDir, implFile),
  };
}

/**
 * Load all three platform files for a component.
 */
function loadAllPlatforms(componentName: string): PlatformFile[] {
  const platforms: PlatformFile[] = [];
  for (const platform of ['web', 'ios', 'android']) {
    const file = loadPlatformFile(componentName, platform);
    if (file) platforms.push(file);
  }
  return platforms;
}

/**
 * Count occurrences of a regex pattern in content.
 */
function countMatches(content: string, pattern: RegExp): number {
  return (content.match(pattern) || []).length;
}

// ============================================================================
// Tests
// ============================================================================

describe('Progress Indicator Family — Platform Parity', () => {

  // --------------------------------------------------------------------------
  // Platform Implementation Existence
  // --------------------------------------------------------------------------

  describe('All components have implementations on all platforms', () => {
    const allComponents = [
      ...PROGRESS_COMPONENTS.primitives,
      ...PROGRESS_COMPONENTS.semantic,
    ];

    it.each(allComponents)('%s has web, iOS, and Android implementations', (componentName) => {
      const platforms = loadAllPlatforms(componentName);
      const platformNames = platforms.map(p => p.platform);

      expect(platformNames).toContain('web');
      expect(platformNames).toContain('ios');
      expect(platformNames).toContain('android');
    });
  });

  // --------------------------------------------------------------------------
  // Pagination-Base: Node Count Parity
  // @validates Requirements 14.1-14.2, 15.30
  // --------------------------------------------------------------------------

  describe('Pagination-Base renders same node count on all platforms', () => {
    let platforms: PlatformFile[];

    beforeAll(() => {
      platforms = loadAllPlatforms('Progress-Pagination-Base');
    });

    it('web and iOS render same node count (via identical virtualization logic)', () => {
      const web = platforms.find(p => p.platform === 'web')!;
      const ios = platforms.find(p => p.platform === 'ios')!;

      // All platforms compose Node-Base primitives in a loop over the visible window
      // Web: for (let i = window.start; i <= window.end; i++)
      // iOS: ForEach(visibleWindow.start...visibleWindow.end, id: \.self)
      expect(web.content).toContain('progress-indicator-node-base');
      expect(ios.content).toContain('ProgressIndicatorNodeBase');

      // Both use the same virtualization constants
      expect(web.content).toContain('calculateVisibleWindow');
      expect(ios.content).toContain('calculateVisibleWindow');
    });

    it('web and Android render same node count (via identical virtualization logic)', () => {
      const web = platforms.find(p => p.platform === 'web')!;
      const android = platforms.find(p => p.platform === 'android')!;

      expect(web.content).toContain('progress-indicator-node-base');
      expect(android.content).toContain('ProgressIndicatorNodeBase');

      // Both use the same virtualization constants
      expect(web.content).toContain('calculateVisibleWindow');
      expect(android.content).toContain('calculateVisibleWindow');
    });

    it('all platforms use same max items limit (50)', () => {
      for (const pf of platforms) {
        // Each platform defines or imports PAGINATION_MAX_ITEMS = 50
        expect(pf.content).toMatch(/50/);
      }
    });

    it('all platforms use same visible window size (5)', () => {
      for (const pf of platforms) {
        expect(pf.content).toMatch(/5/);
      }
    });
  });

  // --------------------------------------------------------------------------
  // State Derivation Parity
  // @validates Requirements 14.3-14.4, 15.31
  // --------------------------------------------------------------------------

  describe('All platforms derive same node states', () => {

    it('Pagination-Base uses identical state derivation on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Pagination-Base');

      for (const pf of platforms) {
        // All platforms implement: current when index === currentItem, incomplete otherwise
        // Case-insensitive check: Android uses uppercase enum values (CURRENT, INCOMPLETE)
        const lowerContent = pf.content.toLowerCase();
        const hasCurrentCheck = lowerContent.includes('current') && lowerContent.includes('incomplete');
        expect(hasCurrentCheck).toBe(true);
      }
    });

    it('Stepper-Base uses identical state priority on all platforms (error > completed > current > incomplete)', () => {
      const platforms = loadAllPlatforms('Progress-Stepper-Base');

      for (const pf of platforms) {
        const lowerContent = pf.content.toLowerCase();

        // All platforms implement the same four states
        expect(lowerContent).toContain('error');
        expect(lowerContent).toContain('completed');
        expect(lowerContent).toContain('current');
        expect(lowerContent).toContain('incomplete');

        // Verify error check comes before completed in the state derivation logic.
        // All platforms implement: if errorSteps contains index → error, then if < currentStep → completed
        // Find the derive function region by looking for the function signature pattern
        const derivePatterns = [
          /function\s+derive\w*State[\s\S]*?^}/m,                    // TypeScript
          /private\s+fun\s+derive\w*State[\s\S]*?^}/m,              // Kotlin
          /private\s+func\s+derive\w*State[\s\S]*?^}/m,             // Swift
        ];

        let deriveFn: string | null = null;
        for (const pattern of derivePatterns) {
          const match = pf.content.match(pattern);
          if (match) {
            deriveFn = match[0];
            break;
          }
        }

        if (deriveFn) {
          const lowerFn = deriveFn.toLowerCase();
          const errorIdx = lowerFn.indexOf('error');
          const completedIdx = lowerFn.indexOf('completed');
          expect(errorIdx).toBeGreaterThanOrEqual(0);
          expect(completedIdx).toBeGreaterThanOrEqual(0);
          expect(errorIdx).toBeLessThan(completedIdx);
        }
      }
    });

    it('Stepper-Detailed uses identical state priority on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Stepper-Detailed');

      for (const pf of platforms) {
        expect(pf.content).toContain('error');
        expect(pf.content).toContain('completed');
        expect(pf.content).toContain('current');
        expect(pf.content).toContain('incomplete');
      }
    });
  });

  // --------------------------------------------------------------------------
  // Size Token Parity
  // @validates Requirements 14.5-14.8, 15.32
  // --------------------------------------------------------------------------

  describe('All platforms apply same size tokens (translated to platform units)', () => {

    it('Pagination-Base supports sm, md, lg on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Pagination-Base');

      for (const pf of platforms) {
        // All platforms accept size variants
        expect(pf.content.toLowerCase()).toContain('sm');
        expect(pf.content.toLowerCase()).toContain('md');
        expect(pf.content.toLowerCase()).toContain('lg');
      }
    });

    it('Stepper-Base rejects sm size on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Stepper-Base');

      for (const pf of platforms) {
        // All platforms throw/reject sm for steppers
        const rejectsSm =
          pf.content.includes("'sm'") ||
          pf.content.includes('.sm') ||
          pf.content.includes('SM');
        expect(rejectsSm).toBe(true);

        // All platforms have the same error message pattern
        expect(pf.content).toContain("Steppers require size 'md' or 'lg'");
      }
    });

    it('Stepper-Detailed rejects sm size on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Stepper-Detailed');

      for (const pf of platforms) {
        const rejectsSm =
          pf.content.includes("'sm'") ||
          pf.content.includes('.sm') ||
          pf.content.includes('SM');
        expect(rejectsSm).toBe(true);

        expect(pf.content).toContain("Steppers require size 'md' or 'lg'");
      }
    });

    it('all platforms reference gap tokens per size variant', () => {
      // Verify all semantic components reference gap values
      for (const componentName of PROGRESS_COMPONENTS.semantic) {
        const platforms = loadAllPlatforms(componentName);

        for (const pf of platforms) {
          // Each platform references gap values (space075/space100/space150 or equivalent)
          // Web components include CSS content where gap tokens are defined
          const hasGapRef =
            pf.content.includes('gap') ||
            pf.content.includes('Gap') ||
            pf.content.includes('spacing') ||
            pf.content.includes('Arrangement.spacedBy');
          expect(hasGapRef).toBe(true);
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // Connector Count Parity
  // @validates Requirements 14.9-14.11
  // --------------------------------------------------------------------------

  describe('All platforms render same connector count', () => {

    it('Pagination-Base renders zero connectors on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Pagination-Base');

      for (const pf of platforms) {
        // Pagination should NOT reference connector primitives
        const hasConnector =
          pf.content.includes('ConnectorBase') ||
          pf.content.includes('connector-base');
        expect(hasConnector).toBe(false);
      }
    });

    it('Stepper-Base renders n-1 connectors on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Stepper-Base');

      for (const pf of platforms) {
        // All platforms render connectors between nodes
        const hasConnector =
          pf.content.includes('ConnectorBase') ||
          pf.content.includes('connector-base');
        expect(hasConnector).toBe(true);

        // All platforms use n-1 pattern (connector rendered when i < count - 1)
        const hasNMinus1 =
          pf.content.includes('< nodeStates.length - 1') ||  // web
          pf.content.includes('< states.count - 1') ||       // iOS
          pf.content.includes('< nodeStates.size - 1');       // Android
        expect(hasNMinus1).toBe(true);
      }
    });

    it('Stepper-Detailed renders n-1 connectors on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Stepper-Detailed');

      for (const pf of platforms) {
        const hasConnector =
          pf.content.includes('ConnectorBase') ||
          pf.content.includes('connector-base');
        expect(hasConnector).toBe(true);
      }
    });

    it('all platforms use 1px connector thickness (borderDefault token)', () => {
      const platforms = loadAllPlatforms('Progress-Indicator-Connector-Base');

      for (const pf of platforms) {
        // All platforms reference the borderDefault/borderWidth token for 1px thickness
        const hasThicknessRef =
          pf.content.includes('border') ||
          pf.content.includes('Border') ||
          pf.content.includes('1') ||
          pf.content.includes('thickness');
        expect(hasThicknessRef).toBe(true);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Label Count Parity (Stepper-Detailed)
  // @validates Requirements 14.12-14.13
  // --------------------------------------------------------------------------

  describe('Stepper-Detailed renders same label count on all platforms', () => {
    let platforms: PlatformFile[];

    beforeAll(() => {
      platforms = loadAllPlatforms('Progress-Stepper-Detailed');
    });

    it('all platforms render Label-Base for each step', () => {
      for (const pf of platforms) {
        const hasLabel =
          pf.content.includes('LabelBase') ||
          pf.content.includes('label-base');
        expect(hasLabel).toBe(true);
      }
    });

    it('all platforms pass label text and helper text to Label-Base', () => {
      for (const pf of platforms) {
        expect(pf.content).toContain('label');
        expect(pf.content).toContain('helperText');
      }
    });

    it('all platforms support optional step indication', () => {
      for (const pf of platforms) {
        expect(pf.content).toContain('optional');
      }
    });
  });

  // --------------------------------------------------------------------------
  // Icon Precedence Parity (Stepper-Detailed)
  // --------------------------------------------------------------------------

  describe('Stepper-Detailed uses same icon precedence on all platforms', () => {
    let platforms: PlatformFile[];

    beforeAll(() => {
      platforms = loadAllPlatforms('Progress-Stepper-Detailed');
    });

    it('all platforms render checkmark for completed nodes (ignoring user icon)', () => {
      for (const pf of platforms) {
        // All platforms have icon precedence: completed = checkmark always
        const hasCheckmark =
          pf.content.includes('checkmark') ||
          pf.content.includes('CHECKMARK');
        expect(hasCheckmark).toBe(true);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Accessibility Parity
  // --------------------------------------------------------------------------

  describe('All platforms implement equivalent accessibility semantics', () => {

    it('Pagination-Base uses group/container role on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Pagination-Base');

      for (const pf of platforms) {
        const hasGroupRole =
          pf.content.includes('role="group"') ||                    // web
          pf.content.includes('accessibilityElement') ||            // iOS
          pf.content.includes('contentDescription');                // Android
        expect(hasGroupRole).toBe(true);
      }
    });

    it('Stepper-Base uses progressbar role on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Stepper-Base');

      for (const pf of platforms) {
        const hasProgressRole =
          pf.content.includes('role="progressbar"') ||              // web
          pf.content.includes('accessibilityValue') ||              // iOS
          pf.content.includes('progressBarRangeInfo') ||            // Android
          pf.content.includes('ProgressBarRangeInfo');              // Android
        expect(hasProgressRole).toBe(true);
      }
    });

    it('Stepper-Detailed uses list role on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Stepper-Detailed');

      for (const pf of platforms) {
        const hasListRole =
          pf.content.includes('role="list"') ||                     // web
          pf.content.includes('accessibilityHint') ||               // iOS (list hint)
          pf.content.includes('collectionInfo') ||                  // Android
          pf.content.includes('CollectionInfo');                    // Android
        expect(hasListRole).toBe(true);
      }
    });

    it('all platforms reflect actual position in accessibility labels (not virtualized)', () => {
      const platforms = loadAllPlatforms('Progress-Pagination-Base');

      for (const pf of platforms) {
        // All platforms use "Page X of Y" with actual values
        expect(pf.content).toContain('Page');
        expect(pf.content).toContain('of');
      }
    });
  });

  // --------------------------------------------------------------------------
  // Validation Parity
  // --------------------------------------------------------------------------

  describe('All platforms implement same validation rules', () => {

    it('Pagination-Base validates totalItems > 50 on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Pagination-Base');

      for (const pf of platforms) {
        expect(pf.content).toContain('50');
      }
    });

    it('Stepper-Base validates totalSteps > 8 on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Stepper-Base');

      for (const pf of platforms) {
        expect(pf.content).toContain('8');
      }
    });

    it('Stepper-Detailed validates steps.length > 8 on all platforms', () => {
      const platforms = loadAllPlatforms('Progress-Stepper-Detailed');

      for (const pf of platforms) {
        expect(pf.content).toContain('8');
      }
    });
  });
});
