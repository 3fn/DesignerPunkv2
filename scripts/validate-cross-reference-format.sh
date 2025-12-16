#!/bin/bash
# Validate cross-reference format from steering documents
# Check for absolute paths, non-descriptive link text, and format consistency
# Skip intentional violations marked with HTML comments

STEERING_DIR=".kiro/steering"
OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/cross-reference-format-validation.md"

echo "# Cross-Reference Format Validation Report" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Validate cross-reference format consistency for MCP server compatibility" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Initialize counters
total_refs=0
absolute_path_refs=0
non_descriptive_refs=0
valid_refs=0

# Arrays to store issues
declare -a absolute_path_issues
declare -a non_descriptive_issues

echo "## Validation Criteria" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "1. **Relative Paths**: All cross-references must use relative paths (not absolute)" >> "$OUTPUT_FILE"
echo "2. **Descriptive Link Text**: Link text must be descriptive (not generic like 'click here')" >> "$OUTPUT_FILE"
echo "3. **Markdown Format**: All links must use proper markdown syntax \`[text](path)\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## Validation Results" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Extract cross-references from steering documents and validate
for file in "$STEERING_DIR"/*.md; do
    intentional_violation_context=false
    
    while IFS= read -r line; do
        # Check if we're entering an intentional violation context
        if [[ $line =~ INTENTIONAL\ VIOLATION ]]; then
            intentional_violation_context=true
            continue
        fi
        
        # Reset context when we exit a code block or hit a new major section
        if [[ $line =~ ^\`\`\`$ ]] && [ "$intentional_violation_context" = true ]; then
            intentional_violation_context=false
            continue
        fi
        
        # Check if line contains a markdown link
        if [[ $line =~ \[([^\]]+)\]\(([^\)]+)\) ]]; then
            link_text="${BASH_REMATCH[1]}"
            link_path="${BASH_REMATCH[2]}"
            
            ((total_refs++))
            
            # Skip validation if this is an intentional violation
            if [ "$intentional_violation_context" = true ]; then
                continue
            fi
            
            # Check for absolute paths
            if [[ $link_path =~ ^https?:// ]] || [[ $link_path =~ ^/ ]] || [[ $link_path =~ ^[A-Za-z]: ]]; then
                ((absolute_path_refs++))
                absolute_path_issues+=("[$link_text]($link_path) in $(basename "$file")")
            fi
            
            # Check for non-descriptive link text
            if [[ $link_text =~ ^(click here|here|this|see this|more|link|document|guide)$ ]] || \
               [[ $link_text =~ ^(Click here|See this document|More information|Guide)$ ]]; then
                ((non_descriptive_refs++))
                non_descriptive_issues+=("[$link_text]($link_path) in $(basename "$file")")
            fi
        fi
    done < "$file"
done

# Calculate valid references
valid_refs=$((total_refs - absolute_path_refs - non_descriptive_refs))

echo "### Summary Statistics" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "- **Total cross-references**: $total_refs" >> "$OUTPUT_FILE"
echo "- **Valid references**: $valid_refs" >> "$OUTPUT_FILE"
echo "- **Absolute path violations**: $absolute_path_refs" >> "$OUTPUT_FILE"
echo "- **Non-descriptive text violations**: $non_descriptive_refs" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Report absolute path issues
if [ $absolute_path_refs -gt 0 ]; then
    echo "### ❌ Absolute Path Violations" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "The following cross-references use absolute paths instead of relative paths:" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    for issue in "${absolute_path_issues[@]}"; do
        echo "- $issue" >> "$OUTPUT_FILE"
    done
    echo "" >> "$OUTPUT_FILE"
fi

# Report non-descriptive text issues
if [ $non_descriptive_refs -gt 0 ]; then
    echo "### ❌ Non-Descriptive Link Text Violations" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "The following cross-references use non-descriptive link text:" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    for issue in "${non_descriptive_issues[@]}"; do
        echo "- $issue" >> "$OUTPUT_FILE"
    done
    echo "" >> "$OUTPUT_FILE"
fi

# Overall validation status
echo "## Overall Validation Status" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

if [ $absolute_path_refs -eq 0 ] && [ $non_descriptive_refs -eq 0 ]; then
    echo "✅ **PASS**: All cross-references follow format standards" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "All $total_refs cross-references use:" >> "$OUTPUT_FILE"
    echo "- Relative paths (not absolute)" >> "$OUTPUT_FILE"
    echo "- Descriptive link text (not generic)" >> "$OUTPUT_FILE"
    echo "- Proper markdown syntax" >> "$OUTPUT_FILE"
else
    echo "❌ **FAIL**: Cross-reference format violations detected" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "**Issues to fix:**" >> "$OUTPUT_FILE"
    if [ $absolute_path_refs -gt 0 ]; then
        echo "- $absolute_path_refs absolute path violations" >> "$OUTPUT_FILE"
    fi
    if [ $non_descriptive_refs -gt 0 ]; then
        echo "- $non_descriptive_refs non-descriptive link text violations" >> "$OUTPUT_FILE"
    fi
fi

echo "" >> "$OUTPUT_FILE"

# Document cross-reference format standards for MCP server
echo "## Cross-Reference Format Standards for MCP Server" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "### Required Format" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "All cross-references must follow these standards for MCP server compatibility:" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "1. **Relative Paths**" >> "$OUTPUT_FILE"
echo "   - Use relative paths from current document location" >> "$OUTPUT_FILE"
echo "   - Format: \`../\` to navigate up, \`./\` for same directory" >> "$OUTPUT_FILE"
echo "   - Example: \`[Design Document](../design.md)\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "2. **Descriptive Link Text**" >> "$OUTPUT_FILE"
echo "   - Link text must clearly identify the target document" >> "$OUTPUT_FILE"
echo "   - Include brief relevance explanation after link" >> "$OUTPUT_FILE"
echo "   - Example: \`[Compositional Color Guide](./guide.md) - Explains color architecture\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "3. **Section Anchors**" >> "$OUTPUT_FILE"
echo "   - Use markdown section anchors for specific sections" >> "$OUTPUT_FILE"
echo "   - Format: \`[Link Text](./document.md#section-name)\`" >> "$OUTPUT_FILE"
echo "   - Example: \`[Design Decisions](../design.md#design-decisions)\`" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "4. **Markdown Syntax**" >> "$OUTPUT_FILE"
echo "   - All links must use proper markdown syntax: \`[text](path)\`" >> "$OUTPUT_FILE"
echo "   - No HTML anchor tags or other formats" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "### MCP Server Requirements" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "The MCP server will use these cross-references to:" >> "$OUTPUT_FILE"
echo "- Enable automated link resolution between documents" >> "$OUTPUT_FILE"
echo "- Build document relationship graphs" >> "$OUTPUT_FILE"
echo "- Provide navigation between related documentation" >> "$OUTPUT_FILE"
echo "- Validate documentation completeness" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Critical**: All cross-references must be machine-parseable with consistent format." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Print summary to console
echo ""
echo "Cross-Reference Format Validation Complete"
echo "==========================================="
echo "Total references: $total_refs"
echo "Valid references: $valid_refs"
echo "Absolute path violations: $absolute_path_refs"
echo "Non-descriptive text violations: $non_descriptive_refs"
echo ""

if [ $absolute_path_refs -eq 0 ] && [ $non_descriptive_refs -eq 0 ]; then
    echo "✅ PASS: All cross-references follow format standards"
    exit 0
else
    echo "❌ FAIL: Cross-reference format violations detected"
    echo ""
    echo "See detailed report at: $OUTPUT_FILE"
    exit 1
fi
