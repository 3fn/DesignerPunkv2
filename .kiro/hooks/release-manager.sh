#!/bin/bash

# Release Manager — thin wrapper around the release tool CLI
# Usage:
#   ./release-manager.sh analyze    — scan changes and display recommendation
#   ./release-manager.sh notes      — generate release notes
#   ./release-manager.sh release    — full release (tag + publish)
#   ./release-manager.sh release --dry-run  — preview without publishing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$PROJECT_ROOT"

COMMAND="${1:-analyze}"
shift 2>/dev/null || true

exec npx ts-node src/tools/release/cli/release-tool.ts "$COMMAND" "$@"
