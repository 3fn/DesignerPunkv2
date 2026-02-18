# Implementation Plan: DTCG Token Format Generator

**Date**: February 17, 2026
**Spec**: 053 - DTCG Token Format Generator
**Status**: Implementation Planning
**Dependencies**: None (foundational spec)

---

## Implementation Plan

The DTCG Token Format Generator will be implemented in three phases:

**Phase 1 (Setup):** Establish TypeScript types, configuration, and project structure for DTCG generation.

**Phase 2 (Core Generation):** Implement DTCGFormatGenerator with token transformation logic for all token categories.

**Phase 3 (Transformer Architecture):** Implement ITokenTransformer interface and TransformerRegistry for tool-specific outputs.

**Total deliverable:** `dist/DesignTokens.dtcg.json` with DTCG 2025.10 compliance, transformer architecture for future tool integrations (Spec 054+).

---

## Task List

- [x] 1. DTCG Type System and Configuration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - TypeScript types represent DTCG Format Module 2025.10 structure
  - Configuration interface supports all generation options
  - Types are exported for use by transformers (Spec 054+)
  
  **Primary Artifacts:**
  - `src/generators/types/DTCGTypes.ts`
  - `src/generators/DTCGGeneratorConfig.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/053-dtcg-token-format-generator/completion/task-1-parent-completion.md`

  - [x] 1.1 Create DTCG TypeScript types
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/generators/types/DTCGTypes.ts`
    - Define `DTCGType` union type (color, dimension, fontFamily, fontWeight, duration, cubicBezier, number, shadow, typography, transition)
    - Define `DTCGToken` interface ($value, $type, $description, $extensions)
    - Define `DesignerPunkExtensions` interface (formula, family, baseValue, blendType, glowType, platforms, deprecated, status, primitiveRefs)
    - Define `DTCGGroup` interface (recursive structure for token groups)
    - Define `DTCGTokenFile` interface ($schema, $extensions, token groups)
    - Export all types
    - _Requirements: 1.1, 1.2, 4.1-4.8_

  - [x] 1.2 Create generator configuration interface
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/generators/DTCGGeneratorConfig.ts`
    - Define `DTCGGeneratorConfig` interface (includeExtensions, includeDeprecated, prettyPrint, schemaUrl, resolveAliases)
    - Define default configuration values
    - Export configuration interface and defaults
    - _Requirements: 9.1, 9.5_

