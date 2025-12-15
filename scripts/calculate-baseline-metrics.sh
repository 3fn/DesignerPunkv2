#!/bin/bash
# Calculate baseline metrics for steering documents

OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/baseline-metrics.md"

echo "# Baseline Metrics Report" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Baseline metrics for steering documentation before refinement" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Calculate total line count
total_lines=$(find .kiro/steering -name "*.md" -exec wc -l {} + | tail -1 | awk '{print $1}')
echo "## Overall Metrics" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Total line count**: $total_lines lines" >> "$OUTPUT_FILE"

# Calculate total documents
total_docs=$(find .kiro/steering -name "*.md" | wc -l)
echo "**Total documents**: $total_docs" >> "$OUTPUT_FILE"

# Calculate average document length
avg_length=$((total_lines / total_docs))
echo "**Average document length**: $avg_length lines" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Count total H2 sections across all documents
total_sections=$(grep -h "^## " .kiro/steering/*.md | wc -l)
echo "**Total H2 sections**: $total_sections" >> "$OUTPUT_FILE"

# Calculate average sections per document
avg_sections=$((total_sections / total_docs))
echo "**Average sections per document**: $avg_sections" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Find longest and shortest documents
echo "## Document Size Analysis" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "**Longest documents:**" >> "$OUTPUT_FILE"
find .kiro/steering -name "*.md" -exec wc -l {} + | sort -rn | head -5 | while read lines file; do
    if [ "$file" != "total" ]; then
        echo "- $(basename "$file"): $lines lines" >> "$OUTPUT_FILE"
    fi
done
echo "" >> "$OUTPUT_FILE"

echo "**Shortest documents:**" >> "$OUTPUT_FILE"
find .kiro/steering -name "*.md" -exec wc -l {} + | sort -n | head -5 | while read lines file; do
    echo "- $(basename "$file"): $lines lines" >> "$OUTPUT_FILE"
done
echo "" >> "$OUTPUT_FILE"

# Document conditional loading coverage
echo "## Conditional Loading Coverage" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Count documents with "AI Agent Reading Priorities"
docs_with_priorities=$(grep -l "AI Agent Reading Priorities" .kiro/steering/*.md | wc -l)
echo "**Documents with 'AI Agent Reading Priorities' sections**: $docs_with_priorities / $total_docs" >> "$OUTPUT_FILE"

# Count documents with conditional markers
docs_with_conditional=$(grep -l "CONDITIONAL SECTION" .kiro/steering/*.md | wc -l)
echo "**Documents with conditional section markers**: $docs_with_conditional / $total_docs" >> "$OUTPUT_FILE"

# Count documents with inclusion metadata
docs_with_inclusion=$(grep -l "^inclusion:" .kiro/steering/*.md | wc -l)
echo "**Documents with inclusion metadata**: $docs_with_inclusion / $total_docs" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# List documents by size category
echo "## Size Distribution" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "**Small documents (< 200 lines):**" >> "$OUTPUT_FILE"
find .kiro/steering -name "*.md" -exec wc -l {} + | awk '$1 < 200 {print "- " $2 ": " $1 " lines"}' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "**Medium documents (200-1000 lines):**" >> "$OUTPUT_FILE"
find .kiro/steering -name "*.md" -exec wc -l {} + | awk '$1 >= 200 && $1 < 1000 {print "- " $2 ": " $1 " lines"}' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "**Large documents (1000+ lines):**" >> "$OUTPUT_FILE"
find .kiro/steering -name "*.md" -exec wc -l {} + | awk '$1 >= 1000 {print "- " $2 ": " $1 " lines"}' >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "Baseline metrics report created at: $OUTPUT_FILE"
