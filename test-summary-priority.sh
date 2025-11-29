#!/bin/bash

# Test script to verify summary document prioritization
# Tests that the system prefers summary documents over completion documents

echo "🧪 Testing Summary Document Prioritization"
echo "=========================================="
echo ""

# Count summary documents
SUMMARY_COUNT=$(find docs/specs -name "task-*-summary.md" 2>/dev/null | wc -l | tr -d ' ')
echo "📄 Summary documents found: $SUMMARY_COUNT"

# Count completion documents
COMPLETION_COUNT=$(find .kiro/specs -name "task-*-completion.md" 2>/dev/null | wc -l | tr -d ' ')
echo "📄 Completion documents found: $COMPLETION_COUNT"

echo ""
echo "🔍 Running analysis with summary prioritization..."
echo ""

# Run analysis (this will use the new preferSummaries: true config)
npm run release:analyze 2>&1 | tee test-summary-analysis-output.txt

echo ""
echo "📊 Analysis Results:"
echo "==================="

# Check how many documents were analyzed
ANALYZED_COUNT=$(grep -o "Documents Analyzed: [0-9]*" test-summary-analysis-output.txt | grep -o "[0-9]*" || echo "0")
echo "Documents analyzed: $ANALYZED_COUNT"

# Check if summaries were preferred
SUMMARY_USED=$(grep -c "summary.md" test-summary-analysis-output.txt || echo "0")
echo "Summary documents used: $SUMMARY_USED"

echo ""
echo "✅ Expected behavior:"
echo "   - Should analyze ~$SUMMARY_COUNT documents (summaries)"
echo "   - Should skip completion docs where summaries exist"
echo "   - Should fall back to completion docs where no summary exists"

echo ""
echo "📝 Full output saved to: test-summary-analysis-output.txt"
