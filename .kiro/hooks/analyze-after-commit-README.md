# Release Analysis Hook Integration

This directory contains hook scripts for automatic release analysis after task completion commits.

## Hook Scripts

### Git Hook: `analyze-after-commit.sh`

**Purpose**: Automatically runs release analysis after Git commits

**Features**:
- Quick analysis mode (completes in <10 seconds)
- Graceful failure handling (doesn't block commits)
- Concurrent request handling (prevents multiple analyses running simultaneously)
- Lock file mechanism to avoid conflicts
- Colored output for better visibility

**Usage**:

```bash
# Manual execution
./.kiro/hooks/analyze-after-commit.sh

# Automatic execution (integrate with commit-task.sh)
# The HookIntegrationManager can automatically integrate this
```

**Configuration**:
- `QUICK_MODE`: Set to `--quick` for fast analysis
- `TIMEOUT`: Maximum time in seconds (default: 10)
- `FAIL_SILENTLY`: Set to `true` to not block commits on failure
- `CACHE_RESULTS`: Set to `true` to cache results for later review

### Agent Hook: `analyze-after-commit.sh`

**Purpose**: Automatically runs release analysis via Kiro agent hooks

**Location**: `.kiro/agent-hooks/analyze-after-commit.sh`

**Configuration**: `.kiro/agent-hooks/release-analysis-on-task-completion.json`

**Features**:
- Triggered on task completion events
- Silent operation (no output unless errors)
- Concurrent request handling
- Automatic timeout and failure recovery

**Enabling the Agent Hook**:

1. Edit `.kiro/agent-hooks/release-analysis-on-task-completion.json`
2. Set `"enabled": true`
3. Restart Kiro or reload agent hooks

## Concurrent Request Handling

Both hooks implement concurrent request handling using a lock file mechanism:

- **Lock File**: `.kiro/release-analysis/.analysis-lock`
- **Max Lock Age**: 30 seconds (stale locks are automatically removed)
- **Behavior**: If another analysis is running, subsequent requests are skipped

This prevents multiple analyses from running simultaneously during rapid commits.

## Graceful Failure Handling

Both hooks are configured to fail gracefully:

- **Non-blocking**: Failures don't prevent commits from completing
- **Timeout Protection**: Analysis is killed after 10 seconds
- **Error Suppression**: Errors are logged but don't propagate
- **Lock Cleanup**: Lock files are always removed, even on failure

## Integration with Task Completion Workflow

The Git hook can be automatically integrated with the existing `commit-task.sh` workflow:

```bash
# Using HookIntegrationManager
npm run release:hooks:install git

# This will:
# 1. Create the analyze-after-commit.sh script
# 2. Integrate it with commit-task.sh
# 3. Make it executable
# 4. Validate the installation
```

## Manual Integration

To manually integrate with `commit-task.sh`, add this before the final success message:

```bash
# Release Analysis Integration
if [ -f ".kiro/hooks/analyze-after-commit.sh" ]; then
    echo "🔍 Analyzing changes for release..."
    ".kiro/hooks/analyze-after-commit.sh" || echo "⚠️  Release analysis failed (non-blocking)"
fi
```

## Testing the Hooks

### Test Git Hook

```bash
# Run manually
./.kiro/hooks/analyze-after-commit.sh

# Expected output:
# 🔍 Running release analysis...
# [analysis output]
# ✅ Release analysis complete
```

### Test Agent Hook

```bash
# Run manually
./.kiro/agent-hooks/analyze-after-commit.sh

# Expected: Silent execution (no output unless errors)
```

### Test Concurrent Handling

```bash
# Start first analysis
./.kiro/hooks/analyze-after-commit.sh &

# Immediately start second analysis
./.kiro/hooks/analyze-after-commit.sh

# Expected: Second analysis skips with warning about concurrent execution
```

## Troubleshooting

### Hook Not Running

1. Check if hook is executable: `ls -la .kiro/hooks/analyze-after-commit.sh`
2. Make executable if needed: `chmod +x .kiro/hooks/analyze-after-commit.sh`
3. Check if npm script exists: `npm run release:analyze --help`

### Analysis Timing Out

1. Increase `TIMEOUT` value in hook script
2. Check if repository is very large
3. Consider using `--quick` mode for faster analysis

### Concurrent Lock Issues

1. Check for stale lock file: `ls -la .kiro/release-analysis/.analysis-lock`
2. Remove manually if needed: `rm .kiro/release-analysis/.analysis-lock`
3. Lock files older than 30 seconds are automatically removed

### Agent Hook Not Triggering

1. Check if hook is enabled in configuration
2. Verify Kiro agent hooks are loaded
3. Check Kiro logs for hook execution errors
4. Ensure hook script is executable

## Requirements Addressed

- **9.1**: Automatic analysis triggered after task completion commits
- **9.4**: Graceful failure handling (don't block commits)
- **9.6**: Concurrent request handling for rapid commits

## Related Files

- `src/release-analysis/hooks/HookIntegrationManager.ts` - Hook installation and management
- `src/release-analysis/cli/quick-analyze.ts` - Quick analysis implementation
- `.kiro/hooks/commit-task.sh` - Task completion commit workflow
