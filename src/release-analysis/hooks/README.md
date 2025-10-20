# Release Analysis Hook Integration

This module provides automatic triggering of release analysis via Git hooks or Kiro agent hooks, enabling immediate feedback on change significance after task completion commits.

## Overview

The Hook Integration Manager allows the release analysis system to automatically run after task completions, providing:

- **Immediate Feedback**: AI agents get instant analysis of change significance
- **Quick Analysis Mode**: Optimized analysis completes in <10 seconds
- **Concise Output**: Summary suitable for AI agent context
- **Result Caching**: Full results cached for later detailed CLI review
- **Graceful Failure**: Analysis failures don't block commits

## Architecture

```
Task Completion → Commit Hook → Quick Analysis → Concise Feedback
                                      ↓
                              Cache Full Results
                                      ↓
                          CLI Access for Details
```

## Hook Types

### Git Hook
- **Location**: `.kiro/hooks/analyze-after-commit.sh`
- **Trigger**: Post-commit (integrated with `commit-task.sh`)
- **Use Case**: Automatic analysis after any commit

### Agent Hook
- **Location**: `.kiro/agent-hooks/analyze-after-commit.sh`
- **Configuration**: `.kiro/agent-hooks/release-analysis-on-task-completion.json`
- **Trigger**: Kiro agent task completion events
- **Use Case**: Automatic analysis after task status changes to "completed"

## Installation

### Using CLI Commands

```bash
# Install Git hook
npm run hooks:install -- --type git

# Install agent hook
npm run hooks:install -- --type agent

# Install both hooks
npm run hooks:install -- --type both

# Install with custom configuration
npm run hooks:install -- --type git --timeout 15 --no-quick
```

### Using API

```typescript
import { HookIntegrationManager } from './hooks/HookIntegrationManager';
import { AnalysisConfigManager } from './config/AnalysisConfigManager';

// Load configuration
const configManager = new AnalysisConfigManager();
const config = await configManager.loadConfig();

// Create hook configuration
const hookConfig = {
  enabled: true,
  hookType: 'git',
  quickMode: true,
  timeoutSeconds: 10,
  failSilently: true,
  cacheResults: true
};

// Create manager and install hook
const manager = new HookIntegrationManager(config, hookConfig);
const result = await manager.installHook('git');

if (result.success) {
  console.log('Hook installed:', result.hookPath);
}
```

## Configuration

### Hook Configuration Options

```typescript
interface HookConfig {
  /** Enable/disable hook integration */
  enabled: boolean;

  /** Type of hook to use */
  hookType: 'git' | 'agent' | 'both';

  /** Use quick mode for faster analysis */
  quickMode: boolean;

  /** Maximum time before giving up (seconds) */
  timeoutSeconds: number;

  /** Don't block commit on failure */
  failSilently: boolean;

  /** Cache results for later CLI access */
  cacheResults: boolean;
}
```

### Default Configuration

```typescript
{
  enabled: true,
  hookType: 'git',
  quickMode: true,
  timeoutSeconds: 10,
  failSilently: true,
  cacheResults: true
}
```

## Usage

### Check Hook Status

```bash
npm run hooks:status
```

Output:
```
📊 Release Analysis Hook Status

Configuration:
  Enabled: yes
  Hook Type: git
  Quick Mode: enabled
  Timeout: 10 seconds
  Fail Silently: yes
  Cache Results: yes

Installation Status:
  ✅ Installed and valid
```

### Validate Hook Installation

```bash
npm run hooks:validate
```

Output:
```
🔍 Validating release analysis hooks...

Hook Type: git
Status: ✅ Valid

Permissions: 755
Executable: yes

✅ All hooks are properly configured!
```

### Uninstall Hooks

```bash
# Uninstall Git hook
npm run hooks:uninstall -- --type git

# Uninstall agent hook
npm run hooks:uninstall -- --type agent

# Uninstall all hooks
npm run hooks:uninstall -- --type both
```

## Quick Analysis Mode

Quick mode provides optimized analysis that completes in <10 seconds:

### Features
- Lightweight extraction (pattern-based only)
- Minimal validation
- Concise output format
- Result caching for later review

### Output Format

```typescript
interface QuickAnalysisResult {
  versionBump: 'major' | 'minor' | 'patch' | 'none';
  changeCount: {
    breaking: number;
    features: number;
    fixes: number;
    improvements: number;
  };
  confidence: number;
  summary: string;
  fullResultCached: boolean;
}
```

### Example Output

```
🔍 Analyzing changes for release...

Version Bump: minor
Changes: 2 features, 1 fix
Confidence: 85%
Summary: Added token validation system and fixed baseline grid alignment

✅ Full analysis cached - run 'npm run release:analyze' for details
```

## Integration with Task Completion Workflow

### Automatic Workflow

1. AI agent completes task
2. Task completion commit is made
3. Hook triggers automatically
4. Quick analysis runs (<10 seconds)
5. Concise feedback provided to agent
6. Full results cached for later review

### Manual Review

```bash
# View cached results
npm run release:analyze -- --cached

# Run full analysis
npm run release:analyze
```

## Error Handling

