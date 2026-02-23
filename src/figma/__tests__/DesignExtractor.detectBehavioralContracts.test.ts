/**
 * Tests for DesignExtractor.detectBehavioralContracts() — Task 3.8
 *
 * Validates behavioral contract detection: interactive vs static classification,
 * visual state extraction, missing contract flagging, and auto-contract generation.
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 6 (Behavioral Contract Detection)
 */

import { DesignExtractor } from '../DesignExtractor';
import type { ExtractedComponent } from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator } from '../TokenTranslator';
import type { VariantAnalyzer } from '../VariantAnalyzer';

// ---------------------------------------------------------------------------
// Mock factories
// ---------------------------------------------------------------------------

function makeMockConsoleMcp(): jest.Mocked<ConsoleMCPClient> {
  return {
    batchCreateVariables: jest.fn().mockResolvedValue(undefined),
    batchUpdateVariables: jest.fn().mockResolvedValue(undefined),
    createVariableAliases: jest.fn().mockResolvedValue(undefined),
    getVariables: jest.fn().mockResolvedValue([]),
    execute: jest.fn().mockResolvedValue(undefined),
    setupDesignTokens: jest.fn().mockResolvedValue(undefined),
    getStatus: jest.fn().mockResolvedValue({}),
    getStyles: jest.fn().mockResolvedValue([]),
    getComponent: jest.fn().mockResolvedValue({}),
    getComponentImage: jest.fn().mockResolvedValue({ imageUrl: '' }),
  };
}

const stubTranslator = {} as TokenTranslator;
const stubAnalyzer = {} as VariantAnalyzer;

function makeComponent(overrides: Partial<ExtractedComponent> = {}): ExtractedComponent {
  return {
    name: 'TestComponent',
    description: '',
    variants: [],
    states: [],
    properties: [],
    layout: { mode: 'none' },
    source: 'kiro-power',
    ...overrides,
  };
}


// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.detectBehavioralContracts', () => {
  let extractor: DesignExtractor;

  beforeEach(() => {
    extractor = new DesignExtractor(makeMockConsoleMcp(), stubTranslator, stubAnalyzer);
  });

  // -------------------------------------------------------------------------
  // Interactive component classification
  // -------------------------------------------------------------------------

  describe('interactive component classification', () => {
    it.each([
      'ButtonCTA',
      'InputTextBase',
      'ToggleSwitch',
      'CheckboxField',
      'RadioGroup',
      'SelectDropdown',
      'SliderControl',
      'TabNavigation',
      'LinkText',
      'MenuPopover',
      'DialogModal',
      'TooltipHover',
      'AccordionPanel',
    ])('classifies "%s" as interactive', (name) => {
      const component = makeComponent({ name });
      const result = extractor.detectBehavioralContracts(component);
      expect(result.classification).toBe('interactive');
    });

    it('flags missing behavioral contracts for interactive components', () => {
      const component = makeComponent({ name: 'ButtonPrimary' });
      const result = extractor.detectBehavioralContracts(component);

      expect(result.contractsDefined).toBe(false);
      expect(result.confidence).toBe('❌');
      expect(result.autoContract).toBeUndefined();
    });

    it('classifies unknown components as interactive (safer default)', () => {
      const component = makeComponent({ name: 'FancyWidget' });
      const result = extractor.detectBehavioralContracts(component);

      expect(result.classification).toBe('interactive');
      expect(result.contractsDefined).toBe(false);
      expect(result.confidence).toBe('❌');
    });
  });

  // -------------------------------------------------------------------------
  // Static component classification
  // -------------------------------------------------------------------------

  describe('static component classification', () => {
    it.each([
      'BadgeStatus',
      'DividerHorizontal',
      'IconBase',
      'AvatarCircle',
      'LabelField',
      'TagCategory',
      'SeparatorLine',
      'ImageHero',
      'LogoBrand',
      'ProgressBar',
    ])('classifies "%s" as static', (name) => {
      const component = makeComponent({ name });
      const result = extractor.detectBehavioralContracts(component);
      expect(result.classification).toBe('static');
    });

    it('auto-generates "no interaction" contract for static components', () => {
      const component = makeComponent({ name: 'BadgeNotification' });
      const result = extractor.detectBehavioralContracts(component);

      expect(result.contractsDefined).toBe(true);
      expect(result.autoContract).toBe('No interaction — static display component');
      expect(result.confidence).toBe('✅');
    });
  });

  // -------------------------------------------------------------------------
  // Visual state extraction
  // -------------------------------------------------------------------------

  describe('visual state extraction', () => {
    it('extracts known visual states from component', () => {
      const component = makeComponent({
        name: 'ButtonCTA',
        states: [
          { name: 'hover' },
          { name: 'focus' },
          { name: 'disabled' },
          { name: 'pressed' },
        ],
      });
      const result = extractor.detectBehavioralContracts(component);

      expect(result.detectedStates).toEqual(['hover', 'focus', 'disabled', 'pressed']);
    });

    it('filters out unknown states', () => {
      const component = makeComponent({
        name: 'ButtonCTA',
        states: [
          { name: 'hover' },
          { name: 'custom-animation' },
          { name: 'focus' },
          { name: 'sparkle-effect' },
        ],
      });
      const result = extractor.detectBehavioralContracts(component);

      expect(result.detectedStates).toEqual(['hover', 'focus']);
    });

    it('handles case-insensitive state names', () => {
      const component = makeComponent({
        name: 'InputField',
        states: [
          { name: 'Hover' },
          { name: 'FOCUS' },
          { name: 'Disabled' },
        ],
      });
      const result = extractor.detectBehavioralContracts(component);

      expect(result.detectedStates).toEqual(['hover', 'focus', 'disabled']);
    });

    it('returns empty states when component has none', () => {
      const component = makeComponent({ name: 'DividerLine', states: [] });
      const result = extractor.detectBehavioralContracts(component);

      expect(result.detectedStates).toEqual([]);
    });

    it('includes additional known states: active, selected, error, loading', () => {
      const component = makeComponent({
        name: 'TabItem',
        states: [
          { name: 'active' },
          { name: 'selected' },
          { name: 'error' },
          { name: 'loading' },
        ],
      });
      const result = extractor.detectBehavioralContracts(component);

      expect(result.detectedStates).toEqual(['active', 'selected', 'error', 'loading']);
    });
  });

  // -------------------------------------------------------------------------
  // Case insensitive component name matching
  // -------------------------------------------------------------------------

  describe('case-insensitive name matching', () => {
    it('matches interactive keywords regardless of case', () => {
      const component = makeComponent({ name: 'BUTTON_PRIMARY' });
      const result = extractor.detectBehavioralContracts(component);
      expect(result.classification).toBe('interactive');
    });

    it('matches static keywords regardless of case', () => {
      const component = makeComponent({ name: 'BADGE_STATUS' });
      const result = extractor.detectBehavioralContracts(component);
      expect(result.classification).toBe('static');
    });
  });

  // -------------------------------------------------------------------------
  // Interactive takes precedence over static
  // -------------------------------------------------------------------------

  describe('precedence', () => {
    it('interactive keyword takes precedence when both match', () => {
      // Hypothetical name containing both "button" and "badge"
      const component = makeComponent({ name: 'ButtonBadgeCombo' });
      const result = extractor.detectBehavioralContracts(component);

      // "button" is interactive, should win
      expect(result.classification).toBe('interactive');
    });
  });

  // -------------------------------------------------------------------------
  // Static components with states still get auto-contract
  // -------------------------------------------------------------------------

  describe('static components with detected states', () => {
    it('still auto-generates contract even if states are present', () => {
      const component = makeComponent({
        name: 'ProgressBar',
        states: [{ name: 'loading' }],
      });
      const result = extractor.detectBehavioralContracts(component);

      expect(result.classification).toBe('static');
      expect(result.contractsDefined).toBe(true);
      expect(result.autoContract).toBe('No interaction — static display component');
      expect(result.detectedStates).toEqual(['loading']);
    });
  });
});
