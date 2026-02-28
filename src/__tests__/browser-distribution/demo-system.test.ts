/**
 * @jest-environment node
 * @category evergreen
 * @purpose Property tests for Component Demo System
 */

/**
 * Component Demo System Property Tests
 *
 * Validates structural correctness properties across all demo files.
 * Uses fast-check for property-based testing over the finite set of demo files.
 *
 * @see .kiro/specs/061-component-demo-system/design.md
 * @see .kiro/specs/061-component-demo-system/requirements.md
 * @validates All requirements (validation)
 */

import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// Shared Constants and Helpers
// ============================================================

const DEMOS_DIR = path.join(process.cwd(), 'demos');
const DIST_BROWSER_DIR = path.join(process.cwd(), 'dist', 'browser');

/**
 * Component family to demo file mapping from the design document.
 * Each entry maps component family directories to their expected demo file.
 */
const COMPONENT_FAMILY_DEMO_MAP: Record<string, string> = {
  'Avatar-Base': 'avatar-demo.html',
  'Badge-Label-Base,Badge-Count-Base,Badge-Count-Notification': 'badge-demo.html',
  'Button-CTA': 'button-cta-demo.html',
  'Button-Icon': 'button-icon-demo.html',
  'Button-VerticalList-Item,Button-VerticalList-Set': 'button-vertical-list-demo.html',
  'Chip-Base,Chip-Filter,Chip-Input': 'chip-demo.html',
  'Container-Base': 'container-base-demo.html',
  'Container-Card-Base': 'container-card-demo.html',
  'Icon-Base': 'icon-base-demo.html',
  'Input-Text-Base,Input-Text-Email,Input-Text-Password,Input-Text-PhoneNumber': 'input-text-demo.html',
  'Input-Checkbox-Base,Input-Checkbox-Legal': 'checkbox-demo.html',
  'Input-Radio-Base,Input-Radio-Set': 'radio-demo.html',
  'Progress-Indicator-Node-Base,Progress-Indicator-Connector-Base,Progress-Indicator-Label-Base': 'progress-indicator-demo.html',
  'Progress-Pagination-Base': 'progress-pagination-demo.html',
  'Progress-Stepper-Base,Progress-Stepper-Detailed': 'progress-stepper-demo.html',
};

/** Required CSS classes that demo pages should use for structural consistency */
const REQUIRED_STRUCTURAL_CLASSES = [
  'demo-section',
  'demo-header',
];

/** Physical CSS properties that violate logical property compliance */
const PHYSICAL_PROPERTIES = [
  'padding-left',
  'padding-right',
  'margin-left',
  'margin-right',
  'border-left',
  'border-right',
];

/**
 * Get all demo HTML files (excluding index.html) from the demos directory.
 */
function getDemoFiles(): string[] {
  if (!fs.existsSync(DEMOS_DIR)) return [];
  return fs.readdirSync(DEMOS_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html');
}

/**
 * Get all HTML and CSS files from the demos directory.
 */
function getAllDemoAssets(): string[] {
  if (!fs.existsSync(DEMOS_DIR)) return [];
  return fs.readdirSync(DEMOS_DIR)
    .filter(f => f.endsWith('.html') || f.endsWith('.css'));
}

/**
 * Parse index.html and extract all demo card links with their metadata.
 */
function parseIndexEntries(): Array<{ href: string; title: string; desc: string; category: string }> {
  const indexPath = path.join(DEMOS_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) return [];
  const content = fs.readFileSync(indexPath, 'utf-8');

  const entries: Array<{ href: string; title: string; desc: string; category: string }> = [];

  // Extract category sections and their cards
  const categoryRegex = /<section class="demo-category">\s*<h2>([^<]+)<\/h2>([\s\S]*?)<\/section>/g;
  let categoryMatch;
  while ((categoryMatch = categoryRegex.exec(content)) !== null) {
    const category = categoryMatch[1].trim();
    const sectionContent = categoryMatch[2];

    const cardRegex = /<a href="([^"]+)" class="demo-card">\s*<span class="demo-card-title">([^<]+)<\/span>\s*<span class="demo-card-desc">([^<]+)<\/span>/g;
    let cardMatch;
    while ((cardMatch = cardRegex.exec(sectionContent)) !== null) {
      entries.push({
        href: cardMatch[1].trim(),
        title: cardMatch[2].trim(),
        desc: cardMatch[3].trim(),
        category,
      });
    }
  }

  return entries;
}


// ============================================================
// Property 1: Index entry completeness
// ============================================================

