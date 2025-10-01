#!/bin/bash

# Metadata-Driven File Organization Hook
# Purpose: Organize files based on explicit **Organization** metadata
# Approach: Process-first tool development with human-controlled organization
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
    echo -e "${BLUE}📁${NC} $1"
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

# Function to extract metadata from markdown file
extract_metadata() {
    local file="$1"
    local field="$2"
    
    if [[ -f "$file" ]]; then
        grep "^\*\*${field}\*\*:" "$file" | sed "s/^\*\*${field}\*\*: *//" | tr -d '\r'
    fi
}

# Function to validate organization metadata
validate_metadata() {
    local file="$1"
    local organization=$(extract_metadata "$file" "Organization")
    local scope=$(extract_metadata "$file" "Scope")
    
    if [[ -z "$organization" ]]; then
        print_error "Missing **Organization** metadata in $file"
        return 1
    fi
    
    if [[ -z "$scope" ]]; then
        print_error "Missing **Scope** metadata in $file"
        return 1
    fi
    
    # Validate organization values
    case "$organization" in
        "framework-strategic"|"spec-validation"|"spec-completion"|"process-standard"|"working-document")
            return 0
            ;;
        *)
            print_error "Invalid organization value '$organization' in $file"
            print_error "Valid values: framework-strategic, spec-validation, spec-completion, process-standard, working-document"
            return 1
            ;;
    esac
}

# Function to determine target directory based on metadata
get_target_directory() {
    local organization="$1"
    local scope="$2"
    
    case "$organization" in
        "framework-strategic")
            echo "strategic-framework/"
            ;;
        "spec-validation")
            echo ".kiro/specs/${scope}/validation/"
            ;;
        "spec-completion")
            echo ".kiro/specs/${scope}/completion/"
            ;;
        "process-standard")
            echo ".kiro/steering/"
            ;;
        "working-document")
            echo "." # Stay in root
            ;;
        *)
            echo "." # Default to root if unknown
            ;;
    esac
}

# Function to create directory if it doesn't exist
ensure_directory() {
    local dir="$1"
    if [[ "$dir" != "." && ! -d "$dir" ]]; then
        print_status "Creating directory: $dir"
        mkdir -p "$dir"
    fi
}

# Function to move file and update cross-references
organize_file() {
    local file="$1"
    local organization=$(extract_metadata "$file" "Organization")
    local scope=$(extract_metadata "$file" "Scope")
    local target_dir=$(get_target_directory "$organization" "$scope")
    local target_path="${target_dir}$(basename "$file")"
    
    # Skip if already in correct location
    if [[ "$file" == "$target_path" ]]; then
        print_success "Already organized: $file"
        return 0
    fi
    
    # Skip if target would overwrite existing file
    if [[ -f "$target_path" ]]; then
        print_warning "Target exists, skipping: $file -> $target_path"
        return 0
    fi
    
    # Ensure target directory exists
    ensure_directory "$target_dir"
    
    # Move the file
    print_status "Moving: $file -> $target_path"
    mv "$file" "$target_path"
    
    print_success "Organized: $(basename "$file") -> $target_dir"
    
    # Track moved files for cross-reference updates
    echo "$file|$target_path" >> /tmp/organized_files.txt
}

