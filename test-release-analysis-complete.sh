#!/bin/bash

# Stage 2: Complete Analysis Test
# Run full analysis and capture complete output

echo "🧪 Release Management System - Stage 2 Complete Analysis"
echo "=========================================================="
echo ""
echo "This will run a FULL analysis of all 1,391 completion documents."
echo "Expected time: 2-5 minutes"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create output directory
mkdir -p .kiro/dry-run-results

OUTPUT_FILE=".kiro/dry-run-results/stage-2-analysis-$(date +%Y%m%d-%H%M%S).txt"

echo "📊 Running analysis..."
echo "Output will be saved to: $OUTPUT_FILE"
echo ""
echo -e "${BLUE}⏳ This may take several minutes...${NC}"
echo ""

# Run analysis with full output capture
npm run release:analyze 2>&1 | tee "$OUTPUT_FILE"

ANALYSIS_EXIT_CODE=${PIPESTATUS[0]}

echo ""
echo "=================================================="
echo ""

if [ $ANALYSIS_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Analysis completed successfully!${NC}"
    echo ""
    
    # Extract key metrics
    echo "📊 Key Metrics:"
    echo "==============="
    
    # Version recommendation
    if grep -q "Version:" "$OUTPUT_FILE"; then
        echo -e "${GREEN}Version Recommendation:${NC}"
        grep "Version:" "$OUTPUT_FILE" | head -1
    fi
    
    # Bump type
    if grep -q "Bump type:" "$OUTPUT_FILE"; then
        echo -e "${GREEN}Bump Type:${NC}"
        grep "Bump type:" "$OUTPUT_FILE" | head -1
    fi
    
    # Confidence
    if grep -q "Confidence:" "$OUTPUT_FILE"; then
        echo -e "${GREEN}Confidence:${NC}"
        grep "Confidence:" "$OUTPUT_FILE" | head -1
    fi
    
    # Changes detected
    if grep -q "Changes:" "$OUTPUT_FILE"; then
        echo -e "${GREEN}Changes Detected:${NC}"
        grep "Changes:" "$OUTPUT_FILE" | head -1
    fi
    
    # Breaking changes
    if grep -q "breaking change" "$OUTPUT_FILE"; then
        BREAKING_COUNT=$(grep -c "breaking change" "$OUTPUT_FILE")
        echo -e "${YELLOW}Breaking Changes: $BREAKING_COUNT mentions${NC}"
    fi
    
    echo ""
    echo "📄 Full output saved to:"
    echo "   $OUTPUT_FILE"
    echo ""
    echo "📝 To review the complete analysis:"
    echo "   cat $OUTPUT_FILE"
    echo ""
    echo "🎯 Next Steps:"
    echo "   - Review the version recommendation"
    echo "   - Check if breaking changes are accurate"
    echo "   - Verify release notes are meaningful"
    echo "   - Proceed to Stage 3: Full workflow dry-run"
    
else
    echo -e "${RED}❌ Analysis failed with exit code: $ANALYSIS_EXIT_CODE${NC}"
    echo ""
    echo "📄 Error output saved to:"
    echo "   $OUTPUT_FILE"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "   - Review the output file for error messages"
    echo "   - Check if completion documents have proper format"
    echo "   - Verify AI analysis service is accessible"
fi

echo ""
echo "🎉 Stage 2 complete analysis finished!"
