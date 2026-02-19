/**
 * TokenSyncWorkflow — Pushes tokens to Figma via Console MCP.
 *
 * Handles drift detection, batch variable operations, style sync via Plugin API,
 * and partial failure recovery with resume support.
 *
 * @see Design: .kiro/specs/054a-figma-token-push/design.md
 * @requirements Req 4 (Token Sync Workflow)
 */

import type {
  FigmaTokenFile,
  FigmaVariable,
  FigmaStyleDefinition,
  EffectStyleProperties,
  TextStyleProperties,
} from '../generators/transformers/FigmaTransformer';

import type { ConsoleMCPClient, DesignTokenSetupPayload } from './ConsoleMCPClient';

// ---------------------------------------------------------------------------
// Public interfaces
// ---------------------------------------------------------------------------

/**
 * Options for the sync workflow.
 */
export interface SyncOptions {
  /** Override drift detection and force sync. */
  forceOverride?: boolean;
  /** Resume sync from batch N (1-indexed). */
  resume?: number;
}

/**
 * A single sync error with context for recovery.
 */
export interface SyncError {
  /** Which phase failed (e.g. 'variables', 'styles'). */
  phase: string;
  /** Batch number that failed (1-indexed, if applicable). */
  batch?: number;
  /** Total number of batches (if applicable). */
  totalBatches?: number;
  /** Human-readable error message. */
  message: string;
}

/** Default batch size for variable operations (Console MCP limit). */
export const BATCH_SIZE = 100;

/**
 * Result of a batch variable sync operation.
 */
export interface VariableSyncResult {
  /** Number of variables successfully created. */
  created: number;
  /** Number of variables successfully updated. */
  updated: number;
  /** Errors encountered (empty on full success). */
  errors: SyncError[];
}

/**
 * Result of a style sync operation.
 */
export interface StyleSyncResult {
  /** Number of styles successfully created. */
  created: number;
  /** Number of styles successfully updated. */
  updated: number;
  /** Errors encountered (empty on full success). */
  errors: SyncError[];
}

/**
 * A single variable that has drifted from the expected state.
 */
export interface DriftedVariable {
  /** Variable name (e.g. 'space/300'). */
  name: string;
  /** Value that code expects. */
  expectedValue: unknown;
  /** Value currently in Figma. */
  actualValue: unknown;
}

/**
 * Report of variables that have been manually edited in Figma.
 */
export interface DriftReport {
  /** Whether any drift was detected. */
  hasDrift: boolean;
  /** Variables that differ from expected state. */
  driftedVariables: DriftedVariable[];
}

/**
 * Result of a sync operation.
 */
export interface SyncResult {
  /** Whether the sync completed without errors. */
  success: boolean;
  /** Number of variables/styles created. */
  created: number;
  /** Number of variables/styles updated. */
  updated: number;
  /** Number of variables/styles deleted. */
  deleted: number;
  /** Errors encountered during sync. */
  errors: SyncError[];
  /** Drift report (present when drift was detected). */
  driftDetected?: DriftReport;
}

// ---------------------------------------------------------------------------
// TokenSyncWorkflow
// ---------------------------------------------------------------------------

/**
 * Orchestrates pushing Figma tokens to a Figma file via Console MCP.
 *
 * Responsibilities:
 * - Drift detection (block sync when Figma variables are manually edited)
 * - Batch variable create/update (100 per batch)
 * - Style create/update via Plugin API
 * - Partial failure handling with resume support
 */
export class TokenSyncWorkflow {
  constructor(
    private readonly consoleMcp: ConsoleMCPClient,
    private readonly figmaFileKey: string,
  ) {}

