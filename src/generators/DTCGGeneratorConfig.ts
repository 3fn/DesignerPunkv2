/**
 * Configuration for the DTCG Token Format Generator.
 *
 * Controls output format, extension inclusion, alias resolution,
 * and deprecated token handling.
 *
 * @requirements 9.1, 9.5
 */

/**
 * Configuration interface for DTCGFormatGenerator.
 *
 * All properties are optional — defaults are applied via {@link DEFAULT_DTCG_GENERATOR_CONFIG}.
 */
export interface DTCGGeneratorConfig {
  /** Include DesignerPunk extensions ($extensions.designerpunk) in output. Default: true */
  includeExtensions: boolean;
  /** Include deprecated tokens in output. Default: true */
  includeDeprecated: boolean;
  /** Pretty print JSON output with 2-space indentation. Default: true */
  prettyPrint: boolean;
  /** DTCG schema URL for the $schema property. Default: "https://tr.designtokens.org/format/" */
  schemaUrl: string;
  /** Resolve alias references to final values (breaks hierarchy). Default: false */
  resolveAliases: boolean;
}

/**
 * Default configuration values for DTCGFormatGenerator.
 *
 * - includeExtensions: true — preserves DesignerPunk metadata
 * - includeDeprecated: true — includes all tokens regardless of deprecation
 * - prettyPrint: true — human-readable JSON with 2-space indentation
 * - schemaUrl: DTCG Format Module 2025.10 schema
 * - resolveAliases: false — preserves primitive→semantic hierarchy
 */
export const DEFAULT_DTCG_GENERATOR_CONFIG: Readonly<DTCGGeneratorConfig> = {
  includeExtensions: true,
  includeDeprecated: true,
  prettyPrint: true,
  schemaUrl: 'https://tr.designtokens.org/format/',
  resolveAliases: false,
};
