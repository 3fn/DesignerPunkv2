/**
 * @category evergreen
 * @purpose Verify HookScripts functionality works correctly
 */
/**
 * Tests for release detection workflow
 * 
 * Validates that the manual release detection workflow is properly documented
 * and that the release-manager.sh script exists and is executable.
 * 
 * Note: The automatic hook files (analyze-after-commit.sh) were never implemented.
 * The current workflow uses manual release detection via release-manager.sh.
 */

import { promises as fs } from 'fs';
import { join } from 'path';

describe('Release Detection Workflow', () => {
  const projectRoot = process.cwd();
  const releaseManagerPath = join(projectRoot, '.kiro/hooks/release-manager.sh');
  const workflowDocPath = join(projectRoot, '.kiro/steering/Development Workflow.md');

  describe('Release Manager Script', () => {
    it('should exist and be executable', async () => {
      const stats = await fs.stat(releaseManagerPath);
      expect(stats.isFile()).toBe(true);
      expect(stats.mode & 0o111).toBeTruthy(); // Check executable bit
    });

    it('should support auto mode for automatic detection', async () => {
      const content = await fs.readFile(releaseManagerPath, 'utf-8');
      
      // Should support 'auto' argument for automatic detection
      expect(content).toContain('auto');
    });

    it('should be documented in workflow', async () => {
      const workflowContent = await fs.readFile(workflowDocPath, 'utf-8');
      
      // Manual workflow should be documented
      expect(workflowContent).toContain('release-manager.sh auto');
      expect(workflowContent).toContain('Manual Release Detection');
    });
  });

  describe('Automatic Hook Configuration', () => {
    const autoHookPath = join(projectRoot, '.kiro/hooks/release-detection-auto.kiro.hook');

    it('should exist', async () => {
      const stats = await fs.stat(autoHookPath);
      expect(stats.isFile()).toBe(true);
    });

    it('should be valid JSON', async () => {
      const content = await fs.readFile(autoHookPath, 'utf-8');
      const config = JSON.parse(content);
      
      expect(config).toBeDefined();
    });

    it('should trigger on summary document creation', async () => {
      const content = await fs.readFile(autoHookPath, 'utf-8');
      const config = JSON.parse(content);
      
      expect(config.when).toBeDefined();
      expect(config.when.type).toBe('fileCreated');
      expect(config.when.patterns).toContain('**/task-*-summary.md');
    });

    it('should execute release-manager.sh', async () => {
      const content = await fs.readFile(autoHookPath, 'utf-8');
      const config = JSON.parse(content);
      
      expect(config.then).toBeDefined();
      expect(config.then.prompt).toContain('release-manager.sh auto');
    });
  });

  describe('Manual Hook Configuration', () => {
    const manualHookPath = join(projectRoot, '.kiro/hooks/release-detection-manual.kiro.hook');

    it('should exist', async () => {
      const stats = await fs.stat(manualHookPath);
      expect(stats.isFile()).toBe(true);
    });

    it('should be valid JSON', async () => {
      const content = await fs.readFile(manualHookPath, 'utf-8');
      const config = JSON.parse(content);
      
      expect(config).toBeDefined();
    });

    it('should have manual trigger', async () => {
      const content = await fs.readFile(manualHookPath, 'utf-8');
      const config = JSON.parse(content);
      
      expect(config.when).toBeDefined();
      expect(config.when.type).toBe('manual');
    });

    it('should execute release-manager.sh', async () => {
      const content = await fs.readFile(manualHookPath, 'utf-8');
      const config = JSON.parse(content);
      
      expect(config.then).toBeDefined();
      expect(config.then.prompt).toContain('release-manager.sh auto');
    });
  });

  describe('Workflow Documentation', () => {
    it('should document manual trigger workflow', async () => {
      const workflowContent = await fs.readFile(workflowDocPath, 'utf-8');
      
      // Should document when to use manual trigger
      expect(workflowContent).toContain('Manual Release Detection');
      expect(workflowContent).toContain('release-manager.sh auto');
    });

    it('should document automatic hook behavior', async () => {
      const workflowContent = await fs.readFile(workflowDocPath, 'utf-8');
      
      // Should document automatic hook triggering on summary document creation
      expect(workflowContent).toContain('summary document');
      expect(workflowContent).toContain('task-*-summary.md');
    });

    it('should document hybrid approach', async () => {
      const workflowContent = await fs.readFile(workflowDocPath, 'utf-8');
      
      // Should document that AI-created files require manual trigger
      expect(workflowContent).toContain('AI-created files');
      expect(workflowContent).toContain('manual trigger');
    });
  });

  describe('Release Manager Features', () => {
    it('should support automatic mode', async () => {
      const content = await fs.readFile(releaseManagerPath, 'utf-8');
      
      // Should support 'auto' mode for automatic detection
      expect(content).toContain('auto');
    });

    it('should create trigger files', async () => {
      const content = await fs.readFile(releaseManagerPath, 'utf-8');
      
      // Should create trigger files in .kiro/release-triggers/
      expect(content).toContain('release-triggers');
    });

    it('should scan for completion documents', async () => {
      const content = await fs.readFile(releaseManagerPath, 'utf-8');
      
      // Should scan for completion documents
      expect(content).toContain('completion');
    });
  });

  describe('Current Implementation', () => {
    it('should use manual workflow instead of automatic hooks', async () => {
      const workflowContent = await fs.readFile(workflowDocPath, 'utf-8');
      
      // Manual workflow should be documented as the current approach
      expect(workflowContent).toContain('release-manager.sh auto');
      expect(workflowContent).toContain('Manual');
    });

    it('should have hook configurations for both automatic and manual triggers', async () => {
      const autoHookPath = join(projectRoot, '.kiro/hooks/release-detection-auto.kiro.hook');
      const manualHookPath = join(projectRoot, '.kiro/hooks/release-detection-manual.kiro.hook');
      
      // Both hook configurations should exist
      const autoExists = await fs.access(autoHookPath).then(() => true).catch(() => false);
      const manualExists = await fs.access(manualHookPath).then(() => true).catch(() => false);
      
      expect(autoExists).toBe(true);
      expect(manualExists).toBe(true);
    });

    it('should document why automatic hook files were not implemented', async () => {
      // The analyze-after-commit.sh files were never implemented
      // because the manual workflow with release-manager.sh was sufficient
      const analyzeHookPath = join(projectRoot, '.kiro/hooks/analyze-after-commit.sh');
      const exists = await fs.access(analyzeHookPath).then(() => true).catch(() => false);
      
      // These files should NOT exist - manual workflow is the current implementation
      expect(exists).toBe(false);
    });
  });
});
