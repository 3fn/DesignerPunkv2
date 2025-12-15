#!/bin/bash
# Extract H1 and H2 headings from specified markdown files

OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/structure-map-layer-0-1.md"

echo "# Structure Map: Layer 0-1 Documents" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Extracted heading structure from Layer 0-1 steering documents" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Function to extract structure from a file
extract_structure() {
    local file=$1
    local filename=$(basename "$file")
    
    echo "## $filename" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Extract H1 and H2 headings
    grep -E "^#{1,2} " "$file" | while read -r line; do
        echo "- $line" >> "$OUTPUT_FILE"
    done
    
    echo "" >> "$OUTPUT_FILE"
    
    # Count sections
    local h2_count=$(grep -c "^## " "$file")
    echo "**Total H2 sections**: $h2_count" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Check for "AI Agent Reading Priorities"
    if grep -q "AI Agent Reading Priorities" "$file"; then
        echo "**Has 'AI Agent Reading Priorities' section**: Yes" >> "$OUTPUT_FILE"
    else
        echo "**Has 'AI Agent Reading Priorities' section**: No" >> "$OUTPUT_FILE"
    fi
    
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# Extract structure from Layer 0-1 documents
extract_structure ".kiro/steering/00-Steering Documentation Directional Priorities.md"
extract_structure ".kiro/steering/Core Goals.md"
extract_structure ".kiro/steering/Personal Note.md"
extract_structure ".kiro/steering/Start Up Tasks.md"

echo "Structure map created at: $OUTPUT_FILE"

# Extract Development Workflow structure
OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/structure-map-development-workflow.md"

echo "# Structure Map: Development Workflow" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Extracted heading structure from Development Workflow.md" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

extract_structure ".kiro/steering/Development Workflow.md"

echo "Development Workflow structure map created at: $OUTPUT_FILE"

# Extract File Organization Standards structure
OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/structure-map-file-organization.md"

echo "# Structure Map: File Organization Standards" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Extracted heading structure from File Organization Standards.md" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

extract_structure ".kiro/steering/File Organization Standards.md"

echo "File Organization Standards structure map created at: $OUTPUT_FILE"

# Extract Spec Planning Standards structure
OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/structure-map-spec-planning.md"

echo "# Structure Map: Spec Planning Standards" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Extracted heading structure from Spec Planning Standards.md" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

extract_structure ".kiro/steering/Spec Planning Standards.md"

echo "Spec Planning Standards structure map created at: $OUTPUT_FILE"

# Extract remaining documents structure
OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/structure-map-layers-2-3.md"

echo "# Structure Map: Layers 2-3 Documents" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Extracted heading structure from Layer 2-3 steering documents" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

extract_structure ".kiro/steering/Task-Type-Definitions.md"
extract_structure ".kiro/steering/Component Development Guide.md"
extract_structure ".kiro/steering/BUILD-SYSTEM-SETUP.md"
extract_structure ".kiro/steering/Technology Stack.md"
extract_structure ".kiro/steering/A Vision of the Future.md"

echo "Layers 2-3 structure map created at: $OUTPUT_FILE"
