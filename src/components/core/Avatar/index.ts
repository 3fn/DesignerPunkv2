/**
 * Avatar Component Exports
 * 
 * @see .kiro/specs/042-avatar-component/design.md for component details
 * @see .kiro/specs/042-avatar-component/requirements.md for requirements
 */

// Type exports
export type { AvatarProps, AvatarType, AvatarSize } from './types';
export { AVATAR_DEFAULTS } from './types';

// Token exports
export {
  AvatarTokens,
  getAvatarSize,
  getAvatarIconSize,
  getAvatarSizeTokenReference,
  getAvatarIconSizeTokenReference,
  AvatarSizeTokenReferences,
  AvatarIconSizeTokenReferences,
} from './avatar.tokens';
export type { AvatarSizeVariant, AvatarIconSizeVariant } from './avatar.tokens';

// Web component export
export { AvatarBaseElement } from './platforms/web/Avatar.web';
