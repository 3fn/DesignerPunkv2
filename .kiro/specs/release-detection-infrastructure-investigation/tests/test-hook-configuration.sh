#!/bin/bash
# Test: Hook Configuration Analysis
# Purpose: Analyze hook configuration files to identify potential issues
# Hypothesis: Hook configuration may be disabled, malformed, or conflicting
# Usage: ./test-hook-configuration.sh
# Expected: Identify configuration issues that prevent hook execution

set -e

echo "=========================================="
echo "Test: Hook Configuration Analysis"
echo "=========================================="
echo ""
echo "Purpose: Analyze hook configurations for issues"
echo "Hypothesis: Configuration problems prevent hook execution"
echo ""

# Test Hypothesis 1: Hook is Disabled by Default
echo "=========================================="
echo "Hypothesis 1: Hook is Disabled by Default"
echo "=========================================="
echo ""

HOOK_CONFIG=".kiro/agent-hooks/release-detection-on-task-completion.json"

if [ -f "$HOOK_CONFIG" ]; then
    echo "✅ Hook configuration exists: $HOOK_CONFIG"
    echo ""
    echo "Configuration contents:"
    cat "$HOOK_CONFIG"
    echo ""
    
    # Check for enabled field
    if grep -q '"enabled"' "$HOOK_CONFIG"; then
        ENABLED_VALUE=$(grep '"enabled"' "$HOOK_CONFIG" | sed 's/.*: *\(.*\),*/\1/')
        echo "Found 'enabled' field: $ENABLED_VALUE"
        
        if echo "$ENABLED_VALUE" | grep -q "false"; then
            echo "❌ ISSUE FOUND: Hook is explicitly disabled"
            echo "   This would prevent the hook from running"
        else
            echo "✅ Hook is enabled or enabled field is true"
        fi
    else
        echo "⚠️  No 'enabled' field found (may default to enabled)"
    fi
    
    # Check for autoApprove field
    if grep -q '"autoApprove"' "$HOOK_CONFIG"; then
        AUTO_APPROVE=$(grep '"autoApprove"' "$HOOK_CONFIG" | sed 's/.*: *\(.*\),*/\1/')
        echo "Found 'autoApprove' field: $AUTO_APPROVE"
        
        if echo "$AUTO_APPROVE" | grep -q "true"; then
            echo "✅ Hook is set to auto-approve (no user confirmation needed)"
        else
            echo "⚠️  Hook requires user confirmation (may block execution)"
        fi
    fi
    
    # Check for requireConfirmation field
    if grep -q '"requireConfirmation"' "$HOOK_CONFIG"; then
        REQUIRE_CONFIRM=$(grep '"requireConfirmation"' "$HOOK_CONFIG" | sed 's/.*: *\(.*\),*/\1/')
        echo "Found 'requireConfirmation' field: $REQUIRE_CONFIRM"
        
        if echo "$REQUIRE_CONFIRM" | grep -q "true"; then
            echo "⚠️  Hook requires user confirmation (may block execution)"
        else
            echo "✅ Hook does not require confirmation"
        fi
    fi
else
    echo "❌ Hook configuration NOT found: $HOOK_CONFIG"
    echo "   This would definitely prevent the hook from running"
fi

echo ""

# Test Hypothesis 6: Two Hook Systems Conflict
echo "=========================================="
echo "Hypothesis 6: Two Hook Systems Conflict"
echo "=========================================="
echo ""

ANALYSIS_HOOK=".kiro/agent-hooks/release-analysis-on-task-completion.json"
DETECTION_HOOK=".kiro/agent-hooks/release-detection-on-task-completion.json"

echo "Checking for multiple release-related hooks..."
echo ""

ANALYSIS_EXISTS=false
DETECTION_EXISTS=false

if [ -f "$ANALYSIS_HOOK" ]; then
    echo "✅ Found: release-analysis-on-task-completion.json"
    ANALYSIS_EXISTS=true
    
    # Check if enabled
    if grep -q '"enabled"' "$ANALYSIS_HOOK"; then
        ANALYSIS_ENABLED=$(grep '"enabled"' "$ANALYSIS_HOOK" | sed 's/.*: *\(.*\),*/\1/')
        echo "   Status: $ANALYSIS_ENABLED"
    else
        echo "   Status: Unknown (no enabled field)"
    fi
