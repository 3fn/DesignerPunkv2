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

# Log file location
LOG_FILE=".kiro/logs/file-organization.log"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

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

# Logging functions
log_message() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $1" >> "$LOG_FILE"
}

log_cross_reference_update() {
    local file="$1"
    local links_updated="$2"
    log_message "Updated $links_updated link(s) in $file"
}

log_excluded_file() {
    local file="$1"
    local reason="$2"
    log_message "Skipped $file (reason: $reason)"
}

log_broken_link() {
    local source_file="$1"
    local link_path="$2"
    local target_path="$3"
    log_message "Broken link in $source_file: $link_path -> Target does not exist: $target_path"
}

log_file_organized() {
    local file="$1"
    local target_path="$2"
    log_message "Organized: $file -> $target_path"
}

# Configuration for subdirectory warning (can be disabled by setting to false)
WARN_SUBDIRECTORY_FILES="${WARN_SUBDIRECTORY_FILES:-true}"

# Function to log scanning scope
log_scanning_scope() {
    local current_dir=$(pwd)
    
    print_status "📁 Scanning directory: $current_dir"
    print_status "   Scope: Root directory only (subdirectories excluded by design)"
    print_status "   Rationale: Avoid moving already-organized files"
    
    log_message "=== Scanning Scope ==="
    log_message "Current directory: $current_dir"
    log_message "Scope: Root directory only (subdirectories excluded by design)"
    log_message "Rationale: Completion docs already organized in subdirectories, new files typically appear in root"
}