- [x] 2. DTCGFormatGenerator Core Implementation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - DTCGFormatGenerator generates valid DTCG output from Rosetta tokens
  - All token categories have generation methods
  - Configuration options work correctly (includeExtensions, includeDeprecated, resolveAliases)
  - Output validates against DTCG schema
  
  **Primary Artifacts:**
  - `src/generators/DTCGFormatGenerator.ts`
  - `dist/DesignTokens.dtcg.json`
  
  **Completion Documentation:**
  - `.kiro/specs/053-dtcg-token-format-generator/completion/task-2-parent-completion.md`

  - [x] 2.1 Create DTCGFormatGenerator class structure
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/generators/DTCGFormatGenerator.ts`
    - Implement constructor accepting `DTCGGeneratorConfig`
    - Implement `generate()` method (orchestrates token generation)
    - Implement `writeToFile(outputPath: string)` method
    - Implement `generateRootExtensions()` private method (version, generatedAt, rosettaVersion)
    - Implement `validateTokenCounts(output: DTCGTokenFile)` private method
    - _Requirements: 7.1, 10.1-10.5_

  - [x] 2.2 Implement primitive token generation methods
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `generateSpacingTokens()` — spacing primitives to DTCG dimension type
    - Implement `generateColorTokens()` — color primitives to DTCG color type
    - Implement `generateFontSizeTokens()` — font size to DTCG dimension type
    - Implement `generateFontWeightTokens()` — font weight to DTCG fontWeight type
    - Implement `generateFontFamilyTokens()` — font family to DTCG fontFamily type
    - Implement `generateLineHeightTokens()` — line height to DTCG number type
    - Implement `generateLetterSpacingTokens()` — letter spacing to DTCG dimension type
    - Implement `generateRadiusTokens()` — radius to DTCG dimension type
    - Implement `generateBorderWidthTokens()` — border width to DTCG dimension type
    - Implement `generateTapAreaTokens()` — tap area to DTCG dimension type
    - Implement `generateDensityTokens()` — density to DTCG number type
    - Implement `generateBreakpointTokens()` — breakpoint to DTCG dimension type
    - Implement `generateOpacityTokens()` — opacity to DTCG number type
    - Implement `generateDurationTokens()` — duration to DTCG duration type
    - Implement `generateEasingTokens()` — easing to DTCG cubicBezier type
    - Implement `generateScaleTokens()` — scale to DTCG number type
    - Implement `generateBlendTokens()` — blend to DTCG number type with blendType extension
    - Each method includes DesignerPunk extensions (formula, family, baseValue) when `includeExtensions: true`
    - _Requirements: 2.1, 2.2, 4.2-4.5_

  - [x] 2.3 Implement semantic token generation methods
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement semantic color token generation (use alias syntax for primitive references)
    - Implement semantic spacing token generation (use alias syntax)
    - Implement `generateZIndexTokens()` — z-index to DTCG number type
    - Implement `generateElevationTokens()` — elevation to DTCG number type with platform extensions
    - Preserve primitive→semantic hierarchy using `{token.path}` syntax
    - Handle `resolveAliases: true` configuration (resolve to final values)
    - _Requirements: 2.2, 3.1, 3.2, 3.3_

  - [x] 2.4 Implement shadow token generation with opacity merge
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `generateShadowTokens()` — shadow compositions to DTCG shadow type
    - Implement `mergeShadowColor(colorRgba: string, opacity: number): string` helper
    - Merge shadow color and opacity into single RGBA value (replace alpha, don't multiply)
    - Handle edge case: semantic colors with embedded opacity (shadow opacity overrides)
    - Include Android elevation in `$extensions.designerpunk.android.elevation`
    - Set `spread` to `0px` for all shadows
    - Include primitive references in `$extensions.designerpunk.primitiveRefs`
    - _Requirements: 5.1-5.5_

  - [x] 2.5 Implement glow token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `generateGlowTokens()` — glow primitives (blur, opacity, color) individually
    - Include `$extensions.designerpunk.glowType: "emission"` for glow tokens
    - Include `$extensions.designerpunk.status: "partial"` (composed glows not yet implemented)
    - Document that glows share offset primitives with shadows
    - _Requirements: 5.6, 5.7_

  - [x] 2.6 Implement composite token generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `generateTypographyTokens()` — typography compositions to DTCG typography type (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing)
    - Implement `generateMotionTokens()` — motion compositions to DTCG transition type (duration, timingFunction, delay)
    - Default `delay` to `0ms` when not defined
    - Include `scale` in `$extensions.designerpunk.scale` when present
    - Preserve alias references in composite properties
    - _Requirements: 6.1-6.5_

  - [x] 2.7 Implement configuration options
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Handle `includeExtensions: false` — omit `$extensions.designerpunk` from all tokens
    - Handle `includeDeprecated: false` — exclude deprecated tokens from output
    - Handle `resolveAliases: true` — resolve all `{token.path}` references to final values
    - Handle `prettyPrint: true/false` — format JSON with 2-space indentation or minified
    - Use `schemaUrl` configuration for `$schema` property
    - _Requirements: 9.2-9.4, 7.2, 7.3_

  - [x] 2.8 Implement error handling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Throw error for invalid token type (no DTCG mapping)
    - Throw error for invalid token value (malformed color, etc.)
    - Throw error for shadow color merge failure (invalid RGBA format)
    - Throw error for file write failure (permissions, disk full)
    - Throw error for token count validation failure (significantly lower than expected)
    - All errors include token name, invalid value, and helpful message
    - _Requirements: 12.1-12.5_

- [x] 3. Transformer Architecture

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - ITokenTransformer interface is defined and exported
  - TransformerRegistry manages and invokes transformers
  - Spec 054 (Figma) can implement ITokenTransformer without modifying Spec 053 code
  
  **Primary Artifacts:**
  - `src/generators/transformers/ITokenTransformer.ts`
  - `src/generators/transformers/TransformerRegistry.ts`
  - `src/generators/transformers/index.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/053-dtcg-token-format-generator/completion/task-3-parent-completion.md`

  - [x] 3.1 Create ITokenTransformer interface
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/generators/transformers/ITokenTransformer.ts`
    - Define `TransformerConfig` interface (id, name, outputExtension, includeExtensions)
    - Define `TransformResult` interface (content, filename, warnings)
    - Define `ITokenTransformer` interface (config, transform(), canTransform())
    - Export all interfaces
    - _Requirements: 8.1, 8.6_

  - [x] 3.2 Create TransformerRegistry class
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/generators/transformers/TransformerRegistry.ts`
    - Implement `register(transformer: ITokenTransformer): void`
    - Implement `get(id: string): ITokenTransformer | undefined`
    - Implement `getAll(): ITokenTransformer[]`
    - Implement `transform(id: string, dtcgTokens: DTCGTokenFile): TransformResult`
    - Implement `transformAll(dtcgTokens: DTCGTokenFile): TransformResult[]`
    - Create singleton instance `transformerRegistry`
    - Export registry class and singleton
    - _Requirements: 8.2-8.5_

  - [x] 3.3 Create transformer index and exports
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/generators/transformers/index.ts`
    - Export ITokenTransformer, TransformerConfig, TransformResult
    - Export TransformerRegistry, transformerRegistry singleton
    - Document usage pattern for downstream specs (Spec 054)
    - _Requirements: 8.1-8.6_