### Graceful Failure

By default, hooks fail silently to avoid blocking commits:

```bash
# Analysis fails but commit succeeds
git commit -m "Task 1.1 Complete: Implement feature"
🔍 Analyzing changes for release...
⚠️  Release analysis failed (non-blocking)
✅ Task completion committed and pushed successfully!
```

### Blocking Mode

For critical workflows, disable silent failure:

```bash
npm run hooks:install -- --type git --no-fail-silently
```

### Timeout Handling

Analysis automatically times out after configured duration:

```bash
# Default 10 second timeout
npm run hooks:install -- --type git --timeout 10

# Longer timeout for complex analysis
npm run hooks:install -- --type git --timeout 30
```

## Troubleshooting

### Hook Not Running

1. Check hook is installed:
   ```bash
   npm run hooks:status
   ```

2. Validate hook configuration:
   ```bash
   npm run hooks:validate
   ```

3. Check hook permissions:
   ```bash
   ls -la .kiro/hooks/analyze-after-commit.sh
   # Should show: -rwxr-xr-x (executable)
   ```

### Analysis Timing Out

1. Increase timeout:
   ```bash
   npm run hooks:install -- --type git --timeout 30
   ```

2. Ensure quick mode is enabled:
   ```bash
   npm run hooks:install -- --type git --quick
   ```

3. Check for large completion documents

### Hook Blocking Commits

1. Enable silent failure:
   ```bash
   npm run hooks:install -- --type git --fail-silently
   ```

2. Temporarily disable hook:
   ```bash
   npm run hooks:uninstall -- --type git
   ```

## API Reference

### HookIntegrationManager

```typescript
class HookIntegrationManager {
  constructor(
    config: AnalysisConfig,
    hookConfig: HookConfig,
    projectRoot?: string
  );

  // Installation
  installHook(hookType: 'git' | 'agent'): Promise<HookInstallationResult>;
  installGitHook(): Promise<HookInstallationResult>;
  installAgentHook(): Promise<HookInstallationResult>;

  // Uninstallation
  uninstallHook(hookType: 'git' | 'agent'): Promise<boolean>;
  uninstallGitHook(): Promise<boolean>;
  uninstallAgentHook(): Promise<boolean>;

  // Validation
  validateHookIntegration(): Promise<HookValidationResult>;
  validateGitHook(): Promise<HookValidationResult>;
  validateAgentHook(): Promise<HookValidationResult>;

  // Configuration
  getHookConfig(): HookConfig;
  updateHookConfig(updates: Partial<HookConfig>): void;
}
```

### Types

```typescript
interface HookInstallationResult {
  success: boolean;
  hookType: 'git' | 'agent';
  hookPath: string;
  messages: string[];
}

interface HookValidationResult {
  valid: boolean;
  hookType: 'git' | 'agent';
  errors: string[];
  warnings: string[];
  permissions?: string;
  executable?: boolean;
}
```

## Best Practices

### For AI Agents

1. **Enable Quick Mode**: Ensures fast feedback without blocking workflow
2. **Cache Results**: Allows detailed review later without re-analysis
3. **Fail Silently**: Prevents analysis failures from blocking task completion

### For Human Review

1. **Use Cached Results**: Access quick analysis results via CLI
2. **Run Full Analysis**: When detailed breakdown is needed
3. **Validate Periodically**: Ensure hooks remain properly configured

### For Team Workflows

1. **Document Hook Configuration**: Share hook settings with team
2. **Standardize Timeout**: Balance speed vs completeness
3. **Monitor Hook Performance**: Track analysis times and failures

## Examples

### Basic Installation

```typescript
import { HookIntegrationManager } from './hooks';
import { DEFAULT_ANALYSIS_CONFIG } from './config';

const hookConfig = {
  enabled: true,
  hookType: 'git' as const,
  quickMode: true,
  timeoutSeconds: 10,
  failSilently: true,
  cacheResults: true
};

const manager = new HookIntegrationManager(
  DEFAULT_ANALYSIS_CONFIG,
  hookConfig
);

await manager.installGitHook();
```

### Custom Configuration

```typescript
const customHookConfig = {
  enabled: true,
  hookType: 'both' as const,
  quickMode: false, // Full analysis
  timeoutSeconds: 30, // Longer timeout
  failSilently: false, // Block on failure
  cacheResults: true
};

const manager = new HookIntegrationManager(
  config,
  customHookConfig
);

// Install both Git and agent hooks
await manager.installHook('git');
await manager.installHook('agent');
```

### Validation and Status

```typescript
// Validate installation
const validation = await manager.validateHookIntegration();

if (!validation.valid) {
  console.error('Hook validation failed:');
  validation.errors.forEach(error => console.error(`  - ${error}`));
}

// Get current configuration
const currentConfig = manager.getHookConfig();
console.log('Current hook configuration:', currentConfig);
```

## See Also

- [Release Analysis CLI](../cli/README.md)
- [Configuration Guide](../config/README.md)
- [Quick Analysis Mode](../docs/usage-guide.md#quick-analysis-mode)
- [Task Completion Workflow](../../../.kiro/hooks/README.md)
