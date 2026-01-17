/**
 * @category evergreen
 * @purpose Verify Avatar component integrates correctly with Icon-Base component
 * @jest-environment jsdom
 */
/**
 * Avatar Icon Integration Tests
 * 
 * Stemma System: Avatar Family
 * Component Type: Primitive (Base)
 * 
 * Tests icon integration with the Icon-Base component (Stemma System).
 * Validates icon rendering, sizing, color, and correct icon selection per avatar type.
 * 
 * Avatar uses the createIconBase functional API for icon rendering within Shadow DOM.
 * For xs and xxl sizes, Avatar uses inline SVG with CSS custom properties since
 * there's no IconBaseSize equivalent for 12px and 64px.
 * 
 * Icon Size Mapping (50% ratio with avatar size):
 * - xs (24px avatar) → 12px icon (avatar.icon.size.xs component token)
 * - sm (32px avatar) → 16px icon (icon.size050, IconBaseSize 13)
 * - md (40px avatar) → 20px icon (icon.size075, IconBaseSize 18)
 * - lg (48px avatar) → 24px icon (icon.size100, IconBaseSize 24)
 * - xl (80px avatar) → 40px icon (icon.size500, IconBaseSize 40)
 * - xxl (128px avatar) → 64px icon (avatar.icon.size.xxl component token)
 * 
 * @module Avatar/__tests__
 * @see Requirements: 3.1-3.8, 6.1, 6.2, 15.1, 15.2 in .kiro/specs/042-avatar-component/requirements.md
 */

import { AvatarBaseElement } from '../platforms/web/Avatar.web';
import { IconBaseElement } from '../../Icon-Base/platforms/web/IconBase.web';
import { AvatarSize } from '../types';

