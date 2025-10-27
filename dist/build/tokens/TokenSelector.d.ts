/**
 * Token Selector
 *
 * Implements token selection priority logic: semantic → primitive → component
 *
 * Selection Priority:
 * 1. First: Attempt to use semantic tokens (space.inset.small, color.primary, etc.)
 * 2. Second: Attempt to use primitive tokens (space100, space125, color.blue500, etc.)
 * 3. Third: Create component token only if semantic and primitive tokens cannot achieve design requirements
 */
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import { TokenRequest } from './TokenIntegrator';
import { TokenSelection, TokenSelectionOptions } from './TokenSelection';
/**
 * Token selector implementation
 *
 * Follows the priority system to select the most appropriate token
 * for a given request, documenting reasoning at each step.
 */
export declare class TokenSelector {
    private primitiveRegistry;
    private semanticRegistry;
    constructor(primitiveRegistry: PrimitiveTokenRegistry, semanticRegistry: SemanticTokenRegistry);
    /**
     * Select appropriate token following priority: semantic → primitive → component
     *
     * @param request - Token request specification
     * @param options - Selection options
     * @returns Token selection with reasoning
     */
    selectToken(request: TokenRequest, options?: TokenSelectionOptions): TokenSelection;
    /**
     * Try to select a semantic token (first priority)
     *
     * @param request - Token request
     * @param options - Selection options
     * @returns Semantic token and reasoning, or null if not found
     */
    private trySemanticToken;
    /**
     * Try to select a primitive token (second priority)
     *
     * @param request - Token request
     * @param options - Selection options
     * @returns Primitive token and reasoning, or null if not found
     */
    private tryPrimitiveToken;
    /**
     * Document reasoning for token selection
     *
     * @param selection - Token selection result
     * @returns Detailed reasoning documentation
     */
    documentSelection(selection: TokenSelection): string;
    /**
     * Map request category to semantic category
     */
    private mapToSemanticCategory;
    /**
     * Map request category to token category
     */
    private mapToTokenCategory;
    /**
     * Find semantic token by context matching
     */
    private findSemanticTokenByContext;
    /**
     * Find primitive token by context matching
     */
    private findPrimitiveTokenByContext;
}
//# sourceMappingURL=TokenSelector.d.ts.map