  /**
   * Push tokens to Figma, handling drift detection and partial failures.
   * Implementation in Task 2.5.
   */
  /**
     * Push tokens to Figma, handling drift detection and partial failures.
     *
     * Orchestrates the full sync workflow:
     * 1. Fetch current Figma state (variables)
     * 2. Run drift detection — block if drift found unless forceOverride
     * 3. Flatten all variables from token collections
     * 4. Sync variables via batch create/update
     * 5. Sync styles via Plugin API
     * 6. Return combined SyncResult with counts and errors
     *
     * @param figmaTokens - Token file produced by FigmaTransformer
     * @param options - Force override, resume from batch N
     * @returns SyncResult with success status, counts, and errors
     *
     * @requirements Req 4 (Token Sync Workflow), Req 5 (Drift Detection), Req 9 (Error Handling)
     */
    async sync(
      figmaTokens: FigmaTokenFile,
      options?: SyncOptions,
    ): Promise<SyncResult> {
      // 1. Get current Figma state
      const currentVariables = await this.consoleMcp.getVariables(this.figmaFileKey);

      // 2. Drift detection (skip if resuming — drift was already checked)
      if (!options?.resume) {
        const driftReport = this.detectDrift(currentVariables, figmaTokens);

        if (driftReport.hasDrift && !options?.forceOverride) {
          return {
            success: false,
            created: 0,
            updated: 0,
            deleted: 0,
            errors: [{
              phase: 'drift-detection',
              message: `Drift detected: ${driftReport.driftedVariables.length} variable(s) have been edited in Figma since last push`,
            }],
            driftDetected: driftReport,
          };
        }
      }

      // 3. Flatten all variables from collections
      const allVariables = figmaTokens.collections.flatMap(c => c.variables);

      // 4. Sync variables (batch create/update)
      const varResult = await this.syncVariables(allVariables, currentVariables, options);

      // Stop if variable sync had errors
      if (varResult.errors.length > 0) {
        return {
          success: false,
          created: varResult.created,
          updated: varResult.updated,
          deleted: 0,
          errors: varResult.errors,
        };
      }

      // 5. Sync styles via Plugin API
      // Build set of existing style names from current Figma state
      // (styles don't come from getVariables — we use the token file to
      //  determine create vs update based on whether the style existed before)
      const existingStyleNames = new Set<string>();
      // For now, we treat all styles as creates on first sync and updates
      // when the style name already exists. Since we can't query existing
      // styles via getVariables, we pass an empty set for initial sync.
      // Future: add getStyles() to ConsoleMCPClient for accurate diffing.
      const styleResult = await this.syncStyles(figmaTokens.styles, existingStyleNames);

      // 6. Combine results
      const allErrors = [...varResult.errors, ...styleResult.errors];

      return {
        success: allErrors.length === 0,
        created: varResult.created + styleResult.created,
        updated: varResult.updated + styleResult.updated,
        deleted: 0,
        errors: allErrors,
      };
    }

  /**
   * Perform initial setup: create collections, modes, and variables atomically.
   *
   * Uses `figma_setup_design_tokens` to create everything in a single call,
   * ensuring the Figma file is never left in a partially-initialised state.
   * After variables are created, styles are synced individually via Plugin API.
   *
   * @param figmaTokens - Token file produced by FigmaTransformer
   * @returns SyncResult with counts and errors
   *
   * @requirements Req 4 (Token Sync Workflow)
   */
  async initialSetup(
    figmaTokens: FigmaTokenFile,
  ): Promise<SyncResult> {
    const errors: SyncError[] = [];
    let variableCount = 0;

    // 1. Build the atomic setup payload from token collections
    const payload: DesignTokenSetupPayload = {
      collections: figmaTokens.collections.map(collection => ({
        name: collection.name,
        modes: collection.modes,
        variables: collection.variables,
      })),
    };

    // Count total variables for reporting
    variableCount = figmaTokens.collections.reduce(
      (sum, c) => sum + c.variables.length,
      0,
    );

    // 2. Atomic creation of collections, modes, and variables
    try {
      await this.consoleMcp.setupDesignTokens(this.figmaFileKey, payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        created: 0,
        updated: 0,
        deleted: 0,
        errors: [{
          phase: 'initial-setup',
          message: `Atomic setup failed: ${message}`,
        }],
      };
    }

    // 3. Sync styles via Plugin API (styles can't be created atomically)
    const styleResult = await this.syncStyles(
      figmaTokens.styles,
      new Set<string>(), // No existing styles on initial setup
    );

    errors.push(...styleResult.errors);

    return {
      success: errors.length === 0,
      created: variableCount + styleResult.created,
      updated: 0,
      deleted: 0,
      errors,
    };
  }

