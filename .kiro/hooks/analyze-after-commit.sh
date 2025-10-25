#!/bin/bash
#
# Release Analysis Git Hook
# Automatically analyzes changes after task completion commits
#

set -e

# Configuration
QUICK_MODE="--quick"
TIMEOUT=10
FAIL_SILENTLY=true
CACHE_RESULTS=true

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🔍 Running release analysis..."

# Run analysis with timeout
if [ "$FAIL_SILENTLY" = "true" ]; then
    # Non-blocking mode
    timeout $TIMEOUT npm run release:analyze $QUICK_MODE 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Release analysis failed (non-blocking)${NC}"
        exit 0
    }
else
    # Blocking mode
    timeout $TIMEOUT npm run release:analyze $QUICK_MODE || {
        echo -e "${RED}❌ Release analysis failed${NC}"
        exit 1
    }
fi

echo -e "${GREEN}✅ Release analysis complete${NC}"
exit 0
