# Thurgood Audit: Task 2.6 — Input-Checkbox-Legal Token List

**Date**: 2026-03-01
**Auditor**: Thurgood
**Status**: Fix needed

---

## Finding

The token list has 3 incorrect entries and is missing 4 actual tokens.

### Current (incorrect)

```yaml
tokens:
  color:
    - color.text.muted
  icon:
    - icon.size100          # ← Base token, not used in Legal platform code
  typography:
    - typography.titleMedium  # ← Not referenced in any Legal platform file
    - typography.titleSmall   # ← Not referenced in any Legal platform file
```

### Should be

```yaml
tokens:
  color:
    - color.text.muted            # iOS: colorTextMuted, Android: color_text_muted
    - color.feedback.error.text   # Web: --color-feedback-error-text
  typography:
    - typography.caption           # Web: caption font-family/size/line-height/weight/letter-spacing
    - fontSize.050                 # iOS: fontSize050, Android: font_size_050
  spacing:
    - space.grouped.minimal        # Web: --space-grouped-minimal, Android: space_grouped_minimal
    - space.grouped.tight          # iOS: spaceGroupedTight
```

### Evidence

| Token | Web CSS | iOS Swift | Android Kotlin |
|-------|---------|-----------|----------------|
| `color.text.muted` | — | ✅ `colorTextMuted` | ✅ `color_text_muted` |
| `color.feedback.error.text` | ✅ `--color-feedback-error-text` | — | — |
| `typography.caption.*` | ✅ (5 properties) | — | — |
| `fontSize.050` | — | ✅ `fontSize050` | ✅ `font_size_050` |
| `space.grouped.minimal` | ✅ `--space-grouped-minimal` | — | ✅ `space_grouped_minimal` |
| `space.grouped.tight` | — | ✅ `spaceGroupedTight` | — |

`icon.size100`, `typography.titleMedium`, `typography.titleSmall` are not referenced in any Legal platform file — they belong to Base.

`space.200` and `space.400` in Android are preview-only (`@Preview` function) — excluded.
