#!/bin/bash
#
# Release Analysis Agent Hook
# Automatically analyzes changes after task completion via Kiro agent
#

set -e

# Configuration
QUICK_MODE="--quick"
TIMEOUT=10
FAIL_SILENTLY=true
CACHE_RESULTS=true

# Run analysis with timeout
if [ "$FAIL_SILENTLY" = "true" ]; then
    # Non-blocking mode
    timeout $TIMEOUT npm run release:analyze $QUICK_MODE 2>/dev/null || exit 0
else
    # Blocking mode
    timeout $TIMEOUT npm run release:analyze $QUICK_MODE || exit 1
fi

exit 0
