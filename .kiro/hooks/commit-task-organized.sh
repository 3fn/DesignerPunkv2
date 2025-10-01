#!/bin/bash

# Enhanced Task Completion Commit Hook with Organization
# Purpose: Commit task completion with optional file organization
# Approach: Human-controlled organization with hook assistance
# Date: January 10, 2025

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🚀${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Function to show help
show_help() {
    cat << EOF
Enhanced Task Completion Commit Hook with Organization

USAGE:
    $0 "Task Name" [OPTIONS]

OPTIONS:
    --organize          Run file organization before commit
    --validate-metadata Validate metadata before commit
    --help, -h          Show this help message

DESCRIPTION:
    Commits task completion with optional file organization based on metadata.
    
    The hook will:
    1. Optionally organize files based on **Organization** metadata
    2. Validate metadata if requested
    3. Check for changes to commit
    4. Commit with standardized task completion message
    5. Push changes to GitHub

EXAMPLES:
    $0 "1. Create North Star Vision"
    $0 "7. Validate Strategic Framework" --organize
    $0 "2. System Analysis" --validate-metadata --organize

EOF
}

# Function to validate task name format
validate_task_name() {
    local task_name="$1"
    
    if [[ -z "$task_name" ]]; then
        print_error "Task name is required"
        echo "Usage: $0 \"Task Name\" [--organize]"
        return 1
    fi
    
    # Check if task name follows expected format (number. description)
    if [[ ! "$task_name" =~ ^[0-9]+\. ]]; then
        print_warning "Task name doesn't follow expected format: 'N. Description'"
        print_warning "Proceeding with provided name: $task_name"
    fi
    
    return 0
}

# Function to run file organization
run_organization() {
    print_status "Running file organization..."
    
    if [[ -x ".kiro/hooks/organize-by-metadata.sh" ]]; then
        ./.kiro/hooks/organize-by-metadata.sh
        local org_result=$?
        
        if [[ $org_result -eq 0 ]]; then
            print_success "File organization completed"
            return 0
        else
            print_error "File organization failed"
            return 1
        fi
    else
        print_error "Organization hook not found or not executable: .kiro/hooks/organize-by-metadata.sh"
        return 1
    fi
}

# Function to validate metadata
validate_metadata() {
    print_status "Validating metadata..."
    
    if [[ -x ".kiro/hooks/organize-by-metadata.sh" ]]; then
        ./.kiro/hooks/organize-by-metadata.sh --validate-only
        local validation_result=$?
        
        if [[ $validation_result -eq 0 ]]; then
            print_success "Metadata validation passed"
            return 0
        else
            print_error "Metadata validation failed"
            return 1
        fi
    else
        print_error "Organization hook not found for validation: .kiro/hooks/organize-by-metadata.sh"
        return 1
    fi
}

# Function to check for changes
check_for_changes() {
    print_status "Checking for changes to commit..."
    
    if git diff --quiet && git diff --cached --quiet; then
        print_error "No changes to commit"
        return 1
    fi
    
    print_success "Changes detected, preparing commit..."
    return 0
}

# Function to commit and push
commit_and_push() {
    local task_name="$1"
    local commit_message="Task Complete: $task_name"
    
    print_status "Committing with message: $commit_message"
    
    # Add all changes
    git add -A
    
    # Commit with task completion message
    git commit -m "$commit_message"
    
    print_success "Committed successfully"
    
    # Push to GitHub
    print_status "Pushing to GitHub..."
    git push
    
    if [[ $? -eq 0 ]]; then
        print_success "Task completion committed and pushed successfully!"
        return 0
    else
        print_error "Push failed"
        return 1
    fi
}

# Function to show summary of what will be committed
show_commit_summary() {
    echo
    print_status "Changes to be committed:"
    git status --porcelain | while read -r line; do
        echo "  $line"
    done
    echo
}

# Main function
main() {
    local task_name=""
    local run_organize=false
    local run_validate=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --organize)
                run_organize=true
                shift
                ;;
            --validate-metadata)
                run_validate=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            -*)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
            *)
                if [[ -z "$task_name" ]]; then
                    task_name="$1"
                else
                    print_error "Multiple task names provided. Use quotes for task names with spaces."
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # Validate task name
    if ! validate_task_name "$task_name"; then
        exit 1
    fi
    
    print_status "Starting task completion for: $task_name"
    
    # Run metadata validation if requested
    if [[ "$run_validate" == true ]]; then
        if ! validate_metadata; then
            print_error "Metadata validation failed. Please fix metadata before committing."
            exit 1
        fi
    fi
    
    # Run organization if requested
    if [[ "$run_organize" == true ]]; then
        if ! run_organization; then
            print_error "File organization failed. Please resolve issues before committing."
            exit 1
        fi
    fi
    
    # Check for changes
    if ! check_for_changes; then
        exit 1
    fi
    
    # Show what will be committed
    show_commit_summary
    
    # Confirm commit
    read -p "Proceed with commit and push? [Y/n]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        print_warning "Commit cancelled"
        exit 0
    fi
    
    # Commit and push
    if commit_and_push "$task_name"; then
        print_success "Task completion workflow completed successfully!"
        exit 0
    else
        print_error "Task completion workflow failed"
        exit 1
    fi
}

# Run main function with all arguments
main "$@"