  /**
   * Detect drift between current Figma state and expected token state.
   *
   * Compares each variable in the current Figma file against the expected
   * values from the FigmaTokenFile. Variables whose values differ are
   * reported as drifted.
   *
   * @param currentVariables - Variables currently in Figma (from getVariables)
   * @param expected - The expected token file state (from FigmaTransformer)
   * @returns DriftReport indicating whether drift was found and which variables drifted
   *
   * @requirements Req 5 (Drift Detection)
   */
  detectDrift(
    currentVariables: FigmaVariable[],
    expected: FigmaTokenFile,
  ): DriftReport {
    const expectedByName = this.buildExpectedVariableMap(expected);
    const driftedVariables: DriftedVariable[] = [];

    for (const current of currentVariables) {
      const expectedVar = expectedByName.get(current.name);
      if (!expectedVar) {
        // Variable exists in Figma but not in expected state — skip.
        // This is not drift; it may be a variable from another source.
        continue;
      }

      // Compare valuesByMode for each mode
      for (const mode of Object.keys(expectedVar.valuesByMode)) {
        const expectedValue = expectedVar.valuesByMode[mode];
        const actualValue = current.valuesByMode[mode];

        if (!this.valuesEqual(expectedValue, actualValue)) {
          driftedVariables.push({
            name: current.name,
            expectedValue,
            actualValue,
          });
          // Only report once per variable (first drifted mode is enough)
          break;
        }
      }
    }

    return {
      hasDrift: driftedVariables.length > 0,
      driftedVariables,
    };
  }

  // ---------------------------------------------------------------------------
  // Variable sync (batch operations) — Task 2.3
  // ---------------------------------------------------------------------------

  /**
   * Sync variables to Figma using batch create/update operations.
   *
   * Splits variables into "to create" and "to update" sets by comparing
   * against current Figma state, then processes each set in batches of
   * {@link BATCH_SIZE}. Stops on first batch failure.
   *
   * @param variables - Variables to sync (from FigmaTokenFile collections)
   * @param currentVariables - Variables currently in Figma
   * @param options - Sync options (resume support)
   * @returns VariableSyncResult with created/updated counts and errors
   *
   * @requirements Req 4 (Token Sync Workflow), Req 9 (Error Handling)
   */
  async syncVariables(
    variables: FigmaVariable[],
    currentVariables: FigmaVariable[],
    options?: SyncOptions,
  ): Promise<VariableSyncResult> {
    const currentByName = new Map(
      currentVariables.map((v) => [v.name, v]),
    );

    const toCreate: FigmaVariable[] = [];
    const toUpdate: FigmaVariable[] = [];

    for (const variable of variables) {
      if (currentByName.has(variable.name)) {
        toUpdate.push(variable);
      } else {
        toCreate.push(variable);
      }
    }

    let created = 0;
    let updated = 0;
    const errors: SyncError[] = [];

    // Batch create
    const createResult = await this.batchCreateVariables(
      toCreate,
      options?.resume,
    );
    created = createResult.created;
    if (createResult.errors.length > 0) {
      errors.push(...createResult.errors);
      return { created, updated, errors };
    }

    // Batch update (only if create succeeded fully)
    const updateResult = await this.batchUpdateVariables(
      toUpdate,
      options?.resume != null
        ? Math.max(1, options.resume - Math.ceil(toCreate.length / BATCH_SIZE))
        : undefined,
    );
    updated = updateResult.updated;
    if (updateResult.errors.length > 0) {
      errors.push(...updateResult.errors);
    }

    return { created, updated, errors };
  }

  /**
   * Create variables in batches of {@link BATCH_SIZE}.
   *
   * Stops on first batch failure. Supports resume from a specific batch
   * (1-indexed) to recover from partial failures.
   *
   * @param variables - Variables to create
   * @param startBatch - 1-indexed batch to start from (for resume)
   * @returns Object with created count and any errors
   *
   * @requirements Req 4, Req 9
   */
  async batchCreateVariables(
    variables: FigmaVariable[],
    startBatch?: number,
  ): Promise<VariableSyncResult> {
    const batches = this.chunkArray(variables, BATCH_SIZE);
    const start = (startBatch ?? 1) - 1; // Convert 1-indexed to 0-indexed
    let created = 0;

    for (let i = start; i < batches.length; i++) {
      try {
        await this.consoleMcp.batchCreateVariables(
          this.figmaFileKey,
          batches[i],
        );
        created += batches[i].length;
      } catch (err) {
        return {
          created,
          updated: 0,
          errors: [
            {
              phase: 'variables:create',
              batch: i + 1,
              totalBatches: batches.length,
              message:
                err instanceof Error
                  ? err.message
                  : String(err),
            },
          ],
        };
      }
    }

    return { created, updated: 0, errors: [] };
  }