# Function to scan subdirectories for files with organization metadata
scan_subdirectory_files() {
    if [[ "$WARN_SUBDIRECTORY_FILES" != "true" ]]; then
        return 0
    fi
    
    local subdirectory_files=()
    
    # Find all markdown files in subdirectories (not root) with organization metadata
    # Use find with mindepth 2 to skip root directory files
    while IFS= read -r -d '' file; do
        if [[ -f "$file" && "$file" == *.md ]]; then
            local organization=$(extract_metadata "$file" "Organization")
            if [[ -n "$organization" ]]; then
                subdirectory_files+=("$file")
            fi
        fi
    done < <(find . -mindepth 2 -name "*.md" -type f -print0)
    
    if [[ ${#subdirectory_files[@]} -gt 0 ]]; then
        echo ""
        print_warning "Found ${#subdirectory_files[@]} file(s) with organization metadata in subdirectories (not scanned):"
        log_message "=== Subdirectory Files Warning ==="
        log_message "Found ${#subdirectory_files[@]} file(s) with organization metadata in subdirectories"
        
        for file in "${subdirectory_files[@]}"; do
            local organization=$(extract_metadata "$file" "Organization")
            local scope=$(extract_metadata "$file" "Scope")
            echo "  - $file (Organization: $organization, Scope: $scope)"
            log_message "Subdirectory file not scanned: $file (Organization: $organization, Scope: $scope)"
        done
        
        echo ""
        print_status "These files were not scanned because the organization system only processes root directory files."
        print_status "To organize these files, you can:"
        echo "  1. Move them to the root directory temporarily, then run organization again"
        echo "  2. Manually move them to the appropriate directory based on their metadata"
        echo "  3. Use the organize-by-metadata.sh script directly after moving to root"
        echo ""
        print_status "To disable this warning, set: export WARN_SUBDIRECTORY_FILES=false"
        echo ""
        
        log_message "Subdirectory files warning displayed to user"
    fi
}

# Function to extract metadata from markdown file
extract_metadata() {
    local file="$1"
    local field="$2"
    
    if [[ -f "$file" ]]; then
        grep "^\*\*${field}\*\*:" "$file" | sed "s/^\*\*${field}\*\*: *//" | tr -d '\r'
    fi
}

# Valid organization metadata values
VALID_ORG_VALUES=(
    "framework-strategic"
    "spec-validation"
    "spec-completion"
    "spec-summary"
    "spec-guide"
    "audit-findings"
    "token-documentation"
    "process-standard"
    "working-document"
)

# Directories to exclude from cross-reference updates
EXCLUDED_DIRS=(
    "preserved-knowledge"
    "node_modules"
    ".git"
    ".kiro/logs"
    ".kiro/release-triggers"
)

# Function to validate organization metadata
validate_metadata() {
    local file="$1"
    local organization=$(extract_metadata "$file" "Organization")
    local scope=$(extract_metadata "$file" "Scope")
    
    if [[ -z "$organization" ]]; then
        print_error "Missing **Organization** metadata in $file"
        echo ""
        echo "  Please add organization metadata to the file header:"
        echo "  **Organization**: [value]"
        echo "  **Scope**: [scope]"
        echo ""
        return 1
    fi
    
    if [[ -z "$scope" ]]; then
        print_error "Missing **Scope** metadata in $file"
        echo ""
        echo "  Please add scope metadata to the file header:"
        echo "  **Scope**: [scope]"
        echo ""
        return 1
    fi
    
    # Validate organization values
    local valid=false
    for valid_value in "${VALID_ORG_VALUES[@]}"; do
        if [[ "$organization" == "$valid_value" ]]; then
            valid=true
            break
        fi
    done
    
    if [[ "$valid" == false ]]; then
        print_error "Invalid organization value in $file: '$organization'"
        echo ""
        echo "  Valid organization values are:"
        for valid_value in "${VALID_ORG_VALUES[@]}"; do
            echo "    - $valid_value"
        done
        echo ""
        echo "  Please update the **Organization** metadata in $file to use one of these values."
        echo ""
        return 1
    fi
    
    return 0
}

# Function to check if a path should be excluded from cross-reference updates
is_excluded_path() {
    local file_path="$1"
    
    for excluded_dir in "${EXCLUDED_DIRS[@]}"; do
        if [[ "$file_path" == *"$excluded_dir"* ]]; then
            print_status "⏭️  Skipping $file_path (excluded: $excluded_dir)"
            log_excluded_file "$file_path" "$excluded_dir"
            return 0  # Is excluded
        fi
    done
    
    return 1  # Not excluded
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
        "spec-summary")
            echo "docs/specs/${scope}/"
            ;;
        "spec-guide")
            echo "docs/specs/${scope}/guides/"
            ;;
        "audit-findings")
            echo ".kiro/audits/"
            ;;
        "token-documentation")
            echo "docs/tokens/"
            ;;
        "process-standard")
            echo ".kiro/steering/"
            ;;
        "working-document")
            echo "" # Stay in root (empty string to avoid ./ prefix)
            ;;
        *)
            echo "" # Default to root if unknown (empty string to avoid ./ prefix)
            ;;
    esac
}

# Function to get target path for a file
get_target_path() {
    local file="$1"
    local organization="$2"
    local scope="$3"
    local target_dir=$(get_target_directory "$organization" "$scope")
    local filename=$(basename "$file")
    
    if [[ -z "$target_dir" ]]; then
        echo "$filename"
    else
        echo "${target_dir}${filename}"
    fi
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
    local target_path=$(get_target_path "$file" "$organization" "$scope")
    
    # Skip if already in correct location
    # Normalize paths for comparison (remove ./ prefix)
    local normalized_file="${file#./}"
    if [[ "$normalized_file" == "$target_path" ]]; then
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
    log_file_organized "$file" "$target_path"
    
    # Track moved files for cross-reference updates
    echo "$file|$target_path" >> /tmp/organized_files.txt
}

# Function to check Python availability
check_python_available() {
    if ! command -v python3 &> /dev/null; then
        return 1
    fi
    return 0
}

# Function to display Python installation instructions
show_python_install_instructions() {
    print_warning "Python 3 not found - cross-reference updates will be skipped"
    echo ""
    echo "  To enable cross-reference updates, install Python 3:"
    echo ""
    echo "  macOS:"
    echo "    brew install python3"
    echo ""
    echo "  Linux (Debian/Ubuntu):"
    echo "    sudo apt-get install python3"
    echo ""
    echo "  Linux (RHEL/CentOS):"
    echo "    sudo yum install python3"
    echo ""
    echo "  For other systems, visit: https://www.python.org/downloads/"
    echo ""
}