describe('Avatar Icon Integration', () => {
  beforeAll(() => {
    // Ensure custom elements are registered
    if (!customElements.get('avatar-base')) {
      customElements.define('avatar-base', AvatarBaseElement);
    }
    if (!customElements.get('icon-base')) {
      customElements.define('icon-base', IconBaseElement);
    }
  });

  beforeEach(async () => {
    // Wait for custom elements to be defined
    await customElements.whenDefined('avatar-base');
    await customElements.whenDefined('icon-base');
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
  });

  // ============================================================================
  // Icon Rendering
  // ============================================================================

  describe('Icon Rendering', () => {
    /**
     * @see Requirements: 3.7 - Human type without image displays generic person icon placeholder
     */
    it('should render icon for human type without image', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      expect(iconContainer).toBeTruthy();
    });

    /**
     * @see Requirements: 3.8 - Agent type displays generic bot/AI icon placeholder
     */
    it('should render icon for agent type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      expect(iconContainer).toBeTruthy();
    });

    it('should not render icon when human type has image src', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'User profile';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      // Should render image instead of icon
      const image = avatar.shadowRoot?.querySelector('.avatar__image');
      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      
      expect(image).toBeTruthy();
      expect(iconContainer).toBeFalsy();
    });
  });

  // ============================================================================
  // Icon Type Selection
  // ============================================================================

  describe('Icon Type Selection', () => {
    /**
     * @see Requirements: 3.7 - Human type displays generic person icon placeholder
     * @see Requirements: 15.1, 15.2 - Icon component integration
     */
    it('should render user icon for human type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      expect(iconContainer).toBeTruthy();
      
      // Check for user icon SVG content (person silhouette path)
      const svg = iconContainer?.querySelector('svg');
      expect(svg).toBeTruthy();
      
      // User icon has a path with "M20 21v-2" (body) and circle for head
      const svgContent = svg?.innerHTML || '';
      expect(svgContent).toContain('path');
      expect(svgContent).toContain('circle');
    });

    /**
     * @see Requirements: 3.8 - Agent type displays generic bot/AI icon placeholder
     * @see Requirements: 15.1, 15.2 - Icon component integration
     */
    it('should render settings icon for agent type (placeholder for bot/AI)', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      expect(iconContainer).toBeTruthy();
      
      // Check for settings icon SVG content (gear/cog shape)
      const svg = iconContainer?.querySelector('svg');
      expect(svg).toBeTruthy();
      
      // Settings icon has a circle (center) and path (gear teeth)
      const svgContent = svg?.innerHTML || '';
      expect(svgContent).toContain('circle');
      expect(svgContent).toContain('path');
    });

    it('should use different icons for human and agent types', async () => {
      const humanAvatar = document.createElement('avatar-base') as AvatarBaseElement;
      humanAvatar.type = 'human';
      document.body.appendChild(humanAvatar);

      const agentAvatar = document.createElement('avatar-base') as AvatarBaseElement;
      agentAvatar.type = 'agent';
      document.body.appendChild(agentAvatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const humanSvg = humanAvatar.shadowRoot?.querySelector('.avatar__icon svg');
      const agentSvg = agentAvatar.shadowRoot?.querySelector('.avatar__icon svg');

      expect(humanSvg).toBeTruthy();
      expect(agentSvg).toBeTruthy();
      
      // SVG content should be different
      expect(humanSvg?.innerHTML).not.toBe(agentSvg?.innerHTML);
    });
  });

  // ============================================================================
  // Icon Color per Avatar Type
  // ============================================================================

  describe('Icon Color per Avatar Type', () => {
    /**
     * @see Requirements: 6.1 - Human type icon uses color.avatar.contrast.onHuman semantic token
     */
    it('should apply human icon color class for human type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      expect(iconContainer?.classList.contains('avatar__icon--human')).toBe(true);
      expect(iconContainer?.classList.contains('avatar__icon--agent')).toBe(false);
    });

    /**
     * @see Requirements: 6.2 - Agent type icon uses color.avatar.contrast.onAgent semantic token
     */
    it('should apply agent icon color class for agent type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      expect(iconContainer?.classList.contains('avatar__icon--agent')).toBe(true);
      expect(iconContainer?.classList.contains('avatar__icon--human')).toBe(false);
    });

    it('should update icon color class when type changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      let iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      expect(iconContainer?.classList.contains('avatar__icon--human')).toBe(true);

      // Change type to agent
      avatar.type = 'agent';

      await new Promise(resolve => setTimeout(resolve, 0));

      iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      expect(iconContainer?.classList.contains('avatar__icon--agent')).toBe(true);
      expect(iconContainer?.classList.contains('avatar__icon--human')).toBe(false);
    });
  });

  // ============================================================================
  // Icon Size per Avatar Size
  // ============================================================================

  describe('Icon Size per Avatar Size', () => {
    /**
     * Icon size mapping tests verify the 50% ratio between avatar and icon sizes.
     * 
     * For standard sizes (sm, md, lg, xl), Avatar uses createIconBase with IconBaseSize.
     * For xs and xxl sizes, Avatar uses inline SVG with CSS custom properties.
     * 
     * @see Requirements: 3.1-3.6 - Icon sizes per avatar size
     */

    /**
     * @see Requirements: 3.1 - xs avatar uses avatar.icon.size.xs component token (12px)
     */
    it('should use xs icon size for xs avatar (CSS custom property)', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'xs';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon') as HTMLElement;
      expect(iconContainer).toBeTruthy();
      
      // xs size uses CSS custom property var(--avatar-icon-size-xs)
      const style = iconContainer?.getAttribute('style') || '';
      expect(style).toContain('var(--avatar-icon-size-xs)');
    });

    /**
     * @see Requirements: 3.2 - sm avatar uses icon.size050 token (16px, IconBaseSize 13)
     */
    it('should use size050 icon for sm avatar', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'sm';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      const svg = iconContainer?.querySelector('svg');
      expect(svg).toBeTruthy();
      
      // sm size uses IconBaseSize 13 which maps to icon-base--size-050 class
      expect(svg?.classList.contains('icon-base--size-050')).toBe(true);
    });

    /**
     * @see Requirements: 3.3 - md avatar uses icon.size075 token (20px, IconBaseSize 18)
     */
    it('should use size075 icon for md avatar', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'md';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      const svg = iconContainer?.querySelector('svg');
      expect(svg).toBeTruthy();
      
      // md size uses IconBaseSize 18 which maps to icon-base--size-075 class
      expect(svg?.classList.contains('icon-base--size-075')).toBe(true);
    });

    /**
     * @see Requirements: 3.4 - lg avatar uses icon.size100 token (24px, IconBaseSize 24)
     */
    it('should use size100 icon for lg avatar', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'lg';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      const svg = iconContainer?.querySelector('svg');
      expect(svg).toBeTruthy();
      
      // lg size uses IconBaseSize 24 which maps to icon-base--size-100 class
      expect(svg?.classList.contains('icon-base--size-100')).toBe(true);
    });

    /**
     * @see Requirements: 3.5 - xl avatar uses icon.size500 token (40px, IconBaseSize 40)
     */
    it('should use size500 icon for xl avatar', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'xl';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
      const svg = iconContainer?.querySelector('svg');
      expect(svg).toBeTruthy();
      
      // xl size uses IconBaseSize 40 which maps to icon-base--size-500 class
      expect(svg?.classList.contains('icon-base--size-500')).toBe(true);
    });

    /**
     * @see Requirements: 3.6 - xxl avatar uses avatar.icon.size.xxl component token (64px)
     */
    it('should use xxl icon size for xxl avatar (CSS custom property)', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'xxl';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon') as HTMLElement;
      expect(iconContainer).toBeTruthy();
      
      // xxl size uses CSS custom property var(--avatar-icon-size-xxl)
      const style = iconContainer?.getAttribute('style') || '';
      expect(style).toContain('var(--avatar-icon-size-xxl)');
    });
  });

  // ============================================================================
  // Icon Size with Agent Type
  // ============================================================================

  describe('Icon Size with Agent Type', () => {
    /**
     * Verify icon sizing works correctly for agent type across all sizes.
     * Agent type should use the same icon size mapping as human type.
     */

    const standardSizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl'];
    const expectedSizeClasses: Record<string, string> = {
      sm: 'icon-base--size-050',
      md: 'icon-base--size-075',
      lg: 'icon-base--size-100',
      xl: 'icon-base--size-500',
    };

    standardSizes.forEach(size => {
      it(`should use correct icon size for agent type with ${size} size`, async () => {
        const avatar = document.createElement('avatar-base') as AvatarBaseElement;
        avatar.type = 'agent';
        avatar.size = size;
        document.body.appendChild(avatar);

        await new Promise(resolve => setTimeout(resolve, 0));

        const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon');
        const svg = iconContainer?.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.classList.contains(expectedSizeClasses[size])).toBe(true);
      });
    });

    it('should use xs icon size for agent type with xs size', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.size = 'xs';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon') as HTMLElement;
      const style = iconContainer?.getAttribute('style') || '';
      expect(style).toContain('var(--avatar-icon-size-xs)');
    });

    it('should use xxl icon size for agent type with xxl size', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.size = 'xxl';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon') as HTMLElement;
      const style = iconContainer?.getAttribute('style') || '';
      expect(style).toContain('var(--avatar-icon-size-xxl)');
    });
  });

  // ============================================================================
  // Icon SVG Structure
  // ============================================================================

  describe('Icon SVG Structure', () => {
    /**
     * Verify SVG structure follows Icon-Base component patterns.
     */

    it('should render SVG with correct viewBox', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    });

    it('should render SVG with fill="none"', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.getAttribute('fill')).toBe('none');
    });

    it('should render SVG with stroke="currentColor" for color inheritance', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');
    });

    it('should render SVG with aria-hidden="true" for accessibility', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should render SVG with stroke-linecap="round"', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.getAttribute('stroke-linecap')).toBe('round');
    });

    it('should render SVG with stroke-linejoin="round"', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.getAttribute('stroke-linejoin')).toBe('round');
    });
  });

  // ============================================================================
  // Icon Integration with createIconBase
  // ============================================================================

  describe('Icon Integration with createIconBase', () => {
    /**
     * Verify Avatar uses createIconBase functional API for standard sizes.
     * This is contract testing - we verify the output matches expected patterns
     * without testing the internal implementation.
     * 
     * @see Requirements: 15.1, 15.2 - Icon component integration
     */

    it('should render icon with icon-base class for standard sizes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'md';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.classList.contains('icon-base')).toBe(true);
    });

    it('should render icon with icon-base-user class for human type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'md';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.classList.contains('icon-base-user')).toBe(true);
    });

    it('should render icon with icon-base-settings class for agent type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.size = 'md';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      const svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.classList.contains('icon-base-settings')).toBe(true);
    });
  });

  // ============================================================================
  // Icon Update on Type Change
  // ============================================================================

  describe('Icon Update on Type Change', () => {
    it('should update icon when type changes from human to agent', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'md';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      let svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.classList.contains('icon-base-user')).toBe(true);

      // Change type
      avatar.type = 'agent';

      await new Promise(resolve => setTimeout(resolve, 0));

      svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.classList.contains('icon-base-settings')).toBe(true);
      expect(svg?.classList.contains('icon-base-user')).toBe(false);
    });

    it('should update icon when type changes from agent to human', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.size = 'md';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      let svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.classList.contains('icon-base-settings')).toBe(true);

      // Change type
      avatar.type = 'human';

      await new Promise(resolve => setTimeout(resolve, 0));

      svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.classList.contains('icon-base-user')).toBe(true);
      expect(svg?.classList.contains('icon-base-settings')).toBe(false);
    });
  });

  // ============================================================================
  // Icon Update on Size Change
  // ============================================================================

  describe('Icon Update on Size Change', () => {
    it('should update icon size class when size changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'sm';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      let svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.classList.contains('icon-base--size-050')).toBe(true);

      // Change size
      avatar.size = 'lg';

      await new Promise(resolve => setTimeout(resolve, 0));

      svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.classList.contains('icon-base--size-100')).toBe(true);
      expect(svg?.classList.contains('icon-base--size-050')).toBe(false);
    });

    it('should switch from standard size to CSS custom property size', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'md';
      document.body.appendChild(avatar);

      await new Promise(resolve => setTimeout(resolve, 0));

      let svg = avatar.shadowRoot?.querySelector('.avatar__icon svg');
      expect(svg?.classList.contains('icon-base--size-075')).toBe(true);

      // Change to xxl (uses CSS custom property)
      avatar.size = 'xxl';

      await new Promise(resolve => setTimeout(resolve, 0));

      const iconContainer = avatar.shadowRoot?.querySelector('.avatar__icon') as HTMLElement;
      const style = iconContainer?.getAttribute('style') || '';
      expect(style).toContain('var(--avatar-icon-size-xxl)');
    });
  });
});
