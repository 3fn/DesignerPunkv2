# Kiro IDE Agent Hooks Reference

**Date**: October 30, 2025
**Purpose**: Reference documentation for Kiro IDE Agent Hooks system
**Organization**: process-standard
**Scope**: cross-project
**Source**: Converted from hooksDocumentation.rtf for AI readability

---

## What are Agent Hooks?

Agent Hooks are event-driven automations inside Kiro IDE: when a certain event happens (like saving a file, creating a file, deleting a file, or manually triggering), your agent takes a predefined action.

### Why Use Them

- **Automate repetitive tasks**: Generate tests, update docs automatically
- **Maintain consistency**: Ensure standards across your codebase
- **Free up focus**: Spend time building instead of tedious maintenance

### How It Works (Basic Flow)

1. An event is detected (file saved, file created, etc.)
2. A prompt (or instructions) is sent to the agent
3. The agent executes the action (e.g., generate code, run tests, update docs)

### How to Get Started

- **Via Sidebar**: In Kiro's Explorer view → "Agent Hooks" section → click `+` to create a new hook
- **Via Command Palette**: `Ctrl/Cmd + Shift + P` → "Kiro: Open Kiro Hook UI"

---

## Hook Types

You have different kinds of triggers you can use to run a hook.

| Trigger Type | When it fires | Typical Use Cases |
|-------------|---------------|-------------------|
| **On File Create** | When a new file matching a pattern is created | Auto-generate boilerplate for new components, add license headers, set up tests |
| **On File Save** | When a matching file is saved | Run lint/formatting, regenerate docs/tests, update dependencies |
| **On File Delete** | When a matching file is deleted | Clean up imports, references, update other related files |
| **Manual Trigger** | You run it yourself (button, command) | On-demand tasks: full code review, security scans, one-off maintenance |

**Tip**: Choose the trigger that matches when you want the action to happen. That helps avoid over-firing or missing moments.

---

## Hook Management

Once you have hooks, you'll want to manage them effectively.

### Key Features

- **Enable/Disable**: Toggle hooks on/off without deleting them
- **Edit**: Change triggers, file patterns, instructions, descriptions at any time (updates apply immediately)
- **Delete**: Remove unused hooks (this action is irreversible)
- **Manual Run**: For hooks with manual trigger, click "▶" or "Start Hook" to execute on demand

**Best practice**: Keep your hooks organized, document their purpose & patterns, and review them periodically as your project evolves.

---

## Best Practices

### Hook Design

- **Be Specific & Clear**: One task per hook, clear instructions, numbered steps if complex
- **Test Thoroughly**: Use sample files, check edge cases, start small
- **Monitor Performance**: Ensure hooks don't slow your workflow, keep triggers efficient

### Security Considerations

- **Validate Inputs**: Handle unexpected file content gracefully
- **Limit Scope**: Use precise file patterns and restrict directories to avoid running when unnecessary
- **Review Regularly**: As project changes, update/remove outdated hooks

### Team Collaboration

- **Document Hooks**: Purpose, patterns, expected behaviour
- **Share Configurations**: Version control your hooks so the whole team uses the same automations
- **Version Control Integration**: Consider hook versions, compatibility, migrations

---

## Examples

Here are some real-world hook templates you can adapt.

### Security Pre-Commit Scanner

- **Trigger**: On File Save (`**/*`)
- **Instructions**: Scan changed files for API keys, tokens, credentials; flag issues; suggest secure alternatives

### Internationalization Helper

- **Trigger**: On File Save (e.g., `src/locales/en/*.json`)
- **Instructions**: Detect added or modified keys, check other languages, mark missing ones as "NEEDS_TRANSLATION" or "NEEDS_REVIEW"

### Documentation Generator

- **Trigger**: Manual
- **Instructions**: For current file: extract function/class signatures, document params/return types, update README, ensure docs follow standards

### Test Coverage Maintainer

- **Trigger**: On File Save (e.g., `src/**/*.{js,ts,jsx,tsx}`)
- **Instructions**: Identify new/modified methods, check for corresponding tests, generate missing tests, run tests, update coverage reports

### Validate Figma Design (Advanced)

- **Trigger**: On File Save (`*.css`, `*.html`)
- **Instructions**: Use an external design-tool (via MCP) to verify UI elements align with design system (colors, placement, hero sections)

---

## Troubleshooting

If a hook isn't working as expected—here are common issues and how to fix them.

| Issue | What to check |
|-------|--------------|
| **Hook not triggering** | - Confirm file pattern matches actual files<br>- Check if hook is enabled<br>- Ensure correct trigger type selected |
| **Unexpected behaviour / too many triggers** | - Are patterns too broad?<br>- Do instructions match what you expect?<br>- Are there conflicting hooks? |
| **Performance is slow** | - Simplify instructions<br>- Narrow down file patterns<br>- Reduce trigger frequency or batch operations |

### Debug Tips

- Look at hook execution logs in the Agent Hooks panel
- Start with a simple hook implementation → test → expand
- Validate that the files you expect are actually in the watched workspace (not outside)

---

## Summary for AI Agents

**What you need to remember**:

- You'll monitor events (create, save, delete, manual) on files → when they match patterns, you'll execute instructions
- Your instructions should be clear, specific, and scoped to avoid running when not needed
- When triggered, you act: generate code, tests, docs, scan security, sync translations—whatever the hook says
- Keep performance and reliability in mind: avoid slow, overly broad hooks
- Work well with humans: your hook definitions should be documented, version-controlled, and team-friendly
- When issues happen, check triggers, patterns, instructions, enabled status, logs

---

## Hook Configuration Format

Based on working examples in this project, Kiro IDE hooks use the `.kiro.hook` format:

```json
{
  "enabled": true,
  "name": "Hook Name",
  "description": "What this hook does and when it runs",
  "version": "1",
  "when": {
    "type": "fileCreated" | "fileEdited" | "fileDeleted" | "manual",
    "patterns": ["**/*.md"]  // For file-based triggers
  },
  "then": {
    "type": "runShellScript" | "askAgent",
    "script": "./path/to/script.sh",  // For runShellScript
    "prompt": "Instructions for agent"  // For askAgent
  }
}
```

### Supported Trigger Types

- `fileCreated` - When a new file matching pattern is created
- `fileEdited` - When a file matching pattern is saved/edited
- `fileDeleted` - When a file matching pattern is deleted
- `manual` - User-initiated trigger (no patterns needed)

### Supported Action Types

- `runShellScript` - Execute a shell script
- `askAgent` - Send prompt to AI agent for execution

---

*This reference provides the essential information for creating and managing Kiro IDE Agent Hooks effectively.*
