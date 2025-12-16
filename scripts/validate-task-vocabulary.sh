#!/bin/bash
# Validate task type names against standardized vocabulary

OUTPUT_FILE=".kiro/specs/020-steering-documentation-refinement/task-vocabulary-validation.md"

echo "# Task Vocabulary Validation Report" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Date**: $(date +%Y-%m-%d)" >> "$OUTPUT_FILE"
echo "**Purpose**: Validate task type names against standardized vocabulary" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Standardized task vocabulary (from design.md)
STANDARD_VOCAB=(
  "spec-creation"
  "general-task-execution"
  "architecture"
  "coding"
  "accessibility-development"
  "validation"
  "debugging"
  "documentation"
  "maintenance"
  "performance-optimization"
  "file-organization"
  "refactoring"
  "migration"
  "hook-setup"
  "all-tasks"
)

echo "## Standardized Task Vocabulary" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "The following 15 task types are defined as the standardized vocabulary:" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for task in "${STANDARD_VOCAB[@]}"; do
  echo "- \`$task\`" >> "$OUTPUT_FILE"
done
echo "" >> "$OUTPUT_FILE"

# Extract task types from metadata-analysis.md
echo "## Task Types Found in Steering Documents" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

METADATA_FILE=".kiro/specs/020-steering-documentation-refinement/metadata-analysis.md"

# Store found tasks in array for validation
declare -a FOUND_TASKS_ARRAY

# Extract all "Relevant Tasks" lines and split comma-separated values
while IFS= read -r line; do
  # Extract the value after "Relevant Tasks**: "
  if [[ "$line" =~ ^-\ Relevant\ Tasks\*\*:\ (.+)$ ]]; then
    tasks_value="${BASH_REMATCH[1]}"
    
    # Split comma-separated values
    IFS=',' read -ra TASKS <<< "$tasks_value"
    for task in "${TASKS[@]}"; do
      # Trim whitespace
      task=$(echo "$task" | xargs)
      if [ ! -z "$task" ]; then
        FOUND_TASKS_ARRAY+=("$task")
      fi
    done
  fi
done < "$METADATA_FILE"

# Remove duplicates from found tasks
FOUND_TASKS_UNIQUE=($(printf '%s\n' "${FOUND_TASKS_ARRAY[@]}" | sort -u))

echo "**Unique task types found:**" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for task in "${FOUND_TASKS_UNIQUE[@]}"; do
  echo "- \`$task\`" >> "$OUTPUT_FILE"
done

echo "" >> "$OUTPUT_FILE"
echo "**Total unique task types found**: ${#FOUND_TASKS_UNIQUE[@]}" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Validation: Check kebab-case naming convention
echo "## Naming Convention Validation" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

