# Meta-Guide Changes for MCP Integration Test (Natural Scenarios)

**Purpose**: Instructions for Peter to test MCP integration through natural scenarios.

---

## Documents Already Changed ✅

| Document | Current Status | Tokens Saved |
|----------|---------------|--------------|
| A Vision of the Future | `inclusion: manual` ✅ | ~8,800 |
| Task-Type-Definitions | `inclusion: manual` ✅ | ~3,800 |
| BUILD-SYSTEM-SETUP | `inclusion: manual` ✅ | ~2,000 |
| **Total Savings** | **Complete** | **~14,600** |

**Status**: All front matter changes are already complete! Ready for natural scenario testing.

---

## Natural Testing Approach

Instead of explicitly asking AI to query MCP, we now test **natural scenarios** where AI agents would organically need information:

### Test 1: Architectural Evaluation
**Scenario**: "Assess if DesignerPunk is over-engineered"
**Expected**: AI should naturally recognize need for architectural vision and query MCP for "A Vision of the Future"

### Test 2: Spec Creation  
**Scenario**: "Create spec for Icon Token System"
**Expected**: AI should naturally recognize need for task classification and query MCP for "Task-Type-Definitions"

### Test 3: Build Troubleshooting
**Scenario**: "Fix 'method not found' error"  
**Expected**: AI should naturally recognize need for build guidance and query MCP for "BUILD-SYSTEM-SETUP"

---

## Testing Instructions

1. **Restart Kiro** (if not already done)
2. **Start a new chat session**
3. **Execute Task 1.1**: "Assess if DesignerPunk is over-engineered"
4. **Observe**: Does AI naturally query MCP without being told to?
5. **Success**: AI recognizes knowledge gap and queries MCP organically

---

## What to Look For

**When AI starts:**
- ❌ Should NOT have these docs auto-loaded:
  - A Vision of the Future.md
  - Task-Type-Definitions.md  
  - BUILD-SYSTEM-SETUP.md

**During task execution:**
- ✅ AI should recognize when it needs additional context
- ✅ AI should naturally query MCP tools (`get_document_summary`, `get_section`)
- ✅ AI should apply MCP information to complete the task

**Key difference**: AI queries MCP because it recognizes a knowledge gap, not because we told it to.

---

## Success Criteria

This test succeeds if AI agents:
1. **Recognize knowledge gaps** during natural scenarios
2. **Automatically query MCP** without explicit instruction  
3. **Apply MCP information** to provide informed responses
4. **Complete tasks successfully** using MCP-sourced knowledge

This validates the real value proposition: seamless knowledge access when needed.

---

## Rollback Instructions

If natural testing fails, revert each file:
- Change `inclusion: manual` back to `inclusion: conditional`
- Restore original trigger lines
- This will auto-load the docs again for debugging
