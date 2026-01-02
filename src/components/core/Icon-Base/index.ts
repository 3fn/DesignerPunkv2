/**
 * Icon-Base Component Index
 * 
 * Stemma System: Icons Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type] = Icon-Base
 * 
 * Re-exports all Icon-Base component types and implementations.
 * 
 * @module Icon-Base
 */

// Export types
export {
  IconBaseName,
  IconBaseSize,
  IconBaseProps,
  iconBaseSizes,
  // Legacy aliases for backward compatibility
  IconName,
  IconSize,
  IconProps,
  iconSizes
} from './types';

// Export web implementation
export {
  IconBaseElement,
  IconBase,
  createIconBase,
  // Legacy aliases for backward compatibility
  createIcon,
  Icon
} from './platforms/web/IconBase.web';
