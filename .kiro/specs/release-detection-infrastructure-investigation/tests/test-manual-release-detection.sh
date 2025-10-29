#!/bin/bash
# Test: Manual Release Detection
# Purpose: Test if .kiro/hooks/release-manager.sh auto works when invoked manually
# Hypothesis: The script itself works correctly, but hook triggering is the issue
# Usage: ./test-manual-release-detection.sh
# Expected: Script should execute, create trigger files, and log activity

set -e

echo "=========================================="
echo "Test: Manual Release Detection"
echo "=========================================="
echo ""
echo "Purpose: Verify release-manager.sh works when called manually"
echo "Hypothesis: Script is functional, hook triggering is the problem"
echo ""

# Check if script exists
echo "Step 1: Checking if release-manager.sh exists..."
if [ -f ".kiro/hooks/release-manager.sh" ]; then
    echo "✅ Script exists at .kiro/hooks/release-manager.sh"
else
    echo "❌ Script NOT found at .kiro/hooks/release-manager.sh"
    exit 1
fi

# Check if script is executable
echo ""
echo "Step 2: Checking if script is executable..."
if [ -x ".kiro/hooks/release-manager.sh" ]; then
    echo "✅ Script has execute permissions"
else
    echo "⚠️  Script is not executable, adding execute permissions..."
    chmod +x .kiro/hooks/release-manager.sh
    echo "✅ Execute permissions added"
fi

# Check log file before execution
echo ""
echo "Step 3: Checking log file before execution..."
if [ -f ".kiro/logs/release-manager.log" ]; then
    BEFORE_LINE_COUNT=$(wc -l < .kiro/logs/release-manager.log)
    echo "✅ Log file exists with $BEFORE_LINE_COUNT lines"
    echo "Last 3 log entries:"
    tail -n 3 .kiro/logs/release-manager.log
else
    echo "⚠️  Log file does not exist yet"
    BEFORE_LINE_COUNT=0
fi

# Check trigger directory before execution
echo ""
echo "Step 4: Checking trigger directory before execution..."
if [ -d ".kiro/release-triggers" ]; then
    BEFORE_TRIGGER_COUNT=$(ls -1 .kiro/release-triggers/*.json 2>/dev/null | wc -l)
    echo "✅ Trigger directory exists with $BEFORE_TRIGGER_COUNT trigger files"
else
    echo "⚠️  Trigger directory does not exist"
    BEFORE_TRIGGER_COUNT=0
fi

# Execute release-manager.sh auto
echo ""
echo "Step 5: Executing release-manager.sh auto..."
echo "Command: ./.kiro/hooks/release-manager.sh auto"
echo ""
echo "--- Script Output Start ---"
./.kiro/hooks/release-manager.sh auto
SCRIPT_EXIT_CODE=$?
echo "--- Script Output End ---"
echo ""
echo "Script exit code: $SCRIPT_EXIT_CODE"

# Check log file after execution
echo ""
echo "Step 6: Checking log file after execution..."
if [ -f ".kiro/logs/release-manager.log" ]; then
    AFTER_LINE_COUNT=$(wc -l < .kiro/logs/release-manager.log)
    NEW_LINES=$((AFTER_LINE_COUNT - BEFORE_LINE_COUNT))
    echo "✅ Log file now has $AFTER_LINE_COUNT lines ($NEW_LINES new lines)"
    if [ $NEW_LINES -gt 0 ]; then
        echo "New log entries:"
        tail -n $NEW_LINES .kiro/logs/release-manager.log
    else
        echo "⚠️  No new log entries created"
    fi
else
    echo "❌ Log file still does not exist"
fi

# Check trigger directory after execution
echo ""
echo "Step 7: Checking trigger directory after execution..."
if [ -d ".kiro/release-triggers" ]; then
    AFTER_TRIGGER_COUNT=$(ls -1 .kiro/release-triggers/*.json 2>/dev/null | wc -l)
    NEW_TRIGGERS=$((AFTER_TRIGGER_COUNT - BEFORE_TRIGGER_COUNT))
    echo "✅ Trigger directory now has $AFTER_TRIGGER_COUNT trigger files ($NEW_TRIGGERS new)"
    if [ $NEW_TRIGGERS -gt 0 ]; then
        echo "New trigger files:"
        ls -lt .kiro/release-triggers/*.json | head -n $NEW_TRIGGERS
    else
        echo "⚠️  No new trigger files created"
    fi
else
    echo "❌ Trigger directory still does not exist"
fi

# Summary
echo ""
echo "=========================================="
echo "Test Results Summary"
echo "=========================================="
echo ""

if [ $SCRIPT_EXIT_CODE -eq 0 ]; then
    echo "✅ Script executed successfully (exit code 0)"
else
    echo "❌ Script failed with exit code $SCRIPT_EXIT_CODE"
fi

if [ $NEW_LINES -gt 0 ]; then
    echo "✅ Log entries were created"
else
    echo "❌ No log entries were created"
fi

if [ $NEW_TRIGGERS -gt 0 ]; then
    echo "✅ Trigger files were created"
else
    echo "❌ No trigger files were created"
fi

echo ""
echo "=========================================="
echo "Conclusion"
echo "=========================================="
echo ""

if [ $SCRIPT_EXIT_CODE -eq 0 ] && [ $NEW_LINES -gt 0 ]; then
    echo "✅ HYPOTHESIS CONFIRMED: Script works correctly when invoked manually"
    echo ""
    echo "Evidence:"
    echo "- Script executed without errors"
    echo "- Log entries were created"
    echo "- Script is functional"
    echo ""
    echo "Implication: The problem is NOT with the script itself,"
    echo "but with the hook triggering mechanism in Kiro IDE."
else
    echo "❌ HYPOTHESIS REJECTED: Script has issues even when run manually"
    echo ""
    echo "Evidence:"
    echo "- Script exit code: $SCRIPT_EXIT_CODE"
    echo "- New log lines: $NEW_LINES"
    echo "- New triggers: $NEW_TRIGGERS"
    echo ""
    echo "Implication: The script itself has problems that need to be fixed"
    echo "before investigating hook triggering."
fi

echo ""