- [ ] 4. Integration with Build Pipeline

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  
  **Success Criteria:**
  - DTCG generation runs as part of `npm run build` or dedicated command
  - Output written to `dist/DesignTokens.dtcg.json`
  - Generation is idempotent (can run multiple times safely)
  
  **Primary Artifacts:**
  - `scripts/generate-platform-tokens.ts` (updated)
  - `dist/DesignTokens.dtcg.json`
  
  **Completion Documentation:**
  - `.kiro/specs/053-dtcg-token-format-generator/completion/task-4-parent-completion.md`

  - [ ] 4.1 Integrate DTCGFormatGenerator into build script
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `scripts/generate-platform-tokens.ts` to import DTCGFormatGenerator
    - Add DTCG generation step after existing platform generators
    - Create DTCGFormatGenerator with default configuration
    - Call `generator.writeToFile('dist/DesignTokens.dtcg.json')`
    - Log generation success with token counts
    - Handle errors gracefully (log error, don't fail entire build)
    - _Requirements: 7.1, 7.4, 7.5_

  - [ ] 4.2 Test DTCG generation in build pipeline
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm run build` (or equivalent)
    - Verify `dist/DesignTokens.dtcg.json` is created
    - Verify file is valid JSON
    - Verify file contains expected token groups (space, color, fontSize, etc.)
    - Verify generation is idempotent (run twice, output identical)
    - _Requirements: 7.1, 7.5_

- [ ] 5. Testing and Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 6 correctness properties have passing tests
  - Unit tests cover all generation methods
  - Integration tests validate end-to-end generation
  - DTCG output validates against official schema
  
  **Primary Artifacts:**
  - `src/generators/__tests__/DTCGFormatGenerator.test.ts`
  - `src/generators/__tests__/DTCGFormatGenerator.integration.test.ts`
  - `src/generators/__tests__/DTCGFormatGenerator.property.test.ts`
  
  **Completion Documentation:**
  - `.kiro/specs/053-dtcg-token-format-generator/completion/task-5-parent-completion.md`

  - [ ] 5.1 Implement unit tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/generators/__tests__/DTCGFormatGenerator.test.ts`
    - Test DTCG schema validation (generated output validates)
    - Test token type mapping (each Rosetta type → correct DTCG type)
    - Test alias preservation (semantic tokens use `{...}` syntax)
    - Test extension inclusion (tokens with metadata have extensions)
    - Test shadow color merge (alpha matches shadow opacity)
    - Test composite token structure (shadow/typography/transition have required properties)
    - Test configuration options (includeExtensions, includeDeprecated, resolveAliases)
    - Test token count validation (programmatic counts match expected)
    - Test error handling (invalid types, values, merge failures)
    - _Requirements: All requirements (validation)_

  - [ ] 5.2 Implement integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/generators/__tests__/DTCGFormatGenerator.integration.test.ts`
    - Test end-to-end generation (full DTCG output from Rosetta sources)
    - Test file write (output written to correct location with correct formatting)
    - Test transformer integration (TransformerRegistry can consume generated DTCG output)
    - Test token completeness (all token source files have corresponding output)
    - _Requirements: All requirements (validation)_

  - [ ] 5.3 Implement property-based tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/generators/__tests__/DTCGFormatGenerator.property.test.ts`
    - Test Property 1: DTCG schema compliance
    - Test Property 2: Token completeness
    - Test Property 3: Alias preservation
    - Test Property 4: Extension completeness
    - Test Property 5: Shadow color-opacity merge
    - Test Property 6: Composite token structure
    - Use fast-check for property-based testing
    - Tag tests: "Feature: dtcg-generator, Property {number}: {property_text}"
    - _Requirements: All requirements (validation)_

- [ ] 6. Documentation

  **Type**: Parent
  **Validation**: Tier 2 - Standard
  
  **Success Criteria:**
  - DTCG Integration Guide documents file location, format, extensions, tool integrations
  - Transformer Development Guide documents interface, registry, examples
  - MCP Integration Guide documents token loading, querying, transformer usage
  - All guides include code examples
  
  **Primary Artifacts:**
  - `docs/dtcg-integration-guide.md`
  - `docs/transformer-development-guide.md`
  - `docs/mcp-integration-guide.md`
  
  **Completion Documentation:**
  - `.kiro/specs/053-dtcg-token-format-generator/completion/task-6-parent-completion.md`

  - [ ] 6.1 Create DTCG Integration Guide
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Create `docs/dtcg-integration-guide.md`
    - Document file location (`dist/DesignTokens.dtcg.json`)
    - Document DTCG format overview (types, structure, aliases)
    - Document DesignerPunk extensions schema (formula, family, platforms, deprecation)
    - Document integration with Style Dictionary
    - Document integration with Tokens Studio
    - Include section "For DesignerPunk Component Developers" (DTCG is for external tools, components use TypeScript sources)
    - Include examples of DTCG output for each token type
    - _Requirements: 11.1, 11.4, 11.5_

  - [ ] 6.2 Create Transformer Development Guide
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Create `docs/transformer-development-guide.md`
    - Document ITokenTransformer interface (config, transform(), canTransform())
    - Document TransformerRegistry usage (register, get, transform, transformAll)
    - Include example transformer implementation (minimal example)
    - Document how Spec 054 (Figma) will use this architecture
    - _Requirements: 11.2_

  - [ ] 6.3 Create MCP Integration Guide
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Create `docs/mcp-integration-guide.md`
    - Document how to load and parse DTCG tokens (fs.readFileSync + JSON.parse)
    - Document how to query specific tokens by path (split path, traverse object)
    - Document how to use transformers for tool-specific formats (registry.transform())
    - Include code examples for each pattern
    - _Requirements: 11.3_
