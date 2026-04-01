# Release 11.0.0

**Date**: 2026-04-01  
**Previous**: 10.0.1  
**Bump**: major

## 🔴 Breaking / Consumer-Facing

- **Nav-Header-App Semantic Variant** *(Component)*
  Built Nav-Header-App — the permissive app-level header scaffold. Thin wrappers on all three platforms composing Nav-Header-Base with slot passthrough. Documentation as code — the architecture is the deliverable.
- **Nav-Header-Page Semantic Variant** *(Component)*
  Built Nav-Header-Page — the production page-level navigation bar. Inherits Nav-Header-Base primitive. h1 title, back/close/trailing actions via Button-Icon medium tertiary, configurable title alignment with platform defaults, fixed/collapsible scroll, reduced motion support.
- **Nav-Header-Base Primitive** *(Component)*
  Built the Nav-Header-Base structural primitive — the foundation for all top bar variants in the Navigation family. Three-region layout (leading, title, trailing), safe area integration, opaque/translucent appearance, bottom separator, and accessibility landmark semantics across web, iOS, and Android.
- **Unified Blur Token Family** *(Token)*
- **Immediate Enrichment & Benchmarks** *(Component)*
  Captured baseline discoverability benchmarks (8 queries), enriched high-impact component purpose fields, and measured improvement.
- **Cleanup and Compliance** *(Token)*
  Removed composition compliance test known-mismatch skips, corrected the schema description for the interactive prop, and verified the Application MCP reports unchanged composed token resolution.
- **Showcase Content Creation** *(Token)*
  Populated all showcase site content — 7 landing page sections and 4 deep-dive pages — with curated content drafted by three specialized agents and assembled by Peter.
- **Showcase Site Infrastructure** *(Token)*
  Established the Jekyll-based GitHub Pages infrastructure for the DesignerPunk showcase site, including site configuration, layouts, navigation, token dogfooding, a fully tokenized stylesheet, and the landing page scaffold.
- **Experience Pattern Seeding** *(Component)*
- **Guidance Quality Governance** *(Component)*
- **Documentation Sweep** *(Component)*
  Updated all active documentation to use consistent naming: "Application MCP" (not "Component MCP"), `application-mcp-server/` (not `component-mcp-server/`), and canonical PascalCase family names in schema examples.
- **Governance Infrastructure** *(Component)*
  Added governance infrastructure to prevent family name drift: a `FamilyNameValidation.test.ts` that enforces canonical names against the family registry, and a "Family Naming Convention" section in the Component Development Guide documenting the convention, registry, legacy prefix mapping, and forward-looking rule.

## 🟡 Ecosystem Changes

- **MCP Scope Split Design** *(MCP)*
- **Agent Configuration & Governance** *(Agent)*
- **Application MCP Gap Report** *(MCP)*
- **MCP Relationship Model** *(MCP)*
- **Stacy Agent Definition** *(Agent)*
- **Platform Agent Definitions (Kenya, Data, Sparky)** *(Agent)*
- **Leonardo Agent Definition** *(Agent)*
