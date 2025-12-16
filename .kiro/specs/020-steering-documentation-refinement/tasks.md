# Implementation Plan: Steering Documentation Refinement

**Date**: December 15, 2025
**Spec**: 020 - Steering Documentation Refinement
**Status**: Implementation Planning
**Dependencies**: None (but Spec 021 - MCP Documentation Server depends on this spec's completion)

---

## Implementation Plan

This implementation refines the steering documentation system through four phases: baseline discovery, metadata audit and addition, progressive disclosure implementation, and section-level markers with redundancy guidelines. Each phase builds on the previous to create a comprehensive, machine-readable documentation system that supports future MCP server implementation.

---

## Task List

- [x] 0. Baseline Documentation Discovery

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Complete inventory of all steering documents created
  - Section-level structure map documented
  - Current state captured for comparison
  - Baseline metrics recorded (file sizes, line counts, section counts)
  
  **Primary Artifacts:**
  - `.kiro/specs/020-steering-documentation-refinement/steering-structure-map.md` - Complete structure map
  - `.kiro/specs/020-steering-documentation-refinement/baseline-metrics.md` - Baseline metrics report
  - Current state snapshot for before/after comparison
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/020-steering-documentation-refinement/completion/task-0-parent-completion.md`
  - Summary: `docs/specs/020-steering-documentation-refinement/task-0-summary.md` (triggers release detection)

  - [x] 0.1 Create document inventory
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Scan `.kiro/steering/` directory for all markdown files
    - List each document with full path
    - Capture file sizes (bytes and lines)
    - Note file naming patterns (e.g., "00-" prefix)
    - Document any non-markdown files in directory
    - _Requirements: 6.1_

  - [x] 0.2 Map document structure
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Extract H1 and H2 headings from each document
    - Document section hierarchy and nesting
    - Note any existing "AI Agent Reading Priorities" sections
    - Identify existing conditional loading markers
    - Count sections per document
    - Create visual structure map showing document organization
    - _Requirements: 6.1, 8.1_
    - **Note**: This task is broken down into subtasks (0.2a-0.2f) to manage token load

  - [x] 0.2a Map core documents (Layers 0-1)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use bash script to extract structure mechanically**
    
    This task extracts heading structure from 4 specific documents using a bash script.
    This avoids the issue of AI agents reading document content when they should only extract structure.
    
    **Implementation steps:**
    
    1. Create extraction script at `scripts/extract-doc-structure.sh`:
    ```bash
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
    ```
    
    2. Make script executable: `chmod +x scripts/extract-doc-structure.sh`
    
    3. Run script: `./scripts/extract-doc-structure.sh`
    
    4. Review generated structure map at `.kiro/specs/020-steering-documentation-refinement/structure-map-layer-0-1.md`
    
    5. Verify output includes:
       - H1 and H2 headings for each document
       - Section counts
       - "AI Agent Reading Priorities" presence check
    
    **Why this approach:**
    - Mechanical extraction avoids AI agent reading document content
    - Script-based approach is deterministic and repeatable
    - Output format is consistent and machine-readable
    - No risk of agent following instructions in documents
    
    _Requirements: 6.1, 8.1_

  - [x] 0.2b Map Development Workflow
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use bash script to extract structure mechanically**
    
    Update the extraction script to process Development Workflow document.
    
    **Implementation steps:**
    
    1. Update `scripts/extract-doc-structure.sh` to add Development Workflow extraction:
    ```bash
    # Add after Layer 0-1 extraction, before final echo
    
    # Extract Development Workflow structure
    OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/structure-map-development-workflow.md"
    
    echo "# Structure Map: Development Workflow" > "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
    echo "**Purpose**: Extracted heading structure from Development Workflow.md" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    extract_structure ".kiro/steering/Development Workflow.md"
    
    echo "Development Workflow structure map created at: $OUTPUT_FILE"
    ```
    
    2. Run updated script: `./scripts/extract-doc-structure.sh`
    
    3. Review generated structure map at `.kiro/specs/020-steering-documentation-refinement/structure-map-development-workflow.md`
    
    4. Verify output includes all H1 and H2 headings from the 1,683-line document
    
    _Requirements: 6.1, 8.1_

  - [x] 0.2c Map File Organization Standards
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use bash script to extract structure mechanically**
    
    Update the extraction script to process File Organization Standards document.
    
    **Implementation steps:**
    
    1. Update `scripts/extract-doc-structure.sh` to add File Organization Standards extraction:
    ```bash
    # Add after Development Workflow extraction
    
    # Extract File Organization Standards structure
    OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/structure-map-file-organization.md"
    
    echo "# Structure Map: File Organization Standards" > "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
    echo "**Purpose**: Extracted heading structure from File Organization Standards.md" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    extract_structure ".kiro/steering/File Organization Standards.md"
    
    echo "File Organization Standards structure map created at: $OUTPUT_FILE"
    ```
    
    2. Run updated script: `./scripts/extract-doc-structure.sh`
    
    3. Review generated structure map at `.kiro/specs/020-steering-documentation-refinement/structure-map-file-organization.md`
    
    4. Verify output includes all H1 and H2 headings from the 1,526-line document
    
    _Requirements: 6.1, 8.1_

  - [x] 0.2d Map Spec Planning Standards
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use bash script to extract structure mechanically**
    
    Update the extraction script to process Spec Planning Standards document.
    
    **Implementation steps:**
    
    1. Update `scripts/extract-doc-structure.sh` to add Spec Planning Standards extraction:
    ```bash
    # Add after File Organization Standards extraction
    
    # Extract Spec Planning Standards structure
    OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/structure-map-spec-planning.md"
    
    echo "# Structure Map: Spec Planning Standards" > "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
    echo "**Purpose**: Extracted heading structure from Spec Planning Standards.md" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    extract_structure ".kiro/steering/Spec Planning Standards.md"
    
    echo "Spec Planning Standards structure map created at: $OUTPUT_FILE"
    ```
    
    2. Run updated script: `./scripts/extract-doc-structure.sh`
    
    3. Review generated structure map at `.kiro/specs/020-steering-documentation-refinement/structure-map-spec-planning.md`
    
    4. Verify output includes all H1 and H2 headings from the 3,067-line document
    
    _Requirements: 6.1, 8.1_

  - [x] 0.2e Map remaining documents (Layers 2-3)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use bash script to extract structure mechanically**
    
    Update the extraction script to process remaining Layer 2-3 documents.
    
    **Implementation steps:**
    
    1. Update `scripts/extract-doc-structure.sh` to add remaining documents extraction:
    ```bash
    # Add after Spec Planning Standards extraction
    
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
    ```
    
    2. Run updated script: `./scripts/extract-doc-structure.sh`
    
    3. Review generated structure map at `.kiro/specs/020-steering-documentation-refinement/structure-map-layers-2-3.md`
    
    4. Verify output includes all H1 and H2 headings from all 5 documents
    
    _Requirements: 6.1, 8.1_

  - [x] 0.2f Consolidate structure maps
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Combine script-generated structure maps**
    
    Consolidate the individual structure maps into a comprehensive overview.
    
    **Implementation steps:**
    
    1. Create consolidation script at `scripts/consolidate-structure-maps.sh`:
    ```bash
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
    ```
    
    2. Make script executable: `chmod +x scripts/consolidate-structure-maps.sh`
    
    3. Run script: `./scripts/consolidate-structure-maps.sh`
    
    4. Review consolidated map at `.kiro/specs/020-steering-documentation-refinement/steering-structure-map.md`
    
    5. Manually add observations section documenting:
       - Patterns across documents
       - Section hierarchy patterns
       - Conditional loading marker usage
       - Any findings or observations
    
    _Requirements: 6.1, 8.1_

  - [x] 0.3 Analyze current metadata
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use bash script to extract metadata mechanically**
    
    Create a script that extracts just the metadata headers (first ~30 lines) from each document without reading full content.
    
    **Implementation steps:**
    
    1. Create metadata extraction script at `scripts/analyze-metadata.sh`:
    ```bash
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
    ```
    
    2. Make script executable: `chmod +x scripts/analyze-metadata.sh`
    
    3. Run script: `./scripts/analyze-metadata.sh`
    
    4. Review generated analysis at `.kiro/specs/020-steering-documentation-refinement/metadata-analysis.md`
    
    5. Manually add observations section documenting:
       - Inconsistencies in metadata usage
       - Patterns in current metadata (Date, Purpose, Organization, Scope)
       - Any non-standard metadata fields discovered
    
    **Why this approach:**
    - Extracts only metadata headers (first 30 lines) to avoid token load
    - Mechanical extraction is deterministic and repeatable
    - No risk of AI agent reading full document content
    - Output format is consistent and machine-readable
    
    - Check which documents have metadata headers
    - Document existing metadata fields and formats
    - Note inconsistencies in metadata usage
    - Identify patterns in current metadata (Date, Purpose, Organization, Scope)
    - List documents missing metadata
    - Document any non-standard metadata fields
    - _Requirements: 1.1, 6.1_

  - [x] 0.4 Capture baseline metrics
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use bash script to calculate metrics mechanically**
    
    Create a script that calculates all baseline metrics without reading document content.
    
    **Implementation steps:**
    
    1. Create metrics calculation script at `scripts/calculate-baseline-metrics.sh`:
    ```bash
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
    ```
    
    2. Make script executable: `chmod +x scripts/calculate-baseline-metrics.sh`
    
    3. Run script: `./scripts/calculate-baseline-metrics.sh`
    
    4. Review generated metrics at `.kiro/specs/020-steering-documentation-refinement/baseline-metrics.md`
    
    5. Verify metrics report includes:
       - Total line count and average document length
       - Total section count and average sections per document
       - Longest and shortest documents
       - Conditional loading coverage statistics
       - Size distribution analysis
    
    **Why this approach:**
    - Fully automated calculation using standard Unix tools (wc, grep, awk)
    - No AI agent reading of document content required
    - Deterministic and repeatable metrics
    - Fast execution regardless of document size
    - Output format suitable for before/after comparison
    
    - Calculate total line count across all steering documents
    - Calculate average document length
    - Count total number of sections (H2 level)
    - Identify longest and shortest documents
    - Document current conditional loading coverage
    - Create baseline metrics report for comparison after implementation
    - _Requirements: 6.1_

- [x] 1. Metadata Audit and Addition

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All steering documents have complete, valid metadata headers
  - Metadata validation script created and passing
  - "Last Reviewed" dates set to audit date
  - Layer assignments documented and consistent
  
  **Primary Artifacts:**
  - Updated steering documents with metadata headers
  - `scripts/validate-steering-metadata.js` validation script
  - Metadata audit report documenting all assignments
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/020-steering-documentation-refinement/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/020-steering-documentation-refinement/task-1-summary.md` (triggers release detection)

  - [x] 1.1 Create metadata template
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create markdown template with all required metadata fields
    - Include examples for each field type
    - Document field purposes and valid values
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Audit Layer 0 document (Meta-guide)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use bash script to add metadata without reading document content**
    
    This document is the meta-guide that teaches AI agents how to use the steering system.
    It contains explicit instructions that could cause AI agents to get stuck in loops.
    Use a script to add metadata mechanically without reading the content.
    
    **Implementation steps:**
    
    1. Create metadata insertion script at `scripts/add-metadata-to-file.sh`:
    ```bash
    #!/bin/bash
    # Add metadata header to a file without reading its content
    
    FILE="$1"
    TEMP_FILE="${FILE}.tmp"
    
    # Extract the title (first line starting with #)
    TITLE=$(grep -m 1 "^# " "$FILE" | sed 's/^# //')
    
    # Create new file with metadata header
    cat > "$TEMP_FILE" << 'EOF'
    # [TITLE]
    
    **Date**: October 20, 2025
    **Updated**: December 14, 2025
    **Purpose**: Meta-guide teaching AI agents how to use the conditional loading steering system
    **Organization**: process-standard
    **Scope**: cross-project
    **Layer**: 0
    **Relevant Tasks**: all-tasks
    **Last Reviewed**: December 15, 2025
    
    ---
    inclusion: always
    ---
    
    EOF
    
    # Replace [TITLE] with actual title
    sed -i '' "s/\[TITLE\]/$TITLE/" "$TEMP_FILE"
    
    # Append rest of file (skip first line which is the title)
    tail -n +2 "$FILE" >> "$TEMP_FILE"
    
    # Replace original file
    mv "$TEMP_FILE" "$FILE"
    
    echo "Metadata added to: $FILE"
    ```
    
    2. Make script executable: `chmod +x scripts/add-metadata-to-file.sh`
    
    3. Run script on meta-guide: `./scripts/add-metadata-to-file.sh ".kiro/steering/00-Steering Documentation Directional Priorities.md"`
    
    4. Manually verify the metadata was added correctly (check first 20 lines only):
       ```bash
       head -20 ".kiro/steering/00-Steering Documentation Directional Priorities.md"
       ```
    
    5. Verify metadata fields:
       - Layer: 0 (meta-guide)
       - Relevant Tasks: all-tasks (applies to all task types)
       - inclusion: always (always loaded)
       - Last Reviewed: December 15, 2025 (audit date)
    
    **Why this approach:**
    - Script adds metadata without reading document content
    - Avoids AI agent getting stuck in instruction loops
    - Mechanical insertion is safe and deterministic
    - Human verification ensures correctness
    
    - Review `00-Steering Documentation Directional Priorities.md`
    - Add metadata header with Layer 0 assignment
    - Set relevant tasks to "all-tasks"
    - Set inclusion to "always"
    - Set "Last Reviewed" date to audit date
    - _Requirements: 1.1, 2.1, 2.2, 2.3_

  - [x] 1.3 Audit Layer 1 documents (Foundational Concepts)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use metadata template and script for safe insertion**
    
    Layer 1 documents provide foundational context and are always loaded.
    Use the metadata template and script to add metadata without extensive reading.
    
    **Implementation steps:**
    
    1. For each Layer 1 document, create metadata configuration:
    
    **Core Goals.md**:
    - Layer: 1
    - Relevant Tasks: all-tasks
    - inclusion: always
    - Purpose: "Core project context and development practices"
    
    **Personal Note.md**:
    - Layer: 1
    - Relevant Tasks: all-tasks
    - inclusion: always
    - Purpose: "Collaboration principles and partnership values"
    
    **Start Up Tasks.md**:
    - Layer: 1
    - Relevant Tasks: all-tasks
    - inclusion: always
    - Purpose: "Essential checklist for every task (date check, Jest commands, test selection)"
    
    2. Use `scripts/add-metadata-to-file.sh` for each document (update script to accept parameters for Layer, Relevant Tasks, inclusion, Purpose)
    
    3. Or manually add metadata using the template from Task 1.1, inserting after the title line
    
    4. Verify metadata was added correctly for each document:
       ```bash
       head -20 ".kiro/steering/Core Goals.md"
       head -20 ".kiro/steering/Personal Note.md"
       head -20 ".kiro/steering/Start Up Tasks.md"
       ```
    
    **Why this approach:**
    - Uses template for consistency
    - Minimal reading of document content
    - Safe insertion without interpretation
    - Human verification ensures correctness
    
    - Review `Core Goals.md`, `Personal Note.md`, `Start Up Tasks.md`
    - Add metadata headers with Layer 1 assignments
    - Determine relevant task types for each document
    - Set inclusion strategy (always or conditional)
    - Set "Last Reviewed" dates to audit date
    - _Requirements: 1.1, 2.1, 2.4_

  - [x] 1.4 Audit Layer 2 documents (Frameworks and Patterns)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use metadata-analysis.md artifact and template for safe insertion**
    
    Layer 2 documents provide frameworks and patterns. Some are always loaded, some conditional.
    Use the metadata-analysis.md artifact to see current state, then add metadata using template.
    
    **Implementation steps:**
    
    1. Review `.kiro/specs/020-steering-documentation-refinement/metadata-analysis.md` to see which Layer 2 documents already have metadata
    
    2. For each Layer 2 document, determine metadata configuration:
    
    **Development Workflow.md**:
    - Layer: 2
    - Relevant Tasks: all-tasks
    - inclusion: always
    - Purpose: "Task completion workflow and git practices"
    
    **File Organization Standards.md**:
    - Layer: 2
    - Relevant Tasks: all-tasks
    - inclusion: always
    - Purpose: "Metadata-driven file organization system"
    
    **Spec Planning Standards.md**:
    - Layer: 2
    - Relevant Tasks: spec-creation
    - inclusion: conditional
    - trigger: spec-creation
    - Purpose: "Standards for creating requirements, design, and task documents"
    
    **Task Type Definitions.md**:
    - Layer: 2
    - Relevant Tasks: spec-creation
    - inclusion: conditional
    - trigger: spec-creation
    - Purpose: "Task type definitions for three-tier validation and documentation"
    
    3. Manually add metadata using template from Task 1.1, inserting after title line
    
    4. Verify metadata was added correctly for each document (check first 20 lines only)
    
    **Why this approach:**
    - Uses metadata-analysis.md artifact to understand current state
    - Template ensures consistency
    - Manual insertion with verification
    - Avoids reading full document content
    
    - Review `Development Workflow.md`, `File Organization Standards.md`, `Spec Planning Standards.md`, `Task Type Definitions.md`
    - Add metadata headers with Layer 2 assignments
    - Determine relevant task types for each document
    - Set inclusion strategy (always or conditional)
    - Set "Last Reviewed" dates to audit date
    - _Requirements: 1.1, 2.1, 2.5_

  - [x] 1.5 Audit Layer 3 documents (Specific Implementations)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use metadata-analysis.md artifact and template for safe insertion**
    
    Layer 3 documents provide specific implementation guidance. All are conditionally loaded.
    Use the metadata-analysis.md artifact to see current state, then add metadata using template.
    
    **Implementation steps:**
    
    1. Review `.kiro/specs/020-steering-documentation-refinement/metadata-analysis.md` to see which Layer 3 documents already have metadata
    
    2. For each Layer 3 document, determine metadata configuration:
    
    **Component Development Guide.md**:
    - Layer: 3
    - Relevant Tasks: coding, accessibility-development
    - inclusion: conditional
    - trigger: coding, accessibility-development
    - Purpose: "Guide for building components with token usage and True Native Architecture"
    
    **BUILD-SYSTEM-SETUP.md**:
    - Layer: 3
    - Relevant Tasks: debugging, validation
    - inclusion: conditional
    - trigger: debugging, validation
    - Purpose: "Build system configuration and troubleshooting"
    
    **Technology Stack.md**:
    - Layer: 3
    - Relevant Tasks: architecture, coding
    - inclusion: conditional
    - trigger: architecture, coding
    - Purpose: "Technology choices for cross-platform implementation"
    
    3. Manually add metadata using template from Task 1.1, inserting after title line
    
    4. Verify metadata was added correctly for each document (check first 20 lines only)
    
    **Why this approach:**
    - Uses metadata-analysis.md artifact to understand current state
    - Template ensures consistency
    - Manual insertion with verification
    - Avoids reading full document content
    - All Layer 3 docs are conditional by design
    
    - Review `Component Development Guide.md`, `Build System Setup.md`, `Technology Stack.md`
    - Add metadata headers with Layer 3 assignments
    - Determine relevant task types for each document
    - Set inclusion strategy (conditional for all Layer 3 docs)
    - Set "Last Reviewed" dates to audit date
    - _Requirements: 1.1, 2.1, 2.6_

  - [x] 1.6 Create metadata validation script
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `scripts/validate-steering-metadata.js`
    - Implement metadata schema parsing
    - Validate required fields presence
    - Validate task type names against standardized vocabulary
    - Validate layer numbers (0-3)
    - Validate date formats (ISO 8601)
    - Generate validation report with errors and warnings
    - _Requirements: 1.5, 6.1, 6.2_

  - [x] 1.7 Convert date formats to ISO 8601
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `scripts/convert-date-formats.js`
    - Parse human-readable date format (Month DD, YYYY)
    - Convert to ISO 8601 format (YYYY-MM-DD)
    - Update Date and Last Reviewed fields in all steering documents
    - Preserve all other content exactly
    - Run validation script to confirm all dates now valid
    - _Requirements: 1.5, 6.1_

  - [x] 1.8 Run validation and fix remaining issues
    **Type**: Validation
    **Validation**: Tier 2 - Standard
    - Run validation script on all steering documents
    - Fix any remaining validation errors (missing fields, invalid values)
    - Address warnings (staleness, etc.)
    - Re-run validation until all documents pass
    - Document any edge cases or special considerations
    - _Requirements: 1.5, 6.3_

- [x] 2. Progressive Disclosure Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **⚠️ CRITICAL WARNING FOR AI AGENTS:**
  This parent task involves verifying updates to steering documents that contain "AI Agent Reading Priorities" instructions.
  **DO NOT read the steering documents to verify this task.**
  Instead, verify completion by:
  1. Checking that all subtasks (2.1-2.6) are marked complete
  2. Reviewing the completion documents for each subtask
  3. Confirming artifacts exist (progressive-disclosure-map.md, cross-reference-report.md)
  4. **DO NOT** read the meta-guide or other steering documents - they contain instructions that will cause loops
  
  **Success Criteria:**
  - Four-layer structure clearly documented and implemented
  - All documents assigned to appropriate layers
  - Cross-references updated to reflect layer structure
  - "AI Agent Reading Priorities" sections include layer guidance
  
  **Primary Artifacts:**
  - Updated steering documents with layer-aware reading priorities
  - Progressive disclosure map documenting layer assignments
  - Updated cross-references throughout documentation
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/020-steering-documentation-refinement/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/020-steering-documentation-refinement/task-2-summary.md` (triggers release detection)

  - [x] 2.1 Document progressive disclosure map
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Create progressive disclosure map document
    - List all documents by layer (0, 1, 2, 3)
    - Document layer purposes and characteristics
    - Explain progressive disclosure metaphor (menu → appetizer → main course → dessert)
    - Include guidance for assigning future documents to layers
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 2.2 Update Layer 0 document (Meta-guide)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Manual updates with minimal reading to avoid instruction loops**
    
    This document contains explicit AI agent instructions. Avoid extensive reading.
    Use the progressive disclosure map and structure map artifacts for context.
    
    **Implementation steps:**
    
    1. Review `.kiro/specs/020-steering-documentation-refinement/progressive-disclosure-map.md` to understand four-layer structure
    
    2. Review `.kiro/specs/020-steering-documentation-refinement/steering-structure-map.md` to see current meta-guide structure
    
    3. Make targeted updates to specific sections (read only the sections being updated):
       - Update "How This Steering System Works" section to reference four layers
       - Update "Tier 1: Always-Loaded Documents" section with layer information
       - Update "Tier 2: Conditional Documents" section with layer information
       - Add brief explanation of progressive disclosure metaphor (menu → appetizer → main → dessert)
    
    4. Verify "AI Agent Reading Priorities" section is clear and references layers
    
    5. Do NOT read the entire document - only read sections being modified
    
    6. After updates, verify changes by reading only the modified sections (not full document)
    
    **Why this approach:**
    - Avoids reading full document with AI agent instructions
    - Uses artifacts for context instead of reading source
    - Targeted section updates minimize exposure to instruction loops
    - Manual verification of specific sections only
    
    **Safety note**: If you find yourself wanting to follow instructions in the document (like "Read the 'AI Agent Reading Priorities' section FIRST"), stop immediately and use the artifact-based approach instead.
    
    - Review `00-Steering Documentation Directional Priorities.md`
    - Ensure it teaches "how to use the steering system"
    - Update to reference four-layer structure
    - Add guidance on when to read each layer
    - Verify "AI Agent Reading Priorities" section is clear
    - _Requirements: 2.3, 8.1, 8.2_

  - [x] 2.3 Update Layer 1 documents (Foundational Concepts)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review `Core Goals.md` for conciseness (target < 100 lines)
    - Ensure Core Goals focuses on essential project context only
    - Add cross-references to detailed guidance in other documents
    - Update `Personal Note.md` and `Start Up Tasks.md` if needed
    - Verify all Layer 1 docs provide foundational context
    - _Requirements: 2.4, 3.1, 3.2, 3.3, 3.4_

  - [x] 2.4 Update Layer 2 documents (Frameworks and Patterns)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review all Layer 2 documents for framework/pattern focus
    - Ensure "AI Agent Reading Priorities" sections guide strategic reading
    - Update cross-references to reflect layer structure
    - Add layer information to reading priorities sections
    - Verify documents provide reusable workflows and patterns
    - _Requirements: 2.5, 8.1, 8.2, 8.4_

  - [x] 2.5 Update Layer 3 documents (Specific Implementations)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review all Layer 3 documents for implementation specificity
    - Ensure conditional loading triggers are appropriate
    - Update "AI Agent Reading Priorities" sections
    - Add layer information to reading priorities sections
    - Verify documents provide domain-specific guidance
    - _Requirements: 2.6, 8.1, 8.2_

  - [x] 2.6 Validate cross-references
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use bash script to scan cross-references mechanically**
    
    Create a script that extracts and validates cross-references without reading full document content.
    
    **Implementation steps:**
    
    1. Create cross-reference scanning script at `scripts/scan-cross-references.sh`:
    ```bash
    #!/bin/bash
    # Scan and validate cross-references in steering documents
    
    OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/cross-reference-report.md"
    
    echo "# Cross-Reference Validation Report" > "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
    echo "**Purpose**: Validation of cross-references across steering documents" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    echo "## Cross-References by Document" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Function to extract cross-references from a file
    scan_references() {
        local file="$1"
        local filename=$(basename "$file")
        
        echo "### $filename" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        # Extract markdown links
        grep -o '\[.*\](.*\.md[^)]*)' "$file" > /tmp/links.txt || true
        
        if [ -s /tmp/links.txt ]; then
            echo "**Cross-references found:**" >> "$OUTPUT_FILE"
            while read -r link; do
                echo "- $link" >> "$OUTPUT_FILE"
            done < /tmp/links.txt
            echo "" >> "$OUTPUT_FILE"
        else
            echo "**No cross-references found**" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        fi
        
        echo "---" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    }
    
    # Scan all steering documents
    for file in .kiro/steering/*.md; do
        scan_references "$file"
    done
    
    # Add summary
    echo "## Summary" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    total_refs=$(grep -oh '\[.*\](.*\.md[^)]*)' .kiro/steering/*.md | wc -l)
    echo "**Total cross-references**: $total_refs" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    echo "Cross-reference report created at: $OUTPUT_FILE"
    ```
    
    2. Make script executable: `chmod +x scripts/scan-cross-references.sh`
    
    3. Run script: `./scripts/scan-cross-references.sh`
    
    4. Review generated report at `.kiro/specs/020-steering-documentation-refinement/cross-reference-report.md`
    
    5. Manually validate:
       - Check that links resolve correctly (test a sample)
       - Verify relative paths are used
       - Ensure link text is descriptive
       - Update any broken or unclear cross-references
    
    **Why this approach:**
    - Extracts only cross-reference links, not full content
    - Mechanical extraction avoids token load
    - Output provides complete inventory for manual validation
    - Can be re-run after updates to verify fixes
    
    - Scan all steering documents for cross-references
    - Verify all links resolve correctly
    - Check that cross-references use relative paths
    - Ensure cross-references include descriptive link text
    - Update any broken or unclear cross-references
    - _Requirements: 8.4, 8.5_

- [x] 3. Section-Level Markers and Redundancy Guidelines

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Section-level conditional markers added to large documents
  - Redundancy audit completed with documented rationale
  - Unintentional redundancy consolidated
  - Intentional redundancy clearly marked with rationale
  
  **Primary Artifacts:**
  - Updated steering documents with section-level markers
  - Redundancy audit report
  - Consolidated content with cross-references
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/020-steering-documentation-refinement/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/020-steering-documentation-refinement/task-3-summary.md` (triggers release detection)

  - [x] 3.1 Identify documents needing section-level markers
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use baseline-metrics.md artifact**
    
    Use the existing `baseline-metrics.md` artifact from Task 0.4 to identify large documents.
    
    **Implementation steps:**
    
    1. Read `.kiro/specs/020-steering-documentation-refinement/baseline-metrics.md`
    
    2. Identify documents > 200 lines from the "Size Distribution" section
    
    3. Review `steering-structure-map.md` from Task 0.2f to see section organization
    
    4. Create prioritization document at `.kiro/specs/020-steering-documentation-refinement/section-marker-priorities.md`:
       - List documents > 200 lines
       - Note which have multiple distinct topics (from structure map)
       - Identify sections that apply to different task types
       - Prioritize documents for marker addition
    
    5. Document rationale for prioritization
    
    **Why this approach:**
    - Uses existing artifacts instead of re-reading documents
    - baseline-metrics.md already has size data
    - steering-structure-map.md already has section organization
    - No token load from reading source documents
    
    - Scan all steering documents for length (> 200 lines)
    - Identify documents with multiple distinct topics
    - List sections that apply to different task types
    - Document which sections need conditional markers
    - Prioritize documents for marker addition
    - _Requirements: 4.1, 4.2_

  - [x] 3.2 Add section-level markers to Development Workflow
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review `Development Workflow.md` for distinct sections
    - Add conditional markers to hook-specific sections
    - Add conditional markers to troubleshooting sections
    - Specify load/skip criteria for each marked section
    - Use consistent marker format (📖 CONDITIONAL SECTION)
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 3.3 Add section-level markers to File Organization Standards
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review `File Organization Standards.md` for distinct sections
    - Add conditional markers to organization-specific sections
    - Add conditional markers to cross-reference sections
    - Specify load/skip criteria for each marked section
    - Use consistent marker format
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 3.4 Add section-level markers to Spec Planning Standards
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Review `Spec Planning Standards.md` for distinct sections
    - Add conditional markers to validation/documentation tier sections
    - Add conditional markers to cross-spec dependency sections
    - Specify load/skip criteria for each marked section
    - Use consistent marker format
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 3.5 Conduct redundancy audit
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use bash script to find duplicate content patterns**
    
    Create a script that identifies potential duplicate content without reading full documents.
    
    **Implementation steps:**
    
    1. Create duplicate content detection script at `scripts/find-duplicate-content.sh`:
    ```bash
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
    ```
    
    2. Make script executable: `chmod +x scripts/find-duplicate-content.sh`
    
    3. Run script: `./scripts/find-duplicate-content.sh`
    
    4. Review generated candidates at `.kiro/specs/020-steering-documentation-refinement/redundancy-candidates.md`
    
    5. Manually review each candidate using redundancy decision framework:
       - Is this intentional redundancy (different contexts need same info)?
       - Is this unintentional redundancy (copy-paste, drift)?
       - Document decision and rationale
    
    6. Create final redundancy audit report documenting:
       - Intentional redundancy with rationale
       - Unintentional redundancy for consolidation
       - Consolidation plan
    
    **Why this approach:**
    - Script identifies patterns (duplicate headings, common phrases)
    - Provides candidates for manual review
    - Avoids token load from reading all documents
    - Manual review applies decision framework appropriately
    
    - Review all steering documents for duplicated content
    - Use redundancy decision framework to evaluate each instance
    - Document intentional redundancy with rationale
    - Identify unintentional redundancy for consolidation
    - Create redundancy audit report
    - _Requirements: 5.1, 5.2, 5.4_

  - [x] 3.6 Consolidate unintentional redundancy
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Designate authoritative source for each duplicated concept
    - Consolidate content into authoritative source
    - Add cross-references from other documents
    - Remove or reduce duplicated content
    - Verify consolidated content is comprehensive
    - _Requirements: 5.3, 5.5_

  - [x] 3.7 Mark intentional redundancy
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add intentional redundancy markers to documents
    - Document rationale for each instance of intentional redundancy
    - Add cross-references to authoritative sources
    - Ensure markers use consistent format
    - Verify rationale is clear and justified
    - _Requirements: 5.1, 5.2_

- [ ] 4. Metadata Maintenance Process

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Staleness detection script created and working
  - Quarterly review process documented
  - Initial metadata review completed
  - Maintenance guidelines clear and actionable
  
  **Primary Artifacts:**
  - `scripts/detect-stale-metadata.js` staleness detection script
  - Quarterly review process documentation
  - Metadata maintenance guidelines
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/020-steering-documentation-refinement/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/020-steering-documentation-refinement/task-4-summary.md` (triggers release detection)

  - [ ] 4.1 Create staleness detection script
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `scripts/detect-stale-metadata.js`
    - Parse "Last Reviewed" dates from all steering documents
    - Calculate age of each document's metadata
    - Flag documents > 6 months old (warning)
    - Flag documents > 12 months old (error)
    - Generate staleness report
    - _Requirements: 6.4, 6.5_

  - [ ] 4.2 Document quarterly review process
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Create quarterly review process documentation
    - Define steps: run staleness detection, review flagged docs, update metadata/content, update "Last Reviewed" date
    - Document when to update metadata vs content
    - Provide examples of metadata updates
    - Include validation checklist
    - _Requirements: 6.3, 6.4, 6.5_

  - [ ] 4.3 Create metadata maintenance guidelines
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Document when to add new task types to vocabulary
    - Document when to reassign documents to different layers
    - Document when to change inclusion strategy (always vs conditional)
    - Provide decision frameworks for metadata updates
    - Include examples of common maintenance scenarios
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 4.4 Conduct initial metadata review
    **Type**: Validation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use metadata-analysis.md artifact**
    
    Use the existing `metadata-analysis.md` artifact from Task 0.3 for initial review.
    
    **Implementation steps:**
    
    1. Run staleness detection script from Task 4.1: `./scripts/detect-stale-metadata.js`
    
    2. Review `.kiro/specs/020-steering-documentation-refinement/metadata-analysis.md` from Task 0.3
    
    3. For each document flagged by staleness detection or metadata analysis:
       - Read just that document's metadata header (first 30 lines)
       - Verify layer assignment is correct
       - Verify task type assignments are correct
       - Update "Last Reviewed" date to current date
       - Fix any incorrect metadata
    
    4. Re-run validation script from Task 1.7 to verify all fixes
    
    5. Document any edge cases or special considerations
    
    **Why this approach:**
    - Uses existing metadata-analysis.md artifact
    - Only reads metadata headers (first 30 lines), not full documents
    - Focuses on documents flagged by staleness detection
    - Avoids token load from reading all documents
    
    - Run staleness detection script
    - Review all steering documents for metadata accuracy
    - Update any incorrect layer assignments
    - Update any incorrect task type assignments
    - Verify all "Last Reviewed" dates are current
    - _Requirements: 6.1, 6.2, 6.5_

- [ ] 5. MCP-Readiness Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Metadata schema validated as machine-readable
  - Task vocabulary stability verified
  - Layer boundaries clear and unambiguous
  - Content structure parseable by MCP server
  - Cross-references use consistent format
  
  **Primary Artifacts:**
  - MCP compatibility validation script
  - MCP-readiness validation report
  - Documentation of MCP integration points
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/020-steering-documentation-refinement/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/020-steering-documentation-refinement/task-5-summary.md` (triggers release detection)

  - [ ] 5.1 Validate metadata schema machine-readability
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use metadata-analysis.md artifact and create validation script**
    
    Create a script that parses metadata from the analysis artifact, not source documents.
    
    **Implementation steps:**
    
    1. Create metadata parsing validation script at `scripts/validate-metadata-parsing.js`:
    ```javascript
    // Parse metadata from metadata-analysis.md
    // Test parsing with TypeScript interface
    // Verify all required fields are present and parseable
    // Generate validation report
    ```
    
    2. Run script: `node scripts/validate-metadata-parsing.js`
    
    3. Review validation report
    
    4. Document any parsing issues or edge cases
    
    **Why this approach:**
    - Uses metadata-analysis.md artifact from Task 0.3
    - Validates parsing without reading source documents
    - Tests TypeScript interface compatibility
    - Generates machine-readable validation report
    
    - Parse metadata from all steering documents
    - Verify metadata is valid YAML/JSON
    - Test metadata parsing with TypeScript interface
    - Verify all required fields are present and parseable
    - Document any parsing issues or edge cases
    - _Requirements: 7.1, 7.2_

  - [ ] 5.2 Validate task vocabulary stability
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use metadata-analysis.md artifact**
    
    Extract task type names from metadata analysis and validate against standardized vocabulary.
    
    **Implementation steps:**
    
    1. Read `.kiro/specs/020-steering-documentation-refinement/metadata-analysis.md`
    
    2. Extract all "Relevant Tasks" values from metadata fields
    
    3. Create validation script at `scripts/validate-task-vocabulary.sh`:
    ```bash
    #!/bin/bash
    # Validate task type names against standardized vocabulary
    
    # Extract task types from metadata-analysis.md
    # Check kebab-case naming convention
    # Verify against standardized vocabulary list
    # Generate validation report
    ```
    
    4. Run script: `./scripts/validate-task-vocabulary.sh`
    
    5. Document task vocabulary as stable API
    
    **Why this approach:**
    - Uses metadata-analysis.md artifact
    - Validates without reading source documents
    - Ensures consistency across all documents
    - Documents vocabulary as stable API for MCP server
    
    - Review all task type names for consistency
    - Verify kebab-case naming convention used throughout
    - Check that task types match standardized vocabulary exactly
    - Verify no breaking changes to task type names
    - Document task vocabulary as stable API
    - _Requirements: 7.2, 7.3_

  - [ ] 5.3 Validate layer boundaries
    **Type**: Validation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use metadata-analysis.md artifact**
    
    Extract layer assignments from metadata analysis and validate boundaries.
    
    **Implementation steps:**
    
    1. Read `.kiro/specs/020-steering-documentation-refinement/metadata-analysis.md`
    
    2. Extract all "Layer" values from metadata fields
    
    3. Group documents by layer (0, 1, 2, 3)
    
    4. Review layer assignments for:
       - Clarity (no ambiguous assignments)
       - Distinct purposes (each layer has clear role)
       - MCP serving strategy compatibility
    
    5. Document layer boundary decisions and rationale
    
    **Why this approach:**
    - Uses metadata-analysis.md artifact
    - Validates without reading source documents
    - Ensures layer boundaries are clear for MCP server
    - Documents decisions for future reference
    
    - Review all layer assignments for clarity
    - Verify no ambiguous layer assignments
    - Check that layer purposes are distinct
    - Verify layer assignments enable MCP serving strategies
    - Document layer boundary decisions
    - _Requirements: 7.3, 7.4_

  - [ ] 5.4 Validate content structure parseability
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use steering-structure-map.md artifact**
    
    Use the existing structure map to validate heading hierarchy and parseability.
    
    **Implementation steps:**
    
    1. Read `.kiro/specs/020-steering-documentation-refinement/steering-structure-map.md` from Task 0.2f
    
    2. Review heading hierarchy for each document:
       - Verify consistent heading levels (H1, H2, H3)
       - Check for heading level skips (H1 → H3 without H2)
       - Identify any inconsistencies
    
    3. Create parsing validation script at `scripts/validate-structure-parsing.js`:
    ```javascript
    // Parse steering-structure-map.md
    // Test programmatic parsing of document structure
    // Validate heading hierarchy consistency
    // Generate validation report
    ```
    
    4. Run script: `node scripts/validate-structure-parsing.js`
    
    5. Document any parsing challenges or edge cases
    
    **Why this approach:**
    - Uses steering-structure-map.md artifact from Task 0.2f
    - Validates without reading source documents
    - Tests programmatic parsing on extracted structure
    - Identifies issues for MCP server parsing
    
    - Review heading hierarchy across all documents
    - Verify consistent heading levels (H1, H2, H3)
    - Check that section markers use consistent format
    - Test programmatic parsing of document structure
    - Document any parsing challenges or edge cases
    - _Requirements: 7.4, 7.5_

  - [ ] 5.5 Validate cross-reference format consistency
    **Type**: Validation
    **Validation**: Tier 2 - Standard
    
    **APPROACH: Use cross-reference-report.md artifact**
    
    Use the cross-reference report from Task 2.6 to validate format consistency.
    
    **Implementation steps:**
    
    1. Read `.kiro/specs/020-steering-documentation-refinement/cross-reference-report.md` from Task 2.6
    
    2. Review all cross-references for:
       - Format consistency (markdown link syntax)
       - Relative paths (not absolute)
       - Descriptive link text (not "click here")
       - Automated resolution capability
    
    3. Create validation script at `scripts/validate-cross-reference-format.sh`:
    ```bash
    #!/bin/bash
    # Validate cross-reference format from report
    # Check for absolute paths
    # Check for non-descriptive link text
    # Generate validation report
    ```
    
    4. Run script: `./scripts/validate-cross-reference-format.sh`
    
    5. Document cross-reference format standards for MCP server
    
    **Why this approach:**
    - Uses cross-reference-report.md artifact from Task 2.6
    - Validates without reading source documents
    - Ensures format consistency for MCP server
    - Documents standards for future reference
    
    - Review all cross-references for format consistency
    - Verify relative paths used throughout
    - Check that link text is descriptive
    - Verify cross-references enable automated resolution
    - Document cross-reference format standards
    - _Requirements: 7.5, 8.4_

  - [ ] 5.6 Create MCP-readiness validation report
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Document all MCP compatibility validation results
    - List any issues or edge cases discovered
    - Provide recommendations for Spec 021 implementation
    - Document integration points and API surface
    - Include examples of MCP function signatures
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

---

**Organization**: spec-validation
**Scope**: 020-steering-documentation-refinement
