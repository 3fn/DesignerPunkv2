#!/bin/bash
# Find potential duplicate content across steering documents

OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/redundancy-candidates.md"

echo "# Redundancy Audit Candidates" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Potential duplicate content for manual review" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## Duplicate Heading Patterns" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Find duplicate H2 headings across documents
echo "**H2 headings appearing in multiple documents:**" >> "$OUTPUT_FILE"
grep -h "^## " .kiro/steering/*.md | sort | uniq -d | while read -r heading; do
    echo "" >> "$OUTPUT_FILE"
    echo "### $heading" >> "$OUTPUT_FILE"
    echo "**Found in:**" >> "$OUTPUT_FILE"
    grep -l "$heading" .kiro/steering/*.md | while read -r file; do
        echo "- $(basename "$file")" >> "$OUTPUT_FILE"
    done
done

echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## Common Phrases" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Note**: Manual review needed to determine if these are intentional or unintentional redundancy" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Find common multi-word phrases (potential duplicate explanations)
# This is a starting point - manual review required

echo "Redundancy candidates report created at: $OUTPUT_FILE"
