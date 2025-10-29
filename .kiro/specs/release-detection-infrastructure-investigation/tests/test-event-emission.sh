#!/bin/bash
# Test: Agent Hook Event Emission
# Purpose: Test if Kiro IDE emits taskStatusChange events and if hooks trigger
# Hypothesis: Kiro IDE may not be emitting events or hooks may not be triggering
# Usage: ./test-event-emission.sh
# Expected: If system works, we should see evidence of hook execution

set -e

echo "========================================="
echo "Test: Agent Hook Event Emission"
echo "========================================="
echo ""
echo "Purpose: Determine if Kiro IDE emits taskStatusChange events"
echo "          and if agent hooks respond to these events"
echo ""

# Test setup
PROJECT_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
RELEASE_LOG="$PROJECT_ROOT/.kiro/logs/release-manager.log"
TRIGGER_DIR="$PROJECT_ROOT/.kiro/release-triggers"
TEST_MARKER="test-event-emission-$(date +%s)"

echo "Project Root: $PROJECT_ROOT"
echo "Release Log: $RELEASE_LOG"
echo "Trigger Directory: $TRIGGER_DIR"
echo ""

# Check if log file exists
echo "Step 1: Check for existing release manager log"
echo "---------------------------------------------"
if [ -f "$RELEASE_LOG" ]; then
    echo "✅ Release manager log exists"
    echo "   Last modified: $(stat -f "%Sm" "$RELEASE_LOG" 2>/dev/null || stat -c "%y" "$RELEASE_LOG" 2>/dev/null)"
    echo "   Last 3 entries:"
    tail -n 3 "$RELEASE_LOG" | sed 's/^/   /'
else
    echo "❌ Release manager log does NOT exist"
    echo "   This suggests the hook has never run"
fi
echo ""

# Check for recent trigger files
echo "Step 2: Check for recent trigger files"
echo "---------------------------------------"
if [ -d "$TRIGGER_DIR" ]; then
    RECENT_TRIGGERS=$(find "$TRIGGER_DIR" -name "*.json" -mtime -1 2>/dev/null | wc -l | tr -d ' ')
    echo "✅ Trigger directory exists"
    echo "   Trigger files created in last 24 hours: $RECENT_TRIGGERS"
    if [ "$RECENT_TRIGGERS" -gt 0 ]; then
        echo "   Recent triggers:"
        find "$TRIGGER_DIR" -name "*.json" -mtime -1 -exec basename {} \; | sed 's/^/   - /'
    fi
else
    echo "❌ Trigger directory does NOT exist"
fi
echo ""

# Check hook configurations
echo "Step 3: Check agent hook configurations"
echo "----------------------------------------"
HOOK_DIR="$PROJECT_ROOT/.kiro/agent-hooks"
if [ -d "$HOOK_DIR" ]; then
    echo "✅ Agent hooks directory exists"
    HOOK_COUNT=$(find "$HOOK_DIR" -name "*.json" | wc -l | tr -d ' ')
    echo "   Number of hook configurations: $HOOK_COUNT"
    echo "   Hook files:"
    find "$HOOK_DIR" -name "*.json" -exec basename {} \; | sed 's/^/   - /'
else
    echo "❌ Agent hooks directory does NOT exist"
fi
echo ""

# Test if we can detect hook execution
echo "Step 4: Test hook execution detection"
echo "--------------------------------------"
echo "This test will:"
echo "1. Record current state (log timestamp, trigger count)"
echo "2. Instruct you to mark a task complete using taskStatus tool"
echo "3. Wait for hook execution"
echo "4. Check if state changed (new log entries, new triggers)"
echo ""

# Record current state
if [ -f "$RELEASE_LOG" ]; then
    LOG_SIZE_BEFORE=$(wc -l < "$RELEASE_LOG")
    LOG_TIMESTAMP_BEFORE=$(stat -f "%m" "$RELEASE_LOG" 2>/dev/null || stat -c "%Y" "$RELEASE_LOG" 2>/dev/null)
