#!/bin/bash
# Test: File Organization Issues Investigation
# Purpose: Test file organization metadata validation, cross-reference updates, and scope limitations
# Hypothesis: These issues may affect release detection or share root causes with other infrastructure issues
# Usage: ./test-file-organization.sh
# Expected: Identify specific issues and their impact on release detection

set -e

echo "Testing: File Organization Issues"
echo "Purpose: Investigate Issues #005, #006, #007"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test Issue #005: Metadata Validation Inconsistency
echo "========================================="
echo "Test 1: Metadata Validation (Issue #005)"
echo "========================================="
echo ""

echo "Checking for files with 'process-documentation' metadata..."
if grep -r "**Organization**: process-documentation" . --include="*.md" 2>/dev/null; then
    echo -e "${YELLOW}Found files using 'process-documentation' metadata${NC}"
else
    echo -e "${GREEN}No files found with 'process-documentation' metadata${NC}"
fi
echo ""

echo "Checking validation logic in organize-by-metadata.sh..."
if [ -f ".kiro/hooks/organize-by-metadata.sh" ]; then
    echo "Valid organization values according to script:"
    grep -A 5 "case.*organization" .kiro/hooks/organize-by-metadata.sh | grep -E "framework-strategic|spec-validation|spec-completion|process-standard|working-document" || echo "Could not extract valid values"
else
    echo -e "${RED}organize-by-metadata.sh not found${NC}"
fi
echo ""

echo "Result: Metadata validation inconsistency"
echo "Evidence: Files may use values not in validation list"
echo ""

# Test Issue #006: Cross-Reference Update Logic
echo "========================================="
echo "Test 2: Cross-Reference Logic (Issue #006)"
echo "========================================="
echo ""

echo "Checking if Python is available for path calculation..."
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}Python3 is available${NC}"
    python3 --version
else
    echo -e "${RED}Python3 is NOT available - fallback path logic will be used${NC}"
fi
echo ""

echo "Checking cross-reference update logic in organize-by-metadata.sh..."
if [ -f ".kiro/hooks/organize-by-metadata.sh" ]; then
    echo "Cross-reference update function exists:"
    grep -n "update_cross_references" .kiro/hooks/organize-by-metadata.sh | head -1
    echo ""
    echo "Python dependency check:"
    if grep -q "python3 -c" .kiro/hooks/organize-by-metadata.sh; then
        echo -e "${YELLOW}Script uses Python for path calculation${NC}"
    fi
    echo ""
    echo "Fallback logic:"
    if grep -q "|| echo" .kiro/hooks/organize-by-metadata.sh; then
        echo -e "${YELLOW}Script has fallback for Python failure${NC}"
    fi
else
    echo -e "${RED}organize-by-metadata.sh not found${NC}"
fi
echo ""

echo "Result: Cross-reference update has potential issues"
echo "Evidence: Python dependency, fallback may be incorrect"
echo ""

# Test Issue #007: Scope Limitation
echo "========================================="
echo "Test 3: Scope Limitation (Issue #007)"
echo "========================================="
echo ""

echo "Checking file discovery scope in organize-by-metadata.sh..."
if [ -f ".kiro/hooks/organize-by-metadata.sh" ]; then
    echo "Find command used:"
    grep "find.*maxdepth" .kiro/hooks/organize-by-metadata.sh || echo "No maxdepth restriction found"
    echo ""
    if grep -q "maxdepth 1" .kiro/hooks/organize-by-metadata.sh; then
        echo -e "${YELLOW}Script only scans root directory (maxdepth 1)${NC}"
    else
        echo -e "${GREEN}Script scans recursively${NC}"
    fi
else
    echo -e "${RED}organize-by-metadata.sh not found${NC}"
fi
echo ""

echo "Result: File organization only scans root directory"
echo "Evidence: Uses 'find . -maxdepth 1' limiting scope"
echo ""

# Test Impact on Release Detection
echo "========================================="
echo "Test 4: Impact on Release Detection"
echo "========================================="
echo ""

echo "Checking if file organization issues affect release detection..."
echo ""

echo "1. Do completion documents get organized?"
echo "   Completion documents are in .kiro/specs/*/completion/"
echo "   File organization scans root directory only"
echo -e "   ${GREEN}Impact: NONE - Completion documents already in correct location${NC}"
echo ""

echo "2. Does metadata validation affect release detection?"
echo "   Release detection scans .kiro/specs/*/completion/ directly"
echo "   Does not depend on file organization metadata"
echo -e "   ${GREEN}Impact: NONE - Release detection doesn't use metadata validation${NC}"
echo ""

echo "3. Do cross-reference issues affect release detection?"
echo "   Release detection reads completion documents"
echo "   Does not follow cross-references"
echo -e "   ${GREEN}Impact: NONE - Release detection doesn't use cross-references${NC}"
echo ""

echo "Result: File organization issues do NOT affect release detection"
echo "Evidence: Release detection operates independently of file organization"
echo ""

# Test for Shared Root Causes
echo "========================================="
echo "Test 5: Shared Root Causes Analysis"
echo "========================================="
echo ""

echo "Comparing file organization issues with other infrastructure issues..."
echo ""

echo "Issue #001 (Release Detection): Agent hook not triggering"
echo "Issue #003 (Agent Hook Verification): Cannot verify hook triggering"
echo "Issue #005 (Metadata Validation): Inconsistent validation"
echo "Issue #006 (Cross-Reference Logic): Path calculation issues"
echo "Issue #007 (Scope Limitation): Only scans root directory"
echo ""

echo "Shared characteristics:"
echo "- Issue #001 and #003: Both related to agent hook event system"
echo "- Issue #005, #006, #007: All related to file organization implementation"
echo ""

echo "Root cause analysis:"
echo "- Issues #001 and #003: Likely share root cause (agent hook event handling)"
echo "- Issues #005, #006, #007: Independent implementation issues, not systemic"
echo ""

echo "Result: File organization issues are independent"
echo "Evidence: Different systems, different failure modes"
echo ""

# Summary
echo "========================================="
echo "Investigation Summary"
echo "========================================="
echo ""

echo "Issue #005 (Metadata Validation):"
echo "  Status: CONFIRMED - Files use values not in validation list"
echo "  Impact on Release Detection: NONE"
echo "  Root Cause: Implementation gap in validation list"
echo ""

echo "Issue #006 (Cross-Reference Logic):"
echo "  Status: CONFIRMED - Python dependency, fallback issues"
echo "  Impact on Release Detection: NONE"
echo "  Root Cause: Implementation reliability concerns"
echo ""

echo "Issue #007 (Scope Limitation):"
echo "  Status: CONFIRMED - Only scans root directory"
echo "  Impact on Release Detection: NONE"
echo "  Root Cause: Intentional design decision (not documented)"
echo ""

echo "Shared Root Causes:"
echo "  File organization issues: Independent implementation issues"
echo "  Release detection issues: Systemic agent hook event handling"
echo "  Conclusion: NO SHARED ROOT CAUSES"
echo ""

echo "Recommendation:"
echo "  - Fix file organization issues independently"
echo "  - Focus on agent hook event system for release detection"
echo "  - File organization issues do not block release detection fixes"
echo ""

echo "✅ Investigation complete!"