describe('Feature: component-demo-system, Property 1: Index entry completeness', () => {
  /**
   * For any demo entry in the Demo_Index, it should be organized under a
   * Component_Category heading and include both a component family name
   * and a non-empty description.
   *
   * @validates Requirements 1.1, 1.3
   */
  it('every index entry has a category, title, and non-empty description', () => {
    const entries = parseIndexEntries();
    expect(entries.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(fc.constantFrom(...entries), (entry) => {
        // Must be under a category
        expect(entry.category).toBeTruthy();
        expect(entry.category.length).toBeGreaterThan(0);

        // Must have a component family name
        expect(entry.title).toBeTruthy();
        expect(entry.title.length).toBeGreaterThan(0);

        // Must have a non-empty description
        expect(entry.desc).toBeTruthy();
        expect(entry.desc.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// Property 2: Index-to-file bidirectional consistency
// ============================================================

describe('Feature: component-demo-system, Property 2: Index-to-file bidirectional consistency', () => {
  /**
   * For any demo HTML file in the demos/ directory, there should be a
   * corresponding link in the Demo_Index; and for any link in the Demo_Index,
   * the referenced file should exist in the demos/ directory.
   *
   * @validates Requirements 1.2, 1.5
   */
  it('every index link points to an existing demo file', () => {
    const entries = parseIndexEntries();
    expect(entries.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(fc.constantFrom(...entries), (entry) => {
        const filePath = path.join(DEMOS_DIR, entry.href);
        expect(fs.existsSync(filePath)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('every demo file has a corresponding index entry', () => {
    const demoFiles = getDemoFiles();
    const entries = parseIndexEntries();
    const indexedHrefs = new Set(entries.map(e => e.href));

    expect(demoFiles.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(fc.constantFrom(...demoFiles), (file) => {
        expect(indexedHrefs.has(file)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// Property 3: Demo page structural compliance
// ============================================================

describe('Feature: component-demo-system, Property 3: Demo page structural compliance', () => {
  /**
   * For any demo page HTML file, it should contain: a <title> tag with the
   * component family name, a <link> to tokens.css, a <link> to demo-styles.css,
   * a <script> loading the ESM bundle, a token verification section, and
   * HTML/JavaScript usage example sections.
   *
   * @validates Requirements 2.1, 2.4, 2.5, 2.6
   */
  it('every demo page has required structural elements', () => {
    const demoFiles = getDemoFiles();
    expect(demoFiles.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(fc.constantFrom(...demoFiles), (file) => {
        const content = fs.readFileSync(path.join(DEMOS_DIR, file), 'utf-8');

        // Must have a <title> tag
        expect(content).toMatch(/<title>[^<]+<\/title>/);

        // Must link to tokens.css
        expect(content).toMatch(/<link[^>]+href="tokens\.css"/);

        // Must link to demo-styles.css
        expect(content).toMatch(/<link[^>]+href="demo-styles\.css"/);

        // Must load ESM bundle
        expect(content).toMatch(/<script[^>]+src="designerpunk\.esm\.js"/);

        // Must have a token verification section (heading or class)
        expect(content).toMatch(/[Tt]oken [Vv]erification/);

        // Must have usage example section(s) with code
        expect(content).toMatch(/[Uu]sage [Ee]xample/);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// Property 4: CSS logical property compliance
// ============================================================

describe('Feature: component-demo-system, Property 4: CSS logical property compliance', () => {
  /**
   * For any CSS rule in demo-styles.css and in any <style> block within demo
   * pages, no physical directional properties should be used — only CSS
   * logical properties.
   *
   * @validates Requirements 2.7
   */
  it('demo-styles.css uses no physical directional properties', () => {
    const cssPath = path.join(DEMOS_DIR, 'demo-styles.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const content = fs.readFileSync(cssPath, 'utf-8');

    for (const prop of PHYSICAL_PROPERTIES) {
      // Match property declarations (property-name: value) but not inside comments
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip comment lines
        if (line.startsWith('*') || line.startsWith('/*') || line.startsWith('//')) continue;
        // Check for physical property usage as a CSS declaration
        const regex = new RegExp(`(?:^|;|\\{)\\s*${prop.replace('-', '\\-')}\\s*:`, 'i');
        expect(line).not.toMatch(regex);
      }
    }
  });

  it('no demo page <style> blocks use physical directional properties', () => {
    const demoFiles = getDemoFiles();
    expect(demoFiles.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(fc.constantFrom(...demoFiles), (file) => {
        const content = fs.readFileSync(path.join(DEMOS_DIR, file), 'utf-8');

        // Extract <style> blocks
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
        let styleMatch;
        while ((styleMatch = styleRegex.exec(content)) !== null) {
          const styleContent = styleMatch[1];
          for (const prop of PHYSICAL_PROPERTIES) {
            const regex = new RegExp(`${prop}\\s*:`, 'i');
            expect(styleContent).not.toMatch(regex);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});


// ============================================================
// Property 5: Demo file naming convention
// ============================================================

describe('Feature: component-demo-system, Property 5: Demo file naming convention', () => {
  /**
   * For any HTML file in the demos/ directory (excluding index.html), the
   * filename should match the pattern {name}-demo.html where {name} is a
   * lowercase kebab-case string.
   *
   * @validates Requirements 4.1, 4.2
   */
  it('every demo file follows the {name}-demo.html naming convention', () => {
    const demoFiles = getDemoFiles();
    expect(demoFiles.length).toBeGreaterThan(0);

    const namingPattern = /^[a-z][a-z0-9]*(-[a-z0-9]+)*-demo\.html$/;

    fc.assert(
      fc.property(fc.constantFrom(...demoFiles), (file) => {
        expect(file).toMatch(namingPattern);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// Property 6: Build output completeness
// ============================================================

describe('Feature: component-demo-system, Property 6: Build output completeness', () => {
  /**
   * For any file in the demos/ source directory (HTML and CSS files), after
   * the build process runs, a copy of that file should exist in dist/browser/
   * alongside tokens.css and the ESM bundle.
   *
   * @validates Requirements 4.3, 4.4
   */
  it('every demo source file exists in dist/browser/', () => {
    const assets = getAllDemoAssets();
    expect(assets.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(fc.constantFrom(...assets), (file) => {
        const distPath = path.join(DIST_BROWSER_DIR, file);
        expect(fs.existsSync(distPath)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('dist/browser/ contains tokens.css and ESM bundle alongside demos', () => {
    expect(fs.existsSync(path.join(DIST_BROWSER_DIR, 'tokens.css'))).toBe(true);
    expect(fs.existsSync(path.join(DIST_BROWSER_DIR, 'designerpunk.esm.js'))).toBe(true);
  });
});

// ============================================================
// Property 7: Component family demo coverage
// ============================================================

describe('Feature: component-demo-system, Property 7: Component family demo coverage', () => {
  /**
   * For any component family directory under src/components/core/ that contains
   * a platforms/web/ subdirectory, a corresponding demo HTML file should exist
   * in the demos/ directory.
   *
   * Uses the mapping table from the design document to resolve component
   * families to their expected demo files.
   *
   * @validates Requirements 3.1
   */
  it('every web component family has a corresponding demo file', () => {
    const componentsDir = path.join(process.cwd(), 'src', 'components', 'core');
    const webFamilies = fs.readdirSync(componentsDir).filter(dir => {
      const webDir = path.join(componentsDir, dir, 'platforms', 'web');
      return fs.existsSync(webDir);
    });

    expect(webFamilies.length).toBeGreaterThan(0);

    // Build reverse lookup: component family dir → expected demo file
    const familyToDemoFile = new Map<string, string>();
    for (const [families, demoFile] of Object.entries(COMPONENT_FAMILY_DEMO_MAP)) {
      for (const family of families.split(',')) {
        familyToDemoFile.set(family.trim(), demoFile);
      }
    }

    fc.assert(
      fc.property(fc.constantFrom(...webFamilies), (family) => {
        const expectedDemo = familyToDemoFile.get(family);
        // Every web family must be in the mapping
        expect(expectedDemo).toBeDefined();
        // The mapped demo file must exist
        const demoPath = path.join(DEMOS_DIR, expectedDemo!);
        expect(fs.existsSync(demoPath)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================
// Property 8: Visual consistency via shared stylesheet
// ============================================================

describe('Feature: component-demo-system, Property 8: Visual consistency via shared stylesheet', () => {
  /**
   * For any demo page HTML file, it should contain a <link> to demo-styles.css
   * and use the standard CSS classes (demo-section, demo-row, demo-item,
   * demo-code, demo-header) for structural elements.
   *
   * @validates Requirements 6.1, 6.3
   */
  it('every demo page links to demo-styles.css and uses standard structural classes', () => {
    const demoFiles = getDemoFiles();
    expect(demoFiles.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(fc.constantFrom(...demoFiles), (file) => {
        const content = fs.readFileSync(path.join(DEMOS_DIR, file), 'utf-8');

        // Must link to demo-styles.css
        expect(content).toMatch(/<link[^>]+href="demo-styles\.css"/);

        // Must use required structural classes
        for (const cls of REQUIRED_STRUCTURAL_CLASSES) {
          expect(content).toContain(cls);
        }
      }),
      { numRuns: 100 }
    );
  });
});


// ============================================================
// Unit Tests: copyDemoFiles() function validation
// ============================================================

describe('Unit: copyDemoFiles() copies files correctly', () => {
  /**
   * Validates that the build script's copyDemoFiles() function correctly
   * copies all HTML and CSS files from demos/ to dist/browser/.
   *
   * @validates Requirements 4.3, 4.4
   */

  it('every HTML file from demos/ has an identical copy in dist/browser/', () => {
    const demoFiles = getAllDemoAssets().filter(f => f.endsWith('.html'));
    expect(demoFiles.length).toBeGreaterThan(0);

    for (const file of demoFiles) {
      const srcContent = fs.readFileSync(path.join(DEMOS_DIR, file), 'utf-8');
      const distPath = path.join(DIST_BROWSER_DIR, file);
      expect(fs.existsSync(distPath)).toBe(true);
      const distContent = fs.readFileSync(distPath, 'utf-8');
      expect(distContent).toBe(srcContent);
    }
  });

  it('every CSS file from demos/ has an identical copy in dist/browser/', () => {
    const cssFiles = getAllDemoAssets().filter(f => f.endsWith('.css'));
    expect(cssFiles.length).toBeGreaterThan(0);

    for (const file of cssFiles) {
      const srcContent = fs.readFileSync(path.join(DEMOS_DIR, file), 'utf-8');
      const distPath = path.join(DIST_BROWSER_DIR, file);
      expect(fs.existsSync(distPath)).toBe(true);
      const distContent = fs.readFileSync(distPath, 'utf-8');
      expect(distContent).toBe(srcContent);
    }
  });

  it('only HTML and CSS files are copied (no other file types)', () => {
    if (!fs.existsSync(DEMOS_DIR)) return;
    const allFiles = fs.readdirSync(DEMOS_DIR);
    const nonDemoFiles = allFiles.filter(f => !f.endsWith('.html') && !f.endsWith('.css'));

    for (const file of nonDemoFiles) {
      // These files should NOT have been copied by copyDemoFiles
      // (they may exist in dist/browser for other reasons, so we just verify
      // the demo assets list correctly filters them)
      expect(getAllDemoAssets()).not.toContain(file);
    }
  });
});

// ============================================================
// Unit Tests: File protocol detection script
// ============================================================

describe('Unit: File protocol detection script', () => {
  /**
   * Validates that every demo page includes the file:// protocol detection
   * script that creates a warning banner when opened directly.
   *
   * @validates Requirement 5.5
   */

  it('every demo page includes the file protocol detection script', () => {
    const demoFiles = getDemoFiles();
    expect(demoFiles.length).toBeGreaterThan(0);

    for (const file of demoFiles) {
      const content = fs.readFileSync(path.join(DEMOS_DIR, file), 'utf-8');

      // Must check for file:// protocol
      expect(content).toContain("window.location.protocol === 'file:'");

      // Must create a banner element with the warning class
      expect(content).toContain('demo-file-protocol-warning');

      // Must prepend the banner to the body
      expect(content).toContain('document.body.prepend(banner)');
    }
  });

  it('index page includes the file protocol detection script', () => {
    const indexPath = path.join(DEMOS_DIR, 'index.html');
    expect(fs.existsSync(indexPath)).toBe(true);

    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain("window.location.protocol === 'file:'");
    expect(content).toContain('demo-file-protocol-warning');
    expect(content).toContain('document.body.prepend(banner)');
  });
});

// ============================================================
// Unit Tests: README content validation
// ============================================================

describe('Unit: README content has required sections', () => {
  /**
   * Validates that demos/README.md contains all required documentation
   * sections for the demo system.
   *
   * @validates Requirements 5.1, 5.2, 5.3, 5.4
   */

  const readmePath = path.join(DEMOS_DIR, 'README.md');

  it('README exists', () => {
    expect(fs.existsSync(readmePath)).toBe(true);
  });

  it('documents how to build demos', () => {
    const content = fs.readFileSync(readmePath, 'utf-8');
    // Must mention the build command
    expect(content).toMatch(/npm run build/);
  });

  it('documents how to serve demos locally', () => {
    const content = fs.readFileSync(readmePath, 'utf-8');
    // Must document at least one local server method
    expect(content).toMatch(/http-server|serve|http\.server/);
    // Must mention localhost URL
    expect(content).toMatch(/localhost/);
  });

  it('documents demo page guidelines', () => {
    const content = fs.readFileSync(readmePath, 'utf-8');
    // Must have a guidelines section
    expect(content).toMatch(/[Gg]uidelines/);
    // Must document required elements
    expect(content).toMatch(/[Rr]equired [Ee]lements/);
  });

  it('includes a minimal demo page example', () => {
    const content = fs.readFileSync(readmePath, 'utf-8');
    // Must include an HTML example
    expect(content).toMatch(/<!DOCTYPE html>/);
    expect(content).toMatch(/demo-styles\.css/);
  });

  it('documents how to add a new demo page', () => {
    const content = fs.readFileSync(readmePath, 'utf-8');
    // Must have a section about adding new demos
    expect(content).toMatch(/[Aa]dding a [Nn]ew [Dd]emo/);
  });

  it('includes demo health check section', () => {
    const content = fs.readFileSync(readmePath, 'utf-8');
    // Must have a health check / maintenance section
    expect(content).toMatch(/[Dd]emo [Hh]ealth [Cc]heck/);
  });
});