# Function to update cross-references after file moves
update_cross_references() {
    if [[ ! -f /tmp/organized_files.txt ]]; then
        return 0
    fi
    
    print_status "Updating cross-references..."
    
    while IFS='|' read -r old_path new_path; do
        local old_name=$(basename "$old_path")
        local new_relative_path
        
        # Calculate relative path from root to new location
        if [[ "$new_path" == "./"* ]]; then
            new_relative_path="$old_name"
        else
            new_relative_path="$new_path"
        fi
        
        # Update references in all markdown files
        find . -name "*.md" -type f -exec grep -l "\[$old_name\]" {} \; | while read -r ref_file; do
            # Skip if it's the moved file itself
            if [[ "$ref_file" != "./$new_path" ]]; then
                # Calculate relative path from ref_file to new location
                local ref_dir=$(dirname "$ref_file")
                local relative_path=$(python3 -c "
import os
print(os.path.relpath('$new_path', '$ref_dir'))
" 2>/dev/null || echo "$new_relative_path")
                
                # Update the reference
                sed -i.bak "s|\[$old_name\](\([^)]*\)$old_name)|\[$old_name\]($relative_path)|g" "$ref_file"
                rm -f "${ref_file}.bak"
                print_status "Updated reference in: $ref_file"
            fi
        done
    done < /tmp/organized_files.txt
    
    rm -f /tmp/organized_files.txt
    print_success "Cross-references updated"
}

# Main organization function
organize_files() {
    local files_to_organize=()
    local validation_errors=0
    
    print_status "Scanning for files to organize..."
    
    # Find all markdown files in root directory
    while IFS= read -r -d '' file; do
        if [[ -f "$file" && "$file" == *.md ]]; then
            local organization=$(extract_metadata "$file" "Organization")
            if [[ -n "$organization" ]]; then
                if validate_metadata "$file"; then
                    files_to_organize+=("$file")
                else
                    ((validation_errors++))
                fi
            fi
        fi
    done < <(find . -maxdepth 1 -name "*.md" -print0)
    
    if [[ $validation_errors -gt 0 ]]; then
        print_error "Found $validation_errors validation errors. Please fix metadata before organizing."
        return 1
    fi
    
    if [[ ${#files_to_organize[@]} -eq 0 ]]; then
        print_success "No files need organization"
        return 0
    fi
    
    print_status "Found ${#files_to_organize[@]} files to organize:"
    for file in "${files_to_organize[@]}"; do
        local organization=$(extract_metadata "$file" "Organization")
        local scope=$(extract_metadata "$file" "Scope")
        local target_dir=$(get_target_directory "$organization" "$scope")
        echo "  - $(basename "$file") -> $target_dir ($organization, $scope)"
    done
    
    # Confirm organization
    echo
    read -p "Proceed with organization? [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Organization cancelled"
        return 0
    fi
    
    # Initialize tracking file
    rm -f /tmp/organized_files.txt
    touch /tmp/organized_files.txt
    
    # Organize each file
    for file in "${files_to_organize[@]}"; do
        organize_file "$file"
    done
    
    # Update cross-references
    update_cross_references
    
    print_success "Organization complete!"
}

# Function to show help
show_help() {
    cat << EOF
Metadata-Driven File Organization Hook

USAGE:
    $0 [OPTIONS]

OPTIONS:
    --help, -h          Show this help message
    --validate-only     Only validate metadata, don't organize files
    --dry-run          Show what would be organized without moving files

DESCRIPTION:
    Organizes files based on **Organization** metadata in file headers.
    
    Organization Values:
    - framework-strategic: Move to strategic-framework/
    - spec-validation: Move to .kiro/specs/[scope]/validation/
    - spec-completion: Move to .kiro/specs/[scope]/completion/
    - process-standard: Keep in .kiro/steering/
    - working-document: Keep in root directory
    
    The hook will:
    1. Scan for markdown files with Organization metadata
    2. Validate metadata format and values
    3. Prompt for confirmation before moving files
    4. Move files to appropriate directories
    5. Update cross-references in other files

EXAMPLES:
    $0                  # Interactive organization
    $0 --validate-only  # Check metadata without organizing
    $0 --dry-run       # Preview organization without moving files

EOF
}

# Function to validate metadata only
validate_only() {
    local validation_errors=0
    
    print_status "Validating metadata in markdown files..."
    
    while IFS= read -r -d '' file; do
        if [[ -f "$file" && "$file" == *.md ]]; then
            local organization=$(extract_metadata "$file" "Organization")
            if [[ -n "$organization" ]]; then
                if ! validate_metadata "$file"; then
                    ((validation_errors++))
                fi
            else
                print_warning "No Organization metadata in: $file"
            fi
        fi
    done < <(find . -maxdepth 1 -name "*.md" -print0)
    
    if [[ $validation_errors -eq 0 ]]; then
        print_success "All metadata validation passed"
        return 0
    else
        print_error "Found $validation_errors validation errors"
        return 1
    fi
}

# Function to show dry run
dry_run() {
    local files_to_organize=()
    
    print_status "Dry run - showing what would be organized..."
    
    while IFS= read -r -d '' file; do
        if [[ -f "$file" && "$file" == *.md ]]; then
            local organization=$(extract_metadata "$file" "Organization")
            if [[ -n "$organization" ]]; then
                if validate_metadata "$file"; then
                    local scope=$(extract_metadata "$file" "Scope")
                    local target_dir=$(get_target_directory "$organization" "$scope")
                    local target_path="${target_dir}$(basename "$file")"
                    
                    if [[ "$file" != "$target_path" ]]; then
                        echo "  WOULD MOVE: $file -> $target_path"
                        files_to_organize+=("$file")
                    else
                        echo "  ALREADY ORGANIZED: $file"
                    fi
                fi
            fi
        fi
    done < <(find . -maxdepth 1 -name "*.md" -print0)
    
    if [[ ${#files_to_organize[@]} -eq 0 ]]; then
        print_success "No files need organization"
    else
        print_status "Would organize ${#files_to_organize[@]} files"
    fi
}

# Main script logic
main() {
    case "${1:-}" in
        --help|-h)
            show_help
            exit 0
            ;;
        --validate-only)
            validate_only
            exit $?
            ;;
        --dry-run)
            dry_run
            exit 0
            ;;
        "")
            organize_files
            exit $?
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"