# Catalog Inventory

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Phase**: 1 (Task 1.1)
**Status**: Complete

---

## Component Inventory

28 components found in `src/components/core/`. All 28 have platform implementations for web, iOS, and Android (no stubs detected).

| # | Component | Stemma Family | Type | Schema | contracts.yaml | Tests |
|---|-----------|--------------|------|--------|---------------|-------|
| 1 | Input-Text-Base | Form Inputs | primitive | ✅ | — | ✅ (6) |
| 2 | Input-Text-Email | Form Inputs | semantic | ✅ | — | ✅ (1) |
| 3 | Input-Text-Password | Form Inputs | semantic | ✅ | — | ✅ (1) |
| 4 | Input-Text-PhoneNumber | Form Inputs | semantic | ✅ | — | ✅ (1) |
| 5 | Input-Checkbox-Base | Form Inputs | primitive | — | — | ✅ (2) |
| 6 | Input-Checkbox-Legal | Form Inputs | semantic | — | — | ✅ (1) |
| 7 | Input-Radio-Base | Form Inputs | primitive | — | — | ✅ (3) |
| 8 | Input-Radio-Set | Form Inputs | semantic | — | — | ✅ (2) |
| 9 | Button-CTA | Buttons | standalone | ✅ | — | ✅ (4) |
| 10 | Button-Icon | Buttons | (undocumented) | — | — | ✅ (6) |
| 11 | Button-VerticalList-Item | Buttons | primitive | — | — | ✅ (7) |
| 12 | Button-VerticalList-Set | Buttons | (undocumented) | — | — | ✅ (8) |
| 13 | Container-Base | Containers | primitive | ✅ | — | ✅ (1) |
| 14 | Container-Card-Base | Containers | type-primitive | ✅ | — | ✅ (1) |
| 15 | Icon-Base | Icons | primitive | ✅ | — | ✅ (1) |
| 16 | Avatar | Avatars | (undocumented) | — | — | ✅ (6) |
| 17 | Badge-Count-Base | Badges & Tags | type-primitive | ✅ | ✅ | ✅ (2) |
| 18 | Badge-Count-Notification | Badges & Tags | semantic | ✅ | ✅ | ✅ (2) |
| 19 | Badge-Label-Base | Badges & Tags | type-primitive | ✅ | ✅ | ✅ (3) |
| 20 | Chip-Base | Chip | primitive | ✅ | — | ✅ (1) |
| 21 | Chip-Filter | Chip | semantic | ✅ | — | ✅ (1) |
| 22 | Chip-Input | Chip | semantic | ✅ | — | ✅ (1) |
| 23 | Progress-Indicator-Connector-Base | Progress-Indicator | primitive | ✅ | ✅ | — |
| 24 | Progress-Indicator-Label-Base | Progress-Indicator | primitive | ✅ | ✅ | — |
| 25 | Progress-Indicator-Node-Base | Progress-Indicator | primitive | ✅ | ✅ | ✅ (1) |
| 26 | Progress-Pagination-Base | Progress-Indicator | semantic | ✅ | ✅ | ✅ (1) |
| 27 | Progress-Stepper-Base | Progress-Indicator | semantic | ✅ | ✅ | ✅ (1) |
| 28 | Progress-Stepper-Detailed | Progress-Indicator | semantic | ✅ | ✅ | ✅ (1) |

---

## Family Status Assessment

### Families with Active Implementations

| # | Family (per 11-family list) | Components | Status per Inheritance Structures |
|---|---------------------------|------------|----------------------------------|
| 1 | Form Inputs | 8 (3 primitives, 5 semantics) | 🟢 Active |
| 2 | Buttons | 4 | 🟢 Active |
| 3 | Containers | 2 (1 primitive, 1 type-primitive) | 🟢 Active |
| 4 | Icons | 1 (primitive) | 🟢 Active |
| 6 | Avatars | 1 (naming misaligned) | 🔴 Listed as Placeholder |
| 7 | Badges & Tags | 3 (2 type-primitives, 1 semantic) | 🟢 Active (per design-outline) |

### Families Not in the 11-Family List

| Family | Components | Notes |
|--------|------------|-------|
| Chip | 3 (1 primitive, 2 semantics) | Has family doc (Component-Family-Chip.md) but not in the 11-family list |
| Progress-Indicator | 6 (3 primitives, 3 semantics) | Has family doc (Component-Family-Progress.md) but not in the 11-family list |

### Families with No Implementations (Placeholder)

| # | Family | Primitive Base (Planned) |
|---|--------|-------------------------|
| 5 | Modals | Modal-Base |
| 8 | Data Displays | DataDisplay-Base |
| 9 | Dividers | Divider-Base |
| 10 | Loading | Loading-Base |
| 11 | Navigation | Nav-Base |

---

## Stemma Alignment Findings

### Finding 1: Two Active Families Not in the 11-Family List

**Chip** (3 components) and **Progress-Indicator** (6 components) are active, implemented families with family documentation, but they do not appear in the canonical "11 Component Families" list in stemma-system-principles.md or Component-Inheritance-Structures.md.

Both have dedicated family docs referenced from Rosetta-Stemma-Systems-Overview.md, suggesting they were added after the 11-family list was established. The list is stale — the actual family count is at least 13.

**Impact on audit**: The coverage matrix must include these families. The "11 families" framing in the design outline is outdated.

### Finding 2: Avatar Implementation Misaligned with Stemma

The `Avatar` component exists with full platform implementations (web/iOS/Android) and 6 test files. However:
- Component-Inheritance-Structures.md lists the Avatars family as 🔴 Placeholder with `Avatar-Base` as the planned primitive
- The implemented component is named `Avatar`, not `Avatar-Base`
- No schema YAML file exists
- No family assignment in a schema

The component appears to have been built outside the Stemma governance process, or the governance docs weren't updated after implementation.

**Impact on audit**: Avatar should be included in the inventory as an active component, but flagged as misaligned with Stemma naming and governance.

### Finding 3: 8 Components Have No Schema YAML

The following components have no `.schema.yaml` file:
- Avatar
- Button-Icon
- Button-VerticalList-Item
- Button-VerticalList-Set
- Input-Checkbox-Base
- Input-Checkbox-Legal
- Input-Radio-Base
- Input-Radio-Set

All 8 have READMEs that reference Stemma family membership and behavioral contracts in prose form, but no structured contract definitions. This is a third contract documentation format beyond the two identified in Lina's consultation (schema-inline and contracts.yaml) — call it "README-only."

**Impact on audit**: The contract taxonomy discovery (Task 1.2) will need to extract contracts from READMEs for these 8 components, which is less reliable than structured YAML.

### Finding 4: Inconsistent Type Classification

Components use different type vocabularies:
- `primitive` (standard)
- `semantic` (standard)
- `type-primitive` (Badge-Count-Base, Badge-Label-Base, Container-Card-Base)
- `standalone` (Button-CTA)
- Undocumented (Avatar, Button-Icon, Button-VerticalList-Set)

The `type-primitive` and `standalone` classifications don't appear in the Stemma principles documentation. This is a minor alignment issue but affects the coverage matrix's row classification.

---

## Summary Statistics

- **Total components**: 28
- **Families represented**: 8 (6 from the 11-family list + Chip + Progress-Indicator)
- **Families with no implementation**: 5 (Modals, Data Displays, Dividers, Loading, Navigation)
- **Components with schema YAML**: 20 of 28 (71%)
- **Components with contracts.yaml**: 9 of 28 (32%)
- **Components with tests**: 26 of 28 (93%)
- **Components missing tests**: 2 (Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base)
- **Full platform coverage**: 28 of 28 (100%)
