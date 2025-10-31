#!/bin/bash

# Release Manager Hook
# Integrates release management with existing commit and organization hooks
# Triggers release detection and processing during normal workflow

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RELEASE_CONFIG="$PROJECT_ROOT/.kiro/release-config.json"
LOG_FILE="$PROJECT_ROOT/.kiro/logs/release-manager.log"
TRIGGER_DIR="$PROJECT_ROOT/.kiro/release-triggers"

# Ensure required directories exist
mkdir -p "$(dirname "$LOG_FILE")"
mkdir -p "$TRIGGER_DIR"

# Entry logging function
log_entry() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Hook triggered by Kiro IDE agent hook system" >> "$LOG_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Event: taskStatusChange, Status: completed" >> "$LOG_FILE"
}

# Call entry logging at script start
log_entry

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
error() {
    log "ERROR: $1"
    exit 1
}

# Success logging
success() {
    log "SUCCESS: $1"
}

# Check if release management is enabled
check_release_enabled() {
    if [[ ! -f "$RELEASE_CONFIG" ]]; then
        log "Release configuration not found at $RELEASE_CONFIG"
        return 1
    fi
    
    # Check if detection is enabled (basic JSON parsing)
    if grep -q '"specCompletionTrigger":\s*true\|"taskCompletionTrigger":\s*true' "$RELEASE_CONFIG"; then
        return 0
    else
        log "Release detection is disabled in configuration"
        return 1
    fi
}

# Detect release triggers from recent changes
detect_release_triggers() {
    local trigger_type="$1"
    local source_path="$2"
    
    log "Detecting release triggers: type=$trigger_type, source=$source_path"
    
    # Check for spec completion
    if [[ "$trigger_type" == "spec-completion" ]]; then
        if [[ -f "$source_path" && "$source_path" == *"completion"* ]]; then
            log "Spec completion detected: $source_path"
            return 0
        fi
    fi
    
    # Check for task completion
    if [[ "$trigger_type" == "task-completion" ]]; then
        if [[ -f "$source_path" && "$source_path" == *"tasks.md" ]]; then
            # Check if any tasks were marked as completed in recent commits
            if git log -1 --pretty=format:"%s" | grep -q "Task.*Complete"; then
                log "Task completion detected: $source_path"
                return 0
            fi
        fi
    fi
    
    return 1
}

# Process release trigger
process_release_trigger() {
    local trigger_type="$1"
    local source_path="$2"
    
    log "Processing release trigger: $trigger_type from $source_path"
    
    # Create trigger file with enhanced metadata
    local timestamp=$(date +%s)
    local trigger_file="$TRIGGER_DIR/${timestamp}-${trigger_type}.json"
    
    # Get git information
    local git_commit=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    local git_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
    local git_message=$(git log -1 --pretty=format:"%s" 2>/dev/null || echo "unknown")
    
    # Create comprehensive trigger metadata
    cat > "$trigger_file" << EOF
{
  "id": "${timestamp}-${trigger_type}",
  "type": "$trigger_type",
  "source": "$source_path",
  "triggeredAt": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
  "triggeredBy": "hook-system",
  "git": {
    "commit": "$git_commit",
    "branch": "$git_branch",
    "message": "$git_message"
  },
  "workflow": {
    "hookType": "${HOOK_TYPE:-auto}",
    "projectRoot": "$PROJECT_ROOT"
  },
  "status": "pending"
}
EOF
    
    success "Release trigger created: $trigger_file"
    
    # NOTE: TypeScript release system integration disabled due to architectural issues
    # The WorkflowMonitor creates multiple unclearable setInterval timers causing hangs
    log "Trigger queued for manual processing (TypeScript integration disabled)"
}

# Main hook execution
main() {
    local hook_type="${1:-auto}"
    local source_path="${2:-}"
    
    log "Release manager hook started: hook_type=$hook_type, source_path=$source_path"
    
    # Check if release management is enabled
    if ! check_release_enabled; then
        log "Release management is disabled, skipping"
        exit 0
    fi
    
    # Auto-detect triggers if no specific type provided
    if [[ "$hook_type" == "auto" ]]; then
        # Only check files modified in the last commit (not all historical files)
        local recent_files=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")
        
        if [ -n "$recent_files" ]; then
            # Check for spec completion documents in recent changes
            # Use process substitution to avoid subshell issues
            while IFS= read -r completion_doc; do
                if [[ -n "$completion_doc" && -f "$completion_doc" ]] && detect_release_triggers "spec-completion" "$completion_doc"; then
                    process_release_trigger "spec-completion" "$completion_doc"
                fi
            done < <(echo "$recent_files" | grep "completion.*-completion\.md$")
            
            # Check for task completion in tasks.md files in recent changes
            while IFS= read -r tasks_file; do
                if [[ -n "$tasks_file" && -f "$tasks_file" ]] && detect_release_triggers "task-completion" "$tasks_file"; then
                    process_release_trigger "task-completion" "$tasks_file"
                fi
            done < <(echo "$recent_files" | grep "tasks\.md$")
        else
            log "No recent git changes detected, skipping auto-detection"
        fi
    else
        # Process specific trigger type
        if [[ -n "$source_path" ]]; then
            if detect_release_triggers "$hook_type" "$source_path"; then
                process_release_trigger "$hook_type" "$source_path"
            fi
        else
            error "Source path required for specific trigger type: $hook_type"
        fi
    fi
    
    log "Release manager hook completed"
}