# Function to validate a markdown link
validate_markdown_link() {
    local source_file="$1"
    local link_path="$2"
    
    # Skip external links (http://, https://, mailto:, etc.)
    if [[ "$link_path" =~ ^[a-zA-Z]+: ]]; then
        return 0
    fi
    
    # Skip anchor-only links (#section)
    if [[ "$link_path" =~ ^# ]]; then
        return 0
    fi
    
    # Remove anchor from link path if present
    local clean_link_path="${link_path%%#*}"
    
    # Calculate absolute path from relative link
    local source_dir=$(dirname "$source_file")
    
    # Use Python to resolve the path
    local target_path
    target_path=$(python3 -c "
import os
import sys
try:
    source_dir = '$source_dir'
    link_path = '$clean_link_path'
    # Resolve the path
    abs_path = os.path.normpath(os.path.join(source_dir, link_path))
    print(abs_path)
    sys.exit(0)
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
    sys.exit(1)
" 2>&1)
    
    local python_exit_code=$?
    
    if [[ $python_exit_code -ne 0 ]]; then
        print_error "Failed to resolve link path: $link_path"
        print_error "  Python error: $target_path"
        return 1
    fi
    
    # Check if target file exists
    if [[ ! -f "$target_path" ]]; then
        print_error "Broken link in $source_file:"
        print_error "  Link: $link_path"
        print_error "  Target does not exist: $target_path"
        log_broken_link "$source_file" "$link_path" "$target_path"
        return 1
    fi
    
    return 0
}

# Function to validate all links in a file
validate_all_links_in_file() {
    local file="$1"
    local broken_links=0
    
    # Extract all markdown links: [text](path)
    # Use Python for reliable cross-platform link extraction
    local links
    links=$(python3 -c "
import re
import sys

try:
    with open('$file', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Match markdown links: [text](path)
    pattern = r'\[([^\]]+)\]\(([^)]+)\)'
    matches = re.findall(pattern, content)
    
    # Print just the paths (second group)
    for match in matches:
        print(match[1])
    
    sys.exit(0)
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
    sys.exit(1)
" 2>&1)
    
    local python_exit_code=$?
    
    if [[ $python_exit_code -ne 0 ]]; then
        print_error "Failed to extract links from $file"
        print_error "  Python error: $links"
        return 1
    fi
    
    # Validate each extracted link
    while IFS= read -r link; do
        if [[ -n "$link" ]]; then
            if ! validate_markdown_link "$file" "$link"; then
                ((broken_links++))
            fi
        fi
    done <<< "$links"
    
    if [[ $broken_links -gt 0 ]]; then
        print_warning "Found $broken_links broken link(s) in $file"
        print_warning "  Manual review recommended"
        return 1
    fi
    
    return 0
}

# Function to update cross-references after file moves
update_cross_references() {
    if [[ ! -f /tmp/organized_files.txt ]]; then
        return 0
    fi
    
    print_status "Updating cross-references..."
    log_message "Starting cross-reference updates"
    
    # Check Python availability
    if ! check_python_available; then
        show_python_install_instructions
        print_warning "Skipping cross-reference updates (Python not available)"
        log_message "Skipping cross-reference updates (Python not available)"
        rm -f /tmp/organized_files.txt
        return 0
    fi
    
    local update_count=0
    local error_count=0
    local files_with_broken_links=()
    
    # Declare associative array to track updates per file
    declare -A file_update_counts
    
    while IFS='|' read -r old_path new_path; do
        local old_name=$(basename "$old_path")
        
        print_status "Processing cross-references for: $old_name"
        print_status "  Old path: $old_path"
        print_status "  New path: $new_path"
        log_message "Processing cross-references for: $old_name (old: $old_path, new: $new_path)"
        
        # Update references in all markdown files
        find . -name "*.md" -type f -exec grep -l "\[$old_name\]" {} \; 2>/dev/null | while read -r ref_file; do
            # Skip if it's the moved file itself
            if [[ "$ref_file" != "./$new_path" ]]; then
                # Check if file is in excluded directory
                if is_excluded_path "$ref_file"; then
                    continue
                fi
                # Calculate relative path from ref_file to new location
                local ref_dir=$(dirname "$ref_file")
                
                # Use Python to calculate relative path with error handling
                local relative_path
                relative_path=$(python3 -c "
import os
import sys
try:
    result = os.path.relpath('$new_path', '$ref_dir')
    print(result)
    sys.exit(0)
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
    sys.exit(1)
" 2>&1)
                
                local python_exit_code=$?
                
                if [[ $python_exit_code -ne 0 ]]; then
                    print_error "Failed to calculate relative path for cross-reference update"
                    print_error "  Reference file: $ref_file"
                    print_error "  Old path: $old_path"
                    print_error "  New path: $new_path"
                    print_error "  Python error: $relative_path"
                    log_message "ERROR: Failed to calculate relative path for $ref_file"
                    ((error_count++))
                    continue
                fi
                
                # Count links before update
                local links_before=$(grep -o "\[$old_name\]([^)]*$old_name)" "$ref_file" 2>/dev/null | wc -l)
                
                # Update the reference
                if sed -i.bak "s|\[$old_name\](\([^)]*\)$old_name)|\[$old_name\]($relative_path)|g" "$ref_file" 2>/dev/null; then
                    rm -f "${ref_file}.bak"
                    
                    # Count links after update (should be 0 if all updated)
                    local links_after=$(grep -o "\[$old_name\]([^)]*$old_name)" "$ref_file" 2>/dev/null | wc -l)
                    local links_updated=$((links_before - links_after))
                    
                    print_status "  Updated reference in: $ref_file -> $relative_path"
                    ((update_count++))
                    
                    # Track updates per file
                    if [[ -z "${file_update_counts[$ref_file]}" ]]; then
                        file_update_counts[$ref_file]=0
                    fi
                    file_update_counts[$ref_file]=$((file_update_counts[$ref_file] + links_updated))
                    
                    # Track file for link validation
                    echo "$ref_file" >> /tmp/files_to_validate.txt
                else
                    print_error "Failed to update reference in: $ref_file"
                    log_message "ERROR: Failed to update reference in $ref_file"
                    ((error_count++))
                fi
            fi
        done
        
        # Log updates per file after processing this moved file
        for ref_file in "${!file_update_counts[@]}"; do
            local count="${file_update_counts[$ref_file]}"
            if [[ $count -gt 0 ]]; then
                log_cross_reference_update "$ref_file" "$count"
            fi
        done
        
        # Clear the array for next iteration
        unset file_update_counts
        declare -A file_update_counts
        
    done < /tmp/organized_files.txt
    
    rm -f /tmp/organized_files.txt
    
    # Validate links in updated files
    if [[ -f /tmp/files_to_validate.txt ]]; then
        print_status "Validating links in updated files..."
        log_message "Starting link validation for updated files"
        
        # Remove duplicates and validate each file
        sort -u /tmp/files_to_validate.txt | while read -r file; do
            if [[ -f "$file" ]]; then
                if ! validate_all_links_in_file "$file"; then
                    files_with_broken_links+=("$file")
                    log_message "Broken links detected in $file"
                fi
            fi
        done
        
        rm -f /tmp/files_to_validate.txt
    fi
    
    # Report results
    echo ""
    if [[ $error_count -gt 0 ]]; then
        print_warning "Cross-reference updates completed with $error_count errors"
        print_warning "Updated $update_count references successfully"
        log_message "Cross-reference updates completed with $error_count errors, $update_count references updated"
    else
        print_success "Cross-references updated successfully ($update_count references)"
        log_message "Cross-references updated successfully ($update_count references)"
    fi
    
    if [[ ${#files_with_broken_links[@]} -gt 0 ]]; then
        echo ""
        print_warning "Files with broken links detected:"
        for file in "${files_with_broken_links[@]}"; do
            echo "  - $file"
            log_message "File with broken links: $file"
        done
        echo ""
        print_warning "Manual review recommended to fix broken links"
        print_warning "Check the error messages above for specific link paths"
        log_message "Manual review recommended for broken links"
    fi
}

# Main organization function
organize_files() {
    local files_to_organize=()
    local validation_errors=0
    
    # Log scanning scope at start
    log_scanning_scope
    echo ""
    
    # Check for subdirectory files with organization metadata (optional warning)
    scan_subdirectory_files
    
    print_status "Scanning for files to organize..."
    log_message "=== File Organization Started ==="
    log_message "Scanning for files to organize"
    
    # Find all markdown files in root directory that need organization
    while IFS= read -r -d '' file; do
        if [[ -f "$file" && "$file" == *.md ]]; then
            local organization=$(extract_metadata "$file" "Organization")
            if [[ -n "$organization" ]]; then
                if validate_metadata "$file"; then
                    # Check if file is already in correct location
                    local scope=$(extract_metadata "$file" "Scope")
                    local target_dir=$(get_target_directory "$organization" "$scope")
                    local target_path=$(get_target_path "$file" "$organization" "$scope")
                    
                    # Only add to organize list if not already in correct location
                    # Normalize paths for comparison (remove ./ prefix)
                    local normalized_file="${file#./}"
                    if [[ "$normalized_file" != "$target_path" ]]; then
                        files_to_organize+=("$file")
                    fi
                else
                    ((validation_errors++))
                fi
            fi
        fi
    done < <(find . -maxdepth 1 -name "*.md" -print0)
    
    if [[ $validation_errors -gt 0 ]]; then
        print_error "Found $validation_errors validation errors. Please fix metadata before organizing."
        log_message "Organization aborted: $validation_errors validation errors"
        return 1
    fi
    
    if [[ ${#files_to_organize[@]} -eq 0 ]]; then
        print_success "No files need organization"
        log_message "No files need organization"
        return 0
    fi
    
    print_status "Found ${#files_to_organize[@]} files to organize:"
    log_message "Found ${#files_to_organize[@]} files to organize"
    for file in "${files_to_organize[@]}"; do
        local organization=$(extract_metadata "$file" "Organization")
        local scope=$(extract_metadata "$file" "Scope")
        local target_dir=$(get_target_directory "$organization" "$scope")
        echo "  - $(basename "$file") -> $target_dir ($organization, $scope)"
        log_message "File to organize: $file -> $target_dir ($organization, $scope)"
    done
    
    # Confirm organization
    echo
    read -p "Proceed with organization? [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Organization cancelled"
        log_message "Organization cancelled by user"
        return 0
    fi
    
    log_message "User confirmed organization"
    
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
    log_message "=== File Organization Completed ==="
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
    - spec-summary: Move to docs/specs/[scope]/
    - spec-guide: Move to docs/specs/[scope]/guides/
    - audit-findings: Move to .kiro/audits/
    - token-documentation: Move to docs/tokens/
    - process-standard: Keep in .kiro/steering/
    - working-document: Keep in root directory
    
    The hook will:
    1. Scan for markdown files with Organization metadata in root directory
    2. Optionally warn about files with metadata in subdirectories (not scanned)
    3. Validate metadata format and values
    4. Prompt for confirmation before moving files
    5. Move files to appropriate directories
    6. Update cross-references in other files

CONFIGURATION:
    WARN_SUBDIRECTORY_FILES    Enable/disable subdirectory file warnings (default: true)
                               Set to false to disable: export WARN_SUBDIRECTORY_FILES=false

EXAMPLES:
    $0                                      # Interactive organization
    $0 --validate-only                      # Check metadata without organizing
    $0 --dry-run                           # Preview organization without moving files
    WARN_SUBDIRECTORY_FILES=false $0       # Run without subdirectory warnings

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
                    local target_path=$(get_target_path "$file" "$organization" "$scope")
                    
                    # Normalize paths for comparison (remove ./ prefix)
                    local normalized_file="${file#./}"
                    if [[ "$normalized_file" != "$target_path" ]]; then
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