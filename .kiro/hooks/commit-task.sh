#!/bin/bash

# Simple wrapper for task completion commits with release analysis integration
# Usage: ./commit-task.sh "Task Name" [--no-analyze]

set -e

TASK_NAME="$1"
TASKS_FILE=".kiro/specs/fresh-repository-roadmap-refinement/tasks.md"
NO_ANALYZE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-analyze)
            NO_ANALYZE=true
            shift
            ;;
        *)
            if [ -z "$TASK_NAME" ]; then
                TASK_NAME="$1"
            fi
            shift
            ;;
    esac
done

if [ -z "$TASK_NAME" ]; then
    echo "❌ Error: Please provide a task name"
    echo "Usage: $0 \"Task Name\" [--no-analyze]"
    exit 1
fi

echo "🚀 Committing completion of: $TASK_NAME"
./.kiro/hooks/task-completion-commit.sh "$TASKS_FILE" "$TASK_NAME"

# Check if release analysis should run
if [ "$NO_ANALYZE" = false ]; then
    # Check if release analysis is enabled in config
    ANALYSIS_ENABLED=true
    CONFIG_FILE=".kiro/release-config.json"
    
    if [ -f "$CONFIG_FILE" ]; then
        # Check if hooks.taskCompletionAnalysis.enabled is false
        if grep -q '"taskCompletionAnalysis"[[:space:]]*:[[:space:]]*{' "$CONFIG_FILE"; then
            if grep -A 10 '"taskCompletionAnalysis"' "$CONFIG_FILE" | grep -q '"enabled"[[:space:]]*:[[:space:]]*false'; then
                ANALYSIS_ENABLED=false
            fi
        # Fallback to old detection.taskCompletionTrigger setting
        elif grep -q '"taskCompletionTrigger"[[:space:]]*:[[:space:]]*false' "$CONFIG_FILE"; then
            ANALYSIS_ENABLED=false
        fi
    fi
    
    if [ "$ANALYSIS_ENABLED" = true ]; then
        echo ""
        echo "📊 Running release analysis..."
        echo "   (This provides immediate feedback on change significance)"
        
        # Run quick analysis mode (non-blocking, fails silently)
        if command -v node &> /dev/null && [ -f "src/release-analysis/cli/quick-analyze.ts" ]; then
            # Use ts-node if available, otherwise try node with compiled version
            if command -v ts-node &> /dev/null; then
                ts-node src/release-analysis/cli/quick-analyze.ts 2>/dev/null || {
                    echo "⚠️  Release analysis failed (non-blocking)"
                    echo "   Run 'npm run release:analyze' for detailed analysis"
                }
            elif [ -f "dist/release-analysis/cli/quick-analyze.js" ]; then
                node dist/release-analysis/cli/quick-analyze.js 2>/dev/null || {
                    echo "⚠️  Release analysis failed (non-blocking)"
                    echo "   Run 'npm run release:analyze' for detailed analysis"
                }
            else
                echo "ℹ️  Release analysis not available (quick-analyze not compiled)"
                echo "   Run 'npm run build' to enable automatic analysis"
            fi
        else
            echo "ℹ️  Release analysis not available (Node.js or quick-analyze.ts not found)"
        fi
        
        echo ""
        echo "💡 Tip: Run 'npm run release:analyze' for detailed analysis anytime"
        echo "   Or use '--no-analyze' flag to skip: ./commit-task.sh \"Task\" --no-analyze"
    else
        echo "ℹ️  Release analysis disabled in configuration"
        echo "   Enable in .kiro/release-config.json: hooks.taskCompletionAnalysis.enabled = true"
    fi
else
    echo "ℹ️  Release analysis skipped (--no-analyze flag)"
fi