else
    echo "⚠️  Not found: release-analysis-on-task-completion.json"
fi

echo ""

if [ -f "$DETECTION_HOOK" ]; then
    echo "✅ Found: release-detection-on-task-completion.json"
    DETECTION_EXISTS=true
    
    # Check if enabled
    if grep -q '"enabled"' "$DETECTION_HOOK"; then
        DETECTION_ENABLED=$(grep '"enabled"' "$DETECTION_HOOK" | sed 's/.*: *\(.*\),*/\1/')
        echo "   Status: $DETECTION_ENABLED"
    else
        echo "   Status: Unknown (no enabled field)"
    fi
else
    echo "⚠️  Not found: release-detection-on-task-completion.json"
fi

echo ""

if [ "$ANALYSIS_EXISTS" = true ] && [ "$DETECTION_EXISTS" = true ]; then
    echo "⚠️  POTENTIAL ISSUE: Both hooks exist"
    echo "   This could cause conflicts or confusion"
    echo "   Recommendation: Disable one or clarify their relationship"
else
    echo "✅ Only one hook system is configured"
fi

echo ""

# Check all agent hooks
echo "=========================================="
echo "All Agent Hooks in .kiro/agent-hooks/"
echo "=========================================="
echo ""

if [ -d ".kiro/agent-hooks" ]; then
    echo "Agent hook files found:"
    ls -la .kiro/agent-hooks/*.json 2>/dev/null || echo "No .json files found"
    echo ""
    
    echo "Agent hook scripts found:"
    ls -la .kiro/agent-hooks/*.sh 2>/dev/null || echo "No .sh files found"
else
    echo "❌ .kiro/agent-hooks directory does not exist"
fi

echo ""

# Check release configuration
echo "=========================================="
echo "Release Configuration Analysis"
echo "=========================================="
echo ""

RELEASE_CONFIG=".kiro/release-config.json"

if [ -f "$RELEASE_CONFIG" ]; then
    echo "✅ Release configuration exists: $RELEASE_CONFIG"
    echo ""
    echo "Configuration contents:"
    cat "$RELEASE_CONFIG"
    echo ""
    
    # Check if detection is enabled
    if grep -q '"specCompletionTrigger"' "$RELEASE_CONFIG"; then
        SPEC_TRIGGER=$(grep '"specCompletionTrigger"' "$RELEASE_CONFIG" | sed 's/.*: *\(.*\),*/\1/')
        echo "Spec completion trigger: $SPEC_TRIGGER"
    fi
    
    if grep -q '"taskCompletionTrigger"' "$RELEASE_CONFIG"; then
        TASK_TRIGGER=$(grep '"taskCompletionTrigger"' "$RELEASE_CONFIG" | sed 's/.*: *\(.*\),*/\1/')
        echo "Task completion trigger: $TASK_TRIGGER"
    fi
else
    echo "❌ Release configuration NOT found: $RELEASE_CONFIG"
    echo "   This could prevent release detection from working"
fi

echo ""

# Summary
echo "=========================================="
echo "Configuration Analysis Summary"
echo "=========================================="
echo ""

echo "Issues Found:"
echo ""

ISSUES_FOUND=0

if [ ! -f "$HOOK_CONFIG" ]; then
    echo "❌ Hook configuration file missing"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ -f "$HOOK_CONFIG" ] && grep -q '"enabled".*false' "$HOOK_CONFIG"; then
    echo "❌ Hook is explicitly disabled"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ "$ANALYSIS_EXISTS" = true ] && [ "$DETECTION_EXISTS" = true ]; then
    echo "⚠️  Multiple release hooks exist (potential conflict)"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ ! -f "$RELEASE_CONFIG" ]; then
    echo "❌ Release configuration file missing"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ $ISSUES_FOUND -eq 0 ]; then
    echo "✅ No obvious configuration issues found"
    echo ""
    echo "Conclusion: Configuration appears correct."
    echo "The problem likely lies elsewhere (Kiro IDE event emission,"
    echo "agent hook system, or hook registration)."
else
    echo ""
    echo "Conclusion: Found $ISSUES_FOUND configuration issue(s)."
    echo "These issues could prevent the hook from running."
fi

echo ""
