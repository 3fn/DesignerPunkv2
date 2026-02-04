# Research Document: Xcode MCP Integration

**Date**: 2026-02-03
**Spec**: 056 - Xcode MCP Integration
**Status**: Research Phase
**Organization**: spec-guide
**Scope**: 056-xcode-mcp-integration

---

## Executive Summary

Apple announced Xcode 26.3 Release Candidate on February 3, 2026, introducing native Model Context Protocol (MCP) support. This enables AI agents to interact with Xcode's IDE primitives through a standardized protocol.

**Key Finding**: While Xcode 26.3 MCP supports file operations and code editing, **we could not confirm whether it supports asset catalog writes specifically**. This is a critical open question that must be resolved before proceeding to requirements.

This research document captures findings on integration opportunities for DesignerPunk's iOS token generation pipeline.

---

## Key Findings

### 1. Xcode 26.3 MCP Announcement

**Source**: [Apple Newsroom](https://www.apple.com/newsroom/2026/02/xcode-26-point-3-unlocks-the-power-of-agentic-coding/)

Xcode 26.3 introduces "agentic coding" with native integrations for:
- Anthropic's Claude Agent
- OpenAI's Codex

Key quote from Apple: "In addition to these built-in integrations, Xcode 26.3 makes its capabilities available through the Model Context Protocol, an open standard that gives developers the flexibility to use any compatible agent or tool with Xcode."

**Status**: Release Candidate (RC) available to Apple Developer Program members. Full release coming soon via Mac App Store.

---

### 2. Xcode MCP Capabilities

**Source**: [Ars Technica](https://arstechnica.com/apple/2026/02/xcode-26-3-adds-support-for-claude-codex-and-other-agentic-tools-via-mcp/)

Xcode acts as an MCP endpoint exposing:
- **File graph** — Navigate project file structures
- **Documentation search** — Query Apple docs
- **Project settings** — Read and modify build configurations
- **Build/test workflows** — Trigger builds, run tests
- **Simulator control** — Boot simulators, capture screenshots
- **Xcode Previews** — Capture SwiftUI preview screenshots

**Architecture**: Xcode exposes machine-invocable interfaces that AI tools can access. This is a significant shift from previous versions where AI features were limited to chat and code completion.

---

### 3. Detailed Capabilities (FindArticles Analysis)

**Source**: [FindArticles](https://www.findarticles.com/apple-releases-xcode-26-3-with-agentic-coding/)

Agents can:
- Trace dependencies across targets
- Determine which files to modify
- Kick off builds
- Run unit and UI tests
- Iterate until changes compile cleanly
- Adjust project settings (schemes, build phases, entitlements)
- Launch apps in simulator and capture screenshots
- Navigate file trees
- Resolve compile errors
- Update settings
- Drive simulators for visual checks

**Scoped Permissions**: Agents operate with scoped permissions. Developers retain review control with diffs before changes land.

---

### 4. Existing Community MCP Servers

Several third-party MCP servers for Xcode already exist:

#### 4.1 @devyhan/xcode-mcp
**Source**: [mcpservers.org](https://mcpservers.org/servers/devyhan/xcode-mcp)

Tools available:
- `xcode-project-info` — Project/workspace details
- `xcode-list-schemes` — List schemes, targets, configurations
- `xcode-build` — Build projects with options
- `xcode-test` — Run tests with fine-grained control
- `xcode-archive` — Create archives for distribution
- `xcode-codesign-info` — Code signing and provisioning info
- `swift-package-manager` — SPM commands
- `simctl-manager` — Simulator management
- `run-on-device` — Build, install, run on physical devices

**Installation**: `npm install @devyhan/xcode-mcp`

#### 4.2 eddiksonpena/xcode-mcp (115+ Tools)
**Source**: [playbooks.com](https://playbooks.com/mcp/eddiksonpena/xcode-mcp)

**Relevant tools for DesignerPunk**:
- `manage_color_assets` — Manage color assets across the asset catalog
- `validate_asset_catalog` — Validate asset catalogs for consistency
- `optimize_images` — Optimize image assets
- `generate_app_icons` — Generate app icon sets
- `check_asset_sizes` — Check asset dimensions and file sizes

This server exposes 115+ tools including LangGraph workflow support for complex multi-step operations.

#### 4.3 r-huijts/xcode-mcp-server
**Source**: [augmentcode.com](https://www.augmentcode.com/mcp/xcode-mcp-server)

TypeScript-based server with:
- File operations
- Project management
- Workspace parsing
- Build and test capabilities

**Registration in Xcode**: Xcode → Settings → Source Control → MCP Servers → Add

---

### 5. Asset Catalog Integration Opportunity

The `manage_color_assets` tool in `eddiksonpena/xcode-mcp` suggests a pattern for programmatically managing `.xcassets` color sets. This aligns with DesignerPunk's token generation pipeline.

**Current DesignerPunk iOS Output**:
- Swift files with color/spacing/typography constants
- Generated via `src/generators/` pipeline

**Potential Enhancement**:
- Generate `.xcassets` color sets directly
- Push tokens into Xcode projects via MCP
- Validate asset catalogs against token definitions

---

## Integration Architecture Options

### Option A: Xcode Native MCP (Preferred if Capable)

```
DesignerPunk Token Pipeline
         ↓
    iOS Token Generator (existing)
         ↓
    MCP Client → Xcode 26.3 Native MCP
         ↓
    Xcode Project (.xcassets)
```

**Pros**:
- Native Apple support
- No third-party dependencies
- Likely best maintained long-term

**Cons**:
- RC status — API may change
- Unknown if write operations are supported
- May be read-only for agent introspection

### Option B: Third-Party MCP Server

```
DesignerPunk Token Pipeline
         ↓
    iOS Token Generator (existing)
         ↓
    MCP Client → eddiksonpena/xcode-mcp
         ↓
    Xcode Project (.xcassets)
```

**Pros**:
- `manage_color_assets` tool already exists
- 115+ tools available
- Community-maintained

**Cons**:
- Third-party dependency
- May not align with Apple's native approach
- Maintenance uncertainty

### Option C: Hybrid Approach

Use Xcode native MCP for project introspection and third-party tools for asset management until Apple exposes write capabilities.

---

## Critical Uncertainty: Asset Catalog Write Support

### The Key Question

**Does Xcode 26.3's native MCP support asset catalog writes, or would we need a third-party MCP server?**

### What We Found

News coverage consistently mentions these Xcode MCP capabilities:
- ✅ "editing files" — confirmed
- ✅ "file management" — confirmed  
- ✅ "code edits" — confirmed
- ✅ "update project settings" — confirmed
- ✅ "create files" — implied (agents can implement features)

**However, NO source specifically mentions:**
- ❓ Creating/modifying `.colorset` files
- ❓ Managing `.xcassets` catalogs
- ❓ Adding color assets programmatically
- ❓ Any asset-specific MCP tools

### What We Know vs. Don't Know

| Known | Unknown |
|-------|---------|
| Xcode 26.3 exposes MCP tools for file operations | The exact list of MCP tools Xcode exposes |
| Agents can "edit files" | Whether file operations include asset catalog manipulation |
| Agents can "update project settings" | Whether there are specific asset management tools |
| MCP integration is designed for coding agents | The complete MCP schema Apple implements |

### Assessment

Given that agents can "edit files" and asset catalogs are just JSON files in a specific directory structure (`.colorset/Contents.json`), it's **likely** that generic file write operations would work for asset creation.

**But this is inference, not confirmation.**

The MCP integration appears designed for *coding agents* (Claude, Codex) to write Swift code, not for *design system tooling* to manage assets. Apple may not have prioritized asset catalog operations in their MCP surface.

### Why This Matters for DesignerPunk

If Xcode's native MCP only supports code file operations:
- We'd need a third-party MCP server (like `eddiksonpena/xcode-mcp`)
- Or we'd need to generate `.xcassets` files directly to disk (no MCP needed)
- Or we'd continue generating Swift constants (current approach)

### Resolution Path

This question can only be answered by:
1. **Hands-on testing** with Xcode 26.3 RC
2. **Official Apple documentation** (not yet published)
3. **Community reports** from developers using the RC

---

## Open Questions

1. **Does Xcode 26.3 native MCP support asset catalog writes?**
   - **Status: UNRESOLVED** — No definitive answer found
   - Need hands-on testing with RC or official documentation

2. **What is the MCP schema Apple exposes?**
   - No official documentation found yet
   - Release notes not publicly accessible
   - May need to reverse-engineer from RC

3. **How does authentication/authorization work?**
   - `ACCESS_TOKEN` env var mentioned in r-huijts server
   - Apple's approach unknown

4. **Performance implications?**
   - MCP adds network overhead
   - May be acceptable for build-time operations

5. **Xcode project structure requirements?**
   - Does target project need specific configuration?
   - How to handle multiple asset catalogs?

6. **Is MCP the right approach at all?**
   - Alternative: Generate `.xcassets` files directly to disk
   - MCP adds complexity — is it worth it?

---

## Recommendations

### Immediate Actions

1. **Wait for Xcode 26.3 GA** — RC may have breaking changes
2. **Monitor Apple Developer Documentation** — Official MCP docs expected
3. **Consider alternative approaches** — Direct `.xcassets` generation may be simpler than MCP

### Before Proceeding to Requirements

The following must be resolved before this spec can move to requirements phase:

1. **Confirm asset catalog write support** — Either via:
   - Hands-on testing with Xcode 26.3 RC
   - Official Apple MCP documentation
   - Community validation reports

2. **Evaluate MCP vs. direct file generation** — MCP adds complexity; is it justified?

3. **Identify the actual user need** — What problem are we solving for iOS developers?

### If Asset Writes Are Supported (Post-Validation)

1. **Design MCP client architecture** — How DesignerPunk would connect
2. **Define token-to-xcassets mapping** — Color, spacing, typography
3. **Prototype integration** — Validate end-to-end workflow

### If Asset Writes Are NOT Supported

1. **Evaluate third-party MCP servers** — `eddiksonpena/xcode-mcp` has `manage_color_assets`
2. **Consider direct file generation** — Generate `.xcassets` to disk without MCP
3. **Reassess value proposition** — Is MCP integration worth the complexity?

---

## Related Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP Tools Documentation](https://modelcontextprotocol.io/docs/concepts/tools)
- [Apple Developer Releases](https://developer.apple.com/news/releases/)
- [DesignerPunk iOS Generator](../../../src/generators/)

---

## Research Timeline

| Date | Event | Status |
|------|-------|--------|
| 2026-02-03 | Xcode 26.3 RC announced | ✅ Complete |
| 2026-02-03 | Initial research conducted | ✅ Complete |
| TBD | Xcode 26.3 GA release | ⏳ Pending |
| TBD | Apple MCP documentation published | ⏳ Pending |
| TBD | Asset catalog write support confirmed | ❓ **BLOCKER** |
| TBD | DesignerPunk integration decision | ⏳ Blocked |

---

## Next Steps

1. **Monitor** Apple Developer Documentation for official MCP tool list
2. **Watch** for community reports from developers testing the RC
3. **Revisit** this research when GA releases or documentation appears
4. **Do not proceed** to requirements until asset write question is resolved

---

*Last Updated: 2026-02-03*
*This research document will be updated as more information becomes available.*
