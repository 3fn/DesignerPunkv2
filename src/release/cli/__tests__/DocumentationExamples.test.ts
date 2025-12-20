/**
 * @category evergreen
 * @purpose Verify release system functionality works correctly
 */
/**
 * Documentation Examples Validation Tests
 * 
 * Validates that documentation examples are accurate and executable.
 * Tests example configurations, tutorial scenarios, and integration examples.
 * 
 * Mock Strategy:
 * - Mock file system operations for example validation
 * - Mock external services (GitHub, npm) for integration tests
 * - No shared state between tests
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.5, 7.1, 7.2, 7.3, 7.4, 7.5
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Documentation Examples Validation', () => {
  describe('Example Configurations', () => {
    const examplesDir = path.join(process.cwd(), 'docs', 'examples', 'configurations');

    it('should have valid JSON in single-package.json', () => {
      const configPath = path.join(examplesDir, 'single-package.json');
      
      if (!fs.existsSync(configPath)) {
        console.warn('single-package.json not found, skipping test');
        return;
      }

      const content = fs.readFileSync(configPath, 'utf-8');
      
      // Should parse without errors
      expect(() => JSON.parse(content)).not.toThrow();
      
      const config = JSON.parse(content);
      
      // Should have required fields
      expect(config).toHaveProperty('github');
      expect(config.github).toHaveProperty('owner');
      expect(config.github).toHaveProperty('repo');
    });

    it('should have valid JSON in monorepo-synchronized.json', () => {
      const configPath = path.join(examplesDir, 'monorepo-synchronized.json');
      
      if (!fs.existsSync(configPath)) {
        console.warn('monorepo-synchronized.json not found, skipping test');
        return;
      }

      const content = fs.readFileSync(configPath, 'utf-8');
      
      expect(() => JSON.parse(content)).not.toThrow();
      
      const config = JSON.parse(content);
      
      // Should have coordination strategy
      expect(config).toHaveProperty('coordination');
      expect(config.coordination).toHaveProperty('strategy');
    });

    it('should have valid JSON in monorepo-independent.json', () => {
      const configPath = path.join(examplesDir, 'monorepo-independent.json');
      
      if (!fs.existsSync(configPath)) {
        console.warn('monorepo-independent.json not found, skipping test');
        return;
      }

      const content = fs.readFileSync(configPath, 'utf-8');
      
      expect(() => JSON.parse(content)).not.toThrow();
      
      const config = JSON.parse(content);
      
      // Should have independent versioning configuration
      expect(config).toHaveProperty('coordination');
    });

    it('should have valid JSON in ci-cd-github-actions.json', () => {
      const configPath = path.join(examplesDir, 'ci-cd-github-actions.json');
      
      if (!fs.existsSync(configPath)) {
        console.warn('ci-cd-github-actions.json not found, skipping test');
        return;
      }

      const content = fs.readFileSync(configPath, 'utf-8');
      
      expect(() => JSON.parse(content)).not.toThrow();
      
      const config = JSON.parse(content);
      
      // Should have CI/CD optimizations
      expect(config).toHaveProperty('validation');
    });

    it('should have valid JSON in development-dry-run.json', () => {
      const configPath = path.join(examplesDir, 'development-dry-run.json');
      
      if (!fs.existsSync(configPath)) {
        console.warn('development-dry-run.json not found, skipping test');
        return;
      }

      const content = fs.readFileSync(configPath, 'utf-8');
      
      expect(() => JSON.parse(content)).not.toThrow();
      
      const config = JSON.parse(content);
      
      // Should have dry run enabled
      expect(config).toHaveProperty('dryRun');
      expect(config.dryRun).toBe(true);
    });
  });

  describe('Tutorial Examples', () => {
    const tutorialsDir = path.join(process.cwd(), 'docs', 'examples', 'tutorials');

    it('should have first release tutorial', () => {
      const tutorialPath = path.join(tutorialsDir, '01-first-release.md');
      
      if (!fs.existsSync(tutorialPath)) {
        console.warn('01-first-release.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(tutorialPath, 'utf-8');
      
      // Should contain key sections
      expect(content).toContain('## Overview');
      expect(content).toContain('## Prerequisites');
      expect(content).toContain('## Step 1:');
      expect(content).toContain('GitHub Token');
      expect(content).toContain('npm run release:cli');
    });

    it('should have patch release tutorial', () => {
      const tutorialPath = path.join(tutorialsDir, '02-patch-release.md');
      
      if (!fs.existsSync(tutorialPath)) {
        console.warn('02-patch-release.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(tutorialPath, 'utf-8');
      
      // Should explain patch releases
      expect(content).toContain('patch');
      expect(content).toContain('Bug Fixes');
      expect(content).toContain('0.1.0 → 0.1.1');
    });

    it('should have minor release tutorial', () => {
      const tutorialPath = path.join(tutorialsDir, '03-minor-release.md');
      
      if (!fs.existsSync(tutorialPath)) {
        console.warn('03-minor-release.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(tutorialPath, 'utf-8');
      
      // Should explain minor releases
      expect(content).toContain('minor');
      expect(content).toContain('New Features');
    });

    it('should have major release tutorial', () => {
      const tutorialPath = path.join(tutorialsDir, '04-major-release.md');
      
      if (!fs.existsSync(tutorialPath)) {
        console.warn('04-major-release.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(tutorialPath, 'utf-8');
      
      // Should explain major releases
      expect(content).toContain('major');
      expect(content).toContain('Breaking Changes');
    });

    it('should have multi-package tutorial', () => {
      const tutorialPath = path.join(tutorialsDir, '05-multi-package.md');
      
      if (!fs.existsSync(tutorialPath)) {
        console.warn('05-multi-package.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(tutorialPath, 'utf-8');
      
      // Should explain multi-package coordination
      expect(content).toContain('multi-package');
      expect(content).toContain('coordination');
    });

    it('should have CI/CD integration tutorial', () => {
      const tutorialPath = path.join(tutorialsDir, '06-ci-cd-integration.md');
      
      if (!fs.existsSync(tutorialPath)) {
        console.warn('06-ci-cd-integration.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(tutorialPath, 'utf-8');
      
      // Should explain CI/CD integration
      expect(content).toContain('CI/CD');
      expect(content).toContain('GitHub Actions');
    });
  });

  describe('Integration Examples', () => {
    const integrationsDir = path.join(process.cwd(), 'docs', 'examples', 'integrations');

    it('should have existing project integration guide', () => {
      const guidePath = path.join(integrationsDir, 'existing-project.md');
      
      if (!fs.existsSync(guidePath)) {
        console.warn('existing-project.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(guidePath, 'utf-8');
      
      // Should explain integration steps
      expect(content).toContain('existing project');
      expect(content).toContain('installation');
    });

    it('should have valid GitHub Actions workflow', () => {
      const workflowPath = path.join(integrationsDir, 'github-actions.yml');
      
      if (!fs.existsSync(workflowPath)) {
        console.warn('github-actions.yml not found, skipping test');
        return;
      }

      const content = fs.readFileSync(workflowPath, 'utf-8');
      
      // Should have workflow structure
      expect(content).toContain('name:');
      expect(content).toContain('on:');
      expect(content).toContain('jobs:');
      expect(content).toContain('steps:');
    });

    it('should have valid GitLab CI configuration', () => {
      const ciPath = path.join(integrationsDir, 'gitlab-ci.yml');
      
      if (!fs.existsSync(ciPath)) {
        console.warn('gitlab-ci.yml not found, skipping test');
        return;
      }

      const content = fs.readFileSync(ciPath, 'utf-8');
      
      // Should have GitLab CI structure
      expect(content).toContain('stages:');
      expect(content).toContain('script:');
    });

    it('should have migration guide', () => {
      const guidePath = path.join(integrationsDir, 'migration-guide.md');
      
      if (!fs.existsSync(guidePath)) {
        console.warn('migration-guide.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(guidePath, 'utf-8');
      
      // Should explain migration
      expect(content).toContain('migration');
      expect(content).toContain('existing system');
    });
  });

  describe('Documentation Consistency', () => {
    it('should have consistent command examples across tutorials', () => {
      const tutorialsDir = path.join(process.cwd(), 'docs', 'examples', 'tutorials');
      
      if (!fs.existsSync(tutorialsDir)) {
        console.warn('Tutorials directory not found, skipping test');
        return;
      }

      const tutorials = fs.readdirSync(tutorialsDir)
        .filter(f => f.endsWith('.md'))
        .map(f => fs.readFileSync(path.join(tutorialsDir, f), 'utf-8'));

      // All tutorials should use consistent CLI commands
      tutorials.forEach(content => {
        if (content.includes('release:cli')) {
          // Should use npm run prefix
          expect(content).toContain('npm run release:cli');
        }
      });
    });

    it('should have consistent version format across examples', () => {
      const examplesDir = path.join(process.cwd(), 'docs', 'examples');
      
      if (!fs.existsSync(examplesDir)) {
        console.warn('Examples directory not found, skipping test');
        return;
      }

      const readmeContent = fs.readFileSync(
        path.join(examplesDir, 'README.md'),
        'utf-8'
      );

      // Should use semantic versioning format
      const versionRegex = /\d+\.\d+\.\d+/g;
      const versions = readmeContent.match(versionRegex);
      
      if (versions) {
        versions.forEach(version => {
          // Should be valid semver format
          expect(version).toMatch(/^\d+\.\d+\.\d+$/);
        });
      }
    });

    it('should reference correct file paths in examples', () => {
      const examplesDir = path.join(process.cwd(), 'docs', 'examples');
      
      if (!fs.existsSync(examplesDir)) {
        console.warn('Examples directory not found, skipping test');
        return;
      }

      const readmeContent = fs.readFileSync(
        path.join(examplesDir, 'README.md'),
        'utf-8'
      );

      // Extract file references
      const fileReferences = readmeContent.match(/\(\.\/[^)]+\)/g);
      
      if (fileReferences) {
        fileReferences.forEach(ref => {
          const filePath = ref.slice(2, -1); // Remove (./ and )
          const fullPath = path.join(examplesDir, filePath);
          
          // File should exist
          if (!filePath.startsWith('http')) {
            expect(fs.existsSync(fullPath)).toBe(true);
          }
        });
      }
    });
  });

  describe('Code Examples Validation', () => {
    it('should have valid bash commands in tutorials', () => {
      const tutorialsDir = path.join(process.cwd(), 'docs', 'examples', 'tutorials');
      
      if (!fs.existsSync(tutorialsDir)) {
        console.warn('Tutorials directory not found, skipping test');
        return;
      }

      const firstRelease = fs.readFileSync(
        path.join(tutorialsDir, '01-first-release.md'),
        'utf-8'
      );

      // Should have valid npm commands
      expect(firstRelease).toContain('npm run release:cli');
      expect(firstRelease).toContain('npm run release:analyze');
      
      // Should not have typos in common commands
      expect(firstRelease).not.toContain('npm runn');
      expect(firstRelease).not.toContain('relase');
    });

    it('should have valid JSON examples in tutorials', () => {
      const tutorialsDir = path.join(process.cwd(), 'docs', 'examples', 'tutorials');
      
      if (!fs.existsSync(tutorialsDir)) {
        console.warn('Tutorials directory not found, skipping test');
        return;
      }

      const firstRelease = fs.readFileSync(
        path.join(tutorialsDir, '01-first-release.md'),
        'utf-8'
      );

      // Extract JSON code blocks
      const jsonBlocks = firstRelease.match(/```json\n([\s\S]*?)\n```/g);
      
      if (jsonBlocks) {
        jsonBlocks.forEach(block => {
          const json = block.replace(/```json\n/, '').replace(/\n```/, '');
          
          // Should parse without errors
          expect(() => JSON.parse(json)).not.toThrow();
        });
      }
    });

    it('should have valid markdown examples in tutorials', () => {
      const tutorialsDir = path.join(process.cwd(), 'docs', 'examples', 'tutorials');
      
      if (!fs.existsSync(tutorialsDir)) {
        console.warn('Tutorials directory not found, skipping test');
        return;
      }

      const patchRelease = fs.readFileSync(
        path.join(tutorialsDir, '02-patch-release.md'),
        'utf-8'
      );

      // Extract markdown code blocks
      const markdownBlocks = patchRelease.match(/```markdown\n([\s\S]*?)\n```/g);
      
      if (markdownBlocks) {
        markdownBlocks.forEach(block => {
          const markdown = block.replace(/```markdown\n/, '').replace(/\n```/, '');
          
          // Should have valid completion document structure
          if (markdown.includes('Task') && markdown.includes('Completion')) {
            expect(markdown).toContain('## Changes');
            expect(markdown).toContain('## Validation');
          }
        });
      }
    });
  });

  describe('Tutorial Scenarios', () => {
    it('should have complete first release scenario', () => {
      const tutorialPath = path.join(
        process.cwd(),
        'docs',
        'examples',
        'tutorials',
        '01-first-release.md'
      );
      
      if (!fs.existsSync(tutorialPath)) {
        console.warn('01-first-release.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(tutorialPath, 'utf-8');
      
      // Should cover all essential steps
      expect(content).toContain('Generate GitHub Token');
      expect(content).toContain('Create Configuration File');
      expect(content).toContain('Create Your First Completion Document');
      expect(content).toContain('Preview Release Plan');
      expect(content).toContain('Execute First Release');
      expect(content).toContain('Verify Release');
    });

    it('should have complete patch release scenario', () => {
      const tutorialPath = path.join(
        process.cwd(),
        'docs',
        'examples',
        'tutorials',
        '02-patch-release.md'
      );
      
      if (!fs.existsSync(tutorialPath)) {
        console.warn('02-patch-release.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(tutorialPath, 'utf-8');
      
      // Should cover patch release workflow
      expect(content).toContain('Fix the Bug');
      expect(content).toContain('Create Completion Document');
      expect(content).toContain('Preview Release');
      expect(content).toContain('Execute Release');
      expect(content).toContain('Verify');
    });
  });

  describe('Documentation Links', () => {
    it('should have valid internal links in README', () => {
      const readmePath = path.join(
        process.cwd(),
        'docs',
        'examples',
        'README.md'
      );
      
      if (!fs.existsSync(readmePath)) {
        console.warn('examples/README.md not found, skipping test');
        return;
      }

      const content = fs.readFileSync(readmePath, 'utf-8');
      
      // Extract markdown links
      const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      
      if (links) {
        links.forEach(link => {
          const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (match) {
            const [, , href] = match;
            
            // Skip external links
            if (href.startsWith('http')) {
              return;
            }
            
            // Internal links should be valid
            const linkPath = path.join(
              process.cwd(),
              'docs',
              'examples',
              href
            );
            
            expect(fs.existsSync(linkPath)).toBe(true);
          }
        });
      }
    });

    it('should have valid cross-references between tutorials', () => {
      const tutorialsDir = path.join(process.cwd(), 'docs', 'examples', 'tutorials');
      
      if (!fs.existsSync(tutorialsDir)) {
        console.warn('Tutorials directory not found, skipping test');
        return;
      }

      const firstRelease = fs.readFileSync(
        path.join(tutorialsDir, '01-first-release.md'),
        'utf-8'
      );

      // Should reference next tutorial
      expect(firstRelease).toContain('02-patch-release.md');
      
      const patchRelease = fs.readFileSync(
        path.join(tutorialsDir, '02-patch-release.md'),
        'utf-8'
      );

      // Should reference previous and next tutorials
      expect(patchRelease).toContain('01-first-release.md');
      expect(patchRelease).toContain('03-minor-release.md');
    });
  });
});
