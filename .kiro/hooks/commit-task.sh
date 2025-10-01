#!/bin/bash

# Simple wrapper for task completion commits
# Usage: ./commit-task.sh "Task Name"

set -e

TASK_NAME="$1"
TASKS_FILE=".kiro/specs/fresh-repository-roadmap-refinement/tasks.md"

if [ -z "$TASK_NAME" ]; then
    echo "❌ Error: Please provide a task name"
    echo "Usage: $0 \"Task Name\""
    exit 1
fi

echo "🚀 Committing completion of: $TASK_NAME"
./.kiro/hooks/task-completion-commit.sh "$TASKS_FILE" "$TASK_NAME"