"use strict";
/**
 * Semantic Token Interface and Semantic Category Enum
 *
 * Defines semantic tokens that provide contextual meaning while referencing
 * primitive tokens to maintain mathematical consistency. Semantic tokens
 * represent higher-level abstractions for specific design contexts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticCategory = void 0;
/**
 * Semantic categories for contextual token organization
 */
var SemanticCategory;
(function (SemanticCategory) {
    SemanticCategory["COLOR"] = "color";
    SemanticCategory["SPACING"] = "spacing";
    SemanticCategory["TYPOGRAPHY"] = "typography";
    SemanticCategory["BORDER"] = "border";
    SemanticCategory["SHADOW"] = "shadow";
    SemanticCategory["LAYOUT"] = "layout";
    SemanticCategory["LAYERING"] = "layering";
    SemanticCategory["INTERACTION"] = "interaction";
})(SemanticCategory || (exports.SemanticCategory = SemanticCategory = {}));
//# sourceMappingURL=SemanticToken.js.map