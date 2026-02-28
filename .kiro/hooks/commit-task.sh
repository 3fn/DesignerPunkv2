#!/bin/bash

# Simple wrapper for task completion commits with release analysis integration
# Usage: ./commit-task.sh "Task Name" [--no-analyze]

set -e

# Display usage information
show_usage() {
  cat << EOF
Usage: commit-task.sh [OPTIONS] "TASK_NAME"

Commit task completion with automatically extracted commit message.

ARGUMENTS:
  TASK_NAME    Name of the completed task (must match task in tasks.md)

OPTIONS:
  -h, --help   Display this help message and exit

EXAMPLES:
  # Commit task completion
  ./commit-task.sh "1. Create North Star Vision Document"
  
  # Display help
  ./commit-task.sh --help
  ./commit-task.sh -h

DESCRIPTION:
  This script automates the commit process for task completions by:
  1. Extracting the commit message from the task name
  2. Adding all changes to git
  3. Committing with the extracted message
  4. Pushing to the remote repository

  The task name must match a task in tasks.md exactly.

SEE ALSO:
  - Development Workflow: .kiro/steering/Development Workflow.md
  - Task completion process documentation

EOF
}

# Check for help flags before processing arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_usage
    exit 0
fi

# Check if task name provided
if [ -z "$1" ]; then
    echo "❌ Error: Task name required"
    echo ""
    show_usage
    exit 1
fi

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
        
        if command -v npx &> /dev/null && [ -f "src/tools/release/cli/release-tool.ts" ]; then
            npx ts-node src/tools/release/cli/release-tool.ts analyze 2>/dev/null || {
                echo "⚠️  Release analysis failed (non-blocking)"
                echo "   Run 'npm run release:analyze' for detailed analysis"
            }
        else
            echo "ℹ️  Release analysis not available (release-tool.ts not found)"
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