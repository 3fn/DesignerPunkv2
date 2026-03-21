/**
 * FamilyGuidanceIndexer Tests
 *
 * Tests parsing, validation, retrieval, and error handling for family guidance.
 */

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { FamilyGuidanceIndexer } from '../FamilyGuidanceIndexer';

describe('FamilyGuidanceIndexer', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'guidance-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  const writeGuidance = (name: string, content: string) => {
    fs.writeFileSync(path.join(tmpDir, `${name}.yaml`), content);
  };

  const validFlat = `
family: Button
displayName: "Buttons"
companion: ".kiro/steering/Component-Family-Button.md"
whenToUse:
  - "Promoted actions"
whenNotToUse:
  - "Read-only status"
selectionRules:
  - scenario: "Primary action"
    recommend: Button-CTA
    props:
      variant: primary
    rationale: "Highest emphasis"
  - scenario: "Icon-only action"
    recommend: Button-Icon
    rationale: "Compact contexts"
accessibilityNotes:
  - "All buttons are keyboard accessible"
patterns:
  - name: "Form Actions"
    description: "Submit + cancel pairing"
    components:
      - component: Button-CTA
        role: submit
        props:
          variant: primary
      - component: Button-CTA
        role: cancel
        props:
          variant: tertiary
    relatedPatterns:
      - simple-form
`;

  const validGrouped = `
family: FormInput
displayName: "Form Inputs"
companion: ".kiro/steering/Component-Family-Form-Inputs.md"
whenToUse:
  - "Data collection"
whenNotToUse:
  - "Read-only display"
selectionRules:
  - scenario: "Mandatory single selection"
    recommend: Input-Radio-Set
    rationale: "Radio for required single-select"
  - group: "Text Inputs"
    rules:
      - scenario: "Email collection"
        recommend: Input-Text-Email
        rationale: "Built-in validation"
      - scenario: "Generic text"
        recommend: Input-Text-Base
        rationale: "No specialized validation"
  - group: "Checkboxes"
    rules:
      - scenario: "Legal consent"
        recommend: Input-Checkbox-Legal
        rationale: "Audit trail"
accessibilityNotes:
  - "Labels via float label pattern"
`;

  describe('indexGuidance', () => {
    it('parses valid flat guidance', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      expect(indexer.getHealth().familiesIndexed).toBe(1);
    });

    it('parses valid grouped guidance', async () => {
      writeGuidance('form-inputs', validGrouped);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      expect(indexer.getHealth().familiesIndexed).toBe(1);
    });

    it('handles missing directory', async () => {
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance('/nonexistent/path');
      expect(indexer.getHealth().familiesIndexed).toBe(0);
    });

    it('warns on malformed YAML', async () => {
      writeGuidance('bad', '{{invalid yaml');
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      expect(indexer.getHealth().warnings.length).toBeGreaterThan(0);
    });

    it('warns on missing required fields', async () => {
      writeGuidance('incomplete', 'family: "Test"\n');
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      expect(indexer.getHealth().familiesIndexed).toBe(0);
      expect(indexer.getHealth().warnings.some(w => w.includes('missing required'))).toBe(true);
    });

    it('indexes multiple files', async () => {
      writeGuidance('button', validFlat);
      writeGuidance('form-inputs', validGrouped);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      expect(indexer.getHealth().familiesIndexed).toBe(2);
    });
  });

  describe('getGuidance', () => {
    it('retrieves by family name', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      const result = indexer.getGuidance('Button');
      expect(result).not.toBeNull();
      expect(result!.family).toBe('Button');
    });

    it('retrieves by component name', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      const result = indexer.getGuidance('Button-CTA');
      expect(result).not.toBeNull();
      expect(result!.family).toBe('Button');
    });

    it('retrieves by component in grouped rules', async () => {
      writeGuidance('form-inputs', validGrouped);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      const result = indexer.getGuidance('Input-Text-Email');
      expect(result).not.toBeNull();
      expect(result!.family).toBe('FormInput');
    });

    it('returns null for unknown component', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      expect(indexer.getGuidance('Unknown-Component')).toBeNull();
    });
  });

  describe('flat rule normalization', () => {
    it('wraps flat rules in ungrouped SelectionRuleGroup', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      const result = indexer.getGuidance('Button')!;
      expect(result.selectionRules.length).toBe(1);
      expect(result.selectionRules[0].group).toBeUndefined();
      expect(result.selectionRules[0].rules.length).toBe(2);
    });
  });

  describe('mixed flat and grouped rules', () => {
    it('separates flat rules from grouped rules', async () => {
      writeGuidance('form-inputs', validGrouped);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      const result = indexer.getGuidance('FormInput')!;
      // 1 ungrouped (flat rule) + 2 groups
      expect(result.selectionRules.length).toBe(3);
      expect(result.selectionRules[0].group).toBeUndefined();
      expect(result.selectionRules[1].group).toBe('Text Inputs');
      expect(result.selectionRules[2].group).toBe('Checkboxes');
    });
  });

  describe('patterns', () => {
    it('parses family-scoped patterns', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      const result = indexer.getGuidance('Button')!;
      expect(result.patterns.length).toBe(1);
      expect(result.patterns[0].name).toBe('Form Actions');
      expect(result.patterns[0].components.length).toBe(2);
      expect(result.patterns[0].relatedPatterns).toEqual(['simple-form']);
    });

    it('handles empty patterns', async () => {
      writeGuidance('form-inputs', validGrouped);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      const result = indexer.getGuidance('FormInput')!;
      expect(result.patterns).toEqual([]);
    });
  });

  describe('props parsing', () => {
    it('preserves props on selection rules', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      const result = indexer.getGuidance('Button')!;
      const primaryRule = result.selectionRules[0].rules[0];
      expect(primaryRule.props).toEqual({ variant: 'primary' });
    });

    it('omits props when not specified', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      const result = indexer.getGuidance('Button')!;
      const iconRule = result.selectionRules[0].rules[1];
      expect(iconRule.props).toBeUndefined();
    });
  });

  describe('getAllFamilies', () => {
    it('returns sorted family names', async () => {
      writeGuidance('button', validFlat);
      writeGuidance('form-inputs', validGrouped);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      expect(indexer.getAllFamilies()).toEqual(['Button', 'FormInput']);
    });
  });

  describe('validation', () => {
    it('rejects rules missing scenario', async () => {
      writeGuidance('bad', `
family: "Test"
companion: "test.md"
whenToUse: ["test"]
whenNotToUse: ["test"]
selectionRules:
  - recommend: Something
    rationale: "reason"
`);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      expect(indexer.getHealth().familiesIndexed).toBe(0);
    });

    it('rejects groups missing rules array', async () => {
      writeGuidance('bad', `
family: "Test"
companion: "test.md"
whenToUse: ["test"]
whenNotToUse: ["test"]
selectionRules:
  - group: "Bad Group"
`);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      expect(indexer.getHealth().familiesIndexed).toBe(0);
    });
  });

  describe('cross-reference validation', () => {
    it('warns when recommend references unknown component', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      indexer.validateCrossReferences(new Set(['Other-Component']), new Set(), tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes('Button-CTA') && w.includes('not found'))).toBe(true);
    });

    it('no warnings for recommend and relatedPatterns when all exist', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      indexer.validateCrossReferences(new Set(['Button-CTA', 'Button-Icon']), new Set(['simple-form']), tmpDir);
      // Only companion path warning expected (file doesn't exist in tmpDir)
      const nonCompanionWarnings = indexer.getHealth().warnings.filter(w => !w.includes('companion'));
      expect(nonCompanionWarnings.length).toBe(0);
    });

    it('warns when relatedPattern references unknown pattern', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      indexer.validateCrossReferences(new Set(['Button-CTA', 'Button-Icon']), new Set(), tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes('simple-form') && w.includes('not found'))).toBe(true);
    });

    it('warns when companion path does not exist', async () => {
      writeGuidance('button', validFlat);
      const indexer = new FamilyGuidanceIndexer();
      await indexer.indexGuidance(tmpDir);
      indexer.validateCrossReferences(new Set(['Button-CTA', 'Button-Icon']), new Set(['simple-form']), tmpDir);
      // companion path ".kiro/steering/Component-Family-Button.md" won't exist relative to tmpDir
      expect(indexer.getHealth().warnings.some(w => w.includes('companion path not found'))).toBe(true);
    });
  });
});