# Integration with existing hooks
integrate_with_commit_hook() {
    local commit_message="$1"
    
    log "Integrating with commit hook: $commit_message"
    
    # Check if this is a task completion commit
    if echo "$commit_message" | grep -q "Task.*Complete"; then
        log "Task completion commit detected: $commit_message"
        
        # Extract task information
        local task_info=$(echo "$commit_message" | sed -n 's/.*Task \([0-9.]*\) Complete: \(.*\)/\1|\2/p')
        local task_number=$(echo "$task_info" | cut -d'|' -f1)
        local task_description=$(echo "$task_info" | cut -d'|' -f2)
        
        log "Task details - Number: $task_number, Description: $task_description"
        
        # Process as task completion trigger
        process_release_trigger "task-completion" "task:$task_number:$task_description"
        return
    fi
    
    # Check if this commit includes completion documents
    local completion_files=$(git diff --name-only HEAD~1 HEAD 2>/dev/null | grep "completion.*\.md$" || true)
    if [ -n "$completion_files" ]; then
        log "Completion document changes detected: $completion_files"
        
        # Process each completion document
        echo "$completion_files" | while read -r file; do
            if [ -n "$file" ]; then
                process_release_trigger "spec-completion" "$file"
            fi
        done
        return
    fi
    
    log "No release triggers detected in commit"
}

# Integration with file organization hook
integrate_with_organization_hook() {
    log "Integrating with file organization hook"
    
    # Check for recently organized completion documents
    local organized_completion_files=$(find "$PROJECT_ROOT/.kiro/specs" -name "*completion*.md" -newer "$LOG_FILE" 2>/dev/null || true)
    
    if [ -n "$organized_completion_files" ]; then
        log "Recently organized completion documents detected"
        echo "$organized_completion_files" | while read -r file; do
            if [ -n "$file" ]; then
                log "Processing organized completion document: $file"
                process_release_trigger "spec-completion" "$file"
            fi
        done
    else
        log "No recently organized completion documents found"
    fi
}

# Command-line interface and help
show_help() {
    cat << EOF
Release Manager Hook - Integrates release management with existing workflow hooks

Usage:
    $0 [COMMAND] [OPTIONS]

Commands:
    commit <message>     - Process commit hook integration with release detection
    organize             - Process file organization hook integration
    manual <type> <path> - Manually trigger release detection
    auto                 - Auto-detect release triggers (default)
    status               - Show release system status
    help                 - Show this help message

Examples:
    $0 commit "Task 1.3 Complete: Establish hook system integration points"
    $0 organize
    $0 manual spec-completion .kiro/specs/release-management-system/completion/
    $0 status

Integration Points:
    - Commit hooks: Detects task completion commits and completion document changes
    - Organization hooks: Detects newly organized completion documents
    - File system: Monitors for completion documents and release artifacts
    - TypeScript system: Attempts to process triggers with release detection system

Configuration:
    - Config file: $RELEASE_CONFIG
    - Log file: $LOG_FILE
    - Trigger directory: $TRIGGER_DIR

EOF
}

# Status command
show_status() {
    log "Release Manager Hook Status"
    echo
    echo "Configuration:"
    echo "  Project Root: $PROJECT_ROOT"
    echo "  Config File: $RELEASE_CONFIG"
    echo "  Log File: $LOG_FILE"
    echo "  Trigger Directory: $TRIGGER_DIR"
    echo
    
    echo "System Status:"
    if [ -f "$RELEASE_CONFIG" ]; then
        echo "  ✅ Release configuration found"
    else
        echo "  ❌ Release configuration missing"
    fi
    
    if command -v npm >/dev/null 2>&1; then
        echo "  ✅ npm available"
    else
        echo "  ❌ npm not available"
    fi
    
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        echo "  ✅ package.json found"
    else
        echo "  ❌ package.json missing"
    fi
    
    echo
    echo "Pending Triggers:"
    local pending_count=$(find "$TRIGGER_DIR" -name "*.json" 2>/dev/null | wc -l)
    echo "  Count: $pending_count"
    
    if [ "$pending_count" -gt 0 ]; then
        echo "  Files:"
        find "$TRIGGER_DIR" -name "*.json" -exec basename {} \; 2>/dev/null | head -5
        if [ "$pending_count" -gt 5 ]; then
            echo "  ... and $((pending_count - 5)) more"
        fi
    fi
    
    echo
    echo "Recent Activity:"
    if [ -f "$LOG_FILE" ]; then
        tail -5 "$LOG_FILE" 2>/dev/null || echo "  No recent activity"
    else
        echo "  No log file found"
    fi
}

# Set hook type for context
HOOK_TYPE="${1:-auto}"

# Command-line interface
case "${1:-}" in
    "commit")
        integrate_with_commit_hook "${2:-}"
        ;;
    "organize")
        integrate_with_organization_hook
        ;;
    "manual")
        main "${2:-auto}" "${3:-}"
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        if [ -n "${1:-}" ] && [ "$1" != "auto" ]; then
            echo "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
        fi
        main "${1:-auto}" "${2:-}"
        ;;
esac