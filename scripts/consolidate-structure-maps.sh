#!/bin/bash
# Consolidate all structure maps into comprehensive overview

OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/steering-structure-map.md"

echo "# Comprehensive Steering Documentation Structure Map" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Consolidated structure map of all steering documents" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Combine all partial maps
cat .kiro/specs/020-steering-documentation-refinement/structure-map-layer-0-1.md >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat .kiro/specs/020-steering-documentation-refinement/structure-map-development-workflow.md >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat .kiro/specs/020-steering-documentation-refinement/structure-map-file-organization.md >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat .kiro/specs/020-steering-documentation-refinement/structure-map-spec-planning.md >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
cat .kiro/specs/020-steering-documentation-refinement/structure-map-layers-2-3.md >> "$OUTPUT_FILE"

# Add summary section
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "## Summary" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Count total documents
total_docs=$(find .kiro/steering -name "*.md" | wc -l)
echo "**Total steering documents**: $total_docs" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Count documents with "AI Agent Reading Priorities"
docs_with_priorities=$(grep -l "AI Agent Reading Priorities" .kiro/steering/*.md | wc -l)
echo "**Documents with 'AI Agent Reading Priorities' sections**: $docs_with_priorities" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "Consolidated structure map created at: $OUTPUT_FILE"
