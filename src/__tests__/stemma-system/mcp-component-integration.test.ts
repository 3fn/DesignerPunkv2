/**
 * @jest-environment node
 * @category evergreen
 * @purpose Validate MCP integration for Component Quick Reference and component family documents
 */

/**
 * MCP Component Integration Test
 *
 * Validates that the Component Quick Reference and all component family documents
 * are properly structured for MCP server indexing and can be queried. This test validates:
 * - Progressive disclosure workflow (summary → section → full)
 * - Routing paths work correctly for all 11 component families
 * - Query performance with designerpunk-docs server
 * - Document structure supports MCP queries
 *
 * @see .kiro/specs/034-component-architecture-system/design.md
 * @see Requirements: R7
 * @validates Requirements R7.1, R7.2, R7.3, R7.4, R7.5
 */

import * as fs from 'fs';
import * as path from 'path';

describe('MCP Component Integration: Component Quick Reference', () => {
  const STEERING_DIR = path.join(process.cwd(), '.kiro/steering');
  const COMPONENT_QUICK_REFERENCE_PATH = '.kiro/steering/Component-Quick-Reference.md';

  // All 11 component family document paths from the routing table
  // Note: File naming follows Component-Family-*.md pattern per Stemma System conventions
  const COMPONENT_FAMILY_DOCS = [
    { family: 'Buttons', path: '.kiro/steering/Component-Family-Button.md', status: 'Production' },
    { family: 'Form Inputs', path: '.kiro/steering/Component-Family-Form-Inputs.md', status: 'Production' },
    { family: 'Containers', path: '.kiro/steering/Component-Family-Container.md', status: 'Production' },
    { family: 'Icons', path: '.kiro/steering/Component-Family-Icon.md', status: 'Production' },
    { family: 'Modals', path: '.kiro/steering/Component-Family-Modal.md', status: 'Placeholder' },
    { family: 'Avatars', path: '.kiro/steering/Component-Family-Avatar.md', status: 'Placeholder' },
    { family: 'Badges & Tags', path: '.kiro/steering/Component-Family-Badge.md', status: 'Production' },
    { family: 'Data Displays', path: '.kiro/steering/Component-Family-Data-Display.md', status: 'Placeholder' },
    { family: 'Dividers', path: '.kiro/steering/Component-Family-Divider.md', status: 'Placeholder' },
    { family: 'Loading', path: '.kiro/steering/Component-Family-Loading.md', status: 'Placeholder' },
    { family: 'Navigation', path: '.kiro/steering/Component-Family-Navigation.md', status: 'Placeholder' },
  ];

  describe('Component Quick Reference Document Structure', () => {
    let documentContent: string;

    beforeAll(() => {
      const fullPath = path.join(process.cwd(), COMPONENT_QUICK_REFERENCE_PATH);
      documentContent = fs.readFileSync(fullPath, 'utf-8');
    });

    it('Component Quick Reference file should exist', () => {
      const fullPath = path.join(process.cwd(), COMPONENT_QUICK_REFERENCE_PATH);
      expect(fs.existsSync(fullPath)).toBe(true);
    });

    it('should have required metadata fields for MCP indexing', () => {
      const requiredFields = ['Date', 'Purpose', 'Organization', 'Scope', 'Layer'];

      for (const field of requiredFields) {
        const regex = new RegExp(`\\*\\*${field}\\*\\*:\\s*.+`, 'i');
        expect(documentContent).toMatch(regex);
      }
    });

    it('should have conditional loading frontmatter', () => {
      expect(documentContent).toMatch(/^---\n/);
      expect(documentContent).toMatch(/inclusion:\s*(conditional|always|manual)/);
    });

    it('should have Component Documentation Map section', () => {
      expect(documentContent).toMatch(/^##\s+Component Documentation Map/m);
    });

    it('should have Common Composition Patterns section', () => {
      expect(documentContent).toMatch(/^##\s+Common Composition Patterns/m);
    });

    it('should have MCP Query Examples section', () => {
      expect(documentContent).toMatch(/^##\s+MCP Query Examples/m);
    });

    it('should have Progressive Disclosure Workflow section', () => {
      expect(documentContent).toMatch(/Progressive Disclosure Workflow/);
    });

    it('should document all 11 component families in routing table', () => {
      for (const family of COMPONENT_FAMILY_DOCS) {
        expect(documentContent).toContain(family.family);
        expect(documentContent).toContain(family.path);
      }
    });

    it('should have reasonable token count (~1,600 tokens soft target)', () => {
      const wordCount = documentContent.split(/\s+/).length;
      const estimatedTokens = Math.ceil(wordCount / 0.75);

      // Soft target is ~1,600 tokens, allow reasonable range
      expect(estimatedTokens).toBeGreaterThan(1000);
      expect(estimatedTokens).toBeLessThan(3000);

      console.log(`Component Quick Reference estimated tokens: ${estimatedTokens}`);
    });
  });

  describe('Routing Paths Verification', () => {
    it('all component family documents should exist', () => {
      for (const family of COMPONENT_FAMILY_DOCS) {
        const fullPath = path.join(process.cwd(), family.path);
        const exists = fs.existsSync(fullPath);
        
        if (!exists) {
          console.log(`Missing: ${family.family} at ${family.path}`);
        }
        
        expect(exists).toBe(true);
      }
    });

    it('all component family documents should have required MCP metadata', () => {
      const requiredFields = ['Date', 'Purpose', 'Organization', 'Scope', 'Layer'];

      for (const family of COMPONENT_FAMILY_DOCS) {
        const fullPath = path.join(process.cwd(), family.path);
        const content = fs.readFileSync(fullPath, 'utf-8');

        for (const field of requiredFields) {
          const regex = new RegExp(`\\*\\*${field}\\*\\*:\\s*.+`, 'i');
          const hasField = regex.test(content);
          
          if (!hasField) {
            console.log(`${family.family}: Missing ${field} field`);
          }
          
          expect(hasField).toBe(true);
        }
      }
    });

    it('all component family documents should have conditional loading frontmatter', () => {
      for (const family of COMPONENT_FAMILY_DOCS) {
        const fullPath = path.join(process.cwd(), family.path);
        const content = fs.readFileSync(fullPath, 'utf-8');

        expect(content).toMatch(/^---\n/);
        expect(content).toMatch(/inclusion:\s*(conditional|always|manual)/);
      }
    });
  });

  describe('Progressive Disclosure Workflow Validation', () => {
    it('Component Quick Reference should support Stage 1: Summary queries', () => {
      const fullPath = path.join(process.cwd(), COMPONENT_QUICK_REFERENCE_PATH);
      const content = fs.readFileSync(fullPath, 'utf-8');

      // Should have clear section headings for summary outline
      const sectionHeadings = content.match(/^##\s+.+$/gm) || [];
      expect(sectionHeadings.length).toBeGreaterThan(3);

      console.log(`Component Quick Reference sections: ${sectionHeadings.length}`);
    });

    it('Component Quick Reference should support Stage 2: Section queries', () => {
      const fullPath = path.join(process.cwd(), COMPONENT_QUICK_REFERENCE_PATH);
      const content = fs.readFileSync(fullPath, 'utf-8');

      // Key sections that should be queryable
      const expectedSections = [
        'Component Documentation Map',
        'Common Composition Patterns',
        'MCP Query Examples',
      ];

      for (const section of expectedSections) {
        const regex = new RegExp(`^##\\s+${section}`, 'm');
        expect(content).toMatch(regex);
      }
    });

    it('all component family documents should support section queries', () => {
      // Expected sections in all component family documents (both production and placeholder)
      const requiredSections = [
        'Family Overview',
        'Inheritance Structure',
        'Behavioral Contracts',
      ];

      for (const family of COMPONENT_FAMILY_DOCS) {
        const fullPath = path.join(process.cwd(), family.path);
        const content = fs.readFileSync(fullPath, 'utf-8');

        for (const section of requiredSections) {
          const regex = new RegExp(`^##\\s+${section}`, 'm');
          const hasSection = regex.test(content);
          
          if (!hasSection) {
            console.log(`${family.family}: Missing ${section} section`);
          }
          
          expect(hasSection).toBe(true);
        }
        
        // Component Schemas section is only required for production documents
        if (family.status === 'Production') {
          const hasSchemas = /^##\s+Component Schemas/m.test(content);
          if (!hasSchemas) {
            console.log(`${family.family} (Production): Missing Component Schemas section`);
          }
          expect(hasSchemas).toBe(true);
        }
      }
    });

    it('production component family documents should have detailed content', () => {
      const productionFamilies = COMPONENT_FAMILY_DOCS.filter(f => f.status === 'Production');

      for (const family of productionFamilies) {
        const fullPath = path.join(process.cwd(), family.path);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const wordCount = content.split(/\s+/).length;
        const estimatedTokens = Math.ceil(wordCount / 0.75);

        // Production docs should have substantial content
        expect(estimatedTokens).toBeGreaterThan(500);

        console.log(`${family.family} (Production): ${estimatedTokens} tokens`);
      }
    });

    it('placeholder component family documents should have structural content', () => {
      const placeholderFamilies = COMPONENT_FAMILY_DOCS.filter(f => f.status === 'Placeholder');

      for (const family of placeholderFamilies) {
        const fullPath = path.join(process.cwd(), family.path);
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Placeholder docs should indicate placeholder status
        expect(content).toMatch(/placeholder|Placeholder|PLACEHOLDER|🔴/i);
      }
    });
  });

  describe('MCP Query Examples Validation', () => {
    let documentContent: string;

    beforeAll(() => {
      const fullPath = path.join(process.cwd(), COMPONENT_QUICK_REFERENCE_PATH);
      documentContent = fs.readFileSync(fullPath, 'utf-8');
    });

    it('should document get_document_summary examples', () => {
      expect(documentContent).toContain('get_document_summary');
    });

    it('should document get_section examples', () => {
      expect(documentContent).toContain('get_section');
    });

    it('should document get_document_full examples', () => {
      expect(documentContent).toContain('get_document_full');
    });

    it('should document progressive disclosure stages', () => {
      expect(documentContent).toContain('Stage 1');
      expect(documentContent).toContain('Stage 2');
      expect(documentContent).toContain('Stage 3');
    });

    it('should include token cost guidance', () => {
      expect(documentContent).toMatch(/token/i);
      expect(documentContent).toMatch(/~?\d+\s*tokens?/i);
    });
  });

  describe('Cross-Reference Integrity', () => {
    it('Component Quick Reference should have valid cross-references', () => {
      const fullPath = path.join(process.cwd(), COMPONENT_QUICK_REFERENCE_PATH);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const docDir = path.dirname(fullPath);

      // Extract markdown links
      const linkRegex = /\[([^\]]+)\]\(([^)]+\.md)\)/g;
      const links: Array<{ text: string; target: string }> = [];
      let match;

      while ((match = linkRegex.exec(content)) !== null) {
        links.push({ text: match[1], target: match[2] });
      }

      // Verify each link points to an existing file
      let validLinks = 0;
      let invalidLinks = 0;

      for (const link of links) {
        const targetPath = path.resolve(docDir, link.target);
        const exists = fs.existsSync(targetPath);

        if (exists) {
          validLinks++;
        } else {
          invalidLinks++;
          console.log(`Invalid cross-reference: "${link.text}" -> ${link.target}`);
        }
      }

      console.log(`Cross-references: ${validLinks} valid, ${invalidLinks} invalid`);
      
      // All cross-references should be valid
      expect(invalidLinks).toBe(0);
    });

    it('component family documents should have Related Documentation section', () => {
      for (const family of COMPONENT_FAMILY_DOCS) {
        const fullPath = path.join(process.cwd(), family.path);
        const content = fs.readFileSync(fullPath, 'utf-8');

        const hasRelatedDocs = /Related Documentation|Related Guides|Cross-References/i.test(content);
        
        if (!hasRelatedDocs) {
          console.log(`${family.family}: Missing Related Documentation section`);
        }
        
        expect(hasRelatedDocs).toBe(true);
      }
    });
  });

  describe('MCP Server Availability', () => {
    const MCP_SERVER_DIR = path.join(process.cwd(), 'mcp-server');

    it('MCP server should be built', () => {
      const distPath = path.join(MCP_SERVER_DIR, 'dist', 'index.js');
      expect(fs.existsSync(distPath)).toBe(true);
    });

    it('MCP server package.json should exist', () => {
      const packagePath = path.join(MCP_SERVER_DIR, 'package.json');
      expect(fs.existsSync(packagePath)).toBe(true);
    });

    it('MCP server should have required dependencies', () => {
      const packagePath = path.join(MCP_SERVER_DIR, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.dependencies['@modelcontextprotocol/sdk']).toBeDefined();
    });
  });

  describe('Query Performance Simulation', () => {
    it('should be able to parse Component Quick Reference efficiently', () => {
      const startTime = Date.now();
      
      const fullPath = path.join(process.cwd(), COMPONENT_QUICK_REFERENCE_PATH);
      const content = fs.readFileSync(fullPath, 'utf-8');

      // Parse metadata
      const metadata: Record<string, string> = {};
      const metadataRegex = /\*\*([^*]+)\*\*:\s*(.+)/g;
      let match;
      while ((match = metadataRegex.exec(content)) !== null) {
        metadata[match[1].trim()] = match[2].trim();
      }

      // Parse sections
      const sections: string[] = [];
      const sectionRegex = /^##\s+(.+)$/gm;
      while ((match = sectionRegex.exec(content)) !== null) {
        sections.push(match[1].trim());
      }

      const endTime = Date.now();
      const parseTime = endTime - startTime;

      console.log(`Parse time: ${parseTime}ms`);
      console.log(`Metadata fields: ${Object.keys(metadata).length}`);
      console.log(`Sections: ${sections.length}`);

      // Should parse quickly (under 100ms)
      expect(parseTime).toBeLessThan(100);
      expect(Object.keys(metadata).length).toBeGreaterThan(3);
      expect(sections.length).toBeGreaterThan(3);
    });

    it('should be able to parse all component family documents efficiently', () => {
      const startTime = Date.now();
      let totalSections = 0;

      for (const family of COMPONENT_FAMILY_DOCS) {
        const fullPath = path.join(process.cwd(), family.path);
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Parse sections
        const sectionRegex = /^##\s+(.+)$/gm;
        let match;
        while ((match = sectionRegex.exec(content)) !== null) {
          totalSections++;
        }
      }

      const endTime = Date.now();
      const parseTime = endTime - startTime;

      console.log(`Total parse time for all ${COMPONENT_FAMILY_DOCS.length} family docs: ${parseTime}ms`);
      console.log(`Total sections across all docs: ${totalSections}`);

      // Should parse all docs quickly (under 500ms)
      expect(parseTime).toBeLessThan(500);
      expect(totalSections).toBeGreaterThan(30);
    });
  });

  describe('Document Discoverability', () => {
    it('all component family documents should be in steering directory', () => {
      const steeringFiles = fs.readdirSync(STEERING_DIR).filter(f => f.endsWith('.md'));

      for (const family of COMPONENT_FAMILY_DOCS) {
        const filename = path.basename(family.path);
        const exists = steeringFiles.includes(filename);
        
        if (!exists) {
          console.log(`${family.family}: Not found in steering directory`);
        }
        
        expect(exists).toBe(true);
      }

      console.log(`Found ${steeringFiles.length} steering documents`);
    });

    it('Component Quick Reference should be discoverable', () => {
      const steeringFiles = fs.readdirSync(STEERING_DIR).filter(f => f.endsWith('.md'));
      expect(steeringFiles).toContain('Component-Quick-Reference.md');
    });
  });
});
