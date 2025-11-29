#!/bin/bash

# Stage 1: Detection Only - Dry Run Test
# This script tests the release detection layer without running full analysis

echo "🧪 Release Management System - Stage 1 Dry Run"
echo "================================================"
echo ""
echo "This test will:"
echo "1. Create a test trigger file"
echo "2. Run release detection"
echo "3. Verify trigger files are created"
echo "4. Clean up test files"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if release-triggers directory exists
echo "📁 Step 1: Checking release-triggers directory..."
if [ ! -d ".kiro/release-triggers" ]; then
    echo -e "${YELLOW}Creating .kiro/release-triggers directory...${NC}"
    mkdir -p .kiro/release-triggers
fi
echo -e "${GREEN}✓ Directory exists${NC}"
echo ""

# Step 2: Create a test trigger file
echo "📝 Step 2: Creating test trigger file..."
TEST_TRIGGER=".kiro/release-triggers/test-dry-run-$(date +%s).txt"
echo "Test trigger for dry-run analysis" > "$TEST_TRIGGER"
echo -e "${GREEN}✓ Created: $TEST_TRIGGER${NC}"
echo ""

# Step 3: Check current trigger files
echo "📊 Step 3: Current trigger files before detection:"
ls -la .kiro/release-triggers/ | grep -v "^d" | tail -n +2
echo ""

# Step 4: Run release detection (auto mode)
echo "🔍 Step 4: Running release detection..."
echo "Command: ./.kiro/hooks/release-manager.sh auto"
echo ""

./.kiro/hooks/release-manager.sh auto

DETECTION_EXIT_CODE=$?

echo ""
if [ $DETECTION_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ Detection completed successfully${NC}"
else
    echo -e "${RED}✗ Detection failed with exit code: $DETECTION_EXIT_CODE${NC}"
fi
echo ""

# Step 5: Check trigger files after detection
echo "📊 Step 5: Trigger files after detection:"
ls -la .kiro/release-triggers/ | grep -v "^d" | tail -n +2
echo ""

# Step 6: Check if any completion documents were found
echo "📄 Step 6: Checking for completion documents..."
COMPLETION_DOCS=$(find .kiro/specs -name "*completion*.md" -type f | wc -l)
echo "Found $COMPLETION_DOCS completion documents"
echo ""

# Step 7: Summary
echo "📋 Summary:"
echo "==========="
if [ $DETECTION_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ Stage 1 (Detection) completed successfully${NC}"
    echo ""
    echo "Next steps:"
    echo "  - Review the output above"
    echo "  - Check .kiro/release-triggers/ for new trigger files"
    echo "  - If detection worked, proceed to Stage 2: npm run release:analyze"
else
    echo -e "${RED}✗ Stage 1 (Detection) failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  - Check .kiro/logs/release-manager.log for errors"
    echo "  - Verify .kiro/hooks/release-manager.sh has execute permissions"
    echo "  - Ensure completion documents exist in .kiro/specs/"
fi
echo ""

# Step 8: Cleanup prompt
echo "🧹 Cleanup:"
read -p "Remove test trigger file? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm "$TEST_TRIGGER"
    echo -e "${GREEN}✓ Test trigger file removed${NC}"
else
    echo -e "${YELLOW}Test trigger file kept: $TEST_TRIGGER${NC}"
fi

echo ""
echo "🎉 Stage 1 dry-run complete!"