else
    LOG_SIZE_BEFORE=0
    LOG_TIMESTAMP_BEFORE=0
fi

TRIGGER_COUNT_BEFORE=$(find "$TRIGGER_DIR" -name "*.json" 2>/dev/null | wc -l | tr -d ' ')

echo "Current state recorded:"
echo "  - Log file size: $LOG_SIZE_BEFORE lines"
echo "  - Log timestamp: $LOG_TIMESTAMP_BEFORE"
echo "  - Trigger count: $TRIGGER_COUNT_BEFORE"
echo ""

echo "========================================="
echo "MANUAL TEST REQUIRED"
echo "========================================="
echo ""
echo "Please perform the following steps:"
echo ""
echo "1. Open the tasks.md file for this spec:"
echo "   .kiro/specs/release-detection-infrastructure-investigation/tasks.md"
echo ""
echo "2. Find a task that is currently 'in_progress'"
echo ""
echo "3. Use the Kiro IDE taskStatus tool to mark it 'completed'"
echo "   (Do NOT manually edit the file - use the taskStatus tool)"
echo ""
echo "4. Wait 10 seconds for hooks to execute"
echo ""
echo "5. Press ENTER when ready to check results"
echo ""
read -p "Press ENTER after completing the above steps..."
echo ""

# Wait a bit more to ensure hooks have time to execute
echo "Waiting 5 more seconds for hook execution..."
sleep 5
echo ""

# Check for changes
echo "Step 5: Check for evidence of hook execution"
echo "---------------------------------------------"

EVIDENCE_FOUND=false

# Check log file
if [ -f "$RELEASE_LOG" ]; then
    LOG_SIZE_AFTER=$(wc -l < "$RELEASE_LOG")
    LOG_TIMESTAMP_AFTER=$(stat -f "%m" "$RELEASE_LOG" 2>/dev/null || stat -c "%Y" "$RELEASE_LOG" 2>/dev/null)
    
    if [ "$LOG_SIZE_AFTER" -gt "$LOG_SIZE_BEFORE" ]; then
        echo "✅ EVIDENCE FOUND: Log file grew"
        echo "   Before: $LOG_SIZE_BEFORE lines"
        echo "   After: $LOG_SIZE_AFTER lines"
        echo "   New entries: $((LOG_SIZE_AFTER - LOG_SIZE_BEFORE))"
        echo ""
        echo "   New log entries:"
        tail -n $((LOG_SIZE_AFTER - LOG_SIZE_BEFORE)) "$RELEASE_LOG" | sed 's/^/   /'
        EVIDENCE_FOUND=true
    elif [ "$LOG_TIMESTAMP_AFTER" -gt "$LOG_TIMESTAMP_BEFORE" ]; then
        echo "⚠️  PARTIAL EVIDENCE: Log file timestamp changed but size didn't"
        echo "   This might indicate hook started but didn't log anything"
    else
        echo "❌ NO EVIDENCE: Log file unchanged"
        echo "   Size: $LOG_SIZE_AFTER lines (same as before)"
        echo "   Timestamp: $LOG_TIMESTAMP_AFTER (same as before)"
    fi
else
    echo "❌ NO EVIDENCE: Log file still doesn't exist"
fi
echo ""

