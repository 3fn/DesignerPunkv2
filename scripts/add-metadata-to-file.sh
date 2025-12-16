#!/bin/bash
# Add metadata header to a file without reading its content

FILE="$1"
TEMP_FILE="${FILE}.tmp"

# Create new file with complete metadata header
cat > "$TEMP_FILE" << 'EOF'
# Steering Documentation Directional Priorities

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

# Append rest of file (skip lines until we hit the first ## heading)
# This preserves the content while replacing the incomplete metadata
awk 'BEGIN {found=0} /^## / {found=1} found {print}' "$FILE" >> "$TEMP_FILE"

# Replace original file
mv "$TEMP_FILE" "$FILE"

echo "Metadata added to: $FILE"
