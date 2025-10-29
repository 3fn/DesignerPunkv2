#!/bin/bash

# Cross-Reference Integrity Test Script
# Tests all markdown links in Phase 1 documentation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
total_links=0
broken_links=0
valid_links=0

# Arrays to store results
declare -a broken_link_details
declare -a orphaned_files

echo "🔍 Testing Cross-Reference Integrity for Phase 1 Documentation"
echo "=============================================================="
echo ""

# Phase 1 specs to check
phase1_specs=(
    "mathematical-token-system"
    "cross-platform-build-system"
    "semantic-token-generation"
    "opacity-tokens"
    "blend-tokens"
    "border-width-tokens"
    "shadow-glow-token-system"
    "layering-token-system"
    "typography-token-expansion"
    "primitive-token-formula-standardization"
)

# Function to extract markdown links from a file
extract_links() {
    local file="$1"
    # Extract markdown links: [text](path) or [text](path#anchor)
    grep -oP '\[([^\]]+)\]\(([^)]+)\)' "$file" | grep -oP '\(([^)]+)\)' | tr -d '()' || true
}

# Function to resolve relative path
resolve_path() {
    local source_file="$1"
    local link_path="$2"
    local source_dir=$(dirname "$source_file")
    
    # Remove anchor if present
    local path_without_anchor="${link_path%%#*}"
    
    # Skip external links
    if [[ "$path_without_anchor" =~ ^https?:// ]]; then
        echo "EXTERNAL"
        return
    fi
    
    # Resolve relative path
    local resolved=$(cd "$source_dir" && realpath -m "$path_without_anchor" 2>/dev/null || echo "INVALID")
    echo "$resolved"
}

# Function to check if file exists
check_link() {
    local source_file="$1"
    local link="$2"
    
    ((total_links++))
    
    # Skip external links
    if [[ "$link" =~ ^https?:// ]]; then
        ((valid_links++))
        return 0
    fi
    
    # Resolve the path
    local resolved=$(resolve_path "$source_file" "$link")
    
    if [[ "$resolved" == "INVALID" ]]; then
        ((broken_links++))
        broken_link_details+=("$source_file -> $link (INVALID PATH)")
        return 1
    fi
    
    if [[ "$resolved" == "EXTERNAL" ]]; then
        ((valid_links++))
        return 0
    fi
    
    # Check if target file exists
    if [[ ! -f "$resolved" ]]; then
        ((broken_links++))
        broken_link_details+=("$source_file -> $link (TARGET NOT FOUND: $resolved)")
        return 1
    fi
    
    ((valid_links++))
    return 0
}

# Test links in all Phase 1 specs
echo "📝 Testing links in Phase 1 specs..."
echo ""

for spec in "${phase1_specs[@]}"; do
    spec_dir=".kiro/specs/$spec"
    
    if [[ ! -d "$spec_dir" ]]; then
        echo "⚠️  Spec directory not found: $spec_dir"
        continue
    fi
    
    echo "Checking spec: $spec"
    
    # Find all markdown files in spec
    while IFS= read -r -d '' file; do
        # Extract and test all links
        while IFS= read -r link; do
            if [[ -n "$link" ]]; then
                check_link "$file" "$link"
            fi
        done < <(extract_links "$file")
    done < <(find "$spec_dir" -name "*.md" -type f -print0)
done

echo ""
echo "📊 Cross-Reference Test Results"
echo "================================"
echo "Total links tested: $total_links"
echo -e "${GREEN}Valid links: $valid_links${NC}"
echo -e "${RED}Broken links: $broken_links${NC}"
echo ""

if [[ $broken_links -gt 0 ]]; then
    echo "❌ Broken Links Found:"
    echo "====================="
    for detail in "${broken_link_details[@]}"; do
        echo -e "${RED}  - $detail${NC}"
    done
    echo ""
fi

# Check for orphaned files (files with no incoming references)
echo "🔍 Checking for orphaned files..."
echo ""

# Create a list of all markdown files
declare -A all_files
declare -A referenced_files

for spec in "${phase1_specs[@]}"; do
    spec_dir=".kiro/specs/$spec"
    
    if [[ ! -d "$spec_dir" ]]; then
        continue
    fi
    
    # Add all files to all_files
    while IFS= read -r -d '' file; do
        all_files["$file"]=1
    done < <(find "$spec_dir" -name "*.md" -type f -print0)
done

# Mark files that are referenced
for spec in "${phase1_specs[@]}"; do
    spec_dir=".kiro/specs/$spec"
    
    if [[ ! -d "$spec_dir" ]]; then
        continue
    fi
    
    while IFS= read -r -d '' source_file; do
        while IFS= read -r link; do
            if [[ -n "$link" && ! "$link" =~ ^https?:// ]]; then
                local resolved=$(resolve_path "$source_file" "$link")
                if [[ "$resolved" != "INVALID" && "$resolved" != "EXTERNAL" && -f "$resolved" ]]; then
                    referenced_files["$resolved"]=1
                fi
            fi
        done < <(extract_links "$source_file")
    done < <(find "$spec_dir" -name "*.md" -type f -print0)
done

# Find orphaned files (in all_files but not in referenced_files)
# Exclude requirements.md, design.md, tasks.md as they are entry points
for file in "${!all_files[@]}"; do
    basename=$(basename "$file")
    if [[ -z "${referenced_files[$file]}" && "$basename" != "requirements.md" && "$basename" != "design.md" && "$basename" != "tasks.md" ]]; then
        orphaned_files+=("$file")
    fi
done

if [[ ${#orphaned_files[@]} -gt 0 ]]; then
    echo "⚠️  Orphaned Files (no incoming references):"
    echo "==========================================="
    for file in "${orphaned_files[@]}"; do
        echo -e "${YELLOW}  - $file${NC}"
    done
    echo ""
else
    echo "✅ No orphaned files found"
    echo ""
fi

# Summary
echo "📋 Summary"
echo "=========="
if [[ $broken_links -eq 0 && ${#orphaned_files[@]} -eq 0 ]]; then
    echo -e "${GREEN}✅ All cross-references are valid and no orphaned files found${NC}"
    exit 0
else
    echo -e "${RED}❌ Issues found:${NC}"
    [[ $broken_links -gt 0 ]] && echo -e "${RED}  - $broken_links broken links${NC}"
    [[ ${#orphaned_files[@]} -gt 0 ]] && echo -e "${YELLOW}  - ${#orphaned_files[@]} orphaned files${NC}"
    exit 1
fi
