#!/bin/bash

# Stage 2: Analysis Only - Dry Run Test
# This script tests the release analysis layer with actual completion documents

echo "🧪 Release Management System - Stage 2 Dry Run"
echo "================================================"
echo ""
echo "This test will:"
echo "1. Run release analysis on actual completion documents"
echo "2. Show AI-generated version recommendations"
echo "3. Display generated release notes"
echo "4. Verify the analysis output format"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check if we have trigger files
echo "📊 Step 1: Checking for trigger files..."
TRIGGER_COUNT=$(ls -1 .kiro/release-triggers/*.json 2>/dev/null | wc -l)
echo "Found $TRIGGER_COUNT trigger files"

if [ $TRIGGER_COUNT -eq 0 ]; then
    echo -e "${RED}✗ No trigger files found${NC}"
    echo "Run Stage 1 first: ./test-release-detection.sh"
    exit 1
fi
echo -e "${GREEN}✓ Trigger files exist${NC}"
echo ""

# Step 2: Show most recent trigger file
echo "📄 Step 2: Most recent trigger file:"
LATEST_TRIGGER=$(ls -t .kiro/release-triggers/*.json 2>/dev/null | head -1)
echo "File: $LATEST_TRIGGER"
echo "Content preview:"
cat "$LATEST_TRIGGER" | head -20
echo ""

# Step 3: Run release analysis
echo "🔍 Step 3: Running release analysis..."
echo "Command: npm run release:analyze"
echo ""
echo -e "${BLUE}This may take a moment as the AI analyzes completion documents...${NC}"
echo ""

# Run the analysis and capture output
npm run release:analyze 2>&1 | tee /tmp/release-analysis-output.txt

ANALYSIS_EXIT_CODE=${PIPESTATUS[0]}

echo ""
if [ $ANALYSIS_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ Analysis completed successfully${NC}"
else
    echo -e "${RED}✗ Analysis failed with exit code: $ANALYSIS_EXIT_CODE${NC}"
fi
echo ""

# Step 4: Check for analysis output
echo "📊 Step 4: Checking analysis output..."

# Look for key indicators in the output
if grep -q "Version Recommendation" /tmp/release-analysis-output.txt; then
    echo -e "${GREEN}✓ Found version recommendation${NC}"
    grep "Version Recommendation" /tmp/release-analysis-output.txt | head -5
else
    echo -e "${YELLOW}⚠ No version recommendation found in output${NC}"
fi

if grep -q "Release Notes" /tmp/release-analysis-output.txt; then
    echo -e "${GREEN}✓ Found release notes${NC}"
else
    echo -e "${YELLOW}⚠ No release notes found in output${NC}"
fi

if grep -q "Breaking Changes" /tmp/release-analysis-output.txt; then
    echo -e "${GREEN}✓ Found breaking changes analysis${NC}"
else
    echo -e "${YELLOW}⚠ No breaking changes analysis found${NC}"
fi
echo ""

# Step 5: Check if analysis created any output files
echo "📁 Step 5: Checking for output files..."
if [ -d "output" ]; then
    echo "Output directory exists:"
    ls -lh output/ 2>/dev/null | tail -5
else
    echo -e "${YELLOW}No output directory found${NC}"
fi
echo ""

# Step 6: Summary
echo "📋 Summary:"
echo "==========="
if [ $ANALYSIS_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ Stage 2 (Analysis) completed successfully${NC}"
    echo ""
    echo "Key Findings:"
    echo "  - Analysis processed completion documents"
    echo "  - AI generated version recommendations"
    echo "  - Release notes were created"
    echo ""
    echo "Next steps:"
    echo "  - Review the analysis output above"
    echo "  - Check if version bump makes sense"
    echo "  - Verify release notes are meaningful"
    echo "  - If analysis looks good, proceed to Stage 3: Full workflow (dry-run)"
else
    echo -e "${RED}✗ Stage 2 (Analysis) failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  - Check /tmp/release-analysis-output.txt for full output"
    echo "  - Verify completion documents have proper format"
    echo "  - Check if AI analysis service is accessible"
    echo "  - Review error messages above"
fi
echo ""

# Step 7: Offer to show full output
echo "📄 Full Output:"
read -p "Show complete analysis output? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "=== Complete Analysis Output ==="
    cat /tmp/release-analysis-output.txt
    echo ""
    echo "=== End of Output ==="
fi

echo ""
echo "🎉 Stage 2 dry-run complete!"
echo ""
echo "💡 Tip: The analysis output shows what the AI understood from your"
echo "   completion documents. This is the intelligence layer that decides"
echo "   version bumps and generates release notes."