NAMING_ERRORS=0
for task in "${FOUND_TASKS_UNIQUE[@]}"; do
  # Check if task follows kebab-case (lowercase letters, numbers, and hyphens only)
  if [[ ! "$task" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    echo "❌ **Invalid naming**: \`$task\` does not follow kebab-case convention" >> "$OUTPUT_FILE"
    NAMING_ERRORS=$((NAMING_ERRORS + 1))
  fi
done

if [ $NAMING_ERRORS -eq 0 ]; then
  echo "✅ **All task types follow kebab-case naming convention**" >> "$OUTPUT_FILE"
else
  echo "" >> "$OUTPUT_FILE"
  echo "**Total naming errors**: $NAMING_ERRORS" >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"

# Validation: Check against standardized vocabulary
echo "## Vocabulary Consistency Validation" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

VOCAB_ERRORS=0
for task in "${FOUND_TASKS_UNIQUE[@]}"; do
  # Check if task is in standard vocabulary
  FOUND=0
  for standard in "${STANDARD_VOCAB[@]}"; do
    if [ "$task" = "$standard" ]; then
      FOUND=1
      break
    fi
  done
  
  if [ $FOUND -eq 0 ]; then
    echo "❌ **Non-standard task type**: \`$task\` is not in standardized vocabulary" >> "$OUTPUT_FILE"
    VOCAB_ERRORS=$((VOCAB_ERRORS + 1))
  fi
done

if [ $VOCAB_ERRORS -eq 0 ]; then
  echo "✅ **All task types match standardized vocabulary**" >> "$OUTPUT_FILE"
else
  echo "" >> "$OUTPUT_FILE"
  echo "**Total vocabulary errors**: $VOCAB_ERRORS" >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"

# Check for unused standard vocabulary
echo "## Unused Standard Vocabulary" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

UNUSED_COUNT=0
for standard in "${STANDARD_VOCAB[@]}"; do
  USED=0
  for task in "${FOUND_TASKS_UNIQUE[@]}"; do
    if [ "$task" = "$standard" ]; then
      USED=1
      break
    fi
  done
  
  if [ $USED -eq 0 ]; then
    echo "- \`$standard\` (not currently used in any steering document)" >> "$OUTPUT_FILE"
    UNUSED_COUNT=$((UNUSED_COUNT + 1))
  fi
done

if [ $UNUSED_COUNT -eq 0 ]; then
  echo "✅ **All standard vocabulary items are used**" >> "$OUTPUT_FILE"
else
  echo "" >> "$OUTPUT_FILE"
  echo "**Total unused vocabulary items**: $UNUSED_COUNT" >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"

# Summary
echo "## Validation Summary" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

TOTAL_ERRORS=$((NAMING_ERRORS + VOCAB_ERRORS))

if [ $TOTAL_ERRORS -eq 0 ]; then
  echo "✅ **Task vocabulary is stable and consistent**" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "- All task types follow kebab-case naming convention" >> "$OUTPUT_FILE"
  echo "- All task types match standardized vocabulary" >> "$OUTPUT_FILE"
  echo "- Task vocabulary is ready for MCP server API" >> "$OUTPUT_FILE"
else
  echo "❌ **Task vocabulary has issues that need resolution**" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "- Naming convention errors: $NAMING_ERRORS" >> "$OUTPUT_FILE"
  echo "- Vocabulary consistency errors: $VOCAB_ERRORS" >> "$OUTPUT_FILE"
  echo "- **Total errors**: $TOTAL_ERRORS" >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"

# Document as stable API
echo "## Task Vocabulary as Stable API" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "The task vocabulary serves as a stable API for the MCP documentation server:" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "- **Function Parameters**: Task types are used as parameters for MCP functions" >> "$OUTPUT_FILE"
echo "- **Document Filtering**: MCP server filters documents based on task type metadata" >> "$OUTPUT_FILE"
echo "- **Stability Guarantee**: Task type names will not change without versioning" >> "$OUTPUT_FILE"
echo "- **Kebab-Case Convention**: All task types use kebab-case for consistency" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Example MCP Function Signature:**" >> "$OUTPUT_FILE"
echo "\`\`\`typescript" >> "$OUTPUT_FILE"
echo "getSteeringDocumentation(taskType: TaskType, layer?: number): Document[]" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "type TaskType = " >> "$OUTPUT_FILE"
for i in "${!STANDARD_VOCAB[@]}"; do
  if [ $i -eq $((${#STANDARD_VOCAB[@]} - 1)) ]; then
    echo "  | '${STANDARD_VOCAB[$i]}';" >> "$OUTPUT_FILE"
  else
    echo "  | '${STANDARD_VOCAB[$i]}'" >> "$OUTPUT_FILE"
  fi
done
echo "\`\`\`" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "*This validation ensures task vocabulary stability for MCP server integration.*" >> "$OUTPUT_FILE"

echo "Task vocabulary validation report created at: $OUTPUT_FILE"

# Exit with error code if validation failed
if [ $TOTAL_ERRORS -gt 0 ]; then
  exit 1
fi

exit 0