  /**
   * Update variables in batches of {@link BATCH_SIZE}.
   *
   * Stops on first batch failure. Supports resume from a specific batch
   * (1-indexed) to recover from partial failures.
   *
   * @param variables - Variables to update
   * @param startBatch - 1-indexed batch to start from (for resume)
   * @returns Object with updated count and any errors
   *
   * @requirements Req 4, Req 9
   */
  async batchUpdateVariables(
    variables: FigmaVariable[],
    startBatch?: number,
  ): Promise<VariableSyncResult> {
    const batches = this.chunkArray(variables, BATCH_SIZE);
    const start = (startBatch ?? 1) - 1;
    let updated = 0;

    for (let i = start; i < batches.length; i++) {
      try {
        await this.consoleMcp.batchUpdateVariables(
          this.figmaFileKey,
          batches[i],
        );
        updated += batches[i].length;
      } catch (err) {
        return {
          created: 0,
          updated,
          errors: [
            {
              phase: 'variables:update',
              batch: i + 1,
              totalBatches: batches.length,
              message:
                err instanceof Error
                  ? err.message
                  : String(err),
            },
          ],
        };
      }
    }

    return { created: 0, updated, errors: [] };
  }

  // ---------------------------------------------------------------------------
  // Style sync (individual operations) — Task 2.4
  // ---------------------------------------------------------------------------

  /**
   * Sync styles to Figma using individual Plugin API calls.
   *
   * Styles are created or updated one at a time via `consoleMcp.execute()`.
   * Unlike variables, styles don't support batch operations — each style
   * requires its own Plugin API invocation.
   *
   * @param styles - Style definitions to sync (from FigmaTokenFile)
   * @param existingStyleNames - Names of styles already in Figma (for create vs update)
   * @returns StyleSyncResult with created/updated counts and errors
   *
   * @requirements Req 4 (Token Sync Workflow)
   */
  async syncStyles(
    styles: FigmaStyleDefinition[],
    existingStyleNames: Set<string> = new Set(),
  ): Promise<StyleSyncResult> {
    let created = 0;
    let updated = 0;
    const errors: SyncError[] = [];

    for (const style of styles) {
      try {
        if (existingStyleNames.has(style.name)) {
          await this.updateStyle(style);
          updated++;
        } else {
          await this.createStyle(style);
          created++;
        }
      } catch (err) {
        errors.push({
          phase: 'styles',
          message: `Failed to ${existingStyleNames.has(style.name) ? 'update' : 'create'} style "${style.name}": ${
            err instanceof Error ? err.message : String(err)
          }`,
        });
      }
    }

    return { created, updated, errors };
  }

  /**
   * Create a new style in Figma via Plugin API.
   *
   * Generates the appropriate Plugin API code based on style type
   * (EFFECT or TEXT) and executes it via Console MCP.
   *
   * @param style - Style definition to create
   *
   * @requirements Req 4
   */
  async createStyle(style: FigmaStyleDefinition): Promise<void> {
    const code = this.generateStylePluginCode(style, 'create');
    await this.consoleMcp.execute(this.figmaFileKey, code);
  }

  /**
   * Update an existing style in Figma via Plugin API.
   *
   * Finds the style by name, then updates its properties.
   *
   * @param style - Style definition to update
   *
   * @requirements Req 4
   */
  async updateStyle(style: FigmaStyleDefinition): Promise<void> {
    const code = this.generateStylePluginCode(style, 'update');
    await this.consoleMcp.execute(this.figmaFileKey, code);
  }

  /**
   * Generate Plugin API code for creating or updating a style.
   *
   * @param style - Style definition
   * @param action - Whether to create or update
   * @returns Plugin API JavaScript code string
   */
  generateStylePluginCode(
    style: FigmaStyleDefinition,
    action: 'create' | 'update',
  ): string {
    if (style.type === 'EFFECT') {
      return this.generateEffectStyleCode(
        style as FigmaStyleDefinition & { properties: EffectStyleProperties },
        action,
      );
    }
    return this.generateTextStyleCode(
      style as FigmaStyleDefinition & { properties: TextStyleProperties },
      action,
    );
  }

