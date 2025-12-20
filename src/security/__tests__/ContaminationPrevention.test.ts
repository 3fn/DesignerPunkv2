/**
 * @category evergreen
 * @purpose Verify contamination prevention system blocks unsafe operations
 */
/**
 * Contamination Prevention Tests
 * 
 * Tests for contamination vector detection and prevention
 */

import { ContaminationPrevention } from '../ContaminationPrevention';

describe('ContaminationPrevention', () => {
  let prevention: ContaminationPrevention;

  beforeEach(() => {
    prevention = new ContaminationPrevention();
  });

  describe('Code Example Detection', () => {
    it('should detect markdown code blocks', () => {
      const content = `
        # Token Usage
        
        Here's how to use tokens:
        \`\`\`typescript
        const spacing = space100;
        \`\`\`
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'code-example')).toBe(true);
    });

    it('should detect inline code patterns', () => {
      const content = `
        Use \`const spacing = 8\` for standard spacing.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'code-example')).toBe(true);
    });

    it('should detect HTML code tags', () => {
      const content = `
        <p>Example: <code>const token = space100;</code></p>
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'code-example')).toBe(true);
    });

    it('should detect implementation code patterns', () => {
      const content = `
        function calculateSpacing() {
          return baseValue * multiplier;
        }
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'implementation-detail')).toBe(true);
    });

    it('should detect class declarations', () => {
      const content = `
        class TokenRegistry {
          register(token) { }
        }
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'implementation-detail')).toBe(true);
    });

    it('should detect import statements', () => {
      const content = `
        import { space100 } from './tokens';
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'implementation-detail')).toBe(true);
    });

    it('should allow concept-based content without code', () => {
      const content = `
        # Token System
        
        The token system uses mathematical relationships to ensure consistency.
        Spacing tokens follow an 8-unit baseline grid with strategic flexibility
        for exceptional cases.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(true);
      expect(result.vectors.length).toBe(0);
    });
  });

  describe('Implementation Detail Detection', () => {
    it('should detect implementation-focused language', () => {
      const content = `
        How to implement the token system:
        1. Create a registry class
        2. Add validation methods
        3. Generate platform files
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'implementation-detail')).toBe(true);
    });

    it('should detect file organization details', () => {
      const content = `
        The file organization should follow this structure:
        - src/tokens/
        - src/validators/
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'implementation-detail')).toBe(true);
    });

    it('should detect method signature references', () => {
      const content = `
        The method signature for validation is:
        validate(token: Token): ValidationResult
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'implementation-detail')).toBe(true);
    });

    it('should allow conceptual explanations', () => {
      const content = `
        The validation system uses three tiers: Pass, Warning, and Error.
        Each tier provides mathematical reasoning for the validation result.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(true);
    });
  });

  describe('Arbitrary Value Detection', () => {
    it('should detect multiple pixel values', () => {
      const content = `
        Use 8px for small spacing, 16px for medium, 24px for large,
        32px for extra large, and 48px for maximum spacing.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'arbitrary-value')).toBe(true);
    });

    it('should detect multiple point values', () => {
      const content = `
        iOS uses 8pt, 16pt, 24pt, 32pt for spacing values.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'arbitrary-value')).toBe(true);
    });

    it('should detect multiple dp values', () => {
      const content = `
        Android spacing: 8dp, 16dp, 24dp, 32dp, 48dp
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(false);
      expect(result.vectors.some(v => v.type === 'arbitrary-value')).toBe(true);
    });

    it('should allow few unit values for examples', () => {
      const content = `
        The base value is 8px, which converts to 8pt on iOS.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(true);
    });

    it('should allow token name references', () => {
      const content = `
        Use space100 for standard spacing, space150 for medium spacing,
        and space200 for large spacing.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.isClean).toBe(true);
    });
  });

  describe('Severity Levels', () => {
    it('should assign critical severity to code examples in documentation', () => {
      const content = `
        \`\`\`typescript
        const token = space100;
        \`\`\`
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.vectors.some(v => v.severity === 'critical')).toBe(true);
    });

    it('should assign high severity to implementation code', () => {
      const content = `
        function register() { }
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.vectors.some(v => v.severity === 'high')).toBe(true);
    });

    it('should assign medium severity to implementation language', () => {
      const content = `
        How to implement the validation system.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.vectors.some(v => v.severity === 'medium')).toBe(true);
    });
  });

  describe('Summary Generation', () => {
    it('should generate clean summary for no vectors', () => {
      const content = `
        The token system uses mathematical relationships.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.summary).toContain('clean');
      expect(result.summary).toContain('no contamination vectors');
    });

    it('should generate summary with severity counts', () => {
      const content = `
        \`\`\`typescript
        const token = space100;
        \`\`\`
        
        How to implement this system.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.summary).toContain('Contamination vectors detected');
      expect(result.summary).toMatch(/critical|high|medium/);
    });
  });

  describe('Recommendations', () => {
    it('should provide recommendations for code examples', () => {
      const content = `
        \`\`\`typescript
        const token = space100;
        \`\`\`
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.some(r => r.includes('concept-based'))).toBe(true);
    });

    it('should provide recommendations for implementation details', () => {
      const content = `
        How to implement the token system.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.some(r => r.includes('design principles'))).toBe(true);
    });

    it('should provide recommendations for arbitrary values', () => {
      const content = `
        Use 8px, 16px, 24px, 32px, 48px for spacing.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.some(r => r.includes('token'))).toBe(true);
    });
  });

  describe('Concept-Based Validation', () => {
    it('should validate concept-based content as clean', () => {
      const content = `
        The mathematical token system ensures cross-platform consistency
        through baseline grid alignment and modular scale progression.
      `;

      expect(prevention.isConceptBased(content)).toBe(true);
    });

    it('should reject code-based content', () => {
      const content = `
        \`\`\`typescript
        const spacing = 8;
        \`\`\`
      `;

      expect(prevention.isConceptBased(content)).toBe(false);
    });
  });

  describe('Configuration', () => {
    it('should allow disabling code example blocking', () => {
      prevention.updateConfig({ enableCodeExampleBlocking: false });

      const content = `
        \`\`\`typescript
        const token = space100;
        \`\`\`
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.vectors.some(v => v.type === 'code-example')).toBe(false);
    });

    it('should allow disabling implementation detail blocking', () => {
      prevention.updateConfig({ enableImplementationDetailBlocking: false });

      const content = `
        How to implement the system.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.vectors.some(v => v.type === 'implementation-detail')).toBe(false);
    });

    it('should allow disabling arbitrary value detection', () => {
      prevention.updateConfig({ enableArbitraryValueDetection: false });

      const content = `
        Use 8px, 16px, 24px, 32px, 48px for spacing.
      `;

      const result = prevention.checkContent(content, 'documentation');

      expect(result.vectors.some(v => v.type === 'arbitrary-value')).toBe(false);
    });

    it('should enforce strict mode', () => {
      prevention.updateConfig({ strictMode: true });

      const content = `
        \`\`\`typescript
        interface Token { name: string; }
        \`\`\`
      `;

      const result = prevention.checkContent(content, 'documentation');

      // In strict mode, even type definitions are flagged
      expect(result.isClean).toBe(false);
    });

    it('should allow low severity in non-strict mode', () => {
      prevention.updateConfig({ strictMode: false });

      const content = `
        Some content with low severity issues.
      `;

      const result = prevention.checkContent(content, 'documentation');

      // Non-strict mode allows low severity
      expect(result.isClean || result.vectors.every(v => v.severity === 'low')).toBe(true);
    });
  });

  describe('Context-Specific Checking', () => {
    it('should adjust severity based on context', () => {
      const content = `
        \`\`\`typescript
        const token = space100;
        \`\`\`
      `;

      const docResult = prevention.checkContent(content, 'documentation');
      const codeResult = prevention.checkContent(content, 'code');

      expect(docResult.vectors[0].severity).toBe('critical');
      expect(codeResult.vectors[0].severity).toBe('high');
    });
  });
});
