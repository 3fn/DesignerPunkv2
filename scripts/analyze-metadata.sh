#!/bin/bash
# Extract and analyze metadata from steering documents

OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/metadata-analysis.md"

echo "# Steering Documentation Metadata Analysis" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Analysis of metadata headers across all steering documents" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## Metadata by Document" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Function to extract metadata from a file
extract_metadata() {
    local file="$1"
    local filename=$(basename "$file")
    
    echo "### $filename" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Extract first 30 lines (should capture metadata header)
    head -30 "$file" > /tmp/metadata_check.txt
    
    # Check for metadata fields
    if grep -q "^\*\*Date\*\*:" /tmp/metadata_check.txt; then
        echo "**Has metadata header**: Yes" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        # Extract metadata fields
        echo "**Metadata fields found:**" >> "$OUTPUT_FILE"
        grep "^\*\*.*\*\*:" /tmp/metadata_check.txt | sed 's/^\*\*/- /' >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    else
        echo "**Has metadata header**: No" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
    
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# Process all steering documents
for file in .kiro/steering/*.md; do
    extract_metadata "$file"
done

# Add summary section
echo "## Summary" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Count documents with metadata
docs_with_metadata=$(grep -l "^\*\*Date\*\*:" .kiro/steering/*.md | wc -l)
total_docs=$(find .kiro/steering -name "*.md" | wc -l)
docs_without_metadata=$((total_docs - docs_with_metadata))

echo "**Total documents**: $total_docs" >> "$OUTPUT_FILE"
echo "**Documents with metadata**: $docs_with_metadata" >> "$OUTPUT_FILE"
echo "**Documents without metadata**: $docs_without_metadata" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# List documents without metadata
if [ $docs_without_metadata -gt 0 ]; then
    echo "**Documents missing metadata:**" >> "$OUTPUT_FILE"
    for file in .kiro/steering/*.md; do
        if ! grep -q "^\*\*Date\*\*:" "$file"; then
            echo "- $(basename "$file")" >> "$OUTPUT_FILE"
        fi
    done
    echo "" >> "$OUTPUT_FILE"
fi

echo "Metadata analysis created at: $OUTPUT_FILE"