  /**
   * Generate Plugin API code for an effect style (shadow).
   */
  private generateEffectStyleCode(
    style: FigmaStyleDefinition & { properties: EffectStyleProperties },
    action: 'create' | 'update',
  ): string {
    const { name, properties, description } = style;
    const effectsJson = JSON.stringify(
      properties.effects.map((e) => ({
        type: e.type,
        visible: true,
        blendMode: 'NORMAL',
        offset: e.offset,
        radius: e.radius,
        spread: e.spread ?? 0,
        color: e.color,
      })),
    );

    if (action === 'create') {
      const descLine = description
        ? `\nstyle.description = ${JSON.stringify(description)};`
        : '';
      return [
        `const style = figma.createEffectStyle();`,
        `style.name = ${JSON.stringify(name)};`,
        `style.effects = ${effectsJson};`,
        descLine,
      ]
        .filter(Boolean)
        .join('\n');
    }

    // Update: find existing style by name, then update properties
    const descLine = description
      ? `\nstyle.description = ${JSON.stringify(description)};`
      : '';
    return [
      `const styles = figma.getLocalEffectStyles();`,
      `const style = styles.find(s => s.name === ${JSON.stringify(name)});`,
      `if (!style) throw new Error("Effect style not found: ${name}");`,
      `style.effects = ${effectsJson};`,
      descLine,
    ]
      .filter(Boolean)
      .join('\n');
  }

  /**
   * Generate Plugin API code for a text style (typography).
   */
  private generateTextStyleCode(
    style: FigmaStyleDefinition & { properties: TextStyleProperties },
    action: 'create' | 'update',
  ): string {
    const { name, properties, description } = style;
    const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } =
      properties;

    // Determine font style string from weight
    const fontStyle = this.fontWeightToStyle(fontWeight);

    const propLines = [
      `style.fontName = { family: ${JSON.stringify(fontFamily)}, style: ${JSON.stringify(fontStyle)} };`,
      `style.fontSize = ${fontSize};`,
      `style.lineHeight = { value: ${lineHeight}, unit: "PIXELS" };`,
      `style.letterSpacing = { value: ${letterSpacing}, unit: "PIXELS" };`,
    ];

    if (description) {
      propLines.push(`style.description = ${JSON.stringify(description)};`);
    }

    if (action === 'create') {
      return [
        `const style = figma.createTextStyle();`,
        `style.name = ${JSON.stringify(name)};`,
        `await figma.loadFontAsync(${JSON.stringify({ family: fontFamily, style: fontStyle })});`,
        ...propLines,
      ].join('\n');
    }

    // Update: find existing style by name, then update properties
    return [
      `const styles = figma.getLocalTextStyles();`,
      `const style = styles.find(s => s.name === ${JSON.stringify(name)});`,
      `if (!style) throw new Error("Text style not found: ${name}");`,
      `await figma.loadFontAsync(${JSON.stringify({ family: fontFamily, style: fontStyle })});`,
      ...propLines,
    ].join('\n');
  }

  /**
   * Map numeric font weight to Figma font style string.
   */
  private fontWeightToStyle(weight: number): string {
    const weightMap: Record<number, string> = {
      100: 'Thin',
      200: 'Extra Light',
      300: 'Light',
      400: 'Regular',
      500: 'Medium',
      600: 'Semi Bold',
      700: 'Bold',
      800: 'Extra Bold',
      900: 'Black',
    };
    return weightMap[weight] ?? 'Regular';
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Split an array into chunks of the given size.
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Build a lookup map of expected variables by name from the FigmaTokenFile.
   */
  private buildExpectedVariableMap(
    expected: FigmaTokenFile,
  ): Map<string, FigmaVariable> {
    const map = new Map<string, FigmaVariable>();
    for (const collection of expected.collections) {
      for (const variable of collection.variables) {
        map.set(variable.name, variable);
      }
    }
    return map;
  }

  /**
   * Deep-equal comparison for variable values.
   *
   * Handles primitives (number, string, boolean) and objects (color values,
   * alias references) by recursive structural comparison.
   */
  private valuesEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;

    if (typeof a === 'object' && typeof b === 'object') {
      const aObj = a as Record<string, unknown>;
      const bObj = b as Record<string, unknown>;
      const aKeys = Object.keys(aObj);
      const bKeys = Object.keys(bObj);

      if (aKeys.length !== bKeys.length) return false;

      return aKeys.every((key) => this.valuesEqual(aObj[key], bObj[key]));
    }

    return false;
  }
}
