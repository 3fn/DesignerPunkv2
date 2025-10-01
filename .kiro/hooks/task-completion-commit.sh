#!/bin/bash

# Task Completion Auto-Commit Hook
# This script automatically commits changes when a task is marked as complete

set -e

# Function to extract task name and commit message from task completion
extract_commit_info() {
    local task_file="$1"
    local task_name="$2"
    
    # Escape special characters in task name for grep
    local escaped_task_name=$(echo "$task_name" | sed 's/[[\.*^$()+?{|]/\\&/g')
    
    # Look for the specific task and its Post-Complete message
    local commit_msg=""
    
    # Try to find the task section and extract its Post-Complete message
    if [ -n "$task_name" ]; then
        # Find the task section and look for Post-Complete within it
        commit_msg=$(awk -v task="$task_name" '
            /^- \[.\]/ { 
                current_task = $0
                in_target_task = (index(current_task, task) > 0)
            }
            in_target_task && /Post-Complete.*Commit.*message/ {
                match($0, /"[^"]*"/)
                if (RSTART > 0) {
                    msg = substr($0, RSTART+1, RLENGTH-2)
                    print msg
                    exit
                }
            }
        ' "$task_file")
    fi
    
    if [ -z "$commit_msg" ]; then
        # Fallback to generic message if no specific message found
        commit_msg="Task Complete: $task_name"
    fi
    
    echo "$commit_msg"
}

# Function to check if there are changes to commit
has_changes() {
    ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]
}

# Main function
main() {
    local task_file="${1:-.kiro/specs/fresh-repository-roadmap-refinement/tasks.md}"
    local task_name="$2"
    
    echo "🔍 Checking for changes to commit..."
    
    if has_changes; then
        echo "📝 Changes detected, preparing commit..."
        
        # Add all changes
        git add .
        
        # Extract commit message
        local commit_msg
        if [ -n "$task_name" ]; then
            commit_msg=$(extract_commit_info "$task_file" "$task_name")
        else
            commit_msg="Auto-commit: Task completion changes"
        fi
        
        echo "💾 Committing with message: $commit_msg"
        git commit -m "$commit_msg"
        
        echo "🚀 Pushing to GitHub..."
        git push origin main
        
        echo "✅ Task completion committed and pushed successfully!"
    else
        echo "ℹ️  No changes to commit"
    fi
}

# Run main function with all arguments
main "$@"