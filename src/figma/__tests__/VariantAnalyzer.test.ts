/**
 * VariantAnalyzer — Unit Tests
 *
 * Tests for context-aware variant analysis:
 * - queryFamilyPattern (Component-Family doc query)
 * - queryExistingComponents (Component-Readiness-Status query)
 * - analyzeBehavioralDifferences (behavioral vs styling classification)
 * - generateRecommendations (with and without family pattern)
 * - detectConflicts (family vs behavioral disagreement)
 * - analyzeVariants (full orchestration)
 *
 * All DesignerPunk MCP responses are mocked.
 *
 * @requirements Req 4
 * @spec 054b-figma-design-extract
 */

import {
  VariantAnalyzer,
} from '../VariantAnalyzer';
import type {
  MCPDocClient,
  FigmaVariant,
  FigmaComponent,
  FamilyPattern,
  ComponentStatus,
  ExtractionContext,
} from '../VariantAnalyzer';

// ---------------------------------------------------------------------------
// Mock MCP client factory
// ---------------------------------------------------------------------------

function createMockMCP(overrides: Partial<MCPDocClient> = {}): MCPDocClient {
  return {
    getDocumentFull: jest.fn().mockResolvedValue(null),
    getSection: jest.fn().mockResolvedValue(null),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Sample Component-Family doc content
// ---------------------------------------------------------------------------

const BUTTON_FAMILY_DOC = [
  '# Component-Family: Button',
  '',
  '## Inheritance Structure',
  '',
  'The Button family uses a primitive + semantic inheritance pattern.',
  'ButtonBase provides the shared primitive foundation. Semantic variants',
  '(ButtonCTA, ButtonSecondary) extend ButtonBase with specific behavioral',
  'contracts and token overrides.',
  '',
  '## Behavioral Contracts',
  '',
  '#### onPress',
  'Fires when the button is activated.',
  '',
  '#### onFocus',
  'Fires when the button receives focus.',
  '',
  '#### onDisabled',
  'Disables interaction and applies disabled styling.',
  '',
  '## Token Dependencies',
  '',
  '| Category | Token |',
  '|----------|-------|',
  '| Spacing | `space.inset.normal` |',
  '| Color | `color.action.primary` |',
  '| Typography | `typography.label.medium` |',
].join('\n');

const COMPONENT_STATUS_TABLE = `## Individual Component Status

| Component | Family | Status | Implementation Path |
|-----------|--------|--------|---------------------|
| ButtonBase | Buttons | 🟢 Production Ready | \`src/components/ButtonBase\` |
| ButtonCTA | Buttons | 🟢 Production Ready | \`src/components/ButtonCTA\` |
| InputTextBase | Inputs | 🟡 Beta | \`src/components/InputTextBase\` |
| BadgeBase | Badges | 🔴 Planned | \`src/components/BadgeBase\` |
| OldWidget | Widgets | ⚠️ Deprecated | \`src/components/OldWidget\` |
`;

// ---------------------------------------------------------------------------
// Variant fixtures
// ---------------------------------------------------------------------------

/** Variants that differ only in visual properties (same keys, different values). */
const STYLING_VARIANTS: FigmaVariant[] = [
  {
    name: 'Primary',
    properties: { color: 'purple', size: 'medium' },
    hasInteraction: true,
    visualProperties: ['color', 'size'],
  },
  {
    name: 'Secondary',
    properties: { color: 'gray', size: 'medium' },
    hasInteraction: true,
    visualProperties: ['color', 'size'],
  },
  {
    name: 'Tertiary',
    properties: { color: 'transparent', size: 'medium' },
    hasInteraction: true,
    visualProperties: ['color', 'size'],
  },
];

/** Variants with different interaction patterns (some interactive, some not). */
const BEHAVIORAL_VARIANTS: FigmaVariant[] = [
  {
    name: 'Default',
    properties: { color: 'purple', size: 'medium' },
    hasInteraction: true,
  },
  {
    name: 'Disabled',
    properties: { color: 'gray', size: 'medium' },
    hasInteraction: false,
  },
];

/** Variants with structurally different property sets. */
const STRUCTURAL_VARIANTS: FigmaVariant[] = [
  {
    name: 'IconButton',
    properties: { icon: 'arrow', size: 'medium' },
    hasInteraction: true,
  },
  {
    name: 'TextButton',
    properties: { label: 'Click', size: 'medium', color: 'purple' },
    hasInteraction: true,
  },
];

// ---------------------------------------------------------------------------
// queryFamilyPattern
// ---------------------------------------------------------------------------

describe('VariantAnalyzer', () => {
  describe('queryFamilyPattern', () => {
    it('returns parsed pattern when Component-Family doc exists', async () => {
      const mcp = createMockMCP({
        getDocumentFull: jest.fn().mockResolvedValue(BUTTON_FAMILY_DOC),
      });
      const analyzer = new VariantAnalyzer(mcp);

      const result = await analyzer.queryFamilyPattern('Button');

      expect(result).not.toBeNull();
      expect(result!.familyName).toBe('Button');
      expect(result!.inheritancePattern).toContain('primitive');
      expect(result!.behavioralContracts).toContain('onPress');
      expect(result!.behavioralContracts).toContain('onFocus');
      expect(result!.behavioralContracts).toContain('onDisabled');
      expect(result!.tokenUsagePatterns).toContain('space.inset.normal');
      expect(result!.tokenUsagePatterns).toContain('color.action.primary');
      expect(result!.rawContent).toBe(BUTTON_FAMILY_DOC);

      // Verify correct doc path was queried
      expect(mcp.getDocumentFull).toHaveBeenCalledWith(
        '.kiro/steering/Component-Family-Button.md',
      );
    });

    it('returns null when Component-Family doc does not exist', async () => {
      const mcp = createMockMCP({
        getDocumentFull: jest.fn().mockResolvedValue(null),
      });
      const analyzer = new VariantAnalyzer(mcp);

      const result = await analyzer.queryFamilyPattern('NonExistent');

      expect(result).toBeNull();
      expect(mcp.getDocumentFull).toHaveBeenCalledWith(
        '.kiro/steering/Component-Family-NonExistent.md',
      );
    });
  });

  // -------------------------------------------------------------------------
  // queryExistingComponents
  // -------------------------------------------------------------------------

  describe('queryExistingComponents', () => {
    it('returns matching components from status table', async () => {
      const mcp = createMockMCP({
        getSection: jest.fn().mockResolvedValue(COMPONENT_STATUS_TABLE),
      });
      const analyzer = new VariantAnalyzer(mcp);

      const results = await analyzer.queryExistingComponents('Buttons');

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({
        name: 'ButtonBase',
        status: 'implemented',
        path: 'src/components/ButtonBase',
      });
      expect(results[1]).toEqual({
        name: 'ButtonCTA',
        status: 'implemented',
        path: 'src/components/ButtonCTA',
      });

      expect(mcp.getSection).toHaveBeenCalledWith(
        '.kiro/steering/Component-Readiness-Status.md',
        'Individual Component Status',
      );
    });

    it('returns empty array when no components match family', async () => {
      const mcp = createMockMCP({
        getSection: jest.fn().mockResolvedValue(COMPONENT_STATUS_TABLE),
      });
      const analyzer = new VariantAnalyzer(mcp);

      const results = await analyzer.queryExistingComponents('Cards');

      expect(results).toEqual([]);
    });

    it('returns empty array when section is unavailable', async () => {
      const mcp = createMockMCP({
        getSection: jest.fn().mockResolvedValue(null),
      });
      const analyzer = new VariantAnalyzer(mcp);

      const results = await analyzer.queryExistingComponents('Buttons');

      expect(results).toEqual([]);
    });

    it('parses different status types correctly', async () => {
      const mcp = createMockMCP({
        getSection: jest.fn().mockResolvedValue(COMPONENT_STATUS_TABLE),
      });
      const analyzer = new VariantAnalyzer(mcp);

      // Beta → implemented
      const inputs = await analyzer.queryExistingComponents('Inputs');
      expect(inputs).toHaveLength(1);
      expect(inputs[0].status).toBe('implemented');

      // Planned
      const badges = await analyzer.queryExistingComponents('Badges');
      expect(badges).toHaveLength(1);
      expect(badges[0].status).toBe('planned');

      // Deprecated
      const widgets = await analyzer.queryExistingComponents('Widgets');
      expect(widgets).toHaveLength(1);
      expect(widgets[0].status).toBe('deprecated');
    });

    it('matches family name case-insensitively', async () => {
      const mcp = createMockMCP({
        getSection: jest.fn().mockResolvedValue(COMPONENT_STATUS_TABLE),
      });
      const analyzer = new VariantAnalyzer(mcp);

      const results = await analyzer.queryExistingComponents('buttons');

      expect(results).toHaveLength(2);
    });
  });

  // -------------------------------------------------------------------------
  // analyzeBehavioralDifferences
  // -------------------------------------------------------------------------

  describe('analyzeBehavioralDifferences', () => {
    it('returns "styling" for variants with only visual differences', () => {
      const analyzer = new VariantAnalyzer(createMockMCP());

      const result = analyzer.analyzeBehavioralDifferences(STYLING_VARIANTS);

      expect(result).toBe('styling');
    });

    it('returns "behavioral" when interaction patterns differ', () => {
      const analyzer = new VariantAnalyzer(createMockMCP());

      const result = analyzer.analyzeBehavioralDifferences(BEHAVIORAL_VARIANTS);

      expect(result).toBe('behavioral');
    });

    it('returns "behavioral" when property keys differ structurally', () => {
      const analyzer = new VariantAnalyzer(createMockMCP());

      const result = analyzer.analyzeBehavioralDifferences(STRUCTURAL_VARIANTS);

      expect(result).toBe('behavioral');
    });

    it('returns "styling" for a single variant', () => {
      const analyzer = new VariantAnalyzer(createMockMCP());

      const result = analyzer.analyzeBehavioralDifferences([STYLING_VARIANTS[0]]);

      expect(result).toBe('styling');
    });

    it('returns "styling" for empty variant array', () => {
      const analyzer = new VariantAnalyzer(createMockMCP());

      const result = analyzer.analyzeBehavioralDifferences([]);

      expect(result).toBe('styling');
    });
  });

  // -------------------------------------------------------------------------
  // generateRecommendations
  // -------------------------------------------------------------------------

  describe('generateRecommendations', () => {
    const analyzer = new VariantAnalyzer(createMockMCP());

    it('recommends Option A (single component) for styling-only without family pattern', () => {
      const recs = analyzer.generateRecommendations(null, 'styling', []);

      expect(recs).toHaveLength(2);

      const optA = recs.find((r) => r.option === 'A')!;
      const optB = recs.find((r) => r.option === 'B')!;

      expect(optA.recommended).toBe(true);
      expect(optB.recommended).toBe(false);
      expect(optA.description).toContain('Single component');
      expect(optB.description).toContain('Primitive');
    });

    it('recommends Option B (split) for behavioral differences without family pattern', () => {
      const recs = analyzer.generateRecommendations(null, 'behavioral', []);

      const optA = recs.find((r) => r.option === 'A')!;
      const optB = recs.find((r) => r.option === 'B')!;

      expect(optA.recommended).toBe(false);
      expect(optB.recommended).toBe(true);
    });

    it('follows family pattern when it favours split (primitive/base/semantic)', () => {
      const familyPattern: FamilyPattern = {
        familyName: 'Button',
        inheritancePattern: 'Uses primitive + semantic inheritance pattern',
        behavioralContracts: ['onPress'],
        tokenUsagePatterns: ['color.action.primary'],
      };

      // Even though behavioral analysis says 'styling', family pattern
      // should override and recommend split.
      const recs = analyzer.generateRecommendations(familyPattern, 'styling', []);

      const optB = recs.find((r) => r.option === 'B')!;
      expect(optB.recommended).toBe(true);
    });

    it('follows family pattern when it favours single component', () => {
      const familyPattern: FamilyPattern = {
        familyName: 'Badge',
        inheritancePattern: 'Single component with variant prop for all badge types',
        behavioralContracts: [],
        tokenUsagePatterns: [],
      };

      const recs = analyzer.generateRecommendations(familyPattern, 'styling', []);

      const optA = recs.find((r) => r.option === 'A')!;
      expect(optA.recommended).toBe(true);
    });

    it('strongly favours split when behavioral + existing primitive base', () => {
      const existingComponents: ComponentStatus[] = [
        { name: 'ButtonBase', status: 'implemented', path: 'src/components/ButtonBase' },
      ];

      // Even with a family pattern that might favour single, behavioral +
      // existing base should override.
      const recs = analyzer.generateRecommendations(null, 'behavioral', existingComponents);

      const optB = recs.find((r) => r.option === 'B')!;
      expect(optB.recommended).toBe(true);
      expect(optB.alignsWith).toEqual(
        expect.arrayContaining([
          expect.stringContaining('ButtonBase'),
        ]),
      );
    });

    it('includes tradeoffs for both options', () => {
      const recs = analyzer.generateRecommendations(null, 'styling', []);

      for (const rec of recs) {
        expect(rec.tradeoffs.length).toBeGreaterThan(0);
      }
    });

    it('includes alignsWith evidence for recommended option', () => {
      const recs = analyzer.generateRecommendations(null, 'styling', []);

      const recommended = recs.find((r) => r.recommended)!;
      expect(recommended.alignsWith.length).toBeGreaterThan(0);
    });
  });

  // -------------------------------------------------------------------------
  // detectConflicts
  // -------------------------------------------------------------------------

  describe('detectConflicts', () => {
    const analyzer = new VariantAnalyzer(createMockMCP());

    it('detects conflict when family says single but behavioral says split', () => {
      const conflicts = analyzer.detectConflicts(
        'single component with variant prop',
        'primitive + semantic structure',
      );

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].familyRecommendation).toBe('single component with variant prop');
      expect(conflicts[0].behavioralRecommendation).toBe('primitive + semantic structure');
      expect(conflicts[0].explanation).toContain('Human review');
    });

    it('detects conflict when family says split but behavioral says single', () => {
      const conflicts = analyzer.detectConflicts(
        'primitive + semantic',
        'single component',
      );

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].explanation).toContain('Human review');
    });

    it('returns empty array when recommendations agree', () => {
      const conflicts = analyzer.detectConflicts(
        'primitive + semantic',
        'primitive + semantic',
      );

      expect(conflicts).toEqual([]);
    });

    it('returns empty array when no family recommendation (empty string)', () => {
      const conflicts = analyzer.detectConflicts('', 'single component');

      expect(conflicts).toEqual([]);
    });

    it('returns empty array when family recommendation is absent', () => {
      const conflicts = analyzer.detectConflicts('', 'primitive + semantic');

      expect(conflicts).toEqual([]);
    });

    it('recognises semantically equivalent recommendations (Option A / single component)', () => {
      const conflicts = analyzer.detectConflicts('Option A', 'single component');

      expect(conflicts).toEqual([]);
    });

    it('recognises semantically equivalent recommendations (Stemma / primitive)', () => {
      const conflicts = analyzer.detectConflicts('stemma pattern', 'primitive + semantic');

      expect(conflicts).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // analyzeVariants (full orchestration)
  // -------------------------------------------------------------------------

  describe('analyzeVariants', () => {
    it('orchestrates full analysis with family pattern and existing components', async () => {
      const mcp = createMockMCP({
        getDocumentFull: jest.fn().mockResolvedValue(BUTTON_FAMILY_DOC),
        getSection: jest.fn().mockResolvedValue(COMPONENT_STATUS_TABLE),
      });
      const analyzer = new VariantAnalyzer(mcp);

      const component: FigmaComponent = {
        name: 'ButtonCTA',
        description: 'Call-to-action button',
        variants: STYLING_VARIANTS,
      };

      // familyPattern undefined triggers MCP query; empty existingComponents
      // triggers MCP query for readiness status
      const context: ExtractionContext = {
        familyPattern: undefined as unknown as FamilyPattern | null,
        existingComponents: [],
      };

      const result = await analyzer.analyzeVariants(component, context);

      expect(result.componentName).toBe('ButtonCTA');
      expect(result.behavioralClassification).toBe('styling');
      expect(result.recommendations).toHaveLength(2);
      expect(result.familyPattern).not.toBeNull();
      expect(result.familyPattern!.familyName).toBe('Button');

      // Verify MCP was queried
      expect(mcp.getDocumentFull).toHaveBeenCalledWith(
        '.kiro/steering/Component-Family-Button.md',
      );
    });

    it('uses provided context instead of querying MCP', async () => {
      const mcp = createMockMCP();
      const analyzer = new VariantAnalyzer(mcp);

      const familyPattern: FamilyPattern = {
        familyName: 'Button',
        inheritancePattern: 'primitive + semantic',
        behavioralContracts: ['onPress'],
        tokenUsagePatterns: ['color.action.primary'],
      };

      const existingComponents: ComponentStatus[] = [
        { name: 'ButtonBase', status: 'implemented', path: 'src/components/ButtonBase' },
      ];

      const context: ExtractionContext = {
        familyPattern,
        existingComponents,
      };

      const component: FigmaComponent = {
        name: 'ButtonCTA',
        variants: BEHAVIORAL_VARIANTS,
      };

      const result = await analyzer.analyzeVariants(component, context);

      // Should NOT have queried MCP since context was provided
      expect(mcp.getDocumentFull).not.toHaveBeenCalled();
      expect(mcp.getSection).not.toHaveBeenCalled();

      expect(result.behavioralClassification).toBe('behavioral');
      expect(result.familyPattern).toBe(familyPattern);
      expect(result.existingComponents).toBe(existingComponents);
    });

    it('detects conflicts when family and behavioral analysis disagree', async () => {
      const mcp = createMockMCP();
      const analyzer = new VariantAnalyzer(mcp);

      // Family says single component, but variants have behavioral differences
      const familyPattern: FamilyPattern = {
        familyName: 'Widget',
        inheritancePattern: 'Single component with variant prop for all widget types',
        behavioralContracts: [],
        tokenUsagePatterns: [],
      };

      const context: ExtractionContext = {
        familyPattern,
        existingComponents: [],
      };

      const component: FigmaComponent = {
        name: 'WidgetBase',
        variants: BEHAVIORAL_VARIANTS,
      };

      const result = await analyzer.analyzeVariants(component, context);

      expect(result.behavioralClassification).toBe('behavioral');
      expect(result.conflicts.length).toBeGreaterThan(0);
      expect(result.conflicts[0].explanation).toContain('Human review');
    });

    it('produces no conflicts when family and behavioral analysis agree', async () => {
      const mcp = createMockMCP();
      const analyzer = new VariantAnalyzer(mcp);

      const familyPattern: FamilyPattern = {
        familyName: 'Button',
        inheritancePattern: 'primitive + semantic inheritance',
        behavioralContracts: ['onPress'],
        tokenUsagePatterns: [],
      };

      const context: ExtractionContext = {
        familyPattern,
        existingComponents: [],
      };

      const component: FigmaComponent = {
        name: 'ButtonCTA',
        variants: BEHAVIORAL_VARIANTS,
      };

      const result = await analyzer.analyzeVariants(component, context);

      // Both family (primitive/semantic) and behavioral analysis agree on split
      expect(result.conflicts).toEqual([]);
    });

    it('derives family name by stripping common suffixes', async () => {
      const mcp = createMockMCP({
        getDocumentFull: jest.fn().mockResolvedValue(null),
      });
      const analyzer = new VariantAnalyzer(mcp);

      const component: FigmaComponent = {
        name: 'ButtonPrimary',
        variants: STYLING_VARIANTS,
      };

      // familyPattern must be undefined (not null) to trigger MCP query
      const context: ExtractionContext = {
        familyPattern: undefined as unknown as FamilyPattern | null,
        existingComponents: [],
      };

      await analyzer.analyzeVariants(component, context);

      // Should query for "Button" (stripped "Primary" suffix)
      expect(mcp.getDocumentFull).toHaveBeenCalledWith(
        '.kiro/steering/Component-Family-Button.md',
      );
    });
  });
});
