# Design Document: File Organization Reliability Fixes

**Date**: November 7, 2025
**Spec**: issue-fix-file-organization-reliability
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This design addresses three related reliability issues in the file organization system discovered during Phase 1 Infrastructure Audit. The fixes improve metadata validation consistency, cross-reference update reliability, and documentation clarity while preserving historical integrity of preserved knowledge.

**Design Approach**:
1. **Audit-first methodology**: Identify all files with organization metadata before making changes
2. **Validation enhancement**: Add missing metadata values to validation list with clear rationale
3. **Reliability improvements**: Add Python availability check, improve path calculation, add link validation
4. **Exclusion rules**: Protect preserved knowledge from automated modifications
5. **Documentation updates**: Explicitly document intentional design decisions

**Key Principles**:
- Preserve historical integrity (no modifications to preserved-knowledge/)
- Fail safely (check dependencies before execution)
- Validate changes (verify links after updates)
- Clear feedback (log all actions and skipped files)

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│           File Organization System (Enhanced)                │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Metadata Validation (Issue #005 Fix)             │    │
│  │  - Audit all files with organization metadata      │    │
│  │  - Validate against documented values              │    │
│  │  - Update validation list with rationale           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Cross-Reference Updates (Issue #006 Fix)         │    │
│  │  - Check Python availability                       │    │
│  │  - Calculate relative paths correctly              │    │
│  │  - Validate updated links                          │    │
│  │  - Apply exclusion rules                           │    │
│  │  - Log all actions                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Exclusion Rules (New Component)                   │    │
│  │  - preserved-knowledge/ excluded                   │    │
│  │  - Git-ignored paths excluded                      │    │
│  │  - Non-markdown files excluded                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Documentation Updates (Issue #007 Fix)           │    │
│  │  - Document root-only scanning rationale          │    │
│  │  - Provide subdirectory organization guidance     │    │
│  │  - Log scanning scope                              │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
File Organization Request
    ↓
Scan Root Directory (Issue #007 - documented limitation)
    ↓
Read Organization Metadata
    ↓
Validate Metadata (Issue #005 - enhanced validation)
    ↓
Check Exclusion Rules (preserved-knowledge/, etc.)
    ↓
Move Files to Target Directories
    ↓
Update Cross-References (Issue #006 - enhanced reliability)
    ├─ Check Python Available
    ├─ Calculate Relative Paths
    ├─ Update Links
    ├─ Validate Links
    └─ Log Actions
    ↓
Complete with Summary
```

---

## Components and Interfaces

### Component 1: Metadata Validation Enhancement (Issue #005)

**Purpose**: Ensure all organization metadata values are validated and documented

**Location**: `.kiro/steering/File Organization Standards.md` (validation list)

**Current State**:
- Some files use "process-documentation" value not in validation list
- Validation list incomplete
- No clear rationale for valid values

**Enhanced Design**:

```markdown
## Valid Organization Metadata Values

### framework-strategic
**Purpose**: Reusable strategic guidance across multiple specs
**Location**: `strategic-framework/`
**Examples**: North star vision, system catalogs

### spec-validation
**Purpose**: Validation artifacts for specific specs
**Location**: `.kiro/specs/[spec-name]/validation/`
**Examples**: Framework validation, cross-reference checks

### spec-completion
**Purpose**: Task completion documentation
**Location**: `.kiro/specs/[spec-name]/completion/`
**Examples**: Task completion docs, lessons learned

### spec-summary
**Purpose**: Concise parent task summaries (triggers hooks)
**Location**: `docs/specs/[spec-name]/`
**Examples**: Parent task summaries for release detection

### process-standard
**Purpose**: Reusable process documentation
**Location**: `.kiro/steering/` or `docs/processes/`
**Examples**: Development workflows, standards
**Rationale**: Added to support process documentation files discovered during audit

### audit-findings
**Purpose**: Audit reports and issue registries
**Location**: `.kiro/audits/`
**Examples**: Phase 1 audit reports, issues registry
**Rationale**: Added to support audit documentation discovered during Phase 1
```

**Validation Script Enhancement**:

```bash
# In organize-by-metadata.sh

VALID_ORG_VALUES=(
  "framework-strategic"
  "spec-validation"
  "spec-completion"
  "spec-summary"
  "process-standard"
  "audit-findings"
)

validate_organization_metadata() {
  local org_value="$1"
  local file="$2"
  
  # Check if value is in valid list
  if [[ ! " ${VALID_ORG_VALUES[@]} " =~ " ${org_value} " ]]; then
    echo "❌ Invalid organization value in $file: '$org_value'"
    echo "   Valid values: ${VALID_ORG_VALUES[*]}"
    return 1
  fi
  
  return 0
}
```

**Audit Process**:

1. Scan all markdown files for organization metadata
2. Identify files using undocumented values
3. Decide: update file OR add value to validation list
4. Document rationale for any new values added

---

### Component 2: Cross-Reference Update Reliability (Issue #006)

**Purpose**: Improve reliability of cross-reference updates with validation and exclusion rules

**Location**: `.kiro/hooks/organize-by-metadata.sh` (cross-reference update logic)

**Current Issues**:
- No Python availability check
- Path calculation may be incorrect
- No link validation after updates
- No exclusion rules for historical documents

**Enhanced Design**:

#### Python Availability Check

```bash
check_python_available() {
  if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 not found - cross-reference updates will be skipped"
    echo "   To enable cross-reference updates, install Python 3:"
    echo "   - macOS: brew install python3"
    echo "   - Linux: apt-get install python3 or yum install python3"
    return 1
  fi
  return 0
}

update_cross_references() {
  if ! check_python_available; then
    echo "⚠️  Skipping cross-reference updates (Python not available)"
    return 0  # Not a fatal error, just skip
  fi
  
  # Proceed with Python-based updates
  python3 update_links.py "$@"
}
```

#### Exclusion Rules

```bash
# Directories to exclude from cross-reference updates
EXCLUDED_DIRS=(
  "preserved-knowledge"
  "node_modules"
  ".git"
  ".kiro/logs"
  ".kiro/release-triggers"
)

is_excluded_path() {
  local file_path="$1"
  
  for excluded_dir in "${EXCLUDED_DIRS[@]}"; do
    if [[ "$file_path" == *"$excluded_dir"* ]]; then
      echo "⏭️  Skipping $file_path (excluded: $excluded_dir)"
      return 0  # Is excluded
    fi
  done
  
  return 1  # Not excluded
}

update_file_cross_references() {
  local file="$1"
  
  # Check exclusion rules
  if is_excluded_path "$file"; then
    return 0
  fi
  
  # Proceed with updates
  # ...
}
```

#### Link Validation

```bash
validate_markdown_link() {
  local source_file="$1"
  local link_path="$2"
  
  # Calculate absolute path from relative link
  local source_dir=$(dirname "$source_file")
  local target_path=$(cd "$source_dir" && realpath "$link_path" 2>/dev/null)
  
  if [[ ! -f "$target_path" ]]; then
    echo "❌ Broken link in $source_file: $link_path"
    echo "   Target does not exist: $target_path"
    return 1
  fi
  
  return 0
}

validate_all_links_in_file() {
  local file="$1"
  local broken_links=0
  
  # Extract all markdown links: [text](path)
  while IFS= read -r link; do
    if ! validate_markdown_link "$file" "$link"; then
      ((broken_links++))
    fi
  done < <(grep -oP '\]\(\K[^)]+' "$file" 2>/dev/null || true)
  
  if [[ $broken_links -gt 0 ]]; then
    echo "⚠️  Found $broken_links broken link(s) in $file"
    echo "   Manual review recommended"
    return 1
  fi
  
  return 0
}
```

#### Enhanced Logging

```bash
log_cross_reference_update() {
  local file="$1"
  local links_updated="$2"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  
  echo "[$timestamp] Updated $links_updated link(s) in $file" >> .kiro/logs/file-organization.log
}

log_excluded_file() {
  local file="$1"
  local reason="$2"
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  
  echo "[$timestamp] Skipped $file (reason: $reason)" >> .kiro/logs/file-organization.log
}
```

---

### Component 3: Documentation Updates (Issue #007)

**Purpose**: Document root-only scanning as intentional design decision

**Location**: `.kiro/steering/File Organization Standards.md`

**Current State**:
- Root-only scanning not documented
- No explanation of rationale
- No guidance for subdirectory files

**Enhanced Documentation**:

```markdown
### File Organization Scope

**Intentional Design**: The file organization system scans **only the root directory**, not subdirectories.

**Rationale**:
- **Completion docs already organized**: Files created in `.kiro/specs/*/completion/` are already in correct location
- **Root directory clutter prevention**: New files created during development typically appear in root
- **Subdirectory stability**: Files in subdirectories are usually already organized
- **Clear scope boundary**: Limiting scope to root makes automation predictable and safe

**For Files in Subdirectories**:

If you need to organize files already in subdirectories:

**Option 1: Move to Root Temporarily**
1. Move file from subdirectory to root directory
2. Add appropriate **Organization** metadata to file header
3. Run file organization: `./.kiro/hooks/organize-by-metadata.sh`
4. File will be organized to correct location based on metadata

**Option 2: Manual Organization**
1. Add **Organization** metadata to file header
2. Manually move file to appropriate directory based on metadata value
3. Update cross-references in other files to reflect new location
4. Commit changes

**Option 3: Use Script Directly**
```bash
# Run organization script (scans root only by default)
./.kiro/hooks/organize-by-metadata.sh
```
```

**Logging Enhancement**:

```bash
log_scanning_scope() {
  echo "📁 Scanning directory: $(pwd)"
  echo "   Scope: Root directory only (subdirectories excluded by design)"
  echo "   Rationale: Avoid moving already-organized files"
}

# Call at start of organization
log_scanning_scope
```

---

## Data Models

### Organization Metadata Schema

```typescript
interface OrganizationMetadata {
  organization: 
    | "framework-strategic"
    | "spec-validation"
    | "spec-completion"
    | "spec-summary"
    | "process-standard"
    | "audit-findings";
  scope: string;  // spec-name, cross-spec, cross-project, etc.
  purpose?: string;  // Optional description
}
```

### Exclusion Rules Configuration

```typescript
interface ExclusionRules {
  directories: string[];  // Directories to exclude
  patterns: string[];     // File patterns to exclude
  rationale: Map<string, string>;  // Why each is excluded
}

const DEFAULT_EXCLUSIONS: ExclusionRules = {
  directories: [
    "preserved-knowledge",  // Historical integrity
    "node_modules",         // Dependencies
    ".git",                 // Version control
    ".kiro/logs",          // Log files
    ".kiro/release-triggers"  // Generated files
  ],
  patterns: [
    "*.log",
    "*.tmp"
  ],
  rationale: {
    "preserved-knowledge": "Preserve historical integrity - no automated modifications",
    "node_modules": "External dependencies - not project documentation",
    ".git": "Version control internals - not documentation",
    ".kiro/logs": "Log files - generated content",
    ".kiro/release-triggers": "Generated trigger files - not documentation"
  }
};
```

### Link Validation Result

```typescript
interface LinkValidationResult {
  file: string;
  totalLinks: number;
  validLinks: number;
  brokenLinks: Array<{
    linkText: string;
    linkPath: string;
    reason: string;
  }>;
  skipped: boolean;
  skipReason?: string;
}
```

---

## Error Handling

### Python Availability

**Scenario**: Python not available when cross-reference updates needed

**Handling**:
1. Check for Python before attempting updates
2. Display clear error message with installation instructions
3. Skip cross-reference updates (not fatal)
4. Log warning
5. Continue with file organization

**User Experience**:
```
⚠️  Python 3 not found - cross-reference updates will be skipped
   To enable cross-reference updates, install Python 3:
   - macOS: brew install python3
   - Linux: apt-get install python3 or yum install python3

✅ File organization completed (cross-reference updates skipped)
```

### Invalid Metadata Values

**Scenario**: File uses organization metadata value not in validation list

**Handling**:
1. Detect invalid value during validation
2. Display error with file path and invalid value
3. Show list of valid values
4. Skip file organization for that file
5. Continue with other files
6. Report summary at end

**User Experience**:
```
❌ Invalid organization value in ./new-document.md: 'invalid-value'
   Valid values: framework-strategic, spec-validation, spec-completion, 
                 spec-summary, process-standard, audit-findings

⏭️  Skipping ./new-document.md (invalid metadata)

✅ Organized 3 files, skipped 1 file (see errors above)
```

### Broken Links After Update

**Scenario**: Link validation detects broken links after cross-reference update

**Handling**:
1. Validate all links after updates
2. Report broken links with file and target
3. Provide guidance for manual correction
4. Don't revert changes (file already moved)
5. Log broken links for review

**User Experience**:
```
⚠️  Found 2 broken link(s) in docs/guide.md after cross-reference update:
   - [Design Doc](../specs/old-location/design.md) → Target does not exist
   - [Tasks](../specs/old-location/tasks.md) → Target does not exist
   
   Manual review recommended - file has been moved but some links may need correction
   
✅ File organization completed with warnings (see above)
```

### Excluded Files

**Scenario**: File matches exclusion rules

**Handling**:
1. Check exclusion rules before processing
2. Skip file with clear message
3. Log exclusion with reason
4. Continue with other files

**User Experience**:
```
⏭️  Skipping preserved-knowledge/old-design.md (excluded: preserved-knowledge)
⏭️  Skipping node_modules/package/readme.md (excluded: node_modules)

✅ Organized 5 files, skipped 2 files (exclusion rules)
```

---

## Testing Strategy

### Unit Testing (Manual Verification)

**Test 1: Metadata Validation**
```bash
# Create test file with invalid metadata
echo '**Organization**: invalid-value' > test-invalid.md

# Run organization
./.kiro/hooks/organize-by-metadata.sh

# Expected: Error message with valid values, file skipped
# Cleanup
rm test-invalid.md
```

**Test 2: Python Availability Check**
```bash
# Temporarily hide Python
alias python3='false'

# Run organization with file that needs cross-reference updates
./.kiro/hooks/organize-by-metadata.sh

# Expected: Warning about Python, cross-reference updates skipped, file still organized
# Cleanup
unalias python3
```

**Test 3: Exclusion Rules**
```bash
# Create test file in preserved-knowledge
echo '**Organization**: spec-completion' > preserved-knowledge/test.md

# Run organization
./.kiro/hooks/organize-by-metadata.sh

# Expected: File skipped with exclusion message
# Cleanup
rm preserved-knowledge/test.md
```

**Test 4: Link Validation**
```bash
# Create file with broken link
echo '[Broken](./nonexistent.md)' > test-broken-link.md
echo '**Organization**: spec-completion' >> test-broken-link.md

# Run organization
./.kiro/hooks/organize-by-metadata.sh

# Expected: File organized, broken link reported
# Cleanup
rm test-broken-link.md
```

### Integration Testing

**Test 5: End-to-End Organization**
```bash
# 1. Create test file with valid metadata
# 2. Add cross-references to existing files
# 3. Run organization
# 4. Verify file moved to correct location
# 5. Verify cross-references updated correctly
# 6. Verify links validated
# 7. Verify exclusions respected
```

---

## Design Decisions

### Decision 1: Add Missing Metadata Values vs Update Files

**Options Considered**:
1. Update all files to use only existing valid values
2. Add missing values to validation list
3. Hybrid approach (case-by-case)

**Decision**: Add missing values to validation list (with rationale)

**Rationale**:
- **Less disruptive**: Don't need to update multiple files
- **Preserves intent**: Files already use meaningful organization values
- **Clear documentation**: Adding values with rationale improves standards
- **Audit-driven**: Values discovered during audit represent real needs

**Trade-offs**:
- ✅ **Gained**: Minimal file changes, clear rationale for all values
- ❌ **Lost**: Slightly larger validation list
- ⚠️ **Risk**: Could encourage adding values without thought (mitigated by requiring rationale)

**Counter-Arguments**:
- **Argument**: "Adding values makes validation list too permissive"
- **Response**: Each value requires clear rationale and purpose. The audit revealed legitimate organizational needs that weren't documented.

### Decision 2: Exclude preserved-knowledge/ from Cross-Reference Updates

**Options Considered**:
1. Update all cross-references including preserved knowledge
2. Exclude preserved knowledge entirely
3. Make exclusion configurable

**Decision**: Exclude preserved knowledge entirely (hardcoded)

**Rationale**:
- **Historical integrity**: Preserved knowledge is historical snapshot
- **Intentional breakage**: If links break, that's historically accurate
- **Clear boundary**: preserved-knowledge/ is well-defined exclusion
- **No configuration needed**: This should always be excluded

**Trade-offs**:
- ✅ **Gained**: Historical integrity preserved, clear policy
- ❌ **Lost**: Flexibility to update if needed
- ⚠️ **Risk**: None - this is the correct behavior

**Counter-Arguments**:
- **Argument**: "What if we need to update preserved knowledge links?"
- **Response**: We shouldn't. Preserved knowledge is historical. If links break, that reflects historical reality (the thing moved).

### Decision 3: Python Dependency Handling

**Options Considered**:
1. Require Python (fail if not available)
2. Make Python optional (skip updates if not available)
3. Replace Python with pure bash

**Decision**: Make Python optional (skip updates if not available)

**Rationale**:
- **Graceful degradation**: File organization still works without Python
- **Clear feedback**: User knows Python is needed for full functionality
- **Installation guidance**: Provide clear instructions
- **Future enhancement**: Can replace with bash later if needed

**Trade-offs**:
- ✅ **Gained**: System works without Python, clear error messages
- ❌ **Lost**: Cross-reference updates require Python
- ⚠️ **Risk**: Users might not notice cross-references weren't updated (mitigated by clear warnings)

**Counter-Arguments**:
- **Argument**: "Should fail hard if Python not available"
- **Response**: File organization is still valuable without cross-reference updates. Graceful degradation is better than complete failure.

---

## Integration Points

### Dependencies

**File Organization Standards**:
- Depends on validation list being complete and documented
- Depends on clear rationale for each organization value

**organize-by-metadata.sh Script**:
- Depends on bash for core functionality
- Optionally depends on Python for cross-reference updates
- Depends on git for tracking changes

**Python (Optional)**:
- Used for cross-reference path calculation
- Not required for basic file organization
- Clear error messages if not available

### Dependents

**Future Specs**:
- Will use enhanced validation list
- Will benefit from reliable cross-reference updates
- Will respect exclusion rules

**Documentation**:
- File Organization Standards updated with new values
- Development Workflow references organization system
- Completion documents use spec-completion metadata

---

## Migration Strategy

**No breaking changes** - this is enhancement, not migration.

**For Existing Files**:
- Files with valid metadata continue working
- Files with newly-added metadata values now work
- Files in preserved-knowledge/ remain untouched

**For New Files**:
- Use enhanced validation list
- Benefit from improved cross-reference updates
- Respect exclusion rules automatically

**Transition Period**:
- Immediate benefit from fixes
- No migration required
- Backward compatible

---

*This design provides reliable, validated file organization with clear exclusion rules and graceful error handling while preserving historical integrity of preserved knowledge.*
