# DesignerPunk Component MCP Server

Model Context Protocol server providing component metadata, experience patterns, family guidance, and assembly validation for the DesignerPunk design system.

## Tools

### Component Discovery

| Tool | Description |
|------|-------------|
| `get_component_catalog` | List all components with name, type, family, readiness, platforms |
| `get_component_summary` | Component summary by name — purpose, whenToUse, alternatives, contexts |
| `get_component_full` | Full component metadata including contracts, tokens, composition rules |
| `find_components` | Search components by family, type, readiness, platform, context |
| `check_composition` | Check if a parent-child composition is valid |
| `get_component_health` | Index health status — component/pattern/guidance counts, warnings |

### Experience Patterns

| Tool | Description |
|------|-------------|
| `list_experience_patterns` | Catalog of all patterns with name, category, step/component counts |
| `get_experience_pattern` | Full pattern by name — steps, components with roles/hints, accessibility |

### Family Guidance (Spec 068)

| Tool | Description |
|------|-------------|
| `get_prop_guidance` | Prop selection and family member guidance by component or family name |

`get_prop_guidance` parameters:
- `component` (required) — component name (e.g., "Button-CTA") or family name (e.g., "Buttons")
- `verbose` (optional, default: false) — include rationale and descriptions. When false, rationale and description fields are omitted to reduce token cost.

### Assembly Validation (Spec 067)

| Tool | Description |
|------|-------------|
| `validate_assembly` | Validate a component tree — composition rules, count constraints, accessibility checks |

## Data Sources

| Directory | Content |
|-----------|---------|
| `src/components/core/` | Component schemas, contracts, metadata |
| `experience-patterns/` | Experience pattern YAML files |
| `family-guidance/` | Family guidance companion YAML files |

## Startup Sequence

1. Component scanning and assembly (schemas, contracts, inheritance)
2. Experience pattern indexing
3. Family guidance indexing
4. Cross-reference validation (guidance → components + patterns)
