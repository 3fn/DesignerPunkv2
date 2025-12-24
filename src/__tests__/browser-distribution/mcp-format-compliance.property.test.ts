/**
 * @jest-environment node
 * @category evergreen
 * @purpose Property test for MCP documentation format compliance
 */

/**
 * MCP Documentation Format Compliance Property Test
 *
 * Property 4: MCP Documentation Format Compliance
 * Verifies that all required MCP metadata fields are present in the
 * Browser Distribution Guide steering document.
 *
 * Required metadata fields:
 * - Date: Document creation/update date
 * - Purpose: Clear description of document purpose
 * - Organization: Organizational category
 * - Scope: Applicable scope
 * - Layer: Documentation layer (0-3)
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 9.2
 * @validates Requirements 9.2
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Property 4: MCP Documentation Format Compliance', () => {
  const BROWSER_DISTRIBUTION_GUIDE_PATH = path.join(
    process.cwd(),
    '.kiro',
    'steering',
    'Browser Distribution Guide.md'
  );

  /**
   * Required MCP metadata fields that must be present in steering documents.
   * These fields enable the MCP documentation server to properly index and
   * serve documentation to AI agents.
   */
  const REQUIRED_METADATA_FIELDS = [
    'Date',
    'Purpose',
    'Organization',
    'Scope',
    'Layer',
  ];

  /**
   * Optional but recommended metadata fields for comprehensive documentation.
   */
  const RECOMMENDED_METADATA_FIELDS = ['Last Reviewed', 'Relevant Tasks'];

  let documentContent: string;

  beforeAll(() => {
    // Ensure Browser Distribution Guide exists
    if (!fs.existsSync(BROWSER_DISTRIBUTION_GUIDE_PATH)) {
      throw new Error(
        'Browser Distribution Guide not found at .kiro/steering/Browser Distribution Guide.md'
      );
    }

    // Read document content
    documentContent = fs.readFileSync(BROWSER_DISTRIBUTION_GUIDE_PATH, 'utf-8');
  });

  /**
   * Extract metadata value from document content.
   * Supports multiple formats:
   * 1. Table format: | **Field** | Value |
   * 2. Bold format: **Field**: Value
   * 3. Simple format: Field: Value
   *
   * @param content - Document content to search
   * @param fieldName - Metadata field name to extract
   * @returns Field value or null if not found
   */
  function extractMetadataField(
    content: string,
    fieldName: string
  ): string | null {
    // Try table format: | **Field** | Value |
    // This matches: | **Date** | 2025-01-15 |
    const tableRegex = new RegExp(
      `\\|\\s*\\*\\*${fieldName}\\*\\*\\s*\\|\\s*([^|]+)\\s*\\|`,
      'i'
    );
    let match = content.match(tableRegex);

    if (match && match[1]) {
      return match[1].trim();
    }

    // Try bold format: **Field**: Value
    const boldRegex = new RegExp(
      `\\*\\*${fieldName}\\*\\*:\\s*(.+?)(?:\\n|$)`,
      'i'
    );
    match = content.match(boldRegex);

    if (match && match[1]) {
      return match[1].trim();
    }

    // Try simple format: Field: Value
    const simpleRegex = new RegExp(`^${fieldName}:\\s*(.+?)$`, 'im');
    match = content.match(simpleRegex);

    if (match && match[1]) {
      return match[1].trim();
    }

    return null;
  }

  /**
   * Check if a metadata field has a non-empty value.
   *
   * @param value - Field value to check
   * @returns true if value is non-empty
   */
  function hasNonEmptyValue(value: string | null): boolean {
    return value !== null && value.trim().length > 0;
  }

  describe('Required Metadata Fields', () => {
    /**
     * Property: For all required MCP metadata fields, the field SHALL be present
     * in the Browser Distribution Guide with a non-empty value.
     *
     * This is the core property test that validates MCP format compliance.
     */
    test.each(REQUIRED_METADATA_FIELDS)(
      'required field "%s" should be present with non-empty value',
      (fieldName) => {
        const value = extractMetadataField(documentContent, fieldName);

        // Log field value for visibility
        console.log(`${fieldName}: ${value || '(not found)'}`);

        // Property assertion: field should exist
        expect(value).not.toBeNull();

        // Property assertion: field should have non-empty value
        expect(hasNonEmptyValue(value)).toBe(true);
      }
    );

    /**
     * Property: All required metadata fields should be present together.
     *
     * This aggregated test provides a comprehensive view of compliance.
     */
    it('all required metadata fields should be present', () => {
      const missingFields: string[] = [];
      const presentFields: Array<{ field: string; value: string }> = [];

      for (const fieldName of REQUIRED_METADATA_FIELDS) {
        const value = extractMetadataField(documentContent, fieldName);

        if (hasNonEmptyValue(value)) {
          presentFields.push({ field: fieldName, value: value! });
        } else {
          missingFields.push(fieldName);
        }
      }

      // Log summary
      console.log('\nMCP Format Compliance Summary:');
      console.log(`- Required fields: ${REQUIRED_METADATA_FIELDS.length}`);
      console.log(`- Present fields: ${presentFields.length}`);
      console.log(`- Missing fields: ${missingFields.length}`);

      if (presentFields.length > 0) {
        console.log('\nPresent fields:');
        for (const { field, value } of presentFields) {
          console.log(`  ${field}: ${value}`);
        }
      }

      if (missingFields.length > 0) {
        console.log('\nMissing fields:', missingFields);
      }

      // Property assertion: no missing required fields
      expect(missingFields).toHaveLength(0);
    });
  });

  describe('Metadata Field Values', () => {
    /**
     * Property: Date field should be in a valid date format.
     *
     * Validates that the Date field contains a recognizable date.
     */
    it('Date field should be in valid format (YYYY-MM-DD)', () => {
      const dateValue = extractMetadataField(documentContent, 'Date');

      expect(dateValue).not.toBeNull();

      // Check for YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      expect(dateValue).toMatch(dateRegex);

      // Verify it's a valid date
      const parsedDate = new Date(dateValue!);
      expect(parsedDate.toString()).not.toBe('Invalid Date');

      console.log(`Date value: ${dateValue} (valid)`);
    });

    /**
     * Property: Layer field should be a valid layer number (0-3).
     *
     * Validates that the Layer field contains a valid documentation layer.
     */
    it('Layer field should be a valid layer number (0-3)', () => {
      const layerValue = extractMetadataField(documentContent, 'Layer');

      expect(layerValue).not.toBeNull();

      // Layer should be a number between 0 and 3
      const layerNumber = parseInt(layerValue!, 10);
      expect(layerNumber).toBeGreaterThanOrEqual(0);
      expect(layerNumber).toBeLessThanOrEqual(3);

      console.log(`Layer value: ${layerValue} (valid)`);
    });

    /**
     * Property: Organization field should be a recognized organization type.
     *
     * Validates that the Organization field contains a valid organization category.
     */
    it('Organization field should be a recognized type', () => {
      const orgValue = extractMetadataField(documentContent, 'Organization');

      expect(orgValue).not.toBeNull();

      // Valid organization types from File Organization Standards
      const validOrganizations = [
        'framework-strategic',
        'spec-validation',
        'spec-completion',
        'spec-summary',
        'spec-guide',
        'audit-findings',
        'token-documentation',
        'process-standard',
        'working-document',
      ];

      expect(validOrganizations).toContain(orgValue);

      console.log(`Organization value: ${orgValue} (valid)`);
    });

    /**
     * Property: Purpose field should be descriptive (minimum length).
     *
     * Validates that the Purpose field contains meaningful content.
     */
    it('Purpose field should be descriptive (at least 20 characters)', () => {
      const purposeValue = extractMetadataField(documentContent, 'Purpose');

      expect(purposeValue).not.toBeNull();

      // Purpose should be descriptive, not just a few words
      const MIN_PURPOSE_LENGTH = 20;
      expect(purposeValue!.length).toBeGreaterThanOrEqual(MIN_PURPOSE_LENGTH);

      console.log(
        `Purpose value: "${purposeValue}" (${purposeValue!.length} chars)`
      );
    });

    /**
     * Property: Scope field should be non-empty.
     *
     * Validates that the Scope field is present and meaningful.
     */
    it('Scope field should be non-empty', () => {
      const scopeValue = extractMetadataField(documentContent, 'Scope');

      expect(scopeValue).not.toBeNull();
      expect(scopeValue!.length).toBeGreaterThan(0);

      console.log(`Scope value: ${scopeValue}`);
    });
  });

  describe('Recommended Metadata Fields', () => {
    /**
     * Property: Recommended metadata fields should be present for comprehensive documentation.
     *
     * This is a non-blocking check that logs warnings for missing recommended fields.
     */
    it('should have recommended metadata fields (informational)', () => {
      const missingRecommended: string[] = [];
      const presentRecommended: Array<{ field: string; value: string }> = [];

      for (const fieldName of RECOMMENDED_METADATA_FIELDS) {
        const value = extractMetadataField(documentContent, fieldName);

        if (hasNonEmptyValue(value)) {
          presentRecommended.push({ field: fieldName, value: value! });
        } else {
          missingRecommended.push(fieldName);
        }
      }

      // Log findings (informational, not blocking)
      console.log('\nRecommended Fields Status:');
      console.log(
        `- Present: ${presentRecommended.length}/${RECOMMENDED_METADATA_FIELDS.length}`
      );

      if (presentRecommended.length > 0) {
        for (const { field, value } of presentRecommended) {
          console.log(`  ✓ ${field}: ${value}`);
        }
      }

      if (missingRecommended.length > 0) {
        console.log(`- Missing (optional): ${missingRecommended.join(', ')}`);
      }

      // This test always passes - it's informational only
      expect(true).toBe(true);
    });
  });

  describe('Document Structure', () => {
    /**
     * Property: Document should have a title heading.
     *
     * Validates basic document structure.
     */
    it('should have a title heading', () => {
      // Match # Title at the start of a line (after frontmatter)
      const titleRegex = /^#\s+.+$/m;
      expect(documentContent).toMatch(titleRegex);

      const titleMatch = documentContent.match(titleRegex);
      console.log(`Document title: ${titleMatch?.[0]}`);
    });

    /**
     * Property: Document should have frontmatter if conditional loading is used.
     *
     * Validates that conditional documents have proper frontmatter.
     */
    it('should have valid frontmatter for conditional loading', () => {
      // Check if document starts with frontmatter
      const hasFrontmatter = documentContent.startsWith('---');

      if (hasFrontmatter) {
        // Extract frontmatter
        const frontmatterMatch = documentContent.match(/^---\n([\s\S]*?)\n---/);
        expect(frontmatterMatch).not.toBeNull();

        const frontmatter = frontmatterMatch![1];

        // Check for inclusion type
        expect(frontmatter).toMatch(/inclusion:\s*(conditional|always|manual)/);

        console.log('Frontmatter found with conditional loading configuration');
      } else {
        console.log(
          'No frontmatter (document uses default always-loaded behavior)'
        );
      }

      // This test passes regardless - frontmatter is optional
      expect(true).toBe(true);
    });
  });
});
