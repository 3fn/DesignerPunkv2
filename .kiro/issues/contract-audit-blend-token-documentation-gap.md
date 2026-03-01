# Issue: Blend Token Usage Inconsistently Documented in Contracts and Schemas

**Date**: February 28, 2026
**Severity**: Medium
**Status**: Partially Resolved
**Discovered During**: Post-064 contract audit — blend token consistency review
**Affects**: Multiple interactive components
**Recommended Owner**: Lina (contracts), Ada (token documentation)

---

## Resolution (2026-02-28)

Updated contracts for 3 components to reference blend tokens in behavior text:
- **Button-VerticalList-Item**: hover → blend.hoverDarker (8%), pressed → blend.pressedDarker (12%)
- **Input-Checkbox-Base**: hover → blend.hoverDarker (8% on border), pressed → blend.pressedDarker (12% ripple/press)
- **Input-Radio-Base**: hover → blend.hoverDarker (8% on border), pressed → blend.pressedDarker (12% ripple/press)

Avatar-Base was investigated but does NOT use blend tokens for hover — uses CSS transitions only. No change needed.

**Remaining**: 8 components without schema.yaml still can't list blend tokens in their token lists. This will be resolved when schemas are created for those components.

---

## Summary

The blend token pattern (`blend.hoverDarker`, `blend.pressedDarker`, etc.) is used consistently in platform implementations for interactive state colors. However, the documentation layer — contracts and schema.yaml token lists — doesn't consistently reflect this usage. Some components document blend tokens in both places, some in neither, and some only in one.

This means the ContractTokenDeriver can't reliably surface blend-to-contract relationships, and agents reading contracts won't know that state colors are blend-derived rather than hardcoded.

---

## Current State

### Schema.yaml token lists

| Component | Blend tokens in schema? | Uses blends in implementation? |
|-----------|------------------------|-------------------------------|
| Button-CTA | ✅ hoverDarker, pressedDarker, disabledDesaturate, iconLighter | ✅ |
| Button-Icon | ❌ (no schema.yaml) | ✅ |
| Button-VerticalList-Item | ❌ (no schema.yaml) | ✅ |
| Chip-Base | ✅ hoverDarker, pressedDarker | ✅ |
| Chip-Filter | ✅ hoverDarker, pressedDarker | ✅ (inherits) |
| Chip-Input | ✅ hoverDarker, pressedDarker | ✅ (inherits) |
| Container-Base | ✅ hoverDarker | ✅ |
| Container-Card-Base | ✅ hoverDarker, pressedDarker | ✅ |
| Icon-Base | ✅ iconLighter | ✅ |
| Input-Text-Base | ✅ focusSaturate, disabledDesaturate | ✅ |
| Input-Checkbox-Base | ❌ (no schema.yaml) | ✅ |
| Input-Radio-Base | ❌ (no schema.yaml) | ✅ |
| Avatar-Base | ❌ (no schema.yaml) | ✅ |

Components with schema.yaml generally list blend tokens. The gap is primarily in the 8 components without schema.yaml — but those will need schemas eventually.

### Contract blend references

| Component | Blend refs in contracts? | Uses blends in implementation? |
|-----------|-------------------------|-------------------------------|
| Button-CTA | ✅ 5 references | ✅ |
| Button-Icon | ✅ 4 references | ✅ |
| Button-VerticalList-Item | ❌ 0 references | ✅ |
| Chip-Base | ✅ 2 references | ✅ |
| Container-Base | ✅ 1 reference | ✅ |
| Container-Card-Base | ✅ 2 references | ✅ |
| Input-Checkbox-Base | ❌ 0 references | ✅ |
| Input-Radio-Base | ❌ 0 references | ✅ |
| Avatar-Base | ❌ 0 references | ✅ |

---

## The Gap

Three components use blend utilities in their platform implementations but have **zero** blend references in their contracts:

1. **Button-VerticalList-Item** — uses `blend.hoverDarker` and `blend.pressedDarker` in all 4 platform files
2. **Input-Checkbox-Base** — uses blend utilities in all 4 platform files
3. **Input-Radio-Base** — uses blend utilities in 3 platform files

Additionally, **Avatar-Base** uses blend in 1 platform file but has no blend contract references.

---

## Impact

- **ContractTokenDeriver** can't detect blend-to-contract relationships for these components because the contracts don't mention blend tokens
- **Agents** reading contracts for these components won't know state colors are blend-derived, potentially leading to hardcoded color assumptions
- **Token impact analysis** is incomplete — changing `blend.hoverDarker` would affect these components but the contract layer doesn't surface that dependency

---

## Recommended Action

1. **Update contracts** for Button-VerticalList-Item, Input-Checkbox-Base, and Input-Radio-Base to reference blend tokens in their interaction contract `behavior:` text (e.g., "hover darkens background by blend.hoverDarker (8%)")
2. **When schema.yaml files are created** for the 8 schemaless components, ensure blend tokens are included in the `tokens:` list
3. **Consider a convention**: any interaction contract describing hover/pressed/disabled state colors should reference the blend token by name in the behavior text — make this a contract authoring standard
