#!/bin/bash

# Kiro Agent Hook: Organize Files After Task Completion
# Purpose: Automatically organize files based on metadata when tasks are completed
# Trigger: Task status changes to "completed"
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
    echo -e "${BLUE}🤖${NC} [Agent Hook] $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} [Agent Hook] $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} [Agent Hook] $1"
}

print_error() {
    echo -e "${RED}❌${NC} [Agent Hook] $1"
}

# Function to check if organization hook exists
check_organization_hook() {
    if [[ ! -x ".kiro/hooks/organize-by-metadata.sh" ]]; then
        print_error "Organization hook not found or not executable: .kiro/hooks/organize-by-metadata.sh"
        return 1
    fi
    return 0
}

# Function to validate metadata and check for files needing organization
check_for_organization_needs() {
    print_status "Checking for files that need organization..."
    
    # Run validation to check metadata
    local validation_output
    validation_output=$(./.kiro/hooks/organize-by-metadata.sh --validate-only 2>&1)
    local validation_result=$?
    
    # Run dry-run to check for files needing organization
    local dryrun_output
    dryrun_output=$(./.kiro/hooks/organize-by-metadata.sh --dry-run 2>&1)
    local dryrun_result=$?
    
    # Check if there are files to organize
    if echo "$dryrun_output" | grep -q "WOULD MOVE:"; then
        print_status "Found files that need organization:"
        echo "$dryrun_output" | grep "WOULD MOVE:" | sed 's/^/  /'
        return 0
    elif echo "$dryrun_output" | grep -q "No files need organization"; then
        print_success "All files are already properly organized"
        return 1
    else
        print_warning "Unable to determine organization status"
        echo "$dryrun_output"
        return 1
    fi
}

# Function to prompt user for organization
prompt_for_organization() {
    echo
    print_status "Would you like to organize these files now?"
    echo "This will:"
    echo "  - Move files to appropriate directories based on their **Organization** metadata"
    echo "  - Update cross-references automatically"
    echo "  - Commit the organization changes"
    echo
    read -p "Proceed with automatic organization? [y/N]: " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        print_warning "Organization skipped by user"
        return 1
    fi
}

# Function to run organization
run_organization() {
    print_status "Running file organization..."
    
    # Run the organization hook
    if ./.kiro/hooks/organize-by-metadata.sh; then
        print_success "File organization completed successfully"
        return 0
    else
        print_error "File organization failed"
        return 1
    fi
}

# Function to commit organization changes
commit_organization_changes() {
    print_status "Committing organization changes..."
    
    # Check if there are changes to commit
    if git diff --quiet && git diff --cached --quiet; then
        print_warning "No organization changes to commit"
        return 0
    fi
    
    # Add all changes
    git add -A
    
    # Commit with descriptive message
    local commit_message="Auto-organize files after task completion

- Organized files based on **Organization** metadata
- Updated cross-references to maintain link integrity  
- Applied File Organization Standards automatically"
    
    if git commit -m "$commit_message"; then
        print_success "Organization changes committed"
        
        # Push changes
        print_status "Pushing organization changes..."
        if git push; then
            print_success "Organization changes pushed to GitHub"
            return 0
        else
            print_error "Failed to push organization changes"
            return 1
        fi
    else
        print_error "Failed to commit organization changes"
        return 1
    fi
}

# Main function
main() {
    print_status "Task completion detected - checking for file organization needs..."
    
    # Check if organization hook exists
    if ! check_organization_hook; then
        print_error "Cannot run organization - hook not available"
        exit 1
    fi
    
    # Check if files need organization
    if check_for_organization_needs; then
        # Files need organization - prompt user
        if prompt_for_organization; then
            # User confirmed - run organization
            if run_organization; then
                # Organization successful - commit changes
                if commit_organization_changes; then
                    print_success "Automatic file organization completed successfully!"
                else
                    print_warning "Organization completed but commit failed"
                fi
            else
                print_error "Organization failed - no changes committed"
                exit 1
            fi
        else
            print_status "Organization skipped - files remain in current locations"
        fi
    else
        print_success "No organization needed - all files are properly organized"
    fi
    
    print_success "Task completion organization check complete"
}

# Show help if requested
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    cat << EOF
Kiro Agent Hook: Organize Files After Task Completion

DESCRIPTION:
    Automatically checks for and organizes files based on **Organization** 
    metadata when tasks are completed.

USAGE:
    $0 [--help]

WORKFLOW:
    1. Check for files needing organization
    2. Show preview of what would be organized
    3. Prompt user for confirmation
    4. Organize files and update cross-references
    5. Commit and push organization changes

INTEGRATION:
    This hook is designed to be triggered automatically by Kiro when
    task status changes to "completed". It can also be run manually
    for testing or troubleshooting.

EOF
    exit 0
fi

# Run main function
main "$@"