# Check trigger files
TRIGGER_COUNT_AFTER=$(find "$TRIGGER_DIR" -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
if [ "$TRIGGER_COUNT_AFTER" -gt "$TRIGGER_COUNT_BEFORE" ]; then
    echo "✅ EVIDENCE FOUND: New trigger files created"
    echo "   Before: $TRIGGER_COUNT_BEFORE triggers"
    echo "   After: $TRIGGER_COUNT_AFTER triggers"
    echo "   New triggers: $((TRIGGER_COUNT_AFTER - TRIGGER_COUNT_BEFORE))"
    echo ""
    echo "   New trigger files:"
    find "$TRIGGER_DIR" -name "*.json" -newer "$RELEASE_LOG" 2>/dev/null -exec basename {} \; | sed 's/^/   - /' || echo "   (Could not determine new files)"
    EVIDENCE_FOUND=true
else
    echo "❌ NO EVIDENCE: No new trigger files"
    echo "   Count: $TRIGGER_COUNT_AFTER (same as before)"
fi
echo ""

# Final assessment
echo "========================================="
echo "TEST RESULTS"
echo "========================================="
echo ""

if [ "$EVIDENCE_FOUND" = true ]; then
    echo "Result: ✅ HOOKS ARE TRIGGERING"
    echo ""
    echo "Evidence: Hook execution detected through log entries or trigger files"
    echo ""
    echo "Conclusion: The agent hook system IS working. Hooks are being triggered"
    echo "            by taskStatusChange events. Any issues are likely in the"
    echo "            hook scripts themselves, not in the event emission or"
    echo "            hook triggering mechanism."
    echo ""
    echo "Next Steps:"
    echo "  - Investigate why hooks may be failing or timing out"
    echo "  - Check hook scripts for bugs or blocking operations"
    echo "  - Review hook timeout settings"
else
    echo "Result: ❌ NO EVIDENCE OF HOOK EXECUTION"
    echo ""
    echo "Evidence: No changes detected in logs or trigger files"
    echo ""
    echo "Possible Causes:"
    echo "  1. Kiro IDE is not emitting taskStatusChange events"
    echo "  2. Agent hook system is not receiving events"
    echo "  3. Hooks are not properly registered with Kiro IDE"
    echo "  4. Hooks are failing silently before any logging occurs"
    echo "  5. taskStatus tool was not used (manual edit doesn't trigger hooks)"
    echo ""
    echo "Next Steps:"
    echo "  - Verify taskStatus tool was actually used (not manual edit)"
    echo "  - Check if Kiro IDE has hook execution UI or logs"
    echo "  - Try manually triggering release-manager.sh to verify script works"
    echo "  - Contact Kiro IDE team about event emission and hook logging"
fi
echo ""

echo "========================================="
echo "ADDITIONAL DIAGNOSTICS"
echo "========================================="
echo ""

# Check if file organization hook exists
echo "File Organization Hook Status:"
if [ -f "$PROJECT_ROOT/.kiro/agent-hooks/organize-after-task-completion.json" ]; then
    echo "  ✅ File organization hook configuration exists"
else
    echo "  ❌ File organization hook configuration NOT found"
fi
echo ""

# Check if release detection hook exists
echo "Release Detection Hook Status:"
if [ -f "$PROJECT_ROOT/.kiro/agent-hooks/release-detection-on-task-completion.json" ]; then
    echo "  ✅ Release detection hook configuration exists"
    
    # Check if it has runAfter dependency
    if grep -q "runAfter" "$PROJECT_ROOT/.kiro/agent-hooks/release-detection-on-task-completion.json"; then
        echo "  ✅ Has runAfter dependency on file organization"
        echo "     (Release detection waits for file organization to complete)"
    fi
else
    echo "  ❌ Release detection hook configuration NOT found"
fi
echo ""

# Check for any hook execution in system logs (if available)
echo "System-Level Hook Logs:"
if [ -d "$PROJECT_ROOT/.kiro/logs" ]; then
    HOOK_LOGS=$(find "$PROJECT_ROOT/.kiro/logs" -name "*hook*" -o -name "*agent*" 2>/dev/null)
    if [ -n "$HOOK_LOGS" ]; then
        echo "  ✅ Found potential hook-related logs:"
        echo "$HOOK_LOGS" | sed 's/^/     /'
    else
        echo "  ❌ No hook-related logs found in .kiro/logs/"
    fi
else
    echo "  ❌ .kiro/logs directory not found"
fi
echo ""

echo "Test complete!"
echo ""
echo "For investigation notes, record:"
echo "  - Whether evidence of hook execution was found"
echo "  - Which hooks appear to be working or not working"
echo "  - Whether this appears to be systemic (all hooks) or isolated (specific hooks)"
