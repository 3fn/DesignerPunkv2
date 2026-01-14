# Design Outline: Android Semantic Token Regeneration

**Date**: 2026-01-14
**Status**: Placeholder
**Organization**: spec-guide
**Scope**: XXX-android-semantic-token-regeneration

## Problem Statement

The generated Android token output file (`final-verification/DesignTokens.android.kt`) is stale and only contains primitive tokens. Semantic tokens like `space_grouped_normal`, `space_inset_100`, etc. are defined in the TypeScript token pipeline and ARE being generated correctly by `TokenFileGenerator`, but the static output files have not been regenerated since October 2025.

This causes AI agents and developers to encounter undefined token references when trying to use semantic tokens in Android components.

## Evidence

1. **Test passes**: `SemanticTokenGeneration.test.ts` expects and validates `space_grouped_normal` in Android output
2. **Generator works**: Running `generator.generateAndroidTokens()` produces semantic tokens:
   - `val space_grouped_normal = space_100`
   - `val space_inset_100 = space_100`
   - `val color_primary = purple_300`
   - etc.
3. **Output file stale**: `final-verification/DesignTokens.android.kt` header shows `Generated: 2025-10-23T21:41:38.706Z`
4. **Component impact**: `ButtonVerticalListSet.kt` had to use primitive `space_100` instead of semantic `space_grouped_normal`

## Scope

### In Scope
- Regenerate all platform token output files (web, iOS, Android)
- Verify semantic tokens are included in regenerated files
- Update any components currently using primitive tokens where semantic tokens should be used
- Add build process or hook to keep token files in sync

### Out of Scope
- Creating new semantic tokens
- Modifying the token generation pipeline logic
- Platform-specific token customizations

## Proposed Solution

### Phase 1: Regenerate Token Files
1. Run `npx ts-node src/generators/generateTokenFiles.ts final-verification`
2. Verify all three platform files are updated with semantic tokens
3. Validate generated files pass syntax checks

### Phase 2: Component Audit
1. Identify components using primitive tokens where semantic tokens exist
2. Update to use semantic tokens (e.g., `space_100` → `space_grouped_normal`)
3. Add comments explaining semantic token relationships

### Phase 3: Build Process Integration
1. Add npm script for token regeneration
2. Consider adding pre-commit hook or CI check
3. Document regeneration process in README

## Files Affected

- `final-verification/DesignTokens.android.kt` - Regenerate with semantic tokens
- `final-verification/DesignTokens.ios.swift` - Regenerate with semantic tokens  
- `final-verification/DesignTokens.web.css` - Regenerate with semantic tokens
- `src/components/core/Button-VerticalList-Set/platforms/android/ButtonVerticalListSet.kt` - Update to use semantic tokens
- `src/components/core/Button-CTA/platforms/android/ButtonCTA.android.kt` - Already uses semantic tokens, verify
- `package.json` - Add regeneration script

## Success Criteria

1. All platform token files contain semantic tokens
2. `space_grouped_normal` and other semantic spacing tokens are available in Android
3. Components use semantic tokens where appropriate
4. Build process prevents stale token files

## Related Issues

- Spec 041 Task 10.2 had to work around missing semantic tokens
- ButtonCTA.android.kt references `space_grouped_normal` which may fail at compile time

## Notes

This is a placeholder spec. When prioritized, convert to full requirements.md, design.md, and tasks.md following Spec Planning Standards.
